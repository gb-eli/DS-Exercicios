# Validação do pacote — v14.7 / P7.8

Data: 15/08/2026

- Suíte completa: 72/72 testes aprovados.
- Botão de revogação permanece `disabled` no HTML.
- Configuração usa `authSessionRevocationReady: auto`.
- Admin faz probe autenticado em `admin-auth-sessions/status`.
- Backend só confirma pronto após live-session guard e RPC de revogação responderem.
- Falha/ausência do backend mantém botão desabilitado.
- Deploy Supabase live: NÃO executado nesta sessão (conector indisponível).
- Nenhum arquivo removido nesta versão.
