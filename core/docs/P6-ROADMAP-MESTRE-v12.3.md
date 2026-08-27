# P6 — Roadmap Mestre do Ecossistema AGV

## Princípio

O Lobby entra em manutenção leve. O foco passa a ser **fluxo pedagógico, acompanhamento, integração e estabilidade**.

## Gate P6.0.1 — Identidade e navegação

- Sessão única e refresh compartilhado.
- HUB raiz em vez de redirecionamento obrigatório para Lobby.
- Deep-link seguro para atividades.
- Lobby como opção.
- Mesma identidade em aluno/admin/professor/plataformas.

## P6.1 — Admin Central

- Unificar as duas interfaces staff.
- Dashboard por turma em tempo real.
- Aluno 360º.
- Gestão de contas/turmas/professores.
- Releases e recursos pedagógicos.
- Código/arquivos/sessões/correções/GitHub.
- Mover writes críticos para Edge Functions/RPC auditável.

## P6.2 — Segurança

- Central de incidentes.
- IP e geolocalização.
- Fora do Paraná = CRÍTICO quando localização for conclusiva.
- Rate limits e eventos suspeitos.
- Acknowledge, filtros e histórico.

## P6.3 — Painel do Aluno

- “Continue de onde parou”.
- Disponíveis / em andamento / concluídas / bloqueadas.
- Progresso por disciplina.
- Hub de plataformas.
- Arquivos e histórico.
- Responsividade mobile-first.

## P6.4 — Atividades

- Autosave silencioso.
- Restauração robusta.
- Cross-device.
- Editor/preview/terminal.
- Suporte opcional.
- Validação server-side.

## P6.5 — Professor

- Sessão única.
- Acompanhamento ao vivo.
- Gabarito privado.
- Review/feedback.
- Modo guiado.
- Liberação simples.

## P6.6 — Plataformas

Wave 1: lab-ds1, lab-ds2, lab-ds3, lab-sub.  
Wave 2: Lab Virtual e CTF — normalizar adapters/resíduos.  
Wave 3: Desafio DS e Desafio Informática.  
Wave 4: Planetário.  
Wave 5: Fliperama.  
Economia/Loja: somente após auditoria econômica dedicada.

## P6.7 — Eventos e relatórios

- Contrato único de eventos.
- Telemetria pedagógica.
- Relatório por aluno/turma/disciplina/plataforma.
- Indicadores de dificuldade e atraso.

## Regra de UX

Toda tela nova deve ser validada em 360 px, 390/412 px, tablet, notebook e desktop. Recursos pesados sempre têm fallback. 3D nunca é requisito para acessar conteúdo pedagógico.
