# Arquitetura do Remaster Solar

## Separação de responsabilidades

```text
SolarSystemRemasterModule
├── interface DOM e HUD
├── progressão e checkpoints
├── drawers e seleção de alvo
└── lifecycle do laboratório

ImmersiveInputController
├── teclado
├── mouse/pointer
├── joysticks virtuais
└── Gamepad API

SolarNavigationModel
├── alvo atual
├── câmera orbital
├── câmera livre
├── câmera cinematográfica
├── piloto automático
└── estado serializável

SolarSystemSceneRenderer
├── WebGL2 e shaders
├── corpos celestes
├── órbitas e anéis
├── satélites procedurais
├── partículas e fundo espacial
├── câmera e matrizes
├── fallback Canvas 2D
└── descarte de GPU
```

## Regra central

A navegação e a progressão não pertencem às malhas ou aos shaders. Reduzir a qualidade visual não altera o alvo, a câmera, as visitas, a avaliação nem o XP.

## Pipeline gráfico

1. fundo procedural com estrelas e nebulosa;
2. pontos estelares de profundidade;
3. linhas orbitais;
4. esferas planetárias procedurais;
5. anéis transparentes;
6. atmosferas aditivas;
7. partículas solares;
8. satélites modulares;
9. HUD DOM periférica.

## Qualidade adaptativa

### Desempenho

- esfera 40 × 26;
- menos estrelas e partículas;
- resolução interna reduzida;
- anéis com menos segmentos;
- atmosfera e detalhes limitados conforme perfil.

### Equilibrado

- esfera 68 × 46;
- 1.500 estrelas;
- partículas e órbitas moderadas;
- alvo recomendado para notebooks escolares.

### Máxima Experiência

- esfera 96 × 64;
- 2.600 estrelas;
- mais partículas solares;
- resolução interna elevada;
- atmosfera e detalhes completos.

## Lifecycle

Ao sair do laboratório:

- o RAF é cancelado;
- ResizeObserver é desconectado;
- eventos de pointer, teclado e wheel são removidos;
- buffers, shaders e programas WebGL são excluídos;
- referências ao contexto são liberadas.
