# v14.10.8.54 — Hotfix Portal Monumental do Vale

Base esperada: **v14.10.8.53**.

Este PATCH não remove arquivos. Ele move o portal do Vale para a área visível principal, aumenta sua presença visual 2D/3D e adiciona acesso permanente no HUD.

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\APLICAR-v14.10.8.54-PORTAL-VALE.ps1 -Repo "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
.\VALIDAR-v14.10.8.54.ps1 -Repo "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
```

Depois confira `git status`. Não faça commit se aparecer qualquer exclusão inesperada.

Commit sugerido:

```powershell
git add -A
git commit -m "fix: destacar Portal do Vale do Silício v14.10.8.54"
git push origin main
```
