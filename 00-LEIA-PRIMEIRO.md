# IMPORTANTE — v14.10.8.65

Este pacote é a versão cumulativa **v14.10.8.65 — Cidade Viva Avançada**, construída sobre a v14.10.8.64.

## Estado da release

- entrada oficial do Lobby em **2D**;
- modo **3D opcional**;
- tráfego urbano dinâmico, veículos utilizáveis, NPCs e eventos;
- interiores identitários e elevador 3D;
- login unificado preservado;
- sem nova migration SQL ou alteração de schema Supabase nesta release;
- mesmo repositório e mesmo GitHub Pages permanecem válidos.

## Antes de publicar

1. Leia `ATUALIZAR-v14.10.8.65.md`.
2. Leia `VALIDACAO-v14.10.8.65.md`.
3. Publique por **sobreposição** sobre a versão anterior; não apague a árvore existente sem necessidade.
4. Após o deploy, execute smoke real em navegador/Android, principalmente Lobby 2D/3D, login e navegação entre plataformas.

## Estrutura do repositório

A aplicação pública deve permanecer na raiz. Não recrie espelhos públicos dentro de `core/`; essa pasta é reservada a backend, componentes compartilhados, ferramentas e testes.

## Nota histórica

As auditorias, releases e instruções de versões anteriores continuam no pacote apenas como histórico. Elas não substituem as instruções desta v14.10.8.65.
