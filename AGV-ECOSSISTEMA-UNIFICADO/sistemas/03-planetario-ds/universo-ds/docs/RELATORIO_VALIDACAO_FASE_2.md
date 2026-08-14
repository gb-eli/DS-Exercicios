# Relatório de Validação — Fase 2

## Testes automatizados aprovados

- EventBus;
- persistência JSON local;
- quatro perfis gráficos;
- redução automática de qualidade;
- criação e seleção de perfil;
- cálculo de nível;
- XP idempotente;
- carregamento de cinco módulos;
- existência de sete ou mais marcos históricos;
- coerência Mercury → Gemini → Apollo;
- fontes HTTPS para marcos;
- oito dossiês de pessoas;
- seis linguagens e cinco cenários;
- integridade das respostas dos desafios;
- limpeza exclusiva das chaves do COSMOS DS;
- manifesto PWA e referências do Service Worker.

Comando executado:

```bash
npm run validate
```

Resultado:

```text
COSMOS DS Fase 2 validado: 18 módulos JavaScript e 15 arquivos obrigatórios.
Testes concluídos: núcleo, XP idempotente, cinco módulos, curadoria da Fase 2 e qualidade adaptativa.
```

## Verificação HTTP

O servidor estático respondeu corretamente ao arquivo inicial com status `200 OK`.

## Limitação do ambiente de teste visual

A automação Chromium/Playwright foi impedida pela política administrativa do navegador do ambiente, retornando `ERR_BLOCKED_BY_ADMINISTRATOR` inclusive para `localhost` e `file://`. Portanto, capturas e cliques automatizados não puderam ser concluídos aqui.

Os testes visuais ainda devem ser executados em:

- Android intermediário;
- iPhone 13/14/15 ou equivalente;
- Chromebook escolar;
- notebook com GPU integrada;
- computador com perfil Máxima experiência.

## Checklist manual sugerido

1. abrir e fechar todos os cinco módulos;
2. alternar os quatro perfis gráficos;
3. ativar Reduzir movimento;
4. concluir cada checkpoint duas vezes e confirmar que o XP não duplica;
5. testar retrato e paisagem no celular;
6. instalar como PWA;
7. testar recarregamento offline após primeiro acesso;
8. verificar legibilidade das tabelas com rolagem horizontal.
