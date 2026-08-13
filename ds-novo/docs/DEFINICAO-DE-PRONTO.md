# Definição de pronto

Uma plataforma só é considerada migrada quando:

- [ ] usa login central;
- [ ] não mantém senha paralela como autoridade;
- [ ] recebe `user_id` central;
- [ ] reporta progresso com `platform_id` e `activity_id` estáveis;
- [ ] XP/pontos oficiais aparecem no Core;
- [ ] saldo mostrado vem do Core;
- [ ] não grava moeda oficial localmente;
- [ ] loja abre o catálogo central;
- [ ] inventário é central;
- [ ] extrato é o global;
- [ ] transferência P2P funciona com preview + confirmação;
- [ ] marketplace respeita propriedade e atomicidade;
- [ ] admin enxerga dados da plataforma;
- [ ] retry não duplica eventos;
- [ ] testes de regressão da plataforma passam;
- [ ] não há secret/service key no frontend;
- [ ] RLS/permissions foram revisadas;
- [ ] documentação e versão de integração foram atualizadas.


## Critério adicional — Modo Professor

Quando a plataforma possui gabarito/solução docente:

- [ ] o conteúdo Professor não existe no bundle do aluno;
- [ ] `anon` e aluno autenticado não conseguem consultar a referência diretamente;
- [ ] professor comum só vê alunos das turmas atribuídas;
- [ ] admin/super_admin possuem escopo global auditável;
- [ ] a atividade do aluno e o gabarito usam o mesmo `platform_id/activity_id`;
- [ ] respostas abertas usam rubrica/resposta-modelo em vez de comparação literal;
- [ ] a interface mostra solução, explicação, rubrica e dicas sem modificar automaticamente o trabalho do aluno.
