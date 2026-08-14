# Bugs e ajustes — v0.38.1

- O novo Mundo Plataforma DS 360 foi construído com simulação, renderização e entrada em módulos separados para evitar acoplamento com Three.js.
- Checkpoints foram posicionados fora dos oito campos Glitch e validados automaticamente.
- Orbes e Balizas foram validados sobre plataformas realmente existentes, evitando objetivos suspensos/inacessíveis.
- A suíte arcade ainda apontava para a Fase 7.21; o metadado de regressão foi sincronizado para a Fase 7.22 sem alterar regras dos jogos clássicos.
- Service Worker atualizado para incluir todos os arquivos essenciais do novo runtime e seus resultados de validação.
- BUILD_INFO foi corrigido para não repetir notas da versão Crystal Cascade na release atual.
