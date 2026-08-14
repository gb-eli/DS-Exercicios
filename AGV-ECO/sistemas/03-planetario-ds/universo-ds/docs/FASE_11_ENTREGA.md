# COSMOS DS — Entrega da Fase 11

## Objetivo

Iniciar o novo ciclo de remaster gráfico com uma experiência predominantemente visual, jogável e navegável. O aluno entra diretamente no espaço, sem abrir primeiro uma tela carregada de texto.

## Laboratório adicionado

### Sistema Solar Imersivo 360°

O módulo é carregado por `import()` e ocupa a tela inteira. A barra tradicional do portal é removida enquanto a experiência está aberta, deixando somente a HUD operacional.

### Corpos disponíveis

- Sol;
- Mercúrio;
- Vênus;
- Terra;
- Lua;
- Marte;
- Júpiter;
- Saturno;
- Urano;
- Netuno.

### Frota orbital

- estação orbital;
- telescópio espacial;
- satélite meteorológico;
- satélite de navegação;
- satélite de comunicação;
- satélite de observação.

## Modos de câmera

1. **Inspeção 360°:** orbita o alvo, aceita zoom e piloto automático.
2. **Voo livre:** movimentação tridimensional com aceleração e câmera livre.
3. **Cinematográfico:** alterna alvos e cria uma visita automatizada.

## Controles

### Computador

- WASD: deslocamento;
- mouse: câmera;
- Q/E: descer/subir;
- Shift: aceleração;
- C: trocar câmera;
- T: próximo mundo;
- O: visão geral;
- P: modo foto;
- R: recentralizar.

### Celular e tablet

- joystick esquerdo: movimento;
- joystick direito: câmera;
- botões de subir/descer;
- seleção de planetas por dock;
- fullscreen e scan.

### Controle físico

O módulo lê os eixos e botões do primeiro gamepad disponível pela Gamepad API.

## Shaders e efeitos

- materiais procedurais diferentes para planetas rochosos, oceânicos, gasosos e gelados;
- Terra com oceanos, continentes, nuvens, iluminação noturna e atmosfera;
- Júpiter com faixas e tempestade didática;
- Saturno e Urano com anéis;
- Sol emissivo com partículas de corona;
- campo estelar e nebulosa procedural;
- linhas orbitais adaptativas;
- atmosfera por efeito Fresnel;
- brilho de seleção do alvo;
- resolução e densidade adaptadas ao perfil gráfico.

## Progressão

- 70 XP por varredura planetária inédita;
- 90 XP por satélite inédito;
- 450 XP pela certificação Navegador do Sistema Solar;
- repetição livre sem duplicação de XP.

## Carregamento e desempenho

O laboratório não faz parte do núcleo inicial. Código, shaders e dados são baixados apenas quando o estudante abre a experiência. Não foram adicionadas texturas, vídeos ou modelos externos obrigatórios.

## Compatibilidade

- WebGL2: experiência completa;
- sem WebGL2: fallback Canvas 2D;
- mouse, toque, teclado e gamepad;
- safe area para celulares;
- orientação retrato e paisagem;
- Reduzir movimento;
- alto contraste;
- perfis Desempenho, Equilibrado e Máxima Experiência.

## Empacotamento

- pacote completo: 188 arquivos;
- pacote incremental: 28 arquivos novos ou alterados em relação à Fase 10;
- ambos foram testados a partir de extrações limpas;
- a atualização incremental preserva todos os módulos e recursos anteriores.
