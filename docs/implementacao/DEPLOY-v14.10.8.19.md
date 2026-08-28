# Deploy v14.10.8.19 — R4 auditada

Ordem segura de publicação:

1. Confirmar backup/estado atual do Supabase.
2. Aplicar `core/database/049_p10919_pedagogical_adaptations.sql`.
3. Aplicar `core/database/050_p10919_pedagogical_adaptations_r4.sql`.
4. Executar o seed privado nominal fora do GitHub; ele não contém diagnóstico, somente perfil pedagógico e turma.
5. Publicar as Edge Functions `staff-dashboard` e `supervision` a partir deste mesmo commit.
6. Publicar o frontend no GitHub Pages.
7. Testar solicitação de adaptação com conta sem perfil.
8. Testar perfil guiado/reforçado, troca de modo e persistência da escolha.
9. Testar sincronização das etapas concluídas em outro navegador/dispositivo.
10. Testar estudo domiciliar: sem exigência de fullscreen nem punição por troca de guia, preservando bloqueio de colagem, DevTools/entrada rápida conforme a política do exercício, sessão e autorização.
11. Testar recuperação de senha por e-mail do início ao fim.

O roster nominal e o seed privado não devem ser commitados no GitHub.
