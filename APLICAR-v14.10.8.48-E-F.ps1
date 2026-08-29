param(
  [string]$RepoPath = "$env:USERPROFILE\Documents\GitHub\DS-Exercicios-RECUPERADO"
)
$ErrorActionPreference = 'Stop'
$Source = $PSScriptRoot
if (-not (Test-Path (Join-Path $RepoPath '.git'))) { throw "Repositorio Git nao encontrado em: $RepoPath" }
Push-Location $RepoPath
try {
  $tracked = @(git ls-files)
  if ($LASTEXITCODE -ne 0 -or $tracked.Count -lt 3000) { throw "Arvore incompleta ou Git invalido. Esperado: mais de 3000 arquivos rastreados." }
  $dirty = @(git status --porcelain)
  if ($dirty.Count -gt 0) { throw "O repositorio possui alteracoes locais. Faça commit/stash antes de aplicar o patch." }

  $rootFiles = @(
    'index.html','repair-lobby.html','release-current.json','release-v14.10.8.47.json','release-v14.10.8.48.json',
    'ATUALIZAR-v14.10.8.47.md','ATUALIZAR-v14.10.8.48.md','VALIDACAO-v14.10.8.47.md','VALIDACAO-v14.10.8.48.md'
  )
  foreach ($file in $rootFiles) { Copy-Item (Join-Path $Source $file) (Join-Path $RepoPath $file) -Force }
  Copy-Item (Join-Path $Source 'lobby\*') (Join-Path $RepoPath 'lobby') -Recurse -Force

  $deleted = @(git status --short | Where-Object { $_ -match '^( D|D )' })
  if ($deleted.Count -gt 0) { throw "Seguranca acionada: exclusoes detectadas. Nao faça commit." }
  Write-Host "Patch E+F aplicado sem exclusoes." -ForegroundColor Green
  git status --short
  Write-Host "Revise o status acima. Depois: git add -A; git commit; git push origin main" -ForegroundColor Cyan
}
finally { Pop-Location }
