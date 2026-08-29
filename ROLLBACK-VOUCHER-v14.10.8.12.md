# Rollback operacional — Voucher de fim de semana

O rollback prioriza **preservar a trilha de auditoria**.

## Nunca fazer automaticamente

- não apagar `weekend_bonus_vouchers` depois que houver emissão;
- não limpar `redeemed_at` para reutilizar código;
- não alterar `reward_points` de vouchers já emitidos;
- não transferir voucher entre alunos/turmas;
- não converter resgate em nota automaticamente.

## Falha antes da primeira emissão

Pode-se manter a tabela vazia sem impacto funcional e retirar o frontend/Edge Function até corrigir o problema.

## Falha após emissão

1. interromper novas emissões no frontend;
2. preservar a tabela e os vouchers existentes;
3. manter consulta dos códigos para não prejudicar aluno que já recebeu o benefício;
4. corrigir backend;
5. repetir smoke em conta de teste;
6. só então reabrir emissão.

## Evidência mínima antes/depois

Guardar contagens de vouchers por `weekend_id`, status issued/redeemed/revoked e os contadores críticos do portal.
