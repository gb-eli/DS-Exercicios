# Relatório de implementação — v2.5.2

## Objetivo

Revisar experiência, responsividade, gráficos, coerência pedagógica e funcionamento das 13 aulas antes da publicação no GitHub Pages.

## Problemas encontrados e corrigidos

1. **Gráfico da planilha no celular**: o botão de fechar usava cor branca sobre fundo branco. Agora possui contraste, foco visível e área de toque de 36 px.
2. **Rótulos do gráfico**: categorias ficavam invisíveis. Agora possuem cor explícita, valores e título contextual.
3. **Google Apresentações em telas pequenas**: o slide tinha largura mínima de 500 px e era cortado. Agora se ajusta ao espaço disponível, não cria rolagem horizontal na página e usa uma prévia vertical mais confortável no celular.
4. **Tutorial de apresentações**: a etapa caía em instruções genéricas. Agora explica layout, síntese, gráfico, notas, permissões e revisão.
5. **Identificação da etapa**: apresentação aparecia como atividade genérica. Agora aparece como `APRESENTAÇÃO`.
6. **Exploração contabilizada como erro**: abrir ou fechar um gráfico podia ser tratado como decisão incorreta. Essas ações passaram a ser auxiliares e neutras.
7. **Anexos sem produção real**: algumas avaliações solicitavam PDFs que não eram gerados no fluxo. Todas receberam editor documental e exportação correspondente.
8. **Avaliação e recuperação do 2º ADM semelhantes**: agora possuem bases, contextos, fórmulas, permissões e resultados diferentes.
9. **Ausência de briefing**: avaliações, recuperações e a Aula 3 do 2º ADM agora começam com contexto e explicação do fluxo.
10. **Comandos excessivamente reveladores**: as atividades avaliativas passaram a solicitar resultados e decisões, em vez de informar diretamente o botão que deve ser usado.

## Coerência curricular

- As Aulas 1, 2 e 3 do 1º ADM permanecem congeladas em conteúdo.
- O restante do 1º ADM progride de fórmulas para comunicação, apresentações, avaliação e recuperação.
- O 2º ADM progride de rotina integrada para fórmulas, comunicação gerencial, avaliação e recuperação.
- Avaliação e recuperação verificam competências equivalentes por problemáticas distintas.
- Todo anexo de e-mail possui origem em um documento produzido na própria aula.

## Responsividade validada

Componentes renderizados em Chromium real com conteúdo injetado, usando os estilos do projeto:

- 390 × 844: apresentação sem overflow horizontal, canvas de 306 px e rótulos legíveis;
- 390 × 844: gráfico com botão de fechamento visível e categorias legíveis;
- 1366 × 900: apresentação completa com barra lateral e slide centralizado.

## Compatibilidade

- caminho público preservado: `desafio-informatica-agv-v2.2.0`;
- dados e perfis mantidos;
- Aulas 1–3 do 1º ADM preservadas;
- schema de dados mantido em 23;
- cache atualizado para `desafio-informatica-agv-2.5.2-r32`.
