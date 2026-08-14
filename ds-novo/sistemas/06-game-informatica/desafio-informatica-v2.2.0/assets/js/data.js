export const APP_VERSION = '2.5.7';
export const BUILD_DATE = '2026-08-06';
export const DATA_SCHEMA_VERSION = 24;
export const SCHOOL = 'Colégio Estadual Alberto Gomes Veiga';
export const TEACHER = 'Professor Gabriel';
export const LESSON_TIME_MINUTES = 25;
export const GUIDED_MINIMUM_MINUTES = 5;
export const DIAGNOSTIC_MINIMUM_MINUTES = 15;
export const DIAGNOSTIC_MAX_MINUTES = 50;

export const CLASSES = {
  '1ADM': { label: '1º ADM — Manhã A', short: '1º ADM', color: 'cyan', shift: 'morning' },
  '2ADM': { label: '2º ADM — Manhã A', short: '2º ADM', color: 'purple', shift: 'morning' }
};

export const TERM_PLANS = {
  '1ADM': {
    label:'Fechamento do trimestre — 1º ADM',weeks:4,meetingsPerWeek:2,totalMeetings:8,completedOrders:[1,2,3],
    emphasis:'Planilhas, fórmulas, Gmail, documentos e apresentações administrativas',
    sequence:['Planilhas e organização','Formatação profissional','Cálculos administrativos','Fórmulas para RH e financeiro','Gmail, Drive e PDF','Google Apresentações','Avaliação prática integrada','Recuperação diferenciada']
  },
  '2ADM': {
    label:'Fechamento do trimestre — 2º ADM',weeks:4,meetingsPerWeek:2,totalMeetings:5,completedOrders:[],
    emphasis:'Planilhas, fórmulas, Gmail, documentos e apresentações administrativas',
    sequence:['Planilhas e fórmulas administrativas','Fórmulas para RH e financeiro','Gmail, documentos e apresentações','Avaliação integrada','Recuperação diferenciada']
  }
};

export const CLASSROOM_CONFIG = {
  generalUrl: 'https://classroom.google.com/',
  activityUrl: '',
  directActivityConfigured: false,
  expectedFileName: 'resultado-desafio-informatica.pdf',
  deliveryType: 'PDF',
  privateComment: '',
  instructions: 'Baixe o PDF, abra a atividade correspondente no Google Classroom, anexe o arquivo e confirme a entrega.'
};

export const PROJECT_CREDITS = {
  projectTitle: 'Desafio de Informática AGV',
  shortDescription: 'Plataforma de aulas guiadas e diagnóstico de Informática Empresarial.',
  lead: {
    name: 'Professor Gabriel',
    roles: ['Idealização', 'Desenvolvimento pedagógico', 'Coordenação', 'Validação']
  },
  institution: SCHOOL,
  program: 'Informática Empresarial e projetos educacionais de tecnologia',
  collaborators: {
    studentGroups: ['1º ADM', '2º ADM'],
    teachers: 'Professores colaboradores da comunidade escolar'
  },
  aiAssistance: {
    tool: 'ChatGPT',
    provider: 'OpenAI',
    model: 'GPT-5.6 Thinking',
    mode: 'Raciocínio e desenvolvimento assistido',
    purpose: ['Análise', 'Programação', 'Revisão', 'Correção', 'Documentação'],
    humanValidation: 'Professor Gabriel'
  },
  version: {
    current: APP_VERSION,
    status: 'aulas abertas, metodologia ativa e preparação profissional — ativa',
    createdAt: '2026-07-27',
    updatedAt: BUILD_DATE,
    registeredVersions: 28,
    registeredUpdates: 27
  }
};

export const CHANGELOG = [
  {
    version: '2.5.7', date: '2026-08-06', title: 'Aulas abertas e comprovante em cinco minutos',
    summary: 'Remove a senha de entrada das aulas do 1º e 2º ADM, mantém todas as atividades disponíveis e reduz para cinco minutos o tempo mínimo de liberação do comprovante em PDF.',
    categories: ['Acesso aberto', 'Experiência do aluno', 'Recuperação de atividades', 'Tempo', 'PDF'],
    changes: [
      'Todas as aulas do 1º ADM e do 2º ADM podem ser abertas sem senha do professor.',
      'Novo aviso explica que as aulas foram liberadas para facilitar o estudo em casa e a regularização de atividades atrasadas.',
      'Tempo mínimo para liberar o comprovante em PDF reduzido para cinco minutos de sessão.',
      'Painel do professor deixa de exibir senhas de aula e mantém somente o código coletivo opcional para antecipar PDF ou resultado.',
      'Perfis, retomada, conclusão imediata, Classroom e código coletivo continuam preservados.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Simplificação do acesso e atualização técnica'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.5.6', date: '2026-08-04', title: 'Trilha regional e preparação profissional',
    summary: 'Reorganiza as aulas em contexto, retomada, explicação, prática, fixação e evidência, conectando o AGV a situações fictícias de Paranaguá, Curitiba e Paraná.',
    categories: ['Pedagogia', 'Metodologia ativa', 'Paranaguá', 'Curitiba', 'Paraná', 'Mercado de trabalho'],
    changes: [
      'Abertura das aulas mostra contexto regional, papel profissional, competências e percurso de aprendizagem.',
      'Aulas 4 a 8 do 1º ADM e toda a trilha do 2º ADM foram contextualizadas para escritório, RH, financeiro, gestão, projetos e comunicação.',
      'Conteúdo organizado em situação profissional, retomada, explicação passo a passo, prática, fixação e evidência.',
      'Avaliações e recuperações usam problemáticas regionais fictícias e caminhos diferentes.',
      'Aulas 1, 2 e 3 do 1º ADM mantêm suas etapas originais e recebem apenas enquadramento profissional.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Revisão curricular, regionalização e implementação'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.5.5', date: '2026-08-04', title: 'Coerência pedagógica e simulação completa',
    summary: 'Alinha gráficos, filtros, fórmulas e comunicação às bases de cada aula e torna a escrita de e-mails profissional menos dependente de palavras literais.',
    categories: ['Pedagogia', 'Apresentações', 'E-mail', 'Avaliação', 'Coerência'],
    changes: [
      'Gráficos e tópicos das apresentações agora usam dados do cenário da própria aula.',
      'Filtros e fórmulas das avaliações recebem instruções sem ambiguidade sobre situação e base completa.',
      'Gmail aceita saudações e encerramentos profissionais equivalentes sem exigir uma frase única.',
      'Ajuda em avaliação e recuperação explica a interface sem revelar o critério correto.'
    ]
  },
  {
    version: '2.5.4', date: '2026-08-04', title: 'Responsividade, modais e acessibilidade das ferramentas',
    summary: 'Reorganiza etapas no celular, impede sobreposições e padroniza foco, teclado, fechamento e safe areas nas janelas da plataforma.',
    categories: ['Responsividade', 'UX', 'Modais', 'Planilha', 'E-mail', 'Acessibilidade', 'Mobile'],
    changes: [
      'Gerenciador comum de modais com Escape, foco preso, retorno ao acionador e bloqueio do fundo.',
      'Lista de etapas em faixa horizontal no celular para manter a atividade próxima do topo.',
      'Janelas de compartilhamento e filtros da planilha adaptadas para telas estreitas.',
      'Gráfico da planilha abre como painel inferior fechável sem escapar da tela.',
      'Composição e seletor de arquivos do correio recebem semântica de diálogo e navegação por teclado.',
      'Altura dinâmica, safe areas, paisagem e movimento reduzido revisados.',
      'Teste automático específico de responsividade e acessibilidade incluído na suíte.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Auditoria responsiva, playtest e implementação'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.5.3', date: '2026-08-04', title: 'Continuidade, múltiplas abas e atualização segura',
    summary: 'Protege o progresso contra cópias antigas, conflitos entre abas, fechamento durante a conclusão e atualização automática durante atividades.',
    categories: ['Progresso', 'IndexedDB', 'Checkpoint', 'Múltiplas abas', 'Cronômetro', 'Diagnóstico', 'Service Worker'],
    changes: [
      'Escolha e sincronização automáticas do registro mais recente entre IndexedDB e checkpoint redundante.',
      'Controle de revisão e combinação segura quando duas abas salvam o mesmo perfil.',
      'Conclusão registrada imediatamente após a última missão; somente o PDF aguarda o horário absoluto.',
      'Checkpoint local mínimo resiste ao fechamento da aba por até 10 dias.',
      'Resposta diagnóstica e avanço de questão salvos de forma atômica.',
      'Atualizações ficam pendentes durante aula ou teste e só recarregam após salvamento confirmado.',
      'Verificação de progresso compara revisão, conteúdo e identificadores concluídos.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Auditoria de continuidade e implementação'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.5.2', date: '2026-08-04', title: 'Conclusão guiada e entrega assistida no Classroom',
    summary: 'Adiciona confirmação explícita da conclusão, animação curta de processamento e um fluxo visual sequencial para baixar o PDF, abrir o Classroom, anexar o arquivo e confirmar a entrega.',
    categories: ['Conclusão', 'PDF', 'Google Classroom', 'UX', 'Acessibilidade', 'Registros'],
    changes: [
      'Tela explícita “Concluir atividade” depois da última etapa, com resumo da aula e aviso de entrega.',
      'Animação rápida de processamento de respostas, dados, evidências, PDF e instruções.',
      'Passos de entrega sequenciais e destacados; etapas posteriores ficam bloqueadas até a anterior ser realizada.',
      'Instruções completas antes de abrir o Google Classroom, incluindo turma, atividade, Seu trabalho, upload, Downloads e botão Entregar.',
      'Confirmações do anexo e da entrega exigem declarações conscientes e registram data e hora.',
      'Fluxo responsivo para celular, Chromebook e computador, com suporte a movimento reduzido.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Revisão de experiência e implementação'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.5.0', date: '2026-08-04', title: 'Senhas fixas, conclusão persistente e currículo administrativo',
    summary: 'Torna fixa a senha de cada aula, cria código coletivo por turma e hora, salva a conclusão antes da espera do PDF e reorganiza as aulas restantes para planilhas, fórmulas, Gmail, documentos e apresentações.',
    categories: ['Senhas', 'Progresso', 'Tempo', '1º ADM', '2º ADM', 'Planilhas', 'Gmail', 'Apresentações'],
    changes: [
      'Senha de entrada fixa e exclusiva para cada aula, sem troca por horário.',
      'Código coletivo único por turma, data e hora para liberar PDF ou resultado antecipadamente.',
      'Aula registrada como concluída imediatamente após a última etapa; somente o PDF aguarda o tempo mínimo.',
      'Tempo do teste reduzido para 15 minutos e espera de leitura das questões reduzida pela metade.',
      'Aulas 1, 2 e 3 do 1º ADM congeladas em conteúdo e preservadas para compatibilidade.',
      'Demais aulas focadas em planilhas, fórmulas, Gmail, documentos e Google Apresentações simulados.',
      'Ferramentas e janelas de apoio podem ser fechadas e reabertas; gráfico da planilha pode ser removido.',
      'Checkpoint do teste e horário absoluto do PDF permanecem salvos ao sair e retornar.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Reestruturação técnica e pedagógica'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.4.8', date: '2026-08-04', title: '2º ADM com foco administrativo e aula inicial simplificada',
    summary: 'Substitui o laboratório obrigatório de hardware da primeira aula por uma rotina prática de planilha, fórmulas, documento e e-mail; remove tarefas de hardware das operações avaliativas do 2º ADM.',
    categories: ['2º ADM', 'Planilhas', 'Fórmulas', 'Documentos', 'E-mail', 'Correção pedagógica'],
    changes: [
      'Aula 1 do 2º ADM reconstruída como rotina administrativa enxuta e prática.',
      'Planilha de controle, fórmulas essenciais, resumo documental e comunicação por e-mail integrados.',
      'Laboratório de hardware removido da primeira aula por dificuldade e baixo alinhamento com a disciplina.',
      'Tarefas obrigatórias de hardware removidas da avaliação e recuperação do 2º ADM.',
      'Diagnóstico do 2º ADM reduz hardware e reforça documentos e comunicação.',
      'Textos e créditos visíveis deixam de sugerir foco em Desenvolvimento de Sistemas.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Revisão pedagógica e correção técnica'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.4.7', date: '2026-08-04', title: 'Revisão de pré-publicação e seleção correta da aula',
    summary: 'Corrige a aula padrão do gerador do professor e consolida a validação para publicação imediata no GitHub Pages.',
    categories: ['Correção', 'Professor', 'GitHub Pages', 'Cache', 'Pré-publicação'],
    changes: [
      'Painel do professor abre na Aula 3 do 1º ADM, pois as Aulas 1 e 2 já foram aplicadas.',
      'Ao trocar para o 2º ADM, o painel abre na Aula 1, pois a turma ainda não realizou aulas.',
      'Cache e referências de módulos atualizados para impedir mistura com versões anteriores.',
      'Recursos relativos validados no caminho em subpasta usado pelo GitHub Pages.',
      'Senha mestre e geradores de acesso validados antes da publicação.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Revisão técnica de pré-publicação'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.4.6', date: '2026-08-03', title: 'Consequências operacionais e cenários ramificados',
    summary: 'Adiciona prioridades concorrentes, incidentes de privacidade, lixeira e restauração de arquivos, prazos e diferentes estratégias aceitáveis nas avaliações.',
    categories: ['Avaliação', 'Riscos', 'Privacidade', 'Arquivos', 'Prazos', 'Decisão'],
    changes: [
      'Central de riscos e prioridades integrada às quatro operações avaliativas.',
      'Mais de uma estratégia pode ser aceita quando controla prazo e risco.',
      'Incidentes de destinatário incorreto e permissão excessiva exigem contenção registrada.',
      'Arquivos podem ser movidos para a lixeira e restaurados com preservação de versão.',
      'Versões obsoletas precisam ser removidas antes da conferência final.',
      'Prazos são mostrados como em dia, atenção, crítico ou expirado.',
      'Checkpoint preserva decisões, incidentes, estratégias, lixeira e histórico operacional.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Raciocínio e desenvolvimento assistido'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.4.5', date: '2026-08-03', title: 'Arquivos integrados, conflitos e solicitações de acesso',
    summary: 'A operação empresarial passou a rastrear versões, cópias, conflitos, arquivos desatualizados e pedidos de acesso entre Drive, documentos e e-mail.',
    categories: ['Arquivos', 'Drive', 'Versões', 'Permissões', 'Avaliação', 'Integração'],
    changes: [
      'Adicionado registro compartilhado de arquivos da operação empresarial.',
      'PDFs registram a versão do documento que lhes deu origem.',
      'Alterações posteriores marcam exportações antigas como desatualizadas.',
      'Adicionadas solicitações de acesso com aprovação e função controlada.',
      'Adicionados conflitos de edição e escolha de estratégia de resolução.',
      'Correio bloqueia arquivos desatualizados ou com conflito pendente.',
      'Avaliações passaram a exigir conferência da versão e da permissão antes do envio.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Raciocínio e desenvolvimento assistido'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.4.4', date: '2026-08-03', title: 'Avaliação flexível e ferramentas integradas',
    summary: 'Substitui a sequência rígida por um grafo de dependências, aceita ordens válidas diferentes e usa os motores completos de planilha, documentos e correio dentro das avaliações.',
    changes: ['Tarefas paralelas após a leitura do briefing', 'Ações bloqueadas mostram dependências sem penalizar o aluno', 'Exploração, repetição e navegação deixam de contar como erro', 'Planilha funcional completa reutilizada na avaliação', 'Drive e documento realista integrados ao caso', 'PDF produzido entra no seletor de arquivos do e-mail', 'Checkpoint migra ações concluídas da avaliação anterior'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.4.3', date: '2026-08-03', title: 'Confiabilidade, salvamento e recuperação de progresso',
    summary: 'Amplia a retenção para 10 dias, mostra o estado real de salvamento e adiciona diagnóstico, verificação e checkpoint criptografado redundante.',
    changes: ['Retenção local renovada por 10 dias após cada salvamento', 'Indicador Salvando, Salvo e horário do último registro', 'Botão Verificar meu progresso com releitura do perfil criptografado', 'Diagnóstico de IndexedDB, persistência, quota e possível modo privado', 'Checkpoint redundante criptografado e reconexão automática do IndexedDB', 'Backup destacado, confirmação reforçada antes da exclusão e falhas registradas na auditoria'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.4.2', date: '2026-08-03', title: 'Correio empresarial realista e integrado',
    summary: 'Reconstrói o correio simulado com caixa de entrada, tópicos, rascunhos, pastas, anexos, Drive, alertas e uso dentro das avaliações empresariais.',
    changes: ['Caixa de entrada com mensagens lidas, não lidas, estrela, pesquisa e spam simulado', 'Responder, responder a todos, encaminhar, CC, CCO e rascunho automático', 'Seletor de arquivos com versões corretas e incorretas', 'Inserção de links do Drive com verificação de acesso', 'Alertas de destinatário, assunto, corpo, anexo e permissão', 'Correio realista integrado às avaliações e recuperações empresariais'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.4.1', date: '2026-08-03', title: 'Drive, documentos colaborativos e PDF configurável',
    summary: 'Transforma a central documental em um fluxo conectado com Drive simulado, editor paginado, comentários, versões nomeadas, permissões e exportação configurável.',
    changes: ['Drive com pastas, pesquisa, arquivos, proprietários e tipos', 'Editor paginado com seleção de trechos e menus funcionais', 'Comentários, resolução e histórico de versões', 'Compartilhamento nominal com Leitor, Comentador e Editor', 'Exportação PDF com papel, orientação, margens, páginas e prévia', 'Checkpoint completo do fluxo documental e auditoria no comprovante'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.4.0', date: '2026-08-03', title: 'Planilha funcional e compartilhamento realista',
    summary: 'Substitui comandos decorativos por um editor de planilhas com seleção, edição, fórmulas, formatação, filtros, ordenação, histórico e janela completa de compartilhamento.',
    changes: ['Motor de células com seleção de intervalos, edição e barra de fórmulas', 'Funções SOMA, MÉDIA, MÍNIMO, MÁXIMO, SE, CONT.SE e SOMASE', 'Formatação aplicada às células selecionadas', 'Filtros e ordenação por janelas contextuais', 'Compartilhamento com pessoas, acesso geral, papéis e cópia de link', 'Desfazer, refazer, congelamento, gráfico e retomada persistente'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.3.0', date: '2026-08-03', title: 'Simulação empresarial e avaliação prática imersiva',
    summary: 'Transforma avaliações e recuperações em operações administrativas integradas, com desktop empresarial, aplicativos realistas e indicadores para revisão docente.',
    changes: ['Nova central empresarial integrada com e-mail, planilha, RH, documentos, ativos e segurança', 'Avaliações finais baseadas em casos e ações, não apenas perguntas', 'Recuperações com cenários alternativos e fluxo próprio', 'Rubrica visual de aplicação, resolução, comunicação, evidência e uso responsável', 'Ferramentas com profundidade, perspectiva, animações e responsividade adaptativa', 'Relatório PDF passa a incluir indicadores da avaliação prática'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.9', date: '2026-08-03', title: 'Laboratórios 3D/360, RH e documentos',
    summary: 'Adiciona ambientes especializados e reformula integralmente o 2º ADM, preservando somente as Aulas 1 e 2 já aplicadas no 1º ADM.',
    changes: ['Laboratório 3D/360 com componentes, periféricos e conexões', 'Estação de RH com jornada e demonstrativo educacional simplificado', 'Central de documentos com formatação, permissões e PDF simulado', '2º ADM reformulado integralmente por ainda não ter recebido aulas', 'Aulas 3 a 8 do 1º ADM atualizadas sem alterar Aulas 1 e 2', 'Novos checkpoints e logs para os três ambientes especializados'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.8', date: '2026-08-03', title: 'Trilha administrativa, avaliação e recuperação',
    summary: 'Reorganiza o fechamento do trimestre com oito aulas no 1º ADM e cinco no 2º ADM, preservando as duas primeiras aulas já aplicadas.',
    changes: ['Sequência do 1º ADM fechada com cálculos, RH, documentos/PDF, informática básica, avaliação e recuperação', 'Sequência do 2º ADM fechada com planilhas empresariais, RH/financeiro, produtividade, avaliação e recuperação', 'Avaliações práticas integradas e recuperações com cenários diferentes', 'Contextos administrativos priorizados sobre o tema portuário', 'Identificação visual de conteúdo, avaliação e recuperação', 'Plano de quatro semanas exibido na trilha'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.7', date: '2026-08-03', title: 'Laboratórios práticos, e-mail e autenticação em dois fatores',
    summary: 'Diversifica as aulas com estações administrativas realistas, correio eletrônico simulado, segurança de contas e métricas visuais de aprendizagem.',
    changes: ['Novos laboratórios de planilha com formatação, fonte, filtros e compartilhamento', 'Nova aula de comunicação profissional por e-mail com envio simulado e anexo', 'Nova aula de segurança de contas e autenticação em dois fatores', 'Trilha avançada de comunicação e gestão de acessos para o 2º ADM', 'HUD com acertos, erros, tentativas e domínio estimado', 'Animação de preparação do comprovante e entrega', 'Layout adaptado para celular, iPhone, tablet, notebook e desktop'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.6', date: '2026-08-03', title: 'Central de contas e aceite assistido',
    summary: 'Ativa a primeira fase da nova experiência com troca segura de estudante, encerramento explícito, exclusão controlada de dados e leitura facilitada dos termos.',
    changes: ['Central de contas sempre mostra o perfil atual e os demais perfis do equipamento', 'Ações separadas para trocar estudante, sair e bloquear e apagar dados', 'Nenhum perfil protegido é aberto automaticamente após recarregar', 'Termos com Ir até o final e Marcar todos como aceitos após a leitura', 'Identificação reforçada de aula, turma, turno e posição na trilha', 'Layout responsivo da central de contas e dos termos'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.5', date: '2026-08-03', title: 'Persistência, cronômetro único e tutorial assistido',
    summary: 'Corrige a reinicialização do tempo e a perda da etapa final, reduz a espera mínima pela metade e amplia a experiência responsiva com tutorial acionável.',
    changes: ['Tempo mínimo guiado reduzido de 25 para 12 minutos e 30 segundos', 'Relógio único persiste durante a tela de validação', 'Checkpoint da última missão e retomada por perfil', 'Tutorial Não entendi ativável a qualquer momento', 'Logs de tutorial, retomada, espera e entrega no comprovante', 'Senha mestre atualizada e protegida por PBKDF2-SHA-256', 'Revisão responsiva para celular, tablet, notebook e desktop'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.4', date: '2026-08-03', title: 'Gerador de liberação antecipada',
    summary: 'O painel do professor passa a transformar o código-base individual do aluno em um PIN de conclusão antecipada, válido por três minutos e restrito àquela sessão.',
    changes: ['Gerador individual integrado ao painel protegido', 'Validação de ação, sessão, checksum e prazo', 'PIN de 10 dígitos com contagem regressiva', 'Gerador emergencial entregue separadamente ao professor', 'Testes de geração e expiração da autorização'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.3', date: '2026-08-03', title: 'Painel protegido e revisão visual das atividades',
    summary: 'O painel do professor passa a usar senha mestre de publicação, bloqueio por tentativas e inatividade; aulas e exercícios recebem novo layout e revisão das alternativas.',
    changes: ['Senha mestre sem cadastro livre em navegador novo', 'Bloqueio temporário após tentativas incorretas', 'Encerramento do painel após 12 minutos sem atividade', 'Posições corretas equilibradas nas questões', 'Alternativas das Aulas 1 e 2 reescritas', 'Novo layout de aulas, exercícios e painel do professor'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.2', date: '2026-08-03', title: 'Comprovante detalhado da sessão',
    summary: 'O PDF da aula guiada passa a registrar identificação, horários, duração, etapas concluídas e linha do tempo das ações realizadas.',
    changes: ['Histórico cronológico das interações', 'Resumo de etapas com horário de conclusão', 'Registro de respostas, dicas, práticas e alertas', 'PDF multipágina para conferência pedagógica'],
    validatedBy: 'Professor Gabriel', ai: { model: 'GPT-5.6 Thinking' }
  },
  {
    version: '2.2.1', date: '2026-08-03', title: 'Gerador de senhas para aulas guiadas',
    summary: 'O painel do professor passa a gerar e atualizar as senhas coletivas das aulas, com contagem regressiva, senha anterior de tolerância e revisão pedagógica da aula selecionada.',
    categories: ['Modo Guiado', 'EduAuth', 'Painel do professor', 'Usabilidade', 'Aulas'],
    changes: [
      'Adicionado gerador de senha coletiva por turma e aula no painel do professor.',
      'Adicionadas senha atual, contagem regressiva e senha anterior para solicitações abertas antes da virada.',
      'Adicionado resumo de objetivos e etapas das aulas para preparação rápida do professor.',
      'Simplificada a orientação exibida aos estudantes durante a autorização da aula.',
      'Mantido o funcionamento offline e adicionados testes específicos do gerador.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Raciocínio e desenvolvimento assistido'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.2.0', date: '2026-07-30', title: 'Termos, privacidade e segurança transversal',
    summary: 'Aceite obrigatório versionado, regras específicas das atividades, comprovante no PDF e reforço contra conteúdo importado inseguro.',
    categories: ['Termos', 'Privacidade', 'Integridade acadêmica', 'Segurança', 'Acessibilidade', 'Exportação'],
    changes: [
      'Adicionado Termo de Ciência, Uso Responsável e Compromisso Pedagógico com registro criptografado no perfil.',
      'Adicionadas regras específicas para Modo Guiado e diagnósticos, aceitas separadamente antes do início.',
      'Adicionadas Política de Privacidade, aviso de simulações e finalidade educacional em linguagem simples.',
      'Incluído comprovante resumido dos aceites nos PDFs e arquivos de resultado.',
      'Reforçada a validação de arquivos importados, com rejeição de campos perigosos e limites de estrutura.',
      'Confirmado que esta plataforma não possui loja, carteira, moedas ou compras; XP permanece apenas indicador motivacional e não determina nota.',
      'Adicionados manifestos, documentos públicos, testes de XSS, aceite, permissões e checklist de publicação.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Raciocínio e desenvolvimento assistido'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.1.0', date: '2026-07-29', title: 'Integração estrutural EduAuth Offline',
    summary: 'Senhas fixas de aula e liberações pela credencial local foram substituídas por códigos dinâmicos vinculados ao contexto.',
    categories: ['Segurança', 'EduAuth', 'Autorização', 'Funcionamento offline', 'Migração'],
    changes: [
      'Removidos os códigos permanentes armazenados nas aulas.',
      'Adicionado PIN coletivo de turma para iniciar aulas, com janela de 15 minutos.',
      'Adicionado PIN individual de sessão para conclusão antecipada e liberação de resultado.',
      'Adicionados código-base público, checksum, limite de tentativas, expiração e consumo.',
      'Adicionado QR Code offline opcional, mantendo copiar e digitar como fluxo principal.',
      'Gerados manifest, registro de ações, vetores de teste e template de provisionamento.',
      'A versão permanece em ambiente de desenvolvimento até receber chaves de produção do EduAuth Professor.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Raciocínio e desenvolvimento assistido'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '2.0.0', date: '2026-07-29', title: 'Padrão educacional integrado',
    summary: 'Perfis locais protegidos, entrega orientada, horário escolar, créditos e descoberta de ferramentas.',
    categories: ['Perfil local', 'Segurança', 'Classroom', 'Responsividade', 'Acessibilidade', 'Versionamento'],
    changes: [
      'Adicionado gerenciador de perfis locais protegidos por senha com IndexedDB, PBKDF2 e AES-GCM.',
      'Substituída a credencial universal do professor por configuração local no primeiro acesso ao painel.',
      'Adicionada sessão temporária sem salvamento e migração assistida do formato anterior.',
      'Adicionada Central de conclusão e entrega com orientação para o Google Classroom.',
      'Adicionado indicador do horário escolar e lembretes contextuais.',
      'Adicionada área Sobre, créditos e histórico de versões.',
      'Adicionado catálogo de ferramentas educacionais com frequência controlada.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Raciocínio e desenvolvimento assistido'},
    validatedBy: 'Professor Gabriel'
  },
  {
    version: '1.6.0', date: '2026-07-28', title: 'Tempo e relatórios',
    summary: 'Tempo mínimo de 25 minutos, liberação excepcional e PDF completo do diagnóstico.',
    categories: ['Tempo', 'Exportação', 'Painel do professor', 'Correção de bugs'],
    changes: [
      'Reduzido o tempo mínimo para 25 minutos.',
      'Adicionada liberação excepcional registrada pelo professor.',
      'Adicionada exportação do diagnóstico em PDF.',
      'Corrigido o tratamento de perguntas não respondidas.'
    ],
    ai: {tool:'ChatGPT', model:'GPT-5.6 Thinking', mode:'Raciocínio e desenvolvimento assistido'},
    validatedBy: 'Professor Gabriel'
  }
];

export const SCHOOL_SCHEDULE = {
  timezone: 'America/Sao_Paulo',
  shifts: {
    morning: {
      label: 'Período da manhã',
      periods: [
        {type:'class',number:1,start:'07:30',end:'08:20'},
        {type:'class',number:2,start:'08:20',end:'09:10'},
        {type:'class',number:3,start:'09:10',end:'10:00'},
        {type:'break',label:'Intervalo',start:'10:00',end:'10:20'},
        {type:'class',number:4,start:'10:20',end:'11:10'},
        {type:'class',number:5,start:'11:10',end:'12:00'},
        {type:'class',number:6,start:'12:00',end:'12:50'}
      ]
    },
    night: {
      label: 'Período da noite',
      periods: [
        {type:'class',number:1,start:'18:50',end:'19:30'},
        {type:'class',number:2,start:'19:30',end:'20:15'},
        {type:'class',number:3,start:'20:15',end:'21:00'},
        {type:'break',label:'Intervalo',start:'21:00',end:'21:15'},
        {type:'class',number:4,start:'21:15',end:'22:00'},
        {type:'class',number:5,start:'22:00',end:'22:40'}
      ]
    }
  },
  schoolDays: [1,2,3,4,5],
  exceptions: [],
  notificationRules: {
    showCurrentPeriod: true,
    showRemainingTime: true,
    milestones: [30,20,15,10,5,2],
    showBreakNotice: true,
    showOutsideShiftEncouragement: true
  }
};

export const TOOL_CATALOG = [
  {
    id:'lab-virtual-ds',
    name:'Lab Virtual DS',
    shortDescription:'Laboratório com simuladores, ferramentas e atividades de diferentes áreas da tecnologia.',
    categories:['Laboratório','Simuladores'],
    areas:['Programação','Hardware','Redes','Sistemas'],
    status:'available',
    url:'https://gb-eli.github.io/lab-virtual/lab/index.html',
    icon:'🧪', audiences:['1º ADM','2º ADM','DS'], devices:['mobile','desktop'], priority:3,
    version:'', updatedAt:''
  },
  {
    id:'desafio-ds',
    name:'Desafio DS',
    shortDescription:'Desafios por fases e áreas da tecnologia, com atividades práticas e acompanhamento do progresso.',
    categories:['Desafios','Programação'], areas:['Programação','Tecnologia'], status:'development',
    url:'', icon:'⚡', audiences:['DS'], devices:['mobile','desktop'], priority:2, version:'', updatedAt:''
  },
  {
    id:'diagnostico-edu',
    name:'Diagnóstico Edu',
    shortDescription:'Diagnóstico adaptativo com perguntas e indicadores de aprendizagem.',
    categories:['Diagnóstico'], areas:['Aprendizagem'], status:'development',
    url:'', icon:'🧭', audiences:['Todos'], devices:['mobile','desktop'], priority:1, version:'', updatedAt:''
  },
  {
    id:'modo-guiado',
    name:'Modo Guiado',
    shortDescription:'Aulas passo a passo, explicações, evidências e orientação para entrega.',
    categories:['Aulas','Apoio'], areas:['Aprendizagem'], status:'pilot',
    url:'', icon:'🪜', audiences:['Todos'], devices:['mobile','desktop'], priority:1, version:'', updatedAt:''
  }
];

export const CROSS_PROMOTION_CONFIG = {
  enabled: true,
  maxPerSession: 1,
  maxPerDay: 2,
  sameItemCooldownHours: 72,
  snoozeMinutes: 30,
  firstDisplayAfterMinutes: 10,
  avoidCriticalMoments: true
};

const explain = (title, summary, detailed, example, tip) => ({ type:'explain', title, summary, detailed, example, tip });
const quiz = (title, questions) => ({ type:'quiz', title, questions });
const sheet = (title, description, tasks, config={}) => ({ type:'sheet', title, description, tasks, config });
const formula = (title, description, tasks) => ({ type:'formula', title, description, tasks });
const demo = (title, summary, steps) => ({ type:'demo', title, summary, steps });
const challenge = (title, description, tasks, badge) => ({ type:'challenge', title, description, tasks, badge });
const officeLab = (title, description, tasks, config={}) => ({ type:'office-lab', title, description, tasks, config });
const emailLab = (title, description, config={}) => ({ type:'email-lab', title, description, config });
const twoFactorLab = (title, description, config={}) => ({ type:'twofactor-lab', title, description, config });
const hardwareLab = (title, description, tasks, config={}) => ({ type:'hardware-lab', title, description, tasks, config });
const hrLab = (title, description, config={}) => ({ type:'hr-lab', title, description, config });
const documentLab = (title, description, tasks, config={}) => ({ type:'document-lab', title, description, tasks, config });
const presentationLab = (title, description, tasks, config={}) => ({ type:'presentation-lab', title, description, tasks, config });

const cellTasks = [
  ['B3','Clique na célula B3.','A letra B indica a coluna e o número 3 indica a linha.'],
  ['D6','Localize a célula D6.','Encontre primeiro a coluna D e depois desça até a linha 6.'],
  ['A8','Selecione A8.','A é a primeira coluna e 8 é a oitava linha.'],
  ['F2','Clique em F2.','Fica no encontro da coluna F com a linha 2.'],
  ['C5','Localize C5.','Coluna C, linha 5.'],
  ['E7','Selecione E7.','Coluna E, linha 7.'],
  ['G4','Clique em G4.','Coluna G, linha 4.'],
  ['B9','Localize B9.','Coluna B, linha 9.'],
  ['D2','Selecione D2.','Coluna D, linha 2.'],
  ['C10','Clique em C10.','Coluna C, linha 10.'],
  ['F8','Localize F8.','Coluna F, linha 8.'],
  ['A4','Selecione A4.','Coluna A, linha 4.']
].map(([answer,prompt,why])=>({kind:'cell',answer,prompt,why}));

const commonFormattingTasks = [
  {kind:'tool',prompt:'Aplique negrito ao título da tabela.',answer:'bold',why:'O negrito cria hierarquia e destaca o título.'},
  {kind:'tool',prompt:'Centralize o cabeçalho.',answer:'center',why:'Cabeçalhos centralizados facilitam a leitura dos campos.'},
  {kind:'tool',prompt:'Aplique uma cor de preenchimento ao cabeçalho.',answer:'fill-blue',why:'O preenchimento separa visualmente o cabeçalho dos dados.'},
  {kind:'tool',prompt:'Adicione bordas para organizar a tabela.',answer:'border-heavy',why:'Bordas ajudam a acompanhar linhas e colunas.'},
  {kind:'tool',prompt:'Aplique itálico à observação.',answer:'italic',why:'O itálico pode diferenciar observações e notas secundárias.'},
  {kind:'tool',prompt:'Altere a cor do texto de alerta.',answer:'text-red',why:'A cor vermelha chama atenção para situações críticas.'}
];

export const LESSONS = [
  {
    id:'1ADM-01', classId:'1ADM', order:1, duration:45,
    title:'Criando, organizando e compartilhando planilhas',
    subtitle:'Do arquivo vazio a uma estrutura administrativa organizada.',
    icon:'▦', badge:'Explorador de Células', estimated:'15–25 min',
    objectives:['Criar e nomear uma planilha','Identificar linhas, colunas, células e intervalos','Organizar abas','Compartilhar com a permissão correta'],
    stages:[
      explain('O que é uma planilha eletrônica?',
        'Uma planilha organiza informações em linhas, colunas e células. Ela permite registrar, calcular, comparar e visualizar dados.',
        'No ambiente administrativo, planilhas podem controlar produtos, despesas, vendas, presença, clientes e prazos. Cada célula possui um endereço formado pela letra da coluna e pelo número da linha. Uma tabela bem estruturada evita retrabalho e facilita a tomada de decisão.',
        'Uma papelaria pode registrar produto, quantidade, valor unitário e total em colunas diferentes.',
        'Pense na planilha como um grande armário: as colunas são categorias, as linhas são registros e cada célula guarda uma informação.'),
      demo('Criando e nomeando o arquivo','Observe a sequência usada para iniciar um arquivo organizado.',[
        'Abrir o Google Drive ou Google Planilhas.','Criar uma planilha em branco.','Trocar “Planilha sem título” por um nome descritivo.','Inserir um título dentro da tabela.','Salvar automaticamente na nuvem.'
      ]),
      quiz('Arquivo, tabela ou aba?',[
        {q:'A empresa possui arquivos de estoque de vários meses. Qual nome facilita mais a localização e evita confusão?',options:['Estoque 2026','Controle de Estoque — Papelaria Horizonte — Julho/2026','Papelaria Horizonte','Controle final revisado'],answer:1,why:'O nome mais completo identifica finalidade, empresa e período sem depender de abrir o arquivo.'},
        {q:'O arquivo no Drive chama-se “Controle de Estoque — 2026”. Dentro dele, a primeira tabela deve apresentar qual título?',options:['O mesmo nome é obrigatório em todas as células','“Posição do estoque por produto — Julho/2026”, porque contextualiza a tabela específica','Somente “Dados”, pois o nome do arquivo já basta','Nenhum título, para economizar espaço'],answer:1,why:'O nome do arquivo identifica o documento; o título interno explica o conteúdo daquela tabela e seu período.'},
        {q:'A empresa precisa cadastrar produtos, registrar entradas e saídas e acompanhar indicadores. Qual organização de abas é mais coerente?',options:['Produtos, Movimentações e Resumo','Uma aba para cada produto','Tudo em uma única aba sem separação','Resumo, Rascunho e Planilha1'],answer:0,why:'A separação entre cadastro, registros e resumo reduz mistura de informações e facilita análise.'},
        {q:'Qual situação justifica criar uma nova aba no mesmo arquivo, em vez de um novo arquivo?',options:['Guardar o resumo mensal ligado aos mesmos dados de estoque','Enviar o arquivo a outra pessoa','Alterar a senha da conta','Trocar a cor do cabeçalho'],answer:0,why:'Abas são adequadas para conjuntos relacionados que precisam permanecer no mesmo documento.'}
      ]),
      sheet('Laboratório: encontre as células','Clique nos endereços solicitados. A coluna vem primeiro e a linha vem depois.',cellTasks,{mode:'cells'}),
      quiz('Entendendo intervalos',[
        {q:'A coluna A possui cabeçalho em A1 e sete produtos de A2 até A8. Qual intervalo seleciona somente os produtos?',options:['A1:A8','A2:A8','A2;A8','A:A8'],answer:1,why:'O intervalo começa em A2 para excluir o cabeçalho e termina em A8.'},
        {q:'Quantas células existem no intervalo B2:D6?',options:['12','15','18','5'],answer:1,why:'O intervalo possui 3 colunas e 5 linhas: 3 × 5 = 15 células.'},
        {q:'Uma fórmula usa C3:C12. O que isso indica?',options:['Somente as células C3 e C12','Uma sequência de dez células na coluna C','As colunas C até 12','Doze páginas da planilha'],answer:1,why:'Os dois-pontos representam todas as células contínuas de C3 até C12.'},
        {q:'Para selecionar valores das colunas Quantidade, Valor unitário e Total, nas linhas 2 a 20, qual intervalo é correto?',options:['B2:D20','B2;D20','B:D2:20','B20:D2'],answer:0,why:'B2 é o canto superior esquerdo e D20 é o canto inferior direito da área.'}
      ]),
      sheet('Organizando as abas','Crie uma estrutura lógica para uma empresa fictícia.',[
        {kind:'tab',prompt:'Renomeie a primeira aba para Produtos.',answer:'Produtos',why:'A aba deve indicar claramente quais dados ela contém.'},
        {kind:'tab',prompt:'Crie uma aba chamada Movimentações.',answer:'Movimentações',why:'Entradas e saídas devem ficar separadas do cadastro principal.'},
        {kind:'tab',prompt:'Crie uma aba chamada Resumo.',answer:'Resumo',why:'A aba Resumo pode concentrar indicadores e gráficos.'},
        {kind:'tab-order',prompt:'Escolha a ordem mais lógica.',options:['Resumo, Movimentações, Produtos','Produtos, Movimentações, Resumo','Movimentações, Resumo, Produtos'],answer:1,why:'Primeiro cadastros, depois registros e por fim o resumo.'}
      ],{mode:'tabs'}),
      quiz('Compartilhamento seguro',[
        {q:'A gerente precisa corrigir fórmulas e inserir novos registros. Qual permissão atende à tarefa?',options:['Leitor','Comentador','Editor','Qualquer pessoa com o link como leitor'],answer:2,why:'A edição de dados e fórmulas exige permissão de Editor.'},
        {q:'Um auditor externo precisa analisar o relatório e registrar observações, mas não deve alterar valores. Qual permissão é mais adequada?',options:['Editor','Comentador','Leitor sem comentários','Proprietário'],answer:1,why:'Comentador permite observações sem modificar diretamente os dados.'},
        {q:'Um relatório contém dados financeiros e será consultado por três pessoas. Qual configuração reduz mais o risco?',options:['Link público com edição','Compartilhamento nominal e permissão mínima necessária','Enviar a senha da conta junto com o link','Publicar na web e pedir cuidado'],answer:1,why:'Compartilhar nominalmente e limitar permissões segue o princípio do menor privilégio.'},
        {q:'Um funcionário deixou a equipe, mas ainda aparece como editor. Qual ação é correta?',options:['Manter o acesso para preservar o histórico','Remover o acesso e revisar outros arquivos sensíveis compartilhados','Trocar apenas o nome do arquivo','Criar uma cópia pública'],answer:1,why:'O acesso deve existir somente enquanto houver necessidade profissional.'}
      ]),
      challenge('Missão final: organize a empresa','Conclua as decisões essenciais para preparar uma planilha de controle.',[
        {q:'A aba Produtos possui código, descrição, estoque mínimo e valor unitário. A aba Movimentações registra entradas e saídas. Onde devem ficar os gráficos consolidados?',options:['Na aba Resumo, alimentada pelos dados das demais abas','Na primeira linha da aba Produtos, misturados ao cadastro','Em um arquivo separado sem ligação com os dados','Na aba Movimentações, entre os registros'],answer:0,why:'A aba Resumo concentra indicadores sem interromper os cadastros e movimentações.'},
        {q:'A tabela começa na coluna B e termina na coluna F, com dados da linha 3 até a 28. Qual intervalo representa toda a base?',options:['B3:F28','B:F3:28','B3;F28','F28:B3'],answer:0,why:'O intervalo é formado pelo canto superior esquerdo B3 e o canto inferior direito F28.'},
        {q:'O supervisor precisa visualizar e comentar possíveis divergências, mas não pode alterar valores. Qual permissão usar?',options:['Editor','Comentador','Leitor','Proprietário'],answer:1,why:'Comentador permite apontar divergências sem alterar a planilha.'},
        {q:'Qual nome de arquivo é mais adequado para uso mensal?',options:['Planilha nova','Controle de Estoque — Papelaria Horizonte — Julho/2026','final certo agora','Dados da empresa'],answer:1,why:'O nome identifica finalidade, organização e período.'}
      ],'Explorador de Células')
    ]
  },
  {
    id:'1ADM-02', classId:'1ADM', order:2, duration:45,
    title:'Formatação profissional de planilhas', subtitle:'Transforme dados soltos em uma tabela clara, legível e funcional.',icon:'✦',badge:'Designer de Dados',estimated:'15–25 min',
    objectives:['Criar hierarquia visual','Aplicar negrito, itálico, cores, fontes e bordas','Organizar títulos e cabeçalhos','Evitar excesso visual'],
    stages:[
      explain('Formatação não é apenas decoração','A formatação ajuda o leitor a entender a função de cada informação.',
        'Títulos, cabeçalhos, alinhamento, cores e bordas devem indicar hierarquia. Em uma planilha administrativa, o objetivo principal é facilitar a leitura, reduzir erros e destacar situações relevantes. Muitas cores, fontes decorativas ou contrastes fracos prejudicam a compreensão.',
        'Um cabeçalho com negrito, preenchimento leve e borda separa os nomes das colunas dos registros.',
        'Use poucas cores e mantenha um padrão. Cada cor deve ter uma função.'),
      demo('Antes e depois','Acompanhe como uma tabela desorganizada ganha hierarquia visual.',[
        'Identificar o título principal.','Selecionar o cabeçalho.','Aplicar negrito e preenchimento.','Ajustar largura das colunas.','Adicionar bordas.','Aplicar formatos numéricos coerentes.'
      ]),
      quiz('Boas escolhas visuais',[
        {q:'Qual fonte é mais adequada para uma planilha administrativa?',options:['Uma fonte decorativa difícil de ler','Uma fonte simples e legível','Cinco fontes diferentes','Somente letras maiúsculas'],answer:1,why:'Legibilidade é mais importante que efeito decorativo.'},
        {q:'Para destacar um cabeçalho, o melhor conjunto é:',options:['Negrito, preenchimento e contraste adequado','Texto piscando e várias cores','Itálico em todas as células','Fonte muito pequena'],answer:0,why:'Esse conjunto cria hierarquia sem dificultar a leitura.'},
        {q:'Bordas servem principalmente para:',options:['Aumentar o arquivo','Separar e organizar visualmente os dados','Criar fórmulas','Compartilhar a planilha'],answer:1,why:'Bordas ajudam a acompanhar registros e campos.'}
      ]),
      sheet('Oficina de formatação','Use a barra de ferramentas simulada para aplicar cada recurso.',commonFormattingTasks,{mode:'format'}),
      quiz('Encontre o problema',[
        {q:'Uma tabela usa fundo amarelo, texto branco e fonte tamanho 8. Qual é o principal problema?',options:['Fórmula incorreta','Baixo contraste e pouca legibilidade','Aba duplicada','Permissão de editor'],answer:1,why:'Cores e tamanho tornam o conteúdo difícil de ler.'},
        {q:'Toda a planilha está em negrito. O que acontece?',options:['A hierarquia visual desaparece','Os cálculos ficam mais rápidos','A planilha ganha segurança','As fórmulas são corrigidas'],answer:0,why:'Quando tudo recebe destaque, nada se destaca.'},
        {q:'Qual uso de cor é mais funcional?',options:['Uma cor por célula','Vermelho apenas para alertas e verde para situações adequadas','Cores aleatórias','Texto e fundo da mesma cor'],answer:1,why:'Cores consistentes comunicam significado.'}
      ]),
      sheet('Formate um relatório de despesas','Aplique uma sequência profissional de formatação.',[
        {kind:'tool',prompt:'Destaque o título do relatório.',answer:'bold',why:'O título precisa ser o primeiro ponto de leitura.'},
        {kind:'tool',prompt:'Centralize o cabeçalho.',answer:'center',why:'A centralização pode melhorar a leitura de nomes curtos.'},
        {kind:'tool',prompt:'Aplique preenchimento ao cabeçalho.',answer:'fill-blue',why:'O preenchimento diferencia campos e registros.'},
        {kind:'tool',prompt:'Adicione bordas à área de dados.',answer:'border-heavy',why:'Bordas orientam a leitura horizontal e vertical.'},
        {kind:'tool',prompt:'Use vermelho no texto “ATRASADO”.',answer:'text-red',why:'Vermelho comunica alerta ou pendência.'}
      ],{mode:'format'}),
      challenge('Missão final: escolha o padrão correto','Analise decisões de formatação de uma planilha administrativa.',[
        {q:'Qual título é mais claro?',options:['Relatório','Relatório de Despesas — Agosto/2026','Dados novos','Arquivo final'],answer:1,why:'O título informa assunto e período.'},
        {q:'Qual combinação oferece melhor contraste?',options:['Texto branco em fundo amarelo claro','Texto escuro em fundo claro','Texto cinza em fundo cinza','Texto azul sobre fundo azul'],answer:1,why:'Contraste adequado melhora a acessibilidade.'},
        {q:'Quando usar itálico?',options:['Em todas as células','Para observações ou informações secundárias','Para substituir fórmulas','Para esconder dados'],answer:1,why:'O itálico diferencia observações sem competir com o conteúdo principal.'}
      ],'Designer de Dados')
    ]
  },
  {
    id:'1ADM-03', classId:'1ADM', order:3, duration:45,
    title:'Operações matemáticas com células', subtitle:'Crie cálculos automáticos usando +, −, × e ÷.',icon:'±',badge:'Operador de Fórmulas',estimated:'15–25 min',
    objectives:['Iniciar fórmulas com =','Usar referências de células','Aplicar +, -, * e /','Entender atualização automática'],
    stages:[
      explain('Como uma fórmula funciona','Uma fórmula é uma instrução de cálculo que começa com o sinal de igualdade.',
        'Ao usar referências como B2 e C2, o resultado é atualizado automaticamente quando os valores mudam. Isso é melhor do que digitar valores fixos dentro da fórmula. Os operadores usados são + para adição, - para subtração, * para multiplicação e / para divisão.',
        '=B2*C2 calcula quantidade vezes valor unitário.',
        'No teclado, a multiplicação usa asterisco (*) e a divisão usa barra (/).'),
      demo('Montando uma fórmula passo a passo','Veja como calcular o total de um produto.',[
        'Selecionar a célula do resultado.','Digitar =.','Selecionar a célula da quantidade.','Digitar *.','Selecionar a célula do valor unitário.','Pressionar Enter.'
      ]),
      formula('Adição e subtração','Monte fórmulas para situações administrativas.',[
        {prompt:'Somar B2 e C2',tokens:['=','B2','+','C2'],answer:'=B2+C2',why:'O operador + adiciona os valores das duas células.'},
        {prompt:'Calcular entrada menos saída',tokens:['=','B3','-','C3'],answer:'=B3-C3',why:'A subtração calcula o estoque restante.'},
        {prompt:'Somar receita de dois setores',tokens:['=','D2','+','E2'],answer:'=D2+E2',why:'As referências mantêm o cálculo atualizado.'},
        {prompt:'Calcular saldo: receita menos despesa',tokens:['=','F2','-','G2'],answer:'=F2-G2',why:'Saldo é a diferença entre entradas e saídas financeiras.'}
      ]),
      formula('Multiplicação e divisão','Aplique os operadores usados em preços e parcelas.',[
        {prompt:'Quantidade B2 vezes valor C2',tokens:['=','B2','*','C2'],answer:'=B2*C2',why:'O asterisco representa multiplicação.'},
        {prompt:'Total D2 dividido em 4 parcelas',tokens:['=','D2','/','4'],answer:'=D2/4',why:'A barra representa divisão.'},
        {prompt:'Horas E2 vezes valor por hora F2',tokens:['=','E2','*','F2'],answer:'=E2*F2',why:'Multiplicar horas pelo valor unitário gera o pagamento total.'},
        {prompt:'Valor G2 dividido pela quantidade H2',tokens:['=','G2','/','H2'],answer:'=G2/H2',why:'A divisão encontra o valor médio por unidade.'}
      ]),
      quiz('Erros comuns',[
        {q:'Qual fórmula está correta?',options:['B2*C2','=B2xC2','=B2*C2','=B2.C2'],answer:2,why:'A fórmula começa com = e usa * para multiplicar.'},
        {q:'Por que =10*5 é menos flexível que =B2*C2?',options:['Porque não calcula','Porque usa valores fixos e não acompanha alterações nas células','Porque o sinal = é proibido','Porque a multiplicação não existe'],answer:1,why:'Referências permitem atualização automática.'},
        {q:'O que acontece se C2 mudar de 5 para 8 em =B2*C2?',options:['Nada','O resultado é atualizado automaticamente','A fórmula é apagada','A aba é renomeada'],answer:1,why:'A planilha recalcula fórmulas quando os dados mudam.'},
        {q:'Qual operador representa divisão?',options:['*','/','+','&'],answer:1,why:'A barra / é usada para dividir.'}
      ]),
      sheet('Laboratório de cálculos','Escolha a fórmula correta para cada coluna.',[
        {kind:'choice',prompt:'Total do item: quantidade em B2 e valor em C2.',options:['=B2+C2','=B2*C2','=B2/C2','=B2-C2'],answer:1,why:'Quantidade vezes valor unitário gera o total.'},
        {kind:'choice',prompt:'Estoque atual: entrada em D2 e saída em E2.',options:['=D2-E2','=D2+E2','=D2*E2','=D2/E2'],answer:0,why:'O estoque atual é a entrada menos a saída.'},
        {kind:'choice',prompt:'Valor de cada parcela: total em F2, 5 parcelas.',options:['=F2*5','=F2-5','=F2/5','=F2+5'],answer:2,why:'Dividir o total pela quantidade de parcelas encontra o valor de cada uma.'},
        {kind:'choice',prompt:'Receita total de dois canais em G2 e H2.',options:['=G2+H2','=G2-H2','=G2/H2','=G2*H2'],answer:0,why:'As receitas devem ser somadas.'}
      ],{mode:'choices'}),
      challenge('Missão final: automatize a loja','Resolva situações de compras, estoque e parcelamento.',[
        {q:'12 unidades a R$ 8,50 cada. Qual fórmula?',options:['=12+8,50','=B2*C2','=B2-C2','=SOMA(B2:C2)'],answer:1,why:'A referência quantidade * valor unitário automatiza o total.'},
        {q:'Entraram 50 unidades e saíram 18. Qual operação?',options:['Adição','Subtração','Multiplicação','Concatenação'],answer:1,why:'Saídas devem ser descontadas das entradas.'},
        {q:'Um total será dividido em 6 parcelas. Qual operador?',options:['+','-','*','/'],answer:3,why:'Divisão calcula o valor de cada parcela.'}
      ],'Operador de Fórmulas')
    ]
  },
  {
    id:'1ADM-04', classId:'1ADM', order:4, duration:45,
    title:'SOMA, MÉDIA, MÁXIMO e MÍNIMO', subtitle:'Resuma conjuntos de dados e encontre informações importantes.',icon:'ƒ',badge:'Analista de Valores',estimated:'15–25 min',
    objectives:['Compreender intervalos','Escolher a função adequada','Calcular total e média','Encontrar maior e menor valor'],
    stages:[
      explain('Funções economizam trabalho','Funções realizam cálculos prontos sobre um intervalo de células.',
        'SOMA totaliza valores; MÉDIA calcula o valor médio; MÁXIMO retorna o maior número; MÍNIMO retorna o menor. Em todas elas, o intervalo costuma ser escrito com dois-pontos, por exemplo B2:B10.',
        '=MÉDIA(C2:C8) calcula a média de sete registros.',
        'Não confunda dois-pontos (intervalo contínuo) com ponto e vírgula (separação de argumentos).'),
      demo('Lendo a sintaxe','Observe as partes de uma função.',[
        'Sinal de igualdade.','Nome da função.','Parêntese de abertura.','Intervalo inicial e final.','Parêntese de fechamento.'
      ]),
      formula('Construa as funções','Monte a expressão correta.',[
        {prompt:'Somar valores de B2 até B10',tokens:['=','SOMA','(','B2:B10',')'],answer:'=SOMA(B2:B10)',why:'SOMA totaliza todo o intervalo.'},
        {prompt:'Calcular média de C2 até C8',tokens:['=','MÉDIA','(','C2:C8',')'],answer:'=MÉDIA(C2:C8)',why:'MÉDIA divide a soma pela quantidade de valores.'},
        {prompt:'Encontrar maior valor de D2 até D15',tokens:['=','MÁXIMO','(','D2:D15',')'],answer:'=MÁXIMO(D2:D15)',why:'MÁXIMO retorna o maior número do intervalo.'},
        {prompt:'Encontrar menor valor de E2 até E20',tokens:['=','MÍNIMO','(','E2:E20',')'],answer:'=MÍNIMO(E2:E20)',why:'MÍNIMO retorna o menor número do intervalo.'}
      ]),
      quiz('Escolha a função',[
        {q:'Qual função calcula o total das despesas?',options:['MÉDIA','SOMA','MÁXIMO','MÍNIMO'],answer:1,why:'SOMA totaliza os valores.'},
        {q:'Qual função mostra a venda média?',options:['MÉDIA','SOMA','MÍNIMO','SE'],answer:0,why:'MÉDIA representa um valor central calculado pela soma dividida pela quantidade.'},
        {q:'Qual função encontra a maior despesa?',options:['MÍNIMO','CONT.SE','MÁXIMO','SOMA'],answer:2,why:'MÁXIMO retorna o maior valor.'},
        {q:'Qual função encontra o menor estoque?',options:['MÍNIMO','MÁXIMO','MÉDIA','SOMASE'],answer:0,why:'MÍNIMO retorna o menor valor.'}
      ]),
      quiz('Corrija os erros',[
        {q:'Qual fórmula soma B2 até B10?',options:['=SOMA(B2-B10)','=SOMA(B2:B10)','=SOMA B2:B10','=B2:B10'],answer:1,why:'O intervalo deve ficar entre parênteses e usar dois-pontos.'},
        {q:'Qual fórmula calcula a média?',options:['=MÉDIA(C2:C7)','=SOMA(C2:C7)','=C2+C7','=MÁXIMO(C2:C7)'],answer:0,why:'A função correta é MÉDIA.'},
        {q:'Em =MÁXIMO(D2:D12), o resultado será:',options:['A soma','O menor valor','O maior valor','A quantidade de células'],answer:2,why:'MÁXIMO retorna o maior valor numérico.'}
      ]),
      sheet('Laboratório administrativo','Escolha a função mais adequada para cada indicador.',[
        {kind:'choice',prompt:'Total vendido no mês.',options:['SOMA','MÉDIA','MÁXIMO','MÍNIMO'],answer:0,why:'O total é obtido por SOMA.'},
        {kind:'choice',prompt:'Ticket médio das vendas.',options:['SOMA','MÉDIA','MÁXIMO','MÍNIMO'],answer:1,why:'Ticket médio é uma média.'},
        {kind:'choice',prompt:'Maior venda registrada.',options:['MÍNIMO','MÁXIMO','MÉDIA','SOMA'],answer:1,why:'MÁXIMO encontra o maior valor.'},
        {kind:'choice',prompt:'Menor quantidade em estoque.',options:['MÍNIMO','MÁXIMO','SOMA','SE'],answer:0,why:'MÍNIMO encontra o menor valor.'}
      ],{mode:'choices'}),
      challenge('Missão final: painel de indicadores','Escolha funções para preencher quatro cartões de resumo.',[
        {q:'Cartão “Receita total” usa:',options:['SOMA','MÉDIA','MÁXIMO','MÍNIMO'],answer:0,why:'Receita total soma todos os registros.'},
        {q:'Cartão “Venda média” usa:',options:['MÍNIMO','MÉDIA','SOMA','CONT.SE'],answer:1,why:'Venda média usa MÉDIA.'},
        {q:'Cartão “Maior venda” usa:',options:['MÁXIMO','MÍNIMO','SOMA','SE'],answer:0,why:'MÁXIMO encontra o maior registro.'},
        {q:'Cartão “Menor venda” usa:',options:['MÉDIA','SOMA','MÍNIMO','MÁXIMO'],answer:2,why:'MÍNIMO encontra o menor registro.'}
      ],'Analista de Valores')
    ]
  },
  {
    id:'1ADM-05', classId:'1ADM', order:5, duration:45,
    title:'Função SE e tomada de decisão', subtitle:'Faça a planilha classificar situações automaticamente.',icon:'◇',badge:'Especialista em Decisões',estimated:'15–25 min',
    objectives:['Entender condição, verdadeiro e falso','Usar operadores de comparação','Criar classificações automáticas','Corrigir condições invertidas'],
    stages:[
      explain('A planilha também pode decidir','A função SE verifica uma condição e apresenta um resultado para verdadeiro e outro para falso.',
        'A estrutura é =SE(condição; resultado_se_verdadeiro; resultado_se_falso). Os textos devem ficar entre aspas. Operadores como >, <, >=, <= e = permitem comparar valores. No contexto administrativo, SE pode indicar estoque baixo, meta atingida, pagamento em atraso ou cliente elegível.',
        '=SE(D2<10;"REPOR";"ESTOQUE OK")',
        'Leia a fórmula como uma frase: “Se D2 for menor que 10, mostrar REPOR; caso contrário, mostrar ESTOQUE OK”.'),
      demo('Desmontando a função SE','Veja cada parte da decisão.',[
        'Identificar o valor analisado.','Definir a condição.','Escolher o resultado verdadeiro.','Escolher o resultado falso.','Testar com valores diferentes.'
      ]),
      quiz('Operadores de comparação',[
        {q:'Qual operador significa “maior ou igual”?',options:['>','>=','<=','<>'],answer:1,why:'O sinal >= combina maior que e igual.'},
        {q:'Qual condição verifica estoque menor que 10?',options:['D2>10','D2<10','D2=10','D2/10'],answer:1,why:'O operador < significa menor que.'},
        {q:'Qual condição verifica meta de pelo menos R$ 1.000?',options:['C2>=1000','C2<1000','C2=0','C2*1000'],answer:0,why:'“Pelo menos” inclui valores iguais ou maiores.'}
      ]),
      formula('Monte decisões automáticas','Organize os blocos da função SE.',[
        {prompt:'Se B2 for menor que 10, mostrar REPOR; senão, OK',tokens:['=','SE','(','B2<10',';','"REPOR"',';','"OK"',')'],answer:'=SE(B2<10;"REPOR";"OK")',why:'A condição vem primeiro, seguida pelos resultados verdadeiro e falso.'},
        {prompt:'Se C2 for maior ou igual a 1000, mostrar META; senão, ABAIXO',tokens:['=','SE','(','C2>=1000',';','"META"',';','"ABAIXO"',')'],answer:'=SE(C2>=1000;"META";"ABAIXO")',why:'O operador >= inclui o valor 1000.'},
        {prompt:'Se D2 for igual a PAGO, mostrar CONCLUÍDO; senão, PENDENTE',tokens:['=','SE','(','D2="PAGO"',';','"CONCLUÍDO"',';','"PENDENTE"',')'],answer:'=SE(D2="PAGO";"CONCLUÍDO";"PENDENTE")',why:'Textos usados na condição também precisam de aspas.'}
      ]),
      quiz('Interprete a fórmula',[
        {q:'Em =SE(B2<5;"CRÍTICO";"NORMAL"), se B2 for 3, o resultado é:',options:['NORMAL','CRÍTICO','3','ERRO'],answer:1,why:'3 é menor que 5, então a condição é verdadeira.'},
        {q:'Na mesma fórmula, se B2 for 8:',options:['CRÍTICO','NORMAL','8','Vazio'],answer:1,why:'8 não é menor que 5, então aparece o resultado falso.'},
        {q:'Qual problema existe em =SE(C2>=1000;META;ABAIXO)?',options:['Falta multiplicação','Os textos precisam de aspas','Não pode usar >=','Falta SOMA'],answer:1,why:'Resultados textuais devem ficar entre aspas.'}
      ]),
      sheet('Laboratório de decisões','Escolha a regra adequada para cada situação.',[
        {kind:'choice',prompt:'Estoque abaixo de 8 unidades deve mostrar REPOR.',options:['=SE(D2<8;"REPOR";"OK")','=SE(D2>8;"REPOR";"OK")','=SOMA(D2<8)','=CONT.SE(D2;8)'],answer:0,why:'A condição correta verifica se D2 é menor que 8.'},
        {kind:'choice',prompt:'Venda de R$ 1.500 ou mais atinge a meta.',options:['=SE(E2>=1500;"ATINGIDA";"NÃO")','=SE(E2<1500;"ATINGIDA";"NÃO")','=E2*1500','=MÁXIMO(E2)'],answer:0,why:'“Ou mais” pede o operador >=.'},
        {kind:'choice',prompt:'Pagamento igual a PAGO deve mostrar FINALIZADO.',options:['=SE(F2="PAGO";"FINALIZADO";"PENDENTE")','=SE(F2>PAGO;"FINALIZADO";"PENDENTE")','=SOMA(F2)','=F2+PAGO'],answer:0,why:'Comparações de texto exigem aspas.'}
      ],{mode:'choices'}),
      challenge('Missão final: regras da empresa','Defina decisões automáticas para estoque, metas e pagamentos.',[
        {q:'Qual fórmula classifica saldo negativo?',options:['=SE(B2<0;"NEGATIVO";"POSITIVO")','=SE(B2>0;"NEGATIVO";"POSITIVO")','=SOMA(B2)','=B2<0'],answer:0,why:'Saldo menor que zero é negativo.'},
        {q:'Se a nota for 7 ou maior, mostrar APROVADO. Qual condição?',options:['C2<7','C2>=7','C2=0','C2/7'],answer:1,why:'Sete também deve ser aceito, portanto usa >=.'},
        {q:'O terceiro argumento da função SE representa:',options:['A condição','O resultado se verdadeiro','O resultado se falso','O nome da aba'],answer:2,why:'Após a condição e o resultado verdadeiro, vem o resultado falso.'}
      ],'Especialista em Decisões')
    ]
  },
  {
    id:'1ADM-06', classId:'1ADM', order:6, duration:45,
    title:'CONT.SE, SOMASE e concatenação', subtitle:'Conte, some por critérios e una informações automaticamente.',icon:'∑',badge:'Mestre dos Critérios',estimated:'15–25 min',
    objectives:['Diferenciar contar e somar','Usar critérios textuais e numéricos','Aplicar CONT.SE e SOMASE','Concatenar textos'],
    stages:[
      explain('Critérios transformam dados em informação','CONT.SE conta quantas células atendem a uma regra. SOMASE soma valores relacionados a uma regra.',
        'CONT.SE recebe intervalo e critério. SOMASE recebe intervalo do critério, critério e intervalo da soma. A concatenação une textos usando o operador & ou a função CONCATENAR. Essas ferramentas permitem contar pendências, somar vendas por setor e gerar descrições automáticas.',
        '=CONT.SE(D2:D20;"REPOR") e =SOMASE(A2:A20;"Vendas";B2:B20)',
        'Pergunte: preciso saber “quantos” ou “quanto em dinheiro”? Quantos sugere CONT.SE; quanto sugere SOMASE.'),
      demo('CONT.SE ou SOMASE?','Compare as duas perguntas.',[
        'Quantos pagamentos estão pendentes? → CONT.SE.','Qual o valor total dos pagamentos pendentes? → SOMASE.','Qual coluna contém o critério?','Qual coluna contém os valores a somar?'
      ]),
      formula('Construa CONT.SE','Monte funções de contagem por critério.',[
        {prompt:'Contar quantas células em D2:D20 contêm REPOR',tokens:['=','CONT.SE','(','D2:D20',';','"REPOR"',')'],answer:'=CONT.SE(D2:D20;"REPOR")',why:'CONT.SE usa um intervalo e um critério.'},
        {prompt:'Contar valores maiores que 100 em C2:C30',tokens:['=','CONT.SE','(','C2:C30',';','">100"',')'],answer:'=CONT.SE(C2:C30;">100")',why:'Critérios com operadores ficam entre aspas.'},
        {prompt:'Contar registros PENDENTE em E2:E50',tokens:['=','CONT.SE','(','E2:E50',';','"PENDENTE"',')'],answer:'=CONT.SE(E2:E50;"PENDENTE")',why:'O critério textual deve ficar entre aspas.'}
      ]),
      formula('Construa SOMASE','Some valores relacionados a categorias.',[
        {prompt:'Somar B2:B20 quando A2:A20 for Vendas',tokens:['=','SOMASE','(','A2:A20',';','"Vendas"',';','B2:B20',')'],answer:'=SOMASE(A2:A20;"Vendas";B2:B20)',why:'Primeiro vem o intervalo do critério; por último, o intervalo da soma.'},
        {prompt:'Somar D2:D30 quando C2:C30 for Marketing',tokens:['=','SOMASE','(','C2:C30',';','"Marketing"',';','D2:D30',')'],answer:'=SOMASE(C2:C30;"Marketing";D2:D30)',why:'A função soma os valores de D correspondentes à categoria Marketing em C.'},
        {prompt:'Somar F2:F20 quando E2:E20 for PAGO',tokens:['=','SOMASE','(','E2:E20',';','"PAGO"',';','F2:F20',')'],answer:'=SOMASE(E2:E20;"PAGO";F2:F20)',why:'Somente valores com situação PAGO entram no total.'}
      ]),
      quiz('Conte ou some?',[
        {q:'Quantos produtos precisam de reposição?',options:['SOMA','CONT.SE','SOMASE','MÉDIA'],answer:1,why:'A pergunta solicita quantidade de registros.'},
        {q:'Qual o valor total de vendas do setor A?',options:['CONT.SE','MÁXIMO','SOMASE','CONCATENAR'],answer:2,why:'É preciso somar valores que atendem ao critério setor A.'},
        {q:'Quantos pagamentos são maiores que R$ 500?',options:['CONT.SE','SOMASE','SOMA','MÍNIMO'],answer:0,why:'A pergunta pede quantos registros atendem à condição.'}
      ]),
      formula('Concatene informações','Una textos e células.',[
        {prompt:'Unir nome A2 e sobrenome B2 com espaço',tokens:['=','A2','&','" "','&','B2'],answer:'=A2&" "&B2',why:'O texto " " insere um espaço entre os valores.'},
        {prompt:'Criar código com setor A2, hífen e número B2',tokens:['=','A2','&','"-"','&','B2'],answer:'=A2&"-"&B2',why:'O operador & une os conteúdos.'},
        {prompt:'Usar a função CONCATENAR para nome e sobrenome',tokens:['=','CONCATENAR','(','A2',';','" "',';','B2',')'],answer:'=CONCATENAR(A2;" ";B2)',why:'CONCATENAR recebe os trechos separados por ponto e vírgula.'}
      ]),
      challenge('Missão final: resumo por critérios','Escolha a função correta para cada indicador.',[
        {q:'Número de registros “ATRASADO”:',options:['CONT.SE','SOMASE','SOMA','MÉDIA'],answer:0,why:'CONT.SE conta ocorrências.'},
        {q:'Valor total da categoria “Transporte”:',options:['CONT.SE','SOMASE','MÍNIMO','CONCATENAR'],answer:1,why:'SOMASE soma valores vinculados a um critério.'},
        {q:'Gerar “ADM-102” a partir de A2 e B2:',options:['=A2+B2','=A2&"-"&B2','=SOMA(A2:B2)','=CONT.SE(A2;B2)'],answer:1,why:'O operador & concatena textos e valores.'}
      ],'Mestre dos Critérios')
    ]
  },
  {
    id:'1ADM-07', classId:'1ADM', order:7, duration:45,
    title:'Formatação condicional e integração', subtitle:'Destaque automaticamente o que exige atenção e integre tudo o que aprendeu.',icon:'◉',badge:'Guardião dos Indicadores',estimated:'15–25 min',
    objectives:['Criar regras visuais automáticas','Escolher cores com significado','Integrar fórmulas e formatação','Interpretar resultados'],
    stages:[
      explain('A cor pode responder aos dados','A formatação condicional muda a aparência de uma célula quando uma regra é atendida.',
        'Ela pode destacar valores menores que o estoque mínimo, pagamentos atrasados, metas alcançadas ou resultados fora do padrão. A cor não altera o valor; apenas facilita a leitura. Regras devem ser consistentes e não depender apenas de cor para comunicar informação.',
        'Células com estoque menor que 10 podem receber preenchimento vermelho e texto “REPOR”.',
        'Combine cor com texto ou ícone para melhorar a acessibilidade.'),
      demo('Criando uma regra','Acompanhe o processo em uma planilha.',[
        'Selecionar o intervalo.','Abrir Formatação condicional.','Escolher a condição.','Definir o valor ou texto.','Escolher o estilo.','Confirmar e testar.'
      ]),
      quiz('Escolha a regra adequada',[
        {q:'Para destacar estoque abaixo de 10, use:',options:['Maior que 10','Menor que 10','Igual a 100','Texto contém PAGO'],answer:1,why:'A regra deve refletir exatamente o limite crítico.'},
        {q:'Para destacar a palavra “ATRASADO”, use:',options:['Texto contém','Média','Soma','Intervalo vazio'],answer:0,why:'Uma regra textual localiza a palavra informada.'},
        {q:'Qual combinação é mais acessível?',options:['Somente cor vermelha','Cor vermelha + texto “CRÍTICO”','Texto branco em fundo amarelo','Cinco cores aleatórias'],answer:1,why:'Texto e cor juntos reduzem dependência exclusiva da percepção de cor.'}
      ]),
      sheet('Laboratório de regras visuais','Escolha a configuração correta.',[
        {kind:'choice',prompt:'Destacar quantidades menores que 10.',options:['Regra: maior que 10','Regra: menor que 10','Regra: igual a vazio','Sem regra'],answer:1,why:'A condição deve marcar valores abaixo do limite.'},
        {kind:'choice',prompt:'Destacar situação “REPOR”.',options:['Texto contém REPOR','Número maior que REPOR','Média de REPOR','Soma de REPOR'],answer:0,why:'A coluna contém um texto, portanto usa regra textual.'},
        {kind:'choice',prompt:'Destacar metas de R$ 2.000 ou mais.',options:['Menor que 2000','Maior ou igual a 2000','Igual a 0','Texto contém 2000'],answer:1,why:'A meta inclui valores iguais ou superiores a 2000.'},
        {kind:'choice',prompt:'Melhor padrão para crítico/atenção/adequado.',options:['Vermelho/amarelo/verde','Três tons quase iguais','Tudo vermelho','Cores sem legenda'],answer:0,why:'O padrão é reconhecível, mas deve ser acompanhado de rótulos.'}
      ],{mode:'choices'}),
      quiz('Integração de conhecimentos',[
        {q:'Qual fórmula calcula o total de B2:B20?',options:['=SOMA(B2:B20)','=CONT.SE(B2:B20)','=SE(B2:B20)','=B2&B20'],answer:0,why:'SOMA totaliza o intervalo.'},
        {q:'Qual fórmula classifica estoque abaixo de 10?',options:['=SE(D2<10;"REPOR";"OK")','=SOMA(D2<10)','=CONT.SE(D2;10)','=D2&10'],answer:0,why:'SE testa a condição e devolve um rótulo.'},
        {q:'Qual função conta quantos itens estão como REPOR?',options:['SOMASE','CONT.SE','MÉDIA','MÍNIMO'],answer:1,why:'CONT.SE conta registros por critério.'},
        {q:'Qual função soma vendas da categoria Online?',options:['SOMASE','CONT.SE','MÁXIMO','CONCATENAR'],answer:0,why:'SOMASE soma valores vinculados a uma categoria.'}
      ]),
      sheet('Projeto integrado','Tome decisões para finalizar uma planilha de estoque.',[
        {kind:'choice',prompt:'Calcular total por item.',options:['=B2*C2','=B2+C2','=B2/C2','=B2&C2'],answer:0,why:'Quantidade vezes valor unitário.'},
        {kind:'choice',prompt:'Calcular estoque atual.',options:['=D2-E2','=D2+E2','=D2*E2','=D2/E2'],answer:0,why:'Entradas menos saídas.'},
        {kind:'choice',prompt:'Classificar estoque baixo.',options:['=SE(F2<10;"REPOR";"OK")','=SOMA(F2)','=CONT.SE(F2;10)','=F2&10'],answer:0,why:'SE cria a classificação automática.'},
        {kind:'choice',prompt:'Contar itens para reposição.',options:['=CONT.SE(G2:G20;"REPOR")','=SOMA(G2:G20)','=MÉDIA(G2:G20)','=G2&G20'],answer:0,why:'CONT.SE conta células com o critério.'}
      ],{mode:'choices'}),
      challenge('Desafio integrador do 1º ADM','Conclua o plano de automação e apresentação.',[
        {q:'Qual sequência é mais lógica?',options:['Formatar antes de criar dados e fórmulas','Organizar dados, criar fórmulas, validar resultados e então formatar','Aplicar cores aleatórias e depois apagar','Compartilhar como editor para qualquer pessoa'],answer:1,why:'A estrutura e os cálculos vêm antes do acabamento visual.'},
        {q:'Formatação condicional altera o valor da célula?',options:['Sim','Não, altera apenas a aparência','Apaga a fórmula','Cria uma nova aba'],answer:1,why:'Ela reage ao valor sem modificá-lo.'},
        {q:'Qual combinação oferece melhor acompanhamento?',options:['SE para classificar + CONT.SE para contar + formatação condicional para destacar','Somente cores manuais','Somente título','Somente concatenação'],answer:0,why:'As três ferramentas automatizam classificação, resumo e visualização.'}
      ],'Guardião dos Indicadores')
    ]
  },
  {
    id:'2ADM-01', classId:'2ADM', order:1, duration:45,
    title:'Estrutura, referências e automação administrativa', subtitle:'Revise rapidamente e construa um controle de estoque mais eficiente.',icon:'⚙',badge:'Arquiteto de Planilhas',estimated:'15–25 min',
    objectives:['Revisar referências e intervalos','Estruturar abas conectadas','Automatizar cálculos','Diagnosticar erros de fórmula'],
    stages:[
      explain('Do registro ao sistema de controle','Uma planilha administrativa eficiente separa cadastros, movimentações e indicadores.',
        'No 2º ADM, o foco não é apenas executar comandos, mas projetar uma estrutura que evite repetição, facilite manutenção e gere informações confiáveis. Referências, intervalos e cópia de fórmulas devem seguir um padrão coerente.',
        'Abas Produtos, Movimentações e Resumo formam um fluxo de dados.',
        'Antes de criar fórmulas, defina quais dados são de entrada, quais são calculados e quais são indicadores.'),
      demo('Arquitetura de uma planilha de estoque','Analise o fluxo entre as abas.',[
        'Produtos: cadastro e estoque mínimo.','Movimentações: entradas e saídas por data.','Resumo: totais, alertas e gráficos.','Anotações: fontes, decisões e observações.'
      ]),
      sheet('Revisão de referências','Localize células e intervalos usados no controle.',cellTasks.slice(0,8),{mode:'cells'}),
      formula('Automatize cálculos','Monte fórmulas de estoque, custo e saldo.',[
        {prompt:'Quantidade B2 vezes valor C2',tokens:['=','B2','*','C2'],answer:'=B2*C2',why:'Calcula o valor total do item.'},
        {prompt:'Entrada D2 menos saída E2',tokens:['=','D2','-','E2'],answer:'=D2-E2',why:'Calcula o estoque atual.'},
        {prompt:'Somar valores F2 até F25',tokens:['=','SOMA','(','F2:F25',')'],answer:'=SOMA(F2:F25)',why:'Totaliza a coluna de valores.'},
        {prompt:'Calcular média G2 até G25',tokens:['=','MÉDIA','(','G2:G25',')'],answer:'=MÉDIA(G2:G25)',why:'Calcula o valor médio das movimentações.'}
      ]),
      quiz('Auditoria de fórmulas',[
        {q:'Uma fórmula foi copiada para baixo, mas todas as linhas usam B2*C2. O problema provável é:',options:['As referências foram digitadas como texto ou fixadas indevidamente','A planilha está sem cor','Falta uma aba','O arquivo está compartilhado'],answer:0,why:'A cópia deve ajustar referências relativas para cada linha.'},
        {q:'Qual fórmula totaliza F2 até F30?',options:['=SOMA(F2-F30)','=SOMA(F2:F30)','=F2:F30','=MÁXIMO(F2:F30)'],answer:1,why:'Dois-pontos representam intervalo contínuo.'},
        {q:'Qual estrutura reduz erros?',options:['Misturar cadastro e movimentação sem cabeçalho','Separar entradas manuais de resultados calculados','Usar valores fixos em todas as fórmulas','Ocultar todos os títulos'],answer:1,why:'A separação ajuda o usuário a saber onde digitar e onde não alterar.'}
      ]),
      sheet('Laboratório: controle automatizado','Escolha fórmulas para completar a estrutura.',[
        {kind:'choice',prompt:'Valor total do produto.',options:['=B2*C2','=B2+C2','=B2/C2','=B2&C2'],answer:0,why:'Quantidade vezes valor unitário.'},
        {kind:'choice',prompt:'Estoque atual.',options:['=D2-E2','=D2+E2','=D2*E2','=D2/E2'],answer:0,why:'Entradas menos saídas.'},
        {kind:'choice',prompt:'Maior movimentação.',options:['=MÁXIMO(F2:F30)','=MÍNIMO(F2:F30)','=MÉDIA(F2:F30)','=CONT.SE(F2:F30)'],answer:0,why:'MÁXIMO encontra o maior valor.'},
        {kind:'choice',prompt:'Menor estoque.',options:['=MÍNIMO(G2:G30)','=MÁXIMO(G2:G30)','=SOMA(G2:G30)','=SE(G2:G30)'],answer:0,why:'MÍNIMO encontra o menor estoque.'}
      ],{mode:'choices'}),
      challenge('Missão final: arquitetura confiável','Escolha decisões de estrutura e automação.',[
        {q:'Qual aba deve receber registros diários?',options:['Movimentações','Resumo','Gráficos apenas','Configurações'],answer:0,why:'Movimentações centraliza entradas e saídas por data.'},
        {q:'Qual aba deve apresentar indicadores?',options:['Produtos','Resumo','Rascunho','Permissões'],answer:1,why:'Resumo concentra resultados e visualizações.'},
        {q:'O melhor uso de referências é:',options:['Valores fixos em todas as fórmulas','Referências de células que se ajustam aos dados','Digitar o resultado manualmente','Copiar números de uma calculadora'],answer:1,why:'Referências mantêm o cálculo automático e auditável.'}
      ],'Arquiteto de Planilhas')
    ]
  },
  {
    id:'2ADM-02', classId:'2ADM', order:2, duration:45,
    title:'SE, CONT.SE, SOMASE e regras empresariais', subtitle:'Classifique, conte e some informações para apoiar decisões.',icon:'◆',badge:'Analista de Regras',estimated:'15–25 min',
    objectives:['Construir regras empresariais','Usar critérios textuais e numéricos','Combinar SE, CONT.SE e SOMASE','Aplicar alertas visuais'],
    stages:[
      explain('Transformando dados em decisões','Regras empresariais traduzem critérios da organização para fórmulas.',
        'SE classifica cada registro; CONT.SE resume quantidades; SOMASE resume valores; formatação condicional destaca exceções. A combinação permite monitorar estoque, pagamentos, metas e categorias sem conferir linha por linha.',
        'SE marca “REPOR”; CONT.SE conta quantos itens estão nessa situação; SOMASE calcula o valor desses itens.',
        'Defina a regra em linguagem comum antes de escrever a fórmula.'),
      demo('Fluxo de decisão','Observe a sequência lógica.',[
        'Definir o limite de estoque.','Classificar cada linha com SE.','Contar classificações com CONT.SE.','Somar valores relacionados com SOMASE.','Destacar situações críticas.'
      ]),
      formula('Classifique com SE','Monte regras administrativas.',[
        {prompt:'Estoque D2 menor que 10: REPOR; senão NORMAL',tokens:['=','SE','(','D2<10',';','"REPOR"',';','"NORMAL"',')'],answer:'=SE(D2<10;"REPOR";"NORMAL")',why:'A condição classifica o estoque pelo limite.'},
        {prompt:'Prazo E2 igual a VENCIDO: ATRASADO; senão NO PRAZO',tokens:['=','SE','(','E2="VENCIDO"',';','"ATRASADO"',';','"NO PRAZO"',')'],answer:'=SE(E2="VENCIDO";"ATRASADO";"NO PRAZO")',why:'Comparações de texto usam aspas.'},
        {prompt:'Venda F2 maior ou igual a 2000: META; senão ABAIXO',tokens:['=','SE','(','F2>=2000',';','"META"',';','"ABAIXO"',')'],answer:'=SE(F2>=2000;"META";"ABAIXO")',why:'O operador >= inclui exatamente 2000.'}
      ]),
      formula('Resuma com critérios','Construa CONT.SE e SOMASE.',[
        {prompt:'Contar REPOR em G2:G30',tokens:['=','CONT.SE','(','G2:G30',';','"REPOR"',')'],answer:'=CONT.SE(G2:G30;"REPOR")',why:'Conta os registros classificados como REPOR.'},
        {prompt:'Somar H2:H30 quando G2:G30 for REPOR',tokens:['=','SOMASE','(','G2:G30',';','"REPOR"',';','H2:H30',')'],answer:'=SOMASE(G2:G30;"REPOR";H2:H30)',why:'Soma os valores correspondentes aos itens que precisam de reposição.'},
        {prompt:'Contar pagamentos PENDENTE em I2:I50',tokens:['=','CONT.SE','(','I2:I50',';','"PENDENTE"',')'],answer:'=CONT.SE(I2:I50;"PENDENTE")',why:'Resume o número de pendências.'}
      ]),
      quiz('Interprete o resultado',[
        {q:'CONT.SE retorna:',options:['A soma dos valores','A quantidade de registros que atendem ao critério','O maior valor','Uma cor'],answer:1,why:'CONT.SE é uma função de contagem.'},
        {q:'SOMASE precisa de um intervalo de soma quando:',options:['O critério e o valor estão em colunas diferentes','A planilha tem título','Existe somente uma aba','O arquivo é compartilhado'],answer:0,why:'O terceiro argumento indica quais valores devem ser somados.'},
        {q:'Por que usar formatação condicional junto com SE?',options:['Para alterar os números','Para tornar as classificações visíveis rapidamente','Para excluir fórmulas','Para criar senha'],answer:1,why:'A cor reforça o alerta gerado pela classificação.'}
      ]),
      sheet('Laboratório de regras empresariais','Escolha a fórmula que responde à pergunta de gestão.',[
        {kind:'choice',prompt:'Quantos pagamentos estão pendentes?',options:['=CONT.SE(I2:I50;"PENDENTE")','=SOMASE(I2:I50;"PENDENTE")','=SOMA(I2:I50)','=MÉDIA(I2:I50)'],answer:0,why:'A pergunta pede quantidade.'},
        {kind:'choice',prompt:'Qual o valor total das despesas de Transporte?',options:['=SOMASE(B2:B40;"Transporte";D2:D40)','=CONT.SE(B2:B40;"Transporte")','=SOMA(B2:B40)','=MÁXIMO(D2:D40)'],answer:0,why:'SOMASE soma a coluna de valores quando a categoria atende ao critério.'},
        {kind:'choice',prompt:'Qual fórmula marca valores vencidos?',options:['=SE(E2="VENCIDO";"ATRASADO";"NO PRAZO")','=CONT.SE(E2;"VENCIDO")','=SOMASE(E2;"VENCIDO")','=E2&"VENCIDO"'],answer:0,why:'SE classifica cada registro.'}
      ],{mode:'choices'}),
      challenge('Missão final: painel de alertas','Combine classificação, resumo e destaque.',[
        {q:'Primeiro passo para contar estoques críticos:',options:['Criar uma classificação consistente com SE','Aplicar cores aleatórias','Apagar os limites','Somar todas as colunas'],answer:0,why:'Uma classificação padronizada permite contar e filtrar.'},
        {q:'Função adequada para valor total por categoria:',options:['CONT.SE','SOMASE','MÍNIMO','CONCATENAR'],answer:1,why:'SOMASE soma valores condicionados a uma categoria.'},
        {q:'Melhor alerta visual:',options:['Cor + rótulo textual','Somente uma cor sem legenda','Fonte tamanho 8','Ocultar a coluna'],answer:0,why:'Cor e texto juntos melhoram leitura e acessibilidade.'}
      ],'Analista de Regras')
    ]
  },
  {
    id:'2ADM-03', classId:'2ADM', order:3, duration:45,
    title:'Filtros, validação, gráficos e dashboard', subtitle:'Organize dados, evite erros e transforme registros em informação gerencial.',icon:'▥',badge:'Construtor de Dashboards',estimated:'15–25 min',
    objectives:['Filtrar e classificar registros','Usar validação de dados','Escolher gráficos adequados','Interpretar indicadores'],
    stages:[
      explain('Dados organizados geram decisões melhores','Filtros, validação e gráficos ajudam a transformar uma tabela extensa em informação útil.',
        'Filtros exibem apenas registros relevantes; classificação reorganiza a ordem; validação padroniza entradas; gráficos representam comparações e tendências; dashboards reúnem indicadores essenciais. O objetivo não é criar um painel bonito, mas responder perguntas de gestão.',
        'Um dashboard de estoque pode mostrar total de produtos, itens críticos, valor do estoque e movimentação mensal.',
        'Cada gráfico deve responder a uma pergunta específica.'),
      demo('Do dado ao dashboard','Acompanhe o fluxo de análise.',[
        'Padronizar dados com validação.','Aplicar filtros para investigar grupos.','Classificar para identificar extremos.','Criar indicadores de resumo.','Escolher gráficos coerentes.','Organizar o dashboard com hierarquia.'
      ]),
      quiz('Filtros e classificação',[
        {q:'Filtro serve para:',options:['Excluir permanentemente linhas','Exibir temporariamente apenas registros que atendem a critérios','Alterar fórmulas','Criar senhas'],answer:1,why:'Filtro oculta temporariamente o que não atende ao critério.'},
        {q:'Para ver maiores vendas primeiro, use:',options:['Classificação decrescente','Classificação alfabética crescente','Formatação itálica','Compartilhamento'],answer:0,why:'Ordem decrescente posiciona maiores valores no topo.'},
        {q:'Validação de dados ajuda a:',options:['Padronizar opções e reduzir erros de digitação','Aumentar o tamanho do arquivo','Apagar fórmulas','Trocar o proprietário'],answer:0,why:'Listas suspensas e regras limitam entradas inconsistentes.'}
      ]),
      sheet('Laboratório de organização','Escolha a ação adequada.',[
        {kind:'choice',prompt:'Mostrar somente setor “Vendas”.',options:['Aplicar filtro na coluna Setor','Excluir outros setores','Mudar a fonte','Criar nova conta'],answer:0,why:'Filtro preserva os dados e altera apenas a visualização.'},
        {kind:'choice',prompt:'Ordenar valores do maior para o menor.',options:['Classificação decrescente','Filtro por texto','Negrito','Concatenação'],answer:0,why:'Ordem decrescente posiciona os maiores valores primeiro.'},
        {kind:'choice',prompt:'Padronizar situação como PAGO, PENDENTE ou ATRASADO.',options:['Validação com lista suspensa','Texto livre sem regra','Cores aleatórias','Uma aba por registro'],answer:0,why:'A lista evita variações como “Pago”, “pago ” e “PG”.'},
        {kind:'choice',prompt:'Evitar quantidades negativas.',options:['Validação: número maior ou igual a zero','Formatação em negrito','Filtro por cor','Compartilhar como leitor'],answer:0,why:'A regra impede valores inválidos.'}
      ],{mode:'choices'}),
      quiz('Escolha o gráfico',[
        {q:'Comparar vendas entre setores:',options:['Gráfico de colunas','Gráfico de dispersão sem contexto','Mapa','Imagem decorativa'],answer:0,why:'Colunas facilitam comparação entre categorias.'},
        {q:'Acompanhar receita ao longo dos meses:',options:['Gráfico de linhas','Gráfico de pizza com 20 meses','Texto em itálico','Tabela sem datas'],answer:0,why:'Linhas mostram tendência ao longo do tempo.'},
        {q:'Mostrar composição de poucas categorias:',options:['Gráfico de setores pode ser usado com moderação','Gráfico de linhas sem tempo','Nenhum rótulo','Uma cor para cada célula'],answer:0,why:'Setores podem representar proporções quando há poucas categorias.'},
        {q:'Qual gráfico é inadequado para dezenas de categorias?',options:['Pizza/setores','Barras horizontais','Tabela filtrável','Colunas com agrupamento'],answer:0,why:'Muitas fatias dificultam comparação.'}
      ]),
      quiz('Indicadores e interpretação',[
        {q:'Um indicador deve:',options:['Responder uma pergunta importante','Usar a maior fonte possível sem contexto','Repetir todos os dados da tabela','Ser apenas decorativo'],answer:0,why:'Indicadores resumem informações relevantes.'},
        {q:'Qual conjunto é adequado para estoque?',options:['Total de itens, itens críticos, valor total e movimentações','Nome de todos os alunos','Somente o título','Todas as células copiadas'],answer:0,why:'Esses indicadores apoiam acompanhamento e decisão.'},
        {q:'Ao encontrar aumento de itens críticos, a melhor ação é:',options:['Investigar causas e planejar reposição','Mudar a cor do dashboard e ignorar','Excluir os registros','Ocultar o indicador'],answer:0,why:'O dashboard deve orientar uma ação administrativa.'}
      ]),
      sheet('Monte o dashboard','Organize decisões de um painel administrativo.',[
        {kind:'choice',prompt:'Indicador “Itens para reposição”.',options:['CONT.SE da situação REPOR','MÉDIA dos nomes','Concatenação dos produtos','Soma das datas'],answer:0,why:'CONT.SE resume a quantidade de itens críticos.'},
        {kind:'choice',prompt:'Indicador “Valor total do estoque”.',options:['SOMA da coluna de valor total','CONT.SE dos produtos','MÍNIMO das datas','SE do título'],answer:0,why:'SOMA totaliza o valor calculado de todos os itens.'},
        {kind:'choice',prompt:'Gráfico “Movimentação por mês”.',options:['Linha','Pizza com 30 fatias','Sem eixo','Imagem'],answer:0,why:'Linha evidencia evolução temporal.'},
        {kind:'choice',prompt:'Ordem visual do painel.',options:['Título, indicadores, gráficos e observações','Gráficos sobrepostos sem título','Tudo com mesmo tamanho','Dados escondidos'],answer:0,why:'Hierarquia orienta a leitura.'}
      ],{mode:'choices'}),
      challenge('Desafio final do 2º ADM','Interprete uma situação gerencial e escolha as ações corretas.',[
        {q:'Há 12 itens críticos e aumento de saídas. Qual decisão inicial?',options:['Filtrar os itens críticos e verificar consumo/fornecedores','Excluir os registros','Trocar a fonte','Compartilhar publicamente'],answer:0,why:'A análise deve identificar quais itens e por que o estoque caiu.'},
        {q:'Dados de situação aparecem como “Pago”, “PAGO” e “pg”. Como evitar?',options:['Validação com lista suspensa','Mais cores','Uma nova fórmula de soma','Ocultar a coluna'],answer:0,why:'Validação padroniza as opções.'},
        {q:'Qual é a função principal do dashboard?',options:['Apoiar acompanhamento e tomada de decisão','Substituir todos os dados originais','Servir apenas como decoração','Impedir o uso de filtros'],answer:0,why:'O painel resume e comunica informações gerenciais.'}
      ],'Construtor de Dashboards')
    ]
  }

]

// Fase 2: laboratórios práticos inseridos sem alterar a ordem das etapas anteriores.
const EXPERIENCE_UPGRADES = {
  '1ADM-02': officeLab('Estação prática: relatório administrativo de Paranaguá',
    'Aplique formatação com finalidade em um relatório simulado de materiais do Colégio Estadual Alberto Gomes Veiga.',[
      {id:'bold-title',prompt:'Destaque o título principal com negrito.',action:'bold',why:'O título precisa ser identificado antes dos dados.'},
      {id:'font-14',prompt:'Aumente o título para 14 pontos.',action:'font-14',why:'Um tamanho maior estabelece hierarquia sem exagero.'},
      {id:'center-header',prompt:'Centralize os cabeçalhos da tabela.',action:'center',why:'Cabeçalhos curtos podem ser centralizados para facilitar a leitura.'},
      {id:'filter-pending',prompt:'Filtre apenas os registros com situação Pendente.',action:'filter-pending',why:'O filtro permite analisar somente os itens que exigem atenção.'},
      {id:'share-commenter',prompt:'Compartilhe o relatório como Comentador.',action:'share-commenter',why:'O comentador pode registrar observações sem alterar valores.'}
    ],{scenario:'Materiais administrativos do AGV',columns:['Item','Setor','Quantidade','Situação'],rows:[['Papel A4','Secretaria','12','OK'],['Toner','Laboratório','2','Pendente'],['Pastas','RH','18','OK'],['Cabos HDMI','TI','3','Pendente']]}),
  '1ADM-07': officeLab('Central de análise: filtros e alertas',
    'Organize uma base simulada de movimentações administrativas e prepare a visualização para a equipe.',[
      {id:'filter-critical',prompt:'Filtre somente as linhas com prioridade Crítica.',action:'filter-critical',why:'O filtro destaca registros que exigem ação imediata.'},
      {id:'fill-alert',prompt:'Aplique destaque de alerta ao status crítico.',action:'fill-alert',why:'A formatação condicional torna o risco visível sem apagar os dados.'},
      {id:'freeze-header',prompt:'Mantenha o cabeçalho visível durante a rolagem.',action:'freeze-header',why:'Congelar o cabeçalho preserva o significado das colunas.'},
      {id:'share-reader',prompt:'Compartilhe a visão final como Leitor.',action:'share-reader',why:'A equipe pode consultar sem alterar a base consolidada.'}
    ],{scenario:'Acompanhamento simulado de solicitações',columns:['Solicitação','Área','Prazo','Prioridade'],rows:[['Compra de toner','TI','Hoje','Crítica'],['Arquivo de contratos','RH','3 dias','Normal'],['Conferência de notas','Financeiro','Hoje','Crítica'],['Atualização cadastral','Secretaria','5 dias','Normal']]}),
  '2ADM-03': officeLab('Painel operacional: dados portuários simulados',
    'Prepare uma visão gerencial fictícia inspirada em rotinas administrativas e logísticas de Paranaguá.',[
      {id:'filter-delayed',prompt:'Filtre os registros com situação Atrasado.',action:'filter-delayed',why:'A filtragem reduz a base ao problema que será analisado.'},
      {id:'sort-desc',prompt:'Ordene a quantidade do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a priorizar os maiores volumes.'},
      {id:'chart-column',prompt:'Crie uma visualização em colunas por terminal.',action:'chart-column',why:'Colunas facilitam comparar categorias.'},
      {id:'share-commenter',prompt:'Compartilhe com o supervisor como Comentador.',action:'share-commenter',why:'O supervisor pode registrar decisões sem alterar a base.'}
    ],{scenario:'Movimentações logísticas simuladas',columns:['Terminal','Carga','Quantidade','Situação'],rows:[['Paranaguá A','Contêiner','42','No prazo'],['TCP simulado','Contêiner','31','Atrasado'],['Itapoá simulado','Carga geral','18','Atrasado'],['Santos simulado','Contêiner','55','No prazo']]})
};
for(const [lessonId,stage] of Object.entries(EXPERIENCE_UPGRADES)){
  const lesson=LESSONS.find(item=>item.id===lessonId);
  if(lesson&&!lesson.stages.some(item=>item.type==='office-lab'))lesson.stages.splice(Math.max(lesson.stages.length-1,0),0,stage);
}

LESSONS.push(
  {
    id:'1ADM-08',classId:'1ADM',order:8,duration:45,
    title:'Comunicação profissional por e-mail',
    subtitle:'Planeje, revise, anexe e envie uma mensagem administrativa com clareza e segurança.',
    icon:'✉',badge:'Comunicador Profissional',estimated:'15–25 min',
    objectives:['Identificar os campos de um e-mail','Escrever assunto e mensagem profissionais','Anexar e conferir um arquivo','Usar CC e CCO com responsabilidade'],
    stages:[
      explain('Por que o e-mail profissional exige planejamento?',
        'Uma mensagem administrativa precisa informar o assunto, a ação esperada, o prazo e os anexos de forma objetiva.',
        'No ambiente escolar, administrativo, financeiro, de RH ou logístico, um e-mail mal identificado pode atrasar decisões, enviar documentos para a pessoa errada ou expor dados. Antes de enviar, é necessário conferir destinatários, assunto, texto, anexos e nível de acesso.',
        'A secretaria do AGV solicita um relatório de materiais. O assunto identifica o documento e o corpo informa que o PDF está anexado.',
        'Escreva como se o destinatário precisasse entender a solicitação sem perguntar novamente.'),
      demo('Anatomia de uma mensagem profissional','Observe a sequência de preparação antes do envio.',[
        'Confirmar quem realmente deve receber a mensagem.','Escrever um assunto específico e curto.','Usar saudação, contexto, solicitação e encerramento.','Anexar o arquivo correto e conferir o nome.','Revisar destinatários, ortografia, prazo e anexo.','Enviar e registrar a evidência da comunicação.'
      ]),
      emailLab('Correio AGV: envio de relatório administrativo',
        'Utilize o correio eletrônico simulado. Nenhuma mensagem real será enviada.',{
          scenario:'A Secretaria solicitou o relatório simulado de materiais administrativos de agosto.',
          recipient:'secretaria.agv@simulacao.edu.br',
          subjectKeywords:['relatório','materiais','agosto'],
          bodyKeywords:['olá','anexo','relatório','obrigado'],
          attachment:'relatorio-materiais-agv-agosto.pdf',
          suggestedBody:'Olá,\n\nEncaminho em anexo o relatório de materiais administrativos referente ao mês de agosto.\n\nObrigado.',
          hint:'Inclua uma saudação, explique o anexo e finalize com cordialidade.'
        }),
      quiz('Decisões de comunicação digital',[
        {q:'O relatório deve ser analisado pela diretora e acompanhado pela secretaria. Qual organização é adequada?',options:['Diretora em Para e secretaria em CC','Todos em CCO sem explicação','Somente o próprio aluno em Para','Publicar o arquivo para qualquer pessoa'],answer:0,why:'O destinatário principal fica em Para e quem acompanha pode ficar em CC.'},
        {q:'Quando o CCO é especialmente útil?',options:['Quando os destinatários não devem visualizar os endereços uns dos outros','Para deixar o assunto em branco','Para editar o anexo depois do envio','Para substituir a senha da conta'],answer:0,why:'O CCO protege os endereços em envios coletivos.'},
        {q:'Antes de clicar em Enviar, qual verificação é indispensável?',options:['Conferir destinatário, assunto, texto e anexo','Trocar todas as palavras por abreviações','Remover o prazo da mensagem','Usar letras maiúsculas em todo o texto'],answer:0,why:'A conferência final reduz erros de envio e de interpretação.'},
        {q:'Qual assunto é mais profissional?',options:['Relatório de materiais — AGV — Agosto','Oi','Documento','URGENTE!!!'],answer:0,why:'O assunto específico informa conteúdo, contexto e período.'}
      ]),
      emailLab('Correio AGV: solicitação de prazo',
        'Prepare uma segunda mensagem, agora solicitando confirmação de prazo para uma atividade administrativa.',{
          scenario:'O setor de RH simulado precisa confirmar até quando a lista de participantes deve ser enviada.',
          recipient:'rh.agv@simulacao.edu.br',
          subjectKeywords:['confirmação','prazo','participantes'],
          bodyKeywords:['olá','prazo','lista','obrigado'],
          attachment:'',
          suggestedBody:'Olá,\n\nPoderia confirmar o prazo para envio da lista de participantes?\n\nObrigado.',
          hint:'A mensagem deve indicar exatamente qual prazo precisa ser confirmado.'
        }),
      challenge('Missão final: comunicação sem retrabalho','Resolva situações comuns de uma rotina administrativa.',[
        {q:'Você percebeu que anexou a versão errada antes de enviar. O que fazer?',options:['Remover o anexo incorreto, anexar a versão certa e conferir novamente','Enviar assim mesmo e explicar depois','Apagar o assunto','Compartilhar a senha da conta'],answer:0,why:'A correção deve acontecer antes do envio.'},
        {q:'Uma mensagem contém dados pessoais de estudantes. Qual cuidado é necessário?',options:['Enviar somente às pessoas autorizadas e conferir as permissões do arquivo','Usar link público','Encaminhar para todos os contatos','Copiar os dados no assunto'],answer:0,why:'Dados pessoais exigem destinatários e permissões limitados.'},
        {q:'O destinatário não respondeu e o prazo está próximo. Qual atitude é adequada?',options:['Enviar um lembrete educado com o contexto e o prazo','Mandar várias mensagens sem contexto','Publicar a cobrança em grupo aberto','Alterar o arquivo sem avisar'],answer:0,why:'Um lembrete objetivo mantém a comunicação profissional.'}
      ],'Comunicador Profissional')
    ]
  },
  {
    id:'1ADM-09',classId:'1ADM',order:9,duration:45,
    title:'Segurança de contas e autenticação em dois fatores',
    subtitle:'Proteja acessos, reconheça solicitações suspeitas e utilize uma segunda etapa de verificação.',
    icon:'🛡',badge:'Guardião de Contas',estimated:'15–25 min',
    objectives:['Entender senha forte e exclusiva','Ativar autenticação em dois fatores','Proteger códigos de recuperação','Reconhecer tentativas de acesso suspeitas'],
    stages:[
      explain('Por que uma senha pode não ser suficiente?',
        'A autenticação em dois fatores acrescenta uma segunda confirmação além da senha.',
        'Se uma senha for descoberta, a segunda etapa pode impedir o acesso. Essa confirmação pode ocorrer por aplicativo autenticador, chave de segurança ou outro método aprovado pela organização. Códigos temporários e códigos de recuperação nunca devem ser compartilhados.',
        'Ao entrar em uma conta administrativa simulada, o sistema solicita a senha e depois um código temporário gerado no celular.',
        'Use senhas diferentes para serviços diferentes e nunca informe códigos temporários por mensagem.'),
      demo('Ativando a proteção em duas etapas','Acompanhe o procedimento seguro em um ambiente de simulação.',[
        'Abrir as configurações de segurança da conta.','Escolher a opção de verificação em duas etapas.','Selecionar um método de segundo fator.','Confirmar o código temporário no próprio dispositivo.','Guardar códigos de recuperação em local protegido.','Revisar dispositivos conectados e encerrar acessos desconhecidos.'
      ]),
      twoFactorLab('Central de segurança: ativação do segundo fator',
        'Ative a proteção de uma conta administrativa simulada. Não utilize senhas ou códigos reais.',{
          account:'estudante.agv@simulacao.edu.br',
          preferredMethod:'authenticator',
          backupChoice:'offline',
          suspiciousChoice:'deny',
          context:'A conta simulada será usada para acessar documentos administrativos e o Classroom.'
        }),
      quiz('Proteção de acesso',[
        {q:'Uma pessoa solicita seu código de seis dígitos por mensagem. O que fazer?',options:['Não informar o código e verificar a tentativa diretamente na conta','Enviar porque o código expira','Publicar o código no grupo','Desativar o bloqueio da tela'],answer:0,why:'Códigos temporários são pessoais e não devem ser compartilhados.'},
        {q:'Onde guardar códigos de recuperação?',options:['Em local protegido e separado da conta principal','No assunto de um e-mail público','Em uma postagem aberta','Na mesma mensagem enviada a colegas'],answer:0,why:'Os códigos de recuperação permitem acesso e precisam de proteção.'},
        {q:'Apareceu uma solicitação de login que você não iniciou. Qual ação é correta?',options:['Negar a solicitação, trocar a senha e revisar os dispositivos conectados','Aprovar para a notificação desaparecer','Ignorar e compartilhar o código','Desativar a autenticação em dois fatores'],answer:0,why:'Uma solicitação não reconhecida pode indicar tentativa de invasão.'},
        {q:'Qual senha é mais adequada para uma conta administrativa?',options:['Uma frase longa, exclusiva e difícil de adivinhar','O nome da escola','12345678','A mesma senha de todas as contas'],answer:0,why:'Comprimento e exclusividade aumentam a proteção.'}
      ]),
      twoFactorLab('Central de segurança: análise de tentativa suspeita',
        'Resolva uma segunda situação de acesso e recuperação.',{
          account:'financeiro.agv@simulacao.edu.br',
          preferredMethod:'security-key',
          backupChoice:'offline',
          suspiciousChoice:'deny',
          context:'Uma notificação informa tentativa de acesso em um dispositivo desconhecido.'
        }),
      challenge('Missão final: conta protegida','Escolha as ações mais seguras.',[
        {q:'Você trocou de celular e perdeu o aplicativo autenticador. Qual caminho é adequado?',options:['Usar um código de recuperação protegido ou solicitar recuperação oficial','Pedir o código de outra pessoa','Criar uma conta falsa','Informar a senha em um grupo'],answer:0,why:'A recuperação deve utilizar mecanismos oficiais e previamente protegidos.'},
        {q:'Um link recebido informa que a conta será bloqueada em cinco minutos. Qual primeira atitude?',options:['Não clicar; abrir o serviço pelo endereço conhecido e verificar a conta','Responder com a senha','Baixar o arquivo recebido','Encaminhar para todos'],answer:0,why:'Urgência incomum é um sinal de alerta; verifique pelo canal oficial.'},
        {q:'Depois de usar um notebook compartilhado, o que deve ser feito?',options:['Sair da conta, remover dados temporários e verificar se a sessão foi encerrada','Apenas fechar a tampa','Salvar a senha no navegador','Deixar a conta aberta para o próximo aluno'],answer:0,why:'O encerramento evita acesso pelo próximo usuário.'}
      ],'Guardião de Contas')
    ]
  },
  {
    id:'2ADM-04',classId:'2ADM',order:4,duration:45,
    title:'Comunicação administrativa segura e gestão de acessos',
    subtitle:'Coordene mensagens, anexos, permissões e confirmação de identidade em uma rotina empresarial simulada.',
    icon:'⌁',badge:'Gestor de Comunicação Segura',estimated:'15–25 min',
    objectives:['Planejar mensagens para diferentes responsáveis','Usar CC e CCO de forma adequada','Compartilhar documentos com menor privilégio','Aplicar autenticação em dois fatores e resposta a incidentes'],
    stages:[
      explain('Comunicação também é controle administrativo',
        'Uma mensagem profissional faz parte do processo: define responsáveis, prazo, documento e evidência.',
        'Em rotinas de RH, financeiro ou logística, o e-mail precisa combinar clareza com controle de acesso. O arquivo deve chegar às pessoas corretas, com a permissão necessária, e a conta utilizada deve estar protegida.',
        'Uma operação logística simulada precisa comunicar divergências ao responsável e manter a supervisão em cópia, sem publicar dados para toda a organização.',
        'Antes de enviar, identifique quem executa, quem acompanha e quem apenas precisa receber o resultado.'),
      officeLab('Estação administrativa: preparar dados para comunicação',
        'Filtre e organize a base antes de escrever a mensagem ao responsável.',[
          {id:'filter-pending',prompt:'Filtre os registros com situação Pendente.',action:'filter-pending',why:'A mensagem deve tratar somente das pendências.'},
          {id:'sort-desc',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a definir prioridade.'},
          {id:'share-commenter',prompt:'Compartilhe a base com a supervisão como Comentador.',action:'share-commenter',why:'A supervisão pode registrar decisões sem alterar os dados.'}
        ],{scenario:'Pendências administrativas simuladas',columns:['Processo','Responsável','Valor','Situação'],rows:[['Compra 041','Suprimentos','4800','Pendente'],['Contrato 018','RH','2200','OK'],['Nota 212','Financeiro','6100','Pendente'],['Cadastro 094','Secretaria','900','OK']]}),
      emailLab('Correio administrativo: comunicar pendências',
        'Envie uma mensagem simulada ao responsável pelo acompanhamento.',{
          scenario:'Comunique as pendências filtradas ao setor financeiro e mantenha a supervisão em cópia.',
          recipient:'financeiro.agv@simulacao.edu.br',
          cc:'supervisao.agv@simulacao.edu.br',
          subjectKeywords:['pendências','administrativas','acompanhamento'],
          bodyKeywords:['olá','pendências','prazo','anexo','obrigado'],
          attachment:'pendencias-administrativas-agv.pdf',
          suggestedBody:'Olá,\n\nEncaminho as pendências administrativas para acompanhamento. Poderia confirmar o prazo de regularização?\n\nObrigado.',
          hint:'Informe o que está sendo enviado, a ação esperada e o prazo.'
        }),
      twoFactorLab('Central de acesso: proteger a conta do setor',
        'Configure o segundo fator e responda a uma tentativa de acesso não reconhecida.',{
          account:'gestao.agv@simulacao.edu.br',preferredMethod:'security-key',backupChoice:'offline',suspiciousChoice:'deny',context:'A conta acessa relatórios de RH, financeiro e logística simulados.'
        }),
      quiz('Governança de comunicação e acesso',[
        {q:'Um fornecedor precisa apenas visualizar uma proposta. Qual combinação é adequada?',options:['E-mail ao contato correto e arquivo como Leitor','Link público como Editor','Senha da conta enviada junto','Arquivo sem assunto e sem prazo'],answer:0,why:'Acesso nominal e permissão mínima reduzem risco.'},
        {q:'Uma lista será enviada a muitos destinatários externos que não se conhecem. Qual campo protege os endereços?',options:['CCO','CC','Assunto','Responder a todos'],answer:0,why:'O CCO oculta os endereços entre os destinatários.'},
        {q:'Um gestor saiu da equipe. Qual ação deve acompanhar a comunicação interna?',options:['Remover os acessos e revisar arquivos compartilhados','Manter todas as permissões','Publicar os documentos','Enviar a senha para o substituto'],answer:0,why:'Mudanças de função exigem revisão de acesso.'},
        {q:'Uma solicitação de segundo fator aparece sem que você esteja entrando. O que fazer?',options:['Negar e iniciar verificação de segurança','Aprovar rapidamente','Compartilhar o código','Desligar as notificações'],answer:0,why:'Solicitações não iniciadas devem ser tratadas como suspeitas.'}
      ]),
      challenge('Missão final: fluxo administrativo seguro','Integre preparação dos dados, comunicação e controle de acesso.',[
        {q:'Qual ordem reduz mais erros?',options:['Filtrar dados, revisar responsáveis, preparar anexo, escrever, conferir e enviar','Enviar primeiro e revisar depois','Compartilhar publicamente e pedir cuidado','Anexar todos os arquivos disponíveis'],answer:0,why:'A preparação antes do envio reduz retrabalho e exposição.'},
        {q:'Uma resposta inclui dados que não devem chegar a todos em CC. O que fazer?',options:['Criar uma nova mensagem somente para os responsáveis autorizados','Responder a todos','Publicar um link aberto','Copiar os dados no assunto'],answer:0,why:'O grupo de destinatários deve corresponder à necessidade de acesso.'},
        {q:'Qual evidência é útil no processo administrativo?',options:['Mensagem enviada, arquivo correto, data, responsáveis e confirmação de recebimento','Somente uma captura sem contexto','A senha utilizada','O código temporário de autenticação'],answer:0,why:'A evidência deve registrar o processo sem expor credenciais.'}
      ],'Gestor de Comunicação Segura')
    ]
  }
);


const PRACTICAL_QUESTION_REVISIONS = {
  'O relatório deve ser analisado pela diretora e acompanhado pela secretaria. Qual organização é adequada?':['Diretora em Para e secretaria em CC','Secretaria em Para e diretora sem cópia','Ambas somente em CCO e sem destinatário principal','Arquivo público enviado sem destinatários definidos'],
  'Quando o CCO é especialmente útil?':['Quando destinatários não devem ver os endereços dos demais','Quando o assunto da mensagem precisa permanecer em branco','Quando o anexo ainda será alterado depois do envio','Quando a senha da conta precisa ser substituída pelo e-mail'],
  'Antes de clicar em Enviar, qual verificação é indispensável?':['Conferir destinatário, assunto, texto e anexo','Trocar o texto por abreviações e retirar a saudação','Remover o prazo e deixar a solicitação sem contexto','Escrever toda a mensagem em letras maiúsculas'],
  'Qual assunto é mais profissional?':['Relatório de materiais — AGV — Agosto','Informações importantes sobre um documento','Mensagem enviada para o setor responsável','Solicitação administrativa sem identificação'],
  'Você percebeu que anexou a versão errada antes de enviar. O que fazer?':['Remover o anexo incorreto, anexar o certo e conferir','Enviar a versão errada e explicar o problema depois','Apagar o assunto e manter o anexo incorreto','Compartilhar a senha para alguém corrigir o arquivo'],
  'Uma mensagem contém dados pessoais de estudantes. Qual cuidado é necessário?':['Enviar apenas a autorizados e revisar as permissões','Usar um link público para facilitar o acesso geral','Encaminhar o conteúdo para todos os contatos salvos','Copiar os dados pessoais diretamente no assunto'],
  'O destinatário não respondeu e o prazo está próximo. Qual atitude é adequada?':['Enviar lembrete educado com contexto e prazo','Mandar várias cobranças seguidas sem explicar o motivo','Publicar a cobrança em um grupo aberto da instituição','Alterar o documento e não comunicar a nova versão'],
  'Uma pessoa solicita seu código de seis dígitos por mensagem. O que fazer?':['Não informar e verificar a tentativa diretamente na conta','Enviar o código porque ele será temporário e logo expirará','Publicar o código no grupo para confirmar quem solicitou','Desativar o bloqueio de tela para facilitar a verificação'],
  'Onde guardar códigos de recuperação?':['Em local protegido e separado da conta principal','No assunto de um e-mail acessível a toda a equipe','Em uma postagem aberta para consulta quando necessário','Na mesma mensagem que contém a senha da conta'],
  'Apareceu uma solicitação de login que você não iniciou. Qual ação é correta?':['Negar, trocar a senha e revisar os dispositivos conectados','Aprovar a solicitação somente para remover a notificação','Ignorar o alerta e compartilhar o código recebido','Desativar o segundo fator para impedir novos avisos'],
  'Qual senha é mais adequada para uma conta administrativa?':['Uma frase longa, exclusiva e difícil de adivinhar','O nome completo da escola acompanhado do ano atual','Uma sequência numérica curta usada somente naquele dia','A mesma senha utilizada nas demais contas pessoais'],
  'Você trocou de celular e perdeu o aplicativo autenticador. Qual caminho é adequado?':['Usar recuperação protegida ou solicitar suporte oficial','Pedir a outra pessoa um código temporário da conta dela','Criar uma nova conta falsa e abandonar os documentos','Informar a senha em um grupo para solicitar ajuda'],
  'Um link recebido informa que a conta será bloqueada em cinco minutos. Qual primeira atitude?':['Abrir o serviço pelo endereço conhecido e verificar a conta','Responder ao remetente informando a senha de acesso','Baixar o arquivo anexado antes de conferir o remetente','Encaminhar o alerta para todos os contatos imediatamente'],
  'Depois de usar um notebook compartilhado, o que deve ser feito?':['Sair da conta e conferir se a sessão foi encerrada','Fechar a tampa e deixar todas as contas conectadas','Salvar a senha no navegador para o próximo acesso','Manter a conta aberta para facilitar o próximo estudante'],
  'Um fornecedor precisa apenas visualizar uma proposta. Qual combinação é adequada?':['Mensagem ao contato correto e arquivo como Leitor','Link público de edição enviado para toda a organização','Senha da conta anexada junto ao documento da proposta','Arquivo sem assunto, prazo ou responsável identificado'],
  'Uma lista será enviada a muitos destinatários externos que não se conhecem. Qual campo protege os endereços?':['CCO — cópia oculta dos destinatários','CC — cópia visível para acompanhamento','Assunto — identificação resumida da mensagem','Responder a todos — retorno coletivo da conversa'],
  'Um gestor saiu da equipe. Qual ação deve acompanhar a comunicação interna?':['Remover acessos e revisar arquivos compartilhados','Manter permissões antigas até alguém solicitar alteração','Publicar documentos para evitar problemas de acesso','Enviar a senha antiga diretamente ao novo responsável'],
  'Uma solicitação de segundo fator aparece sem que você esteja entrando. O que fazer?':['Negar e iniciar uma verificação de segurança','Aprovar rapidamente para encerrar a notificação','Compartilhar o código com quem afirma ser do suporte','Desligar notificações e manter a sessão desconhecida'],
  'Qual ordem reduz mais erros?':['Filtrar, revisar, anexar, escrever, conferir e enviar','Enviar, revisar o texto e só depois escolher o anexo','Publicar o arquivo, avisar o grupo e corrigir depois','Anexar tudo, remover o assunto e enviar imediatamente'],
  'Uma resposta inclui dados que não devem chegar a todos em CC. O que fazer?':['Criar nova mensagem apenas para pessoas autorizadas','Responder a todos e solicitar que ignorem os dados','Publicar um link aberto para evitar novos encaminhamentos','Copiar os dados no assunto e remover o corpo do e-mail'],
  'Qual evidência é útil no processo administrativo?':['Mensagem, arquivo, data, responsáveis e confirmação','Uma captura isolada sem data, contexto ou destinatário','A senha utilizada para acessar a conta administrativa','O código temporário usado no segundo fator de acesso']
};
for(const lesson of LESSONS.filter(item=>['1ADM-08','1ADM-09','2ADM-04'].includes(item.id))){
  for(const stage of lesson.stages){for(const question of stage.questions||stage.tasks||[]){if(PRACTICAL_QUESTION_REVISIONS[question.q])question.options=PRACTICAL_QUESTION_REVISIONS[question.q]}}
}

// Fase 3: reorganização curricular para o fechamento do trimestre de Informática Empresarial.
// As Aulas 1 e 2 do 1º ADM permanecem com a identidade e o conteúdo já aplicados.
const CURRICULUM_V228 = [
  {
    id:'1ADM-03',classId:'1ADM',order:3,duration:45,kind:'content',curriculumRevision:'2026T2-admin2-v242',keepLegacyReinforcement:false,
    title:'Cálculos administrativos básicos',subtitle:'Use operações e referências para controlar valores, quantidades, despesas e saldos.',
    icon:'🧮',badge:'Assistente de Cálculos',estimated:'15–25 min',application:'Financeiro, compras, estoque e controle de materiais',evidence:'Planilha simulada com cálculos conferidos',
    objectives:['Iniciar fórmulas com =','Usar referências de células','Aplicar adição, subtração, multiplicação e divisão','Conferir resultados administrativos'],
    stages:[
      explain('Por que calcular dentro da planilha?','A planilha reduz contas repetidas e atualiza os resultados quando os dados mudam.','Em compras, financeiro e estoque, uma fórmula permite calcular total por item, saldo disponível, diferença entre previsto e realizado e divisão de valores. O cálculo deve usar referências de células para que a planilha continue funcionando quando novas informações forem inseridas.','Quantidade 12 em B2 e valor unitário R$ 8,50 em C2 podem gerar o total com =B2*C2.','Antes de confirmar, explique mentalmente o que cada célula representa e qual operação responde à situação.'),
      demo('Da solicitação ao cálculo','Acompanhe a sequência usada em um controle administrativo.',[
        'Identificar quais dados já existem na tabela.','Escolher a célula onde o resultado será mostrado.','Iniciar a fórmula com o sinal de igualdade.','Usar as referências das células, sem digitar novamente os valores.','Conferir se o resultado faz sentido para a situação.']),
      formula('Operações do setor administrativo','Monte fórmulas com referências de células.',[
        {prompt:'Somar despesas previstas em B2 e C2',tokens:['=','B2','+','C2'],answer:'=B2+C2',why:'A adição reúne os dois valores previstos.'},
        {prompt:'Calcular orçamento D2 menos gasto E2',tokens:['=','D2','-','E2'],answer:'=D2-E2',why:'A subtração mostra o saldo disponível.'},
        {prompt:'Calcular quantidade B3 vezes valor unitário C3',tokens:['=','B3','*','C3'],answer:'=B3*C3',why:'Quantidade multiplicada pelo valor unitário gera o total.'},
        {prompt:'Dividir o valor D4 em 4 parcelas',tokens:['=','D4','/','4'],answer:'=D4/4',why:'A divisão distribui o valor igualmente entre quatro parcelas.'}
      ]),
      officeLab('Estação financeira: controle de despesas','Prepare uma tabela simulada para análise do setor administrativo.',[
        {id:'bold-title',prompt:'Destaque o título do controle financeiro com negrito.',action:'bold',why:'O título precisa ser identificado antes dos lançamentos.'},
        {id:'center-header',prompt:'Centralize os cabeçalhos curtos da tabela.',action:'center',why:'O alinhamento consistente facilita a leitura dos campos.'},
        {id:'filter-pending',prompt:'Filtre somente os lançamentos Pendentes.',action:'filter-pending',why:'O filtro mostra o que ainda exige providência.'},
        {id:'share-reader',prompt:'Compartilhe o resumo final como Leitor.',action:'share-reader',why:'Quem apenas consulta não precisa alterar os dados.'}
      ],{scenario:'Controle financeiro simulado do setor administrativo',columns:['Despesa','Setor','Valor','Situação'],rows:[['Material de escritório','Secretaria','480','Pago'],['Manutenção','TI','350','Pendente'],['Treinamento','RH','620','Pago'],['Transporte','Compras','290','Pendente']]}),
      quiz('Conferência dos cálculos',[
        {q:'A quantidade está em B2 e o valor unitário em C2. Qual fórmula calcula o total do item?',options:['=B2*C2','=B2+C2','=B2-C2','=B2/C2'],answer:0,why:'Total por item é quantidade multiplicada pelo valor unitário.'},
        {q:'O orçamento está em D2 e o gasto em E2. Qual operação mostra o saldo?',options:['=D2-E2','=D2+E2','=D2*E2','=E2-D2'],answer:0,why:'Saldo disponível é orçamento menos gasto.'},
        {q:'Uma fórmula exibe #### em uma coluna de valores. Qual primeira verificação é adequada?',options:['Aumentar a largura da coluna','Apagar todos os dados','Trocar a senha da conta','Transformar a planilha em imagem'],answer:0,why:'Em geral, #### indica que a coluna está estreita para mostrar o valor.'},
        {q:'Por que usar B2*C2 em vez de digitar 12*8,50?',options:['A fórmula se atualiza quando B2 ou C2 mudar','A referência impede qualquer edição','O resultado deixa de ser numérico','A planilha passa a funcionar sem dados'],answer:0,why:'Referências tornam o cálculo automático e reutilizável.'}
      ]),
      challenge('Missão final: fechar o orçamento','Resolva decisões de uma rotina financeira simulada.',[
        {q:'Foram previstos R$ 2.400 e gastos R$ 1.875. Qual cálculo representa o saldo?',options:['=2400-1875','=2400+1875','=1875/2400','=2400*1875'],answer:0,why:'O saldo corresponde ao previsto menos o realizado.'},
        {q:'Dez unidades custam R$ 36,00 cada. Qual operação calcula o total?',options:['Multiplicação','Subtração','Concatenação','Comparação'],answer:0,why:'Quantidade vezes valor unitário calcula o total.'},
        {q:'Uma compra será paga em três parcelas iguais. Qual operador deve ser usado?',options:['/','*','&','>'],answer:0,why:'A barra representa divisão.'}
      ],'Assistente de Cálculos')
    ]
  },
  {
    id:'1ADM-04',classId:'1ADM',order:4,duration:45,kind:'content',curriculumRevision:'2026T2-admin',keepLegacyReinforcement:false,
    title:'RH básico, jornada e pagamento',subtitle:'Organize horários, presença, horas trabalhadas e um holerite educacional simplificado.',
    icon:'👥',badge:'Assistente de RH',estimated:'15–25 min',application:'Recursos humanos, gestão de pessoas e folha simplificada',evidence:'Quadro de jornada e conferência de pagamento simulados',
    objectives:['Interpretar horários de entrada e saída','Calcular horas e valores simples','Reconhecer campos básicos de um holerite','Organizar informações de funcionários'],
    stages:[
      explain('Como a informática apoia o RH?','O RH utiliza sistemas e planilhas para organizar pessoas, horários, faltas, documentos e pagamentos.','Uma planilha de jornada precisa identificar funcionário, data, entrada, saída e observações. Um holerite apresenta informações de pagamento, descontos e valor líquido. Nesta aula, todos os nomes e valores são fictícios e servem apenas para aprendizagem.','Um quadro pode registrar entrada às 08:00, saída às 17:00 e intervalo de uma hora.','Dados de pessoas exigem cuidado: compartilhe somente com quem realmente precisa acessar.'),
      demo('Conferindo uma jornada','Observe uma rotina segura de verificação.',[
        'Confirmar o nome e o período do registro.','Verificar entrada, saída e intervalo.','Calcular o total de horas trabalhadas.','Conferir atrasos, faltas ou horas extras.','Registrar observações sem expor dados desnecessários.']),
      formula('Cálculos de jornada e pagamento','Monte cálculos simplificados para uma situação educacional.',[
        {prompt:'Calcular horas trabalhadas: saída C2 menos entrada B2',tokens:['=','C2','-','B2'],answer:'=C2-B2',why:'A diferença entre saída e entrada produz a duração bruta.'},
        {prompt:'Calcular pagamento: horas D2 vezes valor-hora E2',tokens:['=','D2','*','E2'],answer:'=D2*E2',why:'Horas multiplicadas pelo valor-hora geram o pagamento bruto simplificado.'},
        {prompt:'Calcular líquido: bruto F2 menos desconto G2',tokens:['=','F2','-','G2'],answer:'=F2-G2',why:'O valor líquido simplificado desconta o valor informado.'}
      ]),
      sheet('Quadro de horários','Organize decisões de uma rotina de RH fictícia.',[
        {kind:'choice',prompt:'Qual conjunto de colunas é mais adequado para um controle diário?',options:['Funcionário, Data, Entrada, Saída, Intervalo e Observação','Somente Nome e Cor favorita','Senha, Código de acesso e Mensagem pessoal','Produto, Peso e Temperatura'],answer:0,why:'O controle precisa dos campos relacionados à jornada.'},
        {kind:'choice',prompt:'Um funcionário entrou às 08:00, saiu às 17:00 e teve 1 hora de intervalo. Quantas horas foram trabalhadas?',options:['8 horas','9 horas','7 horas','10 horas'],answer:0,why:'Das 08:00 às 17:00 são 9 horas; menos 1 hora de intervalo resulta em 8 horas.'},
        {kind:'choice',prompt:'Qual informação deve ser protegida com maior cuidado?',options:['Dados pessoais e valores de pagamento','Título da tabela','Nome da aba Resumo','Cor usada no cabeçalho'],answer:0,why:'Dados pessoais e financeiros exigem acesso restrito.'}
      ],{mode:'choices'}),
      quiz('Leitura de holerite simplificado',[
        {q:'Qual campo representa o valor antes dos descontos?',options:['Pagamento bruto','Pagamento líquido','Data de impressão','Nome da planilha'],answer:0,why:'O bruto é o valor calculado antes dos descontos.'},
        {q:'Qual campo mostra o valor final a receber?',options:['Pagamento líquido','Valor-hora','Carga horária prevista','Número da linha'],answer:0,why:'O líquido corresponde ao valor final após os descontos informados.'},
        {q:'Uma diferença inesperada aparece no pagamento. Qual ação administrativa é adequada?',options:['Conferir horas, valores e descontos antes de alterar o registro','Apagar toda a planilha imediatamente','Enviar dados pessoais em grupo aberto','Modificar o valor sem registrar o motivo'],answer:0,why:'A conferência deve preceder qualquer correção.'},
        {q:'Quem deve receber uma planilha de folha com dados pessoais?',options:['Somente pessoas autorizadas pela rotina do setor','Qualquer pessoa com o link','Todos os estudantes da turma','Contatos externos sem necessidade'],answer:0,why:'O acesso deve ser limitado ao necessário.'}
      ]),
      challenge('Missão final: fechamento do ponto','Analise uma situação fictícia de RH.',[
        {q:'A jornada registrada tem entrada, mas não possui saída. Qual status é mais adequado?',options:['Registro incompleto para conferência','Pagamento aprovado automaticamente','Documento concluído','Arquivo público'],answer:0,why:'Sem a saída, a jornada não pode ser calculada corretamente.'},
        {q:'O valor bruto é R$ 1.200 e o desconto informado é R$ 150. Qual é o líquido simplificado?',options:['R$ 1.050','R$ 1.350','R$ 1.200','R$ 150'],answer:0,why:'1.200 menos 150 resulta em 1.050.'},
        {q:'Qual prática melhora a gestão de pessoas?',options:['Manter registros claros, revisar divergências e proteger dados','Usar apelidos e campos sem título','Compartilhar senhas entre funcionários','Excluir históricos sem autorização'],answer:0,why:'Clareza, conferência e proteção são princípios administrativos.'}
      ],'Assistente de RH')
    ]
  },
  {
    id:'1ADM-05',classId:'1ADM',order:5,duration:45,kind:'content',curriculumRevision:'2026T2-mail-v242',keepLegacyReinforcement:false,
    title:'Comunicação administrativa, documentos e PDF',subtitle:'Produza um documento, prepare o PDF e envie uma mensagem profissional com anexo.',
    icon:'✉',badge:'Comunicador Administrativo',estimated:'15–25 min',application:'Secretaria, RH, atendimento, financeiro e comunicação interna',evidence:'E-mail simulado com PDF administrativo anexado',
    objectives:['Estruturar um documento administrativo','Diferenciar arquivo editável e PDF','Escrever e-mail profissional','Anexar, revisar e compartilhar com segurança'],
    stages:[
      explain('Documento, PDF e e-mail fazem parte do mesmo processo','Uma rotina administrativa costuma começar com a produção do documento e terminar com seu envio e registro.','Documentos editáveis são adequados para criação e colaboração. O PDF é útil quando o layout precisa ser preservado para leitura, impressão ou protocolo. O e-mail deve explicar o que está sendo enviado, para quem e qual ação é esperada.','Um relatório é elaborado em editor de texto, exportado como PDF e encaminhado ao setor responsável.','Use nomes de arquivo que indiquem assunto, setor e período.'),
      demo('Fluxo do documento até o envio','Acompanhe o processo completo.',[
        'Criar o documento com título, data, responsável e conteúdo.','Revisar ortografia e organização visual.','Salvar uma versão editável para futuras alterações.','Exportar uma cópia em PDF.','Abrir o e-mail, escrever assunto e mensagem.','Anexar o PDF correto, conferir e enviar.']),
      quiz('Documentos e formatos',[
        {q:'Qual formato é adequado para preservar o layout de um relatório final?',options:['PDF','TXT sem formatação','Arquivo executável','Imagem de baixa resolução'],answer:0,why:'O PDF preserva a apresentação do documento em diferentes dispositivos.'},
        {q:'Quando a versão editável deve ser mantida?',options:['Quando o documento poderá receber correções ou atualizações','Somente quando o arquivo estiver vazio','Quando ninguém precisar abrir o conteúdo','Quando o PDF não possuir nome'],answer:0,why:'A versão editável permite alterações futuras.'},
        {q:'Qual nome de arquivo é mais organizado?',options:['Relatorio_RH_Agosto_2026.pdf','documento-final-agora.pdf','arquivo1.pdf','novo.pdf'],answer:0,why:'O nome informa tipo, setor e período.'},
        {q:'Antes de compartilhar um documento, o que deve ser conferido?',options:['Conteúdo, destinatários e permissão necessária','Somente a cor da página','Quantidade de ícones do navegador','Modelo do mouse utilizado'],answer:0,why:'Conteúdo, acesso e destinatários determinam a segurança do compartilhamento.'}
      ]),
      emailLab('Correio administrativo: envio de relatório em PDF','Utilize o correio simulado para enviar um relatório fictício. Nenhuma mensagem real será enviada.',{
        scenario:'O setor de RH solicitou o relatório fictício de horários da primeira quinzena.',
        recipient:'rh.agv@simulacao.edu.br',subjectKeywords:['relatório','horários','quinzena'],bodyKeywords:['olá','anexo','relatório','horários'],attachment:'relatorio-horarios-1a-quinzena.pdf',
        suggestedBody:'Olá,\n\nEncaminho em anexo o relatório de horários da primeira quinzena para conferência.\n\nObrigado.',
        hint:'O assunto deve identificar o relatório e o período; o texto precisa explicar o anexo.'
      }),
      officeLab('Central de documentos: revisão para compartilhamento','Prepare uma lista administrativa antes de disponibilizá-la.',[
        {id:'bold-title',prompt:'Aplique negrito ao título do documento.',action:'bold',why:'O título identifica a finalidade do documento.'},
        {id:'font-14',prompt:'Aumente o título para 14 pontos.',action:'font-14',why:'O tamanho cria hierarquia visual.'},
        {id:'freeze-header',prompt:'Mantenha o cabeçalho visível durante a conferência.',action:'freeze-header',why:'O cabeçalho ajuda a interpretar registros longos.'},
        {id:'share-commenter',prompt:'Compartilhe para revisão como Comentador.',action:'share-commenter',why:'O revisor pode registrar observações sem alterar diretamente os dados.'}
      ],{scenario:'Lista administrativa para conferência',columns:['Documento','Setor','Prazo','Situação'],rows:[['Relatório de horários','RH','Hoje','Pendente'],['Solicitação de compra','Compras','2 dias','Em revisão'],['Resumo de despesas','Financeiro','Hoje','Pendente'],['Ata de reunião','Direção','3 dias','Concluído']]}),
      challenge('Missão final: comunicação sem retrabalho','Resolva situações comuns de documentos e e-mail.',[
        {q:'O anexo correto não aparece na mensagem. O que fazer antes de enviar?',options:['Anexar o arquivo correto e conferir o nome','Enviar sem anexo e aguardar reclamação','Compartilhar a senha da conta','Colocar o documento inteiro no assunto'],answer:0,why:'A conferência do anexo evita retrabalho.'},
        {q:'O destinatário precisa apenas registrar observações. Qual permissão é adequada?',options:['Comentador','Editor com acesso total','Proprietário','Link público de edição'],answer:0,why:'Comentador permite revisar sem alterar diretamente o conteúdo.'},
        {q:'Qual assunto é mais claro?',options:['Relatório de horários — 1ª quinzena — conferência','Oi, veja isso','Arquivo importante','URGENTE'],answer:0,why:'O assunto informa documento, período e finalidade.'}
      ],'Comunicador Administrativo')
    ]
  },
  {
    id:'1ADM-06',classId:'1ADM',order:6,duration:45,kind:'content',curriculumRevision:'2026T2-admin',keepLegacyReinforcement:false,
    title:'Informática básica no escritório e segurança de acesso',subtitle:'Reconheça equipamentos, organize arquivos e proteja uma estação de trabalho administrativa.',
    icon:'🖥',badge:'Operador de Escritório',estimated:'15–25 min',application:'Posto de trabalho, atendimento, secretaria e organização digital',evidence:'Checklist de estação de trabalho e proteção de conta',
    objectives:['Diferenciar dispositivos de entrada e saída','Reconhecer armazenamento e componentes básicos','Organizar arquivos e pastas','Aplicar práticas de login e autenticação segura'],
    stages:[
      explain('A estação de trabalho administrativa','Computador, periféricos, arquivos e contas formam um único ambiente de trabalho.','Teclado, mouse, scanner e microfone enviam dados ao computador. Monitor, impressora e caixa de som apresentam resultados. SSD e armazenamento em nuvem guardam arquivos. O administrador precisa saber escolher o dispositivo adequado, organizar documentos e encerrar as contas ao usar equipamento compartilhado.','Um scanner transforma um documento em papel em arquivo digital; uma impressora realiza o caminho inverso.','Não confunda fechar a janela com sair da conta: em um notebook compartilhado, faça logout.'),
      demo('Montando um posto de trabalho organizado','Observe uma sequência básica.',[
        'Conferir energia, monitor, teclado e mouse.','Identificar impressora, scanner, webcam ou headset necessários.','Criar pastas por setor, assunto e período.','Salvar arquivos com nomes descritivos.','Ativar proteção da conta e sair ao terminar.']),
      quiz('Entrada, saída e armazenamento',[
        {q:'Qual dispositivo é usado para digitalizar um documento em papel?',options:['Scanner','Monitor','Projetor','Caixa de som'],answer:0,why:'O scanner captura o documento e cria um arquivo digital.'},
        {q:'Qual dispositivo apresenta imagens e textos ao usuário?',options:['Monitor','Teclado','Microfone','Leitor de código'],answer:0,why:'O monitor é um dispositivo de saída visual.'},
        {q:'Qual componente armazena arquivos de forma permanente no computador?',options:['SSD','Memória RAM apenas','Mouse','Webcam'],answer:0,why:'O SSD mantém arquivos mesmo após o desligamento.'},
        {q:'Qual estrutura facilita localizar documentos de RH?',options:['Pasta RH > 2026 > Agosto > Relatórios','Todos os arquivos na área de trabalho','Arquivos com nomes novo1 e final2','Uma pasta sem subpastas para toda a escola'],answer:0,why:'Pastas e nomes organizados reduzem tempo de busca e erros.'}
      ]),
      sheet('Organização digital do setor','Escolha ações adequadas para uma rotina de escritório.',[
        {kind:'choice',prompt:'Um documento precisa ser enviado preservando o layout. Qual formato escolher?',options:['PDF','MP3','EXE','BMP'],answer:0,why:'PDF é adequado para distribuir documentos com layout preservado.'},
        {kind:'choice',prompt:'O computador será usado por outro estudante. Qual ação deve ser feita?',options:['Sair das contas e fechar os arquivos','Deixar o e-mail aberto','Salvar a senha no navegador','Apagar os perfis de todos'],answer:0,why:'O logout protege os dados sem apagar os demais perfis.'},
        {kind:'choice',prompt:'Qual periférico é adequado para reuniões on-line?',options:['Webcam e headset','Impressora e estabilizador','Scanner e pendrive','Projetor sem áudio'],answer:0,why:'Webcam e headset permitem imagem, áudio e comunicação.'}
      ],{mode:'choices'}),
      twoFactorLab('Central de segurança: proteção do e-mail administrativo','Configure uma conta fictícia com autenticação em dois fatores.',{
        context:'Conta simulada usada no setor administrativo',account:'administrativo.agv@simulacao.edu.br',preferredMethod:'authenticator',backupChoice:'offline',suspiciousChoice:'deny'
      }),
      challenge('Missão final: preparar e encerrar o computador','Conclua o checklist de uma estação compartilhada.',[
        {q:'Qual ordem é mais segura ao terminar?',options:['Salvar, fechar arquivos, sair das contas e organizar o equipamento','Desligar a tela e deixar tudo conectado','Compartilhar a senha com o próximo usuário','Apagar documentos para liberar espaço'],answer:0,why:'A sequência preserva o trabalho e protege as contas.'},
        {q:'Uma solicitação de login aparece sem que você esteja entrando. O que fazer?',options:['Negar e revisar a segurança da conta','Aprovar para remover o aviso','Enviar o código recebido','Desativar todas as notificações'],answer:0,why:'Solicitações não iniciadas devem ser negadas e investigadas.'},
        {q:'Qual dispositivo é de entrada?',options:['Teclado','Monitor','Impressora','Projetor'],answer:0,why:'O teclado envia dados ao computador.'}
      ],'Operador de Escritório')
    ]
  },
  {
    id:'1ADM-07',classId:'1ADM',order:7,duration:45,kind:'assessment',curriculumRevision:'2026T2-admin-v242',keepLegacyReinforcement:false,
    title:'Avaliação prática integrada',subtitle:'Resolva uma rotina administrativa com planilha, cálculo, documento, e-mail e segurança.',
    icon:'🎯',badge:'Analista Administrativo',estimated:'20–25 min',application:'Avaliação final do trimestre',evidence:'Relatório completo da avaliação prática',
    objectives:['Aplicar formatação e cálculos','Organizar um registro administrativo','Preparar documento e comunicação','Tomar decisões seguras e justificadas'],
    stages:[
      explain('Caso avaliativo: organização de um treinamento','Você apoiará a organização fictícia de um treinamento interno.','A missão reúne controle de participantes, orçamento, horários, documento em PDF e comunicação com o RH. As atividades práticas registram tentativas, correções, tempo e uso do tutorial. O objetivo é demonstrar aplicação, não decorar respostas.','O setor precisa conferir participantes, custo, horário e enviar o relatório final.','Leia o caso inteiro antes de executar cada ação.'),
      officeLab('Avaliação: preparar a base de participantes','Aplique somente as ações solicitadas na planilha simulada.',[
        {id:'bold-title',prompt:'Destaque o título do controle de treinamento.',action:'bold',why:'O título identifica a finalidade da base.'},
        {id:'center-header',prompt:'Centralize os cabeçalhos da lista.',action:'center',why:'Cabeçalhos curtos ficam mais fáceis de comparar.'},
        {id:'filter-pending',prompt:'Filtre participantes com situação Pendente.',action:'filter-pending',why:'A filtragem identifica quem ainda precisa confirmar.'},
        {id:'share-commenter',prompt:'Compartilhe a lista com o RH como Comentador.',action:'share-commenter',why:'O RH pode registrar ajustes sem alterar a base diretamente.'}
      ],{scenario:'Treinamento administrativo — avaliação',columns:['Participante','Setor','Custo','Situação'],rows:[['Ana','Financeiro','120','Confirmado'],['Bruno','RH','120','Pendente'],['Carla','Compras','120','Confirmado'],['Diego','Secretaria','120','Pendente']]}),
      formula('Avaliação: cálculos do treinamento','Monte as fórmulas solicitadas.',[
        {prompt:'Calcular 4 participantes vezes custo unitário C2',tokens:['=','4','*','C2'],answer:'=4*C2',why:'Quantidade multiplicada pelo custo unitário gera o total.'},
        {prompt:'Calcular orçamento D2 menos custo total E2',tokens:['=','D2','-','E2'],answer:'=D2-E2',why:'O saldo é o orçamento menos o custo.'}
      ]),
      emailLab('Avaliação: encaminhar o relatório','Prepare o envio simulado do documento final.',{
        scenario:'O RH solicitou o relatório final do treinamento administrativo.',recipient:'rh.agv@simulacao.edu.br',subjectKeywords:['relatório','treinamento'],bodyKeywords:['olá','anexo','treinamento','conferência'],attachment:'relatorio-treinamento-administrativo.pdf',hint:'Confira destinatário, assunto, contexto, ação esperada e anexo.'
      }),
      quiz('Avaliação: decisões administrativas',[
        {q:'Dois participantes não confirmaram presença. Qual ação inicial é adequada?',options:['Filtrar os pendentes e solicitar confirmação','Excluir seus registros imediatamente','Publicar os nomes em grupo aberto','Aprovar a presença sem contato'],answer:0,why:'A filtragem permite tratar somente os casos pendentes.'},
        {q:'O relatório final não deve ser alterado após o envio. Qual formato é adequado?',options:['PDF','Documento sem nome','Arquivo executável','Áudio'],answer:0,why:'O PDF preserva o layout e é apropriado para protocolo.'},
        {q:'O RH precisa comentar possíveis correções, mas não editar valores. Qual permissão usar?',options:['Comentador','Editor','Proprietário','Link público'],answer:0,why:'Comentador atende à revisão sem edição direta.'},
        {q:'Qual ação protege o computador após a avaliação?',options:['Sair das contas e bloquear o perfil','Deixar o e-mail aberto','Salvar a senha no navegador','Compartilhar o código de acesso'],answer:0,why:'O logout evita acesso indevido ao perfil.'}
      ]),
      challenge('Entrega da avaliação','Confirme as decisões finais.',[
        {q:'Qual conjunto representa uma evidência completa?',options:['Arquivo, data, ações, duração e identificação do estudante','Somente uma captura sem contexto','Senha utilizada na conta','Código temporário do segundo fator'],answer:0,why:'A evidência deve documentar o processo sem expor credenciais.'},
        {q:'Após gerar o PDF da plataforma, qual é a próxima ação?',options:['Anexar o arquivo na atividade indicada no Classroom','Apagar o comprovante','Enviar a senha ao professor','Reiniciar toda a avaliação'],answer:0,why:'O PDF deve ser anexado à atividade indicada.'}
      ],'Analista Administrativo')
    ]
  },
  {
    id:'1ADM-08',classId:'1ADM',order:8,duration:45,kind:'recovery',curriculumRevision:'2026T2-admin-v242',keepLegacyReinforcement:false,
    title:'Recuperação prática — missão de reorganização',subtitle:'Resolva um caso diferente da avaliação, aplicando os mesmos conhecimentos em outra situação.',
    icon:'🧭',badge:'Administrador em Evolução',estimated:'20–25 min',application:'Recuperação diferenciada do trimestre',evidence:'Relatório da missão alternativa de recuperação',
    objectives:['Corrigir uma base desorganizada','Refazer cálculos em novo contexto','Aplicar comunicação e segurança','Demonstrar evolução prática'],
    stages:[
      explain('Caso de recuperação: reorganizar o setor de compras','A recuperação utiliza uma situação diferente da avaliação.','Você receberá uma base fictícia de solicitações de compra com erros de organização, pendências, custos e documentos. A missão é corrigir o processo, preparar a planilha, calcular valores e comunicar o resultado.','O setor precisa identificar solicitações atrasadas e enviar uma síntese ao financeiro.','Use o tutorial quando necessário: ele orienta o processo sem fornecer a resposta.'),
      officeLab('Recuperação: corrigir o controle de compras','Organize a base simulada do setor.',[
        {id:'font-14',prompt:'Aumente o título do controle para 14 pontos.',action:'font-14',why:'O título deve ter hierarquia visual.'},
        {id:'freeze-header',prompt:'Congele o cabeçalho para revisar muitos registros.',action:'freeze-header',why:'O cabeçalho permanece visível durante a rolagem.'},
        {id:'filter-delayed',prompt:'Filtre somente as solicitações Atrasadas.',action:'filter-delayed',why:'O filtro permite tratar as pendências prioritárias.'},
        {id:'sort-desc',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordem decrescente ajuda a analisar os maiores custos.'}
      ],{scenario:'Solicitações de compra — recuperação',columns:['Solicitação','Setor','Valor','Situação'],rows:[['Toner','TI','780','Atrasado'],['Pastas','RH','160','No prazo'],['Papel A4','Secretaria','540','Atrasado'],['Cadeiras','Direção','920','No prazo']]}),
      formula('Recuperação: conferir valores','Monte os cálculos em um contexto diferente.',[
        {prompt:'Calcular quantidade B2 vezes preço C2',tokens:['=','B2','*','C2'],answer:'=B2*C2',why:'O total depende da quantidade e do preço unitário.'},
        {prompt:'Calcular verba D2 menos valor usado E2',tokens:['=','D2','-','E2'],answer:'=D2-E2',why:'A diferença mostra o saldo restante.'}
      ]),
      emailLab('Recuperação: comunicar pendências','Envie a síntese fictícia das solicitações atrasadas.',{
        scenario:'O financeiro precisa receber a síntese das compras atrasadas.',recipient:'financeiro.agv@simulacao.edu.br',subjectKeywords:['compras','atrasadas'],bodyKeywords:['olá','anexo','compras','atrasadas'],attachment:'sintese-compras-atrasadas.pdf',hint:'Explique o que está anexado e qual conferência é necessária.'
      }),
      twoFactorLab('Recuperação: proteger a conta do setor','Configure a proteção da conta simulada usada no processo.',{
        context:'Conta fictícia do setor de compras',account:'compras.agv@simulacao.edu.br',preferredMethod:'authenticator',backupChoice:'offline',suspiciousChoice:'deny'
      }),
      challenge('Fechamento da recuperação','Demonstre que compreendeu o processo.',[
        {q:'Por que a recuperação utiliza um caso diferente?',options:['Para avaliar os mesmos conhecimentos por outra abordagem','Para repetir exatamente a avaliação','Para eliminar as atividades práticas','Para ocultar os resultados anteriores'],answer:0,why:'A abordagem alternativa permite demonstrar aprendizagem sem copiar a avaliação.'},
        {q:'Qual sequência é mais adequada?',options:['Organizar dados, calcular, revisar, gerar documento e comunicar','Enviar primeiro e revisar depois','Apagar dados e criar valores aleatórios','Compartilhar como editor para qualquer pessoa'],answer:0,why:'A sequência reduz erros e preserva a rastreabilidade.'},
        {q:'Ao terminar em notebook compartilhado, o que fazer?',options:['Sair das contas, bloquear o perfil e organizar o equipamento','Deixar tudo aberto para o próximo aluno','Salvar senhas no navegador','Excluir os perfis dos colegas'],answer:0,why:'O encerramento seguro protege todos os usuários.'}
      ],'Administrador em Evolução')
    ]
  },
  {
    id:'2ADM-01',classId:'2ADM',order:1,duration:45,kind:'content',curriculumRevision:'2026T2-admin',keepLegacyReinforcement:false,
    title:'Planilhas empresariais avançadas',subtitle:'Estruture bases, aplique filtros, validação, classificação e indicadores para apoiar decisões.',
    icon:'▦',badge:'Analista de Planilhas',estimated:'15–25 min',application:'Controle empresarial, compras, estoque e indicadores',evidence:'Base empresarial organizada e visão gerencial simulada',
    objectives:['Estruturar dados para análise','Aplicar filtros e classificação','Usar validação e permissões','Preparar indicadores gerenciais'],
    stages:[
      explain('Da tabela ao controle empresarial','Uma planilha empresarial precisa ser estruturada para filtrar, calcular e gerar indicadores.','Cada linha deve representar um registro e cada coluna um campo. Cabeçalhos únicos, ausência de linhas vazias e padrões de preenchimento permitem filtros, validação e gráficos confiáveis.','Uma base de fornecedores pode conter empresa, categoria, prazo, valor e situação.','Antes de criar gráfico, confira se a base está organizada e padronizada.'),
      demo('Preparando uma base confiável','Observe o fluxo de organização.',[
        'Definir campos e tipos de dados.','Padronizar categorias e situações.','Aplicar validação quando houver opções controladas.','Filtrar e ordenar para investigar problemas.','Criar indicadores e compartilhar com a permissão mínima.']),
      officeLab('Painel empresarial: análise de fornecedores','Prepare uma visão gerencial da base simulada.',[
        {id:'freeze-header',prompt:'Congele o cabeçalho da base.',action:'freeze-header',why:'O cabeçalho permanece visível durante a análise.'},
        {id:'filter-pending',prompt:'Filtre fornecedores com situação Pendente.',action:'filter-pending',why:'A filtragem destaca contratos que exigem ação.'},
        {id:'sort-desc',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordenação facilita priorizar os maiores valores.'},
        {id:'chart-column',prompt:'Crie um gráfico de colunas para comparar os registros.',action:'chart-column',why:'Colunas permitem comparar categorias.'},
        {id:'share-commenter',prompt:'Compartilhe com a gestão como Comentador.',action:'share-commenter',why:'A gestão pode registrar observações sem alterar a base.'}
      ],{scenario:'Análise simulada de fornecedores',columns:['Fornecedor','Categoria','Valor','Situação'],rows:[['Alfa Office','Materiais','4800','Ativo'],['Beta Serviços','Manutenção','7200','Pendente'],['Gama Cursos','Treinamento','3900','Ativo'],['Delta Tech','Tecnologia','8600','Pendente']]}),
      quiz('Qualidade e governança dos dados',[
        {q:'Qual estrutura favorece filtros e gráficos?',options:['Uma linha por registro e uma coluna por campo','Várias informações na mesma célula','Linhas vazias entre todos os registros','Cabeçalhos diferentes em cada linha'],answer:0,why:'Dados tabulares consistentes são necessários para análise.'},
        {q:'Como reduzir variações como Pago, PAGO e pg?',options:['Usar validação com opções padronizadas','Aplicar mais cores','Ocultar a coluna','Transformar os dados em imagem'],answer:0,why:'A validação controla os valores permitidos.'},
        {q:'Qual permissão atende um gestor que apenas revisará e comentará?',options:['Comentador','Editor','Proprietário','Acesso público'],answer:0,why:'Comentador permite observações sem edição direta.'},
        {q:'Quando ordenar do maior para o menor é útil?',options:['Ao priorizar valores ou volumes mais altos','Ao apagar fórmulas','Ao criar uma senha','Ao alterar o sistema operacional'],answer:0,why:'A classificação decrescente evidencia os maiores registros.'}
      ]),
      challenge('Missão final: transformar dados em informação','Tome decisões com base na estrutura da planilha.',[
        {q:'Há muitos contratos pendentes e valores elevados. Qual ação inicial é adequada?',options:['Filtrar pendentes e ordenar por valor','Excluir registros antigos sem análise','Compartilhar a base publicamente','Trocar a fonte da tabela'],answer:0,why:'Filtro e ordenação permitem investigar o problema.'},
        {q:'Qual gráfico ajuda a comparar valores por fornecedor?',options:['Gráfico de colunas','Imagem decorativa','Áudio','Documento sem tabela'],answer:0,why:'Colunas são adequadas para comparar categorias.'}
      ],'Analista de Planilhas')
    ]
  },
  {
    id:'2ADM-02',classId:'2ADM',order:2,duration:45,kind:'content',curriculumRevision:'2026T2-admin',keepLegacyReinforcement:false,
    title:'RH, financeiro e funções aplicadas',subtitle:'Use funções e regras para analisar jornada, custos, metas, pagamentos e situações empresariais.',
    icon:'fx',badge:'Analista de Gestão',estimated:'15–25 min',application:'RH, financeiro, folha, metas e controle gerencial',evidence:'Modelo de análise com funções e regras empresariais',
    objectives:['Aplicar SOMA e MÉDIA','Usar SE em regras empresariais','Contar e somar por critérios','Interpretar indicadores de RH e financeiro'],
    stages:[
      explain('Funções transformam registros em decisões','Funções permitem resumir dados e aplicar regras de forma automática.','SOMA e MÉDIA produzem indicadores; SE classifica situações; CONT.SE conta ocorrências; SOMASE totaliza valores associados a um critério. Em RH e financeiro, essas funções podem apoiar análise de faltas, metas, despesas e pagamentos.','CONT.SE pode contar registros Pendentes; SOMASE pode totalizar os valores desses registros.','Verifique sempre intervalo, critério e coluna de soma.'),
      demo('Fluxo de uma regra empresarial','Acompanhe a criação de um indicador.',[
        'Definir a pergunta administrativa.','Identificar as colunas que contêm os dados.','Escolher a função adequada.','Montar a fórmula e revisar os critérios.','Interpretar o resultado antes de tomar decisão.']),
      formula('Indicadores de RH e financeiro','Monte funções aplicadas.',[
        {prompt:'Somar valores de pagamento em F2:F20',tokens:['=','SOMA','(','F2:F20',')'],answer:'=SOMA(F2:F20)',why:'SOMA totaliza os pagamentos.'},
        {prompt:'Calcular média de horas em D2:D20',tokens:['=','MÉDIA','(','D2:D20',')'],answer:'=MÉDIA(D2:D20)',why:'MÉDIA resume a carga horária do grupo.'},
        {prompt:'Se G2 for maior que 2, mostrar REVISAR; senão OK',tokens:['=','SE','(','G2>2',';','"REVISAR"',';','"OK"',')'],answer:'=SE(G2>2;"REVISAR";"OK")',why:'A regra classifica registros com mais de duas ocorrências.'},
        {prompt:'Contar PENDENTE em H2:H30',tokens:['=','CONT.SE','(','H2:H30',';','"PENDENTE"',')'],answer:'=CONT.SE(H2:H30;"PENDENTE")',why:'CONT.SE conta ocorrências do critério.'},
        {prompt:'Somar I2:I30 quando H2:H30 for PENDENTE',tokens:['=','SOMASE','(','H2:H30',';','"PENDENTE"',';','I2:I30',')'],answer:'=SOMASE(H2:H30;"PENDENTE";I2:I30)',why:'SOMASE totaliza valores associados ao critério.'}
      ]),
      sheet('Decisões de gestão','Escolha a função adequada em cada situação.',[
        {kind:'choice',prompt:'Calcular o total da folha simplificada.',options:['SOMA','MÉDIA','CONT.SE','MÍNIMO'],answer:0,why:'O total é obtido com SOMA.'},
        {kind:'choice',prompt:'Descobrir a carga horária média da equipe.',options:['MÉDIA','SOMASE','SE','MÁXIMO'],answer:0,why:'MÉDIA resume os valores do grupo.'},
        {kind:'choice',prompt:'Contar quantos registros estão Pendentes.',options:['CONT.SE','SOMA','MÉDIA','CONCATENAR'],answer:0,why:'CONT.SE conta ocorrências de um critério.'},
        {kind:'choice',prompt:'Somar somente despesas da categoria Transporte.',options:['SOMASE','CONT.SE','MÍNIMO','SE'],answer:0,why:'SOMASE totaliza valores vinculados a uma categoria.'}
      ],{mode:'choices'}),
      challenge('Missão final: interpretar indicadores','Use os resultados para decidir.',[
        {q:'A média de horas caiu e aumentaram registros incompletos. Qual ação é adequada?',options:['Auditar os registros e verificar causas antes de corrigir valores','Excluir todas as linhas','Aprovar automaticamente os pagamentos','Compartilhar a folha publicamente'],answer:0,why:'A investigação deve preceder alterações.'},
        {q:'Qual combinação cria um painel de pendências?',options:['SE para classificar, CONT.SE para contar e SOMASE para totalizar valores','Somente cores aleatórias','Concatenação e impressão','MÍNIMO para todos os cálculos'],answer:0,why:'As funções cumprem papéis complementares.'}
      ],'Analista de Gestão')
    ]
  },
  {
    id:'2ADM-03',classId:'2ADM',order:3,duration:45,kind:'content',curriculumRevision:'2026T2-admin2-mail-v242',keepLegacyReinforcement:false,
    title:'Comunicação, documentos e produtividade',subtitle:'Integre e-mail profissional, PDF, compartilhamento, permissões e segurança de contas.',
    icon:'📄',badge:'Gestor de Informação',estimated:'15–25 min',application:'Comunicação entre setores, relatórios e gestão documental',evidence:'Fluxo completo de documento, compartilhamento e comunicação',
    objectives:['Planejar comunicação entre setores','Gerar e compartilhar documentos','Configurar permissões adequadas','Proteger contas e arquivos'],
    stages:[
      explain('Produtividade é organizar o fluxo da informação','Ferramentas digitais funcionam melhor quando fazem parte de um processo claro.','Um documento pode ser criado de forma colaborativa, revisado, exportado em PDF, compartilhado com permissão específica e encaminhado por e-mail. A autenticação em dois fatores protege as contas usadas nesse fluxo.','Um relatório financeiro é revisado como Comentador e depois enviado em PDF à direção.','Registre versões e evite anexos com nomes genéricos.'),
      officeLab('Central de produtividade: relatório gerencial','Prepare a base para revisão da gestão.',[
        {id:'bold-title',prompt:'Destaque o título do relatório gerencial.',action:'bold',why:'O título orienta a leitura do documento.'},
        {id:'filter-critical',prompt:'Filtre registros de prioridade Crítica.',action:'filter-critical',why:'A filtragem permite tratar riscos primeiro.'},
        {id:'chart-column',prompt:'Crie um gráfico para comparar os indicadores.',action:'chart-column',why:'A visualização facilita a comparação.'},
        {id:'share-commenter',prompt:'Compartilhe com a direção como Comentador.',action:'share-commenter',why:'A direção pode revisar sem alterar a base.'}
      ],{scenario:'Relatório gerencial simulado',columns:['Indicador','Setor','Valor','Prioridade'],rows:[['Despesas pendentes','Financeiro','18','Crítica'],['Vagas em aberto','RH','4','Normal'],['Compras atrasadas','Compras','7','Crítica'],['Documentos em revisão','Secretaria','12','Normal']]}),
      emailLab('Comunicação entre setores','Envie o relatório gerencial fictício para análise.',{
        scenario:'A direção solicitou o relatório gerencial consolidado.',recipient:'direcao.agv@simulacao.edu.br',cc:'financeiro.agv@simulacao.edu.br',subjectKeywords:['relatório','gerencial'],bodyKeywords:['olá','anexo','relatório','análise'],attachment:'relatorio-gerencial-consolidado.pdf',hint:'Use Para para a direção, CC para o setor que acompanha e explique o anexo.'
      }),
      twoFactorLab('Segurança da conta gerencial','Proteja a conta fictícia usada para compartilhar documentos.',{
        context:'Conta simulada de gestão documental',account:'gestao.agv@simulacao.edu.br',preferredMethod:'authenticator',backupChoice:'offline',suspiciousChoice:'deny'
      }),
      quiz('Governança da informação',[
        {q:'Um documento contém dados pessoais e financeiros. Qual compartilhamento é adequado?',options:['Acesso nominal e permissão mínima necessária','Link público de edição','Envio da senha junto ao arquivo','Publicação na web'],answer:0,why:'O menor privilégio reduz exposição e alterações indevidas.'},
        {q:'Quem acompanha a mensagem, mas não é o destinatário principal, pode ser incluído em qual campo?',options:['CC','Assunto','Anexo','Rascunho'],answer:0,why:'CC identifica pessoas que devem acompanhar a comunicação.'},
        {q:'Qual prática facilita controle de versões?',options:['Usar nome, período e versão no arquivo','Salvar tudo como final.pdf','Substituir arquivos sem registro','Enviar somente capturas'],answer:0,why:'Nomes consistentes ajudam a identificar versões.'},
        {q:'Uma solicitação de segundo fator não foi iniciada por você. Qual ação tomar?',options:['Negar e revisar a segurança','Aprovar para retirar o aviso','Enviar o código ao suporte por mensagem','Desativar o bloqueio'],answer:0,why:'Solicitações desconhecidas devem ser negadas.'}
      ]),
      challenge('Missão final: fluxo produtivo e seguro','Organize o processo completo.',[
        {q:'Qual ordem reduz retrabalho?',options:['Produzir, revisar, exportar, compartilhar, comunicar e registrar','Enviar, produzir e revisar depois','Publicar, apagar e recriar','Compartilhar a senha antes do documento'],answer:0,why:'O fluxo ordenado inclui revisão antes da distribuição.'},
        {q:'Qual evidência deve ser preservada?',options:['Documento, versão, destinatários, data e confirmação','Código de autenticação real','Senha do usuário','Somente uma imagem sem contexto'],answer:0,why:'A evidência documenta o processo sem expor credenciais.'}
      ],'Gestor de Informação')
    ]
  },
  {
    id:'2ADM-04',classId:'2ADM',order:4,duration:45,kind:'assessment',curriculumRevision:'2026T2-admin2-v242',keepLegacyReinforcement:false,
    title:'Avaliação prática — caso empresarial integrado',subtitle:'Analise dados, aplique funções, prepare um relatório e comunique decisões com segurança.',
    icon:'🎯',badge:'Gestor Empresarial',estimated:'20–25 min',application:'Avaliação final do trimestre',evidence:'Relatório da avaliação empresarial integrada',
    objectives:['Analisar uma base empresarial','Aplicar funções e filtros','Interpretar indicadores','Comunicar uma decisão gerencial'],
    stages:[
      explain('Caso avaliativo: plano de redução de pendências','Você apoiará uma reunião fictícia de gestão.','A base reúne despesas, solicitações e prazos de diferentes setores. Será necessário filtrar pendências, organizar indicadores, calcular valores e encaminhar um relatório para a direção.','A gestão precisa saber quantos registros estão pendentes, o valor associado e quais ações devem ser priorizadas.','Use os dados apresentados; não invente valores externos.'),
      officeLab('Avaliação: preparar o painel gerencial','Execute as ações solicitadas.',[
        {id:'freeze-header',prompt:'Congele o cabeçalho da base empresarial.',action:'freeze-header',why:'O cabeçalho permanece visível durante a análise.'},
        {id:'filter-critical',prompt:'Filtre registros de prioridade Crítica.',action:'filter-critical',why:'A prioridade crítica deve ser analisada primeiro.'},
        {id:'sort-desc',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a priorizar o impacto financeiro.'},
        {id:'chart-column',prompt:'Crie um gráfico de colunas para a reunião.',action:'chart-column',why:'A visualização compara os registros.'}
      ],{scenario:'Caso empresarial integrado — avaliação',columns:['Pendência','Setor','Valor','Prioridade'],rows:[['Contrato','Compras','9200','Crítica'],['Folha complementar','RH','3800','Normal'],['Nota fiscal','Financeiro','7100','Crítica'],['Arquivo cadastral','Secretaria','2400','Normal']]}),
      formula('Avaliação: indicadores empresariais','Monte as funções solicitadas.',[
        {prompt:'Contar CRÍTICA em D2:D20',tokens:['=','CONT.SE','(','D2:D20',';','"CRÍTICA"',')'],answer:'=CONT.SE(D2:D20;"CRÍTICA")',why:'CONT.SE conta registros com o critério.'},
        {prompt:'Somar C2:C20 quando D2:D20 for CRÍTICA',tokens:['=','SOMASE','(','D2:D20',';','"CRÍTICA"',';','C2:C20',')'],answer:'=SOMASE(D2:D20;"CRÍTICA";C2:C20)',why:'SOMASE totaliza os valores das prioridades críticas.'}
      ]),
      emailLab('Avaliação: comunicar a análise','Envie o relatório fictício à direção.',{
        scenario:'A direção solicitou a análise das pendências críticas.',recipient:'direcao.agv@simulacao.edu.br',cc:'financeiro.agv@simulacao.edu.br',subjectKeywords:['análise','pendências','críticas'],bodyKeywords:['olá','anexo','pendências','análise'],attachment:'analise-pendencias-criticas.pdf',hint:'Identifique o relatório, explique o anexo e solicite análise da direção.'
      }),
      quiz('Avaliação: interpretação gerencial',[
        {q:'Qual indicador mostra quantos registros críticos existem?',options:['CONT.SE da coluna Prioridade','SOMA dos nomes','MÉDIA das datas','Concatenação dos setores'],answer:0,why:'CONT.SE conta ocorrências do critério.'},
        {q:'Qual função totaliza os valores associados à prioridade Crítica?',options:['SOMASE','CONT.SE','MÍNIMO','CONCATENAR'],answer:0,why:'SOMASE soma valores vinculados a um critério.'},
        {q:'Qual decisão inicial é mais adequada para valores críticos elevados?',options:['Revisar os maiores valores, responsáveis e prazos','Excluir os registros','Publicar os dados','Alterar os valores sem justificativa'],answer:0,why:'A análise precisa considerar impacto, responsabilidade e prazo.'},
        {q:'Qual permissão é adequada para a direção comentar sem editar a base?',options:['Comentador','Editor','Proprietário','Público'],answer:0,why:'Comentador permite registrar decisões sem editar os dados.'}
      ]),
      challenge('Entrega da avaliação empresarial','Finalize o caso.',[
        {q:'Qual evidência representa o processo completo?',options:['Base analisada, fórmulas, relatório, envio e registro das ações','Somente uma resposta objetiva','Senha da conta','Código do segundo fator'],answer:0,why:'A avaliação registra aplicação e rastreabilidade.'},
        {q:'O relatório foi gerado pela plataforma. O que fazer?',options:['Anexar o PDF na atividade correspondente do Classroom','Excluir o arquivo','Reiniciar a avaliação','Enviar a senha do perfil'],answer:0,why:'O comprovante deve ser anexado à atividade indicada.'}
      ],'Gestor Empresarial')
    ]
  },
  {
    id:'2ADM-05',classId:'2ADM',order:5,duration:45,kind:'recovery',curriculumRevision:'2026T2-admin2-v242',keepLegacyReinforcement:false,
    title:'Recuperação prática — plano de ação administrativo',subtitle:'Resolva um caso alternativo com dados, funções, comunicação e segurança.',
    icon:'🧭',badge:'Gestor em Evolução',estimated:'20–25 min',application:'Recuperação diferenciada do trimestre',evidence:'Relatório do plano de ação alternativo',
    objectives:['Reestruturar uma base','Aplicar funções em outro cenário','Elaborar comunicação gerencial','Demonstrar aprendizagem por nova abordagem'],
    stages:[
      explain('Caso de recuperação: regularização de fornecedores','A recuperação utiliza um problema diferente da avaliação.','A empresa fictícia precisa revisar fornecedores com documentação atrasada, valores pendentes e acessos antigos. Você organizará a base, calculará os indicadores, preparará o relatório e comunicará o plano de ação.','A gestão precisa identificar fornecedores atrasados e definir prioridades sem expor dados.','Use as mesmas competências em um contexto novo.'),
      officeLab('Recuperação: analisar fornecedores','Prepare a base alternativa.',[
        {id:'filter-delayed',prompt:'Filtre fornecedores com situação Atrasado.',action:'filter-delayed',why:'O filtro concentra a análise nas pendências.'},
        {id:'sort-desc',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordem decrescente evidencia o maior impacto.'},
        {id:'fill-alert',prompt:'Aplique destaque de alerta aos registros exibidos.',action:'fill-alert',why:'O destaque visual sinaliza situações críticas.'},
        {id:'share-reader',prompt:'Compartilhe o resumo final como Leitor.',action:'share-reader',why:'A consulta não exige edição da base.'}
      ],{scenario:'Fornecedores — recuperação diferenciada',columns:['Fornecedor','Documento','Valor','Situação'],rows:[['Alfa','Certidão','6400','Atrasado'],['Beta','Contrato','4100','Regular'],['Gama','Cadastro','7800','Atrasado'],['Delta','Seguro','3500','Regular']]}),
      formula('Recuperação: indicadores alternativos','Monte as funções do novo cenário.',[
        {prompt:'Contar ATRASADO em D2:D20',tokens:['=','CONT.SE','(','D2:D20',';','"ATRASADO"',')'],answer:'=CONT.SE(D2:D20;"ATRASADO")',why:'CONT.SE conta os fornecedores atrasados.'},
        {prompt:'Somar C2:C20 quando D2:D20 for ATRASADO',tokens:['=','SOMASE','(','D2:D20',';','"ATRASADO"',';','C2:C20',')'],answer:'=SOMASE(D2:D20;"ATRASADO";C2:C20)',why:'SOMASE totaliza o valor associado às pendências.'}
      ]),
      emailLab('Recuperação: encaminhar plano de ação','Envie a comunicação fictícia do novo caso.',{
        scenario:'A gestão solicitou o plano de regularização de fornecedores.',recipient:'gestao.agv@simulacao.edu.br',cc:'compras.agv@simulacao.edu.br',subjectKeywords:['plano','regularização','fornecedores'],bodyKeywords:['olá','anexo','fornecedores','regularização'],attachment:'plano-regularizacao-fornecedores.pdf',hint:'Explique o plano, o anexo e a ação esperada.'
      }),
      twoFactorLab('Recuperação: revisar acessos do setor','Proteja a conta simulada e responda ao alerta.',{
        context:'Conta fictícia de gestão de fornecedores',account:'fornecedores.agv@simulacao.edu.br',preferredMethod:'authenticator',backupChoice:'offline',suspiciousChoice:'deny'
      }),
      challenge('Fechamento da recuperação avançada','Demonstre evolução no caso alternativo.',[
        {q:'Por que a recuperação não repete a avaliação?',options:['Porque verifica as mesmas competências em outro contexto','Porque não precisa avaliar aprendizagem','Porque elimina a prática','Porque substitui os registros anteriores'],answer:0,why:'Uma abordagem diferente evita mera repetição e permite nova demonstração.'},
        {q:'Qual sequência produz um plano de ação confiável?',options:['Filtrar, calcular, interpretar, documentar, comunicar e registrar','Enviar antes de analisar','Excluir os atrasados','Compartilhar acessos entre setores'],answer:0,why:'O plano depende de análise e registro organizados.'},
        {q:'Um gestor antigo ainda possui acesso. Qual ação tomar?',options:['Remover o acesso e revisar os arquivos compartilhados','Manter indefinidamente','Enviar a senha nova','Publicar os documentos'],answer:0,why:'Acesso deve acompanhar a necessidade atual.'}
      ],'Gestor em Evolução')
    ]
  }
];

const CURRICULUM_V228_IDS=new Set(CURRICULUM_V228.map(item=>item.id));
for(const lesson of CURRICULUM_V228){
  const index=LESSONS.findIndex(item=>item.id===lesson.id);
  if(index>=0)LESSONS[index]=lesson;else LESSONS.push(lesson);
}
for(let index=LESSONS.length-1;index>=0;index--){
  const lesson=LESSONS[index];
  if(lesson.classId==='1ADM'&&!['1ADM-01','1ADM-02',...CURRICULUM_V228_IDS].includes(lesson.id))LESSONS.splice(index,1);
  if(lesson.classId==='2ADM'&&!CURRICULUM_V228_IDS.has(lesson.id))LESSONS.splice(index,1);
}
LESSONS.sort((a,b)=>a.classId.localeCompare(b.classId)||a.order-b.order);
for(const lesson of LESSONS){
  lesson.kind=lesson.kind||'content';
  lesson.curriculumRevision=lesson.curriculumRevision||'2026T2-preserved';
  lesson.application=lesson.application||'Informática Empresarial e rotina administrativa';
  lesson.evidence=lesson.evidence||'Comprovante da atividade e registro das ações';
}

const CURRICULUM_V228_OPTION_REVISIONS={
  'Qual conjunto de colunas é mais adequado para um controle diário?':['Funcionário, data, entrada, saída, intervalo e observação','Produto, fornecedor, quantidade, preço, prazo e situação','Conta, senha, código de acesso, dispositivo e localização','Arquivo, versão, pasta, permissão, autor e tamanho'],
  'Qual informação deve ser protegida com maior cuidado?':['Dados pessoais e valores de pagamento','Títulos, cabeçalhos e nomes das abas do relatório','Cores, bordas e tamanhos usados na formatação','Ícones, menus e atalhos exibidos no sistema'],
  'Uma diferença inesperada aparece no pagamento. Qual ação administrativa é adequada?':['Conferir horas, valores e descontos antes da correção','Alterar o pagamento imediatamente e registrar depois','Excluir o lançamento e criar outro sem histórico','Encaminhar a planilha completa para um grupo aberto'],
  'Quem deve receber uma planilha de folha com dados pessoais?':['Somente profissionais autorizados pela rotina do setor','Todos que participam de grupos gerais da instituição','Qualquer pessoa que possua o endereço público do arquivo','Contatos externos interessados em conhecer o processo'],
  'Qual prática melhora a gestão de pessoas?':['Registrar com clareza, revisar divergências e proteger dados','Usar campos livres sem padrão e corrigir somente no fim','Compartilhar senhas para que toda a equipe tenha acesso','Excluir históricos antigos sem autorização ou justificativa'],
  'Quando a versão editável deve ser mantida?':['Quando o documento ainda poderá ser corrigido ou atualizado','Quando o arquivo final não tiver título, data ou responsável','Quando ninguém precisar revisar ou modificar o conteúdo','Quando o PDF estiver armazenado em mais de uma pasta'],
  'Antes de compartilhar um documento, o que deve ser conferido?':['Conteúdo, destinatários e nível de permissão necessário','Cores do tema, modelo do mouse e posição da janela','Quantidade de ícones, abas abertas e brilho do monitor','Marca do computador, plano de fundo e volume do sistema'],
  'Qual assunto é mais claro?':['Relatório de horários — 1ª quinzena — conferência','Documento administrativo atualizado para conhecimento','Informações importantes sobre o período solicitado','Mensagem referente ao arquivo preparado pelo setor'],
  'Qual ordem é mais segura ao terminar?':['Salvar, fechar arquivos, sair das contas e organizar o equipamento','Fechar a tela, manter as contas abertas e guardar o notebook','Compartilhar a senha, encerrar o navegador e desligar o monitor','Apagar os arquivos locais, remover perfis e reiniciar o sistema'],
  'Qual conjunto representa uma evidência completa?':['Arquivo, data, ações, duração e identificação do estudante','Captura isolada, sem data, contexto ou atividade identificada','Senha do perfil, código temporário e histórico do navegador','Nome da aula, cor do tema e quantidade total de cliques'],
  'Após gerar o PDF da plataforma, qual é a próxima ação?':['Anexar o arquivo na atividade indicada no Classroom','Apagar o comprovante e fechar a plataforma imediatamente','Encaminhar a senha do perfil ao professor pela atividade','Reiniciar a avaliação para criar um segundo resultado'],
  'Por que a recuperação utiliza um caso diferente?':['Para avaliar as mesmas competências em outra situação','Para repetir as mesmas perguntas em ordem diferente','Para substituir todos os registros da avaliação anterior','Para reduzir a atividade a respostas de múltipla escolha'],
  'Qual sequência é mais adequada?':['Organizar, calcular, revisar, gerar o documento e comunicar','Enviar o documento, criar os dados e revisar posteriormente','Excluir a base, escolher valores e compartilhar sem conferir','Liberar edição pública, alterar o título e encerrar a conta'],
  'Ao terminar em notebook compartilhado, o que fazer?':['Sair das contas, bloquear o perfil e organizar o equipamento','Fechar a tampa, manter as sessões abertas e deixar os arquivos','Salvar as senhas no navegador e entregar o dispositivo ligado','Apagar todos os perfis locais e remover os dados dos colegas'],
  'Quando ordenar do maior para o menor é útil?':['Ao priorizar valores ou volumes de maior impacto','Ao substituir fórmulas por números digitados manualmente','Ao ocultar registros que ainda precisam ser conferidos','Ao alterar permissões de acesso de todos os colaboradores'],
  'A média de horas caiu e aumentaram registros incompletos. Qual ação é adequada?':['Auditar os registros e investigar causas antes de corrigir','Aprovar os pagamentos e revisar os horários no mês seguinte','Excluir as linhas incompletas sem consultar os responsáveis','Alterar a média manualmente para manter o indicador esperado'],
  'Qual combinação cria um painel de pendências?':['SE classifica, CONT.SE conta e SOMASE totaliza valores','SOMA classifica, MÉDIA conta e MÍNIMO envia alertas','Negrito calcula, filtro soma e gráfico altera os registros','PDF classifica, e-mail conta e compartilhamento cria fórmulas'],
  'Um documento contém dados pessoais e financeiros. Qual compartilhamento é adequado?':['Acesso nominal com a menor permissão necessária','Link público de edição para facilitar o trabalho do setor','Senha da conta enviada junto ao arquivo para os revisores','Publicação do documento na web para evitar bloqueios'],
  'Qual ordem reduz retrabalho?':['Produzir, revisar, exportar, compartilhar, comunicar e registrar','Enviar, solicitar revisão, produzir e escolher o anexo depois','Publicar, excluir, recriar, compartilhar e corrigir no final','Compartilhar a senha, exportar, escrever e revisar após o envio'],
  'Qual evidência deve ser preservada?':['Documento, versão, destinatários, data e confirmação','Captura de tela sem período, responsável ou contexto do envio','Senha usada no acesso e código temporário da autenticação','Lista de abas abertas e histórico completo de navegação'],
  'Qual decisão inicial é mais adequada para valores críticos elevados?':['Revisar maiores valores, responsáveis, causas e prazos','Alterar os valores manualmente para reduzir o indicador','Excluir os registros críticos antes da reunião gerencial','Compartilhar a base publicamente para obter sugestões'],
  'Qual evidência representa o processo completo?':['Base analisada, fórmulas, relatório, envio e registro das ações','Uma resposta objetiva sem dados, arquivo ou histórico da sessão','Senha do perfil, código do segundo fator e endereço do navegador','Somente o tempo total e a quantidade de cliques realizados'],
  'O relatório foi gerado pela plataforma. O que fazer?':['Anexar o PDF na atividade correspondente do Classroom','Excluir o arquivo e encerrar a sessão antes de conferir','Enviar a senha do perfil no campo de comentário privado','Reiniciar a avaliação e substituir o primeiro comprovante'],
  'Qual sequência produz um plano de ação confiável?':['Filtrar, calcular, interpretar, documentar, comunicar e registrar','Enviar, filtrar, excluir, recalcular, publicar e corrigir depois','Alterar valores, remover pendências e compartilhar as senhas','Criar gráficos, ocultar erros e encerrar sem registrar decisões'],
  'Um gestor antigo ainda possui acesso. Qual ação tomar?':['Remover o acesso e revisar os arquivos compartilhados','Manter o acesso até que alguém solicite formalmente a retirada','Enviar uma senha nova para preservar o vínculo com os arquivos','Publicar os documentos para evitar qualquer problema de acesso']
};
for(const lesson of LESSONS){
  for(const stage of lesson.stages||[]){
    for(const question of stage.questions||stage.tasks||[]){
      const key=question.q||question.prompt;
      if(CURRICULUM_V228_OPTION_REVISIONS[key]){question.options=[...CURRICULUM_V228_OPTION_REVISIONS[key]];question.answer=0;}
    }
  }
}

// v2.2.9 — ambientes especializados e reformulação integral do 2º ADM.
// Somente 1ADM-01 e 1ADM-02 permanecem com identidade curricular congelada.
const CURRICULUM_V229 = [
  {
    id:'1ADM-03',classId:'1ADM',order:3,duration:45,kind:'content',curriculumRevision:'2026T2-admin-v229',keepLegacyReinforcement:false,
    title:'Cálculos administrativos básicos',subtitle:'Transforme dados de compras, estoque e despesas em resultados confiáveis.',
    icon:'🧮',badge:'Assistente de Cálculos',estimated:'15–25 min',application:'Financeiro, compras, estoque e controle de materiais',evidence:'Planilha administrativa com fórmulas e conferência',
    objectives:['Usar referências de células','Aplicar as quatro operações','Conferir totais e saldos','Interpretar o resultado antes de comunicar'],
    stages:[
      explain('O cálculo como apoio à decisão','Uma fórmula bem montada evita repetir contas e atualiza o resultado quando os dados mudam.','Em uma rotina administrativa, cálculos aparecem em pedidos, controle de materiais, despesas, divisão de valores e conferência de saldos. A planilha deve usar referências de células para manter rastreabilidade.','Quantidade em B2 e valor unitário em C2 geram o total com =B2*C2.','Antes de montar a fórmula, diga em palavras qual operação responde ao problema.'),
      demo('Do dado ao resultado','Observe um fluxo curto de cálculo administrativo.',[
        'Identificar os dados disponíveis.','Selecionar a célula do resultado.','Iniciar com = e usar referências.','Conferir unidade, sinal e valor.','Registrar o resultado no relatório.'
      ]),
      officeLab('Estação financeira: preparar a base','Organize a tabela antes dos cálculos.',[
        {id:'freeze',prompt:'Congele o cabeçalho do controle de compras.',action:'freeze-header',why:'O cabeçalho permanece visível durante a conferência.'},
        {id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordem decrescente evidencia os maiores impactos.'},
        {id:'share',prompt:'Compartilhe a base com a supervisão como Comentador.',action:'share-commenter',why:'A supervisão pode registrar observações sem alterar os dados.'}
      ],{scenario:'Controle simulado de compras administrativas',columns:['Item','Setor','Valor','Situação'],rows:[['Papel A4','Secretaria','680','Pendente'],['Cartuchos','Financeiro','1240','OK'],['Pastas','RH','420','Pendente'],['Etiquetas','Compras','350','OK']]}),
      formula('Cálculos do setor administrativo','Monte as fórmulas solicitadas.',[
        {prompt:'Somar despesas previstas em B2 e C2',tokens:['=','B2','+','C2'],answer:'=B2+C2',why:'A adição reúne os valores previstos.'},
        {prompt:'Calcular orçamento D2 menos gasto E2',tokens:['=','D2','-','E2'],answer:'=D2-E2',why:'A subtração mostra o saldo.'},
        {prompt:'Calcular quantidade B3 vezes valor unitário C3',tokens:['=','B3','*','C3'],answer:'=B3*C3',why:'Quantidade vezes preço gera o total.'},
        {prompt:'Dividir o valor D4 em quatro parcelas',tokens:['=','D4','/','4'],answer:'=D4/4',why:'A divisão reparte o valor igualmente.'}
      ]),
      quiz('Conferência dos cálculos',[
        {q:'Por que usar B2*C2 em vez de digitar novamente os valores?',options:['A fórmula acompanha mudanças nos dados','A fórmula remove a necessidade de conferência','O resultado fica protegido por senha','A planilha deixa de usar células'],answer:0,why:'Referências mantêm o cálculo ligado aos dados.'},
        {q:'Um saldo ficou negativo. Qual atitude é adequada?',options:['Conferir dados e fórmula antes de comunicar','Apagar o resultado sem registro','Trocar o sinal até ficar positivo','Publicar a planilha para qualquer pessoa'],answer:0,why:'Divergências devem ser verificadas antes de decisões.'},
        {q:'Qual operador representa multiplicação em uma planilha?',options:['*','x',':', '#'],answer:0,why:'O asterisco é o operador de multiplicação.'},
        {q:'Qual evidência ajuda a conferir o cálculo?',options:['Dados de origem, fórmula e resultado','Somente a cor da célula','A senha do perfil','Uma captura sem identificação'],answer:0,why:'A rastreabilidade depende do conjunto completo.'}
      ]),
      challenge('Missão final: fechamento de compras','Resolva o fluxo sem repetir contas manualmente.',[
        {q:'Qual sequência reduz erros?',options:['Organizar dados, calcular, conferir e registrar','Comunicar primeiro e calcular depois','Apagar valores altos e gerar o PDF','Compartilhar a senha para revisão'],answer:0,why:'O fluxo correto separa preparação, cálculo e conferência.'},
        {q:'O total mudou depois de alterar a quantidade. Isso indica que:',options:['A fórmula está vinculada às células','O arquivo foi convertido em imagem','A permissão virou pública','O cabeçalho foi descongelado'],answer:0,why:'Referências atualizam o resultado automaticamente.'}
      ],'Assistente de Cálculos')
    ]
  },
  {
    id:'1ADM-04',classId:'1ADM',order:4,duration:45,kind:'content',curriculumRevision:'2026T2-admin-v229',keepLegacyReinforcement:false,
    title:'RH básico, jornada e demonstrativo de pagamento',subtitle:'Organize horários e confira um demonstrativo educacional sem expor dados reais.',
    icon:'👥',badge:'Assistente de RH',estimated:'15–25 min',application:'Gestão de pessoas, ponto, jornada e conferência de pagamentos',evidence:'Simulação de jornada e demonstrativo simplificado',
    objectives:['Interpretar entrada, saída e intervalo','Calcular horas adicionais e ausências','Conferir um demonstrativo simplificado','Proteger dados pessoais'],
    stages:[
      explain('Por que o RH precisa de registros claros?','Jornada e pagamento dependem de informações consistentes, conferidas e protegidas.','Horários incompletos, valores digitados incorretamente e acessos excessivos podem gerar retrabalho e decisões erradas. Esta aula usa dados totalmente fictícios e um cálculo simplificado, sem validade trabalhista ou contábil.','Uma divergência entre entrada, saída e intervalo deve ser conferida antes de qualquer ajuste.','Nunca use dados reais de colegas nesta simulação.'),
      demo('Fluxo de conferência do RH','Acompanhe o processo antes de calcular.',[
        'Conferir os registros de jornada.','Identificar divergências ou campos incompletos.','Informar horas adicionais e ausências.','Calcular o demonstrativo simplificado.','Revisar o resultado e registrar a evidência.'
      ]),
      hrLab('Estação de RH: jornada e pagamento','Confira a jornada e calcule um demonstrativo educacional.',{
        employee:'Marina Lopes',role:'Assistente administrativa',baseSalary:2200,monthlyHours:220,overtimeHours:6,absenceHours:2,overtimeMultiplier:1.5,otherDeduction:80,anomalyIndex:2,
        schedule:[['Segunda','08:00','17:00','60 min','8h'],['Terça','08:05','17:05','60 min','8h'],['Quarta','08:00','18:00','30 min','9h30 — revisar'],['Quinta','08:00','17:00','60 min','8h']],
        note:'Valores e nomes fictícios para aprendizagem.'
      }),
      formula('Fórmulas básicas do controle de RH','Monte fórmulas de apoio.',[
        {prompt:'Calcular saída C2 menos entrada B2',tokens:['=','C2','-','B2'],answer:'=C2-B2',why:'A diferença entre horários gera a duração bruta.'},
        {prompt:'Calcular salário B2 mais adicional C2 menos desconto D2',tokens:['=','B2','+','C2','-','D2'],answer:'=B2+C2-D2',why:'O demonstrativo reúne proventos e descontos simulados.'}
      ]),
      quiz('Decisões responsáveis no RH',[
        {q:'Uma jornada apresenta intervalo diferente do previsto. O que fazer?',options:['Conferir o registro e a justificativa antes de ajustar','Alterar o horário para coincidir com a escala','Excluir a linha para não afetar a média','Compartilhar a folha em um grupo aberto'],answer:0,why:'Ajustes precisam de conferência e justificativa.'},
        {q:'Quem deve acessar dados de pagamento?',options:['Somente pessoas autorizadas pela rotina do setor','Todos os colegas da turma','Qualquer pessoa com o link','Fornecedores externos'],answer:0,why:'Dados pessoais e financeiros exigem acesso mínimo.'},
        {q:'O demonstrativo da aula possui validade trabalhista?',options:['Não, é uma simulação educacional simplificada','Sim, substitui o documento oficial','Sim, se for exportado em PDF','Depende da cor do relatório'],answer:0,why:'O laboratório é didático e usa regras fictícias.'},
        {q:'Qual evidência é adequada no RH?',options:['Jornada, valores simulados, cálculo e ações realizadas','Senha da conta e código temporário','Lista de dados reais dos colegas','Somente o valor final sem origem'],answer:0,why:'A evidência deve permitir conferência sem expor credenciais.'}
      ]),
      challenge('Missão final: conferir antes de aprovar','Finalize a rotina com responsabilidade.',[
        {q:'Um valor líquido não corresponde ao cálculo. Qual primeira ação?',options:['Revisar base, horas e descontos simulados','Aprovar e corrigir no próximo mês','Apagar o histórico','Alterar manualmente o resultado'],answer:0,why:'A conferência vem antes da aprovação.'},
        {q:'Qual prática melhora a gestão de pessoas?',options:['Registrar claramente e revisar divergências','Usar campos livres sem padrão','Compartilhar senhas entre a equipe','Excluir históricos sem justificativa'],answer:0,why:'Padronização e rastreabilidade reduzem erros.'}
      ],'Assistente de RH')
    ]
  },
  {
    id:'1ADM-05',classId:'1ADM',order:5,duration:45,kind:'content',curriculumRevision:'2026T2-mail-v242',keepLegacyReinforcement:false,
    title:'Documentos administrativos, PDF e comunicação profissional',subtitle:'Produza, revise, exporte e encaminhe um documento com clareza.',
    icon:'📄',badge:'Organizador de Documentos',estimated:'15–25 min',application:'Secretaria, RH, financeiro, atendimento e gestão documental',evidence:'Documento simulado exportado e e-mail profissional registrado',
    objectives:['Estruturar um documento','Aplicar formatação com propósito','Definir permissão de acesso','Exportar em PDF e enviar com anexo'],
    stages:[
      explain('Por que documentos precisam de padrão?','Um documento administrativo deve ser legível, identificável e fácil de revisar.','Título, data, assunto, responsáveis e versão ajudam a evitar arquivos duplicados ou enviados ao setor errado. O PDF preserva a apresentação final, enquanto a versão editável permite revisão e atualização.','Um memorando pode ser editado no documento colaborativo e exportado em PDF para distribuição.','Use nomes de arquivo com assunto, período e versão.'),
      demo('Produzir, revisar e distribuir','Observe o fluxo documental.',[
        'Criar o documento com título e contexto.','Organizar informações em parágrafos e listas.','Revisar ortografia, datas e responsáveis.','Definir quem pode editar, comentar ou ler.','Exportar o PDF e anexar na comunicação.'
      ]),
      documentLab('Central de documentos: relatório de materiais','Formate e exporte o documento simulado.',[
        {id:'title',prompt:'Aplique o estilo de título ao nome do relatório.',action:'title-style',why:'O título cria hierarquia e identifica o documento.'},
        {id:'date',prompt:'Insira a data do relatório.',action:'add-date',why:'A data situa a versão no tempo.'},
        {id:'list',prompt:'Transforme as pendências em uma lista.',action:'insert-list',why:'Listas tornam ações e itens mais fáceis de acompanhar.'},
        {id:'signature',prompt:'Adicione a identificação do setor responsável.',action:'add-signature',why:'O responsável aumenta a rastreabilidade.'},
        {id:'permission',prompt:'Compartilhe para revisão como Comentador.',action:'permission-commenter',why:'Comentador permite revisar sem alterar diretamente.'},
        {id:'pdf',prompt:'Exporte a versão final em PDF.',action:'export-pdf',why:'O PDF preserva o layout de entrega.'}
      ],{documentTitle:'Relatório de materiais administrativos',department:'Secretaria — AGV',date:'Agosto de 2026',intro:'Este relatório apresenta o acompanhamento simulado de materiais do setor administrativo.',bullets:['Conferir itens pendentes','Atualizar responsáveis','Registrar prazo de reposição'],signature:'Secretaria Administrativa',permission:'commenter',filename:'relatorio-materiais-agv-agosto.pdf'}),
      emailLab('Correio administrativo: encaminhar o PDF','Envie o documento no correio simulado.',{
        scenario:'A Secretaria solicitou o relatório simulado de materiais administrativos.',recipient:'secretaria.agv@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',subjectKeywords:['relatório','materiais','agosto'],bodyKeywords:['olá','anexo','relatório','análise'],attachment:'relatorio-materiais-agv-agosto.pdf',hint:'Explique o documento, o período e a ação esperada.'
      }),
      quiz('Gestão de documentos',[
        {q:'Quando manter a versão editável?',options:['Quando o documento ainda poderá ser revisado','Quando ninguém poderá alterar o conteúdo','Somente depois de apagar o PDF','Quando o arquivo não tiver título'],answer:0,why:'A versão editável apoia revisão e atualização.'},
        {q:'Qual permissão permite observações sem edição direta?',options:['Comentador','Leitor','Proprietário','Público'],answer:0,why:'Comentador registra sugestões sem alterar o texto.'},
        {q:'Qual nome de arquivo é mais claro?',options:['relatorio-materiais-agv-agosto-v1.pdf','final.pdf','documento-novo.pdf','arquivo.pdf'],answer:0,why:'Assunto, contexto e período facilitam localização.'},
        {q:'Antes de enviar o anexo, o que conferir?',options:['Destinatários, assunto, texto e arquivo','Somente o tamanho da janela','A cor do tema','O volume do computador'],answer:0,why:'A revisão final evita envio incorreto.'}
      ]),
      challenge('Missão final: documento sem retrabalho','Finalize o fluxo documental.',[
        {q:'Qual sequência é adequada para o documento?',options:['Produzir, revisar, exportar, compartilhar e comunicar','Enviar, escrever e revisar depois','Publicar a senha junto do arquivo','Apagar a versão editável antes da revisão'],answer:0,why:'O fluxo ordenado reduz retrabalho.'},
        {q:'O PDF final da plataforma deve ser:',options:['Anexado à atividade indicada no Classroom','Apagado depois do download','Enviado junto com a senha do perfil','Usado para substituir todos os arquivos originais'],answer:0,why:'O comprovante registra a realização da atividade.'}
      ],'Organizador de Documentos')
    ]
  },
  {
    id:'1ADM-06',classId:'1ADM',order:6,duration:45,kind:'content',curriculumRevision:'2026T2-admin-v229',keepLegacyReinforcement:false,
    title:'Estação de trabalho, dispositivos e segurança de acesso',subtitle:'Explore um computador em 3D/360 e organize um posto administrativo seguro.',
    icon:'🖥',badge:'Técnico de Escritório',estimated:'15–25 min',application:'Montagem do posto de trabalho, suporte básico e proteção de contas',evidence:'Mapa de componentes, periféricos e decisões de segurança',
    objectives:['Diferenciar entrada, saída, processamento e armazenamento','Reconhecer CPU, RAM e SSD','Conectar periféricos adequadamente','Encerrar contas com segurança'],
    stages:[
      explain('O computador como ferramenta administrativa','Cada componente e periférico cumpre uma função no fluxo de informação.','Teclado e mouse enviam dados; monitor e impressora apresentam resultados; CPU processa; RAM mantém dados temporários; SSD armazena arquivos. Conhecer essas funções ajuda a escolher equipamentos, explicar falhas e organizar um posto de trabalho.','Um computador lento com muitos programas abertos pode precisar de mais memória RAM, mesmo que o SSD tenha espaço livre.','Observe o sintoma antes de concluir qual componente está envolvido.'),
      hardwareLab('Laboratório 3D/360: estação administrativa','Gire, explore e identifique os componentes da estação.',[
        {id:'rotate',prompt:'Gire a estação para observar diferentes ângulos.',action:'rotate-right',why:'A rotação permite analisar conexões e componentes em 360°.'},
        {id:'explode',prompt:'Ative a visualização explodida do gabinete.',action:'toggle-explode',why:'A visualização separa as peças internas.'},
        {id:'ram',prompt:'Selecione o componente que mantém dados temporários dos programas.',action:'select-ram',why:'A memória RAM trabalha com os programas em uso.'},
        {id:'ssd',prompt:'Selecione o componente de armazenamento permanente.',action:'select-ssd',why:'O SSD armazena sistema, programas e arquivos.'},
        {id:'keyboard',prompt:'Selecione o dispositivo de entrada usado para digitar.',action:'select-keyboard',why:'O teclado envia caracteres ao computador.'},
        {id:'monitor',prompt:'Selecione o dispositivo de saída visual.',action:'select-monitor',why:'O monitor apresenta imagens e textos.'},
        {id:'printer',prompt:'Conecte a impressora ao posto administrativo.',action:'connect-printer',why:'A conexão permite produzir saídas impressas quando necessárias.'}
      ],{scenario:'Posto administrativo do AGV',quality:'adaptive'}),
      twoFactorLab('Central de segurança: proteger a conta','Ative o segundo fator em uma conta simulada.',{account:'estudante.agv@simulacao.edu.br',preferredMethod:'authenticator',backupChoice:'offline',suspiciousChoice:'deny',context:'Conta simulada usada para documentos e atividades.'}),
      quiz('Hardware e uso responsável',[
        {q:'Qual componente é mais afetado por muitos programas abertos?',options:['Memória RAM','Monitor','Impressora','Mouse'],answer:0,why:'Programas simultâneos usam memória temporária.'},
        {q:'Qual dispositivo digitaliza um documento em papel?',options:['Scanner','Monitor','Caixa de som','Roteador'],answer:0,why:'O scanner transforma o papel em arquivo digital.'},
        {q:'Depois de usar um notebook compartilhado, o que fazer?',options:['Sair das contas e bloquear o perfil','Apenas fechar a tampa','Salvar a senha no navegador','Deixar o e-mail aberto'],answer:0,why:'A sessão deve ser encerrada para proteger o estudante.'},
        {q:'Um código de verificação chegou sem solicitação. Qual atitude?',options:['Não compartilhar e revisar a conta','Enviar ao suposto suporte','Publicar no grupo','Desativar as notificações'],answer:0,why:'O código pode indicar tentativa de acesso.'}
      ]),
      challenge('Missão final: posto pronto para o próximo usuário','Organize o encerramento.',[
        {q:'Qual ordem é mais segura?',options:['Salvar, fechar arquivos, sair das contas e organizar o equipamento','Fechar a tampa e manter as contas abertas','Compartilhar a senha e desligar o monitor','Apagar perfis de outros estudantes'],answer:0,why:'O encerramento protege dados e conserva o equipamento.'},
        {q:'Qual classificação está correta?',options:['Teclado: entrada; monitor: saída; SSD: armazenamento','Monitor: entrada; teclado: saída; SSD: processamento','RAM: impressão; mouse: armazenamento; CPU: saída','Impressora: entrada; scanner: saída; SSD: rede'],answer:0,why:'Cada dispositivo possui uma função definida no fluxo de informação.'}
      ],'Técnico de Escritório')
    ]
  },
  {
    id:'1ADM-07',classId:'1ADM',order:7,duration:45,kind:'assessment',curriculumRevision:'2026T2-admin-v242',keepLegacyReinforcement:false,
    title:'Avaliação prática integrada',subtitle:'Resolva um caso administrativo com cálculos, RH, documento e entrega.',
    icon:'🎯',badge:'Assistente Administrativo',estimated:'20–25 min',application:'Avaliação final do trimestre',evidence:'Caso administrativo integrado e comprovante final',
    objectives:['Aplicar planilha e cálculo','Conferir jornada simulada','Preparar documento e PDF','Tomar decisões responsáveis'],
    stages:[
      explain('Caso avaliativo: organização de um evento interno','Você apoiará a preparação administrativa de uma capacitação fictícia.','A atividade integra materiais, horários, custos e comunicação. Todos os dados são simulados. A avaliação registra cada ação, tentativa, dica e tempo ativo.','Será necessário organizar a base, calcular valores, conferir a jornada do apoio e preparar o documento final.','Leia cada missão e execute a ação no simulador correspondente.'),
      officeLab('Avaliação: organizar materiais','Prepare a base do evento.',[
        {id:'header',prompt:'Congele o cabeçalho da lista.',action:'freeze-header',why:'Mantém as colunas visíveis.'},
        {id:'pending',prompt:'Filtre os itens Pendentes.',action:'filter-pending',why:'Concentra a análise no que falta.'},
        {id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'Evidencia o maior impacto.'}
      ],{scenario:'Capacitação interna — materiais',columns:['Item','Responsável','Valor','Situação'],rows:[['Coffee break','Compras','1650','Pendente'],['Crachás','Secretaria','380','OK'],['Projetor','TI','800','Pendente'],['Certificados','RH','270','OK']]}),
      hrLab('Avaliação: apoio da equipe','Confira a jornada simulada.',{employee:'Rafael Costa',role:'Apoio administrativo',baseSalary:2000,monthlyHours:200,overtimeHours:4,absenceHours:1,overtimeMultiplier:1.5,otherDeduction:45,anomalyIndex:1,schedule:[['Segunda','08:00','17:00','60 min','8h'],['Terça','08:00','18:30','30 min','10h — revisar'],['Quarta','08:00','17:00','60 min','8h']],note:'Avaliação com dados fictícios.'}),
      documentLab('Avaliação: preparar comunicado','Produza o documento final.',[
        {id:'title',prompt:'Aplique o estilo de título.',action:'title-style',why:'Identifica o comunicado.'},
        {id:'list',prompt:'Organize as orientações em lista.',action:'insert-list',why:'Facilita a leitura.'},
        {id:'sign',prompt:'Adicione o setor responsável.',action:'add-signature',why:'Registra autoria.'},
        {id:'perm',prompt:'Compartilhe com a direção como Leitor.',action:'permission-reader',why:'A direção precisa consultar a versão final.'},
        {id:'pdf',prompt:'Exporte o comunicado em PDF.',action:'export-pdf',why:'O PDF preserva a apresentação.'}
      ],{documentTitle:'Comunicado de capacitação interna',department:'Administração — AGV',date:'Agosto de 2026',intro:'Orientações simuladas para participantes da capacitação.',bullets:['Conferir horário','Levar identificação','Registrar presença'],signature:'Setor Administrativo',permission:'reader',filename:'comunicado-capacitacao-agv.pdf'}),
      challenge('Fechamento da avaliação','Confirme as decisões finais.',[
        {q:'Qual evidência representa o processo completo?',options:['Base, cálculos, jornada, documento e ações registradas','Somente uma alternativa marcada','Senha do estudante','Uma captura sem data'],answer:0,why:'A avaliação integra prática e rastreabilidade.'},
        {q:'Depois de gerar o comprovante final, o estudante deve:',options:['Anexar o PDF na atividade correta do Classroom','Apagar o arquivo e reiniciar','Enviar a senha do perfil','Compartilhar o código de autenticação'],answer:0,why:'O PDF é a evidência para entrega.'}
      ],'Assistente Administrativo')
    ]
  },
  {
    id:'1ADM-08',classId:'1ADM',order:8,duration:45,kind:'recovery',curriculumRevision:'2026T2-admin-v242',keepLegacyReinforcement:false,
    title:'Recuperação prática — reestruturação de um setor',subtitle:'Demonstre aprendizagem em um caso diferente da avaliação.',
    icon:'🧭',badge:'Assistente em Evolução',estimated:'20–25 min',application:'Recuperação diferenciada do trimestre',evidence:'Plano de reorganização com ações práticas',
    objectives:['Reorganizar um posto de trabalho','Corrigir controles administrativos','Produzir um documento alternativo','Comunicar o plano de ação'],
    stages:[
      explain('Caso de recuperação: setor em reorganização','A recuperação usa outro cenário e outra sequência de ações.','Um setor fictício apresenta equipamento mal conectado, base de dados desorganizada e documentos sem identificação. Você deverá diagnosticar, corrigir e comunicar o plano de ação.','A atividade avalia as mesmas competências sem repetir a avaliação.','Use o tutorial quando precisar de orientação, mas execute as ações.'),
      hardwareLab('Recuperação: revisar a estação','Identifique recursos necessários.',[
        {id:'rotate',prompt:'Gire a estação para conferir as conexões.',action:'rotate-left',why:'A traseira revela portas e cabos.'},
        {id:'ssd',prompt:'Localize o armazenamento do equipamento.',action:'select-ssd',why:'O SSD mantém arquivos e programas.'},
        {id:'mouse',prompt:'Selecione o dispositivo de entrada usado para apontar.',action:'select-mouse',why:'O mouse controla o ponteiro.'},
        {id:'printer',prompt:'Conecte a impressora do setor.',action:'connect-printer',why:'O periférico precisa estar conectado para impressão.'}
      ],{scenario:'Setor administrativo em reorganização'}),
      officeLab('Recuperação: corrigir a base','Organize o controle alternativo.',[
        {id:'filter',prompt:'Filtre os registros Atrasados.',action:'filter-delayed',why:'O filtro identifica as pendências.'},
        {id:'alert',prompt:'Aplique destaque de alerta.',action:'fill-alert',why:'O destaque sinaliza prioridade.'},
        {id:'share',prompt:'Compartilhe o resumo como Leitor.',action:'share-reader',why:'A consulta não exige edição.'}
      ],{scenario:'Plano de regularização',columns:['Documento','Setor','Valor','Situação'],rows:[['Cadastro','RH','900','Atrasado'],['Contrato','Compras','2800','Regular'],['Nota','Financeiro','1750','Atrasado'],['Inventário','Patrimônio','620','Regular']]}),
      documentLab('Recuperação: registrar o plano','Produza um documento alternativo.',[
        {id:'title',prompt:'Aplique o título ao plano.',action:'title-style',why:'Identifica o documento.'},
        {id:'date',prompt:'Insira a data.',action:'add-date',why:'Registra quando o plano foi preparado.'},
        {id:'list',prompt:'Organize as ações em lista.',action:'insert-list',why:'Facilita o acompanhamento.'},
        {id:'pdf',prompt:'Exporte o plano em PDF.',action:'export-pdf',why:'Cria a versão final.'}
      ],{documentTitle:'Plano de reorganização administrativa',department:'Apoio Administrativo — AGV',date:'Agosto de 2026',intro:'Plano fictício para corrigir pendências do setor.',bullets:['Revisar acessos','Atualizar documentos','Conferir equipamentos'],signature:'Equipe Administrativa',permission:'reader',filename:'plano-reorganizacao-administrativa.pdf'}),
      emailLab('Recuperação: comunicar o plano','Encaminhe o plano simulado.',{scenario:'A supervisão solicitou o plano de reorganização.',recipient:'supervisao.agv@simulacao.edu.br',subjectKeywords:['plano','reorganização'],bodyKeywords:['olá','anexo','plano','acompanhamento'],attachment:'plano-reorganizacao-administrativa.pdf',hint:'Informe o anexo e solicite acompanhamento.'}),
      challenge('Conclusão da recuperação','Finalize o caso alternativo.',[
        {q:'Por que o cenário é diferente da avaliação?',options:['Para demonstrar as mesmas competências em nova situação','Para eliminar a necessidade de prática','Para repetir respostas em outra ordem','Para substituir os registros anteriores'],answer:0,why:'A recuperação oferece nova oportunidade de aprendizagem.'},
        {q:'Qual sequência cria um plano confiável?',options:['Diagnosticar, corrigir, documentar, comunicar e registrar','Comunicar antes de analisar','Apagar os registros e reiniciar','Compartilhar credenciais entre setores'],answer:0,why:'A sequência mantém rastreabilidade.'}
      ],'Assistente em Evolução')
    ]
  },
  {
    id:'2ADM-01',classId:'2ADM',order:1,duration:45,kind:'content',curriculumRevision:'2026T2-admin2-v229',keepLegacyReinforcement:false,
    title:'Estação administrativa digital e arquitetura do computador',subtitle:'Comece a trilha do 2º ADM explorando hardware, periféricos, arquivos e produtividade.',
    icon:'🧩',badge:'Analista de Estação Digital',estimated:'18–25 min',application:'Infraestrutura do escritório, suporte e escolha de equipamentos',evidence:'Diagnóstico da estação e plano de organização digital',
    objectives:['Analisar componentes e periféricos','Relacionar hardware à produtividade','Organizar arquivos e recursos','Resolver problemas básicos do posto de trabalho'],
    stages:[
      explain('Por que um administrador precisa entender tecnologia?','Gestores não precisam montar computadores profissionalmente, mas devem compreender recursos, limitações e riscos.','RAM, armazenamento, processador, rede e periféricos afetam produtividade, custo e continuidade do trabalho. Uma decisão de compra precisa considerar a atividade do setor, o volume de arquivos e os sistemas utilizados.','Um setor que abre várias planilhas e videoconferências pode precisar de mais RAM, enquanto arquivos grandes exigem armazenamento adequado.','Relacione o sintoma ao recurso antes de sugerir uma compra.'),
      hardwareLab('Laboratório 3D/360 avançado','Explore a estação e diagnostique os recursos.',[
        {id:'rotate',prompt:'Gire o equipamento para analisar portas e ventilação.',action:'rotate-right',why:'A análise em 360° mostra conexões e fluxo de ar.'},
        {id:'explode',prompt:'Abra a visualização explodida.',action:'toggle-explode',why:'Os componentes internos ficam separados.'},
        {id:'cpu',prompt:'Selecione o componente responsável pelo processamento principal.',action:'select-cpu',why:'A CPU executa instruções e cálculos.'},
        {id:'ram',prompt:'Selecione o recurso mais relacionado a muitos programas simultâneos.',action:'select-ram',why:'A RAM mantém dados temporários em uso.'},
        {id:'ssd',prompt:'Selecione o recurso de armazenamento rápido.',action:'select-ssd',why:'O SSD reduz tempo de inicialização e abertura de arquivos.'},
        {id:'scanner',prompt:'Selecione o periférico usado para digitalizar documentos.',action:'select-scanner',why:'O scanner transforma documentos físicos em arquivos.'}
      ],{scenario:'Estação de gestão do 2º ADM',quality:'high'}),
      officeLab('Mapa de ativos do escritório','Organize o inventário de equipamentos.',[
        {id:'freeze',prompt:'Congele o cabeçalho do inventário.',action:'freeze-header',why:'Mantém os campos visíveis.'},
        {id:'filter',prompt:'Filtre equipamentos com situação Crítica.',action:'filter-critical',why:'Prioriza manutenção e substituição.'},
        {id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'Apoia a análise do investimento.'},
        {id:'chart',prompt:'Crie um gráfico de colunas.',action:'chart-column',why:'Compara os custos estimados.'}
      ],{scenario:'Inventário tecnológico fictício',columns:['Equipamento','Setor','Valor','Situação'],rows:[['Notebook 01','Financeiro','4200','Crítica'],['Scanner','Secretaria','1300','Normal'],['Desktop RH','RH','3600','Crítica'],['Projetor','Treinamento','2800','Normal']]}),
      quiz('Decisões de infraestrutura',[
        {q:'Um setor usa muitos sistemas simultâneos e o computador trava. Qual recurso investigar?',options:['Memória RAM e uso dos programas','Tamanho da impressora','Cor do monitor','Nome da pasta de documentos'],answer:0,why:'Carga simultânea depende especialmente da memória.'},
        {q:'Qual prática melhora a continuidade do trabalho?',options:['Padronizar pastas, backups e acessos','Salvar tudo na área de trabalho','Compartilhar uma senha entre o setor','Desativar atualizações permanentemente'],answer:0,why:'Organização e proteção reduzem perda de dados.'},
        {q:'Qual equipamento converte papel em arquivo?',options:['Scanner','Projetor','Roteador','Caixa de som'],answer:0,why:'O scanner digitaliza documentos.'},
        {q:'Antes de comprar um equipamento, o gestor deve:',options:['Relacionar necessidade, desempenho, custo e suporte','Escolher somente pela aparência','Ignorar os sistemas utilizados','Comprar sem registrar o patrimônio'],answer:0,why:'A decisão deve considerar o uso real.'}
      ]),
      challenge('Missão final: recomendação de estação','Conclua o diagnóstico.',[
        {q:'Qual recomendação é mais responsável?',options:['Justificar a necessidade com sintomas, uso e impacto','Solicitar o equipamento mais caro sem análise','Apagar os registros de desempenho','Compartilhar dados pessoais dos usuários'],answer:0,why:'A recomendação precisa de evidência.'},
        {q:'Qual evidência deve acompanhar o inventário?',options:['Equipamento, setor, situação, valor e ação recomendada','Senha do usuário responsável','Código temporário da conta','Somente uma foto sem identificação'],answer:0,why:'O registro deve permitir acompanhamento.'}
      ],'Analista de Estação Digital')
    ]
  },
  {
    id:'2ADM-02',classId:'2ADM',order:2,duration:45,kind:'content',curriculumRevision:'2026T2-admin2-v229',keepLegacyReinforcement:false,
    title:'RH, gestão de pessoas e análise financeira aplicada',subtitle:'Integre jornada, demonstrativo simplificado, funções e indicadores de gestão.',
    icon:'📊',badge:'Analista de Pessoas',estimated:'18–25 min',application:'RH, departamento pessoal, orçamento e indicadores',evidence:'Análise simulada de jornada, pagamento e painel de indicadores',
    objectives:['Auditar registros de jornada','Calcular valores simulados','Aplicar funções condicionais','Interpretar indicadores sem expor dados'],
    stages:[
      explain('Da folha ao indicador gerencial','O dado individual precisa ser conferido antes de virar um indicador.','A gestão de pessoas utiliza registros de jornada, ausências, adicionais, custos e situações. Nesta simulação, os cálculos são didáticos e não representam regras oficiais. O foco é compreender o fluxo de dados e a responsabilidade no acesso.','Uma divergência de jornada pode alterar o demonstrativo e também o indicador mensal do setor.','Separe conferência operacional de decisão gerencial.'),
      hrLab('Estação avançada de RH','Audite um demonstrativo fictício.',{employee:'Camila Ferreira',role:'Analista administrativa',baseSalary:3200,monthlyHours:200,overtimeHours:8,absenceHours:3,overtimeMultiplier:1.5,otherDeduction:144,anomalyIndex:1,schedule:[['Segunda','08:00','17:00','60 min','8h'],['Terça','07:45','19:00','45 min','10h30 — revisar'],['Quarta','08:00','17:00','60 min','8h'],['Quinta','08:00','17:30','60 min','8h30']],note:'Cálculo educacional sem validade legal.'}),
      formula('Funções para gestão de pessoas','Monte indicadores da base.',[
        {prompt:'Contar FALTA em D2:D40',tokens:['=','CONT.SE','(','D2:D40',';','"FALTA"',')'],answer:'=CONT.SE(D2:D40;"FALTA")',why:'CONT.SE conta ocorrências do critério.'},
        {prompt:'Somar E2:E40 quando D2:D40 for EXTRA',tokens:['=','SOMASE','(','D2:D40',';','"EXTRA"',';','E2:E40',')'],answer:'=SOMASE(D2:D40;"EXTRA";E2:E40)',why:'SOMASE totaliza valores vinculados ao critério.'},
        {prompt:'Classificar F2 acima de 8 como REVISAR',tokens:['=','SE','(','F2','>','8',';','"REVISAR"',';','"OK"',')'],answer:'=SE(F2>8;"REVISAR";"OK")',why:'SE transforma a regra em classificação.'}
      ]),
      officeLab('Painel de gestão de pessoas','Prepare indicadores para análise.',[
        {id:'filter',prompt:'Filtre registros de prioridade Crítica.',action:'filter-critical',why:'Concentra a análise.'},
        {id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'Evidencia impacto financeiro.'},
        {id:'chart',prompt:'Crie um gráfico de colunas.',action:'chart-column',why:'Compara indicadores.'},
        {id:'share',prompt:'Compartilhe com a gestão como Comentador.',action:'share-commenter',why:'Permite observações sem alterar a base.'}
      ],{scenario:'Indicadores fictícios de pessoas',columns:['Indicador','Setor','Valor','Prioridade'],rows:[['Horas extras','Operações','28','Crítica'],['Ausências','Atendimento','6','Normal'],['Vagas abertas','RH','4','Crítica'],['Treinamentos','Administrativo','12','Normal']]}),
      quiz('Análise de pessoas e valores',[
        {q:'Uma média caiu por causa de registros incompletos. O que fazer?',options:['Auditar a base antes de interpretar o indicador','Alterar a média manualmente','Excluir as linhas sem análise','Publicar o relatório completo'],answer:0,why:'Indicadores dependem de dados confiáveis.'},
        {q:'Qual função conta uma situação específica?',options:['CONT.SE','SOMASE','MÁXIMO','CONCATENAR'],answer:0,why:'CONT.SE conta registros por critério.'},
        {q:'Qual princípio deve orientar o compartilhamento?',options:['Menor acesso necessário','Edição pública por padrão','Senha compartilhada pelo setor','Documento sem responsável'],answer:0,why:'O menor privilégio protege dados.'},
        {q:'O demonstrativo do laboratório é:',options:['Uma simulação para aprendizagem','Um documento oficial de pagamento','Uma declaração trabalhista','Uma autorização bancária'],answer:0,why:'Os valores são fictícios e didáticos.'}
      ]),
      challenge('Missão final: decisão gerencial responsável','Conclua a análise.',[
        {q:'Qual sequência é adequada?',options:['Conferir dados, calcular, interpretar e comunicar','Comunicar antes de conferir','Excluir divergências e aprovar','Compartilhar a conta do setor'],answer:0,why:'A decisão depende de dados verificados.'},
        {q:'Qual evidência deve ser preservada?',options:['Fonte, fórmula, resultado, responsáveis e data','Código de autenticação','Senha do perfil','Somente o gráfico sem contexto'],answer:0,why:'A evidência sustenta a interpretação.'}
      ],'Analista de Pessoas')
    ]
  },
  {
    id:'2ADM-03',classId:'2ADM',order:3,duration:45,kind:'content',curriculumRevision:'2026T2-admin2-mail-v242',keepLegacyReinforcement:false,
    title:'Documentos, PDF, colaboração e comunicação gerencial',subtitle:'Crie um documento profissional, controle permissões e comunique decisões com segurança.',
    icon:'🗂',badge:'Gestor de Informação',estimated:'18–25 min',application:'Gestão documental, comunicação entre setores e produtividade',evidence:'Documento gerencial, PDF, envio e configuração de acesso',
    objectives:['Padronizar documentos','Gerenciar versões e permissões','Preparar comunicação profissional','Proteger contas e dados'],
    stages:[
      explain('O documento como parte de um processo','Um arquivo não termina quando o texto é escrito: ele precisa ser revisado, versionado, compartilhado e comunicado.','Em uma organização, um relatório pode passar por edição, comentário, aprovação e distribuição. Permissões inadequadas, anexos incorretos e versões sem identificação causam retrabalho e risco.','A equipe prepara a versão editável, a supervisão comenta e a direção recebe o PDF aprovado.','Defina o papel de cada pessoa antes de compartilhar.'),
      documentLab('Documento gerencial colaborativo','Prepare a versão para análise.',[
        {id:'title',prompt:'Aplique o título do relatório.',action:'title-style',why:'Cria hierarquia documental.'},
        {id:'date',prompt:'Insira a data e versão.',action:'add-date',why:'Identifica o período e a revisão.'},
        {id:'list',prompt:'Organize recomendações em lista.',action:'insert-list',why:'Facilita o acompanhamento.'},
        {id:'bold',prompt:'Destaque o prazo principal em negrito.',action:'bold-deadline',why:'O prazo precisa de destaque funcional.'},
        {id:'sign',prompt:'Adicione o setor responsável.',action:'add-signature',why:'Registra autoria.'},
        {id:'perm',prompt:'Compartilhe com a supervisão como Comentador.',action:'permission-commenter',why:'Permite revisão controlada.'},
        {id:'pdf',prompt:'Exporte a versão aprovada em PDF.',action:'export-pdf',why:'Preserva o layout final.'}
      ],{documentTitle:'Relatório gerencial de pendências',department:'Gestão Administrativa — AGV',date:'Agosto de 2026 · versão 1',intro:'Relatório fictício para reunião de acompanhamento.',bullets:['Priorizar pendências críticas','Definir responsáveis','Revisar o prazo até 20/08'],signature:'Gestão Administrativa',permission:'commenter',filename:'relatorio-gerencial-pendencias-v1.pdf'}),
      emailLab('Correio gerencial: distribuir o relatório','Encaminhe o relatório simulado.',{scenario:'A direção solicitou a versão aprovada do relatório.',recipient:'direcao.agv@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',subjectKeywords:['relatório','gerencial','pendências'],bodyKeywords:['olá','anexo','análise','prazo'],attachment:'relatorio-gerencial-pendencias-v1.pdf',hint:'Diferencie destinatário principal e acompanhamento.'}),
      twoFactorLab('Segurança da conta documental','Proteja a conta usada nos arquivos.',{account:'gestao.documentos@simulacao.edu.br',preferredMethod:'security-key',backupChoice:'offline',suspiciousChoice:'deny',context:'Conta fictícia com acesso a relatórios gerenciais.'}),
      quiz('Governança da informação',[
        {q:'Quem apenas revisa sem editar deve receber qual permissão?',options:['Comentador','Editor','Proprietário','Público'],answer:0,why:'Comentador mantém a base protegida.'},
        {q:'Qual nome facilita controle de versões?',options:['relatorio-pendencias-2026-08-v1.pdf','final-novo.pdf','documento.pdf','arquivo-ultimo.pdf'],answer:0,why:'Assunto, período e versão identificam o arquivo.'},
        {q:'Uma solicitação de segundo fator não foi iniciada por você. O que fazer?',options:['Negar e revisar a segurança','Aprovar para remover o aviso','Enviar o código ao remetente','Desativar a proteção'],answer:0,why:'Solicitações desconhecidas devem ser bloqueadas.'},
        {q:'Qual campo inclui alguém que deve acompanhar a mensagem?',options:['CC','Assunto','Anexo','Rascunho'],answer:0,why:'CC envia cópia visível para acompanhamento.'}
      ]),
      challenge('Missão final: fluxo documental seguro','Conclua o processo.',[
        {q:'Qual ordem reduz retrabalho?',options:['Produzir, revisar, aprovar, exportar, comunicar e registrar','Enviar antes de produzir','Publicar a senha junto do documento','Apagar a versão editável antes da aprovação'],answer:0,why:'O fluxo ordenado mantém controle de versões.'},
        {q:'Qual evidência é adequada?',options:['Documento, versão, destinatários, data e confirmação','Senha e código de acesso','Somente uma captura sem contexto','Histórico completo do navegador'],answer:0,why:'A evidência documenta o processo sem expor credenciais.'}
      ],'Gestor de Informação')
    ]
  },
  {
    id:'2ADM-04',classId:'2ADM',order:4,duration:45,kind:'assessment',curriculumRevision:'2026T2-admin2-v242',keepLegacyReinforcement:false,
    title:'Avaliação prática — operação administrativa integrada',subtitle:'Resolva uma situação de gestão envolvendo infraestrutura, RH, dados e documentos.',
    icon:'🏁',badge:'Administrador Digital',estimated:'20–25 min',application:'Avaliação final do 2º ADM',evidence:'Caso integrado com análise, documento e rastreabilidade',
    objectives:['Diagnosticar recursos','Analisar dados de pessoas','Produzir documento gerencial','Comunicar decisão com segurança'],
    stages:[
      explain('Caso avaliativo: implantação de um novo setor','Uma equipe fictícia precisa preparar estação, pessoas, dados e comunicação.','Você deverá identificar recursos, conferir jornada e valores simulados, organizar uma base e produzir o documento de implantação.','O caso reúne competências das três aulas anteriores.','Execute as ações e preserve a coerência entre dados e decisão.'),
      hardwareLab('Avaliação: validar a estação','Confirme os recursos do novo setor.',[
        {id:'rotate',prompt:'Gire a estação para analisar conexões.',action:'rotate-right',why:'A análise inclui portas e periféricos.'},
        {id:'ram',prompt:'Selecione o recurso usado por programas simultâneos.',action:'select-ram',why:'A RAM sustenta a carga de trabalho.'},
        {id:'scanner',prompt:'Selecione o equipamento para digitalização.',action:'select-scanner',why:'O scanner converte documentos físicos.'}
      ],{scenario:'Novo setor administrativo'}),
      hrLab('Avaliação: conferir o apoio do setor','Calcule o demonstrativo fictício.',{employee:'Lucas Martins',role:'Assistente de implantação',baseSalary:2800,monthlyHours:200,overtimeHours:5,absenceHours:2,overtimeMultiplier:1.5,otherDeduction:100,anomalyIndex:2,schedule:[['Segunda','08:00','17:00','60 min','8h'],['Terça','08:00','17:00','60 min','8h'],['Quarta','07:30','19:00','30 min','11h — revisar']],note:'Avaliação com dados simulados.'}),
      officeLab('Avaliação: organizar custos','Prepare a base de implantação.',[
        {id:'filter',prompt:'Filtre itens de prioridade Crítica.',action:'filter-critical',why:'Prioriza o que impede a implantação.'},
        {id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'Evidencia o impacto financeiro.'},
        {id:'chart',prompt:'Crie um gráfico de colunas.',action:'chart-column',why:'Compara os custos.'}
      ],{scenario:'Custos de implantação',columns:['Recurso','Setor','Valor','Prioridade'],rows:[['Notebooks','TI','12800','Crítica'],['Mobiliário','Compras','6200','Normal'],['Treinamento','RH','3400','Crítica'],['Documentos','Secretaria','900','Normal']]}),
      documentLab('Avaliação: relatório de implantação','Produza a versão final.',[
        {id:'title',prompt:'Aplique o título.',action:'title-style',why:'Identifica o relatório.'},
        {id:'list',prompt:'Organize as ações em lista.',action:'insert-list',why:'Facilita acompanhamento.'},
        {id:'sign',prompt:'Adicione o responsável.',action:'add-signature',why:'Registra autoria.'},
        {id:'perm',prompt:'Compartilhe como Leitor.',action:'permission-reader',why:'A versão final será apenas consultada.'},
        {id:'pdf',prompt:'Exporte em PDF.',action:'export-pdf',why:'Preserva o documento final.'}
      ],{documentTitle:'Plano de implantação do setor',department:'Gestão Administrativa',date:'Agosto de 2026',intro:'Plano fictício de recursos, pessoas e ações.',bullets:['Instalar equipamentos','Validar acessos','Conferir treinamento'],signature:'Gestão do Projeto',permission:'reader',filename:'plano-implantacao-setor.pdf'}),
      challenge('Entrega da avaliação','Finalize o caso integrado.',[
        {q:'Qual evidência representa a operação completa?',options:['Diagnóstico, dados, análise, documento e ações','Somente a nota final','Senha do perfil','Código temporário'],answer:0,why:'A avaliação registra todo o processo.'},
        {q:'Qual decisão protege os dados?',options:['Usar acesso nominal e menor permissão necessária','Publicar links de edição','Compartilhar a conta do setor','Enviar códigos por mensagem'],answer:0,why:'Acesso mínimo reduz exposição.'}
      ],'Administrador Digital')
    ]
  },
  {
    id:'2ADM-05',classId:'2ADM',order:5,duration:45,kind:'recovery',curriculumRevision:'2026T2-admin2-v242',keepLegacyReinforcement:false,
    title:'Recuperação prática — continuidade de uma operação',subtitle:'Resolva um caso alternativo com diagnóstico, pessoas e documentação.',
    icon:'🔄',badge:'Administrador em Evolução',estimated:'20–25 min',application:'Recuperação diferenciada do 2º ADM',evidence:'Plano alternativo de continuidade operacional',
    objectives:['Diagnosticar um problema alternativo','Recalcular dados simulados','Documentar ações corretivas','Comunicar com segurança'],
    stages:[
      explain('Caso de recuperação: retomada após falha operacional','A recuperação não repete o caso da avaliação.','Um escritório fictício precisa retomar atividades após falha em equipamentos, registros de jornada incompletos e documentos desatualizados.','Você deverá criar um plano de continuidade com outra sequência de decisões.','Use as mesmas competências em um cenário novo.'),
      hardwareLab('Recuperação: diagnosticar a estação','Localize os recursos envolvidos.',[
        {id:'rotate',prompt:'Gire a estação para conferir cabos e portas.',action:'rotate-left',why:'A inspeção inclui a traseira.'},
        {id:'cpu',prompt:'Selecione o componente de processamento.',action:'select-cpu',why:'A CPU executa as instruções.'},
        {id:'ssd',prompt:'Selecione o armazenamento permanente.',action:'select-ssd',why:'O SSD mantém arquivos.'},
        {id:'printer',prompt:'Conecte a impressora de contingência.',action:'connect-printer',why:'Restaura a saída impressa.'}
      ],{scenario:'Operação de contingência'}),
      hrLab('Recuperação: regularizar a jornada','Confira outro demonstrativo fictício.',{employee:'Patrícia Alves',role:'Assistente de continuidade',baseSalary:2600,monthlyHours:200,overtimeHours:3,absenceHours:1,overtimeMultiplier:1.5,otherDeduction:78,anomalyIndex:0,schedule:[['Segunda','07:30','18:30','30 min','10h30 — revisar'],['Terça','08:00','17:00','60 min','8h'],['Quarta','08:00','17:00','60 min','8h']],note:'Recuperação com dados fictícios.'}),
      documentLab('Recuperação: plano de continuidade','Produza o plano alternativo.',[
        {id:'title',prompt:'Aplique o título.',action:'title-style',why:'Identifica o plano.'},
        {id:'date',prompt:'Insira data e versão.',action:'add-date',why:'Registra a revisão.'},
        {id:'bold',prompt:'Destaque o prazo em negrito.',action:'bold-deadline',why:'O prazo é uma informação crítica.'},
        {id:'list',prompt:'Organize as ações em lista.',action:'insert-list',why:'Facilita execução.'},
        {id:'pdf',prompt:'Exporte em PDF.',action:'export-pdf',why:'Gera a versão final.'}
      ],{documentTitle:'Plano de continuidade administrativa',department:'Gestão de Operações',date:'Agosto de 2026 · versão de recuperação',intro:'Plano fictício para retomada do escritório.',bullets:['Restaurar equipamentos','Regularizar registros','Revisar acessos até 22/08'],signature:'Gestão de Continuidade',permission:'commenter',filename:'plano-continuidade-administrativa.pdf'}),
      emailLab('Recuperação: comunicar a retomada','Encaminhe o plano alternativo.',{scenario:'A direção solicitou o plano de continuidade.',recipient:'direcao.agv@simulacao.edu.br',cc:'ti.agv@simulacao.edu.br',subjectKeywords:['plano','continuidade','retomada'],bodyKeywords:['olá','anexo','retomada','prazo'],attachment:'plano-continuidade-administrativa.pdf',hint:'Explique o plano, o anexo e o prazo.'}),
      challenge('Fechamento da recuperação','Conclua o cenário alternativo.',[
        {q:'Por que a recuperação utiliza outro caso?',options:['Para demonstrar as competências em contexto diferente','Para repetir a avaliação sem mudança','Para eliminar atividades práticas','Para apagar o progresso anterior'],answer:0,why:'A nova abordagem oferece outra oportunidade de aprendizagem.'},
        {q:'Qual sequência apoia a continuidade?',options:['Diagnosticar, priorizar, corrigir, documentar e comunicar','Enviar o plano antes do diagnóstico','Apagar os registros incompletos','Compartilhar credenciais para agilizar'],answer:0,why:'A retomada depende de análise e registro.'}
      ],'Administrador em Evolução')
    ]
  }
];
for(const lesson of CURRICULUM_V229){
  const index=LESSONS.findIndex(item=>item.id===lesson.id);
  if(index>=0)LESSONS[index]=lesson;else LESSONS.push(lesson);
}
LESSONS.sort((a,b)=>a.classId.localeCompare(b.classId)||a.order-b.order);
const CURRICULUM_V229_OPTION_REVISIONS={
  'Qual sequência reduz erros?':['Organizar, calcular, conferir e registrar','Comunicar, alterar e conferir somente depois','Excluir os valores altos antes do cálculo','Compartilhar o acesso para outra pessoa revisar'],
  'Quem deve acessar dados de pagamento?':['Profissionais autorizados pela rotina do setor','Colegas que participam de grupos administrativos','Pessoas que receberam o link por encaminhamento','Fornecedores que acompanham compras e contratos'],
  'O demonstrativo da aula possui validade trabalhista?':['Não; é uma simulação educacional simplificada','Sim; substitui o documento oficial do setor','Sim; quando o arquivo é exportado em formato PDF','Depende; a validade muda conforme o tema visual'],
  'Qual evidência é adequada no RH?':['Jornada, valores, cálculo e ações da simulação','Senha da conta e código temporário de verificação','Lista com dados pessoais reais de outros estudantes','Valor final sem fórmula, origem ou horário registrado'],
  'Qual nome de arquivo é mais claro?':['relatorio-materiais-agv-agosto-v1.pdf','relatorio-administrativo-final-atual.pdf','documento-materiais-revisado-novo.pdf','arquivo-geral-do-setor-administrativo.pdf'],
  'Antes de enviar o anexo, o que conferir?':['Destinatários, assunto, mensagem e arquivo','Tamanho da janela, brilho e volume do dispositivo','Cor do tema, papel de parede e posição do menu','Modelo do computador, bateria e conexão do mouse'],
  'Qual sequência é adequada para o documento?':['Produzir, revisar, exportar, compartilhar e comunicar','Enviar, escrever o conteúdo e revisar o anexo depois','Publicar o acesso e solicitar que todos tenham cuidado','Apagar a versão editável antes da revisão responsável'],
  'Qual ordem é mais segura?':['Salvar, fechar arquivos, sair das contas e organizar','Fechar a tampa, guardar o aparelho e manter sessões','Compartilhar a senha, desligar a tela e deixar abas','Apagar perfis locais e remover os dados dos colegas'],
  'Qual evidência representa o processo completo?':['Base, cálculos, jornada, documento e ações','Alternativas marcadas e tempo total sem contexto','Senha do estudante e histórico do navegador usado','Captura de tela sem data, turma ou arquivo produzido'],
  'Por que o cenário é diferente da avaliação?':['Para aplicar as competências em uma nova situação','Para reduzir a recuperação a perguntas mais simples','Para repetir as respostas em uma ordem diferente','Para substituir os registros da avaliação anterior'],
  'Qual sequência cria um plano confiável?':['Diagnosticar, corrigir, documentar e comunicar','Comunicar a decisão antes de analisar os problemas','Apagar os registros antigos e iniciar outra base','Compartilhar credenciais para agilizar o processo'],
  'Antes de comprar um equipamento, o gestor deve:':['Analisar necessidade, desempenho, custo e suporte','Escolher o modelo mais bonito disponível na loja','Ignorar os sistemas utilizados pelo setor diariamente','Comprar primeiro e registrar o patrimônio depois'],
  'Qual evidência deve acompanhar o inventário?':['Equipamento, setor, situação, valor e recomendação','Senha do usuário responsável pelo equipamento','Código temporário usado para acessar o inventário','Fotografia isolada sem identificação ou data'],
  'Uma média caiu por causa de registros incompletos. O que fazer?':['Auditar a base antes de interpretar o indicador','Alterar a média para manter o resultado planejado','Excluir as linhas incompletas sem consultar o setor','Publicar o relatório e revisar os dados posteriormente'],
  'Qual sequência é adequada?':['Conferir, calcular, interpretar e comunicar','Comunicar, ajustar os valores e conferir depois','Excluir divergências, aprovar e registrar no fim','Compartilhar a conta para acelerar a conferência'],
  'Qual evidência deve ser preservada?':['Fonte, fórmula, resultado, responsáveis e data','Código temporário e senha utilizados no acesso','Gráfico isolado sem base, período ou responsável','Captura de tela sem contexto da decisão gerencial'],
  'Qual nome facilita controle de versões?':['relatorio-pendencias-2026-08-v1.pdf','relatorio-final-atualizado-novo-2026.pdf','documento-gerencial-revisado-agosto.pdf','arquivo-pendencias-versao-mais-recente.pdf'],
  'Qual ordem reduz retrabalho?':['Produzir, revisar, aprovar, exportar e comunicar','Enviar antes de produzir e solicitar revisão depois','Publicar a senha junto do documento compartilhado','Apagar a versão editável antes da aprovação final'],
  'Qual evidência é adequada?':['Documento, versão, destinatários, data e confirmação','Senha, código de acesso e sessão do navegador','Captura isolada sem contexto, período ou responsável','Histórico completo do navegador pessoal do estudante'],
  'Qual evidência representa a operação completa?':['Diagnóstico, dados, análise, documento e ações','Nota final, quantidade de cliques e cor do tema','Senha do perfil, código temporário e dispositivo','Tempo total sem arquivos, decisões ou responsáveis'],
  'Qual decisão protege os dados?':['Acesso nominal com a menor permissão necessária','Links públicos de edição para todas as pessoas','Conta compartilhada entre os integrantes do setor','Códigos temporários enviados em mensagens de grupo'],
  'Por que a recuperação utiliza outro caso?':['Para aplicar as competências em contexto diferente','Para repetir a avaliação com pequenas mudanças visuais','Para eliminar as atividades práticas da recuperação','Para apagar o progresso e os registros anteriores'],
  'Qual sequência apoia a continuidade?':['Diagnosticar, priorizar, corrigir e documentar','Enviar o plano antes de investigar a causa do problema','Apagar registros incompletos e reiniciar o processo','Compartilhar credenciais para acelerar a retomada']
};
for(const lesson of CURRICULUM_V229){
  for(const stage of lesson.stages||[]){
    for(const question of stage.questions||stage.tasks||[]){
      const key=question.q||question.prompt;
      if(CURRICULUM_V229_OPTION_REVISIONS[key]){question.options=[...CURRICULUM_V229_OPTION_REVISIONS[key]];question.answer=0;}
    }
  }
}




const enterpriseStageV230=(title,description,config)=>({type:'enterprise-lab',title,description,config});
const ENTERPRISE_V230={
  '1ADM-07':{
    revision:'2026T2-admin-v242',
    stages:[
      explain('Caso avaliativo: preparar uma capacitação interna','Você assumirá uma solicitação realista do setor administrativo e deverá concluir o fluxo completo.','A avaliação acontece dentro de uma estação empresarial simulada. O estudante interpreta a solicitação, confere dados, identifica uma divergência de jornada, prepara um documento e comunica a entrega. As ações, tentativas e correções ficam registradas.','Uma solicitação chega por e-mail com planilha e prazo. O assistente precisa conferir os materiais e responder com o comunicado em PDF.','Durante a avaliação, a ajuda disponível explica apenas a interface; ela não informa a decisão correta.'),
      enterpriseStageV230('Operação integrada: capacitação interna','Resolva o caso utilizando os aplicativos da estação administrativa.',{
        mode:'assessment',company:'AGV Office Lab',role:'Assistente administrativo',scenario:'Capacitação interna para novos colaboradores',deadline:'Hoje, 16h30',
        request:{from:'coordenação@simulacao.edu.br',subject:'Organização da capacitação de integração',body:'Confira os materiais, a escala de apoio e prepare o comunicado final em PDF.',attachment:'base-capacitacao-agosto.xlsx'},
        sheet:{title:'Materiais da capacitação',columns:['Item','Setor','Valor','Situação'],rows:[['Crachás','RH','480','Pendente'],['Pastas','Secretaria','620','Aprovado'],['Coffee break','Compras','1.230','Pendente'],['Projetor','TI','0','Disponível']],expectedTotal:2330},
        hr:{employee:'Rafael Costa',role:'Apoio administrativo',schedule:[['Segunda','08:00','17:00','60 min','8h'],['Terça','08:00','18:00','30 min','9h30 — revisar'],['Quarta','08:00','17:00','60 min','8h']],anomalyIndex:1},
        document:{title:'Comunicado de capacitação interna',filename:'comunicado-capacitacao-agv.pdf',permission:'reader'},
        security:{code:'624731'},
        tasks:[
          {app:'mail',action:'mail-open-request',prompt:'Abra a solicitação recebida da coordenação.',why:'O fluxo começa pela leitura integral da demanda.'},
          {app:'mail',action:'mail-open-attachment',prompt:'Abra a planilha anexada à solicitação.',why:'O anexo contém a base que precisa ser conferida.'},
          {app:'sheet',action:'sheet-filter-pending',prompt:'Na planilha, filtre somente os itens pendentes.',why:'O filtro concentra a análise no que ainda exige ação.'},
          {app:'sheet',action:'sheet-validate-total',prompt:'Calcule e valide o total dos itens pendentes.',expected:'1710',why:'Crachás e coffee break somam R$ 1.710,00.'},
          {app:'hr',action:'hr-flag-anomaly',prompt:'Localize o registro de jornada que precisa de revisão.',why:'A terça-feira possui intervalo e apuração diferentes do padrão.'},
          {app:'docs',action:'docs-title',prompt:'Aplique estilo de título ao comunicado.',why:'A hierarquia identifica o documento e melhora a leitura.'},
          {app:'docs',action:'docs-permission-reader',prompt:'Defina acesso como Leitor para os participantes.',why:'Os destinatários precisam consultar, não alterar a versão oficial.'},
          {app:'docs',action:'docs-export-pdf',prompt:'Gere a versão final do comunicado em PDF.',why:'O PDF preserva a apresentação da versão aprovada.'},
          {app:'mail',action:'mail-attach-pdf',prompt:'Anexe o comunicado em PDF à resposta.',why:'O documento deve acompanhar a confirmação da tarefa.'},
          {app:'mail',action:'mail-send-reply',prompt:'Envie a resposta profissional para a coordenação.',why:'A mensagem encerra o fluxo com assunto, contexto e evidência.'},
          {app:'dashboard',action:'case-close',prompt:'Finalize o caso e registre a operação concluída.',why:'A conclusão consolida a trilha de auditoria da avaliação.'}
        ]
      }),
      challenge('Reflexão profissional','Analise as decisões tomadas no caso.',[
        {q:'Qual evidência demonstra melhor que o processo foi concluído?',options:['Planilha conferida, divergência registrada, PDF e comunicação','Somente o tempo total da sessão','Uma captura de tela sem identificação','A senha usada no perfil'],answer:0,why:'A evidência deve mostrar dados, decisões, documento e comunicação.'},
        {q:'Por que a permissão Leitor foi adequada?',options:['Preserva a versão oficial sem impedir consulta','Permite que todos alterem o documento','Publica o arquivo na internet','Remove a necessidade de revisão'],answer:0,why:'A menor permissão necessária protege o documento.'}
      ],'Assistente Administrativo')
    ]
  },
  '1ADM-08':{
    revision:'2026T2-admin-v242',
    stages:[
      explain('Recuperação: reorganizar um setor com pendências','Você terá uma nova oportunidade em um cenário diferente da avaliação.','A recuperação utiliza uma operação de reorganização de arquivos, materiais e comunicação. O percurso avalia as mesmas competências, mas muda dados, documentos e decisões.','O setor recebeu uma base desorganizada e precisa regularizar as pendências antes de comunicar a supervisão.','Use o tutorial de interface quando necessário; ele não executa as ações por você.'),
      enterpriseStageV230('Operação de recuperação: regularização do setor','Corrija a operação e produza uma evidência completa.',{
        mode:'recovery',company:'AGV Office Lab',role:'Auxiliar administrativo',scenario:'Regularização de pendências do setor de apoio',deadline:'Até o fim da aula',
        request:{from:'supervisao@simulacao.edu.br',subject:'Pendências do setor de apoio',body:'Revise equipamentos, materiais e o plano de regularização. Envie o PDF final.',attachment:'pendencias-setor.xlsx'},
        sheet:{title:'Pendências do setor',columns:['Pendência','Responsável','Prioridade','Situação'],rows:[['Etiquetas','Compras','Alta','Pendente'],['Impressora','TI','Alta','Atrasado'],['Pastas','Secretaria','Média','Concluído'],['Arquivo físico','Apoio','Alta','Pendente']],expectedTotal:3},
        assets:{scenario:'Estação do setor de apoio'},
        document:{title:'Plano de regularização administrativa',filename:'plano-regularizacao-setor.pdf',permission:'commenter'},
        tasks:[
          {app:'mail',action:'mail-open-request',prompt:'Leia a solicitação da supervisão.',why:'A demanda define prioridade, prazo e evidência.'},
          {app:'assets',action:'assets-rotate',prompt:'Gire a estação para inspecionar conexões e periféricos.',why:'A inspeção visual inclui a parte traseira do equipamento.'},
          {app:'assets',action:'assets-connect-printer',prompt:'Conecte a impressora de contingência.',why:'A saída impressa é necessária para a rotina do setor.'},
          {app:'sheet',action:'sheet-filter-pending',prompt:'Filtre as pendências que ainda exigem ação.',why:'A equipe deve trabalhar no que não foi concluído.'},
          {app:'sheet',action:'sheet-sort-desc',prompt:'Ordene a prioridade para destacar os itens críticos.',why:'A priorização organiza a sequência de atendimento.'},
          {app:'docs',action:'docs-add-date',prompt:'Insira data e versão no plano de regularização.',why:'Controle de versão evita documentos divergentes.'},
          {app:'docs',action:'docs-permission-commenter',prompt:'Compartilhe o plano como Comentador para a supervisão.',why:'A supervisão pode revisar sem alterar diretamente.'},
          {app:'docs',action:'docs-export-pdf',prompt:'Exporte o plano final em PDF.',why:'A versão final precisa manter o layout.'},
          {app:'mail',action:'mail-attach-pdf',prompt:'Anexe o plano à resposta.',why:'O anexo comprova a produção do documento.'},
          {app:'mail',action:'mail-send-reply',prompt:'Comunique a regularização à supervisão.',why:'A mensagem registra situação, anexo e próximos passos.'},
          {app:'dashboard',action:'case-close',prompt:'Encerre o caso de recuperação.',why:'O encerramento registra a conclusão do novo percurso.'}
        ]
      }),
      challenge('Fechamento da recuperação','Confirme o raciocínio do novo cenário.',[
        {q:'Por que a recuperação usa outra operação?',options:['Para aplicar as competências em situação diferente','Para repetir exatamente as respostas da avaliação','Para eliminar as atividades práticas','Para apagar o progresso anterior'],answer:0,why:'Um cenário alternativo verifica aprendizagem sem copiar a avaliação.'},
        {q:'Qual sequência apoia a regularização?',options:['Ler, priorizar, corrigir, documentar e comunicar','Enviar a resposta antes de analisar a base','Excluir pendências para reduzir a lista','Compartilhar credenciais para ganhar tempo'],answer:0,why:'O fluxo administrativo depende de análise e rastreabilidade.'}
      ],'Administrador em Evolução')
    ]
  },
  '2ADM-04':{
    revision:'2026T2-admin2-v242',
    stages:[
      explain('Avaliação gerencial: implantar um novo setor','Você coordenará uma operação administrativa integrada com decisões de maior autonomia.','O caso exige revisar ativos, orçamento, jornada, segurança, documento e comunicação. A avaliação observa a qualidade do processo e não apenas a resposta final.','A direção autorizou um novo setor e precisa de uma análise consolidada antes da implantação.','Ajuda técnica explica onde ficam as ferramentas, mas não indica a decisão correta.'),
      enterpriseStageV230('Centro de operações: implantação do setor','Conduza a implantação do início ao encerramento.',{
        mode:'assessment',company:'Horizonte Gestão — Simulação',role:'Analista administrativo',scenario:'Implantação de um novo núcleo de atendimento',deadline:'Hoje, 17h',
        request:{from:'direcao@simulacao.edu.br',subject:'Implantação do núcleo de atendimento',body:'Valide a estação, os custos, a equipe, as permissões e encaminhe o plano final.',attachment:'implantacao-nucleo.xlsx'},
        sheet:{title:'Orçamento de implantação',columns:['Recurso','Categoria','Valor','Situação'],rows:[['Computadores','TI','4.800','Pendente'],['Mobiliário','Patrimônio','2.700','Aprovado'],['Treinamento','RH','1.500','Pendente'],['Licenças','TI','1.200','Pendente']],expectedTotal:10200},
        hr:{employee:'Lucas Martins',role:'Assistente de implantação',schedule:[['Segunda','08:00','17:00','60 min','8h'],['Terça','08:00','17:00','60 min','8h'],['Quarta','07:30','18:30','30 min','10h30 — revisar']],anomalyIndex:2},
        assets:{scenario:'Estação do novo núcleo'},
        document:{title:'Plano de implantação do núcleo',filename:'plano-implantacao-nucleo.pdf',permission:'commenter'},
        security:{code:'815204'},
        tasks:[
          {app:'mail',action:'mail-open-request',prompt:'Abra o briefing enviado pela direção.',why:'A leitura completa evita decisões fora do escopo.'},
          {app:'assets',action:'assets-explode',prompt:'Ative a vista de componentes da estação.',why:'A vista técnica permite conferir processamento, memória e armazenamento.'},
          {app:'assets',action:'assets-select-ssd',prompt:'Identifique o armazenamento permanente.',why:'O SSD mantém sistema e arquivos do setor.'},
          {app:'sheet',action:'sheet-sort-desc',prompt:'Ordene os custos do maior para o menor.',why:'A ordenação destaca os maiores impactos do orçamento.'},
          {app:'sheet',action:'sheet-validate-total',prompt:'Valide o orçamento total da implantação.',expected:'10200',why:'A soma dos quatro recursos é R$ 10.200,00.'},
          {app:'hr',action:'hr-flag-anomaly',prompt:'Marque a jornada que exige conferência.',why:'A quarta-feira ultrapassa a jornada padrão e possui intervalo reduzido.'},
          {app:'hr',action:'hr-approve-reviewed',prompt:'Registre a jornada como revisada, sem alterar dados silenciosamente.',why:'A aprovação deve ocorrer após a divergência ser identificada.'},
          {app:'security',action:'security-verify-code',prompt:'Confirme a autenticação em dois fatores simulada.',expected:'815204',why:'O segundo fator protege a aprovação gerencial.'},
          {app:'docs',action:'docs-title',prompt:'Aplique a hierarquia de título ao plano.',why:'O documento precisa ser identificado imediatamente.'},
          {app:'docs',action:'docs-add-date',prompt:'Registre data e versão do plano.',why:'A versão permite rastrear a aprovação.'},
          {app:'docs',action:'docs-permission-commenter',prompt:'Dê acesso de Comentador à direção.',why:'A direção revisa sem alterar a versão produzida.'},
          {app:'docs',action:'docs-export-pdf',prompt:'Exporte a versão aprovada em PDF.',why:'A entrega final precisa preservar a apresentação.'},
          {app:'mail',action:'mail-attach-pdf',prompt:'Anexe o plano de implantação.',why:'A evidência deve acompanhar a comunicação.'},
          {app:'mail',action:'mail-send-reply',prompt:'Envie a análise final para a direção.',why:'A resposta comunica conclusão, ressalvas e arquivo.'},
          {app:'dashboard',action:'case-close',prompt:'Aprove o encerramento da operação.',why:'O encerramento consolida decisões e trilha de auditoria.'}
        ]
      }),
      challenge('Parecer final','Analise os critérios da implantação.',[
        {q:'Qual decisão protege melhor os documentos?',options:['Acesso nominal com a menor permissão necessária','Link público de edição para toda a equipe','Conta compartilhada entre os setores','Código temporário enviado em grupo'],answer:0,why:'Acesso mínimo e nominal reduz risco e melhora a auditoria.'},
        {q:'Qual evidência representa a operação completa?',options:['Ativos, orçamento, jornada, segurança, documento e comunicação','Somente a nota final','Uma captura sem contexto','O tempo total de página aberta'],answer:0,why:'A avaliação considera o processo integrado.'}
      ],'Analista Administrativo')
    ]
  },
  '2ADM-05':{
    revision:'2026T2-admin2-v242',
    stages:[
      explain('Recuperação gerencial: continuidade após falha operacional','Você resolverá uma operação diferente da avaliação, com foco em retomada segura.','A recuperação exige diagnosticar o ambiente, priorizar pendências, revisar jornada, produzir um plano e comunicar a retomada.','Uma falha interrompeu parte das atividades administrativas e a direção solicitou um plano de continuidade.','O fluxo é alternativo e mantém o mesmo nível de exigência das competências essenciais.'),
      enterpriseStageV230('Centro de continuidade: retomada administrativa','Restabeleça a operação com registro e segurança.',{
        mode:'recovery',company:'Horizonte Gestão — Simulação',role:'Analista de continuidade',scenario:'Retomada do escritório após indisponibilidade',deadline:'Até o encerramento da aula',
        request:{from:'direcao@simulacao.edu.br',subject:'Plano de continuidade administrativa',body:'Diagnostique a estação, regularize a base e encaminhe o plano de retomada.',attachment:'continuidade-operacional.xlsx'},
        sheet:{title:'Pendências de continuidade',columns:['Processo','Responsável','Impacto','Situação'],rows:[['Folha de ponto','RH','Alto','Pendente'],['Impressão','TI','Médio','Atrasado'],['Arquivo digital','Secretaria','Alto','Pendente'],['Agenda de reuniões','Gestão','Baixo','Concluído']],expectedTotal:3},
        hr:{employee:'Patrícia Alves',role:'Assistente de continuidade',schedule:[['Segunda','07:30','18:30','30 min','10h30 — revisar'],['Terça','08:00','17:00','60 min','8h'],['Quarta','08:00','17:00','60 min','8h']],anomalyIndex:0},
        assets:{scenario:'Estação de contingência'},
        document:{title:'Plano de continuidade administrativa',filename:'plano-continuidade-administrativa.pdf',permission:'commenter'},
        security:{code:'302947'},
        tasks:[
          {app:'mail',action:'mail-open-request',prompt:'Leia a solicitação de continuidade.',why:'A demanda define o escopo da retomada.'},
          {app:'assets',action:'assets-rotate',prompt:'Inspecione a estação em 360 graus.',why:'A inspeção inclui cabos, conexões e periféricos.'},
          {app:'assets',action:'assets-connect-printer',prompt:'Restabeleça a impressora de contingência.',why:'A operação depende da saída documental.'},
          {app:'sheet',action:'sheet-filter-pending',prompt:'Filtre os processos ainda pendentes.',why:'A equipe precisa priorizar atividades não concluídas.'},
          {app:'sheet',action:'sheet-sort-desc',prompt:'Ordene os processos pelo impacto.',why:'A retomada deve começar pelos impactos maiores.'},
          {app:'hr',action:'hr-flag-anomaly',prompt:'Identifique a jornada incompatível com o padrão.',why:'A segunda apuração precisa ser revisada antes do fechamento.'},
          {app:'security',action:'security-deny-access',prompt:'Negue o acesso suspeito exibido na central de segurança.',why:'A retomada não pode manter uma sessão desconhecida.'},
          {app:'docs',action:'docs-add-date',prompt:'Registre data e versão do plano.',why:'A versão identifica a decisão em vigor.'},
          {app:'docs',action:'docs-permission-commenter',prompt:'Permita comentários da direção.',why:'A revisão deve ocorrer sem edição silenciosa.'},
          {app:'docs',action:'docs-export-pdf',prompt:'Gere o PDF do plano de continuidade.',why:'A versão final preserva o documento aprovado.'},
          {app:'mail',action:'mail-attach-pdf',prompt:'Anexe o plano de continuidade.',why:'O arquivo comprova a solução preparada.'},
          {app:'mail',action:'mail-send-reply',prompt:'Comunique a retomada e as pendências restantes.',why:'A comunicação gerencial deve informar situação e próximos passos.'},
          {app:'dashboard',action:'case-close',prompt:'Encerre a operação de recuperação.',why:'A conclusão registra a nova oportunidade de aprendizagem.'}
        ]
      }),
      challenge('Parecer da recuperação','Confirme a lógica da continuidade.',[
        {q:'Qual sequência apoia a retomada segura?',options:['Diagnosticar, priorizar, corrigir, documentar e comunicar','Comunicar antes de investigar','Apagar os registros incompletos','Compartilhar credenciais para acelerar'],answer:0,why:'A continuidade exige análise, ação e rastreabilidade.'},
        {q:'Por que o cenário é diferente da avaliação?',options:['Para demonstrar competências em outro contexto','Para repetir as mesmas respostas','Para reduzir o nível de exigência','Para substituir os registros anteriores'],answer:0,why:'A recuperação oferece uma abordagem alternativa sem copiar a avaliação.'}
      ],'Analista em Evolução')
    ]
  }
};
for(const [lessonId,patch] of Object.entries(ENTERPRISE_V230)){
  const lesson=LESSONS.find(item=>item.id===lessonId);
  if(!lesson)continue;
  lesson.curriculumRevision=patch.revision;
  lesson.stages=patch.stages;
}

function enterpriseTaskGraph(tasks=[]){
  const actions=new Set(tasks.map(task=>task.action));
  const idFor=action=>action;
  const requestDependency=actions.has('mail-open-attachment')?'mail-open-attachment':'mail-open-request';
  return tasks.map((task,index)=>{
    const requires=new Set(Array.isArray(task.requires)?task.requires:[]);
    if(task.action!=='mail-open-request')requires.add('mail-open-request');
    if(task.action==='mail-open-attachment')requires.clear(),requires.add('mail-open-request');
    if(/^sheet-/.test(task.action)&&task.action!=='sheet-validate-total')requires.add(requestDependency);
    if(task.action==='sheet-validate-total'){
      requires.add(requestDependency);
      for(const action of ['sheet-filter-pending','sheet-sort-desc'])if(actions.has(action))requires.add(action);
    }
    if(task.action==='assets-select-ssd'&&actions.has('assets-explode'))requires.add('assets-explode');
    if(task.action==='assets-connect-printer'&&actions.has('assets-rotate'))requires.add('assets-rotate');
    if(task.action==='hr-approve-reviewed'&&actions.has('hr-flag-anomaly'))requires.add('hr-flag-anomaly');
    if(task.action==='docs-export-pdf')for(const action of tasks.filter(item=>item.app==='docs'&&item.action!=='docs-export-pdf').map(item=>item.action))requires.add(action);
    if(task.action==='mail-attach-pdf'&&actions.has('docs-export-pdf'))requires.add('docs-export-pdf');
    if(task.action==='mail-send-reply'){
      if(actions.has('mail-attach-pdf'))requires.add('mail-attach-pdf');
      requires.add('mail-open-request');
    }
    if(task.action==='case-close'){
      requires.clear();
      for(const item of tasks)if(item.action!=='case-close'&&!item.optional)requires.add(idFor(item.action));
    }
    requires.delete(task.action);
    return {...task,id:task.id||idFor(task.action),requires:[...requires],sequenceHint:index+1};
  });
}
for(const lessonId of ['1ADM-07','1ADM-08','2ADM-04','2ADM-05']){
  const lesson=LESSONS.find(item=>item.id===lessonId),stage=lesson?.stages.find(item=>item.type==='enterprise-lab');
  if(stage){stage.config.tasks=enterpriseTaskGraph(stage.config.tasks);lesson.curriculumRevision=lessonId.startsWith('2ADM')?'2026T2-admin2-v244':'2026T2-admin-v244'}
}
for(const lesson of LESSONS.filter(item=>item.classId==='2ADM'&&!['2ADM-03','2ADM-04','2ADM-05'].includes(item.id)))lesson.curriculumRevision='2026T2-admin2-v230';

const DOCUMENT_WORKFLOW_V241={
  '1ADM-05':{revision:'2026T2-mail-v242',shareRecipient:'supervisao.agv@simulacao.edu.br',folderName:'Secretaria / Relatórios',extra:[
    {id:'open',prompt:'Localize e abra o relatório correto no Drive simulado.',action:'open-drive-file',why:'Nome, pasta e tipo do arquivo precisam ser conferidos antes da edição.'},
    {id:'comment',prompt:'Adicione um comentário de revisão no trecho selecionado.',action:'add-comment',why:'Comentários permitem solicitar ajustes sem alterar silenciosamente o texto.'},
    {id:'version',prompt:'Salve uma versão nomeada antes de compartilhar.',action:'save-version',why:'A versão nomeada registra o ponto de revisão e facilita a recuperação.'}
  ]},
  '2ADM-03':{revision:'2026T2-admin2-mail-v242',shareRecipient:'supervisao.agv@simulacao.edu.br',folderName:'Gestão / Relatórios Gerenciais',extra:[
    {id:'open',prompt:'Localize e abra o relatório gerencial correto no Drive simulado.',action:'open-drive-file',why:'O gestor deve confirmar pasta, proprietário, nome e tipo antes de editar.'},
    {id:'comment',prompt:'Registre um comentário para a supervisão revisar o prazo.',action:'add-comment',why:'O comentário documenta a solicitação sem modificar a decisão original.'},
    {id:'version',prompt:'Crie uma versão nomeada para análise da supervisão.',action:'save-version',why:'Versões nomeadas facilitam comparação, aprovação e restauração.'},
    {id:'resolve',prompt:'Depois de revisar, resolva o comentário pendente.',action:'resolve-comment',why:'Resolver indica que a observação foi tratada e mantém o histórico.'}
  ]}
};
for(const [lessonId,workflow] of Object.entries(DOCUMENT_WORKFLOW_V241)){
  const lesson=LESSONS.find(item=>item.id===lessonId);if(!lesson)continue;lesson.curriculumRevision=workflow.revision;
  for(const stage of lesson.stages||[]){if(stage.type!=='document-lab')continue;const original=stage.tasks||[];const open=workflow.extra.find(x=>x.action==='open-drive-file');const comment=workflow.extra.find(x=>x.action==='add-comment');const version=workflow.extra.find(x=>x.action==='save-version');const resolve=workflow.extra.find(x=>x.action==='resolve-comment');const permissionIndex=original.findIndex(x=>String(x.action).startsWith('permission-'));const pdfIndex=original.findIndex(x=>x.action==='export-pdf');let tasks=[open,...original].filter(Boolean);const insertAt=tasks.findIndex(x=>String(x.action).startsWith('permission-'));tasks.splice(insertAt>=0?insertAt:Math.max(1,tasks.length-1),0,...[comment,version,resolve].filter(Boolean));stage.tasks=tasks;stage.config={...(stage.config||{}),shareRecipient:workflow.shareRecipient,folderName:workflow.folderName};}
}


const ENTERPRISE_FILE_FLOW_V245={
  '1ADM-07':{conflict:false,conflictStrategy:'keep-local',permission:'reader'},
  '1ADM-08':{conflict:true,conflictStrategy:'keep-local',permission:'commenter'},
  '2ADM-04':{conflict:true,conflictStrategy:'keep-local',permission:'commenter'},
  '2ADM-05':{conflict:true,conflictStrategy:'use-remote',permission:'commenter'}
};
for(const [lessonId,fileFlow] of Object.entries(ENTERPRISE_FILE_FLOW_V245)){
  const lesson=LESSONS.find(item=>item.id===lessonId);if(!lesson)continue;
  lesson.curriculumRevision=`${lesson.curriculumRevision||'2026T2'}-files-v245`;
  const stage=lesson.stages.find(item=>item.type==='enterprise-lab');if(!stage)continue;
  stage.config.fileFlow=fileFlow;
  const tasks=stage.config.tasks||[],attachIndex=tasks.findIndex(item=>item.action==='mail-attach-pdf');
  if(attachIndex<0)continue;
  const exportTask=tasks.find(item=>item.action==='docs-export-pdf');
  const additions=[];
  if(fileFlow.conflict)additions.push({id:'files-resolve-conflict',action:'files-resolve-conflict',app:'docs',prompt:'Resolva o conflito de edição e preserve a versão correta.',why:'Conflitos precisam ser tratados antes de gerar e encaminhar a evidência.',requires:[exportTask?.id||'docs-export-pdf']});
  additions.push({id:'files-review-version',action:'files-review-version',app:'docs',prompt:'Confira se o PDF corresponde à versão mais recente do documento.',why:'Uma exportação antiga pode conter dados ou decisões já corrigidos.',requires:[fileFlow.conflict?'files-resolve-conflict':(exportTask?.id||'docs-export-pdf')]});
  additions.push({id:'files-approve-access',action:'files-approve-access',app:'docs',prompt:'Analise e aprove a solicitação de acesso com a função adequada.',why:'O destinatário precisa de acesso suficiente, sem receber permissão excessiva.',requires:['files-review-version']});
  tasks.splice(attachIndex,0,...additions);
  const attach=tasks.find(item=>item.action==='mail-attach-pdf');attach.requires=['mail-open-request','files-review-version','files-approve-access'];
  const close=tasks.find(item=>item.action==='case-close');if(close){for(const task of additions)if(!close.requires.includes(task.id))close.requires.splice(Math.max(0,close.requires.length-2),0,task.id)}
}


export const AREAS = [
  'Informática básica','Hardware','Arquivos e formatos','Google Drive','Documentos e e-mail','Apresentações e Canva','Google Forms','Planilhas','Fórmulas','Segurança digital','Rotinas administrativas'
];

const rawQuestions = {
'Informática básica':[
 ['basic','Qual ação normalmente copia um item selecionado?',['Ctrl + C','Ctrl + V','Ctrl + Z','Ctrl + P'],0,'Ctrl + C copia o item selecionado.'],
 ['basic','Qual dispositivo é usado principalmente para apontar e clicar?',['Monitor','Mouse','Impressora','Roteador'],1,'O mouse controla o ponteiro.'],
 ['intermediate','Qual atalho desfaz a última ação?',['Ctrl + S','Ctrl + Z','Ctrl + A','Ctrl + F'],1,'Ctrl + Z desfaz a ação mais recente.'],
 ['intermediate','Qual prática melhora a organização digital?',['Salvar tudo na área de trabalho','Usar pastas e nomes descritivos','Criar arquivos sem título','Duplicar todos os documentos'],1,'Pastas e nomes claros facilitam localização.'],
 ['intermediate','Ao fechar um programa com trabalho não salvo, o risco é:',['Perder alterações','Melhorar a velocidade','Criar backup automático sempre','Alterar o teclado'],0,'Alterações não salvas podem ser perdidas.'],
 ['advanced','Uma tarefa repetitiva exige copiar dados entre sistemas. A melhor primeira ação é:',['Definir um processo padronizado e verificar possibilidade de automação','Repetir sem conferir','Compartilhar senhas','Apagar os registros antigos'],0,'Padronização e análise de automação reduzem erros.']
],
'Hardware':[
 ['basic','Qual componente exibe imagens e textos?',['Monitor','Teclado','Microfone','Scanner'],0,'O monitor apresenta a saída visual.'],
 ['basic','Qual dispositivo permite digitar texto?',['Teclado','Roteador','Projetor','Caixa de som'],0,'O teclado é um dispositivo de entrada.'],
 ['intermediate','A memória RAM é usada principalmente para:',['Armazenamento permanente','Dados temporários dos programas em uso','Impressão','Conexão elétrica'],1,'RAM mantém dados temporários enquanto programas são executados.'],
 ['intermediate','Um SSD costuma melhorar principalmente:',['Velocidade de inicialização e abertura de arquivos','Qualidade do microfone','Tamanho da tela','Sinal de Wi-Fi'],0,'SSD possui acesso mais rápido que discos mecânicos.'],
 ['intermediate','Qual equipamento distribui conexão de rede local?',['Roteador','Scanner','Webcam','Projetor'],0,'O roteador conecta dispositivos à rede.'],
 ['advanced','Um computador está lento ao abrir muitos programas, mas tem espaço livre. Qual recurso pode estar insuficiente?',['Memória RAM','Tamanho do monitor','Impressora','Mouse'],0,'Muitos programas simultâneos consomem RAM.']
],
'Arquivos e formatos':[
 ['basic','Qual extensão é comum em documentos PDF?',['.pdf','.jpg','.mp3','.exe'],0,'PDF usa a extensão .pdf.'],
 ['basic','Qual formato é comum em planilhas do Excel?',['.xlsx','.png','.mp4','.txt'],0,'XLSX é o formato padrão moderno do Excel.'],
 ['intermediate','Um arquivo .zip é usado para:',['Compactar e agrupar arquivos','Executar áudio','Editar imagens','Criar senha de e-mail'],0,'ZIP reúne e compacta arquivos.'],
 ['intermediate','Qual formato é mais adequado para enviar um documento preservando o layout?',['PDF','TXT','CSV','MP3'],0,'PDF preserva a apresentação visual.'],
 ['intermediate','Upload significa:',['Enviar arquivo para um serviço online','Apagar arquivo','Imprimir','Mover para lixeira'],0,'Upload envia dados do dispositivo para a internet/servidor.'],
 ['advanced','Uma planilha precisa ser importada por outro sistema como dados tabulares simples. Qual formato é comum?',['CSV','PNG','MP4','PPTX'],0,'CSV representa dados separados em linhas e colunas.']
],
'Google Drive':[
 ['basic','O Google Drive é usado principalmente para:',['Armazenar e compartilhar arquivos na nuvem','Editar vídeos offline apenas','Substituir o teclado','Criar hardware'],0,'Drive oferece armazenamento e colaboração online.'],
 ['basic','Qual permissão permite apenas visualizar?',['Leitor','Editor','Proprietário','Administrador'],0,'Leitor não altera o arquivo.'],
 ['intermediate','Qual permissão permite sugerir por comentários sem editar diretamente?',['Comentador','Leitor','Editor total','Público'],0,'Comentador registra observações sem modificar o conteúdo.'],
 ['intermediate','Qual prática é mais segura?',['Compartilhar apenas com pessoas necessárias','Usar link público sempre','Enviar senha da conta','Dar permissão de editor a todos'],0,'Acesso mínimo reduz riscos.'],
 ['intermediate','Mover um arquivo para uma pasta serve para:',['Organizar o conteúdo','Alterar o formato','Criar uma fórmula','Desligar a internet'],0,'Pastas organizam arquivos.'],
 ['advanced','Um colaborador saiu da equipe. O que fazer com o acesso dele?',['Remover ou revisar a permissão','Manter para sempre','Enviar outra senha','Publicar o arquivo'],0,'Acesso deve acompanhar a necessidade atual.']
],
'Documentos e e-mail':[
 ['basic','O campo Assunto de um e-mail deve:',['Resumir claramente o tema','Ficar sempre vazio','Conter a senha','Ser apenas “Oi”'],0,'Assunto claro ajuda o destinatário a entender a mensagem.'],
 ['basic','CCO é usado para:',['Ocultar os endereços dos destinatários entre si','Anexar arquivo','Apagar e-mail','Criar planilha'],0,'CCO envia cópia sem exibir os destinatários.'],
 ['intermediate','Qual mensagem é mais profissional?',['Preciso disso agora!!!','Olá, poderia encaminhar o relatório até 15h? Obrigado.','manda aí','URGENTE sem explicação'],1,'Clareza, prazo e cordialidade tornam a comunicação profissional.'],
 ['intermediate','Antes de enviar um anexo, é importante:',['Confirmar arquivo, nome e destinatário','Abrir qualquer link','Desativar senha','Excluir o assunto'],0,'Conferência evita envio incorreto.'],
 ['intermediate','No Google Docs, comentários são úteis para:',['Revisar e colaborar sem alterar diretamente','Apagar o documento','Criar hardware','Mudar a internet'],0,'Comentários apoiam revisão colaborativa.'],
 ['advanced','Um e-mail solicita dados sigilosos com urgência incomum. A melhor ação é:',['Confirmar por outro canal e verificar o remetente','Responder imediatamente','Enviar todos os dados','Encaminhar a senha'],0,'Verificação por outro canal reduz risco de fraude.']
],
'Apresentações e Canva':[
 ['basic','Um slide deve priorizar:',['Clareza e legibilidade','Muito texto pequeno','Várias fontes decorativas','Ausência de título'],0,'Slides devem comunicar rapidamente.'],
 ['basic','Qual recurso ajuda a organizar elementos?',['Alinhamento','Cores aleatórias','Texto sobreposto','Fonte tamanho 6'],0,'Alinhamento cria ordem visual.'],
 ['intermediate','Qual prática melhora um slide?',['Usar tópicos curtos e imagem relevante','Copiar um texto inteiro','Usar baixo contraste','Misturar dez cores'],0,'Conteúdo resumido e imagem relevante favorecem apresentação.'],
 ['intermediate','Contraste adequado significa:',['Diferença clara entre texto e fundo','Cores quase iguais','Somente tons cinza claros','Texto transparente'],0,'Contraste garante leitura.'],
 ['intermediate','O Canva pode ser usado para:',['Criar materiais visuais com modelos','Substituir antivírus','Aumentar RAM','Criar roteador'],0,'Canva é uma ferramenta de design visual.'],
 ['advanced','Uma apresentação possui dados de vendas. A melhor escolha é:',['Gráfico simples com título e fonte dos dados','Tabela completa em fonte 6','Imagem decorativa sem relação','Texto sem números'],0,'Gráfico contextualizado comunica os dados com clareza.']
],
'Google Forms':[
 ['basic','Qual tipo de pergunta permite escolher uma opção entre várias?',['Múltipla escolha','Parágrafo','Upload de arquivo','Data'],0,'Múltipla escolha permite uma resposta entre opções.'],
 ['basic','Marcar uma pergunta como obrigatória significa:',['Exigir resposta antes do envio','Apagar a pergunta','Criar gráfico','Compartilhar senha'],0,'O formulário não é enviado sem essa resposta.'],
 ['intermediate','Para permitir várias opções simultâneas, use:',['Caixas de seleção','Múltipla escolha','Resposta curta','Escala linear'],0,'Caixas de seleção aceitam várias escolhas.'],
 ['intermediate','Respostas do Forms podem ser enviadas para:',['Google Planilhas','Somente PDF','Impressora automaticamente','BIOS'],0,'A integração cria uma planilha de respostas.'],
 ['intermediate','Qual pergunta é mais objetiva?',['Você gostou?','Em uma escala de 1 a 5, como avalia o atendimento?','Fale tudo','Qualquer comentário sem contexto'],1,'Escala e contexto tornam a resposta comparável.'],
 ['advanced','Para evitar respostas duplicadas em uma pesquisa interna, pode-se:',['Limitar a uma resposta quando apropriado','Liberar envios infinitos','Remover identificação sempre','Usar somente parágrafo'],0,'Limite pode reduzir duplicidade, respeitando a finalidade da pesquisa.']
],
'Planilhas':[
 ['basic','Qual é o endereço da coluna C com a linha 5?',['5C','C5','B6','C4'],1,'A letra da coluna vem antes do número da linha.'],
 ['basic','Uma aba representa:',['Uma página dentro do arquivo de planilha','Uma senha','Um tipo de hardware','Um e-mail'],0,'Abas organizam conjuntos de dados no mesmo arquivo.'],
 ['intermediate','O intervalo B2:B10 inclui:',['Somente B2 e B10','Todas as células entre B2 e B10','As colunas B e 10','Duas abas'],1,'Dois-pontos indicam intervalo contínuo.'],
 ['intermediate','Qual estrutura é mais adequada?',['Cabeçalhos na primeira linha e um registro por linha','Dados misturados sem títulos','Uma cor por célula','Fórmulas em textos'],0,'Tabela estruturada facilita filtros e cálculos.'],
 ['intermediate','Qual permissão permite editar a planilha?',['Editor','Leitor','Comentador sem edição','Visitante'],0,'Editor pode alterar dados e fórmulas.'],
 ['advanced','Uma tabela será filtrada e usada em gráficos. O que evitar?',['Linhas vazias e células mescladas dentro da base','Cabeçalhos claros','Uma coluna por tipo de dado','Dados padronizados'],0,'Quebras e mesclagens dificultam operações de dados.'],
 ['intermediate','Para destacar automaticamente estoques abaixo de 10, o recurso mais adequado é:',['Formatação condicional','Negrito manual em todas as células','Criar uma aba por produto','Compartilhar como editor'],0,'A formatação condicional reage ao valor e destaca exceções automaticamente.'],
 ['intermediate','Qual ação organiza valores do maior para o menor?',['Classificação decrescente','Filtro por texto','Mesclar células','Renomear o arquivo'],0,'A classificação decrescente coloca os maiores valores no topo.'],
 ['advanced','Uma coluna Situação possui PAGO, Pago e pago. Qual recurso previne essa inconsistência?',['Validação de dados com lista suspensa','Aumentar a fonte','Aplicar bordas','Duplicar a aba'],0,'A validação padroniza as opções de entrada.'],
 ['advanced','Um dashboard precisa mostrar a evolução mensal das vendas. Qual gráfico é mais adequado?',['Gráfico de linhas','Gráfico de setores com muitos meses','Imagem decorativa','Tabela sem datas'],0,'Linhas facilitam observar tendências ao longo do tempo.']
],
'Fórmulas':[
 ['basic','Qual fórmula multiplica B2 por C2?',['=B2*C2','=B2xC2','B2*C2','=B2+C2'],0,'A fórmula começa com = e usa * para multiplicar.'],
 ['basic','Qual função soma B2 até B10?',['=SOMA(B2:B10)','=MÉDIA(B2:B10)','=CONT.SE(B2:B10)','=B2-B10'],0,'SOMA totaliza o intervalo.'],
 ['intermediate','Qual função calcula a média?',['MÉDIA','MÁXIMO','MÍNIMO','SE'],0,'MÉDIA calcula soma dividida pela quantidade.'],
 ['intermediate','Qual fórmula classifica estoque abaixo de 10?',['=SE(D2<10;"REPOR";"OK")','=SOMA(D2<10)','=CONT.SE(D2;10)','=D2&10'],0,'SE devolve um resultado conforme a condição.'],
 ['intermediate','Qual função conta quantos registros são PENDENTE?',['CONT.SE','SOMASE','MÉDIA','MÍNIMO'],0,'CONT.SE conta por critério.'],
 ['advanced','Qual fórmula soma valores em D2:D30 quando C2:C30 é Marketing?',['=SOMASE(C2:C30;"Marketing";D2:D30)','=CONT.SE(C2:C30;"Marketing")','=SOMA(C2:D30)','=SE(C2="Marketing";D2:D30)'],0,'SOMASE usa intervalo do critério, critério e intervalo da soma.'],
 ['intermediate','Qual função retorna o maior valor de E2:E20?',['=MÁXIMO(E2:E20)','=MÍNIMO(E2:E20)','=MÉDIA(E2:E20)','=SOMA(E2:E20)'],0,'MÁXIMO retorna o maior número do intervalo.'],
 ['intermediate','Qual função retorna o menor valor de F2:F20?',['=MÍNIMO(F2:F20)','=MÁXIMO(F2:F20)','=CONT.SE(F2:F20)','=SE(F2:F20)'],0,'MÍNIMO retorna o menor número do intervalo.'],
 ['intermediate','Qual fórmula une A2 e B2 com um hífen?',['=A2&"-"&B2','=A2-B2','=SOMA(A2:B2)','=CONT.SE(A2;B2)'],0,'O operador & concatena textos e valores.'],
 ['advanced','Qual fórmula conta valores maiores que 100 em C2:C40?',['=CONT.SE(C2:C40;">100")','=SOMASE(C2:C40;">100")','=MÁXIMO(C2:C40)','=SE(C2:C40>100)'],0,'CONT.SE usa o critério numérico entre aspas.'],
 ['advanced','Se G2 for igual a PAGO, mostrar CONCLUÍDO; senão, PENDENTE. Qual fórmula?',['=SE(G2="PAGO";"CONCLUÍDO";"PENDENTE")','=CONT.SE(G2;"PAGO")','=SOMASE(G2;"PAGO")','=G2&"PAGO"'],0,'A função SE compara o texto e devolve dois resultados possíveis.'],
 ['advanced','Qual fórmula soma H2:H50 somente quando G2:G50 for PENDENTE?',['=SOMASE(G2:G50;"PENDENTE";H2:H50)','=CONT.SE(G2:G50;"PENDENTE")','=SOMA(G2:H50)','=SE(G2="PENDENTE";H2:H50)'],0,'SOMASE usa a coluna de situação como critério e a coluna H como intervalo de soma.'],
 ['advanced','A fórmula =SE(D2<10;"OK";"REPOR") está invertida para indicar estoque baixo. Qual correção?',['=SE(D2<10;"REPOR";"OK")','=SE(D2>10;"REPOR";"OK")','=CONT.SE(D2;10)','=SOMA(D2)'],0,'Se o estoque for menor que 10, o resultado verdadeiro deve ser REPOR.'],
 ['advanced','Qual fórmula calcula a média de B2:B20 sem incluir o cabeçalho em B1?',['=MÉDIA(B2:B20)','=MÉDIA(B1:B20)','=SOMA(B2:B20)','=MÁXIMO(B2:B20)'],0,'O intervalo começa em B2 para excluir o cabeçalho.']
],
'Segurança digital':[
 ['basic','Uma senha forte deve:',['Ser longa e única','Usar apenas 123456','Ser igual em todos os sites','Conter o nome completo'],0,'Senhas longas e únicas reduzem riscos.'],
 ['basic','Phishing é uma tentativa de:',['Enganar para obter dados ou acesso','Melhorar conexão','Compactar arquivos','Criar gráficos'],0,'Phishing usa mensagens falsas para induzir ações.'],
 ['intermediate','Ao receber código de verificação sem solicitar, você deve:',['Não compartilhar e revisar a conta','Enviar ao remetente','Publicar no grupo','Ignorar toda segurança'],0,'Códigos são pessoais e podem indicar tentativa de acesso.'],
 ['intermediate','Autenticação em duas etapas adiciona:',['Uma segunda forma de confirmação','Uma fonte nova','Mais memória RAM','Uma planilha extra'],0,'O segundo fator dificulta acesso indevido.'],
 ['intermediate','Hash pode ser usado para verificar:',['Integridade de um arquivo','Tamanho da tela','Velocidade do mouse','Cor da fonte'],0,'Hashes ajudam a detectar alterações em dados.'],
 ['advanced','Um fornecedor envia novo boleto por e-mail com dados bancários diferentes. A ação correta é:',['Confirmar por canal oficial conhecido antes de pagar','Pagar rapidamente','Responder com senha','Encaminhar a todos'],0,'Alteração financeira exige verificação independente.']
],
'Rotinas administrativas':[
 ['basic','Para registrar produtos e valores, a ferramenta mais adequada é:',['Planilha','Editor de vídeo','Jogo','Calculadora sem registro'],0,'Planilhas organizam e calculam dados tabulares.'],
 ['basic','Para enviar um comunicado formal, use:',['E-mail profissional','Mensagem sem assunto','Conta compartilhada','Arquivo sem título'],0,'E-mail estruturado registra a comunicação.'],
 ['intermediate','Qual indicador ajuda a controlar estoque?',['Itens abaixo do mínimo','Quantidade de cores da tabela','Número de fontes','Tamanho do logo'],0,'Itens críticos orientam reposição.'],
 ['intermediate','Uma pesquisa de satisfação pode usar:',['Google Forms integrado a Planilhas','Somente imagem','Arquivo executável','BIOS'],0,'Forms coleta respostas e Planilhas permite analisar.'],
 ['intermediate','Antes de compartilhar relatório financeiro, deve-se:',['Revisar dados, destinatários e permissões','Publicar na internet','Remover o título','Enviar senha da conta'],0,'Conferência protege dados e reduz erros.'],
 ['advanced','Vendas caíram e o dashboard mostra aumento de cancelamentos. A melhor próxima ação é:',['Filtrar cancelamentos, identificar causas e comparar períodos','Excluir os dados','Mudar as cores','Ignorar o indicador'],0,'Análise deve investigar a causa antes de decidir.'],
 ['intermediate','Um relatório mensal deve apresentar total, média e maior venda. O melhor recurso é:',['Indicadores calculados por fórmulas','Somente cores manuais','Um texto sem dados','Uma imagem decorativa'],0,'Indicadores resumem resultados importantes para a gestão.'],
 ['advanced','O estoque crítico aumentou por três meses. Qual análise é mais adequada?',['Comparar saídas, entradas, prazos de compra e fornecedores','Excluir os registros antigos','Mudar o título','Ocultar os itens críticos'],0,'A decisão deve investigar causas operacionais e histórico.'],
 ['advanced','Respostas de um formulário chegam com categorias escritas de formas diferentes. Qual melhoria aplicar?',['Pergunta de lista ou múltipla escolha e validação na planilha','Usar somente parágrafo livre','Apagar as respostas','Adicionar mais cores'],0,'Opções padronizadas facilitam análise e evitam variações.']
]
};

export const QUESTIONS = Object.entries(rawQuestions).flatMap(([area,items])=>items.map((item,index)=>({
  id:`${area.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase()}-${index+1}`,
  area,difficulty:item[0],question:item[1],options:item[2],answer:item[3],explanation:item[4],
  classes: area==='Fórmulas'||area==='Planilhas'||area==='Rotinas administrativas' ? ['1ADM','2ADM'] : ['1ADM','2ADM'],
  topics: area==='Fórmulas'?['guided','formula']:area==='Planilhas'?['guided','sheet']:['general']
})));

export const CLASS_WEIGHTS = {
  '1ADM': {'Informática básica':2,'Hardware':2,'Arquivos e formatos':2,'Google Drive':3,'Documentos e e-mail':3,'Apresentações e Canva':2,'Google Forms':3,'Planilhas':9,'Fórmulas':10,'Segurança digital':3,'Rotinas administrativas':5},
  '2ADM': {'Informática básica':1,'Hardware':0,'Arquivos e formatos':2,'Google Drive':2,'Documentos e e-mail':3,'Apresentações e Canva':2,'Google Forms':2,'Planilhas':10,'Fórmulas':12,'Segurança digital':3,'Rotinas administrativas':7}
};

export const ACHIEVEMENTS = {
  fastLearner:{icon:'⚡',label:'Ritmo consistente'},
  persistent:{icon:'🧠',label:'Aprendiz persistente'},
  noHints:{icon:'🎯',label:'Autonomia total'},
  detailed:{icon:'🔎',label:'Investigador detalhista'},
  perfect:{icon:'🏆',label:'Desafio perfeito'}
};

const ENTERPRISE_OPERATIONS_V246={
  '1ADM-07':{
    deadlineMinutes:22,
    acceptedPriorityIds:['privacy-link','materials-deadline'],
    priorities:[
      {id:'privacy-link',label:'Corrigir acesso excessivo ao comunicado',detail:'Um colaborador externo recebeu permissão de Editor.',urgency:5,impact:5,dueMinutes:6},
      {id:'materials-deadline',label:'Concluir conferência de materiais',detail:'A capacitação começa em breve e depende do total confirmado.',urgency:5,impact:4,dueMinutes:10},
      {id:'visual-adjustment',label:'Ajustar detalhes visuais não essenciais',detail:'Alteração estética sem impacto no envio.',urgency:2,impact:2,dueMinutes:30}
    ],
    incidents:[{id:'incident-access',kind:'privacy',title:'Permissão excessiva em arquivo de capacitação',detail:'O link foi disponibilizado como Editor para uma pessoa que deveria apenas consultar.',severity:'high',recipient:'colaborador.externo@simulacao.edu.br',acceptedStrategies:['reduce-permission-notify','revoke-and-reshare']}],
    strategies:[
      {id:'parallel-review',label:'Dividir a revisão entre dados e acesso',detail:'Conferir materiais enquanto a permissão é corrigida.',accepted:true,tradeoff:'Ganha tempo, mas exige registrar claramente cada responsável.'},
      {id:'secure-first',label:'Conter o acesso antes de continuar',detail:'Corrigir a permissão e depois finalizar o relatório.',accepted:true,tradeoff:'Mais seguro, com pequeno impacto no prazo.'},
      {id:'send-draft',label:'Enviar o rascunho para ganhar tempo',detail:'Encaminhar antes de revisar permissões e valores.',accepted:false,tradeoff:'Aumenta o risco de informação incorreta e acesso indevido.'}
    ],deleteObsolete:true,requirePrivacy:true,requireStrategy:true
  },
  '1ADM-08':{
    deadlineMinutes:24,
    acceptedPriorityIds:['restore-approved','printer-contingency'],
    priorities:[
      {id:'restore-approved',label:'Restaurar o checklist aprovado',detail:'O arquivo foi enviado à lixeira e é necessário para validar a regularização.',urgency:5,impact:5,dueMinutes:8},
      {id:'printer-contingency',label:'Restabelecer a impressora de contingência',detail:'O setor precisa imprimir etiquetas e comprovantes.',urgency:5,impact:4,dueMinutes:12},
      {id:'archive-labels',label:'Renomear pastas antigas',detail:'Organização útil, mas sem bloqueio imediato.',urgency:2,impact:2,dueMinutes:35}
    ],
    incidents:[],
    strategies:[
      {id:'restore-then-validate',label:'Restaurar, conferir e só depois compartilhar',detail:'Recuperar o arquivo, validar a versão e seguir com a comunicação.',accepted:true,tradeoff:'Maior rastreabilidade e menor risco.'},
      {id:'recreate-from-source',label:'Recriar a evidência a partir da fonte atual',detail:'Produzir uma nova versão, mantendo a exclusão no histórico.',accepted:true,tradeoff:'Mais trabalho, mas pode ser adequado quando a versão da lixeira está desatualizada.'},
      {id:'ignore-trash',label:'Ignorar a lixeira e declarar a tarefa concluída',detail:'Prosseguir sem recuperar nem recriar a evidência.',accepted:false,tradeoff:'Não há comprovação da regularização.'}
    ],seedTrash:true,trashName:'checklist-regularizacao-aprovado.pdf',restoreRequired:true,deleteObsolete:true,requireStrategy:true
  },
  '2ADM-04':{
    deadlineMinutes:25,
    acceptedPriorityIds:['privacy-incident','budget-decision'],
    priorities:[
      {id:'privacy-incident',label:'Conter exposição de dados gerenciais',detail:'Um destinatário externo recebeu acesso a uma pasta do núcleo.',urgency:5,impact:5,dueMinutes:5},
      {id:'budget-decision',label:'Validar orçamento para decisão da direção',detail:'A implantação depende do custo consolidado.',urgency:5,impact:5,dueMinutes:12},
      {id:'equipment-catalog',label:'Atualizar catálogo visual de equipamentos',detail:'Melhoria de documentação sem bloquear a implantação.',urgency:2,impact:2,dueMinutes:40}
    ],
    incidents:[{id:'incident-privacy-2adm',kind:'privacy',title:'Envio para destinatário externo não autorizado',detail:'Uma versão preliminar do plano foi endereçada a um contato fora da equipe de implantação.',severity:'critical',recipient:'contato.externo@simulacao.edu.br',acceptedStrategies:['recall-notify-report','revoke-document-audit']}],
    strategies:[
      {id:'contain-and-parallelize',label:'Conter o incidente e distribuir as análises',detail:'Revogar o acesso, registrar o incidente e dividir orçamento, RH e documento.',accepted:true,tradeoff:'Resposta rápida com necessidade de coordenação.'},
      {id:'single-owner-sequential',label:'Centralizar a operação em um responsável',detail:'Uma pessoa executa todas as verificações em sequência.',accepted:true,tradeoff:'Maior controle, porém maior risco de atraso.'},
      {id:'keep-access-until-finish',label:'Manter o acesso externo até finalizar',detail:'Evitar interrupção e corrigir depois.',accepted:false,tradeoff:'Mantém uma exposição ativa de dados.'}
    ],deleteObsolete:true,requirePrivacy:true,requireStrategy:true
  },
  '2ADM-05':{
    deadlineMinutes:23,
    acceptedPriorityIds:['security-session','restore-continuity'],
    priorities:[
      {id:'security-session',label:'Bloquear sessão suspeita',detail:'Uma autenticação desconhecida permanece ativa.',urgency:5,impact:5,dueMinutes:4},
      {id:'restore-continuity',label:'Restaurar o plano de continuidade aprovado',detail:'A versão aprovada foi excluída durante a interrupção.',urgency:5,impact:5,dueMinutes:9},
      {id:'weekly-summary',label:'Preparar resumo semanal',detail:'Relatório útil, mas posterior à retomada.',urgency:2,impact:3,dueMinutes:45}
    ],
    incidents:[{id:'incident-continuity',kind:'privacy',title:'Sessão desconhecida e arquivo excluído',detail:'A continuidade exige bloquear a sessão e confirmar qual versão do plano será recuperada.',severity:'critical',acceptedStrategies:['block-restore-audit','isolate-recreate-report']}],
    strategies:[
      {id:'restore-approved-copy',label:'Bloquear a sessão e restaurar a versão aprovada',detail:'Recuperar a evidência da lixeira e conferir integridade.',accepted:true,tradeoff:'Mais rápido quando o arquivo restaurado continua atual.'},
      {id:'recreate-clean-copy',label:'Isolar o acesso e recriar uma versão limpa',detail:'Gerar novo arquivo com base nas fontes atuais.',accepted:true,tradeoff:'Mais seguro quando existe dúvida sobre a versão excluída.'},
      {id:'reuse-unknown-copy',label:'Usar uma cópia sem origem confirmada',detail:'Evitar retrabalho usando o primeiro arquivo encontrado.',accepted:false,tradeoff:'Pode propagar informação incorreta ou adulterada.'}
    ],seedTrash:true,trashName:'plano-continuidade-aprovado.pdf',restoreRequired:true,deleteObsolete:true,requirePrivacy:true,requireStrategy:true
  }
};
for(const [lessonId,operations] of Object.entries(ENTERPRISE_OPERATIONS_V246)){
  const lesson=LESSONS.find(item=>item.id===lessonId);if(!lesson)continue;
  lesson.curriculumRevision=`${lesson.curriculumRevision||'2026T2'}-operations-v246`;
  const stage=lesson.stages.find(item=>item.type==='enterprise-lab');if(!stage)continue;
  stage.config.operations=operations;
  const tasks=stage.config.tasks||[],requestId=tasks.find(item=>item.action==='mail-open-request')?.id||'mail-open-request';
  const insertBefore=(action,items)=>{const index=tasks.findIndex(item=>item.action===action);tasks.splice(index<0?tasks.length:index,0,...items)};
  const additions=[
    {id:'ops-review-priorities',action:'ops-review-priorities',app:'operations',prompt:'Analise prazo, urgência e impacto e defina a prioridade inicial.',why:'Priorizar evita que tarefas críticas sejam tratadas depois de atividades menos importantes.',requires:[requestId]},
    {id:'ops-select-strategy',action:'ops-select-strategy',app:'operations',prompt:'Escolha e registre uma estratégia viável para conduzir a operação.',why:'Mais de um caminho pode ser aceitável, desde que os riscos e os prazos sejam controlados.',requires:['ops-review-priorities']}
  ];
  if(operations.requirePrivacy)additions.push({id:'privacy-contain-incident',action:'privacy-contain-incident',app:'operations',prompt:'Contenha o incidente de privacidade e registre a resposta adotada.',why:'Destinatário incorreto ou acesso excessivo exige contenção, comunicação e rastreabilidade.',requires:[requestId]});
  if(operations.restoreRequired)additions.push({id:'files-restore-approved',action:'files-restore-approved',app:'operations',prompt:'Recupere ou substitua a evidência aprovada que está na lixeira.',why:'Arquivos excluídos não podem ser usados até que a versão correta seja restaurada ou recriada.',requires:[requestId]});
  insertBefore('mail-open-attachment',additions);
  if(operations.deleteObsolete)insertBefore('mail-attach-pdf',[{id:'files-delete-obsolete',action:'files-delete-obsolete',app:'operations',prompt:'Mova a versão obsoleta para a lixeira sem apagar a versão atual.',why:'Eliminar cópias antigas reduz o risco de anexar o documento errado.',requires:['files-review-version']}]);
  insertBefore('case-close',[{id:'ops-confirm-readiness',action:'ops-confirm-readiness',app:'operations',prompt:'Faça a conferência final de prazo, incidentes e arquivos antes de encerrar.',why:'O fechamento deve confirmar que os riscos foram tratados e a evidência enviada é a versão correta.',requires:['mail-send-reply','ops-review-priorities','ops-select-strategy',...(operations.requirePrivacy?['privacy-contain-incident']:[]),...(operations.restoreRequired?['files-restore-approved']:[]),...(operations.deleteObsolete?['files-delete-obsolete']:[])]}]);
  const close=tasks.find(item=>item.action==='case-close');if(close){close.requires=[...new Set([...(close.requires||[]),'ops-confirm-readiness'])]}
}
// v2.4.6: mantém a abertura pela solicitação e o encerramento formal como última tarefa.
for(const lessonId of ['1ADM-07','1ADM-08','2ADM-04','2ADM-05']){
  const stage=LESSONS.find(item=>item.id===lessonId)?.stages.find(item=>item.type==='enterprise-lab');if(!stage)continue;
  const tasks=stage.config.tasks||[],earlyActions=new Set(['ops-review-priorities','ops-select-strategy','privacy-contain-incident','files-restore-approved']);
  const early=tasks.filter(task=>earlyActions.has(task.action)),close=tasks.find(task=>task.action==='case-close');
  const ordered=tasks.filter(task=>!earlyActions.has(task.action)&&task.action!=='case-close'),requestIndex=ordered.findIndex(task=>task.action==='mail-open-request');
  ordered.splice(Math.max(0,requestIndex+1),0,...early);if(close)ordered.push(close);stage.config.tasks=ordered;
}


// v2.4.8 — 2º ADM focado em ferramentas administrativas, sem laboratório obrigatório de hardware.
{
  const lesson=LESSONS.find(item=>item.id==='2ADM-01');
  if(lesson){
    Object.assign(lesson,{
      curriculumRevision:'2026T2-admin2-office-v248',
      title:'Rotina administrativa com planilhas, fórmulas e comunicação',
      subtitle:'Organize uma base, aplique fórmulas essenciais, prepare um resumo e encaminhe a informação por e-mail.',
      icon:'📑',badge:'Assistente Administrativo Digital',estimated:'15–22 min',
      application:'Controle administrativo, acompanhamento de pendências, documentos e comunicação entre setores',
      evidence:'Planilha organizada, fórmulas validadas, resumo em PDF e mensagem profissional',
      objectives:['Organizar uma base administrativa','Aplicar fórmulas essenciais','Preparar um resumo profissional','Compartilhar e comunicar com segurança'],
      stages:[
        explain('Uma rotina administrativa conectada','No trabalho administrativo, a informação costuma passar por planilha, documento e e-mail.','Nesta aula, você receberá uma base fictícia de solicitações internas. Sua tarefa será organizar os registros, calcular totais, identificar pendências, preparar um resumo e encaminhá-lo à supervisão. O foco é usar ferramentas digitais de forma prática, sem conteúdo técnico de montagem de computadores.','Um assistente pode controlar pedidos em uma planilha, resumir a situação em um documento e comunicar a decisão por e-mail.','Confira dados e destinatários antes de concluir cada etapa.'),
        officeLab('Planilha de controle administrativo','Organize uma base curta de solicitações do escritório.',[
          {id:'freeze',prompt:'Congele a linha de cabeçalho.',action:'freeze-header',why:'Os títulos permanecem visíveis durante a conferência.'},
          {id:'filter',prompt:'Filtre somente os registros Pendentes.',action:'filter-pending',why:'O filtro concentra o trabalho nas solicitações abertas.'},
          {id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a identificar os maiores impactos.'},
          {id:'share',prompt:'Compartilhe a base com a supervisão como Comentador.',action:'share-commenter',why:'A supervisão pode revisar sem alterar os dados.'}
        ],{scenario:'Controle fictício de solicitações internas',columns:['Solicitação','Setor','Valor','Situação'],rows:[['Material de expediente','Compras','780','Pendente'],['Treinamento','RH','1250','Aprovado'],['Manutenção','Patrimônio','940','Pendente'],['Reembolso','Financeiro','430','Em análise']]}),
        formula('Fórmulas essenciais da rotina','Monte três fórmulas usadas em controles administrativos.',[
          {prompt:'Na base completa, somar os valores de C2 até C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'SOMA totaliza os valores do intervalo.'},
          {prompt:'Classificar D2 como ACOMPANHAR quando for Pendente',tokens:['=','SE','(','D2','=','"Pendente"',';','"ACOMPANHAR"',';','"OK"',')'],answer:'=SE(D2="Pendente";"ACOMPANHAR";"OK")',why:'SE transforma uma condição em orientação administrativa.'},
          {prompt:'Contar quantos registros estão Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'CONT.SE conta registros que atendem ao critério.'}
        ]),
        documentLab('Resumo administrativo','Prepare uma versão curta para acompanhamento.',[
          {id:'title',prompt:'Aplique estilo de título ao resumo.',action:'title-style',why:'O título identifica o documento.'},
          {id:'date',prompt:'Insira data e versão.',action:'add-date',why:'Data e versão evitam confusão entre arquivos.'},
          {id:'list',prompt:'Organize as pendências em lista.',action:'insert-list',why:'A lista facilita a leitura.'},
          {id:'perm',prompt:'Defina a supervisão como Comentador.',action:'permission-commenter',why:'Permite revisão sem edição direta.'},
          {id:'pdf',prompt:'Exporte a versão final em PDF.',action:'export-pdf',why:'O PDF preserva a apresentação do resumo.'}
        ],{documentTitle:'Resumo de solicitações administrativas',department:'Administração — AGV',date:'Agosto de 2026 · versão 1',intro:'Resumo fictício para acompanhamento da supervisão.',bullets:['Material de expediente pendente','Manutenção patrimonial pendente','Reembolso em análise'],signature:'Setor Administrativo',permission:'commenter',filename:'resumo-solicitacoes-administrativas.pdf'}),
        emailLab('Comunicação com a supervisão','Encaminhe o resumo produzido.',{scenario:'A supervisão solicitou uma atualização das pendências administrativas.',recipient:'supervisao.agv@simulacao.edu.br',subjectKeywords:['resumo','solicitações','pendências'],bodyKeywords:['olá','anexo','pendências','acompanhamento'],attachment:'resumo-solicitacoes-administrativas.pdf',hint:'Informe o que foi conferido, mencione o anexo e indique que a base foi compartilhada para comentários.'}),
        challenge('Fechamento da rotina','Confirme as decisões principais.',[
          {q:'Qual sequência reduz erros na rotina?',options:['Conferir a base, calcular, resumir e comunicar','Enviar o e-mail antes de abrir a planilha','Alterar valores para eliminar pendências','Compartilhar a senha do perfil com o setor'],answer:0,why:'A comunicação deve se apoiar em dados conferidos.'},
          {q:'Por que usar Comentador no compartilhamento?',options:['Permite revisão sem alterar diretamente a base','Libera edição ampla para qualquer pessoa com o link','Substitui a necessidade de revisar o documento','Remove automaticamente as versões anteriores'],answer:0,why:'Comentador equilibra colaboração e controle.'}
        ],'Assistente Administrativo Digital')
      ]
    });
  }
  for(const id of ['2ADM-04','2ADM-05']){
    const item=LESSONS.find(lesson=>lesson.id===id);if(!item)continue;
    item.curriculumRevision=`${item.curriculumRevision||'2026T2-admin2'}-office-v248`;
    const enterprise=item.stages.find(stage=>stage.type==='enterprise-lab');
    if(enterprise){
      enterprise.config.tasks=(enterprise.config.tasks||[]).filter(task=>task.app!=='assets'&&!String(task.action||'').startsWith('assets-'));
      const validTaskIds=new Set(enterprise.config.tasks.map(task=>task.id));
      for(const task of enterprise.config.tasks)task.requires=(task.requires||[]).filter(requirement=>validTaskIds.has(requirement));
      delete enterprise.config.assets;
      if(enterprise.config.request){
        enterprise.config.request.body=enterprise.config.request.body
          .replace(/Valide a estação, os custos, a equipe, as permissões e encaminhe o plano final\./,'Analise os dados, os custos, a equipe, as permissões e encaminhe o plano final.')
          .replace(/Diagnostique a estação, regularize a base e encaminhe o plano de retomada\./,'Regularize a base, revise os registros e encaminhe o plano de retomada.');
      }
    }
    if(id==='2ADM-04')Object.assign(item,{subtitle:'Resolva uma situação gerencial envolvendo planilha, RH, segurança, documentos e comunicação.',objectives:['Analisar dados e custos','Revisar informações de pessoas','Produzir documento gerencial','Comunicar a decisão com segurança']});
    if(id==='2ADM-05')Object.assign(item,{subtitle:'Resolva um caso alternativo com planilha, pessoas, documentos e comunicação.',objectives:['Regularizar uma base administrativa','Recalcular dados simulados','Documentar ações corretivas','Comunicar a retomada com segurança']});
  }
}


// v2.5.0 — trilhas administrativas sem jogos/3D, preservando integralmente o conteúdo das Aulas 1, 2 e 3 do 1º ADM.
{
  const replaceLesson=(id,definition)=>{const lesson=LESSONS.find(item=>item.id===id);if(lesson)Object.assign(lesson,definition)};
  replaceLesson('1ADM-04',{
    curriculumRevision:'2026T2-1adm-formulas-v250',title:'Fórmulas administrativas para RH e financeiro',subtitle:'Aprenda a construir e interpretar fórmulas usadas no controle de pessoas, despesas e pendências.',icon:'🧮',badge:'Assistente de Cálculos Administrativos',estimated:'15–22 min',
    application:'RH, financeiro, controle de despesas, frequência e acompanhamento de pendências',evidence:'Planilha com fórmulas validadas e resumo das decisões',
    objectives:['Entender a estrutura de uma fórmula','Aplicar SOMA, MÉDIA, SE e CONT.SE','Conferir referências e intervalos','Interpretar resultados administrativos'],
    stages:[
      explain('Por que usar fórmulas na Administração','Fórmulas transformam dados em informações para tomada de decisão.','Uma fórmula começa com o sinal = e combina referências de células, funções, operadores e critérios. Nesta aula, os dados são fictícios e representam situações comuns de RH e financeiro.','Exemplo: =SOMA(C2:C6) calcula o total de valores; =SE(D2="Pendente";"Acompanhar";"Regular") classifica uma situação.','Use o botão Preciso de ajuda sempre que precisar rever o significado de cada parte.'),
      officeLab('Base administrativa de RH e despesas','Organize a base antes de calcular.',[
        {id:'freeze',prompt:'Congele a linha de cabeçalho.',action:'freeze-header',why:'Os títulos permanecem visíveis durante a análise.'},
        {id:'filter',prompt:'Filtre somente os registros Pendentes.',action:'filter-pending',why:'O filtro concentra a análise nos casos que exigem ação.'},
        {id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a priorizar os maiores impactos.'},
        {id:'share',prompt:'Compartilhe com a supervisão como Comentador.',action:'share-commenter',why:'A supervisão revisa sem alterar diretamente os dados.'}
      ],{scenario:'Controle fictício de RH e financeiro',fileName:'Controle RH e Financeiro',columns:['Colaborador','Setor','Valor','Situação'],rows:[['Ana Lima','RH','950','Pendente'],['Carlos Souza','Financeiro','1250','Regular'],['Bianca Alves','Compras','780','Pendente'],['Diego Santos','Atendimento','1100','Regular']]}),
      formula('Construção guiada de fórmulas','Monte cada fórmula e observe quando ela é utilizada.',[
        {prompt:'Na base completa, somar os valores de C2 até C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'SOMA reúne os valores de um intervalo. É usada em despesas, pagamentos e totais.'},
        {prompt:'Na base completa, calcular a média dos valores de C2 até C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'MÉDIA ajuda a comparar valores e identificar comportamentos fora do padrão.'},
        {prompt:'Classificar D2 como ACOMPANHAR quando estiver Pendente',tokens:['=','SE','(','D2','=','"Pendente"',';','"ACOMPANHAR"',';','"REGULAR"',')'],answer:'=SE(D2="Pendente";"ACOMPANHAR";"REGULAR")',why:'SE avalia uma condição e retorna uma orientação.'},
        {prompt:'Contar quantos registros estão Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'CONT.SE conta quantas células atendem a um critério.'}
      ]),
      challenge('Conferência administrativa','Analise as decisões antes de finalizar.',[
        {q:'Qual é o primeiro símbolo de uma fórmula?',options:['O sinal de igual (=)','O sinal de porcentagem (%)','Um espaço em branco','O nome da planilha'],answer:0,why:'O sinal = informa à planilha que o conteúdo deve ser calculado.'},
        {q:'Quando CONT.SE é útil?',options:['Ao contar registros que atendem a um critério','Ao alterar a cor de todas as células','Ao enviar um e-mail automaticamente','Ao criar uma pasta no Drive'],answer:0,why:'CONT.SE é usada para contagens condicionais.'}
      ],'Assistente de Cálculos Administrativos')
    ]
  });
  replaceLesson('1ADM-05',{
    curriculumRevision:'2026T2-1adm-email-v250',title:'Gmail, Drive e envio profissional de documentos',subtitle:'Aprenda a localizar arquivos, revisar permissões, anexar e enviar uma mensagem administrativa.',icon:'✉️',badge:'Comunicador Administrativo',estimated:'15–22 min',application:'Comunicação entre setores, envio de relatórios e organização de documentos',evidence:'Documento em PDF e e-mail profissional enviado na simulação',objectives:['Interpretar uma solicitação por e-mail','Localizar o arquivo correto','Revisar destinatário, assunto e anexo','Compartilhar com a permissão adequada'],
    stages:[
      explain('E-mail profissional é registro administrativo','Uma mensagem profissional precisa ser clara, verificável e enviada às pessoas corretas.','Antes de enviar, confira destinatário, assunto, corpo, anexo e permissão do arquivo. Use CC apenas quando alguém precisa acompanhar a conversa e CCO quando houver necessidade legítima de preservar endereços.','Exemplo: encaminhar um relatório em PDF à supervisão, mantendo a coordenação em cópia.','Nunca use senhas reais ou dados pessoais nesta simulação.'),
      documentLab('Preparar o relatório','Formate, revise e exporte o relatório solicitado.',[
        {id:'title',prompt:'Aplique o estilo de título.',action:'title-style',why:'O título identifica o documento.'},{id:'date',prompt:'Insira data e versão.',action:'add-date',why:'Data e versão evitam confusão.'},{id:'list',prompt:'Organize as pendências em lista.',action:'insert-list',why:'A lista facilita a leitura.'},{id:'perm',prompt:'Compartilhe como Comentador.',action:'permission-commenter',why:'Permite revisão sem edição direta.'},{id:'pdf',prompt:'Exporte a versão final em PDF.',action:'export-pdf',why:'O PDF preserva a apresentação.'}
      ],{documentTitle:'Relatório administrativo semanal',department:'Administração — AGV',date:'Agosto de 2026 · versão 1',intro:'Resumo fictício de pendências e encaminhamentos.',bullets:['Conferir materiais','Atualizar escala','Encaminhar relatório'],signature:'Setor Administrativo',permission:'commenter',filename:'relatorio-administrativo-semanal.pdf'}),
      emailLab('Responder à solicitação','Abra a conversa, revise e envie o arquivo correto.',{scenario:'A supervisão solicitou o relatório administrativo semanal.',recipient:'supervisao.agv@simulacao.edu.br',cc:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['relatório','administrativo','semanal'],bodyKeywords:['olá','anexo','relatório','atenciosamente'],attachment:'relatorio-administrativo-semanal.pdf',hint:'Explique o que está sendo enviado, mencione o anexo e mantenha uma linguagem profissional.'}),
      challenge('Revisão antes do envio','Confirme boas práticas.',[
        {q:'O que deve ser conferido antes de enviar?',options:['Destinatários, assunto, texto, anexo e acesso','Apenas a aparência visual da mensagem','Somente a assinatura e o encerramento','Apenas o nome e o tamanho do arquivo'],answer:0,why:'A revisão completa reduz erros e incidentes.'},
        {q:'Por que usar Comentador?',options:['Para permitir revisão sem edição direta','Para liberar edição a qualquer pessoa com o link','Para substituir o controle de versões do arquivo','Para enviar o documento sem revisar o conteúdo'],answer:0,why:'É a menor permissão adequada para revisão.'}
      ],'Comunicador Administrativo')
    ]
  });
  replaceLesson('1ADM-06',{
    curriculumRevision:'2026T2-1adm-slides-v250',title:'Google Apresentações aplicado à Administração',subtitle:'Monte uma apresentação curta com título, dados, gráfico, conclusão e compartilhamento.',icon:'📊',badge:'Apresentador Administrativo',estimated:'15–22 min',application:'Reuniões, apresentação de resultados, projetos, propostas e relatórios',evidence:'Apresentação administrativa revisada e compartilhada',objectives:['Escolher um layout adequado','Organizar informações em slides','Inserir gráfico e lista','Compartilhar e apresentar com clareza'],
    stages:[
      explain('Apresentações apoiam decisões','Slides devem resumir informações, não substituir a fala.','Uma apresentação administrativa eficiente possui objetivo, poucos textos por slide, dados legíveis, fonte adequada, contraste e conclusão. O fluxo simulado é semelhante ao de ferramentas de apresentações online.','Exemplo: apresentar pendências, custos e próximos passos em quatro slides.','Evite excesso de texto, animações desnecessárias e dados sem fonte.'),
      presentationLab('Apresentação de resultados administrativos','Crie uma apresentação curta para uma reunião de acompanhamento.',[
        {id:'layout',prompt:'Escolha o layout Título e conteúdo.',action:'layout-title-content',why:'O layout organiza título e informações.'},
        {id:'title',prompt:'Insira o título da apresentação.',action:'add-title',why:'O título informa o assunto da reunião.'},
        {id:'bullets',prompt:'Adicione uma lista de pontos principais.',action:'add-bullets',why:'Listas curtas facilitam a leitura.'},
        {id:'chart',prompt:'Insira um gráfico de colunas com dados administrativos.',action:'insert-chart',why:'O gráfico facilita a comparação.'},
        {id:'notes',prompt:'Adicione uma nota do apresentador.',action:'add-notes',why:'As notas ajudam a lembrar explicações sem poluir o slide.'},
        {id:'share',prompt:'Compartilhe a apresentação como Leitor.',action:'share-viewer',why:'Leitor permite consulta sem alteração.'},
        {id:'present',prompt:'Inicie o modo de apresentação.',action:'present',why:'A visualização final permite conferir legibilidade e sequência.'}
      ],{title:'Resultados administrativos — agosto',theme:'profissional',slides:['Capa','Indicadores','Pendências','Próximos passos'],bulletItems:['Materiais pendentes','Escalas a atualizar','Relatórios a encaminhar'],chartTitle:'Pendências por setor',chartData:[{label:'RH',value:3},{label:'Compras',value:5},{label:'Financeiro',value:2},{label:'Patrimônio',value:4}],speakerNotes:'Explicar que os valores são fictícios e indicar o setor com maior quantidade de pendências.'}),
      challenge('Qualidade da apresentação','Revise as escolhas.',[
        {q:'Qual prática melhora a legibilidade?',options:['Usar pouco texto e bom contraste','Preencher todo o slide com parágrafos','Usar várias fontes diferentes','Colocar animações em cada palavra'],answer:0,why:'Síntese e contraste favorecem a compreensão.'},
        {q:'Quando usar gráfico?',options:['Quando ajuda a comparar ou mostrar evolução','Quando o slide precisa apenas parecer mais preenchido','Quando o gráfico pode substituir toda a explicação','Quando os valores não devem ficar claramente visíveis'],answer:0,why:'Gráfico deve ter finalidade informativa.'}
      ],'Apresentador Administrativo')
    ]
  });
  replaceLesson('1ADM-07',{
    curriculumRevision:'2026T2-1adm-assessment-v250',title:'Avaliação prática — rotina administrativa integrada',subtitle:'Resolva uma demanda usando planilha, fórmulas, documento, apresentação e e-mail.',icon:'✅',badge:'Assistente Administrativo Integrado',estimated:'15–25 min',application:'Execução integrada de uma rotina administrativa',evidence:'Arquivos preparados, comunicação simulada e comprovante da sessão',objectives:['Organizar dados','Aplicar fórmulas','Produzir documentos e apresentação','Comunicar a entrega'],
    stages:[
      officeLab('Planilha da avaliação','Organize os dados fictícios da demanda.',[{id:'filter',prompt:'Filtre os registros Pendentes.',action:'filter-pending',why:'Identifica o que exige ação.'},{id:'sort',prompt:'Ordene os valores do maior para o menor.',action:'sort-desc',why:'Ajuda a priorizar.'},{id:'share',prompt:'Compartilhe como Comentador.',action:'share-commenter',why:'Permite revisão.'}],{scenario:'Avaliação administrativa',columns:['Demanda','Setor','Valor','Situação'],rows:[['Material','Compras','620','Pendente'],['Escala','RH','980','Regular'],['Manutenção','Patrimônio','1450','Pendente']]}),
      formula('Fórmulas da avaliação','Construa as fórmulas solicitadas.',[{prompt:'Somar C2:C4',tokens:['=','SOMA','(','C2:C4',')'],answer:'=SOMA(C2:C4)',why:'Totaliza os valores.'},{prompt:'Contar Pendentes em D2:D4',tokens:['=','CONT.SE','(','D2:D4',';','"Pendente"',')'],answer:'=CONT.SE(D2:D4;"Pendente")',why:'Conta as pendências.'}]),
      documentLab('Resumo da avaliação','Prepare o resumo e gere o PDF.',[{id:'title',prompt:'Aplique título.',action:'title-style',why:'Identifica o documento.'},{id:'date',prompt:'Insira data e versão.',action:'add-date',why:'Controla a versão.'},{id:'pdf',prompt:'Exporte em PDF.',action:'export-pdf',why:'Prepara a evidência.'}],{documentTitle:'Resumo da avaliação administrativa',department:'Administração — AGV',date:'Agosto de 2026 · versão final',intro:'Síntese fictícia da demanda.',bullets:['Dados conferidos','Pendências priorizadas','Encaminhamento preparado'],signature:'Assistente Administrativo',filename:'avaliacao-administrativa.pdf'}),
      presentationLab('Síntese para reunião','Prepare dois elementos essenciais da apresentação.',[{id:'title',prompt:'Insira o título.',action:'add-title',why:'Identifica o assunto.'},{id:'chart',prompt:'Insira um gráfico.',action:'insert-chart',why:'Resume os dados.'},{id:'share',prompt:'Compartilhe como Leitor.',action:'share-viewer',why:'Evita alterações.'}],{title:'Síntese da avaliação',slides:['Capa','Indicadores','Conclusão']}),
      emailLab('Entrega simulada','Encaminhe o PDF à supervisão.',{scenario:'A supervisão aguarda o resultado da avaliação prática.',recipient:'supervisao.agv@simulacao.edu.br',subjectKeywords:['avaliação','administrativa'],bodyKeywords:['olá','anexo','resultado','atenciosamente'],attachment:'avaliacao-administrativa.pdf',hint:'Informe que os dados foram conferidos e que o PDF segue anexo.'})
    ]
  });
  replaceLesson('1ADM-08',{
    curriculumRevision:'2026T2-1adm-recovery-v250',title:'Recuperação prática — reorganização administrativa',subtitle:'Resolva um caso alternativo com planilha, fórmulas, apresentação e comunicação.',icon:'↻',badge:'Assistente em Recuperação',estimated:'15–25 min',application:'Correção de uma rotina administrativa com outro cenário',evidence:'Base corrigida, resumo e comunicação final',objectives:['Corrigir dados','Reaplicar fórmulas','Organizar uma apresentação','Comunicar uma solução'],
    stages:[
      explain('Recuperar é demonstrar aprendizagem por outro caminho','A recuperação usa um cenário diferente da avaliação.','Você deverá corrigir informações, construir fórmulas, organizar uma síntese e comunicar a solução.','Exemplo: regularizar uma base de solicitações atrasadas.','Leia o contexto antes de executar cada ação.'),
      officeLab('Base de recuperação','Regularize a planilha fictícia.',[{id:'freeze',prompt:'Congele o cabeçalho.',action:'freeze-header',why:'Mantém títulos visíveis.'},{id:'filter',prompt:'Filtre os registros Atrasados.',action:'filter-delayed',why:'Concentra a análise.'},{id:'share',prompt:'Compartilhe como Leitor.',action:'share-reader',why:'Permite consulta sem alteração.'}],{scenario:'Recuperação administrativa',columns:['Processo','Responsável','Valor','Situação'],rows:[['Pedido 101','Compras','530','Atrasado'],['Pedido 102','RH','760','Regular'],['Pedido 103','Financeiro','890','Atrasado']]}),
      formula('Fórmulas da recuperação','Monte as fórmulas para o novo cenário.',[{prompt:'Calcular a média de C2:C4',tokens:['=','MÉDIA','(','C2:C4',')'],answer:'=MÉDIA(C2:C4)',why:'MÉDIA resume o valor típico.'},{prompt:'Contar Atrasado em D2:D4',tokens:['=','CONT.SE','(','D2:D4',';','"Atrasado"',')'],answer:'=CONT.SE(D2:D4;"Atrasado")',why:'Conta os atrasos.'}]),
      presentationLab('Plano de regularização','Monte uma síntese para reunião.',[{id:'layout',prompt:'Escolha o layout.',action:'layout-title-content',why:'Organiza o conteúdo.'},{id:'bullets',prompt:'Adicione os passos de correção.',action:'add-bullets',why:'Facilita o acompanhamento.'},{id:'present',prompt:'Inicie a apresentação.',action:'present',why:'Permite revisar a sequência.'}],{title:'Plano de regularização',slides:['Capa','Problemas','Ações','Prazo']}),
      emailLab('Comunicar a recuperação','Envie o plano à coordenação.',{scenario:'A coordenação solicitou o plano de regularização.',recipient:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['plano','regularização'],bodyKeywords:['olá','plano','ações','atenciosamente'],attachment:'plano-regularizacao.pdf',hint:'Resuma as correções e indique o arquivo preparado.'})
    ]
  });
  replaceLesson('2ADM-02',{
    curriculumRevision:'2026T2-2adm-formulas-v250',title:'Planilhas e fórmulas para RH e financeiro',subtitle:'Aplique fórmulas, filtros e decisões em uma base administrativa mais enxuta.',icon:'📈',badge:'Analista Administrativo',estimated:'15–22 min',application:'RH, financeiro e acompanhamento gerencial',evidence:'Planilha analisada e fórmulas validadas',objectives:['Aplicar SOMA, MÉDIA, SE, CONT.SE e SOMASE','Interpretar resultados','Filtrar e ordenar dados','Compartilhar com segurança'],
    stages:[
      explain('Fórmulas para analisar, não apenas calcular','No 2º ADM, a fórmula deve apoiar uma decisão.','Além de escrever a fórmula, observe quais dados foram usados e como o resultado pode orientar RH ou financeiro.','Exemplo: SOMASE totaliza apenas os valores de um setor ou situação.','Confira intervalos, critérios e aspas.'),
      officeLab('Base gerencial','Organize a base para análise.',[{id:'filter',prompt:'Filtre os registros Pendentes.',action:'filter-pending',why:'Isola casos em aberto.'},{id:'sort',prompt:'Ordene do maior para o menor.',action:'sort-desc',why:'Prioriza impactos.'},{id:'share',prompt:'Compartilhe como Comentador.',action:'share-commenter',why:'Permite revisão.'}],{scenario:'Base gerencial fictícia',columns:['Colaborador','Setor','Valor','Situação'],rows:[['Aline','RH','1200','Pendente'],['Bruno','Financeiro','1800','Regular'],['Carla','RH','900','Pendente'],['Daniel','Compras','1500','Regular']]}),
      formula('Análise por fórmulas','Monte e interprete as fórmulas.',[{prompt:'Na base completa, somar C2:C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'Total geral.'},{prompt:'Na base completa, calcular a MÉDIA de C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'Valor médio.'},{prompt:'Contar Pendente em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'Quantidade de pendências.'},{prompt:'Somar valores do setor RH',tokens:['=','SOMASE','(','B2:B5',';','"RH"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"RH";C2:C5)',why:'Totaliza somente os registros do setor RH.'}]),
      challenge('Decisão gerencial','Interprete os resultados.',[{q:'O que SOMASE permite?',options:['Somar valores que atendem a um critério','Somar todas as células sem condição','Alterar permissões de um arquivo','Enviar mensagens em massa'],answer:0,why:'SOMASE usa intervalo de critério e intervalo de soma.'}], 'Analista Administrativo')
    ]
  });
  replaceLesson('2ADM-03',{
    curriculumRevision:'2026T2-2adm-comunicacao-v250',title:'Gmail, documentos e Google Apresentações',subtitle:'Prepare materiais profissionais e comunique uma decisão entre setores.',icon:'🗂️',badge:'Analista de Comunicação Administrativa',estimated:'15–22 min',application:'Relatórios, reuniões e comunicação gerencial',evidence:'Documento, apresentação e e-mail profissional',objectives:['Revisar documento e permissões','Criar apresentação gerencial','Anexar ou compartilhar arquivo','Comunicar decisão com clareza'],
    stages:[
      documentLab('Documento gerencial','Revise e prepare o PDF.',[{id:'title',prompt:'Aplique título.',action:'title-style',why:'Identifica o documento.'},{id:'date',prompt:'Insira data e versão.',action:'add-date',why:'Controla versões.'},{id:'comment',prompt:'Adicione um comentário de revisão.',action:'add-comment',why:'Registra a observação.'},{id:'perm',prompt:'Compartilhe como Comentador.',action:'permission-commenter',why:'Permite revisão.'},{id:'pdf',prompt:'Exporte em PDF.',action:'export-pdf',why:'Prepara a versão final.'}],{documentTitle:'Relatório gerencial de acompanhamento',department:'Administração — AGV',date:'Agosto de 2026 · versão gerencial',intro:'Dados fictícios para atividade.',bullets:['Indicadores conferidos','Pendências registradas','Ações propostas'],signature:'Equipe Administrativa',permission:'commenter',filename:'relatorio-gerencial.pdf'}),
      presentationLab('Apresentação gerencial','Prepare uma apresentação para reunião.',[{id:'layout',prompt:'Escolha Título e conteúdo.',action:'layout-title-content',why:'Cria uma estrutura adequada.'},{id:'title',prompt:'Insira o título.',action:'add-title',why:'Informa o assunto.'},{id:'chart',prompt:'Insira um gráfico.',action:'insert-chart',why:'Compara indicadores.'},{id:'notes',prompt:'Adicione notas do apresentador.',action:'add-notes',why:'Apoia a fala.'},{id:'share',prompt:'Compartilhe como Leitor.',action:'share-viewer',why:'Preserva o arquivo.'}],{title:'Acompanhamento gerencial',slides:['Capa','Indicadores','Riscos','Ações'],bulletItems:['Indicadores conferidos','Pendências registradas','Ações propostas'],chartTitle:'Pendências fictícias por setor',chartData:[{label:'RH',value:4},{label:'Financeiro',value:3},{label:'Compras',value:2},{label:'Patrimônio',value:1}],speakerNotes:'Explicar a origem fictícia dos indicadores e os próximos encaminhamentos.'}),
      emailLab('Comunicação gerencial','Encaminhe o relatório e a apresentação.',{scenario:'A direção solicitou os materiais da reunião.',recipient:'direcao.agv@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',subjectKeywords:['reunião','gerencial'],bodyKeywords:['olá','relatório','apresentação','atenciosamente'],attachment:'relatorio-gerencial.pdf',hint:'Informe a finalidade da mensagem e revise o acesso aos arquivos.'})
    ]
  });
  for(const id of ['2ADM-04','2ADM-05']){
    const lesson=LESSONS.find(item=>item.id===id);if(!lesson)continue;
    lesson.curriculumRevision=`2026T2-2adm-integrated-v250-${id.endsWith('04')?'assessment':'recovery'}`;
    lesson.title=id.endsWith('04')?'Avaliação prática — ferramentas administrativas':'Recuperação prática — solução administrativa';
    lesson.subtitle='Use planilha, fórmulas, documento, apresentação e e-mail em um cenário administrativo.';
    lesson.objectives=['Analisar dados','Aplicar fórmulas','Preparar materiais','Comunicar a solução'];
    lesson.stages=[
      officeLab(id.endsWith('04')?'Planilha da avaliação':'Planilha da recuperação','Organize a base da atividade.',[{id:'filter',prompt:'Filtre os registros Pendentes.',action:'filter-pending',why:'Identifica casos abertos.'},{id:'sort',prompt:'Ordene os valores.',action:'sort-desc',why:'Apoia a prioridade.'},{id:'share',prompt:'Compartilhe como Comentador.',action:'share-commenter',why:'Permite revisão.'}],{scenario:id.endsWith('04')?'Avaliação 2º ADM':'Recuperação 2º ADM',columns:['Processo','Setor','Valor','Situação'],rows:[['Processo A','RH','1700','Pendente'],['Processo B','Financeiro','2300','Regular'],['Processo C','Compras','1250','Pendente']]}),
      formula('Fórmulas da atividade','Monte as fórmulas.',[{prompt:'Somar C2:C4',tokens:['=','SOMA','(','C2:C4',')'],answer:'=SOMA(C2:C4)',why:'Totaliza os valores.'},{prompt:'Contar Pendente em D2:D4',tokens:['=','CONT.SE','(','D2:D4',';','"Pendente"',')'],answer:'=CONT.SE(D2:D4;"Pendente")',why:'Conta os casos em aberto.'},{prompt:'Somar valores do setor RH',tokens:['=','SOMASE','(','B2:B4',';','"RH"',';','C2:C4',')'],answer:'=SOMASE(B2:B4;"RH";C2:C4)',why:'Totaliza o setor escolhido.'}]),
      presentationLab('Apresentação da solução','Prepare uma síntese profissional.',[{id:'title',prompt:'Insira o título.',action:'add-title',why:'Identifica o assunto.'},{id:'bullets',prompt:'Adicione os pontos principais.',action:'add-bullets',why:'Organiza a síntese.'},{id:'chart',prompt:'Insira o gráfico.',action:'insert-chart',why:'Resume os dados.'},{id:'present',prompt:'Inicie a apresentação.',action:'present',why:'Confere o resultado.'}],{title:id.endsWith('04')?'Resultado da avaliação':'Plano de recuperação',slides:['Capa','Dados','Ações','Conclusão']}),
      emailLab('Comunicação final','Envie o resumo para a direção.',{scenario:'A direção aguarda a solução administrativa.',recipient:'direcao.agv@simulacao.edu.br',subjectKeywords:[id.endsWith('04')?'avaliação':'recuperação','administrativa'],bodyKeywords:['olá','resultado','anexo','atenciosamente'],attachment:id.endsWith('04')?'avaliacao-2adm.pdf':'recuperacao-2adm.pdf',hint:'Explique a solução, mencione o arquivo e revise os destinatários.'})
    ];
  }
}

// v2.5.2 — revisão de coerência, responsividade e avaliação prática.
// As Aulas 1, 2 e 3 do 1º ADM permanecem congeladas em conteúdo.
{
  const replaceLessonV252=(id,definition)=>{const lesson=LESSONS.find(item=>item.id===id);if(lesson)Object.assign(lesson,definition)};

  replaceLessonV252('1ADM-07',{
    curriculumRevision:'2026T2-1adm-assessment-v252',
    title:'Avaliação prática — rotina administrativa integrada',
    subtitle:'Analise uma solicitação, organize dados, produza evidências e comunique a solução com autonomia.',
    estimated:'15–25 min',
    application:'Compras, RH, patrimônio, comunicação e acompanhamento de pendências',
    evidence:'Planilha analisada, relatório em PDF, apresentação e e-mail profissional',
    objectives:['Interpretar uma demanda administrativa','Organizar e analisar dados','Produzir uma evidência profissional','Comunicar a solução com segurança'],
    stages:[
      explain('Briefing da avaliação','Você atuará como assistente administrativo em uma rotina integrada.','A coordenação enviou uma base fictícia com solicitações de diferentes setores. Analise a situação, destaque o que exige acompanhamento, organize os registros pelo impacto, prepare um relatório e comunique a conclusão. A avaliação permite consultar as ferramentas em ordens diferentes, desde que as evidências finais estejam corretas.','Antes de enviar, confira se o PDF produzido é a versão atual e se o destinatário possui apenas a permissão necessária.','O botão Preciso de ajuda explica a interface, mas não informa qual decisão você deve tomar.'),
      officeLab('Base da avaliação','Prepare a base para uma decisão administrativa.',[
        {id:'filter',prompt:'Mostre somente as demandas com situação Pendente.',action:'filter-pending',why:'A filtragem concentra a análise nos casos em aberto.'},
        {id:'sort',prompt:'Organize os registros para que os maiores impactos financeiros apareçam primeiro.',action:'sort-desc',why:'A ordenação ajuda a definir prioridades.'},
        {id:'share',prompt:'Disponibilize a base para revisão, sem permitir alteração direta dos dados.',action:'share-commenter',why:'A função Comentador permite revisão com menor risco de alterações indevidas.'}
      ],{scenario:'Avaliação — acompanhamento administrativo',fileName:'Solicitações administrativas — avaliação',columns:['Solicitação','Setor','Valor','Situação'],rows:[['Reposição de materiais','Compras','1380','Pendente'],['Atualização de escala','RH','640','Regular'],['Manutenção de impressora','Patrimônio','970','Pendente'],['Conferência de reembolso','Financeiro','520','Em análise']]}),
      formula('Cálculos da avaliação','Construa as fórmulas necessárias para conferir a base.',[
        {prompt:'Na base completa, calcule o total dos valores registrados em C2:C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'O total apoia a estimativa do impacto financeiro.'},
        {prompt:'Determine quantas demandas permanecem Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'A contagem identifica o volume de casos que exigem ação.'}
      ]),
      documentLab('Relatório da avaliação','Transforme a análise em uma evidência profissional.',[
        {id:'title',prompt:'Identifique o relatório com um título adequado.',action:'title-style',why:'O título deixa clara a finalidade do documento.'},
        {id:'date',prompt:'Registre data e versão.',action:'add-date',why:'Data e versão preservam a rastreabilidade.'},
        {id:'list',prompt:'Organize as principais pendências em uma lista.',action:'insert-list',why:'A lista facilita a conferência pela coordenação.'},
        {id:'perm',prompt:'Permita que a coordenação revise o relatório sem edição direta.',action:'permission-commenter',why:'Comentador é suficiente para revisão.'},
        {id:'pdf',prompt:'Gere a versão final em PDF.',action:'export-pdf',why:'O PDF preserva a apresentação e cria a evidência da avaliação.'}
      ],{documentTitle:'Relatório de acompanhamento administrativo',department:'Administração — AGV',date:'Agosto de 2026 · avaliação',intro:'Síntese fictícia das solicitações que exigem acompanhamento.',bullets:['Reposição de materiais pendente','Manutenção de impressora pendente','Reembolso em análise'],signature:'Assistente Administrativo',permission:'commenter',filename:'avaliacao-administrativa.pdf'}),
      presentationLab('Síntese para reunião','Apresente os resultados de forma curta e legível.',[
        {id:'layout',prompt:'Escolha uma estrutura adequada para título e conteúdo.',action:'layout-title-content',why:'O layout organiza a leitura.'},
        {id:'title',prompt:'Identifique o assunto da reunião.',action:'add-title',why:'O título orienta o público.'},
        {id:'bullets',prompt:'Resuma as principais decisões em tópicos.',action:'add-bullets',why:'Tópicos curtos evitam excesso de texto.'},
        {id:'chart',prompt:'Use um gráfico para comparar as demandas por setor.',action:'insert-chart',why:'O gráfico facilita a comparação.'},
        {id:'present',prompt:'Revise a apresentação no modo de exibição.',action:'present',why:'A revisão final ajuda a encontrar cortes e problemas de legibilidade.'}
      ],{title:'Acompanhamento administrativo — avaliação',slides:['Capa','Demandas por setor','Prioridades','Próximos passos'],bulletItems:['Reposição de materiais pendente','Manutenção da impressora pendente','Reembolso em análise'],chartTitle:'Valores das solicitações por setor',chartData:[{label:'Compras',value:1380},{label:'RH',value:640},{label:'Patrimônio',value:970},{label:'Financeiro',value:520}],speakerNotes:'Destacar as demandas pendentes e explicar que o reembolso permanece em análise.'}),
      emailLab('Comunicação da avaliação','Encaminhe a evidência produzida à coordenação.',{scenario:'A coordenação aguarda o relatório final da avaliação.',recipient:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['avaliação','administrativa','relatório'],bodyKeywords:['olá','relatório','pendências','anexo','atenciosamente'],attachment:'avaliacao-administrativa.pdf',hint:'Explique brevemente o que foi analisado, mencione o PDF e revise destinatário, assunto e acesso antes de enviar.'})
    ]
  });

  replaceLessonV252('1ADM-08',{
    curriculumRevision:'2026T2-1adm-recovery-v252',
    title:'Recuperação prática — regularização administrativa',
    subtitle:'Resolva um cenário diferente da avaliação, corrigindo uma base e produzindo um plano de regularização.',
    estimated:'15–25 min',
    application:'Regularização de solicitações atrasadas, documentação e comunicação',
    evidence:'Base corrigida, plano em PDF, apresentação e mensagem profissional',
    objectives:['Identificar atrasos','Reaplicar fórmulas em outro contexto','Produzir um plano de regularização','Comunicar as ações corretivas'],
    stages:[
      explain('Recuperação por outro caminho','Esta atividade verifica as mesmas competências em um cenário diferente.','Uma base fictícia possui processos atrasados e precisa ser regularizada. Analise os dados, calcule indicadores, prepare um plano de ação e comunique os encaminhamentos.','A recuperação não repete os dados nem as mesmas decisões da avaliação.','Leia o contexto e use Preciso de ajuda somente para entender a ferramenta.'),
      officeLab('Base de regularização','Organize os processos para planejar as correções.',[
        {id:'freeze',prompt:'Mantenha os títulos visíveis durante a análise.',action:'freeze-header',why:'O cabeçalho congelado facilita a leitura.'},
        {id:'filter',prompt:'Mostre somente os processos que estão atrasados.',action:'filter-delayed',why:'O filtro concentra o trabalho nos casos críticos.'},
        {id:'share',prompt:'Disponibilize a base somente para consulta da coordenação.',action:'share-reader',why:'Leitor é suficiente quando não haverá revisão no arquivo original.'}
      ],{scenario:'Recuperação — processos administrativos atrasados',fileName:'Processos para regularização',columns:['Processo','Responsável','Valor','Situação'],rows:[['Pedido 101','Compras','530','Atrasado'],['Pedido 102','RH','760','Regular'],['Pedido 103','Financeiro','890','Atrasado'],['Pedido 104','Patrimônio','610','Em revisão']]}),
      formula('Indicadores da recuperação','Calcule informações diferentes das usadas na avaliação.',[
        {prompt:'Na base completa, calcule a média dos valores de C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'A média ajuda a comparar o valor típico dos processos.'},
        {prompt:'Conte quantos processos estão Atrasados em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Atrasado"',')'],answer:'=CONT.SE(D2:D5;"Atrasado")',why:'A contagem dimensiona a quantidade de atrasos.'}
      ]),
      documentLab('Plano de regularização','Produza o arquivo que será entregue à coordenação.',[
        {id:'title',prompt:'Aplique um título ao plano.',action:'title-style',why:'O título identifica a finalidade do documento.'},
        {id:'date',prompt:'Registre data e versão.',action:'add-date',why:'O controle de versão evita o uso de cópias antigas.'},
        {id:'list',prompt:'Organize as ações corretivas em uma lista.',action:'insert-list',why:'A lista transforma a análise em ações verificáveis.'},
        {id:'perm',prompt:'Permita comentários da coordenação.',action:'permission-commenter',why:'A coordenação pode revisar o plano sem editar diretamente.'},
        {id:'pdf',prompt:'Exporte o plano em PDF.',action:'export-pdf',why:'O PDF será anexado na comunicação final.'}
      ],{documentTitle:'Plano de regularização administrativa',department:'Administração — AGV',date:'Agosto de 2026 · recuperação',intro:'Plano fictício para regularização de processos atrasados.',bullets:['Priorizar os processos atrasados','Confirmar responsáveis e prazos','Registrar a conclusão das correções'],signature:'Assistente Administrativo',permission:'commenter',filename:'plano-regularizacao.pdf'}),
      presentationLab('Reunião de regularização','Organize uma síntese visual das ações propostas.',[
        {id:'layout',prompt:'Escolha uma estrutura para título e conteúdo.',action:'layout-title-content',why:'A estrutura mantém o slide organizado.'},
        {id:'title',prompt:'Identifique o plano apresentado.',action:'add-title',why:'O título informa o objetivo da reunião.'},
        {id:'bullets',prompt:'Resuma os passos de correção.',action:'add-bullets',why:'A lista facilita o acompanhamento.'},
        {id:'present',prompt:'Confira a sequência no modo de apresentação.',action:'present',why:'A revisão garante legibilidade.'}
      ],{title:'Plano de regularização',slides:['Capa','Processos atrasados','Ações corretivas','Prazos'],bulletItems:['Priorizar Pedido 101','Priorizar Pedido 103','Confirmar responsáveis e novos prazos'],chartTitle:'Valores dos processos por responsável',chartData:[{label:'Compras',value:530},{label:'RH',value:760},{label:'Financeiro',value:890},{label:'Patrimônio',value:610}],speakerNotes:'Explicar quais processos estão atrasados e como os responsáveis acompanharão os novos prazos.'}),
      emailLab('Comunicar a recuperação','Envie o plano produzido à coordenação.',{scenario:'A coordenação solicitou o plano de regularização dos processos atrasados.',recipient:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['plano','regularização'],bodyKeywords:['olá','plano','ações','anexo','atenciosamente'],attachment:'plano-regularizacao.pdf',hint:'Resuma as correções, mencione o PDF produzido e confira se o arquivo anexado é a versão atual.'})
    ]
  });

  replaceLessonV252('2ADM-03',{
    curriculumRevision:'2026T2-2adm-comunicacao-v252',
    title:'Gmail, documentos e Google Apresentações',
    subtitle:'Revise um relatório, compartilhe uma apresentação e comunique uma decisão gerencial.',
    estimated:'15–22 min',
    application:'Relatórios gerenciais, reuniões, permissões e comunicação entre setores',
    evidence:'Relatório em PDF, apresentação compartilhada e e-mail profissional',
    objectives:['Revisar documentos e versões','Usar comentários e permissões','Preparar uma apresentação gerencial','Comunicar materiais com clareza'],
    stages:[
      explain('Fluxo integrado de comunicação','Uma comunicação gerencial costuma envolver mais de um arquivo e diferentes formas de acesso.','Nesta aula, você revisará um relatório, produzirá o PDF, preparará uma apresentação e compartilhará cada material de acordo com sua finalidade. O relatório será anexado ao e-mail; a apresentação ficará compartilhada como Leitor.','Antes do envio, confirme qual material deve ser anexado e qual deve ser compartilhado por link.','Use Preciso de ajuda para rever menus, comentários, versões, permissões e exportação.'),
      documentLab('Documento gerencial','Revise o relatório e prepare o PDF.',[
        {id:'title',prompt:'Aplique um título ao relatório.',action:'title-style',why:'Identifica o documento.'},
        {id:'date',prompt:'Insira data e versão.',action:'add-date',why:'Controla as versões.'},
        {id:'comment',prompt:'Registre um comentário de revisão.',action:'add-comment',why:'Documenta uma observação para a equipe.'},
        {id:'perm',prompt:'Permita que a supervisão comente o documento.',action:'permission-commenter',why:'A função Comentador permite revisão controlada.'},
        {id:'pdf',prompt:'Exporte a versão revisada em PDF.',action:'export-pdf',why:'O PDF será anexado ao e-mail.'}
      ],{documentTitle:'Relatório gerencial de acompanhamento',department:'Administração — AGV',date:'Agosto de 2026 · versão gerencial',intro:'Dados fictícios para atividade.',bullets:['Indicadores conferidos','Pendências registradas','Ações propostas'],signature:'Equipe Administrativa',permission:'commenter',filename:'relatorio-gerencial.pdf'}),
      presentationLab('Apresentação gerencial','Prepare os slides que serão compartilhados para consulta.',[
        {id:'layout',prompt:'Escolha o layout Título e conteúdo.',action:'layout-title-content',why:'Cria uma estrutura adequada.'},
        {id:'title',prompt:'Identifique a reunião.',action:'add-title',why:'O título informa o assunto.'},
        {id:'chart',prompt:'Inclua um gráfico que compare as demandas por setor.',action:'insert-chart',why:'O gráfico resume os indicadores.'},
        {id:'notes',prompt:'Adicione notas para apoiar a apresentação.',action:'add-notes',why:'As notas apoiam a fala sem poluir o slide.'},
        {id:'share',prompt:'Compartilhe os slides apenas para visualização.',action:'share-viewer',why:'A função Leitor preserva a apresentação.'}
      ],{title:'Acompanhamento gerencial',slides:['Capa','Indicadores','Riscos','Ações'],bulletItems:['Indicadores conferidos','Pendências registradas','Ações propostas'],chartTitle:'Pendências fictícias por setor',chartData:[{label:'RH',value:4},{label:'Financeiro',value:3},{label:'Compras',value:2},{label:'Patrimônio',value:1}],speakerNotes:'Explicar a origem fictícia dos indicadores e os próximos encaminhamentos.'}),
      emailLab('Comunicação gerencial','Anexe o relatório e informe que a apresentação foi compartilhada.',{scenario:'A direção solicitou o relatório em PDF e acesso de leitura à apresentação da reunião.',recipient:'direcao.agv@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',subjectKeywords:['reunião','gerencial'],bodyKeywords:['olá','relatório','apresentação','compartilhada','atenciosamente'],attachment:'relatorio-gerencial.pdf',hint:'Anexe o relatório em PDF e informe no texto que a apresentação já foi compartilhada como Leitor.'})
    ]
  });

  replaceLessonV252('2ADM-04',{
    curriculumRevision:'2026T2-2adm-assessment-v252',
    title:'Avaliação prática — análise administrativa integrada',
    subtitle:'Resolva uma demanda gerencial usando planilha, fórmulas, documento, apresentação e e-mail.',
    estimated:'15–25 min',
    application:'Análise de custos, acompanhamento de solicitações e comunicação gerencial',
    evidence:'Base analisada, relatório em PDF, apresentação e comunicação final',
    objectives:['Interpretar uma demanda gerencial','Aplicar fórmulas e filtros','Produzir materiais profissionais','Comunicar uma decisão com segurança'],
    stages:[
      explain('Briefing da avaliação do 2º ADM','A direção precisa de uma análise concisa para decidir prioridades.','Você receberá uma base fictícia com solicitações de RH, manutenção e compras. Organize os dados, produza indicadores, prepare uma recomendação e encaminhe os materiais finais. A avaliação valoriza a decisão correta, não uma ordem única de cliques.','Revise fórmulas, versão do PDF, destinatários e permissões antes de enviar.','Preciso de ajuda explica a ferramenta, mas não revela a estratégia da avaliação.'),
      officeLab('Base gerencial da avaliação','Prepare os dados para análise.',[
        {id:'filter',prompt:'Mostre somente as solicitações com situação Pendente.',action:'filter-pending',why:'O filtro identifica as demandas abertas.'},
        {id:'sort',prompt:'Organize os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a comparar impacto financeiro.'},
        {id:'share',prompt:'Disponibilize a base para revisão da supervisão, sem edição direta.',action:'share-commenter',why:'Comentador permite revisão controlada.'}
      ],{scenario:'Avaliação 2º ADM — análise gerencial',fileName:'Demandas gerenciais — avaliação',columns:['Demanda','Setor','Valor','Situação'],rows:[['Treinamento obrigatório','RH','1700','Pendente'],['Contrato de manutenção','Patrimônio','2300','Aprovado'],['Reposição de materiais','Compras','1250','Pendente'],['Atualização de benefício','RH','980','Em análise']]}),
      formula('Indicadores da avaliação','Construa fórmulas que apoiem a decisão.',[
        {prompt:'Na base completa, calcule o total dos valores em C2:C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'O total mostra o impacto global.'},
        {prompt:'Conte as solicitações Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'A contagem dimensiona a demanda aberta.'},
        {prompt:'Some somente os valores do setor RH',tokens:['=','SOMASE','(','B2:B5',';','"RH"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"RH";C2:C5)',why:'SOMASE permite analisar um setor específico.'}
      ]),
      documentLab('Recomendação gerencial','Produza a evidência que será encaminhada à direção.',[
        {id:'title',prompt:'Aplique um título à recomendação.',action:'title-style',why:'Identifica a finalidade do arquivo.'},
        {id:'date',prompt:'Registre data e versão.',action:'add-date',why:'Preserva a rastreabilidade.'},
        {id:'list',prompt:'Organize as prioridades em uma lista.',action:'insert-list',why:'A lista torna a recomendação objetiva.'},
        {id:'comment',prompt:'Registre uma observação para revisão.',action:'add-comment',why:'O comentário documenta uma análise pendente.'},
        {id:'perm',prompt:'Permita comentários da supervisão.',action:'permission-commenter',why:'A supervisão pode revisar sem alterar diretamente.'},
        {id:'pdf',prompt:'Gere o PDF final da avaliação.',action:'export-pdf',why:'O arquivo será anexado à comunicação.'}
      ],{documentTitle:'Recomendação de prioridades administrativas',department:'Administração — AGV',date:'Agosto de 2026 · avaliação 2º ADM',intro:'Análise fictícia para decisão gerencial.',bullets:['Priorizar demandas pendentes','Conferir impacto do setor RH','Registrar próximos encaminhamentos'],signature:'Analista Administrativo',permission:'commenter',filename:'avaliacao-2adm.pdf'}),
      presentationLab('Apresentação da recomendação','Prepare uma síntese para a reunião da direção.',[
        {id:'layout',prompt:'Escolha Título e conteúdo.',action:'layout-title-content',why:'Estrutura a apresentação.'},
        {id:'title',prompt:'Identifique a análise.',action:'add-title',why:'O título orienta a reunião.'},
        {id:'bullets',prompt:'Resuma as recomendações.',action:'add-bullets',why:'Os tópicos destacam decisões.'},
        {id:'chart',prompt:'Inclua um gráfico comparando as demandas por setor.',action:'insert-chart',why:'O gráfico apoia a comparação.'},
        {id:'present',prompt:'Revise no modo de apresentação.',action:'present',why:'A revisão verifica legibilidade e sequência.'}
      ],{title:'Prioridades administrativas — avaliação',slides:['Capa','Indicadores','Prioridades','Recomendação'],bulletItems:['Priorizar demandas pendentes','Revisar impacto do RH','Registrar encaminhamentos'],chartTitle:'Valores das demandas por setor',chartData:[{label:'RH',value:2680},{label:'Patrimônio',value:2300},{label:'Compras',value:1250}],speakerNotes:'Comparar os valores consolidados e justificar a ordem das prioridades.'}),
      emailLab('Comunicação final da avaliação','Encaminhe a recomendação à direção.',{scenario:'A direção aguarda a recomendação e o PDF da avaliação.',recipient:'direcao.agv@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',subjectKeywords:['avaliação','prioridades','administrativas'],bodyKeywords:['olá','recomendação','prioridades','anexo','atenciosamente'],attachment:'avaliacao-2adm.pdf',hint:'Explique a decisão, mencione o PDF produzido e confira destinatários e acesso.'})
    ]
  });

  replaceLessonV252('2ADM-05',{
    curriculumRevision:'2026T2-2adm-recovery-v252',
    title:'Recuperação prática — continuidade administrativa',
    subtitle:'Regularize um cenário diferente da avaliação, produza um plano de continuidade e comunique a retomada.',
    estimated:'15–25 min',
    application:'Regularização de fornecedores, controle de atrasos e continuidade operacional',
    evidence:'Base regularizada, plano em PDF, apresentação e comunicação à coordenação',
    objectives:['Identificar atrasos e riscos','Aplicar fórmulas em outro conjunto de dados','Produzir um plano de continuidade','Comunicar ações corretivas'],
    stages:[
      explain('Briefing da recuperação do 2º ADM','Uma rotina administrativa precisa ser retomada após atrasos de fornecedores.','Analise uma base diferente da avaliação, identifique atrasos, calcule indicadores, documente as ações de continuidade e comunique a coordenação. Você poderá consultar as ferramentas em diferentes ordens, mas deverá produzir todas as evidências.','A recuperação avalia as mesmas competências por outra problemática e outras fórmulas.','Preciso de ajuda explica o procedimento sem apresentar a solução.'),
      officeLab('Base de continuidade','Regularize os registros de fornecedores e serviços.',[
        {id:'freeze',prompt:'Mantenha os títulos visíveis durante a conferência.',action:'freeze-header',why:'O cabeçalho congelado facilita a leitura da base.'},
        {id:'filter',prompt:'Mostre somente os registros com situação Atrasado.',action:'filter-delayed',why:'O filtro concentra a análise nos atrasos.'},
        {id:'sort',prompt:'Organize os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a estimar o impacto.'},
        {id:'share',prompt:'Disponibilize a base somente para consulta da coordenação.',action:'share-reader',why:'Leitor é suficiente para acompanhar a regularização.'}
      ],{scenario:'Recuperação 2º ADM — continuidade operacional',fileName:'Fornecedores e serviços — recuperação',columns:['Registro','Setor','Valor','Situação'],rows:[['Entrega de suprimentos','Logística','920','Atrasado'],['Serviço de limpeza','Administrativo','680','Regular'],['Licença de software','Financeiro','1450','Atrasado'],['Manutenção preventiva','Logística','1180','Em revisão']]}),
      formula('Indicadores da recuperação','Use fórmulas diferentes das aplicadas na avaliação.',[
        {prompt:'Na base completa, calcule a média dos valores em C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'A média ajuda a avaliar o valor típico dos registros.'},
        {prompt:'Conte os registros Atrasados em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Atrasado"',')'],answer:'=CONT.SE(D2:D5;"Atrasado")',why:'A contagem mostra a dimensão dos atrasos.'},
        {prompt:'Some os valores do setor Logística',tokens:['=','SOMASE','(','B2:B5',';','"Logística"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"Logística";C2:C5)',why:'A função totaliza somente o setor indicado.'}
      ]),
      documentLab('Plano de continuidade','Registre as ações para normalizar a operação.',[
        {id:'title',prompt:'Aplique um título ao plano.',action:'title-style',why:'Identifica o documento.'},
        {id:'date',prompt:'Inclua data e versão.',action:'add-date',why:'Controla a versão em circulação.'},
        {id:'list',prompt:'Organize as ações de retomada em lista.',action:'insert-list',why:'A lista facilita o acompanhamento.'},
        {id:'comment',prompt:'Registre uma observação para a coordenação.',action:'add-comment',why:'O comentário documenta um ponto para revisão.'},
        {id:'perm',prompt:'Permita que a coordenação comente o plano.',action:'permission-commenter',why:'Comentador possibilita revisão controlada.'},
        {id:'pdf',prompt:'Exporte o plano em PDF.',action:'export-pdf',why:'O PDF será a evidência da recuperação.'}
      ],{documentTitle:'Plano de continuidade administrativa',department:'Administração — AGV',date:'Agosto de 2026 · recuperação 2º ADM',intro:'Plano fictício para normalização de fornecedores e serviços.',bullets:['Contatar fornecedores atrasados','Confirmar novos prazos','Registrar responsáveis e acompanhamento'],signature:'Analista Administrativo',permission:'commenter',filename:'recuperacao-2adm.pdf'}),
      presentationLab('Síntese da continuidade','Prepare os pontos que serão apresentados à coordenação.',[
        {id:'layout',prompt:'Escolha Título e conteúdo.',action:'layout-title-content',why:'Organiza a apresentação.'},
        {id:'title',prompt:'Identifique o plano de continuidade.',action:'add-title',why:'O título informa o objetivo.'},
        {id:'bullets',prompt:'Resuma as ações de retomada.',action:'add-bullets',why:'Os tópicos deixam o plano claro.'},
        {id:'chart',prompt:'Compare os registros por setor em um gráfico.',action:'insert-chart',why:'O gráfico ajuda a visualizar a distribuição.'},
        {id:'present',prompt:'Revise a apresentação.',action:'present',why:'A revisão final confirma a legibilidade.'}
      ],{title:'Continuidade administrativa — recuperação',slides:['Capa','Atrasos','Ações','Acompanhamento'],bulletItems:['Contatar fornecedores atrasados','Confirmar novos prazos','Registrar responsáveis'],chartTitle:'Valores dos serviços por setor',chartData:[{label:'Logística',value:2100},{label:'Financeiro',value:1450},{label:'Administrativo',value:680}],speakerNotes:'Explicar os atrasos e indicar as ações de continuidade para cada setor.'}),
      emailLab('Comunicação da retomada','Encaminhe o plano à coordenação.',{scenario:'A coordenação aguarda o plano de continuidade e a situação dos atrasos.',recipient:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['recuperação','continuidade','administrativa'],bodyKeywords:['olá','plano','atrasos','anexo','atenciosamente'],attachment:'recuperacao-2adm.pdf',hint:'Resuma as ações de retomada, mencione o PDF e confira se o arquivo anexado é a versão atual.'})
    ]
  });
}

// v2.5.6 — contextualização regional, metodologia ativa e preparação para o mercado de trabalho.
{
  const replaceLessonV256=(id,definition)=>{const lesson=LESSONS.find(item=>item.id===id);if(lesson)Object.assign(lesson,definition)};
  const regionalFrame=(region,role,skills,path=['Contexto profissional','Retomada','Explicação passo a passo','Prática guiada','Fixação','Evidência'])=>({
    regionalContext:region,
    professionalRole:role,
    careerSkills:skills,
    learningPath:path,
    audienceNote:'Estudantes de 14 a 18 anos do curso de Administração do Colégio Estadual Alberto Gomes Veiga.',
    dataNotice:'Todos os nomes, valores, empresas, pessoas e situações operacionais são fictícios e usados somente para aprendizagem.'
  });
  const fixation=(title,questions)=>quiz(title,questions);

  replaceLessonV256('1ADM-04',{
    curriculumRevision:'2026T2-1adm-formulas-v256',
    title:'Planilhas e fórmulas para RH e financeiro',
    subtitle:'Use fórmulas para acompanhar horas, pendências e valores em uma rotina administrativa próxima do mercado de trabalho.',
    icon:'🧮',badge:'Assistente de Indicadores',estimated:'15–22 min',
    application:'Apoio ao RH, financeiro, secretaria e acompanhamento de capacitações',
    evidence:'Planilha de acompanhamento com fórmulas conferidas e interpretação dos indicadores',
    objectives:['Retomar referências e intervalos','Aplicar SOMA, MÉDIA, SE e CONT.SE','Interpretar resultados antes de comunicar','Identificar como as fórmulas apoiam decisões administrativas'],
    ...regionalFrame('Colégio Alberto Gomes Veiga, Paranaguá e equipes fictícias de apoio em Curitiba e no Paraná.','Assistente administrativo de RH e financeiro',['Organização de dados','Raciocínio lógico','Conferência de informações','Comunicação de resultados']),
    stages:[
      explain('Missão profissional: apoiar o setor de pessoas','Você recebeu uma planilha fictícia com horas de capacitação e pendências de colaboradores.','Imagine que o setor administrativo do AGV precisa acompanhar uma formação realizada em Paranaguá e consolidar informações para uma equipe de apoio em Curitiba. Seu trabalho é organizar os dados, construir fórmulas e explicar o que os resultados significam. No mercado de trabalho, uma fórmula correta não basta: é preciso conferir o intervalo e interpretar o resultado antes de comunicá-lo.','Uma planilha de RH pode mostrar horas realizadas, situação da capacitação e quantidade de pendências sem expor dados pessoais reais.','Leia a missão inteira antes de abrir a ferramenta e observe o nome de cada coluna.'),
      explain('Retomada: como uma fórmula é construída','Toda fórmula começa com sinal de igual e combina função, intervalo e critério.','Antes de avançar, relembre: células têm endereço, intervalos usam dois-pontos e critérios de texto ficam entre aspas. SOMA totaliza valores; MÉDIA encontra um valor típico; SE classifica uma situação; CONT.SE conta registros que atendem a um critério.','Em =CONT.SE(D2:D5;"Pendente"), D2:D5 é o intervalo e "Pendente" é o critério.','Identifique primeiro o que a pergunta pede: totalizar, calcular média, classificar ou contar.'),
      officeLab('Base de capacitações administrativas','Organize a base antes de construir os indicadores.',[
        {id:'freeze',prompt:'Mantenha os títulos visíveis durante a análise.',action:'freeze-header',why:'O cabeçalho congelado ajuda a identificar as colunas enquanto a base é consultada.'},
        {id:'filter',prompt:'Mostre somente os registros com situação Pendente.',action:'filter-pending',why:'O filtro permite concentrar a análise nas pendências.'},
        {id:'share',prompt:'Compartilhe a base com a coordenação como Comentador.',action:'share-commenter',why:'A coordenação pode registrar observações sem alterar diretamente os dados.'}
      ],{scenario:'Capacitações administrativas — AGV e apoio regional',fileName:'Acompanhamento de capacitações — agosto',columns:['Colaborador','Local de apoio','Horas','Situação'],rows:[['Ana','Paranaguá','8','Concluído'],['Bruno','Curitiba','6','Pendente'],['Camila','Paranaguá','10','Concluído'],['Diego','Curitiba','4','Pendente']]}),
      formula('Oficina de fórmulas para gestão de pessoas','Monte cada fórmula e confira o significado do resultado.',[
        {prompt:'Na base completa, calcule o total de horas em C2:C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'SOMA apresenta o total de horas registradas.'},
        {prompt:'Na base completa, calcule a média de horas em C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'MÉDIA ajuda a comparar a carga típica de capacitação.'},
        {prompt:'Classifique C2 como Meta atingida quando for maior ou igual a 8 horas',tokens:['=','SE','(','C2','>=','8',';','"Meta atingida"',';','"Acompanhar"',')'],answer:'=SE(C2>=8;"Meta atingida";"Acompanhar")',why:'SE transforma uma regra administrativa em uma classificação automática.'},
        {prompt:'Conte quantos registros estão Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'CONT.SE mede rapidamente a quantidade de pendências.'}
      ]),
      fixation('Fixação: escolha a ferramenta certa',[
        {q:'O RH precisa saber quantos colaboradores ainda estão com capacitação pendente. Qual função é mais adequada?',options:['CONT.SE','MÉDIA','SOMA','SE sem condição'],answer:0,why:'CONT.SE conta quantos registros atendem ao critério Pendente.'},
        {q:'Uma equipe quer comparar a carga típica de treinamento entre Paranaguá e Curitiba. Qual indicador oferece uma visão inicial?',options:['Apenas o maior valor','A média das horas','A cor da célula','O nome do arquivo'],answer:1,why:'A média ajuda a representar um valor típico, desde que os dados também sejam conferidos.'},
        {q:'Antes de comunicar um total ao setor financeiro, qual atitude demonstra responsabilidade profissional?',options:['Enviar rapidamente sem conferir','Conferir intervalo, fórmula e unidade do resultado','Trocar a fonte da planilha','Ocultar as linhas com valores altos'],answer:1,why:'A conferência reduz erros e aumenta a confiabilidade da informação.'},
        {q:'Qual exemplo representa uso adequado da função SE?',options:['Somar todas as despesas','Classificar uma solicitação como Aprovada ou Revisar conforme uma regra','Contar quantas células existem','Alterar a permissão do arquivo'],answer:1,why:'SE aplica uma condição e retorna resultados diferentes conforme a regra.'}
      ]),
      explain('Fechamento: o que você aprendeu para o trabalho','Você conectou dados, fórmulas e decisões administrativas.','Retome mentalmente o percurso: primeiro você identificou a finalidade da base, depois organizou os dados, escolheu as funções, conferiu os resultados e decidiu como compartilhar. Esse ciclo é usado em RH, financeiro, secretaria, compras e muitos outros setores.','Um bom técnico em Administração não apenas digita fórmulas: ele entende a pergunta, confere a fonte e comunica o resultado com clareza.','Antes de avançar, explique para você mesmo quando usaria SOMA, MÉDIA, SE e CONT.SE.')
    ]
  });

  replaceLessonV256('1ADM-05',{
    curriculumRevision:'2026T2-1adm-email-v256',
    title:'Gmail, Drive e PDF na comunicação administrativa',
    subtitle:'Produza um documento, organize o acesso e envie uma mensagem profissional com o arquivo correto.',
    icon:'✉️',badge:'Comunicador Administrativo',estimated:'15–22 min',
    application:'Comunicação entre escola, setores, fornecedores e equipes administrativas',
    evidence:'Comunicado em PDF, permissão revisada e e-mail profissional enviado na simulação',
    objectives:['Reconhecer a estrutura de um e-mail profissional','Produzir e revisar um documento','Escolher permissão adequada','Anexar e encaminhar a versão correta'],
    ...regionalFrame('Rotina administrativa do AGV em Paranaguá com comunicação fictícia a uma equipe de apoio em Curitiba.','Auxiliar administrativo de comunicação e documentos',['Redação profissional','Organização de arquivos','Segurança da informação','Atenção a destinatários e anexos']),
    stages:[
      explain('Missão profissional: enviar um comunicado sem erros','A coordenação precisa encaminhar um comunicado administrativo para revisão.','Você deverá preparar o documento, gerar o PDF, definir quem pode comentar e escrever um e-mail claro. A situação é fictícia, mas reproduz tarefas comuns em escolas, empresas, escritórios, RH e atendimento. Um envio incorreto pode causar retrabalho ou expor informações para a pessoa errada.','Uma equipe de Paranaguá pode produzir o documento e solicitar revisão de uma equipe em Curitiba antes da versão final.','Nunca use dados pessoais reais nas simulações. Confira destinatário, assunto, arquivo e permissão.'),
      explain('Passo a passo antes de enviar','Uma comunicação profissional começa antes de abrir o botão Enviar.','Siga a sequência: leia a solicitação, localize ou produza o arquivo, revise a versão, defina a menor permissão necessária, escreva um assunto específico, use saudação e mensagem objetiva, anexe o arquivo e faça uma conferência final.','Assunto adequado: “Comunicado administrativo — revisão de agosto”. Assunto inadequado: “Arquivo”.','Pergunte: quem precisa receber, o que precisa fazer e qual evidência deve acompanhar a mensagem?'),
      documentLab('Comunicado administrativo','Prepare o documento que será encaminhado para revisão.',[
        {id:'title',prompt:'Aplique um título claro ao comunicado.',action:'title-style',why:'O título permite identificar rapidamente a finalidade do documento.'},
        {id:'date',prompt:'Registre data e versão.',action:'add-date',why:'Data e versão evitam o uso de cópias antigas.'},
        {id:'list',prompt:'Organize as orientações em uma lista.',action:'insert-list',why:'A lista torna as ações mais fáceis de acompanhar.'},
        {id:'sign',prompt:'Adicione o setor responsável.',action:'add-signature',why:'O responsável aumenta a rastreabilidade.'},
        {id:'perm',prompt:'Compartilhe o documento como Comentador.',action:'permission-commenter',why:'Comentador permite revisão sem alteração direta do conteúdo.'},
        {id:'pdf',prompt:'Exporte a versão revisada em PDF.',action:'export-pdf',why:'O PDF preserva a apresentação do documento.'}
      ],{documentTitle:'Comunicado de organização administrativa',department:'Colégio Alberto Gomes Veiga — Administração',date:'Agosto de 2026 · versão para revisão',intro:'Documento fictício para exercício de comunicação administrativa.',bullets:['Conferir os dados antes do envio','Usar o canal institucional indicado','Registrar a confirmação da entrega'],signature:'Setor Administrativo — AGV',permission:'commenter',filename:'comunicado-administrativo-agv.pdf'}),
      emailLab('E-mail profissional','Encaminhe o comunicado para revisão da equipe fictícia.',{scenario:'A coordenação do AGV solicitou o comunicado em PDF para revisão de uma equipe administrativa de apoio em Curitiba.',recipient:'apoio.curitiba@simulacao.edu.br',cc:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['comunicado','administrativo','revisão'],bodyKeywords:['olá','comunicado','revisão','anexo','atenciosamente'],attachment:'comunicado-administrativo-agv.pdf',hint:'Explique o objetivo do envio, mencione o PDF, confira o CC e use um encerramento profissional.'}),
      fixation('Fixação: comunicação segura',[
        {q:'O destinatário precisa apenas revisar e comentar o documento. Qual permissão atende à necessidade sem permitir alterações diretas?',options:['Editor','Comentador','Proprietário','Link público com edição'],answer:1,why:'Comentador permite registrar observações sem editar diretamente o arquivo.'},
        {q:'Qual assunto ajuda mais o destinatário a entender a mensagem antes de abri-la?',options:['Documento','Comunicado administrativo — revisão de agosto','Importante','Veja isso'],answer:1,why:'O assunto específico informa o tipo de documento e a finalidade do envio.'},
        {q:'O texto menciona “segue o PDF”, mas nenhum arquivo foi anexado. O que fazer?',options:['Enviar e explicar depois','Anexar a versão correta antes de enviar','Trocar o assunto','Adicionar outro destinatário'],answer:1,why:'A conferência do anexo evita mensagens incompletas e retrabalho.'},
        {q:'Qual prática protege melhor informações administrativas?',options:['Usar a menor permissão necessária e revisar destinatários','Compartilhar com qualquer pessoa que tenha o link','Enviar a senha da conta no corpo do e-mail','Usar sempre CCO para todos'],answer:0,why:'Permissão mínima e conferência de destinatários reduzem o risco de acesso indevido.'}
      ]),
      explain('Fechamento: comunicação também é competência técnica','Você produziu, revisou, protegeu e comunicou uma evidência.','O mercado de trabalho valoriza profissionais que conseguem organizar arquivos, escrever com clareza e evitar erros de destinatário, versão e permissão. Retome a sequência usada e identifique em qual ponto uma conferência evitou maior risco.','Uma mensagem curta pode ser profissional quando possui contexto, ação esperada, arquivo correto e encerramento adequado.','Antes de concluir, confira se você saberia repetir o processo com outro documento.')
    ]
  });

  replaceLessonV256('1ADM-06',{
    curriculumRevision:'2026T2-1adm-slides-v256',
    title:'Google Apresentações para reuniões e projetos',
    subtitle:'Transforme dados em uma apresentação curta, visual e adequada a uma reunião administrativa.',
    icon:'📊',badge:'Apresentador de Resultados',estimated:'15–22 min',
    application:'Reuniões, projetos escolares, atendimento, prestação de contas e apresentação de resultados',
    evidence:'Apresentação administrativa revisada, apresentada e compartilhada como Leitor',
    objectives:['Planejar a mensagem antes de montar slides','Escolher layout e hierarquia visual','Usar gráfico e tópicos com propósito','Revisar notas e compartilhamento'],
    ...regionalFrame('Feira de Profissões do AGV em Paranaguá com inscrições fictícias de Paranaguá, Curitiba e outras regiões do Paraná.','Assistente administrativo de projetos e reuniões',['Síntese de informações','Comunicação visual','Apresentação oral','Organização de projetos']),
    stages:[
      explain('Missão profissional: apresentar resultados sem poluir o slide','A equipe do AGV precisa apresentar dados fictícios de uma ação de orientação profissional.','Você organizará uma apresentação curta com título, tópicos, gráfico e notas. O objetivo não é encher o slide de texto, mas ajudar uma reunião a compreender os dados e decidir os próximos passos.','Uma apresentação pode comparar inscrições de Paranaguá, Curitiba e outras regiões do Paraná para planejar atendimento e materiais.','O slide apoia a fala: use poucas palavras, categorias legíveis e uma conclusão clara.'),
      explain('Retomada: da planilha para a apresentação','A apresentação começa com uma pergunta e uma mensagem principal.','Antes de escolher cores ou animações, defina: quem verá os slides, qual decisão precisa ser tomada, quais dados realmente importam e qual gráfico facilita a comparação. Depois, organize capa, indicadores, conclusão e próximos passos.','Se a pergunta é “de onde vieram as inscrições?”, um gráfico por localidade ajuda mais que um parágrafo longo.','Cada slide deve responder a uma pergunta e possuir um foco visual.'),
      presentationLab('Apresentação da Feira de Profissões','Monte uma síntese visual para uma reunião do AGV.',[
        {id:'layout',prompt:'Escolha o layout Título e conteúdo.',action:'layout-title-content',why:'O layout cria uma estrutura simples para título e informação principal.'},
        {id:'title',prompt:'Adicione um título que identifique a ação.',action:'add-title',why:'O título contextualiza a reunião.'},
        {id:'bullets',prompt:'Insira tópicos curtos com os principais resultados.',action:'add-bullets',why:'Tópicos curtos facilitam leitura e apresentação oral.'},
        {id:'chart',prompt:'Inclua um gráfico para comparar as inscrições por localidade.',action:'insert-chart',why:'O gráfico ajuda a perceber diferenças rapidamente.'},
        {id:'notes',prompt:'Adicione notas para apoiar a explicação oral.',action:'add-notes',why:'As notas guardam detalhes sem sobrecarregar o slide.'},
        {id:'share',prompt:'Compartilhe a apresentação como Leitor.',action:'share-viewer',why:'Leitor preserva a versão que será apresentada.'},
        {id:'present',prompt:'Revise a apresentação no modo de apresentação.',action:'present',why:'A revisão confirma sequência, legibilidade e coerência.'}
      ],{title:'Feira de Profissões AGV — participação regional',slides:['Capa','Inscrições','Interesses','Próximos passos'],bulletItems:['Maior participação de Paranaguá','Presença de estudantes de Curitiba','Planejar materiais e atendimento'],chartTitle:'Inscrições fictícias por localidade',chartData:[{label:'Paranaguá',value:48},{label:'Curitiba',value:26},{label:'Outras cidades do Paraná',value:18}],speakerNotes:'Explicar que os dados são fictícios, comparar as localidades e relacionar os resultados ao planejamento do evento.'}),
      fixation('Fixação: apresentação que ajuda a decidir',[
        {q:'Qual é a principal função de um slide em uma reunião administrativa?',options:['Substituir toda a fala do apresentador','Apoiar a compreensão com informações essenciais','Exibir o maior número possível de animações','Guardar todos os documentos da equipe'],answer:1,why:'O slide deve apoiar a explicação e destacar o que é essencial para a decisão.'},
        {q:'Quando um gráfico de colunas é adequado?',options:['Para comparar valores entre categorias','Para escrever um texto longo','Para substituir o assunto do e-mail','Para definir a senha do arquivo'],answer:0,why:'Colunas permitem comparar categorias, como localidades ou setores.'},
        {q:'Por que utilizar notas do apresentador?',options:['Para esconder a fonte dos dados','Para guardar detalhes que apoiam a fala sem poluir o slide','Para permitir edição pública','Para duplicar o título'],answer:1,why:'As notas oferecem apoio ao apresentador e mantêm o slide limpo.'},
        {q:'Antes de compartilhar os slides finais, qual conferência é mais importante?',options:['Somente a cor do fundo','Conteúdo, legibilidade, sequência e permissão','Quantidade de transições','Tamanho do arquivo sem abrir'],answer:1,why:'A revisão completa garante que a apresentação esteja correta e protegida.'}
      ]),
      explain('Fechamento: apresentar é organizar uma decisão','Você transformou dados em uma mensagem visual.','Retome o processo: identificar o público, selecionar dados, escolher estrutura, resumir, representar visualmente, preparar a fala e revisar. Essas etapas são úteis em projetos, reuniões, vendas, RH, eventos e gestão.','Um bom técnico em Administração consegue explicar um resultado para diferentes públicos sem distorcer os dados.','Tente resumir a apresentação em uma frase: qual decisão ela ajuda a tomar?')
    ]
  });

  replaceLessonV256('1ADM-07',{
    curriculumRevision:'2026T2-1adm-assessment-v256',
    title:'Avaliação prática — Projeto Conexão AGV com o Trabalho',
    subtitle:'Analise inscrições, produza um relatório e comunique uma proposta para uma ação profissional fictícia.',
    icon:'✅',badge:'Assistente Administrativo em Ação',estimated:'15–25 min',
    application:'Planejamento de eventos, controle de inscrições, produção de relatórios e comunicação institucional',
    evidence:'Planilha analisada, relatório em PDF, apresentação e e-mail profissional',
    objectives:['Interpretar uma demanda com autonomia','Aplicar filtros e fórmulas','Produzir evidências coerentes','Revisar comunicação e compartilhamento'],
    ...regionalFrame('Projeto fictício do AGV em Paranaguá com participantes de Paranaguá, Curitiba e outras cidades do Paraná.','Assistente administrativo de projetos',['Planejamento','Análise de dados','Produção documental','Comunicação profissional'],['Briefing','Planejamento da solução','Execução nas ferramentas','Revisão','Entrega da evidência']),
    stages:[
      explain('Briefing da avaliação','O AGV precisa organizar uma ação fictícia de aproximação com o mercado de trabalho.','Você receberá uma base com inscrições de estudantes de diferentes localidades do Paraná. Analise as pendências, calcule indicadores, prepare uma recomendação, monte uma apresentação e encaminhe o PDF. A avaliação permite organizar as ferramentas em uma ordem coerente, mas todas as evidências devem ser produzidas.','A coordenação precisa saber quantas inscrições estão pendentes, qual é a distribuição das vagas e quais ações devem ser priorizadas.','Leia todo o briefing, planeje o percurso e revise antes de enviar.'),
      officeLab('Inscrições da ação profissional','Organize a base fictícia para apoiar o planejamento.',[
        {id:'freeze',prompt:'Mantenha o cabeçalho visível.',action:'freeze-header',why:'O cabeçalho ajuda a identificar os campos durante a análise.'},
        {id:'filter',prompt:'Mostre somente as inscrições com situação Pendente.',action:'filter-pending',why:'O filtro identifica os registros que exigem acompanhamento.'},
        {id:'sort',prompt:'Organize as vagas do maior para o menor valor.',action:'sort-desc',why:'A ordenação ajuda a comparar a dimensão das oportunidades.'},
        {id:'share',prompt:'Compartilhe a base como Comentador para revisão da coordenação.',action:'share-commenter',why:'A coordenação pode revisar sem editar diretamente.'}
      ],{scenario:'Avaliação 1º ADM — Projeto Conexão AGV',fileName:'Inscrições e oportunidades — avaliação',columns:['Ação','Localidade','Vagas','Situação'],rows:[['Oficina de currículo','Paranaguá','35','Confirmado'],['Palestra de atendimento','Curitiba','20','Pendente'],['Roda de conversa com RH','Paranaguá','28','Pendente'],['Encontro regional','Outras cidades do Paraná','16','Em análise']]}),
      formula('Indicadores da avaliação','Construa os indicadores necessários para a recomendação.',[
        {prompt:'Na base completa, calcule o total de vagas em C2:C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'O total mostra a capacidade global da ação.'},
        {prompt:'Conte as inscrições Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'A contagem dimensiona os acompanhamentos necessários.'},
        {prompt:'Some somente as vagas das ações realizadas em Paranaguá',tokens:['=','SOMASE','(','B2:B5',';','"Paranaguá"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"Paranaguá";C2:C5)',why:'SOMASE consolida somente a localidade indicada.'}
      ]),
      documentLab('Recomendação administrativa','Produza o relatório que será entregue à coordenação.',[
        {id:'title',prompt:'Aplique um título à recomendação.',action:'title-style',why:'O título identifica a finalidade do arquivo.'},
        {id:'date',prompt:'Registre data e versão.',action:'add-date',why:'A versão garante rastreabilidade.'},
        {id:'list',prompt:'Organize as prioridades em uma lista.',action:'insert-list',why:'A lista transforma os indicadores em ações.'},
        {id:'comment',prompt:'Registre uma observação para revisão.',action:'add-comment',why:'O comentário documenta um ponto que precisa de validação.'},
        {id:'perm',prompt:'Compartilhe como Comentador.',action:'permission-commenter',why:'Comentador permite revisão controlada.'},
        {id:'pdf',prompt:'Exporte o relatório final em PDF.',action:'export-pdf',why:'O PDF será anexado à comunicação.'}
      ],{documentTitle:'Recomendação — Projeto Conexão AGV com o Trabalho',department:'Colégio Alberto Gomes Veiga — Administração',date:'Agosto de 2026 · avaliação 1º ADM',intro:'Dados e cenário fictícios para avaliação prática.',bullets:['Acompanhar inscrições pendentes','Confirmar capacidade por localidade','Organizar comunicação com participantes'],signature:'Assistente Administrativo',permission:'commenter',filename:'avaliacao-conexao-agv.pdf'}),
      presentationLab('Síntese para a reunião','Prepare uma apresentação curta da recomendação.',[
        {id:'layout',prompt:'Escolha o layout Título e conteúdo.',action:'layout-title-content',why:'O layout organiza a síntese.'},
        {id:'title',prompt:'Identifique o projeto.',action:'add-title',why:'O título contextualiza a reunião.'},
        {id:'bullets',prompt:'Resuma as prioridades.',action:'add-bullets',why:'Os tópicos destacam as decisões.'},
        {id:'chart',prompt:'Inclua um gráfico das vagas por localidade.',action:'insert-chart',why:'O gráfico facilita a comparação regional.'},
        {id:'present',prompt:'Revise no modo de apresentação.',action:'present',why:'A revisão confirma legibilidade e sequência.'}
      ],{title:'Projeto Conexão AGV com o Trabalho',slides:['Capa','Indicadores','Pendências','Recomendação'],bulletItems:['Acompanhar pendências','Confirmar vagas','Comunicar próximos passos'],chartTitle:'Vagas fictícias por localidade',chartData:[{label:'Paranaguá',value:63},{label:'Curitiba',value:20},{label:'Outras cidades do Paraná',value:16}],speakerNotes:'Explicar a distribuição das vagas e justificar as prioridades de acompanhamento.'}),
      emailLab('Entrega da avaliação','Encaminhe o relatório à coordenação do projeto.',{scenario:'A coordenação do AGV aguarda a recomendação em PDF e o resumo das prioridades.',recipient:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['avaliação','conexão','trabalho'],bodyKeywords:['olá','recomendação','pendências','anexo','atenciosamente'],attachment:'avaliacao-conexao-agv.pdf',hint:'Explique a principal recomendação, mencione o PDF e confira destinatário e arquivo.'})
    ]
  });

  replaceLessonV256('1ADM-08',{
    curriculumRevision:'2026T2-1adm-recovery-v256',
    title:'Recuperação prática — regularização de uma ação regional',
    subtitle:'Corrija um cenário diferente da avaliação e produza um plano de regularização com novas evidências.',
    icon:'🔄',badge:'Agente de Regularização',estimated:'15–25 min',
    application:'Acompanhamento de pendências, controle de fornecedores e comunicação de ações corretivas',
    evidence:'Base regularizada, plano em PDF, apresentação e e-mail à coordenação',
    objectives:['Identificar atrasos e riscos','Reaplicar fórmulas em outra base','Planejar ações corretivas','Comunicar a retomada com clareza'],
    ...regionalFrame('Cenário fictício de organização de materiais e serviços entre Paranaguá, Curitiba e fornecedores do Paraná.','Assistente administrativo de regularização',['Resolução de problemas','Controle de prazos','Conferência documental','Comunicação de ações corretivas'],['Briefing alternativo','Diagnóstico do problema','Correção prática','Plano de ação','Comunicação']),
    stages:[
      explain('Briefing da recuperação','Uma ação administrativa fictícia está com materiais e serviços atrasados.','Você deverá analisar uma base diferente da avaliação, identificar atrasos, calcular indicadores, criar um plano de regularização e comunicar as ações. A recuperação verifica as mesmas competências por outro problema e sem repetir os dados anteriores.','Existem entregas previstas para Paranaguá, apoio de Curitiba e fornecedores fictícios do Paraná.','Concentre-se em compreender o problema e demonstrar o que aprendeu.'),
      officeLab('Pendências da ação regional','Organize os registros que precisam de regularização.',[
        {id:'freeze',prompt:'Mantenha o cabeçalho visível.',action:'freeze-header',why:'O cabeçalho facilita a conferência dos registros.'},
        {id:'filter',prompt:'Mostre somente os registros com situação Atrasado.',action:'filter-delayed',why:'O filtro concentra a análise nos atrasos.'},
        {id:'sort',prompt:'Organize os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a priorizar o impacto.'},
        {id:'share',prompt:'Compartilhe a base como Leitor para acompanhamento.',action:'share-reader',why:'Leitor é suficiente para consulta da coordenação.'}
      ],{scenario:'Recuperação 1º ADM — regularização regional',fileName:'Materiais e serviços — recuperação',columns:['Item','Origem de apoio','Valor','Situação'],rows:[['Material gráfico','Curitiba','780','Atrasado'],['Transporte local','Paranaguá','620','Regular'],['Credenciais','Paranaguá','450','Atrasado'],['Serviço de apoio','Outra cidade do Paraná','900','Em revisão']]}),
      formula('Indicadores da regularização','Calcule informações diferentes das utilizadas na avaliação.',[
        {prompt:'Na base completa, calcule a média dos valores em C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'A média ajuda a compreender o valor típico dos itens.'},
        {prompt:'Conte os registros Atrasados em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Atrasado"',')'],answer:'=CONT.SE(D2:D5;"Atrasado")',why:'A contagem mostra quantas pendências exigem ação.'},
        {prompt:'Some somente os valores dos itens vinculados a Paranaguá',tokens:['=','SOMASE','(','B2:B5',';','"Paranaguá"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"Paranaguá";C2:C5)',why:'SOMASE totaliza apenas a localidade indicada.'}
      ]),
      documentLab('Plano de regularização','Registre as ações para corrigir as pendências.',[
        {id:'title',prompt:'Aplique um título ao plano.',action:'title-style',why:'O título identifica o documento.'},
        {id:'date',prompt:'Inclua data e versão.',action:'add-date',why:'A versão permite acompanhar as atualizações.'},
        {id:'list',prompt:'Organize as ações corretivas em lista.',action:'insert-list',why:'A lista facilita o acompanhamento.'},
        {id:'perm',prompt:'Permita comentários da coordenação.',action:'permission-commenter',why:'Comentador permite revisão controlada.'},
        {id:'pdf',prompt:'Exporte o plano em PDF.',action:'export-pdf',why:'O PDF será a evidência da recuperação.'}
      ],{documentTitle:'Plano de regularização da ação regional',department:'Colégio Alberto Gomes Veiga — Administração',date:'Agosto de 2026 · recuperação 1º ADM',intro:'Plano fictício para regularização de materiais e serviços.',bullets:['Confirmar novos prazos','Definir responsáveis','Registrar a conclusão de cada pendência'],signature:'Assistente Administrativo',permission:'commenter',filename:'recuperacao-regularizacao-regional.pdf'}),
      presentationLab('Síntese das ações corretivas','Prepare os pontos para acompanhamento da coordenação.',[
        {id:'layout',prompt:'Escolha Título e conteúdo.',action:'layout-title-content',why:'O layout organiza o plano.'},
        {id:'title',prompt:'Identifique a regularização.',action:'add-title',why:'O título informa o objetivo.'},
        {id:'bullets',prompt:'Resuma as ações corretivas.',action:'add-bullets',why:'Os tópicos tornam o plano objetivo.'},
        {id:'chart',prompt:'Inclua um gráfico dos valores por origem de apoio.',action:'insert-chart',why:'O gráfico ajuda a comparar o impacto.'},
        {id:'present',prompt:'Revise a apresentação.',action:'present',why:'A revisão confirma legibilidade.'}
      ],{title:'Regularização da ação regional',slides:['Capa','Pendências','Ações','Acompanhamento'],bulletItems:['Confirmar prazos','Definir responsáveis','Registrar conclusão'],chartTitle:'Valores fictícios por origem de apoio',chartData:[{label:'Paranaguá',value:1070},{label:'Curitiba',value:780},{label:'Outra cidade do Paraná',value:900}],speakerNotes:'Explicar os atrasos, indicar responsáveis e registrar os novos prazos.'}),
      emailLab('Comunicação da recuperação','Encaminhe o plano de regularização à coordenação.',{scenario:'A coordenação aguarda o plano de regularização e a situação das pendências.',recipient:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['recuperação','regularização','regional'],bodyKeywords:['olá','plano','pendências','anexo','atenciosamente'],attachment:'recuperacao-regularizacao-regional.pdf',hint:'Resuma as ações, mencione o PDF e confira se a versão anexada é a atual.'})
    ]
  });

  replaceLessonV256('2ADM-01',{
    curriculumRevision:'2026T2-2adm-office-v256',
    title:'Rotina administrativa regional com planilhas e comunicação',
    subtitle:'Organize demandas de Paranaguá e Curitiba, produza indicadores e encaminhe um resumo profissional.',
    icon:'📑',badge:'Técnico Administrativo Digital',estimated:'15–22 min',
    application:'Controle de solicitações, acompanhamento regional, documentos e comunicação entre equipes',
    evidence:'Planilha organizada, fórmulas validadas, resumo em PDF e e-mail profissional',
    objectives:['Integrar planilha, fórmulas, documento e e-mail','Organizar demandas por localidade e setor','Interpretar indicadores','Revisar a cadeia completa da informação'],
    ...regionalFrame('Empresa fictícia com unidade administrativa em Paranaguá e equipe de suporte em Curitiba.','Técnico em Administração responsável por uma rotina digital',['Visão de processo','Produtividade digital','Conferência de dados','Comunicação entre equipes']),
    stages:[
      explain('Missão profissional: acompanhar uma operação regional','Uma empresa fictícia precisa consolidar demandas de duas equipes.','Como estudante do 2º ADM, você terá mais autonomia para organizar registros de Paranaguá e Curitiba, produzir indicadores, documentar uma decisão e comunicar o resultado. Observe como a mesma informação passa por diferentes ferramentas.','A planilha registra a demanda; a fórmula produz o indicador; o documento formaliza; o e-mail encaminha.','Planeje a sequência e evite repetir dados manualmente sem necessidade.'),
      explain('Retomada rápida: transforme dados em fluxo de trabalho','Uma rotina eficiente conecta ferramentas e evita versões desconectadas.','Relembre filtros, ordenação, permissões e fórmulas. Depois, pense no fluxo: qual dado precisa ser analisado, qual resultado precisa ser formalizado e quem precisa receber a informação?','Filtrar ajuda a localizar pendências; CONT.SE mede a quantidade; o documento registra a recomendação; o e-mail comunica.','Antes de executar, identifique entrada, processamento, saída e destinatário.'),
      officeLab('Controle regional de solicitações','Organize a base de demandas administrativas.',[
        {id:'freeze',prompt:'Mantenha os títulos visíveis.',action:'freeze-header',why:'O cabeçalho facilita a análise da base.'},
        {id:'filter',prompt:'Mostre somente as demandas com situação Pendente.',action:'filter-pending',why:'O filtro identifica o trabalho em aberto.'},
        {id:'sort',prompt:'Organize os valores do maior para o menor.',action:'sort-desc',why:'A ordenação evidencia maior impacto financeiro.'},
        {id:'share',prompt:'Compartilhe a base como Comentador.',action:'share-commenter',why:'A equipe pode revisar sem editar diretamente.'}
      ],{scenario:'Operação regional — Paranaguá e Curitiba',fileName:'Demandas administrativas regionais',columns:['Demanda','Localidade','Valor','Situação'],rows:[['Material de atendimento','Paranaguá','840','Pendente'],['Treinamento de equipe','Curitiba','1250','Confirmado'],['Revisão de contrato','Paranaguá','1580','Em análise'],['Atualização de cadastro','Curitiba','620','Pendente']]}),
      formula('Indicadores da operação','Construa fórmulas essenciais para o acompanhamento.',[
        {prompt:'Na base completa, calcule o total dos valores em C2:C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'O total representa o impacto global da operação.'},
        {prompt:'Conte as demandas Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'A contagem dimensiona o trabalho em aberto.'},
        {prompt:'Some somente os valores vinculados a Paranaguá',tokens:['=','SOMASE','(','B2:B5',';','"Paranaguá"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"Paranaguá";C2:C5)',why:'SOMASE consolida a localidade indicada.'}
      ]),
      documentLab('Resumo da operação','Formalize os indicadores e próximos passos.',[
        {id:'title',prompt:'Aplique um título ao resumo.',action:'title-style',why:'O título identifica a operação.'},
        {id:'date',prompt:'Inclua data e versão.',action:'add-date',why:'A versão garante rastreabilidade.'},
        {id:'list',prompt:'Organize os próximos passos em lista.',action:'insert-list',why:'A lista facilita o acompanhamento.'},
        {id:'perm',prompt:'Compartilhe como Comentador.',action:'permission-commenter',why:'A revisão ocorre sem edição direta.'},
        {id:'pdf',prompt:'Exporte o resumo em PDF.',action:'export-pdf',why:'O arquivo será encaminhado à supervisão.'}
      ],{documentTitle:'Resumo da operação administrativa regional',department:'Administração — cenário fictício',date:'Agosto de 2026 · versão de acompanhamento',intro:'Resumo fictício de demandas entre Paranaguá e Curitiba.',bullets:['Acompanhar pendências','Confirmar responsáveis','Atualizar prazos e valores'],signature:'Técnico em Administração',permission:'commenter',filename:'resumo-operacao-regional.pdf'}),
      emailLab('Comunicação da operação','Encaminhe o resumo à supervisão fictícia.',{scenario:'A supervisão regional solicitou o resumo da operação e os próximos passos.',recipient:'supervisao.regional@simulacao.edu.br',cc:'coordenacao.agv@simulacao.edu.br',subjectKeywords:['operação','regional','administrativa'],bodyKeywords:['olá','resumo','pendências','anexo','atenciosamente'],attachment:'resumo-operacao-regional.pdf',hint:'Destaque o indicador mais importante, mencione o PDF e confira destinatários.'}),
      fixation('Fixação: visão de processo',[
        {q:'Qual sequência representa melhor uma rotina administrativa digital?',options:['Analisar dados, formalizar o resultado e comunicar a pessoa correta','Enviar primeiro e conferir depois','Criar vários arquivos sem nome','Aplicar cores antes de entender a demanda'],answer:0,why:'A sequência conecta análise, documentação e comunicação com responsabilidade.'},
        {q:'Por que um técnico em Administração deve entender permissões de compartilhamento?',options:['Para escolher a menor permissão necessária','Para deixar todos como editores','Para evitar escrever e-mails','Para substituir o backup'],answer:0,why:'A permissão adequada protege o arquivo e permite a colaboração necessária.'},
        {q:'Qual recurso ajuda a consolidar valores de uma localidade específica?',options:['MÉDIA sem critério','SOMASE','Negrito','Ordenação alfabética'],answer:1,why:'SOMASE soma valores que atendem a um critério.'},
        {q:'O que demonstra domínio profissional ao final do fluxo?',options:['Conseguir explicar a origem do dado, o cálculo e o destinatário','Apenas clicar rapidamente','Usar o maior número de ferramentas','Ocultar os erros'],answer:0,why:'Domínio envolve compreender e justificar as decisões tomadas.'}
      ])
    ]
  });

  replaceLessonV256('2ADM-02',{
    curriculumRevision:'2026T2-2adm-rh-finance-v256',
    title:'RH e financeiro: indicadores para tomada de decisão',
    subtitle:'Analise jornada, capacitação e despesas com fórmulas e critérios administrativos.',
    icon:'👥',badge:'Analista de Apoio Administrativo',estimated:'15–22 min',
    application:'Gestão de pessoas, orçamento de capacitação, controle de benefícios e acompanhamento de pendências',
    evidence:'Planilha analisada, fórmulas avançadas e justificativa administrativa',
    objectives:['Relacionar dados de pessoas e valores','Aplicar SE, CONT.SE e SOMASE','Comparar localidades e setores','Justificar uma recomendação'],
    ...regionalFrame('Equipe fictícia de RH com colaboradores em Paranaguá e Curitiba e ações de capacitação no Paraná.','Técnico em Administração apoiando RH e financeiro',['Análise de indicadores','Gestão de pessoas','Controle financeiro','Tomada de decisão']),
    stages:[
      explain('Missão profissional: apoiar uma decisão de RH','O setor precisa decidir quais capacitações e pendências devem ser acompanhadas primeiro.','Você analisará uma base fictícia com localidade, valor de capacitação e situação. Use filtros e fórmulas para construir uma recomendação. No trabalho real, dados de pessoas devem ser tratados com cuidado e somente informações necessárias devem ser compartilhadas.','A gestão pode comparar investimentos de Paranaguá e Curitiba sem utilizar nomes ou dados pessoais reais na atividade.','Observe a finalidade do indicador e evite concluir apenas pelo maior valor.'),
      officeLab('Plano de capacitação e acompanhamento','Organize os dados usados pelo RH e financeiro.',[
        {id:'filter',prompt:'Mostre somente os registros com situação Pendente.',action:'filter-pending',why:'O filtro identifica as ações em aberto.'},
        {id:'sort',prompt:'Organize os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a avaliar o impacto financeiro.'},
        {id:'chart',prompt:'Crie um gráfico de colunas para comparar os valores.',action:'chart-column',why:'O gráfico apoia a comparação entre ações.'},
        {id:'share',prompt:'Compartilhe com a gestão como Comentador.',action:'share-commenter',why:'A gestão pode revisar sem alterar diretamente a base.'}
      ],{scenario:'Capacitação e acompanhamento — RH regional',fileName:'Plano de capacitações e pendências',columns:['Ação','Localidade','Valor','Situação'],rows:[['Atendimento ao público','Paranaguá','1200','Confirmado'],['Planilhas avançadas','Curitiba','1650','Pendente'],['Comunicação profissional','Paranaguá','980','Pendente'],['Gestão de conflitos','Curitiba','1420','Em análise']]}),
      formula('Indicadores para RH e financeiro','Construa fórmulas que apoiem a decisão.',[
        {prompt:'Na base completa, calcule a média dos valores em C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'A média oferece uma referência inicial de investimento.'},
        {prompt:'Conte os registros Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'A contagem mostra a quantidade de ações em aberto.'},
        {prompt:'Some somente os valores das ações de Curitiba',tokens:['=','SOMASE','(','B2:B5',';','"Curitiba"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"Curitiba";C2:C5)',why:'SOMASE consolida os valores da localidade escolhida.'},
        {prompt:'Classifique C2 como Alto investimento quando for maior que 1300',tokens:['=','SE','(','C2','>','1300',';','"Alto investimento"',';','"Investimento regular"',')'],answer:'=SE(C2>1300;"Alto investimento";"Investimento regular")',why:'SE aplica uma regra de classificação ao valor.'}
      ]),
      fixation('Fixação: decisão responsável em RH',[
        {q:'Um valor alto significa automaticamente que uma capacitação deve ser cancelada?',options:['Sim, sempre','Não; é preciso considerar necessidade, impacto e orçamento','Sim, quando ocorre em Curitiba','Não, porque valores nunca importam'],answer:1,why:'A decisão deve combinar indicadores e contexto, não apenas um número isolado.'},
        {q:'Qual função ajuda a somar somente os investimentos de uma localidade?',options:['CONT.SE','SOMASE','SE','MÍNIMO'],answer:1,why:'SOMASE soma valores conforme um critério.'},
        {q:'Por que evitar dados pessoais reais em uma atividade de treinamento?',options:['Para reduzir riscos de privacidade e exposição','Para impedir o uso de planilhas','Para não precisar de fórmulas','Para deixar o gráfico menor'],answer:0,why:'Simulações devem usar dados fictícios e respeitar a privacidade.'},
        {q:'Qual atitude demonstra análise administrativa?',options:['Apresentar o indicador e explicar como ele apoia a decisão','Copiar o primeiro valor','Esconder registros pendentes','Compartilhar como editor para qualquer pessoa'],answer:0,why:'A análise profissional conecta o indicador à decisão e reconhece suas limitações.'}
      ]),
      explain('Fechamento: indicadores não decidem sozinhos','Você aplicou fórmulas, mas também interpretou contexto e responsabilidade.','Um técnico em Administração deve saber produzir o indicador, conferir a fonte e explicar o que o resultado permite concluir — e o que ainda precisa ser investigado.','A média pode ajudar, mas não substitui a análise de necessidade, prazo e impacto.','Escolha um dos indicadores da aula e explique em uma frase como ele apoiaria o RH.')
    ]
  });

  replaceLessonV256('2ADM-03',{
    curriculumRevision:'2026T2-2adm-communication-v256',
    title:'Documentos, apresentações e comunicação gerencial',
    subtitle:'Transforme uma análise em relatório, apresentação e mensagem profissional para diferentes públicos.',
    icon:'🗂️',badge:'Comunicador Gerencial',estimated:'15–22 min',
    application:'Relatórios gerenciais, reuniões, prestação de contas, colaboração e comunicação regional',
    evidence:'Relatório em PDF, apresentação compartilhada e e-mail profissional',
    objectives:['Adaptar a informação ao público','Controlar comentários e versões','Produzir uma apresentação objetiva','Encaminhar materiais com permissão adequada'],
    ...regionalFrame('Relatório fictício de atendimento administrativo envolvendo Paranaguá, Curitiba e outras regiões do Paraná.','Técnico em Administração responsável por comunicação gerencial',['Gestão documental','Comunicação visual','Colaboração digital','Adequação ao público']),
    stages:[
      explain('Missão profissional: uma análise, três formas de comunicar','A mesma informação precisa ser adaptada para documento, apresentação e e-mail.','Você revisará um relatório detalhado, preparará uma apresentação sintética e escreverá uma mensagem de encaminhamento. Cada ferramenta possui uma função: o documento registra, a apresentação apoia a reunião e o e-mail conecta as pessoas e os arquivos.','Um relatório regional pode detalhar os dados, enquanto os slides apresentam apenas indicadores e decisões.','Não copie todo o relatório para os slides ou para o corpo do e-mail.'),
      documentLab('Relatório regional de atendimento','Revise o documento e prepare a versão formal.',[
        {id:'title',prompt:'Aplique um título ao relatório.',action:'title-style',why:'O título identifica o conteúdo.'},
        {id:'date',prompt:'Inclua data e versão.',action:'add-date',why:'O controle de versão evita arquivos desatualizados.'},
        {id:'comment',prompt:'Registre um comentário de revisão.',action:'add-comment',why:'O comentário documenta um ponto para análise.'},
        {id:'perm',prompt:'Compartilhe como Comentador.',action:'permission-commenter',why:'A equipe pode revisar sem alterar diretamente.'},
        {id:'pdf',prompt:'Exporte a versão revisada em PDF.',action:'export-pdf',why:'O PDF preserva a versão formal.'}
      ],{documentTitle:'Relatório regional de atendimento administrativo',department:'Administração — cenário fictício',date:'Agosto de 2026 · versão gerencial',intro:'Relatório fictício de atendimentos em diferentes localidades.',bullets:['Conferir indicadores por localidade','Registrar pendências','Definir próximos encaminhamentos'],signature:'Técnico em Administração',permission:'commenter',filename:'relatorio-atendimento-regional.pdf'}),
      presentationLab('Apresentação gerencial','Prepare os slides para uma reunião regional.',[
        {id:'layout',prompt:'Escolha Título e conteúdo.',action:'layout-title-content',why:'O layout organiza a apresentação.'},
        {id:'title',prompt:'Identifique o relatório regional.',action:'add-title',why:'O título contextualiza a reunião.'},
        {id:'bullets',prompt:'Resuma os principais encaminhamentos.',action:'add-bullets',why:'Tópicos curtos apoiam a decisão.'},
        {id:'chart',prompt:'Inclua um gráfico dos atendimentos por região.',action:'insert-chart',why:'O gráfico facilita a comparação.'},
        {id:'notes',prompt:'Adicione notas para a apresentação oral.',action:'add-notes',why:'As notas guardam detalhes sem poluir o slide.'},
        {id:'share',prompt:'Compartilhe como Leitor.',action:'share-viewer',why:'Leitor preserva a versão apresentada.'}
      ],{title:'Atendimento administrativo regional',slides:['Capa','Indicadores','Pendências','Encaminhamentos'],bulletItems:['Conferir indicadores','Priorizar pendências','Definir responsáveis'],chartTitle:'Atendimentos fictícios por região',chartData:[{label:'Paranaguá',value:42},{label:'Curitiba',value:31},{label:'Outras regiões do Paraná',value:19}],speakerNotes:'Comparar os atendimentos e explicar quais pendências precisam de acompanhamento.'}),
      emailLab('Encaminhamento gerencial','Envie o relatório e informe o acesso aos slides.',{scenario:'A direção aguarda o relatório em PDF e o acesso de leitura à apresentação regional.',recipient:'direcao.agv@simulacao.edu.br',cc:'supervisao.regional@simulacao.edu.br',subjectKeywords:['relatório','regional','atendimento'],bodyKeywords:['olá','relatório','apresentação','compartilhada','atenciosamente'],attachment:'relatorio-atendimento-regional.pdf',hint:'Anexe o relatório, informe que a apresentação foi compartilhada como Leitor e destaque o próximo encaminhamento.'}),
      fixation('Fixação: adapte a mensagem ao público',[
        {q:'Qual material deve guardar detalhes, contexto e registro formal?',options:['Documento ou relatório','Somente o assunto do e-mail','Um slide com animação','A caixa de pesquisa'],answer:0,why:'O documento registra o conteúdo detalhado e formal.'},
        {q:'Qual material é mais adequado para apoiar uma reunião com indicadores e decisões?',options:['Apresentação sintética','Arquivo sem título','Lista de senhas','Rascunho não revisado'],answer:0,why:'A apresentação organiza a síntese visual da reunião.'},
        {q:'O que o e-mail deve fazer neste fluxo?',options:['Repetir o relatório inteiro','Contextualizar o envio, indicar a ação esperada e anexar a versão correta','Substituir todas as permissões','Ocultar quem recebe o arquivo'],answer:1,why:'O e-mail conecta destinatário, contexto, ação e evidência.'},
        {q:'Por que o mesmo conteúdo não deve ser copiado integralmente para todas as ferramentas?',options:['Porque cada ferramenta atende a uma finalidade e a um público','Porque documentos não aceitam texto','Porque apresentações não podem ter títulos','Porque e-mails não aceitam anexos'],answer:0,why:'A comunicação profissional adapta profundidade e formato à finalidade.'}
      ])
    ]
  });

  replaceLessonV256('2ADM-04',{
    curriculumRevision:'2026T2-2adm-assessment-v256',
    title:'Avaliação prática — expansão de atendimento no Paraná',
    subtitle:'Analise uma demanda regional, produza uma recomendação e comunique a decisão com autonomia.',
    icon:'📈',badge:'Técnico em Administração — Avaliação',estimated:'15–25 min',
    application:'Planejamento regional, análise de capacidade, orçamento e comunicação gerencial',
    evidence:'Base analisada, recomendação em PDF, apresentação e e-mail à direção',
    objectives:['Interpretar uma demanda regional','Aplicar fórmulas e filtros com autonomia','Relacionar indicadores a uma decisão','Produzir e comunicar evidências profissionais'],
    ...regionalFrame('Empresa fictícia avaliando ampliar atendimento entre Paranaguá, Curitiba e outras regiões do Paraná.','Técnico em Administração apoiando uma decisão gerencial',['Análise integrada','Planejamento regional','Gestão de evidências','Comunicação executiva'],['Briefing','Planejamento','Análise','Produção de evidências','Revisão e entrega']),
    stages:[
      explain('Briefing da avaliação do 2º ADM','Uma organização fictícia avalia ampliar o atendimento administrativo no Paraná.','Você receberá dados de demanda, capacidade e situação por localidade. Analise os registros, construa indicadores, prepare uma recomendação e comunique a direção. A avaliação não informa uma única ordem de cliques: planeje o percurso e garanta que todas as evidências estejam coerentes.','A decisão deve considerar demanda, capacidade, pendências e comunicação segura.','Preciso de ajuda explica a ferramenta, mas não revela a recomendação.'),
      officeLab('Base de expansão regional','Organize os dados usados na decisão.',[
        {id:'filter',prompt:'Mostre somente as localidades com situação Pendente.',action:'filter-pending',why:'O filtro identifica demandas que ainda exigem decisão.'},
        {id:'sort',prompt:'Organize a demanda do maior para o menor valor.',action:'sort-desc',why:'A ordenação evidencia as maiores necessidades.'},
        {id:'chart',prompt:'Crie um gráfico de colunas para comparar as localidades.',action:'chart-column',why:'O gráfico facilita a comparação regional.'},
        {id:'share',prompt:'Compartilhe a base como Comentador para revisão.',action:'share-commenter',why:'A revisão ocorre sem alteração direta dos dados.'}
      ],{scenario:'Avaliação 2º ADM — expansão administrativa no Paraná',fileName:'Demanda e capacidade regional — avaliação',columns:['Área prioritária','Localidade','Demanda','Situação'],rows:[['Atendimento','Paranaguá','48','Confirmado'],['RH e suporte','Curitiba','65','Pendente'],['Documentação','Litoral do Paraná','37','Pendente'],['Atendimento remoto','Outras regiões do Paraná','29','Em análise']]}),
      formula('Indicadores da expansão','Construa os indicadores usados na recomendação.',[
        {prompt:'Na base completa, calcule a demanda total em C2:C5',tokens:['=','SOMA','(','C2:C5',')'],answer:'=SOMA(C2:C5)',why:'O total mostra a dimensão global da demanda.'},
        {prompt:'Na base completa, calcule a média da demanda em C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'A média oferece uma referência para comparação.'},
        {prompt:'Conte as localidades Pendentes em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Pendente"',')'],answer:'=CONT.SE(D2:D5;"Pendente")',why:'A contagem dimensiona as decisões ainda abertas.'},
        {prompt:'Classifique C2 como Alta demanda quando for maior ou igual a 45',tokens:['=','SE','(','C2','>=','45',';','"Alta demanda"',';','"Demanda moderada"',')'],answer:'=SE(C2>=45;"Alta demanda";"Demanda moderada")',why:'SE transforma a regra de capacidade em uma classificação.'}
      ]),
      documentLab('Recomendação de expansão','Produza o documento para decisão da direção.',[
        {id:'title',prompt:'Aplique um título à recomendação.',action:'title-style',why:'O título identifica a finalidade.'},
        {id:'date',prompt:'Registre data e versão.',action:'add-date',why:'A versão mantém rastreabilidade.'},
        {id:'list',prompt:'Organize critérios e prioridades em lista.',action:'insert-list',why:'A lista apresenta a recomendação com clareza.'},
        {id:'comment',prompt:'Registre uma observação para revisão.',action:'add-comment',why:'O comentário documenta um ponto que precisa de validação.'},
        {id:'perm',prompt:'Compartilhe como Comentador.',action:'permission-commenter',why:'A direção e supervisão podem revisar sem editar diretamente.'},
        {id:'pdf',prompt:'Exporte a recomendação em PDF.',action:'export-pdf',why:'O PDF será a evidência formal da avaliação.'}
      ],{documentTitle:'Recomendação de expansão do atendimento administrativo',department:'Administração — cenário fictício',date:'Agosto de 2026 · avaliação 2º ADM',intro:'Análise fictícia para expansão regional no Paraná.',bullets:['Priorizar localidades pendentes','Dimensionar capacidade e equipe','Definir implantação por etapas'],signature:'Técnico em Administração',permission:'commenter',filename:'avaliacao-expansao-parana.pdf'}),
      presentationLab('Apresentação à direção','Prepare uma síntese executiva da recomendação.',[
        {id:'layout',prompt:'Escolha Título e conteúdo.',action:'layout-title-content',why:'O layout organiza a recomendação.'},
        {id:'title',prompt:'Identifique a expansão regional.',action:'add-title',why:'O título contextualiza a reunião.'},
        {id:'bullets',prompt:'Resuma os critérios e prioridades.',action:'add-bullets',why:'Os tópicos apoiam a decisão.'},
        {id:'chart',prompt:'Inclua um gráfico da demanda por localidade.',action:'insert-chart',why:'O gráfico facilita a comparação.'},
        {id:'notes',prompt:'Adicione notas para justificar a recomendação.',action:'add-notes',why:'As notas apoiam a apresentação oral.'},
        {id:'present',prompt:'Revise no modo de apresentação.',action:'present',why:'A revisão confirma sequência e legibilidade.'}
      ],{title:'Expansão do atendimento administrativo no Paraná',slides:['Capa','Demanda','Critérios','Recomendação'],bulletItems:['Priorizar pendências','Dimensionar capacidade','Implantar por etapas'],chartTitle:'Demanda fictícia por localidade',chartData:[{label:'Paranaguá',value:48},{label:'Curitiba',value:65},{label:'Litoral do Paraná',value:37},{label:'Outras regiões do Paraná',value:29}],speakerNotes:'Justificar a recomendação considerando demanda, situação e implantação por etapas.'}),
      emailLab('Comunicação da avaliação','Encaminhe a recomendação à direção.',{scenario:'A direção aguarda a recomendação sobre a expansão do atendimento administrativo.',recipient:'direcao.regional@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',subjectKeywords:['avaliação','expansão','Paraná'],bodyKeywords:['olá','recomendação','demanda','anexo','atenciosamente'],attachment:'avaliacao-expansao-parana.pdf',hint:'Apresente a recomendação principal, mencione o PDF e confira o acesso à apresentação.'})
    ]
  });

  replaceLessonV256('2ADM-05',{
    curriculumRevision:'2026T2-2adm-recovery-v256',
    title:'Recuperação prática — continuidade de serviços administrativos',
    subtitle:'Resolva atrasos e falhas de comunicação em um cenário diferente da avaliação.',
    icon:'🛠️',badge:'Técnico em Continuidade Administrativa',estimated:'15–25 min',
    application:'Gestão de fornecedores, controle de prazos, continuidade operacional e comunicação de crise',
    evidence:'Base regularizada, plano de continuidade em PDF, apresentação e e-mail à coordenação',
    objectives:['Diagnosticar atrasos e impactos','Aplicar fórmulas em nova base','Planejar continuidade','Comunicar ações e responsáveis'],
    ...regionalFrame('Cenário fictício de serviços administrativos entre Paranaguá, Curitiba e fornecedores do Paraná.','Técnico em Administração responsável por continuidade operacional',['Gestão de riscos','Controle de fornecedores','Plano de ação','Comunicação de crise'],['Briefing alternativo','Diagnóstico','Priorização','Plano de continuidade','Comunicação']),
    stages:[
      explain('Briefing da recuperação do 2º ADM','A operação administrativa enfrenta atrasos de fornecedores e falhas de comunicação.','Analise uma base diferente da avaliação, identifique os atrasos, calcule indicadores, produza um plano de continuidade e comunique a retomada. A recuperação avalia as mesmas competências em outro contexto, com dados e decisões diferentes.','Serviços de Paranaguá e Curitiba dependem de fornecedores fictícios localizados no Paraná.','Registre ações, responsáveis e prazos; não apenas descreva o problema.'),
      officeLab('Serviços e fornecedores','Organize os registros usados no plano de continuidade.',[
        {id:'freeze',prompt:'Mantenha os títulos visíveis.',action:'freeze-header',why:'O cabeçalho ajuda na conferência.'},
        {id:'filter',prompt:'Mostre somente os registros com situação Atrasado.',action:'filter-delayed',why:'O filtro concentra a análise nos atrasos.'},
        {id:'sort',prompt:'Organize os valores do maior para o menor.',action:'sort-desc',why:'A ordenação ajuda a priorizar impactos.'},
        {id:'share',prompt:'Compartilhe a base como Leitor para acompanhamento.',action:'share-reader',why:'Leitor é suficiente para consulta da coordenação.'}
      ],{scenario:'Recuperação 2º ADM — continuidade de serviços',fileName:'Fornecedores e serviços administrativos',columns:['Serviço','Local de atendimento','Valor','Situação'],rows:[['Suprimentos de escritório','Paranaguá','980','Atrasado'],['Suporte de sistema','Curitiba','1480','Em revisão'],['Transporte de documentos','Paranaguá','720','Regular'],['Serviço terceirizado','Outra região do Paraná','1260','Atrasado']]}),
      formula('Indicadores da continuidade','Use fórmulas diferentes das aplicadas na avaliação.',[
        {prompt:'Na base completa, calcule a média dos valores em C2:C5',tokens:['=','MÉDIA','(','C2:C5',')'],answer:'=MÉDIA(C2:C5)',why:'A média ajuda a estimar o valor típico dos serviços.'},
        {prompt:'Conte os registros Atrasados em D2:D5',tokens:['=','CONT.SE','(','D2:D5',';','"Atrasado"',')'],answer:'=CONT.SE(D2:D5;"Atrasado")',why:'A contagem dimensiona a quantidade de atrasos.'},
        {prompt:'Some somente os valores dos serviços de Paranaguá',tokens:['=','SOMASE','(','B2:B5',';','"Paranaguá"',';','C2:C5',')'],answer:'=SOMASE(B2:B5;"Paranaguá";C2:C5)',why:'SOMASE consolida a localidade escolhida.'}
      ]),
      documentLab('Plano de continuidade','Registre como os serviços serão normalizados.',[
        {id:'title',prompt:'Aplique um título ao plano.',action:'title-style',why:'O título identifica o documento.'},
        {id:'date',prompt:'Inclua data e versão.',action:'add-date',why:'A versão controla as atualizações.'},
        {id:'list',prompt:'Organize ações, responsáveis e prazos em lista.',action:'insert-list',why:'A lista facilita o acompanhamento.'},
        {id:'comment',prompt:'Registre um ponto para revisão.',action:'add-comment',why:'O comentário documenta uma pendência de validação.'},
        {id:'perm',prompt:'Compartilhe como Comentador.',action:'permission-commenter',why:'A coordenação pode revisar o plano.'},
        {id:'pdf',prompt:'Exporte o plano em PDF.',action:'export-pdf',why:'O PDF será a evidência da recuperação.'}
      ],{documentTitle:'Plano de continuidade dos serviços administrativos',department:'Administração — cenário fictício',date:'Agosto de 2026 · recuperação 2º ADM',intro:'Plano fictício para normalização de fornecedores e serviços.',bullets:['Contatar fornecedores atrasados','Definir alternativas temporárias','Registrar responsáveis e novos prazos'],signature:'Técnico em Administração',permission:'commenter',filename:'recuperacao-continuidade-servicos.pdf'}),
      presentationLab('Síntese da continuidade','Prepare uma apresentação para a coordenação.',[
        {id:'layout',prompt:'Escolha Título e conteúdo.',action:'layout-title-content',why:'O layout organiza a síntese.'},
        {id:'title',prompt:'Identifique o plano de continuidade.',action:'add-title',why:'O título informa o objetivo.'},
        {id:'bullets',prompt:'Resuma ações, responsáveis e prazos.',action:'add-bullets',why:'Os tópicos apoiam o acompanhamento.'},
        {id:'chart',prompt:'Inclua um gráfico dos valores por localidade.',action:'insert-chart',why:'O gráfico ajuda a comparar o impacto.'},
        {id:'present',prompt:'Revise a apresentação.',action:'present',why:'A revisão confirma legibilidade e sequência.'}
      ],{title:'Continuidade dos serviços administrativos',slides:['Capa','Atrasos','Ações','Prazos'],bulletItems:['Contatar fornecedores','Definir alternativas','Registrar novos prazos'],chartTitle:'Valores fictícios por localidade',chartData:[{label:'Paranaguá',value:1700},{label:'Curitiba',value:1480},{label:'Outra região do Paraná',value:1260}],speakerNotes:'Explicar os atrasos, as alternativas temporárias e os responsáveis pela retomada.'}),
      emailLab('Comunicação da retomada','Encaminhe o plano de continuidade à coordenação.',{scenario:'A coordenação regional aguarda o plano e a situação dos serviços atrasados.',recipient:'coordenacao.regional@simulacao.edu.br',cc:'direcao.agv@simulacao.edu.br',subjectKeywords:['recuperação','continuidade','serviços'],bodyKeywords:['olá','plano','atrasos','anexo','atenciosamente'],attachment:'recuperacao-continuidade-servicos.pdf',hint:'Explique as ações de retomada, mencione o PDF e confira destinatários e versão.'})
    ]
  });
}

// v2.5.6 — enquadramento profissional adicionado às aulas já aplicadas, sem alterar suas etapas.
{
  const preservedFrames={
    '1ADM-01':{regionalContext:'Organização de arquivos e planilhas do Colégio Alberto Gomes Veiga, em Paranaguá, com exemplos administrativos fictícios do Paraná.',professionalRole:'auxiliar administrativo organizando informações',careerSkills:['Organização de arquivos','Estruturação de dados','Compartilhamento responsável','Atenção a detalhes']},
    '1ADM-02':{regionalContext:'Relatórios e controles administrativos fictícios do AGV e de organizações de Paranaguá e do Paraná.',professionalRole:'assistente administrativo preparando uma planilha profissional',careerSkills:['Comunicação visual','Padronização','Legibilidade','Conferência']},
    '1ADM-03':{regionalContext:'Compras, estoque e despesas fictícias de uma rotina administrativa em Paranaguá, com referências regionais do Paraná.',professionalRole:'assistente administrativo apoiando compras e financeiro',careerSkills:['Cálculo administrativo','Conferência de valores','Controle de materiais','Interpretação de resultados']}
  };
  for(const [id,frame] of Object.entries(preservedFrames)){
    const lesson=LESSONS.find(item=>item.id===id);if(!lesson)continue;
    Object.assign(lesson,frame,{learningPath:['Contexto','Demonstração','Prática guiada','Fixação','Desafio','Evidência'],audienceNote:'Estudantes de 14 a 18 anos do curso de Administração do Colégio Estadual Alberto Gomes Veiga.',dataNotice:'Todos os nomes, valores e situações são fictícios e usados somente para aprendizagem.'});
  }
}

// v2.5.6 — plano metodológico comum das turmas.
Object.assign(TERM_PLANS['1ADM'],{
  label:'Trilha prática de Informática Empresarial — 1º ADM',
  emphasis:'Planilhas, fórmulas, Gmail, documentos, apresentações, RH e financeiro com contextos de Paranaguá, Curitiba e Paraná',
  methodology:['Contexto profissional','Retomada','Explicação passo a passo','Prática guiada','Fixação','Evidência'],
  sequence:['Planilhas e organização','Formatação profissional','Cálculos administrativos','RH e financeiro com fórmulas','Gmail, Drive e PDF','Apresentações para reuniões','Projeto Conexão AGV com o Trabalho','Regularização de uma ação regional']
});
Object.assign(TERM_PLANS['2ADM'],{
  label:'Trilha prática de Informática Empresarial — 2º ADM',
  emphasis:'Planilhas, análise administrativa, RH, financeiro, documentos, apresentações e comunicação regional no Paraná',
  methodology:['Briefing profissional','Retomada estratégica','Execução nas ferramentas','Decisão administrativa','Revisão','Evidência'],
  sequence:['Rotina administrativa regional','Indicadores de RH e financeiro','Comunicação gerencial','Expansão de atendimento no Paraná','Continuidade de serviços administrativos']
});

// v2.5.6 — equilíbrio editorial das alternativas de fixação.
{
  const revisions=[
    ['Antes de comunicar um total ao setor financeiro, qual atitude demonstra responsabilidade profissional?',['Conferir o intervalo, a fórmula e a unidade','Reenviar o arquivo antes de revisar o cálculo','Alterar a fonte antes de conferir o total','Ocultar linhas altas para reduzir o resultado'],0],
    ['Qual exemplo representa uso adequado da função SE?',['Classificar como Aprovada ou Revisar por uma regra','Somar despesas do período sem aplicar critério','Contar células preenchidas em um intervalo','Alterar a permissão de acesso ao arquivo'],0],
    ['Qual assunto ajuda mais o destinatário a entender a mensagem antes de abri-la?',['Comunicado administrativo — revisão de agosto','Documento importante — conferir quando possível','Informações gerais — arquivo para conhecimento','Mensagem administrativa — veja os detalhes'],0],
    ['O texto menciona “segue o PDF”, mas nenhum arquivo foi anexado. O que fazer?',['Anexar a versão correta antes de enviar','Enviar a mensagem e complementar em outro e-mail','Alterar o assunto e manter a mensagem sem arquivo','Adicionar outro destinatário antes de prosseguir'],0],
    ['Por que utilizar notas do apresentador?',['Guardar detalhes para apoiar a fala sem poluir o slide','Esconder a origem dos dados usados na apresentação','Permitir que qualquer pessoa edite o arquivo final','Repetir o mesmo título em todos os slides'],0],
    ['Antes de compartilhar os slides finais, qual conferência é mais importante?',['Conferir conteúdo, legibilidade, sequência e permissão','Revisar somente a cor usada no fundo dos slides','Aumentar a quantidade de transições e efeitos','Observar apenas o tamanho final do arquivo'],0],
    ['Qual sequência representa melhor uma rotina administrativa digital?',['Analisar dados, formalizar e comunicar corretamente','Enviar primeiro e conferir os resultados mais tarde','Criar cópias sem nome para cada nova alteração','Aplicar cores antes de compreender a solicitação'],0],
    ['Por que um técnico em Administração deve entender permissões de compartilhamento?',['Escolher a menor permissão necessária','Deixar todas as pessoas como editoras do arquivo','Evitar escrever mensagens profissionais por e-mail','Substituir os procedimentos de backup do setor'],0],
    ['O que demonstra domínio profissional ao final do fluxo?',['Explicar origem do dado, cálculo e destinatário','Clicar rapidamente em todas as ferramentas disponíveis','Usar o maior número possível de recursos visuais','Ocultar erros para que o trabalho pareça concluído'],0],
    ['Um valor alto significa automaticamente que uma capacitação deve ser cancelada?',['Não; considerar necessidade, impacto e orçamento','Sim; todo investimento alto deve ser cancelado','Sim; principalmente quando a ação ocorre em Curitiba','Não; valores financeiros nunca influenciam decisões'],0],
    ['Por que evitar dados pessoais reais em uma atividade de treinamento?',['Reduzir riscos de privacidade e exposição','Impedir que os estudantes utilizem planilhas funcionais','Evitar a construção de fórmulas durante a atividade','Diminuir a quantidade de categorias usadas no gráfico'],0],
    ['Qual atitude demonstra análise administrativa?',['Apresentar o indicador e justificar a decisão','Copiar o primeiro valor sem conferir outras informações','Ocultar os registros pendentes para reduzir o trabalho','Compartilhar como Editor para qualquer pessoa interessada'],0],
    ['O que o e-mail deve fazer neste fluxo?',['Contextualizar, indicar a ação e anexar a versão correta','Repetir integralmente todo o conteúdo do relatório','Substituir as permissões definidas nos arquivos compartilhados','Ocultar os destinatários responsáveis pelo acompanhamento'],0],
    ['Por que o mesmo conteúdo não deve ser copiado integralmente para todas as ferramentas?',['Cada ferramenta atende a uma finalidade e público','Documentos digitais não permitem textos detalhados','Apresentações profissionais não podem utilizar títulos','Mensagens de e-mail não permitem anexar documentos'],0]
  ];
  for(const lesson of LESSONS)for(const stage of lesson.stages||[])for(const question of stage.questions||[]){
    const revision=revisions.find(item=>item[0]===question.q);if(revision){question.options=[...revision[1]];question.answer=revision[2];question.qualityRevision='2.5.6'}
  }
}
