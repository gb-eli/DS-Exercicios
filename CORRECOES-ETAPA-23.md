# Correções — Etapa 23

## Supervisão histórica — saídas registradas sem bloqueio automático

Data: 31/08/2026

### Escopo

Esta etapa ficou restrita à falha histórica de supervisão P10.1. Não altera roster, Central de Apoio, rotas legadas, banco, migrations ou Edge Functions.

### Diagnóstico

A implementação atual já preservava a regra correta: `visibility_hidden` e `fullscreen_exit` são registrados, contabilizados e podem gerar alerta, mas o ramo `event` retorna explicitamente `locked:false` e não promove automaticamente `student_exercises` ou `activity_sessions` para estado bloqueado.

A falha vinha de um contrato antigo que exigia a expressão exata `const focusAlert=focus>=...`. Desde a integração das adaptações pedagógicas, a lógica atual usa `ignoredFocus` para perfis `home_study`/`relaxed`, produzindo `const focusAlert=!ignoredFocus&&focus>=...`. O teste antigo passou a classificar a melhoria como regressão.

### Correções aplicadas

- contrato P10.1 atualizado para a lógica de supervisão adaptativa atual;
- teste agora isola especificamente o ramo `action==='event'`;
- valida que `ignoredFocus` impede contagem/alerta nos perfis que precisam dessa flexibilização;
- valida que o limiar padrão continua em 3 saídas para alerta;
- valida explicitamente `locked:false` na resposta do evento;
- reprova `security_locked:true`, `status:'blocked'` ou `locked:true` dentro do ramo de evento;
- preservada a mensagem da UI: saídas são registradas, mas não bloqueiam automaticamente a atividade;
- bloqueios manuais ou de outras causas de segurança continuam possíveis e não foram enfraquecidos.

### Validação

- P10.1 + P10.6 focados: 11/11 PASS;
- cinco validadores oficiais: PASS;
- suíte completa: 372/376 PASS;
- falha histórica de supervisão eliminada;
- quatro falhas restantes: roster público, Central de Apoio e duas rotas legadas.

### Banco / backend

Nenhuma migration, Edge Function ou escrita de produção foi aplicada nesta etapa. O backend de supervisão não precisou ser modificado porque o comportamento atual já estava correto.
