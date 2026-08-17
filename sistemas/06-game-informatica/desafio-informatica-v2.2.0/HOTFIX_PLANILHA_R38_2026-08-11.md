# Hotfix da planilha — r38 — 11/08/2026

Esta revisão corrige comportamentos interativos e de cálculo encontrados após a flexibilização dos textos das atividades.

## Correções principais

- seleção por arraste;
- persistência da barra de fórmulas ao perder foco;
- renomeação do arquivo;
- aplicação real de fonte e tamanho;
- formatações alternáveis;
- alinhamento esquerda/centro/direita;
- proteção contra formatação numérica aplicada a texto;
- média/mínimo/máximo ignorando texto e vazio;
- fórmulas com decimal em vírgula no padrão pt-BR;
- ordenação natural e células vazias no final;
- seleção por cabeçalhos de linha e coluna;
- retorno visível para Ajuda e exportação simulada;
- revisão de cache r38 para impedir mistura de arquivos antigos e novos.

## Validação

A suíte completa `npm test` foi executada após as alterações e passou integralmente, incluindo planilha, documentos, e-mail, continuidade, responsividade, avaliações e armazenamento.
