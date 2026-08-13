# SQL de referência

Estes arquivos são um **baseline técnico**, não substituem uma migration gerada/validada contra o projeto Supabase real. No chat de implementação: conferir changelog/docs atuais, adaptar ao schema existente, aplicar em ambiente de teste, rodar advisors e testes de concorrência antes de produção.

Ordem lógica: `001_core_schema.sql` → `002_rls.sql` → `003_transfer_rpc.sql` → `004_seed_platforms.sql` → `005_store_marketplace_rpc.sql`.
