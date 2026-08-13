# Segurança e antifraude

## Modelo de ameaça

Assuma que o aluno pode:

- abrir DevTools;
- editar JavaScript no navegador;
- modificar `localStorage` e IndexedDB;
- repetir requisições;
- alterar payloads;
- tentar chamar endpoints diretamente;
- abrir várias abas/dispositivos;
- tentar comprar o próprio item;
- tentar gastar o mesmo saldo simultaneamente;
- tentar repetir uma recompensa concluída.

Portanto, **o cliente nunca é autoridade econômica**.

## Controles mínimos

1. RLS em tabelas expostas.
2. Chave `service_role` somente em ambiente server-side.
3. Idempotência obrigatória para mutações.
4. Unique constraints para impedir duplicação.
5. Row locks em carteira/listagem durante commits.
6. Ordem determinística ao bloquear duas carteiras para reduzir deadlock.
7. `CHECK balance >= 0` como última barreira.
8. Ledger append-only.
9. Sem `UPDATE/DELETE` de lançamentos por clientes.
10. Auditoria de operações administrativas.
11. Rate limit em transferências, marketplace e claims.
12. Limites de valor por transação/dia configuráveis.
13. Bloqueio/hold opcional para contas sinalizadas.
14. Validação de recipient e item no servidor.
15. Reautenticação opcional para operações de alto valor.

## Recompensas de jogos client-side

Um jogo executado totalmente no navegador não consegue provar criptograficamente, sozinho, que o aluno realmente venceu uma fase: o próprio aluno controla o runtime. O Core deve classificar ações por nível de confiança:

- `server_verified` — condição comprovada no servidor;
- `rule_validated` — payload validado contra catálogo, limites, sequência e idempotência;
- `evidence_required` — exige evidência adicional;
- `teacher_approval` — exige aprovação de professor/admin;
- `no_economic_reward` — pode registrar progresso, mas não gera moeda.

Recompensas relevantes devem preferir `server_verified`, `evidence_required` ou `teacher_approval`.

## Confirmação de transação

A confirmação de UI evita erros do usuário, mas não substitui validação de backend. O fluxo deve criar uma intenção curta contendo o autor e os parâmetros relevantes; na confirmação, o servidor deve revalidar saldo/preço/propriedade/estado.

## Autorização administrativa

Não tomar decisões de autorização usando dados editáveis pelo usuário. Papéis administrativos devem vir de fonte protegida (tabela administrada no backend ou `app_metadata` controlado por administrador), considerando que claims JWT podem ficar desatualizados até renovação da sessão.

## Supabase

- tabelas `public` expostas: RLS obrigatório;
- use grants mínimos;
- views devem respeitar RLS (`security_invoker`) ou ser protegidas;
- funções `SECURITY DEFINER`: apenas quando necessárias, fora do caminho público sempre que possível, `search_path` fixo, validação de usuário e execução explicitamente revogada de `PUBLIC`;
- nunca expor secret/service key no GitHub Pages.
