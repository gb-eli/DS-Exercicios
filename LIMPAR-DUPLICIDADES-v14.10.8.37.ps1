$ErrorActionPreference = 'Stop'

Write-Host 'AGV / DS-Exercicios - normalizacao estrutural v14.10.8.37' -ForegroundColor Cyan
Write-Host 'Esta rotina remove SOMENTE espelhos antigos dentro de core/.' -ForegroundColor Yellow

$obsolete = @(
  'core/admin',
  'core/assets',
  'core/atividades',
  'core/core',
  'core/deploy',
  'core/docs',
  'core/integracoes',
  'core/lobby',
  'core/loja-universal',
  'core/migracao',
  'core/professor',
  'core/prova',
  'core/reset-password',
  'core/sistemas',
  'core/templates',
  'core/validacao-antiga'
)

foreach ($path in $obsolete) {
  if (Test-Path $path) {
    Write-Host "Removendo espelho obsoleto: $path" -ForegroundColor DarkYellow
    Remove-Item $path -Recurse -Force
  }
}

if (Test-Path 'core') {
  Get-ChildItem 'core' -File | Where-Object { $_.Name -ne 'README-ESTRUTURA.md' } | ForEach-Object {
    Write-Host "Removendo arquivo duplicado na raiz de core/: $($_.Name)" -ForegroundColor DarkYellow
    Remove-Item $_.FullName -Force
  }
}

$required = @('core/catalog','core/contracts','core/database','core/edge-functions','core/sdk','core/session','core/tests','core/tools')
$missing = @($required | Where-Object { -not (Test-Path $_) })
if ($missing.Count -gt 0) {
  Write-Host 'ATENCAO: diretorios tecnicos esperados ausentes:' -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 2
}

$forbidden = @($obsolete | Where-Object { Test-Path $_ })
if ($forbidden.Count -gt 0) {
  Write-Host 'Falha: ainda existem espelhos obsoletos.' -ForegroundColor Red
  $forbidden | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 3
}

Write-Host ''
Write-Host 'Estrutura normalizada com sucesso.' -ForegroundColor Green
Write-Host 'Frontend publico: raiz do repositorio.' -ForegroundColor Green
Write-Host 'core/: somente backend, sessao, catalogos, SDK, testes e ferramentas.' -ForegroundColor Green
