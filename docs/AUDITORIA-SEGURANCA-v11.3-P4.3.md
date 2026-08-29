# Auditoria de Segurança — AGV Ecossistema Unificado v11.3 / P4.3

Data: 14/08/2026
Escopo: frontend estático, Supabase Auth/Data API/RLS, RPCs, Edge Functions, Lobby, portal de atividades, CTF, Lab Virtual e economia do AGV Core.

## Objetivo

Reduzir a capacidade de um usuário autenticado tentar derrubar o sistema, alterar dados fora do próprio escopo, obter respostas/conteúdo reservado, burlar liberação pedagógica ou receber XP/moedas/recompensas indevidas. Registrar IP e sinais de segurança no servidor sem confiar em dados enviados pelo JavaScript.

## Achados críticos corrigidos

1. `authenticated` possuía `TRUNCATE` em `lobby_presence`. RLS não protege TRUNCATE. Revogado; a tabela passou a ser somente leitura direta para o navegador.
2. `authenticated` possuía privilégios excessivos, incluindo `TRUNCATE`, em `activity_catalog`. Revogados; somente SELECT permanece.
3. RPC econômico legado já havia sido restringido a `service_role`; foi revalidado nesta auditoria.

## Proteções P4.3

- Todas as tabelas públicas permanecem com RLS habilitado.
- Escrita do Lobby passa pela Edge Function `lobby-presence`; DML direto do usuário autenticado foi removido.
- Rate limiting atômico server-side por usuário + IP em endpoints sensíveis.
- Limite de tamanho de request em atividades/arquivos/supervisão/Lobby.
- Correção de IDOR/BOLA latente para exercícios com `class_id` explícito.
- Conteúdo de professor permanece protegido por RLS e não é fornecido ao aluno.
- IP obtido server-side com prioridade `cf-connecting-ip`, depois `x-real-ip`, com `x-forwarded-for` apenas como fallback.
- Geolocalização em cache armazena apenas país, UF/região, cidade, ASN/organização e resultado do lookup. JSON bruto é descartado.
- Acesso geolocalizado com confiança fora do Paraná recebe `severity=critical` e `risk_code=outside_parana`.
- Geolocalização desconhecida/inconclusiva não é classificada automaticamente como ataque.
- O alerta fora do Paraná não bloqueia a conta automaticamente; exige revisão administrativa para evitar falso positivo de VPN/rede móvel.
- Feed global com IP/ASN/localização é restrito a `admin` e `super_admin`.
- Eventos podem ser marcados como revisados.
- Retenção técnica: eventos de segurança por 180 dias; cache e rate limits são podados server-side.

## Eventos suspeitos centralizados

Exemplos: excesso de requisições, conclusão rápida demais, sessão supervisionada inválida, tentativa de enviar valor de recompensa pelo cliente, padrão de código malicioso, tentativa de rede externa, atalho DevTools (heurística), adulteração de coordenadas no Lobby, sondagem de endpoint de equipe e coleta em lote de recompensas.

## Economia / benefícios indevidos

- Cliente não define valor de recompensa.
- `claim_core_reward` legado não é executável por `authenticated`.
- `agv-reward-claim` resolve regra oficial no servidor e aplica rate limit.
- CTF: lições novas exigem ao menos 30 segundos após `lesson_start` antes da conclusão premiada.
- Lab Virtual: conclusão exige abertura recente da ferramenta e tempo mínimo; sessão antiga expira.
- Lab Virtual: 12 conclusões em 10 min ou 40 em 24 h é tratado como possível abuso econômico e gera evento CRÍTICO/revisão.
- Desafios CTF continuam sendo validados no servidor por regra estrutural/selos e pré-requisitos; recompensa por desafio é idempotente/não repetível.

## Disponibilidade

O hardening reduz abuso autenticado contra Supabase/DB. Ele não substitui proteção de borda contra DDoS volumétrico. Tráfego de rede massivo precisa continuar sendo absorvido/filtrado pelo provedor de hospedagem/API/WAF.

## Ações manuais ainda recomendadas

- Ativar **Leaked Password Protection** no Supabase Auth; o Security Advisor ainda indica essa opção como desativada.
- Considerar CAPTCHA/bot protection no fluxo de autenticação se houver tentativa automatizada de login/cadastro.
- Revisar periodicamente o feed de eventos CRÍTICOS e marcar somente após investigação.

## Arquivos principais

- `core/database/029_security_hardening_ip_rate_limits.sql`
- `core/edge-functions/security-telemetry/index.ts`
- `core/edge-functions/lobby-presence/index.ts`
- `core/edge-functions/activity-progress/`
- `core/edge-functions/student-files/`
- `core/edge-functions/supervision/`
- `core/edge-functions/agv-reward-claim/index.ts`
- `core/edge-functions/agv-progress-event/index.ts`
- `core/edge-functions/ctf-core-actions/index.ts`
- `core/edge-functions/lab-virtual-core/index.ts`
- `core/tests/security-hardening-p43.test.mjs`

## Verificação pós-correção

Validação direta no banco após o hardening:

- 38 tabelas públicas verificadas; 38 com RLS habilitado.
- 0 privilégios `TRUNCATE`, `TRIGGER` ou `REFERENCES` para `anon`/`authenticated` nas tabelas públicas.
- `lobby_presence`: `authenticated` possui somente `SELECT`; escrita ocorre via `lobby-presence` com JWT + rate limit.
- `activity_catalog`: `authenticated` possui somente `SELECT`.
- `claim_core_reward`, `claim_core_reward_service`, `security_consume_rate_limit` e `security_prune_telemetry_service`: sem EXECUTE para `anon`/`authenticated`; `service_role` mantém execução.
- Rate limiter atômico testado: com limite 2, a terceira requisição foi recusada com `allowed=false` e tempo de retry.
- Edge Functions endurecidas verificadas como `ACTIVE` e `verify_jwt=true`.
- Security Advisor: nenhum novo alerta de acesso a dados; permanece apenas o WARN de Leaked Password Protection desativada. Os INFO de “RLS enabled/no policy” são esperados nas tabelas deliberadamente server-only.

## Riscos residuais conhecidos

- `ctf-complete-challenge` mantém validação server-side de resposta, pré-requisitos e recompensa idempotente, mas ainda não recebeu nesta fase um rate limiter de aplicação por usuário + IP. É risco residual de disponibilidade, não de autoridade econômica da recompensa.
- Nenhum código de aplicação elimina DDoS volumétrico de camada de rede. O rate limiting criado aqui reduz abuso autenticado e automação contra o banco/Edge Functions; proteção de borda continua necessária para tráfego massivo.
- Geolocalização por IP pode divergir da localização física real em VPNs, CGNAT e redes móveis. Por isso, acesso fora do Paraná é `critical` para revisão, e não bloqueio automático de conta.
