# Validação v0.9.6.0-RG

- SHA-256 dos assets visuais comparado com v0.9.5.1.
- 197 de 197 assets idênticos.
- Nenhum GLB, VFX ou equipamento removido.
- Loader ES Module e importações dinâmicas presentes.
- Arquivos Base64 ausentes do runtime inicial.
- CSS dividido em camadas com ordem determinística.
- Validação sintática e teste HTTP executados pelo script `tests/validate_modular_runtime_v0952.py`.

- Configurações de economia e loja verificadas no boot.
- URLs dinâmicas verificadas para publicação em subdiretório do GitHub Pages.

## Resultado final

- 16 grupos de regressão aprovados.
- Nenhum erro sintático JavaScript.
- 197 de 197 assets gráficos idênticos à v0.9.5.1.
- Módulos pesados ausentes da abertura e carregados ao acessar suas telas.
- Avatar, VFX, Benchmark, pacotes, SDK e preview de produto carregados sob demanda.
- CSS aplicado corretamente em desktop e celular.
- Nenhum erro de console ou de página no teste modular.
- Nenhum overflow horizontal em 390 × 844.
- O Chromium desta execução não disponibilizou WebGL; o fallback vetorial foi validado e os GLBs foram conferidos estruturalmente.
