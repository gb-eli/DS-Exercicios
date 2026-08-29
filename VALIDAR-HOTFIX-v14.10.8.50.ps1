$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$lobby3d = Join-Path $root 'lobby\assets\lobby3d.js'
$text = Get-Content $lobby3d -Raw

if ($text -notmatch 'presentation=null,activeStation=null') {
  throw 'HOTFIX INVALIDO: presentation/activeStation nao estao declarados no estado do runtime 3D.'
}
if ($text -match "v=14\.10\.8\.49") {
  throw 'HOTFIX INVALIDO: lobby3d.js ainda referencia cache-busting 14.10.8.49.'
}
$js = Get-ChildItem (Join-Path $root 'lobby') -Recurse -File | Where-Object { $_.Extension -in '.js','.mjs' }
foreach ($f in $js) {
  & node --check $f.FullName
  if ($LASTEXITCODE -ne 0) { throw "Erro de sintaxe: $($f.FullName)" }
}
Write-Host "PASS - Hotfix v14.10.8.50 validado ($($js.Count) JS)." -ForegroundColor Green
