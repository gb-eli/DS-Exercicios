# AUDITORIA DE RESPONSIVIDADE, ESTABILIDADE E UX — MOBILE/TABLET

**Release:** v14.10.8.10  
**Data:** 22/08/2026  
**Fase:** P10.9.9-mobile-tablet-responsiveness  
**Escopo:** ambiente de atividades do aluno — celular, tablet e regressão de desktop.

## Objetivo

Investigar reclamações de travamento, elementos fora do lugar e dificuldade de uso em celulares/tablets e aplicar correções cumulativas sem alterar notas, arquivos de alunos ou banco de produção.

## Evidências reproduzidas

Foram usados o HTML/CSS/JS reais do pacote em ambiente Chromium/Playwright isolado e larguras de 360, 390, 430, 768, 820, 1024 e 1366 px. As capturas e métricas ficam em `AUDITORIA-MOBILE-TABLET-EVIDENCIAS/`.

### Antes → depois

| Cenário | Problema anterior | Resultado v14.10.8.10 |
| --- | --- | --- |
| 360 px | viewport/layout interno expandia para ~793 px | 360 px reais, sem expansão horizontal |
| 390 px | viewport/layout interno expandia para ~793 px | 390 px reais |
| 430 px | viewport/layout interno expandia para ~794 px | 430 px reais |
| Tablet 768 px | workspace/editor com 488 px úteis | 728 px úteis (+240 px / ~49%) |
| Tablet 820 px | workspace/editor com 540 px úteis | 780 px úteis (+240 px / ~44%) |
| Desktop 1024 px | workspace 744 px | 744 px (preservado) |
| Desktop 1366 px | workspace 528 px | 528 px (preservado) |

No telefone de 360 px, a barra superior caiu de 145 px para 105 px; a barra utilitária do workspace caiu de 352 px para 241 px. O alvo touch mínimo auditado passou a 44 px no cenário móvel.

## Causas encontradas

1. **Min-content de código/referência longa** podia impor largura mínima maior que o aparelho. `overflow-x:hidden` escondia o sintoma, mas não eliminava a largura interna errada.
2. **Layout de tablet** ainda mantinha coluna lateral fixa (~230 px), deixando o editor comprimido.
3. **Densidade excessiva de controles** em telas pequenas aumentava altura e quantidade de scrolls.
4. **Caminho de digitação caro:** em cada tecla podiam ocorrer seleção de referência, similaridade, destaque, gutter, ajuda de fim de semana e supervisão em sequência.
5. **Teclado virtual/touch:** fonte pequena do editor favorecia zoom involuntário em Safari/iOS; paleta de símbolos usava altura pouco adaptativa ao teclado virtual.

## Correções aplicadas

- containers críticos recebem `min-width:0` / limites de largura para impedir expansão por código longo;
- até 900 px o layout principal é empilhado e o editor recupera a largura da antiga sidebar;
- ações mobile reorganizadas em grade mais compacta;
- alvos essenciais de touch com 44 px;
- fonte mínima de 16 px no editor em contexto touch;
- abas com rolagem horizontal touch controlada;
- painel de símbolos usa `dvh`, `overscroll-behavior: contain` e rolagem interna;
- cache de correspondência de referência;
- atualização de referência e ajuda de fim de semana com debounce;
- gutter só é reconstruído quando sua assinatura muda;
- highlight leve para arquivos grandes em touch;
- snapshots de supervisão ficam menos agressivos em telas restritas.

## Responsabilidade e UX

- nenhuma correção muda nota, `submitted_score`, claim, status, `student_files` ou histórico;
- o código do aluno nunca é substituído automaticamente;
- o desktop foi mantido nos cenários auditados;
- o modo de fim de semana continua opcional e independente das correções de responsividade;
- a auditoria prioriza manter editor e referência utilizáveis sem esconder recursos essenciais.

## Validação automatizada

- Node: **253/253 testes aprovados**;
- JS/MJS: **856/856** válidos em `node --check`;
- JSON: **455/455** parseados;
- IDs duplicados em `atividades/index.html`: **0**;
- teste dedicado: `core/tests/p1099-mobile-tablet-responsiveness-v14.10.8.10.test.mjs`.

## Limitação conhecida

A validação visual foi feita com Chromium/Playwright em ambiente isolado. Este ambiente não permitiu executar um fluxo autenticado completo conectado ao Supabase em aparelhos físicos. Portanto ainda é recomendada uma rodada final em **Android/Chrome** e **iPhone/iPad/Safari**, especialmente com teclado virtual aberto, antes de declarar encerrados bugs específicos de navegador/hardware.

## Critério para novos relatos

Quando um aluno relatar novo problema mobile/tablet, registrar: aparelho/modelo, navegador, largura/orientação, exercício, ação que estava fazendo e screenshot. Isso permite transformar relatos genéricos de “travou” em casos reproduzíveis.
