# Console Professor

Frontend sem gabaritos embutidos. Ele usa:

- `staff-dashboard` para escopo/lista de alunos;
- `agv-teacher-activity` para atividade recente e referência privada.

A sessão é guardada apenas em `sessionStorage`.

## Segurança

- nenhuma `service_role` no frontend;
- conteúdo de professor não é importado no JavaScript;
- o aluno não recebe o conteúdo mesmo conhecendo a URL;
- o backend revalida papel e turma em toda chamada;
- a publishable key é pública por definição e depende de Auth/RLS/Edge authorization.

Até a ingestão dos pacotes Professor, o console informa “gabarito ainda não importado” em atividades sem registro privado.
