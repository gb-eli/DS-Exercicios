# F94.5 — Instrumentação e Auditoria Executável dos Mapas

**Base:** F94.4 HF4 — `14.10.8.96`  
**Escopo:** frontend/Lobby.  
**Backend/Supabase:** inalterado.  
**Objetivo:** localizar com precisão em qual etapa cada mapa 2D/3D falha, sem confundir import, asset, renderer, primeiro frame, input ou interação.

## 1. O que foi implementado

Foi criado `lobby/assets/core/world-runtime-audit.js`, integrado ao `WorldManager`, `WorldAdapter`, boot, diagnóstico e Service Worker.

A trilha por tentativa é:

1. `adapter`
2. `import`
3. `assets`
4. `runtime`
5. `renderer`
6. `firstFrame`
7. `input`
8. `interaction`
9. `unload`

Cada tentativa guarda `worldId`, `scene`, modo (`lite`/`3d`), qualidade inicial, tempos, falha, renderer detectado e recursos observados.

## 2. Matriz dos 18 mundos

A auditoria registra os 18 adapters persistentes:

- Campus DS
- Vila 1DS
- Vila 2DS
- Vila 3DS
- Vila SUB
- Biblioteca Central AGV
- Distrito de Laboratórios AGV
- Parque Neon & Lazer AGV
- Vale do Silício AGV
- Mundo Rural AGV
- Base de Operações AGV
- Estação Orbital AGV
- Lua AGV
- Marte AGV
- Parque de Diversões AGV
- Colégio AGV — Alberto Gomes Veiga
- Labirinto com Armadilhas
- Museu do Hardware AGV

O runtime transitório de **airdrop** foi deliberadamente excluído da matriz persistente para não contaminar o resultado do Campus.

## 3. Como o diagnóstico diferencia falhas

### Adapter
Confirma que o `WorldManager` recebeu um adapter válido para o mundo/modo.

### Import
Os imports lazy são instrumentados individualmente. Uma falha de módulo passa a aparecer como `import=FAIL`, com o módulo envolvido.

### Assets
`PerformanceObserver` registra módulos e assets carregados durante a tentativa. GLB, glTF, KTX2, imagens, áudio e vídeo são classificados separadamente. Se tudo vier de cache ou o mapa for procedural, isso é indicado em vez de inventar uma falha.

### Runtime
Confirma que a factory retornou um runtime com o contrato mínimo (`stop()`).

### Renderer
Instrumentação de `canvas.getContext()` detecta `2d`, `webgl`, `webgl2` ou `webgpu`. Em WebGL, quando disponível, registra renderer/vendor sem armazenar dados pessoais.

### First frame
No 3D usa o callback real `onFirstFrame`. No 2D usa o callback quando o runtime oferece e existe fallback por RAF pós-ready.

### Input
No modo completo de auditoria registra o primeiro input útil de jogo, sem guardar a tecla digitada nem texto do usuário.

### Interaction
Registra que a solicitação chegou ao pipeline central de interação; quando um runtime envia uma ação estruturada (por exemplo, Parque), registra apenas tipo/id/experiência/target, sem dados pessoais.

### Unload
Registra saída/descarregamento do runtime e motivo.

## 4. Persistência

A matriz recente é mantida localmente por até **7 dias**, apenas com dados técnicos. Não inclui nome, e-mail, CGM, token ou respostas pedagógicas.

## 5. Interface de auditoria

Abra o Lobby com:

`?worldaudit=1&diag=1`

Aparece o botão **Auditoria dos mundos**. A matriz mostra 2D e 3D por mundo e permite copiar o JSON técnico.

`PASS` na matriz significa que o núcleo observado chegou até renderer + primeiro frame. Input e interação aparecem como verificações adicionais e não são inferidos automaticamente.

## 6. Mudanças na cadeia de cache

Nova cadeia:

`stage66-f945-world-audit`

Foram atualizados:

- `diagnostics.js`
- `sw-register.js`
- `vendor-loader.js`
- `boot.js`
- `lobby.js`
- `world-manager.js`
- `world-adapter.js`
- `sw.js`
- `lobby/index.html`

O novo módulo é crítico no Service Worker para evitar uma release parcialmente cacheada.

## 7. Validação executada

- **F94.5 static:** 15/15 PASS
- **F94.5 audit self-test:** PASS
- **18 adapters persistentes:** confirmados
- **JS Lobby:** 149 arquivos, 0 erros sintáticos
- **Imports locais:** 410, 0 ausentes
- Falha sintética de import: corretamente classificada em `import=FAIL`
- Tentativa sintética completa: adapter/import/assets/runtime/renderer/firstFrame/input/interação = PASS

## 8. Limitação desta validação

Não houve execução visual real em Chromium nesta sessão. Portanto a F94.5 **não declara que os 18 mapas funcionam**. Ela entrega a instrumentação necessária para o teste real no navegador identificar exatamente quais passam e em qual etapa os demais falham.

## 9. Próxima etapa após coleta real

Usar os JSONs reais para produzir a matriz:

`Mundo | 2D | 3D | first frame | input | interação | causa | prioridade`

Só depois iniciar correções por grupo:

1. mapas que não abrem;
2. mapas que abrem mas não renderizam;
3. mapas que renderizam mas não recebem input;
4. interações quebradas;
5. câmera/runtime contract;
6. veículos;
7. física do Parque;
8. escala 2D/atlas;
9. conteúdo e qualidade gráfica.
