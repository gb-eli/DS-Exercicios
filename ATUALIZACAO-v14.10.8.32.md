# DS Exercícios v14.10.8.32

## Matchmaking cinematográfico — Modo Prova Coletiva

Esta versão mantém toda a v14.10.8.31 e adiciona uma camada de entrada e ambientação mais próxima de jogos multiplayer/FPS, sem alterar a regra acadêmica da prova.

### Fluxo do aluno

Ao entrar em uma sessão supervisionada, a interface usa tela cheia quando aplicável e apresenta:

1. BUSCANDO PARTIDA
2. SINCRONIZANDO SERVIDOR
3. BUSCANDO JOGADORES
4. MONTANDO ESQUADRÃO
5. CARREGANDO MISSÃO
6. LOBBY PRONTO

Quando o professor inicia a prova, a transição continua com MATCH FOUND / DEPLOYING SQUAD / 3-2-1 / MISSÃO INICIADA.

O carregamento visual aproveita o tempo real de consulta ao backend; não cria uma segunda sessão nem grava progresso falso.

### Lobby

- wallpaper procedural tático, sem dependência de imagens externas;
- radar e scanlines;
- telemetria da sessão;
- jogadores alocados / buscando squad;
- guildas, liderança, cargos e chat já existentes;
- HUD de missão e status de conexão.

### Acessibilidade

- `reduce_motion`: desliga radar, grid e transições prolongadas;
- `focus_mode`: remove scanlines e reduz ruído visual;
- `home_study` / `fullscreen_optional`: continua permitindo estudo domiciliar sem forçar fullscreen.

### Banco e backend

Não há migration nova nesta versão.

Continuam necessárias, caso ainda não tenham sido aplicadas:

- `core/database/061_p10931_recovery_ds3_programacao.sql`
- `core/database/062_p10931_practical_exam_guild_chat.sql`

Edge Functions que devem corresponder ao pacote:

- `core/edge-functions/practical-exam/`
- `core/edge-functions/recovery-exam/`

### Privacidade

O seed nominal da estudante em estudo domiciliar não faz parte deste ZIP público. Ele deve continuar em pacote privado separado e nunca ser commitado no GitHub Pages.
