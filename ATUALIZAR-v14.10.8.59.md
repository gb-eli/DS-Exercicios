# v14.10.8.59 — Unified Auth & Central Hub

Base: v14.10.8.58.

## Autenticação
- Login oficial único: `/auth/`.
- E-mail/senha/CGM, Google e esqueci senha no mesmo lugar.
- `returnTo` aceita somente destinos internos do próprio Pages.
- Hub, Lobby, Professor, Admin, Prova e Recuperação passam pelo mesmo guard de sessão.
- Ferramentas oficiais recebem o guard antes do runtime.

## Plataforma unificada
- Cards antigos DS1/DS2/DS3/Sub não aparecem mais no catálogo.
- URLs antigas continuam existindo, mas redirecionam à Plataforma Unificada.

## Lobby centralizador
- Prédios conectados a Plataforma Unificada, Lab Virtual, CTF, COSMOS, Desafio DS, Fliperama, Desafio Informática, Centro de Provas, Banco e Loja.
- 2D e 3D compartilham o mesmo manifesto de destinos.
- Vale, teletransporte, monotrilho, torre e atrações anteriores são preservados.

## Economia
- Nova superfície `/economia/` consulta carteira, extrato, catálogo e inventário oficiais via sessão do usuário.
- Nenhuma alteração de saldo é feita no cliente.

## Banco de dados
Nenhuma migration ou alteração de schema nesta release.
