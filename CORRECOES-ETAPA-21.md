# CORREÇÕES — ETAPA 21

## Vale do Silício — minimapa fullscreen sobre o mundo 3D

Escopo: corrigir exclusivamente a camada fixa que cobria o Vale 3D, sem alterar urbanismo, física, câmera, interiores, banco ou autenticação.

### Diagnóstico confirmado pelas fotos

O elemento visível na frente do WebGL era o próprio `#vale-minimap`: os dois eixos centrais e os pequenos pontos das fotos coincidem com a rotina `renderValeMinimap()`.

A causa estava no CSS:

- `.game-stage canvas` aplicava `position:absolute`, `inset:0`, `width:100%` e `height:100%` a **todo canvas** dentro do Lobby;
- essa regra tinha especificidade maior que `.vale-minimap`;
- portanto o canvas auxiliar herdava a caixa fullscreen do `#game3d` e era desenhado sobre o mundo 3D com `z-index:18`.

### Correção

- o fullscreen passou a pertencer exclusivamente a `#game3d`;
- a regra de cursor também passou a afetar apenas `#game3d`;
- o minimapa agora limpa explicitamente `inset/left/bottom` e ancora em `top/right`;
- limite físico adicional de 160 × 160 px em desktop, 104 × 104 px em tablet e 92 × 92 px em landscape baixo;
- `#vale-minimap` continua oculto fora do Vale 3D e fora de interiores;
- o renderer WebGL e a rotina 2D do minimapa continuam em canvases independentes;
- cache-bust do CSS alterado para `14.10.8.65-stage21` no HTML e no Service Worker para impedir reaproveitamento da folha defeituosa já armazenada pelo navegador.

### Segurança de escopo

- nenhuma coordenada do Vale alterada;
- nenhum LOD, fog, física ou spawn alterado nesta etapa;
- nenhum interior alterado;
- sem migration, Edge Function ou alteração de banco.

## Validação

- `validate-vale-minimap-overlay-stage21-v65.mjs`: **11/11 PASS**;
- regressões das Etapas 10–20: **PASS**;
- Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: **PASS**;
- suíte completa: **368/376 PASS**;
- as mesmas 8 falhas históricas permanecem fora deste escopo.
