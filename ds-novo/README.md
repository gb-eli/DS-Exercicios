# Exercícios Práticos DS — v0.1.0

Núcleo unificado para as plataformas de exercícios do 1DS, 2DS, 3DS e Subsequente.

## Fluxo implementado

1. Login com e-mail institucional `@escola.pr.gov.br` e senha.
2. No primeiro acesso, a senha temporária é o CGM.
3. Se `profiles.must_change_password = true`, o aluno é obrigado a criar uma senha própria.
4. O banco bloqueia exercícios/progresso enquanto a senha não for trocada.
5. Após a troca, a plataforma identifica a turma pelo `class_memberships`.
6. A turma determina as disciplinas em `class_subjects`.
7. O dashboard carrega apenas exercícios das disciplinas autorizadas.
8. Ao abrir um exercício pela primeira vez, é criado um registro em `student_exercises`.

## Segurança

- Usa apenas a publishable key no navegador.
- Nenhuma `service_role`/secret key está presente neste pacote.
- Autorização real depende das políticas RLS do projeto Supabase.
- Conteúdo do professor/gabarito deve permanecer fora deste pacote e em tabelas/policies exclusivas.

## Próxima etapa

Substituir a tela placeholder de exercício pelos editores e terminais vindos dos ZIPs de cada disciplina e ligar autosave a `student_files`.

## v0.2.0

- Editor unificado com arquivos por disciplina.
- `student_files` como fonte oficial do código do aluno.
- Autosave com debounce de 1,8 s.
- Fallback offline via `localStorage`.
- Histórico automático no banco via trigger `trg_student_file_revision`.
- Restauração de versões anteriores.
- Preview HTML/CSS/JS e área de terminal.
- Conclusão do exercício sincronizada no `student_exercises`.

Observação: execução Python real e os validadores específicos dos ZIPs serão conectados nas próximas etapas.

## v0.3.0
Integração do catálogo real dos quatro pacotes. O manifesto do aluno não contém código de referência, solução ou gabarito. Exercícios com `permitirBase=false` iniciam vazios. Primeira camada de validação automática migrada para Python/HTML e estruturas essenciais.
