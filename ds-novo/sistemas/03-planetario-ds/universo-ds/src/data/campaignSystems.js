export const INTEGRATED_CAMPAIGNS=[
{id:'lunar-expedition',title:'Expedição Lunar Completa',icon:'◐',description:'Do hangar ao retorno, conectando lançamento, órbita, pouso, rover e ciência.',reward:900,stages:[
{id:'lunar-briefing',label:'Briefing e escolha do veículo',module:'launch-remaster',points:100,event:'weather-window'},
{id:'lunar-launch',label:'Lançamento e inserção orbital',module:'launch-remaster',points:160,event:'sensor-drift'},
{id:'lunar-transfer',label:'Transferência e navegação',module:'earth',points:130,event:'course-correction'},
{id:'lunar-landing',label:'Descida e pouso lunar',module:'planetary-remaster',points:190,event:'fuel-margin'},
{id:'lunar-surface',label:'Rover, amostras e instrumentos',module:'planetary-remaster',points:170,event:'terrain-risk'},
{id:'lunar-return',label:'Decolagem e retorno',module:'moon',points:150,event:'reentry-window'}]},
{id:'mars-expedition',title:'Exploradores de Marte',icon:'●',description:'Sonda, entrada atmosférica, rover, drone, braço e transmissão científica.',reward:950,stages:[
{id:'mars-design',label:'Preparar sonda e rover',module:'premium-assets',points:110,event:'mass-budget'},
{id:'mars-launch',label:'Lançar missão marciana',module:'launch-remaster',points:150,event:'max-q'},
{id:'mars-cruise',label:'Cruzeiro interplanetário',module:'solar-remaster',points:130,event:'solar-storm'},
{id:'mars-entry',label:'Entrada, descida e pouso',module:'planetary-remaster',points:190,event:'dust-density'},
{id:'mars-science',label:'Rover, braço e amostras',module:'mars',points:190,event:'wheel-slip'},
{id:'mars-drone',label:'Reconhecimento aéreo',module:'planetary-remaster',points:100,event:'battery-reserve'},
{id:'mars-downlink',label:'Transmitir pacote científico',module:'mission-control-advanced',points:130,event:'packet-loss'}]},
{id:'orbital-operations',title:'Operação Estação Espacial',icon:'✥',description:'Aproximação, acoplamento, manutenção, EVA, satélites e retorno.',reward:920,stages:[
{id:'station-rendezvous',label:'Rendezvous orbital',module:'station-remaster',points:130,event:'relative-velocity'},
{id:'station-docking',label:'Acoplamento 6DOF',module:'station-remaster',points:180,event:'alignment'},
{id:'station-entry',label:'Entrada e inspeção interna',module:'premium-assets',points:100,event:'pressure-check'},
{id:'station-maintenance',label:'Manutenção e suporte à vida',module:'station',points:170,event:'co2-rise'},
{id:'station-eva',label:'EVA e braço robótico',module:'station-remaster',points:170,event:'tether-load'},
{id:'station-satellite',label:'Inspeção de satélite',module:'visual-museum',points:110,event:'attitude-drift'},
{id:'station-return',label:'Desacoplar e retornar',module:'station-remaster',points:160,event:'deorbit-burn'}]}
];
export const CAMPAIGN_FAULTS=[
{id:'sensor-drift',label:'Deriva de sensor',severity:'high',procedure:'cross-validate'},
{id:'solar-storm',label:'Tempestade solar',severity:'critical',procedure:'safe-mode'},
{id:'packet-loss',label:'Perda de pacotes',severity:'medium',procedure:'selective-retry'},
{id:'co2-rise',label:'CO₂ crescente',severity:'critical',procedure:'backup-scrubber'},
{id:'alignment',label:'Erro de alinhamento',severity:'high',procedure:'hold-and-correct'}
];
export const CAMPAIGN_GOALS=[
{id:'start-campaign',label:'Iniciar uma campanha',xp:180},
{id:'resolve-event',label:'Resolver evento operacional',xp:240},
{id:'complete-three',label:'Concluir três etapas integradas',xp:320},
{id:'complete-campaign',label:'Concluir uma campanha',xp:650}
];
