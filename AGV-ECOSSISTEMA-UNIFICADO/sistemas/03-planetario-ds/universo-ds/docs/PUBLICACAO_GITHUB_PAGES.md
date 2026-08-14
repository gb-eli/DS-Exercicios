# Publicação no GitHub Pages

## Estrutura esperada

Envie os arquivos diretamente à raiz do repositório. Não mova `index.html`, `service-worker.js` ou a pasta `.github`.

## Ativação

1. Abra **Settings** no repositório.
2. Entre em **Pages**.
3. Em **Build and deployment**, selecione **GitHub Actions**.
4. Envie a branch `main`.
5. Acompanhe a ação **Publicar COSMOS DS no GitHub Pages**.

## Atualizações

O Service Worker usa um nome de cache versionado. Sempre que recursos essenciais mudarem, altere:

```js
const CACHE_NAME = 'cosmos-ds-fase-2-v2';
```

Isso evita que estudantes mantenham uma versão antiga em cache.

## Teste antes de publicar

```bash
python3 -m http.server 4173
```

Nunca teste abrindo `index.html` diretamente, pois módulos ES precisam de HTTP.
