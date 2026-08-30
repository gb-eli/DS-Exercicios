# Correções — Etapa 7

## Escopo

Lobby/Campus P5 — compatibilidade de regressão histórica com a arquitetura modular atual da v14.10.8.65.

## Diagnóstico

As 11 falhas P5 restantes não indicavam a remoção das funcionalidades do Lobby. Os testes históricos ainda procuravam:

- versões internas antigas do Lobby (`0.3.x` a `1.0.1`);
- câmera implementada diretamente em `lobby3d.js`;
- qualidade adaptativa e heurística mobile dentro do renderer;
- avatar procedural/GLB e emotes dentro do renderer principal;
- `fountain()`, `buildingShell`, `portalGate` e `portalParticles` como símbolos monolíticos;
- labels antigos de monitores do Campus;
- um formato antigo da proteção de coordenadas internas.

Na release atual, essas responsabilidades foram separadas em módulos especializados.

## Correções

1. Os testes P5 passaram a validar `LOBBY_VERSION` contra `release-current.json`.
2. Câmera 360, FOV dinâmico e anti-clipping agora são verificados em `render/camera-controller.js`.
3. Qualidade adaptativa, thresholds de FPS e perfil Eco/mobile agora são verificados em `render/performance-manager.js`.
4. Avatar procedural, GLB rigado, fallback, acessórios, ações e emotes agora são verificados em `characters/avatar-system.js` + `rigged-avatar.js`.
5. Praça/fonte e prédios do Campus agora são verificados em `world/campus-environment.js`.
6. Portais energizados agora são verificados em `game/portal-manager.js`.
7. NPCs/monitores atuais são verificados pelo contrato de mobilidade da Cidade Viva.
8. A proteção de presença foi atualizada para cobrir tanto interiores de turma quanto interiores das ferramentas, garantindo que coordenadas internas não sejam publicadas.
9. O teste de boot valida o import versionado dinâmico atual em vez do antigo `?v=14.10.8.18`.
10. O fallback 2D, timeout de boot 3D e recuperação mobile continuam obrigatórios.

## Resultado

- P5 Lobby/Campus: 11/11 PASS.
- Cinco validadores oficiais: 150 checks PASS / 0 FAIL.
- Suíte geral: 353/368 PASS.
- Falhas remanescentes: 15, todas fora do escopo P5.

## Alterações funcionais de produção

Nenhuma lógica de produção precisou ser reintroduzida nesta etapa. A implementação atual já continha as funcionalidades; a correção foi nos contratos de regressão que estavam presos à estrutura monolítica histórica.
