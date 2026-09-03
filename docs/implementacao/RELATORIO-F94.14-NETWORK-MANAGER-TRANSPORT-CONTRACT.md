# F94.14 — NetworkManager + Transport Contract

## Base
F94.13 — Rapier Pilot + three-mesh-bvh.

## Objetivo
Criar uma camada única de rede para o gameplay do AGV World sem tornar o Colyseus obrigatório. A ordem de preferência é:

1. **PERFORMANCE** — `ColyseusTransport` quando houver servidor/client configurados.
2. **CONTINGENCY** — `SupabaseTransport`, preservando o realtime atual.
3. **SOLO** — `SoloTransport`, mantendo o runtime local operacional.

## Implementado

### Network Protocol V3
Novo envelope comum para gameplay:
- `player_state`
- `vehicle_state`
- `interaction`
- `world_event`
- `heartbeat`
- `ack`

Cada envelope carrega versão, tipo, `senderId`, `sessionId`, `worldId`, área, sequência e timestamp. A camada rejeita pacotes fora da janela de frescor, duplicados e pacotes de outro mundo.

### Transport Contract V1
Interface comum para transportes:
- `connect()`
- `disconnect()`
- `send()`
- `health()`
- `setContext()`
- `diagnostics()`
- `onMessage()`

### NetworkManager V2
- seleção do melhor transporte disponível;
- failover automático após limiar de falhas de saúde;
- failback para transporte de maior prioridade;
- hold mínimo para evitar flapping;
- deduplicação por sessão/remetente/tipo/sequência;
- descarte de pacotes antigos e fora do mundo atual;
- diagnóstico de transições, falhas, envios, recebimentos e descartes;
- ticker comum de estado do jogador para transportes que não possuem stream próprio.

Parâmetros atuais:
- monitor de saúde: ~5 s;
- failback probe: ~15 s;
- hold mínimo do modo: ~12 s;
- limiar de falha: 2 verificações;
- TTL de deduplicação: 20 s.

### SupabaseTransport
O realtime de avatar existente foi encapsulado pelo `SupabaseTransport` sem trocar o protocolo de avatar v2 já usado em produção. Isso reduz o risco de regressão no Lobby.

Além do avatar, o transporte possui um canal broadcast genérico `agv-lobby-network-v2` para os novos envelopes de gameplay.

### ColyseusTransport
O adapter do cliente Colyseus está pronto para:
- `joinOrCreate` da sala `agv-world`;
- envio/recebimento do evento `network-v2`;
- contexto de usuário/sessão/mundo;
- diagnóstico de conexão;
- desconexão limpa.

**Nesta fase ele continua inativo por padrão.** O ZIP F94.14 não inclui servidor Colyseus, endpoint oficial nem cliente Colyseus vendorizado. A F94.15 será a etapa de servidor no notebook.

### SoloTransport
Fallback local sempre disponível. Se Colyseus e Supabase Realtime estiverem indisponíveis, o mundo pode continuar em modo local em vez de transformar falha de rede em falha de boot.

### Integração com Lobby
- o NetworkManager é carregado de forma **lazy/opcional** depois da autenticação;
- ele não entra no `requiredAssets` crítico do boot;
- se o módulo NetworkManager não puder ser carregado, o Lobby volta para o `createRealtimeAvatarSync()` legado;
- o estado expõe `networkMode`, `networkTransport` e `networkRevision`;
- `globalThis.__agvNetworkManager` permite diagnóstico técnico;
- interações bem-sucedidas publicam apenas metadados sem texto livre;
- telemetria de veículo publica o `vehicle_state` pelo transporte ativo e continua persistindo/validando a sessão pelo backend existente.

## Autoridade preservada
A F94.14 não move autenticação, persistência ou regras de sessão para o cliente. Supabase continua sendo a fonte de identidade/persistência. O fast path de rede não substitui as regras de `lobby_vehicle_sessions`, presença administrativa, bloqueios, staff controls ou Edge Functions.

## Segurança de boot
Os módulos `network-v2` ficam no `OPTIONAL_SHELL` do Service Worker. O boot apenas faz probes opcionais e registra warning se estiverem indisponíveis.

A CSP **não foi aberta para WebSocket arbitrário** nesta fase. Quando o host WSS real do servidor for definido na F94.15, ele deverá ser adicionado de forma explícita/allowlistada ou publicado em rota segura de mesma origem.

## Limitações
- Não há servidor Colyseus real executando nesta fase.
- Não houve teste navegador + WebSocket + duas máquinas reais.
- Prediction/interpolation/reconciliation ainda não foram implementados.
- O fast path de veículo usa a cadência atual fornecida pelo runtime; a redução mais agressiva de latência será feita junto do servidor/predição.
- Canais administrativos de horário, clima, gather, cinema e spawn continuam diretamente em Supabase nesta fase.

## Próxima fase indicada
**F94.15 — Colyseus Game Server para Windows/notebook + cliente vendorizado + handshake de sala + health endpoint + scripts instalar/iniciar/parar/status/diagnóstico**, mantendo Supabase e Solo como fallback.
