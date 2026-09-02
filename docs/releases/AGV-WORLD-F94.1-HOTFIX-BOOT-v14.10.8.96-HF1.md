# AGV World F94.1 HF1 — Hotfix de boot do Lobby

**Base:** v14.10.8.96 / F94  
**Hotfix:** `F94.1-HF1-open-world-settings-boot`  
**Data:** 2026-09-02

## Sintoma confirmado

O Lobby permanecia na tela **“Redirecionando para o login único…”** e o diagnóstico encerrava em `stage: lobby_module_import` com:

`ReferenceError: openWorldSettings is not defined`

A falha ocorria durante a avaliação de `lobby/assets/lobby.js`, antes do primeiro frame e antes da conclusão do boot. Rede, Service Worker e carregamento dos módulos anteriores estavam funcionais.

## Causa raiz

O botão `#world-settings-button` recebia o handler `openWorldSettings`, mas essa função não existia no módulo. A referência era avaliada imediatamente durante o import do Lobby, gerando `ReferenceError` e abortando o módulo inteiro.

## Correção

Foi restaurado o opener das configurações do mundo:

```js
function openWorldSettings(){
  syncWorldSettingsForm();
  openModal('world-settings-modal');
}
```

Também foi adicionado cache-bust `hf1` à cadeia crítica `index -> sw-register/vendor-loader -> boot -> lobby` e ao cache do Service Worker para impedir que uma cópia offline do `lobby.js` quebrado permaneça ativa.

## Escopo

- nenhuma alteração de backend;
- nenhuma migration;
- nenhuma Edge Function;
- calibrador F94 preservado;
- runtimes 3D preservados;
- correção restrita ao boot/UI do Lobby e invalidação segura do cache crítico.
