@echo off
setlocal
title DS-Exercicios v14.10.8.59 - Aplicar Patch
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0APLICAR-v14.10.8.59.ps1"
set "RC=%ERRORLEVEL%"
echo.
if not "%RC%"=="0" echo Aplicador terminou com erro. Codigo: %RC%
pause
exit /b %RC%
