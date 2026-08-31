# Correções — Etapa 10 · Vale do Silício: entrada 3D e câmera

Escopo isolado: corrigir a tela preta/recorte de geometria ao entrar no Vale do Silício, sem iniciar ainda a reorganização urbana, colisões de jogador, escadas, elevadores, veículos, interiores ou laboratório.

## Diagnóstico

O spawn principal estava em `x=0, z=-30`. Na malha atual do Vale, a empresa `gitdash` está centrada em `z=-48` com profundidade de 20 m. Isso deixava o jogador a apenas 8 m da face do prédio, enquanto a câmera de terceira pessoa iniciava com yaw `PI`, posicionando sua trajetória inicial justamente para o lado da fachada.

A câmera também usava todo o `worldRoot` como raiz de colisão. Com isso, além de prédios, chão, vias e geometrias decorativas podiam participar do raycast de câmera.

Esse conjunto explica o sintoma visual de câmera presa/recortada por geometria escura, percebido como uma camada preta sobre o cenário.

## Alterações

- `VALE_SPAWN` movido para `x=0, z=-18`.
- `runtime-v2.json > world.main_spawn` sincronizado com o novo spawn.
- Praça Central / teleporte/fallback passam a reutilizar o spawn seguro.
- `enterVale()` converte `VALE_SPAWN` para coordenadas de presença em vez de manter `x=800, y=453` hardcoded.
- câmera inicial do Vale posicionada do lado aberto da praça e olhando para o personagem.
- yaw inicial alterado de `Math.PI` para `0` no Vale.
- distância/pitch iniciais suavizados (`7.6` / `.32`).
- colisão da câmera limitada às raízes dos prédios e estruturas sólidas; chão, vias, lotes e decoração deixam de bloquear a câmera.
- saída de interior deixa de usar fallback `z=-30` e usa `VALE_SPAWN`.

## Validação

- `node --check lobby/assets/vale3d.js`: PASS.
- `node --check lobby/assets/lobby.js`: PASS.
- `core/tools/validate-vale-entry-v65.mjs`: 9/9 PASS.
- distância livre mínima do spawn atual até um prédio: 20,0 m.
- `validate-campus-city-v62.mjs`: PASS.
- `validate-campus-interiors-v63.mjs`: PASS.
- `validate-campus-live-v64.mjs`: PASS.
- `validate-campus-mobility-v65.mjs`: PASS.
- `validate-unified-auth-v59.mjs`: PASS.
- suíte geral: 359/368 PASS, exatamente as mesmas 9 falhas da Etapa 9.

## Fora do escopo desta etapa

Não foram alterados nesta fase: layout urbano do Vale, largura das ruas, faixas de pedestre, poluição visual, colisões do jogador, escadas, elevadores, montanha-russa, veículos utilizáveis, modularização dos interiores ou adaptações do Laboratório. Esses itens ficam para as fases seguintes, conforme combinado.
