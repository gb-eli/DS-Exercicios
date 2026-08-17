# SDK da Loja Virtual DS v0.9.0

## Objetivo

Conectar cada plataforma à mesma Carteira Virtual DS sem copiar ou reconstruir a loja. A plataforma emite eventos educacionais; o núcleo financeiro valida, evita duplicidade, calcula o nível de análise e registra a transação.

## Inicialização direta

```html
<script src="dist/ds-store-foundation.js"></script>
<script src="dist/ds-store-sdk.js"></script>
<script>
const sdk = DSStoreSDK.createAdapter('desafio-ds', {
  profileId: 'perfil-123',
  store: DSStore
});
</script>
```

## Métodos

- `tutorialCompleted(payload)`
- `toolResultCreated(payload)`
- `labCompleted(payload)`
- `phaseCompleted(payload)`
- `missionCompleted(payload)`
- `challengeCompleted(payload)`
- `projectPublished(payload)`
- `evidenceExported(payload)`
- `achievementUnlocked(payload)`
- `sessionCompleted(payload)`
- `collaborationValidated(payload)`
- `feedbackConfirmed(payload)`
- `bugReportConfirmed(payload)`
- `learningProgress(payload)`
- `recoveryCompleted(payload)`
- `teacherReward(payload)`

## Identificador idempotente

O `eventId` deve representar uma única recompensa lógica. Reabrir a página, clicar duas vezes ou reenviar o mesmo evento não pode gerar novo crédito.

Exemplo: `desafio-ds:fase-05:perfil-123:primeira-conclusao`.

## Respostas

- `AUTHORIZED`: moedas liberadas.
- `UNDER_REVIEW`: valor registrado e colocado em análise.
- `QUEUED`: evento salvo localmente para nova tentativa.
- `REJECTED`: evento inválido, duplicado ou recusado.

## Comunicação em iframe

Use `transport: "postMessage"` no sistema filho e `DSStoreSDK.startBridge(...)` no host. Defina origens permitidas explicitamente em produção.

## Fila offline

Eventos sem transporte disponível são guardados em fila local. Use `sdk.flushQueue()` quando a loja estiver novamente acessível.
