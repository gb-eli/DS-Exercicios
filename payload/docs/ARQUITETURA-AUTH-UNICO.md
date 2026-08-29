# Arquitetura de autenticação única — v14.10.8.59

`/auth/` é a única superfície oficial de entrada. `core/session/unified-auth-guard.js` protege páginas estáticas antes de seus runtimes. A sessão continua no storage oficial `sb-iresvqwyaqotghjssncg-auth-token` e é renovada pelos bridges existentes.

Fluxo: página protegida → guard → `/auth/?returnTo=...` → Supabase → validação de `profiles` → destino interno.

`returnTo` é limitado ao mesmo origin e ao base path do projeto. Client Secret, service_role e sb_secret não pertencem ao frontend.
