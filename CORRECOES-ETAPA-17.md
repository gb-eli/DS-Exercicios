# Correções — Etapa 17

## Escopo
Laboratório Virtual DS, atividades práticas e herança de adaptações pedagógicas.

## Problemas encontrados
1. O boot do Laboratório abortava completamente quando a sessão institucional estava válida, mas a chamada de sincronização `lab-virtual-core` falhava.
2. O Laboratório não consumia o `learning_mode` global do aluno, então recursos pedagógicos configurados no Portal de Atividades não acompanhavam o estudante até o Lab.
3. O fullscreen compartilhado não consultava a política de acomodação global nas plataformas integradas.
4. Inserções/edições posteriores no roster privado de adaptações não reconciliavam automaticamente perfis já existentes.
5. `normalized_name` do roster privado dependia de preenchimento manual correto.

## Correções implementadas
- Autenticação e sincronização do Core foram separadas.
- Sessão válida libera a prática mesmo quando a sincronização de progresso está temporariamente indisponível.
- O modo degradado mantém `authority='agv-core'`, portanto não cria XP/créditos locais falsos.
- O Lab carrega a acomodação global `learning_mode` e a preferência `adapted/conventional` do próprio aluno.
- Perfis adaptados podem aplicar redução de carga visual, controles maiores, modo motor, feedback previsível, microetapas e estudo domiciliar.
- A vitrine automática é pausada quando a acomodação pede baixa carga visual/previsibilidade.
- Fullscreen compartilhado respeita `home_study`, `relaxed` e `require_fullscreen=false`.
- Migration `064_p10932_lab_adaptation_reconciliation.sql` normaliza o roster privado, cria gatilho de reconciliação e reaplica o roster aos perfis existentes.
- Nenhum nome de aluno foi adicionado ao frontend, migration pública ou testes.

## Banco
A migration 064 deve ser aplicada no mesmo Supabase usado pelo pacote (`iresvqwyaqotghjssncg`) depois das migrations 049/050.

O projeto `iresvqwyaqotghjssncg` não estava entre os projetos Supabase conectados nesta sessão; por segurança, nenhuma alteração foi aplicada em outro banco.

## Validação
- Etapa 17: 10/10 PASS.
- Contratos de adaptação/carregamento/integração: 21/21 PASS.
- Validadores das Etapas 10–16: PASS.
- Validadores oficiais Cidade/Interiores/Cidade Viva/Mobilidade/Auth: PASS.
- Suíte geral comparável: 359/368 PASS, mesmas 9 falhas anteriores.
