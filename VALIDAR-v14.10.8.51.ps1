param(
  [string]$Repo = (Get-Location).Path
)
$ErrorActionPreference = 'Stop'
$expected = '14.10.8.51'
$repo = (Resolve-Path $Repo).Path
if (-not (Test-Path (Join-Path $repo '.git'))) { throw "A pasta informada nao e um repositorio Git: $repo" }
Push-Location $repo
try {
  $tracked = @(git ls-files).Count
  if ($tracked -lt 3000) { throw "Arvore incompleta: apenas $tracked arquivos rastreados. Esperado: mais de 3000." }
  $deleted = @(git status --short | Where-Object { $_ -match '^( D|D )' })
  if ($deleted.Count -gt 0) { throw "Existem exclusoes no working tree. Nao publique.`n$($deleted -join "`n")" }
  $required = @(
    'lobby/index.html','lobby/sw.js','lobby/assets/config.js','lobby/assets/lobby.js','lobby/assets/lobby-lite.js','lobby/assets/lobby3d.js',
    'lobby/assets/world/campus-manifest.js','lobby/assets/world/campus-environment.js','lobby/assets/world/campus-experiences.js',
    'lobby/assets/render/camera-controller.js','lobby/assets/render/performance-manager.js','lobby/assets/characters/avatar-system.js','lobby/assets/game/portal-manager.js'
  )
  $missing = @($required | Where-Object { -not (Test-Path (Join-Path $repo $_)) })
  if ($missing.Count -gt 0) { throw "Arquivos obrigatorios ausentes:`n$($missing -join "`n")" }
  $config = Get-Content (Join-Path $repo 'lobby/assets/config.js') -Raw
  if ($config -notmatch [regex]::Escape("LOBBY_VERSION='$expected'")) { throw "config.js nao esta na versao $expected" }
  $lobby = Get-Content (Join-Path $repo 'lobby/assets/lobby.js') -Raw
  if ($lobby -notmatch 'default_2d_first') { throw 'Regra de boot 2D-first nao encontrada.' }
  if ($lobby -notmatch 'toggleRuntimeMode') { throw 'Alternancia 2D/3D nao encontrada.' }
  $html = Get-Content (Join-Path $repo 'lobby/index.html') -Raw
  if ($html -notmatch 'id="mode-button"') { throw 'Botao de escolha 2D/3D nao encontrado.' }
  $exp = Get-Content (Join-Path $repo 'lobby/assets/world/campus-experiences.js') -Raw
  foreach($token in @('parkour','pool','playground','slide','coaster','tower','PARKOUR_PLATFORMS')) {
    if ($exp -notmatch $token) { throw "Experiencia ausente: $token" }
  }
  if (Get-Command node -ErrorAction SilentlyContinue) {
    $jsFiles = @(
      'lobby/assets/lobby.js','lobby/assets/lobby-lite.js','lobby/assets/lobby3d.js','lobby/assets/boot.js',
      'lobby/assets/world/campus-environment.js','lobby/assets/world/campus-experiences.js'
    )
    foreach($file in $jsFiles) {
      node --check (Join-Path $repo $file) | Out-Null
      if ($LASTEXITCODE -ne 0) { throw "Erro de sintaxe JS: $file" }
    }
  }
  Write-Host "PASS - v$expected pronta para revisao/publicacao. Arquivos rastreados: $tracked. Nenhuma exclusao." -ForegroundColor Green
} finally { Pop-Location }
