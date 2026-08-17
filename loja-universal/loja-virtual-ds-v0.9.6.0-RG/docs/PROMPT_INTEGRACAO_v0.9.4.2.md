# Prompt de integração — Loja Virtual DS v0.9.4.2

Utilize a Loja Virtual DS v0.9.4.2 preservando caminhos relativos e o ponto de entrada `index.html`. Não copie somente o HTML: mantenha `demo/`, `assets/`, `packs/`, `catalog/`, `config/`, `dist/`, `sw.js` e `manifest.json`.

Ao integrar:

- registre o perfil antes de abrir o avatar;
- preserve a chave local `ds-avatar-loadout-v1`;
- use `DSAvatarViewer.play()` ou o evento `ds-avatar-play`;
- use `DSVFX.play()` somente quando a sobreposição correspondente estiver visível;
- respeite `prefers-reduced-motion`;
- não duplique listeners dos botões;
- mantenha o preview sticky no celular;
- atualize `packs/packages.json` e os hashes se qualquer runtime essencial for alterado.
