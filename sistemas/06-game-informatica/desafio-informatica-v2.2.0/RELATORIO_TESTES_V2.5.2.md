# Relatório de testes — v2.5.2

## Suíte automatizada

Comando executado: `npm test`.

Cobertura:

- 13 aulas e 41 arquivos JavaScript;
- segurança, termos, contas e armazenamento;
- 19 testes EduAuth;
- 6 testes do gerador do professor;
- 65 questões guiadas e 68 diagnósticas;
- retomada, tempo, conclusão, PDF e Classroom;
- planilha, documentos, Drive, Gmail e apresentações;
- avaliações e recuperações;
- integridade de arquivos empresariais;
- teste novo de UX e coerência.

## Teste novo de UX/coerência

Valida automaticamente:

- preservação das Aulas 1–3 do 1º ADM;
- briefing inicial nas atividades revisadas;
- layout como primeira ação das apresentações;
- existência real do PDF pedido no e-mail;
- diferença entre avaliação e recuperação do 2º ADM;
- botão visível de fechar o gráfico;
- responsividade do Google Apresentações;
- tutorial e identificação específicos;
- gráfico como exploração neutra.

## Validação visual

Foram renderizados componentes reais com o CSS da versão:

- `v252-slides-mobile.png` — 390 × 844;
- `v252-slides-desktop.png` — 1366 × 900;
- `v252-chart-mobile.png` — 390 × 844.

Em 390 px, `documentElement.scrollWidth` permaneceu igual a 390 px.
