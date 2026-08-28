# Auditoria v0.1.42 — código fantasma, ordem e layout

## Causas confirmadas
1. `aluno.css` acumulava gerações sucessivas do Modo VS Code, com os mesmos seletores redefinidos por patches posteriores.
2. A v0.1.41 ainda migrava automaticamente estados antigos; código sintaticamente válido de um estado já contaminado podia reaparecer.
3. A troca de contexto não descartava imediatamente o conteúdo visual do iframe.
4. O cabeçalho usava glifos Unicode decorativos que podiam renderizar como caracteres estranhos.

## Correções
- patches pós-v0.1.37 removidos e substituídos por uma única camada v0.1.42;
- `state_v4` limpo, sem importação automática de respostas v2/v3;
- preview limpo em toda troca de disciplina/exercício/arquivo;
- hash do projeto associado ao iframe;
- glifos decorativos substituídos;
- paleta revisada para azul-grafite.

## Regra anti-fantasma
O preview da prática só usa o HTML/CSS/JS do estado v4 atual e o valor visível no editor corrente. O código de referência não é usado como fallback.
