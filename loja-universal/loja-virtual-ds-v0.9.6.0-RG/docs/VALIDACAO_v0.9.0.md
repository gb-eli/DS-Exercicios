# Validação — Loja Virtual DS v0.9.0

## Escopo

A validação desta versão cobriu o SDK universal, os contratos de eventos, os adaptadores de plataforma, a fila offline, a ponte `postMessage`, a migração da v0.8.0, a central visual de integração e a preservação dos recursos gráficos anteriores.

## Testes automatizados do SDK

Executados por `tests/test_sdk_node.js`:

- missão válida autorizada;
- reenvio do mesmo `eventId` recusado como duplicidade;
- evento de laboratório recusado no adaptador do Desafio DS;
- recompensa administrativa de 50.000 moedas encaminhada para análise;
- evento enviado por ponte `postMessage` autorizado;
- evento sem transporte guardado na fila local;
- fila reprocessada sem duplicar crédito.

## Validação estrutural

Executada por `tests/validate_v09.py` e verificadores adicionais:

- 10 plataformas registradas;
- 16 tipos de recompensa reconhecidos;
- 10 arquivos de adaptador encontrados;
- 50 arquivos JSON analisados;
- 39 arquivos GLB com cabeçalho válido;
- schemas de evento e resposta válidos;
- nenhum `platformId` duplicado;
- nenhum ID HTML duplicado;
- todas as referências estáticas do HTML encontradas;
- sintaxe JavaScript aprovada em núcleo, SDK, configuração e demonstração.

## Verificação visual

O Chromium deste ambiente bloqueia navegação direta para `localhost` e `file://` por política administrativa. Para não afirmar um teste que não ocorreu, a página foi verificada com Playwright por conteúdo integralmente injetado em `about:blank`, preservando HTML, CSS e scripts da versão.

Resultados:

- central de integração abriu no desktop;
- 10 adaptadores renderizados;
- 10 plataformas disponíveis no seletor;
- evento de missão autorizado;
- reenvio do mesmo ID recusado como `DUPLICATE_EVENT`;
- nenhuma exceção JavaScript;
- layout móvel testado em 390 × 844;
- largura do documento igual à largura da tela, sem transbordamento horizontal.

O relatório bruto está em `docs/browser-test-v090.json`.

## Arquivos de prévia

- `assets/previews/v0.9.0-integration-desktop.png`
- `assets/previews/v0.9.0-integration-result.png`
- `assets/previews/v0.9.0-integration-mobile.png`

## Resultado

**PASS** para a fundação do SDK, integração direta, fila offline, ponte entre janelas, contratos, adaptadores, responsividade e migração local.

## Limite de segurança

O SDK fornece consistência, idempotência e rastreabilidade no navegador. Assinaturas autoritativas, sincronização entre dispositivos e proteção absoluta contra controle local continuam exigindo serviço externo ou validador administrativo protegido.
