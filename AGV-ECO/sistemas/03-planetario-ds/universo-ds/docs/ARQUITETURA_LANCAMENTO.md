# Arquitetura do Centro de Lançamento

## Princípio central

A cena gráfica não é a fonte de verdade. O foguete desenhado pode ser reduzido, substituído por GLB ou descarregado sem perder a missão.

## Camadas

### Dados

`launchSystems.js` contém catálogos declarativos de missões, estágios, cargas, GNC, coifas, bases, checklist e falhas.

### Requisitos

`RocketSystem.js` recebe configuração simples e produz um resumo serializável:

```js
{
  validation,
  liftOffMassKg,
  twr,
  totalDeltaV,
  deltaVMargin,
  flightConfig
}
```

### Simulação

`RocketFlightModel.js` não acessa DOM, Canvas ou armazenamento. Ele pode ser executado em navegador, Worker ou testes Node.

### Concorrência

`launch.worker.js` controla frequência, pausa, velocidade, falhas e envio de telemetria.

### Renderização

`RocketSceneRenderer.js` apresenta o veículo com WebGL2/GLSL. Se WebGL2 falhar, utiliza Canvas 2D.

### Experiência

`LaunchModule.js` coordena formulários, checklist, Worker, gráfico, logs, XP e certificação.

## Física didática

A simulação utiliza aproximações adequadas ao objetivo educacional:

- equação do foguete para validar Δv;
- massa variável por consumo;
- gravidade dependente da altitude;
- densidade exponencial da atmosfera;
- arrasto quadrático;
- programa de inclinação;
- velocidade orbital circular como referência.

Ela não deve ser apresentada como ferramenta certificada de engenharia aeroespacial.

## Contrato para GLB futuro

Um veículo externo deverá fornecer:

- unidade em metros;
- origem no centro longitudinal;
- pivôs de separação;
- nomes estáveis de estágio e coifa;
- LOD baixo, médio e alto;
- materiais compartilhados;
- texturas KTX2 ou equivalentes;
- colisores simplificados;
- animações de separação opcionais.

O asset visual receberá o mesmo estado serializável já usado pelo renderizador procedural.
