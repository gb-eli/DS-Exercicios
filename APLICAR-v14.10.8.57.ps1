param(
  [string]$RepoPath = (Get-Location).Path
)
$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Payload = Join-Path $Here "payload"
$ManifestPath = Join-Path $Here "PATCH-MANIFEST-v14.10.8.57.json"
$Manifest = Get-Content -Raw -LiteralPath $ManifestPath | ConvertFrom-Json

Write-Host "=== AGV v14.10.8.57 - APLICAR LOGIN GOOGLE ===" -ForegroundColor Cyan
Write-Host "Repositorio: $RepoPath"

if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
  throw "Execute apontando para o clone Git do DS-Exercicios (pasta com .git)."
}

$branch = (git -C $RepoPath branch --show-current).Trim()
if ($branch -ne "main") { throw "Branch atual: $branch. A aplicacao segura exige main." }

$dirty = git -C $RepoPath status --porcelain
if ($dirty) { throw "Working tree nao esta limpa. Commit/stash antes de aplicar." }

Write-Host "[1/4] Validando base..." -ForegroundColor Cyan
foreach ($f in $Manifest.files) {
  $target = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if ($f.status -eq "modified") {
    if (-not (Test-Path -LiteralPath $target)) { throw "Arquivo base ausente: $($f.path)" }
    $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash.ToUpperInvariant()
    if ($sha -ne $f.base_sha256) {
      throw "Base divergente em $($f.path). Esperado $($f.base_sha256), encontrado $sha. Nada foi aplicado."
    }
  } elseif ($f.status -eq "added") {
    if (Test-Path -LiteralPath $target) { throw "Arquivo novo ja existe: $($f.path). Nada foi aplicado." }
  }
}

Write-Host "[2/4] Copiando payload..." -ForegroundColor Cyan
foreach ($f in $Manifest.files) {
  $src = Join-Path $Payload ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  $dst = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  $dir = Split-Path -Parent $dst
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Copy-Item -LiteralPath $src -Destination $dst -Force
}

Write-Host "[3/4] Validando resultado..." -ForegroundColor Cyan
foreach ($f in $Manifest.files) {
  $target = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash.ToUpperInvariant()
  if ($sha -ne $f.new_sha256) { throw "Falha de hash apos copia: $($f.path)" }
}

$deletes = git -C $RepoPath diff --name-status | Where-Object { $_ -match '^D\s' }
if ($deletes) { throw "ABORTADO: git diff detectou exclusao inesperada.`n$($deletes -join "`n")" }

$index = Get-Content -Raw -LiteralPath (Join-Path $RepoPath "index.html")
$hub = Get-Content -Raw -LiteralPath (Join-Path $RepoPath "assets\hub.js")
$session = Get-Content -Raw -LiteralPath (Join-Path $RepoPath "core\session\agv-session.js")
if ($index -notmatch 'id="google-login-btn"') { throw "Botao Google ausente." }
if ($hub -notmatch "signInWithOAuth\('google'") { throw "Hub nao chama OAuth Google." }
if ($session -notmatch 'function consumeAuthRedirect\(') { throw "Consumer OAuth ausente." }
if (($index + $hub + $session) -match 'GOCSPX-|service_role|sb_secret_') { throw "Possivel segredo detectado no frontend." }

Write-Host "[4/4] Concluido." -ForegroundColor Green
Write-Host ""
git -C $RepoPath diff --name-status
Write-Host ""
Write-Host "PATCH aplicado. Nenhum commit/push foi executado automaticamente." -ForegroundColor Yellow
