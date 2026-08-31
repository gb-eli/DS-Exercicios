# Correções — Etapa 9 · UX anti-AI-slop

Escopo isolado: reduzir decoração artificial nas superfícies principais sem alterar regras pedagógicas, autenticação, banco ou fluxos funcionais.

## Alterações funcionais/visuais

- Central do aluno: removidos gradientes decorativos da faixa superior, numeração de atividades, resumo de pendências e experiências personalizadas. Cor continua sendo usada como acento semântico por borda/fundo plano.
- Professor: `teacher-command-center` deixou de usar `radial-gradient`; passou a usar superfície plana com borda lateral de acento.
- Admin: atalhos de gestão, navegação de prova e hero pedagógico deixaram de usar gradientes decorativos; hover não desloca mais cards verticalmente.
- Experiências personalizadas: temas continuam diferenciados por acento, borda e componentes, sem fundo multicolorido universal.

## Contratos reconciliados

- Teste anti-AI da Prova passa a validar o carregamento opcional do avatar rigged no módulo atual `characters/avatar-system.js` e na release 14.10.8.65.
- Texto pedagógico do aluno é validado no HTML + renderização dinâmica de `student.js`, evitando duplicação estática de conteúdo.

## Validação

- UX anti-AI focado: 12/12 PASS.
- Cinco validadores oficiais da release: PASS.
- Suíte geral: 359/368 PASS.
- 9 falhas remanescentes pertencem a outros blocos (supervisão, roster, suporte, GitHub, mobile e rotas legadas).

Nenhuma migration, Edge Function ou alteração de banco foi criada nesta etapa.
