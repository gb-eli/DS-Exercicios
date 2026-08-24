# v14.10.8.7 — Painel Professor / Revisão GitHub

## Implementado
- Novo botão **Auditoria GitHub** no Console Professor.
- Importação local do JSON privado após autenticação.
- KPIs: auditadas, avaliáveis, revisão manual e decisões em rascunho.
- Filtros por aluno, turma, disciplina, status e decisão.
- Detalhe com diagnóstico, commit congelado, caminho, nota sugerida e deficiência.
- Rascunhos locais: Aprovar, Ajustar nota, Solicitar correção, Revisar vínculo e Não correspondente.
- Exportação das decisões em JSON.
- Casos de conflito de disciplina/identidade e conteúdo de outro exercício não exibem aprovação direta.

## Segurança e privacidade
- O módulo `legacy-github-review.js` não usa `fetch`, REST do Supabase nem Edge Functions.
- Os dados identificáveis da auditoria foram removidos do pacote publicável.
- Relatórios detalhados foram separados em ZIP privado do professor.
- Nenhuma decisão local representa baixa ou nota aplicada.

## Banco
- Migration 046 é candidata e adiciona apenas campos de revisão às tabelas candidatas da migration 045.
- 044, 045 e 046 permanecem NÃO aplicadas em produção.

## Validação
- Node tests: 231/231 PASS.
- JS/MJS `node --check`: 850/850 PASS.
- JSON parse: 449/449 PASS.
- Privacy scan: PASS.
- Supabase final: 136 claims / 136 pending / 0 non-pending; student_files 450; history 14.130; student_exercises 308.
