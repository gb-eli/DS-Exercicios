# AUDITORIA — Voucher de +1 ponto por estudo no final de semana — v14.10.8.11

Data: 2026-08-22  
Fuso oficial: `America/Sao_Paulo`

## Objetivo

Premiar o aluno autenticado que acessar o Portal de Atividades durante a janela especial do fim de semana com **direito a +1 ponto extra**, comprovado por um voucher curto e verificável pelo professor.

## Experiência do aluno

- Durante a janela válida, a área de atividades exibe uma notificação fechável pelo botão **X**.
- A mensagem parabeniza o estudante pelo esforço de estudar no fim de semana.
- O benefício informa claramente **+1 ponto extra**.
- O sistema emite/recupera um código curto no formato `FDS-XXXX-XXXX`.
- O aluno pode copiar o código e enviá-lo ao professor.
- Se fechar o pop-up, o código continua acessível pelo botão **Ver código +1 ponto** no banner do Modo Final de Semana.
- O mesmo aluno recebe o mesmo voucher naquele fim de semana, inclusive se trocar de dispositivo.

## Janela de emissão

A emissão é validada **no servidor**, usando `America/Sao_Paulo`:

- sábado: válida durante todo o dia;
- domingo: válida até **17:59:59**;
- domingo às **18:00:00**: novas emissões são encerradas.

O fim da janela **não invalida o voucher já emitido**. O código pode ser verificado e resgatado posteriormente pelo professor.

## Proteção do código

O código é opaco e não contém PII codificada. Nome, turma, horário, motivo e valor ficam na tabela protegida do Supabase. O navegador não escolhe o valor do prêmio nem os dados de identidade.

Formato: `FDS-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}`. Os caracteres `0`, `1`, `I` e `O` são evitados para reduzir erro de leitura.

## Registro associado ao voucher

O registro server-side guarda:

- aluno (`student_id`);
- turma (`class_id`);
- fim de semana (`weekend_id`, data do domingo);
- código opaco;
- recompensa fixa: `1.00` ponto;
- data/hora de emissão;
- limite da janela de emissão;
- fuso oficial;
- motivo do benefício;
- situação de resgate/revogação;
- professor que realizou o resgate e observação opcional.

Há unicidade por `student_id + weekend_id`: **um voucher por aluno por fim de semana**.

## Verificação do professor

O painel de equipe recebe a ação **Ponto extra**. O professor digita o código e o servidor retorna, se estiver no escopo da turma:

- nome do aluno;
- turma/código/turno;
- `+1 ponto`;
- data e hora de emissão;
- fim de semana correspondente;
- motivo;
- situação: emitido, resgatado ou revogado;
- data de resgate, quando houver.

Professores só consultam vouchers das turmas às quais possuem acesso. Administradores/super_admin têm escopo global.

## Resgate

O botão **Marcar +1 ponto como resgatado** registra o uso do voucher. O resgate é idempotente: uma segunda tentativa não soma outro ponto; apenas informa que o código já foi usado.

**O resgate não altera automaticamente nenhuma nota.** Não há `UPDATE/INSERT` de `student_exercises`, `submitted_score`, `auto_score`, `student_files` ou histórico. O professor decide depois em qual atividade/avaliação o ponto será lançado.

## Segurança

- JWT obrigatório na Edge Function candidata.
- Sessão viva/revogada conferida server-side.
- Rate limiting por usuário/IP/ação.
- Emissão exclusiva para perfil `student` ativo e senha inicial já trocada.
- Turma informada pelo cliente é revalidada contra `class_memberships`.
- Valor e motivo são constantes server-side.
- Código gerado com `crypto.getRandomValues`.
- Tabela sem acesso direto para `anon` e `authenticated`; toda operação passa pela Edge Function com service role.
- Verificação/resgate restritos a `teacher`, `admin` e `super_admin` e ao escopo de turma.

## Arquivos principais

- `core/database/047_p10910_weekend_bonus_vouchers.sql`
- `core/edge-functions/weekend-bonus-voucher/index.ts`
- `core/edge-functions/weekend-bonus-voucher/session-guard.ts`
- `atividades/assets/js/weekend-voucher.js`
- `atividades/assets/js/workspace.js`
- `atividades/assets/js/admin.js`
- `atividades/index.html`
- `core/tests/p10910-weekend-bonus-voucher-v14.10.8.11.test.mjs`

## Validação

- suíte cumulativa: **259/259 testes aprovados**;
- JSON: **456/456 parseados**;
- Edge Functions TypeScript: **52 arquivos, 0 diagnósticos de transpile**;
- arquivos JS/MJS alterados na fase: `node --check` aprovado;
- migration 047: **0 DML** em `student_exercises`, `student_files`, `student_file_history` e `legacy_exercise_claims`;
- Edge Function: **0 mutação de nota/arquivos do aluno**.

## Estado de produção

Esta entrega é **candidata**. A migration 047 não foi aplicada e a Edge Function `weekend-bonus-voucher` não foi implantada nesta fase. Nenhuma ferramenta de escrita em produção foi chamada.

A tentativa de consulta read-only final pelo conector Supabase retornou indisponibilidade do recurso nesta execução; portanto o estado de produção não foi reconsultado após o empacotamento. Como não houve `apply_migration`, deploy de Edge Function nem SQL de escrita nesta fase, não existe alteração produzida por esta implementação.

## Gate para ativação real

1. confirmar backup restaurável do Supabase;
2. repetir snapshot/read-only de contagens e fingerprints;
3. aplicar a migration 047 de forma controlada;
4. implantar `weekend-bonus-voucher` com `verify_jwt=true`;
5. confirmar RLS/GRANTs da tabela;
6. emitir um voucher com um aluno de teste;
7. verificar/resgatar com um professor da turma;
8. confirmar que o segundo resgate é idempotente e que nenhuma nota foi alterada automaticamente.
