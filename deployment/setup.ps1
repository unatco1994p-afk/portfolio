# Quick Start: Provision GKE Cluster & Static IP, then launch Cloud Build deployment
param(
    [string]$PROJECT_ID = "portfolio-503914",
    [string]$REGION = "europe-north1",
    [string]$CLUSTER_NAME = "portfolio-cluster",
    [string]$STATIC_IP_NAME = "portfolio-ip"
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Launching GKE Cluster & App Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Config set
Write-Host "[1/4] Setting gcloud project ($PROJECT_ID) and region ($REGION)..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID | Out-Null
gcloud config set compute/region $REGION | Out-Null

# 2. Create GKE Autopilot Cluster
Write-Host "[2/4] Ensuring GKE Autopilot Cluster exists..." -ForegroundColor Yellow
$clusterExists = gcloud container clusters list --region=$REGION --filter="name=$CLUSTER_NAME" --format="value(name)" 2>$null
if (-not $clusterExists) {
    Write-Host "  Creating GKE Autopilot Cluster '$CLUSTER_NAME' in $REGION (~4-5 mins)..." -ForegroundColor Cyan
    gcloud container clusters create-auto $CLUSTER_NAME --location=$REGION
} else {
    Write-Host "  Cluster '$CLUSTER_NAME' is active." -ForegroundColor Gray
}

Write-Host "  Fetching kubectl credentials..." -ForegroundColor Yellow
gcloud container clusters get-credentials $CLUSTER_NAME --location=$REGION

# 3. Reserve Global Static IP
Write-Host "[3/4] Ensuring Global Static IP '$STATIC_IP_NAME' is reserved..." -ForegroundColor Yellow
$ipExists = gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)" 2>$null
if (-not $ipExists) {
    gcloud compute addresses create $STATIC_IP_NAME --global
}
$STATIC_IP = gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)"
Write-Host "  Static IP Address: $STATIC_IP" -ForegroundColor Green

# 4. Trigger Cloud Build Deployment
Write-Host "[4/4] Triggering Cloud Build deployment pipeline..." -ForegroundColor Yellow
try {
    $triggerExists = gcloud builds triggers list --filter="name=portfolio-main-trigger" --format="value(name)" 2>$null
    if ($triggerExists) {
        gcloud builds triggers run portfolio-main-trigger --branch=main --quiet
        Write-Host "  Cloud Build pipeline launched! Latest images will deploy to GKE." -ForegroundColor Green
    } else {
        Write-Host "  Cloud Build trigger 'portfolio-main-trigger' not found (run build manually or push to main)." -ForegroundColor Gray
    }
} catch {
    Write-Host "  Could not auto-launch Cloud Build trigger (push a commit to main to deploy)." -ForegroundColor Gray
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Cluster & Application Provisioned!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Static IP for DNS A Record: $STATIC_IP" -ForegroundColor Yellow
