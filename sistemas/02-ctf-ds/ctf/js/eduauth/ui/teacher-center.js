import { escapeHtml } from '../../core/utils.js';
import { EDUAUTH_PLATFORM } from '../config/platform.js';
import { EDUAUTH_ACTIONS } from '../config/actions.js';
import { EDUAUTH_KEY_CONFIG } from '../config/key-config.js';
const NOTICE = EDUAUTH_PLATFORM.productionProvisioned
  ? 'As ações protegidas utilizam o provisionamento vigente.'
  : 'Os arquivos de retorno estão incluídos no projeto. Importe chaves de produção somente depois que o EduAuth Professor estiver disponível.';
export const renderEduAuthStatus = () => `<section class="eduauth-teacher-summary">
  <div class="eduauth-environment ${EDUAUTH_PLATFORM.productionProvisioned ? 'production' : 'development'}"><span>${EDUAUTH_PLATFORM.productionProvisioned ? '✓' : '⚠'}</span><div><strong>EduAuth Offline ${EDUAUTH_PLATFORM.productionProvisioned ? 'provisionado' : 'em desenvolvimento'}</strong><small>Core ${EDUAUTH_PLATFORM.coreVersion} · ${escapeHtml(EDUAUTH_KEY_CONFIG.classKey.keyId)} · ${escapeHtml(EDUAUTH_KEY_CONFIG.sessionKey.keyId)}</small></div></div>
  <p>${NOTICE}</p>
  <div class="eduauth-demo-actions"><button class="secondary-button" type="button" data-eduauth-demo-action="challenge-start">TESTAR PIN COLETIVO</button><button class="secondary-button" type="button" data-eduauth-demo-action="result-release">TESTAR PIN DE SESSÃO</button><button class="secondary-button" type="button" data-eduauth-demo-action="profile-delete">TESTAR AUTORIZAÇÃO ASSINADA</button></div>
  <div class="eduauth-action-table">${Object.values(EDUAUTH_ACTIONS).map((action) => `<div><span>${escapeHtml(action.label)}</span><b class="risk-${action.risk.toLowerCase()}">${action.risk}</b><small>${escapeHtml(action.preferredMode)}</small></div>`).join('')}</div>
</section>`;
