# Matriz de testes dos jogos — Fliperama DS v0.29.0

Gerada em: 2026-08-04T20:20:36.583Z

- Jogos analisados: **18**
- Aprovados nesta camada: **15**
- Com verificações pendentes de playtest: **3**
- Com falha automatizada: **0**
- Verificações aprovadas: **61**
- Alertas: **3**
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

### Setor Poligonal 94 — ATENÇÃO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Objetivos da arena 3D:** 6 núcleos, checkpoints e portal posicionados fora dos colisores.
- **ATENÇÃO — Percurso 3D completo:** A navegação real com câmera, rampas, salto e controles móveis permanece para playtest na etapa de correção 3D.

### Câmeras em Evolução — ATENÇÃO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Objetivos da arena 3D:** 6 núcleos, checkpoints e portal posicionados fora dos colisores.
- **ATENÇÃO — Percurso 3D completo:** A navegação real com câmera, rampas, salto e controles móveis permanece para playtest na etapa de correção 3D.

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
- **APROVADO — Migração de save antigo:** Save schema 1 / Aprendiz convertido para schema 2 / Iniciante.

### Puzzle Forge — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.
- **APROVADO — Labirinto padrão:** Saída alcançável em 12 movimentos mínimos.
- **APROVADO — Proteção do editor:** Um layout totalmente bloqueado foi reparado com rota de 12 movimentos.

### Motion Beat DS — APROVADO

- **APROVADO — Inicialização da simulação:** Construtor, início, um ciclo de atualização e restauração executaram sem exceção.

### VoxelCraft DS — ATENÇÃO

- **ATENÇÃO — Estado do módulo:** Arquivos preservados, porém a experiência continua classificada como Protótipo e exige recuperação específica de Three.js, Pointer Lock, chunks e controles móveis.

## Interpretação

A aprovação automatizada indica integridade da simulação, conectividade dos dados ou validade estrutural coberta pelo teste. Ela não substitui o playtest visual de controles, dificuldade, câmera, animação e experiência em dispositivos reais.

