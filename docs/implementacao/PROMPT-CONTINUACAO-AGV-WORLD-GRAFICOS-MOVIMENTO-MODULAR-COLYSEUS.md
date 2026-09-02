# PROMPT DE CONTINUAÇÃO — AGV WORLD
## Padronização de Engine, Movimento, Gráficos, Ambientes, Carregamento Modular e Game Server Colyseus

> Este arquivo complementa o **PROMPT MESTRE — AGV WORLD / LOBBY 3D** e deve ser usado como contexto de continuidade para as próximas fases.
>
> IMPORTANTE: a F94.5.1 ainda deve ser validada em navegador real antes de considerar o boot estabilizado em produção. As fases abaixo definem a sequência técnica posterior, sem pular validação.

---

# 1. OBJETIVO DESTA CONTINUAÇÃO

A próxima evolução do AGV World deve atacar os problemas de inconsistência entre mapas e elevar a experiência para um padrão de jogo educacional moderno, estilizado, responsivo e coerente.

Metas principais:

1. padronizar movimento, física e câmera em TODOS os mundos;
2. padronizar o comportamento entre ambientes externos e internos;
3. melhorar fortemente a qualidade gráfica e a identidade visual;
4. tornar Econômico / Médio / Alto / Ultra visualmente diferentes de verdade;
5. transformar interiores vazios em ambientes funcionais, iluminados e interativos;
6. transformar interações baseadas apenas em texto em experiências visuais e animadas;
7. modularizar carregamento de mundos, prédios, interiores, props, NPCs e sistemas;
8. permitir mapas grandes sem carregar tudo de uma vez;
9. evoluir veículos terrestres e aéreos para sistemas jogáveis consistentes;
10. preparar multiplayer de baixa latência com servidor opcional no próprio notebook;
11. manter Supabase como identidade, persistência e fallback;
12. manter Three.js como núcleo do cliente 3D.

---

# 2. REGRA DE ARQUITETURA

NÃO migrar o AGV World inteiro para outra engine.

Manter:

```text
Three.js
= renderização e cena

Rapier 3D
= física

three-mesh-bvh
= colisão espacial / raycast / queries

GLB / glTF 2.0
= assets de produção

Meshopt + gltfpack
= compressão e otimização geométrica

KTX2 / Basis
= texturas comprimidas

Supabase
= Auth + dados persistentes + Realtime fallback

Colyseus
= Game Server opcional de alto desempenho
```

---

# 3. FASE G1 — AGV WORLD RUNTIME CONTRACT V2

Criar uma camada compartilhada obrigatória para todos os mundos.

Cada mapa não poderá mais reinventar movimentação, câmera, interação, qualidade ou lifecycle.

Estrutura sugerida:

```text
lobby/assets/core/runtime-v2/
├── world-runtime-contract.js
├── world-context.js
├── runtime-lifecycle.js
├── player-locomotion.js
├── camera-controller-v2.js
├── interaction-controller.js
├── physics-controller.js
├── vehicle-controller.js
├── environment-controller.js
├── interior-controller.js
├── streaming-controller.js
└── quality-controller.js
```

Contrato mínimo por mundo:

```text
init()
load()
start()
pause()
resume()
update(dt)
interact()
enterInterior()
exitInterior()
setQuality()
stop()
dispose()
```

Objetivo:

```text
mesma velocidade
mesma sensação de peso
mesma aceleração
mesmo pulo
mesmo comportamento de câmera
mesma sensibilidade
mesma interação
mesmo padrão de veículos
mesmo padrão de HUD
```

---

# 4. FASE G2 — LOCOMOÇÃO ÚNICA

Criar `PlayerLocomotion V2`.

Centralizar:

- caminhada;
- corrida;
- aceleração;
- desaceleração;
- pulo;
- gravidade;
- queda;
- rampas;
- escadas;
- inclinação de terreno;
- colisão;
- superfícies;
- natação futuramente;
- estados especiais;
- veículo / passageiro;
- interiores.

Nunca mais duplicar constantes de velocidade em cada mapa.

Exemplo de estados:

```text
IDLE
WALK
RUN
JUMP
FALL
LAND
CROUCH futuramente
INTERACT
SEATED
DRIVING
PASSENGER
FLYING
```

A velocidade visual deve ser independente do FPS.

Usar fixed timestep para simulação física.

---

# 5. FASE G3 — RAPIER 3D

Introduzir Rapier progressivamente.

Não converter todos os mundos de uma vez.

Ordem:

1. player controller;
2. colisão de terreno;
3. portas/triggers;
4. objetos físicos;
5. veículos terrestres;
6. brinquedos do parque;
7. veículos aéreos quando aplicável;
8. experiências especiais.

Separar:

```text
Render Mesh
!=
Collision Mesh
```

Criar colliders simples para prédios e objetos complexos.

---

# 6. FASE G4 — CÂMERA V2

Criar um único sistema de câmera.

Corrigir:

- eixo vertical;
- opção real de Inverter Y;
- olhar livre para o céu;
- pitch independente do `lookAt(player)`;
- terceira pessoa;
- primeira pessoa;
- câmera de veículo;
- câmera de passageiro;
- interiores;
- escadas;
- montanha-russa;
- avião;
- paraquedas;
- drone;
- helicóptero.

Configurações do usuário:

```text
sensibilidade horizontal
sensibilidade vertical
invert Y
FOV
camera distance
camera height
camera smoothing
motion reduction
```

---

# 7. FASE G5 — MIRANTE / OPTICS CONTROLLER

Substituir o sistema atual do Mirante.

Criar:

```text
OpticsController
```

Recursos:

- panorama 360°;
- zoom óptico virtual de 1x a 50x;
- mouse;
- touch/pinch;
- estabilização;
- controle fino de yaw/pitch;
- retículo opcional;
- HUD de zoom;
- foco em objetos do mundo;
- identificação contextual;
- jogadores atualizados em tempo real;
- veículos em movimento;
- NPCs;
- eventos do mundo;
- LOD específico de longa distância.

O comportamento deve lembrar um sistema de observação de longa distância, não uma câmera estática ampliada.

---

# 8. FASE G6 — PIPELINE VISUAL

Migrar gradualmente ambientes procedurais simples para assets GLB/glTF otimizados.

Pipeline:

```text
Blender
↓
GLB bruto
↓
gltfpack
↓
Meshopt
↓
KTX2/Basis
↓
LOD
↓
AGV Asset Manifest
↓
runtime
```

Criar biblioteca visual comum:

```text
assets/world-kit/
├── architecture/
├── school/
├── urban/
├── rural/
├── industrial/
├── military/
├── technology/
├── park/
├── furniture/
├── vegetation/
├── lighting/
├── vehicles/
├── props/
└── vfx/
```

---

# 9. FASE G7 — QUALIDADE GRÁFICA REAL

Os perfis não devem mudar apenas DPR e sombras.

## Econômico

- geometria simplificada;
- LOD agressivo;
- baixa densidade de props;
- vegetação mínima;
- sombras básicas ou desligadas;
- texturas menores;
- efeitos mínimos;
- partículas reduzidas;
- interiores simplificados.

## Médio

- materiais PBR moderados;
- sombras médias;
- densidade intermediária;
- interiores completos essenciais;
- reflexos simplificados;
- partículas moderadas.

## Alto

- maior LOD;
- mais vegetação;
- maior distância visual;
- sombras melhores;
- materiais mais detalhados;
- maior densidade de objetos;
- iluminação local mais rica;
- partículas adicionais;
- melhores reflexos.

## Ultra

- LOD0 por mais distância;
- maior densidade ambiental;
- PBR completo;
- iluminação mais rica;
- sombras de maior resolução;
- pós-processamento seletivo;
- melhores reflexos;
- partículas completas;
- maior detalhe de interiores;
- maior distância de renderização;
- WebGPU experimental quando suportado.

REGRA:

Ultra precisa ser perceptivelmente superior ao Médio sem obrigar hardware fraco a renderizar conteúdo desnecessário.

---

# 10. FASE G8 — ILUMINAÇÃO E IDENTIDADE

Cada mundo deve ter uma identidade visual própria.

Exemplos:

## Campus

- ambiente escolar moderno;
- concreto, vidro, metal, vegetação;
- salas equipadas;
- laboratórios;
- quadras;
- sinalização;
- iluminação funcional.

## Vale do Silício

- tecnologia;
- arquitetura moderna;
- startups;
- data centers;
- mobilidade;
- painéis digitais;
- laboratórios;
- robótica;
- drones;
- iluminação urbana.

## Mundo Rural

- fazendas vivas;
- maior quantidade de animais;
- plantações;
- maquinário;
- celeiros;
- curral;
- estradas de terra;
- água;
- vegetação;
- atividades rurais.

## Parque

- iluminação temática;
- brinquedos animados;
- filas;
- placas;
- áreas de alimentação;
- ambientação sonora;
- partículas;
- NPCs;
- interação jogável.

## Militar

- identidade operacional;
- hangares;
- oficinas;
- pista;
- equipamentos;
- veículos;
- sinalização;
- iluminação funcional.

---

# 11. FASE G9 — INTERIORES MODULARES

Nenhum prédio importante deve abrir como uma caixa vazia.

Criar `InteriorManifest` por construção.

Exemplo:

```json
{
  "building": "laboratorio-robotica",
  "zones": [
    "recepcao",
    "bancadas",
    "impressao-3d",
    "robotica",
    "armazenamento"
  ]
}
```

Cada interior deve poder carregar sob demanda:

- piso;
- paredes;
- teto;
- móveis;
- equipamentos;
- iluminação;
- sons;
- NPCs;
- interações;
- objetos educacionais;
- portas;
- sinalização.

Ao sair, liberar recursos quando apropriado.

---

# 12. FASE G10 — CARREGAMENTO MODULAR

Não carregar mundo inteiro + todos os interiores + todos os veículos na entrada.

Arquitetura:

```text
World Manifest
↓
Sector / Chunk
↓
Environment Package
↓
Building Exterior
↓
Interior Package
↓
Props
↓
NPC / Vehicle / Interaction Modules
```

Criar:

```text
WorldStreamingManager V2
AssetRegistry
AssetManifest
ChunkManager
PrefetchManager
MemoryBudgetManager
```

Carregar por proximidade.

Exemplo:

```text
jogador a 250 m
= proxy/impostor

jogador a 100 m
= LOD baixo

jogador a 40 m
= LOD médio

jogador a 15 m
= LOD alto + interações

entra no prédio
= carregar interior
```

---

# 13. FASE G11 — ANIMAÇÕES E VIDA DO MUNDO

Adicionar animações de ambiente reais.

Exemplos:

- portas;
- elevadores;
- telas;
- computadores;
- máquinas;
- árvores ao vento;
- água;
- bandeiras;
- animais;
- NPCs;
- semáforos;
- veículos;
- drones;
- painéis;
- luzes;
- brinquedos do parque;
- esteiras;
- robôs;
- equipamentos escolares.

Não usar animação apenas decorativa quando a interação promete uma ação.

---

# 14. FASE G12 — SISTEMA DE INTERAÇÃO V2

Padronizar interação:

```text
aproximar
↓
highlight contextual
↓
mostrar ação disponível
↓
usuário interage
↓
animação / estado / física / UI
↓
feedback visual e sonoro
```

Categorias:

```text
L0 Decorativo
L1 Informativo
L2 Animado
L3 Stateful
L4 Jogável
L5 Multiplayer autoritativo
```

Não exibir "Dirigir", "Usar", "Pilotar" ou "Brincar" se o objeto só abre um texto.

---

# 15. FASE G13 — VEHICLE CORE V2

Criar um sistema único para todos os veículos.

Classes:

```text
VehicleBase
GroundVehicle
AirVehicle
RailVehicle
RideVehicle
```

Estados:

```text
PARKED
ENTERING
DRIVER
PASSENGER
MOVING
STOPPING
EXITING
DISABLED
```

HUD obrigatório para motorista:

```text
velocidade
marcha
freio
aceleração
combustível/energia quando aplicável
modo
ocupantes
```

Modos:

- motorista;
- passageiro/carona;
- trocar assento;
- sair;
- câmera interna;
- câmera externa.

---

# 16. FASE G14 — VEÍCULOS TERRESTRES

Evoluir com Rapier:

- carro;
- ônibus;
- buggy;
- caminhão;
- rover;
- trator;
- veículos especiais.

Implementar:

- aceleração;
- frenagem;
- direção;
- suspensão simplificada;
- colisão;
- aderência;
- inclinação;
- velocidade máxima;
- marcha;
- reverso;
- multiplayer.

---

# 17. FASE G15 — VEÍCULOS AÉREOS

Integrar drone, helicóptero, avião e futuras aeronaves ao Vehicle Core.

Estados adicionais:

```text
GROUNDED
TAKEOFF
HOVER
FLYING
LANDING
```

Controles:

- throttle;
- yaw;
- pitch;
- roll;
- altitude;
- velocidade;
- decolagem;
- pouso.

Garantir que os veículos aéreos apareçam também no sistema de descoberta/interação 2D quando aplicável.

---

# 18. FASE G16 — AIRDROP / AVIÃO / PARAQUEDAS

Revisar a experiência completa:

```text
seleção do destino
↓
entrada no avião
↓
voo
↓
escolha do ponto
↓
salto
↓
queda livre
↓
abrir paraquedas
↓
controle aéreo
↓
pouso
↓
carregar setor do mundo
```

O Airdrop continua isolado da calibração permanente do Campus.

---

# 19. FASE G17 — PARQUE DE DIVERSÕES

Migrar brinquedos de animações paramétricas simples para experiências coerentes.

Montanha-russa:

- spline do trilho;
- posição física no trilho;
- lift hill;
- gravidade;
- velocidade por inclinação;
- freios;
- estações;
- bloqueio de trecho;
- assentos;
- câmera;
- embarque/desembarque.

Outros brinquedos:

- roda-gigante;
- carrossel;
- escorregador;
- brinquedos giratórios;
- atrações futuras.

Cada botão de interação deve produzir experiência real.

---

# 20. FASE G18 — ÁUDIO / VFX / PARTICULAS

Adicionar por ambiente:

- áudio espacial;
- sons de máquinas;
- motores;
- animais;
- vento;
- chuva;
- parque;
- interiores;
- passos por material;
- feedback de interação;
- partículas;
- poeira;
- fumaça;
- vapor;
- faíscas;
- folhas;
- água.

Perfis gráficos controlam densidade.

---

# 21. FASE G19 — REALTIME DE EXPERIÊNCIA

Sincronizar apenas o necessário.

Estado contínuo:

- posição;
- rotação;
- velocidade;
- veículo;
- assento;
- estados básicos.

Eventos:

- abrir porta;
- usar brinquedo;
- entrar em veículo;
- sair;
- acionar máquina;
- emote;
- missão;
- evento ambiental relevante.

Nunca transmitir geometria ou animação frame a frame.

---

# 22. FASE N1 — NETWORK MANAGER

Consolidar toda a rede atrás de uma API única.

```text
NetworkManager
├── ColyseusTransport
├── SupabaseTransport
└── SoloTransport
```

O cliente nunca deve depender diretamente de um único transporte.

---

# 23. FASE N2 — COLYSEUS NO NOTEBOOK

O sistema de servidor citado pelo usuário é **Colyseus**.

Arquitetura recomendada:

```text
Notebook/PC potente
↓
Node.js
↓
Colyseus
↓
PM2 ou Windows Service
↓
cloudflared
↓
Cloudflare Tunnel
↓
game.<dominio>
```

O notebook será um:

```text
AGV GAME SERVER ACCELERATOR
```

Não será requisito para o AGV World abrir.

---

# 24. PAPEL DO COLYSEUS

Quando disponível:

- movimento autoritativo;
- física compartilhada;
- veículos;
- posição;
- rotação;
- pulo;
- emotes;
- interações rápidas;
- minigames;
- sincronização de estado;
- rooms;
- AOI;
- prediction;
- reconciliation;
- interpolation;
- anti-cheat básico.

Supabase continua cuidando de:

- login;
- conta;
- avatar;
- roupas;
- XP;
- inventário;
- conquistas;
- missões persistentes;
- histórico;
- dados acadêmicos.

---

# 25. FASE N3 — HEALTH CHECK

Criar:

```text
GET /health
```

Resposta:

```json
{
  "status": "online",
  "mode": "performance",
  "version": "...",
  "uptime": 12345,
  "players": 25,
  "rooms": 4,
  "cpu": 32,
  "ram": 48,
  "tickMs": 9
}
```

---

# 26. FASE N4 — REDUNDÂNCIA

Modos obrigatórios:

```text
PERFORMANCE
= Colyseus

CONTINGÊNCIA
= Supabase Realtime

SOLO
= Local
```

Fluxo:

```text
abre o jogo
↓
testa Colyseus
↓
Colyseus OK
→ PERFORMANCE

Colyseus OFF
→ Supabase Realtime
→ CONTINGÊNCIA

Supabase também OFF
→ SOLO
```

---

# 27. FASE N5 — FAILOVER SEM RELOAD

Se o notebook for desligado:

```text
jogador continua localmente
↓
NetworkManager detecta falha
↓
abre SupabaseTransport
↓
envia snapshot atual
↓
CONTINGÊNCIA
```

Não recarregar mapa.
Não deslogar.
Não expulsar o aluno.

---

# 28. FASE N6 — FAILBACK

Quando o notebook voltar:

```text
Supabase continua ativo
↓
conecta Colyseus paralelamente
↓
autentica
↓
envia estado atual
↓
recebe ACK
↓
muda transporte
↓
encerra canal rápido do fallback
```

Usar make-before-break.

---

# 29. FASE N7 — PREDICTION / INTERPOLATION

Player local:

```text
input
↓
movimento instantâneo
↓
servidor valida
↓
reconciliação se necessário
```

Jogadores remotos:

```text
snapshots 10–30 Hz
↓
interpolação visual
↓
render 60 FPS
```

---

# 30. FASE N8 — AREA OF INTEREST

Integrar rede e streaming.

O jogador recebe apenas:

- jogadores próximos;
- NPCs próximos;
- veículos próximos;
- eventos do setor;
- mundo atual;
- interiores relevantes.

Não enviar o mundo inteiro para todos.

---

# 31. FASE N9 — INSTALAÇÃO DO NOTEBOOK SERVER

Criar posteriormente um pacote próprio:

```text
AGV-GAME-SERVER-WINDOWS/
├── instalar.cmd
├── atualizar.cmd
├── iniciar.cmd
├── parar.cmd
├── status.cmd
├── diagnostico.cmd
├── config/
├── server/
├── logs/
└── cloudflared/
```

Instalação deve:

1. verificar Node.js;
2. instalar dependências;
3. configurar Colyseus;
4. configurar segredo/token com segurança;
5. configurar Cloudflare Tunnel;
6. configurar inicialização automática;
7. instalar PM2 ou serviço equivalente;
8. iniciar `/health`;
9. validar conexão externa;
10. mostrar status simples.

Não exigir VS Code após a instalação.

---

# 32. PAINEL ADMINISTRATIVO DO GAME SERVER

Criar tela administrativa:

```text
Servidor: ONLINE/OFFLINE
Modo: Performance/Compatibilidade/Solo
Ping
Jitter
Jogadores
Rooms
CPU
RAM
Tick
Uptime
Versão
Reconexões
Failovers
```

Para alunos mostrar apenas:

```text
🟢 Online
🟡 Online — Compatibilidade
⚪ Modo Individual
```

---

# 33. ORDEM RECOMENDADA DE EXECUÇÃO

Não implementar Colyseus antes da padronização mínima do cliente.

Sequência:

```text
PASSO 0
Validar F94.5.1 no navegador

PASSO 1
Runtime Contract V2

PASSO 2
Locomotion V2

PASSO 3
Camera V2

PASSO 4
Interaction V2

PASSO 5
World/Interior Streaming V2

PASSO 6
Qualidade gráfica real + pipeline GLB/KTX2

PASSO 7
Vehicle Core V2

PASSO 8
Rapier player + veículos + Parque

PASSO 9
Vale/Rural/Parque/Campus — reconstrução visual prioritária

PASSO 10
NetworkManager

PASSO 11
Colyseus no notebook

PASSO 12
Prediction / interpolation

PASSO 13
Failover / failback

PASSO 14
AOI + integração chunks gráficos/rede

PASSO 15
Load test real
```

---

# 34. MAPAS PRIORITÁRIOS PARA REFORMA VISUAL

Ordem sugerida:

```text
1. Campus
2. Vale do Silício
3. Mundo Rural
4. Parque de Diversões
5. Colégio AGV
6. Base Militar
7. Museu
8. Lua / Marte / Estação
9. demais mundos
```

Motivo:

- Campus define o padrão visual;
- Vale é muito grande e atualmente pouco denso;
- Rural precisa mais animais, props e vida;
- Parque precisa física e interações jogáveis;
- Colégio precisa identidade arquitetônica/interior consistente.

---

# 35. CRITÉRIOS DE ACEITE POR MUNDO

Um mapa só poderá ser classificado como `PRONTO` quando passar:

```text
BOOT PASS
FIRST FRAME PASS
MOVEMENT PASS
CAMERA PASS
INTERACTION PASS
INTERIOR PASS quando existir
VEHICLE PASS quando existir
AUDIO PASS
2D SCALE PASS
3D SCALE PASS
QUALITY ECONOMIC PASS
QUALITY MEDIUM PASS
QUALITY HIGH PASS
QUALITY ULTRA PASS
UNLOAD PASS
REENTER PASS
MULTIPLAYER PASS quando aplicável
```

---

# 36. PRINCÍPIO VISUAL

A referência desejada é uma experiência estilizada moderna comparável em sensação a jogos como Roblox/PK XD, mas sem copiar identidade visual, assets, interfaces ou propriedade intelectual.

O AGV World deve ter identidade própria:

- educacional;
- tecnológica;
- colorida;
- consistente;
- detalhada;
- legível;
- amigável para hardware escolar;
- responsiva em desktop e mobile.

---

# 37. PRINCÍPIO DE PERFORMANCE

Não ganhar qualidade destruindo FPS.

Cada fase deverá medir:

```text
FPS
frame time
DPR
draw calls
triangles
textures
geometry memory
texture memory
estimated GPU memory
JS heap
loading time
first frame
input latency
network RTT
jitter
players visible
```

---

# 38. REGRA DE CONTINUIDADE

Antes de implementar cada fase:

```text
AUDITAR
↓
PLANEJAR
↓
IMPLEMENTAR
↓
TESTAR
↓
VALIDAR
↓
GERAR PATCH
↓
SÓ ENTÃO AVANÇAR
```

Sempre preservar rollback.

Nunca afirmar que uma correção está funcionando em produção sem teste real no navegador/dispositivo do usuário.

---

# 39. RESULTADO FINAL ESPERADO

O AGV World deve evoluir para:

```text
mesma engine lógica em todos os mapas
+
mesma movimentação
+
mesma câmera
+
física coerente
+
interiores completos
+
assets otimizados
+
carregamento modular
+
qualidade gráfica realmente escalável
+
veículos terrestres e aéreos funcionais
+
parque jogável
+
mapas vivos
+
multiplayer responsivo
+
Colyseus opcional no notebook
+
Supabase fallback
+
modo solo
```

---

# 40. FRASE-CHAVE DESTA CONTINUAÇÃO

> **Primeiro padronizar o cliente e os mundos; depois acelerar o multiplayer com Colyseus. O servidor melhora a resposta, mas não conserta movimentação, câmera, física ou conteúdo gráfico inconsistente.**

