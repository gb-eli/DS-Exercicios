# Painel administrador central

## Visão geral

O painel administrativo deve consumir somente o Core e nunca precisar entrar no `localStorage` de cada plataforma.

## Dashboard

- usuários ativos;
- alunos/turmas;
- acessos por plataforma;
- conclusão e progresso;
- XP e pontos emitidos;
- moedas em circulação;
- moedas emitidas/gastas/transferidas;
- vendas no marketplace;
- itens mais usados/vendidos;
- alertas de segurança/duplicidade/anomalia.

## Perfil do aluno

Mostrar:

- identificação e turma;
- status da conta;
- plataformas acessadas;
- progresso por plataforma/atividade;
- XP/pontos global e detalhado;
- carteira atual;
- extrato completo;
- compras;
- transferências enviadas/recebidas;
- inventário;
- anúncios/vendas;
- histórico de propriedade dos itens;
- eventos de segurança relevantes.

## Ações administrativas

Ações como crédito/debito, congelar carteira, desativar item, corrigir propriedade ou reverter operação exigem:

- papel autorizado;
- justificativa;
- confirmação;
- registro em `admin_audit_log`;
- lançamento contábil correspondente, sem editar/apagar ledger antigo.

Correções econômicas são feitas por **novo lançamento de ajuste/reversão**, nunca modificando o histórico existente.
