# GCP Infrastructure & Deployment Guide (PowerShell)

This guide provides step-by-step **PowerShell** commands to set up Google Cloud Platform (GCP) infrastructure for the Portfolio monorepo, configure **GKE Autopilot**, set up **Artifact Registry**, reserve a **Static IP**, and connect **GitHub to GCP Cloud Build** using **Workload Identity Federation**.

---

## 1. Authenticate with Google Cloud

Authenticate your `gcloud` CLI tool with your Google account via browser SSO:

```powershell
# 1. Log in to your GCP user account (opens web browser for SSO)
gcloud auth login

# 2. Configure Docker authentication helper for Artifact Registry
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

---

## 2. Environment Variables & Project Defaults

Set your configuration variables and set the default GCP project and region:

```powershell
$PROJECT_ID = "portfolio-503914"
$REGION = "europe-north1"
$CLUSTER_NAME = "portfolio-cluster"
$REPO_NAME = "portfolio"
$STATIC_IP_NAME = "portfolio-ip"
$GITHUB_REPO = "unatco1994p-afk/portfolio"

# Configure gcloud defaults
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

---

## 3. Enable Required GCP APIs

Enable the necessary Google Cloud services for Kubernetes, Container Registry, Cloud Build, and Identity Management:

```powershell
gcloud services enable `
    container.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    iam.googleapis.com `
    compute.googleapis.com
```

---

## 4. Create GCP Artifact Registry Repository

Create a Docker repository in Artifact Registry to host backend and frontend container images:

```powershell
gcloud artifacts repositories create $REPO_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="Docker repository for Portfolio Monorepo microservices"
```

---

## 5. Create GKE Autopilot Cluster & Fetch Credentials

Create the GKE Autopilot cluster and configure `kubectl` credentials:

```powershell
# Create GKE Autopilot cluster
gcloud container clusters create-auto $CLUSTER_NAME --location=$REGION

# Fetch cluster credentials for kubectl
gcloud container clusters get-credentials $CLUSTER_NAME --location=$REGION
```

---

## 6. Reserve Global Static IP Address

Reserve an external static IPv4 address for GCP GCE Ingress:

```powershell
# Reserve global static IP address
gcloud compute addresses create $STATIC_IP_NAME --global

# Retrieve the assigned static IP address
gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)"
```
> **Note**: Update your domain DNS records (A Record) to point to this assigned static IP.

---

## 7. Configure Workload Identity Federation (GitHub <-> GCP IAM)

Workload Identity Federation allows GitHub / Cloud Build to authenticate securely with GCP without using static JSON keys.

### Step 7.1: Create Workload Identity Pool & Provider

```powershell
# Create Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" `
    --location="global" `
    --display-name="GitHub Actions & Build Pool"

# Get Pool ID into variable
$POOL_ID = (gcloud iam workload-identity-pools describe "github-pool" --location="global" --format="value(name)")

# Add GitHub OIDC Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" `
    --location="global" `
    --workload-identity-pool="github-pool" `
    --display-name="GitHub Provider" `
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" `
    --issuer-uri="https://token.actions.githubusercontent.com"
```

### Step 7.2: Create Service Account & Grant IAM Roles

```powershell
# Create IAM Service Account for CI/CD
gcloud iam service-accounts create portfolio-deployer `
    --display-name="Portfolio CI/CD Deployer"

# Grant required permissions to the Service Account
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com" `
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com" `
    --role="roles/cloudbuild.builds.editor"

# Allow GitHub repository to impersonate the Service Account
gcloud iam service-accounts add-iam-policy-binding "portfolio-deployer@$PROJECT_ID.iam.gserviceaccount.com" `
    --role="roles/iam.workloadIdentityUser" `
    --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_REPO}"
```

---

## 8. Connect GitHub Repository to GCP Cloud Build Trigger

Link your GitHub repository to GCP Cloud Build to trigger automated deployments on push to `main`:

```powershell
gcloud builds triggers create github `
    --name="portfolio-main-trigger" `
    --repo-name="portfolio" `
    --repo-owner="unatco1994p-afk" `
    --branch-pattern="^main$" `
    --build-config="cloudbuild.yaml"
```

---

## 9. Manual Local Deployment via Helm (Optional Testing)

```powershell
helm upgrade --install portfolio ./deployment/helm/portfolio-chart `
    --set global.domain="portfolio.example.com" `
    --set backend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-backend" `
    --set backend.image.tag="latest" `
    --set frontend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-frontend" `
    --set frontend.image.tag="latest"
```
