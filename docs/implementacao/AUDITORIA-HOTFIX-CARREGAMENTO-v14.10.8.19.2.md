# Auditoria — Hotfix de carregamento v14.10.8.19.2

Data: 25/08/2026

## Incidente

Foi reportado que um aluno do 1DS ficava indefinidamente em **“Carregando sua área...”** no Portal de Exercícios. O Hub podia redirecionar novamente para Atividades por existir uma sessão local válida, produzindo um ciclo sem saída operacional.

## Causa técnica

O bootstrap do Portal aguardava sequencialmente autenticação, perfil, verificação complementar de staff, turma, acomodação e dashboard. Algumas dessas requisições não possuíam timeout. Além disso, o dashboard aguardava o Hub de plataformas/telemetria antes de exibir a área principal. Uma chamada pendente podia, portanto, manter a tela de loading indefinidamente.

## Correções

- Timeout de 10 s nas consultas críticas.
- Timeout reduzido nas dependências opcionais.
- `staff_status` deixa de bloquear aluno comum.
- Falha/timeout de acomodação usa política padrão em vez de impedir entrada.
- Hub de plataformas passa a carregar em segundo plano.
- Watchdog global de inicialização.
- Tela de erro recuperável com **Tentar novamente** e **Renovar sessão**.
- Mensagem de etapa atual durante o carregamento.
- Telemetria de timeout/erro de bootstrap.

## Garantias preservadas

- Sessão não é apagada em timeout comum.
- Arquivos do aluno não são alterados pelo hotfix.
- Salvamento, RLS, liberações e políticas de segurança permanecem inalterados.
- Renovação de sessão só ocorre por ação explícita do usuário.

## Testes

O conjunto crítico P10.9.17–P10.9.21 foi executado com **31/31 testes aprovados**. O teste específico `p10921-portal-loading-resilience-v14.10.8.19.2.test.mjs` valida timeout, watchdog, degradação de staff/acomodações, Hub não bloqueante, recuperação manual e cache-bust.

A suíte histórica completa contém asserts antigos de versionamento/cache fixados em versões anteriores; por isso não é utilizada como gate único desta release.
