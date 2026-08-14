# Entrega — C1.1 Enciclopédia Imersiva

## Objetivo

Criar uma camada de conhecimento que preserve a experiência visual do COSMOS DS. A informação é apresentada depois da interação e não substitui os laboratórios 3D.

## Entregas funcionais

- módulo `COSMOS Curioso` carregado sob demanda;
- visualização WebGL2 em 360°, zoom e fullscreen;
- fallback Canvas 2D;
- catálogo local com 21 itens;
- 10 corpos celestes;
- 3 missões ou infraestruturas históricas;
- 6 tecnologias;
- 2 mitos espaciais;
- 12 fontes oficiais registradas;
- busca com termos científicos e tecnológicos;
- filtros por tipo e categoria;
- favoritos e itens não vistos;
- scanner para registrar descobertas;
- coleção individual por perfil;
- comparação de até três itens;
- painéis rápido, expandido e técnico;
- links para fontes e laboratórios relacionados;
- integração do scanner do Sistema Solar;
- integração dos módulos Terra e Lua/Marte.

## Progressão

- 35 XP por descoberta inédita;
- 120 XP por combinação de comparação inédita;
- 350 XP pela certificação após descobrir oito itens cobrindo os quatro tipos de conteúdo.

## Funcionamento offline

O catálogo é importado como módulo JavaScript e não depende de `fetch()`. O manifesto público é usado para documentação e auditoria. O Service Worker inclui os arquivos centrais da C1.1.

## Limitação de validação visual

O Chromium administrativo não concluiu a inicialização por falhas de DBus/EGL. A renderização final WebGL2 deve ser conferida em GPU física. O fallback 2D, a estrutura, os imports e a lógica foram validados.
