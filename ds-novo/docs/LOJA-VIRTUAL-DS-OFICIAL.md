# Loja Virtual DS — componente oficial compartilhado

## Decisão arquitetural

A versão **Loja Virtual DS v0.9.6.0-RG** recebida neste pacote passa a ser a base canônica da **Loja Universal** do AGV Education Core.

Ela já possui catálogo, carteira/extrato visual, inventário, avatar, equipamentos 3D, design system, schema de transação, SDK e adaptadores. Portanto, **não criar uma segunda loja**.

## Separação de responsabilidades

| Componente | Responsabilidade |
|---|---|
| Loja Virtual DS | UX de loja, carteira, extrato, inventário, avatar, preview 3D, marketplace e componentes compartilhados |
| AGV Education Core | identidade, autorização, saldo oficial, ledger, regras de recompensa, propriedade, compra, transferência, venda, auditoria |
| Plataformas | gerar eventos educacionais e exibir/aplicar itens; nunca criar saldo oficial |

## Pontos críticos detectados na versão atual

1. `src/core/foundation.js` persiste saldo/ledger/inventário em `localStorage`. Isso é adequado apenas para demonstração/cache; precisa deixar de ser autoridade.
2. O `DSStoreSDK` recebe `amount` do cliente. No Core, a recompensa deve ser determinada no servidor por `platform_id + activity_id + event_type` e regras administrativas.
3. O SDK já possui idempotência lógica por `eventId`; esse identificador deve ser mapeado para `idempotency_key` no backend e protegido também por constraint única no banco.
4. A fila offline pode continuar para **eventos de progresso**, mas nunca deve finalizar compras, transferências ou vendas offline.
5. O bridge por `postMessage` pode continuar, exigindo lista explícita de origens permitidas em produção.

## API de compatibilidade recomendada

Durante a migração, preservar chamadas como:

```js
const sdk = DSStoreSDK.createAdapter('ctf-ds', { profileId });
await sdk.missionCompleted({
  eventId: 'ctf-ds:missao-08:<user>:first',
  activityId: 'ctf-ds:missao-08',
  evidenceId: '...',
  metadata: {}
});
```

O adaptador novo traduz a chamada para:

```js
await AGVCore.progress.report({
  activityId,
  eventType: 'MISSION_COMPLETED',
  idempotencyKey: eventId,
  payload: { evidenceId, ...metadata }
});
```

**Não transmitir um valor de moedas como autoridade.** O servidor devolve `xp_awarded`, `points_awarded`, `coins_awarded` e recibo quando aplicável.

## Loja

A Loja Virtual lê `store_items` do Core ou um catálogo publicado/sincronizado a partir dos 71 produtos atuais. O preço oficial vem do backend no momento da criação do intent e é revalidado na confirmação.

## Inventário

Cada item negociável deve possuir uma instância única em `inventory_instances`. O catálogo descreve o SKU; o inventário descreve a propriedade real.

## Marketplace

A mesma Loja Virtual deve receber abas/fluxos de:

- meus itens negociáveis;
- anunciar skin;
- anúncios disponíveis;
- confirmação de compra;
- histórico de vendas/compras;
- propriedade anterior do item quando autorizado para exibição.

A transferência de moeda e a mudança de proprietário ocorrem na mesma transação de banco.

## Plataformas que já possuem adaptadores na loja recebida

A base já contém adaptadores para `ctf-ds`, `desafio-ds`, `game-informatica`, `lab-virtual-ds`, além de outros projetos do ecossistema. Eles devem ser reaproveitados como ponto de compatibilidade, trocando o destino financeiro local pelo AGV Core.

Para Planetário, Fliperama, LAB DS1, LAB DS2, LAB DS3 e SUB, criar adaptadores equivalentes seguindo o mesmo contrato.
