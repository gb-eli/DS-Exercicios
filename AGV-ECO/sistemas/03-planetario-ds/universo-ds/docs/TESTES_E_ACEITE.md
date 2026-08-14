# Testes e critérios de aceite

## Funcionais

- portal abre sem dependências externas;
- tutorial pode avançar e ser concluído;
- qualidade muda sem recarregar;
- benchmark produz recomendação;
- perfil pode ser criado, selecionado e excluído;
- XP persiste após recarregar;
- Academia conclui somente com respostas válidas;
- Centro de Controle básico injeta e resolve anomalia;
- Centro Avançado inicia e encerra o Worker;
- máquina de estados bloqueia comandos fora de ordem;
- fila mantém prioridade e backpressure;
- replay armazena e analisa amostras;
- radar possui fallback sem WebGL2;
- globo terrestre possui fallback sem WebGL2;
- órbitas recalculam período, velocidade e cobertura;
- satélite rejeita massa, energia, missão ou downlink incompatíveis;
- Worker orbital encerra ao sair;
- voltar ao portal encerra timers do módulo;
- apagar dados reinicia o ambiente.

## Responsividade

Testar em larguras de 320, 360, 390, 412, 768, 1024, 1366 e 1920 px.

## Desempenho

- núcleo visual deve manter interação mesmo em perfil baixo;
- nenhuma experiência futura pode ser importada no carregamento inicial;
- timers e listeners precisam ser removidos ao sair;
- queda de WebGL deve manter interface utilizável;
- recursos futuros devem possuir orçamento por módulo;
- perfil Desempenho reduz frequência, amostras e densidade do radar;
- sair do Centro Avançado encerra Worker, radar e observadores;
- sair da Terra encerra Worker orbital, renderizador, timers e listeners;
- perfil Desempenho reduz segmentos, resolução, nuvens e frequência orbital.

## Acessibilidade

- navegação por teclado;
- foco visível;
- textos fora do canvas;
- redução de movimento;
- contraste suficiente;
- controles com rótulos;
- nenhuma informação essencial somente por cor.

## Publicação

- todos os caminhos devem ser relativos;
- `.nojekyll` presente;
- workflow aprovado;
- manifesto válido;
- Service Worker sem arquivos inexistentes;
- teste em URL real do Pages.

## Fase 10

- plano rejeita duração inferior a 25 minutos;
- checkpoints são sequenciais;
- ociosidade não conta como participação ativa;
- terceiro aviso encerra a sessão;
- liberação antecipada exige código e motivo;
- evidência exporta JSON e HTML;
- Classroom abre somente URL HTTPS salva;
- backup preserva perfis e configurações;
- alto contraste e texto ampliado não quebram layouts;
- WebXR é opcional e possui fallback 360°;
- o módulo libera RAF, contexto e listeners ao sair.
