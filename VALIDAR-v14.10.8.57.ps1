param(
  [string]$RepoPath = (Get-Location).Path
)
$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Manifest = Get-Content -Raw -LiteralPath (Join-Path $Here "PATCH-MANIFEST-v14.10.8.57.json") | ConvertFrom-Json

Write-Host "=== VALIDAR v14.10.8.57 ===" -ForegroundColor Cyan
foreach ($f in $Manifest.files) {
  $target = Join-Path $RepoPath ($f.path -replace '/', [IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path -LiteralPath $target)) { throw "Ausente: $($f.path)" }
  $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash.ToUpperInvariant()
  if ($sha -ne $f.new_sha256) { throw "Hash divergente: $($f.path)" }
}
$deletes = git -C $RepoPath diff --name-status | Where-Object { $_ -match '^D\s' }
if ($deletes) { throw "Exclusoes detectadas:`n$($deletes -join "`n")" }
$index = Get-Content -Raw -LiteralPath (Join-Path $RepoPath "index.html")
if ($index -notmatch 'Entrar com Google') { throw "Botao Google nao localizado." }
Write-Host "Hashes: PASS" -ForegroundColor Green
Write-Host "Botao Google: PASS" -ForegroundColor Green
Write-Host "Exclusoes: 0" -ForegroundColor Green
