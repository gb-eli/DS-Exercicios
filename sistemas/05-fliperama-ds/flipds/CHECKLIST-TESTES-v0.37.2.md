# Checklist de teste real — v0.37.2

## Crystal Cascade 3D

- [ ] abrir em notebook 1366×768 sem corte do tabuleiro;
- [ ] abrir em celular retrato e landscape;
- [ ] confirmar seleção por toque em todas as células;
- [ ] observar criação de peça especial com combinação de 4;
- [ ] observar explosão em combinação de 5;
- [ ] confirmar cascatas e atualização de combo;
- [ ] concluir ao menos fases 1, 4, 8 e 12 manualmente;
- [ ] conferir redução de movimento e perfil Baixo;
- [ ] recarregar a página e confirmar persistência da fase/estrelas;
- [ ] validar WebGL em GPU escolar e fallback visual aceitável.

## Plataforma

- [ ] abrir Duo Elementos e Plataforma Clássica após jogar Crystal Cascade;
- [ ] validar CPU/multiplayer de Board Arena e Vector Tennis;
- [ ] validar fechamento de modais e abertura em celular.

### Limitação do ambiente automatizado

O Chromium headless disponível nesta sessão não produziu screenshot por falhas de DBus/GPU. A inspeção visual real continua obrigatória no navegador/dispositivo de destino.
