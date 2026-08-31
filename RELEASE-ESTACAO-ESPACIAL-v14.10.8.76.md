# AGV World F74 — Estação Espacial AGV

**Versão:** 14.10.8.76  
**Build:** `14.10.8.76-stage45-space`  
**Fase:** `world-f74-space-station-streaming`  
**Base:** 14.10.8.75

## Entrega

A F74 adiciona um **Centro Espacial AGV** ao Campus e um novo mundo independente, a **Estação Orbital AGV**. O mapa orbital segue a fundação de streaming iniciada na F72: os runtimes `space-lite.js` e `space3d.js` não fazem parte do boot crítico e são importados apenas quando o aluno embarca.

Ao retornar ao Campus, o World Manager encerra o runtime orbital e o 3D descarta renderer, geometrias, materiais, texturas procedurais, avatares, câmera e listeners.

## Centro Espacial no Campus

- Portal/centro de embarque: **Centro Espacial AGV**.
- Localizado dentro da área útil do Campus e aprovado pelo validador de masterplan.
- Identidade visual própria em 2D e 3D.
- Interação explícita **Embarcar**.

## Estação Orbital AGV

O novo mapa possui limites, spawn e sistema de coordenadas próprios. Os principais setores são:

- Doca de Chegada;
- Controle de Missão Orbital;
- Laboratório de Ciências;
- Módulo de Habitação;
- Robótica e Satélites;
- Cúpula de Observação da Terra;
- conjuntos de painéis solares Leste/Oeste;
- Transporte de Retorno ao Campus;
- painel de mapa/orientação orbital.

O 3D inclui campo de estrelas, uma Terra procedural em grande escala, Sol, iluminação direcional e módulos conectados por corredores. A representação planetária é intencionalmente **procedural/estilizada**, não uma textura fotográfica de satélite.

## Navegação e UX

- Minimapa próprio identificado como **ÓRBITA**.
- Teleporte global com destinos da estação.
- Retorno ao Campus pelo transporte orbital.
- Preserva a posição do Campus para retorno.
- 2D continua disponível para hardware mais simples.
- O modo 3D reutiliza o sistema de câmera e avatares já consolidado.

## Multiplayer e isolamento de mundos

A F74 adiciona `space-agv` ao contrato de presença.

- Presença em órbita só renderiza usuários da mesma área.
- Chat de proximidade e reunir equipe reconhecem a cena `space`.
- Usuários orbitais não aparecem no Campus, Rural ou Base de Operações.
- Veículos terrestres multiplayer permanecem **Campus-only**.
- Não há veículo espacial multiplayer nesta fase.

## Banco e Edge Function

Para publicar a F74 completa:

1. aplicar `core/database/069_lobby_space_world.sql`;
2. republicar `core/edge-functions/lobby-presence/index.ts`.

A migration 069 recria `lobby_presence_area_chk` incluindo `rural-agv`, `military-agv` e `space-agv`, portanto ela já representa o constraint mais recente dos mapas externos. Ela não substitui migrations de outros recursos, como as tabelas de multiplayer de veículos da F67 ou a programação persistente do Cinema.

## Validação

- F74 específica: **9/9 PASS**;
- regressão acumulada F63A → F74: **74/74 PASS**;
- trilhos/monotrilho: **20/20 PASS**;
- mobilidade/cidade viva: **PASS**;
- masterplan: **PASS**;
- horário global: **16/16 PASS**;
- clima global: **20/20 PASS**;
- runtime de interiores: **18/18 PASS**;
- personalidade dos interiores: **PASS**;
- fundação do mundo: **6/6 PASS**;
- sintaxe: **53 módulos JS do Lobby + Service Worker PASS**;
- Edge Function TypeScript: **PASS**;
- HTML: **213/213 IDs únicos**;
- smoke HTTP local: **8/8 — 200 OK**.

**E2E visual automatizado em navegador não foi executado nesta fase.**

## Fora do escopo da F74

- Lua;
- Marte;
- caminhada espacial/EVA em gravidade zero;
- veículo espacial pilotável/multiplayer;
- textura fotográfica/satelital da Terra.

Esses itens ficam preparados para as próximas fases usando a mesma arquitetura de mapas sob demanda.
