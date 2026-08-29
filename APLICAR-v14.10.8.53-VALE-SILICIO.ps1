param(
  [Parameter(Mandatory=$true)][string]$Repo
)
$ErrorActionPreference='Stop'
$Here=Split-Path -Parent $MyInvocation.MyCommand.Path
$Payload=Join-Path $Here 'payload'
$ManifestPath=Join-Path $Here 'PATCH_MANIFEST.json'
if(-not(Test-Path $Payload)){throw 'payload/ não encontrado.'}
if(-not(Test-Path $ManifestPath)){throw 'PATCH_MANIFEST.json não encontrado.'}
$Repo=(Resolve-Path $Repo).Path
if(-not(Test-Path (Join-Path $Repo '.git'))){throw "Repo Git não encontrado: $Repo"}
$Manifest=Get-Content $ManifestPath -Raw | ConvertFrom-Json
function Get-Sha([string]$Path){ if(-not(Test-Path $Path)){return $null}; return (Get-FileHash $Path -Algorithm SHA256).Hash.ToUpperInvariant() }
Push-Location $Repo
try{
  $tracked=@(git ls-files).Count
  if($tracked -lt 3000){throw "Árvore incompleta: $tracked arquivos rastreados."}
  $deleted=@(git status --short | Where-Object {$_ -match '^\s*D\s|^D\s'})
  if($deleted.Count -gt 0){throw "Já existem exclusões antes do PATCH. Corrija primeiro.`n$($deleted -join "`n")"}
  $baseConfig=Join-Path $Repo 'lobby/assets/config.js'
  if(-not(Test-Path $baseConfig)){throw 'config.js do Lobby ausente.'}
  $configText=Get-Content $baseConfig -Raw
  if($configText -notmatch "14\.10\.8\.(52|53)"){throw 'A base do Lobby não é v14.10.8.52 nem uma reaplicação v14.10.8.53.'}

  foreach($f in $Manifest.files){
    $dest=Join-Path $Repo ([string]$f.path)
    $actual=Get-Sha $dest
    $target=([string]$f.targetSha256).ToUpperInvariant()
    if($f.status -eq 'modified'){
      $base=([string]$f.baseSha256).ToUpperInvariant()
      if($actual -and $actual -ne $base -and $actual -ne $target){throw "Arquivo local divergente; PATCH não sobrescreveu: $($f.path)"}
      if(-not $actual){throw "Arquivo base esperado ausente: $($f.path)"}
    } elseif($actual -and $actual -ne $target){
      throw "Arquivo novo já existe com conteúdo diferente: $($f.path)"
    }
  }

  foreach($f in $Manifest.files){
    $src=Join-Path $Payload ([string]$f.path)
    $dest=Join-Path $Repo ([string]$f.path)
    $dir=Split-Path -Parent $dest
    if(-not(Test-Path $dir)){New-Item -ItemType Directory -Path $dir -Force|Out-Null}
    if((Get-Sha $dest) -ne ([string]$f.targetSha256).ToUpperInvariant()){Copy-Item $src $dest -Force}
  }

  foreach($f in $Manifest.files){
    $dest=Join-Path $Repo ([string]$f.path)
    if((Get-Sha $dest) -ne ([string]$f.targetSha256).ToUpperInvariant()){throw "Hash final divergente: $($f.path)"}
  }
  $deleted=@(git status --short | Where-Object {$_ -match '^\s*D\s|^D\s'})
  if($deleted.Count -gt 0){throw "PATCH produziu exclusão inesperada. NÃO faça commit.`n$($deleted -join "`n")"}
  Write-Host "PASS - v14.10.8.53 aplicada: $($Manifest.totalPayloadFiles) arquivos, 0 exclusões." -ForegroundColor Green
  Write-Host 'Execute agora VALIDAR-v14.10.8.53.ps1 e git status.' -ForegroundColor Cyan
} finally {Pop-Location}
