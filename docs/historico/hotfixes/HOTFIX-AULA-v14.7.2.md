# Hotfix aula v14.7.2

Correções emergenciais de editor/preview/validação:
- preview aceita `estilo.css`, `style.css` e demais CSS/JS declarados;
- validação HTML usa DOM real para estrutura, relações, IDs, formulário e tabela;
- passo a passo aparece como painel opcional;
- inserção externa/em massa é bloqueada no modo supervisionado;
- todos os arquivos previstos precisam ter conteúdo antes da conclusão pelo frontend;
- ferramentas e saída continuam recolhidas por padrão;
- todos os arquivos continuam acessíveis desde o início.

## Limite conhecido
A validação definitiva ainda precisa ser migrada para backend. `activity-progress/complete` do snapshot atual não deve ser tratado como nota automática antifraude até o validador server-side ser publicado.
