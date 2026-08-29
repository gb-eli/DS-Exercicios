# AGV Campus DS — v14.10.8.48

## Fase F — Produção, Performance e Mobile

Este pacote será distribuído como **patch cumulativo E+F sobre a base oficial completa v14.10.8.46**. Se a v14.10.8.47 já tiver sido aplicada, a cópia por cima continua segura.

> Importante: não é um snapshot completo do repositório. Nunca apague arquivos que não aparecem no ZIP.

### Inclui também a Fase E

- Portal V2 centralizado em `lobby/assets/game/portal-manager.js`.
- Estrutura arquitetônica, campo energético, partículas, scanlines, estados aberto/fechado e qualidade adaptativa dos portais.

### Fase F

- Novo `lobby/assets/render/performance-manager.js`.
- `ResizeObserver` e resize sob demanda no WebGL; o canvas deixa de recalcular layout em todo frame.
- Perfil de dispositivo considera `deviceMemory`, `hardwareConcurrency`, pointer coarse e `navigator.connection.saveData`.
- Qualidade adaptativa mantém histerese e respeita escolha manual por 120 segundos.
- Preferência manual de qualidade é armazenada em `localStorage`.
- Interiores 3D começam invisíveis e apenas o laboratório ativo é renderizado e recebe atualizações dinâmicas.
- Aba oculta deixa de executar simulação/renderização 3D útil; ao voltar, FPS e resize são recalibrados.
- Evento `webglcontextlost` migra automaticamente para Lobby Lite para preservar a sessão.
- Badge de FPS só aparece abaixo de 42 FPS.
- Ajuda de teclado perde ênfase após 7,5 s e volta a aparecer após interação.
- Mobile horizontal reduz HUD e reposiciona joystick, ações e prompt de interação.
- Ações rápidas em touch podem rolar horizontalmente sem ocupar o playfield.
- Boot/Service Worker atualizados para a release 14.10.8.48 e para o novo módulo de performance.

### Compatibilidade preservada

- Supabase e schema: sem alterações.
- Presença multiplayer: preservada.
- Camera V2: preservada.
- Avatar V2: preservado.
- Ambiente Fase C: preservado.
- Lobby Lite: preservado.
- Rotas do Hub/Lobby: preservadas.
- GitHub Pages: nenhum caminho público foi renomeado.

### Aplicação segura

Copie o conteúdo do patch **por cima** da árvore completa v14.10.8.46 ou v14.10.8.47. Não use `/MIR`, não limpe a pasta e não remova arquivos ausentes do patch.
