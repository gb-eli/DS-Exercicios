# DS Exercícios v14.10.8.33

## Prova Coletiva — operação multiplayer de dois encontros

Esta versão corrige a prova para o modelo pedagógico real: começa em sala, pode continuar em casa e permanece aberta até o professor determinar o encerramento definitivo na próxima aula.

### Regras de sessão

- não existe mais encerramento automático quando o tempo de referência termina;
- o relógio mostra **tempo de operação decorrido**;
- **Encerrar encontro • continuar em casa** mantém a sessão em execução;
- **Retomar encontro presencial** sinaliza a continuidade na aula seguinte;
- **Encerrar avaliação definitivamente** é a única ação docente que fecha os envios;
- a pausa técnica continua existindo no backend apenas como bloqueio temporário/emergencial.

### Liderança e Ready Check

- eleição exige quórum de maioria dos integrantes da guilda;
- o líder distribui cargos, mas o aluno precisa clicar em **Aceitar missão • READY**;
- a partida não inicia enquanto houver cargo sem aceite;
- o professor pode nomear um líder/interino durante a operação em caso de falta, internet ou dispositivo;
- o líder não expulsa mais colegas: apenas solicita troca e o professor aprova ou nega.

### Trabalho em equipe

A missão final agora tem um **Squad Gate**: todas as missões individuais das áreas realmente ocupadas precisam estar concluídas. Isso cria dependência entre os integrantes e evita que o líder faça kickoff + entrega final ignorando o restante do squad.

Handoffs pedagógicos exibidos no Mission Board:

- Análise → requisitos/critério para o restante do squad;
- Design → referência visual para Front-end;
- Banco → dados/regras para Back-end;
- Back-end → regra funcional;
- QA → validação e testes;
- Cyber → revisão de riscos;
- Negócios → conexão da solução ao problema/MVP.

### UX/UI e responsividade

- em celular, **Minha missão + equipe** vira a visão compacta padrão;
- o squad completo continua acessível com um toque;
- ranking de guildas é priorizado;
- ranking individual fica secundário;
- primeira entrada mantém MATCH FOUND / 3-2-1;
- reconexões usam uma intro curta **RECONNECTING SQUAD / SESSION FOUND**;
- estudo domiciliar continua com fullscreen opcional quando previsto na adaptação;
- reduce_motion e focus_mode continuam reduzindo estímulos visuais.

### Supervisão docente

O painel passa a exibir:

- Ready Check de cada integrante;
- botão para definir líder/interino;
- solicitações de troca de integrante com Aprovar/Negar;
- chat das guildas em modo somente leitura;
- estado de continuação em casa;
- tempo decorrido da operação.

### Banco e deploy

Não existe migration nova nesta versão.

Continuam necessárias:

- `core/database/061_p10931_recovery_ds3_programacao.sql`
- `core/database/062_p10931_practical_exam_guild_chat.sql`

É obrigatório redeployar `core/edge-functions/practical-exam/` após subir este pacote.

O DS3 Retomada + Recuperação permanece integralmente preservado.
