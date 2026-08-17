# Relatório de validação — Fase 7.18 · Fliperama DS v0.37.0

## Escopo

Primeira entrega do ciclo de jogos novos: **Multiplayer Local Core + Duo Elementos DS**.

## Implementação

### Multiplayer Local Core
- estado independente de Jogador 1 e Jogador 2;
- modo solo com personagem ativo;
- modo local com entradas simultâneas;
- polling de até dois gamepads;
- ações desacopladas do dispositivo físico;
- base reutilizável para xadrez, kart, esportes e jogos cooperativos futuros.

### Duo Elementos DS
Campanha com oito fases: Estação de Sincronia, Travas Térmicas, Fluxos Cruzados, Relé Duplo, Câmara de Pressão, Arquivo de Núcleos, Torres Gêmeas e Câmara Nexus.

A experiência contém física AABB, gravidade, coyote time, jump buffer, perigos elementais, relés, gates, núcleos, checkpoints, duas saídas, partículas, feedback sonoro, modo solo, multiplayer local, touch e gamepad.

### Carregamento e desempenho
O jogo vive em `games/duo-elementos-ds/` e é carregado em iframe somente quando aberto. Os arquivos pesados do jogo não são pré-carregados pelo shell do Service Worker.

## Defeitos encontrados durante a fase
1. A fase 8 tinha inicialmente um relé Aqua atrás da barreira que dependia dele. A barreira foi movida e a dependência deixou de ser circular.
2. O perfil externo `game-profiles.json` não havia sido sincronizado na primeira montagem. Foi corrigido; a auditoria CPU/multiplayer passou em 121/121.
3. Uma expectativa histórica da suíte 3D v0.30.0 ainda exigia schema 2. O runtime atual permanece corretamente em schema 3 e é validado pela suíte moderna v0.36.2; nenhum save foi rebaixado.

## Validação
- Duo Elementos: **88/88**;
- 19 jogos auditados, **19 aprovados**;
- auditoria geral: **204 aprovações**;
- CPU/multiplayer: **121/121**;
- arcade: **37/37**;
- conteúdo educacional: **126/126**;
- Museu/Linha do Tempo: **62/62**;
- UX: **25/25**;
- física: **18/18**;
- campanhas 3D atuais: **28/28**;
- VoxelCraft atual: **26/26**;
- regressão consolidada: **735 aprovações, 0 falhas**.

## Limitação de playtest
A validação automatizada cobre estrutura, lógica e alcançabilidade. Controles simultâneos touch/gamepad, percepção de áudio e conforto visual devem ser confirmados também em hardware real conforme o checklist.

## Publicação e integridade
- JavaScript: **27** arquivos válidos;
- JSON: **41** arquivos válidos;
- SVG: **89** arquivos válidos;
- HTTP: **312/312** arquivos e rotas responderam 200 antes do empacotamento;
- Chromium headless: tentativa encerrada por timeout/DBus, sem screenshot e sem contabilização como aprovação visual.
