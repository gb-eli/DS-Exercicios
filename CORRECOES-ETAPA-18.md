# Correções — Etapa 18

## Escopo
Responsividade e desempenho real do Lobby/Lab em celular, tablet e notebook, sem alteração de regras pedagógicas, autenticação, banco ou adaptações.

## Lobby / Vale
- Limite efetivo de FPS em touch: 30 FPS para perfil restrito e 45 FPS para touch mais forte.
- Qualidade persistida High/Ultra é limitada no boot mobile para evitar travamento inicial; o usuário ainda pode alterar manualmente depois.
- Vale passou a usar o mesmo detector de memória, CPU, rede e ponteiro do Campus.
- HUD mobile reorganizado para evitar sobreposição/overflow em 360–430 px.
- Ações/status usam rolagem horizontal contida, safe-area e `dvh`.
- Layout específico para telefone em landscape de baixa altura.

## LABDS
- Perfil Economy também considera celular com até 4 GB / 4 núcleos.
- Orçamento compartilhado de `pixelRatioCap` e `targetFps`.
- Novo `PerformanceManager.canvasScale()` aplicado a dez módulos Canvas.
- Economy reduz blur, sombras, transições e animações puramente decorativas.
- Sessão fixa respeita safe-area e não cobre o conteúdo.
- Alvos touch críticos têm no mínimo 44 px.

## Auditoria mobile histórica
O teste P10.9.9 não cria métricas sintéticas. Se os arquivos históricos existirem, compara before/after; se não existirem, valida diretamente os contratos responsivos e de cache atuais.

## Resultado
- Etapa 18: 12/12 PASS.
- P10.9.9 mobile/tablet: 9/9 PASS.
- P5 mobile recovery: PASS.
- validadores do Lobby/Lab e Etapas 10–17: PASS.
- suíte geral: 368/376 PASS, 8 falhas restantes fora desta etapa.
