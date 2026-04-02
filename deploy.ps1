# ============================================================
# Script de Deploy Completo - Cars App no Kubernetes
# Autor: victorhleal
# Executar após habilitar Kubernetes no Docker Desktop
# ============================================================
#
# COMO HABILITAR O KUBERNETES NO DOCKER DESKTOP:
#   1. Abra o Docker Desktop
#   2. Clique no ícone de engrenagem (Settings)
#   3. Vá em "Kubernetes"
#   4. Marque "Enable Kubernetes"
#   5. Clique em "Apply & Restart"
#   6. Aguarde o indicador ficar verde (pode levar 2-3 min)
#   7. Execute este script: .\deploy.ps1
# ============================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Cars App - Deploy Kubernetes (victorhleal)     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verifica se kubectl está conectado ao cluster
try {
    $nodes = kubectl get nodes 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Kubernetes não está disponível. Habilite no Docker Desktop primeiro!" -ForegroundColor Red
        Write-Host "   Settings > Kubernetes > Enable Kubernetes > Apply & Restart" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Cluster Kubernetes detectado:" -ForegroundColor Green
    kubectl get nodes
} catch {
    Write-Host "❌ kubectl não encontrado ou cluster indisponível." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 [1/4] Aplicando recursos base do namespace cars-devops..." -ForegroundColor Yellow
kubectl apply -f k8s/
Write-Host ""

Write-Host "📊 [2/4] Aplicando stack de monitoramento (Prometheus + Grafana)..." -ForegroundColor Yellow
kubectl apply -f k8s/monitoring/
Write-Host ""

Write-Host "⏳ [3/4] Aguardando pods ficarem prontos (até 3 minutos)..." -ForegroundColor Yellow
kubectl rollout status deployment/cars-backend  -n cars-devops --timeout=180s
kubectl rollout status deployment/cars-frontend -n cars-devops --timeout=180s
kubectl rollout status deployment/redis         -n cars-devops --timeout=60s
kubectl rollout status deployment/prometheus    -n cars-devops --timeout=120s
kubectl rollout status deployment/grafana       -n cars-devops --timeout=120s
Write-Host ""

Write-Host "📋 [4/4] Status final:" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== PODS ===" -ForegroundColor Cyan
kubectl get pods -n cars-devops -o wide
Write-Host ""
Write-Host "=== SERVICES ===" -ForegroundColor Cyan
kubectl get services -n cars-devops
Write-Host ""

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ DEPLOY CONCLUÍDO!                                ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  🌐 Frontend:  http://localhost:30030                ║" -ForegroundColor Green
Write-Host "║  ⚙️  Backend:   http://localhost:30080/actuator/health║" -ForegroundColor Green
Write-Host "║  📊 Grafana:   http://localhost:30300  (admin/admin123)║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
