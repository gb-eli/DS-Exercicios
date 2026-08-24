# Auditoria UX/UI Anti‑AI‑Slop — v14.10.8.13

## Base normativa

Esta revisão aplica o arquivo `PADRAO_MESTRE_FRONTEND_PROFISSIONAL_ANTI_AI_SLOP.md` como padrão de qualidade do frontend. A ordem de prioridade seguida foi: **função → fluxo → clareza → hierarquia → legibilidade → consistência → acessibilidade → responsividade → identidade → acabamento visual**.

A revisão preserva a identidade tech/dark já consolidada da Central e não altera APIs, autenticação, RLS, permissões, dados, regras de negócio, notas, arquivos dos alunos ou fluxos de backend.

## Diagnóstico

| Severidade | Problema encontrado | Impacto | Decisão | Estado |
|---|---|---|---|---|
| ALTO | Próxima atividade com orb decorativo, halo e composição promocional | Competia com contexto, progresso e CTA principal | Remover decoração e reduzir a superfície a contexto + progresso + ação | Corrigido |
| ALTO | Benefício/voucher de fim de semana com gradientes, shimmer, glow, estrelas/orbitais e pulsação | Parecia campanha/landing page e desviava atenção do estudo | Converter para aviso operacional compacto, sem efeitos gratuitos | Corrigido |
| ALTO | Sombras aplicadas de forma ampla em painéis | Criava elevação artificial e “card soup” visual | Remover sombra universal e reservar elevação a dialogs/superfícies sobrepostas | Corrigido |
| MÉDIO | Raios grandes e cartões com hover/lift em excesso | Aumentava aparência de template SaaS genérico | Consolidar raio principal em 14px e remover lift decorativo | Corrigido |
| MÉDIO | Gradientes usados em progresso/cards sem necessidade semântica | Cor deixava de comunicar função para virar decoração | Substituir por superfícies e preenchimentos sólidos | Corrigido |
| MÉDIO | Professor/Admin com fundo radial, login com sombra ornamental e halos de presença | Inconsistência com a natureza operacional dos consoles | Usar fundo sólido, reduzir ornamento e manter estados críticos sem animação gratuita | Corrigido |
| BAIXO / PRESERVADO | Grade técnica sutil no fundo do workspace | Faz parte da identidade existente e não compete com a tarefa | Preservar apenas as duas linhas de gradiente de 1px do grid | Mantido conscientemente |
| BAIXO / PRESERVADO | Pills de status, contadores e controles compactos | Possuem função semântica clara | Preservar | Mantido conscientemente |
| BAIXO / PRESERVADO | Sombra de dialogs e foco visível | Representa elevação real/acessibilidade | Preservar | Mantido conscientemente |

Não foi identificado problema **CRÍTICO** novo nesta fase após as correções de responsividade da v14.10.8.10.

## Decisões

### Mantido

- identidade cromática e tokens existentes;
- estrutura operacional do workspace;
- referência, editor, terminal/preview, autocorreção e progresso como núcleo da atividade;
- status chips e contadores quando ajudam leitura rápida;
- botão X circular do modal, por ser controle iconográfico universal;
- blur/topbar já existente quando funciona como separação de superfície;
- foco visível, estados semânticos e sombras de dialogs;
- grade técnica sutil do fundo, sem aumentar efeitos.

### Removido ou consolidado

- orb decorativo da próxima atividade;
- estrelas/orbitais, shimmer, glow e pulsos ornamentais do benefício de fim de semana;
- gradientes decorativos de cards e barras;
- sombra universal dos painéis;
- hover com elevação de cards de plataforma;
- fundos radiais dos consoles Professor/Admin;
- halo de presença e pulso infinito do alerta crítico;
- excesso de radius no nível global.

## UX

- A próxima atividade agora responde primeiro: **qual atividade é, qual o progresso e qual a ação principal**.
- O benefício de fim de semana deixou de competir com o exercício e passou a funcionar como aviso contextual.
- O voucher +1 mantém código, cópia, contador, fechamento e reabertura, mas com leitura de **transação**, não de promoção.
- A lista de vantagens foi convertida de mini-cards para lista semântica, reduzindo carga visual.
- Ações administrativas continuam separadas dos fluxos do aluno.

## UI

- `--radius-lg` consolidado em **14px**.
- `.panel` deixa de receber sombra universal.
- Cards de plataforma usam superfície sólida e não “saltam” no hover.
- Barras de progresso usam cor sólida com função semântica.
- Aviso de fim de semana usa `--bonus`, `--bonus-soft` e `--bonus-border`, sem gradiente/glow.
- Professor/Admin usam superfícies sólidas; dialogs continuam elevados.

## Responsividade

A revisão preservou as correções da v14.10.8.10. Evidências em `AUDITORIA-ANTI-AI-SLOP-EVIDENCIAS/` cobrem:

- 360px;
- 390px;
- 430px;
- 768px;
- 820px;
- 1024px;
- 1366px.

Resultados principais:

- sem overflow horizontal nos cenários auditados;
- touch target essencial de 44px mantido no mobile;
- workspace de tablet continua com largura útil ampliada;
- desktop preserva composição em múltiplas colunas;
- modal/voucher continua utilizável em celular sem deslocar o editor.

## Acessibilidade

- foco visível preservado;
- X do modal mantém label acessível;
- `prefers-reduced-motion` continua respeitado;
- status não dependem apenas de cor;
- contraste auditado em elementos críticos:
  - bônus `#e5b94f` sobre `#12120f`: ~**10,17:1**;
  - texto primário `#f2f4f7` sobre `#101216`: ~**17,0:1**;
  - texto auxiliar `#8a929f` sobre `#101216`: ~**5,98:1**;
  - valor do voucher `#f1d889` sobre `#0c0f12`: ~**13,66:1**;
  - accent `#4cc2ff` sobre `#101216`: ~**9,35:1**.

## Código e design system

- novos tokens de bônus reutilizam o sistema existente em vez de estilos isolados;
- redução de valores arbitrários de radius/sombra;
- apresentação do voucher consolidada em uma única seção de CSS;
- cache-busting reconciliado para `14.10.8.13`;
- UI identificada como `0.22.8.12`;
- release: `14.10.8.13` / fase `P10.9.12-ux-anti-ai-slop-refinement`;
- nenhum backend novo é exigido para este refino visual.

## Validação

- Node: **269/269 testes PASS**;
- frontend JS/MJS relevante: **33/33 syntax PASS**;
- JSON: **458/458 parse PASS**;
- IDs duplicados:
  - atividades: 0;
  - professor: 0;
  - admin: 0;
  - raiz: 0;
- privacidade: nenhum relatório privado identificável do legado GitHub incluído no bundle público.

## Pendências

1. Fazer validação física final em Safari/iOS e Chrome/Android, especialmente com teclado virtual aberto e aparelhos de menor desempenho.
2. O backend do voucher +1 continua **não ativado em produção**. Migration 047 e Edge Function permanecem condicionadas a backup restaurável confirmado.
3. Continuar usando o Padrão Mestre Anti‑AI‑Slop como gate obrigatório antes de novas telas/componentes.

## Conclusão

A v14.10.8.13 não tenta “modernizar” a Central. Ela reduz ruído e aproxima a interface do objetivo operacional: estudar, editar código, comparar referência, receber feedback e concluir atividades com baixa carga cognitiva. A identidade existente foi preservada; efeitos que não justificavam sua existência foram removidos.
