param([Parameter(Mandatory=$true)][string]$RepoPath)
$ErrorActionPreference='Stop';$Repo=(Resolve-Path $RepoPath).Path
function Need([bool]$ok,[string]$msg){if(!$ok){throw $msg}}
$hub=Get-Content (Join-Path $Repo 'index.html') -Raw
$lobby=Get-Content (Join-Path $Repo 'lobby/index.html') -Raw
$ljs=Get-Content (Join-Path $Repo 'lobby/assets/lobby.js') -Raw
$hjs=Get-Content (Join-Path $Repo 'assets/hub.js') -Raw
Need ($hub -match 'id="google-login-btn"') 'Botao Google ausente no Hub.'
Need ($hub -match 'Continuar com Google') 'Texto Google ausente no Hub.'
Need ($lobby -match 'id="google-login-btn"') 'Botao Google ausente no Lobby.'
Need ($lobby -match 'Continuar com Google') 'Texto Google ausente no Lobby.'
Need ($hjs -match "signInWithOAuth\('google'") 'OAuth Google ausente no Hub JS.'
Need ($ljs -match "provider:'google'") 'OAuth Google ausente no Lobby JS.'
$front=($hub+$lobby+$hjs+$ljs+(Get-Content (Join-Path $Repo 'core/session/agv-session.js') -Raw)
Need (-not ($front -match 'service_role|GOCSPX-')) 'Segredo detectado no frontend.'
if(Get-Command node -ErrorAction SilentlyContinue){& node --check (Join-Path $Repo 'assets/hub.js');if($LASTEXITCODE){throw 'hub.js invalido'};& node --check (Join-Path $Repo 'core/session/agv-session.js');if($LASTEXITCODE){throw 'agv-session.js invalido'};& node --check (Join-Path $Repo 'lobby/assets/lobby.js');if($LASTEXITCODE){throw 'lobby.js invalido'}}
if(Test-Path (Join-Path $Repo '.git')){$deleted=& git -C $Repo diff --name-only --diff-filter=D;Need (-not $deleted) 'Ha arquivos excluidos no git diff.'}
Write-Host 'VALIDACAO v14.10.8.58: PASS' -ForegroundColor Green
Write-Host 'Hub: Google visivel | Lobby: Google visivel | Exclusoes: 0' -ForegroundColor Green
