# Quick Teardown: Remove GKE Cluster & Static IP to stop daily costs (preserves Artifact Registry & IAM)
param(
    [string]$PROJECT_ID = "portfolio-503914",
    [string]$REGION = "europe-north1",
    [string]$CLUSTER_NAME = "portfolio-cluster",
    [string]$STATIC_IP_NAME = "portfolio-ip"
)

Write-Host "=========================================" -ForegroundColor Red
Write-Host "Stopping GKE Cluster & IP (Cost Teardown)" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Red

gcloud config set project $PROJECT_ID | Out-Null
gcloud config set compute/region $REGION | Out-Null

# 1. Uninstall Helm release
Write-Host "[1/3] Uninstalling Helm release..." -ForegroundColor Yellow
try {
    $helmExists = helm list -q 2>$null | Select-String "portfolio"
    if ($helmExists) {
        helm uninstall portfolio
        Write-Host "  Helm release 'portfolio' uninstalled." -ForegroundColor Green
    } else {
        Write-Host "  Helm release 'portfolio' not found or already uninstalled." -ForegroundColor Gray
    }
} catch {
    Write-Host "  Skipping Helm uninstall (cluster unreachable or release deleted)." -ForegroundColor Gray
}

# 2. Delete GKE Cluster (Stops major cost driver)
Write-Host "[2/3] Deleting GKE Autopilot cluster '$CLUSTER_NAME'..." -ForegroundColor Yellow
$clusterExists = gcloud container clusters list --region=$REGION --filter="name=$CLUSTER_NAME" --format="value(name)" 2>$null
if ($clusterExists) {
    gcloud container clusters delete $CLUSTER_NAME --location=$REGION --quiet
    Write-Host "  Cluster '$CLUSTER_NAME' deleted." -ForegroundColor Green
} else {
    Write-Host "  Cluster '$CLUSTER_NAME' not found." -ForegroundColor Gray
}

# 3. Delete Global Static IP (Stops IP reservation cost driver)
Write-Host "[3/3] Releasing Static IP '$STATIC_IP_NAME'..." -ForegroundColor Yellow
$ipExists = gcloud compute addresses describe $STATIC_IP_NAME --global --format="value(address)" 2>$null
if ($ipExists) {
    gcloud compute addresses delete $STATIC_IP_NAME --global --quiet
    Write-Host "  Static IP '$STATIC_IP_NAME' released." -ForegroundColor Green
} else {
    Write-Host "  Static IP '$STATIC_IP_NAME' not found." -ForegroundColor Gray
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Cost Teardown Complete! GCP billing stopped." -ForegroundColor Green
Write-Host "Artifact Registry images & Cloud Build triggers preserved for quick setup.ps1 restart." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
