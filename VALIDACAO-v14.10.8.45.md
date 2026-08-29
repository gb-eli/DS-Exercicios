# Validação v14.10.8.45 — Fase C

Data: 2026-08-28

## Resultado geral

**APROVADO nos testes estáticos e de integridade executáveis neste ambiente.**

O teste visual WebGL não foi marcado como aprovado porque o Chromium disponível no ambiente não conseguiu inicializar o contexto gráfico/EGL, inclusive com tentativa em Xvfb/software rendering. Isso é limitação do ambiente de validação, não evidência de falha do código.

## Testes executados

### JavaScript

- 18 arquivos `.js/.mjs` verificados com `node --check`;
- 18/18 sem erro de sintaxe.

### Imports relativos

- 11 imports relativos verificados automaticamente;
- 0 destinos ausentes.

### Service Worker

- 12 entradas do shell local verificadas;
- 0 arquivos ausentes;
- `campus-environment.js` incluído no pre-cache;
- cache atualizado para `14.10.8.45`.

### JSON

- 3 arquivos JSON verificados;
- 3/3 parseados corretamente.

### Manifesto espacial

Verificado:

- quatro zonas com `buildingRotation`;
- 1DS/2DS em rotação 0;
- 3DS/SUB em rotação `Math.PI`;
- quatro colliders externos presentes;
- conversão `presenceToWorld(800,500)` continua resultando em `{x:0,z:0}`.

### Contrato Fase C

Confirmada presença dos contratos:

- `createCampusEnvironment`;
- `createCampusLighting`;
- material físico opcional (`MeshPhysicalMaterial`);
- identificação `campus-building`;
- geometria de anéis da praça;
- núcleo icosaédrico;
- contrato futuro de GLB/glTF.

### Versionamento

As referências runtime foram atualizadas para `14.10.8.45`.

As únicas referências `14.10.8.44` mantidas são os artefatos históricos:

- `ATUALIZAR-v14.10.8.44.md`;
- `VALIDACAO-v14.10.8.44.md`;
- `release-v14.10.8.44.json`.

## Smoke visual WebGL

Foram tentadas duas inicializações locais do Chromium, incluindo SwiftShader/ANGLE e Xvfb. O processo não conseguiu criar o contexto gráfico, apresentando falhas do ambiente como:

- `EGL_NOT_INITIALIZED`;
- falha de inicialização ANGLE;
- `Failed to send GpuControl.CreateCommandBuffer`.

Portanto, **não foi fabricada aprovação visual**. O teste final deve ser feito após publicar/abrir a release em um navegador com WebGL funcional.

## Checklist recomendado após publicação

1. abrir o Campus em desktop com qualidade High;
2. confirmar que 3DS e SUB estão com fachada voltada para a praça;
3. orbitar 360° ao redor da praça;
4. verificar raycast da Camera V2 nos quatro prédios;
5. caminhar até todas as quatro entradas;
6. entrar e sair dos quatro interiores;
7. validar portais aberto/fechado;
8. testar presença de dois usuários;
9. testar Android em Eco/Medium;
10. confirmar fallback 2D forçando falha WebGL;
11. conferir console e diagnóstico do Lobby;
12. validar troca de qualidade sem travamento.

## Banco de dados

Nenhuma migration, RPC, tabela, policy ou dado Supabase foi alterado nesta fase.
