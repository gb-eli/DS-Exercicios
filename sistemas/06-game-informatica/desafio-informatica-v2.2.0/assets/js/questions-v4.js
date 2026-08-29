// Banco v4: 99 questões de maior complexidade, múltiplos formatos e distratores plausíveis.
export const QUESTION_BANK_V4 = [
  {
    "id": "v4-basica-01",
    "area": "Informática básica",
    "difficulty": "basic",
    "type": "single",
    "question": "Você editou um relatório por engano e precisa preservar a versão atual antes de testar outra organização. Qual procedimento oferece menor risco de perda?",
    "explanation": "Criar uma nova versão identificada mantém o original disponível para comparação ou restauração.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Usar “Salvar como” para criar uma nova versão identificada e manter o original",
      "Fechar o programa sem salvar e reconstruir depois",
      "Renomear somente a pasta, mantendo o mesmo arquivo aberto",
      "Copiar o texto para a área de transferência e apagar o arquivo"
    ],
    "answer": 0
  },
  {
    "id": "v4-basica-02",
    "area": "Informática básica",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Um aplicativo está lento, mas o computador continua respondendo. Qual sequência de diagnóstico é mais prudente antes de reiniciar à força?",
    "explanation": "A sequência vai do procedimento menos invasivo para o mais invasivo, reduzindo risco de perda de dados.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Verificar se há tarefa pesada ou mensagem do aplicativo",
      "Aguardar por curto período e salvar o que for possível",
      "Tentar fechar o aplicativo pelo método normal",
      "Usar o gerenciador de tarefas apenas se ele permanecer travado"
    ],
    "correctOrder": [
      "Verificar se há tarefa pesada ou mensagem do aplicativo",
      "Aguardar por curto período e salvar o que for possível",
      "Tentar fechar o aplicativo pelo método normal",
      "Usar o gerenciador de tarefas apenas se ele permanecer travado"
    ]
  },
  {
    "id": "v4-basica-03",
    "area": "Informática básica",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Uma equipe usa o mesmo computador em turnos diferentes. Quais medidas reduzem mistura de arquivos e alterações indevidas? Selecione todas as adequadas.",
    "explanation": "Contas separadas, bloqueio de sessão e permissões adequadas preservam identidade, organização e responsabilidade.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Criar contas de usuário separadas",
      "Salvar tudo na Área de Trabalho da conta principal",
      "Bloquear a sessão ao se afastar",
      "Usar pastas e permissões conforme a função"
    ],
    "answers": [
      0,
      2,
      3
    ]
  },
  {
    "id": "v4-basica-04",
    "area": "Informática básica",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Ao pressionar Tab em um formulário, o foco salta de um campo para outro. Qual explicação descreve melhor esse comportamento?",
    "explanation": "Tab move o foco entre controles na ordem definida pela página, útil também para acessibilidade.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Tab percorre a ordem de navegação dos elementos interativos",
      "Tab recarrega o formulário e valida todos os campos",
      "Tab altera o idioma do teclado temporariamente",
      "Tab envia o formulário quando encontra um campo obrigatório"
    ],
    "answer": 0
  },
  {
    "id": "v4-basica-05",
    "area": "Informática básica",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Uma pasta sincronizada exibe duas versões do mesmo arquivo com “conflito” no nome. Qual ação é mais segura?",
    "explanation": "Conflitos de sincronização exigem comparação antes de exclusão, pois a data mais recente não garante conteúdo correto.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Excluir imediatamente a versão mais antiga pelo horário",
      "Comparar conteúdo e datas, consolidar a versão correta e só depois remover duplicatas",
      "Renomear as duas versões com o mesmo nome",
      "Abrir ambas e salvar alternadamente até o aviso desaparecer"
    ],
    "answer": 1
  },
  {
    "id": "v4-basica-06",
    "area": "Informática básica",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um usuário afirma que a janela anônima “torna a navegação invisível”. Qual avaliação é tecnicamente correta?",
    "explanation": "O modo anônimo reduz rastros locais; não oferece anonimato perante sites, rede, provedor ou administrador.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Ela impede o provedor e a rede da escola de registrar tráfego",
      "Ela evita que o navegador mantenha parte do histórico e cookies locais após a sessão, mas não oculta a atividade da rede ou dos sites",
      "Ela criptografa automaticamente qualquer site HTTP",
      "Ela substitui antivírus e autenticação em dois fatores"
    ],
    "answer": 1
  },
  {
    "id": "v4-basica-07",
    "area": "Informática básica",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um documento importante possui cópia no computador e sincronização automática na nuvem. Por que isso ainda pode ser insuficiente como backup?",
    "explanation": "Sincronização replica alterações, inclusive danos. Backup deve permitir restauração independente.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Porque a nuvem nunca armazena versões anteriores",
      "Porque exclusões, corrupção ou ransomware podem ser sincronizados; é necessário manter cópia independente/versionada",
      "Porque um arquivo não pode existir em dois locais",
      "Porque sincronização sempre converte documentos em PDF"
    ],
    "answer": 1
  },
  {
    "id": "v4-basica-08",
    "area": "Informática básica",
    "difficulty": "advanced",
    "type": "single",
    "question": "Qual conjunto representa melhor uma estratégia de backup 3-2-1?",
    "explanation": "A regra 3-2-1 busca redundância real e proteção contra falhas locais.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Três senhas, dois antivírus e um administrador",
      "Três cópias dos dados, em dois tipos de mídia, com uma cópia fora do local principal",
      "Três pastas no mesmo SSD, duas compactadas e uma oculta",
      "Três versões do nome do arquivo, duas na lixeira e uma no e-mail"
    ],
    "answer": 1
  },
  {
    "id": "v4-basica-09",
    "area": "Informática básica",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma macro ou automação repetirá o preenchimento de 2.000 registros. Qual controle oferece melhor equilíbrio entre eficiência e confiabilidade?",
    "explanation": "Automação deve ser testada e auditável; amostras e exceções precisam ser verificadas antes da base oficial.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Executar diretamente na base oficial para economizar tempo",
      "Testar em cópia, validar regras e exceções, registrar alterações e só então aplicar na base oficial",
      "Conferir apenas o primeiro registro após a execução",
      "Desativar validações para evitar interrupções"
    ],
    "answer": 1
  },
  {
    "id": "v4-hardware-01",
    "area": "Hardware",
    "difficulty": "basic",
    "type": "single",
    "question": "Um computador abre o sistema rapidamente, mas fica lento quando muitas abas e aplicativos permanecem abertos ao mesmo tempo. Qual recurso é o primeiro a ser verificado?",
    "explanation": "Muitas tarefas simultâneas pressionam a RAM; armazenamento rápido não substitui memória de trabalho.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Capacidade e uso da memória RAM",
      "Resolução máxima do monitor",
      "Quantidade de portas HDMI",
      "Velocidade nominal da impressora"
    ],
    "answer": 0
  },
  {
    "id": "v4-hardware-02",
    "area": "Hardware",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Um notebook possui porta USB-C. Qual afirmação é correta?",
    "explanation": "USB-C descreve o conector; vídeo, potência e velocidade dependem do padrão implementado.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Toda USB-C transmite vídeo, energia e dados na mesma velocidade",
      "O formato do conector não garante os recursos; é necessário verificar o padrão e as capacidades da porta",
      "USB-C é sempre mais rápida que qualquer porta USB-A",
      "USB-C funciona apenas para carregamento"
    ],
    "answer": 1
  },
  {
    "id": "v4-hardware-03",
    "area": "Hardware",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais sintomas são compatíveis com superaquecimento e limitação térmica? Selecione todas as adequadas.",
    "explanation": "Calor excessivo pode reduzir frequência, aumentar ventilação e causar instabilidade ou desligamento.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Queda de desempenho após alguns minutos de carga intensa",
      "Ventoinha em rotação elevada e carcaça muito quente",
      "Aumento permanente da capacidade do SSD",
      "Desligamentos ou travamentos sob carga"
    ],
    "answers": [
      0,
      1,
      3
    ]
  },
  {
    "id": "v4-hardware-04",
    "area": "Hardware",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Para proteger um computador de escritório contra quedas curtas de energia e permitir salvamento seguro, qual equipamento é mais apropriado?",
    "explanation": "O no-break fornece energia temporária e pode proteger contra interrupções, desde que corretamente dimensionado.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Hub USB sem alimentação",
      "No-break dimensionado para a carga",
      "Adaptador HDMI",
      "Repetidor Wi-Fi"
    ],
    "answer": 1
  },
  {
    "id": "v4-hardware-05",
    "area": "Hardware",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene uma investigação coerente para um computador que não reconhece um pendrive.",
    "explanation": "A sequência isola porta, dispositivo e driver antes de ações destrutivas.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Testar outra porta USB",
      "Verificar o pendrive em outro computador",
      "Consultar o Gerenciador de Dispositivos ou ferramenta equivalente",
      "Considerar falha física ou formatação somente após os testes"
    ],
    "correctOrder": [
      "Testar outra porta USB",
      "Verificar o pendrive em outro computador",
      "Consultar o Gerenciador de Dispositivos ou ferramenta equivalente",
      "Considerar falha física ou formatação somente após os testes"
    ]
  },
  {
    "id": "v4-hardware-06",
    "area": "Hardware",
    "difficulty": "advanced",
    "type": "single",
    "question": "Dois computadores têm o mesmo processador e RAM. Um usa HD mecânico e outro SSD NVMe. Em qual tarefa a diferença tende a ser mais perceptível?",
    "explanation": "Armazenamento rápido reduz latência de inicialização e acesso a arquivos; não altera a precisão dos cálculos.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Cálculo puro já carregado inteiramente na RAM",
      "Inicialização do sistema e abertura de muitos arquivos pequenos",
      "Precisão de uma fórmula em planilha",
      "Qualidade lógica de uma senha"
    ],
    "answer": 1
  },
  {
    "id": "v4-hardware-07",
    "area": "Hardware",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma estação tem 8 GB de RAM e usa frequentemente 95% da memória, com paginação intensa no SSD. Qual interpretação é mais adequada?",
    "explanation": "Paginação intensa indica pressão de memória; a melhoria deve ser baseada na medição do uso real.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "O processador está necessariamente defeituoso",
      "A falta de RAM está deslocando dados para armazenamento, aumentando latência; ampliar RAM pode melhorar a carga observada",
      "O monitor está exigindo memória demais",
      "O SSD precisa ser convertido em HD"
    ],
    "answer": 1
  },
  {
    "id": "v4-hardware-08",
    "area": "Hardware",
    "difficulty": "advanced",
    "type": "single",
    "question": "Em um computador com GPU integrada, qual alteração pode afetar diretamente a memória disponível para o sistema?",
    "explanation": "GPUs integradas normalmente reservam ou compartilham memória do sistema.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "A GPU integrada compartilhar parte da RAM principal",
      "O teclado usar conexão Bluetooth",
      "A tela operar em modo noturno",
      "O SSD possuir partição de recuperação"
    ],
    "answer": 0
  },
  {
    "id": "v4-hardware-09",
    "area": "Hardware",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Um equipamento reinicia apenas durante renderização ou jogos, sem erro em tarefas leves. Quais hipóteses devem ser priorizadas? Selecione todas as adequadas.",
    "explanation": "Carga intensa expõe problemas de energia, temperatura, driver ou memória que podem não aparecer em uso leve.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Fonte insuficiente ou instável",
      "Temperatura elevada de CPU/GPU",
      "Papel atolado na impressora",
      "Driver gráfico ou memória instável"
    ],
    "answers": [
      0,
      1,
      3
    ]
  },
  {
    "id": "v4-arquivos-01",
    "area": "Arquivos e formatos",
    "difficulty": "basic",
    "type": "single",
    "question": "Uma planilha com macros precisa ser preservada para continuar executando automações no Excel. Qual formato é o mais apropriado?",
    "explanation": "XLSM preserva macros; XLSX padrão não armazena código VBA.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      ".xlsx",
      ".xlsm",
      ".csv",
      ".pdf"
    ],
    "answer": 1
  },
  {
    "id": "v4-arquivos-02",
    "area": "Arquivos e formatos",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Um CSV abriu com acentos incorretos e todas as informações em uma única coluna. Quais causas são mais prováveis?",
    "explanation": "CSV depende de codificação e delimitador; ambos podem variar conforme origem e localidade.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Codificação de caracteres e separador diferentes do esperado",
      "Ausência de bordas e cores no arquivo",
      "Resolução de tela inadequada",
      "Falta de conexão HDMI"
    ],
    "answer": 0
  },
  {
    "id": "v4-arquivos-03",
    "area": "Arquivos e formatos",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Qual escolha preserva melhor transparência e elementos gráficos simples em um logotipo para uso digital?",
    "explanation": "PNG preserva transparência; formatos vetoriais preservam formas em diferentes escalas.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "JPEG com compressão alta",
      "PNG ou formato vetorial compatível",
      "TXT renomeado para imagem",
      "MP4 em quadro único"
    ],
    "answer": 1
  },
  {
    "id": "v4-arquivos-04",
    "area": "Arquivos e formatos",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Selecione as afirmações corretas sobre compactação ZIP.",
    "explanation": "ZIP organiza e pode reduzir tamanho, mas arquivos já comprimidos pouco diminuem e o pacote não é backup por si só.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Pode reunir vários arquivos e pastas em um pacote",
      "Sempre reduz muito qualquer tipo de arquivo",
      "Pode preservar a estrutura de diretórios",
      "Não substitui backup ou controle de versão"
    ],
    "answers": [
      0,
      2,
      3
    ]
  },
  {
    "id": "v4-arquivos-05",
    "area": "Arquivos e formatos",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene as etapas seguras ao receber um arquivo “nota_fiscal.pdf.exe”.",
    "explanation": "A extensão final indica executável; confirmação e análise devem ocorrer sem abrir o arquivo.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Não executar o arquivo",
      "Exibir/verificar a extensão real",
      "Confirmar a origem por canal confiável",
      "Analisar com ferramentas de segurança e descartar se houver dúvida"
    ],
    "correctOrder": [
      "Não executar o arquivo",
      "Exibir/verificar a extensão real",
      "Confirmar a origem por canal confiável",
      "Analisar com ferramentas de segurança e descartar se houver dúvida"
    ]
  },
  {
    "id": "v4-arquivos-06",
    "area": "Arquivos e formatos",
    "difficulty": "advanced",
    "type": "single",
    "question": "Por que um hash SHA-256 não substitui criptografia quando o objetivo é manter o conteúdo secreto?",
    "explanation": "Hash verifica integridade; criptografia transforma dados para posterior recuperação com chave.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Porque hash é reversível com a mesma chave",
      "Porque hash produz um resumo para integridade e não foi projetado para recuperar o conteúdo original",
      "Porque criptografia não usa algoritmos",
      "Porque SHA-256 funciona apenas em imagens"
    ],
    "answer": 1
  },
  {
    "id": "v4-arquivos-07",
    "area": "Arquivos e formatos",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma imagem JPEG é salva repetidamente com alta compressão. Qual efeito é esperado?",
    "explanation": "JPEG usa compressão com perdas; regravações sucessivas podem degradar a imagem.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Perda acumulada de qualidade por compressão com perdas",
      "Aumento infinito da resolução",
      "Conversão automática para vetor",
      "Preservação perfeita dos pixels originais"
    ],
    "answer": 0
  },
  {
    "id": "v4-arquivos-08",
    "area": "Arquivos e formatos",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um arquivo precisa permanecer legível por muitos anos e preservar a aparência documental. Qual característica torna PDF/A mais adequado que um PDF comum em arquivamento?",
    "explanation": "PDF/A restringe dependências externas e exige elementos que favorecem reprodução futura.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Permitir qualquer conteúdo externo e criptografia obrigatória",
      "Impor restrições voltadas à preservação, incluindo incorporação de recursos necessários",
      "Converter tabelas em fórmulas editáveis",
      "Eliminar metadados obrigatoriamente"
    ],
    "answer": 1
  },
  {
    "id": "v4-arquivos-09",
    "area": "Arquivos e formatos",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma equipe exporta dados para CSV e perde fórmulas, abas, estilos e validações. Isso ocorre porque:",
    "explanation": "CSV armazena dados delimitados; não guarda múltiplas abas, fórmulas ou formatação de uma planilha completa.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "CSV representa principalmente valores tabulares simples e não preserva recursos complexos de uma pasta de trabalho",
      "CSV é um formato de imagem",
      "O arquivo precisa ser renomeado para .xlsx",
      "CSV só aceita números inteiros"
    ],
    "answer": 0
  },
  {
    "id": "v4-drive-01",
    "area": "Google Drive",
    "difficulty": "basic",
    "type": "single",
    "question": "Um relatório deve ser lido por vários colegas, mas apenas duas pessoas podem alterá-lo. Qual configuração segue o princípio do menor privilégio?",
    "explanation": "Cada pessoa recebe apenas a permissão necessária, reduzindo alterações acidentais.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Dar permissão de editor a todos",
      "Compartilhar como leitor com o grupo e editor apenas com os responsáveis",
      "Publicar na web e enviar o link",
      "Criar uma cópia diferente para cada pessoa sem controle"
    ],
    "answer": 1
  },
  {
    "id": "v4-drive-02",
    "area": "Google Drive",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Qual é a diferença prática entre criar um atalho no Drive e fazer uma cópia?",
    "explanation": "Atalhos referenciam o arquivo original; cópias possuem conteúdo e histórico próprios.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Atalho aponta para o mesmo arquivo; cópia cria outro arquivo independente",
      "Atalho cria versão offline; cópia remove o original",
      "Atalho altera o proprietário; cópia mantém um único histórico",
      "Não existe diferença"
    ],
    "answer": 0
  },
  {
    "id": "v4-drive-03",
    "area": "Google Drive",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Um arquivo compartilhado por link contém dados pessoais. Quais controles são mais adequados? Selecione todos.",
    "explanation": "Dados pessoais exigem acesso restrito, revisão periódica e prevenção de redistribuição indevida.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Restringir a pessoas/grupos necessários",
      "Revisar permissões e remover acessos antigos",
      "Usar “qualquer pessoa com o link” por conveniência",
      "Evitar que editores redistribuam quando a política permitir"
    ],
    "answers": [
      0,
      1,
      3
    ]
  },
  {
    "id": "v4-drive-04",
    "area": "Google Drive",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Duas pessoas editaram offline e o Drive criou versões conflitantes. Qual procedimento reduz perda?",
    "explanation": "Conflitos precisam ser reconciliados com base no conteúdo, não apenas em tamanho ou horário.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Escolher automaticamente o arquivo de maior tamanho",
      "Comparar as versões, consolidar alterações e documentar qual será a versão oficial",
      "Excluir todas e iniciar novamente",
      "Mover um conflito para a lixeira sem abrir"
    ],
    "answer": 1
  },
  {
    "id": "v4-drive-05",
    "area": "Google Drive",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene um fluxo seguro para compartilhar uma pasta de projeto com colaboradores externos.",
    "explanation": "Classificação, identidade, privilégio mínimo e revisão formam um fluxo seguro.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Confirmar quais arquivos podem ser externos",
      "Criar grupo ou lista de destinatários autorizados",
      "Aplicar a menor permissão necessária",
      "Testar o acesso e revisar periodicamente"
    ],
    "correctOrder": [
      "Confirmar quais arquivos podem ser externos",
      "Criar grupo ou lista de destinatários autorizados",
      "Aplicar a menor permissão necessária",
      "Testar o acesso e revisar periodicamente"
    ]
  },
  {
    "id": "v4-drive-06",
    "area": "Google Drive",
    "difficulty": "advanced",
    "type": "single",
    "question": "Por que mover um arquivo para uma pasta compartilhada não garante, por si só, que todos tenham o mesmo acesso?",
    "explanation": "Permissões dependem do contexto, políticas e herança; precisam ser verificadas após a movimentação.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Porque permissões podem ser herdadas, restritas ou conflitantes conforme o local e a organização",
      "Porque pastas não aceitam documentos",
      "Porque o Drive remove o proprietário automaticamente",
      "Porque o navegador bloqueia arquivos grandes"
    ],
    "answer": 0
  },
  {
    "id": "v4-drive-07",
    "area": "Google Drive",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma equipe precisa manter um documento oficial único, mas cada setor quer organizá-lo em sua própria pasta. Qual recurso evita cópias divergentes?",
    "explanation": "Atalhos permitem múltiplos pontos de acesso mantendo um único arquivo e histórico.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Criar atalhos para o mesmo arquivo em diferentes locais",
      "Duplicar o arquivo semanalmente",
      "Exportar como imagem para cada setor",
      "Enviar anexos por e-mail"
    ],
    "answer": 0
  },
  {
    "id": "v4-drive-08",
    "area": "Google Drive",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Quais informações do histórico de versões ajudam numa auditoria? Selecione todas as adequadas.",
    "explanation": "Histórico registra autoria, tempo e versões; não revela senhas.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Quem alterou",
      "Quando a alteração ocorreu",
      "Versões anteriores disponíveis",
      "A senha pessoal de quem editou"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-drive-09",
    "area": "Google Drive",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um colaborador saiu da equipe. Qual ação é mais adequada para arquivos corporativos que ele possuía ou acessava?",
    "explanation": "Desligamento exige revogação e continuidade de propriedade dos ativos institucionais.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Apenas apagar o nome dele de uma planilha",
      "Transferir propriedade quando necessário, revogar acessos e revisar links/grupos relacionados",
      "Manter acesso por precaução",
      "Trocar o nome de todos os arquivos"
    ],
    "answer": 1
  },
  {
    "id": "v4-documentos-email-01",
    "area": "Documentos e e-mail",
    "difficulty": "basic",
    "type": "single",
    "question": "Um e-mail informa uma mudança de prazo e exige ação de cinco pessoas; outras dez precisam apenas acompanhar. Qual uso é mais adequado?",
    "explanation": "Para indica responsáveis diretos; CC mantém interessados informados.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Colocar todos em CCO",
      "Responsáveis em Para; interessados em CC",
      "Todos em Para e sem assunto",
      "Enviar cinco mensagens sem contexto"
    ],
    "answer": 1
  },
  {
    "id": "v4-documentos-email-02",
    "area": "Documentos e e-mail",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Você recebeu um anexo por link do Drive, mas o destinatário externo não consegue abrir. Qual causa é mais provável?",
    "explanation": "Enviar o link não concede acesso automaticamente; a permissão precisa incluir o destinatário.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "O e-mail não possui assinatura",
      "A permissão do arquivo não inclui o destinatário",
      "O assunto possui poucas palavras",
      "O navegador não aceita links"
    ],
    "answer": 1
  },
  {
    "id": "v4-documentos-email-03",
    "area": "Documentos e e-mail",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais elementos melhoram a acessibilidade de um documento? Selecione todos.",
    "explanation": "Estrutura, texto alternativo e links descritivos ajudam leitores de tela e navegação.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Usar estilos de títulos em ordem lógica",
      "Adicionar texto alternativo às imagens informativas",
      "Usar apenas cor para indicar significado",
      "Criar links com descrição clara"
    ],
    "answers": [
      0,
      1,
      3
    ]
  },
  {
    "id": "v4-documentos-email-04",
    "area": "Documentos e e-mail",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Em uma revisão colaborativa, quando o modo “Sugestões” é preferível à edição direta?",
    "explanation": "Sugestões preservam transparência e permitem aceitar ou rejeitar mudanças.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Quando se deseja que as alterações sejam avaliadas antes de incorporar",
      "Quando ninguém deve saber o que mudou",
      "Quando o arquivo precisa virar planilha",
      "Quando o documento será apagado"
    ],
    "answer": 0
  },
  {
    "id": "v4-documentos-email-05",
    "area": "Documentos e e-mail",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene uma resposta profissional a um e-mail que solicita um documento.",
    "explanation": "A sequência combina clareza, autorização, acesso e revisão final.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Confirmar o pedido e o contexto",
      "Verificar se o arquivo correto e autorizado está disponível",
      "Anexar ou compartilhar com permissão adequada",
      "Revisar destinatários, assunto e texto antes de enviar"
    ],
    "correctOrder": [
      "Confirmar o pedido e o contexto",
      "Verificar se o arquivo correto e autorizado está disponível",
      "Anexar ou compartilhar com permissão adequada",
      "Revisar destinatários, assunto e texto antes de enviar"
    ]
  },
  {
    "id": "v4-documentos-email-06",
    "area": "Documentos e e-mail",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma mensagem parece vir da direção, mas pede transferência urgente e proíbe contato por telefone. Qual conjunto de sinais aumenta a suspeita?",
    "explanation": "Urgência artificial e impedimento de confirmação são sinais comuns de engenharia social.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Urgência, quebra do procedimento normal e tentativa de impedir verificação por outro canal",
      "Uso de saudação formal e assinatura completa",
      "Mensagem enviada durante o expediente",
      "Pedido acompanhado de número de protocolo verificável"
    ],
    "answer": 0
  },
  {
    "id": "v4-documentos-email-07",
    "area": "Documentos e e-mail",
    "difficulty": "advanced",
    "type": "single",
    "question": "Qual diferença existe entre inserir uma imagem de assinatura e aplicar assinatura digital baseada em certificado?",
    "explanation": "Certificados permitem validação criptográfica; imagem é apenas representação visual.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "A imagem comprova identidade criptograficamente; o certificado apenas decora",
      "A assinatura digital pode verificar identidade e integridade; a imagem pode ser copiada sem essa garantia",
      "Ambas têm a mesma validade técnica",
      "A assinatura digital não detecta alteração do documento"
    ],
    "answer": 1
  },
  {
    "id": "v4-documentos-email-08",
    "area": "Documentos e e-mail",
    "difficulty": "advanced",
    "type": "single",
    "question": "Ao usar “Responder a todos”, qual critério deve ser aplicado?",
    "explanation": "Responder a todos sem necessidade gera ruído e pode expor informações.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Sempre incluir todos para demonstrar transparência",
      "Incluir apenas quem precisa da resposta; remover destinatários desnecessários e preservar sigilo",
      "Adicionar novos contatos automaticamente",
      "Mover todos para CCO sem avaliar contexto"
    ],
    "answer": 1
  },
  {
    "id": "v4-documentos-email-09",
    "area": "Documentos e e-mail",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um documento longo usa títulos formatados apenas com fonte grande e negrito. Qual melhoria traz benefício estrutural, não apenas visual?",
    "explanation": "Estilos semânticos permitem navegação, sumário automático e melhor leitura assistiva.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Aplicar estilos de título hierárquicos para navegação, sumário e acessibilidade",
      "Inserir mais cores em cada seção",
      "Converter todos os parágrafos em imagens",
      "Usar espaços repetidos para alinhar"
    ],
    "answer": 0
  },
  {
    "id": "v4-apresentacoes-01",
    "area": "Apresentações e Canva",
    "difficulty": "basic",
    "type": "single",
    "question": "Um slide possui título pequeno, quatro parágrafos e uma imagem decorativa dominante. Qual ajuste melhora primeiro a comunicação?",
    "explanation": "A apresentação deve priorizar mensagem, hierarquia e leitura; efeitos não corrigem excesso de conteúdo.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Aumentar a imagem e reduzir o título",
      "Definir uma mensagem central, reduzir texto e criar hierarquia visual",
      "Adicionar animação a cada frase",
      "Usar cinco fontes diferentes"
    ],
    "answer": 1
  },
  {
    "id": "v4-apresentacoes-02",
    "area": "Apresentações e Canva",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Qual gráfico é geralmente mais adequado para mostrar evolução mensal de vendas ao longo de um ano?",
    "explanation": "Linhas facilitam observar tendência e variação ao longo do tempo.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Gráfico de linhas",
      "Gráfico de pizza com 12 fatias",
      "Nuvem de palavras",
      "Organograma"
    ],
    "answer": 0
  },
  {
    "id": "v4-apresentacoes-03",
    "area": "Apresentações e Canva",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais práticas favorecem acessibilidade em slides? Selecione todas.",
    "explanation": "Contraste, descrições e legendas ampliam acesso; cor isolada pode não ser percebida.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Contraste suficiente",
      "Texto alternativo em imagens relevantes",
      "Legenda para vídeo quando possível",
      "Transmitir diferenças apenas por cor"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-apresentacoes-04",
    "area": "Apresentações e Canva",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Uma apresentação será exibida em tela 16:9, mas o arquivo foi criado em 4:3. Qual risco existe?",
    "explanation": "A proporção inadequada pode gerar barras, cortes ou redimensionamento indesejado.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Distorção ou barras laterais dependendo da projeção",
      "Perda automática de todas as fontes",
      "Mudança das fórmulas da planilha",
      "Exclusão das notas do apresentador"
    ],
    "answer": 0
  },
  {
    "id": "v4-apresentacoes-05",
    "area": "Apresentações e Canva",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene um processo coerente para transformar dados em um slide executivo.",
    "explanation": "A visualização deve partir da pergunta e terminar com uma conclusão legível.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Definir a pergunta que o slide responde",
      "Selecionar somente os dados relevantes",
      "Escolher visualização coerente",
      "Destacar a conclusão e revisar legibilidade"
    ],
    "correctOrder": [
      "Definir a pergunta que o slide responde",
      "Selecionar somente os dados relevantes",
      "Escolher visualização coerente",
      "Destacar a conclusão e revisar legibilidade"
    ]
  },
  {
    "id": "v4-apresentacoes-06",
    "area": "Apresentações e Canva",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um gráfico mostra crescimento de 100 para 105, mas o eixo vertical começa em 99, criando aparência de aumento enorme. Qual problema ocorre?",
    "explanation": "Eixos truncados podem distorcer a percepção; precisam ser justificados e claramente indicados.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Escala que pode exagerar visualmente a diferença",
      "Ausência de transição entre slides",
      "Uso de imagem vetorial",
      "Excesso de notas do apresentador"
    ],
    "answer": 0
  },
  {
    "id": "v4-apresentacoes-07",
    "area": "Apresentações e Canva",
    "difficulty": "advanced",
    "type": "single",
    "question": "Quando um SVG é preferível a um JPEG para um ícone ou logotipo?",
    "explanation": "SVG representa vetores e mantém nitidez em diferentes tamanhos.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Quando se deseja escalabilidade sem perda e formas vetoriais",
      "Quando a imagem é uma fotografia complexa com milhões de tons",
      "Quando o arquivo precisa conter áudio",
      "Quando a transparência deve ser removida"
    ],
    "answer": 0
  },
  {
    "id": "v4-apresentacoes-08",
    "area": "Apresentações e Canva",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Quais fatores devem ser verificados antes de usar uma imagem encontrada na internet em material escolar ou institucional? Selecione todos.",
    "explanation": "Uso responsável envolve licença, atribuição e adequação, não popularidade.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Licença e permissão de uso",
      "Crédito exigido",
      "Qualidade e adequação ao contexto",
      "Quantidade de curtidas da imagem"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-apresentacoes-09",
    "area": "Apresentações e Canva",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um dashboard será apresentado em um único slide para decisão rápida. Qual desenho é mais eficaz?",
    "explanation": "Dashboard executivo precisa priorizar indicadores, comparação e exceções relevantes.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Dez gráficos pequenos sem destaque",
      "Poucos indicadores-chave, contexto mínimo, comparação e sinalização de exceções",
      "Uma tabela completa com todas as linhas da base",
      "Animações automáticas contínuas"
    ],
    "answer": 1
  },
  {
    "id": "v4-forms-01",
    "area": "Google Forms",
    "difficulty": "basic",
    "type": "single",
    "question": "Um formulário deve perguntar o setor do participante, permitindo apenas uma resposta entre Financeiro, RH e Vendas. Qual tipo de pergunta é mais adequado?",
    "explanation": "Múltipla escolha limita a uma opção; caixas de seleção permitem várias.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Múltipla escolha",
      "Caixas de seleção",
      "Parágrafo",
      "Upload de arquivo"
    ],
    "answer": 0
  },
  {
    "id": "v4-forms-02",
    "area": "Google Forms",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Um campo de matrícula deve aceitar exatamente oito algarismos. Qual recurso reduz respostas inválidas?",
    "explanation": "Validação impede ou sinaliza formatos incompatíveis no momento do preenchimento.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Validação de resposta com padrão ou comprimento adequado",
      "Transformar o campo em parágrafo sem regra",
      "Adicionar a orientação apenas no título",
      "Usar uma pergunta de data"
    ],
    "answer": 0
  },
  {
    "id": "v4-forms-03",
    "area": "Google Forms",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais configurações ajudam a reduzir respostas duplicadas em um formulário institucional? Selecione todas as aplicáveis.",
    "explanation": "Limitação, identificação apropriada e conferência de dados reduzem duplicidade; link aberto não garante unicidade.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Limitar a uma resposta quando os usuários autenticados forem conhecidos",
      "Coletar identificador institucional quando permitido",
      "Usar apenas um link público sem qualquer identificação",
      "Verificar duplicidades na planilha de respostas"
    ],
    "answers": [
      0,
      1,
      3
    ]
  },
  {
    "id": "v4-forms-04",
    "area": "Google Forms",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Um formulário deve mostrar perguntas diferentes conforme a resposta “Pessoa física” ou “Pessoa jurídica”. Qual recurso atende melhor?",
    "explanation": "Seções condicionais criam caminhos diferentes conforme a escolha.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Ir para seção com base na resposta",
      "Embaralhar ordem das perguntas",
      "Transformar todas em obrigatórias",
      "Publicar dois links sem identificação"
    ],
    "answer": 0
  },
  {
    "id": "v4-forms-05",
    "area": "Google Forms",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene o desenvolvimento de um formulário de pesquisa.",
    "explanation": "O formulário deve nascer do objetivo e ser testado antes da coleta real.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Definir objetivo e decisões que usarão os dados",
      "Escolher perguntas e tipos de resposta",
      "Configurar validações, consentimento e navegação",
      "Testar com poucas pessoas antes de publicar"
    ],
    "correctOrder": [
      "Definir objetivo e decisões que usarão os dados",
      "Escolher perguntas e tipos de resposta",
      "Configurar validações, consentimento e navegação",
      "Testar com poucas pessoas antes de publicar"
    ]
  },
  {
    "id": "v4-forms-06",
    "area": "Google Forms",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma pergunta obrigatória pede CPF, mas o objetivo da pesquisa é apenas medir satisfação anônima. Qual princípio foi desrespeitado?",
    "explanation": "Devem ser coletados apenas dados necessários à finalidade declarada.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Minimização de dados",
      "Formatação condicional",
      "Normalização de banco",
      "Apresentação em tela cheia"
    ],
    "answer": 0
  },
  {
    "id": "v4-forms-07",
    "area": "Google Forms",
    "difficulty": "advanced",
    "type": "single",
    "question": "Ao vincular um Forms a uma planilha, qual cuidado evita quebrar análises existentes?",
    "explanation": "A aba de respostas deve permanecer estável; análises devem ficar em abas próprias.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Evitar alterar ou excluir colunas geradas automaticamente; criar análises em abas separadas",
      "Renomear todas as colunas de respostas a cada coleta",
      "Inserir fórmulas no meio das colunas automáticas sem teste",
      "Excluir carimbos de data e hora"
    ],
    "answer": 0
  },
  {
    "id": "v4-forms-08",
    "area": "Google Forms",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Quais riscos existem ao permitir upload de arquivos em formulário? Selecione todos.",
    "explanation": "Uploads exigem política, armazenamento e segurança; não garantem autenticidade.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Armazenamento de conteúdo inadequado ou sensível",
      "Consumo de espaço e necessidade de controle de acesso",
      "Possibilidade de arquivos maliciosos",
      "Garantia automática de autenticidade do conteúdo"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-forms-09",
    "area": "Google Forms",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma pesquisa usa escala de 1 a 5, mas não define o significado de 1 e 5. Qual consequência é mais provável?",
    "explanation": "Âncoras claras reduzem ambiguidade e melhoram qualidade dos dados.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Interpretações diferentes entre respondentes, reduzindo comparabilidade",
      "A planilha deixará de registrar respostas",
      "O formulário será automaticamente fechado",
      "A escala será convertida em texto"
    ],
    "answer": 0
  },
  {
    "id": "v4-planilhas-01",
    "area": "Planilhas",
    "difficulty": "basic",
    "type": "single",
    "question": "Uma fórmula em D2 é =B2*C2. Ao copiar para D3, qual resultado é esperado com referências relativas?",
    "explanation": "Referências relativas mudam de linha ao serem copiadas para baixo.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "=B3*C3",
      "=B2*C2",
      "=C2*D2",
      "=B$2*C$2"
    ],
    "answer": 0
  },
  {
    "id": "v4-planilhas-02",
    "area": "Planilhas",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Uma taxa está em B1 e deve permanecer fixa ao copiar =C2*B1 para várias linhas. Qual fórmula é adequada?",
    "explanation": "$B$1 fixa coluna e linha da taxa; C2 continua relativa.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "=C2*$B$1",
      "=C$2*B1",
      "=$C$2*B$1",
      "=C2:B1"
    ],
    "answer": 0
  },
  {
    "id": "v4-planilhas-03",
    "area": "Planilhas",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Ao ordenar apenas a coluna “Valor”, os nomes deixam de corresponder aos valores. Qual erro ocorreu?",
    "explanation": "A ordenação deve incluir todo o intervalo relacionado, preservando cada registro na mesma linha.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Foi ordenada somente parte da tabela, quebrando a relação entre linhas",
      "A planilha não aceita números monetários",
      "O cabeçalho deveria estar em itálico",
      "Era necessário usar SOMA antes"
    ],
    "answer": 0
  },
  {
    "id": "v4-planilhas-04",
    "area": "Planilhas",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais recursos reduzem erros de preenchimento em uma coluna “Status”? Selecione todos.",
    "explanation": "Validação, proteção e padronização previnem erros antes de chegarem à análise.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Validação com lista suspensa",
      "Proteção de células com fórmulas",
      "Instrução clara e valores padronizados",
      "Permitir qualquer texto e corrigir apenas no final"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-planilhas-05",
    "area": "Planilhas",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene as etapas para criar uma tabela dinâmica confiável.",
    "explanation": "Base limpa, seleção, configuração e validação são etapas essenciais.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Garantir cabeçalhos únicos e base tabular sem linhas vazias internas",
      "Selecionar a base correta",
      "Definir campos de linhas, colunas, valores e filtros",
      "Conferir totais com a fonte"
    ],
    "correctOrder": [
      "Garantir cabeçalhos únicos e base tabular sem linhas vazias internas",
      "Selecionar a base correta",
      "Definir campos de linhas, colunas, valores e filtros",
      "Conferir totais com a fonte"
    ]
  },
  {
    "id": "v4-planilhas-06",
    "area": "Planilhas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma data aparece como 45292 em vez de 01/01/2024. Qual explicação é mais provável?",
    "explanation": "Planilhas armazenam datas como números seriais; a formatação controla a exibição.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "A célula exibe o número serial interno porque está formatada como número",
      "A data foi criptografada",
      "A função SOMA transformou a data",
      "O arquivo está necessariamente corrompido"
    ],
    "answer": 0
  },
  {
    "id": "v4-planilhas-07",
    "area": "Planilhas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Qual vantagem uma visualização de filtro oferece em uma planilha colaborativa?",
    "explanation": "Visualizações de filtro permitem análises individuais sem interferir na visão comum.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Permite filtrar a visão sem alterar a visualização de todos os colaboradores",
      "Bloqueia permanentemente linhas ocultas",
      "Converte filtros em fórmulas",
      "Exclui registros que não atendem ao critério"
    ],
    "answer": 0
  },
  {
    "id": "v4-planilhas-08",
    "area": "Planilhas",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Uma fórmula precisa referenciar um intervalo que cresce com novas linhas. Quais estratégias podem ajudar? Selecione todas.",
    "explanation": "Intervalos dinâmicos, tabelas e funções apropriadas acompanham crescimento; faixa fixa pode omitir dados.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Usar tabela estruturada ou intervalo nomeado dinâmico",
      "Referenciar coluna inteira quando o impacto de desempenho for aceitável",
      "Fixar sempre B2:B10 mesmo com novos registros",
      "Usar funções de matriz/consulta adequadas ao ambiente"
    ],
    "answers": [
      0,
      1,
      3
    ]
  },
  {
    "id": "v4-planilhas-09",
    "area": "Planilhas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma coluna contém números armazenados como texto. Qual sintoma pode ocorrer?",
    "explanation": "Números como texto não se comportam sempre como valores numéricos em cálculos e ordenações.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "SOMA ou ordenação numérica produzir resultados inesperados",
      "A planilha ganhará automaticamente mais linhas",
      "O compartilhamento será desativado",
      "As bordas desaparecerão"
    ],
    "answer": 0
  },
  {
    "id": "v4-formulas-01",
    "area": "Fórmulas",
    "difficulty": "basic",
    "type": "single",
    "question": "Qual fórmula soma os valores de D2 até D20 apenas quando a categoria em B é “Material”?",
    "explanation": "SOMASE verifica o critério em B e soma os valores correspondentes em D.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "=SOMASE(B2:B20;\"Material\";D2:D20)",
      "=CONT.SE(B2:B20;\"Material\")",
      "=SOMA(B2:B20;D2:D20)",
      "=SE(B2:B20=\"Material\";D2:D20)"
    ],
    "answer": 0
  },
  {
    "id": "v4-formulas-02",
    "area": "Fórmulas",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Qual fórmula conta registros com valor maior ou igual a 100 em C2:C50?",
    "explanation": "CONT.SE aceita critério entre aspas para contar células que atendem à comparação.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "=CONT.SE(C2:C50;\">=100\")",
      "=SOMASE(C2:C50;\">=100\")",
      "=CONTAR(C2:C50>=100)",
      "=SE(C2:C50>=100;1;0)"
    ],
    "answer": 0
  },
  {
    "id": "v4-formulas-03",
    "area": "Fórmulas",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Uma busca por código pode não encontrar o item. Qual fórmula evita exibir erro e mostra “Não localizado”?",
    "explanation": "SEERRO trata a falha da busca; FALSO exige correspondência exata no PROCV.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "=SEERRO(PROCV(A2;Produtos!A:D;4;FALSO);\"Não localizado\")",
      "=PROCV(A2;Produtos!A:D;4;VERDADEIRO)+\"Não localizado\"",
      "=SOMA(PROCV(A2;Produtos!A:D;4;FALSO))",
      "=CONT.SE(Produtos!A:A;A2)"
    ],
    "answer": 0
  },
  {
    "id": "v4-formulas-04",
    "area": "Fórmulas",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais fórmulas podem unir nome em A2 e sobrenome em B2 com um espaço? Selecione todas.",
    "explanation": "O operador & e CONCATENAR unem textos; SOMA e MÉDIA são funções numéricas.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "=A2&\" \"&B2",
      "=CONCATENAR(A2;\" \";B2)",
      "=SOMA(A2;B2)",
      "=MÉDIA(A2:B2)"
    ],
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "v4-formulas-05",
    "area": "Fórmulas",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene a leitura da fórmula =SE(E2>=Meta!$B$1;\"ATINGIDA\";\"ABAIXO\").",
    "explanation": "A leitura segue condição, resultado verdadeiro, resultado falso e comportamento da referência absoluta.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Comparar E2 com a meta fixa em Meta!B1",
      "Se a comparação for verdadeira, retornar ATINGIDA",
      "Caso contrário, retornar ABAIXO",
      "Copiar a fórmula mantendo a referência da meta fixa"
    ],
    "correctOrder": [
      "Comparar E2 com a meta fixa em Meta!B1",
      "Se a comparação for verdadeira, retornar ATINGIDA",
      "Caso contrário, retornar ABAIXO",
      "Copiar a fórmula mantendo a referência da meta fixa"
    ]
  },
  {
    "id": "v4-formulas-06",
    "area": "Fórmulas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Qual fórmula soma valores em D quando B é “Vendas” e C é “Pago”?",
    "explanation": "SOMASES recebe intervalo de soma e pares de intervalo/critério.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "=SOMASES(D2:D100;B2:B100;\"Vendas\";C2:C100;\"Pago\")",
      "=SOMASE(B2:B100;\"Vendas\";D2:D100;C2:C100;\"Pago\")",
      "=CONT.SES(D2:D100;B2:B100;\"Vendas\";C2:C100;\"Pago\")",
      "=SOMA(D2:D100;\"Vendas\";\"Pago\")"
    ],
    "answer": 0
  },
  {
    "id": "v4-formulas-07",
    "area": "Fórmulas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Em uma busca moderna, qual vantagem PROCVX/XLOOKUP oferece sobre PROCV tradicional?",
    "explanation": "PROCVX separa matriz de procura e retorno, permite busca à esquerda e tratamento de não encontrado.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Pode procurar em qualquer direção e definir retorno/valor não encontrado com mais flexibilidade",
      "Funciona apenas com dados ordenados",
      "Não aceita correspondência exata",
      "Substitui todas as funções condicionais"
    ],
    "answer": 0
  },
  {
    "id": "v4-formulas-08",
    "area": "Fórmulas",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Quais situações podem causar resultado incorreto em PROCV com o último argumento VERDADEIRO? Selecione todas.",
    "explanation": "Busca aproximada exige ordenação e não é adequada para códigos exatos; espaços também interferem.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Tabela não ordenada pelo campo de busca",
      "Uso quando se desejava correspondência exata",
      "Valor de busca textual com espaços invisíveis",
      "A coluna de retorno estar à direita"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-formulas-09",
    "area": "Fórmulas",
    "difficulty": "advanced",
    "type": "text",
    "question": "Digite uma fórmula que calcule a média de C2:C20 ignorando erros e mostre 0 se não for possível calcular.",
    "explanation": "SEERRO envolve a MÉDIA e retorna 0 caso a expressão resulte em erro.",
    "bankVersion": "2026.07.27-v4",
    "accepted": [
      "=SEERRO(MÉDIA(C2:C20);0)",
      "=SEERRO(MEDIA(C2:C20);0)"
    ],
    "placeholder": "=..."
  },
  {
    "id": "v4-seguranca-01",
    "area": "Segurança digital",
    "difficulty": "basic",
    "type": "single",
    "question": "Você recebe um código de autenticação que não solicitou e, em seguida, uma pessoa liga pedindo esse código. Qual ação é correta?",
    "explanation": "Códigos de autenticação são secretos; solicitação não iniciada pode indicar tentativa de acesso.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Não informar o código, encerrar o contato e revisar a conta por canal oficial",
      "Informar apenas os três primeiros dígitos",
      "Enviar o código se a pessoa souber seu nome",
      "Desativar o bloqueio de tela"
    ],
    "answer": 0
  },
  {
    "id": "v4-seguranca-02",
    "area": "Segurança digital",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Qual diferença descreve corretamente hash e criptografia?",
    "explanation": "As finalidades e propriedades são diferentes: integridade/verificação versus confidencialidade recuperável.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Hash é resumo unidirecional para integridade; criptografia é reversível com chave adequada para confidencialidade",
      "Hash e criptografia são sempre reversíveis sem chave",
      "Criptografia serve apenas para imagens; hash apenas para senhas",
      "Hash esconde o conteúdo e permite recuperá-lo depois"
    ],
    "answer": 0
  },
  {
    "id": "v4-seguranca-03",
    "area": "Segurança digital",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais práticas fortalecem autenticação? Selecione todas.",
    "explanation": "Senhas únicas, MFA e revisão de sessões reduzem impacto de vazamentos.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Usar gerenciador de senhas para credenciais únicas",
      "Ativar segundo fator preferencialmente por aplicativo ou chave",
      "Reutilizar a mesma senha complexa em todos os serviços",
      "Revisar alertas e sessões ativas"
    ],
    "answers": [
      0,
      1,
      3
    ]
  },
  {
    "id": "v4-seguranca-04",
    "area": "Segurança digital",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Uma mensagem usa domínio visualmente parecido com o oficial e pede login urgente. Qual verificação é mais útil?",
    "explanation": "A verificação deve ocorrer fora do link suspeito, usando canal e endereço conhecidos.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Abrir o link para conferir a aparência",
      "Analisar o domínio real e acessar o serviço digitando o endereço conhecido ou por aplicativo oficial",
      "Responder pedindo confirmação no mesmo e-mail",
      "Desativar o antivírus para evitar bloqueio falso"
    ],
    "answer": 1
  },
  {
    "id": "v4-seguranca-05",
    "area": "Segurança digital",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene a resposta inicial a uma suspeita de ransomware em um computador conectado à rede.",
    "explanation": "Isolamento e comunicação reduzem propagação; recuperação deve seguir procedimento institucional.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Desconectar o equipamento da rede sem apagar evidências",
      "Avisar imediatamente o responsável de TI/segurança",
      "Não pagar nem tentar ferramentas aleatórias",
      "Preservar informações e seguir o plano de resposta/recuperação"
    ],
    "correctOrder": [
      "Desconectar o equipamento da rede sem apagar evidências",
      "Avisar imediatamente o responsável de TI/segurança",
      "Não pagar nem tentar ferramentas aleatórias",
      "Preservar informações e seguir o plano de resposta/recuperação"
    ]
  },
  {
    "id": "v4-seguranca-06",
    "area": "Segurança digital",
    "difficulty": "advanced",
    "type": "single",
    "question": "Um site usa HTTPS. O que isso garante e o que não garante?",
    "explanation": "HTTPS protege transporte e identidade do certificado; sites maliciosos também podem usar HTTPS.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Criptografa a conexão e ajuda a autenticar o domínio, mas não garante que o conteúdo ou a empresa sejam honestos",
      "Garante que todo arquivo baixado é seguro",
      "Impede que o próprio site colete dados",
      "Torna senhas fracas impossíveis de adivinhar"
    ],
    "answer": 0
  },
  {
    "id": "v4-seguranca-07",
    "area": "Segurança digital",
    "difficulty": "advanced",
    "type": "single",
    "question": "Qual controle reduz o impacto de uma conta comprometida em um sistema administrativo?",
    "explanation": "Limitar privilégios reduz o alcance de ações indevidas e facilita responsabilização.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Privilégio mínimo e separação de funções",
      "Dar acesso de administrador a todos",
      "Compartilhar uma conta por setor",
      "Desativar registros de auditoria"
    ],
    "answer": 0
  },
  {
    "id": "v4-seguranca-08",
    "area": "Segurança digital",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Quais elementos são importantes em um plano de resposta a incidentes? Selecione todos.",
    "explanation": "Planos eficazes definem responsabilidades, contenção, evidências, comunicação e recuperação antes do incidente.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Papéis e contatos definidos",
      "Procedimentos de contenção e preservação de evidências",
      "Comunicação e recuperação testadas",
      "Improvisar somente quando ocorrer"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-seguranca-09",
    "area": "Segurança digital",
    "difficulty": "advanced",
    "type": "single",
    "question": "Por que uma cópia de backup permanentemente conectada e gravável pode falhar contra ransomware?",
    "explanation": "Cópias offline, imutáveis ou com versionamento reduzem o risco de serem comprometidas junto com a origem.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Porque o malware pode alcançar e criptografar a cópia junto com os arquivos originais",
      "Porque backups não armazenam documentos",
      "Porque criptografia só atinge arquivos PDF",
      "Porque mídias conectadas não possuem capacidade"
    ],
    "answer": 0
  },
  {
    "id": "v4-rotinas-01",
    "area": "Rotinas administrativas",
    "difficulty": "basic",
    "type": "single",
    "question": "Uma planilha de despesas possui colunas Data, Categoria, Descrição e Valor. Qual informação adicional melhora rastreabilidade sem expor dados desnecessários?",
    "explanation": "Identificador e responsável ajudam auditoria; dados pessoais irrelevantes devem ser evitados.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Identificador do lançamento e responsável pelo registro",
      "Senha pessoal do responsável",
      "Cópia integral de documento pessoal",
      "Cor favorita do solicitante"
    ],
    "answer": 0
  },
  {
    "id": "v4-rotinas-02",
    "area": "Rotinas administrativas",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Um indicador mostra que 98% dos pedidos foram concluídos, mas vários clientes reclamam de atraso. Qual análise é necessária?",
    "explanation": "Indicadores agregados podem esconder atrasos relevantes; definição e distribuição precisam ser examinadas.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Conferir definição do indicador, período, prazo e distribuição dos atrasos, não apenas o percentual agregado",
      "Ignorar reclamações porque o percentual é alto",
      "Mudar a cor do gráfico",
      "Excluir pedidos atrasados da base"
    ],
    "answer": 0
  },
  {
    "id": "v4-rotinas-03",
    "area": "Rotinas administrativas",
    "difficulty": "intermediate",
    "type": "multi",
    "question": "Quais características melhoram qualidade de uma base administrativa? Selecione todas.",
    "explanation": "Padronização, chaves e trilha de auditoria aumentam qualidade; células mescladas prejudicam análise.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Campos padronizados e validação",
      "Identificadores únicos",
      "Registro de alterações importantes",
      "Mesclar células dentro da área de dados"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-rotinas-04",
    "area": "Rotinas administrativas",
    "difficulty": "intermediate",
    "type": "single",
    "question": "Uma planilha possui uma linha por mês, mas várias vendas são digitadas dentro da mesma célula. Qual reorganização favorece análise?",
    "explanation": "Dados tabulares normalizados permitem filtros, fórmulas, tabelas dinâmicas e auditoria.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Uma linha por transação e uma coluna por atributo",
      "Mais cores dentro da mesma célula",
      "Uma aba diferente para cada venda",
      "Converter números em imagens"
    ],
    "answer": 0
  },
  {
    "id": "v4-rotinas-05",
    "area": "Rotinas administrativas",
    "difficulty": "intermediate",
    "type": "order",
    "question": "Ordene um processo de criação de dashboard administrativo.",
    "explanation": "Dashboard deve partir das decisões e de uma base confiável, terminando em validação.",
    "bankVersion": "2026.07.27-v4",
    "items": [
      "Definir decisões e indicadores necessários",
      "Preparar e validar a base de dados",
      "Calcular métricas e escolher visualizações",
      "Testar leitura, filtros e consistência dos totais"
    ],
    "correctOrder": [
      "Definir decisões e indicadores necessários",
      "Preparar e validar a base de dados",
      "Calcular métricas e escolher visualizações",
      "Testar leitura, filtros e consistência dos totais"
    ]
  },
  {
    "id": "v4-rotinas-06",
    "area": "Rotinas administrativas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma equipe quer medir produtividade pelo número de registros digitados. Qual risco esse indicador isolado cria?",
    "explanation": "Métricas isoladas podem gerar comportamento indesejado; qualidade e contexto também precisam ser medidos.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Incentivar quantidade sem considerar qualidade, complexidade ou retrabalho",
      "Impedir qualquer automatização",
      "Eliminar a necessidade de supervisão",
      "Garantir satisfação do cliente"
    ],
    "answer": 0
  },
  {
    "id": "v4-rotinas-07",
    "area": "Rotinas administrativas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Qual abordagem é mais adequada para dados pessoais em um relatório gerencial?",
    "explanation": "Minimização e agregação reduzem exposição sem impedir análise.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Exibir apenas dados necessários, agregando ou pseudonimizando quando possível",
      "Incluir todos os dados disponíveis para demonstrar transparência",
      "Publicar planilha editável para qualquer pessoa com link",
      "Remover somente os nomes, mantendo todos os demais identificadores diretos"
    ],
    "answer": 0
  },
  {
    "id": "v4-rotinas-08",
    "area": "Rotinas administrativas",
    "difficulty": "advanced",
    "type": "multi",
    "question": "Quais controles ajudam a detectar alterações indevidas em uma rotina financeira? Selecione todos.",
    "explanation": "Separação, auditoria e conciliação criam verificações independentes; senha compartilhada elimina rastreabilidade.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Segregação entre solicitação e aprovação",
      "Histórico/auditoria de alterações",
      "Conciliação com fonte independente",
      "Uma senha compartilhada por toda a equipe"
    ],
    "answers": [
      0,
      1,
      2
    ]
  },
  {
    "id": "v4-rotinas-09",
    "area": "Rotinas administrativas",
    "difficulty": "advanced",
    "type": "single",
    "question": "Uma base tem registros duplicados com nomes levemente diferentes. Qual estratégia é mais robusta para deduplicação?",
    "explanation": "Deduplicação exige identificadores, normalização e revisão de ambiguidades para evitar unir pessoas diferentes.",
    "bankVersion": "2026.07.27-v4",
    "options": [
      "Usar identificador confiável, normalizar campos, aplicar regras de correspondência e revisar casos ambíguos",
      "Excluir todos os nomes repetidos visualmente",
      "Considerar apenas a primeira letra do nome",
      "Ordenar por cor e apagar linhas consecutivas"
    ],
    "answer": 0
  }
];
