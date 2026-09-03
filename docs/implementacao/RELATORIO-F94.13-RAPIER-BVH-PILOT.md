# F94.13 — Rapier Pilot + three-mesh-bvh

## Base
F94.12 — Vehicle Core V2 + Rapier Prep.

## Objetivo
Ativar uma primeira camada física real no Campus 3D sem transformar Rapier/BVH em dependência crítica. A estratégia é progressiva: primeiro colisão estática do Campus e veículos terrestres; mobilidade aérea, Parque e demais mundos continuam com seus adapters atuais.

## Implementado
- `physics-module-loader.js`: carregamento lazy/pinado de `@dimforge/rapier3d-compat@0.20.0` e `three-mesh-bvh@0.9.14`.
- `mesh-bvh-collider.js`: gera geometria de colisão a partir dos AABBs do Campus e constrói BVH para consultas `intersectsSphere`/raycast.
- `rapier-vehicle-world.js`: World Rapier isolado, colliders fixos do Campus, corpo cinemático do veículo e Kinematic Character Controller para corrigir deslocamento contra obstáculos.
- `campus-physics-pilot.js`: proxy híbrido que começa no adapter cinemático e troca para Rapier somente após inicialização bem-sucedida.
- Campus 3D usa BVH como consulta estática do jogador no solo e Rapier para veículo terrestre quando o piloto está ativo.
- Veículos aéreos permanecem no adapter cinemático da F94.12.
- Inicialização do piloto ocorre somente **depois do primeiro frame** do Campus 3D.
- `?physics=rapier` força o piloto para teste; `?physics=kinematic` força fallback.
- Autoativação limitada a desktop Alto/Ultra com capacidade suficiente; máquinas limitadas não baixam a física externa automaticamente.
- CSP do Lobby recebe apenas a permissão necessária `wasm-unsafe-eval`; os outros módulos do sistema não foram ampliados.
- Runtime expõe `getPhysicsPilotDiagnostics()`.

## Segurança de boot
Rapier e BVH não fazem parte do `requiredAssets` do boot. Os quatro módulos locais do piloto ficam no shell opcional. Se CDN, WASM, CSP, inicialização ou API falharem, o adapter cinemático continua operando.

## Limitações
- Os bundles externos não estão vendorizados dentro do ZIP desta fase. O primeiro uso do piloto depende de acesso ao jsDelivr; se bloqueado, há fallback cinemático.
- O ambiente de construção desta sessão não conseguiu resolver DNS externo, portanto o WASM real do Rapier e o módulo real three-mesh-bvh não foram executados aqui. Foram usados testes sintéticos das APIs e validação estrutural.
- Não houve teste visual WebGL real.
- Rapier está limitado ao piloto de veículo terrestre do Campus; ainda não é a física global do projeto.
- A representação do veículo no Character Controller usa volume simplificado conservador para priorizar estabilidade.

## Próxima fase indicada
F94.14 — NetworkManager + Transport Contract (SupabaseTransport / ColyseusTransport / SoloTransport), ainda sem tornar Colyseus obrigatório.
