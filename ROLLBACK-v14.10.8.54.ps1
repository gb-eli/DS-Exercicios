param([Parameter(Mandatory=$true)][string]$Repo)
$ErrorActionPreference='Stop';$Repo=(Resolve-Path $Repo).Path
Push-Location $Repo
try{
  $hash=git log --grep='v14.10.8.54' -1 --format='%H'
  if(-not $hash){throw 'Commit v14.10.8.54 não localizado automaticamente. Use git log e git revert <HASH>.'}
  Write-Host "Revertendo commit $hash" -ForegroundColor Yellow
  git revert $hash --no-edit
  if($LASTEXITCODE -ne 0){throw 'git revert falhou. Não faça resolução aleatória de conflitos.'}
  Write-Host 'Rollback criado localmente. Revise e execute git push origin main quando estiver correto.' -ForegroundColor Green
} finally {Pop-Location}
