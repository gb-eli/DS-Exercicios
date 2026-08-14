# Relatório de validação — Fase 17

## Resultados aprovados

- 120 arquivos JavaScript;
- 85 arquivos estruturais obrigatórios;
- 20 laboratórios disponíveis;
- 16 renderizadores auditados;
- 8 famílias de assets;
- 24 arquivos GLB;
- 4 ambientes HDR;
- integração em quatro laboratórios;
- mapeamentos de foguete, ônibus espacial, estação, cápsula, satélite, módulo lunar, rover e traje;
- LOD 0/1/2 conforme o perfil;
- imports relativos;
- Service Worker e PWA;
- fallback procedural;
- descarte de GPU;
- regressão das Fases 1 a 16;
- 44 URLs críticos respondendo HTTP 200.

## Testes de integração

- Horizon STS → `shuttle`;
- Atlas H → `rocket`;
- câmera externa da estação → `station`;
- cabine de cápsula → `capsule`;
- perseguição orbital → `satellite`;
- interior lunar → `lander`;
- rover marciano → `rover`;
- traje no museu → `suit`;
- estação no museu → `station`.

## Navegador

A tentativa de captura headless falhou na inicialização EGL. Nenhuma captura foi usada como evidência visual. A validação em GPU física continua obrigatória.
