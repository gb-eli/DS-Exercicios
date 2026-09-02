# Implantação — AGV World F93 v14.10.8.95

## Escopo

Atualização de frontend e Service Worker para o build `14.10.8.95-stage64-f93-special-graphics`.

Não há migration nova nem alteração de Edge Function em relação à F92.

## Pré-requisito

- instalação consolidada até a migration 079;
- backup do frontend F92 atual;
- publicação preservando a estrutura de diretórios do ZIP.

## Implantação

1. Extraia o ZIP F93 em uma pasta nova.
2. Publique os caminhos públicos indicados em `PUBLIC-DEPLOY.json`.
3. Não publique `core/database`, `core/functions`, `core/tests`, `core/tools`, `deploy` ou `docs` como superfícies web.
4. Substitua integralmente os arquivos públicos do frontend; não mescle manualmente runtimes F92/F93.
5. Publique `lobby/sw.js` junto com os arquivos versionados.
6. Aguarde a ativação do novo Service Worker e confirme o cache `agv-lobby-runtime-14.10.8.95-stage64-f93-special-graphics`.

## Verificação pós-publicação

- versão exibida: `14.10.8.95`;
- Lobby abre sem erro de módulo ou arquivo ausente;
- Parque, Museu, Colégio e Labirinto abrem em 3D sob demanda;
- troca Ultra → Econômico funciona sem recarregar o mundo;
- desafios e interações continuam ativos após a troca;
- Colégio usa exclusivamente o mapa oficial v1.6.0-F7;
- nenhum runtime 3D especializado entra no shell crítico;
- primeiro frame deve ser conferido em desktop e Android, pois a captura visual automatizada não estava disponível no ambiente de build.

## Rollback

Restaure os arquivos públicos da F92 e seu `lobby/sw.js`. Não é necessário rollback de banco ou Edge Function.
