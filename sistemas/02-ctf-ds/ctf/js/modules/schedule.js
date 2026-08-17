import { platformConfig } from '../config/platform-config.js';
import { escapeHtml } from '../core/utils.js';

const weekdayMap = { domingo: 0, 'segunda-feira': 1, 'terça-feira': 2, 'quarta-feira': 3, 'quinta-feira': 4, 'sexta-feira': 5, sábado: 6 };
const timeToMinutes = (value) => { const [hour, minute] = value.split(':').map(Number); return hour * 60 + minute; };

export const institutionalParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: platformConfig.timezone,
    weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date).reduce((result, item) => ({ ...result, [item.type]: item.value }), {});
  const weekday = weekdayMap[parts.weekday?.toLocaleLowerCase('pt-BR')] ?? date.getDay();
  return {
    year: Number(parts.year), month: Number(parts.month), day: Number(parts.day),
    hour: Number(parts.hour) % 24, minute: Number(parts.minute), weekday,
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
};

export const resolveShiftForClass = (className = '') => {
  const normalized = String(className).toLocaleLowerCase('pt-BR');
  const configured = platformConfig.schoolSchedule.classes.find((item) => item.value.toLocaleLowerCase('pt-BR') === normalized || normalized.includes(item.value.toLocaleLowerCase('pt-BR')));
  if (configured) return configured.shift;
  if (/noturno|subsequente|noite/.test(normalized)) return 'night';
  if (/\b[123][ºo]?\s*ds\b|manhã|manha/.test(normalized)) return 'morning';
  return '';
};

export const detectCurrentPeriod = (className, date = new Date()) => {
  const now = institutionalParts(date);
  const shift = resolveShiftForClass(className);
  if (!shift) return { state: 'unknown', shift: '', now, label: 'Horário não identificado' };
  const schedule = platformConfig.schoolSchedule.shifts[shift];
  if (!platformConfig.schoolSchedule.schoolDays.includes(now.weekday)) return { state: 'non-school-day', shift, now, schedule, label: 'Fora de um dia letivo configurado' };
  const minuteOfDay = now.hour * 60 + now.minute;
  const first = timeToMinutes(schedule.periods[0].start);
  const last = timeToMinutes(schedule.periods.at(-1).end);
  if (minuteOfDay < first) return { state: 'before-shift', shift, now, schedule, label: `Antes do ${schedule.label.toLocaleLowerCase('pt-BR')}`, nextAt: schedule.periods[0].start };
  if (minuteOfDay >= last) return { state: 'after-shift', shift, now, schedule, label: `Fora do ${schedule.label.toLocaleLowerCase('pt-BR')}` };
  const current = schedule.periods.find((period) => minuteOfDay >= timeToMinutes(period.start) && minuteOfDay < timeToMinutes(period.end));
  if (!current) return { state: 'between-periods', shift, now, schedule, label: 'Entre períodos' };
  const remainingMinutes = Math.max(0, timeToMinutes(current.end) - minuteOfDay);
  if (current.type === 'break') return { state: 'break', shift, now, schedule, current, remainingMinutes, label: `${current.label} · volta ${current.end}` };
  const isLast = current === schedule.periods.filter((period) => period.type === 'class').at(-1);
  return { state: 'class', shift, now, schedule, current, remainingMinutes, isLast, label: `${current.number}ª aula · termina ${current.end}` };
};

export const scheduleMessage = (status, profile = {}) => {
  if (!profile.settings?.scheduleNotifications && profile.settings?.scheduleNotifications !== undefined) return null;
  if (status.state === 'class') {
    if (status.remainingMinutes <= 5) return { level: 'attention', title: 'Últimos minutos da aula', message: 'Salve seu progresso e prepare sua evidência antes de sair.' };
    if (status.remainingMinutes <= 15) return { level: 'info', title: `${status.current.number}ª aula`, message: `Restam aproximadamente ${status.remainingMinutes} minutos. Confira o que ainda falta.` };
    if (status.isLast) return { level: 'info', title: 'Última aula do turno', message: 'Continue com calma e reserve alguns minutos para salvar e exportar.' };
    return { level: 'info', title: `${status.current.number}ª aula`, message: `Restam aproximadamente ${status.remainingMinutes} minutos.` };
  }
  if (status.state === 'break') return { level: 'info', title: status.current.label, message: 'Seu progresso permanece protegido. Em computador compartilhado, use “Sair e bloquear”.' };
  if (status.state === 'before-shift') return { level: 'info', title: `Sua turma começa às ${status.nextAt}`, message: 'Você pode adiantar a atividade normalmente.' };
  if (status.state === 'after-shift') return { level: 'info', title: 'Fora do horário da turma', message: 'Você pode continuar estudando. Confira apenas o prazo da atividade.' };
  if (status.state === 'non-school-day') return { level: 'info', title: 'Estudo fora do horário regular', message: 'Você pode continuar normalmente e revisar com calma.' };
  return null;
};

export const renderScheduleDetails = (status) => {
  if (!status.shift) return `<div class="schedule-detail"><h3>Horário não identificado</h3><p>Selecione ou corrija a turma no perfil para receber orientações do horário escolar.</p></div>`;
  const rows = status.schedule.periods.map((period) => `<li class="${period === status.current ? 'current' : ''}"><span>${period.type === 'class' ? `${period.number}ª aula` : escapeHtml(period.label)}</span><b>${period.start}–${period.end}</b></li>`).join('');
  return `<div class="schedule-detail"><p class="eyebrow">HORÁRIO ESCOLAR // ${escapeHtml(status.schedule.label.toUpperCase())}</p><h3>${escapeHtml(status.label)}</h3><p>O horário serve apenas para orientar salvamento e entrega. Ele não bloqueia a atividade nem confirma presença.</p><ul class="schedule-list">${rows}</ul></div>`;
};
