# Guia rápido — Auditoria real dos mapas F94.5

## Preparação

1. Publique a F94.5 sobre a F94.4 HF4.
2. Abra o Lobby adicionando `?worldaudit=1&diag=1` à URL.
3. Confirme que aparece **Auditoria dos mundos**.
4. Clique em **Limpar** antes da rodada oficial.

## Procedimento para cada mundo

Para cada um dos 18 mundos:

1. abrir o mapa em **2D**;
2. aguardar o carregamento terminar;
3. movimentar o personagem por alguns segundos;
4. aproximar-se de pelo menos um objeto e usar **E/Interagir**;
5. trocar para **3D**;
6. aguardar o primeiro frame;
7. caminhar, correr, pular e girar a câmera;
8. interagir com pelo menos um objeto;
9. quando houver veículo, tentar motorista e carona;
10. retornar/trocar de mundo para testar `unload`.

## Casos especiais

### Parque
Testar montanha-russa, parkour, escorregador/elevador, corrida e tiro.

### Campus
Testar veículo terrestre, veículo aéreo, prédio/interior, câmera e mirante.

### Vale
Testar escala 2D, deslocamento longo, prédio/empresa e interação.

### Rural
Testar fauna, prédio, ponte/rios e objetos interativos.

### Museu
Testar carregamento dos GLBs/LOD e inspeção de item.

### Colégio e Labirinto
Testar host, entrada, input e retorno ao Campus.

## Coleta

Ao final, abra **Auditoria dos mundos → Copiar JSON** e envie o JSON completo.

Também copie o **Diagnóstico técnico** se algum mapa apresentar erro visual, tela preta, timeout ou fallback.

## Interpretação

- `adapter FAIL`: adapter/registro/seleção do mundo.
- `import FAIL`: módulo lazy não carregou ou export faltando.
- `assets FAIL`: recurso necessário falhou antes de avançar.
- `runtime FAIL`: factory/contrato/runtime.
- `renderer FAIL`: canvas/WebGL/WebGPU.
- `firstFrame FAIL`: criou runtime mas não produziu frame a tempo.
- `input pendente`: nenhum input de jogo foi observado nessa tentativa.
- `interaction pendente`: interação não chegou ao pipeline central nessa tentativa.

Não classificar um mundo como funcional somente porque o import retornou HTTP 200.
