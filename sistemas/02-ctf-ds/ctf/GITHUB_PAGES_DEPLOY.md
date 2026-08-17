# Publicação no GitHub Pages — CTF DS v3.2.0

## Conteúdo a enviar

Envie todos os arquivos e pastas deste pacote para a raiz do repositório, incluindo:

- `index.html`
- `css/`
- `js/`
- `assets/`
- `sw.js`
- `manifest.webmanifest`
- `.nojekyll`
- manifests e documentos Markdown/JSON.

Não envie apenas o `index.html`.

## Configuração

1. Abra o repositório no GitHub.
2. Entre em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main`.
5. Selecione `/ (root)`.
6. Salve.

## Antes da aula

- Edite `js/config/platform-config.js`.
- Configure apenas links reais de Classroom, GitHub e VS Code.
- Teste o endereço publicado em janela anônima.
- Crie um perfil de teste.
- Aceite os termos.
- Resolva ao menos a primeira missão.
- Abra a gaveta de ferramentas.
- Gere uma evidência.
- Teste exportação e importação de backup.
- Recarregue a página para confirmar o funcionamento offline.
- Abra o mesmo perfil em duas abas para validar a proteção contra conflito.
- Confira o tempo ativo e o checklist do processo em um dos 68 casos investigativos.
- Execute `npm test` no pacote antes do envio, quando Node.js estiver disponível.

## Service Worker

Os caches desta versão são `ctfds-static-v3.2.0` e `ctfds-runtime-v3.2.0`. Caso uma versão antiga permaneça aberta:

1. feche todas as abas da plataforma;
2. reabra o site;
3. recarregue uma vez;
4. se necessário, limpe apenas os dados desse site.

## EduAuth

A integração EduAuth permanece com `productionProvisioned: false`. A plataforma pode ser publicada para testes e para uso das funções comuns, mas PINs de teste não devem ser tratados como autorização real de sala até o provisionamento pelo EduAuth Professor.
