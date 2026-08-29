# Relatório de implementação — v2.5.5

## Objetivo

Concluir a Fase 3 de validação, verificando coerência pedagógica, lógica das atividades e simulação dos percursos de aluno sem reformular as Aulas 1, 2 e 3 do 1º ADM.

## Implementações

- gráficos das apresentações passaram a utilizar `chartTitle`, `chartData`, `bulletItems` e `speakerNotes` específicos de cada aula;
- o renderizador calcula proporcionalmente a altura das barras e apresenta categorias reais do cenário;
- instruções de filtros das avaliações foram desambiguadas;
- fórmulas que usam todas as linhas após um filtro passaram a indicar “base completa”;
- validação de e-mail ganhou variantes profissionais controladas;
- saudações e encerramentos continuam obrigatórios quando previstos, mas aceitam formulações equivalentes;
- ajuda da planilha em avaliação/recuperação deixou de indicar o valor exato ou a permissão correta;
- criado teste automatizado de coerência pedagógica aula por aula;
- versão, cache e manifestos atualizados para 2.5.5 / r35.

## Compatibilidade preservada

- conteúdos das Aulas 1, 2 e 3 do 1º ADM;
- perfis e progresso existentes;
- checkpoints e retomada;
- senha fixa de aula;
- código coletivo de liberação;
- tempo mínimo e liberação do PDF;
- Classroom e comprovantes;
- planilha, Drive, documentos e Gmail;
- painel do professor.

## Arquivos funcionais principais alterados

- `assets/js/app.js`
- `assets/js/data.js`
- `assets/js/email-engine.js`
- `tests/pedagogical-flow.test.mjs`
- `tests/ux-coherence.test.mjs`
- arquivos de versão, cache e documentação.

## Resultado

A suíte completa foi aprovada e o projeto foi validado em subpasta HTTP equivalente à publicação no GitHub Pages.
