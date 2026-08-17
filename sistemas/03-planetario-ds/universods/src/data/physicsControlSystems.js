export const PHYSICS_ENVIRONMENTS=[
{id:'earth',label:'Terra',icon:'◎',description:'Caminhada, corrida, salto e colisão com gravidade terrestre.'},
{id:'moon',label:'Lua',icon:'◐',description:'Gravidade reduzida, saltos longos e baixa aderência.'},
{id:'mars',label:'Marte',icon:'●',description:'Gravidade intermediária e poeira.'},
{id:'microgravity',label:'EVA 6DOF',icon:'✥',description:'Translação e rotação sem referência de cima ou baixo.'},
{id:'rover',label:'Rover',icon:'⬡',description:'Suspensão, tração, inclinação e terreno.'},
{id:'flight',label:'Nave',icon:'▲',description:'RCS, combustível e seis graus de liberdade.'}
];
export const CONTROL_PRESETS=[
{id:'standard',label:'Padrão',sensitivity:1,assist:.2},
{id:'assisted',label:'Assistido',sensitivity:.72,assist:.7},
{id:'simulation',label:'Simulação',sensitivity:1.2,assist:0}
];
export const PHYSICS_GOALS=[
{id:'visit-gravities',label:'Comparar três gravidades',xp:260},
{id:'drive-rover',label:'Conduzir o rover por 250 m',xp:280},
{id:'six-dof',label:'Controlar voo em 6DOF',xp:300},
{id:'gamepad',label:'Validar esquema de controle',xp:220}
];
