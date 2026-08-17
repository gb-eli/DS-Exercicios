# Persistência Completa e Mochila DS — v0.9.6.0-RG

## Inventário Geral
Continua representando todos os itens adquiridos. Não existe redução do catálogo nem duplicação de modelos.

## Mochila DS
Salva apenas IDs: até oito itens, seis animações e seis mensagens. Os modelos GLB, texturas, VFX e ambientes permanecem nos pacotes modulares e são carregados somente no uso.

## Limites
- Quatro espaços para visual/equipamentos.
- Dois espaços para ferramentas.
- Dois espaços para auras e efeitos.

## Persistência
O estado é salvo em localStorage com três checkpoints rotativos e espelhado no IndexedDB quando disponível.

## Backup
O JSON exportado contém personagem, mochila e preferências gráficas. Carteira, extrato, integridade e histórico financeiro não são exportados como dados restauráveis.

## Integração
`DSBackpackSDK.createAdapter(platformId)` oferece leitura, uso de item, animação e mensagem para laboratórios integrados.
