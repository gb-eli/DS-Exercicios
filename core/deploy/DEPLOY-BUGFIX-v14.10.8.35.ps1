param(
  [string]$ProjectRef = "iresvqwyaqotghjssncg"
)
$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot "../.."))

Write-Host "DS Exercicios v14.10.8.35 - deploy de Edge Functions" -ForegroundColor Cyan
Write-Host "Projeto: $ProjectRef" -ForegroundColor Yellow

npx --yes supabase@latest functions deploy practical-exam --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) { throw "Falha no deploy de practical-exam." }

npx --yes supabase@latest functions deploy admin-access-management --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) { throw "Falha no deploy de admin-access-management." }

npx --yes supabase@latest functions deploy recovery-exam --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) { throw "Falha no deploy de recovery-exam." }

Write-Host "Edge Functions publicadas. Nao execute resets de senha sem revisar o escopo no painel Admin." -ForegroundColor Green
