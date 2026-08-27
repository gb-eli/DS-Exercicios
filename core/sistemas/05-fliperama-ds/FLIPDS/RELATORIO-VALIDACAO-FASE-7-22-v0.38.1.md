# Relatório de validação — Fase 7.22 · Fliperama DS v0.38.1

## Escopo
A v0.38.1 adiciona **Mundo Plataforma DS 360** como a 23ª experiência jogável. A primeira região é o **Vale Nexus 360**, planejado como hub radial para que a navegação exija orientação em todas as direções, e não uma sequência linear de corredores.

## Arquitetura
- `simulation.mjs`: física, plataformas móveis, patrulhas, objetivos, dano, checkpoints, vitória e save serializável.
- `render.mjs`: Three.js, geometria procedural, iluminação, câmera orbital, bússola e perfis gráficos.
- `game.js`: entradas, HUD, áudio leve e ponte `postMessage` com o Fliperama.
- `region.json`: dados da região e objetos da missão.

Essa separação permite adicionar regiões futuras sem transformar objetos Three.js na fonte de verdade da campanha.

## Conteúdo da Região 1
- mapa 72 × 72;
- Hub Nexus;
- Mirante Norte;
- Jardim de Vértices;
- Ruínas do Buffer;
- Lagoa Prisma;
- 6 Orbes;
- 3 Balizas;
- 3 checkpoints;
- 4 plataformas móveis;
- 8 campos Glitch;
- 6 drones/patrulhas;
- Portal Nexus central.

## Câmera 360°
A câmera possui rotação orbital completa em yaw, pitch limitado por conforto, arraste de mouse/toque, analógico direito e modo Panorama 360°. A orientação aparece no HUD em graus e pontos cardeais/intercardeais.

## Validação específica
A suíte `test-mundo-plataforma-360-v0.38.1.mjs` aprovou **103/103** verificações, cobrindo estrutura radial, posições, segurança de checkpoints, simulação, dano, save, portal, câmera, Gamepad API, touch, integração, mídia e cache offline.

## Auditoria geral
- experiências: **23/23 aprovadas**;
- checks: **662/662 aprovados**;
- warnings: **0**;
- falhas: **0**.

## Regressão da release
As suítes atuais totalizam **883 aprovações e 0 falhas**. Há sobreposição conceitual entre elas, portanto esse número não representa requisitos únicos.

## Limite da validação visual
O playtest perceptivo de câmera, touch, gamepad e frame pacing permanece no checklist manual. A release não considera esses aspectos como aprovados sem execução em navegador/hardware real.

## Tentativa de smoke visual automatizado
Foi tentada uma captura com Chromium headless sobre o runtime do Vale Nexus. O processo não produziu screenshot e registrou falhas de DBus (`/run/dbus/system_bus_socket`) e comunicação do zygote. Por isso essa tentativa **não é contabilizada como aprovação visual**; o teste perceptivo permanece no checklist real.

## Validação de publicação
- Rotas/arquivos HTTP: **392/392** com status 200.
- JSONs válidos: **57**.
- SVGs XML-válidos: **101**.
- Scripts próprios JS/MJS verificados por sintaxe: **37**.
- Referências do Service Worker conferidas: **74**, nenhuma ausente.
- `index.html` permanece diretamente na raiz do pacote para publicação no GitHub Pages.
