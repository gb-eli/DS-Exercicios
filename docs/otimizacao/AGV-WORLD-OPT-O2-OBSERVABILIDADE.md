# AGV World — O2 Observabilidade

**Pacote:** AGV-WORLD-OPT-O2  
**Base:** F81 / v14.10.8.83  
**Data:** 2026-09-01  
**Escopo:** adicionar métricas e diagnóstico sem mudar a arquitetura, Chat, Presença, banco, Edge Function ou Service Worker.

## Resultado

A O2 adiciona uma camada central de observabilidade e snapshots por runtime, cobrindo modos **Lite e 3D** sem alterar regras de jogo, física, câmera, autenticação, presença ou carregamento de mundos.

### Métricas disponíveis

- FPS real do runtime (incluindo os runtimes Lite oficiais)
- frame time derivado do FPS
- quality
- DPR
- draw calls (`renderer.info.render.calls`)
- triangles
- points / lines
- geometries (`renderer.info.memory.geometries`)
- textures (`renderer.info.memory.textures`)
- programs, quando exposto pelo Three.js
- NPC count
- vehicle count
- currentWorld
- currentScene
- currentInterior
- RAF pendentes observados
- listeners persistentes relevantes observados
- objetos da cena / objetos visíveis
- memória aproximada de buffers geométricos
- memória aproximada de texturas
- memória GPU estimada
- heap JS quando `performance.memory` estiver disponível

## Implementação

### 1. `render/observability.js`

Novo módulo pequeno e sem estado global de jogo. Ele:

- lê `renderer.info` sem modificar o renderer;
- percorre a cena somente na amostragem para estimar memória;
- deduplica geometrias, materiais, texturas e buffers por referência;
- estima textura como RGBA e considera mipmaps quando aplicável;
- mantém `null` para métricas indisponíveis, evitando apresentar `0` falso;
- fornece contador de FPS para loops Lite que antes não publicavam FPS.

A estimativa de memória **não é VRAM exata**. O campo `estimatedMemoryMethod` identifica explicitamente o método usado.

### 2. Diagnóstico central

`lobby/assets/diagnostics.js` passou para `diagnosticSchema: 2` e release `14.10.8.83-O2`.

O snapshot inclui:

- métricas de runtime;
- instrumentação de RAF;
- listeners relevantes;
- heap JS, quando suportado;
- resumo técnico no painel `?diag=1`.

A instrumentação de listeners usa `WeakMap` por alvo, sem manter uma lista global de elementos/targets. Listeners `once` são excluídos do contador persistente. Tipos observados: teclado, resize, pointer, wheel/touch, visibility, click e `webglcontextlost`.

A instrumentação de RAF registra callbacks pendentes, solicitados, executados, cancelados e pico de pendências. Ela preserva o callback original e o contexto de chamada.

### 3. Amostragem

O Lobby consolida um snapshot a cada **5 segundos**, apenas enquanto a página está visível. Essa frequência foi escolhida para evitar que a própria auditoria de geometria/textura gere custo perceptível por frame.

FPS continua sendo atualizado pelos próprios loops; a varredura de memória não roda a cada frame.

### 4. Cobertura de runtimes

Snapshots foram adicionados aos runtimes 3D auditados:

- Campus
- Vale
- Rural
- Base de Operações
- Estação Orbital
- Lua
- Marte
- Parque de Diversões
- Museu do Hardware
- Deep Space
- Compatibility Plugin Host (Colégio/Labirinto)

E aos runtimes Lite oficiais:

- Campus
- Vale
- Rural
- Base de Operações
- Estação Orbital
- Lua
- Marte
- Parque de Diversões
- Museu do Hardware
- Compatibility Plugin Host (Colégio/Labirinto)

## Proteções de escopo

### Chat

**Não alterado.** O bloco de Chat por proximidade (`appendChatLine`, `ensureProximityChat`, `openChatWith`, `sendProximityChat`) tem o mesmo SHA-256 na O1 e O2:

`c3ca7b6981c8525e993e123b2bddcdd3208b6f35bc7d0b0fe6de9b1f0c8ea4c7`

### Banco / Edge / SW

Arquivos protegidos comparados com O1:

- `lobby/sw.js` — inalterado — SHA-256 `0cfe4c83f11685e9c97751ed17c159f2f301b8e90dfac39f8343306f18bb1433`
- `core/database/073_lobby_new_worlds.sql` — inalterado — SHA-256 `f5e8d4a64b997b3c005a2cf8ddd0d698a6825feb8dcdd13f2b6d5ea6bf406265`
- `core/edge-functions/lobby-presence/index.ts` — inalterado — SHA-256 `fde4f49c46ecad384244741008f056f7a9dffd2fb35488d046a17adf780b3663`

O bloqueador `O1-BLK-001` da migration 073 continua deliberadamente **não corrigido**, pois não pertence à O2.

## Testes

### O2 específico

`core/tests/o2-observability-v14.10.8.83.test.mjs`: **7/7 PASS**.

Valida:

- `null` em métrica indisponível;
- deduplicação e estimativa de memória;
- `renderer.info` / DPR / NPC / veículo;
- contador FPS Lite;
- diagnóstico central;
- snapshots em todos os pontos 3D auditados;
- FPS/snapshot nos runtimes Lite oficiais.

### Sintaxe e dependências

- `node --check`: **131/131 JS PASS** em `lobby` + `core`.
- grafo local: **318 imports locais / 0 ausentes**.
- smoke isolado do diagnóstico: **PASS** para RAF e listener add/remove.

### Suíte histórica de mundos

F63A + F72–F80: **72/77 PASS**.

As mesmas 5 falhas F72–F76 da O1 permanecem, causadas por regex de teste legado que espera a lista antiga de áreas do backend. Não houve falha nova introduzida pela O2.

### Mapas novos oficiais

Revalidados sobre os pacotes oficiais:

- Colégio F7 `validate-f7.mjs`: PASS
- Colégio F7 `smoke-runtime.mjs`: PASS Lite/3D
- Labirinto `challenge.test.mjs`: PASS
- Museu `validate-museu-hardware.mjs`: **26/26 PASS**

## FPS e memória — baseline

### FPS antes

Não havia coleta uniforme em todos os runtimes. A O1 registrou que não foi possível obter um benchmark representativo de navegador/WebGL nesta sandbox.

### FPS depois

A O2 passa a medir o valor **em execução no navegador** por runtime. Não foi atribuído um número artificial no pacote, pois um FPS de CI/sandbox não representa os notebooks/celulares de produção.

### Memória antes

Não mensurada de forma uniforme.

### Memória depois

A O2 passa a expor `geometryMemoryMb`, `textureMemoryMb`, `estimatedGpuMemoryMb` e, quando suportado, heap JS. O valor real deve ser coletado durante o stress test em ambiente representativo; a O2 não finge um benchmark ausente.

## Riscos restantes

1. A estimativa de GPU é aproximada e não inclui todas as alocações internas do driver/WebGL.
2. `performance.memory` não está disponível em todos os navegadores.
3. O contador de listeners representa registros persistentes observados após a inicialização do diagnóstico; não substitui profiler do navegador.
4. A amostragem de cena percorre o scene graph a cada 5 s no runtime ativo; deve ser validada na futura fase de stress, embora não rode por frame.
5. O bloqueador da migration 073 permanece.
6. Os 5 testes históricos F72–F76 continuam frágeis e devem ser modernizados em fase apropriada, sem mascarar regressões.

## CHECKPOINT OBRIGATÓRIO

**FASE:** O2 — OBSERVABILIDADE  
**OBJETIVO:** adicionar métricas e diagnóstico sem mudar arquitetura.

**Arquivos alterados:**
- `lobby/index.html`
- `lobby/assets/diagnostics.js`
- `lobby/assets/lobby.js`
- `lobby/assets/lobby-lite.js`
- `lobby/assets/lobby3d.js`
- `lobby/assets/vale-lite.js`
- `lobby/assets/vale3d.js`
- `lobby/assets/rural-lite.js`
- `lobby/assets/rural3d.js`
- `lobby/assets/military-lite.js`
- `lobby/assets/military3d.js`
- `lobby/assets/space-lite.js`
- `lobby/assets/space3d.js`
- `lobby/assets/moon-lite.js`
- `lobby/assets/moon3d.js`
- `lobby/assets/mars-lite.js`
- `lobby/assets/mars3d.js`
- `lobby/assets/parque-diversoes-agv-lite.js`
- `lobby/assets/parque-diversoes-agv3d.js`
- `lobby/assets/museu-hardware-lite.js`
- `lobby/assets/museu-hardware3d.js`
- `lobby/assets/plugin-world-host.js`
- `lobby/assets/deep-space-runtime.js`

**Arquivos criados:**
- `lobby/assets/render/observability.js`
- `core/tests/o2-observability-v14.10.8.83.test.mjs`
- `docs/otimizacao/AGV-WORLD-OPT-O2-OBSERVABILIDADE.md`
- `docs/otimizacao/AGV-WORLD-OPT-O2-OBSERVABILIDADE.json`
- `release-agv-world-opt-o2.json`

**Core alterado?** não no engine; somente novo teste em `core/tests`.  
**Chat alterado?** não.  
**Banco alterado?** não.  
**Edge Function alterada?** não.  
**Service Worker alterado?** não.

**Testes executados:** O2 unit/static; sintaxe; import graph; smoke de instrumentação; suíte F63A/F72–F80; validações Colégio/Labirinto/Museu.  
**Testes aprovados:** O2 7/7; sintaxe 131/131; import graph 318/318; smoke PASS; mapas novos PASS; suíte histórica 72/77 com os mesmos 5 falsos negativos legados.
**Teste legado adicional:** `p10916-lobby-diagnostics-v14.10.8.17.test.mjs` ficou em 5/7; as 2 falhas são expectativas antigas fixadas em `diagnostics.js?v=14.10.8.66`/cache anterior. O contrato novo é coberto pelo teste O2 7/7 e não houve regressão funcional identificada.

**FPS antes:** sem baseline uniforme confiável.  
**FPS depois:** coleta runtime disponível; benchmark representativo ainda pendente para stress/homologação.  
**Memória antes:** sem baseline uniforme confiável.  
**Memória depois:** estimativa runtime disponível; benchmark representativo ainda pendente.

**Problemas encontrados:** nenhum novo bloqueador funcional da O2; confirmou-se a fragilidade dos testes legados e permanece O1-BLK-001.  
**Riscos restantes:** custo pequeno da amostragem periódica; limites das estimativas; migration 073; testes legados.

**Rollback disponível?** sim — retornar integralmente para `AGV-WORLD-OPT-O1-v14.10.8.83-AUDITORIA.zip`.

## Próxima fase

A próxima fase autorizada pelo roteiro é **O3 — Contrato dos Mapas**: `WorldManifest`, `WorldRegistry` e `WorldConnections`, sem alterar Chat ou Presença.
