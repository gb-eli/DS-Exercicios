# Validação — v14.10.8.59 — Unified Auth & Central Hub

Base validada: **v14.10.8.58 — Google Hub + Lobby**.

## Resultado estático

- arquivos novos: **16**;
- arquivos modificados: **75**;
- arquivos removidos: **0**;
- JavaScript novo/modificado: **40 / 40 PASS** em `node --check`;
- imports relativos analisados: **125**;
- imports relativos ausentes: **0**;
- HTML novo/modificado analisado: **40**;
- superfícies oficiais protegidas pelo guard central: **18 / 18**;
- formulários de login visíveis: **1**, exclusivamente `auth/index.html`;
- login por senha paralelo nas superfícies oficiais: **0**;
- migrations/SQL alterados: **0**;
- padrões `sb_secret_*` / Google Client Secret no frontend: **0**;
- destinos centrais do Lobby: **10 / 10**;
- recursos críticos do Service Worker do Lobby: **33 / 33 presentes**;
- recursos opcionais do Service Worker do Lobby: **6 / 6 presentes**.

## Login único

A tela oficial é `/auth/`, com:

- e-mail + senha / CGM de primeiro acesso;
- Google OAuth;
- recuperação de senha;
- `returnTo` interno e sanitizado.

Hub, Lobby, Atividades, Professor, Admin, Prova, simulador da Prova, Recuperação, Economia e as seis ferramentas oficiais passam pelo mesmo guard.

## Migração de autenticação local

- **Laboratório Virtual DS:** o diálogo de login próprio foi removido do runtime oficial. Sessão ausente redireciona a `/auth/`.
- **CTF DS:** o formulário antigo permanece somente como shell HTML oculto de compatibilidade; o runtime não executa login por senha local/central próprio. A sessão vem do Portal e o armazenamento protegido funciona como cache.
- **Desafio Informática:** a Central de Contas deixou de ser uma segunda autenticação. Nome, turma, role e identidade são do AGV Core/Supabase; IndexedDB permanece apenas para cache de progresso.
- **Professor/Admin/Prova/Recuperação/Simulador:** formulários próprios foram retirados da interface e seus handlers não autenticam mais diretamente.
- **Plataformas antigas por turma e variantes históricas:** entradas públicas foram convertidas em redirects para a Plataforma Unificada ou versão oficial atual, sem apagar os arquivos históricos.

## Hub e legado

Os IDs `lab-sub`, `lab-ds1`, `lab-ds2` e `lab-ds3` estão marcados como legado e `readyForUnifiedHub=false`. Eles não aparecem mais no Hub oficial.

## Lobby centralizador

O manifesto `lobby/assets/world/campus-destinations.js` centraliza:

1. Plataforma Unificada;
2. Laboratório Virtual DS;
3. CTF DS;
4. COSMOS / Planetário DS;
5. Desafio DS;
6. Fliperama DS;
7. Desafio Informática;
8. Centro de Provas Práticas;
9. Banco AGV;
10. Loja AGV.

2D e 3D usam o mesmo manifesto e reutilizam a mesma sessão.

## Banco e Loja

A superfície `/economia/` é somente leitura nesta release e consulta as estruturas já existentes:

- `wallets`;
- `wallet_ledger`;
- `store_items`;
- `inventory_instances`.

Nenhuma alteração de saldo é feita no cliente.

## Smoke visual

O smoke visual completo autenticado e o fluxo Google real dependem do projeto publicado e de uma conta OAuth autorizada. Portanto, eles ficam corretamente marcados como:

> **SMOKE PÓS-PUBLICAÇÃO PENDENTE**

Após publicar, validar em desktop e Android:

1. acesso direto ao Hub sem sessão → `/auth/`;
2. login por senha → retorno ao Hub;
3. login Google → retorno ao destino solicitado;
4. Hub → Lobby → ferramenta sem segundo login;
5. Hub → Fliperama/CTF/Lab/COSMOS/Desafio sem segundo login;
6. Lobby 2D → prédio → ferramenta;
7. Lobby 3D → prédio → ferramenta;
8. sair em qualquer painel → sessão central encerrada;
9. URL antiga → fluxo oficial atual;
10. recuperação de senha → `reset-password/`, nunca localhost.

## Segurança operacional

O Client Secret do Google exibido anteriormente em uma captura de tela deve ser rotacionado no Google Cloud antes de considerar o OAuth em produção. O segredo não faz parte deste pacote.
