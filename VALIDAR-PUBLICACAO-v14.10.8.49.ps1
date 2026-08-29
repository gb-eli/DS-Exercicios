$ErrorActionPreference = 'Stop'
$Version = '14.10.8.49'

function Fail($msg) {
  Write-Host "ERRO: $msg" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path '.git')) { Fail 'Execute este script na raiz do clone completo do DS-Exercicios.' }

$branch = (git branch --show-current).Trim()
if ($branch -ne 'main') { Fail "Branch atual: $branch. A publicação oficial deve ser validada na main." }

$tracked = @(git ls-files).Count
if ($tracked -lt 3000) { Fail "Árvore incompleta: apenas $tracked arquivos rastreados. Esperado: >= 3000." }

$deleted = @(git status --short | Where-Object { $_ -match '^( D|D )' })
if ($deleted.Count -gt 0) {
  $deleted | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  Fail 'Há exclusões detectadas. Não publicar.'
}

$required = @(
  'lobby/index.html',
  'lobby/sw.js',
  'lobby/assets/boot.js',
  'lobby/assets/lobby.js',
  'lobby/assets/lobby3d.js',
  'lobby/assets/lobby-lite.js',
  'lobby/assets/render/camera-controller.js',
  'lobby/assets/render/performance-manager.js',
  'lobby/assets/characters/avatar-system.js',
  'lobby/assets/game/portal-manager.js',
  'lobby/assets/world/campus-environment.js',
  'lobby/assets/world/campus-manifest.js'
)
foreach ($file in $required) { if (-not (Test-Path $file)) { Fail "Arquivo obrigatório ausente: $file" } }

$versionFiles = @(
  'index.html',
  'repair-lobby.html',
  'lobby/index.html',
  'lobby/sw.js',
  'lobby/assets/boot.js',
  'lobby/assets/sw-register.js',
  'lobby/assets/vendor-loader.js',
  'lobby/assets/config.js'
)
foreach ($file in $versionFiles) {
  if (-not (Select-String -Path $file -Pattern $Version -Quiet)) { Fail "Marcador $Version ausente em $file" }
}

$sw = Get-Content 'lobby/sw.js' -Raw
if ($sw -notmatch 'cache\.addAll\(CRITICAL_SHELL\)') { Fail 'Service Worker sem instalação atômica do shell crítico.' }
if ($sw -notmatch 'await self\.skipWaiting\(\)') { Fail 'Service Worker sem ativação após o cache crítico.' }

$diffCheck = git diff --check 2>&1
if ($LASTEXITCODE -ne 0) { $diffCheck | Write-Host; Fail 'git diff --check encontrou erros.' }

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  $jsFiles = Get-ChildItem 'lobby' -Recurse -File -Include *.js,*.mjs
  foreach ($file in $jsFiles) {
    & node --check $file.FullName | Out-Null
    if ($LASTEXITCODE -ne 0) { Fail "Falha de sintaxe JS: $($file.FullName)" }
  }
  Write-Host "JS: $($jsFiles.Count) arquivos verificados." -ForegroundColor Green
} else {
  Write-Host 'AVISO: Node.js não encontrado; sintaxe JS não foi revalidada localmente.' -ForegroundColor Yellow
}

Write-Host "OK - Release gate $Version aprovado." -ForegroundColor Green
Write-Host "Arquivos rastreados: $tracked" -ForegroundColor Cyan
Write-Host 'Nenhuma exclusão detectada.' -ForegroundColor Cyan
