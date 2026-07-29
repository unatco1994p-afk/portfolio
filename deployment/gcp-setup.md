# GCP Infrastructure & Deployment Guide (PowerShell)

This guide provides step-by-step **PowerShell** commands to set up Google Cloud Platform (GCP) infrastructure for the Portfolio monorepo, configure **GKE Autopilot**, set up **Artifact Registry**, reserve a **Static IP**, grant IAM permissions to **Cloud Build**, and connect **GitHub to GCP Cloud Build Triggers**.

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

Enable the necessary Google Cloud services for Kubernetes, Container Registry, Cloud Build, and Compute Engine:

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
> **Note**: Update your domain DNS records (A Record) to point `portfolio.tomasz0zwierzynski.pl` to this assigned static IP (`8.233.156.61`).

---

## 7. Grant Cloud Build IAM Permissions for GKE & Artifact Registry

Since Cloud Build runs natively inside GCP under its Service Account, grant it the required roles to push Docker images to Artifact Registry and deploy Helm releases to GKE:

```powershell
# Get Project Number
$PROJECT_NUMBER = (gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# Grant Artifact Registry Writer role
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"

# Grant GKE Developer role (for helm upgrade)
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" `
    --role="roles/container.developer"
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
    --set global.domain="portfolio.tomasz0zwierzynski.pl" `
    --set backend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-backend" `
    --set backend.image.tag="1.0.0" `
    --set frontend.image.repository="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio-frontend" `
    --set frontend.image.tag="1.0.0"
```
