# v14.10.8.8 — Simulador de Aplicação das Decisões GitHub

Data: 22/08/2026  
Fase: `P10.9.7-github-application-simulator-readonly`  
Status: **RELEASE_CANDIDATE / SOMENTE LEITURA**

## Objetivo

Transformar as decisões exportadas pelo painel privado da v14.10.8.7 em um plano de aplicação verificável, mostrando **estado atual → estado proposto** sem alterar o Supabase.

## Fluxo

1. Professor revisa as atividades em **Auditoria GitHub**.
2. Exporta `AGV-DECISOES-GITHUB-AAAA-MM-DD.json`.
3. Abre **Simular baixa**.
4. Importa o arquivo de decisões.
5. O sistema consulta, em leitura, `legacy_exercise_claims`, catálogo de exercícios/disciplinas e o overview autenticado do professor.
6. O simulador cruza decisão e estado atual e produz uma matriz antes/depois.
7. O professor pode exportar `AGV-PLANO-APLICACAO-GITHUB-AAAA-MM-DD.json`.
8. O plano exportado contém `production_write_applied=false`.

## Política simulada

- `approved` / `score_adjusted`:
  - claim proposto: `approved`;
  - atividade proposta: `completed`;
  - progresso: `100`;
  - aprovação: `approved`;
  - nota: `final_score × 10`, convertendo 0–10 para 0–100 explicitamente.
- `request_fix`:
  - claim permanece `pending`;
  - atividade proposta: `in_progress`;
  - aprovação: `changes_requested`.
- `review`:
  - nenhuma alteração de banco é proposta.
- `not_corresponding`:
  - claim proposto: `rejected`;
  - atividade retorna para `in_progress` / `changes_requested`;
  - não cria crédito de conclusão.

## Bloqueios automáticos da simulação

O item fica **bloqueado** quando:

- o vínculo é `subject_scope_mismatch`, `identity_scope_mismatch` ou `wrong_exercise` e a decisão tenta aprovar;
- o claim já deixou de estar `pending`;
- a aprovação não possui nota;
- a nota proposta é menor que uma `submitted_score` já existente;
- a atividade possui `completion_source` diferente de `legacy_claim`;
- o estado do aluno mudou depois da decisão docente;
- o claim atual não pôde ser localizado de forma unívoca.

## Snapshot read-only usado para validação

Produção consultada em 22/08/2026:

- `legacy_exercise_claims`: 136;
- pendentes: 136;
- não pendentes: 0;
- claims com registro correspondente em `student_exercises`: 136;
- `student_exercises.status = completed`: 57;
- `student_exercises.status = in_progress`: 79;
- `completion_source = legacy_claim`: 136;
- com `submitted_score`: 1;
- nota já registrada nesse conjunto: 95/100.

Nenhuma query de escrita foi executada.

## Segurança

O JavaScript do simulador:

- consulta apenas dados necessários à simulação;
- não chama `review_legacy`;
- não possui `PATCH`, `PUT` ou `DELETE`;
- não chama `.update()`, `.insert()` ou `.delete()`;
- exporta somente um JSON de plano;
- não aplica migration;
- não altera claim, nota, feedback, progresso ou arquivos.

## Privacidade

O bundle publicável continua sem os relatórios identificáveis dos 136 alunos. Dados privados permanecem no pacote separado do professor e nos arquivos que ele escolhe carregar localmente.

## Próximo gate

Antes de qualquer mecanismo de aplicação real:

1. confirmar backup lógico/restaurável exigido pelo plano mestre;
2. revisar um arquivo real de decisões exportado pelo professor;
3. executar a simulação completa;
4. revisar todos os itens bloqueados e reduções de nota;
5. somente depois desenhar/aprovar o endpoint transacional de aplicação.
