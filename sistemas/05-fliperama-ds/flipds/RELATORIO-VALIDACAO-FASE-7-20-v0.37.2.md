# Relatório de validação — Fase 7.20 · v0.37.2

## Escopo

Entrada de `Crystal Cascade 3D` como 21ª experiência do Fliperama DS.

## Conteúdo implementado

- 12 fases em três atos de dificuldade;
- tabuleiro 8×8 e seis famílias de cristais;
- metas de pontuação, coleta por cor e quebra de gelo;
- limite de movimentos;
- peças especiais de linha, coluna e explosão;
- cascatas, combos e 1–3 estrelas;
- detecção de tabuleiro sem jogada e embaralhamento automático;
- save local de fase, estrelas e tentativa atual;
- cenário WebGL Three.js carregado sob demanda;
- tabuleiro DOM com profundidade CSS 3D para acessibilidade e toque.

## Ajuste de dificuldade

A simulação automatizada encontrou bloqueadores de borda que tornavam cinco níveis excessivamente punitivos. Eles foram recalibrados e todas as 12 fases passaram por solver simples antes da publicação.

## Validação

- Crystal Cascade: 118/118;
- auditoria geral: 21/21 experiências, 472/472 checks;
- regressão específica atual: 671 aprovações, 0 falhas (com sobreposição conceitual entre suítes);
- nenhuma experiência anterior removida.

O playtest perceptivo de toque, conforto visual e desempenho WebGL em hardware real permanece no checklist manual.

## Publicação e smoke visual

- 32 arquivos JavaScript passaram em `node --check`;
- 49 JSONs foram parseados;
- 95 SVGs foram parseados como XML;
- todas as referências do cache offline existem no pacote;
- o smoke visual automatizado com Chromium foi tentado, mas o processo ficou preso em erros de DBus/GPU e não produziu screenshot; não foi contabilizado como aprovação visual.

- Publicação HTTP final: **351/351 rotas aprovadas**.
