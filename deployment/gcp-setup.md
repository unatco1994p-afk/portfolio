# GCP Infrastructure & Deployment Guide

This guide provides exact, copy-pasteable commands for both **PowerShell (Windows)** and **Bash (Linux / macOS / Git Bash)** to set up Google Cloud Platform (GCP) infrastructure for the Portfolio monorepo, configure **GKE (Google Kubernetes Engine)**, set up **Artifact Registry**, reserve a **Static IP**, and connect **GitHub to GCP Cloud Build** using **Workload Identity Federation**.

---

## 1. Authentication & Prerequisites

### For Git Bash (Windows MINGW64 users only):
If you encounter a `Permission denied` error for python3 in Git Bash, run this command once to point to the bundled Cloud SDK Python:
```bash
export CLOUDSDK_PYTHON="/c/Users/Partial Derivative/AppData/Local/Google/Cloud SDK/google-cloud-sdk/platform/bundledpython/python.exe"
```

### Browser Login & Docker Auth:

#### PowerShell (Windows):
```powershell
# 1. Log in to your GCP user account (opens browser for Google SSO)
gcloud auth login

# 2. Configure Docker authentication helper for Artifact Registry
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

#### Bash (Linux / macOS / Git Bash):
```bash
# 1. Log in to your GCP user account (opens browser for Google SSO)
gcloud auth login

# 2. Configure Docker authentication helper for Artifact Registry
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

---

## 2. Environment Variables & Setup

Set your configuration variables and set the default GCP project & region:

#### PowerShell (Windows):
```powershell
$PROJECT_ID = "portfolio-503914"
$REGION = "europe-north1"
$CLUSTER_NAME = "portfolio-cluster"
$REPO_NAME = "portfolio"
$STATIC_IP_NAME = "portfolio-ip"
$GITHUB_REPO = "unatco1994p-afk/portfolio"

# Set gcloud defaults
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

#### Bash (Linux / macOS / Git Bash):
```bash
export PROJECT_ID="portfolio-503914"
export REGION="europe-north1"
export CLUSTER_NAME="portfolio-cluster"
export REPO_NAME="portfolio"
export STATIC_IP_NAME="portfolio-ip"
export GITHUB_REPO="unatco1994p-afk/portfolio"

# Set gcloud defaults
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

---

## 3. Enable Required GCP APIs

Enable the necessary Google Cloud services for Kubernetes, Container Registry, Cloud Build, and Identity Management:

#### PowerShell (Windows):
```powershell
gcloud services enable `
    container.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    iam.googleapis.com `
    compute.googleapis.com
```

#### Bash (Linux / macOS / Git Bash):
```bash
gcloud services enable \
    container.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    iam.googleapis.com \
    compute.googleapis.com
```

---

## 4. Create GCP Artifact Registry Repository

Create a Docker repository in Artifact Registry to host backend and frontend container images:

#### PowerShell (Windows):
```powershell
gcloud artifacts repositories create $REPO_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="Docker repository for Portfolio Monorepo microservices"
```

#### Bash (Linux / macOS / Git Bash):
```bash
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Portfolio Monorepo microservices"
```

---

## 5. Create GKE Cluster & Fetch Credentials

### Option A: GKE Autopilot (Recommended - Zero Admin Overhead)

#### PowerShell (Windows):
```powershell
gcloud container clusters create-auto $CLUSTER_NAME --location=$REGION
```

#### Bash (Linux / macOS / Git Bash):
```bash
gcloud container clusters create-auto $CLUSTER_NAME --location=$REGION
```

### Fetch `kubectl` Credentials:

#### PowerShell & Bash:
```bash
gcloud container clusters get-credentials $CLUSTER_NAME --location=$REGION
```

---

## 6. Reserve Global Static IP Address

Reserve an external static IPv4 address for GCP GCE Ingress:

#### PowerShell (Windows):
```powershell
gcloud compute addresses create $STATIC_IP_NAME --global
gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)"
```

#### Bash (Linux / macOS / Git Bash):
```bash
gcloud compute addresses create $STATIC_IP_NAME --global
gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)"
```

---

## 7. Configure Workload Identity Federation (GitHub <-> GCP IAM)

Workload Identity Federation allows GitHub / Cloud Build to authenticate securely with GCP without static JSON keys.

### Step 7.1: Create Workload Identity Pool & Provider

#### PowerShell (Windows):
```powershell
# Create Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" `
    --location="global" `
    --display-name="GitHub Actions & Build Pool"

# Get Pool ID
$POOL_ID = (gcloud iam workload-identity-pools describe "github-pool" --location="global" --format="value(name)")

# Add GitHub OIDC Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" `
    --location="global" `
    --workload-identity-pool="github-pool" `
    --display-name="GitHub Provider" `
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" `
    --issuer-uri="https://token.actions.githubusercontent.com"
```

#### Bash (Linux / macOS / Git Bash):
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

### Step 7.2: Create Service Account & Grant IAM Roles

#### PowerShell (Windows):
```powershell
# Create IAM Service Account
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

#### Bash (Linux / macOS / Git Bash):
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

## 8. Connect GitHub Repository to GCP Cloud Build Trigger

#### PowerShell (Windows):
```powershell
gcloud builds triggers create github `
    --name="portfolio-main-trigger" `
    --repo-name="portfolio" `
    --repo-owner="unatco1994p-afk" `
    --branch-pattern="^main$" `
    --build-config="cloudbuild.yaml"
```

#### Bash (Linux / macOS / Git Bash):
```bash
gcloud builds triggers create github \
    --name="portfolio-main-trigger" \
    --repo-name="portfolio" \
    --repo-owner="unatco1994p-afk" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild.yaml"
```

---

## 9. Manual Local Deployment via Helm (Optional Testing)

#### PowerShell (Windows):
```powershell
helm upgrade --install portfolio ./deployment/helm/portfolio-chart `
    --set global.domain="portfolio.example.com" `
    --set backend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-backend" `
    --set backend.image.tag="latest" `
    --set frontend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-frontend" `
    --set frontend.image.tag="latest"
```

#### Bash (Linux / macOS / Git Bash):
```bash
helm upgrade --install portfolio ./deployment/helm/portfolio-chart \
    --set global.domain="portfolio.example.com" \
    --set backend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-backend" \
    --set backend.image.tag="latest" \
    --set frontend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-frontend" \
    --set frontend.image.tag="latest"
```
