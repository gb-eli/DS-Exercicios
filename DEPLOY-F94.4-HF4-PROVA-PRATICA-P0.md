# DEPLOY — F94.4 HF4 / Prova Prática P0

Base: **F94.3 HF3 / v14.10.8.96**  
Objetivo: deixar o Modo Prova Prática utilizável para 1DS e 2DS sem avançar a F95.

## Regra de segurança

A ordem é obrigatória:

1. **PRECHECK somente leitura**
2. **Migration SQL**
3. **Edge Function `practical-exam`**
4. **Frontend `prova/`**
5. **Smoke test com professor + aluno**

Não publique somente o frontend. A escolha de cargos pelo aluno depende da RPC nova no banco.

## 1. PRECHECK

No Supabase SQL Editor do projeto do AGV World, execute:

`PRECHECK-SUPABASE-F94.4-HF4.sql`

Confirme que existem as tabelas principais da Prova Prática. Se o banco retornar erro estrutural ou uma constraint composta inesperada de `max_clan_size`, não force a migration: preserve o banco e compare o schema primeiro.

## 2. MIGRATION

Execute integralmente:

`core/database/080_p10940_practical_exam_p0_teams_roles.sql`

Ela adiciona, de forma aditiva:

- `min_clan_size`;
- `join_locked`;
- `individual_allowed`;
- `identity_locked`;
- RPC atualizada `practical_exam_join_clan`;
- RPC autenticada `practical_exam_select_role`.

A migration não contém nome de estudante e não cria exceção individual automática. A exceção é habilitada pelo professor na equipe correta.

## 3. EDGE FUNCTION

Atualize a função **`practical-exam`** com:

- `core/edge-functions/practical-exam/index.ts`
- `core/edge-functions/practical-exam/session-guard.ts` (dependência preservada; só precisa ser enviada junto quando o método de deploy exigir o diretório completo)

Preserve a configuração JWT/autenticação que já está em produção. Não transforme a função em pública.

## 4. FRONTEND

Publique estes arquivos:

- `prova/index.html`
- `prova/admin.html`
- `prova/simulador.html`
- `prova/assets/student.js`
- `prova/assets/admin.js`
- `prova/assets/simulator.js`
- `prova/assets/prova.css`

Os HTMLs usam cache-bust `14.10.8.96-hf4-p0`.

## 5. SMOKE TEST DE PROFESSOR

No painel docente:

1. criar uma sessão 1DS com template **Análise e Método para Sistemas**;
2. criar/abrir uma sessão 2DS com template **Inovação Tecnológica e Empreendedorismo**;
3. confirmar limite normal **3–7**;
4. entrar com três contas de teste ou alunos autorizados;
5. confirmar que cada aluno escolhe o próprio cargo;
6. tentar escolher o mesmo cargo simultaneamente em duas contas: a segunda deve receber `role_taken`/mensagem amigável;
7. concluir votação de líder;
8. tentar iniciar equipe com 1–2 alunos: deve bloquear;
9. em uma equipe de exceção com exatamente 1 aluno, clicar **Autorizar individual** e **Fechar entradas**; o início deve ser permitido para essa equipe;
10. confirmar que o professor consegue **Renomear equipe**, **Bloquear identidade**, **Definir líder**, mover/remover integrante e fazer override de cargo antes do início;
11. iniciar a prova e conferir métricas, fases, entregas e chat somente leitura.

## 6. SMOKE TEST DE SENHA

No login único:

1. clicar **Esqueci minha senha**;
2. informar e-mail institucional cadastrado + CGM correspondente;
3. confirmar que o reset temporário exige os dois dados;
4. entrar com senha temporária e confirmar redirecionamento para troca obrigatória.

A fonte local já contém esse fluxo, mas **a Edge Function publicada não foi conferida nesta sessão**, pois o conector atual não possui acesso ao projeto AGV World.

## 7. EQUIPE INDIVIDUAL — PROCEDIMENTO CORRETO

Não usar nome de estudante em código.

Para uma exceção pedagógica individual:

1. professor coloca o aluno na equipe desejada;
2. ativa **Autorizar individual**;
3. ativa **Fechar entradas**;
4. opcionalmente ativa **Bloquear identidade**;
5. o aluno escolhe um dos 8 cargos;
6. se estiver sozinho e não houver líder, o backend o torna líder automaticamente no início.

## 8. ADAPTAÇÃO PEDAGÓGICA

O HF4 preserva o contrato existente de `student_accommodations / learning_mode`:

- modo adaptado;
- menor carga visual;
- controles ampliados quando configurado;
- fullscreen opcional/estudo domiciliar;
- checkpoints extras;
- microetapas existentes na plataforma.

A personalização nominal/individual deve permanecer no Supabase e nunca ser hardcoded no bundle público. A revisão específica do conteúdo adaptado da Prova Prática é a próxima subetapa P0.2.

## 9. ROLLBACK

Se o frontend/Edge apresentar regressão:

- restaure `prova/` e `practical-exam/index.ts` da F94.3 HF3;
- **não remova as novas colunas do banco**: são aditivas e podem permanecer sem uso;
- não reduza `max_clan_size` no banco enquanto houver sessão/equipe usando 7 integrantes;
- preserve logs/eventos de auditoria.

## Situação de produção nesta preparação

O projeto referenciado pelo AGV World é `iresvqwyaqotghjssncg`, mas o conector Supabase disponível nesta sessão retornou **sem permissão** para esse projeto. Portanto este pacote está pronto para deploy, mas **não afirma que produção foi modificada ou validada**.
