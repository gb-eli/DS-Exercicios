# Arquitetura — Rigs e Animações glTF

```text
Manifesto premium v2
        ↓
PremiumAssetManager
        ↓
GlbSceneParser
 ├── nodes
 ├── meshes/primitives
 ├── animations
 ├── interactions
 └── colliders
        ↓
GltfAnimationPlayer
        ↓
PremiumAssetSceneRenderer / PremiumAssetOverlayRenderer
        ↓
Laboratórios imersivos
```

## GlbSceneParser

Lê todos os nós e primitives, calcula bounds da cena, preserva hierarquia, extrai animações, interações e colliders e mantém uma primitive principal para compatibilidade com o parser legado.

## GltfAnimationPlayer

- amostragem temporal;
- interpolação linear;
- quaternion slerp;
- loop ou execução única;
- velocidade configurável;
- pausa e reinício.

## PremiumColliderSystem

Fornece uma camada didática de raycast sobre colliders simplificados. Não substitui um motor físico completo; prepara o contrato para interações e colisão futura.

## Separação de responsabilidades

- GLB: geometria, hierarquia e clips;
- Worker/simulação: regras e telemetria;
- renderer: apresentação;
- DOM: HUD e acessibilidade;
- procedural: ambiente e fallback.
