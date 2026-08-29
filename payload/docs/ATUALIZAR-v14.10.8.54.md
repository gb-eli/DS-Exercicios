# AGV Campus DS — v14.10.8.54

## Hotfix Portal Monumental do Vale

Esta versão evolui a `v14.10.8.53` sem alterar o Vale, suas 27 empresas ou os 8 distritos. O objetivo é tornar a entrada do Vale impossível de passar despercebida.

### Mudanças

- Portal do Vale movido de `z=-23.5` para `z=-15.4`, dentro da área visível principal do Campus.
- Portal 2D reconstruído como marco monumental, com pilares, cabeçalho, campo energético e identificação `EMPRESAS DOS ALUNOS`.
- Portal 3D ampliado para uma estação/entrada monumental com pilares, travessa superior, halos e placas `VALE DO SILÍCIO AGV` e `27 EMPRESAS • 8 DISTRITOS`.
- Novo botão permanente no HUD: `🏙 Vale do Silício`; dentro do Vale ele muda para `↩ Campus DS`.
- Sinalização do corredor norte passa a apontar explicitamente para o Vale.
- Interação por proximidade continua disponível com `E`.
- 2D continua sendo o modo inicial e 3D continua opcional.
- Nenhuma alteração de schema ou migração do Supabase.
- Nenhuma mudança no endereço do GitHub Pages.

### Rollback

Use preferencialmente `git revert <hash-do-commit-v14.10.8.54>` e publique novamente a `main`.
