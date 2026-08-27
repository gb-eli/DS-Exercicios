# Relatório de validação — Fase 7.27 · v0.38.6

## Escopo

Hexa Reactor foi adicionado como 24ª experiência do Fliperama DS, com 12 níveis autorais em grade axial hexagonal.

## Funcional

- Hexa Reactor: **130/130**;
- auditoria geral: **24/24 experiências · 832/832 checks**;
- regressão atual: **1329/1329**;
- falhas automatizadas: **0**.

## Arquitetura

- `games/hexa-reactor/engine.js`: lógica de grade, rotação, BFS, overload e save;
- `games/hexa-reactor/game.js`: entrada, HUD e Three.js;
- `games/hexa-reactor/levels.json`: campanha orientada a dados;
- iframe carregado sob demanda pelo runtime do portal.

## Publicação

- **463/463 rotas HTTP 200**;
- 36 scripts próprios sem erro de sintaxe;
- 76 JSONs válidos;
- 104 SVGs XML-válidos;
- **92/92 referências do Service Worker** existentes;
- **462 hashes internos** verificados;
- comparação com v0.38.5: **19 arquivos adicionados, 36 modificados e 0 removidos**;
- ZIP com `index.html` diretamente na raiz e integridade validada.

## Limitação

A validação automatizada não substitui percepção visual/tátil em navegador e hardware reais.
