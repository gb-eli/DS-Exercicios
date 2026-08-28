# Matriz de testes dos jogos — Fliperama DS v0.37.0

Gerada em: 2026-08-08T00:28:47.610Z

- Jogos analisados: **19**
- Aprovados nesta camada: **19**
- Com verificações pendentes de playtest: **0**
- Com falha automatizada: **0**
- Verificações aprovadas: **204**
- Alertas: **0**
- Falhas: **0**

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

## Interpretação

A aprovação automatizada indica integridade da simulação, conectividade dos dados ou validade estrutural coberta pelo teste. Ela não substitui o playtest visual de controles, dificuldade, câmera, animação e experiência em dispositivos reais.

