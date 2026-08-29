# v14.10.8.58 — OAuth visível no Front

Hotfix cumulativo sobre a v14.10.8.57.

- Botão **Continuar com Google** visível no Hub.
- Botão **Continuar com Google** visível também no login direto do Lobby.
- Login tradicional por e-mail/senha/CGM preservado.
- OAuth usa o provider Google já habilitado no Supabase.
- Redirect volta para a própria superfície (Hub ou Lobby).
- Sem migrations, sem schema novo e sem Client Secret no frontend.

Importante: o botão só aparecerá no GitHub Pages depois de aplicar este patch e publicar a main.
