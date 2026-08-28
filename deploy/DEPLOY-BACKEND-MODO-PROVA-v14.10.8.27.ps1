$ErrorActionPreference = "Stop"
$ProjectRef = "iresvqwyaqotghjssncg"
$Root = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $Root "core\edge-functions\practical-exam"
$Temp = Join-Path $env:TEMP "ds-prova-v14.10.8.27"
$Fn = Join-Path $Temp "supabase\functions\practical-exam"
Write-Host "=== Portal DS | Modo Prova v14.10.8.27 ===" -ForegroundColor Cyan
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) { throw "Node.js/npx não encontrado." }
if (Test-Path $Temp) { Remove-Item -Recurse -Force $Temp }
New-Item -ItemType Directory -Force -Path $Fn | Out-Null
Copy-Item (Join-Path $Source "index.ts") $Fn
Copy-Item (Join-Path $Source "session-guard.ts") $Fn
Push-Location $Temp
try {
  Write-Host "Publicando practical-exam v14.10.8.27 com JWT obrigatório..." -ForegroundColor Yellow
  npx --yes supabase@latest functions deploy practical-exam --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { throw "Falha no deploy." }
  Write-Host "Backend publicado." -ForegroundColor Green
} finally {
  Pop-Location
  if (Test-Path $Temp) { Remove-Item -Recurse -Force $Temp }
}
Write-Host "Agora publique/sobreponha a pasta prova/ no Portal DS." -ForegroundColor Cyan
