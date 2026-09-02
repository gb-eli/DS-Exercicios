# Guia de implantação — F94.8 Camera V2

## Base esperada
F94.7 — Locomoção Real Unificada.

## Implantação recomendada
1. aplicar o PATCH F94.8 sobre a F94.7;
2. publicar os arquivos mantendo caminhos relativos;
3. confirmar que `lobby/sw.js` usa `stage70-f948-camera-v2`;
4. abrir o Lobby normalmente e aguardar o novo Service Worker assumir o controle;
5. se o navegador mantiver uma aba antiga aberta, fechar e abrir novamente uma vez.

## Smoke test obrigatório

### Câmera geral
- entrar no Campus 3D;
- arrastar para cima: a câmera deve olhar para o céu;
- arrastar para baixo: deve olhar para o chão;
- testar 1ª pessoa e 3ª pessoa;
- trocar para Ampla/Campus/Aérea;
- confirmar que a sensibilidade não muda ao trocar de mapa.

### Invert Y
- ⚙️ Mundo, câmera e personagem;
- marcar **Inverter eixo vertical (Invert Y)**;
- Aplicar;
- arrastar para cima: agora deve olhar para baixo;
- recarregar a página e confirmar persistência;
- desmarcar e aplicar para retornar ao padrão.

### Interiores
- entrar e sair de ao menos dois prédios diferentes;
- aproximar a câmera de parede/teto;
- confirmar que a colisão de câmera usa o interior atual e não meshes do ambiente anterior.

### Veículos
- Campus: entrar em veículo terrestre e confirmar câmera dedicada;
- sair e confirmar restauração da câmera anterior;
- testar helicóptero/drone quando disponível;
- Lua e Marte: entrar/sair do rover e confirmar o mesmo comportamento.

### Mirante
- entrar no Mirante AGV;
- arrastar horizontalmente até completar uma volta de 360°;
- olhar para cima e para baixo;
- usar roda do mouse e slider de 1× até 50×;
- selecionar um marco e confirmar apontamento automático;
- arrastar novamente e confirmar retorno ao panorama manual;
- observar NPCs/veículos para confirmar que o mundo continua atualizando em tempo real.

### Mobile
- testar drag no canvas com toque;
- conferir se joystick e câmera não disputam o mesmo gesto fora da área do joystick.

## Rollback
Restaurar os arquivos da F94.7. O backend não precisa de rollback.
