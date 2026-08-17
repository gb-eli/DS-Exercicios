# Prompt de integração — Loja Virtual DS v0.2.0

Integre o pacote `loja-virtual-ds-v0.2.0` à plataforma atual sem recriar a loja, a carteira ou os componentes visuais.

## Regras obrigatórias

1. Preserve todos os IDs do catálogo e contratos da v0.1.x.
2. Utilize `dist/ds-store-ui.css` como Design System oficial.
3. Utilize `dist/ds-store-foundation.js` apenas como núcleo local demonstrativo até a integração financeira definitiva.
4. Não altere o saldo diretamente no DOM, HTML, CSS ou estado visual.
5. Conecte recompensas por meio de eventos `DSStore.reward(...)`.
6. Mantenha o nome **Carteira Virtual DS**.
7. Preserve os descontos oficiais: 10%, 25%, 38%, 60%, 80%, 99% e Grátis.
8. Carregue loja, inventário, avatar, animações e laboratórios sob demanda.
9. Preserve navegação móvel inferior e sidebar no desktop, adaptando somente quando a plataforma possuir uma navegação equivalente.
10. Mantenha informações técnicas e financeiras detalhadas recolhidas por padrão.
11. Não remova suporte a redução de movimento.
12. Registre no changelog da plataforma a versão do módulo integrada.

## Exemplo de recompensa

```js
DSStore.reward({
  eventId: "missao-05-final",
  profileId: "perfil-123",
  type: "MISSION_COMPLETED",
  amount: 650,
  platformId: "desafio-ds",
  evidenceId: "evidencia-987"
});
```

## Verificações após integração

- abrir a loja em desktop e celular;
- confirmar carregamento apenas na primeira abertura da sessão;
- simular entrada de recompensa;
- abrir Carteira Virtual DS;
- verificar o extrato;
- comprar item de baixo valor;
- verificar inventário;
- testar redução de movimento;
- testar navegação por teclado;
- confirmar que o preço da compra vem do catálogo oficial.
