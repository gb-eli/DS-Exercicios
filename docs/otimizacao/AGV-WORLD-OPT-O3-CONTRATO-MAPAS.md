# AGV World — O3 Contrato dos Mapas

**Pacote:** AGV-WORLD-OPT-O3  
**Base:** AGV-WORLD-OPT-O2-v14.10.8.83-OBSERVABILIDADE  
**Versão lógica:** 14.10.8.83-O3  
**Data:** 2026-09-01  
**Escopo:** criar `WorldManifest`, `WorldRegistry` e `WorldConnections` sem alterar Chat, Presença, runtimes, WorldManager, banco, Edge Function ou Service Worker.

## Resultado

A O3 cria o contrato lógico comum dos mapas do AGV World sem conectar esse catálogo ao caminho crítico de execução. Isso é intencional: O3 padroniza metadata; O4 consumirá a metadata no mapa 2D global; O5 padronizará portais/transições no WorldManager.

### Catálogo atual

- 11 mundos registrados
- 10 conexões estruturais
- 117 destinos/POIs declarados
- 17 portais declarados
- 26 interiores declarados
- 28 perfis/instâncias NPC declarados na metadata existente
- 19 veículos/experiências veiculares declarados

Mundos:

1. `campus-ds` / scene `campus`
2. `vale-silicio` / scene `vale`
3. `rural-agv` / scene `rural`
4. `military-agv` / scene `military`
5. `space-agv` / scene `space`
6. `moon-agv` / scene `moon`
7. `mars-agv` / scene `mars`
8. `parque-diversoes-agv` / scene `parque`
9. `colegio-agv` / scene `colegio`
10. `labirinto-armadilhas` / scene `labirinto`
11. `museu-hardware-agv` / scene `museu`

## 1. WorldManifest

Novo módulo `lobby/assets/world/world-manifest.js`.

Contrato obrigatório:

- id
- scene
- name
- version
- category
- enabled
- spawn
- bounds
- portals
- connections
- destinations
- interiors
- npcProfiles
- vehicles
- environment
- identity

Extensões de compatibilidade O3:

- aliases
- sceneAliases
- presenceArea
- presenceAreas
- source
- capabilities

O manifesto é validado e congelado (`Object.freeze`) para evitar alteração acidental da metadata em runtime.

## 2. WorldManifests

`lobby/assets/world/world-manifests.js` contém snapshots lógicos dos 11 mapas atuais.

A metadata foi extraída das fontes existentes de cada mundo. O arquivo é estático e **não importa nenhum runtime Lite/3D**. Isso permite que a futura O4 consulte todo o universo sem carregar mundos 3D.

O arquivo possui aproximadamente 42,8 KB e, nesta fase, não foi adicionado ao boot nem ao WorldManager; portanto não adiciona custo ao carregamento atual.

## 3. WorldRegistry

Novo módulo `lobby/assets/world/world-registry.js`.

Fornece:

- busca por id canônico;
- busca por scene;
- busca por alias;
- busca por área de presença;
- lista por categoria/status;
- resolução unificada de referência;
- consulta de conexões.

### Compatibilidade preservada

A O3 não normaliza à força identificadores divergentes existentes. Em vez disso, registra aliases explícitos.

Casos importantes:

- Museu: adapter/map id `museu-hardware-agv`, presença `museu-hardware`, scene atual `museu`, source scene `museu-hardware`.
- Colégio: id `colegio-agv`, scene atual `colegio`, source scene `colegio-agv`.
- Labirinto: id `labirinto-armadilhas`, scene atual `labirinto`, source scene `labyrinth-traps`.

Esses valores **não foram corrigidos nem migrados** nesta fase para não antecipar O19 (Presença) e O5 (Conexões).

## 4. WorldConnections

Novo módulo `lobby/assets/world/world-connections.js`.

O grafo atual registra 10 conexões estruturais e valida que:

- nenhum destino aponta para mundo inexistente;
- não há auto-conexões;
- conexões recíprocas são identificadas como bidirecionais.

Estrutura principal:

- Campus ↔ Vale
- Campus ↔ Rural
- Campus ↔ Base de Operações
- Campus ↔ Estação Orbital
- Campus ↔ Parque
- Campus ↔ Colégio
- Campus ↔ Labirinto
- Campus ↔ Museu
- Estação Orbital ↔ Lua
- Estação Orbital ↔ Marte

O grafo é somente metadata na O3. O runtime ainda usa os fluxos atuais. A migração de portais/transições fica para O5.

## Proteções de escopo

Comparação direta com o ZIP O2 mostrou que os arquivos funcionais existentes permanecem byte a byte iguais.

Hashes preservados:

- `lobby/assets/lobby.js`: `ad1f877b4edfbab1ecd45ab8fbf2048e7898dcd16e4dea0cc6d03e359cfaf3f8`
- `lobby/assets/social/proximity-chat.js`: `d79d006c920f60c5911bfafdebdc5d2309fc1b52a4748bbcdda022b92c164a5f`
- `lobby/assets/core/world-manager.js`: `2bdd24e320217db0e3b8843583703e714afb18b3f00c1787bc617c8c743d6582`
- `lobby/assets/core/world-adapter.js`: `bf23d0ef8a2bd46f81b015b17668522e39bdf41a7f65f0f9d74621c85f01dcc7`
- `lobby/sw.js`: `0cfe4c83f11685e9c97751ed17c159f2f301b8e90dfac39f8343306f18bb1433`
- `core/database/073_lobby_new_worlds.sql`: `f5e8d4a64b997b3c005a2cf8ddd0d698a6825feb8dcdd13f2b6d5ea6bf406265`
- `core/edge-functions/lobby-presence/index.ts`: `fde4f49c46ecad384244741008f056f7a9dffd2fb35488d046a17adf780b3663`

### Chat

**Não alterado.** O Chat continua protegido até O21.

### Presença / Multiplayer

**Não alterados.** Nenhuma tentativa foi feita de trocar os identificadores atuais pelo Registry.

### Banco / Edge / SW

**Não alterados.** O bloqueador O1-BLK-001 da migration 073 permanece deliberadamente pendente.

## Testes

### O3 específico

`core/tests/o3-world-contract-v14.10.8.83.test.mjs`: **7/7 PASS**.

Valida:

- contrato completo dos 11 mundos;
- ids/scenes/aliases/áreas de presença legados;
- alinhamento de bounds/spawn/contagens com fontes atuais;
- grafo de conexões;
- ausência de imports de runtimes 3D nos manifests;
- hashes protegidos de backend/cache;
- desacoplamento do WorldManager/runtime até O4/O5.

### Regressão O2

`core/tests/o2-observability-v14.10.8.83.test.mjs`: **7/7 PASS**.

### Sintaxe e imports

- `node --check`: **135/135 JS PASS** em `lobby` + `core`.
- grafo local: **363 imports locais / 0 ausentes**.

### Suíte histórica de mundos

F63A + F72–F80: **72/77 PASS**.

São exatamente as mesmas 5 falhas F72–F76 já presentes na O1/O2. Os testes antigos usam regex fechada para listas de scenes/areas e não aceitam os mapas F81 (`colegio`, `labirinto`, `museu`). Não houve nova falha O3.

### Mapas novos oficiais

- Colégio F7 `validate-f7.mjs`: PASS
- Colégio F7 `smoke-runtime.mjs`: PASS Lite/3D
- Labirinto `challenge.test.mjs`: PASS
- Museu `validate-museu-hardware.mjs`: **26/26 PASS**

## FPS e memória

### Antes

O2 já disponibiliza telemetria em runtime, sem benchmark representativo fixo na sandbox.

### Depois

Sem mudança de runtime. FPS, DPR, draw calls, memória estimada, RAF e listeners têm o mesmo comportamento da O2.

A metadata O3 não é importada pelo boot atual; portanto não adiciona carga inicial nesta fase.

## Problemas encontrados

1. Identidade do Museu possui três valores históricos diferentes (`museu-hardware-agv`, `museu-hardware`, `museu`); O3 registra aliases e preserva tudo.
2. Colégio usa `colegio` no host atual e `colegio-agv` no source scene; preservado por alias.
3. Labirinto usa `labirinto` no host e `labyrinth-traps` no pacote original; preservado por alias.
4. Vale possui interiores de empresas carregados por runtime/data; O3 declara um descriptor dinâmico em vez de fingir uma lista estática completa.
5. O1-BLK-001 na migration 073 continua pendente.

## Riscos restantes

1. Manifests são snapshots estáticos; qualquer novo mapa/POI precisa atualizar o catálogo. O teste O3 reduz, mas não elimina, risco de drift.
2. NPC/Vehicle metadata ainda reflete estruturas locais dos mapas; padronização real fica para O12/O14.
3. WorldConnections ainda não governa transições reais; O5 fará essa migração.
4. Registry ainda não governa Presença; isso é reservado a O19.
5. Os 5 testes históricos F72–F76 continuam frágeis.

## CHECKPOINT OBRIGATÓRIO

**FASE:** O3 — CONTRATO DOS MAPAS  
**OBJETIVO:** criar `WorldManifest`, `WorldRegistry` e `WorldConnections`, preservando Chat e Presença.

**Arquivos alterados:** nenhum arquivo funcional preexistente.

**Arquivos criados:**
- `lobby/assets/world/world-manifest.js`
- `lobby/assets/world/world-manifests.js`
- `lobby/assets/world/world-registry.js`
- `lobby/assets/world/world-connections.js`
- `core/tests/o3-world-contract-v14.10.8.83.test.mjs`
- `docs/otimizacao/AGV-WORLD-OPT-O3-CONTRATO-MAPAS.md`
- `docs/otimizacao/AGV-WORLD-OPT-O3-CONTRATO-MAPAS.json`
- `release-agv-world-opt-o3.json`

**Core alterado?** não; apenas novo teste em `core/tests`.  
**Chat alterado?** não.  
**Banco alterado?** não.  
**Edge Function alterada?** não.  
**Service Worker alterado?** não.

**Testes executados:** O3; regressão O2; sintaxe; import graph; suíte F63A/F72–F80; Colégio; Labirinto; Museu.  
**Testes aprovados:** O3 7/7; O2 7/7; sintaxe 135/135; import graph 363/363; mapas novos PASS; histórica 72/77 com os mesmos 5 falsos negativos legados.

**FPS antes:** telemetria O2 disponível; sem benchmark representativo fixo.  
**FPS depois:** inalterado.  
**Memória antes:** telemetria O2 disponível.  
**Memória depois:** inalterada.

**Problemas encontrados:** aliases históricos de Museu/Colégio/Labirinto; interiores dinâmicos do Vale; O1-BLK-001 ainda pendente.  
**Riscos restantes:** drift de metadata, testes legados, migrações futuras O5/O12/O14/O19.

**Rollback disponível?** sim — retornar integralmente para `AGV-WORLD-OPT-O2-v14.10.8.83-OBSERVABILIDADE.zip`.

## Próxima fase

**O4 — MAPA 2D GLOBAL**: usar exclusivamente os manifests/registry para exibir todos os mapas e suas conexões sem carregar runtimes 3D. Chat e Presença continuam protegidos.
