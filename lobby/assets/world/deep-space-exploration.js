export const DEEP_SPACE_CONSOLE=Object.freeze({
  id:'space-deep-exploration-console',type:'space-deep-exploration-console',name:'Central de Exploração Profunda AGV',
  x:42,z:58,radius:6,accent:'#7fe7ff',description:'Console de missões científicas para observação de Júpiter, Saturno, asteroides e uso do Telescópio Espacial AGV.'
});

export const SPACE_TELESCOPE=Object.freeze({
  id:'space-telescope',type:'space-telescope',name:'Telescópio Espacial AGV',
  x:12,z:-79,radius:6,accent:'#b8d7ff',description:'Instrumento virtual de observação profunda instalado junto à Cúpula da Estação Orbital AGV.'
});

export const DEEP_SPACE_MISSIONS=Object.freeze([
  Object.freeze({
    id:'jupiter',kind:'flyby',name:'Sobrevoo de Júpiter',icon:'🟠',accent:'#e4b184',target:'Júpiter',
    durationLabel:'Missão de observação',objective:'Aproxime a sonda, estabilize o enquadramento e registre uma varredura das faixas atmosféricas.',
    summary:'Simulação didática de um sobrevoo robótico pelo maior planeta do Sistema Solar.',
    facts:Object.freeze(['Diâmetro real ≈ 139.820 km','Grande Mancha Vermelha representada de forma estilizada','A missão usa escala e velocidades comprimidas'])
  }),
  Object.freeze({
    id:'saturn',kind:'flyby',name:'Anéis de Saturno',icon:'🪐',accent:'#efd39a',target:'Saturno',
    durationLabel:'Missão de observação',objective:'Orbite Saturno, ajuste a distância e faça uma varredura científica dos anéis.',
    summary:'Exploração visual dos anéis e do planeta usando uma sonda robótica AGV.',
    facts:Object.freeze(['Diâmetro real ≈ 116.460 km','Anéis são compostos principalmente por gelo e rocha','A inclinação dos anéis é enfatizada para facilitar a observação'])
  }),
  Object.freeze({
    id:'asteroids',kind:'navigation',name:'Campo de Asteroides',icon:'☄️',accent:'#c9b9a8',target:'Cinturão principal',
    durationLabel:'Navegação de sonda',objective:'Pilote a Sonda AGV entre os asteroides e execute três pulsos de varredura sem colisões.',
    summary:'Treino de navegação em um campo procedural inspirado no cinturão principal entre Marte e Júpiter.',
    facts:Object.freeze(['Asteroides reais ficam muito mais afastados do que nesta simulação','W/S controlam impulso e A/D direção','Espaço executa uma varredura científica'])
  }),
  Object.freeze({
    id:'telescope',kind:'telescope',name:'Telescópio Espacial AGV',icon:'🔭',accent:'#9bc7ff',target:'Espaço profundo',
    durationLabel:'Observatório orbital',objective:'Alterne entre os alvos, ajuste o zoom e registre observações de Terra, Sol, Júpiter e Saturno.',
    summary:'Modo de observação sem viagem, usando um telescópio virtual na Estação Orbital.',
    facts:Object.freeze(['Zoom digital didático de 1× a 8×','Alvos são representações procedurais, não imagens de observatório','Q/E alternam o alvo; W/S ajustam o zoom'])
  })
]);

export const TELESCOPE_TARGETS=Object.freeze([
  Object.freeze({id:'earth',name:'Terra',accent:'#58b8ff',kind:'earth'}),
  Object.freeze({id:'sun',name:'Sol',accent:'#ffd86b',kind:'sun'}),
  Object.freeze({id:'jupiter',name:'Júpiter',accent:'#d7b18d',kind:'jupiter'}),
  Object.freeze({id:'saturn',name:'Saturno',accent:'#e9cf91',kind:'saturn'})
]);

export const DEEP_SPACE_SCAN_GOAL=3;
export function getDeepSpaceMission(id){return DEEP_SPACE_MISSIONS.find(item=>item.id===String(id||''))||null;}
