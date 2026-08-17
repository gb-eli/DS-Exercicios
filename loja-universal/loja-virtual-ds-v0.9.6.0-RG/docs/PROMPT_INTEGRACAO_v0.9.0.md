# PROMPT DE INTEGRAÇÃO — LOJA VIRTUAL DS v0.9.0

Integre o pacote `loja-virtual-ds-v0.9.0` à plataforma atual sem recriar, simplificar ou misturar recursos de outros sistemas.

## Regras obrigatórias

1. Preserve integralmente a plataforma atual e seus módulos.
2. Importe a loja como módulo independente e carregado sob demanda.
3. Utilize o adaptador correspondente ao `platformId` da plataforma.
4. Nunca altere diretamente saldo, XP, inventário ou livro-caixa.
5. Envie recompensas exclusivamente pelo `DSStoreSDK`.
6. Crie `eventId` idempotente e estável por recompensa.
7. Inclua `evidenceId` quando a ação exigir evidência.
8. Trate `AUTHORIZED`, `UNDER_REVIEW`, `QUEUED` e `REJECTED` na interface.
9. Não duplique créditos ao recarregar, voltar de página ou repetir cliques.
10. Preserve os modos Econômico, Equilibrado, Alta, Ultra, Ultra avançado e Automático.
11. Não carregue GLB, VFX, loja ou inventário antes de o usuário solicitar.
12. Execute testes de integração, duplicidade, offline, responsividade e desempenho.

## Evento mínimo

```js
const sdk = DSStoreSDK.createAdapter('ID-DA-PLATAFORMA', {
  profileId: perfil.id,
  store: window.DSStore
});

await sdk.missionCompleted({
  eventId: `missao-01:${perfil.id}:conclusao`,
  amount: 350,
  evidenceId: evidencia.id,
  activityId: 'missao-01'
});
```

Ao concluir, gere um relatório com eventos conectados, valores, limites, IDs, arquivos alterados e testes executados.
