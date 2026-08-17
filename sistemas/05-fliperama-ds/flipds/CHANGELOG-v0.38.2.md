# Changelog — v0.38.2

## Fase 7.23 — Mundo Plataforma DS 360 · Vila Tecnológica

### Adicionado
- `games/mundo-plataforma-ds-360/village.json` com a Região 2.
- 3 NPCs: Lia, Ivo e Dara.
- 3 missões encadeadas.
- Oficina, Estação de Dados e Centro de Rede com interiores leves.
- 3 módulos de reparo, 4 pacotes de dados, terminal de upload, 3 relés e Núcleo da Vila.
- interação contextual por teclado, touch e gamepad.
- troca de região em tempo real no mesmo runtime Three.js.
- save schema 2 com progresso por região e estado das missões.
- teste específico v0.38.2.

### Alterado
- Mundo Plataforma DS 360 agora possui 2 regiões.
- runtime do portal passa a reportar região, missão e progresso da Vila.
- ficha educacional, perfil, catálogo, diagnóstico e Service Worker atualizados.
- preview 02 redesenhado para a Vila Tecnológica.

### Compatibilidade
- saves schema 1 da v0.38.1 são migrados automaticamente.
- quem ainda não terminou o Vale continua no Vale.
- quem já terminou o Vale começa na Vila, sem marcar a campanha nova como concluída.
