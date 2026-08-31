# CORREÇÕES — ETAPA 34

## Fase 4.2 — comportamento contextual do avatar

### Objetivo
Fazer o personagem refletir o que o aluno está realmente fazendo dentro das plataformas, sem acoplar Prova/Lab ao motor 3D e sem gravar dados pessoais no estado do Lobby.

### Implementado
- ponte contextual compartilhada em `core/session/avatar-context.js`;
- armazenamento somente em `sessionStorage`;
- sincronização opcional entre abas por `BroadcastChannel`;
- estados `waiting`, `exam-running`, `exam-paused`, `exam-finished`, `lab-waiting` e `lab-active`;
- Prova publica o contexto a partir do status real da sessão;
- Lab publica `lab-active` ao abrir uma ferramenta e retorna para espera ao fechar;
- âncoras internas para carteira de prova e bancada de programação;
- avatar procedural e rigged com poses de prova, pausa e programação;
- 2D e 3D bloqueiam movimento nos estados contextuais travados;
- indicador contextual no HUD/2D;
- troca de runtime reaplica o estado;
- logout limpa o contexto;
- `prefers-reduced-motion` respeitado;
- cache `stage34` aplicado ao Lobby, Prova e Lab.

### Segurança/privacidade
- nenhuma identidade nominal, CGM, CPF ou e-mail é armazenada na ponte contextual;
- nenhum acesso Supabase/REST/Edge Function é feito pela ponte contextual;
- nenhum segredo de backend foi introduzido;
- nenhuma migration ou alteração de banco foi necessária.

### Compatibilidade
- arquitetura lazy dos interiores preservada;
- fallback avatar rigged → procedural preservado;
- contratos históricos de cache foram atualizados apenas para aceitar `-stageNN` posterior.

### Validação
- `validate-stage34-contextual-avatar.mjs`: **37/37 PASS**;
- validador da Etapa 33 após atualização de contrato: **27/27 PASS**;
- regressões acumuladas: **PASS**;
- cinco validadores oficiais: **PASS**;
- suíte completa: **376/376 PASS — 0 falhas**.
