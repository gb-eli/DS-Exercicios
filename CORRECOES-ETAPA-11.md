# Correções — Etapa 11 · Vale do Silício: física e circulação

Escopo isolado: corrigir colisões do jogador, atravessamento de geometrias, aproximação de entradas, degraus e posições inseguras de teleporte/saída no Vale do Silício 3D. Não inclui ainda redesenho urbano, poluição visual, ruas, veículos dirigíveis, atrações, interiores avançados ou o Laboratório.

## Diagnóstico

O runtime do Vale possuía 27 prédios ativos e 16 deles usam rotações diferentes de 0/180 graus. A colisão do jogador, porém, tratava todos como caixas alinhadas aos eixos X/Z (`AABB`). Isso criava dois problemas reais:

- áreas vazias podiam virar barreiras invisíveis;
- cantos de prédios rotacionados podiam ficar fora do colisor e ser atravessados.

O personagem também era tratado praticamente como um ponto, o deslocamento de cada frame não era subdividido e os veículos terrestres não participavam da barreira física. Em FPS baixo ou corrida, isso aumentava a possibilidade de atravessamento de objetos.

As entradas declaravam `walkable_entry` e `stairs_have_collision` no dataset, mas o renderer 3D não materializava degraus caminháveis. A saída de interiores ainda aplicava um deslocamento global em Z, inadequado para prédios rotacionados.

## Alterações

- colisão de prédios substituída por OBB (caixa orientada) usando a rotação real de cada lote;
- personagem passou a usar raio físico (`PLAYER_RADIUS = 0.82 m`);
- movimento horizontal subdividido em passos de até aproximadamente 0,42 m para reduzir tunneling em corrida/FPS baixo;
- aproximação da porta possui faixa física própria, sem transformar a fachada inteira em área atravessável;
- entradas caminháveis geram três degraus baixos e a altura do avatar acompanha a superfície;
- salto continua sendo uma altura adicional sobre a superfície atual, evitando atravessar piso/degrau;
- veículos terrestres passam a bloquear o jogador; drone/aeronave alta não vira obstáculo no chão;
- teleporte procura ponto livre próximo quando o destino solicitado estiver ocupado;
- saída de interior retorna para uma posição exterior segura, sem `z -= 7` fixo;
- limites físicos do Vale consideram o raio do avatar, evitando metade do personagem para fora do mapa.

## Validação

- `node --check lobby/assets/vale3d.js`: PASS;
- `validate-vale-physics-v65.mjs`: 12/12 PASS;
- regressão `validate-vale-entry-v65.mjs`: 9/9 PASS;
- 16 prédios rotacionados detectados no dataset e cobertos pelo novo modelo OBB;
- 27/27 prédios ativos declaram colisão habilitada e entrada caminhável;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral: 359/368 PASS, com as mesmas 9 falhas preexistentes da Etapa 10.

## Fora do escopo desta etapa

Não foram redesenhados nesta fase: ruas, faixas de pedestre, lotes, distribuição dos prédios, céu, poluição visual, praça, trilhos, montanha-russa, escorregador, mirante, veículos dirigíveis, interiores modularizados, escadas/elevadores do Campus principal ou adaptações do Laboratório. Esses itens continuam separados nas próximas fases.
