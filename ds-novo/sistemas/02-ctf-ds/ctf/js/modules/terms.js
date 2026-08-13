import { escapeHtml } from '../core/utils.js';
import { TERMS_SECTIONS, TERMS_VERSION, TERMS_UPDATED_AT, ACTIVITY_RULES_TEXT, hasRequiredAcceptances } from '../data/terms.js';

export const renderTermsGate = (profile) => `<div class="modal-layer terms-layer" role="presentation">
  <section class="panel terms-modal" role="dialog" aria-modal="true" aria-labelledby="terms-title">
    <header><div><p class="eyebrow">CIÊNCIA // USO RESPONSÁVEL // ESCOPO AUTORIZADO</p><h2 id="terms-title">Antes de iniciar o Cyber Lab</h2><p>Versão ${escapeHtml(TERMS_VERSION)} · atualizada em ${escapeHtml(TERMS_UPDATED_AT)}</p></div><span class="terms-lock">⚿</span></header>
    <div class="terms-summary"><strong>Resumo em linguagem simples</strong><p>Realize as atividades conforme as orientações do professor. Não altere código, armazenamento, moedas, XP, inventário, respostas ou evidências para obter vantagem. Use as técnicas de segurança somente dentro deste ambiente educacional, fictício e autorizado.</p></div>
    <div class="terms-links"><button type="button" class="secondary-button" data-mark-full-terms>VER TERMO COMPLETO</button><button type="button" class="secondary-button" data-mark-privacy>VER POLÍTICA DE PRIVACIDADE</button><button type="button" class="secondary-button" data-download-terms>BAIXAR UMA CÓPIA</button><button type="button" class="secondary-button" data-export-progress>EXPORTAR PERFIL EXISTENTE</button></div>
    <div class="terms-documents">
      <details data-full-terms-details><summary>Termo completo</summary>${TERMS_SECTIONS.map(([title,text],index)=>`<section><h3>${index+1}. ${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></section>`).join('')}</details>
      <details data-privacy-details><summary>Privacidade em linguagem simples</summary><p>Nome, turma, progresso, carteira, respostas e histórico ficam criptografados no IndexedDB deste dispositivo. A plataforma não vende dados, não usa publicidade e não envia o conteúdo dos laboratórios para servidores. O navegador pode remover dados; por isso existe backup criptografado.</p></details>
      <details><summary>Aviso de cenários fictícios</summary><p>Empresas, redes, pessoas, transações, credenciais, notícias, missões e evidências podem ser fictícias ou adaptadas. Referências reais aparecem apenas para contextualização e prevenção.</p></details>
      <details><summary>Escopo autorizado da atividade</summary><p>${escapeHtml(ACTIVITY_RULES_TEXT)}</p></details>
    </div>
    <form data-terms-accept-form>
      <label class="terms-check"><input type="checkbox" name="readConfirmation" required> <span>Li e compreendi o resumo e tive acesso ao termo completo.</span></label>
      <label class="terms-check"><input type="checkbox" name="responsibleUseConfirmation" required> <span>Concordo em utilizar a plataforma de forma responsável.</span></label>
      <label class="terms-check"><input type="checkbox" name="authorizedScopeConfirmation" required> <span>Confirmo que utilizarei as técnicas somente no ambiente autorizado e educacional.</span></label>
      <div class="terms-actions"><button type="button" class="text-button" data-decline-terms>NÃO ACEITAR E SAIR</button><button type="submit" class="primary-button">ACEITAR E CONTINUAR</button></div>
    </form>
    <small>Este registro é um compromisso pedagógico. Não substitui autorizações institucionais ou de responsáveis quando forem necessárias.</small>
  </section>
</div>`;

export const renderTermsHistory = (profile) => {
  const valid = hasRequiredAcceptances(profile);
  const latest = profile.acceptances?.at(-1);
  return `<article class="card terms-history-card"><div class="section-title" style="margin-top:0"><h2>TERMOS E USO RESPONSÁVEL</h2><small>${valid ? 'VIGENTE' : 'PENDENTE'}</small></div><p>${valid ? `Aceite atual registrado em ${escapeHtml(new Date(latest.acceptedAt).toLocaleString('pt-BR'))}.` : 'A versão atual ainda precisa ser aceita antes de novas atividades.'}</p><div class="data-actions"><button class="secondary-button" data-open-terms>CONSULTAR TERMOS</button><button class="secondary-button" data-download-terms>BAIXAR CÓPIA</button></div></article>`;
};
