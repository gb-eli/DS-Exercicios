# STATUS DE IMPLEMENTAÇÃO — AGV EDUCATION CORE

**Data:** 14/08/2026  
**Pacote-base:** v2 → v3 Fase 0/P0 → v4/v5 CTF → v6/v7 LAB → v8–v10 Exercícios/Admin → **v11.2 P4.2 Lobby Geral + Equipe + Moderação**  
**Estado:** Core central ativo + Lobby Geral P4.2 integrado + autoridade pedagógica server-side + moderação da presença social da equipe.

## Concluído

### Core

- AGVCoreSDK v0.2.0;
- Auth/perfil central compartilhado;
- progresso idempotente;
- XP/pontos com ledger;
- wallet + ledger central;
- reward claim sem `amount` confiável no cliente;
- adaptador `DSStoreSDK → AGVCore`;
- tabelas de catálogo/regras/auditoria protegidas por RLS;
- nenhuma service key no frontend.

### CTF DS 3.2.0

- 86/86 itens do catálogo (68 missões + 10 aulas + 7 blocos + 1 diário);
- 68 missões verificadas server-side;
- login central;
- XP/moedas espelhados do Core;
- aulas, ferramentas, protocolo diário, hints e Cyber Store centralizados;
- preços/custos definidos no servidor;
- sem fallback econômico local oficial.

### LAB Virtual DS

- login/identidade central;
- 50/50 ferramentas no catálogo;
- 88/88 conclusões no catálogo;
- 88/88 regras de recompensa `activity.completed`;
- total oficial preservado: 5.195 XP e 1.979 Créditos Tech;
- bônus de primeira atividade validada por nível no servidor: 15 / 30 / 50 créditos;
- marcos 30/50/70/80/90/100% no servidor: 100 / 150 / 250 / 300 / 400 / 750 créditos;
- `lab-virtual-core` consulta `activity_catalog` como fonte de verdade;
- valores locais `{xp, credits}` não são autoridade;
- 250 créditos iniciais locais não são importados;
- Loja Tech paga permanece bloqueada no modo Core;
- 88 referências privadas de professor derivadas do catálogo oficial.

### Modo Professor

- tabela `activity_teacher_content` com RLS;
- `anon`/`authenticated` sem acesso direto à tabela;
- Edge Function `agv-teacher-activity` com JWT obrigatório;
- professor comum revalidado contra `teacher_classes × class_memberships`;
- admin/super_admin com escopo global;
- Console Professor separado, sem gabaritos embutidos no HTML/JS;
- visualização preparada para atividade recente, estado do aluno, resposta esperada, arquivos preenchidos, explicação, rubrica e intervenção;
- importador privado `build-teacher-content.py` gera 88 referências dos pacotes Professor de DS1/DS2/DS3/Sub, incluindo 168 arquivos de solução;
- conteúdo gerado pelo importador deve ser carregado server-side e **não entra no pacote público**.

## Pendências conhecidas

- migrar Loja Tech/inventário do LAB para Loja Virtual DS/inventário universal;
- centralizar Arcade Minutes e usos equivalentes;
- reconciliar progresso/economia legados por processo explícito;
- carregar no banco as 88 referências privadas de DS1/DS2/DS3/Sub quando as plataformas de exercícios forem integradas ao Core;
- migrar Desafio DS e Game Informática (próximos P1);
- depois Planetário/Fliperama e LAB Sub/DS1/DS2/DS3;
- restringir CORS aos domínios finais;
- resolver versão LAB manifesto 4.28.0 × runtime 4.21.0;
- habilitar Leaked Password Protection no Supabase Auth.

### Lobby P4.2

- professor/admin circulam no Lobby junto com os alunos;
- interações continuam limitadas a emotes, sem chat livre;
- professor modera apenas alunos de turmas atribuídas; admin/super_admin têm escopo global;
- expulsão é temporária e não afeta conta, matrícula ou progresso;
- expulsões ativas podem ser consultadas e revertidas antecipadamente pela equipe autorizada;
- atividades continuam bloqueadas por `exercise_releases` e revalidadas no backend.

## Regra operacional

Nenhuma plataforma pode cair silenciosamente para saldo/XP local quando `authority=agv-core`. Conteúdo Professor nunca pode ser enviado ao aluno apenas “escondido” no frontend; deve permanecer no backend protegido.
