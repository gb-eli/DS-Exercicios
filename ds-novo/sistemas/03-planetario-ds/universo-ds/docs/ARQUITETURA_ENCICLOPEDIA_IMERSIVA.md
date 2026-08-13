# Arquitetura — Enciclopédia Imersiva

```text
CuriosityCenterModule
├── KnowledgeEngine
│   ├── índice normalizado
│   ├── busca e filtros
│   ├── relações
│   ├── fontes
│   └── comparação
├── KnowledgeProfileStore
│   ├── favoritos
│   ├── descobertas
│   ├── comparação
│   └── último item
├── KnowledgeOrbRenderer
│   ├── WebGL2/GLSL
│   ├── câmera 360°
│   ├── zoom
│   ├── fallback Canvas 2D
│   └── lifecycle GPU
└── SPACE_KNOWLEDGE
    ├── mundos
    ├── missões
    ├── tecnologias
    ├── mitos
    └── fontes oficiais
```

## Separação de responsabilidades

- O catálogo mantém dados e relações.
- O motor executa pesquisa e comparação.
- A persistência registra preferências por perfil.
- O renderizador apresenta o objeto selecionado.
- O módulo coordena HUD, scanner, XP e navegação.

## Princípios

- visual primeiro;
- painel recolhível;
- fontes obrigatórias;
- valores aproximados identificados;
- conteúdo essencial offline;
- nenhuma falha de rede bloqueia a experiência;
- simulação, fato e modelo didático permanecem diferenciados.
