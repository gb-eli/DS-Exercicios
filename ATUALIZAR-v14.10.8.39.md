# v14.10.8.39 — Lobby 3D + revisão anti-AI do Modo Prova

## Lobby 3D
- O módulo opcional `rigged-avatar.js` deixa de ser import estático do grafo principal.
- Falha de parse/import do avatar rigado não derruba mais `lobby.js`; o Campus usa avatar procedural como fallback.
- `boot.js` verifica o asset opcional e registra diagnóstico sem transformar a falha em erro fatal.
- Release sincronizada em `14.10.8.39`.

## Modo Prova
- Ranking não declara vencedores quando todos estão em zero.
- Pré-lobby expirado mostra `Aguardando professor`, não `00:00`.
- KPIs operacionais substituem cartões redundantes de “melhor equipe/aluno”.
- Equipes e integrantes ganharam hierarquia mais legível e ação contextual de liderança.
- Configuração da sessão fica recolhida por padrão.
- Linguagem pública passa de guilda/squad/matchmaking para equipe/empresa/avaliação.
- Simulador carrega a sessão real da turma por `staff_overview`; não inventa alunos, empresas, votos ou ranking quando não existem dados reais.
- Sem sessão ativa, a prévia informa isso explicitamente em vez de montar equipes fictícias.
- Intro gamer falsa, ping acadêmico, matchmaking fictício e marcas inventadas foram removidos da experiência principal.
- CSS recebeu camada anti-card-soup, sem gradientes/glows gratuitos e com raios/sombras mais contidos.
- O cabeçalho da prévia foi simplificado para contexto da avaliação, equipe, função e estado; o antigo HUD gamer deixou de ser a superfície principal.
- Linguagem visível foi normalizada para atividade, função, equipe, entrega e confirmação.

## Banco
Nenhuma migration. Nenhuma senha, equipe ou sessão é alterada por este hotfix.
