# AGV Campus DS — v14.10.8.56

## Lobby Vertical & Dynamic World

Base: `v14.10.8.55` (Teletransporte Global + Controle da Turma).

Esta versão amplia o Lobby mantendo **entrada padrão em 2D**, **3D opcional**, mesmo repositório/GitHub Pages, Vale do Silício AGV, teletransporte, presença e atividades existentes.

### Verticalidade e exploração
- Prédios do Campus elevados para aproximadamente 11 m.
- Telhados exploráveis com superfícies de suporte.
- Escadas externas e pontes de acesso aos telhados dos blocos 1DS, 2DS, 3DS e SUB.
- Rampa panorâmica no setor sul.
- Torre de Controle AGV com decks panorâmicos e ponto superior de observação.

### Mobilidade e atrações
- Monotrilho AGV com 8 estações: Praça Central, 1DS, Parkour, 3DS, Piscina, SUB, Vale do Silício AGV e 2DS.
- Trem ambiental com paradas nas estações e viagens guiadas com aceleração/frenagem suavizadas.
- Viagem à estação Vale realiza a transição para o Vale ao desembarcar.
- Escorregador Turbo reconstruído como percurso curvo com subida, descida guiada e saída controlada.

### Atmosfera
- Relógio do Campus no HUD.
- Modos `Automático`, `Dia` e `Noite`.
- Sol, lua, céu e iluminação dinâmica no 3D.
- Paleta dinâmica equivalente no 2D.
- Ruas, calçadas, muros, vegetação e pista de pouso integradas ao Campus.

### Câmera e desempenho
- Câmeras: terceira pessoa, primeira pessoa, ampla e visão Campus.
- FOV configurável entre 45° e 95°.
- Limite de FPS em 30, 45 ou 60 FPS.
- Indicador de FPS opcional; continua aparecendo automaticamente em degradação relevante.

### Social
- Chat por proximidade entre participantes próximos.
- Mensagens curtas, temporárias e direcionadas.
- Balões visuais no avatar em 2D/3D.
- Emissão e validação do chat protegidas por token HMAC temporário na Edge Function `lobby-presence`.
- Limite de 180 caracteres e validação server-side de proximidade.

### Personagem
- Presets: Casual, Esportivo, Institucional e Tecnológico.
- Personalização de cor principal, pele, cabelo, calça e tênis.
- Acessórios: mochila, óculos, headset e relógio.
- Estilos de cabelo/boné.
- Preferências salvas localmente; nenhuma migration de banco.

### Teletransporte preservado
- Botão `⚡ Teletransporte` permanece no HUD e recebe prioridade visual/responsiva.
- Vale do Silício AGV continua disponível como destino destacado.
- `Trazer todos até mim` permanece disponível para equipe com validação server-side.

### Banco de dados
- **Nenhuma alteração de schema/migration Supabase.**
- A única publicação de backend necessária é atualizar a Edge Function `lobby-presence` para habilitar o chat por proximidade (e manter o comando coletivo da v55).
