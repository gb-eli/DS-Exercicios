const sdk = DSStoreSDK.createAdapter('desafio-ds', {
  profileId: perfil.id,
  store: window.DSStore
});

const resultado = await sdk.phaseCompleted({
  eventId: `fase-05:${perfil.id}:primeira-conclusao`,
  amount: 500,
  evidenceId: evidencia.id,
  activityId: 'fase-05',
  metadata: { score: 92, attempt: 1 }
});

if (resultado.status === 'AUTHORIZED') atualizarResumoDaCarteira(resultado.balances);
if (resultado.status === 'UNDER_REVIEW') mostrarAvisoDeAnalise(resultado.validationTargetSeconds);
