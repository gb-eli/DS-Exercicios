# Integração rápida

Use `dist/ds-store-sdk.js` e o adaptador correspondente à plataforma. A aplicação deve emitir eventos educacionais; nunca deve editar diretamente o saldo.

```js
const sdk = DSStoreSDK.createAdapter('desafio-ds', {
  profileId: perfil.id,
  store: window.DSStore
});

const resultado = await sdk.missionCompleted({
  eventId: `missao-01:${perfil.id}:conclusao`,
  amount: 350,
  evidenceId: evidencia.id,
  activityId: 'missao-01'
});
```

Consulte `SDK_API_v0.9.0.md`, `ADAPTADORES_PLATAFORMA_v0.9.0.md` e `PROMPT_INTEGRACAO_v0.9.0.md`.
