import { SCHOOL_SCHEDULE, CLASSES } from './data.js?v=20260811r38';

function zonedParts(date=new Date()){
  const parts=new Intl.DateTimeFormat('pt-BR',{timeZone:SCHOOL_SCHEDULE.timezone,weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const obj=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  const weekdays={dom:0,seg:1,ter:2,qua:3,qui:4,sex:5,sáb:6,sab:6};
  return {weekday:weekdays[(obj.weekday||'').slice(0,3).toLowerCase()]??date.getDay(),hour:Number(obj.hour),minute:Number(obj.minute),dateLabel:`${obj.day}/${obj.month}/${obj.year}`};
}
function toMinutes(value){const [h,m]=String(value).split(':').map(Number);return h*60+m}
function formatRemaining(minutes){if(minutes<=1)return'1 minuto';return`${minutes} minutos`}
export function getSchoolContext(classId,date=new Date()){
  const parts=zonedParts(date),cls=CLASSES[classId],shiftId=cls?.shift||null,shift=shiftId?SCHOOL_SCHEDULE.shifts[shiftId]:null,current=parts.hour*60+parts.minute;
  if(!shift)return {state:'unknown',label:'Horário não identificado',message:'Selecione uma turma para ver o horário escolar.',remainingMinutes:null,timezone:SCHOOL_SCHEDULE.timezone};
  if(!SCHOOL_SCHEDULE.schoolDays.includes(parts.weekday))return {state:'non-school-day',shift:shiftId,label:'Fora do horário regular',message:'Hoje não há aula regular configurada. Você pode continuar estudando normalmente.',remainingMinutes:null,timezone:SCHOOL_SCHEDULE.timezone};
  const periods=shift.periods,first=toMinutes(periods[0].start),last=toMinutes(periods.at(-1).end);
  if(current<first)return {state:'before-shift',shift:shiftId,label:`Antes do ${shift.label.toLowerCase()}`,message:`Sua turma começa às ${periods[0].start}. Você pode adiantar a atividade.`,remainingMinutes:first-current,nextStart:periods[0].start,timezone:SCHOOL_SCHEDULE.timezone};
  if(current>=last)return {state:'after-shift',shift:shiftId,label:'Fora do horário da turma',message:'O turno já terminou. Você pode continuar, mas confira o prazo e salve antes de fechar.',remainingMinutes:null,timezone:SCHOOL_SCHEDULE.timezone};
  const period=periods.find(p=>current>=toMinutes(p.start)&&current<toMinutes(p.end));
  if(!period)return {state:'between-periods',shift:shiftId,label:'Entre períodos',message:'O próximo período começará em breve. Seu progresso pode continuar normalmente.',remainingMinutes:null,timezone:SCHOOL_SCHEDULE.timezone};
  const remaining=toMinutes(period.end)-current;
  if(period.type==='break')return {state:'break',shift:shiftId,label:`Intervalo · volta ${period.end}`,message:`Agora é o intervalo. Seu progresso permanece disponível.`,remainingMinutes:remaining,start:period.start,end:period.end,timezone:SCHOOL_SCHEDULE.timezone};
  const isLast=period.number===periods.filter(p=>p.type==='class').at(-1)?.number;
  let message=`Você está na ${period.number}ª aula. Restam aproximadamente ${formatRemaining(remaining)}.`;
  if(isLast&&remaining<=15)message=`Última aula do turno. Restam cerca de ${formatRemaining(remaining)}: salve, exporte e confira a entrega.`;
  else if(remaining<=5)message='Últimos minutos da aula: salve o progresso e prepare o resultado.';
  else if(remaining<=10)message='A aula está terminando. Confira o que falta e prepare a entrega.';
  return {state:'class',shift:shiftId,periodNumber:period.number,label:`${period.number}ª aula · termina ${period.end}`,message,remainingMinutes:remaining,start:period.start,end:period.end,isLast,timezone:SCHOOL_SCHEDULE.timezone};
}
export function scheduleTone(context){if(['class','break'].includes(context.state))return context.remainingMinutes!=null&&context.remainingMinutes<=5?'important':'info';if(['before-shift','after-shift','non-school-day'].includes(context.state))return'neutral';return'neutral'}
