# Correções — Etapa 32 / Fase 3.2

Data: 31/08/2026

## Escopo
Sistema de clima compartilhado do Lobby/Campus e Vale do Silício, sem incluir veículos dirigíveis, NPCs inteligentes ou subsolo.

## Implementado
- módulo compartilhado `lobby/assets/world/weather-system.js`;
- quatro estados: Limpo, Chuva, Neve e Tempestade;
- intensidades: Leve, Normal e Forte;
- fallback seguro para Limpo quando o estado recebido é inválido ou inexistente;
- precipitação 3D por um único `THREE.Points`/shader, acompanhando o jogador em vez de cobrir o mundo inteiro;
- orçamento de partículas por qualidade Low/Medium/High/Ultra e redução adicional em `saveData`/`prefers-reduced-motion`;
- chuva, neve e tempestade equivalentes nos modos 2D;
- interiores sem precipitação;
- tempestade com flashes determinísticos de relâmpago e ajuste temporário de exposição/luzes;
- céu, fog, exposição, sol e lua adaptados ao clima;
- chip de clima no HUD;
- painel de equipe para selecionar clima e intensidade;
- sincronização temporária dos usuários online pelo canal `agv-lobby-world-weather-v32`;
- comandos globais assinados e verificados pela Edge Function `lobby-presence`;
- `teacher`, `admin` e `super_admin` podem emitir; aluno não pode emitir controle global;
- cache-bust `stage32` aplicado aos runtimes, CSS, boot e Service Worker.

## Desempenho
O sistema evita partículas por todo o mapa. O efeito é local ao jogador e possui teto fixo de partículas:
- Low: 90;
- Medium: 190;
- High: 330;
- Ultra: 520;
- 2D/Lite: 110 antes dos multiplicadores de economia.

Limpo utiliza zero partículas. `saveData` e movimento reduzido diminuem ainda mais o orçamento.

## Segurança e produção
Nenhuma migration ou tabela nova foi criada.

A experiência visual e o fallback Limpo funcionam no frontend da Etapa 32. O controle global da equipe depende da publicação da Edge Function `core/edge-functions/lobby-presence/index.ts` no projeto Supabase correto. Esta etapa não realizou deploy em produção.

O clima global desta fase é temporário para usuários online/sessão; não há persistência administrativa permanente ainda.

## Validação
- `core/tools/validate-stage32-world-weather.mjs`: **20/20 PASS**;
- Fase 3.1: **16/16 PASS**;
- Fase 2.4: **20/20 PASS**;
- Fase 2.3: **16/16 PASS**;
- Fase 2.2: **20/20 PASS**;
- Fase 2.1: **28/28 PASS**;
- interações/atrações: **22/22 PASS**;
- masterplan, física, renderização e responsividade: **PASS**;
- cinco validadores oficiais: **PASS**;
- suíte completa `core/tests/*.test.mjs`: **376/376 PASS — 0 falhas**.
