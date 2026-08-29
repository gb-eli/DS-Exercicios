param(
  [string]$Repo = (Get-Location).Path,
  [string]$Commit = ''
)
$ErrorActionPreference='Stop'
if(!(Test-Path (Join-Path $Repo '.git'))){throw 'Rollback requer clone Git com pasta .git.'}
Push-Location $Repo
try{
  $dirty=git status --porcelain
  if($dirty){throw 'Working tree possui alteracoes. Faça commit/stash antes do rollback.'}
  if(!$Commit){$Commit=(git log -1 --format=%H)}
  Write-Host "Revertendo commit $Commit..." -ForegroundColor Yellow
  git revert $Commit --no-edit
  if($LASTEXITCODE -ne 0){throw 'git revert falhou. Nao faça resolucao aleatoria; revise os conflitos.'}
  Write-Host 'PASS - rollback criado por git revert. Revise e faça git push origin main.' -ForegroundColor Green
} finally {Pop-Location}
