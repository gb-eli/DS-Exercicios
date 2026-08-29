param(
  [string]$Repo = "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
)
$ErrorActionPreference='Stop'
$patchRoot=Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path (Join-Path $Repo '.git'))) { throw "Repositorio Git nao encontrado: $Repo" }
$fileCount=(Get-ChildItem $Repo -Recurse -File -Force | Where-Object { $_.FullName -notmatch '\\.git\\' } | Measure-Object).Count
if ($fileCount -lt 3000) { throw "ARVORE INCOMPLETA: apenas $fileCount arquivos. Hotfix cancelado." }
$items=Get-ChildItem $patchRoot -Force | Where-Object { $_.Name -notin @('APLICAR-HOTFIX-v14.10.8.50.ps1') }
foreach($item in $items){ Copy-Item $item.FullName -Destination $Repo -Recurse -Force }
Push-Location $Repo
try {
  $deleted=@(git status --short | Where-Object { $_ -match '^( D|D )' })
  if($deleted.Count -gt 0){ throw "EXCLUSOES DETECTADAS. Nao publique.`n$($deleted -join "`n")" }
  node --check '.\lobby\assets\lobby3d.js'
  if($LASTEXITCODE -ne 0){ throw 'lobby3d.js falhou no node --check.' }
  $txt=Get-Content '.\lobby\assets\lobby3d.js' -Raw
  if($txt -notmatch 'presentation=null,activeStation=null'){ throw 'Declaracoes do hotfix nao encontradas.' }
  Write-Host 'PASS - Hotfix 14.10.8.50 aplicado. Nenhuma exclusao detectada.' -ForegroundColor Green
  git status --short
} finally { Pop-Location }
