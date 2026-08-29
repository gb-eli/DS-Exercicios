# AGV Campus DS — v14.10.8.51

## Fase H — Lobby 2D-first e Campus de espera

Base: v14.10.8.50 funcional.

### Comportamento de entrada
- O Lobby sempre inicia em **2D**.
- O aluno pode alternar para o **3D** pelo botão `Entrar no 3D`.
- No 3D, o mesmo botão vira `Voltar ao 2D`.
- A escolha é registrada localmente apenas como preferência/telemetria de interface; ela **não força boot 3D no próximo acesso**.
- O mapa 2D deixa de ser tratado como simples fallback e passa a ser um modo oficial.

### Mapa 2D
- praça e laboratórios preservados;
- nova camada de experiências recreativas;
- Piscina Neon com água animada;
- Parquinho DS;
- Escorregador Turbo;
- Trilho Panorâmico com carrinho animado;
- Torre de Escadas;
- Circuito Parkour com 5 checkpoints;
- rótulos, painéis e HUD de espera revisados.

### Campus 3D
- mesmas seis áreas recreativas do mapa 2D;
- água e objetos ambientais animados;
- carrinho do Trilho Panorâmico em movimento;
- balanços com animação leve;
- parkour com plataformas compartilhadas entre render e colisão;
- checkpoints do parkour ficam sobre as plataformas e exigem progressão espacial;
- câmera passa a considerar as áreas de experiência para colisão visual.

### Segurança e compatibilidade
- nenhum schema do Supabase foi alterado;
- presença online preservada;
- Portal V2, Avatar V2 e Hotfix 3D v14.10.8.50 preservados;
- GitHub Pages e rotas existentes não mudam;
- Service Worker atualizado para v14.10.8.51 e inclui `campus-experiences.js` no shell crítico.

### Publicação
Este pacote é um **PATCH incremental** para ser aplicado por cima da árvore completa atual. Não limpe o repositório antes de copiar os arquivos.
