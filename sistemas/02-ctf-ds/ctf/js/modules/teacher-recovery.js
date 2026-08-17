import { escapeHtml } from '../core/utils.js';
import { renderEduAuthStatus } from '../eduauth/ui/teacher-center.js';

export const renderTeacherRecovery = (status, profiles = []) => `
  <div class="modal-layer" role="presentation">
    <section class="panel teacher-recovery-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-recovery-title">
      <header><div><p class="eyebrow">MODO DO PROFESSOR // RECUPERAÇÃO ADMINISTRATIVA</p><h2 id="teacher-recovery-title">Recuperar acesso sem revelar a senha antiga</h2></div><button class="icon-button" data-close-modal aria-label="Fechar">×</button></header>
      <div class="recovery-status ${status.configured ? 'configured' : ''}"><span>${status.configured ? '✓' : '!'}</span><div><strong>${status.configured ? 'Chave pública configurada' : 'Recuperação ainda não configurada'}</strong><small>${status.configured ? `${status.protectedProfiles}/${status.totalProfiles} perfis protegidos · chave ${escapeHtml(status.keyId)}` : 'Gere um arquivo administrativo e guarde-o fora da plataforma.'}</small></div></div>
      <div class="recovery-tabs"><button class="segment active" data-recovery-tab="eduauth">EDUAUTH</button><button class="segment" data-recovery-tab="setup">CONFIGURAR RECUPERAÇÃO</button><button class="segment" data-recovery-tab="recover">REDEFINIR SENHA</button></div>
      <section data-recovery-panel="eduauth" class="recovery-panel">${renderEduAuthStatus()}</section>
      <section data-recovery-panel="setup" class="recovery-panel hidden">
        <p>A configuração gera um par de chaves. Somente a chave pública fica no navegador. A chave privada é colocada em um arquivo administrativo protegido pela frase-senha mestre.</p>
        <form data-create-recovery-kit>
          <label>Identificação administrativa<input name="teacherLabel" value="Professor Gabriel" maxlength="80" required></label>
          <label>Frase-senha mestre<input name="masterPassword" type="password" minlength="12" autocomplete="new-password" required placeholder="mínimo 12 caracteres"></label>
          <label>Confirmar frase-senha<input name="masterPasswordConfirm" type="password" minlength="12" autocomplete="new-password" required></label>
          <button class="primary-button" type="submit">GERAR E BAIXAR CHAVE ADMINISTRATIVA</button>
        </form>
        <div class="recovery-import"><p>Já possui um arquivo administrativo? Instale somente sua chave pública neste navegador.</p><label class="secondary-button">IMPORTAR ARQUIVO ADMINISTRATIVO<input type="file" data-install-recovery-kit accept=".ctfds-admin-key,application/json" hidden></label></div>
      </section>
      <section data-recovery-panel="recover" class="recovery-panel hidden">
        <p>A senha antiga nunca será mostrada. A operação preserva identidade, fases, respostas e histórico.</p>
        <form data-recover-student-password>
          <label>Perfil<select name="accountId" required><option value="">Selecione</option>${profiles.map((profile) => `<option value="${escapeHtml(profile.accountId)}" ${profile.recoveryAvailable ? '' : 'disabled'}>${escapeHtml(profile.displayName)} · ${escapeHtml(profile.className)}${profile.recoveryAvailable ? '' : ' · sem chave de recuperação'}</option>`).join('')}</select></label>
          <label>Motivo<textarea name="reason" required minlength="4" maxlength="300" placeholder="ex.: aluno esqueceu a senha e confirmou sua identidade"></textarea></label>
          <label>Identificação administrativa<input name="adminId" value="Professor Gabriel" maxlength="80" required></label>
          <label>Nova senha do aluno<input name="newPassword" type="password" minlength="6" required></label>
          <label>Frase-senha mestre<input name="masterPassword" type="password" minlength="12" required></label>
          <label>Arquivo administrativo<input name="kitFile" type="file" accept=".ctfds-admin-key,application/json" required></label>
          <button class="primary-button" type="submit">REDEFINIR SENHA E PRESERVAR PROGRESSO</button>
        </form>
      </section>
      <p class="safety-note">Se a frase-senha e o arquivo administrativo forem perdidos, não existe entrada secreta ou senha universal. Guarde uma cópia segura e separada.</p>
    </section>
  </div>`;
