# PROMPT MESTRE — IMPLEMENTAÇÃO AGV EDUCATION CORE

Você recebeu o pacote `AGV-ECOSSISTEMA-UNIFICADO`. Sua tarefa é implementar a unificação técnica **sem reescrever ou descaracterizar as plataformas**.

## Resultado obrigatório

Criar um **AGV Education Core** compartilhado por todas as plataformas deste pacote e adotar a **Loja Virtual DS v0.9.6.0-RG** incluída em `loja-universal/` como a Loja Universal oficial. Cada sistema continuará independente em conteúdo e UX, mas consumirá os mesmos serviços centrais de autenticação, progresso, XP, pontos, carteira, loja, inventário, marketplace e administração.

## Antes de alterar código

1. Leia `00-LEIA-PRIMEIRO.md`.
2. Leia todos os arquivos em `docs/`, especialmente `LOJA-VIRTUAL-DS-OFICIAL.md`.
3. Use `manifesto-plataformas.json` para localizar a versão canônica de cada sistema.
4. Não implemente em pastas históricas quando existir uma árvore canônica marcada.
5. Faça inventário dos fluxos atuais de login, progresso, XP e economia de cada plataforma antes de substituí-los.
6. Preserve modos aluno/professor, conteúdos, exercícios, jogos, 3D, PWA, Service Workers e layouts existentes.
7. Preserve o visual, catálogo, assets 3D, inventário/avatar e design system da Loja Virtual DS; substitua apenas a autoridade local onde necessário.

## Regras não negociáveis

### Identidade
- Um usuário = um `auth.users.id` central.
- Mesmo e-mail/login e mesma senha em todas as plataformas.
- Não criar senhas paralelas por plataforma.
- Não usar `user_metadata` como fonte de autorização.
- Perfil, turma e permissões devem ter fonte central confiável.

### Economia
- Um usuário = uma carteira oficial.
- Um extrato global, append-only e auditável.
- Nenhuma plataforma pode executar `saldo += x` como fonte oficial.
- Nenhum saldo oficial pode depender de `localStorage`/IndexedDB.
- Créditos, débitos, compras, transferências e vendas devem ser atômicos.
- Toda mutação econômica deve ter `idempotency_key`.
- Toda mutação deve validar usuário autenticado, origem, destino, saldo, item, propriedade, preço e estado atual.
- Toda transação iniciada pelo usuário deve ter etapa de intenção/resumo e etapa de confirmação.
- Débito e crédito de uma transferência devem ocorrer na mesma transação de banco.

### Loja Virtual DS canônica
- Não criar outra loja paralela. Use `loja-universal/loja-virtual-ds-v0.9.6.0-RG`.
- `src/core/foundation.js` não pode continuar como fonte oficial do saldo/ledger/inventário; após a integração, deve consumir ou espelhar estado oficial do Core.
- Preserve `DSStoreSDK` como facade de compatibilidade quando útil, mas redirecione-o para o `AGVCore`.
- Eventos do navegador não definem o valor oficial da recompensa. `amount` enviado por cliente legado deve ser ignorado como autoridade; o backend calcula moedas/XP/pontos por regra oficial.
- Fila offline é permitida para progresso/eventos idempotentes, não para concluir compra, transferência ou venda.
- Catálogo visual atual deve ser reconciliado com `store_items`; preço oficial sempre vem/revalida no backend.

### Marketplace
- Skins/itens negociáveis usam instâncias de inventário com proprietário atual.
- Não permitir vender item sem propriedade.
- Não permitir duas listagens ativas do mesmo item.
- Não permitir comprar o próprio item.
- Na compra: bloquear listagem, bloquear carteiras, revalidar preço/saldo/proprietário, transferir moeda e propriedade atomicamente.
- Manter histórico de propriedade e venda.

### XP/pontos/progresso
- Cada evento deve indicar `platform_id`, `activity_id`, `event_type` e `idempotency_key`.
- XP/pontos oficiais são gravados pelo Core, nunca pelo placar local diretamente.
- Recompensas devem respeitar catálogo/regra de ação do servidor.
- Eventos repetidos não podem gerar recompensa duplicada.
- O painel precisa separar total global e detalhamento por plataforma/atividade.

### Segurança
- Publishable/anon key pode ficar no frontend; `service_role`/secret key nunca.
- RLS em toda tabela exposta.
- Operações privilegiadas em Edge Functions ou funções SQL cuidadosamente protegidas.
- `SECURITY DEFINER` somente quando realmente necessário, com `search_path` fixo, validação de `auth.uid()`, `REVOKE EXECUTE FROM PUBLIC` e grants explícitos.
- O navegador deve ser tratado como ambiente hostil.
- Validar e normalizar payloads no servidor.
- Registrar auditoria administrativa e econômica.

## Ordem recomendada de implementação

### Fase 0 — Baseline
- Executar os sistemas canônicos sem integração e registrar comportamento atual.
- Criar testes/smoke tests mínimos para não quebrar cada plataforma.

### Fase 1 — Core de banco + Auth
- Implantar schema central.
- Configurar Auth.
- Criar perfil, diretório mínimo e papéis administrativos.
- Implementar SDK `AGVCore.auth`.
- Implementar login/logout/sessão única.

### Fase 2 — Progresso/XP/pontos
- Implantar contratos de evento.
- Implementar idempotência e catálogo de atividades/recompensas.
- Integrar primeiro CTF, Desafio, LAB Virtual e Game Informática.
- Depois Planetário, Fliperama e LABs DS.

### Fase 3 — Carteira e extrato global + Loja Virtual DS
- Criar carteira central e ledger imutável.
- Conectar a Loja Virtual DS v0.9.6.0-RG ao Core.
- Migrar `foundation.js` da loja de autoridade local para cache/facade do backend.
- Migrar o CTF para deixar de ser autoridade local do saldo.
- Fazer todas as plataformas exibirem o mesmo saldo/extrato oficial.

### Fase 4 — Catálogo + inventário universal
- Reutilizar a Loja Virtual DS, sem reconstruí-la.
- Sincronizar/reconciliar os 71 produtos atuais com o catálogo central.
- Compra confirmada e atômica.
- Inventário global.
- Aplicação de skin por plataforma sem duplicar propriedade.

### Fase 5 — Transferência P2P
- Busca segura de aluno destinatário.
- Intenção com resumo.
- Confirmação explícita.
- Operação atômica e auditável.
- Proteções de abuso e rate limit.

### Fase 6 — Marketplace P2P
- Listagem de skins.
- Compra confirmada.
- Transferência atômica de moeda + propriedade.
- Histórico de venda/propriedade.

### Fase 7 — Painel administrador
- visão global por aluno/turma/plataforma;
- progresso, XP, pontos, moedas;
- compras, transferências e vendas;
- inventário;
- busca/filtros;
- auditoria e sinalização de anomalias.

### Fase 8 — Migração e desligamento do legado
- Importar somente dados legados considerados confiáveis.
- Marcar importações com origem `migration`.
- Não importar automaticamente saldo local sem validação administrativa.
- Manter fallback de leitura local temporário somente para continuidade de UX.
- Remover gradualmente autoridade econômica/autenticação duplicada local.

## Entrega esperada

Ao final, produza:
- código cumulativo atualizado;
- migrations SQL reais aplicáveis ao projeto Supabase;
- Edge Functions necessárias;
- SDK compartilhado versionado;
- integração em todas as 10 plataformas canônicas;
- Loja Virtual DS v0.9.6.0-RG integrada como interface universal e sem autoridade financeira local;
- painel admin;
- testes de segurança/transação;
- documentação de deploy e rollback;
- relatório por plataforma com arquivos alterados;
- versão/tag do Core e das integrações.

**Não considere concluído apenas porque a interface mostra o mesmo saldo. A fonte da verdade precisa estar realmente centralizada e protegida no backend.**
