# AGV World v14.10.8.66 — Cinema AGV

## Entregue nesta etapa

- Prédio **Cinema AGV** no mapa 2D e 3D, com fachada própria e nova posição no Distrito Cultural.
- Cinema reposicionado para **x=29 / z=31**, fora da pista/linha de mobilidade sul.
- Interior carregado sob demanda e desmontado ao sair.
- Sala principal com tela 3D, fileiras de assentos, corredor central, recepção e iluminação temática.
- 1º pavimento com cabine de projeção/mezanino e navegação por escada/elevador.
- Interação **Tela Principal**.
- Professor/Admin/Super Admin pode publicar:
  - URL direta de vídeo (ex.: MP4/WebM);
  - link do YouTube;
  - link do Vimeo;
  - iframe do YouTube/Vimeo.
- A programação fica persistida em `public.lobby_cinema_media`.
- Usuários online recebem invalidação Realtime e recarregam o estado confiável via RLS.
- Vídeos diretos usam `THREE.VideoTexture` na tela 3D apenas enquanto o interior do cinema está montado. O host do arquivo precisa permitir CORS para a textura WebGL funcionar.
- Ao sair do cinema, vídeo e textura 3D são pausados/descartados para reduzir consumo.
- YouTube/Vimeo são exibidos no player do Cinema AGV; o navegador não permite transformar um iframe desses diretamente em `VideoTexture`.

## Banco de dados

Executar a migração:

`core/database/065_lobby_cinema_media.sql`

Ela cria a tabela, o registro singleton `main`, funções auxiliares `security definer` e políticas RLS:
- leitura: usuários ativos;
- escrita: `teacher`, `admin`, `super_admin`;
- aluno não pode alterar a programação.

## Publicação

Depois da migração, publique a pasta atualizada normalmente. O Lobby foi elevado para **v14.10.8.66** e o Service Worker ganhou o módulo `world/cinema-media.js` no shell crítico.

## Próximas etapas sugeridas

1. Veículos utilizáveis: motorista/carona, aceleração/freio, limite de velocidade e passageiros.
2. Trilhos/ruas: auditoria completa de conflitos com prédios e estações.
3. Minimap global + velocímetro.
4. Escadas/voo/mirante/binóculo.
5. Câmeras de segurança e central de monitoramento.
6. Clima/dia/noite avançados.
7. Mini-mapas interligados: cidade, rural/fazenda, Lua, Marte e estação espacial.
