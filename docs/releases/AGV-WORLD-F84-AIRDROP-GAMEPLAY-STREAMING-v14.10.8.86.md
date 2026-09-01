# AGV World F84 — Airdrop, Jogabilidade e Streaming Progressivo

**Release:** 14.10.8.86  
**Base:** F82 v14.10.8.84 + F83 gameplay/performance  
**Data:** 2026-09-01

## Objetivo

Fechar a primeira fase de padronização da jogabilidade e introduzir a partida aérea sincronizada no Campus, sem voltar a concentrar lógica específica dentro de cada mapa.

## Entregue

### Partida aérea / paraquedas
- Equipe pode iniciar um voo para os participantes online.
- O voo começa 3 s após a emissão do comando e cruza o Campus por 28 s a 96 m de altitude.
- Participantes são levados ao Campus 3D e posicionados no mesmo avião de transporte.
- Cada participante escolhe quando saltar.
- Queda livre: 24 u/s de descida.
- Paraquedas: 6,8 u/s de descida, com deslocamento horizontal de até 12 u/s.
- Abertura manual por Espaço/E/botão e abertura automática a 24 m.
- A posição de pouso é limitada aos bounds seguros do Campus.
- Quem entra enquanto o avião ainda está em rota recebe a sessão ativa; depois do fim da rota a sessão não força novos participantes.
- Presença multiplayer agora transporta `altitude` e `movement_mode` (`ground`, `plane`, `freefall`, `parachute`).

### Detalhe progressivo / performance
- Durante a descida, o Campus alterna entre `overview`, `district` e `full` conforme a altitude.
- Em solo, experiências distantes são retiradas do render budget por proximidade e qualidade gráfica.
- Perfil **Equilibrado** do Campus usa DPR menor, sem sombras dinâmicas e menos partículas que o perfil Alto.
- Canais realtime de jogabilidade são removidos no logout para não acumular subscriptions.

> Esta release reduz renderização desnecessária, mas ainda não descarrega toda a geometria procedural da memória. A próxima fase deve fragmentar fisicamente o Campus em setores/submapas com load/unload real.

### Jogabilidade padronizada (F83 consolidada nesta release)
- Base de movimento externo alinhada ao Vale: 16 u/s andando e 28 u/s correndo.
- Multiplicador global de equipe: 0,55× a 2,25×, persistente e em tempo real.
- FOV pessoal: 45–100.
- Sensibilidade do mouse.
- Preferência gráfica Auto / Desempenho / Equilibrado / Qualidade.
- Remapeamento central de movimento, correr, pular, interagir e câmera.

### Veículos (F83 consolidada)
- Spawn administrativo persistente no Campus: carro, moto, van e ônibus.
- IDs de veículos spawnados são reconhecidos pelo backend multiplayer.
- Falha de backend não deixa mais o botão de dirigir inerte: direção local continua disponível quando o servidor está indisponível.
- Conflitos reais (`vehicle_busy` / `vehicle_not_nearby`) continuam bloqueando corretamente.

## Banco e Edge Function

### Migration 077
`core/database/077_lobby_airdrop_sessions.sql`

Adiciona:
- `lobby_presence.altitude`
- `lobby_presence.movement_mode`
- `lobby_airdrop_sessions`

A tabela de sessões aéreas tem RLS habilitado e acesso direto revogado de `anon` e `authenticated`; clientes usam a Edge Function `lobby-presence`.

### Edge Function
A `lobby-presence` passa a oferecer:
- `airdrop_active`
- `airdrop_start`
- `airdrop_cancel`
- `verify_airdrop`
- heartbeat com altitude/modo de movimento

## Testes

### Gate F84
`core/tests/f84-airdrop-streaming-v14.10.8.86.test.mjs`

**10/10 PASS**.

Cobertura:
1. release/cache 14.10.8.86;
2. matemática do voo e níveis de detalhe;
3. migration 077 e presença vertical;
4. controles de equipe e HUD;
5. boot 2D-first sem corrida com sessão aérea ativa;
6. avião/queda livre/paraquedas/deploy automático;
7. participantes sincronizados no avião e altitude remota;
8. detalhe progressivo e culling de experiências;
9. manutenção da base F83;
10. limpeza dos canais realtime no logout.

### Sintaxe / dependências
- 858 arquivos JavaScript não-vendor: **0 erros de sintaxe**.
- 349 imports locais analisados: **0 ausentes**.
- Edge Function TypeScript transpila com **0 erros sintáticos**.

### Regressão ampla O2–O5 + F82–F84
- 51 asserts executados.
- 46 PASS.
- 5 falhas são somente asserts históricos de versão/hash: F82 exige cache-bust 14.10.8.84; F83 exige 14.10.8.85; O3/O4 exigem hashes de backend/cache anteriores às migrations/Edge posteriores.

### Smoke visual
Foi tentado Chromium headless com SwiftShader. O ambiente da sandbox falhou antes da inicialização WebGL por `EGL_NOT_INITIALIZED` / `xcb_connect` / `DBus`. Portanto, **não está sendo declarado smoke visual WebGL aprovado** nesta release.

## Próximas fases recomendadas

### F85 — Campus Setorizado / Streaming Real
- dividir Campus em setores físicos;
- `loadSector()` / `unloadSector()`;
- geometria, materiais, NPCs, veículos e áudio por setor;
- prefetch do setor adjacente;
- budget de memória e draw calls;
- manter avião/paraquedas usando o mesmo catálogo de setores.

### F86 — Mobilidade Universal
- spawn administrativo de veículos em qualquer mundo compatível;
- contrato comum de motorista/carona;
- revisão de todos os pontos de entrada, colisores e garagens;
- veículos terrestres/aéreos por capability do `WorldManifest`.

### F87+ — Qualidade Visual por Mundo
- personagens/rig/animações;
- prédios, materiais e iluminação;
- LODs reais e instancing;
- KTX2/Draco/Meshopt onde houver assets GLB;
- revisão mapa a mapa, preservando orçamento de performance.
