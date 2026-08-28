# Relatório de validação — Fase 7.28 · v0.39.0

## Entrega

A v0.39.0 adiciona **Chess Arena 360** como a 25ª experiência do Fliperama DS. O jogo é carregado sob demanda em iframe e usa Three.js local apenas para apresentação; regras, CPU e save ficam em módulos independentes.

## Regras de xadrez

O motor implementa:
- movimento legal das seis peças;
- segurança do rei e casas atacadas;
- roque curto/longo com todas as restrições de passagem por xeque;
- en passant;
- promoção para Dama, Torre, Bispo ou Cavalo;
- xeque, xeque-mate e afogamento;
- repetição tripla;
- regra dos 50 lances;
- material insuficiente.

A validação de geração de movimentos usa os valores clássicos da posição inicial: **20 no perft-1, 400 no perft-2 e 8.902 no perft-3**.

## CPU

Quatro níveis:
- **Iniciante:** escolhas mais aleatórias, com preferência parcial por capturas;
- **Normal:** avaliação de um lance;
- **Estratégica:** minimax de duas camadas e verificação tática de mate imediato;
- **Mestre:** busca de até três camadas com poda alpha-beta e limite de tempo.

O nível Mestre é um adversário didático do Fliperama DS, não pretende substituir engines profissionais de xadrez.

## Apresentação

- tabuleiro 3D 8×8;
- peças low-poly procedurais e autorais;
- câmera orbital arrastável;
- visão superior alternável;
- zoom;
- destaques de seleção e movimentos legais;
- HUD DOM responsivo;
- histórico de lances;
- modal específico de promoção.

## Resultados automatizados

- Chess Arena 360: **67/67**;
- auditoria geral: **25/25 experiências, 899/899 checks, 0 falhas**;
- regressão atual: **1407/1407 execuções, 0 falhas**.

A validação perceptiva em navegador/hardware real permanece no checklist separado.

## Validação de publicação

- **483/483 rotas HTTP** responderam 200;
- **47 scripts próprios** passaram em `node --check`;
- **80 JSONs** foram parseados sem erro;
- **107 SVGs** foram parseados como XML sem erro;
- **101/101 referências** do Service Worker existem no pacote;
- comparação com v0.38.6: **20 arquivos adicionados, 26 modificados e 0 removidos**;
- o pacote final usa **482 hashes internos** (o próprio `HASHES-SHA256.txt` fica fora da auto-hashagem).

Foi tentado um smoke visual do Chess Arena 360 com Chromium headless. O processo expirou sem screenshot por erros do ambiente envolvendo DBus/UPower/zygote. Por isso, a inspeção visual, sensação da câmera, toque e frame pacing permanecem no checklist de hardware real e **não** são contabilizados como aprovação automatizada.
