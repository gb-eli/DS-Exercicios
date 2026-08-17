# P8.1 / v14.8.1 — Pré-deploy da aula

- Base operacional: v14.7.3 publicada/última segura conhecida.
- 3DS 01–03 preservados; novo Ex04 permanece bloqueado por padrão até liberação docente.
- 80–99% registra entrega com pendências e mantém a atividade `in_progress`; somente 100% marca `completed`.
- Resultado da correção privada é invalidado no frontend quando qualquer código é alterado.
- Link GitHub é normalizado/validado antes do envio e há checklist de commit/push na entrega.
- Versão visual de Atividades alinhada em 0.20.1.
- Regras privadas NÃO estão no ZIP público.
- Testes públicos: 86/86 PASS.
- Teste privado das regras: solução completa 100%; solução fraca abaixo do mínimo.
- Backend live: NÃO aplicado nesta execução.
- Para ativar Ex04: migration 032 + segredo `AGV_PRIVATE_EXERCISE_RULES_V1` + deploy de `activity-progress`.

## P7.7 / v14.6 — Sessão revogada

- Pacote pronto: SIM
- Testes: 69/69 PASS
- Migration 031: pronta, NÃO aplicada live
- Edge Functions P7.7: prontas, NÃO publicadas live
- Admin revogação Auth: permanece desabilitado até validação live

# Status atual — v14.2 / P7.3 Preview Seguro Isolado

- Preview HTML/CSS/JS saiu do documento principal de Atividades e passou para `atividades/preview/`.
- Aplicação principal removeu `unsafe-inline` de `script-src` e `style-src`; `wasm-unsafe-eval` permanece apenas por compatibilidade com Python/Pyodide.
- Código do aluno roda em iframe aninhado `sandbox="allow-scripts"`, sem `allow-same-origin`.
- Comunicação com o Preview Host usa `postMessage`, origem de janela controladora e token aleatório de canal.
- Indicadores de progresso deixaram de usar estilos inline e passaram a `<progress>`.
- Nenhuma migration/Edge Function nova.
- Base: v14.1 / P7.2.

# Status atual — v14.1 / P7.2 Hardening do Frontend

- CSP de Atividades removeu `unsafe-eval` sem quebrar Pyodide/preview.
- Worker Python restrito a origem local; preview segue sandboxado sem same-origin e sem referência de origem.
- Apoios/feedback e resumo da supervisão deixaram de interpolar dados em HTML dinâmico.
- `unsafe-inline` e `wasm-unsafe-eval` permanecem por compatibilidade explícita com código didático e WebAssembly.
- Nenhuma migration/Edge Function nova.
- Base: v14.0 / P7.1.

# Status atual — v14.0 / P7.1 Limpeza e Consolidação de Produção

- 10 plataformas canônicas preservadas.
- 13 árvores históricas substituídas por stubs `index.html` de compatibilidade.
- URLs-raiz antigas redirecionam para a versão atual preservando query/hash.
- Hub e Painel do Aluno usam o catálogo canônico v14.0.
- Nenhuma migration/Edge Function nova.
- Base: v13.9 / P7.0.

# Status atual — v13.8 / P6.10 Relatórios e Indicadores

- Admin Central ganhou relatórios consolidados por aluno, turma e disciplina.
- Filtros por turma, período e busca; exportação CSV do recorte.
- Critérios de atenção: bloqueio, correção pendente ou atividade em andamento sem sinal recente.
- Tempo de uso e agregado global por plataforma não são estimados quando o backend não fornece evidência suficiente.
- Nenhuma migration/Edge Function nova.
- Base: v13.7 / P6.9.

# Status atual — v13.6 / P6.8 Hub Unificado

- Painel do aluno passou a consumir o catálogo canônico de plataformas.
- HUB raiz exibe o mesmo catálogo, reduzindo listas duplicadas.
- Favoritos/recentes são somente UX local; progresso oficial continua no Core.
- Nenhuma mudança de banco/Edge Function nesta fase.

# Status atual — v13.5 / P6.7 encerrada

- Auditoria final consolidou as 10 plataformas no catálogo canônico de integração.
- `manifesto-plataformas.json` teve estados antigos corrigidos para refletir Waves 1–4 já concluídas.
- Novo `core/catalog/platform-integration-v13.5.json` será a fonte da P6.8 Hub Unificado.
- Identidade oficial = AGV Core; estado local = cache/offline/preferências.
- Economia/recompensas permanecem server-side.
- Sem migration ou Edge Function nova.

# Status atual — v13.0 / P6.6

- Console Professor ganhou liberação por **turma inteira** ou **aluno específico**.
- Ações rápidas: **Liberar agora**, **Bloquear agora** e limpeza de horários.
- Matriz de conferência mostra por aluno: liberado, programado, bloqueado/encerrado e concluído.
- Clique na matriz abre diretamente uma exceção individual.
- Programação de abertura/encerramento e recursos de apoio foram preservados.
- Nenhuma migration/Edge Function nova; autoridade continua no backend/RLS.
- Base: v12.9 / P6.5.

# Status atual — v12.5 / P6.1

- Admin Central ganhou tela **Acompanhamento** para uso durante a aula.
- Online = heartbeat supervisionado recente; sessão aberta sem resposta é sinalizada separadamente.
- Filtros por turma/aluno, exercício atual, progresso, última atividade, risco e Perfil 360º.
- Atualização automática de 12 s somente em telas operacionais/aba visível.
- Área staff de Atividades direciona administradores para `/admin/`; professor mantém fluxo pedagógico.
- Nenhuma migration/Edge Function nova.
- Base: v12.4 / P6.0.1.

# STATUS DE IMPLEMENTAÇÃO — AGV EDUCATION CORE

**Data:** 14/08/2026  
**Pacote-base:** v2 → v3 Fase 0/P0 → v4/v5 CTF → v6/v7 LAB → v8–v10 Exercícios/Admin → **v11.3 P4.3 Security Hardening**  
**Estado:** Core central ativo + Lobby Geral P4.3 integrado + autoridade pedagógica server-side + moderação + telemetria de segurança/IP + rate limiting server-side.

## Concluído

### Core

- AGVCoreSDK v0.2.0;
- Auth/perfil central compartilhado;
- progresso idempotente;
- XP/pontos com ledger;
- wallet + ledger central;
- reward claim sem `amount` confiável no cliente;
- adaptador `DSStoreSDK → AGVCore`;
- tabelas de catálogo/regras/auditoria protegidas por RLS;
- nenhuma service key no frontend.

### CTF DS 3.2.0

- 86/86 itens do catálogo (68 missões + 10 aulas + 7 blocos + 1 diário);
- 68 missões verificadas server-side;
- login central;
- XP/moedas espelhados do Core;
- aulas, ferramentas, protocolo diário, hints e Cyber Store centralizados;
- preços/custos definidos no servidor;
- sem fallback econômico local oficial.

### LAB Virtual DS

- login/identidade central;
- 50/50 ferramentas no catálogo;
- 88/88 conclusões no catálogo;
- 88/88 regras de recompensa `activity.completed`;
- total oficial preservado: 5.195 XP e 1.979 Créditos Tech;
- bônus de primeira atividade validada por nível no servidor: 15 / 30 / 50 créditos;
- marcos 30/50/70/80/90/100% no servidor: 100 / 150 / 250 / 300 / 400 / 750 créditos;
- `lab-virtual-core` consulta `activity_catalog` como fonte de verdade;
- valores locais `{xp, credits}` não são autoridade;
- 250 créditos iniciais locais não são importados;
- Loja Tech paga permanece bloqueada no modo Core;
- 88 referências privadas de professor derivadas do catálogo oficial.

### Modo Professor

- tabela `activity_teacher_content` com RLS;
- `anon`/`authenticated` sem acesso direto à tabela;
- Edge Function `agv-teacher-activity` com JWT obrigatório;
- professor comum revalidado contra `teacher_classes × class_memberships`;
- admin/super_admin com escopo global;
- Console Professor separado, sem gabaritos embutidos no HTML/JS;
- visualização preparada para atividade recente, estado do aluno, resposta esperada, arquivos preenchidos, explicação, rubrica e intervenção;
- importador privado `build-teacher-content.py` gera 88 referências dos pacotes Professor de DS1/DS2/DS3/Sub, incluindo 168 arquivos de solução;
- conteúdo gerado pelo importador deve ser carregado server-side e **não entra no pacote público**.

## Pendências conhecidas

- migrar Loja Tech/inventário do LAB para Loja Virtual DS/inventário universal;
- centralizar Arcade Minutes e usos equivalentes;
- reconciliar progresso/economia legados por processo explícito;
- carregar no banco as 88 referências privadas de DS1/DS2/DS3/Sub quando as plataformas de exercícios forem integradas ao Core;
- migrar Desafio DS e Game Informática (próximos P1);
- depois Planetário/Fliperama e LAB Sub/DS1/DS2/DS3;
- restringir CORS aos domínios finais;
- resolver versão LAB manifesto 4.28.0 × runtime 4.21.0;
- habilitar Leaked Password Protection no Supabase Auth.

### Lobby P4.3

- professor/admin circulam no Lobby junto com os alunos;
- interações continuam limitadas a emotes, sem chat livre;
- professor modera apenas alunos de turmas atribuídas; admin/super_admin têm escopo global;
- expulsão é temporária e não afeta conta, matrícula ou progresso;
- expulsões ativas podem ser consultadas e revertidas antecipadamente pela equipe autorizada;
- atividades continuam bloqueadas por `exercise_releases` e revalidadas no backend.

## Regra operacional

Nenhuma plataforma pode cair silenciosamente para saldo/XP local quando `authority=agv-core`. Conteúdo Professor nunca pode ser enviado ao aluno apenas “escondido” no frontend; deve permanecer no backend protegido.


### Security Hardening P4.3

- 38/38 tabelas públicas com RLS após a migration 029.
- `authenticated` sem TRUNCATE/TRIGGER/REFERENCES; Lobby e catálogo sem escrita direta indevida.
- IP/UF/cidade/ASN registrados server-side em eventos de segurança; fora do Paraná = CRÍTICO para revisão.
- Rate limiting por usuário+IP nas rotas sensíveis; proteção econômica CTF/Lab Virtual reforçada.
- Retenção de telemetria: 180 dias; cache de geolocalização minimizado e sem JSON bruto.

### Lobby P5.0 — 3D/360 (v11.4)

- Lobby migrado de canvas 2D para Three.js/WebGL em terceira pessoa;
- câmera 360°, caminhada, corrida, pulo e interação por proximidade;
- joystick e ações mobile;
- avatares humanoides procedurais com animação e emotes;
- quatro ambientes/portais 3D e praça central animada;
- interpolação visual dos participantes online;
- Three.js r180 vendorizado localmente;
- modos gráficos Eco/Médio/Alto;
- segurança P4.3 preservada: browser sem escrita direta em `lobby_presence`, presença por Edge Function, IP/rate limit/telemetria e fora do Paraná = CRÍTICO quando a geolocalização é conclusiva.

### Lobby P5.1 — Campus 3D Cinematic (v11.5)

- direção artística revisada para campus futurista com maior profundidade e menos aparência de protótipo;
- céu procedural em gradiente, névoa, iluminação fria/quente e vinheta cinematográfica;
- praça pavimentada com fonte, beacon holográfico, árvores, bancos, postes, jardineiras e muros baixos;
- quatro edifícios com fachadas de vidro, estrutura metálica, cobertura e identidade visual por turma;
- portais energizados com partículas e animações próprias;
- avatares com CapsuleGeometry, proporções revisadas, variação determinística de pele/cabelo e identificação de equipe;
- câmera em terceira pessoa com offset de ombro, entrada cinematográfica e FOV dinâmico ao correr;
- HUD mais discreto com retículo, banner transitório de área e loading cinematográfico;
- segurança permanece fora do renderer: `lobby3d.js` não acessa Supabase nem dados pedagógicos; presença segue por Edge Function.


## v11.5.1 / P5.1.1 — Hotfix de entrada no Lobby
- Corrigida CSP que bloqueava o import do SDK Supabase no Lobby 3D.
- `script-src` continua restrito a `self` + `https://cdn.jsdelivr.net`.
- SDK Supabase permanece fixado em `2.111.0`.
- Adicionado `lobby/assets/boot.js` para exibir erro de inicialização em vez de deixar a interface sem resposta.
- Sem alteração de banco, RLS ou Edge Functions.


## v11.6 / P5.2
Lobby 3D Heavy Adaptive: Ultra, qualidade adaptativa, câmera dupla, câmera anti-clipping, FPS HUD, avatares mais detalhados e transição de portal. Sem mudança obrigatória no Supabase.


## v11.7 / P5.3
- Personagem GLB rigado próprio do projeto.
- Animações esqueléticas Idle/Walk/Run/Jump/Wave.
- Fallback procedural preservado.
- Nenhuma alteração obrigatória no Supabase.


### Lobby P5.6 — Campus Dinâmico (v12.0)

- NPCs/alunos autônomos percorrem rotas locais;
- grupos ambientais ocupam pontos de encontro conforme qualidade;
- monitores têm deslocamento sutil e proximidade dinâmica;
- ciclo visual dia/noite usa horário local do navegador;
- Eco mantém todos os objetos funcionais, reduzindo apenas densidade visual;
- nenhuma nova autoridade, recompensa ou escrita de progresso foi adicionada ao renderer.


### Lobby P5.8 — Laboratórios Interativos (v12.2)

- estações internas com cadeira, monitor e estado local ligado/desligado;
- sentar e levantar diretamente na estação;
- quadros inteligentes com conteúdo contextual por turma;
- área de apresentação reservada a professor/admin;
- portas automáticas continuam com sensor visual local;
- nenhuma ação interna concede XP/moeda/liberação e nenhuma coordenada interna vira autoridade no backend.

## v12.3 / P6.0 — Auditoria Geral do Ecossistema (2026-08-15)

- Lobby entra em manutenção leve; deixa de ser frente principal de evolução.
- Auditoria consolidou aluno, admin, professor, atividades, Core, plataformas e loja.
- Identificada sessão fragmentada entre superfícies e bridges.
- Identificada duplicação de central administrativa entre `/admin/` e `/atividades/`.
- Identificado redirecionamento raiz obrigatório para Lobby como dívida arquitetural.
- Mapeadas plataformas integradas, parciais e pendentes no AGV Core.
- Roadmap P6 passa a priorizar: sessão/navegação, admin, segurança, painel aluno, atividades, professor e integração.
- Esta versão é documental/auditoria: não altera runtime, banco ou Edge Functions.


## v12.6 — P6.2 Central de Segurança
- Central operacional de IP, geolocalização, ASN, dispositivo e severidade.
- Fora do Paraná = CRÍTICO para revisão; localização inconclusiva não é tratada como ataque.
- Filtros, CSV, reconhecimento e auto-refresh visível.
- Sem mudança de schema/Edge Function nesta fase.


## v12.7 — P6.3 Painel Principal do Aluno
- Dashboard passa a responder primeiro “o que fazer agora?”.
- Continue de onde parou ou comece a próxima atividade liberada.
- Disponíveis, concluídas e bloqueadas ficam resumidas antes das disciplinas.
- Progresso considera atividades liberadas/já concluídas e evita percentual enganoso.
- Layout mobile-first; sem nova autoridade no frontend.


## v12.8 — P6.4 Ambiente de Atividades
- Exercício abre direto em modo prática com editor em destaque.
- Orientações e Preview/Terminal ficam recolhidos inicialmente.
- Barra rápida de arquivos mantém HTML/CSS/JS/Python acessíveis sem abrir ferramentas.
- Autosave silencioso ganhou rascunho local imediato para reduzir perda em celular.
- Recuperação automática só ocorre quando o rascunho local é comprovadamente mais novo que o remoto.
- Realce de sintaxe leve foi adicionado sem dependência pesada.
- Nenhuma nova autoridade pedagógica/econômica foi adicionada ao frontend.


## v12.9 — P6.5 Painel do Professor
- Console Professor ganhou acompanhamento operacional de turma.
- Presença é inferida somente de heartbeat/sessão recente; progresso antigo não é rotulado como online.
- KPIs mostram alunos, ativos, em atividade e atenção.
- Clique no acompanhamento abre o detalhe individual já protegido.
- Modo Aula Guiada revela gabarito privado por etapas com explicações contextuais.
- Modo guiado permanece ausente do bundle do aluno.
- Sem SQL, migration, nova Edge Function ou nova autoridade no frontend.


## v13.1 — P6.7 Integração das Plataformas — Onda 1
- 1DS, 2DS, 3DS e SUB passam a reutilizar a sessão Supabase canônica do HUB.
- Bridge dos labs não usa mais `sessionStorage` como armazenamento oficial da sessão.
- Sessão legada é aceita somente para migração e removida em seguida.
- Identidade oficial é AGV Core; estado local fica restrito a cache/offline/preferências.
- Progresso oficial continua em `lab-exercises-core`; editar localStorage não conclui atividade oficial.
- Alteração de sessão em outra aba é percebida pelo evento `storage`.
- Nenhum SQL, migration, Edge Function ou `service_role` novo foi necessário.


## v13.2 — P6.7 Onda 2
- Lab Virtual DS passou a reutilizar a sessão canônica do ecossistema.
- Sessão legada do Lab Virtual é migrada uma vez e removida.
- CTF DS recebeu bridge ES Module compatível com o `app.js` e com os endpoints oficiais do Core.
- CTF passou a reutilizar a mesma sessão do HUB.
- Progresso/economia do CTF permanecem server-side via `ctf-complete-challenge` e `ctf-core-actions`.
- Estado local de ambas as plataformas permanece cache/offline/preferências.
- Próxima Onda: Desafio DS + Game Informática.


## v13.3 — P6.7 Wave 3
- Desafio DS e Game Informática usam sessão institucional AGV Core como identidade oficial.
- EduAuth/perfis locais permanecem para compatibilidade, autorização legada e cache/offline.
- Conclusões novas publicam `activity.completed` em `agv-progress-event`.
- Sem migration/Edge Function nova.


## v13.4 — P6.7 Wave 4
- Planetário DS e Fliperama DS integrados à sessão institucional AGV Core.
- Progresso/conclusões espelhados para `agv-progress-event`.
- Estado local preservado como cache/offline/experiência; sem autoridade econômica client-side.


## v13.9 — P7.0 Auditoria Geral de Produção
- Hardening de polling/heartbeat para reduzir consumo em turmas cheias.
- Heartbeat do aluno: 5 s visível e no máximo 15 s com aba oculta.
- Acompanhamento ao vivo/central de supervisão pausam quando ocultos/fechados.
- Lobby não consulta atividades em segundo plano.
- Rotas principais, IDs e segredos ativos rechecados localmente.
- Dívidas registradas: versões históricas em `sistemas/`, CSP permissiva em Atividades e revalidação live do Supabase.
- Sem SQL, migration ou Edge Function nova.


## v14.3 — P7.4 Sessão e Autenticação em Produção
- Refresh da sessão compartilhada passa a ser coordenado entre múltiplas abas.
- Web Locks é usado quando disponível; há fallback de lock temporário em localStorage.
- Falha transitória de rede não apaga mais refresh token/sessão persistida.
- Sessão só é descartada automaticamente em rejeição Auth definitiva (400/401).
- Foco, retorno à aba e reconexão online disparam verificação silenciosa de validade.
- Logout da camada comum solicita escopo global e continua propagando o estado pela chave canônica.
- Hub direciona `must_change_password=true` ao fluxo obrigatório de troca em Atividades.
- Admin diferencia “sessão de atividade” de “sessão Auth”; revogação administrativa Auth continua pendente de backend verificado.
- Sem SQL, migration ou Edge Function nesta fase.

## v14.4 — P7.5 Segurança de Autenticação Server-Side
- Endpoints privilegiados principais passam a bloquear `profiles.must_change_password=true` no servidor.
- `staff-dashboard`, `admin-profile-user`, `admin-roster`, `staff-directory`, `agv-teacher-activity` e ações Admin de `security-telemetry` retornam `403 password_change_required`.
- `lobby-moderation` e `supervision` já possuíam gate equivalente e foram preservados.
- Admin/Professor encaminham conta com senha temporária para o fluxo obrigatório em Atividades.
- Revogação Auth administrativa imediata NÃO foi simulada; continua pendente de implementação/deploy live validado.
- Requer republicação das 6 Edge Functions alteradas para efetivar o hardening server-side no Supabase ao vivo.
- Sem SQL/migration.
- Testes: 40 arquivos / 63 testes / 63 aprovados.

## v14.5 — P7.6 Auditoria RLS e Revogação de Sessão
- Snapshot de migration service-only preparado para contagem/revogação de `auth.sessions`.
- Nova Edge Function `admin-auth-sessions` preparada para Admin/Super Admin, com gate de senha temporária e auditoria.
- Admin recebe botão de revogação, mas permanece desabilitado até deploy/validação live (`authSessionRevocationReady=false`).
- Auditor local passa a procurar `SECURITY DEFINER` sem `REVOKE`/`search_path`, `service_role` fora de Edge Functions e ausência de gates privilegiados.
- Conector Supabase indisponível: migration/Edge Function/advisors NÃO aplicados ao vivo.


## v14.7 — P7.8
- Ativação da revogação Auth passa a ser detectada automaticamente pelo Admin.
- Botão permanece desabilitado até o backend confirmar migration/guard/RPC.
- Deploy live continua pendente nesta sessão por indisponibilidade do conector Supabase.

## 2026-08-17 — v14.7.3 Hotfix Auditoria de Liberação
- Admin: rolagem vertical endurecida para notebook/mobile e dialogs com overflow próprio.
- Atividades: starter HTML usa o nome real do CSS/JS do manifesto.
- Atividades: conclusão exige conteúdo significativo em todos os arquivos previstos.
- Atividades: exercícios com validação ainda não suportada integralmente ficam salvos, mas não viram falso `Concluído`.
- Notebook 1101–1280px: editor + Preview/Terminal permanecem lado a lado quando Orientações estão recolhidas.
- Suíte local: 76/76 testes aprovados.
- Supabase ao vivo não foi revalidado nesta execução; nenhuma alteração de backend foi feita.


## v14.8 — P8.0 Validação Privada + novo Exercício 04 do 3DS
- 3DS Exercícios 01–03 permanecem históricos/preservados.
- Exercício 04 foi reconstruído: **Painel de Prioridades com Filtro Interativo**.
- HTML, CSS e JavaScript ficam acessíveis simultaneamente desde o início.
- Correção oficial do Exercício 04 passa por `activity-progress` com regras privadas carregadas de segredo server-side.
- Entrega exige **mínimo de 80%** e **link de repositório GitHub**; 80–99% é aceito com pendências, 100% é conclusão integral automática.
- A submissão registra SHA-256 do conjunto/arquivos e revisões como evidência.
- Conteúdo futuro 3DS 05+ foi removido do manifesto público e deve permanecer invisível no banco até reconstrução individual.
- Bundle legado interno do 3DS foi reduzido a redirecionamento para `/atividades/`.
- Regras privadas NÃO fazem parte do repositório/ZIP público.
- Supabase ao vivo indisponível nesta execução: SQL 032, segredo privado e redeploy de `activity-progress` continuam pendentes antes da liberação do Ex04 aos alunos.
