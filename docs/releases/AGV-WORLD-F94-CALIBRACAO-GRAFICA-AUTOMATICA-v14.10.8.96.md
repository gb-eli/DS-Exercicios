# AGV World F94 — Calibração Gráfica Automática Global

**Release:** v14.10.8.96  
**Build:** 14.10.8.96-stage65-f94-auto-calibration  
**Data:** 2026-09-02

## Objetivo

Transformar o modo Automático em uma calibração real e compartilhada por todos os ambientes 3D. A F94 observa frame time, estabilidade e memória estimada, aprende um perfil por aparelho e por mundo e altera somente um nível por decisão. Escolhas manuais permanecem fixas até o usuário reativar o Automático.

## Novo calibrador global

Módulo central:

`lobby/assets/render/graphics-calibrator.js`

O calibrador:

- cria uma assinatura técnica local por faixas de memória, núcleos, tipo de ponteiro e economia de dados;
- define um teto seguro inicial para Econômico, Médio, Alto ou Ultra;
- recebe as amostras de FPS/frame time emitidas pelos runtimes;
- combina essas amostras com a memória de geometria/texturas estimada pela O2 e com o heap JavaScript quando o navegador o informa;
- mantém janelas de até 12 amostras e exige no mínimo cinco antes de avaliar;
- reduz um nível após sobrecarga grave ou janelas ruins confirmadas;
- aumenta somente após estabilidade prolongada, baixa variação e folga de desempenho;
- aplica cooldown maior para subidas, evitando oscilação entre perfis;
- guarda localmente a recomendação de cada mundo por até 30 dias;
- nunca envia essa assinatura ou o histórico para o backend.

## Proteção da escolha manual

Econômico, Médio, Alto e Ultra agora são bloqueios manuais permanentes. Enquanto um desses perfis estiver selecionado:

- nenhuma amostra pode solicitar troca automática;
- os antigos adaptadores locais do Campus e do Parque ficam sem autoridade para alterar o perfil;
- o valor escolhido continua ativo ao mudar de ambiente ou reiniciar o runtime;
- somente a seleção explícita de **Automático** devolve a autoridade ao calibrador.

## Autoridade única e integração

O Lobby passou a ser a única autoridade de calibração automática. Todos os runtimes continuam donos de como aplicar sua qualidade específica, mas a decisão global chega pelo contrato existente `setQuality()`.

A F94 também corrige dois pontos de integração:

- o host plugável usado por Colégio e Labirinto agora respeita `initialQuality`;
- o airdrop identifica-se como runtime transitório e não contamina o perfil aprendido do Campus.

O prefetch foi alinhado aos novos URLs do Campus, Parque, Colégio e Labirinto.

## Interface e observabilidade

O seletor informa:

- qualidade atualmente recomendada;
- teto estimado do aparelho;
- estado de aprendizado ou confiança do perfil;
- proteção de escolha manual;
- economia de dados, memória e núcleos detectados.

Foi incluída a ação **Recalibrar este ambiente**, que apaga somente o aprendizado do mundo atual. O diagnóstico técnico recebe o snapshot `graphicsCalibration` e eventos `graphics_calibration` sem dados pessoais.

O harness `core/tests/f94-calibration-harness.html` permite simular sobrecarga, estabilidade, pressão de memória e bloqueio manual sem usar WebGL. Ele valida decisões, não FPS real.

## Impacto no carregamento

O calibrador precisa estar disponível antes da escolha inicial do runtime e, por isso, é um módulo pequeno do shell crítico.

- Shell crítico F93: **1.113.654 bytes / 67 URLs**
- Shell crítico F94: **1.130.342 bytes / 68 URLs**
- Diferença: **+16.688 bytes (~1,50%)**
- Módulo do calibrador: **11.990 bytes** sem compactação

Os runtimes 3D continuam fora do shell crítico e carregados sob demanda.

## Validação

- F94: **10/10 PASS**.
- O2 observabilidade: **7/7 PASS**.
- Execução combinada: **17/17 PASS**.
- JS/SW do Lobby, sem vendor: **145 arquivos, 0 erros sintáticos**.
- Grafo local: **145 arquivos, 429 imports locais, 0 ausentes**.
- Runtimes/hosts 3D: **17/17 importáveis como ESM**.
- Service Worker crítico: **68 URLs, 0 ausentes, 0 runtimes 3D**.
- F93 histórico: **8/10**; diferenças esperadas de versão e cache-bust dos runtimes assumidos pela F94.
- F92 histórico: **9/10**; diferença apenas da versão.
- F91 histórico: **9/10**; diferença apenas da versão.
- F90 histórico: **8/10**; diferenças históricas de versão e cache-bust.
- F89 histórico: **10/11**; diferença apenas da versão.

### Limitação do ambiente de validação

O workspace não dispõe de Chromium funcional e o navegador gerenciado não acessa `localhost`. Assim, o harness visual e o fluxo completo do Lobby não foram capturados em navegador nesta etapa. Algoritmo, integração, contratos, sintaxe, grafo, importabilidade, cache e regressões foram validados automaticamente. Não há alegação de ganho percentual de FPS.

## Backend

A F94 não exige migration nem alteração de Edge Function. Em instalações consolidadas até a migration 079, a atualização é somente de frontend + Service Worker.

## Próxima fase sugerida

F95: resiliência gráfica e gestão de memória entre mundos, com auditoria de descarte de geometrias/texturas, recuperação de contexto WebGL, limpeza de caches 3D e modo seguro após falhas repetidas.
