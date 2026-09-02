# Implantação — F94.5.1 Hotfix Boot/Auditoria

## Base
Aplicar sobre a F94.5 publicada.

## Objetivo
Corrigir a regressão que pode deixar o Lobby preso em **“Redirecionando para o login único…”** depois da introdução da auditoria executável dos mundos.

## Procedimento recomendado
1. Substitua os arquivos do PATCH preservando as pastas.
2. Publique todos os arquivos do patch na mesma atualização; não publique apenas `lobby.js`.
3. Aguarde o GitHub Pages/CDN concluir a publicação.
4. Reabra o Lobby em nova aba.
5. Se houver Service Worker antigo controlando a página, faça uma atualização forçada uma vez. O cache-bust novo é `stage67-f9451-audit-safe`.
6. Confirme que o Lobby abre normalmente antes de usar `?worldaudit=1&diag=1`.
7. Depois, valide a auditoria dos 18 mundos.

## Comportamento esperado
- a auditoria dos mundos pode falhar sem impedir login ou abertura do Lobby;
- ausência do módulo de auditoria gera warning, não tela fatal;
- apenas falha real de sessão redireciona para `/auth/`;
- falha depois de uma sessão válida permanece na tela e mostra o código em `login-message`/Diagnóstico Técnico;
- F94.5 continua disponível quando o módulo de auditoria carrega.

## Backend
Nenhuma migration, Edge Function ou alteração de Supabase é necessária para este hotfix.
