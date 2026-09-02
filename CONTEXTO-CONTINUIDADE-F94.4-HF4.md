# CONTEXTO DE CONTINUIDADE — AGV World F94.4 HF4

## Estado atual

Base: F94.3 HF3 / v14.10.8.96.  
Nova linha: **F94.4 HF4 — Prova Prática P0**.  
F95 continua suspensa.

## Prioridade concluída localmente

Foi preparada a correção P0 da Prova Prática:

- equipes normais 3–7;
- exceção individual controlada por equipe/professor;
- equipe pode ser fechada para novas entradas;
- identidade da empresa pode ser bloqueada;
- professor pode renomear equipe;
- cargo é escolhido pelo próprio aluno, com reserva atômica;
- professor mantém override;
- validação de mínimo antes de iniciar;
- equipe individual autorizada pode iniciar com 1;
- mensagens de erro mais úteis;
- templates 1DS/2DS e 8 cargos preservados;
- recuperação de senha por e-mail institucional + CGM preservada.

## Não confundir com produção

O Supabase do AGV World usa a referência `iresvqwyaqotghjssncg`. O conector desta sessão não tem permissão nesse projeto. Não afirmar que migration ou Edge Function já foram aplicadas.

## Ordem obrigatória antes da aula

1. PRECHECK SQL
2. migration 080
3. Edge Function practical-exam
4. frontend prova/
5. smoke professor
6. smoke aluno
7. smoke recuperação de senha

## Exceção individual

Nunca hardcodar nome. O professor seleciona a equipe, autoriza `individual_allowed` e fecha `join_locked`.

## P0.2 — próximo após smoke do HF4

Revisar experiência adaptada da Prova Prática usando exclusivamente a infraestrutura privada de `student_accommodations / learning_mode`, com:

- instruções menores;
- roteiro passo a passo;
- explicação de termos;
- menos informação simultânea;
- checkpoints;
- retomada domiciliar;
- conteúdo/contextualização configurável pelo professor sem expor dados pessoais no bundle.

## Depois do P0

Retomar o Plano Mestre de auditoria dos mapas, começando por inventário PASS/FAIL mapa a mapa antes de qualquer refatoração grande de engine.
