# Auditoria gráfica — Fase 9

## Verificações automatizadas

- sete renderizadores de laboratório;
- `destroy()` e `resize()`;
- cancelamento de RAF;
- perfil gráfico;
- Reduzir movimento;
- fallback 2D;
- contexto perdido/restaurado no observatório;
- yaw, pitch e zoom;
- ray marching adaptativo;
- volumetria FBM;
- responsividade do palco 3D;
- proteção do centro da cena;
- descarte do renderizador global.

## Correção aplicada

O `WebGLCosmosRenderer` mantinha o loop identificado apenas pelo estado `running`. Agora guarda o ID do RAF, cancela explicitamente o frame e libera o programa em `destroy()`.

## Coerência visual

- nebulosas usam densidade volumétrica, não uma textura plana obrigatória;
- buraco negro é marcado como representação didática;
- cores de raios X e infravermelho representam composição científica, não visão humana direta;
- partículas são controladas por perfil e por Reduzir movimento;
- o HUD fica nas bordas e não bloqueia o alvo central.

## Pendências de dispositivo real

- compilação do shader em GPUs Mali, Adreno e Intel;
- gesto de pinça e rolagem em navegadores móveis;
- fullscreen em iOS;
- temperatura e bateria após 20 minutos;
- legibilidade em 360 px e 412 px.
