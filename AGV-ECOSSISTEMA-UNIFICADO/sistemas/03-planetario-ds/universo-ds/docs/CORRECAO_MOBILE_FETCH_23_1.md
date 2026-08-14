# Correção mobile 23.1 — Failed to fetch

## Sintoma observado

- a interface do laboratório abre;
- a camada GLB mostra “Failed to fetch”;
- o objeto premium não aparece;
- em alguns WebViews o cenário pode ficar praticamente vazio.

## Causa

Alguns editores Android usam uma URL de prévia intermediária ou restrições próprias do WebView. Os caminhos do manifesto premium eram carregados diretamente com `fetch()`, que pode falhar mesmo quando módulos JavaScript e CSS já foram abertos.

## Correções

1. Novo `ResourceLoader` com resolução por `import.meta.url` e raiz real do projeto.
2. Tentativas em Cache API, Fetch e XMLHttpRequest.
3. URLs do manifesto, GLB, WebP e HDR resolvidas de forma independente da aba de prévia.
4. Falha premium não interrompe mais o laboratório principal.
5. Representação visual local aparece quando o WebView bloqueia os binários.
6. Badge informa “MODO LOCAL” e permite uma nova tentativa.
7. Service Worker atualizado para armazenar o carregador e o gerenciador premium.

## Publicação recomendada

A experiência completa continua recomendada em GitHub Pages ou servidor HTTP. Abrir diretamente como arquivo local pode limitar Workers, módulos, Cache API, áudio e acesso a arquivos binários dependendo do aplicativo Android.
