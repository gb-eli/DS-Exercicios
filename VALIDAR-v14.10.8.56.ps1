param(
  [string]$Repo = (Get-Location).Path
)
$ErrorActionPreference = 'Stop'
$release='14.10.8.56'
$required=@(
  'lobby/index.html','lobby/sw.js','lobby/assets/lobby.js','lobby/assets/lobby-lite.js','lobby/assets/lobby3d.js',
  'lobby/assets/game/train-manager.js','lobby/assets/world/dynamic-world.js','lobby/assets/social/proximity-chat.js',
  'lobby/assets/render/camera-controller.js','lobby/assets/characters/avatar-system.js','core/edge-functions/lobby-presence/index.ts'
)
foreach($rel in $required){$p=Join-Path $Repo ($rel -replace '/','\');if(!(Test-Path $p -PathType Leaf)){throw "Arquivo obrigatorio ausente: $rel"}}
$fileCount=(Get-ChildItem -LiteralPath $Repo -Recurse -File -Force | Where-Object{$_.FullName -notmatch '[\\/]\.git[\\/]'}|Measure-Object).Count
if($fileCount -lt 3000){throw "Arvore incompleta: $fileCount arquivos"}
$config=Get-Content (Join-Path $Repo 'lobby/assets/config.js') -Raw
$sw=Get-Content (Join-Path $Repo 'lobby/sw.js') -Raw
$html=Get-Content (Join-Path $Repo 'lobby/index.html') -Raw
$css=Get-Content (Join-Path $Repo 'lobby/assets/lobby.css') -Raw
$edge=Get-Content (Join-Path $Repo 'core/edge-functions/lobby-presence/index.ts') -Raw
if($config -notmatch "LOBBY_VERSION='14\.10\.8\.56'"){throw 'LOBBY_VERSION incorreta'}
if($sw -notmatch "VERSION='14\.10\.8\.56'"){throw 'Service Worker VERSION incorreta'}
if($html -notmatch 'id="teleport-button"' -or $html -notmatch '⚡ Teletransporte'){throw 'Botao Teletransporte ausente'}
if($css -notmatch '#teleport-button' -or $css -notmatch 'display:inline-flex!important'){throw 'Protecao responsiva do Teletransporte ausente'}
foreach($action in @('issue_gather','verify_gather','issue_chat','verify_chat')){if($edge -notmatch [regex]::Escape("action==='$action'")){throw "Edge action ausente: $action"}}
$secretHit=Get-ChildItem (Join-Path $Repo 'lobby') -Recurse -File | Select-String -Pattern 'SUPABASE_SERVICE_ROLE_KEY|sb_secret_|service_role' -ErrorAction SilentlyContinue
if($secretHit){throw 'Segredo privilegiado encontrado no frontend do Lobby'}
$node=Get-Command node -ErrorAction SilentlyContinue
if($node){$js=Get-ChildItem (Join-Path $Repo 'lobby/assets') -Recurse -File -Filter '*.js';foreach($f in $js){& node --check $f.FullName | Out-Null;if($LASTEXITCODE -ne 0){throw "JS invalido: $($f.FullName)"}};Write-Host "PASS - $($js.Count) JS validos" -ForegroundColor Green}else{Write-Host 'AVISO - Node nao encontrado; node --check nao executado.' -ForegroundColor Yellow}
# Valida que os recursos locais declarados no shell do SW existem.
$matches=[regex]::Matches($sw,"'((?:\./|\.\./)[^']+)'")
$missing=@()
foreach($m in $matches){$url=$m.Groups[1].Value;$clean=($url -split '\?')[0];if($clean -like '../*'){$p=Join-Path (Join-Path $Repo 'lobby') ($clean -replace '/','\')}else{$p=Join-Path (Join-Path $Repo 'lobby') ($clean -replace '^\./','' -replace '/','\')};$resolved=[System.IO.Path]::GetFullPath($p);if(!(Test-Path $resolved)){ $missing += $url }}
if($missing.Count -gt 0){throw "Recursos do Service Worker ausentes:`n$($missing -join "`n")"}
if(Test-Path (Join-Path $Repo '.git')){Push-Location $Repo;try{$deleted=@(git diff --name-status | Where-Object{$_ -match '^D\s'});if($deleted.Count){throw "Exclusoes detectadas:`n$($deleted -join "`n")"}}finally{Pop-Location}}
Write-Host "PASS - Release v$release validada; Teletransporte presente; 0 exclusoes detectadas." -ForegroundColor Green
Write-Host 'Backend: publicar lobby-presence para habilitar chat por proximidade.' -ForegroundColor Cyan
