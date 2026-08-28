# Fliperama DS v0.34.1 · Auditoria de CPU, multiplayer e qualidade

## Escopo

Esta revisão foi executada antes da Fase 7.15B. Nenhum jogo novo e nenhuma fase nova foram adicionados. O objetivo foi verificar e corrigir:

- jogador contra máquina;
- dois jogadores no mesmo dispositivo;
- aleatoriedade de dificuldade e estratégia da CPU;
- tempo de decisão da máquina;
- controles declarados e controles executados;
- lógica, saves e alternância de turnos;
- explicações, contexto histórico e conteúdo educacional;
- previews gráficos e consistência funcional das 18 experiências jogáveis.

## Problemas críticos confirmados e corrigidos

### Board Arena

- A interface anterior não possuía modo local real para dois jogadores.
- A referência a adversário presencial existia apenas no texto histórico.
- Foi criado adversário selecionável: **CPU** ou **2 jogadores locais**.
- Jogo da Velha e Dama agora alternam corretamente Jogador 1 e Jogador 2.
- Foi criado o modo **CPU Surpresa**, que sorteia dificuldade e personalidade a cada partida.
- Foram preservados os níveis Iniciante, Normal, Estratégico e Mestre.
- A CPU utiliza atraso visual, bloqueio temporário do tabuleiro e decisão separada do clique do jogador.
- As personalidades disponíveis são Ofensiva, Defensiva, Posicional e Imprevisível.
- Saves schema 1 e 2 são migrados para schema 3.

### Dama 8×8

- Capturas obrigatórias e encadeadas foram preservadas.
- Peças comuns podem capturar para trás.
- O modo local aceita movimentos dos dois lados.
- A documentação agora informa que se trata de uma **variante didática simplificada**: damas movem uma casa por vez, sem dama voadora e sem regra de captura máxima.

### Vector Tennis

- A CPU anterior seguia um erro baseado em onda fixa, gerando comportamento previsível.
- A nova CPU calcula a chegada provável da bola apenas em intervalos variáveis de reação.
- Foram adicionadas imprecisão probabilística, memória atualizada por decisão e quatro personalidades.
- O modo **CPU Surpresa** alterna entre Iniciante, Normal e Desafio, além de sortear a estratégia.
- Foi criado modo local para dois jogadores com metas de 3, 5 ou 7 pontos.
- Jogador 1 usa W/S; Jogador 2 usa as setas para cima/baixo.
- Os controles são independentes e não movem as duas raquetes ao mesmo tempo.
- Saves anteriores são migrados para schema 3.

## Inconsistências adicionais corrigidas

- A ficha antiga do Vector Tennis ainda dizia que toda partida terminava em cinco pontos.
- O manifesto do Space Blocks não declarava a queda instantânea já existente no runtime.
- Perfis, catálogo, ficha educacional, exemplos e previews competitivos foram sincronizados.
- Resultados locais agora distinguem Jogador 1 e Jogador 2 de vitória ou derrota contra CPU.

## Auditoria das 18 experiências

Todas as experiências possuem:

- perfil de controles;
- objetivo e condição de conclusão;
- contexto e explicação;
- classificação de qualidade gráfica;
- duas imagens de preview válidas;
- inicialização ou teste estrutural coberto pelas suítes automatizadas.

Os jogos competitivos com modo local nesta revisão são:

- Board Arena — Jogo da Velha e Dama;
- Vector Tennis.

Os demais permanecem de um jogador por decisão de design. Nenhum deles anuncia dois jogadores sem implementar o recurso.

## Qualidade visual

A revisão estática confirmou boa legibilidade e melhor acabamento nos previews de:

- Board Arena;
- Vector Tennis;
- Câmeras em Evolução;
- Setor Poligonal 94;
- Motion Beat;
- Puzzle Forge;
- VoxelCraft DS.

Os previews de parte dos jogos retrô continuam propositalmente minimalistas, mas vários ainda são escuros e pouco informativos. A prioridade visual futura inclui Ponte 8→16 Bits, Reator de Blocos, Labirinto de Dados, Sentinela Orbital, Raster Rally, Corredores Raycast, Aventura de Salas, Space Blocks, State Quest RPG, Trap Lab e Vector Fleet.

Esses itens não apresentaram falha estrutural nos arquivos, mas devem receber uma passagem artística global antes de serem considerados com acabamento visual definitivo.

## Validação automatizada

- 109 verificações gerais dos 18 jogos;
- 37 testes da expansão arcade;
- 120 verificações educacionais;
- 62 testes do Museu e da Linha do Tempo;
- 22 testes do VoxelCraft;
- 16 testes físicos;
- 26 testes das experiências 3D;
- 116 testes específicos de CPU, multiplayer, controles, contexto e previews;
- **508 verificações aprovadas**;
- **0 falhas automatizadas**;
- 106 módulos preservados;
- 209 arquivos e rotas HTTP previstos no fechamento final.

## Limitação de validação visual

Foi tentada a abertura por Chromium headless em servidor HTTP local. O processo não concluiu porque o ambiente disponível falhou na inicialização gráfica/DBus. Portanto:

- não foi registrado um playtest visual de canvas que não ocorreu;
- os testes automatizados comprovam lógica, dados, arquivos, controles declarados e simulações;
- toque simultâneo, conforto visual, áudio, ritmo das animações e sensação real de partida continuam no checklist manual para computador, celular e tablet.

## Conclusão

A v0.34.1 corrige os bloqueios competitivos encontrados e está apta para validação manual. A Fase 7.15B somente deve começar depois do teste rápido dos dois jogadores e da CPU em um navegador real.
