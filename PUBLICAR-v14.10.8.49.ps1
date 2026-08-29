$ErrorActionPreference = 'Stop'
$Version = '14.10.8.49'

function Fail($msg) {
  Write-Host "ERRO: $msg" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path '.git')) { Fail 'Execute na raiz do clone completo do DS-Exercicios.' }
if ((git branch --show-current).Trim() -ne 'main') { Fail 'A publicação oficial deve ocorrer na branch main.' }

& "$PSScriptRoot\VALIDAR-PUBLICACAO-v14.10.8.49.ps1"
if ($LASTEXITCODE -ne 0) { Fail 'Release gate reprovado.' }

git fetch origin main
if ($LASTEXITCODE -ne 0) { Fail 'Falha ao atualizar origin/main.' }

$head = (git rev-parse HEAD).Trim()
$origin = (git rev-parse origin/main).Trim()
if ($head -ne $origin) { Fail "HEAD local ($head) difere de origin/main ($origin). Atualize antes de publicar." }

$backup = "backup-pre-v$Version-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backup $head
if ($LASTEXITCODE -ne 0) { Fail 'Não foi possível criar branch local de backup.' }
git push origin $backup
if ($LASTEXITCODE -ne 0) { Fail 'Não foi possível publicar a branch remota de backup. Main não foi alterada.' }

Write-Host "Backup remoto criado: $backup" -ForegroundColor Cyan

git add -A
$stagedDeleted = @(git diff --cached --name-status | Where-Object { $_ -match '^D\s' })
if ($stagedDeleted.Count -gt 0) {
  $stagedDeleted | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  git reset
  Fail 'Exclusões apareceram após git add. Commit cancelado.'
}

$staged = git diff --cached --name-only
if (-not $staged) { Fail 'Nenhuma alteração para publicar.' }

git commit -m "feat: Campus DS release gate v$Version"
if ($LASTEXITCODE -ne 0) { Fail 'Commit falhou.' }

git push origin main
if ($LASTEXITCODE -ne 0) { Fail "Push falhou. Backup disponível em origin/$backup" }

git fetch origin main
$remoteAfter = (git rev-parse origin/main).Trim()
$localAfter = (git rev-parse HEAD).Trim()
if ($remoteAfter -ne $localAfter) { Fail 'Verificação pós-push falhou: origin/main não corresponde ao HEAD.' }

Write-Host "PUBLICADO: v$Version" -ForegroundColor Green
Write-Host "Main: $localAfter" -ForegroundColor Cyan
Write-Host "Rollback/backup: origin/$backup" -ForegroundColor Cyan
Write-Host 'O repositório e a URL do GitHub Pages permanecem os mesmos.' -ForegroundColor Green
