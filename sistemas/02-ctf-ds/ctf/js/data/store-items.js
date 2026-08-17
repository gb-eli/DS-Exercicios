const rawStoreItems = [
  { id: 'theme-neon', version: 1, type: 'theme', name: 'Neon Sentinel', price: 0, preview: '#00f5d4', description: 'Tema padrão ciano e verde.', rarity: 'Comum', slot: 'theme', performanceTier: 'low', enabled: true },
  { id: 'theme-crimson', version: 1, type: 'theme', name: 'Red Protocol', price: 260, preview: '#ff3d71', description: 'Tema vermelho de alerta ofensivo.', rarity: 'Raro', slot: 'theme', performanceTier: 'low', enabled: true },
  { id: 'theme-violet', version: 1, type: 'theme', name: 'Quantum Violet', price: 300, preview: '#a970ff', description: 'Tema violeta de criptografia.', rarity: 'Raro', slot: 'theme', performanceTier: 'low', enabled: true },
  { id: 'theme-amber', version: 1, type: 'theme', name: 'SOC Amber', price: 240, preview: '#ffb000', description: 'Tema âmbar de central de operações.', rarity: 'Comum', slot: 'theme', performanceTier: 'low', enabled: true },
  { id: 'avatar-ghost', version: 1, type: 'avatar', name: 'Ghost', price: 0, preview: '👻', description: 'Operador invisível.', rarity: 'Comum', slot: 'avatar', performanceTier: 'low', enabled: true },
  { id: 'avatar-shield', version: 1, type: 'avatar', name: 'Sentinel', price: 180, preview: '🛡️', description: 'Defensor de perímetro.', rarity: 'Comum', slot: 'avatar', performanceTier: 'low', enabled: true },
  { id: 'avatar-raven', version: 1, type: 'avatar', name: 'Raven', price: 220, preview: '🐦‍⬛', description: 'Analista de sinais.', rarity: 'Raro', slot: 'avatar', performanceTier: 'low', enabled: true },
  { id: 'avatar-cipher', version: 1, type: 'avatar', name: 'Cipher', price: 260, preview: '◇', description: 'Especialista em códigos.', rarity: 'Raro', slot: 'avatar', performanceTier: 'low', enabled: true },
  { id: 'effect-matrix', version: 1, type: 'effect', name: 'Matrix Rain', price: 0, preview: '01', description: 'Chuva digital de fundo.', rarity: 'Comum', slot: 'effect', performanceTier: 'medium', enabled: true },
  { id: 'effect-lightning', version: 1, type: 'effect', name: 'Neon Lightning', price: 320, preview: 'ϟ', description: 'Descargas em conquistas.', rarity: 'Épico', slot: 'effect', performanceTier: 'high', enabled: true },
  { id: 'effect-glitch', version: 1, type: 'effect', name: 'Glitch Burst', price: 280, preview: '▓', description: 'Falha visual em transições.', rarity: 'Raro', slot: 'effect', performanceTier: 'medium', enabled: true },
];

export const STORE_CATALOG_VERSION = '1.1.0';
export const storeItems = Object.freeze(rawStoreItems.map((item) => Object.freeze({
  ...item,
  currency: 'COINS',
  prerequisites: Object.freeze([]),
  compatibleTools: Object.freeze([]),
  accessibilityFallback: item.type === 'effect' ? 'Efeito desativado quando movimento reduzido estiver ativo.' : 'Mantém contraste e navegação.',
  assets: Object.freeze([]),
})));

export const getStoreItem = (id) => storeItems.find((item) => item.id === id);
