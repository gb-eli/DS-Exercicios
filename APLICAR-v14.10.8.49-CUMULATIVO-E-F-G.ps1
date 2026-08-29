param(
  [string]$RepoPath = "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
)

$ErrorActionPreference = 'Stop'
$Version = '14.10.8.49'

function Fail($msg) {
  Write-Host "ERRO: $msg" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path "$RepoPath\.git")) { Fail "Clone Git completo não encontrado em: $RepoPath" }
Set-Location $RepoPath

if ((git branch --show-current).Trim() -ne 'main') { Fail 'Troque para a branch main antes de aplicar.' }
if (git status --porcelain) { Fail 'Working tree não está limpa. Commit/stash antes de aplicar.' }

$tracked = @(git ls-files).Count
if ($tracked -lt 3000) { Fail "Árvore incompleta: $tracked arquivos rastreados." }

git fetch origin main
if ($LASTEXITCODE -ne 0) { Fail 'Falha ao consultar origin/main.' }
$head = (git rev-parse HEAD).Trim()
$origin = (git rev-parse origin/main).Trim()
if ($head -ne $origin) { Fail 'A main local não está idêntica a origin/main. Rode git pull --ff-only origin main.' }

$backup = "backup-local-pre-v$Version-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backup $head
Write-Host "Backup local criado: $backup" -ForegroundColor Cyan

$source = $PSScriptRoot
Write-Host "Aplicando patch cumulativo a partir de: $source" -ForegroundColor Cyan

Get-ChildItem -Path $source -Force |
  Where-Object { $_.Name -notin @('.git') } |
  Copy-Item -Destination $RepoPath -Recurse -Force

$deleted = @(git status --short | Where-Object { $_ -match '^( D|D )' })
if ($deleted.Count -gt 0) {
  $deleted | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  Fail 'Exclusões detectadas após a cópia. Não faça commit.'
}

& "$RepoPath\VALIDAR-PUBLICACAO-v14.10.8.49.ps1"
if ($LASTEXITCODE -ne 0) { Fail 'Validação pós-aplicação falhou.' }

Write-Host "PATCH v$Version APLICADO E VALIDADO." -ForegroundColor Green
Write-Host 'Nenhum commit/push foi feito automaticamente.' -ForegroundColor Yellow
Write-Host 'Para publicar: .\PUBLICAR-v14.10.8.49.ps1' -ForegroundColor Cyan
