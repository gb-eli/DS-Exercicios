# Arquitetura — Fases 19 a 23

```text
Hotspots / InteriorInteractionSystem
        ↓
SpatialAudioEngine + TelemetryAnimationBridge
        ↓
CinematicPostProcessController
        ↓
UnifiedPhysicsController
        ↓
CampaignDirector
        ↓
PerformanceBudgetManager + AssetStreamingManager
```

## Separação de responsabilidades

- A simulação continua independente do renderizador.
- O modo gráfico altera resolução, shaders, sombras e partículas, nunca critérios educacionais.
- Campanhas armazenam checkpoints e eventos sem incorporar objetos WebGL ao estado persistente.
- O gerenciador de desempenho observa métricas e ajusta apenas a escala dinâmica.
- Assets continuam carregados sob demanda e liberados por grupo.
