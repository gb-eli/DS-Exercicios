# COSMOS DS — Entrega da Fase 17

## Objetivo

Integrar o pipeline GLB/PBR/HDR da Fase 16 diretamente aos laboratórios imersivos, sem remover o cenário procedural e sem aumentar o carregamento inicial do portal.

## Laboratórios integrados

### Lançamentos Imersivos 360°

- Aurora L, Atlas H e Phoenix R usam o asset `rocket`;
- Horizon STS usa o asset `shuttle`;
- as câmeras de inspeção, plataforma, motores, cabine, perseguição e voo alteram a apresentação do asset;
- o Worker de voo e a telemetria permanecem independentes da camada GLB.

### Estação Espacial Imersiva 360°

- visões externas usam `station`;
- cabine e aproximação usam `capsule`, `shuttle` ou `satellite` conforme o veículo;
- perseguição orbital usa `satellite`;
- voo 6DOF, RCS e acoplamento continuam no modelo físico existente.

### Lua e Marte Imersivos 360°

- módulo lunar usa `lander`;
- astronauta usa `suit`;
- rover lunar e rover marciano usam `rover`;
- drone utiliza a representação `satellite` do starter pack;
- terreno, poeira, tempestade e objetivos permanecem no shader procedural e no Worker planetário.

### Museu Visual Espacial 3D

As doze peças foram associadas a oito famílias premium:

- foguetes → `rocket`;
- cápsula → `capsule`;
- módulo lunar → `lander`;
- ônibus espacial → `shuttle`;
- traje → `suit`;
- rover → `rover`;
- sondas e satélites → `satellite`;
- estações → `station`.

## Composição visual

A Fase 17 utiliza duas camadas:

1. cenário procedural, responsável pelo ambiente, terreno, atmosfera, partículas e fallback;
2. canvas GLB transparente, responsável pelo modelo premium, PBR e reflexão HDR.

Essa composição evita que uma falha de asset interrompa o laboratório.

## LOD adaptativo

- Desempenho: LOD 0;
- Equilibrado: LOD 1;
- Máxima experiência: LOD 2.

Mudanças de qualidade recarregam somente o LOD necessário.

## Diagnóstico na HUD

Um indicador compacto mostra:

- GLB ativo ou fallback procedural;
- LOD selecionado;
- triângulos;
- tempo de carregamento;
- perda de contexto;
- falha do pacote.

O aluno pode tocar no indicador para ocultar ou reativar a camada premium.

## Deep links

Os módulos podem ser abertos diretamente:

```text
?module=launch-remaster
?module=station-remaster
?module=planetary-remaster
?module=visual-museum
```

## Limite atual

Os GLBs do starter pack são modelos autorais leves e ainda possuem complexidade baixa. A Fase 17 valida a integração real, o LOD e o material, mas não representa ainda o patamar final de fotorealismo. Animações internas de nós glTF, rodas, portas e braços ficam para o próximo ciclo.
