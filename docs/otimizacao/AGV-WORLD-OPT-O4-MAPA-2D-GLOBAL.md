# AGV World — O4 — Mapa 2D Global

**Base:** AGV-WORLD-OPT-O3-v14.10.8.83-CONTRATO-MAPAS  
**Versão:** 14.10.8.83-O4  
**Escopo:** visualização lógica global por metadata, sem alterar runtimes 3D.

## Objetivo

Implementar a fase O4 do Prompt Mestre: permitir que o usuário visualize todos os mundos do AGV World usando exclusivamente `WorldManifest`, `WorldRegistry` e `WorldConnections`, sem carregar mundos 3D adicionais.

## Implementação

Foi criado `lobby/assets/world/global-map.js`, que:

- consome exclusivamente o Registry/Manifests/Connections da O3;
- gera snapshot lógico dos 11 mundos;
- calcula população online a partir da presença que o Lobby já recebeu (somente leitura);
- resolve aliases históricos de presença via `WorldRegistry`;
- expõe status/disponibilidade a partir de `manifest.enabled`;
- expõe conexões, portais, POIs e eventos/experiências declaradas ou inferidas exclusivamente pela metadata;
- fornece layout lógico 2D determinístico para os 11 mundos;
- não importa `*3d.js`, `WorldManager`, Three.js, renderer ou runtimes de plugins.

A interface global foi adicionada ao Lobby com:

- botão `🗺 Mapa` no HUD;
- rede visual com os 11 mundos e 10 conexões;
- marcador do mundo atual;
- população por mundo;
- disponibilidade/manutenção;
- detalhes de categoria/versão;
- conexões navegáveis dentro da própria visão lógica;
- portais;
- POIs;
- eventos/experiências;
- ação `Abrir teletransporte` que apenas abre o fluxo existente.

A O4 **não executa viagem** e não chama `WorldManager.start()`, `start3D()`, `startLite()` ou funções `enter*`. A padronização das viagens/portais permanece reservada para O5.

## Topologia exibida

- Campus DS: hub central
- Vale do Silício AGV
- Mundo Rural AGV
- Base de Operações AGV
- Estação Orbital AGV
- Parque de Diversões AGV
- Colégio AGV
- Labirinto com Armadilhas
- Museu do Hardware AGV
- Lua AGV ligada à Estação Orbital
- Marte AGV ligado à Estação Orbital

Total: **11 mundos / 10 conexões**.

## População online

A O4 não altera banco, heartbeat ou payload da Presença. O mapa global reutiliza `state.others`, já carregado pelo Lobby, e classifica cada linha através de `WorldRegistry.byPresenceArea()`.

O usuário local é acrescentado ao mundo atual resolvido pela `scene` existente.

## Arquivos alterados

- `lobby/index.html`
- `lobby/assets/lobby.js`
- `lobby/assets/lobby.css`

## Arquivos criados

- `lobby/assets/world/global-map.js`
- `core/tests/o4-global-map-v14.10.8.83.test.mjs`
- `docs/otimizacao/AGV-WORLD-OPT-O4-MAPA-2D-GLOBAL.md`
- `release-agv-world-opt-o4.json`

## Proteções

- **Core alterado:** não
- **WorldManager alterado:** não
- **World adapters alterados:** não
- **Chat alterado:** não
- **Presença alterada:** não
- **Banco alterado:** não
- **Edge Function alterada:** não
- **Service Worker alterado:** não
- **Runtimes Lite/3D alterados:** não

Hashes protegidos preservados:

- Chat (`proximity-chat.js`): `d79d006c920f60c5911bfafdebdc5d2309fc1b52a4748bbcdda022b92c164a5f`
- Service Worker: `0cfe4c83f11685e9c97751ed17c159f2f301b8e90dfac39f8343306f18bb1433`
- Migration 073: `f5e8d4a64b997b3c005a2cf8ddd0d698a6825feb8dcdd13f2b6d5ea6bf406265`
- Edge Function lobby-presence: `fde4f49c46ecad384244741008f056f7a9dffd2fb35488d046a17adf780b3663`

## Validação

### Testes O2 + O3 + O4

**21/21 PASS**.

### O4 específico

**7/7 PASS**:

1. 11 mundos e 10 conexões sem import 3D;
2. população por aliases de presença;
3. disponibilidade, conexões, portais, POIs e eventos via metadata;
4. HUD/modal global presentes;
5. mapa não inicia runtimes nem chama portais diretamente;
6. Chat/Banco/Edge/SW preservados;
7. WorldManager/adapters permanecem desacoplados.

### Regressão histórica F72–F80

**66/71 PASS**.

As únicas 5 falhas são exatamente os falsos negativos legados já existentes:

- F72 — regex antiga de áreas de presença;
- F73 — regex antiga de áreas de presença;
- F74 — regex antiga de áreas de presença;
- F75 — regex antiga de áreas de presença;
- F76 — regex antiga de áreas de presença.

F80 permanece **9/9 PASS**.

### Mapas novos — testes de referência oficiais

- Colégio AGV F7: PASS
- Labirinto com Armadilhas: 1/1 PASS
- Museu do Hardware: 26/26 PASS

Os arquivos funcionais desses mapas são binariamente idênticos aos da O3 nesta fase.

### Sintaxe e imports

- 133 arquivos JS não-vendor em `lobby/` + `core/`: sintaxe válida
- 127 JS no `lobby/`
- 323 imports locais do Lobby verificados
- **0 imports locais ausentes**

### Smoke Chromium

O smoke headless foi tentado, mas o Chromium da sandbox não concluiu por falha de infraestrutura `DBus/zygote`. Não foi marcado como aprovado. Nenhum erro JavaScript do módulo O4 foi usado como evidência de falha; o gate permanece nos testes determinísticos acima.

## Performance / memória

A O4 não altera loops Lite/3D, renderer, física, câmera, NPC, veículos ou assets dos mundos.

- **FPS antes:** baseline O2/O3
- **FPS depois:** runtime inalterado; não re-medido de forma confiável na sandbox
- **Memória antes:** baseline O2/O3
- **Memória depois:** runtime inalterado; O4 adiciona apenas ~4,4 KB de JS estático mais UI DOM quando o modal é aberto

A interface global não carrega runtimes 3D adicionais.

## Bloqueador herdado

Permanece **O1-BLK-001**: `073_lobby_new_worlds.sql` tenta remover uma constraint com nome diferente da constraint histórica criada. A correção continua fora do escopo da O4.

## Rollback

Rollback direto: `AGV-WORLD-OPT-O3-v14.10.8.83-CONTRATO-MAPAS.zip`.

## Próxima fase

**O5 — Conexões entre mundos**: padronizar portais e integração com `WorldManager`, usando o grafo/Registry já estabilizado. Chat e Presença permanecem protegidos.
