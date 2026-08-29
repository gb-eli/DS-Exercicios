# Aplicação segura — v14.10.8.59

Base obrigatória: **v14.10.8.58**

## Windows
1. Extraia todo o ZIP.
2. Dê dois cliques em `EXECUTAR-PATCH-v14.10.8.59.cmd`.
3. Informe o caminho do clone `DS-Exercicios`.
4. O aplicador verifica SHA-256 da base, exige working tree limpa, cria backup, aplica somente overlay e roda o validador.

## Segurança
- novos: 16
- modificados: 75
- removidos: 0
- migrations/schema: 0
- nenhum delete é executado pelo patch

## Antes do commit
```powershell
git status --short
git diff --name-status
```

Não publique se aparecer `D` inesperado.

## Smoke pós-publicação
Google OAuth real e WebGL autenticado devem ser testados após o deploy.

## Google
Rotacione o Client Secret anteriormente exibido em uma captura de tela antes de produção.
