# Checklist de teste real — Fliperama DS v0.39.0

## Chess Arena 360

- [ ] testar seleção de peças e destinos por mouse;
- [ ] testar seleção por toque em Android/iOS;
- [ ] validar arraste da câmera sem disparar jogada acidental;
- [ ] validar zoom por roda e comportamento equivalente em touch;
- [ ] alternar câmera orbital/superior várias vezes;
- [ ] jogar uma partida local completa;
- [ ] testar as quatro CPUs em hardware real;
- [ ] validar promoção usando os quatro botões;
- [ ] validar retomada de uma partida salva após recarregar a página;
- [ ] verificar legibilidade das peças pretas/brancas em telas pequenas;
- [ ] observar frame pacing em qualidade Baixa/Média/Alta/Ultra.

## Plataforma

- [ ] abrir as 25 experiências no dispositivo-alvo;
- [ ] confirmar instalação/atualização do Service Worker;
- [ ] confirmar ausência de scroll horizontal no portal;
- [ ] verificar áudio/touch/gamepad dos jogos que oferecem esses recursos.

> O checklist perceptivo não é contabilizado como teste automatizado.

## Smoke automatizado do ambiente

- [x] tentativa de inicialização do Chess Arena 360 em Chromium headless realizada;
- [ ] screenshot automatizado produzido — **não concluído** por timeout do Chromium com erros DBus/UPower/zygote do ambiente de execução.

A falha do ambiente de browser não é tratada como aprovação nem como falha da lógica do jogo; a validação perceptiva continua manual.
