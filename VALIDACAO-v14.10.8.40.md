# Validação v14.10.8.40

## Erro confirmado
O Chrome interrompia o `import()` do Lobby com `SyntaxError: Invalid or unexpected token` porque `lobby/assets/lobby3d.js` continha chaves de objeto inválidas iniciadas por número sem aspas:

- `1ds`
- `2ds`
- `3ds`

As ocorrências estavam nos objetos `interiorOrigins` e `exteriorEntrances`.

## Correção
As chaves foram alteradas para `'1ds'`, `'2ds'` e `'3ds'`.

## Validações
- parser TypeScript independente: 50 arquivos JS/MJS críticos, 0 erros;
- `node --check` nas superfícies Lobby/Prova/Atividades/Admin;
- busca por propriedades iniciadas por número sem aspas: 0 ocorrências;
- regressão selecionada: 23/23 suítes aprovadas;
- `core/core`, `core/lobby`, `core/prova` e `core/atividades`: ausentes;
- nenhuma alteração de banco de dados ou senha.

## Resultado esperado após publicação
O diagnóstico deve avançar de `lobby_module_import` para `lobby_module_loaded`, seguido do carregamento de identidade/runtime.
