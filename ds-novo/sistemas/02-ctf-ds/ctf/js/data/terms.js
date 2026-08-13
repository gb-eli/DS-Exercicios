import { sha256Sync, secureId } from '../core/integrity.js';

export const TERMS_ID = 'ctfds-responsible-use';
export const TERMS_VERSION = '1.3.0';
export const ACTIVITY_TERMS_ID = 'ctfds-authorized-cyber-lab';
export const ACTIVITY_TERMS_VERSION = '1.1.0';
export const TERMS_UPDATED_AT = '2026-07-30';

export const TERMS_SECTIONS = [
  ['Finalidade educacional', 'Esta plataforma é utilizada exclusivamente para aprendizagem, prática segura, revisão, diagnóstico, simulação e produção de evidências escolares.'],
  ['Compromisso com as atividades', 'Realize pessoalmente as etapas, siga as orientações do professor, respeite a sequência pedagógica, entregue a evidência solicitada e informe dificuldades técnicas de forma verdadeira.'],
  ['Integridade acadêmica', 'Não copie respostas sem autorização nem altere tempo, respostas, progresso, XP, moedas, carteira, inventário, emblemas, fases, registros, evidências ou arquivos exportados para obter vantagem.'],
  ['Código e ferramentas de desenvolvimento', 'DevTools, código, DOM, armazenamento, parâmetros de URL e terminal só podem ser usados quando fizerem parte da atividade ou houver autorização do professor. Ao encontrar uma falha inesperada, interrompa a exploração e comunique o professor.'],
  ['Uso responsável de dispositivos e laboratórios', 'Respeite as normas da escola, proteja contas, não instale programas sem permissão, não altere equipamentos e encerre a sessão ao terminar.'],
  ['Segurança e cibersegurança', 'Realize testes somente em ambientes fictícios, locais, simulados ou expressamente autorizados. Não ataque redes, contas, dispositivos, sites, pessoas ou serviços reais.'],
  ['Cenários e informações fictícias', 'Empresas, pessoas, transações, credenciais, incidentes, redes, notícias e evidências podem ser fictícios ou adaptados para fins pedagógicos e não representam autorização para agir fora da plataforma.'],
  ['Colaboração e feedback', 'Relate erros de forma responsável e verdadeira, sem explorar a falha, constranger pessoas ou incluir dados pessoais desnecessários. O envio de feedback não autoriza a publicação automática do nome do aluno.'],
  ['Loja, moedas, XP e recompensas', 'Moedas, XP, itens e emblemas são virtuais, não possuem valor financeiro, não podem ser vendidos e não influenciam a nota. Compras dependem de saldo validado e inconsistências podem exigir revisão humana.'],
  ['Registro de progresso e auditoria', 'A plataforma pode registrar localmente progresso, tentativas, exportações, importações, transações virtuais, aceites e eventos de integridade na medida necessária ao funcionamento e à comprovação pedagógica.'],
  ['Dados pessoais e privacidade', 'O perfil permanece criptografado no dispositivo. O aceite não autoriza coleta ilimitada, publicidade, publicação de nome ou imagem, venda de dados ou compartilhamento com terceiros.'],
  ['Créditos e reconhecimento', 'Contribuições de estudantes serão reconhecidas somente conforme configuração e autorização adotadas pelo professor e pela escola, sem expor dados pessoais, notas ou comentários privados.'],
  ['Consequências pedagógicas e técnicas', 'Quando houver inconsistência, a carteira ou a atividade poderá ficar em análise e o professor poderá solicitar nova execução ou restauração de um estado válido. Nenhuma punição definitiva será aplicada automaticamente sem possibilidade de revisão humana.'],
  ['Dificuldades, acessibilidade e apoio', 'Dificuldade técnica, necessidade educacional específica ou adaptação autorizada não é tratada como trapaça. O aluno pode solicitar ajuda, recurso acessível ou revisão de um bloqueio.'],
  ['Atualizações do termo', 'Mudanças relevantes serão apresentadas em nova versão. Aceites anteriores permanecerão no histórico e o aluno poderá consultar o texto vigente antes de continuar.'],
  ['Declaração final', 'Ao aceitar, confirmo que pude ler o resumo, abrir o termo completo e a política de privacidade, compreendi a finalidade educacional e comprometo-me a utilizar a plataforma de forma responsável e somente no escopo autorizado.'],
];

export const TERMS_FULL_TEXT = TERMS_SECTIONS.map(([title, text], index) => `${index + 1}. ${title}\n${text}`).join('\n\n');
export const TERMS_HASH = sha256Sync(TERMS_FULL_TEXT);
export const ACTIVITY_RULES_TEXT = 'Ambiente autorizado: somente a plataforma CTF DS e seus simuladores locais. Permitido: investigar dados fictícios, usar ferramentas locais, editar sandboxes preparados e registrar evidências. Proibido: testar sistemas externos, contas reais, redes escolares, credenciais de terceiros, malware, varredura externa ou qualquer ação fora do escopo indicado pelo professor. Ao encontrar uma falha inesperada, interrompa a exploração e comunique o professor.';
export const ACTIVITY_RULES_HASH = sha256Sync(ACTIVITY_RULES_TEXT);

export const hasValidTermsAcceptance = (profile) => Boolean(profile?.acceptances?.some((item) => item.termsId === TERMS_ID && item.termsVersion === TERMS_VERSION && item.termsHash === TERMS_HASH && item.status === 'ACCEPTED' && item.readConfirmation && item.responsibleUseConfirmation));
export const hasValidActivityAcceptance = (profile) => Boolean(profile?.activityAcceptances?.some((item) => item.activityId === ACTIVITY_TERMS_ID && item.activityTermsVersion === ACTIVITY_TERMS_VERSION && item.rulesHash === ACTIVITY_RULES_HASH && item.status === 'ACCEPTED'));
export const hasRequiredAcceptances = (profile) => hasValidTermsAcceptance(profile) && hasValidActivityAcceptance(profile);

export const registerTermsAcceptance = (profile, details = {}) => {
  const now = new Date().toISOString();
  profile.acceptances ||= [];
  profile.activityAcceptances ||= [];
  const acceptance = {
    acceptanceId: secureId('accept'), profileId: profile.accountId, termsId: TERMS_ID, termsVersion: TERMS_VERSION,
    termsHash: TERMS_HASH, platformId: 'ctfds', platformVersion: '3.2.0', activityId: ACTIVITY_TERMS_ID,
    acceptedAt: now, timezone: 'America/Sao_Paulo', acceptanceMethod: 'checkbox-and-submit',
    readConfirmation: true, responsibleUseConfirmation: true,
    privacyNoticeViewed: Boolean(details.privacyNoticeViewed), fullTermsOpened: Boolean(details.fullTermsOpened),
    deviceSessionId: details.deviceSessionId || '', appSchemaVersion: 4, status: 'ACCEPTED', previousAcceptanceId: profile.acceptances.at(-1)?.acceptanceId || '',
    integrityTag: sha256Sync(`${profile.accountId}|${TERMS_HASH}|${now}`),
  };
  const activityAcceptance = {
    activityAcceptanceId: secureId('activity_accept'), profileId: profile.accountId, activityId: ACTIVITY_TERMS_ID,
    activityTermsVersion: ACTIVITY_TERMS_VERSION, acceptedAt: now, rulesHash: ACTIVITY_RULES_HASH,
    teacherAuthorizationRequired: false, integrityTag: sha256Sync(`${profile.accountId}|${ACTIVITY_RULES_HASH}|${now}`), status: 'ACCEPTED',
  };
  profile.acceptances.push(acceptance);
  profile.activityAcceptances.push(activityAcceptance);
  return { acceptance, activityAcceptance };
};
