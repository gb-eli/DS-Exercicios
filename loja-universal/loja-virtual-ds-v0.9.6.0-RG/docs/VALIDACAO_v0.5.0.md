# Validação v0.5.0

## Resultado

- 36 arquivos GLB de equipamento válidos.
- 36 prévias WebP e PNG.
- 16 slots presentes nos três LODs do avatar.
- 49 itens no catálogo, sem IDs duplicados.
- Todos os itens 3D possuem caminho de modelo e miniatura.
- Cinco presets com IDs válidos.
- Fallback Base64 para avatar e equipamentos.
- Scripts JavaScript aprovados em verificação sintática.
- Catálogo, assets, avatar e Design System aprovados pelos validadores locais.

## Testes funcionais previstos

- Aplicar e remover equipamento.
- Substituir ocupante de slot.
- Equipar par de botas.
- Aplicar presets.
- Alternar LOD.
- Executar animações com itens acompanhando o rig.
- Abrir em desktop e celular.

## Limitação

A fase v0.5.0 não inclui ainda o sistema final de partículas, auras, fogos, falas animadas ou pós-processamento. Esses recursos pertencem à v0.6.0.

## Verificação visual automatizada

O Chromium disponível no ambiente bloqueou navegação local e `file://` por política administrativa (`ERR_BLOCKED_BY_ADMINISTRATOR`). Por isso, a entrega não declara uma captura automática do WebGL. Foram executadas validações independentes de GLB, hierarquia, slots, catálogos, caminhos, scripts, HTML e lógica de presets. As pranchas de equipamentos foram renderizadas diretamente a partir da geometria usada nos GLBs.
