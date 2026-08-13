# DS_VFX_ENGINE_1

## Arquitetura

O VFX é um módulo de visualização. A propriedade de um efeito continua sendo determinada pelo inventário validado. O renderer nunca concede itens.

## Carregamento

1. O shell não carrega efeitos.
2. Ao abrir Efeitos ou reproduzir uma prévia, o pacote `vfx` é inicializado.
3. Cada efeito usa somente sua definição JSON e prévia WebP.
4. O loop pausa com a página oculta.
5. A qualidade controla o orçamento máximo de partículas.

## Orçamento

- Econômico: 80 partículas.
- Equilibrado/Automático: 250.
- Alta: 700.
- Ultra: 1.600 no contrato; o demo pode impor limite defensivo conforme o navegador.

## Categorias

- aura
- celebration
- screen

## Acessibilidade

- respeitar redução de movimento;
- não bloquear leitura ou navegação;
- botão para parar efeito;
- efeitos não podem alterar controles ou estado financeiro;
- evitar flashes rápidos ou padrões agressivos.
