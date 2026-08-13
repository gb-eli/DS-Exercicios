# Edge Functions planejadas

- `agv-progress-event`: valida JWT, manifesto da plataforma, activity/event, idempotência, limites e grava evento/progresso/métricas.
- `agv-reward-claim`: somente créditos econômicos permitidos pelo catálogo/regras; nunca aceita `amount` arbitrário do cliente como autoridade.
- `agv-store-intent` / `agv-store-confirm`: compra oficial.
- `agv-market-list`: cria/cancela listagem validando propriedade.
- `agv-market-intent` / `agv-market-confirm`: compra P2P com lock e commit atômico.
- `agv-admin-*`: consultas/mutações administrativas com checagem de papel confiável.

Para chamadas autenticadas do cliente, valide o JWT e obtenha o usuário do contexto. Secrets ficam somente na função. O código real deve ser produzido/testado no projeto Supabase conectado.


## Estado de implementação 13/08/2026

Implementadas no projeto central:

- `agv-progress-event` v2;
- `agv-reward-claim` v1.

Os fontes implantados estão nas subpastas homônimas deste diretório. Compra, transferência, marketplace e admin continuam nas fases seguintes.
