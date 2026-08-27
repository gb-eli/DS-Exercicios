# Checklist de testes — Fliperama DS v0.26.0

## Concluído nesta fase

- [x] Existe somente uma raiz publicável.
- [x] `index.html` está na raiz.
- [x] Versão sincronizada em HTML, JavaScript, JSON e Service Worker.
- [x] `app.js` possui sintaxe válida.
- [x] `sw.js` possui sintaxe válida.
- [x] `phaser.js` possui sintaxe válida.
- [x] Scripts próprios do VoxelCraft possuem sintaxe válida.
- [x] Todos os requisitos internos do bundle apontam para módulos existentes.
- [x] Os 18 runtimes anteriores permanecem registrados.
- [x] As 23 entradas do catálogo permanecem disponíveis.
- [x] Todas as 23 pastas de mídia do catálogo estão presentes.
- [x] Todos os itens do shell do Service Worker existem.
- [x] Todas as rotas dos arquivos do pacote responderam por HTTP.
- [x] IndexedDB possui fallback para localStorage e memória.
- [x] Falha de registro do Service Worker não interrompe a plataforma.
- [x] Existe uma página independente de diagnóstico.
- [x] VoxelCraft está identificado como Protótipo.

## Teste manual obrigatório após publicação

- [ ] Abrir a página inicial em desktop.
- [ ] Abrir a página inicial em celular.
- [ ] Executar `diagnostico.html`.
- [ ] Recarregar a página e confirmar ativação do Service Worker.
- [ ] Confirmar que uma versão antiga não permanece em cache.
- [ ] Abrir ao menos um jogo Phaser.
- [ ] Abrir ao menos uma experiência WebGL.
- [ ] Testar salvamento e restauração.
- [ ] Testar abertura direta por `file://`.
- [ ] Testar abertura pelo servidor local.

## Próxima fase — ainda pendente

- [ ] Verificar se cada fase pode ser vencida.
- [ ] Verificar saídas e caminhos de labirintos.
- [ ] Verificar itens, chaves, portas, bandeiras e portais.
- [ ] Detectar posições em que o jogador fica preso.
- [ ] Medir dificuldade, tempo e velocidade.
- [ ] Revisar IA e tempo de resposta da CPU.
- [ ] Validar teclado, toque e gamepad jogo por jogo.
