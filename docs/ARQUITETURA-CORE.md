# Arquitetura do AGV Education Core

## 1. Princípio

O Core é um **backend compartilhado + SDK de integração**, não uma nova interface que substitui as plataformas. A interface universal de economia será a **Loja Virtual DS v0.9.6.0-RG** incluída neste pacote.

```text
                    AGV Education Core
      ┌────────────────────────────────────────┐
      │ Supabase Auth                          │
      │ Profiles / Roles / Turmas              │
      │ Progress + XP + Points                 │
      │ Wallet Ledger                          │
      │ Store + Inventory                      │
      │ Transfers + Marketplace                │
      │ Audit + Admin                          │
      └────────────────────────────────────────┘
                ▲           ▲          ▲
                │ SDK/API   │ SDK/API  │ SDK/API
        ┌───────┴───┐   ┌───┴─────┐  ┌┴──────────┐
        │ CTF DS    │   │ LAB DS  │  │ Planetário │ ...
        └───────────┘   └─────────┘  └────────────┘
```

## 2. Fonte da verdade

| Domínio | Fonte oficial |
|---|---|
| identidade | Supabase Auth |
| perfil | Core `profiles` |
| permissões | Core `user_roles`/admin backend |
| progresso | Core `activity_progress` |
| XP/pontos | Core `metric_ledger` |
| moedas | Core `wallets` + `wallet_ledger` |
| catálogo | Core `store_items` |
| propriedade | Core `inventory_instances` |
| vendas | Core `marketplace_*` |
| auditoria | Core `admin_audit_log` |

`localStorage` e IndexedDB ficam restritos a cache, preferências, rascunhos, checkpoints offline e compatibilidade temporária.

## 3. SDK único

Todas as plataformas deverão consumir uma API de alto nível estável:

```js
await AGVCore.init({ platformId: 'ctf-ds' });
await AGVCore.auth.signIn(email, password);
const me = await AGVCore.auth.me();
await AGVCore.progress.report({ activityId, eventType, progress, evidence });
const wallet = await AGVCore.wallet.getSummary();
const intent = await AGVCore.wallet.createTransferIntent({ toUserId, amount });
await AGVCore.wallet.confirmTransfer(intent.id);
```

O SDK não contém regras secretas nem chaves privilegiadas. Ele apenas padroniza chamadas autenticadas ao backend.

## 4. Contratos

Cada plataforma tem `platform_id` imutável e um manifesto. Toda atividade oficial usa um `activity_id` estável. IDs nunca devem depender do título visível.

Formato recomendado:

`<plataforma>:<modulo>:<atividade>`

Exemplos:

- `ctf-ds:web:sql-injection-01`
- `lab-ds2:frontend:exercicio-18`
- `planetario-ds:observatorio:trilha-01`

## 5. Operações econômicas

Toda operação iniciada pelo usuário segue:

`REQUEST/INTENT → PREVIEW → CONFIRM → ATOMIC COMMIT → RECEIPT`

A confirmação deve usar um `intent_id` de curta duração. O backend revalida tudo no momento do commit; nunca confia no preview anterior.

## 6. Offline

Plataformas podem funcionar parcialmente offline, mas:

- saldo exibido offline deve ser marcado como cache;
- não concluir transferência/compra/venda offline;
- eventos de progresso podem entrar em fila local com UUID/idempotency key;
- ao reconectar, o servidor aceita/rejeita cada evento e devolve o estado oficial;
- recompensa oficial só aparece após confirmação do Core.

## 7. Compatibilidade

Durante a migração, um adaptador pode espelhar o estado oficial de volta para variáveis antigas para evitar quebrar interfaces. Esse espelhamento é **somente leitura derivada**: o legado não volta a ser autoridade.

## 8. Loja Virtual DS

A Loja Virtual DS é uma camada de experiência sobre o Core. Ela pode manter caches e estado visual local, mas os valores abaixo sempre vêm do backend: saldo, extrato, preço efetivo, propriedade, compra, transferência e venda.

O SDK legado `DSStoreSDK` deve ser adaptado para funcionar como facade do `AGVCore`, permitindo migrar plataformas já integradas sem reescrever todos os pontos de chamada.

Eventos educacionais enviados pelo navegador **não definem moedas**. O servidor resolve a recompensa a partir do catálogo de regras.
