# Relatório de implementação — v2.4.0

## Escopo

Primeira fase da reconstrução das ferramentas administrativas realistas: motor funcional de planilha e janela de compartilhamento. As Aulas 1 e 2 já aplicadas no 1º ADM não foram alteradas em identidade ou revisão curricular.

## Implementado

- grade funcional com cabeçalhos, células e seleção de intervalos;
- edição por duplo clique, Enter/F2 e barra de fórmulas;
- navegação por setas e Tab;
- copiar/colar interno e atalhos Ctrl/Cmd+C, V, Z e Y;
- histórico local de desfazer/refazer;
- formatação de negrito, itálico, sublinhado, alinhamento, moeda, porcentagem, preenchimento, bordas e tamanho;
- fórmulas aritméticas e funções SOMA, MÉDIA, MÍNIMO, MÁXIMO, SE, CONT.SE e SOMASE;
- mensagens de erro para expressão inválida e referência circular;
- filtros por coluna, seleção de valores, ordenação crescente/decrescente e limpeza;
- congelamento da primeira linha e gráfico de colunas;
- compartilhamento com pessoas fictícias, Leitor, Comentador, Editor, acesso restrito ou por link e cópia simulada do link;
- persistência do workbook no checkpoint;
- interface responsiva com modal em tela cheia no celular;
- suporte a movimento reduzido e controles por teclado.

## Limites desta fase

- não existe colaboração em tempo real ou conexão com Google Workspace;
- o link copiado é fictício;
- fórmulas cobrem o subconjunto pedagógico definido, não toda a linguagem de uma planilha comercial;
- não há importação de XLSX/ODS nesta fase;
- o gráfico utiliza a coluna numérica principal do cenário;
- a validação visual automatizada por Chromium ficou indisponível no ambiente, portanto é necessária conferência final no GitHub Pages.

## Validação

A suíte completa passou: 13 aulas, 36 arquivos JavaScript, segurança, termos, PDFs, EduAuth, geradores, qualidade das questões, retomada, contas, laboratórios, currículo, avaliações empresariais e testes próprios do motor de planilha.

Cache: `desafio-informatica-agv-2.4.0-r21`.
