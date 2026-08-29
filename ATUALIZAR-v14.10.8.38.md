# v14.10.8.38 — Hotfix do preflight do Campus DS 3D

## Causa confirmada
O `boot.js` das releases 14.10.8.36/37 classificava um asset como inválido quando o conteúdo não continha literalmente o número da release. `config.js` é um módulo estável e válido, mas não possui esse marcador; por isso o diagnóstico mostrava `HTTP 200`, JavaScript, `htmlLike=false` e `versionOk=false`, seguido de `asset_invalido:config.js`.

## Correção
O preflight agora valida:
- HTTP 2xx;
- conteúdo não-HTML;
- Content-Type compatível com JavaScript;
- assinaturas mínimas específicas de cada módulo.

A presença literal do número da release virou apenas telemetria (`versionMarker`) e não bloqueia o boot.

Não há migration nem redeploy de Edge Function para este hotfix.
