# Auditoria — Pontuação acadêmica por exercício v14.10.8.18

Data: 24/08/2026  
Fase: `P10.9.17-academic-exercise-points`  
Base: `v14.10.8.17`  
Modo: candidato auditado, sem escrita em produção.

## Fonte e critério

A implementação usa somente os valores consolidados a partir dos títulos/prints do Classroom fornecidos para esta etapa:

| Disciplina | Faixa confirmada | Valor unitário | Total |
| --- | ---: | ---: | ---: |
| Introdução à Programação — 1DS | 01–06 | 0,75 | 4,50 |
| Programação Front-End — 2DS | 01–20 | 0,20 | 4,00 |
| Programação no Desenvolvimento de Sistemas — 3DS | 01–08 | 0,50 | 4,00 |

A captura fornecida de Exercício 05 também reforça o padrão `0,5 | Exercício 05` do 3DS. A implementação não usa o campo visual `/50` do Classroom como valor acadêmico; o valor confirmado vem da identificação da atividade.

## Decisão de modelagem

O valor é propriedade do **exercício**, não da disciplina. A chave canônica é:

`exercises.config.academic_max_points`

Isso permite que a mesma disciplina tenha exercícios, quiz, projeto ou recuperação com valores distintos no futuro.

## Conversão da nota

A nota acadêmica exibida é calculada por:

`academic_max_points × submitted_score / 100`

Exemplo: exercício de `0,50` com `submitted_score = 80` → `0,40 / 0,50`.

`auto_score` continua sendo autocorreção técnica e não é promovido automaticamente a nota acadêmica quando não existe entrega (`submitted_score`).

## UX

### Aluno

- valor aparece como `Vale 0,xx` em texto secundário, sem novo card;
- detalhe da atividade mostra `Valor máximo` e, quando houver entrega, a equivalência da melhor entrega em pontos;
- o desenho atual, responsividade e identidade visual foram preservados.

### Professor/Admin

A linha de resumo existente passa a mostrar, quando aplicável:

`Valor máximo 0,50 • Nota obtida 0,40 • Autocorreção 80% • Melhor entrega 80% • ...`

Nenhum novo card foi criado para evitar `card soup`.

## Backend

- Migration candidata: `core/database/048_p10917_academic_exercise_points.sql`;
- Edge Function alterada: `core/edge-functions/staff-dashboard/index.ts`;
- `staff-dashboard` passa a retornar `config` e `subject_slug` junto ao exercício;
- nenhuma alteração automática em `student_exercises`, `legacy_exercise_claims`, `student_files` ou histórico.

## Não extrapolação

A interface possui fallback local somente para as três faixas confirmadas. Isso evita que falha de deploy da migration faça o valor desaparecer, mas também impede inferência para:

- 1DS Ex07+;
- quizzes;
- projetos;
- recuperação;
- outras disciplinas/turmas.

## Estado de produção

Nenhuma migration foi aplicada e nenhuma Edge Function foi implantada nesta geração. O pacote é candidato para publicação controlada.

## Validação final do candidato

- suíte cumulativa: **303/303 testes aprovados**;
- suíte específica P10.9.17: **6/6**;
- JS/MJS alterados/afetados: **36/36** com sintaxe válida;
- JSON: **463/463** válidos;
- entradas principais auditadas: **0 IDs duplicados**;
- runtime atual: **0 referências executáveis restantes para cache 14.10.8.17**.
