# Deploy controlado — Voucher +1 ponto de fim de semana

Release de pré-ativação: **v14.10.8.12**  
Frontend funcional herdado: **0.22.8.11**  
Data: **22/08/2026**

## Gate obrigatório

**Não aplicar a migration 047 nem publicar a Edge Function até existir backup restaurável confirmado do projeto Supabase.**

Registrar antes do deploy:

- data/hora do backup;
- tipo do backup/snapshot;
- identificação ou evidência do snapshot;
- pessoa que confirmou a restauração possível.

O conector utilizado nesta preparação não expõe o estado dos backups. Portanto esse gate não pode ser inferido automaticamente.

## Ordem de ativação

1. Confirmar o backup restaurável.
2. Executar `PREDEPLOY-VOUCHER-CHECK.sql` em modo somente leitura.
3. Confirmar que `weekend_bonus_vouchers` ainda não existe e que os dois RPCs de segurança estão presentes.
4. Repetir os contadores de `legacy_exercise_claims`, `student_files`, `student_file_history` e `student_exercises` e guardar a saída.
5. Aplicar **somente** `core/database/047_p10910_weekend_bonus_vouchers.sql` como migration versionada.
6. Verificar tabela, constraints, índices e grants.
7. Publicar `core/edge-functions/weekend-bonus-voucher/` contendo **`index.ts` + `session-guard.ts`**, com `verify_jwt=true`.
8. Não publicar o frontend antes de a função responder ao smoke autenticado.
9. Fazer smoke aluno → professor descrito abaixo.
10. Somente depois publicar o frontend v0.22.8.11/v14.10.8.12.

## Smoke obrigatório

### Aluno

Durante a janela válida de fim de semana:

1. Entrar com uma conta de aluno ativa.
2. Abrir uma atividade.
3. Confirmar a notificação de parabéns e o voucher `FDS-XXXX-XXXX`.
4. Copiar o código.
5. Recarregar a página e confirmar que o **mesmo código** volta para o mesmo aluno/fim de semana.
6. Confirmar que nenhuma nota/progresso foi alterado automaticamente.

### Professor

1. Entrar com professor vinculado à turma do aluno.
2. Abrir **Ponto extra**.
3. Consultar o código.
4. Conferir nome, turma, +1 ponto, data/hora, motivo e situação.
5. Resgatar uma vez.
6. Consultar novamente e confirmar `redeemed`.
7. Tentar resgatar outra vez e confirmar `already_redeemed`, sem novo efeito.

### Escopo negativo

1. Professor sem vínculo com a turma deve receber `voucher_out_of_scope`.
2. Código inexistente deve retornar `voucher_not_found`.
3. Código malformado deve retornar `invalid_code_format`.
4. Aluno fora da janela deve receber `weekend_window_closed`.
5. Sessão revogada deve receber `session_revoked`.

## Verificação de não mutação de nota

Antes e depois do smoke, comparar para o aluno de teste:

- `student_exercises.status`;
- `progress_percent`;
- `auto_score`;
- `submitted_score`;
- `teacher_feedback`.

Nenhum desses campos pode ser alterado pela emissão, verificação ou resgate do voucher.

## Rollback seguro

### Se o backend falhar antes de qualquer voucher ser emitido

- não publicar o frontend;
- reverter/desativar a Edge Function;
- manter a migration/tabela vazia até revisão, em vez de executar DROP por impulso.

### Se já houver voucher emitido

**Não apagar a tabela.** Ela é evidência do benefício concedido.

- retirar/pausar a emissão no frontend;
- manter consulta/resgate dos códigos já emitidos;
- corrigir e republicar a Edge Function;
- preservar `issued_at`, `redeemed_at`, `redeemed_by` e demais campos de auditoria.

## Critério GO

Somente considerar o recurso ativo quando todos forem verdadeiros:

- backup restaurável confirmado;
- preflight aprovado;
- migration 047 aplicada sem erro;
- Edge Function publicada com JWT obrigatório;
- emissão idempotente validada;
- verificação por professor validada;
- resgate único validado;
- escopo de turma validado;
- nenhuma nota/progresso alterado automaticamente;
- frontend publicado depois do backend.
