# Guia de implantação — F94.14

1. Aplicar o PATCH sobre **F94.13** ou usar o ZIP completo.
2. Publicar e aguardar o Service Worker `stage77-f9414-network-manager` assumir o Lobby.
3. Abrir o Lobby normalmente. Sem servidor Colyseus configurado, o modo esperado é **CONTINGENCY / Supabase**.
4. Abrir `?diag=1` e, no console técnico, consultar `globalThis.__agvNetworkManager?.getDiagnostics?.()`.
5. Confirmar:
   - `activeMode: "contingency"` quando Supabase Realtime está disponível;
   - `activeTransport: "supabase"`;
   - avatar de outro usuário continua atualizando;
   - veículo multiplayer continua aparecendo/atualizando;
   - interações continuam funcionando.
6. Simular perda do Supabase somente em ambiente de teste. O NetworkManager deve chegar ao modo **SOLO** sem derrubar o mundo.
7. Não configure ainda endpoint externo do Colyseus em produção. A F94.15 vai fornecer o servidor, o cliente vendorizado e o host WSS allowlistado.

## Diagnóstico útil

```js
__agvNetworkManager?.getDiagnostics?.()
```

Campos principais:
- `activeMode`
- `activeTransport`
- `transitionRevision`
- `failovers`
- `failbacks`
- `sent`
- `received`
- `droppedDuplicate`
- `droppedStale`
- `droppedScope`
- `transports`

## Rollback
Se houver qualquer regressão de rede, a F94.13 continua sendo o rollback integral. Mesmo dentro da F94.14, se o NetworkManager opcional falhar ao carregar, o código tenta automaticamente o realtime legado de avatar.
