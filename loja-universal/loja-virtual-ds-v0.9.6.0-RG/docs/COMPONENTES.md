# Componentes reutilizáveis

## Shell

O shell inclui topbar, navegação e contêiner de views. A plataforma hospedeira pode ocultar sua própria navegação enquanto a loja estiver aberta ou montar a loja em uma rota dedicada.

## Cards de produto

Campos mínimos:

- `item.id`;
- nome;
- categoria;
- raridade;
- preço oficial;
- desconto da rodada, quando existir;
- miniatura ou símbolo;
- ação para abrir a prévia.

O preço do card nunca é usado como autoridade para concluir uma compra.

## Carteira

A primeira camada mostra somente saldo disponível, valor em análise, valor reservado e integridade. Os outros estados ficam dentro do botão **Ver outros saldos**.

## Modais

- modal de produto: prévia e metadados;
- modal de transação: validação passo a passo;
- fechamento por botão, clique no fundo ou tecla Esc;
- conteúdo deve permanecer legível em telas pequenas.

## Carregamento sob demanda

O módulo registra em `sessionStorage` os pacotes abertos durante a sessão. O carregamento visual aparece apenas na primeira solicitação.

## Eventos visuais

A interface deve escutar eventos do núcleo em vez de alterar saldos diretamente:

- `state`;
- `reward`;
- `purchase`.
