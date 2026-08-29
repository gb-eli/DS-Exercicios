/**
 * Revisão editorial das alternativas — v2.2.5.
 * Reduz pistas de tamanho, distribui a posição das respostas corretas e mantém
 * a aleatorização por sessão feita pelo app.js.
 */

const DIAGNOSTIC_CORRECT_REVISIONS={
  'v4-basica-01':'Criar uma versão identificada com “Salvar como”',
  'v4-basica-04':'Tab segue a ordem dos elementos interativos',
  'v4-basica-05':'Comparar, consolidar e só depois remover duplicatas',
  'v4-basica-06':'Reduz dados locais, mas não oculta a atividade na rede',
  'v4-basica-07':'A sincronização também replica exclusões e danos',
  'v4-basica-08':'3 cópias, 2 mídias e 1 fora do local',
  'v4-basica-09':'Testar em cópia, validar e registrar antes de aplicar',
  'v4-hardware-01':'Capacidade e uso da memória RAM',
  'v4-hardware-02':'Depende do padrão e dos recursos da porta',
  'v4-hardware-04':'No-break adequado à carga',
  'v4-hardware-06':'Inicialização e abertura de muitos arquivos',
  'v4-hardware-07':'Paginação intensa causada por falta de RAM',
  'v4-hardware-08':'Compartilhamento de parte da RAM com a GPU',
  'v4-arquivos-01':'.xlsm',
  'v4-arquivos-02':'Codificação e separador incompatíveis',
  'v4-arquivos-03':'PNG ou formato vetorial',
  'v4-arquivos-06':'Hash apenas verifica integridade',
  'v4-arquivos-07':'Perda acumulada pela recompressão com perdas',
  'v4-arquivos-08':'Restrições de preservação e recursos incorporados',
  'v4-arquivos-09':'CSV guarda valores tabulares, não recursos da pasta',
  'v4-drive-01':'Leitor para o grupo e editor só para responsáveis',
  'v4-drive-02':'Atalho referencia o arquivo; cópia cria outro',
  'v4-drive-04':'Comparar, consolidar e definir a versão oficial',
  'v4-drive-06':'Permissões podem ser herdadas ou restringidas',
  'v4-drive-07':'Criar atalhos para o mesmo arquivo',
  'v4-drive-09':'Transferir e revisar acessos',
  'v4-documentos-email-01':'Responsáveis em Para; interessados em CC',
  'v4-documentos-email-02':'Falta permissão no arquivo',
  'v4-documentos-email-04':'Quando alterações precisam de aprovação prévia',
  'v4-documentos-email-06':'Urgência, quebra de processo e bloqueio de verificação',
  'v4-documentos-email-07':'Assinatura digital valida identidade e integridade',
  'v4-documentos-email-08':'Manter só quem precisa responder e preservar sigilo',
  'v4-documentos-email-09':'Aplicar estilos de título hierárquicos',
  'v4-apresentacoes-01':'Mensagem clara e hierarquia visual',
  'v4-apresentacoes-02':'Gráfico de linhas',
  'v4-apresentacoes-04':'Distorção ou barras laterais na projeção',
  'v4-apresentacoes-06':'Escala que exagera visualmente a diferença',
  'v4-apresentacoes-07':'Quando é preciso ampliar sem perder qualidade',
  'v4-apresentacoes-09':'Poucos indicadores, contexto e destaque de exceções',
  'v4-forms-01':'Múltipla escolha',
  'v4-forms-02':'Validação por padrão ou comprimento',
  'v4-forms-04':'Ir para seção conforme a resposta',
  'v4-forms-06':'Minimização de dados',
  'v4-forms-07':'Preservar colunas automáticas e analisar em outras abas',
  'v4-forms-09':'Interpretações diferentes reduzem a comparabilidade',
  'v4-planilhas-01':'=B3*C3',
  'v4-planilhas-02':'=C2*$B$1',
  'v4-planilhas-03':'Só parte da tabela foi ordenada',
  'v4-planilhas-06':'A célula está formatada como número serial',
  'v4-planilhas-07':'Filtrar sem alterar a visão dos colaboradores',
  'v4-planilhas-09':'Somas e ordenações podem produzir resultados incorretos',
  'v4-formulas-01':'=SOMASE(B2:B20;"Material";D2:D20)',
  'v4-formulas-02':'=CONT.SE(C2:C50;">=100")',
  'v4-formulas-03':'=SEERRO(PROCV(A2;Produtos!A:D;4;FALSO);"Não localizado")',
  'v4-formulas-06':'=SOMASES(D2:D100;B2:B100;"Vendas";C2:C100;"Pago")',
  'v4-formulas-07':'Busca em qualquer direção e retorno configurável',
  'v4-seguranca-01':'Não informar o código e verificar pelo canal oficial',
  'v4-seguranca-02':'Hash é unidirecional; criptografia usa chave reversível',
  'v4-seguranca-04':'Conferir o domínio e abrir o serviço por endereço conhecido',
  'v4-seguranca-06':'Protege a conexão, não a honestidade do conteúdo',
  'v4-seguranca-07':'Privilégio mínimo e separação de funções',
  'v4-seguranca-09':'O malware pode criptografar a cópia conectada',
  'v4-rotinas-01':'Identificador do lançamento e responsável',
  'v4-rotinas-02':'Conferir período e distribuição',
  'v4-rotinas-04':'Uma linha por transação',
  'v4-rotinas-06':'Ignora qualidade e retrabalho',
  'v4-rotinas-07':'Exibir só o necessário, agregando ou pseudonimizando',
  'v4-rotinas-09':'Normalizar e relacionar por ID'
};


const GUIDED_FULL_REVISIONS=[
  {match:q=>q.q==='Qual nome de arquivo é mais adequado para uso mensal?',options:['Planilha mensal sem identificação','Controle de Estoque — Julho/2026','Arquivo final revisado da empresa','Dados gerais do mês atual'],answer:1},
  {match:q=>q.q==='Uma pessoa recebe o link, mas vê “Acesso negado”. Qual verificação deve ser feita primeiro?',options:['Conferir a cor usada na aba','Revisar a permissão do e-mail ou link','Verificar o tamanho atual da fonte','Contar o número de linhas da tabela'],answer:1},
  {match:q=>q.q==='Qual é a principal vantagem de manter abas separadas para Dados e Resumo?',options:['Usar mais cores na apresentação','Separar registros da análise e reduzir erros','Eliminar a necessidade de fórmulas','Transformar a planilha em documento'],answer:1},
  {match:q=>q.q==='Uma tabela usa fundo amarelo, texto branco e fonte tamanho 8. Qual é o principal problema?',options:['Cálculo incorreto na coluna principal','Contraste baixo e texto difícil de ler','Duplicação indevida da aba de dados','Permissão inadequada para edição'],answer:1},
  {match:q=>q.q==='Qual uso de cor é mais funcional?'&&q.options?.includes('Uma cor por célula'),options:['Uma cor diferente em cada célula da tabela','Cores consistentes para alertas e estados','Cores escolhidas sem padrão ou finalidade','Texto e fundo com tons muito semelhantes'],answer:1},
  {match:q=>q.q==='Qual uso de cor é mais funcional?'&&q.options?.includes('Uma cor aleatória por linha'),options:['Uma cor aleatória diferente em cada linha','Cores consistentes para cabeçalho e alertas','Fundo e texto usando tons muito próximos','Muitas cores aplicadas sem função ou legenda'],answer:1},
  {match:q=>q.q==='Qual título é mais claro?',options:['Relatório administrativo atualizado','Relatório de Despesas — Agosto/2026','Dados financeiros revisados','Arquivo final da empresa'],answer:1},
  {match:q=>q.q==='Quando usar itálico?',options:['Em todos os títulos e cabeçalhos','Em observações ou notas secundárias','Para substituir fórmulas da planilha','Para ocultar informações importantes'],answer:1},
  {match:q=>q.q==='Em uma base de dados, por que mesclar células no meio da tabela pode ser prejudicial?',options:['Aumenta o tamanho do arquivo sem necessidade','Dificulta filtros, ordenação e seleção','Impede o uso de negrito nos cabeçalhos','Altera as configurações gerais do sistema'],answer:1},
  {match:q=>q.q==='Uma coluna mostra valores monetários. Qual formato é mais adequado?',options:['Texto sem formatação numérica','Moeda com duas casas decimais','Porcentagem com símbolo de %','Data no formato dia/mês/ano'],answer:1},
  {match:q=>q.q==='Por que bordas muito grossas em todas as células podem ser ruins?',options:['Impedem a execução correta das fórmulas','Competem com os dados e reduzem a hierarquia','Excluem linhas e colunas automaticamente','Desativam os filtros aplicados na tabela'],answer:1},
  {match:q=>q.q==='Qual alinhamento costuma ser mais legível para valores numéricos comparáveis?',options:['Alinhamento diferente em cada célula','Alinhamento consistente, geralmente à direita','Centralização obrigatória dos valores','Inclinação aplicada a todos os números'],answer:1},
  {match:q=>q.q==='Uma fonte decorativa foi aplicada em 800 linhas. Qual problema principal?',options:['Reduz automaticamente o número de células','Prejudica a leitura e o aspecto profissional','Altera os resultados das fórmulas','Converte o arquivo para PDF'],answer:1}
];

const GUIDED_CORRECT_REVISIONS={
  'A empresa possui arquivos de estoque de vários meses. Qual nome facilita mais a localização e evita confusão?':'Controle de Estoque — Julho/2026',
  'O arquivo no Drive chama-se “Controle de Estoque — 2026”. Dentro dele, a primeira tabela deve apresentar qual título?':'Posição do estoque por produto — Julho/2026',
  'Qual situação justifica criar uma nova aba no mesmo arquivo, em vez de um novo arquivo?':'Resumo mensal ligado aos mesmos dados',
  'Uma fórmula usa C3:C12. O que isso indica?':'As dez células de C3 até C12',
  'Um relatório contém dados financeiros e será consultado por três pessoas. Qual configuração reduz mais o risco?':'Acesso nominal com permissão mínima',
  'Um funcionário deixou a equipe, mas ainda aparece como editor. Qual ação é correta?':'Remover o acesso e revisar arquivos sensíveis',
  'Qual nome de arquivo é mais adequado para uso mensal?':'Controle de Estoque — Julho/2026',
  'O arquivo precisa ser editado por duas pessoas e apenas consultado por quinze. Qual configuração é adequada?':'Editor para duas responsáveis e leitor para os demais',
  'Qual prática reduz confusão em uma planilha com vários setores?':'Nomes curtos e descritivos, como Vendas e Estoque',
  'Uma pessoa recebe o link, mas vê “Acesso negado”. Qual verificação deve ser feita primeiro?':'Permissão associada ao e-mail ou ao link',
  'Qual é a principal vantagem de manter abas separadas para Dados e Resumo?':'Separar dados e análise',
  'Para destacar um cabeçalho, o melhor conjunto é:':'Negrito, preenchimento e bom contraste',
  'Bordas servem principalmente para:':'Organizar visualmente os dados',
  'Uma tabela usa fundo amarelo, texto branco e fonte tamanho 8. Qual é o principal problema?':'Contraste e legibilidade inadequados',
  'Qual uso de cor é mais funcional?':'Cores consistentes para cabeçalho, alertas e estados',
  'Qual título é mais claro?':'Relatório de Despesas — Agosto/2026',
  'Quando usar itálico?':'Em observações e informações secundárias',
  'Qual combinação cria melhor hierarquia para um título principal?':'Fonte maior, negrito e contraste suficiente',
  'Em uma base de dados, por que mesclar células no meio da tabela pode ser prejudicial?':'Dificulta filtros, ordenação e seleção de registros',
  'Ao imprimir, parte da tabela fica fora da página. Qual ajuste é mais coerente?':'Revisar orientação, margens e escala',
  'O total geral aparece no meio dos registros com a mesma formatação. Qual melhoria é mais adequada?':'Separar e destacar a linha de total',
  'Uma tabela usa vermelho e verde para status. Qual complemento melhora acessibilidade?':'Adicionar texto ou ícones além da cor',
  'Por que bordas muito grossas em todas as células podem ser ruins?':'Competem com os dados e reduzem a hierarquia',
  'Qual alinhamento costuma ser mais legível para valores numéricos comparáveis?':'Alinhamento consistente, normalmente à direita',
  'Uma fonte decorativa foi aplicada em 800 linhas. Qual problema principal?':'Prejudica a legibilidade e o aspecto profissional',
  'Por que =10*5 é menos flexível que =B2*C2?':'Usa números fixos',
  'O que acontece se C2 mudar de 5 para 8 em =B2*C2?':'O resultado é recalculado',
  'Qual sequência é mais lógica?':'Organizar, calcular, validar e só então formatar',
  'Formatação condicional altera o valor da célula?':'Não, altera somente a aparência',
  'Qual combinação oferece melhor acompanhamento?':'SE + CONT.SE + formatação condicional',
  'Uma fórmula foi copiada para baixo, mas todas as linhas usam B2*C2. O problema provável é:':'Referências digitadas como texto ou fixadas',
  'Qual estrutura reduz erros?':'Separar entradas manuais de resultados calculados',
  'O melhor uso de referências é:':'Referências de células que acompanham os dados',
  'CONT.SE retorna:':'Quantidade que atende ao critério',
  'Filtro serve para:':'Mostrar registros por critério',
  'Validação de dados ajuda a:':'Padronizar as entradas',

  'Em =B2*(1+C2), C2 representa melhor:':'Uma taxa decimal',
  'Se uma célula do intervalo contém texto, MÉDIA geralmente:':'Ignora o texto',
  'Uma média de vendas aumentou porque uma venda excepcional foi muito alta. Qual medida adicional ajuda a interpretar?':'A mediana',
  'Se B2:B10 contém células vazias, MÉDIA:':'Considera só números',
  'Um total não confere. Qual verificação é mais importante?':'Conferir o intervalo',
  'Quando usar E dentro de SE?':'Quando todas devem valer',
  'Quando usar OU dentro de SE?':'Quando uma condição basta',
  'Qual problema ocorre se intervalo de soma e critério têm tamanhos diferentes?':'Resultado incorreto ou erro',
  'Formatação condicional altera o valor da célula?':'Não, apenas a aparência',
  'Qual combinação oferece melhor acompanhamento?':'SE, CONT.SE e destaque visual',
  'Qual vantagem da formatação condicional?':'Destacar conforme uma regra',
  'Para destacar o texto “PENDENTE”, qual regra é apropriada?':'Texto igual a PENDENTE',
  'Por que usar muitas cores sem legenda é ruim?':'Gera ambiguidade visual',
  'A regra é aplicada a B2:B10, mas novos dados vão até B30. Qual problema?':'As novas linhas ficam de fora',
  'Duas regras aplicam cores diferentes à mesma célula. O que deve ser revisado?':'Prioridade das regras',
  'Qual combinação é mais acessível para status?':'Cor com texto ou ícone',
  'Por que barras de dados podem induzir erro se misturam valores negativos e positivos?':'Escala e zero mal definidos',
  'Qual regra destaca os 10 maiores valores sem escolher limite fixo?':'Regra dos 10 maiores',
  'Antes de usar cor vermelha para “crítico”, qual decisão é essencial?':'Definir o critério de crítico',
  'Uma fórmula foi copiada para baixo, mas todas as linhas usam B2*C2. O problema provável é:':'Referências fixadas',
  'O melhor uso de referências é:':'Referenciar as células',
  'Qual desenho é mais adequado para controle de estoque?':'Uma linha por produto',
  'Por que proteger colunas de fórmula?':'Evitar alterações acidentais',
  'Um total está duplicado porque a linha de subtotal foi incluída na SOMA. Qual solução?':'Excluir o subtotal do intervalo',
  'Ao copiar =C2*$H$1 para baixo, o que muda?':'C2 muda; H1 fica fixo',
  'Uma coluna numérica contém “R$ 1.200,00” como texto importado. Qual consequência?':'Cálculos podem falhar',
  'Qual prática ajuda a detectar alteração indevida de fórmulas?':'Comparar com o modelo',
  'Qual teste valida melhor uma fórmula de estoque?':'Testar casos-limite e normais',
  'SOMASE precisa de um intervalo de soma quando:':'Critério e valor ficam separados',
  'Por que usar formatação condicional junto com SE?':'Tornar a classificação visível',
  'Primeiro passo para contar estoques críticos:':'Criar uma classificação padrão',
  'Quando usar SE com E?':'Quando todas devem valer',
  'Por que usar SEERRO em uma busca?':'Tratar falhas previstas',
  'Qual risco de usar correspondência aproximada em busca por código?':'Retornar o item errado',
  'Uma regra usa textos “Pago”, “PAGO” e “pago”. Qual melhoria estrutural é melhor?':'Usar uma lista padronizada',
  'Evitar quantidades negativas.':'Exigir valor zero ou maior',
  'Mostrar composição de poucas categorias:':'Gráfico de setores moderado',
  'Qual conjunto é adequado para estoque?':'Total, críticos, valor e movimentos',
  'Ordem visual do painel.':'Título, KPIs, gráficos e notas',
  'Há 12 itens críticos e aumento de saídas. Qual decisão inicial?':'Filtrar os itens críticos',
  'Por que validar totais do dashboard com a base?':'Detectar cálculos incorretos',
  'Um gráfico de vendas começa o eixo em 990 e termina em 1010. Qual cuidado é necessário?':'Explicitar a escala reduzida',
  'Qual KPI melhor mede cumprimento de prazo?':'Percentual entregue no prazo',
  'Por que um dashboard com 20 gráficos pode ser menos útil?':'Dificulta a leitura prioritária',
  'Uma média de atendimento caiu, mas o volume aumentou muito. Qual análise complementar é importante?':'Analisar distribuição e períodos',
  'Qual desenho permite atualização com novos dados sem refazer gráficos?':'Base e intervalos dinâmicos',
  'Um gráfico de pizza possui 18 categorias semelhantes. Qual alternativa melhora leitura?':'Usar barras ordenadas'
};

function questionKey(question){return String(question.id||question.q||question.question||question.prompt||'').trim()}
function compactCorrect(text){
  let value=String(text||'').trim();
  if(!value||value.startsWith('=')||value.length<34)return value;
  value=value.replace(/^Porque\s+/i,'').replace(/,\s*porque\s+.*$/i,'').replace(/,\s*pois\s+.*$/i,'');
  const semicolon=value.indexOf(';');if(semicolon>16)value=value.slice(0,semicolon);
  return value.replace(/\s+/g,' ').trim();
}
function moveCorrectTo(question,target){
  if(!Array.isArray(question.options)||!Number.isInteger(question.answer)||question.options.length<2)return;
  const entries=question.options.map((text,index)=>({text,index}));
  const correct=entries.find(item=>item.index===question.answer);const wrong=entries.filter(item=>item.index!==question.answer);
  const position=Math.max(0,Math.min(entries.length-1,target%entries.length));wrong.splice(position,0,correct);
  question.options=wrong.map(item=>item.text);question.answer=position;
}
function reviseSingle(question,target){
  if(!Array.isArray(question.options)||!Number.isInteger(question.answer))return;
  const full=GUIDED_FULL_REVISIONS.find(item=>item.match(question));if(full){question.options=[...full.options];question.answer=full.answer;}
  const key=questionKey(question);const revised=DIAGNOSTIC_CORRECT_REVISIONS[key]||GUIDED_CORRECT_REVISIONS[key];
  question.options=[...question.options];question.options[question.answer]=revised||compactCorrect(question.options[question.answer]);
  moveCorrectTo(question,target);question.qualityRevision='2.2.5';
}
function visitLessonQuestions(lessons,callback){
  for(const lesson of lessons||[])for(const stage of lesson.stages||[]){
    for(const question of stage.questions||stage.tasks||[])callback(question,lesson,stage);
  }
}
export function prepareQuestionQuality({lessons=[],questionBank=[]}={}){
  let guidedIndex=0,diagnosticIndex=0;
  visitLessonQuestions(lessons,question=>{if(Array.isArray(question.options)&&Number.isInteger(question.answer))reviseSingle(question,guidedIndex++%4)});
  for(const question of questionBank){if(Array.isArray(question.options)&&Number.isInteger(question.answer))reviseSingle(question,diagnosticIndex++%4)}
  return auditQuestionQuality({lessons,questionBank});
}
export function auditQuestionQuality({lessons=[],questionBank=[]}={}){
  const guided=[];visitLessonQuestions(lessons,q=>{if(Array.isArray(q.options)&&Number.isInteger(q.answer))guided.push(q)});
  const diagnostic=(questionBank||[]).filter(q=>Array.isArray(q.options)&&Number.isInteger(q.answer));
  const summarize=list=>{
    const positions=[0,0,0,0];let significantLengthCue=0;
    for(const q of list){positions[q.answer]=(positions[q.answer]||0)+1;const correct=String(q.options[q.answer]).length;const longestWrong=Math.max(...q.options.filter((_,i)=>i!==q.answer).map(value=>String(value).length));if(correct>=longestWrong+10&&correct>=longestWrong*1.25)significantLengthCue++;}
    return {questions:list.length,positions,significantLengthCue,significantLengthCueRate:list.length?Math.round(significantLengthCue/list.length*1000)/10:0};
  };
  return {guided:summarize(guided),diagnostic:summarize(diagnostic)};
}
