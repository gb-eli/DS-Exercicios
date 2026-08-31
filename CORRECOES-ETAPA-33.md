# CORREÇÕES — ETAPA 33 / FASE 4.1

Data: 31/08/2026
Base: Etapa 32 — Fase 3.2, 376/376 PASS
Escopo: interiores e personalidade interna.

## Objetivo

Melhorar detalhes internos e personalidade de Laboratórios, salas de prova e prédios acadêmicos sem desmontar a arquitetura lazy nem aumentar o custo do Lobby inteiro.

## Implementação

### 1. Famílias internas por plataforma

`lobby/assets/world/campus-interiors.js` agora exporta `CAMPUS_INTERIOR_STYLE_PROFILES` para as 10 plataformas:

- Unified Platform — hub acadêmico;
- Banco — cívico/financeiro;
- Loja — galeria/showroom;
- Lab Virtual — pesquisa/laboratório;
- CTF DS — cyber/SOC;
- COSMOS — observatório;
- Desafio DS — briefing/missões;
- Fliperama — arcade;
- Game Informática — maker/inovação;
- Centro de Provas — prova/triagem.

Cada família define piso, parede, cor secundária, motivo arquitetônico e linguagem visual.

### 2. Temas acadêmicos

Os laboratórios 1DS, 2DS, 3DS e SUB passam a ter assinaturas distintas:

- 1DS — fundamentos/lógica;
- 2DS — interface/front-end;
- 3DS — sistemas/infraestrutura;
- SUB — mobile/prática.

As assinaturas são compactas e não alteram footprint, circulação nem interação dos terminais.

### 3. Equipamentos por função

O renderer usa `interiorRoomStyle(kind)` para derivar ícone, cor e equipamento de cada sala.

Exemplos:
- `lab` → bancada técnica;
- `tech` → rack;
- `cyber` → consoles;
- `science` → modelo orbital;
- `gamer` → arcade;
- `finance` → balcão/terminais;
- `retail` → displays;
- `creator` → bancada maker;
- `exam` → carteiras com telas;
- `mission` → mesa de briefing;
- `auditorium` → assentos;
- `service/social` → lounge.

### 4. Animações internas

Elementos de tela/orbita podem pulsar/rotacionar discretamente, porém:

- somente no interior ativo;
- somente no piso ativo;
- desativados com `prefers-reduced-motion`.

### 5. Modo 2D

O mapa interno 2D usa o mesmo `profile.style` e `interiorRoomStyle()` do 3D, mantendo coerência de cor, símbolo e função.

### 6. Performance preservada

A Etapa 15 continua intacta:

- `ensureToolInterior()` monta sob demanda;
- `releaseToolInterior()` remove e chama `disposeObject()`;
- nenhum novo interior é montado no boot;
- no máximo o ambiente em uso fica ativo.

## Cache

A cadeia alterada usa `stage33`:

- `vendor-loader.js`;
- `boot.js`;
- `lobby.js`;
- `lobby3d.js`;
- `lobby-lite.js`;
- `campus-interiors.js`;
- Service Worker.

## Banco/backend

Nenhuma migration, tabela, função SQL, Edge Function ou dado de aluno foi alterado.

## Validação

- `core/tools/validate-stage33-interior-personality.mjs`: **27/27 PASS**;
- Etapas 27–32: **PASS**;
- runtime lazy de interiores Stage15: **18/18 PASS**;
- interações Stage16: **22/22 PASS**;
- cinco validadores oficiais: **PASS**;
- suíte completa `core/tests/*.test.mjs`: **376/376 PASS — 0 falhas**.
