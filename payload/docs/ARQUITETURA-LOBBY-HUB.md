# Lobby como Central Hub — v14.10.8.59

O manifesto `lobby/assets/world/campus-destinations.js` é a fonte única dos prédios conectados às ferramentas. O mesmo conjunto gera experiências no mapa 2D e no ambiente 3D.

Entrar em um prédio abre a rota real usando a sessão Supabase já ativa. O caminho tradicional pelo Hub continua equivalente.

Banco e Loja apontam para `/economia/`, que lê dados oficiais do backend. Centro de Provas resolve automaticamente estudante versus equipe.
