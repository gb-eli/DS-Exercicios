# Deploy de backend — v14.10.8.56

A v14.10.8.56 **não altera schema, tabelas, colunas, constraints ou migrations**.

A Edge Function `lobby-presence` foi ampliada para manter o teletransporte coletivo da v55 e adicionar chat por proximidade autenticado.

## Publicar

```powershell
supabase functions deploy lobby-presence --project-ref iresvqwyaqotghjssncg
```

## Smoke autenticado obrigatório após o deploy
1. Entrar com dois usuários no Lobby.
2. Aproximar os avatares e abrir `Conversar`.
3. Enviar uma mensagem curta e confirmar balão apenas para o destinatário.
4. Afastar os avatares e confirmar que o servidor recusa envio por proximidade insuficiente.
5. Com professor/admin, testar `⚡ Teletransporte` e `Trazer todos até mim`.
6. Confirmar que comandos expirados/forjados são ignorados.

Não é necessário executar SQL.
