# Avatar 3D — DS_VOXEL_RIG_1

## Convenções

- Formato de entrega: GLB / glTF 2.0.
- Eixo vertical: Y. Frente: +Z.
- Avatar modular por hierarquia de nós.
- Partes rígidas são filhas dos nós articulados, apropriadas ao estilo voxel.
- O estado pedagógico e financeiro permanece fora do renderer.

## LOD

- LOD0: rosto, cabelo detalhado e acessórios completos.
- LOD1: detalhes intermediários para modo equilibrado.
- LOD2: geometria reduzida para modo econômico.

## Clips

Idle, Walk, Run, Wave, Goodbye, Celebrate, Jump, Applause, Think, Point e Sit.

## Slots

head, back, held-item-left, held-item-right, shield, aura e companion.

## Integração

Use o manifesto do avatar para localizar os LODs, clips e nós de encaixe. Não dependa de nomes de arquivos improvisados. O visualizador deve ser carregado somente ao abrir a área de personagem ou uma prévia 3D.

## Materiais

O GLB v0.4 utiliza materiais PBR com cores, metalicidade, rugosidade e emissão. O arquivo `texture-bindings.json` prepara a ligação com as texturas WebP do kit v0.3 e a posterior conversão para KTX2/BasisU.
