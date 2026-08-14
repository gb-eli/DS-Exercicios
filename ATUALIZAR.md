# ATUALIZAÇÃO v11.5 → v11.5.1 / P5.1.1

## Motivo
Hotfix para o Lobby 3D que não inicializava no navegador.

A v11.5 tinha uma Content Security Policy com `script-src 'self'`, mas `lobby/assets/supabase.js` usa o SDK Supabase fixado em `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.111.0/+esm`. O navegador bloqueava o módulo antes do login.

## Como atualizar no GitHub
1. Confirme que seu repositório está na v11.5.
2. Abra a pasta `AGV-ECOSSISTEMA-UNIFICADO/` deste ZIP.
3. Copie seu conteúdo sobre a raiz equivalente do repositório.
4. Substitua os arquivos quando solicitado.
5. Faça commit/push e aguarde o GitHub Pages publicar.
6. No navegador, faça recarregamento forçado/limpe o cache do site se a versão antiga continuar aparecendo.

## Banco/Supabase
Nenhuma alteração de banco, RLS, migration ou Edge Function é necessária neste hotfix.

## Exclusões
Nenhum arquivo precisa ser apagado.

## O que muda
- CSP passa a permitir somente `self` + `https://cdn.jsdelivr.net` para scripts.
- SDK Supabase continua fixado em `2.111.0`.
- Novo `lobby/assets/boot.js` captura falha de módulo e mostra mensagem visível.
- Lobby passa para `0.3.2`.
