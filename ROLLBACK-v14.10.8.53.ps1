param(
  [Parameter(Mandatory=$true)][string]$Repo,
  [Parameter(Mandatory=$true)][string]$CommitHash
)
$ErrorActionPreference='Stop'
$Repo=(Resolve-Path $Repo).Path
if(-not(Test-Path (Join-Path $Repo '.git'))){throw "Repo Git não encontrado: $Repo"}
Push-Location $Repo
try{
  if(git status --porcelain){throw 'Working tree não está limpa. Não execute rollback até guardar/descartar alterações locais.'}
  git show --no-patch --oneline $CommitHash | Out-Host
  if($LASTEXITCODE -ne 0){throw 'Commit informado não foi encontrado.'}
  git revert $CommitHash --no-edit
  if($LASTEXITCODE -ne 0){throw 'git revert falhou. Não faça push até resolver.'}
  Write-Host 'Rollback criado localmente. Revise e execute git push origin main.' -ForegroundColor Yellow
} finally {Pop-Location}
