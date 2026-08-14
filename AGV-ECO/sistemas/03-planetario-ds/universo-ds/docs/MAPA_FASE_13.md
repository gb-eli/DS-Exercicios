# Mapa funcional — Fase 13

## Fluxo principal

```text
Abrir experiência
→ escolher estação
→ inspeção 360°
→ explorar interior/cúpula/EVA
→ escolher veículo
→ entrar em voo livre
→ alinhar com a porta
→ acoplar manualmente ou com assistência
→ revisar replay
→ inspecionar satélites
→ abrir sistemas técnicos da Fase 8
```

## Câmeras

| Câmera | Finalidade |
|---|---|
| Estação 360° | visão externa geral |
| Voo livre 6DOF | pilotagem espacial |
| Cabine | operação interna do veículo |
| Cúpula | observação da Terra |
| Interior | corredores e módulos |
| EVA | atividade externa |
| Porta de acoplamento | aproximação e alinhamento |
| Braço robótico | carga orbital |
| Satélite | inspeção de carga |
| Porão | ônibus espacial |
| Cinematográfica | tour automático |

## Interação DS

- máquinas de estado;
- física serializável;
- Worker;
- eventos;
- idempotência de XP;
- input unificado;
- separação simulação/render;
- fallback;
- lifecycle;
- telemetria;
- replay.
