# Matriz de testes dos jogos — Fliperama DS v0.34.2

Gerada em: 2026-08-07T21:28:37.065Z

- Jogos analisados: **18**
- Aprovados nesta camada: **18**
- Com verificações pendentes de playtest: **0**
- Com falha automatizada: **0**
- Verificações aprovadas: **109**
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
- **APROVADO — Registro de checkpoint:** O checkpoint emite um único evento ao ser alcançado.
- **APROVADO — percurso explorador:** As três fases foram atravessadas pelo agente físico no modo explorador, incluindo os portões e o terminal final.
- **APROVADO — percurso programador:** As três fases foram atravessadas pelo agente físico no modo programador, incluindo os portões e o terminal final.
- **APROVADO — percurso precisao:** As três fases foram atravessadas pelo agente físico no modo precisao, incluindo os portões e o terminal final.
- **APROVADO — coyote time:** O salto ainda é aceito logo após o personagem deixar uma borda.
- **APROVADO — jump buffer:** Um comando de salto realizado pouco antes da aterrissagem é executado ao tocar o chão.
- **APROVADO — migração de save:** Saves schema 1 são migrados para o novo estado físico schema 2.

### Labirinto de Dados — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Alcançabilidade da fase 1:** 211/211 células caminháveis acessíveis; 205 coletas válidas.
- **APROVADO — Alcançabilidade da fase 2:** 223/223 células caminháveis acessíveis; 217 coletas válidas.
- **APROVADO — Alcançabilidade da fase 3:** 207/207 células caminháveis acessíveis; 201 coletas válidas.
- **APROVADO — Progressão entre mapas:** As três fases avançam e a última condição gera vitória.

### Aventura de Salas — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Grafo das oito salas:** 30 entidades e transições verificadas sem bloqueio local.

### Raster Rally — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### State Quest RPG — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Objetivos e transições:** 17 entidades e saídas acessíveis, incluindo o Console do Núcleo.

### Ponte 8→16 Bits — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Fragmentos e portal:** 9 fragmentos únicos posicionados dentro do mundo; 8 exigidos.
- **APROVADO — envelope vertical:** Todas as plataformas exigem no máximo 130.0 px de subida para um salto capaz de 137.3 px.
- **APROVADO — aterrissagem nas plataformas:** As onze plataformas podem ser alcançadas diretamente por um salto de recuperação.
- **APROVADO — salto sobre perigos:** Os cinco perigos foram atravessados sem perda de vida em simulação física.
- **APROVADO — fragmentos alcançáveis:** Todos os nove fragmentos estão associados a plataformas alcançáveis e dentro da área de coleta ampliada.
- **APROVADO — checkpoints seguros:** Nenhum respawn de checkpoint sobrepõe uma área de dano.
- **APROVADO — quarta zona:** A última parte do mundo agora registra corretamente a Zona 4.
- **APROVADO — portal final:** O portal conclui a experiência quando oito fragmentos foram coletados.
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
- **APROVADO — Aleatoriedade controlada:** 8 respostas diferentes observadas no nível Iniciante.
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

## Interpretação

A aprovação automatizada indica integridade da simulação, conectividade dos dados ou validade estrutural coberta pelo teste. Ela não substitui o playtest visual de controles, dificuldade, câmera, animação e experiência em dispositivos reais.

