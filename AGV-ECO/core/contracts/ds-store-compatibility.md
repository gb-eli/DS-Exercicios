# Contrato de compatibilidade DSStoreSDK -> AGVCore

## Objetivo

Permitir que plataformas já adaptadas ao `DSStoreSDK` continuem funcionando enquanto o backend financeiro migra para o AGV Education Core.

## Regra principal

`DSStoreSDK.reward()` deixa de creditar carteira local. Ele reporta um evento educacional autenticado ao Core.

### Entrada aceita

- `eventId` -> `idempotencyKey`
- `platformId`
- `activityId`
- `type` -> `eventType`
- `evidenceId`
- `attemptId`
- `metadata`
- `amount` legado: **não confiável; não usar como valor oficial**

### Saída

O servidor pode retornar:

- evento aceito/rejeitado;
- XP concedido;
- pontos concedidos;
- moedas concedidas;
- novo saldo oficial;
- `transaction_id`/recibo quando houver lançamento financeiro.

## Offline

Eventos de progresso podem ser enfileirados com idempotência. Mutação financeira iniciada por usuário (compra, transferência, anúncio/compra de marketplace) requer conexão e confirmação no servidor.
