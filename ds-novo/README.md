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

## v0.4.0
- Runtime Python reaproveitado da versão oficial do 1DS, com Pyodide 0.27.7 em Web Worker.
- `input()`, stdout, stderr e tracebacks no terminal.
- Edge Function `staff-dashboard` exige JWT e confirma papel teacher/admin/super_admin no servidor.
- Painel de turma com progresso médio, atividade recente e acompanhamento do conteúdo salvo.
- O acompanhamento atualiza a cada 2 segundos sobre o autosave do aluno; colaboração simultânea de edição será ativada após a política privada do Supabase Realtime ser consolidada.

## v0.5.0
- Design system Black Engine profissional e unificado.
- Painel professor/admin com gerenciamento por aluno e exercício.
- Acomodações, apoios, dicas extras, bases HTML/CSS/JS e apoio guiado.
- Aprovação manual, revisão pendente, solicitar ajustes e feedback docente.
- Acompanhamento seguro do código atualizado a cada 1 segundo sobre o autosave.
- O aluno visualiza feedback/acondicionamentos autorizados no próprio exercício.

## v0.6.0
- Mostra apenas o número da versão no topo da plataforma.
- Fluxo previsto para professor/admin: convite por e-mail e criação da própria senha.
- Fluxo de aluno permanece e-mail institucional + CGM temporário no primeiro acesso.

## v0.7.0
- Acesso de professor/admin por link enviado ao e-mail institucional.
- E-mails autorizados ficam em allowlist privada no Supabase.
- O servidor confirma a autorização antes de liberar o painel.
- Após o link de primeiro acesso, o usuário cria a própria senha.
- Alunos continuam usando e-mail + CGM temporário.

## v0.8.0
- Recuperação de senha por e-mail institucional.
- Fluxo de redirect compatível com a URL publicada autorizada no Supabase Auth.
- Painel docente ganhou filtro "Somente pendências" para revisão e ajustes solicitados.

## v0.9.0
- Alunos são pré-matriculados no banco em lote.
- No primeiro acesso, a plataforma tenta login normal; se a senha informada for um CGM, solicita criação de conta.
- O trigger do Supabase Auth só permite a criação quando e-mail + CGM correspondem exatamente a uma pré-matrícula ativa.
- Perfil e vínculo com a turma são criados automaticamente.
- Após o acesso, o CGM deve ser substituído por uma senha pessoal.

## v0.9.1
- Corrige o reconhecimento numérico do CGM no primeiro acesso.
- Restaura o shell completo do painel Professor/Admin.
- O painel passa a mostrar também alunos pré-matriculados que nunca acessaram.
- Mostra contadores de contas vinculadas, nunca acessou e CGM pendente sem expor o CGM no dashboard.
- Mantém acompanhamento de arquivos, revisão manual e acomodações para contas já vinculadas.

## v0.9.2
- Admin pode completar e-mail/CGM pendente pela interface, sem abrir o banco.
- Alteração de matrícula ativa/transferida sincroniza o acesso.
- Depois que a conta é vinculada, e-mail e CGM não podem ser alterados pela tela de pré-matrícula.
- O CGM permanece oculto; a UI mostra apenas se está cadastrado ou pendente.

## v0.10.0
- Recuperação de senha agora abre diretamente a criação da nova senha no evento `PASSWORD_RECOVERY`.
- `APP_VERSION` corrigido e sincronizado com a versão exibida.
- O frontend não lê mais `profiles.cgm`; no Supabase, a coluna CGM não possui SELECT para `authenticated`.
- O painel Admin ganhou filtro: Todos / Nunca acessou / Conta vinculada / CGM pendente.
- Adicionado índice para `student_exercises.approved_by`.

### Hardening complementar
- `profiles.cgm` não possui leitura pelo papel `authenticated`.
- Escritas diretas do navegador em `profiles` foram revogadas.
- `staff-dashboard` v5 não envia CGM bruto na lista de perfis.
- O painel mostra somente se o CGM está cadastrado ou pendente.

## v0.11.0
- Um único formulário autentica aluno, professor e administrador.
- Alunos continuam usando CGM no primeiro acesso.
- Equipe cadastrada na allowlist usa a senha temporária institucional no primeiro acesso e troca imediatamente.
- O Admin ganhou a tela **Equipe** para autorizar/desativar professores e administradores sem depender de convite por e-mail.
- Responsividade revisada para celular/iPhone, tablet, notebook e desktop.
