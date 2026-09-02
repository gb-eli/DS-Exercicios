# F94.5.1 — Hotfix de Boot da Auditoria dos Mundos

## Problema observado
Após a F94.5, o Lobby podia permanecer na tela **“Redirecionando para o login único…”** quando a camada nova de auditoria não carregava ou falhava antes da restauração da sessão.

## Causa arquitetural
A F94.5 tornou `world-runtime-audit.js` dependência estática e crítica de `lobby.js`, `world-manager.js`, `world-adapter.js`, do gate de `boot.js` e do `CRITICAL_SHELL` do Service Worker. Uma ferramenta de diagnóstico não deve ser capaz de impedir autenticação ou abertura do jogo.

## Correção
- auditoria passou a ser **opcional e lazy**;
- `world-manager` e `world-adapter` usam bridge global tolerante a ausência;
- falha no módulo de auditoria gera warning/diagnóstico, nunca bloqueio do Lobby;
- `world-runtime-audit.js` saiu do gate crítico do boot e do precache crítico do Service Worker;
- cache-bust atualizado para `stage67-f9451-audit-safe`;
- a mensagem de boot/login ganhou `id=login-message`, permitindo mostrar o código real de falhas futuras;
- funcionalidade F94.5 continua disponível quando o módulo opcional carrega.

## Regra
**Observabilidade nunca pode ser dependência crítica do caminho de autenticação ou do primeiro frame.**

## Separação entre autenticação e boot
O fluxo anterior colocava `getSession()` e `boot()` no mesmo `try/catch`. Assim, qualquer falha do runtime após uma sessão válida podia ser tratada como falha de sessão e provocar redirecionamento ao login. A F94.5.1 separa os dois estágios: somente ausência/falha real de sessão redireciona; falha pós-autenticação permanece no Lobby e exibe o código técnico.
