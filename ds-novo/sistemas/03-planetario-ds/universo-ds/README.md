# COSMOS DS — C1.1

## Universo, Tecnologia e Programação

Versão `24.0.0`, construída sobre a correção 23.1. A plataforma preserva os 24 laboratórios anteriores e adiciona o **COSMOS Curioso — Enciclopédia Imersiva**, elevando o total para 25 experiências lazy-loaded.

## Destaques da C1.1

- visualização 3D/360° com WebGL2 e fallback Canvas 2D;
- 21 itens iniciais de conhecimento disponíveis offline;
- planetas, Lua, Sol, missões, tecnologias e mitos;
- busca textual com normalização de acentos;
- filtros por tipo, categoria, favoritos e itens não descobertos;
- scanner, favoritos, coleção e progresso por perfil;
- comparação de até três itens;
- três camadas de informação: rápida, expandida e DS/técnica;
- fontes oficiais associadas a cada ficha;
- integração bidirecional com Sistema Solar, Terra, Lua e Marte;
- nenhuma chamada de rede obrigatória para o conteúdo essencial.

## Execução

```bash
python3 -m http.server 4173
```

Abra:

```text
http://localhost:4173
```

A Enciclopédia pode ser aberta diretamente por:

```text
http://localhost:4173/?module=curiosity-center
```

## Validação

```bash
npm run validate
```

A validação verifica estrutura, imports, PWA, renderizadores, catálogo, fontes, busca, relações, comparação, persistência e regressão dos módulos anteriores.
