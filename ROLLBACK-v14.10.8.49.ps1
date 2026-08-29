$ErrorActionPreference = 'Stop'

function Fail($msg) {
  Write-Host "ERRO: $msg" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path '.git')) { Fail 'Execute na raiz do repositório.' }
if ((git branch --show-current).Trim() -ne 'main') { Fail 'Rollback oficial deve ocorrer na main.' }
if (git status --porcelain) { Fail 'Working tree não está limpa.' }

git pull --ff-only origin main
if ($LASTEXITCODE -ne 0) { Fail 'Não foi possível sincronizar origin/main.' }

$subject = (git log -1 --pretty=%s).Trim()
if ($subject -notmatch '14\.10\.8\.49') { Fail "O último commit não parece ser a v14.10.8.49: $subject" }

git revert HEAD --no-edit
if ($LASTEXITCODE -ne 0) { Fail 'git revert falhou. Resolva conflitos antes de continuar.' }
git push origin main
if ($LASTEXITCODE -ne 0) { Fail 'Push do rollback falhou.' }

Write-Host 'ROLLBACK PUBLICADO COM SUCESSO.' -ForegroundColor Green
Write-Host 'Histórico preservado; repositório, main e URL do GitHub Pages mantidos.' -ForegroundColor Cyan
