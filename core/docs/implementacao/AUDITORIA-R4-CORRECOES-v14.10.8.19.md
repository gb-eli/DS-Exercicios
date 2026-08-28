# Auditoria R4 — correções pós-auditoria das acomodações

A R4 corrige os pontos levantados na auditoria da R3 sem alterar o roster público nem expor nomes no frontend.

- Estudo domiciliar flexibiliza apenas fullscreen/troca de foco; bloqueio de colagem, DevTools e entrada rápida permanecem conforme a política do exercício.
- O backend reaplica a política efetiva de acomodação também ao processar eventos.
- Troca de guia em estudo domiciliar não incrementa `focus_violation_count` nem `suspicious_score`.
- Progresso das etapas adaptadas pode ser sincronizado por aluno/exercício/perfil com RLS individual.
- Roteiro domiciliar aproveita `arquivo`, `linhas`, `porQue`, `resultadoEsperado`, `alerta`, `detalhes` e `partes` quando esses metadados existem.
- Ajuda de código usa pistas progressivas e não entrega solução pronta.
- Presets criados pelo Professor/Admin após solicitação recebem o conjunto completo de recursos de ajuda.
- Seed privado limita a atualização de presets aos tipos `learning_mode`/`adapted_mode`.
