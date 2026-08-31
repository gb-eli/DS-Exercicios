# AGV World F71 — Mirantes e Binóculos

**Versão:** 14.10.8.73  
**Build:** 14.10.8.73-stage42-viewpoints  
**Data:** 31/08/2026  
**Base:** F70 / 14.10.8.72

## Objetivo

Transformar o Mirante AGV e novos pontos panorâmicos em ferramentas reais de observação do Campus 3D, com binóculos/telescópios, zoom e identificação de marcos, sem criar outro renderer nem gravar dados acadêmicos.

## Entregue

- Três observatórios: **Mirante AGV Oeste**, **Mirante Ciência Leste** e **Mirante Pesquisa Sudoeste**.
- O mirante oeste reaproveita a torre já existente; não há duplicação volumétrica da atração.
- Binóculo/telescópio interativo acessado pelo comando contextual **Observar**.
- Uma única `PerspectiveCamera` reutilizável para os mirantes no renderer WebGL principal.
- Zoom progressivo **1× a 6×** por alteração de FOV.
- Panorama geral e foco direto em marcos do Campus.
- Marcos catalogados: Praça Central, Plataforma Unificada, Central de Segurança, Cinema, laboratórios 1DS/2DS/3DS/Sub, Portal do Vale e monotrilho.
- Movimento e câmera comum ficam travados durante observação.
- Saída por **E**, **Esc** ou botão de fechar, retornando o avatar ao ponto anterior.
- Clima, horário, NPCs, tráfego e demais sistemas externos continuam vivos durante a observação.
- Mirantes aparecem no minimapa.
- Painel responsivo para desktop e celular, sem handlers inline.

## Arquitetura e privacidade

A F71 é uma funcionalidade **local/runtime**. Ela não cria tabela, migration ou Edge Function e não grava uso do binóculo em banco. Não adiciona dados pessoais, informações acadêmicas, notas, atividades ou telemetria individual.

O modo binóculo compartilha a mesma cena e o mesmo renderer usado pelo Campus e pela Central de Segurança. Isso evita múltiplos contextos WebGL e reduz o custo em notebooks mais modestos.

## Compatibilidade

Preservados:

- F70 Mobilidade Aérea;
- F69 Central de Segurança/CCTV;
- F68 Trânsito Inteligente;
- F67 Passageiros Multiplayer terrestres;
- F66 Direção Manual;
- F64 Cinema AGV;
- F63A fundação do mundo;
- monotrilho, clima, horário e interiores lazy-loaded.

Dois testes históricos (F69/F70) tinham validações literais da release/render anterior. Eles foram ajustados para aceitar a composição com o novo observador e releases posteriores, mantendo as garantias originais.

## Validação executada

- Testes específicos F71: **7/7 PASS**.
- Regressão F63A → F71 selecionada: **48/48 PASS**.
- Trilhos e monotrilho: **20/20 PASS**.
- Cidade Viva / Mobilidade: **PASS**.
- Masterplan: **PASS**.
- Horário: **16/16 PASS**.
- Clima: **20/20 PASS**.
- Fundação F63A: **6/6 PASS**.
- Sintaxe: **44 arquivos JavaScript**, incluindo Service Worker, sem erro.
- HTML: **210 IDs / 210 únicos**.
- Smoke HTTP local: arquivos críticos verificados com status 200 (ver fechamento do pacote).

**Não foi executado E2E visual automatizado em navegador nesta fase.**

## Deploy

Não há migration nem Edge Function nova para F71. O frontend pode ser publicado sobre a versão anterior mantendo o mesmo link do Pages.

Se a infraestrutura das fases anteriores ainda não estiver aplicada:

- F67 multiplayer terrestre depende de `066_lobby_vehicle_multiplayer.sql` + Edge Function `lobby-presence`;
- Cinema persistente depende da migration `065_lobby_cinema_media.sql`.

## Próxima fase sugerida

**F72 — Mapas carregados sob demanda**, começando pela fundação de streaming/transição e um ambiente rural separado do Campus principal.
