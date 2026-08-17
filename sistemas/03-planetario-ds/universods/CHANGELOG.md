# Changelog

## 34.0.0 — C5.2 Projetos Interdisciplinares, Carreiras e Curadoria Científica

- Adiciona o 34º módulo: Estúdio de Projetos, Carreiras e Curadoria.
- Inclui seis projetos interdisciplinares e oito simulações profissionais.
- Implementa rubrica de confiabilidade com cinco critérios e oito casos didáticos.
- Cria portfólio persistente por perfil e seleção de competências.
- Gera miniexposição digital procedural e exportação HTML autoral.
- Adiciona a sétima trilha guiada oficial.
- Integra Cultura Espacial ao Estúdio de Projetos.
- Mantém o novo módulo fora do grafo inicial e do precache.

## 33.0.0 — C5.1 Cultura Espacial, Agências e Trilhas de Descoberta

- Adiciona o 33º módulo, carregado somente sob demanda.
- Cria catálogo com 12 organizações, 12 carreiras e 14 referências culturais.
- Separa ciência, hipótese, simplificação e ficção em cada obra.
- Adiciona busca, filtros, favoritos, comparação e recomendações por interesse.
- Cria seis trilhas de descoberta e uma trilha guiada oficial de Cultura Espacial.
- Inclui oito propostas de discussão e evidência JSON por perfil.
- Integra História, Pessoas, Enciclopédia, Tecnologia e laboratórios relacionados.
- Utiliza constelação procedural sem mídia promocional ou trechos protegidos.
- Preserva abertura leve, PWA, cache sob demanda e regressão das fases anteriores.

## 32.0.0 — C4.2 Astrofotografia, Planejamento e Processamento

- Adiciona o 32º módulo, carregado somente sob demanda.
- Cria quatro câmeras, seis alvos, quatro presets e quatro condições de sessão.
- Implementa planejamento de campo, escala, duração e armazenamento.
- Simula captura planetária e sequências de céu profundo.
- Adiciona bias, dark e flat, alinhamento, seleção e empilhamento.
- Cria histograma, redução de ruído, nitidez, curvas, saturação e falso colorido.
- Adiciona galeria local, caderno digital e evidência JSON.
- Integra Telescópios, Observatório, trilhas guiadas e Estúdio do Professor.
- Preserva abertura leve, PWA e regressão das fases anteriores.

## 31.0.0 — C4.1 Observatório e Telescópios Imersivos

- Adiciona o 31º módulo, carregado somente sob demanda.
- Cria sete famílias de instrumentos e dez alvos ópticos/de rádio.
- Implementa montagem orientada, alinhamento, oculares, filtros, foco e exposição.
- Simula poluição luminosa, seeing, nuvens, vento, campo, resolução e coleta de luz.
- Cria observação procedural e registro científico com evidência JSON.
- Adiciona comparação de instrumentos e faixas de preço didáticas datadas.
- Integra o novo laboratório ao Observatório, às trilhas e ao Estúdio do Professor.
- Preserva abertura leve, PWA, Oficina Espacial e regressão das fases anteriores.

## 30.0.0 — C3.2 Oficina Espacial 3D

- Adiciona o 30º módulo, carregado somente sob demanda.
- Inclui cinco oficinas, 30 componentes, três fluxos e três níveis de dificuldade.
- Implementa montagem, remoção, substituição, conexões, diagnóstico e manutenção.
- Integra Museu Visual, Painéis Operacionais, trilhas e evidências.
- Preserva abertura leve, PWA e regressão das fases anteriores.

# COSMOS DS — Changelog

## 29.0.0 — C3.1 Museu Técnico e Painéis Operacionais

- Adiciona o 29º módulo, carregado somente sob demanda.
- Cria cinco painéis: satélite, estação, ônibus espacial, cápsula e rover.
- Adiciona telemetria didática com limites nominais e alertas.
- Cria hotspots para sensores, software, linguagens e responsabilidades de DS.
- Implementa Exterior, Corte técnico, Raio X e Desmontado.
- Adiciona comandos operacionais e anomalias didáticas recuperáveis.
- Cria procedimentos de quatro etapas por sistema.
- Gera evidência JSON e registra síntese na jornada ativa.
- Liga os painéis ao Museu Visual, lançamento imersivo, estação imersiva e rover.
- Amplia a Trilha de Tecnologia com etapa operacional.
- Preserva o shell inicial leve e o Service Worker sem precache de laboratórios.

## 28.0.0 — C2.3 Autoria Avançada, Painel do Professor e Evidências

- Adiciona o Estúdio do Professor como 28º módulo carregado sob demanda.
- Cria editor visual de trilhas personalizadas com 2 a 12 etapas.
- Permite ordenar etapas, selecionar laboratórios e configurar objetivos, justificativas e resultados.
- Adiciona duração mínima real por etapa e mínimo total de 25 minutos.
- Cria checkpoints por abertura de módulo, interação, evidência escrita ou visita simples.
- Registra tempo ativo apenas no laboratório correto e interrompe a contagem após inatividade.
- Adiciona códigos distintos para entrada do aluno e autorização do professor.
- Permite conclusão antecipada apenas com código do professor e motivo registrado.
- Cria acompanhamento local por perfil e turma, com exportação CSV.
- Gera evidência consolidada em JSON e HTML imprimível/salvável como PDF.
- Adiciona integração de entrega por link configurável do Google Classroom.
- Inclui três modelos prontos e três níveis de adaptação pedagógica.
- Preserva o shell leve, sem módulos ou assets premium no grafo inicial.

## 27.0.0 — C2.2 Jornada Guiada e Carregamento Inteligente

- Redesenha a abertura com quatro modos de entrada e sem catálogo expandido por padrão.
- Separa `styles-core.css` e `styles-labs.css`, reduzindo a folha inicial para aproximadamente 28 KB.
- Adia o fundo WebGL para o período ocioso do navegador.
- Carrega a integração premium por importação dinâmica apenas nos módulos compatíveis.
- Cria `ModuleLoadCoordinator` com cinco etapas visuais de preparação.
- Adiciona preload somente do próximo módulo da trilha, respeitando economia de dados e conexão lenta.
- Cria a Central de Jornadas com cinco histórias, papéis, missões e conclusões.
- Amplia o HUD guiado com “Por que usar?”, ferramenta atual e resultado esperado.
- Cria Tour de Ferramentas com cinco destaques contextuais.
- Adiciona planejamento local de aula e exportação JSON.
- Reduz o precache do Service Worker ao shell essencial; laboratórios passam ao cache somente após uso.
- Adiciona tratamento controlado de falha e nova tentativa na tela de carregamento.
- Preserva 57 fichas, 12 sensores, 24 GLBs, 22 renderizadores e todos os laboratórios anteriores.

## 26.0.0 — C2.1 Tecnologia Espacial e Trilhas Guiadas

- Adiciona a Central de Tecnologia Espacial.
- Cria cinco trilhas sequenciais e HUD contextual global.
- Inclui sensores, telemetria, arquitetura digital, linguagens e desafios DS.
- Salva progresso por perfil e bloqueia registro antes da visita ao laboratório indicado.

## 25.0.0 — C1.2 Expansão da Enciclopédia Imersiva

- Amplia o catálogo offline de 21 para 57 fichas.
- Adiciona luas oceânicas, planetas anões, asteroides, cometas e exoplanetas.
- Inclui missões, pessoas, agências, sensores e fenômenos espaciais.
- Cria linha do tempo visual com 18 marcos entre 1609 e 2024.
- Cria 8 desafios de verdade ou mito com feedback e evidências relacionadas.
- Cria 10 recordes espaciais conectados ao catálogo.
- Adiciona comparação avançada de diâmetro, gravidade, temperatura e distância.
- Adiciona narração e audiodescrição opcionais pelo navegador.
- Atualiza o perfil de conhecimento para o esquema v2.
- Mantém a cena 3D/360° como foco e usa painéis DOM recolhíveis.
- Atualiza PWA, Service Worker, testes, auditoria e documentação.

## 24.0.0 — C1.1 Enciclopédia Imersiva e Central de Curiosidades

- Adiciona o módulo `curiosity-center` em 3D/360°.
- Cria motor de conhecimento local e indexação offline.
- Inclui 21 fichas iniciais: mundos, missões, tecnologias e mitos.
- Adiciona busca, filtros, favoritos, descobertas e comparação.
- Adiciona três níveis de conteúdo: rápido, descoberta e DS/técnico.
- Registra fontes oficiais e data de revisão.
- Integra Terra, Lua, Marte, planetas e satélites com os laboratórios 3D.
- Adiciona perfil de coleção por estudante e XP idempotente.
- Atualiza PWA e Service Worker para cache da Enciclopédia.
- Mantém a correção 23.1 para carregamento mobile de GLB/HDR.

## 23.1.0 — Correção mobile de assets premium

- Corrige `Failed to fetch` em prévias de editores móveis.
- Resolve recursos a partir da raiz real do projeto.
- Adiciona fallback XHR e Cache API.
- Isola falhas da camada GLB sem interromper o laboratório.

## C2.1 — Tecnologia Espacial e Trilhas Guiadas

- Nova Central de Tecnologia Espacial com dez tecnologias e dez linguagens/ambientes.
- Laboratório de doze sensores com leituras simuladas e injeção de falhas.
- Validador de telemetria com unidade, faixa, sequência e estado.
- Arquitetura digital em oito camadas, do ambiente à interface.
- Cinco trilhas guiadas: Tecnologia, Programação, Exploração, Planetas e Missões.
- HUD contextual global, progressão sequencial e persistência por perfil.
- Novo desafio DS com seis decisões técnicas.
- Cache offline e catálogo público versionado da C2.1.
