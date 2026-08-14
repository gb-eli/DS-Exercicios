# Validação — Loja Virtual DS v0.9.5

## Resultado geral

- Regressão completa: **PASS** em 14 grupos.
- JavaScript: nenhum erro sintático.
- Produtos preservados: **71**.
- Equipamentos GLB preservados: **36**.
- Avatar: três LODs com **28 clips** em cada um.
- VFX preservados: **17**.
- Modos oficiais preservados: Básico, Intermediário, Avançado, Ultra e Realismo.

## Benchmark

O motor possui oito etapas reais: sistema, CPU, Web Worker, shaders, upload de texturas, partículas, estabilidade de frames e armazenamento. O relatório é persistido por dispositivo em IndexedDB, com resumo em armazenamento local.

O modo Automático utiliza o resultado avançado salvo por até 45 dias, combinado com a sondagem leve da sessão. Um novo resultado emite `ds-advanced-benchmark-complete` e atualiza a recomendação sem instalar pacotes pesados.

## Navegador

O Chromium foi executado em desktop 1440 × 1000 e mobile 390 × 844. Foram confirmados:

- nove estados visuais da trilha, incluindo conclusão;
- cinco linhas de comparação dos modos;
- resultado visível após o teste rápido;
- nenhum erro de console;
- nenhum overflow horizontal.

O WebGL não ficou disponível nessa execução isolada e o benchmark utilizou os fallbacks previstos. Os resultados numéricos dessa máquina não representam recomendação para o computador do usuário; validam apenas o fluxo funcional.

## Segurança

- Pacotes Ultra e Realismo nunca são preparados automaticamente.
- A recomendação não é aplicada sem clique.
- O teste pode ser cancelado.
- A execução é interrompida se a aba ficar oculta.
- As projeções de FPS são identificadas como estimativas.
