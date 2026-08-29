@echo off
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0CORRIGIR-E-PUBLICAR-LOBBY.ps1"
pause
