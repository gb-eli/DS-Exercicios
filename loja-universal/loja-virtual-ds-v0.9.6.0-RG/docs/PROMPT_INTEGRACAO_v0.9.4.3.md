# Prompt de Integração — Loja Virtual DS v0.9.4.3

Preserve o módulo existente e integre os modos gráficos por meio de `DSPerformance.setMode(mode)`.

Modos aceitos:

```text
basic
intermediate
advanced
ultra
realism
auto
```

Nunca faça download automático dos pacotes Ultra ou Realismo. Consulte `DSPackManager.ensureMode(mode)` antes da ativação. Preserve as preferências por dispositivo e utilize `DSPerformance.setPriority('performance'|'balanced'|'quality')` para a escolha independente entre FPS e qualidade.
