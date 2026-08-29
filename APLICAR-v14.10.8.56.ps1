param(
  [string]$Repo = (Get-Location).Path
)
$ErrorActionPreference = 'Stop'
$release = '14.10.8.56'
$manifestPath = Join-Path $PSScriptRoot 'PATCH-MANIFEST-v14.10.8.56.json'
$payloadRoot = Join-Path $PSScriptRoot 'payload'
if (!(Test-Path $Repo -PathType Container)) { throw "Repositorio nao encontrado: $Repo" }
if (!(Test-Path $manifestPath -PathType Leaf)) { throw "Manifesto ausente: $manifestPath" }
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
if ($manifest.release -ne $release) { throw "Manifesto inesperado: $($manifest.release)" }
if (@($manifest.deleted).Count -gt 0) { throw 'PATCH contem exclusoes. Aplicacao bloqueada.' }
$fileCount = (Get-ChildItem -LiteralPath $Repo -Recurse -File -Force | Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' } | Measure-Object).Count
if ($fileCount -lt 3000) { throw "Arvore incompleta ($fileCount arquivos). Esperado >= 3000. Aplicacao bloqueada." }

Write-Host "Preflight v$release sobre $Repo" -ForegroundColor Cyan
$copyList = @()
foreach ($entry in $manifest.files) {
  $rel = [string]$entry.path
  $src = Join-Path $payloadRoot ($rel -replace '/', '\')
  $dst = Join-Path $Repo ($rel -replace '/', '\')
  if (!(Test-Path $src -PathType Leaf)) { throw "Payload ausente: $rel" }
  $srcHash = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash.ToUpperInvariant()
  if ($srcHash -ne ([string]$entry.final_sha256).ToUpperInvariant()) { throw "Hash do payload invalido: $rel" }
  if (Test-Path $dst -PathType Leaf) {
    $current = (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash.ToUpperInvariant()
    if ($current -eq ([string]$entry.final_sha256).ToUpperInvariant()) { continue }
    if ($entry.kind -eq 'modified' -and $current -eq ([string]$entry.base_sha256).ToUpperInvariant()) { $copyList += $entry; continue }
    throw "CONFLITO: $rel foi alterado fora da base v$($manifest.base_release). Nenhum arquivo foi sobrescrito."
  } else {
    if ($entry.kind -eq 'new') { $copyList += $entry; continue }
    throw "Arquivo base ausente: $rel. Nenhum arquivo foi sobrescrito."
  }
}

foreach ($entry in $copyList) {
  $rel = [string]$entry.path
  $src = Join-Path $payloadRoot ($rel -replace '/', '\')
  $dst = Join-Path $Repo ($rel -replace '/', '\')
  $parent = Split-Path $dst -Parent
  if (!(Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  Copy-Item -LiteralPath $src -Destination $dst -Force
}

foreach ($entry in $manifest.files) {
  $dst = Join-Path $Repo (([string]$entry.path) -replace '/', '\')
  if (!(Test-Path $dst -PathType Leaf)) { throw "Falha pos-aplicacao: $($entry.path)" }
  $hash = (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash.ToUpperInvariant()
  if ($hash -ne ([string]$entry.final_sha256).ToUpperInvariant()) { throw "Hash final incorreto: $($entry.path)" }
}

if (Test-Path (Join-Path $Repo '.git')) {
  Push-Location $Repo
  try {
    $deleted = @(git diff --name-status | Where-Object { $_ -match '^D\s' })
    if ($deleted.Count -gt 0) { throw "Exclusoes detectadas no working tree:`n$($deleted -join "`n")" }
  } finally { Pop-Location }
}
Write-Host "PASS - v$release aplicada com $($copyList.Count) arquivo(s) copiado(s), 0 exclusoes." -ForegroundColor Green
Write-Host "Execute VALIDAR-v14.10.8.56.ps1 antes do commit." -ForegroundColor Yellow
