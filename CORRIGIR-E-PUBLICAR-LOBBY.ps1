param([string]$RepoPath="")
$ErrorActionPreference="Stop"
$Root=Split-Path -Parent $MyInvocation.MyCommand.Path
$Payload=Join-Path $Root "payload"
if([string]::IsNullOrWhiteSpace($RepoPath)){
  $cwd=(Get-Location).Path
  if(Test-Path (Join-Path $cwd ".git")){$RepoPath=$cwd}
  else{$RepoPath=Read-Host "Cole o caminho COMPLETO do repositorio DS-Exercicios"}
}
$RepoPath=(Resolve-Path -LiteralPath $RepoPath).Path
if(-not(Test-Path (Join-Path $RepoPath ".git"))){throw "Este caminho nao parece ser o clone Git do projeto."}
if(-not(Get-Command git -ErrorAction SilentlyContinue)){throw "Git nao encontrado."}
Push-Location $RepoPath
try{
  $st=@(git status --porcelain)
  if($st.Count){Write-Host "Working tree nao esta limpa:" -ForegroundColor Yellow;$st|%{Write-Host $_};throw "Commit/stash antes do hotfix."}
  $branch=(git branch --show-current).Trim()
  if($branch-ne "main"){throw "Branch atual e '$branch'. Troque para main antes do hotfix."}

  $targets=@(
    "lobby/assets/world/dynamic-world.js",
    "repair-lobby.html"
  )
  foreach($rel in $targets){
    $src=Join-Path $Payload ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
    $dst=Join-Path $RepoPath ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dst)|Out-Null
    Copy-Item -LiteralPath $src -Destination $dst -Force
  }

  node --check "lobby/assets/world/dynamic-world.js"
  if($LASTEXITCODE-ne 0){throw "dynamic-world.js falhou no node --check."}

  git add -- "lobby/assets/world/dynamic-world.js" "repair-lobby.html"
  $d=@(git diff --cached --name-status | ?{$_ -match '^D\s'})
  if($d.Count){throw "Exclusao inesperada detectada. Abortando."}

  Write-Host ""
  Write-Host "Arquivos preparados:" -ForegroundColor Cyan
  git diff --cached --name-status
  Write-Host ""
  $answer=Read-Host "Digite PUBLICAR para criar commit e enviar para origin/main"
  if($answer-ne "PUBLICAR"){
    Write-Host "Hotfix aplicado localmente, mas NAO publicado." -ForegroundColor Yellow
    exit 0
  }

  git commit -m "fix(lobby): restore dynamic world boot asset"
  if($LASTEXITCODE-ne 0){throw "Falha no commit."}
  git push origin main
  if($LASTEXITCODE-ne 0){throw "Falha no push."}

  Write-Host ""
  Write-Host "HOTFIX PUBLICADO." -ForegroundColor Green
  Write-Host "Aguarde o Pages atualizar e abra:" -ForegroundColor Cyan
  Write-Host "https://gb-eli.github.io/DS-Exercicios/repair-lobby.html"
}finally{Pop-Location}
Read-Host "Pressione ENTER para fechar"
