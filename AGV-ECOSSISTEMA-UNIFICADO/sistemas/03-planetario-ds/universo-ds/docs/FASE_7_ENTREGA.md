# COSMOS DS — Entrega da Fase 7

## Visão da fase

A Fase 7 transforma Marte em um laboratório de robótica e sistemas distribuídos. O aluno não controla o rover como um carrinho em tempo real: ele planeja, envia comandos identificados, espera a entrega, recebe confirmações, analisa telemetria, reage a falhas e registra ciência.

## Experiências implementadas

### 1. História e arquitetura

- Viking, Sojourner, Spirit/Opportunity, Curiosity, InSight, Perseverance e Ingenuity;
- conexão de cada marco com conceitos de DS;
- arquitetura Terra → uplink → computador de bordo → autonomia → telemetria;
- checkpoint de análise arquitetural.

### 2. Digital twin do rover

- cenário marciano procedural WebGL2;
- fallback Canvas 2D;
- rover procedural, rodas, mastro, braço e poeira;
- câmera orbital, zoom e qualidade adaptativa;
- energia, temperatura, patinagem, distância, dados e amostras.

### 3. Comunicação e Worker

- simulação executada em `mars.worker.js`;
- perfis didáticos de latência;
- comandos com ID, prioridade, horário de entrega e ACK;
- rejeição de duplicidade;
- perda de pacotes e repetição idempotente;
- fallback local quando Worker não está disponível.

### 4. Navegação A*

- grade 12×12;
- planície, areia, rocha, inclinação, alvo científico e obstáculo;
- custo por terreno;
- heurística Manhattan;
- reconstrução da rota;
- envio da rota ao rover como comando de alta prioridade.

### 5. Visão computacional didática

- atributos simulados de cor, textura, camadas e refletância;
- classes basalto, argila, sulfato e meteorito;
- pontuações por classe;
- confiança e explicação do resultado;
- checkpoint por classificação correta.

### 6. Banco científico

- identificação única;
- classificação e confiança;
- coordenadas;
- massa e observações;
- rejeição de duplicidade;
- estatísticas por classe;
- exportação JSON por perfil local.

### 7. Drone

- lançamento;
- mapeamento de setores;
- orçamento de energia;
- rejeição de setor repetido;
- reserva para retorno;
- conclusão após dois setores e retorno seguro.

### 8. Falhas

- patinagem;
- tempestade de poeira;
- perda de pacotes;
- temperatura crítica;
- recuperação baseada em controle de tração, modo seguro, idempotência e proteção térmica.

## Progressão

| Experiência | XP |
|---|---:|
| Arquitetura marciana | 220 |
| Rota A* | 360 |
| Quatro classificações | 480 |
| Banco científico | 260 |
| Drone | 280 |
| Quatro falhas | 760 |
| Certificação | 400 |
| **Total possível** | **2.760 XP** |

O XP é idempotente: refazer a experiência não duplica a recompensa.

## Desempenho

- **Desempenho:** resolução interna e passos do shader reduzidos, poeira e frequência visual menores.
- **Equilibrado:** perfil indicado para notebooks escolares.
- **Experiência:** maior definição, ray marching mais detalhado e poeira ampliada.
- **Reduzir movimento:** paralisa animações contínuas desnecessárias.

As regras de missão permanecem iguais em todos os perfis.

## Pacotes de publicação

- pacote completo com 119 arquivos;
- pacote incremental com 32 arquivos novos ou alterados em relação à Fase 6;
- caminhos preservados para atualização direta do repositório.
