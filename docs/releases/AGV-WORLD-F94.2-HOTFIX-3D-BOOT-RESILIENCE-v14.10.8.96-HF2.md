# AGV World F94.2 — Hotfix de inicialização 3D

**Base:** v14.10.8.96 F94  
**Hotfix:** HF2  
**Escopo:** frontend + Service Worker; backend inalterado.

## Sintoma corrigido

Após o HF1, o Lobby ultrapassa a importação do módulo e chega ao runtime. Em alguns dispositivos, ao solicitar o 3D, a tela de recuperação era exibida porque qualquer falha/timeout do boot 3D usava a mesma mensagem genérica.

## Correções

1. O 3D passa a usar **qualidade de bootstrap segura** antes do primeiro frame:
   - alvo Econômico -> bootstrap Econômico;
   - alvos Médio/Alto/Ultra em desktop -> bootstrap Médio;
   - dispositivos móveis/coarse -> bootstrap Econômico.
2. Após o primeiro frame, a qualidade alvo aprendida pela F94 ou fixada manualmente é aplicada normalmente. A escolha manual continua protegida.
3. Timeout de construção do runtime ampliado de 13,5 s/11,5 s para 20 s desktop / 24 s coarse.
4. Timeout do primeiro frame ampliado de 5,5 s para 8,5 s.
5. Em falha do 3D, o Lobby agora retorna automaticamente ao 2D sem deixar o usuário preso na tela de recuperação.
6. A tela com botões só permanece se a recuperação 2D também falhar ou quando `allowFallback=false`.
7. Diagnóstico passa a registrar `runtime_3d_boot_plan`, `runtime_3d_target_quality_applied` e `runtime_lite_recovery_failed`.
8. Cache-bust HF2 aplicado em index -> SW register/vendor loader -> boot -> lobby e no cache do Service Worker.

## Segurança e backend

Nenhuma migration, Edge Function, tabela, política RLS ou autenticação foi alterada.
