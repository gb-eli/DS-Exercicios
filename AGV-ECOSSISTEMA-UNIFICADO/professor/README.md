# Console Professor

Frontend sem gabaritos embutidos. Usa:

- `staff-dashboard` para escopo e lista de alunos;
- `agv-teacher-activity` para atividade recente, referência privada, revisão e importação administrativa;
- `activity_teacher_content` como armazenamento server-only das respostas.

A sessão é guardada apenas em `sessionStorage`.

## Professor

Professor comum pode:

- ver somente turmas atribuídas;
- abrir atividade de aluno da própria turma;
- consultar gabarito explicado quando já importado;
- aprovar ou solicitar ajustes;
- escrever feedback.

Não pode importar/alterar a base de gabaritos.

## Admin / super_admin

Além do escopo global, pode usar **Importar gabaritos** e selecionar o JSON privado gerado por `core/tools/build-teacher-content.py`.

O arquivo é lido localmente e enviado em lotes pequenos para `agv-teacher-activity`; ele não precisa ser publicado junto do site.

## Segurança

- nenhuma `service_role` no frontend;
- conteúdo de professor não é importado no JavaScript público;
- o aluno não recebe a resposta mesmo conhecendo `activity_id`;
- o backend revalida papel e turma em toda chamada;
- `activity_teacher_content` tem RLS e nenhum grant direto para `anon`/`authenticated`;
- a publishable key é pública por definição e depende de Auth + autorização server-side.
