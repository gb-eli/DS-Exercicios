# Hotfix DS2 Front-End — linha extra na referência

Corrige o renderer da referência do DS2 Front-End sem alterar Supabase ou código dos alunos.

## Causa
`renderNumberedCode()` criava cada linha como um elemento `.reference-line`, mas depois unia esses elementos com `\n`. Como o container usa `white-space: pre`, esse caractere era renderizado como uma linha visual adicional entre elementos.

Além disso, arquivos terminados por newline geravam uma última entrada vazia após `split('\n')`.

## Correção
- linhas DOM unidas com `.join('')`;
- remove somente a entrada vazia artificial do final do arquivo;
- mantém linhas vazias reais no meio do código;
- cache-bust de `app.js` e `workspace.js`: `14.9.4-linefix1`.

## Validação
161/161 testes aprovados.
