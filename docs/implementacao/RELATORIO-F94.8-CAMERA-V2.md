# F94.8 — Camera V2

Base: **F94.7 — Locomoção Real Unificada**  
Release técnica: **14.10.8.96 / stage70-f948-camera-v2**

## Objetivo

Padronizar a câmera dos runtimes 3D e corrigir os problemas relatados de eixo vertical, impossibilidade de olhar para o céu, diferença de sensibilidade entre mapas, câmera de veículos e limitação do Mirante.

## Entregas

### CameraController V2
- pitch passa a representar **direção real do olhar**;
- arrastar para cima olha para cima no padrão normal;
- **Invert Y** real e persistente;
- terceira pessoa deixa de usar `camera.lookAt(player)` como orientação fixa;
- primeira pessoa, terceira pessoa, ampla, Campus e aérea compartilham a mesma convenção de yaw/pitch;
- sensibilidade global padronizada em **0,35× a 2,50×**;
- FOV global preservado;
- colisão de câmera revalida a lista de raízes ao trocar exterior/interior, mesmo quando a quantidade de roots é igual;
- suporte a `setInputEnabled()` para experiências que assumem temporariamente o controle óptico.

### Câmera de veículos
- preset **vehicle** para veículos terrestres;
- preset **aerial** preservado e integrado à nova convenção;
- preset **cockpit** criado como fundação para Vehicle Core V2;
- câmera acompanha heading do veículo com suavização e ainda permite free-look;
- Campus restaura o modo de câmera anterior ao sair do veículo;
- rover Lunar e rover Marciano passam a usar câmera de veículo e restauram a câmera anterior ao sair.

### Mirante 360° / 50×
- panorâmica livre por arraste diretamente no canvas;
- yaw sem limite para rotação horizontal de **360°**;
- pitch vertical amplo;
- zoom óptico de **1× a 50×**;
- FOV calculado por equivalência óptica (`2*atan(tan(base/2)/zoom)`), chegando a ~1,3° em 50× a partir de 60°;
- retículo central não interativo;
- marcos continuam disponíveis para apontamento automático;
- ao mover manualmente o binóculo, o foco automático é liberado;
- a cena continua sendo a cena viva do Campus, portanto NPCs, veículos, iluminação e demais atualizações permanecem visíveis em tempo real.

## Compatibilidade

Não houve alteração de backend, Supabase, migrations ou Edge Functions.

A arquitetura continua em Three.js, conforme o Prompt Mestre. Rapier, Vehicle Core V2, Interaction V2 e Colyseus permanecem fases posteriores.

## Limites desta fase

- não implementa física veicular Rapier;
- não transforma todos os veículos decorativos em dirigíveis;
- não implementa ainda câmera interna/cockpit selecionável pela UI;
- não altera a câmera das câmeras de segurança, que permanecem um sistema separado;
- não houve captura visual real em navegador neste ambiente; a validação desta fase é estrutural, sintática e por harness matemático.

## Próxima fase

**F94.9 — Interaction V2**: contrato único de interação, estados animados, feedback real e remoção de botões que apenas exibem texto quando deveriam executar uma ação.
