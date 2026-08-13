# COSMOS DS — Entrega da Fase 9

## Escopo concluído

A Fase 9 adiciona o laboratório **Observatório e Universo Profundo** sem alterar as regras e módulos das fases anteriores. O novo pacote continua estático, modular e compatível com GitHub Pages.

## Experiências

1. Planetário procedural com câmera 360°, zoom, fullscreen e modos nebulosa, galáxia, supernova e buraco negro.
2. Comparação de observatórios e faixas do espectro.
3. Seleção de telescópio óptico, infravermelho, rádio e raios X.
4. Alinhamento, foco, perturbação e compatibilidade instrumento-alvo.
5. Pipeline científico em Web Worker com exposição, ruído, calibração e composição de canais.
6. Espectroscopia didática com biblioteca de linhas.
7. Banco persistente de observações e exportação JSON.
8. Certificação de Especialista em Sistemas de Observação.

## Gráficos

- WebGL2 e GLSL procedural.
- Nebulosa volumétrica com FBM e ray marching adaptativo.
- Estrelas em múltiplas camadas e cintilação limitada pelo perfil.
- Galáxia espiral, supernova, disco de acreção didático e telescópio procedural.
- Câmera 360° com yaw, pitch, zoom e centralização.
- Resolução interna e passos do shader por perfil gráfico.
- Reduzir movimento diminui tempo, cintilação e deriva.
- Fallback Canvas 2D.
- Tratamento de perda e restauração de contexto.

## Melhoria transversal

O renderizador principal do portal passou a registrar e cancelar o `requestAnimationFrame`, além de liberar o programa WebGL em `destroy()`. Isso reduz risco de consumo residual de GPU e bateria ao encerrar ou recarregar a aplicação.

## Progressão

- Exploração 3D: 240 XP.
- Quatro decisões instrumentais: 880 XP.
- Pipeline de imagem: 300 XP.
- Três desafios espectrais: 480 XP.
- Banco de observações: 260 XP.
- Certificação: 450 XP.
- Total possível: 2.610 XP.

## Limitação de validação

O servidor HTTP e os arquivos críticos responderam corretamente. O Chromium do ambiente não inicializou EGL/SwiftShader, impedindo captura confiável do WebGL. A compilação visual final deve ser conferida em GPU física.
