# Arquitetura — Interiores HD

`GlbSceneParser → InteriorInteractionSystem → PremiumAssetSceneRenderer`

`Telemetria → TelemetryAnimationBridge → GltfAnimationPlayer`

`Hotspot → SpatialAudioEngine → Web Audio API`

A simulação não é armazenada nas meshes. Renderização, interação, áudio e telemetria permanecem desacoplados.
