# Validação do pacote — v7

Data: 13/08/2026.

## Preservação das fontes

O pacote continua baseado nas árvores canônicas declaradas em `manifesto-plataformas.json`. As integrações foram adicionadas como camadas do Core/adaptadores; conteúdo visual e mecânicas das plataformas não foram substituídos por outra aplicação.

## Estado implementado nesta versão

- CTF P1 centralizado conforme documentação v5;
- LAB Virtual: 50 ferramentas + 88 conclusões + 88 recompensas no Core;
- economia das conclusões do LAB preserva 5.195 XP e 1.979 Créditos Tech;
- bônus por nível e marcos de exploração server-side;
- Console Professor adicionado sem gabaritos embutidos;
- tabela privada `activity_teacher_content` + Edge `agv-teacher-activity`;
- 88 referências do LAB Virtual carregadas no backend;
- importador privado de DS1/DS2/DS3/Sub validado: 88 referências / 168 arquivos de solução preparados fora da árvore pública.

## Testes executados

Passaram 11 testes executáveis:

1. LAB AGV Core P1;
2. Hardware case structure;
3. Hardware family/inspection/cinema;
4. Hardware layout — 19.200 configurações;
5. Hardware materials;
6. Hardware peripherals — 5.850 combinações;
7. Hardware system benchmark/incident;
8. Hardware thermal engine;
9. Module registration — 42 módulos;
10. AGVCoreSDK;
11. Modo Professor.

Também passaram `node --check` nos arquivos JavaScript modificados e parsing dos JSONs centrais.

Detalhes: `docs/TESTE-P1-LAB-VIRTUAL-v7-2026-08-13.txt`.

## Baseline conhecido do validador geral

`tools/validate-project.mjs` continua retornando 1 erro porque referencia `tools/test-hardware-assembly.mjs`, arquivo ausente na árvore recebida originalmente. Os testes reais disponíveis passaram; o pacote não fabrica um arquivo de teste inexistente apenas para mascarar esse baseline.

## Segurança

- scan de frontend: 0 `sb_secret`, 0 service-role hardcoded, 0 private key, 0 Stripe secret;
- publishable key é pública e aparece onde necessária;
- `activity_teacher_content`: RLS ativo;
- grants diretos: somente `service_role`; `anon`/`authenticated` sem acesso;
- `agv-teacher-activity`: JWT obrigatório e escopo professor→turma server-side;
- conteúdo gerado pelos pacotes Professor não está neste ZIP público.

Security Advisor mantém dois WARNs conhecidos, documentados em `docs/SUPABASE-CORE-STATUS-2026-08-13.md`:

- RPC legado `claim_core_reward(...)` SECURITY DEFINER executável por authenticated;
- Leaked Password Protection desabilitada.

## Limite desta entrega

A Loja Tech/inventário do LAB ainda não foi migrada integralmente para a Loja Universal. Desafio DS/Game Informática e demais plataformas seguem como próximos P1/P2. As 88 referências privadas de programação foram preparadas por importador, mas não são embarcadas no pacote público; devem ser ingeridas server-side ao integrar os LABs de exercícios.
