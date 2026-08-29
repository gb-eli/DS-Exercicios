param([string]$Commit='HEAD')
$ErrorActionPreference='Stop'
if(-not(Test-Path '.git')){throw 'Execute na raiz do repositório Git.'}
if((git status --porcelain)){throw 'Working tree não está limpo. Resolva antes do rollback.'}
Write-Host "Será criado um git revert de $Commit. Nenhum histórico será reescrito." -ForegroundColor Yellow
git revert $Commit --no-edit
if($LASTEXITCODE -ne 0){throw 'git revert falhou. Não force; revise conflitos.'}
Write-Host 'Rollback criado localmente. Revise e use git push origin main.' -ForegroundColor Green
