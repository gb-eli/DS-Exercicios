# Atualizar para v14.10.8.59 — Unified Auth & Central Hub

Base do patch: **v14.10.8.58**.

## Mudanças principais

- login oficial único em `/auth/`;
- Google, e-mail/senha/CGM e recuperação na mesma tela;
- sessão única reaproveitada por todo o ecossistema;
- guard global com `returnTo` seguro;
- logins próprios das superfícies oficiais retirados do fluxo;
- plataformas antigas por turma removidas da navegação e redirecionadas à Plataforma Unificada;
- variantes históricas de CTF, Desafio, Planetário e Fliperama redirecionadas às versões oficiais;
- Lobby conectado às ferramentas reais por manifesto único 2D/3D;
- Banco e Loja integrados ao Hub e ao Lobby;
- nenhuma migration ou mudança de schema.

## Publicação segura

Aplique o patch somente sobre a base esperada. O aplicador verifica os hashes dos arquivos existentes antes de sobrescrever e aborta em caso de divergência. Nunca limpe a pasta do repositório.

Depois da aplicação:

```powershell
git status --short
git diff --name-status
```

Não publique se aparecer exclusão inesperada (`D`).

Execute também:

```powershell
node core/tools/validate-unified-auth-v59.mjs .
```

Antes da produção com Google, rotacione o Client Secret que apareceu em uma captura de tela e atualize o segredo apenas no Google/Supabase; nunca no frontend.
