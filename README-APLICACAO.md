# PATCH v14.10.8.55 — Teletransporte Global + Reunião da Turma

Base esperada: **v14.10.8.54**.

## O que entra
- botão permanente `⚡ Teletransporte`;
- Praça, laboratórios, atrações, Vale, 8 distritos e 27 empresas como destinos;
- botão destacado `Ir para o Vale`;
- equipe: `Trazer todos até mim`;
- comando coletivo assinado no servidor e validado antes de ser obedecido;
- modo 2D/3D de cada usuário é preservado;
- nenhuma migration/schema.

## Aplicação
```powershell
.\APLICAR-v14.10.8.55-TELETRANSPORTE.ps1 -Repo "C:\caminho\DS-Exercicios"
.\VALIDAR-v14.10.8.55.ps1 -Repo "C:\caminho\DS-Exercicios"
```

Antes de usar `Trazer todos até mim`, publique a Edge Function `lobby-presence` atualizada. Consulte `payload/docs/DEPLOY-BACKEND-v14.10.8.55.md`.
