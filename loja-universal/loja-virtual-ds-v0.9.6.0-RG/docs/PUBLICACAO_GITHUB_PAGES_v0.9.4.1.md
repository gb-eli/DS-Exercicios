# Publicação no GitHub Pages — v0.9.4.1

## Estrutura obrigatória na raiz publicada

```text
index.html
demo/
assets/
dist/
catalog/
config/
packs/
sw.js
manifest.json
.nojekyll
```

Não envie somente `index.html`. As pastas devem permanecer no mesmo nível.

## GitHub Pages

Em **Settings → Pages**, configure a fonte para a branch utilizada e a pasta `/ (root)` quando os arquivos acima estiverem na raiz do repositório.

Depois da publicação, abra a URL principal do Pages. O arquivo raiz encaminhará para `demo/index.html`, onde `styles.css` e os scripts existem.

## Atualização de cache

Após substituir a versão anterior:

1. Aguarde o GitHub Pages concluir a implantação.
2. Abra a página em uma janela anônima.
3. Na página antiga, use `Ctrl + F5`.
4. Se necessário, remova o Service Worker anterior em DevTools → Application → Service Workers.
