# Hotfix v14.9.4-spacing1 — Referência compacta

Correção exclusivamente visual.

- line-height da referência: 1.35
- min-height: 1.35em
- margin: 0
- padding vertical: 0
- row-gap/column-gap: 0
- mantém linhas realmente vazias existentes no código
- preserva integralmente a paleta de contraste v14.9.4
- CSS recebe cache-bust `14.9.4-spacing1`; JavaScript permanece em `14.9.4`

Arquivos para substituir na hospedagem:
- `atividades/index.html`
- `atividades/assets/css/app.css`

Regressão: 158/158 testes aprovados.
