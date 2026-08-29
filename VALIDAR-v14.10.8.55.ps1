param([Parameter(Mandatory=$true)][string]$Repo)
$ErrorActionPreference='Stop'
$Here=Split-Path -Parent $MyInvocation.MyCommand.Path;$Manifest=Get-Content (Join-Path $Here 'PATCH_MANIFEST.json') -Raw | ConvertFrom-Json
$Repo=(Resolve-Path $Repo).Path;if(-not(Test-Path (Join-Path $Repo '.git'))){throw "Repo Git não encontrado: $Repo"}
function Get-Sha([string]$Path){if(-not(Test-Path $Path)){return $null};return (Get-FileHash $Path -Algorithm SHA256).Hash.ToUpperInvariant()}
Push-Location $Repo
try{
 $tracked=@(git ls-files).Count;if($tracked -lt 3000){throw "Árvore incompleta: $tracked arquivos."};$deleted=@(git status --short|Where-Object{$_ -match '^\s*D\s|^D\s'});if($deleted.Count){throw 'Há exclusões no working tree.'}
 foreach($f in $Manifest.files){if((Get-Sha (Join-Path $Repo ([string]$f.path))) -ne ([string]$f.targetSha256).ToUpperInvariant()){throw "Arquivo divergente: $($f.path)"}}
 $config=Get-Content (Join-Path $Repo 'lobby/assets/config.js') -Raw;if($config -notmatch '14\.10\.8\.55'){throw 'config.js não aponta para v14.10.8.55.'}
 $index=Get-Content (Join-Path $Repo 'lobby/index.html') -Raw;$logic=Get-Content (Join-Path $Repo 'lobby/assets/lobby.js') -Raw;$edge=Get-Content (Join-Path $Repo 'core/edge-functions/lobby-presence/index.ts') -Raw
 foreach($token in @('teleport-button','teleport-modal','teleport-vale-now','staff-bring-all')){if($index -notmatch [regex]::Escape($token)){throw "UI de teletransporte ausente: $token"}}
 foreach($token in @('issue_gather','verify_gather','staff-gather','teleportToDestination')){if(($logic+$edge) -notmatch [regex]::Escape($token)){throw "Integração ausente: $token"}}
 $runtime=Get-Content (Join-Path $Repo 'lobby/data/vale-silicio/runtime-v2.json') -Raw|ConvertFrom-Json;if(@($runtime.companies).Count -ne 27){throw 'Vale não contém 27 empresas.'};if(@($runtime.world.districts).Count -ne 8){throw 'Vale não contém 8 distritos.'}
 if(Get-Command node -ErrorAction SilentlyContinue){Get-ChildItem (Join-Path $Repo 'lobby') -Recurse -Filter *.js -File|ForEach-Object{node --check $_.FullName|Out-Null;if($LASTEXITCODE -ne 0){throw "Falha JS: $($_.FullName)"}}}
 Write-Host 'PASS - v14.10.8.55: teletransporte, Vale, 27 empresas, 8 distritos, comando coletivo assinado e 0 exclusões.' -ForegroundColor Green
 Write-Host 'Smoke autenticado do Realtime requer deploy da Edge Function lobby-presence.' -ForegroundColor Yellow
} finally {Pop-Location}
