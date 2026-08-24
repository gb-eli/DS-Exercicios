# AUDITORIA — MODO FINAL DE SEMANA v14.10.8.9

Data: 22/08/2026  
Fuso operacional: `America/Sao_Paulo`

## Regra implementada

- O benefício é elegível aos sábados e domingos.
- Início: sábado às 00:00 no horário de Brasília/São Paulo.
- Encerramento rígido: domingo às 18:00.
- No fim de semana de 22–23/08/2026, o cutoff é `2026-08-23 18:00:00 -03:00`.
- Ao chegar ao cutoff com a página aberta, o timer desativa automaticamente a ajuda.
- Fora da janela, banner, diagnóstico extra e destaque de linha não são exibidos.

## Experiência do aluno

1. Ao abrir uma atividade durante a janela, aparece a notificação:
   **“Parabéns por estar estudando no final de semana!”**
2. O topo da atividade mostra uma faixa animada **Modo Final de Semana ativo**.
3. Há contador regressivo até domingo às 18:00.
4. O aluno pode **Desativar ajuda extra** e reativar depois, enquanto o período estiver válido.
5. A preferência vale somente para aquele usuário/navegador e para o fim de semana corrente.

## Ajuda extra

O modo adiciona orientação pedagógica incremental, sem preencher o editor:

- identifica arquivo ausente/vazio;
- detecta `src`/`href` que aponta para arquivo inexistente;
- detecta IDs procurados pelo JavaScript que não existem no HTML;
- identifica desequilíbrio simples de parênteses, chaves e colchetes quando a sintaxe falha;
- compara estruturas relevantes da linguagem com a referência mais compatível;
- aponta a primeira região/linha que merece revisão;
- destaca essa linha no gutter e no editor;
- gera passo a passo curto e encerra orientando nova autocorreção.

A análise local usa a referência já autorizada ao aluno e os dados da autocorreção existentes. Não copia a referência para `student_files`, não faz autocomplete e não substitui conteúdo digitado.

## Privacidade e segurança

- Não cria nova tabela.
- Não exige migration.
- Não exige Edge Function nova.
- Não altera nota, `submitted_score`, `auto_score`, status, claims ou histórico.
- Estado de ativação/desativação fica em `localStorage` com chave por aluno + fim de semana.
- A notificação é registrada como vista somente localmente.
- `prefers-reduced-motion` desativa as animações decorativas para acessibilidade.

## Cache/runtime

Como o workspace do aluno mudou, o cache-busting público foi atualizado para `14.10.8.9`, incluindo os entrypoints críticos, evitando mistura com JS/CSS anteriores.

## Testes

- Node test suite: **244/244 PASS**.
- JS/MJS `node --check`: **855/855 PASS**.
- JSON parse: **452/452 PASS**.
- IDs do `atividades/index.html`: **152**, sem duplicidades.
- Testes específicos do modo:
  - sábado elegível;
  - domingo 17:59:59 elegível;
  - domingo 18:00:00 encerrado;
  - segunda-feira indisponível;
  - contador/notificação/toggle presentes;
  - ID DOM desconectado localizado;
  - arquivo referenciado inexistente localizado;
  - linha destacada;
  - ausência de preenchimento automático do código.

## Produção

Nenhuma escrita em produção foi executada nesta implementação. O pacote permanece candidato para publicação do frontend.
