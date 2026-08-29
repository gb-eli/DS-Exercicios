# Atualização — v14.10.8.18

## Objetivo

Incorporar a pontuação acadêmica real de cada exercício confirmado, sem aplicar um valor genérico para a disciplina inteira e sem misturar a porcentagem da autocorreção com a nota acadêmica.

## Valores confirmados

| Disciplina | Exercícios | Valor por exercício | Total da sequência |
| --- | ---: | ---: | ---: |
| 1DS — Introdução à Programação | 01–06 | 0,75 | 4,50 |
| 2DS — Programação Front-End | 01–20 | 0,20 | 4,00 |
| 3DS — Programação no Desenvolvimento de Sistemas | 01–08 | 0,50 | 4,00 |

**Não extrapolar:** 1DS 07+ e qualquer quiz/projeto/outra disciplina continuam sem valor automático até existir evidência específica.

## Ordem de publicação

1. Fazer backup/restauração verificável do Supabase.
2. Aplicar `core/database/048_p10917_academic_exercise_points.sql`.
3. Implantar a Edge Function atualizada `staff-dashboard`.
4. Publicar o bundle web completo.
5. Fazer smoke test como aluno e professor.

## Smoke test

1. Em 1DS Ex01–06, confirmar `Vale 0,75`.
2. Em 2DS Front-End Ex01–20, confirmar `Vale 0,20`.
3. Em 3DS Ex01–08, confirmar `Vale 0,50`.
4. Em 1DS Ex07/Ex08, confirmar que nenhum valor é inventado.
5. Com uma entrega de 80% em exercício de 0,50, o professor deve ver `Nota obtida 0,40 / 0,50`.
6. Confirmar que autocorreção continua em percentual e não altera a nota acadêmica sem `submitted_score`.
7. Confirmar que nenhuma migration alterou `student_exercises`, claims ou arquivos.

## Rollback funcional

A migration só adiciona chaves em `exercises.config`. Para remover a configuração acadêmica sem tocar em notas/progresso:

```sql
update public.exercises
set config = coalesce(config, '{}'::jsonb)
  - 'academic_max_points'
  - 'academic_points_confirmed'
  - 'academic_points_source'
where config ? 'academic_points_source'
  and config->>'academic_points_source' = 'classroom_prints_2026-08-24';
```

A release é candidata; este pacote não executou escrita nem deploy ao vivo.
