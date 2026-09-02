# Implantação — AGV World F94 v14.10.8.96

## Escopo

Atualização de frontend e Service Worker para o build `14.10.8.96-stage65-f94-auto-calibration`.

Não há migration nem alteração de Edge Function em relação à F93.

## Pré-requisitos

- instalação consolidada até a migration 079;
- backup dos arquivos públicos da F93;
- publicação preservando a estrutura de diretórios do ZIP.

## Implantação

1. Extraia o ZIP F94 em uma pasta nova.
2. Publique os caminhos públicos indicados em `PUBLIC-DEPLOY.json`.
3. Não publique `core/database`, `core/functions`, `core/tests`, `core/tools`, `deploy` ou `docs` como superfícies web.
4. Substitua integralmente os arquivos públicos; não misture módulos F93 e F94.
5. Publique `lobby/sw.js` junto com todos os arquivos versionados.
6. Aguarde o novo Service Worker e confirme o cache `agv-lobby-runtime-14.10.8.96-stage65-f94-auto-calibration`.

## Verificação pós-publicação

- versão exibida: `14.10.8.96`;
- Lobby abre sem erro de módulo ou arquivo ausente;
- seletor mostra **Calibração F94** no modo Automático;
- Campus, Vale, Rural, Base, Estação, Lua, Marte, Parque, Colégio, Labirinto e Museu aceitam o perfil inicial indicado;
- após permanência no 3D, o diagnóstico inclui `graphicsCalibration`;
- uma escolha manual continua fixa mesmo sob FPS baixo;
- ao voltar para Automático, a calibração pode reduzir ou elevar um nível após as janelas de confirmação;
- **Recalibrar este ambiente** limpa apenas o perfil do mundo atual;
- o airdrop permanece em perfil transitório e não muda o aprendizado do Campus;
- nenhum runtime 3D entra no shell crítico;
- validar especialmente um desktop e um Android real, pois não houve captura visual no ambiente de build.

## Rollback

Restaure os arquivos públicos e o `lobby/sw.js` da F93. Não é necessário rollback de banco ou Edge Function. O registro local `agv:lobby:graphics-calibration-v94` pode permanecer no navegador; a F93 não o utiliza.
