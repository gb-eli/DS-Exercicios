# Relatório de validação — Fase 5

## Resultado

A validação automatizada foi aprovada. O diretório final contém **86 arquivos** e aproximadamente **448 KB** de conteúdo lógico antes da compactação.

```text
COSMOS DS Fase 5 validado: 37 arquivos JavaScript e 34 arquivos obrigatórios.
Testes concluídos: núcleo, oito módulos, sistemas críticos, órbitas, foguete, Worker de lançamento e qualidade adaptativa.
```

## Cobertura validada

### Estrutura

- oito módulos disponíveis no registro;
- carregamento dinâmico do Centro de Lançamento;
- imports relativos existentes;
- manifesto PWA válido;
- Service Worker válido;
- versão `5.0.0`;
- chaves CSS equilibradas;
- todos os arquivos críticos da fase respondendo HTTP 200.

### Sistema de foguete

- configuração padrão válida;
- configuração incompatível bloqueada;
- relação empuxo/peso positiva;
- margem de Δv positiva;
- quatro perfis de missão;
- múltiplos primeiros estágios e estágios superiores;
- oito intertravamentos;
- quatro falhas verificáveis.

### Modelo de voo

- início da contagem regressiva;
- ignição;
- Max Q;
- consumo de propelente;
- separação;
- segundo estágio;
- inserção orbital;
- conclusão em estado `ORBIT` para a configuração padrão;
- pressão dinâmica calculada;
- deriva de sensor e recuperação por votação.

### Worker

- configuração serializável;
- estado e massa enviados por mensagem;
- pausa, retomada, reset, abortagem, velocidade e falhas disponíveis;
- encerramento após órbita, falha ou abortagem.

### Persistência e desempenho

- XP idempotente;
- módulos das fases anteriores preservados;
- redução automática de qualidade preservada;
- perfis gráficos compartilhando a mesma física.

## Teste HTTP

Responderam `200 OK`:

- `index.html`;
- `src/main.js`;
- `src/styles.css`;
- módulo de lançamento;
- renderizador do foguete;
- Worker de lançamento;
- modelo e validador;
- catálogo de dados;
- manifesto;
- Service Worker.

## Limitação do ambiente

O Chromium headless disponível no ambiente não concluiu a inicialização gráfica e apresentou falhas relacionadas a DBus/EGL. Por isso:

- não foi possível produzir captura visual confiável;
- o shader GLSL não foi validado por uma GPU real neste ambiente;
- gestos, safe areas e consumo de bateria precisam de playtest físico.

O código possui fallback Canvas 2D, mas a aparência final de ambos os caminhos deve ser conferida em dispositivos reais.

## Matriz de playtest recomendada

- Android 360 × 800 em modo Desempenho;
- Android 412 × 915 em modo Equilibrado;
- iPhone em Safari, incluindo safe area;
- Chromebook escolar;
- notebook Windows 11 com GPU integrada;
- computador de demonstração em Máxima experiência.

## Critérios para publicação

Antes de aplicar com estudantes:

1. abrir o módulo em cada classe de dispositivo;
2. completar construtor e checklist;
3. executar um voo até `ORBIT`;
4. testar pausa, retomada, abortagem e reset;
5. injetar as quatro falhas;
6. confirmar que sair do módulo encerra Worker e animação;
7. confirmar atualização do cache após publicar a Fase 5.
