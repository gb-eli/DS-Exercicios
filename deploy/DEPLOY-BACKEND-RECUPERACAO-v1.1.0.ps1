$ErrorActionPreference = "Stop"
$ProjectRef = "iresvqwyaqotghjssncg"
$Root = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $Root "core\edge-functions\recovery-exam"
$Temp = Join-Path $env:TEMP "ds-recuperacao-v1.1.0"
$Fn = Join-Path $Temp "supabase\functions\recovery-exam"
Write-Host "=== Recuperacao 2DS Sub v1.1.0 ===" -ForegroundColor Cyan
Write-Host "Banco: aplique 059 e depois 060. A migration 058 pertence a Central de Apoio e deve permanecer antes delas. Nao reaplique migration ja registrada." -ForegroundColor Yellow
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) { throw "Node.js/npx nao encontrado." }
if (Test-Path $Temp) { Remove-Item -Recurse -Force $Temp }
New-Item -ItemType Directory -Force -Path $Fn | Out-Null
Copy-Item (Join-Path $Source "index.ts") $Fn
Copy-Item (Join-Path $Source "catalog.ts") $Fn
Copy-Item (Join-Path $Source "review-notes.ts") $Fn
Copy-Item (Join-Path $Source "session-guard.ts") $Fn
Push-Location $Temp
try {
  npx --yes supabase@latest functions deploy recovery-exam --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { throw "Falha no deploy da Edge Function." }
  Write-Host "Edge Function recovery-exam publicada." -ForegroundColor Green
} finally {
  Pop-Location
  if (Test-Path $Temp) { Remove-Item -Recurse -Force $Temp }
}
Write-Host "Publique recuperacao/ e os atalhos integrados. O gabarito deve permanecer somente no backend." -ForegroundColor Yellow

