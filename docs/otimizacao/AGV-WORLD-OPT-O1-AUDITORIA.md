# AGV WORLD — OPT O1 — AUDITORIA TÉCNICA READ-ONLY

**Data:** 2026-09-01  
**Base auditada:** AGV-WORLD-F81-NOVOS-MAPAS-v14.10.8.83.zip  
**SHA-256:** `5b4e59037d2f65d06b497213f33615ecbe845be23100d5aa982cc1831fc4dd2a`  
**Regra:** nenhuma alteração funcional nesta fase. Chat protegido.

## Resumo executivo

A F81 está estruturalmente utilizável e os runtimes dos mapas possuem práticas de descarte melhores do que uma arquitetura monolítica, porém ainda não atende à arquitetura-alvo do Prompt Mestre. O risco imediato mais sério não é FPS: é um erro de migration da F81 que pode impedir a presença dos três mapas recém-integrados no banco de produção.

### Classificação geral

- **1 bloqueador crítico de produção**
- **4 riscos altos de arquitetura/performance**
- **6 riscos médios de observabilidade/regressão/manutenção**
- **Nenhuma mudança aplicada em O1**

## Achados

### O1-BLK-001 — Migration 073 remove a constraint errada — CRÍTICO

`core/database/072_lobby_amusement_park_world.sql` cria a constraint `lobby_presence_area_chk`.  
`core/database/073_lobby_new_worlds.sql` tenta remover `lobby_presence_area_check` e adiciona outra constraint com esse segundo nome.

Consequência: a constraint antiga `_chk` pode permanecer limitando `area` até `parque-diversoes-agv`, enquanto a nova permite Colégio/Labirinto/Museu. Como ambas são aplicadas, heartbeats dos três novos mapas podem falhar no banco. A Edge Function aceita as novas áreas, mas o PostgreSQL pode rejeitar o `upsert`.

**Ação futura:** corrigir em fase controlada antes de considerar F81 pronta para deploy multiplayer. Não corrigido em O1.

### O1-HIGH-002 — Boot faz 29 probes sequenciais `no-store` — ALTO

`lobby/assets/boot.js` executa 29 `probeAsset()` um por vez, todos via `fetch(..., {cache:'no-store'})`, antes de importar `lobby.js`. O conjunto local representa aproximadamente **593 KB** de JS e inclui `lobby3d.js` mesmo quando o usuário pretende usar Lite.

Impacto provável: latência de boot elevada em rede móvel, duplicação de requisições e maior tempo até interface interativa.

### O1-HIGH-003 — 11 fábricas de WebGLRenderer — ALTO

Foram encontrados **11 pontos** que criam `new THREE.WebGLRenderer()`: Campus, Vale, Rural, Militar, Espaço, Lua, Marte, Parque, Museu, Deep Space e compatibility host. Todos os runtimes encontrados possuem `renderer.dispose()` e cancelamento de RAF, o que é positivo. Contudo, não existe renderer global reutilizado pelo WorldManager.

Risco: criação/destruição repetida de contextos WebGL em sessões longas, especialmente em mobile e no stress test Campus↔mundos. Nenhum runtime usa `forceContextLoss()`; isso não é automaticamente um erro, mas precisa ser medido em O7/O24.

### O1-HIGH-004 — WorldRegistry/WorldManifest padronizados não existem — ALTO

Não há implementação real de `WorldManifest`, `WorldRegistry` ou `WorldConnections`. A seleção de mundo está centralizada em ternários de `lobby.js`/`world-adapter.js` e listas de `scene/area` repetidas também na Edge Function.

Impacto: cada mapa novo exige mudanças em vários locais, aumentando risco de divergência entre front, presença, chat, teleporte e banco. O erro da migration 073 é um exemplo concreto desse tipo de divergência.

### O1-HIGH-005 — Service Worker ainda antecipa runtimes — ALTO

O `CRITICAL_SHELL` possui **56 entradas** e inclui `lobby3d.js`, `vale3d.js`, `museu-hardware3d.js`, hosts de mapas e diversos sistemas do Campus. Isso conflita com a arquitetura-alvo na qual o shell crítico deve conter Core/UI/manifests e mundos pesados devem ficar em runtime cache.

Além disso, requisições locais usam estratégia network-first com `cache:'no-store'`, priorizando sempre rede antes do fallback.

### O1-MED-006 — Grafo inicial ainda traz Campus e Vale 3D estaticamente — MÉDIO

`world-adapter.js` importa `lobby3d.js`, `lobby-lite.js`, `vale3d.js` e `vale-lite.js` estaticamente. Rural, Militar, Espaço, Lua, Marte, Parque e novos mapas já utilizam imports dinâmicos.

O grafo estático a partir de `lobby.js` alcança **49 módulos / ~767 KB** locais. O maior ganho inicial deve vir de tornar o contrato de todos os mundos uniforme antes de ampliar lazy loading.

### O1-MED-007 — Diagnóstico atual é insuficiente para O2/O7/O24 — MÉDIO

`diagnostics.js` registra rede, dispositivo, runtime mode, quality e FPS, mas não mede draw calls, triangles, geometries, textures, RAF ativos, listeners relevantes, NPC count, vehicle count ou memória estimada.

Sem essas métricas, não é possível provar que a troca de mapas realmente estabiliza memória após 20 ciclos.

### O1-MED-008 — Release de diagnóstico desatualizada — MÉDIO

`lobby/assets/diagnostics.js` declara `RELEASE='14.10.8.66'`, enquanto a aplicação auditada é 14.10.8.83. Isso pode gerar evidência de suporte enganosa.

### O1-MED-009 — 5 testes históricos quebraram por regex rígida — MÉDIO

Na suíte selecionada, 5 testes de F72–F76 falham porque esperam listas literais de áreas antigas na Edge Function. A funcionalidade nova estendeu corretamente a lista, mas os testes não toleram mundos adicionais.

Resultado da suíte selecionada: **72 pass / 5 fail**. Falhas: F72 backend rural, F73 backend militar, F74 backend orbital, F75 backend Lua e F76 backend Marte.

Impacto: o gate de regressão pode acusar falso negativo em toda evolução de mundos. Os testes devem validar semântica, não regex exata de arrays crescentes.

### O1-MED-010 — Presença persistida não possui identidade completa de mundo/interior — MÉDIO

O estado do cliente já possui `worldId`, `scene`, `area`, `interior` e `interiorFloor`, porém `lobby_presence` persiste principalmente coordenadas + `area`. A Edge Function deriva isolamento por `area` e tokens de Chat carregam `scene`.

Isso funciona parcialmente, mas não é o contrato alvo de O19/O20 e limita isolamento explícito por interior/andar/sala. **Não alterar antes das fases O19–O21.**

### O1-MED-011 — Sistemas globais ainda coexistem com implementações específicas de mapa — MÉDIO

Há um `weather-system.js`, `dynamic-world.js`, `camera-controller.js`, `performance-manager.js` e Avatar System compartilhados, mas Parque e Colégio ainda possuem lógica própria de clima/áudio/população; NPCs e veículos também são definidos e atualizados por mapa sem um NPCSystem/VehicleSystem global.

Isto é dívida arquitetural esperada para O12–O18, não motivo para reconstruir o Lobby agora.

### O1-LOW-012 — Hysteresis adaptativo não corresponde totalmente à meta — BAIXO/MÉDIO

`createAdaptiveQualityController()` usa janelas de ~1,8 s, duas janelas ruins e quatro boas, com intervalo adaptativo mínimo de 9 s. A meta do roteiro pede queda após 5–8 s ruins e subida somente após 20–30 s estáveis. Ajuste deve ocorrer em O9 depois da instrumentação O2.

## Pontos positivos encontrados

- `WorldManager.stop()` é chamado antes das trocas Lite/3D nos fluxos principais.
- Runtimes 3D auditados cancelam RAF e fazem `renderer.dispose()`.
- Vários runtimes removem listeners, ResizeObserver e joystick no `stop()`.
- Rural, Militar, Espaço, Lua, Marte, Parque, Colégio, Labirinto e Museu usam import dinâmico em seus adapters.
- Campus já faz lazy mount/unmount de interiores de turma e ferramentas.
- Vale e Militar possuem descarte explícito de interiores.
- Colégio e Labirinto estão isolados por compatibility host em vez de duplicar o Lobby inteiro.
- Chat permanece em módulo próprio e não foi modificado nesta auditoria.

## Mapa 2D global — estado atual

Não existe um mapa 2D global baseado exclusivamente em manifests. O modo Lite atual é um runtime 2D específico de cada mundo; o teleporte global agrega destinos de vários mapas, mas isso não equivale ao mapa lógico universal especificado para O4.

## Interiores — estado atual

O Campus já possui mecanismos `ensure...` / `release...` para montar e liberar interiores. Militar e Vale também possuem controle de interior. O comportamento precisa ser medido em O7 antes de migrar novos interiores em O8.

## Chat — baseline protegido

Nenhum arquivo do Chat foi alterado. O Chat atual:

- Broadcast Realtime em canal `agv-lobby-proximity-chat-v1`;
- emissão/validação via Edge Function `lobby-presence`;
- token assinado com `scene`;
- filtro de proximidade;
- sem contrato persistido de `interiorId/floor/room` ainda.

**Regra:** não mexer até O21, exceto correção mínima indispensável de compatibilidade comprovada.

## Testes executados nesta auditoria

1. SHA-256 da F81: confirmado.
2. `node --check` em 118 JS do Lobby/SW: **118 aprovados / 0 falhas**.
3. Suíte de fundação + mundos F63A/F72–F80: **72/77 pass**; 5 falhas de teste legado por regex rígida.
4. Colégio F7 `validate-f7.mjs`: aprovado.
5. Colégio F7 `smoke-runtime.mjs`: aprovado Lite/3D.
6. Labirinto `challenge.test.mjs`: aprovado.
7. Museu `validate-museu-hardware.mjs`: **26/26 PASS**.
8. Auditoria estática de renderers/RAF/listeners/dispose/imports/SW/boot: concluída.

## Ordem recomendada a partir daqui

1. **Fechar O1 sem mudanças**, preservando este snapshot.
2. Antes de otimização visual, tratar o bloqueador da migration como correção controlada associada ao início da próxima fase segura.
3. O2: observabilidade — renderer.info, memória estimada, RAF, listeners, NPCs, veículos, world/interior.
4. O3: WorldManifest + WorldRegistry + WorldConnections, sem Chat/Presença.
5. O4: mapa 2D global por metadata.
6. Só então O5/O6/O7 para padronizar transição, lazy loading e provar descarte.

## CHECKPOINT OBRIGATÓRIO — O1

**FASE:** O1 — AUDITORIA  
**OBJETIVO:** mapear arquitetura, duplicações, gargalos, vazamentos potenciais e riscos sem alterar comportamento.

**Arquivos alterados:** nenhum arquivo funcional.  
**Arquivos criados:** somente documentação de O0/O1 neste pacote.

**Core alterado?** não  
**Chat alterado?** não  
**Banco alterado?** não  
**Edge Function alterada?** não  
**Service Worker alterado?** não

**Testes executados:** SHA, sintaxe, suíte de mundos selecionada, validações dos três mapas novos e auditoria estática.  
**Testes aprovados:** sintaxe 118/118; mapas novos aprovados; suíte histórica 72/77 com 5 falsos negativos por regex rígida.

**FPS antes:** não mensurado de forma confiável em browser nesta sandbox.  
**FPS depois:** N/A — nenhuma mudança funcional.  
**Memória antes:** não mensurada de forma confiável; O2 precisa instrumentar.  
**Memória depois:** N/A — nenhuma mudança funcional.

**Problemas encontrados:** migration 073 incorreta; boot sequencial pesado; múltiplos renderers; ausência de registry/manifest; SW com shell amplo; observabilidade insuficiente; testes legados frágeis.  
**Riscos restantes:** presença dos novos mundos em produção, contexto WebGL em stress, boot móvel, cache, isolamento futuro por interior.  
**Rollback disponível?** sim — F81 original SHA `5b4e59037d2f65d06b497213f33615ecbe845be23100d5aa982cc1831fc4dd2a`.
