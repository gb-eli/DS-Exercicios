$ErrorActionPreference = 'Stop'

$repo = "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
$downloads = "$env:USERPROFILE\Downloads"
$patchPattern = "DS-Exercicios-v14.10.8.47-PATCH-FASE-E-PORTAL-V2-FX.zip"

if (-not (Test-Path $repo)) { throw "Repositorio nao encontrado: $repo" }
Set-Location $repo

if (-not (Test-Path '.git')) { throw "A pasta selecionada nao e um clone Git valido." }

git switch main
git pull --ff-only origin main
if ($LASTEXITCODE -ne 0) { throw "Falha ao atualizar a main." }

$count = [int](git ls-tree -r --name-only HEAD | Measure-Object -Line).Lines
if ($count -lt 3000) { throw "Arvore suspeita: somente $count arquivos. Interrompendo para evitar perda." }

$patch = Get-ChildItem $downloads -Filter $patchPattern -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $patch) { throw "Patch nao encontrado em $downloads" }

$temp = Join-Path $env:TEMP 'DS-Fase-E-14.10.8.47'
Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $temp | Out-Null
Expand-Archive -Path $patch.FullName -DestinationPath $temp -Force

Get-ChildItem $temp -Force |
  Where-Object { $_.Name -ne '.git' } |
  Copy-Item -Destination $repo -Recurse -Force

$deleted = @(git status --short | Where-Object { $_ -match '^( D|D )' })
if ($deleted.Count -gt 0) {
  Write-Host 'EXCLUSOES DETECTADAS. COMMIT CANCELADO.' -ForegroundColor Red
  $deleted
  throw 'Patch gerou exclusoes inesperadas.'
}

git add -A
git commit -m "feat: Lobby 3D Fase E Portal V2 FX v14.10.8.47"
if ($LASTEXITCODE -ne 0) { throw "Falha ao criar commit." }
git push origin main
if ($LASTEXITCODE -ne 0) { throw "Falha no push." }

git status
git log -3 --oneline
Write-Host 'FASE E PUBLICADA SEM LIMPAR O REPOSITORIO.' -ForegroundColor Green
