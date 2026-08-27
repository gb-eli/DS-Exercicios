$ErrorActionPreference = 'Stop'
$ProjectRef = 'iresvqwyaqotghjssncg'
$Root = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $Root 'core\edge-functions\practical-exam'
$Tmp = Join-Path $env:TEMP ('ds-prova-' + [Guid]::NewGuid().ToString('N'))

Write-Host '== DS Exercicios | Modo Prova v14.10.8.24 ==' -ForegroundColor Cyan
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  throw 'Supabase CLI nao encontrado. Instale/abra um terminal que tenha o comando supabase.'
}
if (-not (Test-Path (Join-Path $Source 'index.ts'))) { throw 'index.ts da Edge Function nao encontrado.' }
if (-not (Test-Path (Join-Path $Source 'session-guard.ts'))) { throw 'session-guard.ts nao encontrado.' }

try {
  New-Item -ItemType Directory -Force -Path (Join-Path $Tmp 'supabase\functions\practical-exam') | Out-Null
  Copy-Item (Join-Path $Source 'index.ts') (Join-Path $Tmp 'supabase\functions\practical-exam\index.ts')
  Copy-Item (Join-Path $Source 'session-guard.ts') (Join-Path $Tmp 'supabase\functions\practical-exam\session-guard.ts')
  @"
project_id = "$ProjectRef"
"@ | Set-Content -Encoding UTF8 (Join-Path $Tmp 'supabase\config.toml')

  Push-Location $Tmp
  Write-Host 'Publicando Edge Function practical-exam com JWT obrigatorio...' -ForegroundColor Yellow
  supabase functions deploy practical-exam --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { throw 'Falha no deploy da Edge Function.' }
  Write-Host 'Edge Function publicada.' -ForegroundColor Green
  Pop-Location
}
finally {
  if ((Get-Location).Path -eq $Tmp) { Pop-Location }
  Remove-Item -Recurse -Force $Tmp -ErrorAction SilentlyContinue
}

Write-Host ''
Write-Host 'Banco P10926 ja foi aplicado no projeto de producao. Agora publique os arquivos estaticos desta versao no mesmo hosting/repo do Portal DS.' -ForegroundColor Cyan
