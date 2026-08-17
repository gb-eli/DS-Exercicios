export const copyRequestCode = async (code) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(code);
  const area = document.createElement('textarea'); area.value = code; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
};
export const speakRequestCode = (code) => {
  if (!('speechSynthesis' in window)) throw new Error('Leitura em voz alta indisponível neste navegador.');
  speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(code).replace(/-/g, ' ')); utterance.lang = 'pt-BR'; utterance.rate = 0.72; speechSynthesis.speak(utterance);
};
