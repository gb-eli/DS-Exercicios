# COSMOS DS — Entrega da Fase 13

## Objetivo

Transformar a estação espacial em uma experiência visual prioritária, com exploração 3D/360°, diferentes arquiteturas orbitais, interior e exterior, veículos, ônibus espacial, satélites, EVA, acoplamento e voo em seis graus de liberdade.

O módulo técnico da Fase 8 foi preservado. Ele continua responsável por suporte à vida, energia, manutenção, inventário e robótica detalhada. A Fase 13 funciona como camada imersiva e operacional.

## Experiência adicionada

### Estação Espacial Imersiva 360°

- abertura em tela cheia;
- HUD de baixa obstrução;
- inspeção orbital 360°;
- voo livre 6DOF;
- cabine do veículo;
- cúpula de observação;
- interior pressurizado;
- EVA;
- porta de acoplamento;
- braço robótico;
- perseguição de satélite;
- porão do ônibus espacial;
- câmera cinematográfica.

## Arquiteturas de estação

1. Horizon Modular — estação modular terrestre;
2. Skylab Heritage — laboratório orbital monolítico;
3. Gateway Lunar — posto cislunar compacto;
4. Research Ring Alpha — conceito didático de gravidade parcial.

O quarto modelo é explicitamente marcado como conceito didático, não como estação existente.

## Frota

### Veículos

- cápsula tripulada;
- cápsula de carga;
- ônibus espacial didático;
- rebocador orbital.

### Satélites

- observação terrestre;
- comunicação;
- telescópio espacial;
- enxame de CubeSats.

## Voo 6DOF

A simulação controla:

- surge: frente/trás;
- sway: direita/esquerda;
- heave: subir/descer;
- yaw: guinada;
- pitch: arfagem;
- roll: rolagem.

Também são simulados:

- consumo de RCS;
- velocidade relativa;
- distância;
- alinhamento angular;
- amortecimento;
- colisão fora do envelope;
- recuo seguro;
- acoplamento rígido;
- piloto automático.

## Gráficos

O renderizador WebGL2/GLSL inclui:

- ray marching adaptativo;
- quatro estações procedurais;
- quatro veículos;
- quatro satélites;
- Terra procedural com atmosfera, nuvens, continentes e lado noturno;
- estrelas e nebulosidade;
- materiais metálicos;
- painéis solares;
- efeito Fresnel;
- sombras aproximadas;
- interior procedural;
- objetos flutuantes;
- partículas contextuais;
- fallback Canvas 2D.

## Controles

### Teclado e mouse

- WASD: translação;
- Q/E: descer/subir;
- Z/X: roll;
- mouse: yaw/pitch;
- Shift: impulso ampliado;
- C: trocar câmera;
- B: trocar estação;
- V: trocar veículo;
- N: trocar satélite;
- K: piloto automático;
- P: modo fotográfico;
- R: recentralizar;
- O: visão geral.

### Mobile e gamepad

- joystick esquerdo: translação;
- joystick direito: câmera;
- botões dedicados para lift e roll;
- Gamepad API com analógicos, gatilhos e botões superiores.

## Progressão

- cinco inspeções visuais: 500 XP;
- três arquiteturas visitadas: 240 XP;
- quatro satélites: 360 XP;
- frota de satélites concluída: 160 XP;
- acoplamento seguro: 520 XP;
- certificação final: 450 XP.

Total possível da fase: 2.230 XP.

## Desempenho

- carregamento lazy do laboratório;
- Worker separado da renderização;
- resolução interna adaptativa;
- ray marching adaptativo;
- partículas reduzidas no modo Desempenho;
- Reduzir movimento respeitado;
- Canvas 2D como fallback;
- cancelamento de RAF;
- encerramento de Worker;
- liberação de buffer, VAO e programa WebGL;
- tratamento de perda e restauração de contexto.

## Pacotes de publicação

A entrega inclui:

- pacote completo da Fase 13;
- pacote incremental com 27 arquivos novos ou alterados;
- lista exata de caminhos;
- ordem de upload;
- checksums SHA-256.

O pacote incremental foi aplicado sobre uma Fase 12 limpa e produziu uma estrutura binariamente idêntica ao pacote completo.
