# Guia de implantação — F94.11

**Base exigida para PATCH:** F94.10 v14.10.8.96.  
**Cache esperado:** `stage74-f9411-graphics-streaming`.

## Aplicação

1. Faça backup da F94.10 atualmente publicada.
2. Extraia o PATCH na raiz do pacote, sobrescrevendo os arquivos correspondentes; ou substitua pelo ZIP completo da F94.11.
3. Publique todos os arquivos juntos. Os GLBs de `lobby/assets/models/environment/f9411/` são parte da release.
4. Não aplique migrations SQL nem Edge Functions: F94.11 não altera backend.
5. Após publicar, faça reload forte/feche e reabra a aplicação para permitir troca do Service Worker.

## Smoke recomendado

Testar nesta ordem:

- Campus 3D abre e chega ao primeiro frame;
- alternar Econômico → Médio → Alto → Ultra em uma mesma posição;
- observar smart kiosks e troca de detalhe/LOD;
- caminhar entre setores do Campus e entrar/sair de interior;
- abrir Mirante 50× e confirmar que setores/assets necessários continuam disponíveis;
- Vale 3D: caminhar próximo e longe dos pylons; entrar/sair de interior;
- Rural 3D: aproximar/afastar das turbinas;
- alternar qualidade dentro de Vale e Rural;
- confirmar que não há loop de login nem bloqueio de boot se algum GLB opcional falhar.

## Critério de rollback

Reverter para F94.10 se ocorrer qualquer regressão de boot, criação do Campus 3D, câmera, interação ou erro recorrente de asset que impeça navegação. O backend não precisa de rollback porque não foi alterado.
