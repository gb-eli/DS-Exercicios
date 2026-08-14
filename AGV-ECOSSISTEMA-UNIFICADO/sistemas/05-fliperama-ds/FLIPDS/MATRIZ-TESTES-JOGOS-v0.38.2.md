# Matriz de testes dos jogos — Fliperama DS v0.37.2

Gerada em: 2026-08-08T12:39:31.465Z

- Jogos analisados: **23**
- Aprovados nesta camada: **22**
- Com verificações pendentes de playtest: **0**
- Com falha automatizada: **1**
- Verificações aprovadas: **692**
- Alertas: **0**
- Falhas: **3**

## Resultados por jogo

### Vector Tennis — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### Space Blocks — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### Vector Fleet — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### Reator de Blocos — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### Sentinela Orbital — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### Trap Lab — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Estrutura da fase 1:** Um início e uma saída foram encontrados.
- **APROVADO — Estrutura da fase 2:** Um início e uma saída foram encontrados.
- **APROVADO — Estrutura da fase 3:** Um início e uma saída foram encontrados.
- **APROVADO — Estrutura da fase 4:** Um início e uma saída foram encontrados.
- **APROVADO — Estrutura da fase 5:** Um início e uma saída foram encontrados.
- **APROVADO — Estrutura da fase 6:** Um início e uma saída foram encontrados.
- **APROVADO — Registro de checkpoint:** O checkpoint emite um único evento ao ser alcançado.
- **APROVADO — percurso explorador:** As 6 fases foram atravessadas pelo agente físico no modo explorador, incluindo portões e terminal final.
- **APROVADO — percurso programador:** As 6 fases foram atravessadas pelo agente físico no modo programador, incluindo portões e terminal final.
- **APROVADO — percurso precisao:** As 6 fases foram atravessadas pelo agente físico no modo precisao, incluindo portões e terminal final.
- **APROVADO — coyote time:** O salto ainda é aceito logo após o personagem deixar uma borda.
- **APROVADO — jump buffer:** Um comando de salto realizado pouco antes da aterrissagem é executado ao tocar o chão.
- **APROVADO — migração de save:** Saves schema 1 são migrados para o novo estado físico schema 2.

### Labirinto de Dados — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Alcançabilidade da fase 1:** 211/211 células caminháveis acessíveis; 205 coletas válidas.
- **APROVADO — Alcançabilidade da fase 2:** 223/223 células caminháveis acessíveis; 217 coletas válidas.
- **APROVADO — Alcançabilidade da fase 3:** 207/207 células caminháveis acessíveis; 201 coletas válidas.
- **APROVADO — Alcançabilidade da fase 4:** 223/223 células caminháveis acessíveis; 217 coletas válidas.
- **APROVADO — Alcançabilidade da fase 5:** 241/241 células caminháveis acessíveis; 235 coletas válidas.
- **APROVADO — Progressão entre mapas:** 5 fases avançam e a última condição gera vitória.

### Aventura de Salas — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Grafo das 12 salas:** 46 entidades e transições verificadas sem bloqueio local.

### Raster Rally — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### State Quest RPG — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Objetivos e transições:** 31 entidades e saídas acessíveis, incluindo o Console do Núcleo.

### Ponte 8→16 Bits — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Fragmentos e portal:** 15 fragmentos únicos posicionados dentro do mundo; 12 exigidos.
- **APROVADO — envelope vertical:** Todas as plataformas exigem no máximo 130.0 px de subida para um salto capaz de 137.3 px.
- **APROVADO — aterrissagem nas plataformas:** As 17 plataformas podem ser alcançadas diretamente por um salto de recuperação.
- **APROVADO — salto sobre perigos:** Os 9 perigos foram atravessados sem perda de vida em simulação física.
- **APROVADO — fragmentos alcançáveis:** Todos os 15 fragmentos estão associados a plataformas alcançáveis e dentro da área de coleta ampliada.
- **APROVADO — checkpoints seguros:** Nenhum respawn de checkpoint sobrepõe uma área de dano.
- **APROVADO — quarta zona:** O setor intermediário registra corretamente a Zona 4.
- **APROVADO — quinta zona:** A expansão registra corretamente a Zona 5.
- **APROVADO — sexta zona:** A expansão registra corretamente a Zona 6.
- **APROVADO — portal final:** O portal conclui a experiência quando 12 fragmentos foram coletados.
- **APROVADO — coyote time:** O salto de borda é aceito dentro da janela de tolerância.
- **APROVADO — jump buffer:** O salto antecipado é executado após a aterrissagem.
- **APROVADO — migração de save:** Saves schema 1 são migrados para o novo estado físico schema 2.

### Corredores Raycast — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Missão completa por busca de estados:** Rota encontrada com 2 chaves e 3 terminais; 3829 estados analisados.

### Setor Poligonal 94 — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Objetivos da arena 3D:** 6 núcleos/lentes, checkpoints e portal posicionados fora dos colisores.
- **APROVADO — plataforma alta bloqueia lateral:** A plataforma central bloqueia a entrada pelo chão, mas aceita o avatar sobre sua superfície.
- **APROVADO — sem subida instantânea:** O avatar não pode subir diretamente para 2,7 m apenas entrando no volume da plataforma.
- **APROVADO — rampa progressiva:** A rampa central sobe progressivamente do solo ao topo da plataforma.
- **APROVADO — percurso completo:** Núcleos/lentes, checkpoints, rampa central e portal pertencem ao mesmo percurso navegável.
- **APROVADO — coyote time:** O salto ainda é aceito por alguns milissegundos após deixar uma borda.
- **APROVADO — jump buffer:** O salto pressionado pouco antes da aterrissagem é executado automaticamente.
- **APROVADO — sensibilidade:** O nível Alto produz rotação perceptivelmente maior que o nível Médio.
- **APROVADO — arraste de câmera:** Arraste horizontal gira o avatar e arraste vertical altera a inclinação da câmera.
- **APROVADO — recuperação anti-travamento:** Posições inválidas retornam ao último ponto seguro.
- **APROVADO — câmera fora dos obstáculos:** A posição final da câmera não fica dentro de paredes, pilares ou plataformas.
- **APROVADO — migração de save:** Save schema 1 é convertido para schema 2 com os novos campos físicos e de câmera.
- **APROVADO — portal exige aprendizagem:** Coletar os itens sem experimentar câmeras/material/FOV não libera o portal.
- **APROVADO — portal educativo:** O portal é concluível depois de cumprir as coletas e comparações educativas.

### Câmeras em Evolução — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Objetivos da arena 3D:** 6 núcleos/lentes, checkpoints e portal posicionados fora dos colisores.
- **APROVADO — plataforma alta bloqueia lateral:** A plataforma central bloqueia a entrada pelo chão, mas aceita o avatar sobre sua superfície.
- **APROVADO — sem subida instantânea:** O avatar não pode subir diretamente para 2,7 m apenas entrando no volume da plataforma.
- **APROVADO — rampa progressiva:** A rampa central sobe progressivamente do solo ao topo da plataforma.
- **APROVADO — percurso completo:** Núcleos/lentes, checkpoints, rampa central e portal pertencem ao mesmo percurso navegável.
- **APROVADO — coyote time:** O salto ainda é aceito por alguns milissegundos após deixar uma borda.
- **APROVADO — jump buffer:** O salto pressionado pouco antes da aterrissagem é executado automaticamente.
- **APROVADO — sensibilidade:** O nível Alto produz rotação perceptivelmente maior que o nível Médio.
- **APROVADO — arraste de câmera:** Arraste horizontal gira o avatar e arraste vertical altera a inclinação da câmera.
- **APROVADO — recuperação anti-travamento:** Posições inválidas retornam ao último ponto seguro.
- **APROVADO — câmera fora dos obstáculos:** A posição final da câmera não fica dentro de paredes, pilares ou plataformas.
- **APROVADO — migração de save:** Save schema 1 é convertido para schema 2 com os novos campos físicos e de câmera.
- **APROVADO — portal exige aprendizagem:** Coletar os itens sem experimentar câmeras/material/FOV não libera o portal.
- **APROVADO — portal educativo:** O portal é concluível depois de cumprir as coletas e comparações educativas.

### Board Arena — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Jogo da Velha · iniciante:** Turno da CPU separado, atraso visual e resposta concluída.
- **APROVADO — Jogo da Velha · normal:** Turno da CPU separado, atraso visual e resposta concluída.
- **APROVADO — Jogo da Velha · estrategista:** Turno da CPU separado, atraso visual e resposta concluída.
- **APROVADO — Jogo da Velha · mestre:** Turno da CPU separado, atraso visual e resposta concluída.
- **APROVADO — Minimax Mestre:** A CPU Mestre não perdeu em 100 partidas contra jogadas aleatórias.
- **APROVADO — Aleatoriedade controlada:** 7 respostas diferentes observadas no nível Iniciante.
- **APROVADO — Dama · iniciante:** Destinos legais, tempo de análise e retorno de turno validados.
- **APROVADO — Dama · normal:** Destinos legais, tempo de análise e retorno de turno validados.
- **APROVADO — Dama · estrategista:** Destinos legais, tempo de análise e retorno de turno validados.
- **APROVADO — Dama · mestre:** Destinos legais, tempo de análise e retorno de turno validados.
- **APROVADO — Captura encadeada:** Duas capturas consecutivas foram exigidas e contabilizadas com a mesma peça.
- **APROVADO — Migração de save antigo:** Save schema 1 / Aprendiz convertido para schema 3 / Iniciante com adversário CPU.

### Puzzle Forge — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Labirinto padrão:** Saída alcançável em 12 movimentos mínimos.
- **APROVADO — Proteção do editor:** Um layout totalmente bloqueado foi reparado com rota de 12 movimentos.

### Motion Beat DS — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### VoxelCraft DS — APROVADO

- **APROVADO — Schema de save 11:** O sanitizador converte estados antigos para o schema 11.
- **APROVADO — Sanitização de jogador:** Vida, fome, câmera e inclinação permanecem dentro dos limites.
- **APROVADO — Sanitização de edições:** Chaves e tipos inválidos são descartados.
- **APROVADO — Sanitização de inventário:** Itens desconhecidos são removidos e quantidades são limitadas.
- **APROVADO — Fallback localStorage:** Sem IndexedDB, o mundo permanece persistente no localStorage.
- **APROVADO — Fallback em memória:** Quando os armazenamentos persistentes falham, a sessão continua em memória.
- **APROVADO — Three.js local:** O renderizador não depende de CDN externa.
- **APROVADO — Spawn e recuperação seguros:** Saves inválidos e quedas recuperam o personagem.
- **APROVADO — Proteção contra autoaprisionamento:** Não é permitido colocar um bloco dentro do personagem.
- **APROVADO — Bordas de chunks:** A edição na borda reconstrói os chunks vizinhos.
- **APROVADO — Coyote time e jump buffer:** Saltos toleram borda e comando antecipado.
- **APROVADO — Câmera com colisão:** A terceira pessoa recua antes do terreno.
- **APROVADO — Pointer Lock com fallback:** Falhas de captura do mouse geram orientação e comandos alternativos.
- **APROVADO — Suporte a gamepad:** Movimento, câmera e ações principais possuem mapeamento de controle.
- **APROVADO — Limite de edições:** O mundo bloqueia crescimento indefinido do mapa de edições.
- **APROVADO — Modo seguro automático:** Falhas de GPU podem reiniciar o módulo no perfil Econômico.
- **APROVADO — Fila de salvamento:** Gravações simultâneas são serializadas.
- **APROVADO — Interface de modo seguro:** A interface oferece recuperação e informa o backend de armazenamento.
- **APROVADO — Manifesto atualizado:** Manifesto identifica a integração 12, schema 11 e estado jogável.
- **APROVADO — Catálogo jogável:** O VoxelCraft permanece jogável e carregável nas versões posteriores à Fase 7.12.
- **APROVADO — Cache offline completo:** Todos os arquivos essenciais do VoxelCraft estão no shell offline.
- **APROVADO — Comunicação segura do iframe:** Mensagens de erro e modo seguro chegam ao runtime principal.

### Duo Elementos DS — APROVADO

- **APROVADO — Manifesto de níveis usa schema 1:** OK
- **APROVADO — Campanha possui 8 fases:** 8 fases
- **APROVADO — IDs das fases são 1..8:** OK
- **APROVADO — Títulos das fases são únicos:** OK
- **APROVADO — Mundo lógico 960×540:** OK
- **APROVADO — Fase 1: relés únicos:** OK
- **APROVADO — Fase 1: gates únicos:** OK
- **APROVADO — Fase 1: requisitos de gates existem:** OK
- **APROVADO — Fase 1: gates desbloqueáveis:** 0/0
- **APROVADO — Fase 1: saídas dos dois elementos:** OK
- **APROVADO — Fase 1: spawns válidos:** OK
- **APROVADO — Fase 1: objetivos definidos:** OK
- **APROVADO — Fase 2: relés únicos:** fire-a, water-a
- **APROVADO — Fase 2: gates únicos:** gate-a
- **APROVADO — Fase 2: requisitos de gates existem:** OK
- **APROVADO — Fase 2: gates desbloqueáveis:** 1/1
- **APROVADO — Fase 2: saídas dos dois elementos:** OK
- **APROVADO — Fase 2: spawns válidos:** OK
- **APROVADO — Fase 2: objetivos definidos:** OK
- **APROVADO — Fase 3: relés únicos:** OK
- **APROVADO — Fase 3: gates únicos:** OK
- **APROVADO — Fase 3: requisitos de gates existem:** OK
- **APROVADO — Fase 3: gates desbloqueáveis:** 0/0
- **APROVADO — Fase 3: saídas dos dois elementos:** OK
- **APROVADO — Fase 3: spawns válidos:** OK
- **APROVADO — Fase 3: objetivos definidos:** OK
- **APROVADO — Fase 4: relés únicos:** fire-b, water-b
- **APROVADO — Fase 4: gates únicos:** gate-b1, gate-b2
- **APROVADO — Fase 4: requisitos de gates existem:** OK
- **APROVADO — Fase 4: gates desbloqueáveis:** 2/2
- **APROVADO — Fase 4: saídas dos dois elementos:** OK
- **APROVADO — Fase 4: spawns válidos:** OK
- **APROVADO — Fase 4: objetivos definidos:** OK
- **APROVADO — Fase 5: relés únicos:** fire-c, water-c
- **APROVADO — Fase 5: gates únicos:** gate-c1, gate-c2
- **APROVADO — Fase 5: requisitos de gates existem:** OK
- **APROVADO — Fase 5: gates desbloqueáveis:** 2/2
- **APROVADO — Fase 5: saídas dos dois elementos:** OK
- **APROVADO — Fase 5: spawns válidos:** OK
- **APROVADO — Fase 5: objetivos definidos:** OK
- **APROVADO — Fase 6: relés únicos:** archive-fire, archive-water
- **APROVADO — Fase 6: gates únicos:** archive-gate1, archive-gate2
- **APROVADO — Fase 6: requisitos de gates existem:** OK
- **APROVADO — Fase 6: gates desbloqueáveis:** 2/2
- **APROVADO — Fase 6: saídas dos dois elementos:** OK
- **APROVADO — Fase 6: spawns válidos:** OK
- **APROVADO — Fase 6: objetivos definidos:** OK
- **APROVADO — Fase 7: relés únicos:** tower-fire, tower-water
- **APROVADO — Fase 7: gates únicos:** tower-gate
- **APROVADO — Fase 7: requisitos de gates existem:** OK
- **APROVADO — Fase 7: gates desbloqueáveis:** 1/1
- **APROVADO — Fase 7: saídas dos dois elementos:** OK
- **APROVADO — Fase 7: spawns válidos:** OK
- **APROVADO — Fase 7: objetivos definidos:** OK
- **APROVADO — Fase 8: relés únicos:** nexus-f1, nexus-w1, nexus-f2, nexus-w2
- **APROVADO — Fase 8: gates únicos:** nexus-g1, nexus-g2
- **APROVADO — Fase 8: requisitos de gates existem:** OK
- **APROVADO — Fase 8: gates desbloqueáveis:** 2/2
- **APROVADO — Fase 8: saídas dos dois elementos:** OK
- **APROVADO — Fase 8: spawns válidos:** OK
- **APROVADO — Fase 8: objetivos definidos:** OK
- **APROVADO — Fase final exige quatro relés:** OK
- **APROVADO — Fase final exige seis núcleos:** OK
- **APROVADO — Torres Gêmeas começa com jogadores em lados diferentes:** OK
- **APROVADO — Há perigos de fogo, água e neutros:** OK
- **APROVADO — Há relés Ígneo e Aqua:** OK
- **APROVADO — Há núcleos específicos e neutros:** OK
- **APROVADO — Core solo mapeia controle genérico ao personagem ativo:** OK
- **APROVADO — Core solo troca personagem ativo:** OK
- **APROVADO — Core local mantém entradas independentes:** OK
- **APROVADO — Core possui polling de gamepad:** OK
- **APROVADO — HTML usa canvas e controles touch:** OK
- **APROVADO — Runtime possui coyote time e jump buffer:** OK
- **APROVADO — Runtime possui afinidade elemental:** OK
- **APROVADO — Runtime salva progresso serializável:** OK
- **APROVADO — Runtime possui checkpoints:** OK
- **APROVADO — Runtime emite conclusão da campanha:** OK
- **APROVADO — Runtime respeita redução de movimento:** OK
- **APROVADO — Runtime limita partículas em qualidade baixa:** OK
- **APROVADO — Portal registra loader do Duo:** OK
- **APROVADO — Portal registra modo solo e local:** OK
- **APROVADO — Portal registra controles independentes:** OK
- **APROVADO — Portal possui HUD específico:** OK
- **APROVADO — Portal possui resultado específico:** OK
- **APROVADO — Catálogo contém Duo Elementos:** OK
- **APROVADO — Ficha educacional externa existe:** OK
- **APROVADO — Ficha educacional possui 8 etapas:** OK
- **APROVADO — Previews e logo existem:** OK

### Plataforma Clássica DS — FALHOU

- **APROVADO — schema de fases = 1:** OK
- **APROVADO — mundo Campo dos Pixels:** OK
- **APROVADO — exatamente 6 fases:** OK
- **APROVADO — fase 1 título:** OK
- **APROVADO — fase 2 título:** OK
- **APROVADO — fase 3 título:** OK
- **APROVADO — fase 4 título:** OK
- **APROVADO — fase 5 título:** OK
- **APROVADO — fase 6 título:** OK
- **APROVADO — fase 1 largura progressiva:** OK
- **APROVADO — fase 1 possui checkpoint:** OK
- **APROVADO — fase 1 possui portal:** OK
- **APROVADO — fase 1 possui pelo menos 4 chips:** OK
- **APROVADO — fase 1 possui 1 segredo:** OK
- **APROVADO — fase 1 possui perigos:** OK
- **APROVADO — fase 1 possui inimigos:** OK
- **APROVADO — fase 1 spawn apoiado:** OK
- **APROVADO — fase 1 portal em plataforma alcançável:** platform=2
- **APROVADO — fase 1 chip 1 alcançável:** platform=3
- **APROVADO — fase 1 chip 2 alcançável:** platform=4
- **APROVADO — fase 1 chip 3 alcançável:** platform=5
- **APROVADO — fase 1 chip 4 alcançável:** platform=8
- **APROVADO — fase 1 segredo 1 alcançável:** platform=4
- **APROVADO — fase 1 checkpoint fora de perigo:** OK
- **APROVADO — fase 1 spawn fora de perigo:** OK
- **APROVADO — fase 2 largura progressiva:** OK
- **APROVADO — fase 2 possui checkpoint:** OK
- **APROVADO — fase 2 possui portal:** OK
- **APROVADO — fase 2 possui pelo menos 4 chips:** OK
- **APROVADO — fase 2 possui 1 segredo:** OK
- **APROVADO — fase 2 possui perigos:** OK
- **APROVADO — fase 2 possui inimigos:** OK
- **APROVADO — fase 2 spawn apoiado:** OK
- **APROVADO — fase 2 portal em plataforma alcançável:** platform=3
- **APROVADO — fase 2 chip 1 alcançável:** platform=4
- **APROVADO — fase 2 chip 2 alcançável:** platform=5
- **APROVADO — fase 2 chip 3 alcançável:** platform=7
- **APROVADO — fase 2 chip 4 alcançável:** platform=9
- **APROVADO — fase 2 chip 5 alcançável:** platform=12
- **APROVADO — fase 2 segredo 1 alcançável:** platform=11
- **APROVADO — fase 2 checkpoint fora de perigo:** OK
- **APROVADO — fase 2 spawn fora de perigo:** OK
- **APROVADO — fase 3 largura progressiva:** OK
- **APROVADO — fase 3 possui checkpoint:** OK
- **APROVADO — fase 3 possui portal:** OK
- **APROVADO — fase 3 possui pelo menos 4 chips:** OK
- **APROVADO — fase 3 possui 1 segredo:** OK
- **APROVADO — fase 3 possui perigos:** OK
- **APROVADO — fase 3 possui inimigos:** OK
- **APROVADO — fase 3 spawn apoiado:** OK
- **APROVADO — fase 3 portal em plataforma alcançável:** platform=4
- **APROVADO — fase 3 chip 1 alcançável:** platform=5
- **APROVADO — fase 3 chip 2 alcançável:** platform=6
- **APROVADO — fase 3 chip 3 alcançável:** platform=8
- **APROVADO — fase 3 chip 4 alcançável:** platform=12
- **APROVADO — fase 3 chip 5 alcançável:** platform=14
- **APROVADO — fase 3 segredo 1 alcançável:** platform=10
- **APROVADO — fase 3 checkpoint fora de perigo:** OK
- **APROVADO — fase 3 spawn fora de perigo:** OK
- **APROVADO — fase 4 largura progressiva:** OK
- **APROVADO — fase 4 possui checkpoint:** OK
- **APROVADO — fase 4 possui portal:** OK
- **APROVADO — fase 4 possui pelo menos 4 chips:** OK
- **APROVADO — fase 4 possui 1 segredo:** OK
- **APROVADO — fase 4 possui perigos:** OK
- **APROVADO — fase 4 possui inimigos:** OK
- **APROVADO — fase 4 spawn apoiado:** OK
- **APROVADO — fase 4 portal em plataforma alcançável:** platform=4
- **APROVADO — fase 4 chip 1 alcançável:** platform=5
- **APROVADO — fase 4 chip 2 alcançável:** platform=6
- **APROVADO — fase 4 chip 3 alcançável:** platform=8
- **APROVADO — fase 4 chip 4 alcançável:** platform=10
- **APROVADO — fase 4 chip 5 alcançável:** platform=12
- **APROVADO — fase 4 chip 6 alcançável:** platform=15
- **APROVADO — fase 4 segredo 1 alcançável:** platform=14
- **APROVADO — fase 4 checkpoint fora de perigo:** OK
- **APROVADO — fase 4 spawn fora de perigo:** OK
- **APROVADO — fase 5 largura progressiva:** OK
- **APROVADO — fase 5 possui checkpoint:** OK
- **APROVADO — fase 5 possui portal:** OK
- **APROVADO — fase 5 possui pelo menos 4 chips:** OK
- **APROVADO — fase 5 possui 1 segredo:** OK
- **APROVADO — fase 5 possui perigos:** OK
- **APROVADO — fase 5 possui inimigos:** OK
- **APROVADO — fase 5 spawn apoiado:** OK
- **APROVADO — fase 5 portal em plataforma alcançável:** platform=5
- **APROVADO — fase 5 chip 1 alcançável:** platform=6
- **APROVADO — fase 5 chip 2 alcançável:** platform=7
- **APROVADO — fase 5 chip 3 alcançável:** platform=9
- **APROVADO — fase 5 chip 4 alcançável:** platform=11
- **APROVADO — fase 5 chip 5 alcançável:** platform=15
- **APROVADO — fase 5 chip 6 alcançável:** platform=17
- **APROVADO — fase 5 segredo 1 alcançável:** platform=13
- **APROVADO — fase 5 checkpoint fora de perigo:** OK
- **APROVADO — fase 5 spawn fora de perigo:** OK
- **APROVADO — fase 6 largura progressiva:** OK
- **APROVADO — fase 6 possui checkpoint:** OK
- **APROVADO — fase 6 possui portal:** OK
- **APROVADO — fase 6 possui pelo menos 4 chips:** OK
- **APROVADO — fase 6 possui 1 segredo:** OK
- **APROVADO — fase 6 possui perigos:** OK
- **APROVADO — fase 6 possui inimigos:** OK
- **APROVADO — fase 6 spawn apoiado:** OK
- **APROVADO — fase 6 portal em plataforma alcançável:** platform=4
- **APROVADO — fase 6 chip 1 alcançável:** platform=5
- **APROVADO — fase 6 chip 2 alcançável:** platform=6
- **APROVADO — fase 6 chip 3 alcançável:** platform=8
- **APROVADO — fase 6 chip 4 alcançável:** platform=10
- **APROVADO — fase 6 chip 5 alcançável:** platform=14
- **APROVADO — fase 6 chip 6 alcançável:** platform=16
- **APROVADO — fase 6 segredo 1 alcançável:** platform=12
- **APROVADO — fase 6 checkpoint fora de perigo:** OK
- **APROVADO — fase 6 spawn fora de perigo:** OK
- **APROVADO — fase final possui boss:** OK
- **APROVADO — boss exige 3 impactos:** OK
- **APROVADO — boss é Guardião do Clock:** OK
- **APROVADO — fases 1-5 sem boss:** OK
- **APROVADO — game usa coyote time:** OK
- **APROVADO — game usa jump buffer:** OK
- **APROVADO — game possui câmera lateral:** OK
- **APROVADO — game possui Gamepad API:** OK
- **APROVADO — game possui touch:** OK
- **APROVADO — game possui checkpoint:** OK
- **APROVADO — game exige chips e boss:** OK
- **APROVADO — game possui modo histórico:** OK
- **APROVADO — game possui modo moderno:** OK
- **APROVADO — mesma simulação para os estilos:** OK
- **APROVADO — save schema 1:** OK
- **APROVADO — evento ready:** OK
- **APROVADO — evento finished:** OK
- **APROVADO — ponte de mensagem correta:** OK
- **APROVADO — runtime integrado ao loader:** OK
- **APROVADO — runtime wrapper integrado:** OK
- **APROVADO — iframe sob demanda:** OK
- **APROVADO — HUD portal 1/6:** OK
- **APROVADO — resultado Mundo 1:** OK
- **APROVADO — perfil externo existe:** OK
- **APROVADO — perfil oferece 2 estilos:** OK
- **APROVADO — perfil default moderno:** OK
- **APROVADO — ficha educacional existe:** OK
- **APROVADO — ficha declara 6 progressões:** OK
- **APROVADO — mídia logo.svg existe:** OK
- **APROVADO — mídia logo.svg acessível:** OK
- **APROVADO — mídia preview-01.svg existe:** OK
- **APROVADO — mídia preview-01.svg acessível:** OK
- **APROVADO — mídia preview-02.svg existe:** OK
- **APROVADO — mídia preview-02.svg acessível:** OK
- **FALHOU — versão pública 0.37.1:** Falha na validação.
- **FALHOU — fase pública 7.19:** Falha na validação.
- **FALHOU — app build 0.37.1:** Falha na validação.

### Mundo Plataforma DS 360 — APROVADO

- **APROVADO — schema da Vila:** OK
- **APROVADO — nome Vila Tecnológica:** OK
- **APROVADO — região marcada como village:** OK
- **APROVADO — mundo da Vila 80×72:** OK
- **APROVADO — 4 setores na Vila:** OK
- **APROVADO — Oficina presente:** OK
- **APROVADO — Estação de Dados presente:** OK
- **APROVADO — Centro de Rede presente:** OK
- **APROVADO — 3 NPCs:** OK
- **APROVADO — Lia presente:** OK
- **APROVADO — Ivo presente:** OK
- **APROVADO — Dara presente:** OK
- **APROVADO — 8 interações:** OK
- **APROVADO — 3 módulos de oficina:** OK
- **APROVADO — 3 relés:** OK
- **APROVADO — terminal de upload:** OK
- **APROVADO — núcleo da vila:** OK
- **APROVADO — 3 missões:** OK
- **APROVADO — 4 pacotes de dados:** OK
- **APROVADO — 4 checkpoints:** OK
- **APROVADO — 2 plataformas móveis:** OK
- **APROVADO — IDs da Vila únicos:** 53 IDs
- **APROVADO — lia dentro da Vila:** OK
- **APROVADO — lia não nasce em parede:** OK
- **APROVADO — ivo dentro da Vila:** OK
- **APROVADO — ivo não nasce em parede:** OK
- **APROVADO — dara dentro da Vila:** OK
- **APROVADO — dara não nasce em parede:** OK
- **APROVADO — repair-a dentro da Vila:** OK
- **APROVADO — repair-a acessível fora de parede:** OK
- **APROVADO — repair-b dentro da Vila:** OK
- **APROVADO — repair-b acessível fora de parede:** OK
- **APROVADO — repair-c dentro da Vila:** OK
- **APROVADO — repair-c acessível fora de parede:** OK
- **APROVADO — data-terminal dentro da Vila:** OK
- **APROVADO — data-terminal acessível fora de parede:** OK
- **APROVADO — relay-west dentro da Vila:** OK
- **APROVADO — relay-west acessível fora de parede:** OK
- **APROVADO — relay-east dentro da Vila:** OK
- **APROVADO — relay-east acessível fora de parede:** OK
- **APROVADO — relay-north dentro da Vila:** OK
- **APROVADO — relay-north acessível fora de parede:** OK
- **APROVADO — network-core dentro da Vila:** OK
- **APROVADO — network-core acessível fora de parede:** OK
- **APROVADO — vcp-praca dentro da Vila:** OK
- **APROVADO — vcp-praca fora de parede:** OK
- **APROVADO — vcp-praca fora de perigo:** OK
- **APROVADO — vcp-oficina dentro da Vila:** OK
- **APROVADO — vcp-oficina fora de parede:** OK
- **APROVADO — vcp-oficina fora de perigo:** OK
- **APROVADO — vcp-dados dentro da Vila:** OK
- **APROVADO — vcp-dados fora de parede:** OK
- **APROVADO — vcp-dados fora de perigo:** OK
- **APROVADO — vcp-central dentro da Vila:** OK
- **APROVADO — vcp-central fora de parede:** OK
- **APROVADO — vcp-central fora de perigo:** OK
- **APROVADO — data-a apoiado em plataforma:** OK
- **APROVADO — data-b apoiado em plataforma:** OK
- **APROVADO — data-c apoiado em plataforma:** OK
- **APROVADO — data-d apoiado em plataforma:** OK
- **APROVADO — building-workshop tem porta:** OK
- **APROVADO — building-workshop cabe na região:** OK
- **APROVADO — building-data tem porta:** OK
- **APROVADO — building-data cabe na região:** OK
- **APROVADO — building-core tem porta:** OK
- **APROVADO — building-core cabe na região:** OK
- **APROVADO — mundo começa na Região 1:** OK
- **APROVADO — save do mundo usa schema 2:** OK
- **APROVADO — mundo declara duas regiões:** OK
- **APROVADO — Portal Nexus leva à Vila:** OK
- **APROVADO — transição marca Vale concluído:** OK
- **APROVADO — transição gera region-change:** OK
- **APROVADO — Vila inicia na missão 1:** OK
- **APROVADO — portal final começa fechado:** OK
- **APROVADO — módulo não ativa antes de falar com Lia:** OK
- **APROVADO — Lia inicia missão 1:** OK
- **APROVADO — 3 módulos podem ser ativados:** OK
- **APROVADO — oficina pede retorno à Lia:** OK
- **APROVADO — missão 1 conclui e libera Ivo:** OK
- **APROVADO — Ivo libera coleta de dados:** OK
- **APROVADO — 4 pacotes podem ser coletados:** OK
- **APROVADO — coleta total libera upload:** OK
- **APROVADO — upload conclui missão 2:** OK
- **APROVADO — Dara libera relés:** OK
- **APROVADO — 3 relés podem ser ativados:** OK
- **APROVADO — relés liberam Núcleo:** OK
- **APROVADO — Núcleo libera portal final:** OK
- **APROVADO — Portal de Continuidade conclui campanha:** OK
- **APROVADO — vitória final gera evento:** OK
- **APROVADO — restore schema 2 aceita campanha concluída:** OK
- **APROVADO — restore preserva Região 2:** OK
- **APROVADO — restore preserva 4 dados:** OK
- **APROVADO — restore preserva 3 reparos:** OK
- **APROVADO — restore preserva 3 relés:** OK
- **APROVADO — restore preserva estágio 9:** OK
- **APROVADO — restore preserva conclusão final:** OK
- **APROVADO — migra save v0.38.1 incompleto:** OK
- **APROVADO — save incompleto continua no Vale:** OK
- **APROVADO — save migrado passa a schema 2:** OK
- **APROVADO — migra save v0.38.1 concluído:** OK
- **APROVADO — save concluído entra direto na Vila:** OK
- **APROVADO — migração não marca campanha nova como concluída:** OK
- **APROVADO — migração começa missão da Vila em 1:** OK
- **APROVADO — migração gera evento informativo:** OK
- **APROVADO — modo legado ainda usa schema 1:** OK
- **APROVADO — modo legado ainda conclui no Portal Nexus:** OK
- **APROVADO — render troca de região sem recarregar runtime:** OK
- **APROVADO — render cria interiores leves da Vila:** OK
- **APROVADO — render possui NPC meshes:** OK
- **APROVADO — render possui terminais interativos:** OK
- **APROVADO — perfil baixo reduz luz/decor:** OK
- **APROVADO — portal consulta simulação:** OK
- **APROVADO — game carrega village.json:** OK
- **APROVADO — tecla E interage:** OK
- **APROVADO — touch possui interact:** OK
- **APROVADO — gamepad possui interact:** OK
- **APROVADO — ready declara 2 regiões:** OK
- **APROVADO — HUD alterna Dados/Missão:** OK
- **APROVADO — ponte envia region-change:** OK
- **APROVADO — ponte envia mission:** OK
- **APROVADO — runtime wrapper reconhece 2 regiões:** OK
- **APROVADO — runtime wrapper recebe region-change:** OK
- **APROVADO — catálogo marca Fase 7.23:** OK
- **APROVADO — perfil externo inclui interação:** OK
- **APROVADO — perfil externo cita Vila:** OK
- **APROVADO — ficha educacional cita 3 missões:** OK
- **APROVADO — progressão educacional inclui Oficina:** OK
- **APROVADO — versão pública v0.38.2:** OK
- **APROVADO — Service Worker v0.38.2:** OK
- **APROVADO — Vila no cache offline:** OK
- **APROVADO — mídia logo.svg:** OK
- **APROVADO — acessibilidade logo.svg:** 1497 bytes
- **APROVADO — mídia preview-01.svg:** OK
- **APROVADO — acessibilidade preview-01.svg:** 1576 bytes
- **APROVADO — mídia preview-02.svg:** OK
- **APROVADO — acessibilidade preview-02.svg:** 3640 bytes

### Plataforma Poligonal DS 3D — APROVADO

- **APROVADO — schema do mundo:** OK
- **APROVADO — quatro áreas:** OK
- **APROVADO — nomes únicos:** OK
- **APROVADO — área 1 spawn:** OK
- **APROVADO — área 1 solo:** OK
- **APROVADO — área 1 3 fragmentos:** OK
- **APROVADO — área 1 checkpoint:** OK
- **APROVADO — área 1 portal:** OK
- **APROVADO — área 1 plataforma móvel:** OK
- **APROVADO — área 1 inimigos:** OK
- **APROVADO — a1-c1 dentro do mundo:** OK
- **APROVADO — a1-c2 dentro do mundo:** OK
- **APROVADO — a1-c3 dentro do mundo:** OK
- **APROVADO — m1 movimento válido:** OK
- **APROVADO — bugbot-1 patrulha válida:** OK
- **APROVADO — bugbot-2 patrulha válida:** OK
- **APROVADO — área 2 spawn:** OK
- **APROVADO — área 2 solo:** OK
- **APROVADO — área 2 3 fragmentos:** OK
- **APROVADO — área 2 checkpoint:** OK
- **APROVADO — área 2 portal:** OK
- **APROVADO — área 2 plataforma móvel:** OK
- **APROVADO — área 2 inimigos:** OK
- **APROVADO — a2-c1 dentro do mundo:** OK
- **APROVADO — a2-c2 dentro do mundo:** OK
- **APROVADO — a2-c3 dentro do mundo:** OK
- **APROVADO — m1 movimento válido:** OK
- **APROVADO — glitch-1 patrulha válida:** OK
- **APROVADO — glitch-2 patrulha válida:** OK
- **APROVADO — área 3 spawn:** OK
- **APROVADO — área 3 solo:** OK
- **APROVADO — área 3 3 fragmentos:** OK
- **APROVADO — área 3 checkpoint:** OK
- **APROVADO — área 3 portal:** OK
- **APROVADO — área 3 plataforma móvel:** OK
- **APROVADO — área 3 inimigos:** OK
- **APROVADO — a3-c1 dentro do mundo:** OK
- **APROVADO — a3-c2 dentro do mundo:** OK
- **APROVADO — a3-c3 dentro do mundo:** OK
- **APROVADO — m1 movimento válido:** OK
- **APROVADO — sentinel-1 patrulha válida:** OK
- **APROVADO — sentinel-2 patrulha válida:** OK
- **APROVADO — área 4 spawn:** OK
- **APROVADO — área 4 solo:** OK
- **APROVADO — área 4 3 fragmentos:** OK
- **APROVADO — área 4 checkpoint:** OK
- **APROVADO — área 4 portal:** OK
- **APROVADO — área 4 plataforma móvel:** OK
- **APROVADO — área 4 inimigos:** OK
- **APROVADO — a4-c1 dentro do mundo:** OK
- **APROVADO — a4-c2 dentro do mundo:** OK
- **APROVADO — a4-c3 dentro do mundo:** OK
- **APROVADO — m1 movimento válido:** OK
- **APROVADO — guardian-1 patrulha válida:** OK
- **APROVADO — guardian-2 patrulha válida:** OK
- **APROVADO — 12 fragmentos totais:** OK
- **APROVADO — 8 inimigos totais:** OK
- **APROVADO — 4 plataformas móveis:** OK
- **APROVADO — Three.js local:** OK
- **APROVADO — câmera perspectiva:** OK
- **APROVADO — câmera follow suave:** OK
- **APROVADO — gravidade:** OK
- **APROVADO — coyote time:** OK
- **APROVADO — jump buffer:** OK
- **APROVADO — colisão topo 3D:** OK
- **APROVADO — plataforma móvel carrega jogador:** OK
- **APROVADO — gamepad:** OK
- **APROVADO — touch:** OK
- **APROVADO — arraste câmera:** OK
- **APROVADO — save schema 1:** OK
- **APROVADO — save de fragmentos:** OK
- **APROVADO — checkpoint salvo:** OK
- **APROVADO — portal exige 3:** OK
- **APROVADO — vitória 12 fragmentos:** OK
- **APROVADO — mensagem portal:** OK
- **APROVADO — runtime loader:** OK
- **APROVADO — runtime wrapper:** OK
- **APROVADO — iframe isolado:** OK
- **APROVADO — perfil externo:** OK
- **APROVADO — ficha educacional:** OK
- **APROVADO — 4 progressões:** OK
- **APROVADO — mídia logo.svg:** OK
- **APROVADO — acessibilidade logo.svg:** OK
- **APROVADO — mídia preview-01.svg:** OK
- **APROVADO — acessibilidade preview-01.svg:** OK
- **APROVADO — mídia preview-02.svg:** OK
- **APROVADO — acessibilidade preview-02.svg:** OK

### Crystal Cascade 3D — APROVADO

- **APROVADO — 12 fases definidas:** encontradas 12
- **APROVADO — Tabuleiro 8×8:** estrutura principal
- **APROVADO — Seis famílias de cristais:** cyan, amber, emerald, violet, rose, azure
- **APROVADO — Fase 1 possui nome:** Pulso Inicial
- **APROVADO — Fase 1 possui movimentos:** 24
- **APROVADO — Fase 1 possui meta crescente:** 1800
- **APROVADO — Fase 1 bloqueadores válidos:** 0 células
- **APROVADO — Fase 1 coletas válidas:** {"cyan":8}
- **APROVADO — Fase 1 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 1 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 1 conclusão automatizada:** status victory; score 4280; movimentos 21; gelo 0
- **APROVADO — Fase 2 possui nome:** Prisma Duplo
- **APROVADO — Fase 2 possui movimentos:** 23
- **APROVADO — Fase 2 possui meta crescente:** 2400
- **APROVADO — Fase 2 bloqueadores válidos:** 0 células
- **APROVADO — Fase 2 coletas válidas:** {"amber":10,"violet":8}
- **APROVADO — Fase 2 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 2 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 2 conclusão automatizada:** status victory; score 23060; movimentos 17; gelo 0
- **APROVADO — Fase 3 possui nome:** Câmara de Eco
- **APROVADO — Fase 3 possui movimentos:** 22
- **APROVADO — Fase 3 possui meta crescente:** 3000
- **APROVADO — Fase 3 bloqueadores válidos:** 4 células
- **APROVADO — Fase 3 coletas válidas:** {"emerald":12}
- **APROVADO — Fase 3 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 3 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 3 conclusão automatizada:** status victory; score 14930; movimentos 16; gelo 0
- **APROVADO — Fase 4 possui nome:** Anel Congelado
- **APROVADO — Fase 4 possui movimentos:** 24
- **APROVADO — Fase 4 possui meta crescente:** 3600
- **APROVADO — Fase 4 bloqueadores válidos:** 12 células
- **APROVADO — Fase 4 coletas válidas:** {}
- **APROVADO — Fase 4 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 4 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 4 conclusão automatizada:** status victory; score 15170; movimentos 15; gelo 0
- **APROVADO — Fase 5 possui nome:** Ressonância
- **APROVADO — Fase 5 possui movimentos:** 22
- **APROVADO — Fase 5 possui meta crescente:** 4300
- **APROVADO — Fase 5 bloqueadores válidos:** 4 células
- **APROVADO — Fase 5 coletas válidas:** {"rose":12,"cyan":10}
- **APROVADO — Fase 5 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 5 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 5 conclusão automatizada:** status victory; score 16280; movimentos 8; gelo 0
- **APROVADO — Fase 6 possui nome:** Grade de Pressão
- **APROVADO — Fase 6 possui movimentos:** 25
- **APROVADO — Fase 6 possui meta crescente:** 5000
- **APROVADO — Fase 6 bloqueadores válidos:** 10 células
- **APROVADO — Fase 6 coletas válidas:** {}
- **APROVADO — Fase 6 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 6 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 6 conclusão automatizada:** status victory; score 31810; movimentos 8; gelo 0
- **APROVADO — Fase 7 possui nome:** Prisma Quebrado
- **APROVADO — Fase 7 possui movimentos:** 24
- **APROVADO — Fase 7 possui meta crescente:** 5600
- **APROVADO — Fase 7 bloqueadores válidos:** 8 células
- **APROVADO — Fase 7 coletas válidas:** {"amber":14,"emerald":12}
- **APROVADO — Fase 7 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 7 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 7 conclusão automatizada:** status victory; score 27520; movimentos 3; gelo 0
- **APROVADO — Fase 8 possui nome:** Órbita Violeta
- **APROVADO — Fase 8 possui movimentos:** 20
- **APROVADO — Fase 8 possui meta crescente:** 6200
- **APROVADO — Fase 8 bloqueadores válidos:** 12 células
- **APROVADO — Fase 8 coletas válidas:** {"violet":18}
- **APROVADO — Fase 8 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 8 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 8 conclusão automatizada:** status victory; score 27340; movimentos 13; gelo 0
- **APROVADO — Fase 9 possui nome:** Cascata Quântica
- **APROVADO — Fase 9 possui movimentos:** 24
- **APROVADO — Fase 9 possui meta crescente:** 7000
- **APROVADO — Fase 9 bloqueadores válidos:** 6 células
- **APROVADO — Fase 9 coletas válidas:** {"cyan":12,"rose":12}
- **APROVADO — Fase 9 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 9 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 9 conclusão automatizada:** status victory; score 15600; movimentos 16; gelo 0
- **APROVADO — Fase 10 possui nome:** Núcleo Hexa
- **APROVADO — Fase 10 possui movimentos:** 25
- **APROVADO — Fase 10 possui meta crescente:** 7800
- **APROVADO — Fase 10 bloqueadores válidos:** 10 células
- **APROVADO — Fase 10 coletas válidas:** {"emerald":14,"amber":14}
- **APROVADO — Fase 10 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 10 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 10 conclusão automatizada:** status victory; score 33040; movimentos 13; gelo 0
- **APROVADO — Fase 11 possui nome:** Tempestade Prismática
- **APROVADO — Fase 11 possui movimentos:** 23
- **APROVADO — Fase 11 possui meta crescente:** 8600
- **APROVADO — Fase 11 bloqueadores válidos:** 11 células
- **APROVADO — Fase 11 coletas válidas:** {"violet":14,"rose":14}
- **APROVADO — Fase 11 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 11 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 11 conclusão automatizada:** status victory; score 23960; movimentos 15; gelo 0
- **APROVADO — Fase 12 possui nome:** Coração da Cascata
- **APROVADO — Fase 12 possui movimentos:** 20
- **APROVADO — Fase 12 possui meta crescente:** 10000
- **APROVADO — Fase 12 bloqueadores válidos:** 16 células
- **APROVADO — Fase 12 coletas válidas:** {"cyan":10,"amber":10,"emerald":10,"violet":10,"rose":10}
- **APROVADO — Fase 12 inicia sem match automático:** tabuleiro limpo
- **APROVADO — Fase 12 inicia com jogada possível:** ao menos uma troca válida
- **APROVADO — Fase 12 conclusão automatizada:** status victory; score 30770; movimentos 7; gelo 0
- **APROVADO — Troca sem combinação é rejeitada:** 0↔8
- **APROVADO — Combinação de 4 cria especial:** [{"index":2,"type":"row"}]
- **APROVADO — Combinação de 5 cria explosão:** [{"index":2,"type":"bomb"}]
- **APROVADO — Snapshot restaura tabuleiro:** schema 1
- **APROVADO — Integração app: crystal-cascade-3d:** app.js
- **APROVADO — Integração app: games/crystal-cascade-3d/runtime:** app.js
- **APROVADO — Integração app: fliperama-ds-crystal-cascade:** app.js
- **APROVADO — Arquivo do jogo: index.html:** index.html
- **APROVADO — Arquivo do jogo: style.css:** style.css
- **APROVADO — Arquivo do jogo: engine.js:** engine.js
- **APROVADO — Arquivo do jogo: game.js:** game.js
- **APROVADO — Arquivo do jogo: levels.json:** levels.json
- **APROVADO — Mídia: logo.svg:** logo.svg
- **APROVADO — Mídia: preview-01.svg:** preview-01.svg
- **APROVADO — Mídia: preview-02.svg:** preview-02.svg
- **APROVADO — Perfil externo registrado:** game-profiles.json
- **APROVADO — Ficha educacional registrada:** game-learning.json
- **APROVADO — Three.js local reutilizado:** sem CDN
- **APROVADO — Sem identidade comercial copiada:** identidade autoral

## Interpretação

A aprovação automatizada indica integridade da simulação, conectividade dos dados ou validade estrutural coberta pelo teste. Ela não substitui o playtest visual de controles, dificuldade, câmera, animação e experiência em dispositivos reais.

