# Mapa de módulos e experiências

## Núcleo permanente

- app shell;
- perfis;
- configurações;
- benchmark;
- motor de missões;
- progresso;
- acessibilidade;
- telemetria comum;
- evidências;
- gerenciador de assets;
- áudio;
- diagnóstico.

## Módulos de conteúdo

### Academia DS

Fundamentos de sistemas, entradas, processamento, saídas, estados, eventos, validação e testes.

### Museu da Computação Espacial

História, pessoas, computadores, linguagens, limitações, evolução e desafios contextualizados.

### Centro de Controle

Telemetria, logs, máquinas de estados, filas, anomalias, segurança e tolerância a falhas.

### Terra e Órbitas — disponível

Globo procedural, cinco regimes orbitais, período, velocidade, cobertura, satélites modulares, energia, dados, estações de solo, Worker e telemetria JSON.

### Foguetes e Lançamentos — disponível

Hangar procedural, montagem, massa, Δv, checklist, Worker físico, Max Q, separação, telemetria, falhas e inserção orbital.

### Lua e Apollo — disponível

Linha do tempo, arquitetura Apollo, computador didático, memória, prioridades, alarmes, Assembly, terreno procedural, Worker de descida, pouso, EVA, rover, amostras e certificação.

### Marte e Robótica

Rovers, sensores, visão, navegação autônoma, dados e atraso de comunicação.

### Estação Espacial

Sistemas distribuídos, energia, suporte à vida, inventário, acoplamento e manutenção.

### Observatório

Imagens, filtros, espectros, classificação, dados e universo profundo.

### Indústria espacial

NASA, agências internacionais, empresas privadas, SpaceX, empreendedorismo e desenvolvimento iterativo. Informações proprietárias nunca serão apresentadas como fatos sem fonte pública.

## Contrato mínimo de módulo

```js
export function createModule() {
  return {
    mount(container, context) {},
    unmount() {}
  };
}
```

O `unmount` deve cancelar timers, listeners, áudio, workers e recursos gráficos.


### Marte e Robótica — disponível

- história e arquitetura de missões marcianas;
- rover procedural e telemetria em Worker;
- atraso, fila, ACK e idempotência;
- navegação A* com custos de terreno;
- visão computacional didática;
- banco científico e exportação JSON;
- drone e falhas operacionais.
