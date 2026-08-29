# Deploy do backend — v14.10.8.55

O teletransporte individual funciona somente com os arquivos públicos do Lobby.

A ação **Trazer todos até mim** depende da Edge Function `lobby-presence` atualizada, sem qualquer migration ou alteração de schema.

## Supabase CLI

Na raiz do repositório, com o Supabase CLI autenticado:

```powershell
supabase functions deploy lobby-presence --project-ref iresvqwyaqotghjssncg
```

Depois publique o frontend normalmente no mesmo GitHub Pages.

## Smoke autenticado obrigatório

1. Entrar como professor/admin e como pelo menos um aluno em outro navegador/dispositivo.
2. Abrir `⚡ Teletransporte` no professor.
3. Teletransportar o professor para Praça, Vale e um destino no Vale.
4. Clicar `Trazer todos até mim`.
5. Confirmar que o aluno recebe o comando em poucos segundos e mantém o próprio modo 2D/3D.
6. Confirmar que usuário aluno não vê o controle de reunião.
7. Confirmar que token expirado ou alterado é rejeitado pela Edge Function.
