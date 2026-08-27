# Supabase JS — slot local do Lobby

Este diretório é a primeira fonte do loader do Lobby.

- Versão CDN pinada nesta release: `@supabase/supabase-js 2.112.3`.
- `supabase.js` ainda é apenas um placeholder; **não é** o bundle UMD oficial completo.
- O Lobby registra `lobby/sw.js`, que armazena a resposta do SDK após a primeira carga bem-sucedida para aumentar a resiliência em acessos posteriores.
- Quando o bundle UMD oficial for incorporado, substituir `supabase.js` pelo arquivo oficial e manter a licença MIT/upstream documentados.

Upstream: https://github.com/supabase/supabase-js
