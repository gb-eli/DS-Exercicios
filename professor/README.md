# Console Professor

Frontend sem gabaritos embutidos. Usa:

- `staff-dashboard` para escopo e lista de alunos;
- `agv-teacher-activity` para atividade recente, referência privada, revisão e importação administrativa;
- `activity_teacher_content` como armazenamento server-only das respostas.

A sessão usa a camada compartilhada `core/session/agv-session.js`, com a mesma sessão Supabase do Hub/Aluno e refresh automático. Abrir uma área sem permissão não destrói a sessão global.

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


## P6.5 — Acompanhamento + Aula Guiada

- resumo da turma com alunos, ativos agora, em atividade e atenção;
- presença só é afirmada quando há heartbeat/sessão recente; progresso antigo não vira “online”;
- clique em um aluno do acompanhamento leva ao detalhe individual;
- atualização silenciosa a cada 15 s enquanto o Console está visível;
- modo **Aula guiada** usa somente `solution_payload.files` recebido do endpoint privado;
- o código é revelado em etapas e recebe pontos de explicação por linguagem;
- o modo guiado não é incluído no bundle de Atividades do aluno.


## P6.6 — Liberação em aula

A liberação pode ser aplicada à turma inteira ou como exceção para um aluno específico. O painel inclui ações rápidas de liberar/bloquear, programação de horários e uma matriz de conferência por aluno. As operações continuam sujeitas às políticas/RLS de `exercise_releases` e à revalidação server-side das atividades.
