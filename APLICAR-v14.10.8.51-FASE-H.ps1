param(
  [string]$Repo = 'C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO'
)
$ErrorActionPreference = 'Stop'
$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = (Resolve-Path $Repo).Path
if (-not (Test-Path (Join-Path $repo '.git'))) { throw "Repositorio Git nao encontrado: $repo" }
Push-Location $repo
try {
  $tracked = @(git ls-files).Count
  if ($tracked -lt 3000) { throw "PROTECAO: arvore incompleta ($tracked arquivos). O patch nao sera aplicado." }
  $dirty = @(git status --porcelain)
  if ($dirty.Count -gt 0) { throw "PROTECAO: existem alteracoes locais antes do patch. Faça commit/stash primeiro.`n$($dirty -join "`n")" }
  $files = @(
    'index.html','repair-lobby.html','smoke2d.html','smoke3d.html','release-current.json','release-v14.10.8.51.json','ATUALIZAR-v14.10.8.51.md',
    'lobby/index.html','lobby/sw.js',
    'lobby/assets/lobby.css','lobby/assets/config.js','lobby/assets/lobby.js','lobby/assets/lobby-lite.js','lobby/assets/lobby3d.js',
    'lobby/assets/diagnostics.js','lobby/assets/sw-register.js','lobby/assets/boot.js','lobby/assets/supabase.js','lobby/assets/vendor-loader.js',
    'lobby/assets/characters/avatar-system.js','lobby/assets/world/campus-environment.js','lobby/assets/world/campus-experiences.js'
  )
  foreach($rel in $files) {
    $src = Join-Path $source $rel
    if (-not (Test-Path $src)) { throw "Patch incompleto. Arquivo ausente: $rel" }
    $dst = Join-Path $repo $rel
    $parent = Split-Path -Parent $dst
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    Copy-Item $src $dst -Force
  }
  $deleted = @(git status --short | Where-Object { $_ -match '^( D|D )' })
  if ($deleted.Count -gt 0) { throw "PROTECAO: exclusoes detectadas. NAO COMMITAR.`n$($deleted -join "`n")" }
  Write-Host 'PASS - Fase H v14.10.8.51 aplicada por cima da arvore completa. Nenhuma exclusao detectada.' -ForegroundColor Green
  Write-Host 'Agora rode: .\VALIDAR-v14.10.8.51.ps1 (ou use o validador do pacote apontando para o repo) e depois git status.' -ForegroundColor Cyan
} finally { Pop-Location }
