# Estado confirmado em produção — 18/08/2026

- Turma: DS-SUB-NOITE
- Disciplina: Programação Front-End — Subsequente
- FE01–FE07: configuração `student_workspace` gravada.
- FE01–FE07: `allow_html_base=true`, `allow_css_base=true`, `allow_js_base=true`.
- FE06: 3 referências no Supabase (`index.html`, `estilo.css`, `script.js`).
- Total FE01–FE07: 24 arquivos de referência já cadastrados; FE07 também possui `README.md` e `algoritmo.txt`.
- Classroom da disciplina: registro ativo no Core.
- Repositórios individuais dos alunos: permanecem configuráveis pelo próprio aluno; não inventar URLs.

## Diagnóstico do frontend atual

Nos logs de API com alunos ativos, o cliente atual acessa e salva `student_files`, consulta liberações, exercício, turma, sessão e políticas de segurança, porém não foi observado GET para `exercise_reference_files` no fluxo analisado.

Conclusão operacional: o backend contém as referências, mas a versão visual publicada precisa carregar/renderizar a tabela `exercise_reference_files`.

## Proteção contra regressão do painel administrativo

Foi identificado no `admin_audit_log` que uma sessão administrativa com estado antigo regravou `allow_html_base`, `allow_css_base` e `allow_js_base` como `false` para FE01–FE05 e FE07. Foi aplicada a migration `enforce_ds_sub_frontend_reference_bases`, que mantém esses três campos em `true` apenas nas liberações gerais FE01–FE07 de `DS-SUB-NOITE` / `programacao-front-end-sub`.

A proteção foi testada tentando gravar `false` em FE01: o `RETURNING` confirmou os três campos ainda como `true`.
