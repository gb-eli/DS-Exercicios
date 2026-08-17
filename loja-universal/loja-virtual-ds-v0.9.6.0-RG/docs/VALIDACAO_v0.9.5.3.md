# Validação v0.9.6.0-RG

- 39 arquivos Gzip descompactados e comparados por SHA-256.
- GLBs originais preservados.
- Avatar e preview de produto usam o mesmo parser GLB.
- Fallback para original preservado.
- Pacotes e Service Worker atualizados.
- Nenhum recurso visual foi reduzido.

## Resultado final

- 16 grupos de regressão aprovados.
- 39 GLBs compactados e descompactados com igualdade byte a byte.
- 39 GLBs originais idênticos à v0.9.5.2.
- Redução de transferência 3D de 82,69%.
- Chromium confirmou solicitação `.glb.gz` sem solicitar o GLB original.
- Nenhum erro de console ou de página.
- Layout móvel sem overflow horizontal em 390 × 844.
- Meshopt e KTX2 continuam bloqueados até existir toolchain nativa e inspeção visual.
