# CORREÇÕES — ETAPA 25

## Escopo
Central de Apoio / mensagens aluno-professor.

## Diagnóstico
A falha restante era parcialmente histórica: o contrato p10929 ainda exigia cache-bust `14.10.8.29`, enquanto a plataforma atual usa `14.10.8.65`.

Durante a auditoria foi identificado um ponto real de minimização de dados no `support_overview`: para professor não-admin, a Edge Function consultava todos os perfis de estudantes e matrículas antes de filtrar em memória as turmas atribuídas. A resposta já era filtrada, mas havia overfetch desnecessário.

## Correções
- contrato p10929 alinhado ao runtime v14.10.8.65;
- `support_overview` passa a consultar `class_memberships` somente nas classes atribuídas ao professor;
- `profiles` de professor não-admin são consultados somente para os IDs permitidos;
- threads e check-ins permanecem limitados aos mesmos IDs;
- admin mantém visão global;
- respostas, alterações de status e notificações continuam passando pelo `scope()` server-side;
- criado `core/tools/validate-support-hub-stage25-v65.mjs`.

## Segurança preservada
- RLS nas quatro tabelas da Central;
- estudante vê/insere somente em thread própria;
- aluno pode atualizar apenas `read_at` de suas notificações;
- mensagens/celebrações não concedem XP, moedas ou nota;
- nenhum nome de aluno foi codificado no frontend.

## Validação
- Etapa 25: 12/12 PASS;
- testes relacionados de staff/RLS/segurança: PASS;
- cinco validadores oficiais: PASS;
- suíte completa: 374/376 PASS;
- restam somente as duas rotas legadas P7.1.

## Produção
A alteração de minimização de dados está em `core/edge-functions/staff-dashboard/index.ts`. Ela NÃO foi publicada automaticamente no Supabase nesta etapa. É necessário fazer deploy da Edge Function no projeto Supabase correto para ativar essa melhoria server-side em produção.
