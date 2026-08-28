# Status de implementação — v14.10.8.18

## Estado

**RELEASE CANDIDATE — pontuação acadêmica por exercício implementada e auditada localmente.**

## Implementado

- valor máximo armazenável por exercício em `exercises.config.academic_max_points`;
- migration candidata 048 com somente as sequências confirmadas;
- fallback de interface limitado às mesmas sequências confirmadas;
- `Vale 0,xx` discreto no painel do aluno;
- valor máximo e nota acadêmica no detalhe da atividade;
- Professor/Admin com `Valor máximo`, `Nota obtida` e `Situação` na linha de resumo já existente;
- Console Professor recebe `config` e `subject_slug` pelo `staff-dashboard`;
- autocorreção permanece percentual e separada de `submitted_score`.

## Não aplicado

- migration 048 ainda não aplicada ao Supabase;
- `staff-dashboard` atualizado ainda não implantado;
- nenhuma nota/status/progresso alterado;
- nenhum deploy ao vivo executado.

## Regra de segurança pedagógica

A plataforma não tenta deduzir valores além das evidências confirmadas. Em especial, 1DS Ex07+ fica sem pontuação automática até nova comprovação.
