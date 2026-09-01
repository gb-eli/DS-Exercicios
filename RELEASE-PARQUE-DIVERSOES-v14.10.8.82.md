# AGV World F80 — Parque de Diversões conectado

**Versão:** 14.10.8.82  
**Build:** 14.10.8.82-stage51-parque-connected  
**Mapa incorporado:** Parque de Diversões AGV F7 (14.10.8.80-f7)

## Base da integração

Esta release foi construída sobre a última árvore completa e validada disponível: **F78 v14.10.8.80**. A F79 v14.10.8.81 era uma fase de padronização/qualidade que não chegou a ser empacotada como release completa; por segurança ela não foi usada como base do ZIP F80. O F80 preserva todos os mundos entregues até F78 e acrescenta o Parque.

## Conexão entre os mapas

O Parque passa a integrar o mesmo sistema de mundos do Lobby:

- Campus DS
- Vale do Silício AGV
- Mundo Rural AGV
- Base de Operações AGV
- Estação Orbital AGV
- Lua AGV
- Marte AGV
- **Parque de Diversões AGV**

A conexão ocorre por três caminhos:

1. **Portal físico Campus ↔ Parque** — portal dedicado no Campus e portal de retorno dentro do Parque.
2. **Teletransporte global** — o Parque possui botão destacado, filtro próprio e todos os seus destinos rápidos aparecem junto dos demais mapas. A partir de qualquer mundo é possível escolher Parque; dentro do Parque é possível escolher qualquer outro mundo do catálogo global.
3. **Controle de turma** — presença, chat de proximidade e comando de reunir reconhecem `scene=parque` / `area=parque-diversoes-agv`, mantendo as coordenadas isoladas dos demais mapas.

## Streaming / desempenho

`parque-diversoes-agv-lite.js` e `parque-diversoes-agv3d.js` são importados dinamicamente pelo `PARQUE_WORLD_ADAPTER`.

Os runtimes pesados do Parque **não entram no `CRITICAL_SHELL`** do Service Worker e não são baixados durante o boot normal do Campus. Após o primeiro acesso, a estratégia de cache normal do Lobby pode reaproveitar os arquivos localmente.

Ao trocar de mundo, o runtime do Parque encerra RAF/listeners, competição, avatares e, no 3D, renderer e objetos gráficos.

## Conteúdo preservado do Parque F7

- Montanha-Russa Vulcão
- AGV Racing
- Sky Obby / Parkour em rotas de dificuldade
- Mega Escorregador com elevador
- Tiro ao Alvo
- áreas de espectadores
- serviços e ambientação do parque
- variação de horário/clima do runtime do Parque
- perfis adaptativos de desempenho
- competição recreativa multiplayer via Supabase Realtime Broadcast

As competições do Parque usam **Broadcast efêmero**. Esta fase não cria tabela nem ranking persistente obrigatório de competição.

## Backend

### Migration obrigatória

Aplicar:

`core/database/072_lobby_amusement_park_world.sql`

Ela atualiza o constraint `lobby_presence_area_chk` para incluir:

`parque-diversoes-agv`

preservando Campus, Vale, Rural, Base, Órbita, Lua e Marte.

### Edge Function obrigatória

Republicar:

`core/edge-functions/lobby-presence/index.ts`

A função passa a aceitar `scene='parque'`, emitir/verificar tokens de reunir/chat para o Parque e continua recusando sessões de veículos terrestres do Campus em mapas externos.

## Validação executada

- Testes específicos F80: **9/9 PASS**
- Regressão selecionada F63A → F80: **119/119 PASS**
- Testes originais do Parque F7: **core PASS / integration PASS**
- Smoke original Parque: **20 idas/voltas Lite + 20 idas/voltas 3D PASS**
- Trilhos/monotrilho: **20/20 PASS**
- Horário: **16/16 PASS**
- Clima: **20/20 PASS**
- Interiores lazy: **18/18 PASS**
- Fundação do mundo: **6/6 PASS**
- Mobilidade/Cidade Viva: **PASS**
- Masterplan: **PASS**, incluindo `parque-portal` dentro da área útil
- Personalidade dos interiores: **PASS**
- Sintaxe: **69 arquivos JS de `lobby/assets` + Service Worker PASS**
- Edge Function: **TypeScript `tsc` PASS**, usando apenas declarações locais para imports JSR/Deno
- HTML: **261 IDs / 261 únicos**
- Smoke HTTP dos arquivos críticos do Parque + repair-lobby: **9/9 HTTP 200**

Não foi executado E2E visual automatizado em navegador nesta fase.

## Publicação

Para ativar completamente o Parque em produção:

1. publicar o frontend F80;
2. aplicar `072_lobby_amusement_park_world.sql`;
3. republicar `lobby-presence`;
4. abrir `repair-lobby.html` após o deploy para remover cache antigo e verificar a cadeia v14.10.8.82.

Somente publicar os arquivos de frontend deixará a presença/chat do novo mapa incompatíveis com o constraint antigo do banco.
