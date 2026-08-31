# Correções — Etapa 22

## GitHub / Console Professor — revisão privada e simulador somente leitura

Data: 31/08/2026

### Escopo

Esta etapa ficou restrita ao bloco GitHub/Professor. Não altera roster, Central de Apoio, supervisão, rotas legadas, banco ou Edge Functions.

### Diagnóstico

As três falhas remanescentes do bloco eram compostas por dois contratos históricos ainda presos ao cache-bust `14.10.8.18` e por um teste que exigia a existência de um resumo público legado já removido. A implementação atual do Console Professor já carregava os scripts em `14.10.8.65` e mantinha a revisão histórica sem escrita remota.

A auditoria também identificou oportunidade de endurecimento: o simulador possuía um helper genérico capaz de receber um método HTTP, embora o fluxo atual o utilizasse apenas para leitura.

### Correções aplicadas

- contrato do painel de revisão atualizado para o script atual `legacy-github-review.js?v=14.10.8.65`;
- simulador recebeu cache-bust `legacy-github-apply-simulator.js?v=14.10.8.65-stage22`;
- removido helper genérico `api(path,{method,body})` do simulador;
- consultas REST do simulador agora passam por `readApi(path)`, restrito a caminhos `/rest/v1/` e método `GET`;
- leitura do overview docente foi isolada em `readOverview()`, com `action: 'overview'` fixa e `staffFunction` configurada;
- nenhuma operação `update`, `insert`, `delete`, `PATCH`, `PUT` ou `DELETE` foi adicionada;
- revisão histórica continua armazenando rascunhos somente em `localStorage` e exportando JSON local com `production_write_applied:false`;
- teste de privacidade não exige mais um resumo legado removido: agora percorre os caminhos realmente publicáveis definidos por `PUBLIC-DEPLOY.json` e reprova qualquer relatório GitHub identificável em JSON/CSV;
- fixtures de auditoria continuam em `core/tests/`, explicitamente fora do bundle estático público.

### Validação

- testes focados P10.9.6/P10.9.7: 12/12 PASS;
- cinco validadores oficiais: PASS;
- suíte completa: 371/376 PASS;
- três falhas GitHub/Professor eliminadas;
- cinco falhas restantes pertencem a supervisão histórica, roster público, Central de Apoio e duas rotas legadas.

### Banco / backend

Nenhuma migration, Edge Function ou escrita de produção foi aplicada nesta etapa.
