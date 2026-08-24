# Auditoria 1DS — referências e códigos

Data: 2026-08-19
Base: v14.9.3

## Escopo
- 1DS — Introdução à Programação: exercícios 01–08.
- 1DS — Análise e Método para Sistemas: exercícios 01–05.
- Referências oficiais, workspaces de alunos, correspondência entre objetivo e arquivo, sintaxe Python e proteção contra arquivos indevidos.

## Resultado
- Introdução usa exclusivamente `main.py` por exercício.
- Análise usa `atividade.md` no workspace e `referencia.md` como referência.
- Nenhum workspace existente contém arquivo indevido.
- Referências possuem quebras de linha reais.
- Análise 01–05 corresponde aos respectivos objetivos.
- Encontrados dois erros reais no Supabase: Exercícios 06 e 07 de Introdução tinham indentação inválida.
- Exercícios 06 e 07 foram sincronizados com o fallback local correto e validado.
- As 8 referências Python do fallback compilam sem erro.
- Não havia autocorreções nem entregas finais de 06/07 que precisassem ser invalidadas.

## Proteção aplicada em produção
Migration `guard_1ds_canonical_files`:
- Introdução 01–08 aceita apenas `main.py` como referência e arquivo de aluno.
- Análise 01–05 aceita apenas `referencia.md` como referência e `atividade.md` como arquivo de aluno.
- Referências canônicas ativas não podem ser removidas.
- Referências devem ser não vazias e multilinha.

## Dados preservados
Nenhum código digitado por aluno foi alterado.
