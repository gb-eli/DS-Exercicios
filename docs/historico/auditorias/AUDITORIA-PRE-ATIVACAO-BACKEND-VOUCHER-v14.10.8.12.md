# Auditoria de pré-ativação — Backend Voucher +1 ponto

**Release:** v14.10.8.12  
**UI funcional:** 0.22.8.11  
**Data:** 22/08/2026  
**Estado:** RELEASE CANDIDATE — produção não alterada nesta fase

## Objetivo

Preparar a ativação segura do voucher de +1 ponto de fim de semana sem ultrapassar o gate de backup restaurável.

## O que foi verificado

- O ZIP completo da v14.10.8.11 contém `index.ts` e `session-guard.ts` na pasta da Edge Function.
- `session-guard.ts` extrai `session_id` do JWT e valida a sessão via `security_is_auth_session_active_service`.
- O guard falha fechado em `session_claim_missing`, `session_guard_unavailable` e `session_revoked`.
- A migration 047 cria somente `weekend_bonus_vouchers` e não altera tabelas de código, progresso, histórico ou claims existentes.
- A tabela mantém código único, `reward_points=1.00`, unicidade por aluno/fim de semana e trilha de emissão/resgate/revogação.
- O frontend não recebe autoridade para definir nome, turma, valor do benefício ou horário de emissão.
- O código continua opaco (`FDS-XXXX-XXXX`) e os dados pessoais permanecem no banco.

## Artefatos novos de operação

- `PREDEPLOY-VOUCHER-CHECK.sql` — verificação somente leitura de pré-requisitos e contadores críticos.
- `DEPLOY-BACKEND-VOUCHER-v14.10.8.12.md` — sequência exata backend-first.
- `ROLLBACK-VOUCHER-v14.10.8.12.md` — rollback que preserva vouchers já emitidos.
- teste `p10911-weekend-voucher-predeploy-v14.10.8.12.test.mjs`.

## Resultado de regressão

- **263/263 testes Node aprovados.**
- Teste específico de predeploy incluído e aprovado.
- Os 2 arquivos TypeScript do voucher passaram por `tsc --noEmit --noCheck` sem diagnóstico.
- 3 JSONs modificados da release foram parseados com sucesso.
- `PREDEPLOY-VOUCHER-CHECK.sql`: somente leitura.
- Migration 047: **0 referências** a `student_files`, `student_file_history`, `student_exercises` e `legacy_exercise_claims`.

A base v14.10.8.11 já havia sido validada anteriormente com a suíte cumulativa e validações do voucher; a v14.10.8.12 altera apenas documentação operacional, metadados de release e testes de predeploy — a implementação funcional 0.22.8.11 permanece congelada.

## Estado de produção

Nenhuma migration ou Edge Function foi aplicada nesta etapa.

A tentativa de repetir o snapshot live ocorreu, porém o conector Supabase ficou indisponível durante a consulta. Por isso **não foi registrado um novo fingerprint live como se estivesse confirmado**.

O último estado confirmado antes da indisponibilidade permanecia com o backend do voucher não ativado. A ativação continua bloqueada até:

1. backup restaurável confirmado;
2. conector/banco disponível;
3. `PREDEPLOY-VOUCHER-CHECK.sql` aprovado imediatamente antes da DDL;
4. snapshot/contadores críticos registrados;
5. migration 047 aplicada;
6. Edge Function publicada com `verify_jwt=true`;
7. smoke aluno → professor aprovado;
8. frontend publicado por último.

## Conclusão

A v14.10.8.12 está pronta para ativação controlada, mas **não autoriza produção por si só**. O único gate pendente fora do código é a confirmação verificável do backup restaurável e a disponibilidade do banco para o preflight final.
