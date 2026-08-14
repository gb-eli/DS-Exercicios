# SDK compartilhado — AGV Education Core

Versão atual: **0.2.0**.

## Implementado

- Auth central;
- sessão/perfil;
- progresso idempotente;
- fila offline somente para progresso;
- reward claim sem `amount` confiável;
- carteira/extrato;
- intents de compra/transferência;
- inventário e marketplace (cliente preparado para os RPCs das fases seguintes).

## Regra econômica

`AGVCore.rewards.claim()` não aceita valor de moedas. O servidor resolve a regra. O adaptador `DSStoreSDK` também omite o `amount` legado quando usa transporte `agv-core`.
