# Modelo de dados lógico

## Identidade

- `profiles`: dados públicos/mínimos do perfil.
- `user_roles`: papéis confiáveis, sem escrita pelo usuário.
- `platforms`: registro das plataformas.

## Aprendizagem

- `activity_catalog`: atividades conhecidas pelo Core.
- `activity_progress`: snapshot oficial por usuário/atividade.
- `progress_events`: trilha de eventos idempotentes.
- `metric_ledger`: lançamentos de XP e pontos.

## Economia

- `wallets`: saldo materializado por usuário.
- `wallet_ledger`: histórico imutável.
- `transaction_intents`: intenção/confirmação.
- `coin_transfers`: resumo da transferência P2P.

## Loja e inventário

- `store_items`: catálogo universal.
- `inventory_instances`: propriedade individual atual.
- `inventory_ownership_history`: cadeia de propriedade/proveniência.
- `store_purchases`: recibos de loja.
- `marketplace_listings`: ofertas ativas/encerradas.
- `marketplace_sales`: recibos de venda P2P.

## Auditoria

- `admin_audit_log`: ações administrativas.
- `security_events`: anomalias e rejeições relevantes.
