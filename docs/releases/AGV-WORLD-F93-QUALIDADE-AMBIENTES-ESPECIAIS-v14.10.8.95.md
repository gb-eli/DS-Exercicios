# AGV World F93 — Qualidade Modular dos Ambientes Especiais

**Release:** v14.10.8.95  
**Build:** 14.10.8.95-stage64-f93-special-graphics  
**Data:** 2026-09-02

## Objetivo

Concluir a cobertura gráfica especializada iniciada nas F90–F92, aplicando contratos próprios a **Parque de Diversões AGV, Museu do Hardware, Colégio AGV e Labirinto com Armadilhas**. Gameplay, interiores, desafios, multiplayer, clima, áudio, mapa oficial F7 do Colégio e topologia dos mundos foram preservados.

## Contrato compartilhado

Novo módulo:

`lobby/assets/render/special-world-quality.js`

O contrato deriva os perfis Econômico/Médio/Alto/Ultra da F90 e acrescenta:

- distância de objetos, rótulos e detalhes intermediários/premium;
- orçamento de decoração, visitantes, luzes, partículas e clima;
- níveis de mídia e materiais físicos;
- intensidade emissiva e offset de exposição;
- DPR, sombras e shadow map limitados pelo hardware.

O host 3D dos mapas plugáveis passou a repassar mudanças de qualidade ao runtime interno. Assim, Colégio e Labirinto respondem ao seletor sem reconstruir o mundo.

## Parque de Diversões

- Suportes da montanha-russa convertidos para um `InstancedMesh`.
- Meios-fios da pista convertidos para dois lotes instanciados.
- Torres e travamentos repetidos do Mega Escorregador instanciados.
- Assentos das arquibancadas convertidos para um único lote.
- Vegetação, visitantes, luzes, clima, emissivos, detalhes estruturais, sombras e DPR respondem ao perfil em execução.
- A qualidade complementa o orçamento adaptativo já existente; não substitui corrida, tiro ao alvo, parkour, montanha-russa, escorregador ou multiplayer.
- Ciclo temporal e clima continuam sendo donos da atmosfera e da exposição principal.

## Museu do Hardware

- Grade repetida do piso convertida de 11 objetos para um `InstancedMesh`.
- Distância de telas, dispositivos, coleções secundárias, rótulos e vitrines agora varia por qualidade.
- Vídeos, frequência das demos, luzes das galerias, holograma, reflexos, materiais físicos, Avatar V2, sombras e DPR respondem ao seletor.
- Modo de inspeção, tour guiado, catálogo, progresso, mídia e carregamento de ativos foram preservados.

## Colégio AGV

- O mapa oficial permanece exclusivamente na base consolidada **v1.6.0-F7**.
- Calçada padronizada passou de 80 peças para base + dois lotes instanciados.
- Árvores, arbustos, cercas, portão e marcações da quadra foram instanciados.
- O controlador de desempenho agora diferencia Econômico, Médio, Alto e Ultra.
- Vegetação, decoração, iluminação noturna e sombras respondem à troca em execução.
- Salas, atividades pedagógicas, esportes, portas, NPCs, clima, acessibilidade, sincronização e transições F7 foram preservados.

## Labirinto com Armadilhas

- As 29 paredes passaram para um único `InstancedMesh`.
- As três placas de pressão passaram para um lote instanciado.
- Bordas emissivas progressivas foram adicionadas como detalhe Médio/Alto/Ultra.
- Iluminação, emissivos e sombras respondem ao perfil.
- Colisões, cinco vidas, armadilhas, checkpoints, pontuação, XP, vitória, derrota e retorno ao Lobby continuam independentes da qualidade visual.

## Ganho estrutural medido

A medição abaixo cobre apenas os conjuntos repetidos efetivamente convertidos nesta fase. Ela não representa o total de objetos de cada cena.

| Ambiente | Estruturas repetidas F92 | Lotes/objetos F93 | Redução no subconjunto |
| --- | ---: | ---: | ---: |
| Parque de Diversões | 186 | 6 | 96,8% |
| Museu do Hardware | 11 | 1 | 90,9% |
| Colégio AGV | 112 | 9 | 92,0% |
| Labirinto | 32 | 3 | 90,6% |
| **Total convertido** | **341** | **19** | **94,4%** |

O valor mede nós/lotes estruturais do subconjunto convertido. Não deve ser apresentado como ganho direto de FPS; o resultado real depende de GPU, navegador, resolução, mídia ativa e dispositivo.

## Performance e carregamento

Os quatro runtimes 3D e o helper novo permanecem fora do `CRITICAL_SHELL`.

- Shell crítico F92: 1.113.111 bytes
- Shell crítico F93: 1.113.654 bytes
- Diferença: **+543 bytes (~0,05%)**

O aumento vem do repasse de qualidade no host plugável e de cache-busts. Os ambientes continuam carregados sob demanda e possuem prefetch explícito.

## Validação

- F93: **10/10 PASS**.
- O2 observabilidade: **7/7 PASS**.
- Execução combinada: **17/17 PASS**.
- F92 histórico: **9/10**; falha apenas na versão esperada `14.10.8.94`.
- F91 histórico: **9/10**; falha apenas na versão esperada `14.10.8.93`.
- F90 histórico: **8/10**; falhas históricas de versão e cache do Vale avançado pela F91.
- F89 histórico: **10/11**; falha apenas na versão esperada `14.10.8.91`.
- JS/SW do Lobby, sem vendor: **144 arquivos, 0 erros sintáticos**.
- Grafo local: **144 arquivos, 428 imports locais, 0 ausentes**.
- Runtimes/hosts 3D: **17/17 importáveis como ESM**.
- Service Worker crítico: **67 URLs, 0 ausentes, 0 runtimes 3D/helpers especializados**.
- Harness de primeiro frame e Ultra → Econômico incluído em `core/tests/f93-first-frame-harness.html`.

### Limitação do ambiente de validação

O harness visual não pôde ser executado neste workspace: o Playwright disponível não contém Chromium, o download do navegador foi bloqueado pela rede e o navegador gerenciado não aceita `localhost`. Portanto, não há alegação de captura visual ou FPS real nesta entrega. O smoke estrutural, os contratos, a sintaxe, o grafo, a importabilidade e as trocas de qualidade foram validados automaticamente.

## Backend

A F93 **não exige migration nova nem alteração de Edge Function**. Em uma instalação consolidada até a migration 079, a atualização é somente de frontend + Service Worker.

## Próxima fase sugerida

F94: calibração gráfica automática global por dispositivo, usando telemetria real de frame time, memória estimada e estabilidade para recomendar ou ajustar o perfil de cada mundo sem sobrescrever escolhas manuais.
