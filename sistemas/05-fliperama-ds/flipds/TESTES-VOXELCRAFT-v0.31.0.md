# Testes do VoxelCraft DS — Fliperama DS v0.31.0

Gerado em: 2026-08-07T23:21:15.868Z

- Verificações: **22**
- Aprovadas: **22**
- Falhas: **0**

## Resultados

- **APROVADO — Schema de save 11:** O sanitizador converte estados antigos para o schema 11.
- **APROVADO — Sanitização de jogador:** Vida, fome, câmera e inclinação permanecem dentro dos limites.
- **APROVADO — Sanitização de edições:** Chaves e tipos inválidos são descartados.
- **APROVADO — Sanitização de inventário:** Itens desconhecidos são removidos e quantidades são limitadas.
- **APROVADO — Fallback localStorage:** Sem IndexedDB, o mundo permanece persistente no localStorage.
- **APROVADO — Fallback em memória:** Quando os armazenamentos persistentes falham, a sessão continua em memória.
- **APROVADO — Three.js local:** O renderizador não depende de CDN externa.
- **APROVADO — Spawn e recuperação seguros:** Saves inválidos e quedas recuperam o personagem.
- **APROVADO — Proteção contra autoaprisionamento:** Não é permitido colocar um bloco dentro do personagem.
- **APROVADO — Bordas de chunks:** A edição na borda reconstrói os chunks vizinhos.
- **APROVADO — Coyote time e jump buffer:** Saltos toleram borda e comando antecipado.
- **APROVADO — Câmera com colisão:** A terceira pessoa recua antes do terreno.
- **APROVADO — Pointer Lock com fallback:** Falhas de captura do mouse geram orientação e comandos alternativos.
- **APROVADO — Suporte a gamepad:** Movimento, câmera e ações principais possuem mapeamento de controle.
- **APROVADO — Limite de edições:** O mundo bloqueia crescimento indefinido do mapa de edições.
- **APROVADO — Modo seguro automático:** Falhas de GPU podem reiniciar o módulo no perfil Econômico.
- **APROVADO — Fila de salvamento:** Gravações simultâneas são serializadas.
- **APROVADO — Interface de modo seguro:** A interface oferece recuperação e informa o backend de armazenamento.
- **APROVADO — Manifesto atualizado:** Manifesto identifica a integração 12, schema 11 e estado jogável.
- **APROVADO — Catálogo jogável:** O VoxelCraft permanece jogável e carregável nas versões posteriores à Fase 7.12.
- **APROVADO — Cache offline completo:** Todos os arquivos essenciais do VoxelCraft estão no shell offline.
- **APROVADO — Comunicação segura do iframe:** Mensagens de erro e modo seguro chegam ao runtime principal.

## Limite da validação

Os testes automatizados cobrem estrutura, persistência, proteções, integração e presença dos mecanismos. A sensação da câmera, conforto dos joysticks, desempenho e qualidade visual ainda devem ser conferidos em dispositivos reais.

