# Fliperama DS v0.39.0 — Hotfix 1 de inicialização

## Sintoma observado

A página principal permanecia em `Carregando Fliperama DS…` e, após o timeout, mostrava `O carregamento demorou mais que o esperado`, enquanto `diagnostico.html` abria normalmente.

## Causa raiz confirmada

O bundle principal validava o catálogo durante o bootstrap e encontrou seis valores de `era` fora do enum oficial:

- `plataforma-classica-ds`: `1980-1999`
- `chess-arena-360`: `1950-atual`
- `crystal-cascade-3d`: `2010-atual`
- `hexa-reactor`: `1980-atual`
- `mundo-plataforma-ds-360`: `2000-atual`
- `plataforma-poligonal-ds-3d`: `1990-atual`

A exceção ocorria antes de a interface principal substituir a mensagem de carregamento. O handler inicial não exibia exceções JavaScript genéricas e o problema aparecia apenas como timeout.

Depois dessa correção, um segundo erro oculto foi revelado: `renderRoadmap()` usava `.join()` diretamente em campos opcionais ausentes de uma entrada recente do roadmap.

## Correções

- Seis registros movidos para eras oficiais aceitas pelo manifest.
- `renderRoadmap()` agora tolera `gameModes`, `controls`, `graphics`, `learning` e `technology` ausentes.
- `window.matchMedia` ganhou fallback para navegadores embarcados/mais antigos.
- `requestAnimationFrame`, `cancelAnimationFrame` e `Object.fromEntries` recebem fallback no bootstrap quando necessário.
- Acesso a `sessionStorage` não pode mais interromper a inicialização.
- Runtimes isolados que chamavam `matchMedia` diretamente foram protegidos.
- O diagnóstico inicial agora mostra a mensagem real de erro JavaScript.
- Timeout de contingência ampliado de 15 s para 30 s.
- Service Worker atualizado para `0.39.0-hotfix1`, forçando uma revisão de cache.

## Validação

- Hotfix de inicialização: **21/21**.
- Auditoria geral: **25/25 experiências**, **899/899 checks**.
- Chess Arena 360: **67/67** na verificação de compatibilidade do hotfix.
- UX/responsividade: **25/25**.
- Arcade: **37/37**.
- Conteúdo educacional: **162/162**.
- Museu/Timeline: **62/62**.
- Plataforma Clássica: **150/150**.
- Progressão v0.36.2: **30/30**.

## Observação de publicação

O Service Worker usa `skipWaiting()` e `clients.claim()`. Após publicar todos os arquivos, uma atualização forçada ou reabertura da página deve assumir o cache `0.39.0-hotfix1` e remover os caches antigos do mesmo prefixo.
