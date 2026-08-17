# Prompt de Integração — Loja Virtual DS v0.9.2

Integre a Loja Virtual DS preservando integralmente o catálogo, a carteira, o inventário, os modelos 3D, as animações e o SDK existentes.

## Regras obrigatórias

1. Não substituir os GLBs oficiais por versões Meshopt ou Draco sem conversão nativa, validação estrutural e comparação visual.
2. Não substituir texturas 3D por KTX2/BasisU sem validar `KHR_texture_basisu`, transcodificação no navegador e memória GPU.
3. Usar WebP para miniaturas e previews conforme a matriz `reports/format-decision-matrix.json`.
4. Manter PNG e SVG como fontes mestres quando aplicável.
5. Retirar artes conceituais e capturas históricas do pacote de execução, mas preservá-las no pacote documental.
6. Manter URLs versionadas e imutáveis para assets.
7. Preparar a arquitetura para pacotes Essencial, Equilibrado, Alto, Ultra e Cinemático.
8. Não carregar assets de alta qualidade sem solicitação do usuário.
9. Preservar nomes de nós, slots, rig, 18 clips por LOD e IDs permanentes.
10. Executar `tests/run_regression.sh` e `tests/validate_formats.py` antes de publicar.

## Decisões aprovadas nesta fase

- GLB continua como formato principal.
- Compressão de transferência Gzip/Brotli é altamente vantajosa.
- WebP q80–90 é recomendado para miniaturas e VFX.
- AVIF q80 é indicado principalmente para artes grandes e documentação fora do runtime.
- Meshopt, Draco e KTX2 permanecem candidatos condicionais, não padrões ativos.
