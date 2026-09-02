# Implantação — AGV World F94.1 HF1

## Recomendação

Publique os arquivos públicos do pacote F94.1 HF1 sobre a F94, preservando a estrutura de diretórios. Não execute migrations e não altere Edge Functions.

## Arquivos públicos alterados

- `PUBLIC-DEPLOY.json`
- `lobby/assets/lobby.js`
- `lobby/assets/boot.js`
- `lobby/assets/vendor-loader.js`
- `lobby/assets/sw-register.js`
- `lobby/index.html`
- `lobby/sw.js`

## Verificação pós-publicação

1. Recarregue o Lobby.
2. O diagnóstico não deve mais registrar `openWorldSettings is not defined`.
3. O estágio deve ultrapassar `lobby_module_import`.
4. `runtime.firstFrame` deve poder tornar-se `true` após a inicialização do modo correspondente.
5. Clique no botão ⚙️ e confirme que o modal de configurações abre preenchido.
6. Confirme que o Service Worker reporta a nova cadeia `...f94-auto-calibration-hf1`.

Não é necessário limpar manualmente todo o navegador: o HF1 usa cache-bust próprio. Se uma aba antiga permanecer aberta, feche-a e abra o Lobby novamente.
