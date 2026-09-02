# Contexto de continuidade — F94.5.1

- Base: F94.5 Auditoria Executável dos Mapas.
- Hotfix: F94.5.1 Boot/Audit Safe.
- F95 continua suspensa.
- A auditoria executável permanece, mas não é mais dependência crítica do boot/login.
- `world-runtime-audit.js` é carregado de forma lazy/opcional.
- `world-manager.js` e `world-adapter.js` funcionam mesmo sem a auditoria.
- Autenticação e falhas de runtime foram separadas: uma sessão válida não deve voltar ao login por erro do mapa/runtime.
- Cache chain: `stage67-f9451-audit-safe`.
- Próxima ação depois da publicação: confirmar Lobby, abrir `?worldaudit=1&diag=1`, visitar mundos e exportar JSON.
