# Relatório de validação — Fliperama DS v0.36.2

## Fase 7.17C — Expansão real das fases · Bloco 3/3

A v0.36.2 encerra o ciclo de expansão dos 18 jogos existentes antes da entrada dos novos jogos do Plano Master.

### Setor Poligonal 94

A antiga missão única foi dividida em três protocolos progressivos:

1. **Geometria Base** — coletar 3 núcleos e validar a malha.
2. **Materiais e Rotas** — registrar Flat, Textura e PBR e ativar os dois checkpoints.
3. **Câmeras de Produção** — registrar terceira pessoa, primeira pessoa e fixa, recuperar 3 núcleos e concluir o portal.

O save passou para schema 3. Saves schema 1/2 são migrados; saves antigos já concluídos são interpretados como 3/3.

### Câmeras em Evolução

A experiência agora possui três experimentos:

1. **Enquadramento** — 3 lentes + pelo menos 2 câmeras.
2. **Campo de Visão** — FOV 45°, 60° e 75° + 2 checkpoints.
3. **Sistema Completo** — 6 câmeras + 3 lentes.

O save também passa para schema 3 e preserva migração dos schemas anteriores.

### VoxelCraft DS

Os modos Aprendizagem e Desafio foram reorganizados em três etapas progressivas. A etapa atual, etapas concluídas, XP, inventário, posição e edições do mundo são persistidos. O armazenamento passou para schema 12, mantendo importação automática da chave local v11.

**Aprendizagem:** Streaming do mundo → Recursos e inventário → Construção e navegação.

**Desafio:** Cartografia de chunks → Mineração persistente → Engenharia de campo.

### Validação

- Auditoria geral: **116/116**.
- CPU/multiplayer: **116/116**.
- Arcade: **37/37**.
- Conteúdo educacional: **120/120**.
- Museu/Linha do Tempo: **62/62**.
- UX/responsividade: **25/25**.
- Física: **18/18**.
- Expansão v0.36.0: **38/38**.
- Expansão v0.36.1: **47/47**.
- Campanhas 3D atuais: **28/28**.
- VoxelCraft atual: **26/26**.
- Expansão v0.36.2: **30/30**.

**Total funcional/regressivo considerado nesta fase: 663 aprovações e 0 falhas.**

### Limite da validação

O ambiente atual não oferece um playtest visual automatizado confiável com Chromium/WebGL. Sensação de câmera, toque, gamepad, áudio e frame pacing continuam no checklist para aparelho real.

### Validação de publicação

- Rotas HTTP: **291/291** com status 200.
- JavaScript não-vendor: **23/23** arquivos aprovados em `node --check`.
- JSON: **38/38** arquivos válidos.
- SVG: **86/86** arquivos válidos.
- Comparação com v0.36.1: **16 arquivos novos**, **29 modificados**, **0 removidos** antes da geração dos hashes finais.
- O ZIP é publicado com `index.html` diretamente na raiz, sem pasta contêiner obrigatória.
