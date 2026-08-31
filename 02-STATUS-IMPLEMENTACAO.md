# Status de implementação — v14.10.8.65

## AGV World — Fase 63A concluída

- fundação mínima do World Manager integrada;
- estado global de sessão separado do estado específico do mundo, com aliases compatíveis;
- adapters finos conectam Campus/Vale aos runtimes 2D/3D existentes;
- ownership do runtime centralizado, com proteção contra conclusão tardia após cancelamento;
- erro crítico do Campus 2D (`CAMPUS_RIDES` sem import) corrigido;
- erro do interior Campus 3D (`reducedMotion` fora do escopo) corrigido;
- boot e Service Worker passam a validar/cachear os módulos da fundação;
- quatro smokes reais no navegador aprovados: Campus 2D, Campus 3D/interior, Vale 2D e Vale 3D;
- sem World Registry, Spawn Manager, Scene Manager, novos mapas, mudança de schema ou Edge Function;
- próxima fase autorizável: 63B — World Registry + Spawn Manager.

## Estado

**RELEASE CANDIDATE CONSOLIDADA — validações estáticas da Cidade Viva aprovadas; smoke visual real pós-deploy ainda obrigatório.**

## Implementado nesta versão

- 5 circuitos de tráfego urbano;
- 6 veículos de ambientação em movimento;
- 4 veículos do Campus utilizáveis;
- HUD de veículo ativo;
- 5 NPCs urbanos em circulação;
- 5 painéis de sinalização dinâmica;
- 5 eventos urbanos rotativos;
- cabine física de elevador no 3D com sequência de viagem;
- assinatura visual específica para 10 interiores principais;
- paridade funcional 2D/3D para os sistemas de Cidade Viva;
- boot, Service Worker e reparo validando `campus-mobility-systems.js`;
- autenticação unificada preservada;
- Etapa 2 de manutenção: recuperação temporária centralizada por e-mail institucional + CGM;
- Etapa 2 de manutenção: migration 063 adicionada para finalizar com segurança a troca obrigatória de senha.

## Validação local da release

A validação oficial da v14.10.8.65 registra PASS para:

- `validate-campus-city-v62.mjs`;
- `validate-campus-interiors-v63.mjs`;
- `validate-campus-live-v64.mjs`;
- `validate-campus-mobility-v65.mjs`;
- `validate-unified-auth-v59.mjs`.

Também foram verificados os imports locais e a sintaxe JS/MJS do Lobby.

## Pendente antes de considerar produção totalmente encerrada

- smoke visual real em Chrome/WebGL;
- smoke em Android;
- regressão do restante do portal fora do escopo específico da Cidade Viva;
- confirmação dos fluxos Admin, Professor e CTF após publicação;
- aplicar/revisar `core/database/063_p10920_password_change_finalize.sql` no Supabase antes do teste de produção da recuperação por CGM.

## Regra de segurança

Nenhum `service_role`, `sb_secret` ou Client Secret foi adicionado ao frontend. A Etapa 2 inclui uma migration server-side versionada (`063_p10920_password_change_finalize.sql`), que deve ser aplicada apenas no Supabase.

## Correção incremental — Etapa 3

Concluída a consolidação do Login Único/Google e do retorno de sessão após troca obrigatória de senha. O Google permanece centralizado em `/auth/`; o Hub não duplica autenticação. O destino original passa a ser reaproveitado com validação de segurança após a senha definitiva. Recuperação duplicada em Atividades removida. Testes focados: 13/13 PASS; regressão CGM: 5/5 PASS; suíte geral: 307/368 PASS.

## Correção incremental — Etapa 4

Concluída a compatibilidade do painel Admin. Os fluxos atuais de sessão, AAL2, revogação, supervisão e gestão administrativa já estavam íntegros; a única regressão desta área era o contrato visual legado do menu. Os rótulos foram reconciliados sem desfazer o redesign. Testes administrativos e de sessão: PASS; suíte geral: 308/368 PASS.


## Correção incremental — Etapa 5

Concluída a correção isolada do CTF DS / bridge Core. A migração para Login Único foi mantida: não foi reintroduzido login por senha dentro do CTF. Foram corrigidos handlers reais de `Trocar de conta` e `Sair`, que referenciavam funções inexistentes e podiam gerar `ReferenceError`; os controles agora encerram a sessão institucional compartilhada, preservam/checkpointam o cache local e retornam ao `/auth/`. O contrato P6.7 e o teste piloto do CTF foram reconciliados com a arquitetura atual. Testes focados do CTF/Core: PASS; cinco validadores oficiais: PASS; suíte geral: 309/368 PASS, com 59 falhas remanescentes fora deste escopo.

## Correção incremental — Etapa 6

Concluída a consolidação de release metadata, cache-bust e manifesto de publicação. `release-current.json`, `release-v14.10.8.65.json`, `version.json`, `atividades/version.json`, a versão visual de Atividades e `PUBLIC-DEPLOY.json` agora apontam de forma coerente para a release ativa. Foram removidos cache-busts antigos das superfícies públicas restantes (`recuperacao`, `reset-password` e smokes 2D/3D), e o manifesto de publicação passou a reconhecer `core/session/` como runtime público necessário, mantendo banco, Edge Functions, testes e ferramentas fora da superfície estática. Contratos históricos que tratavam releases antigas como permanentemente atuais foram reconciliados sem remover verificações funcionais. Suíte geral após Etapa 6: 342/368 PASS; 26 falhas remanescentes fora deste escopo.

## Correção incremental — Etapa 7

Concluída a reconciliação dos contratos históricos P5 do Lobby/Campus com a arquitetura modular atual da v14.10.8.65. Os testes antigos ainda procuravam versões internas `0.x/1.0.1` e implementações monolíticas de câmera, avatar, qualidade adaptativa, portais, interiores e ambiente. Os contratos foram atualizados para validar a release corrente e os módulos atuais (`camera-controller`, `performance-manager`, `avatar-system`, `portal-manager`, `campus-environment` e mobilidade), preservando as verificações de segurança, presença server-side, fallback 2D, privacidade de coordenadas internas e ausência de autoridade Supabase no renderer 3D. Testes P5: 11/11 PASS; cinco validadores oficiais: PASS; suíte geral: 353/368 PASS, com 15 falhas remanescentes fora deste escopo.

## Etapa 8 — Fullscreen Global do aluno

- tentativa silenciosa de fullscreen restaurada na Plataforma Unificada após resolver perfil/acomodação;
- `AGVFullscreen.require(true)` centraliza a retomada best-effort nas superfícies globais;
- fallback visual continua obrigatório quando o navegador exige gesto do usuário;
- rotas legadas redirecionadoras deixam de ser tratadas como runtimes completos;
- testes focados: 14/14 PASS;
- suíte geral: 355/368 PASS; 13 falhas remanescentes fora deste escopo;
- sem migration ou Edge Function nova.

## Etapa 9 — UX anti-AI-slop

- superfícies principais de Aluno, Professor e Admin voltaram ao padrão visual sóbrio do projeto;
- gradientes decorativos removidos da Central do Aluno, experiências personalizadas, command center do Professor e gestão/hero do Admin;
- hover dos atalhos administrativos deixou de deslocar cards;
- cor continua sendo usada como sinal semântico em bordas, fundos planos, status e ações;
- contrato anti-AI da Prova reconciliado com `avatar-system.js` modular e conteúdo pedagógico renderizado dinamicamente;
- testes focados: 12/12 PASS;
- suíte geral: 359/368 PASS; 9 falhas remanescentes fora deste escopo;
- sem migration, Edge Function ou alteração de banco.

## Etapa 10 — Vale do Silício: entrada 3D / câmera

- corrigido o spawn inicial do Vale, antes muito próximo da fachada da empresa mais próxima;
- spawn principal movido de `z=-30` para `z=-18`, mantendo 20 m de área livre até o prédio mais próximo na configuração atual;
- entrada direta, fallback da Praça e teleporte passam a reutilizar `VALE_SPAWN`, eliminando coordenadas duplicadas;
- câmera 3D nasce no lado aberto da praça, com `initialYaw: 0`, evitando começar colada/atrás da fachada ao norte;
- colisão da câmera deixou de usar `worldRoot` inteiro (chão, vias, decoração) e agora considera apenas raízes de estruturas sólidas;
- fallback de saída de interiores usa o spawn atual em vez da coordenada antiga;
- validador específico `validate-vale-entry-v65.mjs`: 9/9 PASS;
- cinco validadores oficiais permanecem PASS;
- suíte geral permanece 359/368 PASS, com as mesmas 9 falhas preexistentes e nenhuma regressão nova;
- sem migration, Edge Function ou alteração de banco.

## Etapa 11 — Vale do Silício: física e circulação

- colisão do jogador no Vale migrou de AABB para OBB, respeitando a rotação real dos prédios;
- 16 dos 27 prédios ativos possuem rotação não axial e agora deixam de gerar cantos atravessáveis/barreiras invisíveis;
- avatar passou a ter raio físico de 0,82 m;
- movimento é subdividido para reduzir atravessamento de sólidos em corrida ou FPS baixo;
- entradas declaradas como caminháveis recebem degraus físicos e altura de superfície;
- veículos terrestres participam da colisão; drones/aeronaves altas não bloqueiam circulação no solo;
- teleporte e saída de interiores procuram posição segura em vez de materializar dentro de geometria;
- `validate-vale-physics-v65.mjs`: 12/12 PASS;
- regressão da Etapa 10 `validate-vale-entry-v65.mjs`: 9/9 PASS;
- validadores oficiais permanecem PASS;
- suíte geral permanece 359/368 PASS, com as mesmas 9 falhas preexistentes e nenhuma regressão nova;
- sem migration, Edge Function ou alteração de banco.

## Etapa 12 — Masterplan estrutural do Lobby Geral

- área útil do Campus ampliada de 80 × 50 m para 112 × 76 m (`WORLD_X=56`, `WORLD_Z=38`);
- salas 1DS, 2DS, 3DS e SUB redistribuídas com mais afastamento do núcleo e centros 2D/3D sincronizados;
- destinos externos reorganizados por distrito: acadêmico ao norte, pesquisa/cyber a oeste, ciência/inovação a leste, avaliação/entrada do Vale ao sul;
- Vale do Silício ganhou eixo monumental mais largo e portal reposicionado fora da área de provas;
- avenidas principais ampliadas para 6,4–7,0 m e calçadas contínuas maiores;
- anel viário externo reposicionado e passarelas retiradas da praça central;
- atrações recreativas foram distribuídas em quatro bolsões laterais, liberando o centro;
- monotrilho, estações, tráfego, NPCs, garagens, sinalização e conectores foram reposicionados para o novo mapa;
- superfícies verticais das salas agora derivam de `CAMPUS_ZONE_LAYOUT`, eliminando coordenadas duplicadas de escadas/telhados;
- o 3D deixou de renderizar a segunda malha urbana legada (ruas/muros/pista sobrepostos);
- o 2D deixou de desenhar a base legada duplicada e passou a depender da mesma malha oficial usada no 3D;
- praça/cobertura central foram reduzidas para liberar leitura visual e circulação;
- piso e iluminação 3D agora derivam das novas dimensões do masterplan;
- `validate-lobby-masterplan-v65.mjs`: PASS em todos os critérios estruturais;
- `validate-vale-entry-v65.mjs`: 9/9 PASS;
- `validate-vale-physics-v65.mjs`: 12/12 PASS;
- validadores Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: PASS;
- suíte comparável permanece 359/368 PASS, com as mesmas 9 falhas preexistentes e nenhuma regressão nova;
- suíte ampliada permanece 383/393 PASS, idêntica à Etapa 11;
- sem migration, Edge Function ou alteração de banco.

## Etapa 13 — Vale do Silício: reorganização urbana e visual

- Vale ampliado de 640 × 640 m para 840 × 840 m (`VALE_BOUNDS ±420`), aumentando o respiro entre distritos;
- malha radial antiga substituída por `planned_orthogonal_grid_v3`, com quadras retangulares e circulação legível;
- duas avenidas arteriais de 14 m, vias secundárias de 7–9 m, ruas locais de 6 m e calçadas de 3,2 m;
- 38 segmentos viários planejados e 8 travessias principais;
- os 27 prédios/empresas foram redistribuídos sem sobreposição de lotes e sem ruas atravessando construções;
- 14 prédios preservam rotação ortogonal para fachadas voltadas às vias e regressão OBB da Etapa 11;
- Praça das Startups reorganizada ao redor de uma praça central de 40 m, sem ocupar os dois eixos arteriais;
- Educação, Dados, Esportes, Games, Maker, Mídia e Imersivo passaram a ter quadras, limites e gateways próprios;
- Auditório, Refeitório, Sala de Pedra e Hall da Inovação foram reposicionados em bolsões de apoio ao centro;
- complexo esportivo foi deslocado para a borda norte, deixando o Distrito Esportes livre para os prédios de projetos;
- Hangar e Pista de Corrida foram consolidados no setor sudoeste de mobilidade;
- Portal de Retorno passou para o portão sul (`z=-360`), reduzindo conflito visual com o spawn;
- veículos tiveram rotas adequadas às novas avenidas e anéis distritais;
- 20 pontos de paisagismo leve, bancos centrais e iluminação apenas nos eixos arteriais foram adicionados sem saturar a cena;
- placas 3D passaram a respeitar profundidade (`depthTest`), reduzindo textos sobrepostos através dos prédios;
- 2D e 3D passam a consumir o mesmo `world.urban_plan` para ruas, travessias e quadras;
- modo 2D agora desenha prédios com a rotação real e usa colisão OBB equivalente ao 3D;
- `validate-vale-urban-stage13-v65.mjs`: 21/21 PASS;
- `validate-vale-entry-v65.mjs`: 9/9 PASS;
- `validate-vale-physics-v65.mjs`: 12/12 PASS;
- Masterplan/Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: PASS;
- suíte geral permanece 359/368 PASS, com exatamente as mesmas 9 falhas preexistentes e nenhuma regressão nova;
- sem migration, Edge Function ou alteração de banco.


## Etapa 14 — Lobby principal e áreas abertas (31/08/2026)
**Status: concluída.**

- Praça Central compactada e simplificada.
- Parques Norte/Sul reorganizados.
- Mirante e Estação Intermodal retirados do anel central.
- Rótulos 3D respeitam profundidade e 2D usa rótulo por proximidade.
- 18/18 verificações específicas PASS.
- Regressões das Etapas 10–13 PASS.
- Suíte geral permanece 359/368 PASS; 9 falhas antigas não pertencem ao Lobby externo.

## Etapa 15 — Interiores modularizados e desempenho (31/08/2026)
**Status: concluída.**

- 4 laboratórios + 10 interiores de ferramentas deixaram de ser instanciados no boot do 3D;
- runtime externo e runtime interno agora são grupos independentes;
- interior solicitado é montado sob demanda na entrada e descartado na saída;
- exterior é suspenso enquanto o aluno está dentro do prédio;
- tráfego, NPCs, portais, atrações, monotrilho e animações externas deixam de atualizar no interior;
- colisão da câmera é limitada ao ambiente ativo;
- interações internas são montadas/desmontadas junto com o ambiente;
- validador específico: 18/18 PASS;
- regressões das Etapas 10–14 e validadores oficiais: PASS;
- suíte geral permanece 359/368 PASS, com as mesmas 9 falhas antigas fora deste escopo;
- sem migration, Edge Function ou alteração de banco.

## Etapa 16 — Interações e atrações do Lobby (31/08/2026)
**Status: concluída.**

- escadas externas deixam de ser bloqueadas pelo colisor dos próprios prédios;
- escorregador recebe degraus/plataforma físicos compartilhados com o runtime;
- Mirante recebe decks físicos, permanência no topo e rota de descida;
- Estação Intermodal recebe passeio panorâmico completo no circuito do Campus;
- trem visual acompanha passageiro em viagens e passeio panorâmico;
- estações passam a sinalizar chegada com animação de luz;
- elevadores/escadas internas 2D e 3D preservados e validados;
- validador específico: 22/22 PASS;
- regressões das Etapas 10–15 e validadores oficiais: PASS;
- suíte geral permanece 359/368 PASS, com as mesmas 9 falhas antigas fora deste escopo;
- sem migration, Edge Function ou alteração de banco.

## Etapa 17 — Laboratório e adaptações
Concluída.

- Acesso à prática não é mais derrubado por falha isolada de sincronização do Core.
- Modo degradado preserva autoridade central e bloqueia recompensa local falsa.
- Lab Virtual herda `learning_mode` e preferência pedagógica do aluno.
- Fullscreen compartilhado respeita acomodações globais.
- Migration 064 adiciona normalização/reconciliação automática do roster privado.
- 10/10 testes focados PASS; suíte comparável permanece 359/368.
- Migration 064 pendente de aplicação no Supabase correto de produção.

## Etapa 18 — Responsividade e desempenho Lobby/Lab (31/08/2026)
**Status: concluída.**

- Lobby 3D passou a aplicar limite efetivo de FPS em dispositivos touch/conexão econômica: 30 FPS em perfil restrito e 45 FPS em touch mais forte, sem apagar a preferência persistida do usuário.
- qualidade High/Ultra persistida não força mais boot pesado em celular restrito; mobile inicia em Eco/Médio conforme memória/CPU/rede.
- Vale do Silício reutiliza o mesmo diagnóstico de performance do Campus e seleciona renderer/antialias/powerPreference conforme o dispositivo.
- HUD de telefone foi reorganizado em faixas compactas; identidade e status não disputam mais mais de 100% da largura disponível.
- status, ações rápidas e painéis mobile ganharam rolagem horizontal contida, `dvh` e tratamento para landscape baixo.
- LABDS classifica celulares restritos como `economy`, reduz concorrência de carregamento e expõe orçamento comum de DPR/FPS.
- 10 módulos Canvas do LABDS passaram a respeitar `PerformanceManager.canvasScale()`, evitando DPR 2 automático em aparelhos fracos.
- perfil Economy remove composição, blur, animações e sombras decorativas caras sem remover ferramentas.
- sessão fixa do LABDS respeita safe-area; conteúdo reserva espaço inferior para não ficar coberto; alvos touch críticos usam 44 px.
- teste histórico `p1099-mobile-tablet` não depende mais de arquivos de evidência ausentes e não fabrica métricas; usa evidência quando disponível e contratos atuais quando não disponível.
- `validate-stage18-responsive-performance.mjs`: 12/12 PASS.
- `p1099-mobile-tablet-responsiveness-v14.10.8.10.test.mjs`: 9/9 PASS.
- `p5-lobby-mobile-recovery-v11.5.2.test.mjs`: PASS após atualização do contrato para o perfil móvel atual.
- validadores das Etapas 10–17 + Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: PASS.
- suíte geral passou a executar 376 subtestes e ficou em **368/376 PASS**, restando 8 falhas fora deste escopo.
- sem migration, Edge Function ou alteração de banco nesta etapa.


## Etapa 19 — Polimento visual final do Lobby (31/08/2026)
**Status: concluída.**

- Campus 3D passou a ocultar placas/rótulos externos por distância de leitura, reduzindo poluição visual sem remover orientação.
- névoa do Campus acompanha o ciclo dia/noite e abre a distância visual durante o dia.
- Vale 3D ganhou sky dome atmosférico, névoa e iluminação coerentes com o ciclo temporal compartilhado.
- atualizações atmosféricas do Vale são espaçadas em 30 s e não adicionam trabalho pesado por frame.
- distritos do Vale recebem acentos cromáticos discretos no piso.
- placas de distrito/esporte/ambiente usam culling por proximidade e placas de empresa preservam o LOD próprio.
- Vale 2D passou a usar a mesma paleta temporal do Lobby e reduz nomes simultâneos de distritos/27 empresas por proximidade/zoom.
- `validate-stage19-visual-polish.mjs`: 12/12 PASS.
- regressões das Etapas 10–19 e validadores oficiais: PASS.
- suíte geral permanece **368/376 PASS**, com as mesmas 8 falhas da Etapa 18 fora deste escopo.
- sem migration, Edge Function ou alteração de banco.

## Etapa 20 — Vale do Silício: recuperação de renderização (31/08/2026)
**Status: concluída.**

- corrigido mapa 2D excessivamente aberto após expansão para 840 × 840 m;
- scroll de zoom, pinch e atalhos + / - / 0 implementados no Vale 2D;
- zoom inicial e tamanho mínimo dos prédios aumentados para evitar visual de "pontos no escuro";
- 3D ganhou clipping maior, névoa menos agressiva, LOD urbano mais amplo e silhuetas de prédio mais legíveis;
- câmera inicial do Vale abre mais o terreno;
- recuperação defensiva impede `worldRoot` de permanecer oculto fora de interiores;
- validador específico: 12/12 PASS;
- regressões Etapas 10–19 e validadores oficiais: PASS;
- suíte geral permanece **368/376 PASS**, com as mesmas 8 falhas anteriores fora deste escopo;
- sem migration, Edge Function ou alteração de banco.

## Etapa 21 — Vale do Silício: minimapa sobrepondo o 3D (31/08/2026)
**Status: concluída.**

- diagnosticado pelas fotos que a camada fullscreen era o canvas `#vale-minimap`, não o mundo 3D;
- seletor genérico `.game-stage canvas` removido do Lobby e substituído por `#game3d`;
- minimapa ganhou posicionamento independente e limites máximos anti-fullscreen;
- cursor do mapa principal não contamina mais canvases auxiliares;
- CSS usa cache-bust `14.10.8.65-stage21` e o Service Worker pré-carrega a mesma URL;
- validador específico: 11/11 PASS;
- regressões Etapas 10–20 e validadores oficiais: PASS;
- suíte geral permanece **368/376 PASS**, com as mesmas 8 falhas antigas fora deste escopo;
- sem migration, Edge Function ou alteração de banco.

## Etapa 22 — GitHub / Console Professor (31/08/2026)
**Status: concluída.**

- contratos históricos do painel GitHub atualizados para a release atual;
- simulador do Professor endurecido para consultas somente leitura;
- helper HTTP genérico removido: REST usa apenas `GET` e o overview docente usa uma chamada específica com `action: 'overview'`;
- rascunhos da auditoria continuam somente em `localStorage`; nenhum comando remoto de escrita foi introduzido;
- privacidade do bundle passou a ser validada pelos caminhos de `PUBLIC-DEPLOY.json`, sem reintroduzir resumo legado removido;
- relatórios/fixtures identificáveis permanecem fora dos caminhos publicáveis;
- cache-bust do simulador atualizado para `14.10.8.65-stage22`;
- testes focados: 12/12 PASS;
- cinco validadores oficiais: PASS;
- suíte geral: **371/376 PASS**, eliminando as 3 falhas GitHub/Professor da Etapa 21;
- restam 5 falhas fora deste escopo: supervisão histórica, roster público, Central de Apoio e duas rotas legadas;
- sem migration, Edge Function ou alteração de banco.

## Etapa 23 — Supervisão histórica sem bloqueio automático (31/08/2026)
**Status: concluída.**

- auditado o fluxo `event` da Edge Function de supervisão;
- `visibility_hidden` e `fullscreen_exit` permanecem registrados e contabilizados sem bloqueio automático;
- perfis adaptados `home_study`/`relaxed` continuam podendo ignorar eventos de foco conforme política individual;
- contrato histórico P10.1 atualizado para validar a implementação adaptativa atual em vez da expressão antiga literal;
- teste agora reprova qualquer `security_locked:true`, `status:'blocked'` ou `locked:true` dentro do ramo de evento;
- bloqueios manuais e outras regras de segurança permanecem intactos;
- testes focados P10.1/P10.6: 11/11 PASS;
- cinco validadores oficiais: PASS;
- suíte geral: **372/376 PASS**, eliminando a falha de supervisão da Etapa 22;
- restam 4 falhas fora deste escopo: roster público, Central de Apoio e duas rotas legadas;
- sem migration, Edge Function ou alteração de banco.


## Etapa 24 — Roster público e privacidade dos alunos (31/08/2026)
**Status: concluída.**

- confirmado que a falha antiga era metadado de release ausente, não vazamento nominal;
- `release-current.json` voltou a declarar os invariantes de privacidade da release atual;
- roster nominal permanece exclusivamente em `private.pedagogical_adaptation_roster`;
- `anon` e `authenticated` continuam sem acesso ao roster privado;
- `PUBLIC-DEPLOY.json` é agora parte do contrato de privacidade e impede publicação de banco/testes/docs internos;
- novo validador varre os caminhos publicáveis e rejeita roster privado/campos clínicos;
- testes focados: 20/20 PASS; validador de privacidade: 9/9 PASS;
- cinco validadores oficiais: PASS;
- suíte geral: **373/376 PASS**, eliminando a falha de roster da Etapa 23;
- restam 3 falhas fora deste escopo: Central de Apoio e duas rotas legadas;
- sem migration, Edge Function ou alteração de banco.


## Etapa 25 — Central de Apoio
- Central de Apoio validada e contrato histórico atualizado para v14.10.8.65.
- `support_overview` minimiza dados para professores não-admin desde a consulta.
- 374/376 testes PASS; restam apenas 2 rotas legadas P7.1.
- Edge Function `staff-dashboard` precisa de deploy no Supabase correto para a otimização entrar em produção.

## Etapa 26 — Rotas legadas P7.1 — CONCLUÍDA
- Corrigida compatibilidade dos 13 aliases históricos.
- Restaurado alias `FLIPDS/` ausente.
- Query string e hash agora são preservados nos redirecionamentos legados.
- Catálogo atual não foi rebaixado para satisfazer teste histórico.
- Validador dedicado: 12/12 PASS.
- P7.1: 4/4 PASS.
- Suíte integral final: **376/376 PASS — 0 falhas**.
- Nenhuma alteração de banco/backend nesta etapa.

## Etapa 27 — Fase 2.1: personalidade dos prédios (31/08/2026)
**Status: concluída.**

- Vale mantém 27 empresas, posições, footprints e colliders;
- 8 famílias arquitetônicas leves por categoria;
- cores reconhecem as categorias reais do catálogo atual;
- faixas de janelas e materiais compartilhados reduzem repetição e draw calls;
- estimativa de meshes de janela: 600 → 282 (~53% de redução);
- entradas, escadas, LOD, câmera e física preservados;
- cache-bust `14.10.8.65-stage27` aplicado ao `vale3d.js`;
- validador dedicado: 28/28 PASS;
- suíte geral: **376/376 PASS — 0 falhas**;
- sem migration, Edge Function ou alteração de banco.

## Etapa 29 — Fase 2.3: identidade e personalidade dos espaços
- Concluída.
- 5 praças do Campus e 8 distritos do Vale usam identidade temática compartilhada entre 2D e 3D.
- Microestruturas de baixo custo substituem decoração dispersa.
- Rótulos secundários aparecem por proximidade.
- Animações temáticas desativadas no Eco/reduced-motion.
- Cache-bust `stage29` aplicado.
- Validação específica: 16/16 PASS.
- Suíte completa: 376/376 PASS.

## Etapa 30 — Fase 2.4: ambientação estrutural (31/08/2026)
**Status: concluída.**

- vegetação do Campus e Vale migrada para InstancedMesh;
- Campus passa a ter 12 árvores variadas, vasos instanciados, nuvens, estrelas e 2 drones ambientais por orçamento de qualidade;
- Vale preserva os 20 pontos oficiais de paisagismo, agora em 2 grupos instanciados;
- drone do Vale ampliado e 3 rotas aéreas decorativas adicionadas;
- iluminação arterial do Vale responde à noite via emissivo, sem multiplicar PointLights;
- 2D acompanha a diversidade de vegetação sem poluição adicional;
- modo Eco remove nuvens/aeronaves extras e reduz vegetação;
- cache-bust `stage30` aplicado à cadeia principal e Service Worker;
- validador específico: 20/20 PASS;
- validadores oficiais: PASS;
- suíte geral: **376/376 PASS — 0 falhas**;
- sem migration, Edge Function ou alteração de banco.

## Etapa 31 — Fase 3.1: ciclo temporal 24h = 24min (31/08/2026)
**Status: concluída no código.**

- relógio do mundo deixa de depender da hora local do computador;
- ciclo oficial: **24 horas do Lobby/Vale = 24 minutos reais**;
- equivalência: **1 segundo real = 1 minuto no jogo**;
- Campus 2D, Campus 3D, Vale 2D e Vale 3D usam a mesma origem temporal;
- amanhecer, dia, entardecer e noite passam a ser derivados do mesmo relógio;
- Vale 3D ganhou sol e lua visíveis sincronizados com a iluminação;
- equipe pode enviar controle temporário de sessão: ciclo automático ou hora fixa;
- comando global usa token HMAC emitido/validado pela Edge Function `lobby-presence`;
- aluno não recebe permissão para emitir controle de horário;
- nenhum schema/tabela/migration foi criado;
- a alteração da Edge Function precisa de deploy no Supabase correto para o controle global funcionar em produção;
- sem esse deploy, o ciclo acelerado local/sincronizado continua funcionando, mas o broadcast administrativo não;
- validador específico: **16/16 PASS**;
- cinco validadores oficiais: **PASS**;
- suíte geral: **376/376 PASS — 0 falhas**;
- cache-bust `stage31` aplicado à cadeia principal e ao `dynamic-world.js`.

## Etapa 32 — Fase 3.2: sistema de clima (31/08/2026)
**Status: concluída no código.**

- clima compartilhado entre Campus/Vale e 2D/3D;
- estados Limpo, Chuva, Neve e Tempestade;
- intensidade Leve, Normal e Forte;
- sistema 3D por `Points`/shader com orçamento Low→Ultra e redução em `saveData`/movimento reduzido;
- interiores sem precipitação;
- tempestade com relâmpagos determinísticos;
- céu, fog, exposição, sol e lua respondem ao clima;
- equipe possui controle global temporário assinado pela Edge Function `lobby-presence`;
- nenhuma migration/tabela criada;
- Edge Function precisa de deploy no Supabase correto para o comando global funcionar em produção;
- fallback Limpo e efeitos locais funcionam no frontend mesmo sem esse deploy;
- cache-bust `stage32` aplicado à cadeia principal, CSS e Service Worker;
- validador específico: **20/20 PASS**;
- cinco validadores oficiais: **PASS**;
- suíte geral: **376/376 PASS — 0 falhas**.

## Etapa 33 — Fase 4.1: interiores e personalidade interna (31/08/2026)
**Status: concluída no código.**

- 10 plataformas internas receberam famílias visuais próprias;
- 1DS, 2DS, 3DS e SUB receberam assinaturas acadêmicas internas distintas;
- salas funcionais agora derivam mobiliário/equipamentos do `kind` do blueprint (`lab`, `cyber`, `science`, `exam`, `creator`, `finance`, `gamer`, etc.);
- Centro de Provas ganhou carteiras/telas e linguagem visual própria;
- Lab Virtual ganhou bancadas técnicas e identidade de pesquisa;
- CTF/SOC, COSMOS, Maker, Banco, Loja, Arcade e demais interiores deixaram de compartilhar a mesma aparência genérica;
- modo 2D usa a mesma identidade, ícones e motivos do 3D;
- animações internas discretas rodam apenas no piso ativo e respeitam `prefers-reduced-motion`;
- arquitetura lazy da Etapa 15 preservada: interior só monta ao entrar e é descartado ao sair;
- nenhuma migration, tabela, Edge Function ou alteração de banco nesta fase;
- cache-bust `stage33` aplicado aos consumidores de interiores e cadeia de boot;
- validador específico: **27/27 PASS**;
- cinco validadores oficiais: **PASS**;
- suíte geral: **376/376 PASS — 0 falhas**.

## Etapa 34 — Fase 4.2: comportamento contextual do avatar (31/08/2026)
**Status: concluída no código.**

- criado estado contextual de sessão para o “gêmeo digital” do avatar, sem dados pessoais e sem banco;
- estados oficiais: waiting, exam-running, exam-paused, exam-finished, lab-waiting e lab-active;
- Prova publica o estado do avatar a partir do status real da sessão do servidor;
- durante a prova o avatar usa carteira/âncora contextual, senta e executa animação de prova; pausa mantém pose de prova sem escrita; finalização libera o controle;
- Lab publica estado de programação ao abrir ferramenta e retorna ao estado de espera ao fechar;
- avatar procedural e avatar rigged possuem poses para prova, pausa e programação;
- 2D e 3D aplicam o mesmo contexto e bloqueiam movimento enquanto o estado exige foco;
- troca 2D ↔ 3D preserva o contexto via sessionStorage/BroadcastChannel;
- logout limpa o contexto;
- interiores continuam lazy e descartáveis;
- cache-bust `stage34` aplicado ao Lobby, Prova, Lab e Service Workers correspondentes;
- validador específico: **37/37 PASS**;
- regressões acumuladas: **PASS**;
- cinco validadores oficiais: **PASS**;
- suíte geral: **376/376 PASS — 0 falhas**;
- nenhuma migration, Edge Function ou alteração de banco nesta fase.
