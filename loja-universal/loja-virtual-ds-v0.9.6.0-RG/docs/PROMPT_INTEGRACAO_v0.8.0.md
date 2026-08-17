# Prompt de Integração — Loja Virtual DS v0.8.0

Integre a pasta `loja-virtual-ds-v0.8.0` à plataforma sem recriar, simplificar ou substituir os módulos existentes da Loja Virtual DS.

## Regras obrigatórias

1. Preserve integralmente loja, carteira, inventário, avatar 3D, equipamentos, animações, VFX e sistema gráfico adaptativo.
2. Não misture ferramentas ou dados de outras plataformas.
3. Use `DSStore.reward()` para recompensas; nunca altere saldo diretamente.
4. Gere um `eventId` único e estável para cada recompensa.
5. Envie `platformId`, `profileId`, `type`, `amount`, `evidenceId` e `activityId` quando disponíveis.
6. Respeite os estados `AUTHORIZED`, `UNDER_REVIEW`, `BLOCKED` e `PENDING`.
7. Não libere item, saldo ou XP com base em valores do DOM.
8. Preserve o histórico e a cadeia de hashes durante migrações.
9. Mantenha o carregamento sob demanda e os modos Econômico, Equilibrado, Alta, Ultra, Ultra avançado e Automático.
10. Não aplique multa automática por abrir o inspetor, alterar CSS ou por falha de armazenamento.

## Exemplo de evento

```js
DSStore.reward({
  eventId: "desafio-ds:fase-05:perfil-123:primeira-conclusao",
  profileId: "perfil-123",
  platformId: "desafio-ds",
  type: "PHASE_COMPLETED",
  amount: 500,
  activityId: "fase-05",
  evidenceId: "evidencia-987"
});
```

## Tratamento do retorno

- `AUTHORIZED`: atualizar a interface e informar que as moedas estão disponíveis.
- `UNDER_REVIEW`: mostrar o valor em análise e permitir que o aluno continue a atividade.
- erro de duplicidade: não gerar novo crédito.
- erro de faixa: registrar diagnóstico e revisar a regra da atividade.

## Entrega da integração

- informar arquivos alterados;
- preservar versão anterior;
- atualizar changelog;
- testar recompensa comum e recompensa em análise;
- testar compra, extrato e inventário;
- testar desktop e celular;
- confirmar ausência de erros no console.
