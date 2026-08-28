# DS Exercícios — ADM v9 — P0 + P1 + P2

Data: 13/08/2026
Base: `DS-Exercicios_Plano_Completo_Painel_Administrativo(1).md`

## Objetivo

Esta versão implementa o primeiro grande ciclo do novo painel administrativo sem reconstruir o backend existente:

- P0 — novo painel administrativo;
- P1 — gestão operacional de usuários;
- P2 — perfil 360º do aluno.

A arquitetura reaproveita `staff-dashboard`, `supervision`, `admin-roster`, `admin-profile-user` e `agv-teacher-activity`.

## P0 — Novo ADM

Novo caminho público de aplicação:

`/admin/`

Acesso permitido somente para `admin` e `super_admin`.

Menu implementado:

1. Visão Geral
2. Usuários
3. Turmas
4. Atividades
5. Correções
6. Código dos Alunos
7. Sessões
8. GitHub
9. Segurança
10. Auditoria
11. Relatórios
12. Configurações

### Visão Geral

Cards e blocos operacionais:

- cadastrados;
- ativos;
- online agora;
- em andamento;
- concluídas;
- aguardando correção;
- GitHub pendente;
- alertas abertos;
- bloqueados;
- alunos que precisam de atenção;
- sessões online;
- últimas entregas GitHub;
- segurança recente.

Risco é exibido como apoio à revisão e nunca como acusação automática.

## P1 — Gestão de usuários

### Implementado para contas ativadas

Edge Function `admin-profile-user` v3, JWT obrigatório:

- ler detalhe privado pontual, incluindo CGM cadastral;
- editar nome;
- alterar turma;
- corrigir CGM cadastral;
- ativar/desativar acesso operacional;
- encerrar sessões de atividade;
- forçar troca de senha no próximo fluxo;
- auditoria das ações.

O CGM corrigido permanece em `student_preregistrations`. Ele não é reintroduzido em `profiles.cgm` como credencial após a ativação.

### Implementado para pré-cadastros

Reutiliza `admin-roster` v1:

- e-mail institucional antes do claim;
- CGM antes do claim;
- Matriculado / Transferido;
- ativo/inativo.

### Auth administrativo que NÃO foi simulado

Ainda pendente por bloqueio da camada de segurança do conector durante o deploy de endpoints que utilizariam `auth.admin.*`:

- alterar e-mail de uma conta Auth já ativada;
- gerar senha temporária diretamente no Auth;
- revogar todas as sessões Auth de outro usuário;
- exclusão definitiva por API administrativa.

A UI informa essa limitação em Configurações. Nenhum botão falso foi criado.

`Encerrar sessões` nesta versão encerra `activity_sessions`. Tokens JWT Auth já emitidos podem continuar válidos até expirarem, conforme o modelo de sessões do Supabase.

## P2 — Perfil 360º

Abas implementadas:

- Resumo
- Atividades
- Código
- Histórico
- GitHub
- Sessões
- Segurança
- Auditoria

### Resumo

Exibe:

- nome;
- turma;
- e-mail;
- CGM privado;
- online/offline;
- tempo hoje;
- tempo total de sessões registradas;
- concluídas;
- pendentes;
- alertas;
- GitHub;
- arquivos;
- status de conta;
- último acesso;
- troca obrigatória de senha;
- matrícula.

### Atividades

Combina:

- progresso `student_exercises` do motor unificado;
- `activity_progress` do AGV Education Core;
- status;
- percentual;
- última atividade;
- acesso ao código quando existe em `student_files`.

### Código e histórico

O professor/admin pode abrir os arquivos atuais através de `staff-dashboard -> student_files`.

Para histórico foi aplicada a migration:

`023_student_file_history_staff_read.sql`

Policy:

`private.staff_can_access_student(student_id)`

Assim o staff autorizado pode consultar as revisões de um aluno dentro do seu escopo sem abrir a tabela para todos os autenticados.

### Gabarito lado a lado

O ADM possui ação para abrir diretamente:

`/professor/?student=<uuid>`

O Console Professor foi atualizado para reconhecer esse parâmetro e selecionar automaticamente o aluno quando estiver dentro do escopo do professor.

O gabarito continua fora do bundle do aluno e é obtido por `agv-teacher-activity`.

## Segurança

- CSP no novo ADM;
- nenhuma `service_role` no frontend;
- publishable key apenas;
- CGM real não aparece na listagem ampla, somente no detalhe privado;
- gestão de conta ocorre por Edge Function administrativa;
- histórico de arquivo usa RLS por escopo de staff;
- DevTools/rapid input permanecem heurísticos;
- eventos objetivos e heurísticos são diferenciados;
- não há acusação automática de cola.

## Status das áreas posteriores

As 12 áreas já existem na navegação, mas P3–P5 ainda receberão aprofundamento:

- Central de Atividades: liberações em lote/programação/ajuda;
- Supervisão: comandos remotos completos;
- Auditoria: feed global e comparação estruturada;
- Relatórios: métricas temporais/por atividade exportáveis.

Nesta v9, essas áreas apresentam os dados e ações já suportados pelo backend, sem inventar contratos ainda inexistentes.
