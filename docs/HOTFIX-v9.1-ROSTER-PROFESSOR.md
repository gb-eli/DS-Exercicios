# Hotfix v9.1 — Roster no Modo Professor

## Problema
O Console Professor carregava somente `profiles` (contas Auth já ativadas). No estado atual do projeto há 133 pré-cadastros, 125 ativos e ainda 0 contas de aluno reivindicadas/ativadas. Por isso a tela exibia “Nenhum aluno encontrado”.

## Correção
- O Console Professor agora mescla `student_preregistrations` com `profiles`.
- Alunos ativos do roster aparecem mesmo antes do primeiro acesso.
- Conta ainda não ativada recebe o rótulo “Conta não ativada”.
- Ao selecionar aluno não ativado, o painel explica que ainda não há progresso central.
- Quando `claimed_user_id` surgir no primeiro acesso, o mesmo aluno passa automaticamente a carregar atividades e gabarito.
- Turma do pré-cadastro é usada antes de existir `class_memberships`.
- Deeplink `?student=<uuid>` continua funcionando para contas ativadas.
- O ADM passou a contar alunos ativos e alunos por turma a partir do roster, não somente de `profiles/class_memberships`.

Nenhuma RLS ou permissão foi relaxada.
