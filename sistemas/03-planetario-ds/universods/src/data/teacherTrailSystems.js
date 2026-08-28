export const TEACHER_TRAIL_EVENT_TYPES = [
  {id:'module-opened',label:'Laboratório aberto',description:'Liberado quando o aluno entra no módulo indicado.'},
  {id:'interaction',label:'Interação registrada',description:'Exige ao menos uma ação dentro do laboratório.'},
  {id:'manual-evidence',label:'Evidência escrita',description:'Exige um registro curto do estudante antes de concluir.'},
  {id:'none',label:'Sem evento obrigatório',description:'A etapa depende somente da visita e do tempo configurado.'}
];

export const TEACHER_TRAIL_ADAPTATIONS = [
  {id:'standard',label:'Padrão',description:'Objetivos e desafios regulares.'},
  {id:'support',label:'Apoio guiado',description:'Mostra pistas adicionais e reduz a complexidade textual.'},
  {id:'advanced',label:'Aprofundamento',description:'Acrescenta uma pergunta técnica ou desafio extra.'}
];

export const TEACHER_TRAIL_TEMPLATES = [
  {
    id:'template-telemetry',title:'Diagnóstico de Telemetria',icon:'⌁',accent:'#5ee3ff',className:'2DS',minimumTotalMinutes:35,
    role:'Analista de sistemas de missão',opening:'Uma sequência de pacotes apresenta leituras inconsistentes e precisa ser validada.',mission:'Identificar a origem da falha e registrar uma decisão técnica.',completion:'O fluxo de telemetria foi revisado e documentado.',
    steps:[
      {moduleId:'technology-hub',title:'Mapear a arquitetura',objective:'Localize sensores, software embarcado, comunicação e painel.',why:'Antes de diagnosticar é necessário saber em qual camada cada dado é produzido.',expected:'Arquitetura identificada.',minimumMinutes:5,requiredEvent:'interaction'},
      {moduleId:'mission-control',title:'Observar a telemetria',objective:'Acompanhe leituras, alertas e estados do sistema.',why:'O centro de controle transforma pacotes em decisões operacionais.',expected:'Uma anomalia registrada.',minimumMinutes:8,requiredEvent:'manual-evidence'},
      {moduleId:'mission-control-advanced',title:'Validar estados e prioridades',objective:'Investigue filas, replay e tolerância a falhas.',why:'Sistemas críticos precisam manter ordem e rastreabilidade mesmo durante falhas.',expected:'Decisão técnica justificada.',minimumMinutes:10,requiredEvent:'manual-evidence'}
    ]
  },
  {
    id:'template-planets',title:'Expedição Comparativa pelos Planetas',icon:'◌',accent:'#ffcb68',className:'Ciências / DS',minimumTotalMinutes:40,
    role:'Pesquisador planetário',opening:'Uma equipe precisa selecionar o destino de uma missão robótica.',mission:'Comparar ambientes e escolher tecnologias adequadas para exploração.',completion:'O relatório comparativo foi concluído.',
    steps:[
      {moduleId:'curiosity-center',title:'Pesquisar os destinos',objective:'Compare pelo menos três corpos celestes.',why:'Dados de gravidade, atmosfera e temperatura orientam a engenharia da missão.',expected:'Comparação registrada.',minimumMinutes:7,requiredEvent:'interaction'},
      {moduleId:'solar-remaster',title:'Compreender posição e escala',objective:'Localize os destinos no Sistema Solar e observe suas órbitas.',why:'Distância e posição alteram comunicação, energia e duração da viagem.',expected:'Destino inspecionado.',minimumMinutes:7,requiredEvent:'module-opened'},
      {moduleId:'planetary-remaster',title:'Testar mobilidade',objective:'Explore Lua ou Marte usando caminhada, rover ou drone.',why:'Terreno e gravidade influenciam controles, rodas, energia e autonomia.',expected:'Ambiente analisado.',minimumMinutes:10,requiredEvent:'manual-evidence'},
      {moduleId:'telescope-lab',title:'Planejar uma observação',objective:'Monte um instrumento, selecione ocular e registre um alvo.',why:'A observação mostra como abertura, foco, campo e atmosfera limitam os dados disponíveis.',expected:'Observação e configuração registradas.',minimumMinutes:8,requiredEvent:'manual-evidence'}
    ]
  },
  {
    id:'template-mission',title:'Missão Integrada: Lançar, Explorar e Relatar',icon:'▲',accent:'#ff879d',className:'3DS',minimumTotalMinutes:50,
    role:'Diretor de operações',opening:'Uma nova missão precisa ser preparada do lançamento ao relatório final.',mission:'Executar uma sequência de engenharia, exploração e documentação.',completion:'A missão foi concluída com evidências consolidadas.',
    steps:[
      {moduleId:'launch-remaster',title:'Inspecionar e lançar',objective:'Observe o veículo e acompanhe as fases do lançamento.',why:'A sequência de lançamento depende de inspeção, intertravamentos e telemetria.',expected:'Lançamento acompanhado.',minimumMinutes:10,requiredEvent:'interaction'},
      {moduleId:'integrated-campaigns',title:'Conduzir a campanha',objective:'Escolha Lua, Marte ou estação e avance pelos checkpoints.',why:'Campanhas conectam decisões técnicas em um enredo completo.',expected:'Checkpoint de campanha registrado.',minimumMinutes:15,requiredEvent:'manual-evidence'},
      {moduleId:'curiosity-center',title:'Contextualizar a missão',objective:'Abra fichas relacionadas ao destino, veículo e tecnologias.',why:'O relatório precisa separar experiência, dados científicos e contexto histórico.',expected:'Síntese final escrita.',minimumMinutes:8,requiredEvent:'manual-evidence'}
    ]
  }
];

export const DEFAULT_CLASSROOM_INSTRUCTIONS = 'Exporte a evidência ao concluir, abra a atividade configurada no Google Classroom e anexe o arquivo antes de enviar.';
