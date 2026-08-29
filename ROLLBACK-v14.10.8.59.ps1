param([string]$RepoPath="")
$ErrorActionPreference="Stop"
$PatchRoot=Split-Path -Parent $MyInvocation.MyCommand.Path
$M=Get-Content -Raw -LiteralPath (Join-Path $PatchRoot "PATCH-MANIFEST-v14.10.8.59.json") | ConvertFrom-Json
if([string]::IsNullOrWhiteSpace($RepoPath)){ $RepoPath=Read-Host "Caminho COMPLETO do repositorio DS-Exercicios" }
$RepoPath=(Resolve-Path -LiteralPath $RepoPath).Path
function H($p){(Get-FileHash -Algorithm SHA256 -LiteralPath $p).Hash.ToUpperInvariant()}
$root=Join-Path $RepoPath ".agv-backups"
$backup=Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue |
  Where-Object {$_.Name -like "v14.10.8.59-*"} |
  Sort-Object Name -Descending |
  Select-Object -First 1
if(-not $backup){throw "Backup v14.10.8.59 nao encontrado."}
$meta=Get-Content -Raw -LiteralPath (Join-Path $backup.FullName "backup-manifest.json") | ConvertFrom-Json

foreach($f in @($M.files_modified)+@($M.files_new)){
  $p=Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if(Test-Path $p){
    if((H $p)-ne $f.final_sha256){throw "Rollback abortado: arquivo mudou depois do patch: $($f.path)"}
  }
}
foreach($rel in $meta.modified){
  $src=Join-Path $backup.FullName ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
  $dst=Join-Path $RepoPath ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
  Copy-Item -LiteralPath $src -Destination $dst -Force
}
foreach($rel in $meta.created){
  $dst=Join-Path $RepoPath ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
  if(Test-Path $dst){Remove-Item -LiteralPath $dst -Force}
}
foreach($f in $M.files_modified){
  $p=Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if((H $p)-ne $f.base_sha256){throw "Base nao restaurada: $($f.path)"}
}
Write-Host "ROLLBACK v14.10.8.59 CONCLUIDO." -ForegroundColor Green
Write-Host "Backup usado: $($backup.FullName)"
Read-Host "Pressione ENTER para fechar"
