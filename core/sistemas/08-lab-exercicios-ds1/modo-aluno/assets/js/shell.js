window.Utils = (() => {
  function download(name, content, type = "text/plain;charset=utf-8") {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.rel = "noopener noreferrer";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return { download };
})();

window.AppShell = (() => {
  let dialogOpener = null;

  function restoreFocus() {
    if (dialogOpener && document.contains(dialogOpener)) dialogOpener.focus();
    dialogOpener = null;
  }

  function openInfo(title, html) {
    let dialog = document.getElementById("infoDialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "infoDialog";
      dialog.setAttribute("aria-labelledby", "infoDialogTitle");
      dialog.setAttribute("aria-describedby", "infoContent");
      dialog.innerHTML = '<article class="card info-dialog-card"><button id="closeInfo" class="ghost info-dialog-close" type="button">Fechar</button><h1 id="infoDialogTitle"></h1><div id="infoContent"></div></article>';
      document.body.append(dialog);
      dialog.querySelector("#closeInfo").onclick = () => dialog.close();
      dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
      dialog.addEventListener("close", restoreFocus);
    }
    dialogOpener = document.activeElement;
    dialog.querySelector("#infoDialogTitle").textContent = title;
    dialog.querySelector("#infoContent").innerHTML = html;
    dialog.showModal();
    dialog.querySelector("#closeInfo").focus();
  }

  function confirmIncompleteDownload() {
    return new Promise(resolve => {
      let dialog = document.getElementById("downloadWarningDialog");
      if (!dialog) {
        dialog = document.createElement("dialog");
        dialog.id = "downloadWarningDialog";
        dialog.setAttribute("aria-labelledby", "downloadWarningTitle");
        dialog.setAttribute("aria-describedby", "downloadWarningText");
        dialog.innerHTML = `<article class="card info-dialog-card">
          <h1 id="downloadWarningTitle">Projeto em andamento</h1>
          <p id="downloadWarningText">Seu projeto ainda está em andamento. Existem arquivos vazios, incompletos ou que ainda não foram validados. Você pode baixar mesmo assim para salvar no GitHub, continuar em outro computador ou retomar a atividade depois.</p>
          <div class="dialog-actions"><button type="button" class="secondary" data-download-cancel>Continuar editando</button><button type="button" data-download-confirm>Baixar mesmo assim</button></div>
        </article>`;
        document.body.append(dialog);
      }
      const opener = document.activeElement;
      const finish = value => {
        dialog.close();
        if (opener && document.contains(opener)) opener.focus();
        resolve(value);
      };
      dialog.querySelector("[data-download-cancel]").onclick = () => finish(false);
      dialog.querySelector("[data-download-confirm]").onclick = () => finish(true);
      dialog.oncancel = event => { event.preventDefault(); finish(false); };
      dialog.showModal();
      dialog.querySelector("[data-download-cancel]").focus();
    });
  }

  function toast(message, tone = "info", persistent = false) {
    let element = document.getElementById("appToast");
    if (!element) {
      element = document.createElement("div");
      element.id = "appToast";
      element.className = "toast";
      element.setAttribute("role", "status");
      element.setAttribute("aria-live", "polite");
      document.body.append(element);
    }
    element.textContent = message;
    element.dataset.tone = tone;
    element.classList.add("show");
    clearTimeout(element._timer);
    if (!persistent) element._timer = setTimeout(() => element.classList.remove("show"), 4200);
  }

  function showStorageWarning() {
    let banner = document.getElementById("storageWarning");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "storageWarning";
      banner.className = "storage-warning";
      banner.setAttribute("role", "alert");
      banner.innerHTML = '<strong>Não foi possível salvar localmente.</strong> Baixe uma cópia do seu código agora para não perder o trabalho. <button type="button" class="ghost compact">Fechar aviso</button>';
      banner.querySelector("button").onclick = () => banner.remove();
      document.body.prepend(banner);
    }
  }

  return { openInfo, confirmIncompleteDownload, toast, showStorageWarning };
})();
