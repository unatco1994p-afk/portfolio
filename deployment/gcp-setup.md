# GCP Infrastructure & Deployment Guide

This guide provides all the exact `gcloud` CLI commands required to set up Google Cloud Platform (GCP) infrastructure for the Portfolio monorepo, configure **GKE (Google Kubernetes Engine)**, set up **Artifact Registry**, reserve a **Static IP**, and connect **GitHub to GCP Cloud Build** using **Workload Identity Federation**.

---

## 1. Authenticate with Google Cloud (Browser Login)

Before running any infrastructure commands, authenticate your `gcloud` CLI tool with your Google account via browser login:

```bash
# 1. Log in to your GCP user account (opens browser for Google SSO)
gcloud auth login

# 2. Configure Docker authentication helper for Artifact Registry (in your region)
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

---

## 2. Environment Setup & Variables

Set your target Google Cloud Project ID and desired configuration variables in your shell (PowerShell or Bash):

### Bash / Linux / macOS:
```bash
# Set configuration variables
export PROJECT_ID="portfolio-503914"
export REGION="europe-north1"
export CLUSTER_NAME="portfolio-cluster"
export REPO_NAME="portfolio"
export STATIC_IP_NAME="portfolio-ip"
export GITHUB_REPO="unatco1994p-afk/portfolio"

# Configure gcloud defaults
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

### PowerShell / Windows:
```powershell
# Set configuration variables
$PROJECT_ID="portfolio-503914"
$REGION="europe-north1"
$CLUSTER_NAME="portfolio-cluster"
$REPO_NAME="portfolio"
$STATIC_IP_NAME="portfolio-ip"
$GITHUB_REPO="unatco1994p-afk/portfolio"

# Configure gcloud defaults
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

---

## 2. Enable Required GCP APIs

Enable Google Cloud APIs for Kubernetes, Container Registry, Cloud Build, and Identity Management:

```bash
gcloud services enable \
    container.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    iam.googleapis.com \
    compute.googleapis.com
```

---

## 3. Create GCP Artifact Registry Repository

Create a Docker repository in Artifact Registry to host backend and frontend container images:

```bash
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Portfolio Monorepo microservices"
```

Verify repository creation:
```bash
gcloud artifacts repositories list --location=$REGION
```

---

## 4. Create GKE Cluster (Autopilot or Standard)

### Option A: GKE Autopilot (Recommended - Zero Cluster Admin Overhead)
```bash
gcloud container clusters create-auto $CLUSTER_NAME \
    --location=$REGION
```

### Option B: GKE Standard with Spot Nodes (Cost-optimized)
```bash
gcloud container clusters create $CLUSTER_NAME \
    --region=$REGION \
    --num-nodes=1 \
    --machine-type=e2-medium \
    --spot
```

Connect `kubectl` to your cluster:
```bash
gcloud container clusters get-credentials $CLUSTER_NAME --location=$REGION
```

---

## 5. Reserve Global Static IP Address

Reserve an external static IPv4 address for GCP GCE Ingress:

```bash
gcloud compute addresses create $STATIC_IP_NAME --global
```

Retrieve the reserved IP address:
```bash
gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)"
```
> **Note**: Update your domain DNS records (A Record) to point `portfolio.example.com` to this static IP.

---

## 6. Configure Workload Identity Federation (GitHub <-> GCP IAM)

Workload Identity Federation allows GitHub / Cloud Build to authenticate securely with GCP without using long-lived service account JSON keys.

### Step 6.1: Create Workload Identity Pool & Provider
```bash
# Create Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
    --location="global" \
    --display-name="GitHub Actions & Build Pool"

# Get Pool ID
export POOL_ID=$(gcloud iam workload-identity-pools describe "github-pool" --location="global" --format="value(name)")

# Add GitHub OIDC Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
    --location="global" \
    --workload-identity-pool="github-pool" \
    --display-name="GitHub Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"
```

### Step 6.2: Create Service Account for CI/CD & Grant Roles
```bash
# Create IAM Service Account
gcloud iam service-accounts create portfolio-deployer \
    --display-name="Portfolio CI/CD Deployer"

# Grant required permissions to the Service Account
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.editor"

# Allow GitHub repository to impersonate the Service Account
gcloud iam service-accounts add-iam-policy-binding portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_REPO}"
```

---

## 7. Connect GitHub to GCP Cloud Build Trigger

Link your GitHub repository to GCP Cloud Build to trigger automated deployments on push to `main`:

```bash
gcloud builds triggers create github \
    --name="portfolio-main-trigger" \
    --repo-name="portfolio" \
    --repo-owner="your-github-username" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild.yaml"
```

---

## 8. Manual Local Deployment via Helm (Optional Testing)

If you want to test deploying to GKE manually from your local terminal:

```bash
helm upgrade --install portfolio ./deployment/helm/portfolio-chart \
    --set global.domain="portfolio.example.com" \
    --set backend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-backend" \
    --set backend.image.tag="latest" \
    --set frontend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-frontend" \
    --set frontend.image.tag="latest"
```

Check deployment status on cluster:
```bash
kubectl get pods
kubectl get ingress
kubectl get managedcertificate
```
