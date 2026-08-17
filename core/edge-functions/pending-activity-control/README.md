# activity-control — draft não implantado

Uma Edge Function dedicada ao P3 foi preparada, mas o conector bloqueou o deploy por não conseguir determinar a segurança da combinação de leitura ampla + gravação privilegiada.

A implementação oficial da v10 usa:

1. JWT do professor/admin no navegador;
2. RLS já existente em `exercise_releases`;
3. policies staff escopadas para `class_subjects` e `exercises`;
4. trigger privado `private.audit_exercise_release_change()` para registrar toda alteração em `admin_audit_log`.

Não trate `index.ts.draft` como função implantada.
