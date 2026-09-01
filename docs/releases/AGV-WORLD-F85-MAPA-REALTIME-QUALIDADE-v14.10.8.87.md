# AGV World F85 — Mapa 2D, Realtime e Qualidade Mobile

**Versão:** 14.10.8.87  
**Base funcional:** F84/F83 sobre o hotfix F82 14.10.8.84

## Objetivos da fase

1. Corrigir a leitura/proporção do Campus no mapa 2D e preparar a modularização em Vilas 1DS/2DS/3DS/SUB.
2. Reduzir a sensação de vazio do Vale 2D sem alterar a escala física do mundo.
3. Criar seletor de qualidade mobile utilizável e Automático sensível ao aparelho.
4. Separar presença persistente de estado efêmero do avatar para reduzir atraso perceptível do multiplayer.
5. Sincronizar posição, direção, salto, corrida, ações/emotes e aparência do avatar.
6. Reduzir carga inicial: Campus 3D e Vale 3D deixam de ser imports/prefetch obrigatórios.
7. Retirar o trem ocioso do orçamento permanente do Campus; estações permanecem como nós de transporte.

## Mapa 2D / modularização

- `CAMPUS_MAP_VIEW`: -60..60 x -42..42, coerente com os limites físicos do Campus.
- Vilas 1DS, 2DS, 3DS e SUB representadas como setores de 29 x 20 unidades e política `on-demand`.
- A Piscina Neon mantém raio 3,7; setores/vilas passam a ter prioridade visual muito superior a atrações isoladas.
- Ruas recebem classes visuais (arterial/collector/service), passeio lateral e linhas centrais diferenciadas.
- Caminhos usam suavização de curvas no renderer 2D em vez de leitura exclusivamente ortogonal.
- Corredores de pedestres permanecem distintos das vias veiculares.
- Vale Lite: zoom inicial 1,36 no desktop e 1,18 em viewport estreito, mantendo zoom manual e acompanhamento do jogador.

## Multiplayer Realtime do avatar

A presença persistente continua no banco/Edge Function para identidade, escopo e fallback. Movimento/animação não é gravado no banco a 10 Hz.

Foi adicionado broadcast efêmero Supabase Realtime:

- desktop: janela de envio ~100 ms quando há mudança;
- touch/mobile: ~125 ms;
- snapshot completo/heartbeat: 900 ms;
- tráfego reduzido quando o avatar não muda;
- peer desconhecido dispara refresh antecipado da presença, sem esperar o poll de 7–9 s.

Campos sincronizados:

- `x`, `y`, `elevation`, `heading`;
- `moving`, `running`, `onGround`;
- `movementMode` (`ground`, `plane`, `freefall`, `parachute`);
- `localAction` (dança, comemoração etc.);
- `emote`;
- aparência: cor/accent, pele, cabelo, calça, calçado, mochila, óculos, headset e acessórios suportados.

Os avatares remotos usam interpolação e atualização de aparência por revisão para evitar reconstruir o personagem a cada frame.

## Qualidade mobile

Novo botão **⚙ Qualidade** nas ações rápidas de dispositivos móveis/touch, com modal próprio:

- Automático
- Econômico
- Médio
- Alto
- Ultra

A preferência é salva no aparelho. Se o 3D estiver ativo, a mudança é aplicada imediatamente; no 2D fica preparada para a próxima entrada em 3D.

O Automático considera `deviceMemory`, `hardwareConcurrency`, `saveData`, pointer coarse e largura de viewport. Não promove automaticamente hardware móvel comum a Ultra.

## Performance de boot

- Campus 3D e Vale 3D passaram de imports estáticos para imports dinâmicos no `WorldAdapter`.
- `lobby3d.js` (160.291 bytes) + `vale3d.js` (56.279 bytes): **216.570 bytes de JavaScript deixam de fazer parte da cadeia estática inicial**.
- Esses dois runtimes também saíram do `CRITICAL_SHELL` do Service Worker; são obtidos/cacheados quando requisitados.
- Os probes de integridade do boot deixaram de ser sequenciais e passam a lotes paralelos limitados a 6 requests.

## Trem

- No 2D, o trem deixa de circular continuamente quando ninguém viaja.
- No 3D, `transit.train.visible` depende de viagem real (`trainRide || train.isTraveling()`).
- O contrato de parada de 5 s por estação do F82 permanece.

## Correções encontradas durante o gate

A validação ESM real encontrou imports mal posicionados que o check antigo podia mascarar:

- Parque de Diversões 3D;
- Parque de Diversões Lite;
- Museu do Hardware Lite;
- Museu 3D (bloco de import reconstruído);
- Vale 3D e Museu 3D tinham consumo das funções de estado remoto sem importar `remote-avatar-state.js`.

Todos foram corrigidos antes do pacote.

## Validação

- Teste F85: **11/11 PASS**.
- Parser ESM: **142/142 arquivos JS do Lobby/Core PASS**.
- Grafo do Lobby: **121 módulos / 349 imports locais / 0 ausentes**.
- Service Worker: **59 itens críticos / 0 ausentes**.
- Import direto dos 10 módulos 3D principais: **10/10 PASS**.
- Regressão F82: **6/8 PASS**; as 2 falhas são asserts literais de versão/cache 14.10.8.84, não falhas de trânsito/pedestres/trem/teletransporte.
- F80 Parque: **7/9 PASS**; as 2 falhas são marcadores históricos de release/interface.
- Smoke visual Chromium: **inconclusivo** por limitação da sandbox (`DBus/zygote`), sem screenshot produzido.

## Limites da F85

Esta fase **prepara** a modularização física das Vilas, mas ainda não extrai cada Vila para um runtime/submapa totalmente independente. Essa extração real com load/unload de assets deve ser a próxima fase para reduzir memória, draw calls e permitir mais qualidade gráfica local.

Também não mede o ping real da rede do usuário. O que foi reduzido é o intervalo de atualização da aplicação: o canal rápido passa a operar na ordem de 100–125 ms quando há mudança. A latência final ainda depende da rede e da região do serviço Realtime.
