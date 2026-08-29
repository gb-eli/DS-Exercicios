# Relatório de validação — Fase 7.9 · Fliperama DS v0.28.0

## Objetivo

Corrigir o comportamento instantâneo e previsível da CPU no Board Arena, melhorar a lógica do Jogo da Velha e da Dama e acrescentar níveis de dificuldade, animações e feedback de turno sem alterar os demais jogos.

## Implementações

### Jogo da Velha

- turnos do aluno e da CPU separados;
- tabuleiro bloqueado durante a análise da máquina;
- atraso variável de aproximadamente 0,42 a 1,65 segundo, conforme o nível;
- indicador animado de análise;
- destaque da última jogada;
- quatro dificuldades;
- erros controlados no nível Iniciante;
- escolhas equilibradas no nível Normal;
- heurística avançada no nível Estratégico;
- busca minimax no nível Mestre;
- seleção aleatória entre jogadas equivalentes para evitar repetição mecânica.

### Dama

- quatro dificuldades;
- tempo de análise da CPU;
- destinos legais destacados;
- aviso de captura obrigatória;
- captura encadeada obrigatória com a mesma peça;
- promoção preservada;
- CPU avalia captura, promoção, centro, avanço, mobilidade, exposição e resposta adversária;
- destaque visual da origem e do destino da última jogada;
- pausa interrompe também a análise da CPU.

### Persistência e compatibilidade

- schema do estado atualizado para 2;
- saves anteriores schema 1 continuam aceitos;
- dificuldade antiga `aprendiz` é migrada para `iniciante`;
- semente pseudoaleatória é salva para preservar continuidade da partida.

## Validação automatizada

### Auditoria geral

- 18 experiências analisadas;
- 13 experiências aprovadas;
- 5 experiências com alertas de playtest já conhecidos;
- 0 experiências com falha automatizada;
- 45 verificações aprovadas;
- 5 alertas;
- 0 falhas.

### Board Arena

- quatro dificuldades do Jogo da Velha verificadas;
- quatro dificuldades da Dama verificadas;
- ausência de resposta instantânea verificada;
- retorno correto do turno verificado;
- aleatoriedade do nível Iniciante verificada;
- nível Mestre sem derrotas em 100 partidas aleatórias na auditoria geral;
- nível Mestre sem derrotas em 120 partidas aleatórias no teste dedicado;
- captura encadeada de duas peças verificada;
- migração de save antigo verificada.

## Preservação

- 105 módulos preservados;
- 18 runtimes de jogos preservados;
- nenhum jogo novo incluído;
- nenhum jogo existente removido;
- museu, linha do tempo, catálogo e VoxelCraft preservados.

## Limitações

O Chromium headless disponível no ambiente não concluiu a abertura visual: o processo excedeu o limite e registrou falhas de DBus. Por isso, não há declaração de validação visual automatizada do canvas nesta fase.

Não foi realizada uma sessão humana completa de Dama até o final em todos os tamanhos de tela. O teste automatizado comprova regras e turnos, mas a percepção de ritmo, toque, legibilidade e duração deve ser validada em aparelhos reais antes da próxima aula.
