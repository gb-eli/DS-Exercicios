# AGV World — F75 Lua — v14.10.8.77

## Escopo

A F75 adiciona a **Lua AGV** como um mundo independente carregado sob demanda a partir da Estação Orbital. O fluxo principal é **Campus → Estação Orbital → Lua → Estação Orbital → Campus**.

## Funcionalidades entregues

- Transporte lunar na Estação Orbital AGV.
- Novo mapa `moon` / área de presença `moon-agv`.
- Posição orbital anterior preservada antes da descida e restaurada no retorno.
- `moon-lite.js` e `moon3d.js` carregados somente ao viajar para a Lua.
- Terreno lunar 3D com horizonte, crateras, rochas e iluminação espacial.
- Base Lunar AGV com módulos de comando, geociências, habitat, energia/comunicações e garagem do rover.
- Área de pouso e módulo de ascensão para retorno à órbita.
- Mirante **Terra Azul**, sismômetro didático e observatório solar.
- Terra e Sol visíveis no céu lunar em representação procedural/estilizada.
- Gravidade reduzida e salto lunar mais longo.
- Rover Lunar AGV utilizável localmente.
- Minimapa e teleporte específicos da Lua.
- Presença, chat de proximidade e recurso de reunir isolados por `moon-agv`.
- Usuários da Lua não aparecem em Campus, Vale, Rural, Base Militar/Operações ou Órbita.
- Veículos terrestres multiplayer permanecem restritos ao Campus.

## Streaming e descarte

Os runtimes lunares não fazem parte do shell crítico do Service Worker e não são importados pelo boot inicial. Ao sair da Lua, o World Manager encerra o runtime e o 3D descarta renderer, geometrias, materiais, câmera, avatares e listeners associados ao mapa lunar.

## Backend / publicação

A F75 exige:

1. aplicar `core/database/070_lobby_moon_world.sql`;
2. republicar `core/edge-functions/lobby-presence/index.ts`.

A migration 070 recria `lobby_presence_area_chk` incluindo as áreas já existentes e `moon-agv`.

## Observações de realismo

- `MOON_GRAVITY` usa **1,62 m/s²** como referência, com ajuste de gameplay no runtime.
- Terra e Sol são modelos procedurais/estilizados; não são texturas fotográficas de satélite.
- O rover é local nesta etapa, sem ocupação multiplayer sincronizada.

## Validação

- F75: **8/8 PASS**.
- Regressão cumulativa F63A → F75: **82/82 PASS**.
- Trilhos/monotrilho: **20/20 PASS**.
- Mobilidade/Cidade Viva: **PASS**.
- Masterplan: **PASS**.
- Horário: **16/16 PASS**.
- Clima: **20/20 PASS**.
- Interiores lazy: **18/18 PASS**.
- Personalidade dos interiores: **PASS**.
- Fundação: **6/6 PASS**.
- JavaScript: **55 módulos + Service Worker PASS** em `node --check`.
- Edge Function: **TypeScript `tsc` PASS** com stubs ambientes locais para Deno/JSR; nenhum download externo foi necessário.
- HTML: **214/214 IDs únicos**.
- Smoke HTTP: **8/8 — 200 OK**.
- E2E visual em navegador: **não executado nesta fase**.

## Próxima fase sugerida

**F76 — Marte**: transporte orbital, superfície marciana sob demanda, base de pesquisa, rover marciano, cânions/crateras, tempestades de poeira e Terra/Sol vistos a partir de Marte.
