# v14.10.8.18 — Pontuação acadêmica por exercício

Esta release é cumulativa sobre a `v14.10.8.17`.

## Mudança principal

O sistema passa a separar claramente:

- **autocorreção técnica**: percentual 0–100;
- **valor máximo da atividade**: 0,75 / 0,20 / 0,50 conforme o exercício confirmado;
- **nota acadêmica obtida**: valor máximo × `submitted_score`.

Não existe valor genérico aplicado a toda disciplina.

## Valores confirmados

- 1DS Introdução à Programação, Ex01–06: **0,75** cada;
- 2DS Programação Front-End, Ex01–20: **0,20** cada;
- 3DS Programação no Desenvolvimento de Sistemas, Ex01–08: **0,50** cada.

1DS Ex07+ e demais atividades sem evidência específica continuam **sem valor automático**.

## Antes de publicar

Leia `ATUALIZAR.md`, `AUDITORIA-PONTUACAO-ACADEMICA-v14.10.8.18.md` e `VALIDACAO-DO-PACOTE.md`.

A migration e a Edge Function estão incluídas como candidatas; este pacote não realizou escrita/deploy ao vivo.
