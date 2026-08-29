# v14.10.8.40 — Hotfix sintático do Campus DS 3D

## Causa confirmada
O `lobby3d.js` continha propriedades de objeto inválidas (`1ds`, `2ds`, `3ds` sem aspas) em `interiorOrigins` e `exteriorEntrances`. O Chrome interrompia o `import()` com `SyntaxError: Invalid or unexpected token`.

## Correção
As chaves foram normalizadas para `'1ds'`, `'2ds'` e `'3ds'`. A release também passa por validação com parser TypeScript além de `node --check`.

Não há mudança de banco de dados, equipes, senhas ou sessão de prova.
