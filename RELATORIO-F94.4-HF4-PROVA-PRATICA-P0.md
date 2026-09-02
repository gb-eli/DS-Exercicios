# RELATÓRIO TÉCNICO — F94.4 HF4 / P10940

## Escopo

Hotfix P0 da Prova Prática/Recuperação antes da auditoria ampla dos mapas. A F95 permanece suspensa.

## Entregas

### Equipes

- regra normal de **3 a 7 integrantes**;
- exceção de **1 integrante** somente quando o professor autoriza a equipe;
- bloqueio de novas entradas por equipe;
- bloqueio da identidade/empresa por equipe;
- renomeação oficial pelo professor;
- início impedido quando existe equipe ocupada abaixo do mínimo sem exceção;
- equipe individual autorizada recebe liderança automática se necessário.

### Cargos

Oito cargos permanecem disponíveis:

1. Análise de Sistemas / Product Owner
2. Back-end
3. Front-end
4. Banco de Dados
5. QA / Testador
6. Design / UX/UI
7. Cyber Segurança
8. Inovação & Empreendedorismo

O aluno passa a escolher o próprio cargo. A reserva ocorre no banco com lock transacional para impedir que duas pessoas da mesma equipe ocupem o mesmo cargo simultaneamente.

O professor mantém override manual antes do início.

### Conteúdo da prova

Foram preservados os templates:

- **1DS — Análise e Método para Sistemas**
- **2DS — Inovação Tecnológica e Empreendedorismo**

A auditoria estática confirma pelo menos **2 desafios individuais para cada um dos 8 cargos em cada template**, além de atividades coletivas.

### Professor

Novos controles no painel:

- Fechar/Reabrir entradas;
- Autorizar/Remover exceção individual;
- Bloquear/Liberar identidade da empresa;
- Renomear equipe.

Já permanecem disponíveis os controles anteriores de liderança, movimentação de aluno, override de cargo, correção, reabertura, métricas, progresso e chat de equipe somente leitura.

Foram adicionadas mensagens de erro mais operacionais para equipes pequenas, liderança pendente, cargo pendente, equipe cheia e conflitos de cargo.

### Senha

O código local preserva o fluxo e-mail institucional + CGM → senha temporária → troca obrigatória. Nenhuma alteração destrutiva foi feita nessa funcionalidade.

### Adaptação pedagógica

A infraestrutura de `learning_mode` continua preservada. Nenhuma identidade nominal foi hardcoded no hotfix. A personalização específica da experiência da Prova Prática fica separada para P0.2, usando configuração privada no Supabase.

## Banco

Migration nova:

`core/database/080_p10940_practical_exam_p0_teams_roles.sql`

A migration é aditiva. Para segurança, só remove automaticamente checks legados cuja única coluna é `max_clan_size`; não apaga silenciosamente regras compostas desconhecidas.

A RPC `practical_exam_select_role` exige:

- usuário autenticado;
- perfil ativo de aluno;
- vínculo ativo com a turma da sessão;
- sessão antes do início;
- membro dentro de uma equipe;
- cargo ativo da própria sessão;
- cargo livre na própria equipe.

## Validação local

- `student.js`: sintaxe Node OK
- `admin.js`: sintaxe Node OK
- `simulator.js`: sintaxe Node OK
- todos os 5 JS de `prova/assets/`: sintaxe OK
- referências locais dos 3 HTML principais: 0 ausentes
- Edge Function `index.ts`: transpile TypeScript sem erro de sintaxe
- P10940 dedicado: **6/6 PASS**

A suíte selecionada mais ampla contém testes históricos com contratos de release antigos. Na F94.3 HF3 original já falhavam 4 testes por metadados/versões antigas. O HF4 torna adicionalmente obsoleto um teste histórico que exigia o antigo fluxo “líder atribui cargo → aluno confirma”. Esse comportamento foi substituído intencionalmente pela regra solicitada “aluno escolhe o próprio cargo”. O novo teste P10940 cobre o contrato atual.

## Limite da validação

Não foi possível validar contra o Supabase de produção do AGV World nesta sessão. O conector disponível não tem permissão no projeto `iresvqwyaqotghjssncg`.

Portanto:

- **código/preparação local: validado**;
- **produção: não alterada/não confirmada**;
- o deploy deve seguir `DEPLOY-F94.4-HF4-PROVA-PRATICA-P0.md`.
