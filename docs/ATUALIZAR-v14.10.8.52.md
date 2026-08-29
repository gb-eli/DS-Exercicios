# AGV Campus DS — v14.10.8.52

## Lobby Visual Advanced 2D/3D

Este pacote é um **PATCH incremental** sobre a versão `v14.10.8.51`. Copie os arquivos mantendo a estrutura de pastas e substitua somente os caminhos presentes no ZIP. Não apague o repositório nem publique o ZIP como se fosse uma árvore completa.

## Principais mudanças

- O mapa 2D continua sendo a entrada oficial e recebeu enquadramento responsivo, zoom automático em retrato, sinalização, jardins e melhor leitura em telas pequenas.
- Piscina, Parquinho, Escorregador, Trilho Panorâmico, Torre e Parkour receberam objetos, acabamento e interação mais claros nos modos 2D e 3D.
- Parkour agora usa um gerenciador compartilhado de desafio com início, cronômetro, progresso, checkpoints, reinício, abandono e respawn.
- Escorregador, Trilho, Torre, Parquinho e Piscina podem iniciar experiências guiadas por trajetórias compartilhadas entre 2D e 3D.
- O HUD mostra o estado real de atividades: liberada, programada ou aguardando.
- O 3D ganhou spawn seguro, câmera temporária para desafios/passeios, restauração da câmera, placas normalizadas e detalhes adicionais em ambientes internos e externos.
- O modo 2D respeita `Save-Data` e `prefers-reduced-motion`; o 3D também preserva a redução de movimento.
- O shell crítico do Service Worker inclui os dois novos módulos de jogo.

## Compatibilidade preservada

- Nenhuma alteração de schema, tabela, função, política ou configuração do Supabase.
- Login, presença, portais, rotas do GitHub Pages e contratos de dados existentes permanecem inalterados.
- O Lobby continua iniciando em 2D, com troca voluntária para 3D e retorno ao 2D.
- Falha ou perda de contexto WebGL continua levando o usuário ao modo 2D sem recarregar a sessão.

## Como aplicar

1. Confirme que a instalação de destino está em `v14.10.8.51`.
2. Faça backup dos 20 caminhos listados em `docs/ARQUIVOS-ALTERADOS-v14.10.8.52.txt`.
3. Extraia o PATCH sobre a raiz do projeto, preservando as pastas `lobby/` e `docs/`.
4. Publique usando o fluxo já adotado pelo projeto.
5. Abra o Lobby e faça uma atualização completa para que o Service Worker use o cache `v14.10.8.52`.
6. Execute o smoke autenticado descrito em `docs/VALIDACAO-v14.10.8.52.md`.

## Riscos conhecidos

- O desempenho do 3D varia conforme GPU, navegador e quantidade de participantes; o modo 2D permanece como recuperação permanente.
- Clientes com o Service Worker anterior podem precisar de uma atualização completa após a publicação para trocar o shell em cache.
- Login, presença multiusuário e atividades reais dependem do ambiente autenticado e precisam do smoke pós-publicação; não foram simulados como aprovados.
- A geometria 3D é procedural e pode apresentar pequenas diferenças de antialiasing e iluminação entre GPUs.
- Em telas muito pequenas, rótulos 3D são reduzidos para preservar a área útil e podem exigir aproximação da câmera.

## Rollback

1. Restaure os mesmos 20 caminhos a partir do backup da `v14.10.8.51` ou reverta somente o commit deste PATCH.
2. Republique a versão anterior.
3. Faça uma atualização completa no navegador. O Service Worker anterior retomará o cache da versão anterior.
4. Se um cliente continuar preso a um cache antigo, remova apenas o registro/cache desse site pelas ferramentas do navegador e recarregue. Não limpe dados de outros domínios.

O rollback não exige alteração de banco de dados, pois este PATCH não contém migrações nem mudanças de schema.
