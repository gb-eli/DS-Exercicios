export const QA_DEVICE_PROFILES=[
{id:'mobile-low',label:'Android modesto',width:360,height:800,dpr:2,memory:4,cores:4},
{id:'chromebook',label:'Chromebook escolar',width:1366,height:768,dpr:1,memory:4,cores:4},
{id:'notebook',label:'Notebook intermediário',width:1920,height:1080,dpr:1.25,memory:8,cores:8},
{id:'gaming',label:'PC com GPU dedicada',width:2560,height:1440,dpr:1.5,memory:16,cores:12}
];
export const QA_CHECKLIST=[
{id:'boot',label:'Inicialização e primeiro frame'}, {id:'resize',label:'Resize, rotação e fullscreen'}, {id:'input',label:'Teclado, toque e gamepad'},
{id:'lifecycle',label:'Workers, RAF e GPU liberados'}, {id:'fallback',label:'Fallback sem WebGL'}, {id:'storage',label:'Cache, backup e perfil'},
{id:'accessibility',label:'Contraste, movimento e leitura'}, {id:'performance',label:'FPS, memória e draw calls'}
];
export const QA_GOALS=[
{id:'run-diagnostic',label:'Executar diagnóstico',xp:220},
{id:'compare-packs',label:'Comparar três pacotes',xp:300},
{id:'complete-checklist',label:'Concluir checklist QA',xp:360},
{id:'export-report',label:'Exportar relatório final',xp:220}
];
