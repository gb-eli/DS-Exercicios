param([Parameter(Mandatory=$true)][string]$RepoPath)
$ErrorActionPreference='Stop'
$PatchRoot=Split-Path -Parent $MyInvocation.MyCommand.Path
$Manifest=Get-Content (Join-Path $PatchRoot 'PATCH-MANIFEST-v14.10.8.58.json') -Raw | ConvertFrom-Json
$Repo=(Resolve-Path $RepoPath).Path
Write-Host '=== AGV v14.10.8.58 — OAuth Google visível no Front ===' -ForegroundColor Cyan
Write-Host "Repositorio: $Repo"
if(Test-Path (Join-Path $Repo '.git')){
  $status=& git -C $Repo status --porcelain
  if($LASTEXITCODE -ne 0){throw 'Falha ao consultar git status.'}
  if($status){throw 'Working tree nao esta limpa. Faça commit/stash antes de aplicar.'}
}
$plan=@()
foreach($f in $Manifest.files){
  $target=Join-Path $Repo $f.path
  $source=Join-Path $PatchRoot $f.path
  if(!(Test-Path $source)){throw "Payload ausente: $($f.path)"}
  $srcHash=(Get-FileHash $source -Algorithm SHA256).Hash
  if($srcHash -ne $f.sha256){throw "SHA do payload invalido: $($f.path)"}
  if(Test-Path $target){
    $cur=(Get-FileHash $target -Algorithm SHA256).Hash
    if($cur -eq $f.sha256){$plan+=@([pscustomobject]@{file=$f;action='skip'});continue}
    if($f.accepted_before -notcontains $cur){throw "Base divergente em $($f.path). Patch aceita v14.10.8.56/v14.10.8.57; nenhuma alteracao foi feita."}
  }elseif(-not $f.allow_missing){throw "Arquivo base ausente: $($f.path)"}
  $plan+=@([pscustomobject]@{file=$f;action='copy'})
}
$backup=Join-Path $Repo ('.backup-v14.10.8.58-'+(Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backup -Force | Out-Null
foreach($item in $plan){if($item.action -ne 'copy'){continue};$f=$item.file;$target=Join-Path $Repo $f.path;if(Test-Path $target){$bd=Join-Path $backup $f.path;New-Item -ItemType Directory -Path (Split-Path -Parent $bd) -Force|Out-Null;Copy-Item $target $bd -Force}}
foreach($item in $plan){if($item.action -ne 'copy'){continue};$f=$item.file;$source=Join-Path $PatchRoot $f.path;$target=Join-Path $Repo $f.path;New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force|Out-Null;Copy-Item $source $target -Force}
foreach($f in $Manifest.files){$target=Join-Path $Repo $f.path;$h=(Get-FileHash $target -Algorithm SHA256).Hash;if($h -ne $f.sha256){throw "Falha de verificacao apos copia: $($f.path)"}}
if(Test-Path (Join-Path $Repo '.git')){$deleted=& git -C $Repo diff --name-only --diff-filter=D;if($deleted){throw "EXCLUSAO DETECTADA. Restaurar pelo backup: $backup"}}
Write-Host ''
Write-Host 'PATCH APLICADO COM SUCESSO' -ForegroundColor Green
Write-Host 'Google visivel no Hub + Lobby.' -ForegroundColor Green
Write-Host "Backup: $backup" -ForegroundColor Yellow
Write-Host 'Agora rode VALIDAR-v14.10.8.58.ps1.' -ForegroundColor Cyan
