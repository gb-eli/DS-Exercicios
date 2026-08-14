# Mapa funcional da Fase 4

```text
Portal COSMOS DS
└── Terra, Satélites e Órbitas
    ├── Globo 3D
    │   ├── shader terrestre
    │   ├── atmosfera e nuvens
    │   ├── rotação e zoom
    │   └── telemetria de posição
    ├── Órbitas
    │   ├── catálogo LEO/Polar/SSO/MEO/GEO
    │   ├── altitude e inclinação
    │   ├── período, velocidade e cobertura
    │   └── três decisões técnicas
    ├── Montagem de satélite
    │   ├── missão
    │   ├── barramento
    │   ├── carga útil
    │   ├── energia
    │   ├── comunicação
    │   └── validador de arquitetura
    └── Operação
        ├── Worker orbital
        ├── trajetória
        ├── estações de solo
        ├── eclipse e energia
        ├── buffer e downlink
        └── JSON de telemetria
```

## Separação de responsabilidades

| Camada | Responsabilidade |
|---|---|
| `OrbitMath` | equações e posição orbital simplificada |
| `SatelliteSystem` | composição e validação de subsistemas |
| `orbital.worker.js` | evolução temporal, energia, dados e contato |
| `EarthGlobeRenderer` | shader, câmera e fallback visual |
| `EarthOrbitModule` | interface, checkpoints e integração |
