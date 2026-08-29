@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title AGV v14.10.8.58 - Login Google

echo ============================================================
echo  AGV v14.10.8.58 - LOGIN GOOGLE - HUB + LOBBY
echo ============================================================
echo.
echo Este aplicador nao apaga arquivos e exige arvore Git limpa.
echo.

set "DEFAULT_REPO=%USERPROFILE%\Documents\GitHub\DS-Exercicios-RECUPERADO"
if exist "%CD%\.git" (
  set "REPO=%CD%"
) else (
  set "REPO=%DEFAULT_REPO%"
)

echo Repositorio sugerido:
echo   %REPO%
echo.
set /p "CUSTOM=Pressione ENTER para usar esse caminho ou cole outro caminho: "
if not "%CUSTOM%"=="" set "REPO=%CUSTOM%"

if not exist "%REPO%\.git" (
  echo.
  echo ERRO: nao encontrei .git em:
  echo   %REPO%
  echo.
  pause
  exit /b 1
)

echo.
echo [1/2] Aplicando patch...
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0APLICAR-v14.10.8.58.ps1" -RepoPath "%REPO%"
if errorlevel 1 goto :erro

echo.
echo [2/2] Validando patch...
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0VALIDAR-v14.10.8.58.ps1" -RepoPath "%REPO%"
if errorlevel 1 goto :erro

echo.
echo ============================================================
echo  PATCH APLICADO E VALIDADO
ECHO ============================================================
echo.
echo Agora confira no Git:
echo   git -C "%REPO%" status --short
echo   git -C "%REPO%" diff --name-status

echo.
echo So publique se NAO existir nenhuma linha iniciando com D.
echo.
pause
exit /b 0

:erro
echo.
echo ============================================================
echo  ERRO - PUBLICACAO BLOQUEADA
ECHO ============================================================
echo Nao faca commit/push.
echo Tire uma foto da mensagem acima e envie para o ChatGPT.
echo.
pause
exit /b 1
