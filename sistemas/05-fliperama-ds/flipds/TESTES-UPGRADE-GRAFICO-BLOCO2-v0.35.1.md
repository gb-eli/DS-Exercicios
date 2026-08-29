# Testes — Upgrade gráfico 2/3 · v0.35.1

## Resultado
**178 verificações estruturais aprovadas, 0 falhas.**

### Verificações
- versão sincronizada em `version.json`, `index.html`, `app.js` e `sw.js`;
- seis seletores temáticos de palco presentes;
- 12 previews SVG válidos e diferentes da baseline v0.35.0;
- marcadores de efeitos inseridos nos seis runtimes;
- 17 módulos de simulação comparados por SHA-256 e mantidos idênticos;
- arquivos essenciais presentes;
- todos os JSONs lidos sem erro;
- todos os SVGs analisados como XML válido.

## HTTP
233 arquivos existentes no momento do teste foram servidos localmente e responderam HTTP 200.

## Chromium
O smoke visual foi tentado, mas o Chromium do ambiente excedeu o timeout após erros de DBus. Nenhuma captura foi contabilizada como aprovada.
