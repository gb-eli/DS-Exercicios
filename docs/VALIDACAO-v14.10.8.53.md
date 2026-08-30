# Validação — v14.10.8.53

## Resultado

**PASS nos testes estáticos e de runtime automatizável neste ambiente.**

## Dados do Vale

- JSON validado contra `runtime-v2.schema.json`: PASS.
- Empresas habilitadas: 27.
- Distritos: 8.
- IDs de empresas: únicos.
- A especificação administrativa e alertas de dados foram preservados no runtime, sem inventar papéis ausentes.

## JavaScript / módulos

- Arquivos JavaScript em `lobby/`: 28.
- `node --check`: 28/28 PASS.
- Imports relativos ausentes: 0.
- Imports dinâmicos dos novos módulos do Vale: PASS.

Módulos exercitados:

- `vale-silicio-shared.js`
- `vale-silicio-data.js`
- `vale-lite.js`
- `vale3d.js`
- `campus-experiences.js`
- `campus-environment.js`

## Runtime 2D do Vale

Smoke com mocks de navegador:

- 43 destinos retornados.
- 27 destinos de empresas.
- 8 destinos de distritos.
- Inicialização e descarte: PASS.
- Entrar/sair de prédio: PASS.
- Entradas calculadas das 27 empresas ficam fora dos colliders: 27/27 PASS.

## Service Worker

- Recursos críticos declarados: 29.
- Recursos críticos ausentes: 0.
- Recursos opcionais declarados: 6.
- Recursos opcionais ausentes: 0.
- Servidor HTTP local: 29/29 recursos críticos retornaram HTTP 200.
- Instalação atômica do shell crítico da versão anterior foi preservada.

## Regressão estrutural contra v14.10.8.52

Comparação final da árvore completa:

- 16 arquivos existentes alterados.
- 11 arquivos novos, incluindo runtime/dados e documentação da release.
- 0 arquivos removidos.
- O PATCH final contém somente estes 27 caminhos.
- O aplicador valida SHA-256 da base e do destino para os arquivos do PATCH.
- Aplicação do PATCH sobre uma cópia limpa da `.52` reproduz a árvore `.53` byte a byte: PASS.

## Funcionalidades verificadas por inspeção + runtime

- Portal Campus → Vale: PASS.
- Portal Vale → Campus: PASS.
- Entrada 2D-first preservada: PASS.
- Alternância 2D/3D preservada: PASS.
- 27 empresas procedurais: PASS.
- 8 distritos: PASS.
- NPCs Tirza, Vitor, Pedagoga, Márcia e Arlene: PASS.
- Auditório, Refeitório e Sala de Pedra: PASS.
- Futsal, basquete, vôlei e ping pong: PASS.
- Carro, ônibus, caminhão, moto, bicicleta, drone e helicóptero: PASS.
- Hangar e pista: PASS.
- Busca/filtros/fast travel: PASS.
- Minimapa contextual 3D integrado ao HUD: PASS por validação estática/runtime; inspeção visual final permanece no smoke autenticado.
- Interiores carregados sob demanda: PASS.
- Separação de presença por região: PASS.

## Smoke visual real

O ambiente automatizado disponível nesta sessão não conseguiu manter Chromium/WebGL headless estável para captura visual confiável. Portanto, **não é alegado smoke visual de GPU nesta validação**.

Após publicar, executar obrigatoriamente no ambiente autenticado:

1. login real;
2. Campus 2D;
3. atravessar portal para o Vale 2D;
4. pesquisar empresa e abrir painel;
5. entrar e sair de um prédio;
6. voltar ao Campus;
7. repetir o fluxo em 3D;
8. validar presença com dois usuários;
9. validar atividade/prova existente;
10. conferir Console, Service Worker e cache após atualização.
