# v14.10.8.56 — PATCH Vertical & Dynamic World

Base obrigatória: **v14.10.8.55**.

O aplicador faz preflight completo por SHA-256 antes de copiar qualquer arquivo. Se encontrar um arquivo modificado fora da base esperada, interrompe sem sobrescrever.

## Aplicar

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
& ".\APLICAR-v14.10.8.56.ps1" -Repo "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
& ".\VALIDAR-v14.10.8.56.ps1" -Repo "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
```

Depois revise:

```powershell
git status
git diff --name-status
```

**Não publique se houver qualquer linha começando com `D`.**

## Commit sugerido

```powershell
git add -A
git commit -m "feat: Lobby Vertical & Dynamic World v14.10.8.56"
git push origin main
```

## Backend

Não existe migration. Para o chat por proximidade e para manter a reunião coletiva autenticada:

```powershell
supabase functions deploy lobby-presence --project-ref iresvqwyaqotghjssncg
```

## Rollback

Após publicação, use `ROLLBACK-v14.10.8.56.ps1` para criar um `git revert` seguro.
