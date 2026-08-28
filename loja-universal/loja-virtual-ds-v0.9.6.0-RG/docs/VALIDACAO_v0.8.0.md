# Validação da Loja Virtual DS v0.8.0

## Testes funcionais

Executados em Chromium headless com os recursos locais servidos por roteamento interno do teste.

- 13 telas carregadas.
- 71 itens do catálogo reconhecidos.
- 75 cards renderizados entre catálogo e destaques.
- Saldo inicial: 4.800 moedas.
- Crédito de 5.000 moedas encaminhado à análise.
- Revisão aprovada e saldo atualizado para 9.800 moedas.
- Crédito de 50.000 moedas encaminhado à análise crítica.
- Revisão bloqueada e 50.000 moedas registradas em saldo bloqueado.
- Detalhes do extrato abertos com hashes e saldos.
- Nenhum erro JavaScript ou erro de console.
- Layout móvel em 390 × 844 sem transbordamento horizontal.

Resultado detalhado: `docs/browser-test-v080.json`.

## Testes estáticos

- JSONs analisados com sucesso.
- JavaScript aprovado por `node --check`.
- IDs de tela sem duplicidade.
- Assets financeiros encontrados.
- Cadeia de hashes testada pelo fluxo real da demonstração.
- ZIP validado após empacotamento.

## Observação de segurança

A versão local é auditável e resistente a alterações simples, mas um navegador controlado pelo usuário não substitui um servidor autoritativo. Créditos de alto valor devem ser confirmados por voucher assinado, validador do professor ou serviço externo protegido na integração definitiva.
