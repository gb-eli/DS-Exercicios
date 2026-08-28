# Relatório de validação — Fase 7.25 · v0.38.4

## Escopo
Região Industrial do Mundo Plataforma DS 360, preservando Vale Nexus, Vila Tecnológica e Floresta de Circuitos.

## Conteúdo novo
- mapa 96 × 84;
- 13 plataformas fixas;
- 4 plataformas móveis;
- 3 esteiras;
- 4 checkpoints;
- 5 patrulhas;
- 5 perigos;
- 7 interações industriais;
- cadeia Energia → Logística → Controle;
- save schema 4.

## Testes
- Região Industrial/Mundo 360: **128/128**;
- Auditoria geral: **716/716**;
- Regressão atual: **1058/1058**;
- Falhas automatizadas: **0**.

O smoke visual em Chromium não é tratado como aprovado se o ambiente não conseguir produzir screenshot; sensação de câmera, touch, gamepad e frame pacing permanecem no checklist real.

## Publicação
- Rotas HTTP: **431/431**;
- scripts próprios: **40**;
- JSON válidos: **70**;
- SVG válidos: **101**;
- referências do cache offline: **81/81**.

## Smoke visual
A tentativa com Chromium headless expirou (código 124) por indisponibilidade de DBus/UPower e comunicação do zygote. Nenhum screenshot foi produzido; portanto, o smoke visual **não é contado como aprovado**.
