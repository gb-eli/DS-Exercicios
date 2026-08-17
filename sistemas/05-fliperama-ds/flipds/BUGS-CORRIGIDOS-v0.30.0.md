# Bugs corrigidos — Fliperama DS v0.30.0

## Base física 3D

- plataformas altas podiam ser escaladas instantaneamente apenas entrando em seu volume horizontal;
- rampas e plataformas não consideravam corretamente a altura atual do avatar;
- colisões laterais podiam bloquear ou transportar o jogador de forma incoerente;
- posições inválidas não tinham recuperação segura;
- salto não possuía tolerância de borda nem armazenamento antecipado do comando.

## Setor Poligonal 94

- percurso da rampa central e plataforma superior revisado;
- câmera externa podia ficar dentro de paredes, pilares ou plataformas;
- portal podia ser concluído sem experimentar suficientemente câmeras e materiais;
- controles de câmera por toque e mouse eram limitados;
- ausência de ajuste rápido da sensibilidade;
- saves antigos não possuíam os novos estados físicos e de câmera.

## Câmeras em Evolução

- mesmos problemas de altura, rampa e colisão da base compartilhada;
- câmeras em terceira pessoa, perseguição, orbital e fixa não recuavam diante de obstáculos;
- portal podia abrir sem testar todas as câmeras e os três FOVs;
- falta de arraste vertical para inclinação;
- falta de recuperação ao sair da área válida;
- saves schema 1 migrados para schema 2.
