# AGV World F91 — Qualidade Modular dos Ambientes Externos

**Release:** v14.10.8.93  
**Build:** 14.10.8.93-stage62-f91-external-graphics  
**Data:** 2026-09-01

## Objetivo

Levar a fundação de qualidade gráfica modular da F90 para os dois primeiros mundos externos: **Vale do Silício AGV** e **Mundo Rural AGV**, preservando lazy loading, airdrop setorial, multiplayer Realtime, velocidade padrão e perfis Econômico/Médio/Alto/Ultra.

## Vale do Silício

- Passa a consumir o novo `external-world-quality.js`.
- Qualidade controla DPR, sombras, distância de objetos, distância de detalhe, iluminação local e orçamento de decoração.
- Marcações viárias repetidas usam `THREE.InstancedMesh`.
- Fachadas ganham camadas `medium` e `premium` por proximidade.
- Alto/Ultra podem exibir painéis/elementos de cobertura e beacon; Econômico mantém o corpo principal.
- Iluminação viária é reduzida progressivamente em hardware/perfis mais econômicos.
- A atmosfera dinâmica continua sendo fonte de verdade para horário/clima; a exposição gráfica é aplicada como offset e não substitui o ciclo de dia/noite.

## Mundo Rural

- 77 árvores do pomar/vegetação dispersa deixam de ser dezenas de grupos/meshes independentes e passam para **2 InstancedMesh** (troncos + copas).
- Marcações de estrada também passam a `InstancedMesh`.
- Linhas de plantio são agrupadas e têm densidade visual ajustada por qualidade.
- Construções ganham detalhe médio e premium por proximidade.
- Alto/Ultra habilitam landmarks adicionais, incluindo aerogerador/cata-vento rural visual.
- Animais e construções distantes recebem orçamento de visibilidade.
- O seletor de qualidade agora altera de verdade DPR, sombras, vegetação, terreno, estradas, construções, clima e Avatar V2 durante a execução.

## Camada compartilhada

Novo arquivo:

`lobby/assets/render/external-world-quality.js`

Ele deriva o perfil F90 (`visual-quality-profile.js`) e acrescenta contratos para ambientes externos:

- `objectDistance`
- `detailDistance`
- `premiumDistance`
- `vegetationBudget`
- `lightBudget`
- `roadDecorations`
- `terrainDetail`

Dispositivos modestos continuam limitando DPR, anisotropia, sombras e vegetação mesmo quando a preferência visual é alta, evitando custo desproporcional em celulares.

## Performance e carregamento

O helper novo permanece fora do `CRITICAL_SHELL`. Vale e Rural continuam sendo carregados sob demanda pelo `WorldAdapter` e pelo prefetch do airdrop.

Shell crítico local:

- F90: 1.112.998 bytes
- F91: 1.113.088 bytes
- Diferença: **+90 bytes (~0,01%)**

Ou seja, a nova qualidade externa praticamente não altera o custo do boot inicial.

No harness estrutural com renderer falso, o Rural caiu de **466 para 281 objetos de cena**, redução aproximada de 39,7%, principalmente pela vegetação instanciada. Esse número mede estrutura de cena no harness, não FPS real de GPU.

## Validação

- F91: **10/10 PASS**
- O2 observabilidade: **7/7 PASS**
- F90 histórico: **8/10**; falhas somente em versão/cache anterior (`14.10.8.92` e URLs antigas de Vale/Rural).
- F89 histórico: **10/11**; falha somente em versão anterior.
- JS/SW: **142 arquivos, 0 erros sintáticos**.
- Grafo do Lobby: **141 módulos, 414 imports locais, 0 ausentes**.
- Principais runtimes/hosts 3D: **15/15 importáveis como ESM**.
- Service Worker crítico: **67 URLs, 0 ausentes, 0 runtimes 3D**.
- Harness primeiro-frame: **Vale PASS / Rural PASS**, incluindo troca `Ultra -> Low` durante execução.

O harness não serve o GLB real do Avatar V2; por isso o Avatar usa o fallback procedural, comportamento esperado pelo runtime.

## Backend

A F91 **não exige migration nova nem alteração de Edge Function**. O backend permanece no contrato consolidado até a migration 079.

## Próxima fase sugerida

F92: aplicar o mesmo contrato de qualidade modular a **Base de Operações + Estação Orbital + Lua + Marte**, com materiais e iluminação específicos para ambientes militar/espacial sem aumentar o shell crítico.
