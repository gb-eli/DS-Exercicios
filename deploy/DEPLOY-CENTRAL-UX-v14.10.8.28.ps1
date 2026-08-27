$ErrorActionPreference = "Stop"
$ProjectRef = "iresvqwyaqotghjssncg"
$Root = Split-Path -Parent $PSScriptRoot
$RunId = [Guid]::NewGuid().ToString("N")
$TempRoot = Join-Path $env:TEMP "ds-central-ux-v14.10.8.28-$RunId"
$SupabaseRoot = Join-Path $TempRoot "supabase"
$MigrationRoot = Join-Path $SupabaseRoot "migrations"

Write-Host "=== Portal DS | Central UX v14.10.8.28 ===" -ForegroundColor Cyan
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) { throw "Node.js/npx não encontrado." }

New-Item -ItemType Directory -Force -Path $MigrationRoot | Out-Null
Copy-Item -LiteralPath (Join-Path $Root "core\database\057_p10928_learning_center_and_guild_identity.sql") -Destination (Join-Path $MigrationRoot "202608270001_p10928_learning_center_and_guild_identity.sql")

foreach ($FunctionName in @("staff-dashboard", "practical-exam")) {
  $Source = Join-Path $Root "core\edge-functions\$FunctionName"
  $Destination = Join-Path $SupabaseRoot "functions\$FunctionName"
  New-Item -ItemType Directory -Force -Path $Destination | Out-Null
  Copy-Item -LiteralPath (Join-Path $Source "index.ts") -Destination $Destination
  $Guard = Join-Path $Source "session-guard.ts"
  if (Test-Path -LiteralPath $Guard) { Copy-Item -LiteralPath $Guard -Destination $Destination }
}

Push-Location $TempRoot
try {
  Write-Host "1/3 Vinculando o projeto Supabase..." -ForegroundColor Yellow
  npx --yes supabase@latest link --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { throw "Falha ao vincular o projeto Supabase." }

  Write-Host "2/3 Aplicando a migration da Central do Aluno e identidade das guildas..." -ForegroundColor Yellow
  npx --yes supabase@latest db push --include-all
  if ($LASTEXITCODE -ne 0) { throw "Falha ao aplicar a migration. Nenhum frontend deve ser publicado antes de corrigir esta etapa." }

  Write-Host "3/3 Publicando os backends atualizados..." -ForegroundColor Yellow
  npx --yes supabase@latest functions deploy staff-dashboard --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { throw "Falha no deploy de staff-dashboard." }
  npx --yes supabase@latest functions deploy practical-exam --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { throw "Falha no deploy de practical-exam." }

  Write-Host "Backend e banco atualizados com sucesso." -ForegroundColor Green
  Write-Host "Agora publique os arquivos frontend do patch." -ForegroundColor Cyan
} finally {
  Pop-Location
  if (Test-Path -LiteralPath $TempRoot) { Remove-Item -LiteralPath $TempRoot -Recurse -Force }
}
