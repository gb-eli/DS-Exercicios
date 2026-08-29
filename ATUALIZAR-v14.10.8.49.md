# AGV Campus DS — v14.10.8.49

## Release Gate / Produção

Esta release consolida as Fases E e F e adiciona uma camada operacional de publicação segura sobre a árvore completa v14.10.8.46 recuperada.

### Alterações

- Service Worker com instalação atômica do shell crítico.
- `diagnostics.js` e `sw-register.js` entram no pre-cache obrigatório.
- SDK Supabase local entra no shell crítico; Three.js e recursos do fullscreen portal permanecem como cache opcional/fallback.
- Nova validação de publicação para impedir commits com deleções acidentais ou árvore incompleta.
- Publicação cria branch de backup remota antes de alterar `main`.
- Rollback recomendado por `git revert`, preservando histórico.
- Mesma `main`, mesmo repositório e mesmo GitHub Pages.
- Nenhuma alteração de schema/Supabase.

### Base esperada

Aplicar o patch cumulativo sobre a árvore completa recuperada da v14.10.8.46 (`7e6cb17`) ou sobre uma árvore completa equivalente com mais de 3.000 arquivos rastreados.

### Regra de segurança

Nunca limpar a raiz do repositório antes de aplicar este patch. O pacote é incremental/cumulativo e deve ser copiado por cima da árvore existente.
