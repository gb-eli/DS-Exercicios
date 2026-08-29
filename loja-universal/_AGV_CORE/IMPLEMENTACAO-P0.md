# Integração AGV Core — Loja Virtual DS

## Estado desta entrega

A Loja permanece visualmente intacta. O `DSStoreSDK` ganhou transporte `agv-core` e, quando `window.AGVCore` estiver disponível, passa a enviar claims de recompensa para o Core sem usar `amount` como autoridade.

`src/core/foundation.js` continua existindo para regressão/demo enquanto o backend central ainda não foi implantado. Ele **não deve ser interpretado como economia oficial** em produção.

## Ativação futura

1. Aplicar/validar migrations do Core no projeto Supabase escolhido.
2. Implantar `agv-progress-event` e `agv-reward-claim`.
3. Configurar `config/agv-core.config.js` com URL + publishable key e `enabled: true`.
4. Inicializar `AGVCoreSDK` antes do `DSStoreSDK`.
5. Migrar compra/carteira/inventário da UI para chamadas assíncronas do Core.
6. Só então remover a autoridade econômica de `foundation.js` do caminho de produção.

## Segurança

- `amount` legado é ignorado no transporte Core.
- recompensa econômica não entra em fila offline;
- compras/transferências/marketplace devem sempre exigir backend online + confirmação.
