# Deploy — v14.10.8.30

## Entrega

Esta atualização reúne o Modo Prova Coletiva DS1/DS2, a Retomada + Recuperação DS3 e a integração das adaptações pedagógicas aos modos de avaliação.

## Banco de dados — ordem

A base já deve conter as migrations pedagógicas e de prova anteriores. Para esta versão, aplicar nesta ordem:

1. `core/database/061_p10931_recovery_ds3_programacao.sql`
2. `core/database/062_p10931_practical_exam_guild_chat.sql`

Depois, redeploy das Edge Functions:

- `core/edge-functions/practical-exam/`
- `core/edge-functions/recovery-exam/`

## DS1 / DS2 — Modo Prova Coletiva

- lobby gamificado em guildas/squads;
- votação de liderança;
- cargos exclusivos;
- identidade e cor da guilda;
- HUD de partida;
- fullscreen durante lobby/partida quando o perfil exigir;
- animação de início `MATCH FOUND → 3 → 2 → 1 → MISSÃO INICIADA`;
- missões por fases;
- chat privado por guilda, validado e auditado no backend;
- XP/ranking separados da nota acadêmica.

## DS3 — Retomada + Recuperação

Disciplina: **Programação no Desenvolvimento de Sistemas — 3DS**.

Retomada sincronizada: 8 blocos × 3 etapas, controladas pelo professor:

1. variáveis e tipos em Python;
2. funções, parâmetros e `return`;
3. `if / elif / else`;
4. laços com `while`;
5. HTML semântico e tags;
6. CSS básico e Box Model;
7. JavaScript básico, funções, DOM e eventos;
8. integração e checklist final.

Recuperação: 20 questões × 0,25 = **5,0 pontos**. Antes de iniciar, o aluno recebe ready check e animação de partida.

## Adaptações pedagógicas

Os modos de avaliação agora leem a acomodação global `learning_mode` do aluno. São respeitados recursos como redução de movimento, menor carga visual, foco, controles ampliados, checkpoints extras e estudo domiciliar.

No estudo domiciliar, a exigência de fullscreen pode ser flexibilizada de acordo com o perfil individual. Autenticação, autorização, salvamento e correção server-side permanecem ativos.

## Operação privada — estudante em estudo domiciliar

O seed nominal individual **não deve ser enviado ao servidor web nem commitado em repositório público**. Ele é entregue separadamente no pacote operacional privado e deve ser executado diretamente no banco depois das migrations pedagógicas `049`, `050` e `051`.

O seed prepara uma trilha individual de 2DS Front-End com quatro experiências: HTML semântico, CSS básico, JavaScript/DOM e mini projeto HTML + CSS + JS, mantendo intactas as atividades convencionais e o histórico anterior.

## Verificação mínima após deploy

1. Professor cria/abre uma Prova Coletiva para DS1 ou DS2.
2. Aluno entra no lobby, escolhe guilda e testa votação/cargo.
3. Abrir chat da guilda e confirmar que apenas a própria equipe recebe as mensagens.
4. Professor inicia a partida; confirmar fullscreen (quando aplicável) e animação.
5. Criar recuperação `programacao_ds3`.
6. Iniciar retomada, avançar três etapas e confirmar mudança sincronizada no aluno.
7. Encerrar retomada e iniciar recuperação; confirmar 20 questões e total 5,0.
8. Validar um perfil com `learning_mode` e um perfil `home_study`, especialmente fullscreen opcional.
