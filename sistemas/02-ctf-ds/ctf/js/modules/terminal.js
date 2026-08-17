import { challenges, isUnlocked } from '../data/challenges.js';
import { caesar, base64ToUnicode } from '../core/utils.js';

export const terminalWelcome = `CTF DS Kali-Lab Simulator v1.0\nAmbiente educacional local. Nenhum comando acessa o sistema real.\nDigite "help" para listar comandos.`;

export const executeTerminalCommand = (rawCommand, profile) => {
  const [command = '', ...args] = rawCommand.trim().split(/\s+/);
  const argument = args.join(' ');
  switch (command.toLowerCase()) {
    case 'help': return `Comandos disponíveis:\n  help                lista comandos\n  status              mostra progresso\n  missions            lista missões acessíveis\n  skills              mostra habilidades\n  decode64 <texto>    decodifica Base64 localmente\n  caesar <n> <texto>  desloca letras\n  scope               exibe regras éticas\n  clear               limpa o terminal`;
    case 'status': return `ALUNO: ${profile.studentName || 'Aluno'}\nTURMA: ${profile.className || 'Não informada'}\nNÍVEL: ${profile.level}\nXP: ${profile.xp}\nMOEDAS DISPONÍVEIS: ${profile.coins}\nCARTEIRA: ${profile.wallet?.status || 'NÃO RECONCILIADA'}\nBANDEIRAS: ${Object.keys(profile.completed).length}/${challenges.length}\nESCOPO: SOMENTE AMBIENTE LOCAL AUTORIZADO`;
    case 'missions': return challenges.filter((item) => isUnlocked(item, profile.completed) && !profile.completed[item.id]).map((item) => `[OPEN] ${item.id} :: ${item.title}`).join('\n') || 'Nenhuma missão pendente acessível.';
    case 'skills': return Object.entries(profile.skills).map(([name, value]) => `${name.padEnd(14)} ${Math.round(value)}/100`).join('\n');
    case 'decode64': {
      if (!argument) return 'Uso: decode64 <texto-base64>';
      try { return base64ToUnicode(argument); } catch { return 'Entrada Base64 inválida.'; }
    }
    case 'caesar': {
      const shift = Number(args.shift());
      if (!Number.isFinite(shift) || !args.length) return 'Uso: caesar <deslocamento> <texto>';
      return caesar(args.join(' '), shift);
    }
    case 'scope': return 'PERMITIDO: desafios desta plataforma e ambientes próprios/autorizados.\nPROIBIDO: testar terceiros, coletar dados reais, contornar acesso ou causar indisponibilidade.';
    case 'clear': return '__CLEAR__';
    case 'ls': return 'academy/  missions/  profile.json  tools/  README_SCOPE.txt';
    case 'whoami': return `${profile.studentName || 'Aluno'} // ${profile.className || 'Turma não informada'}`;
    case 'pwd': return '/home/student/ctfds-sandbox';
    case '': return '';
    default: return `Comando não reconhecido: ${command}. Digite help.`;
  }
};
