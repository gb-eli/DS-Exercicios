# Integração AGV Core — Loja Virtual DS v0.9.6.0-RG

Esta pasta descreve como transformar a **Loja Virtual DS** na interface universal de economia do ecossistema sem perder seu design, catálogo, avatares, inventário, 3D, VFX e SDK de integração.

## Papel definitivo

- A Loja Virtual DS será a **interface oficial compartilhada** de loja, carteira, extrato, inventário, perfil visual e marketplace.
- O **AGV Education Core** será a fonte da verdade de autenticação, saldo, ledger, propriedade, compras, transferências e vendas.
- As plataformas educacionais não terão lojas paralelas: abrem/embutem esta loja ou consomem seus componentes/SDK.

## O que preservar

Preservar o visual e os recursos da versão `0.9.6.0-RG`, inclusive catálogo, modelos GLB, previews, qualidade gráfica, avatar, Mochila DS, inventário e design system.

## O que NÃO pode continuar como autoridade

`src/core/foundation.js` atualmente mantém carteira, ledger e inventário no navegador/localStorage. Isso pode permanecer como compatibilidade visual/cache temporário, mas **não pode ser a fonte oficial** depois da migração.

O SDK atual também aceita `amount` enviado pela plataforma. No modelo unificado, o cliente pode informar `eventId`, `platformId`, `activityId`, `type`, evidência e metadados, porém **o valor oficial da recompensa é calculado/validado no servidor**. Um `amount` legado, se existir durante transição, deve ser ignorado como autoridade e apenas auditado.

## Fluxo obrigatório

```text
PLATAFORMA -> AGV Core SDK -> backend -> valida regra -> ledger oficial
                                      -> Loja Virtual DS lê saldo/inventário oficial
```

Compras, transferências P2P e marketplace usam:

`INTENT -> PREVIEW -> CONFIRMAÇÃO -> COMMIT ATÔMICO -> RECIBO`

## Compatibilidade

Manter `DSStoreSDK` como facade de compatibilidade quando isso reduzir alterações nas plataformas já adaptadas, mas sua implementação deve passar a delegar para `AGVCore`, em vez de chamar a carteira local.
