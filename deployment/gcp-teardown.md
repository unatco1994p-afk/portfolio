# GCP Infrastructure Teardown & Cost Cleanup Guide

This guide provides step-by-step documentation and **PowerShell** commands to safely delete GCP resources, stop recurring costs, or perform a complete project cleanup.

---

## ⚡ Quick Cost Reduction: Teardown Cluster & IP via Script

To immediately stop daily billing (~4–5 PLN/day) while **preserving Artifact Registry Docker images, IAM roles, and Cloud Build triggers** for fast restarts:

```powershell
.\deployment\teardown.ps1
```

*(Deletes GKE Autopilot Cluster & Global Static IP -> 0 PLN daily costs)*

---

## 📖 Step-by-Step Teardown Documentation

### 1. Environment Variables & Targets

Set your configuration variables:

```powershell
$PROJECT_ID = "portfolio-503914"
$REGION = "europe-north1"
$CLUSTER_NAME = "portfolio-cluster"
$REPO_NAME = "portfolio"
$STATIC_IP_NAME = "portfolio-ip"

# Set default gcloud project and region
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

---

### 2. Stop Daily Cost Drivers (Delete GKE & IP)

#### Step 2a: Uninstall Helm Release & Microservices
```powershell
gcloud container clusters get-credentials $CLUSTER_NAME --location=$REGION
helm uninstall portfolio
```

#### Step 2b: Delete GKE Autopilot Cluster (Main Cost Driver)
```powershell
gcloud container clusters delete $CLUSTER_NAME `
    --location=$REGION `
    --quiet
```

#### Step 2c: Release Global Static IP Address
```powershell
gcloud compute addresses delete $STATIC_IP_NAME `
    --global `
    --quiet
```

---

### 3. Optional: Delete Stored Docker Images (Artifact Registry)

If you wish to remove stored Docker container images from GCP Artifact Registry:

```powershell
gcloud artifacts repositories delete $REPO_NAME `
    --location=$REGION `
    --quiet
```

---

### 4. Optional: Delete IAM Service Account & Cloud Build Triggers

Delete the dedicated CI/CD Service Account:

```powershell
gcloud iam service-accounts delete "portfolio-deployer@${PROJECT_ID}.iam.gserviceaccount.com" `
    --quiet
```

---

### 5. Nuclear Option: Delete Entire GCP Project (100% $0 Guarantee)

To permanently delete the entire GCP project and all associated data/settings:

```powershell
gcloud projects delete $PROJECT_ID --quiet
```

---

## 🔄 Re-enabling Portfolio in the Future

When you are ready to launch your portfolio again:
1. Run `.\deployment\setup.ps1` to re-create the cluster and static IP.
2. Update your domain DNS A Record to point to the newly assigned Static IP address.
3. Your application will automatically deploy from the latest images!
