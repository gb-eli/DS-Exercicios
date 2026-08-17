# Prompt de integração v0.9.4

Integrar Cache e Memória 2.0 preservando a Loja Virtual DS. Carregar `config-cache-memory.js` e `cache-memory-manager.js` antes dos módulos gráficos. Emitir `ds-view-change` ao navegar. Registrar modelos, texturas, render targets e partículas com `DSCacheMemory.register()`, fornecendo função real de descarte. Não liberar estado equipado, carteira ou inventário. Utilizar o Service Worker v0.9.4 no escopo raiz e manter os hashes dos pacotes.
