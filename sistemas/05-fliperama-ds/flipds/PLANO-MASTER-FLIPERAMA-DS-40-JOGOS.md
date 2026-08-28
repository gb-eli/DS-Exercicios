# ROADMAP MASTER — FLIPERAMA DS
## Expansão pós-v0.34.1 · Recuperação visual + 40+ jogos planejados

Este documento amplia o planejamento oficial do Fliperama DS após a v0.34.1.

A prioridade continua sendo:
1. corrigir UX/UI e travamentos visuais;
2. elevar a qualidade gráfica dos jogos existentes;
3. ampliar fases e conteúdo dos jogos atuais;
4. somente então liberar novos jogos em blocos pequenos e validados.

---

# 0. PRINCÍPIOS OBRIGATÓRIOS

## 0.1 Nenhum jogo novo pode ser apenas uma demonstração

Todo jogo novo deverá possuir:

- tela de apresentação;
- contexto ou enredo;
- tutorial jogável;
- controles explicados;
- modo de dificuldade;
- pelo menos uma progressão real;
- condição de vitória;
- condição de derrota ou falha quando aplicável;
- tela de conclusão;
- estatísticas;
- salvamento quando fizer sentido;
- histórico/curiosidades;
- conceitos de programação;
- exemplo de código;
- suporte responsivo;
- fallback gráfico;
- validação de fases.

## 0.2 Quantidade mínima de conteúdo

Como regra-base:

- arcade simples: 6–10 fases/ondas;
- plataforma 2D: 6–12 fases;
- puzzle: 20+ níveis progressivos;
- corrida: 5+ pistas ou campeonatos;
- mundo 3D: tutorial + 3 missões completas antes de expansão;
- RPG: prólogo + 3 capítulos iniciais;
- simulador: tutorial + 5 desafios/contratos;
- cooperativo: 8+ salas/fases;
- campanha tática: 5+ missões;
- jogo casual moderno: mapa de progressão com 20+ níveis.

## 0.3 Contrato de qualidade gráfica

Todo jogo deverá declarar um perfil visual real:

### HISTÓRICO
- visual compatível com a geração representada;
- pixel art, low-poly, scanlines ou limitações intencionais.

### BAIXO
- sombras reduzidas;
- poucas partículas;
- textura menor;
- distância de renderização reduzida.

### MÉDIO
- equilíbrio entre desempenho e qualidade.

### ALTO
- iluminação melhor;
- partículas;
- sombras;
- texturas maiores;
- materiais mais ricos.

### ULTRA
- PBR;
- sombras avançadas;
- pós-processamento moderado;
- reflexos quando viáveis;
- maior densidade de cenário.

O modo Ultra nunca será requisito para jogar.

## 0.4 O que significa 3D e 360°

Um jogo só poderá usar o rótulo **3D** quando possuir:
- geometria tridimensional;
- câmera real;
- profundidade;
- colisão/posição 3D.

Um jogo só poderá usar **360°** quando possuir:
- câmera orbital ou navegação completa;
- ambiente tridimensional navegável;
- motivo funcional para olhar ao redor;
- objetivo, missão ou interação espacial.

Uma imagem panorâmica estática não será considerada jogo 360°.

## 0.5 Arquitetura

### 2D
Preferência por Phaser para:
- plataforma;
- arcade;
- tilemap;
- puzzle;
- jogos cooperativos 2D.

### 3D/360
Preferência por:
- Three.js;
- Rapier quando física real for necessária;
- GLB/glTF 2.0;
- Meshopt/Draco quando adequado;
- WebP/KTX2;
- LOD;
- instancing;
- carregamento sob demanda.

### Separações obrigatórias
- Simulation Core;
- Renderer;
- Input Manager;
- Asset Manager;
- Save Manager;
- Quality Manager;
- Audio Manager;
- HUD DOM;
- Debug/Performance overlay.

---

# 1. FASE 7.15B — HOTFIX UX/UI · v0.34.2

Antes de qualquer jogo novo.

## Corrigir
- notificação inicial maior que a tela;
- modal sem rolagem;
- botão de fechar fora da viewport;
- overlays que bloqueiam canvas;
- telas 1366×768;
- celulares pequenos;
- safe-area;
- teclado virtual;
- HUD sobre controles;
- popups consecutivos.

## Nova regra
A abertura deve mostrar apenas:
- marca;
- versão;
- botão Entrar;
- aviso resumido opcional.

Informações grandes deverão ficar em gavetas.

## Critérios de aceite
- 320×568;
- 360×640;
- 390×844;
- 768×1024;
- 1366×768;
- 1920×1080.

---

# 2. FASE 7.15C — REVISÃO GRÁFICA DOS 18 JOGOS ATUAIS · v0.35.0

## Revisar por jogo
- fundo;
- paleta;
- HUD;
- animações;
- transição;
- vitória;
- derrota;
- partículas;
- iluminação;
- sprites;
- legibilidade;
- preview;
- tela inicial;
- responsividade.

## Modos
Sempre que possível:
- Histórico;
- Moderno.

Exemplo:
Space Blocks poderá alternar entre visual retrô e apresentação moderna.

---

# 3. FASE 7.15D — MAIS FASES NOS JOGOS ATUAIS · v0.36.0

## Labirinto de Dados
- 5 mapas;
- desafio final;
- rotas validadas por BFS/A*;
- drones com personalidades.

## Trap Lab
- 6+ fases;
- armadilhas combinadas;
- checkpoints seguros.

## Ponte 8→16 Bits
- novos trechos;
- desafios opcionais;
- rota alternativa.

## Puzzle Forge
- 10+ desafios;
- chaves, portas e lógica.

## Aventura de Salas
- novos ambientes;
- puzzles;
- narrativa curta.

## Jogos arcade
- campanhas maiores;
- desafios diários locais;
- medalhas.

---

# 4. NOVOS JOGOS — REGRAS DE IMPLEMENTAÇÃO

Cada fase de desenvolvimento terá no máximo:
- 2 jogos grandes 3D/360;
- ou 3 jogos médios;
- ou 4–6 expansões pequenas.

Cada entrega deverá gerar:
- ZIP completo;
- changelog;
- relatório;
- testes;
- matriz de fases;
- checklist mobile;
- checklist desktop;
- hashes.

---

# BLOCO A — COOPERATIVO, PLATAFORMA E PUZZLE

## JOGO 01 — Duo Elementos DS · CONCLUÍDO NA v0.37.0
**Tipo:** plataforma cooperativa 2D / multiplayer local.

### Conceito
Dois exploradores controlam energias complementares e precisam cooperar para restaurar um laboratório dividido.

### Fases
1. Tutorial dos dois personagens.
2. Portas sincronizadas.
3. Plataformas alternadas.
4. Transporte de energia.
5. Sala de espelhos.
6. Gravidade parcial.
7. Reator duplo.
8. Câmara final.

### Lógica
- cada personagem resiste a perigos diferentes;
- botões simultâneos;
- portas dependentes;
- objetos cooperativos;
- modo solo com troca de personagem;
- modo 2 jogadores.

### Efeitos
- partículas de energia;
- brilho nos portais;
- líquidos animados;
- iluminação por cor funcional.

### Referência
Inspirado no gênero cooperativo popularizado por Fireboy and Watergirl, sem copiar personagens, mapas, arte ou identidade.

---

## JOGO 02 — Plataforma Clássica DS 2D
**Tipo:** plataforma 2D.

### Enredo
Um técnico percorre mundos digitais recuperando núcleos perdidos de diferentes gerações de videogames.

### Mundos
1. Campo dos Pixels.
2. Floresta 8 Bits.
3. Fábrica 16 Bits.
4. Cidade 32 Bits.
5. Vale dos Polígonos.
6. Castelo dos Algoritmos.

### Conteúdo
- 2 fases por mundo;
- segredos;
- checkpoints;
- inimigos autorais;
- chefe/desafio por mundo.

### Visual
- alternância Histórico/Moderno;
- parallax;
- partículas;
- sombras modernas opcionais.

### Referência
Mario poderá aparecer apenas no conteúdo histórico. O jogo terá personagens, assets e mapas próprios.

---

## JOGO 03 — Plataforma Poligonal DS 3D
**Tipo:** plataforma 3D.

### Estrutura
- Tutorial 3D;
- Praça Poligonal;
- Mina Low-Poly;
- Torre Vetorial;
- Cidade dos Shaders;
- Fortaleza Final.

### Mecânicas
- salto;
- corrida;
- plataformas móveis;
- colecionáveis;
- chaves;
- NPCs;
- missões secundárias.

### Câmera
- terceira pessoa;
- reset;
- colisão de câmera;
- sensibilidade.

### Visual
- Low-poly histórico;
- PBR moderno;
- comparação instantânea entre modos.

---

## JOGO 04 — Mundo Plataforma DS 360
**Tipo:** aventura/plataforma 3D 360°.

### Regiões
- Vila Tecnológica;
- Floresta de Circuitos;
- Região Industrial;
- Montanha de Dados;
- Torre Central.

### Lógica
- regiões carregadas sob demanda;
- missões;
- NPCs;
- itens;
- clima;
- ciclo de horário opcional.

### Efeitos
- névoa;
- água;
- vegetação;
- partículas;
- iluminação dinâmica.

---

## JOGO 05 — Crystal Cascade 3D
**Tipo:** match-3 moderno.

### Conceito
Combina cristais de energia para reparar setores de uma central tecnológica.

### Progressão
- 30 níveis iniciais;
- metas de pontuação;
- coletar peças;
- quebrar bloqueios;
- limitar movimentos;
- desafios contra o tempo.

### Visual
- peças 3D;
- explosões;
- partículas;
- cascatas;
- câmera suave;
- materiais transparentes.

### Referência
Inspirado no gênero match-3 popularizado por Candy Crush, com identidade visual e mecânicas próprias.

---

## JOGO 06 — Hexa Reactor
**Tipo:** puzzle 2D/3D híbrido.

### Fases
20 níveis iniciais.

### Mecânicas
- peças hexagonais;
- conexão de energia;
- rotação;
- sobrecarga;
- caminhos múltiplos.

### Visual
- modo plano;
- modo tabuleiro 3D;
- pulsos de energia;
- hologramas.

---

# BLOCO B — TABULEIRO, ESTRATÉGIA E CONSTRUÇÃO

## JOGO 07 — Chess Arena 360
**Tipo:** xadrez 2D + 3D + 360°.

### Modos
- jogador × jogador;
- jogador × CPU;
- treinamento;
- desafio;
- partida cronometrada.

### CPU
- Iniciante;
- Normal;
- Estratégica;
- Mestre;
- Surpresa.

### Visual
- tabuleiro 2D;
- peças 3D;
- sala 360°;
- câmera orbital;
- animação de captura.

### Educacional
- movimento das peças;
- xeque;
- xeque-mate;
- abertura;
- tática;
- histórico de jogadas.

---

## JOGO 08 — Bridge Engineer DS
**Tipo:** engenharia/puzzle.

### Fases
- Tutorial;
- Ponte curta;
- Rio;
- Vale;
- Trem;
- Ponte móvel;
- Vento;
- Desafio final.

### Lógica
- peso;
- tensão;
- compressão;
- custo;
- limite de material.

### Visual
- 2D técnico;
- replay 3D da simulação;
- deformação visual;
- pontos de tensão.

---

## JOGO 09 — Theme Park Architect 3D
**Tipo:** construção/gestão.

### Progressão
1. Praça inicial.
2. Parque infantil.
3. Montanha-russa.
4. Área aquática.
5. Parque noturno.
6. Mega parque.

### Sistemas
- dinheiro;
- satisfação;
- filas;
- limpeza;
- energia;
- manutenção.

### Efeitos
- luzes;
- partículas;
- visitantes;
- ciclo dia/noite.

---

## JOGO 10 — Space Colony Builder 360
**Tipo:** construção/estratégia 3D.

### Enredo
Construir uma colônia autossuficiente em um planeta hostil.

### Fases
- pouso;
- oxigênio;
- energia;
- agricultura;
- pesquisa;
- expansão;
- tempestade;
- autonomia.

### Sistemas
- recursos;
- energia;
- oxigênio;
- população;
- manutenção.

---

# BLOCO C — CARROS, MOTOS E MOBILIDADE

## JOGO 11 — Velocity Festival 360
**Tipo:** corrida em mundo semiaberto.

### Estrutura
- tutorial;
- circuito urbano;
- estrada costeira;
- serra;
- terra;
- festival final.

### Sistemas
- veículos;
- clima;
- telemetria;
- garagem;
- upgrades leves;
- campeonatos.

### Visual
- PBR;
- reflexos;
- chuva;
- iluminação noturna;
- motion blur opcional.

---

## JOGO 12 — Moto Horizon DS 360
**Tipo:** motos 3D/360.

### Categorias
- urbana;
- esportiva;
- trail;
- off-road.

### Fases
- escola de pilotagem;
- circuito;
- serra;
- chuva;
- trilha;
- campeonato.

### Física
- inclinação;
- frenagem;
- aderência;
- terreno;
- suspensão simplificada.

### Câmeras
- capacete;
- terceira pessoa;
- lateral;
- replay.

---

## JOGO 13 — BMX Urban Flow
**Tipo:** BMX 3D/360.

### Locais
- praça;
- pista;
- estacionamento;
- parque;
- centro urbano;
- campeonato.

### Manobras
- bunny hop;
- manual;
- grind;
- 180/360;
- combos.

### Sistema
- equilíbrio;
- multiplicador;
- cronômetro;
- objetivos por linha.

---

## JOGO 14 — Rally Terra DS
**Tipo:** rally 3D.

### Etapas
- terra seca;
- lama;
- floresta;
- montanha;
- noite;
- final.

### Sistemas
- aderência;
- danos leves;
- clima;
- copiloto;
- tempo de setor.

---

## JOGO 15 — Formula Tech GP
**Tipo:** corrida técnica 3D.

### Conteúdo
- treino;
- classificação;
- corrida curta;
- pit stop;
- desgaste;
- campeonato.

### Educacional
- aerodinâmica;
- aderência;
- frenagem;
- telemetria;
- estratégia.

---

## JOGO 16 — Kart Nexus Local
**Tipo:** corrida arcade 3D multiplayer local.

### Pistas
6 pistas iniciais.

### Modos
- solo;
- CPU;
- 2 jogadores local;
- campeonato.

### Efeitos
- turbo;
- derrapagem;
- partículas;
- itens autorais;
- câmera dinâmica.

---

## JOGO 17 — Truck Logistics 360
**Tipo:** simulador de caminhão.

### Missões
- carga curta;
- estacionamento;
- estrada;
- chuva;
- carga frágil;
- entrega noturna.

### Sistemas
- combustível;
- danos;
- peso;
- ré;
- espelhos;
- rota.

---

## JOGO 18 — City Bus Driver 360
**Tipo:** simulador urbano.

### Missões
- linha curta;
- horário;
- chuva;
- trânsito;
- acessibilidade;
- linha noturna.

### Sistemas
- passageiros;
- paradas;
- portas;
- horários;
- condução suave.

---

## JOGO 19 — Drone Racing DS 360
**Tipo:** corrida aérea.

### Fases
- calibração;
- portões básicos;
- pista industrial;
- floresta;
- cidade;
- campeonato.

### Controles
- teclado;
- gamepad;
- joysticks virtuais.

### Efeitos
- câmera FPV;
- interferência;
- partículas;
- vento.

---

# BLOCO D — CIDADE, FAZENDA E SIMULAÇÃO

## JOGO 20 — Farm Life DS 3D/360
**Tipo:** fazenda.

### Progressão
- preparar solo;
- plantar;
- irrigar;
- colher;
- animais;
- máquinas;
- mercado;
- expansão.

### Sistemas
- clima;
- solo;
- tempo;
- economia;
- armazenamento.

### Visual
- vegetação animada;
- água;
- iluminação;
- animais;
- ciclo dia/noite.

---

## JOGO 21 — Open City Legends 360
**Tipo:** aventura urbana em mundo aberto.

### Enredo
O jogador chega a uma cidade tecnológica e constrói reputação realizando trabalhos, explorações e missões.

### Primeira versão
Um bairro funcional, não uma cidade gigante vazia.

### Missões
- entrega;
- corrida;
- fotografia;
- resgate;
- transporte;
- investigação.

### Sistemas
- NPCs;
- trânsito;
- veículos;
- mapa;
- lojas;
- reputação.

### Referência
Inspirado no gênero urbano popularizado por GTA, sem copiar mapas, personagens, veículos, marcas ou assets.

---

## JOGO 22 — Construction Yard 360
**Tipo:** máquinas e construção.

### Veículos
- escavadeira;
- guindaste;
- pá-carregadeira;
- caminhão.

### Missões
- escavar;
- transportar;
- levantar;
- posicionar;
- construir.

### Física
- peso;
- colisão;
- estabilidade;
- carga.

---

## JOGO 23 — Train Network Manager 3D
**Tipo:** ferrovia/gestão.

### Fases
- linha simples;
- cruzamento;
- estação;
- carga;
- passageiros;
- rede complexa.

### Lógica
- sinais;
- horários;
- conflito de trilhos;
- rotas.

---

## JOGO 24 — Airport Ground Ops 360
**Tipo:** operações de aeroporto.

### Missões
- pushback;
- bagagem;
- abastecimento;
- catering;
- estacionamento;
- coordenação de pista.

### Sistemas
- tempo;
- segurança;
- sequência operacional.

---

## JOGO 25 — Harbor Speedboats 360
**Tipo:** barcos/corrida.

### Fases
- treino;
- boias;
- porto;
- mar aberto;
- chuva;
- campeonato.

### Física
- ondas;
- aceleração;
- curva;
- colisão simplificada.

---

# BLOCO E — COZINHA E GESTÃO

## JOGO 26 — Kitchen Rush DS 3D
**Tipo:** cozinha e tempo.

### Fases
- sanduíches;
- massas;
- pratos quentes;
- sobremesas;
- restaurante cheio;
- desafio final.

### Sistemas
- cortar;
- cozinhar;
- montar;
- servir;
- higiene;
- tempo.

### Multiplayer
Planejado cooperativo local.

---

## JOGO 27 — Restaurant Tycoon 360
**Tipo:** gestão de restaurante.

### Progressão
- lanchonete;
- café;
- restaurante;
- cozinha avançada;
- salão premium.

### Sistemas
- cardápio;
- equipe;
- estoque;
- satisfação;
- preço;
- limpeza.

---

# BLOCO F — AÇÃO, TÁTICA E AVENTURA

## JOGO 28 — Tactical Source Arena
**Tipo:** FPS tático educativo.

### Missões
- treino;
- defesa;
- resgate;
- captura de objetivo;
- escolta;
- operação final.

### IA
- patrulha;
- alerta;
- cobertura;
- busca;
- ataque;
- retirada.

### Sistemas
- precisão;
- recuo próprio;
- munição;
- objetivos;
- bots.

### Referência
Inspirado no gênero de FPS tático representado por Counter-Strike, sem copiar mapas, armas, personagens, sons ou identidade.

---

## JOGO 29 — Arena Bots 360
**Tipo:** arena 3D.

### Modos
- sobrevivência;
- pontos;
- defesa;
- duelos locais futuros.

### Ondas
10 ondas iniciais.

### Efeitos
- lasers;
- escudos;
- partículas;
- destruição visual leve.

---

## JOGO 30 — Mech Frontier 360
**Tipo:** combate de mechas.

### Enredo
Defender colônias contra máquinas autônomas.

### Missões
- treinamento;
- defesa;
- escolta;
- ataque;
- chefe.

### Sistemas
- calor;
- energia;
- armas;
- escudo;
- módulos.

---

## JOGO 31 — Survival Base DS 3D
**Tipo:** sobrevivência/construção.

### Progressão
- abrigo;
- água;
- recursos;
- defesa;
- tempestade;
- expansão.

### Regra
Sem foco em violência realista; prioridade em gestão e sobrevivência ambiental.

---

## JOGO 32 — Cyber Ninja 3D
**Tipo:** ação/plataforma.

### Fases
- dojo;
- telhados;
- fábrica;
- laboratório;
- torre.

### Mecânicas
- corrida;
- wall-run;
- salto;
- stealth;
- drones.

---

## JOGO 33 — Realm Forge RPG 360
**Tipo:** RPG.

### Estrutura inicial
- prólogo;
- capítulo 1;
- capítulo 2;
- capítulo 3;
- área opcional.

### Sistemas
- personagem;
- inventário;
- diálogos;
- quests;
- progressão;
- combate por turnos/ação configurável.

---

## JOGO 34 — Escape Rooms Nexus 360
**Tipo:** escape room.

### Salas
- laboratório;
- oficina;
- biblioteca;
- estação;
- sala holográfica;
- núcleo final.

### Lógica
- códigos;
- objetos;
- sequências;
- circuitos;
- observação 360°.

---

## JOGO 35 — Haunted Signal 360
**Tipo:** mistério/exploração.

### Enredo
Investigar uma estação tecnológica abandonada e descobrir a origem de sinais anormais.

### Sistemas
- exploração;
- pistas;
- energia;
- portas;
- áudio espacial;
- puzzles.

### Visual
- iluminação;
- névoa;
- sombras;
- atmosfera;
- sem depender de gore.

---

# BLOCO G — ESPORTES E MOVIMENTO

## JOGO 36 — Street Soccer 3D
**Tipo:** futebol arcade.

### Modos
- treino;
- pênaltis;
- 1×CPU;
- 2 jogadores local;
- torneio.

### Visual
- estádio urbano;
- replay;
- partículas;
- iluminação noturna.

---

## JOGO 37 — Basketball Street 3D
**Tipo:** basquete arcade.

### Modos
- arremesso;
- desafio de tempo;
- 1×CPU;
- 2 jogadores.

### Sistemas
- força;
- ângulo;
- defesa;
- combos.

---

## JOGO 38 — Skate Park 360
**Tipo:** skate 3D/360.

### Locais
- pista;
- praça;
- escola;
- parque urbano.

### Manobras
- ollie;
- grind;
- flip;
- manual;
- combos.

---

## JOGO 39 — Wave Rider 360
**Tipo:** esportes aquáticos.

### Fases
- treino;
- ondas pequenas;
- reef;
- tempestade;
- campeonato.

### Sistemas
- equilíbrio;
- direção;
- manobras;
- energia da onda.

---

# BLOCO H — JOGOS CASUAIS E ONLINE-SIMULADOS

## JOGO 40 — Snake Nebula IO
**Tipo:** evolução do Snake.

### Modos
- clássico;
- arena;
- bots;
- sobrevivência;
- multiplayer local futuro.

### Visual
- neon;
- partículas;
- rastro;
- arena 2.5D/3D opcional.

---

## JOGO 41 — Marble Factory 3D
**Tipo:** puzzle físico.

### Fases
20 níveis.

### Sistemas
- trilhos;
- gravidade;
- impulso;
- interruptores;
- máquinas.

### Visual
- materiais;
- esfera física;
- câmera orbital;
- slow motion.

---

## JOGO 42 — Neon Rhythm Arena 3D
**Tipo:** ritmo moderno.

### Progressão
- 12 músicas instrumentais autorais/royalty-safe na estrutura futura;
- dificuldade progressiva;
- desafios de precisão.

### Visual
- cenário reativo;
- partículas;
- luz sincronizada;
- câmera adaptativa.

---

# BLOCO I — RESGATE E MISSÕES TÉCNICAS

## JOGO 43 — Rescue Helicopter 360
**Tipo:** voo/resgate.

### Missões
- treino;
- transporte;
- montanha;
- mar;
- noite;
- tempestade.

### Sistemas
- altitude;
- vento;
- combustível;
- pouso.

---

## JOGO 44 — City Fire Rescue 360
**Tipo:** resgate urbano.

### Missões
- treinamento;
- incêndio pequeno;
- edifício;
- acidente;
- operação noturna.

### Sistemas
- água;
- rotas;
- equipamentos;
- prioridade;
- tempo.

---

# 5. ORDEM DE IMPLEMENTAÇÃO

## Ciclo 1 — estabilização
### v0.34.2
Hotfix UX/UI.

### v0.35.0
Revisão gráfica dos 18 jogos.

### v0.36.0
Mais fases nos 18 jogos.

---

## Ciclo 2 — cooperativo e plataforma
### v0.37.0 — CONCLUÍDA
Duo Elementos DS + arquitetura multiplayer local, campanha de 8 fases, modo solo/local, touch e gamepad.

### v0.37.1
Plataforma Clássica DS 2D.

### v0.37.2
Crystal Cascade 3D + Hexa Reactor.

### v0.38.0
Plataforma Poligonal DS 3D.

### v0.38.1
Mundo Plataforma DS 360.

---

## Ciclo 3 — estratégia/construção
### v0.39.0
Chess Arena 360.

### v0.39.1
Bridge Engineer DS.

### v0.39.2
Theme Park Architect.

### v0.39.3
Space Colony Builder.

---

## Ciclo 4 — veículos
### v0.40.0
Velocity Festival 360.

### v0.40.1
Moto Horizon DS 360.

### v0.40.2
BMX Urban Flow.

### v0.40.3
Rally Terra + Formula Tech.

### v0.40.4
Kart Nexus Local.

### v0.40.5
Truck Logistics + City Bus Driver.

### v0.40.6
Drone Racing DS.

---

## Ciclo 5 — cidade/simulação
### v0.41.0
Farm Life DS.

### v0.41.1
Open City Legends — primeiro bairro.

### v0.41.2
Construction Yard.

### v0.41.3
Train Network Manager.

### v0.41.4
Airport Ground Ops.

### v0.41.5
Harbor Speedboats.

---

## Ciclo 6 — cozinha/gestão
### v0.42.0
Kitchen Rush.

### v0.42.1
Restaurant Tycoon.

---

## Ciclo 7 — ação e aventura
### v0.43.0
Tactical Source Arena.

### v0.43.1
Arena Bots.

### v0.43.2
Mech Frontier.

### v0.43.3
Survival Base.

### v0.43.4
Cyber Ninja.

### v0.43.5
Realm Forge RPG.

### v0.43.6
Escape Rooms Nexus + Haunted Signal.

---

## Ciclo 8 — esportes
### v0.44.0
Street Soccer.

### v0.44.1
Basketball Street.

### v0.44.2
Skate Park.

### v0.44.3
Wave Rider.

---

## Ciclo 9 — casual e física
### v0.45.0
Snake Nebula IO.

### v0.45.1
Marble Factory.

### v0.45.2
Neon Rhythm Arena.

---

## Ciclo 10 — resgate
### v0.46.0
Rescue Helicopter.

### v0.46.1
City Fire Rescue.

---

# 6. EFEITOS VISUAIS PADRÃO

Criar biblioteca compartilhada de FX:

- impacto;
- poeira;
- fumaça;
- faísca;
- chuva;
- neve;
- água;
- fogo estilizado;
- holograma;
- neon;
- boost;
- rastro;
- skid;
- explosão estilizada;
- portal;
- coleta;
- level-up;
- vitória;
- derrota.

Todos deverão respeitar Quality Manager.

---

# 7. SISTEMA DE CÂMERAS PADRÃO

Perfis reutilizáveis:

- lateral 2D;
- top-down;
- primeira pessoa;
- terceira pessoa;
- chase;
- orbital;
- cockpit/capacete;
- câmera fixa;
- câmera cinematográfica;
- foto;
- replay;
- 360° livre.

Controles obrigatórios:
- reset;
- sensibilidade;
- reduzir movimento;
- inverter Y;
- FOV quando aplicável.

---

# 8. MULTIPLAYER LOCAL

O Multiplayer Core deverá suportar:

- teclado dividido;
- dois gamepads;
- teclado + gamepad;
- controles touch independentes quando viável;
- identificação Jogador 1/Jogador 2;
- pausa compartilhada;
- HUD separado;
- reconexão do gamepad.

Jogos prioritários:
1. Duo Elementos;
2. Chess Arena;
3. Kart Nexus;
4. Street Soccer;
5. Basketball Street;
6. Kitchen Rush;
7. Vector Tennis;
8. Board Arena.

---

# 9. IA/CPU

Perfis compartilhados:

- Iniciante;
- Normal;
- Estratégico;
- Mestre;
- Surpresa.

A CPU nunca deverá responder instantaneamente quando a ação representa tomada de decisão humana.

Implementar:
- tempo variável;
- erro probabilístico;
- personalidade;
- tomada de decisão;
- telemetria de dificuldade;
- seed opcional para testes reproduzíveis.

---

# 10. VALIDAÇÃO DE FASES

Antes de marcar uma fase como estável:

## 2D
- saída alcançável;
- itens obrigatórios alcançáveis;
- nenhum spawn dentro de parede;
- salto possível;
- checkpoint seguro.

## 3D
- navmesh/rota válida quando necessária;
- câmera não presa;
- colisão coerente;
- objetivo alcançável;
- personagem não cai pelo mundo;
- recuperação anti-travamento.

## Corrida
- pista fechada corretamente;
- checkpoints em ordem;
- largada e chegada válidas.

## Puzzle
- solução existente;
- nenhuma dependência circular impossível.

## Cooperativo
- solução para 1 jogador quando modo solo existir;
- solução real para 2 jogadores;
- ausência de softlock.

---

# 11. META FINAL DO FLIPERAMA DS

O Fliperama DS deverá evoluir de uma coleção de protótipos para um laboratório completo da evolução dos videogames, com:

- clássicos;
- arcade;
- plataforma;
- puzzle;
- estratégia;
- tabuleiro;
- corrida;
- carro;
- moto;
- BMX;
- caminhão;
- ônibus;
- drone;
- fazenda;
- cidade;
- cozinha;
- construção;
- FPS tático;
- RPG;
- sobrevivência;
- esportes;
- resgate;
- multiplayer local;
- 2D;
- 2.5D;
- 3D;
- 360°;
- qualidade gráfica adaptativa;
- história;
- programação;
- curiosidades;
- desafios;
- progressão;
- museu integrado.

A implementação continuará modular, cumulativa e validada por etapas.

---

## Status de implementação — v0.37.1

- Duo Elementos DS: **implementado** na v0.37.0.
- Plataforma Clássica DS 2D: **Mundo 1 implementado** na v0.37.1 com 6 fases.
- Próximo jogo: **Crystal Cascade 3D**.



## Status de implementação — v0.37.2

- 21 experiências jogáveis no portal.
- Duo Elementos DS: 8 fases implementadas.
- Plataforma Clássica DS 2D: Mundo 1 com 6 fases implementado.
- Crystal Cascade 3D: **12 fases implementadas** com cascatas, gelo, peças especiais e estrelas.
- Próxima etapa: **Plataforma Poligonal DS 3D**.

---

## Atualização de implementação — v0.38.1
- **Mundo Plataforma DS 360**: primeira região implementada e jogável.
- Região 1: **Vale Nexus 360**, organizada como hub radial.
- Implementados: 6 Orbes, 3 Balizas, 3 checkpoints, 4 plataformas móveis, 8 campos Glitch, 6 patrulhas e Portal Nexus.
- Câmera orbital com rotação 360°, modo Panorama, bússola, teclado, touch e gamepad.
- Arquitetura separada em `simulation.mjs`, `render.mjs`, `game.js` e `region.json`.
- Próxima expansão do mesmo jogo: **Vila Tecnológica**.

---

## Atualização de execução — v0.38.5

- **Mundo Plataforma DS 360**: primeiro arco concluído com 5 regiões — Vale Nexus, Vila Tecnológica, Floresta de Circuitos, Região Industrial e Torre Central.
- Persistência atual: **schema 5** com migração cumulativa das versões anteriores.
- **Hexa Reactor** permanece pendente do Bloco A e será retomado antes do ciclo v0.39.x.
- Próximo ciclo estratégico preservado: Chess Arena 360 → Bridge Engineer DS → Theme Park Architect → Space Colony Builder.


## STATUS v0.38.6

- ✅ Duo Elementos DS
- ✅ Plataforma Clássica DS 2D
- ✅ Crystal Cascade 3D
- ✅ Plataforma Poligonal DS 3D
- ✅ Mundo Plataforma DS 360 · arco de 5 regiões
- ✅ Hexa Reactor
- ✅ Chess Arena 360 concluído na v0.39.0
- ▶ Próximo: Bridge Engineer DS
