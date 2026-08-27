# Validação v0.9.4.2

## Resultado

**APROVADA** para publicação como manutenção da v0.9.4.1.

- 11 grupos de regressão aprovados;
- 17 verificações específicas aprovadas;
- 0 erros de sintaxe JavaScript;
- 0 erros de página ou console no teste visual;
- 14 itens de navegação renderizados;
- CSS aplicado corretamente;
- nenhuma rolagem horizontal em 390 × 844;
- prévia do personagem permaneceu fixa e visível no celular;
- aura padrão carregada ao entrar no Estúdio VFX;
- oito mensagens disponíveis e balão exibido na tela ativa;
- fallback 2D exibido sem overlay de carregamento preso.

## Fluxos verificados

### Personagem

O ambiente de Chromium não disponibilizou WebGL durante esta execução. O sistema mostrou corretamente `WebGL indisponível — usando fallback 2D`, escondeu o carregamento e manteve a interface utilizável. Os GLBs, clips, slots e scripts 3D foram validados pelos validadores estruturais. Não se afirma que houve inspeção visual automatizada dos clips 3D nesta execução.

### Efeitos e falas

Ao entrar em `effectsView`, o efeito `aura-energy-blue` foi iniciado. A mensagem `Bom dia!` apareceu no balão `vfxSpeechBubble`, sem ser enviada ao painel oculto do avatar.

### Perfil e inventário

O perfil exibiu resumo do conjunto e três ações rápidas. O inventário exibiu o botão de equipamento funcional, com handlers limitados ao próprio grid.

### Mobile

- viewport: 390 × 844;
- largura do documento: 390 px;
- overflow horizontal: ausente;
- `position` da prévia: `sticky`;
- prévia visível após acionar uma animação: sim.

## Relatórios

- `reports/regression-result.json`;
- `reports/visual-animation-validation.json`;
- `reports/browser-visual-animation-v0942.json`.

## Limite conhecido

O rig permanece voxel rígido. A reconstrução humanoide completa, com mais ossos e controles de mãos, joelhos, cotovelos e cabeça, continua planejada para a v0.10.0.
