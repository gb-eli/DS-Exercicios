# Plano contínuo de melhoria gráfica

Este plano passa a valer para todas as fases futuras.

## Ciclo obrigatório por fase

1. Auditar o laboratório anterior.
2. Corrigir vazamentos de memória, listeners e Workers.
3. Revisar escala, câmera, iluminação e coerência física.
4. Acrescentar pelo menos uma evolução visual real.
5. Implementar fallback e perfis gráficos.
6. Testar desktop, tablet e celular.
7. Registrar limites e métricas.

## Matriz de qualidade

### Geometria

- escala coerente;
- pivôs e eixos consistentes;
- LOD quando houver GLB;
- silhuetas legíveis;
- colisores separados da malha visual.

### Materiais e shaders

- PBR antes de efeitos decorativos;
- shader personalizado somente quando necessário;
- iluminação coerente com Sol e ambiente;
- bloom restrito a emissivos;
- transparência e partículas com orçamento definido.

### Partículas

- somente quando houver causa física;
- pooling para sistemas repetitivos;
- densidade adaptada por perfil;
- desligamento em Reduzir movimento;
- sem fumaça atmosférica no vácuo.

### Câmera e 360°

- limite de pitch;
- zoom limitado;
- reset de câmera;
- toque e mouse;
- câmera pausada sob modais;
- centro do campo visual livre.

### Desempenho

- resolução dinâmica;
- orçamento de draw calls;
- texturas comprimidas;
- descarte de programas, buffers e listeners;
- tratamento de context loss;
- Worker para simulações pesadas.

## Metas futuras

- Fase 9: observatório com pós-processamento científico, filtros e nebulosas volumétricas adaptativas.
- Fase 10: WebXR, controles imersivos, conforto VR e modo professor.
- Consolidação: migrar ativos aprovados para GLB/KTX2 com LOD e validação automática.


## Fase 9 — Universo profundo

- shader volumétrico com passos adaptativos;
- câmera 360° com yaw, pitch e zoom;
- HUD periférico;
- fallback Canvas 2D;
- contexto perdido e restaurado;
- pipeline científico separado do shader;
- correção do lifecycle do renderizador global;
- teste obrigatório em GPU física.


## Ciclo pós-Fase 10

1. substituir gradualmente modelos procedurais por GLB otimizados, mantendo fallback;
2. criar LOD0, LOD1 e LOD2 para veículos, estação e rovers;
3. adicionar KTX2, Meshopt e atlases de materiais;
4. validar compilação real de shaders em Adreno, Mali, Intel, AMD e NVIDIA;
5. medir bateria, temperatura e memória por 25, 40 e 50 minutos;
6. implantar testes de screenshot em infraestrutura com EGL funcional;
7. revisar escalas, pivôs, iluminação, colisões e câmera em cada laboratório;
8. ampliar som espacial, narração, legendas e feedback háptico opcional;
9. transformar o WebXR do centro de direção em adaptador compartilhado pelos módulos compatíveis;
10. manter a física, avaliação e evidência independentes da qualidade gráfica.

## Fase 11 — Sistema Solar imersivo

- fullscreen real da experiência;
- HUD restrita às bordas;
- câmera orbital 360°, voo livre e câmera cinematográfica;
- shaders diferentes por classe planetária;
- atmosferas aditivas e anéis transparentes;
- partículas solares e profundidade estelar;
- joystick virtual, teclado, mouse e gamepad;
- modo foto;
- fallback Canvas 2D;
- teste visual desktop e mobile por harness;
- auditoria de lifecycle e context loss.

## Próxima melhoria obrigatória

A Fase 12 deverá aplicar o mesmo padrão ao Centro de Lançamento, incluindo hangar navegável, múltiplas câmeras, exaustão adaptativa, fumaça atmosférica coerente, separação de estágios e replay cinematográfico.

## Fase 12 — Foguetes e lançamentos imersivos

Aplicado:

- tela cheia;
- HUD reduzida;
- quatro veículos;
- oito câmeras;
- interior e exterior;
- joystick e gamepad;
- partículas coerentes com altitude;
- replay cinematográfico;
- lifecycle completo de GPU.

Próxima prioridade:

- substituir gradualmente veículos procedurais por GLB otimizados com LOD;
- testar shader em GPUs físicas;
- medir frame time e draw calls;
- melhorar áudio espacializado e vibração opcional;
- integrar o ônibus espacial ao remaster orbital da Fase 13.

## Fase 14

- renderizador planetário unificado;
- primeira/terceira pessoa e câmeras de veículo;
- crateras, relevo, sombras, poeira e tempestade;
- módulo lunar, rovers, drone e braço;
- auditoria ampliada para 12 renderizadores;
- correção de entradas `NaN` e preservação de estado ao trocar veículo.
