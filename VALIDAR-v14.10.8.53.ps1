param(
  [Parameter(Mandatory=$true)][string]$Repo
)
$ErrorActionPreference='Stop'
$Here=Split-Path -Parent $MyInvocation.MyCommand.Path
$Manifest=Get-Content (Join-Path $Here 'PATCH_MANIFEST.json') -Raw | ConvertFrom-Json
$Repo=(Resolve-Path $Repo).Path
if(-not(Test-Path (Join-Path $Repo '.git'))){throw "Repo Git não encontrado: $Repo"}
function Get-Sha([string]$Path){if(-not(Test-Path $Path)){return $null};return (Get-FileHash $Path -Algorithm SHA256).Hash.ToUpperInvariant()}
Push-Location $Repo
try{
  $tracked=@(git ls-files).Count
  if($tracked -lt 3000){throw "Árvore incompleta: apenas $tracked arquivos rastreados."}
  $deleted=@(git status --short | Where-Object {$_ -match '^\s*D\s|^D\s'})
  if($deleted.Count -gt 0){throw "Há exclusões no working tree.`n$($deleted -join "`n")"}
  foreach($f in $Manifest.files){
    $path=Join-Path $Repo ([string]$f.path)
    if((Get-Sha $path) -ne ([string]$f.targetSha256).ToUpperInvariant()){throw "Arquivo da release ausente/divergente: $($f.path)"}
  }
  $config=Get-Content (Join-Path $Repo 'lobby/assets/config.js') -Raw
  if($config -notmatch '14\.10\.8\.53'){throw 'config.js não aponta para v14.10.8.53.'}
  $runtime=Get-Content (Join-Path $Repo 'lobby/data/vale-silicio/runtime-v2.json') -Raw | ConvertFrom-Json
  if(@($runtime.companies).Count -ne 27){throw "Runtime do Vale não contém 27 empresas."}
  if(@($runtime.world.districts).Count -ne 8){throw "Runtime do Vale não contém 8 distritos."}
  if(Get-Command node -ErrorAction SilentlyContinue){
    $js=Get-ChildItem (Join-Path $Repo 'lobby') -Recurse -Filter *.js -File
    foreach($file in $js){node --check $file.FullName | Out-Null;if($LASTEXITCODE -ne 0){throw "Falha de sintaxe JS: $($file.FullName)"}}
  }
  Write-Host "PASS - v14.10.8.53 validada. 27 empresas, 8 distritos, hashes íntegros, 0 exclusões." -ForegroundColor Green
} finally {Pop-Location}
