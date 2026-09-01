# AGV World F81 — Integração de novos mapas

**Release:** 14.10.8.83-stage52-new-worlds  
**Data:** 2026-09-01  
**Base:** AGV-WORLD-F80-PARQUE-CONNECTADO-v14.10.8.82.zip

## Mapas integrados

| Mapa | Pacote de origem | Scene | Área de presença | Runtime |
|---|---|---|---|---|
| Colégio AGV — Alberto Gomes Veiga | AGV-WORLD-MAPA-COLEGIO-AGV-v1.6.0-F7.zip | `colegio` | `colegio-agv` | Lite + 3D via compatibility host |
| Labirinto com Armadilhas | AGV-WORLD-MAPA-LABIRINTO-ARMADILHAS-v1.1.0.zip | `labirinto` | `labirinto-armadilhas` | Lite + 3D via compatibility host |
| Museu do Hardware AGV | AGV-WORLD-MAPA-MUSEU-HARDWARE-v0.8.0-F1-F9.zip | `museu` | `museu-hardware` | Lite + 3D nativo |
| Parque de Diversões AGV | já presente na F80 | `parque` | `parque-diversoes-agv` | preservado da F80 |

## Regras de integração aplicadas

- O Colégio AGV usa **exclusivamente o conteúdo do pacote F7**. Nenhum ZIP das fases F1–F6 foi mesclado.
- O ZIP separado do Parque de Diversões F7 **não foi sobreposto** à F80, porque a F80 já contém a versão conectada ao Lobby.
- Core, WorldManager, Avatar System, câmera, autenticação, clima, áudio e sistemas existentes da F80 foram preservados.
- Colégio e Labirinto receberam uma camada de compatibilidade no Lobby para consumir corretamente `scene`, câmera, movimento, interação, presença e retorno ao Campus.
- O Museu mantém GLBs e vídeos sob demanda; os arquivos pesados não foram movidos para o shell crítico do Service Worker.

## Backend obrigatório na implantação

Esta release adiciona novas áreas e scenes ao sistema de presença. Para ativar chat por proximidade, presença online e comandos de agrupamento nos novos mapas:

1. Aplicar `core/database/073_lobby_new_worlds.sql` no banco.
2. Publicar novamente `core/edge-functions/lobby-presence/index.ts`.
3. Publicar o frontend/Lobby da release F81.
4. Após o deploy, atualizar/recarregar o Service Worker para assumir o cache `14.10.8.83-stage52-new-worlds`.

Sem os passos 1 e 2, o mapa pode abrir no frontend, porém recursos multiplayer podem ser recusados pelo backend por scene/área não reconhecida.

## Validações executadas

- Colégio F7: `validate-f7.mjs` — aprovado.
- Colégio F7: `smoke-runtime.mjs` — aprovado em Lite/3D.
- Labirinto: `challenge.test.mjs` — aprovado.
- Museu: `validate-museu-hardware.mjs` — **26/26 checks** aprovados, incluindo 30 GLBs e 10 WebMs.
- Integração F81: sintaxe dos módulos modificados — aprovada.
- Grafo ESM dos novos entrypoints: 109 módulos / 285 imports verificados — **0 imports locais ausentes**.
- Registro dos três adapters, botões, scenes, áreas, migration e Service Worker — aprovado.

## Observação de smoke visual

O smoke automatizado com Chromium headless não concluiu no ambiente de empacotamento por limitação do processo Chromium/DBus/zygote da sandbox. Não houve erro JavaScript do produto capturado nesse teste. A validação da release foi fechada com os testes funcionais dos pacotes, verificação de sintaxe, grafo de imports e contratos de integração.
