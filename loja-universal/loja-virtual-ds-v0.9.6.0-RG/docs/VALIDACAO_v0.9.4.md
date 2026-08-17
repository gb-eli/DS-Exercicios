# Validação v0.9.4 — Cache e Memória 2.0

## Resultado

- 8 pacotes gráficos validados.
- 318 referências de arquivos com SHA-256.
- Sintaxe aprovada em 7 scripts críticos.
- 10 grupos de regressão aprovados.
- Descarte real de buffers WebGL presente no avatar e na prévia de produtos.
- VFX liberado ao sair do módulo.
- Evento `ds-view-change` validado.
- Service Worker com políticas por classe de recurso.
- ZIP testado sem corrupção.

## Teste de navegador

A navegação para `localhost` foi bloqueada pela política administrativa do Chromium deste ambiente. Para não declarar um teste inexistente, o painel completo da fase foi injetado no Chromium com o CSS e o runtime reais.

O teste confirmou:

- quatro recursos registrados;
- 2,7 MB inicialmente rastreados;
- simulação de pressão e liberação LRU;
- oito eventos exibidos no diagnóstico;
- nenhuma exceção JavaScript;
- layout móvel em 390 × 844;
- `scrollWidth` igual a `clientWidth`, sem transbordamento horizontal.

Relatório: `reports/browser-cache-memory.json`.
