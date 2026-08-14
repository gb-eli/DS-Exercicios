# Arquitetura — Universo Profundo e Museu Visual

## Separação de responsabilidades

```text
DOM / HUD
   ↓
ImmersiveInputController
   ↓
DeepSpaceNavigationModel ou MuseumExperienceModel
   ↓
DeepSpaceSceneRenderer ou SpaceMuseumSceneRenderer
```

A simulação e a progressão não vivem em objetos WebGL. O renderizador recebe snapshots serializáveis e pode ser reiniciado sem perder o estado educacional.

## Universo Profundo

`DeepSpaceNavigationModel` controla:

- destino;
- câmera;
- posição e velocidade;
- energia;
- visitas;
- escaneamentos;
- transição de dobra;
- modo foto.

`DeepSpaceSceneRenderer` controla:

- shader volumétrico;
- destinos visuais;
- campo estelar;
- ray marching;
- resolução adaptativa;
- fallback;
- context loss;
- descarte de programa e VAO.

## Museu Visual

`MuseumExperienceModel` controla:

- galeria atual;
- peça selecionada;
- caminhada;
- câmera;
- inspeções;
- interiores;
- mecanismos;
- catálogo.

`SpaceMuseumSceneRenderer` controla:

- salão procedural;
- pedestal;
- doze representações SDF;
- primeira pessoa;
- câmera orbital;
- interior;
- iluminação;
- materiais;
- fallback e lifecycle.

## Preparação para assets premium

Os IDs das peças e destinos são estáveis. Modelos GLB, texturas KTX2 e LODs poderão ser integrados futuramente sem alterar os contratos de progressão e controles.
