# Fase 2 — auditoria de responsividade, UX e acessibilidade — v2.5.4

## Escopo

Auditoria dos componentes compartilhados da versão 2.5.3, sem alteração pedagógica das Aulas 1, 2 e 3 do 1º ADM.

Foram revisados:

- modais gerais e painel do professor;
- navegação das etapas;
- planilha, menus, filtros, compartilhamento e gráfico;
- correio empresarial, composição e seletor de arquivos;
- Drive, documentos, PDF e apresentações;
- safe areas, paisagem, teclado e movimento reduzido.

## Problemas encontrados

1. Modais não possuíam uma política central de Escape, foco preso e retorno ao botão acionador.
2. Em telas estreitas, a lista vertical de etapas podia empurrar a atividade muito para baixo.
3. Menus e diálogos internos da planilha podiam escapar da viewport.
4. O gráfico podia ocupar a ferramenta de modo desconfortável no celular.
5. Composição e seletor do correio não estavam identificados uniformemente como diálogos acessíveis.
6. A área de texto do correio podia herdar fundo escuro em determinados temas.
7. Safe areas e altura dinâmica não estavam aplicadas de forma uniforme.

## Correções

- gerenciador central de modais;
- fechamento por Escape;
- ciclo de Tab dentro da janela;
- retorno do foco ao acionador;
- bloqueio da rolagem do fundo;
- navegação horizontal das etapas no celular;
- empilhamento de compartilhamento e permissões;
- gráfico móvel em painel inferior contido;
- popovers da planilha limitados à área disponível;
- composição e seletor do correio com papéis de diálogo;
- `100dvh`, safe areas e orientação paisagem;
- movimento reduzido respeitado.

## Renderização sintética

Os componentes reais e o CSS final foram renderizados em memória pelo Chromium nas larguras:

- 320 × 568;
- 390 × 844;
- 768 × 1024;
- 1366 × 768.

Em todas as larguras, `documentElement.scrollWidth` permaneceu igual à largura da viewport, sem overflow horizontal da página.

A lista de etapas passa a ter rolagem própria em telas pequenas. Os controles compactos abaixo de 32 px encontrados no cenário de auditoria correspondem a cabeçalhos de linhas/colunas e ícones de toolbar; ações principais e controles de modais foram ampliados.

## Limitação

O Chromium administrado bloqueia navegação em `localhost` e `file://`. A auditoria visual utilizou `page.set_content()` com o CSS e estruturas reais dos componentes, além dos testes estáticos e funcionais do projeto.
