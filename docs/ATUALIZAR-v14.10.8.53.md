# AGV Campus DS — v14.10.8.53

## Vale do Silício AGV + Campus Expansion

Esta versão evolui a `v14.10.8.52 — Lobby Visual Advanced 2D/3D` sem substituir a arquitetura existente. O Lobby continua iniciando em **2D** e o modo **3D permanece opcional**. A expansão adiciona uma segunda região, **Vale do Silício AGV**, acessada por portal no Campus principal.

## O que foi adicionado

### Vale do Silício AGV

- Segunda região 2D/3D carregada sob demanda.
- Geração procedural orientada por `lobby/data/vale-silicio/runtime-v2.json`.
- 27 empresas/projetos habilitados e 8 distritos, sem hardcode dos nomes das empresas no renderer.
- Lotes, fachadas, placas, alturas/andares e categorias derivados dos dados de runtime.
- Interiores compactos carregados somente quando o aluno entra no prédio.
- Portal de retorno ao Campus principal.
- Busca, filtros, mapa e fast travel; destinos de empresas são liberados após visita.
- Minimapa contextual no modo 3D do Vale, com jogador, participantes e destinos já liberados.
- Presença multiusuário mantém a mesma infraestrutura atual e diferencia a região por `area: "vale-silicio"`.

### NPCs institucionais

- Tirza — Diretora
- Vitor — Diretor
- Pedagoga — Equipe pedagógica
- Márcia — Inspetora
- Arlene — Inspetora

Os NPCs têm representação 2D/3D, identificação, interação por proximidade e falas curtas de orientação. O 3D reutiliza o Avatar V2.

### Novos ambientes

- Auditório AGV, com leitura visual de palco/telão/assentos no 2D e estrutura correspondente no 3D.
- Refeitório AGV, com mesas/balcão representados no mapa 2D e estrutura correspondente no 3D.
- Sala de Pedra, com linguagem visual rochosa/temática no mapa e estrutura correspondente no 3D.

### Esportes e convivência

- Quadra de futsal
- Quadra de basquete
- Quadra de vôlei
- Mesa de ping pong

### Mobilidade e área urbana

- Ruas e eixos viários no Vale.
- Carro elétrico.
- Ônibus do Campus.
- Caminhão de logística.
- Moto elétrica.
- Bicicleta AGV.
- Drone AGV.
- Helicóptero AGV.
- Hangar AGV.
- Pista de corrida.

Veículos usam animação ambiental leve e respeitam `prefers-reduced-motion`.

## Integração com o Campus existente

- O Campus original continua sendo a cena inicial.
- Entrada oficial continua em 2D.
- O aluno pode alternar entre 2D e 3D em ambas as regiões.
- Camera V2, Avatar V2, Portal V2, Performance Manager, desafios e atrações da `.52` permanecem.
- O portal do Vale foi acrescentado ao catálogo compartilhado de experiências do Campus.
- Alunos que estão no Vale não aparecem como avatares-fantasma no Campus e vice-versa.

## Banco e publicação

- Nenhuma migração de schema do Supabase.
- Nenhuma mudança de domínio, rota raiz ou configuração necessária do GitHub Pages.
- Nenhuma exclusão de arquivo da `v14.10.8.52`.
- O pacote PATCH deve ser aplicado **por cima** de uma árvore completa. Nunca limpe o repositório antes de aplicá-lo.

## Rollback

Em produção, prefira rollback por histórico Git:

```powershell
git log --oneline -5
git revert <HASH_DO_COMMIT_v14.10.8.53>
git push origin main
```

Isso preserva o histórico e o mesmo endereço do GitHub Pages.
