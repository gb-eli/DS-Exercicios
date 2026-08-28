# Deploy — v14.10.8.31

## O que esta revisão corrige

A tela de simulação anterior ainda parecia um painel administrativo: muitos seletores, Inspector aberto, salas genéricas e listas extensas. A v14.10.8.31 reorganiza a experiência para que a prévia do aluno seja o centro da tela e deixa as ferramentas administrativas recolhidas.

## Frontend / GitHub Pages

Subir o pacote completo. Os arquivos de `prova/` já usam cache-busting v14.10.8.31.

No simulador administrativo agora existem:

- Player Experience Lab compacto;
- navegação Lobby / Guilda / Missões / Ranking;
- prévia principal sem Inspector ocupando a lateral;
- guildas com nomes, emblemas, slots, vagas e ready-check;
- jogadores procurando equipe;
- canal visual de lobby e chat visual da guilda;
- squad loadout e mission board;
- botão de tela cheia;
- animação `MATCH FOUND → 3 → 2 → 1 → MISSÃO INICIADA`;
- controles de turma/prova/perfil/dispositivo recolhíveis.

## Backend obrigatório para dados reais no simulador

Se aparecer **Catálogo local de demonstração**, isso não é falha do novo layout. Significa que a função `practical-exam` publicada no Supabase ainda é anterior ao endpoint `staff_simulator_catalog`.

Redeployar:

- `core/edge-functions/practical-exam/`

O código do endpoint já está no pacote. Sem esse redeploy, o simulador usa jogadores genéricos propositalmente e não lê a turma real.

## Banco

A v14.10.8.31 não cria migration nova. Ela herda as migrations da entrega anterior, que precisam estar aplicadas:

1. `core/database/061_p10931_recovery_ds3_programacao.sql`
2. `core/database/062_p10931_practical_exam_guild_chat.sql`

Também manter `recovery-exam` atualizado para o DS3.

## Experiência real do aluno

Ao clicar para entrar em uma sessão supervisionada, o navegador solicita fullscreen por gesto do usuário. Durante lobby/partida a exigência permanece ativa, exceto quando a acomodação pedagógica individual define `fullscreen_optional`, como no estudo domiciliar.

O início da partida mantém a intro gamificada e o chat real é privado por guilda e validado no backend.

## DS3 e adaptações

Não foram removidas as entregas da v14.10.8.30: Retomada sincronizada do DS3 (8 blocos × 3 etapas), recuperação de 20 questões / 5,0 pontos e adaptações pedagógicas continuam presentes. O seed nominal de estudo domiciliar continua separado do bundle público.

## Validação

Executar:

```bash
node core/tests/p10932-prova-collective-ux-v14.10.8.31.test.mjs
node core/tests/p10931-multiplayer-recovery-ds3-v14.10.8.30.test.mjs
node core/tests/p10919-pedagogical-adaptations-v14.10.8.19.test.mjs
node core/tests/p5-lobby-heavy-adaptive-v11.6.test.mjs
node core/tests/p5-lobby-mobile-recovery-v11.5.2.test.mjs
```
