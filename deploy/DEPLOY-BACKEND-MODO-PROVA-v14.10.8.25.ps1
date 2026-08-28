$ErrorActionPreference = "Stop"
$ProjectRef = "iresvqwyaqotghjssncg"
$Root = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $Root "core\edge-functions\practical-exam"
$Temp = Join-Path $env:TEMP "ds-prova-v14.10.8.25"
$Fn = Join-Path $Temp "supabase\functions\practical-exam"

Write-Host "=== Portal DS | Modo Prova v14.10.8.25 ===" -ForegroundColor Cyan
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  throw "Node.js/npx não encontrado. Instale Node.js antes de continuar."
}

if (Test-Path $Temp) { Remove-Item -Recurse -Force $Temp }
New-Item -ItemType Directory -Force -Path $Fn | Out-Null
Copy-Item (Join-Path $Source "index.ts") $Fn
Copy-Item (Join-Path $Source "session-guard.ts") $Fn

Push-Location $Temp
try {
  Write-Host "Publicando Edge Function practical-exam com JWT obrigatório..." -ForegroundColor Yellow
  npx --yes supabase@latest functions deploy practical-exam --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { throw "Falha no deploy da Edge Function." }
  Write-Host "Backend publicado." -ForegroundColor Green
} finally {
  Pop-Location
  if (Test-Path $Temp) { Remove-Item -Recurse -Force $Temp }
}

Write-Host "A migration P10927 já está aplicada em produção; não execute novamente para a aula de hoje." -ForegroundColor DarkGray
Write-Host "Agora publique/sobreponha os arquivos da pasta prova/ na hospedagem do Portal DS." -ForegroundColor Cyan
