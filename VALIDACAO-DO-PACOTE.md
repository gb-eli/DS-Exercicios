# Validação do pacote — v14.8.3

- Data: 17/08/2026
- Base operacional para atualização: v14.8.2
- Fase: P8.3 — Sessão única, Lobby geral e atividades por turma
- Testes Node: 92/92 PASS
- JavaScript alterado: `node --check` PASS
- Sessão canônica: `sb-iresvqwyaqotghjssncg-auth-token`
- Hub: primeiro acesso preserva a sessão ao redirecionar para troca de senha
- Lobby: `student`, `teacher`, `admin` e `super_admin` ativos são aceitos
- Atividades: catálogo do aluno é carregado a partir da turma principal + `class_subjects`
- Liberações: prioridade individual, depois turma, depois `default_locked`
- Proteção URL direta: `activity-progress` e `student-files` revalidam matrícula/turma/subject server-side
- SQL necessário nesta versão: NÃO
- Edge Function nova/deploy necessário nesta versão: NÃO
- Regras privadas no bundle público: NÃO

A v14.8.3 pode ser publicada diretamente sobre a v14.8.2. As pendências de backend privado do Ex04 3DS permanecem separadas e não são alteradas por esta versão.
