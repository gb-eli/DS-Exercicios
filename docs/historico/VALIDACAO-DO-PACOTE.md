# Validação do pacote — v14.10.8.18

## Resultado

- Release: `14.10.8.18`
- Fase: `P10.9.17-academic-exercise-points`
- Base: `14.10.8.17`
- UI: `0.22.8.14`
- Banco alterado no pacote: **sim, migration candidata 048**
- Edge Function alterada no pacote: **sim, staff-dashboard candidato**
- Deploy ao vivo aplicado: **não**
- Notas/progresso existentes alterados: **não**

## Pontuação acadêmica confirmada

| Disciplina | Exercícios | Valor por exercício | Total da sequência |
| --- | ---: | ---: | ---: |
| 1DS — Introdução à Programação | 01–06 | 0,75 | 4,50 |
| 2DS — Programação Front-End | 01–20 | 0,20 | 4,00 |
| 3DS — Programação no Desenvolvimento de Sistemas | 01–08 | 0,50 | 4,00 |

Não há extrapolação para 1DS Ex07+, quiz, projetos, recuperação ou outras atividades sem evidência específica.

## Testes

- Node test runner cumulativo: **303/303 aprovados**
- Testes específicos P10.9.17: **6/6 aprovados**
- JS/MJS alterados ou afetados nesta release: **36/36 aprovados com `node --check`**
- JSONs do pacote: **463/463 válidos**
- TypeScript no pacote: **52 arquivos**; o único arquivo TS funcional alterado nesta fase é `staff-dashboard/index.ts`, coberto por testes estruturais da release.
- IDs duplicados nas entradas `index.html`, `atividades`, `admin`, `professor` e `lobby`: **0**
- Referências runtime executáveis ainda apontando para cache `14.10.8.17`: **0**

## Regras validadas

- valor canônico em `exercises.config.academic_max_points`: **sim**
- fallback local limitado exatamente às três faixas confirmadas: **sim**
- aluno vê `Vale 0,xx` sem novo card: **sim**
- professor/admin vê `Valor máximo`, `Nota obtida` e `Situação`: **sim**
- nota em pontos deriva de `submitted_score`: **sim**
- `auto_score` continua separado da nota acadêmica: **sim**
- migration 048 não atualiza `student_exercises`, `legacy_exercise_claims` nem `student_files`: **sim**
- `staff-dashboard` entrega `config` e `subject_slug`: **sim**

## Gate de produção

O pacote está pronto como candidato auditado, mas a pontuação canônica no backend exige, em publicação controlada:

1. backup/restauração confirmados;
2. aplicação da migration `048_p10917_academic_exercise_points.sql`;
3. deploy da Edge Function `staff-dashboard`;
4. publicação dos arquivos web com cache `14.10.8.18`;
5. smoke test de aluno e professor em aparelho real.

Nenhuma dessas escritas/deploys de produção foi executada durante a geração deste pacote.

## Manifesto interno

O manifesto `PACKAGE_SHA256SUMS.txt` é regenerado no fechamento do ZIP e cobre todos os arquivos do pacote, exceto os dois próprios arquivos gerados de inventário/hash (`PACKAGE_CONTENTS.txt` e `PACKAGE_SHA256SUMS.txt`).

- Arquivos cobertos pelo manifesto interno: **3.060**
- Verificação `sha256sum -c`: **3.060/3.060 OK**
