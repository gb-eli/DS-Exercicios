# v14.10.8.53 — Vale do Silício AGV + Campus Expansion

PATCH incremental **seguro** sobre a árvore completa `v14.10.8.52`.

## Regra principal

**Não apague o repositório.** O diretório `payload/` contém somente 27 arquivos novos/alterados e nenhuma exclusão.

O manifesto `PATCH_MANIFEST.json` registra SHA-256 da base e do destino. O aplicador interrompe se detectar arquivo-alvo local divergente da `.52`/`.53`, árvore Git incompleta ou qualquer exclusão.

## Aplicação

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\APLICAR-v14.10.8.53-VALE-SILICIO.ps1 -Repo "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
.\VALIDAR-v14.10.8.53.ps1 -Repo "C:\Users\Administrador\Documents\GitHub\DS-Exercicios-RECUPERADO"
git status
```

Se a validação retornar PASS e não houver `deleted:`, faça commit e push normalmente.

## Rollback

Após publicar a `.53`, use `ROLLBACK-v14.10.8.53.ps1 -Repo <caminho> -CommitHash <hash-do-commit-.53>` ou execute `git revert` manualmente.
