# Arquitetura — Direção de Missões

```text
MissionPlan
  ├─ requisitos e validação
  ├─ duração mínima
  ├─ checkpoints
  ├─ Classroom
  └─ código local

GuidedSession
  ├─ relógio ativo
  ├─ inatividade
  ├─ sequência
  ├─ eventos
  ├─ autorização antecipada
  └─ conclusão

MissionRepository
  ├─ planos por perfil
  └─ sessões por perfil

EvidenceBuilder
  ├─ JSON
  ├─ HTML/print
  ├─ rastreabilidade
  └─ código de validação

MissionDirectorRenderer
  ├─ WebGL2/GLSL
  ├─ 360°/zoom
  ├─ ray marching/FBM
  ├─ WebXR opcional
  ├─ fallback 2D
  └─ descarte de GPU
```

## Separação de responsabilidades

A sessão não depende do Canvas. A redução da qualidade gráfica não altera tempo, checkpoints, eventos ou evidências. O renderer pode ser substituído sem migrar os dados educacionais.

## Persistência

Todos os dados recebem prefixo do COSMOS DS no `localStorage`. Planos e sessões são separados por perfil. Backups usam esquemas versionados.
