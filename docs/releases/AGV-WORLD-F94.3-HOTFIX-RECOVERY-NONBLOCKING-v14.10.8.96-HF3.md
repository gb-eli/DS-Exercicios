# AGV World F94.3 — Hotfix de recuperação não bloqueante — v14.10.8.96-HF3

## Motivo
Após a F94.2, a falha real do runtime 3D passou a acionar corretamente o fallback 2D, porém a tela `Recuperando o Campus` podia permanecer visível enquanto a telemetria remota era aguardada. Isso fazia uma recuperação já possível parecer travada.

## Correções
- `securityTelemetry` recebe limite rígido de 1,8 s.
- Falha de telemetria nunca bloqueia a interface, o mapa 2D ou o fallback.
- `startLite` conclui a interface imediatamente após o runtime 2D ficar pronto.
- Recuperação 3D → 2D recebe watchdog independente de 9 s.
- Runtime 2D recebe watchdog de criação de 8 s.
- Novos eventos: `runtime_lite_ready`, `runtime_3d_recovery_started`, `runtime_3d_recovered_to_lite`.
- A causa original da falha 3D é preservada e exibida em toast após a recuperação.

## Escopo
Frontend do Lobby apenas. Backend, migrations e Edge Functions não foram alterados. F95 permanece suspensa até o runtime 3D ser validado em navegador real.
