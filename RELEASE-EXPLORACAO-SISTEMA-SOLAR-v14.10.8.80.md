# AGV World F78 — Exploração do Sistema Solar

**Versão:** 14.10.8.80  
**Build:** `stage49-deep-space`  
**Base:** F77 / 14.10.8.79

## Entrega

A F78 amplia a Estação Orbital AGV sem criar um novo mundo ou uma nova área de presença. A estação recebe uma **Central de Exploração Profunda** e um **Telescópio Espacial AGV**. A partir deles o aluno pode iniciar quatro experiências locais e didáticas:

1. **Sobrevoo de Júpiter** — órbita/aproximação da sonda e varreduras das faixas atmosféricas.
2. **Anéis de Saturno** — observação orbital dos anéis e varreduras científicas.
3. **Campo de Asteroides** — pilotagem da Sonda AGV com impulso, direção, colisão protegida e três varreduras como objetivo.
4. **Telescópio Espacial AGV** — observação de Terra, Sol, Júpiter e Saturno com seleção de alvo e zoom.

Júpiter e Saturno aparecem como **observáveis** no mapa do Sistema Solar, mas não são transformados em mundos de pouso.

## Controles

### Júpiter / Saturno
- `A/D` ou setas: orbitar.
- `W/S`: aproximar/afastar.
- `Espaço`: registrar varredura.

### Campo de Asteroides
- `W/S`: impulso e ré.
- `A/D`: direção.
- `Espaço`: varredura científica.
- Em colisão, a sonda é deslocada para um corredor seguro em vez de ser destruída.

### Telescópio
- `Q/E`: alvo anterior/próximo.
- `W/S`: zoom.
- `A/D`: orbitar a câmera.
- `Espaço`: registrar observação.

Em dispositivos touch há um controle direcional próprio dentro da missão.

## Streaming e desempenho

O arquivo `deep-space-runtime.js` **não faz parte do shell crítico**. Ele é importado dinamicamente apenas quando uma missão começa.

Ao sair da missão:
- o renderer WebGL opcional é encerrado;
- geometrias e materiais são descartados;
- listeners de teclado são removidos;
- controles da Estação Orbital são restaurados.

Lua e Marte continuam carregados somente quando o aluno viaja para esses mundos.

## Banco e backend

A F78:
- **não cria migration**;
- **não cria nova área de presença**;
- **não altera a Edge Function `lobby-presence`**;
- não grava XP, nota, saldo, progresso ou atividade acadêmica.

Se a produção ainda não recebeu a F76, seguem necessários `071_lobby_mars_world.sql` e o deploy de `lobby-presence` daquela fase.

## Validação

- F78: **10/10 PASS**
- Regressão F63A → F78: **110/110 PASS**
- Trilhos/monotrilho: **20/20 PASS**
- Interiores lazy: **18/18 PASS**
- Horário: **16/16 PASS**
- Clima: **20/20 PASS**
- Fundação: **6/6 PASS**
- Mobilidade: **PASS**
- Masterplan: **PASS**
- Personalidade dos interiores: **PASS**
- JavaScript: **61 módulos do Lobby + Service Worker PASS**
- HTML: **260/260 IDs únicos**
- Smoke HTTP: **8/8 — 200 OK**
- E2E visual automatizado em navegador: **não executado**

## Limites desta fase

Os planetas e objetos são procedurais/estilizados. O campo de asteroides é intencionalmente muito mais denso do que o real para ser jogável. As missões de sonda são locais e não sincronizam a nave entre vários usuários.
