# GCP Infrastructure Setup Guide (Full Setup & Quick Script)

This guide provides complete **PowerShell** documentation on configuring Google Cloud Platform (GCP) infrastructure for the Portfolio monorepo from a fresh GCP project to a live **GKE Autopilot** deployment.

---

## ⚡ Quick Start: Spin Up Cluster & Application via Script

If your GCP project, IAM service account, and Artifact Registry repository have already been initialized, you can spin up the GKE Autopilot cluster, reserve the static IP, and deploy the application with a single command:

```powershell
.\deployment\setup.ps1
```

---

## 📖 Complete Setup Guide (From Scratch)

### 1. Authenticate with Google Cloud

Authenticate your `gcloud` CLI tool with your Google account:

```powershell
# Log in to your GCP user account (opens browser for SSO)
gcloud auth login

# Configure Docker authentication helper for Artifact Registry
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

---

### 2. Environment Variables & Project Defaults

Set your configuration variables and set the default GCP project and region:

```powershell
$PROJECT_ID = "portfolio-503914"
$REGION = "europe-north1"
$CLUSTER_NAME = "portfolio-cluster"
$REPO_NAME = "portfolio"
$STATIC_IP_NAME = "portfolio-ip"

# Configure gcloud defaults
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

---

### 3. Enable Required GCP APIs

Enable the necessary Google Cloud services for Kubernetes, Container Registry, Cloud Build, IAM, and Compute Engine:

```powershell
gcloud services enable `
    container.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    iam.googleapis.com `
    compute.googleapis.com
```

---

### 4. Create GCP Artifact Registry Repository

Create a Docker repository in Artifact Registry to host backend and frontend container images:

```powershell
gcloud artifacts repositories create $REPO_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="Docker repository for Portfolio Monorepo microservices"
```

---

### 5. Create Dedicated Service Account & Grant IAM Permissions

Create a dedicated IAM Service Account **`portfolio-deployer`** and grant minimal required permissions for GKE and Artifact Registry:

```powershell
# 1. Create dedicated IAM Service Account
gcloud iam service-accounts create portfolio-deployer `
    --display-name="Portfolio CI/CD Deployer"

# 2. Grant Artifact Registry Writer role
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:portfolio-deployer@${PROJECT_ID}.iam.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"

# 3. Grant GKE Developer role (for helm upgrade)
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:portfolio-deployer@${PROJECT_ID}.iam.gserviceaccount.com" `
    --role="roles/container.developer"

# 4. Grant Cloud Build Builder role
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:portfolio-deployer@${PROJECT_ID}.iam.gserviceaccount.com" `
    --role="roles/cloudbuild.builds.builder"

# 5. Allow Cloud Build service agent to act as portfolio-deployer
$PROJECT_NUMBER = (gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
gcloud iam service-accounts add-iam-policy-binding "portfolio-deployer@${PROJECT_ID}.iam.gserviceaccount.com" `
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" `
    --role="roles/iam.serviceAccountUser"
```

---

### 6. Create Cloud Build Trigger in GCP Console

Set up a 2nd Gen GitHub Connection trigger in GCP Console:

1. Go to **[GCP Console -> Cloud Build -> Triggers](https://console.cloud.google.com/cloud-build/triggers?project=portfolio-503914)**.
2. Click **Create Trigger** (Stwórz wyzwalacz).
3. Set the following options:
   - **Name**: `portfolio-main-trigger`
   - **Event**: `Push to a branch`
   - **Repository**: `unatco1994p-afk/portfolio`
   - **Branch**: `^main$`
   - **Configuration**: **Cloud Build configuration file (yaml or json)**
   - **File location**: `cloudbuild.yaml`
4. Click **Create**.

---

### 7. Create GKE Autopilot Cluster & Reserve Static IP

Create the GKE Autopilot cluster and reserve global static IP:

```powershell
# Create GKE Autopilot cluster
gcloud container clusters create-auto $CLUSTER_NAME --location=$REGION

# Fetch cluster credentials for kubectl
gcloud container clusters get-credentials $CLUSTER_NAME --location=$REGION

# Reserve global static IP address
gcloud compute addresses create $STATIC_IP_NAME --global
gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)"
```
> **DNS Configuration**: Update your domain DNS A Record to point `portfolio.tomasz0zwierzynski.pl` to the assigned static IP.

---

### 8. Manual Local Deployment via Helm (Optional Testing)

```powershell
helm upgrade --install portfolio ./deployment/helm/portfolio-chart `
    --set global.domain="portfolio.tomasz0zwierzynski.pl" `
    --set backend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-backend" `
    --set backend.image.tag="1.0.0" `
    --set frontend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-frontend" `
    --set frontend.image.tag="1.0.0"
```

---

## 🗑️ Cost Teardown & Stopping Billing

To temporarily stop billing when not showcasing your portfolio, see [gcp-teardown.md](file:///c:/Users/Partial%20Derivative/Documents/projects/portfolio/deployment/gcp-teardown.md).
