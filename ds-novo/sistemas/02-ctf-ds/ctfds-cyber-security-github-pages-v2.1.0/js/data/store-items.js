export const storeItems = [
  { id: 'theme-neon', type: 'theme', name: 'Neon Sentinel', price: 0, preview: '#00f5d4', description: 'Tema padrão ciano e verde.' },
  { id: 'theme-crimson', type: 'theme', name: 'Red Protocol', price: 260, preview: '#ff3d71', description: 'Tema vermelho de alerta ofensivo.' },
  { id: 'theme-violet', type: 'theme', name: 'Quantum Violet', price: 300, preview: '#a970ff', description: 'Tema violeta de criptografia.' },
  { id: 'theme-amber', type: 'theme', name: 'SOC Amber', price: 240, preview: '#ffb000', description: 'Tema âmbar de central de operações.' },
  { id: 'avatar-ghost', type: 'avatar', name: 'Ghost', price: 0, preview: '👻', description: 'Operador invisível.' },
  { id: 'avatar-shield', type: 'avatar', name: 'Sentinel', price: 180, preview: '🛡️', description: 'Defensor de perímetro.' },
  { id: 'avatar-raven', type: 'avatar', name: 'Raven', price: 220, preview: '🐦‍⬛', description: 'Analista de sinais.' },
  { id: 'avatar-cipher', type: 'avatar', name: 'Cipher', price: 260, preview: '◇', description: 'Especialista em códigos.' },
  { id: 'effect-matrix', type: 'effect', name: 'Matrix Rain', price: 0, preview: '01', description: 'Chuva digital de fundo.' },
  { id: 'effect-lightning', type: 'effect', name: 'Neon Lightning', price: 320, preview: 'ϟ', description: 'Descargas em conquistas.' },
  { id: 'effect-glitch', type: 'effect', name: 'Glitch Burst', price: 280, preview: '▓', description: 'Falha visual em transições.' },
];

export const getStoreItem = (id) => storeItems.find((item) => item.id === id);
