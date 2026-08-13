# Arquitetura — Lua e Marte Remaster

```text
LunarMarsRemasterModule
├── HUD e progressão
├── ImmersiveInputController
├── PlanetaryExplorationRenderer
└── planetary-exploration.worker
    └── PlanetaryExplorationModel
```

A simulação mantém mundo, veículo, câmera, posição, energia, oxigênio, percurso, amostras, setores, braço, tempestade e objetivos fora do WebGL.

O renderizador utiliza WebGL2/GLSL, ray marching adaptativo, FBM, crateras, módulo lunar, rovers, drone, sombras aproximadas, poeira e fallback Canvas 2D. Os perfis gráficos alteram resolução e custo visual, mas não as regras.
