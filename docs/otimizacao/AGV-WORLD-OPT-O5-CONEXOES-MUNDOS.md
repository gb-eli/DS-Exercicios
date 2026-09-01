# AGV World — O5 — Conexões entre Mundos

**Base:** AGV-WORLD-OPT-O4-v14.10.8.83-MAPA-2D-GLOBAL  
**Versão:** 14.10.8.83-O5  
**Escopo:** padronização de portais, resolução de destinos e planejamento de transições pelo WorldManager/Registry, sem lazy loading novo.

## Objetivo

Implementar a fase O5 do Prompt Mestre: centralizar as conexões intermundos que estavam distribuídas em condicionais do Lobby, usando o contrato estabilizado na O3 (`WorldManifest`, `WorldRegistry`, `WorldConnections`) e preservando o comportamento existente dos mundos.

A O5 **não** implementa ainda a O6 (lazy load), não altera os runtimes Lite/3D e não modifica Chat ou Presença.

## Implementação

### 1. Navegação canônica

Foi criado `lobby/assets/world/world-navigation.js`.

O módulo:

- normaliza todos os portais físicos intermundos declarados nos manifests;
- resolve `sourceWorldId`, `targetWorldId`, `scene`, aliases, spawn e área de presença pelo `WorldRegistry`;
- rejeita portal físico cujo destino não exista;
- rejeita portal físico sem conexão válida no grafo `WorldConnections`;
- permite consultar portal por `id` ou `type` legado;
- gera um plano de transição imutável antes de qualquer troca de runtime;
- separa explicitamente **portal físico conectado** de **teletransporte direto administrativo**.

Estado atual validado:

- **11 mundos registrados**;
- **10 conexões estruturais**;
- **17 portais físicos intermundos normalizados**;
- **17/17 portais com alvo existente e aresta válida**.

### 2. WorldManager

`lobby/assets/core/world-manager.js` recebeu `planTransition()`.

A função:

1. resolve a transição pelo novo contrato;
2. registra a última transição no diagnóstico;
3. emite evento de lifecycle `transition-planned`;
4. não inicia nem encerra runtime por conta própria nesta fase.

A separação é intencional: O5 padroniza a **decisão da rota**; O6 será responsável por evoluir o carregamento/descarregamento sob demanda.

### 3. Adapters

`lobby/assets/core/world-adapter.js` agora expõe:

- `WORLD_ADAPTERS` — os 11 adapters atuais;
- `getWorldAdapter(ref)` — resolução por `id` ou `scene`.

Isso elimina do Lobby a necessidade de manter um grande condicional `scene -> adapter`.

### 4. Lobby / portais

`lobby/assets/lobby.js` passou a utilizar o planejamento central para viagens intermundos.

Foram consolidados em um único fluxo os portais de:

- Campus ↔ Vale;
- Campus ↔ Mundo Rural;
- Campus ↔ Base de Operações;
- Campus ↔ Estação Orbital;
- Campus ↔ Parque de Diversões;
- Estação Orbital ↔ Lua;
- Estação Orbital ↔ Marte;
- retornos físicos declarados nos mapas.

A viagem continua preservando:

- posição salva do Campus quando aplicável;
- posição salva da Estação Orbital nas viagens Lua/Marte;
- modal atual do Sistema Solar antes de Lua/Marte;
- modo Lite/3D atual do usuário;
- banners/toasts existentes;
- saída segura de veículo de rede durante troca de mundo;
- fluxo atual de reunião/teletransporte administrativo.

### 5. Teletransporte direto preservado

O teletransporte global/administrativo **não foi transformado em portal físico**.

Ele pode continuar levando diretamente a qualquer mundo registrado com `requireConnection: false`, preservando o comportamento operacional anterior.

Já os portais físicos usam `requireConnection: true` e precisam existir no grafo.

Isso evita duas regressões:

- impedir ferramentas administrativas legítimas por falta de uma aresta física;
- aceitar silenciosamente um portal físico apontando para um mundo desconectado/inexistente.

## Mundos sem portal físico novo

Colégio AGV, Labirinto com Armadilhas e Museu do Hardware continuam conectados logicamente ao Campus no grafo O3, mas a O5 **não inventou portais físicos nem coordenadas novas** para eles.

O acesso já existente por teletransporte permanece funcional.

## Arquivos alterados

- `lobby/assets/core/world-adapter.js`
- `lobby/assets/core/world-manager.js`
- `lobby/assets/lobby.js`

## Arquivos criados

- `lobby/assets/world/world-navigation.js`
- `core/tests/o5-world-connections-v14.10.8.83.test.mjs`
- `docs/otimizacao/AGV-WORLD-OPT-O5-CONEXOES-MUNDOS.md`
- `release-agv-world-opt-o5.json`

## Proteções

Os seguintes arquivos permanecem byte a byte idênticos à O4:

- Chat (`lobby/assets/social/proximity-chat.js`): `d79d006c920f60c5911bfafdebdc5d2309fc1b52a4748bbcdda022b92c164a5f`
- Service Worker (`lobby/sw.js`): `0cfe4c83f11685e9c97751ed17c159f2f301b8e90dfac39f8343306f18bb1433`
- Migration 073: `f5e8d4a64b997b3c005a2cf8ddd0d698a6825feb8dcdd13f2b6d5ea6bf406265`
- Edge Function `lobby-presence`: `fde4f49c46ecad384244741008f056f7a9dffd2fb35488d046a17adf780b3663`

Também não foram modificados:

- runtimes Lite/3D dos mundos;
- física;
- câmera;
- NPCs;
- veículos;
- assets visuais;
- banco/heartbeat/payload de Presença.

## Validação

### O2 + O3 + O4 + O5

**28/28 PASS**.

### O5 específico

**7/7 PASS**:

1. existe um adapter para cada um dos 11 mundos registrados;
2. os 17 portais físicos são normalizados e validados contra o grafo;
3. rotas físicas Campus e orbital são resolvidas por portal canônico;
4. teletransporte direto é preservado, enquanto portal físico exige conexão;
5. WorldManager planeja transição sem iniciar runtime;
6. Lobby usa navegação/adapters genéricos em vez do condicional antigo;
7. superfícies protegidas de Chat/Presença permanecem intocadas.

### Regressão histórica F72–F80

**66/71 PASS**.

As únicas 5 falhas são os mesmos falsos negativos legados já existentes em F72–F76, causados por regex antigas das áreas de Presença. A O5 não adicionou falha histórica nova.

F80 permanece aprovado dentro dessa regressão.

### Mapas novos — testes oficiais

- Colégio AGV F7: validação PASS + smoke Lite/3D PASS;
- Labirinto com Armadilhas: PASS;
- Museu do Hardware: **26/26 PASS**, incluindo 30 GLBs e 10 WebMs.

### Sintaxe e imports

- **134** arquivos JavaScript não-vendor verificados: **0 erros de sintaxe**;
- **374** imports locais verificados: **0 ausentes**.

### Smoke Chromium

O smoke Chromium headless foi novamente tentado, mas não concluiu dentro do limite por limitações da sandbox relacionadas a `DBus/zygote`. Ele não foi marcado como aprovado nem usado como evidência de regressão.

## Performance / memória

A O5 não modifica render loop nem passa a carregar mundos adicionais. O novo módulo de navegação é metadata/lógica e o `WorldManager.planTransition()` não inicia runtime sozinho.

Portanto:

- não há mudança intencional de FPS;
- não há novo renderer;
- não há novo mundo simultaneamente montado;
- métricas O2 permanecem disponíveis para a O6/O7.

## Bloqueador herdado

Permanece **O1-BLK-001**: `073_lobby_new_worlds.sql` tenta remover uma constraint com nome diferente da constraint histórica existente. A correção continua fora do escopo da O5.

## Rollback

Rollback direto para:

`AGV-WORLD-OPT-O4-v14.10.8.83-MAPA-2D-GLOBAL.zip`

## Próxima fase

**O6 — Lazy Load de Mapas**.

O Prompt Mestre determina começar por **Campus ↔ Arena** e depois **Campus ↔ Vale**. A base atual possui 11 mundos registrados, mas **Arena Esportiva AGV ainda não aparece no Registry desta release**. A O6 deve primeiro localizar/integrar o pacote oficial da Arena, se ele já existir, sem inventar um mundo ausente; caso não exista pacote integrado disponível, o primeiro par tecnicamente migrável da base atual é Campus ↔ Vale.

Chat e Presença continuam protegidos.
