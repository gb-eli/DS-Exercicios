param([string]$RepoPath="")
$ErrorActionPreference="Stop"
$PatchRoot=Split-Path -Parent $MyInvocation.MyCommand.Path
$M=Get-Content -Raw -LiteralPath (Join-Path $PatchRoot "PATCH-MANIFEST-v14.10.8.59.json") | ConvertFrom-Json
if([string]::IsNullOrWhiteSpace($RepoPath)){ $RepoPath=Read-Host "Caminho COMPLETO do repositorio DS-Exercicios" }
$RepoPath=(Resolve-Path -LiteralPath $RepoPath).Path
function H($p){(Get-FileHash -Algorithm SHA256 -LiteralPath $p).Hash.ToUpperInvariant()}
foreach($f in @($M.files_modified)+@($M.files_new)){
  $p=Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if(-not(Test-Path $p)){throw "Ausente: $($f.path)"}
  if((H $p)-ne $f.final_sha256){throw "Hash divergente: $($f.path)"}
}
Push-Location $RepoPath
try{
  node core/tools/validate-unified-auth-v59.mjs .
  if($LASTEXITCODE-ne 0){throw "Validador falhou."}
  if(Test-Path ".git"){
    $d=@(git diff --name-status | Where-Object {$_ -match '^D\s'})
    if($d.Count){throw "Exclusoes no git diff: $($d -join ', ')"}
  }
}finally{Pop-Location}
Write-Host "VALIDACAO v14.10.8.59: PASS" -ForegroundColor Green
Read-Host "Pressione ENTER para fechar"
