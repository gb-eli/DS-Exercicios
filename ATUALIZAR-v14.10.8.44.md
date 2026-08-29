# Atualização v14.10.8.44 — Base modular + Camera V2

## O que mudou

### Fase A — estrutura
- Criado `lobby/assets/world/campus-manifest.js` como fonte única das coordenadas do Campus.
- `lobby3d.js` e `lobby-lite.js` agora compartilham limites, prédios, portais, interiores e conversão presença ↔ mundo.
- Removida a duplicação das principais coordenadas entre os runtimes 2D e 3D.
- Mantidas as APIs existentes do Lobby e a integração com Supabase.

### Fase B — Camera V2
- Criado `lobby/assets/render/camera-controller.js`.
- Modos: `explore`, `wide` e `campus`.
- Rotação 360° por arraste e zoom por scroll preservados.
- Movimento continua relativo à direção da câmera.
- Novo follow damping para reduzir movimentos bruscos.
- FOV cresce suavemente durante corrida.
- Colisão real por `THREE.Raycaster` contra geometria de prédios, portas e interiores.
- A câmera aproxima quando existe obstáculo entre o personagem e o ponto desejado e volta suavemente ao afastamento normal.

## Compatibilidade
- Sem migration.
- Sem alteração de tabelas/RPCs/policies do Supabase.
- Fallback 2D preservado.
- Avatar GLB/procedural preservado.
- Portais, presença, interiores, NPCs e atividades preservados.

## Próxima fase indicada
Fase C: ambiente arquitetônico/GLB, materiais PBR e direção de arte da praça central.
