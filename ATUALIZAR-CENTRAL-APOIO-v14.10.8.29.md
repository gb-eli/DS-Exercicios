# Atualização — Central de Apoio v14.10.8.29

## O que foi implementado

- Central privada aluno–professor para dúvida, pedido de ajuda, sugestão e registro de erro.
- Respostas assíncronas: a mensagem continua disponível quando aluno ou professor está offline.
- Painel `Mensagens` para Professor/Admin, com busca, filtros, fila de atendimento e encerramento de conversas.
- Incentivos, parabéns, orientações e lembretes enviados pelo professor como avisos visuais.
- Preferência do aluno por experiência mais simples, guiada, autônoma ou desafiadora.
- Lembrete gentil de foco configurável por perfil, inclusive a cada 5 minutos.
- Check-ins `estou aqui`, `preciso de ajuda` e `vou pausar`, sem punição, bloqueio, nota ou XP.
- Checkpoint visual após 30 minutos de estudo. Ele não altera a economia da plataforma.

## Privacidade e segurança

- O bundle não contém nomes, e-mails, laudos ou diagnósticos de alunos.
- As tabelas públicas usam RLS; o aluno só lê sua própria conversa, seus check-ins e suas notificações.
- Respostas do professor passam pela Edge Function `staff-dashboard`, que valida papel, sessão ativa e turma atribuída.
- Conversa entre estudantes permanece desativada. Ela só deve ser criada futuramente com moderação, autorização e regras de convivência explícitas.
- O lembrete de foco é apoio pedagógico, nunca evidência disciplinar.

## Ordem de publicação

1. Fazer backup verificável do Supabase.
2. Aplicar `core/database/058_p10929_student_support_hub.sql`.
3. Confirmar que as quatro novas tabelas estão acessíveis pela Data API para `authenticated`; a migration já inclui `GRANT` e RLS.
4. Implantar a Edge Function atualizada `staff-dashboard`.
5. Publicar o bundle web completo, incluindo `support-hub.js`, `admin-support.js` e `support-hub.css`.
6. Limpar cache/CDN ou confirmar que o navegador carregou `app.js?v=14.10.8.29`.

## Configurar um perfil com check-in a cada 5 minutos

No painel Professor, abra `Experiências`, selecione o aluno, escolha `A cada 5 minutos` em **Lembrete gentil de foco** e salve. A configuração fica dentro de `student_accommodations.config.supervision`:

```json
{
  "focus_check_enabled": true,
  "focus_check_interval_minutes": 5
}
```

Para uma mensagem de acolhimento própria do estudo domiciliar, mantenha o texto no cadastro privado do perfil em `config.personalization.teacher_message`; não grave nomes ou informações clínicas no GitHub.

## Smoke test

1. Como aluno, abrir `Apoio e mensagens`, escolher cada categoria e enviar uma mensagem.
2. Confirmar que outro aluno não consegue selecionar a conversa via Data API.
3. Como professor da turma, abrir `Mensagens`, responder e confirmar a resposta no aluno em até 30 segundos ou após `Atualizar`.
4. Confirmar que professor sem vínculo com a turma recebe `403` ao responder.
5. Enviar um aviso `Parabéns` e confirmar que ele aparece ao aluno sem conceder XP ou nota.
6. Configurar check-in em 5 minutos, manter a aba visível e testar as três respostas.
7. Confirmar que `Preciso de ajuda` abre a Central de Apoio.
8. Recarregar a página e confirmar que mensagens e preferência de dificuldade permanecem.

## Observação de deploy

Este pacote é uma release candidate local. Nenhuma migration foi aplicada e nenhuma Edge Function foi implantada no projeto Supabase ao gerar o ZIP.
