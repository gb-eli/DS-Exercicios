# Validação v0.9.4.1 — Hotfix GitHub Pages

## Causa confirmada

O `index.html` da raiz continha a página completa copiada de `demo/index.html`, mas mantinha referências como `styles.css`, `app.js` e `../assets/...`. Na raiz do repositório esses caminhos apontavam para locais inexistentes. O navegador recebia o HTML, porém o CSS e parte dos scripts retornavam 404.

## Correção

- `index.html` da raiz agora encaminha por URL relativa para `demo/index.html`.
- O redirecionamento funciona em domínio principal e em projeto do GitHub Pages (`usuario.github.io/repositorio/`).
- Incluído `.nojekyll`.
- Incluído `404.html` de recuperação.
- Cache do Service Worker atualizado para `0.9.4.1`.
- Mantido `demo/index.html` como runtime oficial.

## Testes

- Resolução de `./demo/index.html` sob subdiretório de repositório.
- HTTP 200 para CSS, JavaScript, SVG, WebP, GLB e JSON críticos.
- Verificação de todas as referências locais de `demo/index.html`.
- `node --check` nos scripts JavaScript.
- ZIP sem corrupção.

## Verificação visual em navegador

A navegação direta para localhost foi bloqueada pela política administrativa do Chromium deste ambiente. O runtime real foi então executado no Chromium com uma origem simulando um projeto do GitHub Pages (`/repo/demo/`) e todas as requisições foram atendidas a partir da estrutura final.

Resultado:

- 1 folha de estilo carregada;
- fundo calculado `rgb(5, 10, 18)`;
- shell principal presente;
- 14 itens de navegação renderizados;
- nenhum erro de console;
- nenhuma requisição de recurso falhou.
