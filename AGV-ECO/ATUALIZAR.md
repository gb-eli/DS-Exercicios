# Atualização AGV v11.4 → v11.5 — P5.1 Campus 3D Cinematic

## Pré-requisito
Este pacote incremental parte da versão **v11.4 / P5.0 Lobby 3D/360**.

## Como atualizar no GitHub
1. Abra a pasta `AGV-ECOSSISTEMA-UNIFICADO/` deste ZIP.
2. Copie seu conteúdo para a raiz correspondente do repositório GitHub.
3. Confirme **substituir** os arquivos existentes quando solicitado.
4. Faça commit/push normalmente.

## Banco / Supabase
**Nenhuma nova migration ou Edge Function é necessária nesta P5.1.**
A versão herda o hardening de segurança já presente no baseline v11.4/P4.3.

## Arquivos desta atualização
- `02-STATUS-IMPLEMENTACAO.md`
- `IMPLEMENTATION.sha256`
- `P5.1-CAMPUS-3D-CINEMATIC-v11.5.md`
- `PACKAGE_CONTENTS.txt`
- `VALIDACAO-DO-PACOTE.md`
- `core/tests/p5-lobby-3d-v11.4.test.mjs`
- `core/tests/p5-lobby-3d-v11.5.test.mjs`
- `lobby/assets/config.js`
- `lobby/assets/lobby.css`
- `lobby/assets/lobby.js`
- `lobby/assets/lobby3d.js`
- `lobby/index.html`
- `release-v11.5.json`

## Exclusões
Nenhum arquivo precisa ser apagado.

## Principais mudanças
- Lobby v0.3.1;
- campus 3D com céu/névoa, pavimentação, fonte, vegetação e mobiliário;
- fachadas e portais 3D mais profundos e animados;
- avatares com proporções e variações humanas revisadas;
- câmera de ombro com entrada cinematográfica e FOV dinâmico;
- loading, retículo e banner de área mais discretos;
- autoridade de segurança permanece fora do renderer 3D.
