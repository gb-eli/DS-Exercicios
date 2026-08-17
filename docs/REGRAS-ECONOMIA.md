# Regras da economia universal

## Moeda

Uma única moeda oficial para todo o ecossistema. O nome visual pode ser configurado depois, mas internamente use `coins`/inteiro sem casas decimais.

## Invariantes

- `amount > 0` em transferências/compras/vendas.
- `balance >= 0` sempre.
- moedas não surgem sem um evento de origem auditável.
- toda moeda que sai de um usuário possui lançamento de débito.
- toda moeda que entra possui lançamento de crédito.
- transferências usam o mesmo `transfer_id` nos dois lados.
- cada lançamento possui `balance_after`.
- ledger não é editado/apagado pela aplicação.

## Tipos de lançamento sugeridos

- `reward`
- `admin_credit`
- `admin_debit`
- `store_purchase`
- `transfer_out`
- `transfer_in`
- `market_sale_out`
- `market_sale_in`
- `market_fee`
- `refund`
- `migration`
- `adjustment`

## Loja

A Loja Universal vende itens do catálogo central. Uma compra deve:

1. localizar item ativo;
2. capturar preço oficial atual;
3. validar saldo;
4. validar regra de propriedade/duplicidade;
5. debitar carteira;
6. criar inventário;
7. gravar ledger;
8. gravar recibo;
9. retornar novo saldo e item adquirido.

## Marketplace

Venda entre alunos trabalha com **instância de item**, não somente SKU. Isso permite saber quem é o proprietário real de cada skin.

## Taxa

O schema aceita `fee_amount`, mas a taxa pode começar em zero. Se for ativada futuramente, deve ser calculada no servidor e mostrada no preview antes da confirmação.
