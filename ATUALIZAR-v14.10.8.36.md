# Deploy v14.10.8.36 — recuperação Lobby/Campus

## Motivo
O diagnóstico de produção em 28/08/2026 continuou informando `release: 14.10.8.18` e `boot_failed: Invalid or unexpected token`. Isso comprova que a árvore corrigida não estava ativa no caminho público `/DS-Exercicios/lobby/`.

## Regra principal deste ZIP
Este ZIP foi criado **sem pasta externa `DS-Exercicios-main/`**. Ao extrair na raiz do repositório, `lobby/`, `core/`, `atividades/`, etc. ficam diretamente na raiz e substituem os arquivos publicados.

## Publicação
1. Faça backup/commit do estado atual.
2. Extraia este ZIP diretamente na raiz do repositório `DS-Exercicios`, permitindo substituir os arquivos existentes.
3. Confirme que existe `./lobby/index.html` e NÃO `./DS-Exercicios-main/lobby/index.html` como destino da atualização.
4. Commit + push.
5. Espere o GitHub Pages concluir o deploy.
6. Abra `https://gb-eli.github.io/DS-Exercicios/repair-lobby.html`.
7. O reparador só redireciona se os seis assets principais contiverem `14.10.8.36`.
8. No diagnóstico do Campus, `release` deve aparecer como `14.10.8.36`.

## Se o reparador disser que a .36 não está publicada
O problema não é cache local: o GitHub Pages ainda está servindo arquivos antigos ou a atualização foi copiada para uma pasta aninhada/branch diferente da fonte do Pages.

## Banco
Este hotfix de frontend não altera aluno, turma, equipe, prova ou senha.
