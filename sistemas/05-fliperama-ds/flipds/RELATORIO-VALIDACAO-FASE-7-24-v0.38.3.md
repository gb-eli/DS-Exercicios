# Relatório de validação — Fase 7.24 · v0.38.3

## Escopo
A terceira região do Mundo Plataforma DS 360 foi adicionada sem criar um novo runtime. A campanha agora conecta Vale Nexus → Vila Tecnológica → Floresta de Circuitos no mesmo save.

## Floresta de Circuitos
- mapa 92 × 88;
- três rotas ramificadas;
- 12 plataformas fixas e 3 móveis;
- suporte novo ao eixo Y nas plataformas móveis;
- 4 checkpoints;
- 5 patrulhas e 5 riscos;
- três Nós de Energia;
- Portal-Raiz liberado somente após 3/3 Nós;
- partículas climáticas leves e vegetação low-poly adaptadas ao perfil gráfico.

## Persistência
O save passa para schema 3. Saves schema 1 e 2 continuam migráveis. Um save v0.38.2 concluído entra na Região 3 com a campanha reaberta, preservando vidas e pontuação.

## Validação automatizada
- Mundo Plataforma DS 360: **157/157**;
- auditoria geral: **23/23 experiências · 716/716 checks**;
- regressão atual: **937/937 aprovações · 0 falhas**.

A inspeção perceptiva de câmera, toque, gamepad e frame pacing permanece separada para navegador/hardware real.

## Validação de publicação
- **418/418 rotas HTTP 200**;
- **39 scripts próprios** sem erro de sintaxe;
- **65 JSONs** válidos;
- **101 SVGs** válidos;
- **79 referências** do cache offline presentes;
- comparação com v0.38.2: **11 adicionados, 31 modificados, 0 removidos**.

## Smoke visual automatizado
Tentativa com Chromium headless não gerou screenshot neste ambiente. O processo expirou com erros de DBus/UPower; portanto o teste visual não foi contabilizado como aprovado.
