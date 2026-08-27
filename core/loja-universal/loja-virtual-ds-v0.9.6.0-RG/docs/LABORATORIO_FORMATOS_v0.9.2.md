# Laboratório de Formatos v0.9.2

## Objetivo

Testar alterações de formato sem tocar nos arquivos mestres. Esta fase preserva todos os assets e mede apenas cópias isoladas.

## GLB e transferência

Foram analisados 39 GLBs. O volume original de 263.1 KB caiu para 57.4 KB com Gzip e 46.0 KB com Brotli. A redução foi de 78.18% e 82.52%, respectivamente.

A participação média do chunk JSON foi de 77.16%. Isso ocorre porque os modelos da base são pequenos, mas mantêm nomes de nós, slots e muitos canais de animação. Apagar nomes para reduzir alguns bytes não é aceitável, pois eles fazem parte do contrato de equipamentos.

## Imagens

Foram produzidas variantes WebP e AVIF reais. Os arquivos estão em `lab/formats/image-formats/` e as métricas completas em `reports/image-format-comparison.json`.

## KTX2/BasisU

Nenhum arquivo KTX2 foi fabricado artificialmente. A adoção exige encoder nativo, validação `KHR_texture_basisu`, teste de transcodificação no navegador e comparação de memória GPU. O pipeline e os comandos estão documentados em `docs/TOOLCHAIN_FORMATOS_OPCIONAIS.md`.

## Meshopt e Draco

Os executáveis nativos não estavam disponíveis neste ambiente. Por isso:

- não há percentuais inventados;
- nenhuma extensão foi inserida manualmente;
- os GLBs originais permanecem a fonte de verdade;
- a v0.9.3 só poderá usar Meshopt/Draco quando a conversão real passar pelos gates de rig, clips, slots e renderização.

## Decisão

1. Ativar compressão HTTP no hosting/CDN quando possível.
2. Usar WebP para miniaturas e previews.
3. Remover artes conceituais do pacote de execução, sem apagá-las.
4. Criar pacotes gráficos separados antes de novos assets pesados.
5. Manter Meshopt/KTX2 como candidatos bloqueados por teste real.
