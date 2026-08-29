# P5.0 — Lobby DS 3D/360 — v11.4

Data: 14/08/2026.

## Objetivo

Substituir a apresentação plana do Lobby P4 por um campus virtual 3D em terceira pessoa, mantendo intacta a autoridade server-side introduzida no P4.3 Security Hardening.

## Experiência 3D

- Three.js r180 distribuído localmente no projeto; não há dependência de CDN para o motor 3D.
- câmera em terceira pessoa com rotação 360° por mouse/arrasto e zoom por roda;
- caminhada por WASD/setas;
- corrida com Shift;
- pulo com gravidade;
- joystick virtual, pulo, corrida e interação no mobile;
- avatares humanoides procedurais para aluno/professor/admin;
- animações procedurais de idle, caminhada, corrida, pulo e emotes;
- emotes `wave`, `like` e `spark` visíveis no avatar;
- interpolação dos outros participantes entre heartbeats para evitar teleporte visual;
- praça central 3D com iluminação, holograma AGV, caminhos, bancos, luminárias, vegetação e elementos animados;
- quatro áreas 3D: 1DS, 2DS, 3DS e DS Sub;
- portais tridimensionais, incluindo Portal Quantum;
- modos gráficos Eco/Médio/Alto.

## Segurança preservada

O renderer 3D é somente uma camada visual. Ele não conhece nem escreve em `exercise_releases` e não é autoridade para atividades.

- `lobby_presence` continua somente leitura direta para `authenticated`;
- heartbeat, emote e saída usam exclusivamente a Edge Function `lobby-presence`;
- Edge Function valida JWT, perfil ativo, bloqueio de Lobby, limites de coordenada e rate limit por usuário+IP;
- IP é obtido no servidor;
- geolocalização conhecida fora do Paraná é registrada como `critical` com `risk_code=outside_parana`;
- geolocalização desconhecida/inconclusiva não bloqueia automaticamente a conta;
- moderação continua via `lobby-moderation` e respeita escopo do professor;
- nenhuma `service_role` é enviada ao frontend;
- atividades continuam revalidadas no backend antes da abertura.

## Compatibilidade de presença

O mundo 3D trabalha internamente em coordenadas de cena. `lobby3d.js` converte essas coordenadas para o espaço legado `x=0..1600 / y=0..1000`, permitindo reutilizar `lobby_presence`, moderação e presença online sem migração de banco.

## Arquitetura

- `lobby/assets/lobby.js`: autenticação, autorização, releases, telemetria, presença segura, moderação e DOM.
- `lobby/assets/lobby3d.js`: cena, câmera, avatar, animação, input e renderização.
- `lobby/vendor/three/`: Three.js local.

A separação evita transformar objetos/meshes Three.js em fonte de verdade de segurança ou progresso.

## P5.1 sugerido

A P5.0 usa personagens e cenário procedurais para entregar uma base estável e leve. A próxima evolução pode substituir o avatar procedural por personagens GLB rigados com animações esqueléticas (idle/walk/run/jump/emotes), mantendo a mesma API de presença e segurança.
