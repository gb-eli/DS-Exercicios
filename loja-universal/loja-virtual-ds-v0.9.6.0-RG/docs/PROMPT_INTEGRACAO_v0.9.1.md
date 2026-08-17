# Prompt de integração — v0.9.1

A v0.9.1 é uma versão de auditoria e não altera o contrato do SDK v0.9.0. Ao integrar:

1. Utilize os mesmos imports e adaptadores documentados na v0.9.0.
2. Preserve IDs, carteira, inventário, catálogo, GLBs, VFX e configurações.
3. Inclua os relatórios da pasta `reports/` apenas no pacote administrativo/documental.
4. Não carregue `assets/concepts/`, `assets/previews/` ou `reports/` durante a execução normal.
5. Execute `bash tests/run_regression.sh` após a integração.
6. Compare os arquivos críticos com `reports/baseline-lock-v0.9.0.json` quando houver suspeita de regressão.
