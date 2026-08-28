# Relatório de validação — v0.3.0

Data: 31/07/2026

## Validação estática

- 24 itens do catálogo validados;
- IDs únicos;
- preços dentro da faixa de 30 a 500.000 moedas;
- descontos oficiais confirmados: 10%, 25%, 38%, 60%, 80%, 99% e Grátis;
- 10 views navegáveis;
- 85 seletores diretos de ID conferidos;
- scripts JavaScript aprovados pelo verificador de sintaxe do Node.js;
- referências internas e arquivos obrigatórios conferidos.

## Validação em navegador

A demonstração foi montada em navegador Chromium headless com os mesmos conteúdos HTML, CSS e JavaScript distribuídos no pacote.

Resultados:

- página inicial renderizada;
- quatro cards recomendados renderizados;
- Loja Virtual DS aberta por carregamento modular;
- 24 produtos exibidos no catálogo;
- modal de produto aberto com prévia e preço oficial;
- compra de animação de baixo valor autorizada;
- inventário atualizado após a compra;
- saldo alterado de 4.800 para 4.784 moedas conforme desconto da rodada;
- extrato atualizado de uma para duas operações;
- Carteira Virtual DS aberta corretamente;
- navegação inferior exibida em viewport de 390 × 844 px;
- sidebar convertida em painel móvel;
- nenhuma exceção JavaScript encontrada;
- nenhum erro de console encontrado.

## Capturas incluídas

- `assets/previews/v0.3.0-desktop.png`;
- `assets/previews/v0.3.0-store-modal.png`;
- `assets/previews/v0.3.0-mobile.png`.
