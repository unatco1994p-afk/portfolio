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

## 7. Create Dedicated Service Account & Grant IAM Permissions

To follow security best practices (Least Privilege Principle), create a dedicated Service Account **`portfolio-deployer`** and grant it only the minimal required permissions for GKE and Artifact Registry:

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

## 8. Create Cloud Build Trigger in GCP Console

Since Cloud Build uses modern 2nd Gen GitHub Connections, the fastest and most reliable way to create the trigger is directly from the GCP Console (takes 10 seconds):

1. Go to **[Google Cloud Console -> Cloud Build -> Triggers](https://console.cloud.google.com/cloud-build/triggers?project=portfolio-503914)**.
2. Click **Create Trigger** (Stwórz wyzwalacz) at the top of the page.
3. Fill in the following fields:
   - **Name**: `portfolio-main-trigger`
   - **Event**: `Push to a branch`
   - **Repository**: Select `unatco1994p-afk/portfolio`
   - **Branch**: `^main$`
   - **Configuration**: Select **Cloud Build configuration file (yaml or json)**
   - **Location**: Repository
   - **Cloud Build configuration file location**: `cloudbuild.yaml`
4. Click **Create** (Stwórz).

---

## 9. Run First Build & Deploy

Once the trigger is created, you can trigger it automatically by pushing code to GitHub:

```bash
git push -u origin main
```

Or click **Run** (Uruchom) on the trigger row in GCP Cloud Build Console!

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
