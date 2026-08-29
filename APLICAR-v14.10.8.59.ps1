param([string]$RepoPath = "")
$ErrorActionPreference = "Stop"
$PatchRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ManifestPath = Join-Path $PatchRoot "PATCH-MANIFEST-v14.10.8.59.json"
$PayloadRoot = Join-Path $PatchRoot "payload"

function Fail([string]$m) {
  Write-Host ""
  Write-Host "ERRO: $m" -ForegroundColor Red
  Read-Host "Pressione ENTER para fechar"
  exit 1
}
function H([string]$p) { (Get-FileHash -Algorithm SHA256 -LiteralPath $p).Hash.ToUpperInvariant() }

Clear-Host
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " DS-EXERCICIOS v14.10.8.59 - PATCH SEGURO" -ForegroundColor Cyan
Write-Host " Unified Auth + Central Hub" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Base esperada: v14.10.8.58"
Write-Host "O patch NAO exclui arquivos." -ForegroundColor Green
Write-Host ""

if (-not (Test-Path $ManifestPath)) { Fail "Manifesto ausente." }
if (-not (Test-Path $PayloadRoot)) { Fail "Payload ausente." }

if ([string]::IsNullOrWhiteSpace($RepoPath)) {
  $cwd = (Get-Location).Path
  if ((Test-Path (Join-Path $cwd "index.html")) -and (Test-Path (Join-Path $cwd "core"))) {
    $RepoPath = $cwd
  } else {
    $RepoPath = Read-Host "Cole o caminho COMPLETO do repositorio DS-Exercicios"
  }
}
try { $RepoPath = (Resolve-Path -LiteralPath $RepoPath).Path } catch { Fail "Repositorio nao encontrado." }

if (-not (Test-Path (Join-Path $RepoPath "index.html"))) { Fail "index.html nao encontrado." }
if (-not (Test-Path (Join-Path $RepoPath "core"))) { Fail "Pasta core nao encontrada." }

if (Test-Path (Join-Path $RepoPath ".git")) {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail "Git nao encontrado." }
  Push-Location $RepoPath
  try {
    $st = @(git status --porcelain)
    if ($LASTEXITCODE -ne 0) { Fail "git status falhou." }
    if ($st.Count -gt 0) {
      $st | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
      Fail "Working tree nao esta limpa. Commit/stash antes de aplicar."
    }
  } finally { Pop-Location }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail "Node.js nao encontrado." }

$M = Get-Content -Raw -LiteralPath $ManifestPath | ConvertFrom-Json

Write-Host "[1/5] Verificando base..." -ForegroundColor Cyan
foreach ($f in $M.files_modified) {
  $p = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path $p)) { Fail "Arquivo base ausente: $($f.path)" }
  $h = H $p
  if (($h -ne $f.base_sha256) -and ($h -ne $f.final_sha256)) {
    Fail "Arquivo divergente da base v14.10.8.58: $($f.path)"
  }
}
foreach ($f in $M.files_new) {
  $p = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if (Test-Path $p) {
    if ((H $p) -ne $f.final_sha256) { Fail "Arquivo novo ja existe diferente: $($f.path)" }
  }
}
Write-Host "Base OK." -ForegroundColor Green

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $RepoPath ".agv-backups\v14.10.8.59-$stamp"
New-Item -ItemType Directory -Force -Path $backup | Out-Null
$meta = @{ release="14.10.8.59"; modified=@(); created=@() }

Write-Host "[2/5] Criando backup..." -ForegroundColor Cyan
foreach ($f in $M.files_modified) {
  $p = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if ((H $p) -eq $f.base_sha256) {
    $b = Join-Path $backup ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $b) | Out-Null
    Copy-Item -LiteralPath $p -Destination $b -Force
    $meta.modified += $f.path
  }
}
foreach ($f in $M.files_new) {
  $p = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path $p)) { $meta.created += $f.path }
}
$meta | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $backup "backup-manifest.json")
Write-Host "Backup: $backup" -ForegroundColor Green

Write-Host "[3/5] Aplicando overlay..." -ForegroundColor Cyan
foreach ($f in @($M.files_modified) + @($M.files_new)) {
  $src = Join-Path $PayloadRoot ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  $dst = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path $src)) { Fail "Payload ausente: $($f.path)" }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dst) | Out-Null
  Copy-Item -LiteralPath $src -Destination $dst -Force
}

Write-Host "[4/5] Verificando hashes finais..." -ForegroundColor Cyan
foreach ($f in @($M.files_modified) + @($M.files_new)) {
  $dst = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path $dst)) { Fail "Final ausente: $($f.path)" }
  if ((H $dst) -ne $f.final_sha256) { Fail "Hash final divergente: $($f.path)" }
}
Write-Host "Hashes finais OK." -ForegroundColor Green

Write-Host "[5/5] Executando validador..." -ForegroundColor Cyan
Push-Location $RepoPath
try {
  node core/tools/validate-unified-auth-v59.mjs .
  if ($LASTEXITCODE -ne 0) { Fail "Validador v14.10.8.59 falhou." }
  if (Test-Path ".git") {
    $d = @(git diff --name-status | Where-Object { $_ -match '^D\s' })
    if ($d.Count -gt 0) {
      $d | ForEach-Object { Write-Host $_ -ForegroundColor Red }
      Fail "Exclusoes inesperadas detectadas. Nao publique."
    }
  }
} finally { Pop-Location }

Write-Host ""
Write-Host "v14.10.8.59 APLICADA E VALIDADA." -ForegroundColor Green
Write-Host "Backup: $backup"
Write-Host "Exclusoes pelo patch: 0"
Write-Host ""
Write-Host "Confira antes do commit:" -ForegroundColor Cyan
Write-Host "git status --short"
Write-Host "git diff --name-status"
Read-Host "Pressione ENTER para fechar"
