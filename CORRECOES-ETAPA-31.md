# Correções — Etapa 31 / Fase 3.1

## Objetivo
Implementar o novo ciclo temporal do Lobby e Vale sem incluir ainda chuva, neve ou tempestade.

## Regra temporal
- 24 horas no mundo = 24 minutos reais.
- 1 segundo real = 1 minuto de jogo.
- A origem temporal é determinística e independe de fuso/relógio local.
- Campus e Vale permanecem sincronizados ao alternar entre 2D e 3D.

## Implementação
### `lobby/assets/world/dynamic-world.js`
- `WORLD_REAL_CYCLE_MS = 1.440.000`;
- `WORLD_GAME_MINUTES_PER_REAL_SECOND = 1`;
- modo principal `cycle`;
- compatibilidade de `auto` → `cycle`;
- suporte a controle `fixed` assinado pela equipe;
- fases: amanhecer, dia, entardecer e noite.

### Campus
- 2D e 3D usam `state.worldTimeControl` e a mesma origem temporal;
- sol/lua/sky/fog/iluminação continuam sincronizados ao novo relógio.

### Vale
- 2D usa o mesmo relógio e corpo celeste visual;
- 3D atualiza atmosfera a cada ~1s, adequado à velocidade do ciclo;
- sol e lua visíveis foram adicionados e seguem posições opostas;
- iluminação, céu, fog, postes e ambientação noturna usam o mesmo estado temporal.

## Controle da equipe
O painel de mundo recebeu um bloco exclusivo para `teacher`, `admin` e `super_admin`:
- Ciclo AGV 24h/24min;
- hora fixa da sessão.

O frontend não confia no broadcast diretamente. O comando precisa ser:
1. emitido por `lobby-presence` (`issue_world_time`);
2. assinado com HMAC server-side;
3. recebido pelo canal Realtime;
4. validado por `verify_world_time`;
5. só então aplicado ao cliente.

O controle é temporário para usuários online/sessão atual. Não há persistência em tabela nesta fase.

## Produção
A Edge Function `core/edge-functions/lobby-presence/index.ts` foi alterada no pacote. Portanto:
- o ciclo acelerado funciona apenas com o frontend atualizado;
- o controle global da equipe depende também do deploy da Edge Function no Supabase correto;
- nenhuma migration é necessária.

## Validação
- `core/tools/validate-stage31-world-time.mjs`: 16/16 PASS;
- regressões Fases 2.1–2.4: PASS;
- validadores oficiais: PASS;
- `node --test core/tests/*.test.mjs`: 376/376 PASS.
