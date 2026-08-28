# Checklist de teste real — Fliperama DS v0.37.0

## Portal
- [ ] abrir a plataforma em celular e notebook;
- [ ] localizar Duo Elementos no catálogo;
- [ ] abrir e fechar a experiência sem travar o portal;
- [ ] confirmar que o iframe ocupa a área correta e não cobre ações essenciais.

## Solo
- [ ] mover Ígneo e Aqua alternadamente;
- [ ] trocar com Q/Tab;
- [ ] atravessar perigos compatíveis e sofrer reset nos incompatíveis;
- [ ] ativar relés/gates;
- [ ] concluir as 8 fases;
- [ ] confirmar checkpoints e restauração.

## Dois jogadores locais
- [ ] J1 A/D/W e J2 setas simultaneamente;
- [ ] testar teclado + gamepad;
- [ ] testar dois gamepads;
- [ ] testar touch em celular/tablet;
- [ ] confirmar que um jogador não move o outro.

## Visual/áudio
- [ ] verificar partículas em Alto/Ultra;
- [ ] verificar redução de movimento;
- [ ] testar mute/áudio do navegador;
- [ ] verificar HUD em 360×640, 390×844, 768×1024 e 1366×768.

## Fase 8
- [ ] confirmar que todos os quatro relés podem ser ativados antes da barreira final;
- [ ] confirmar que as duas saídas podem ser ocupadas;
- [ ] confirmar tela de conclusão da campanha.

## Limitação do ambiente de build
- [ ] repetir screenshot/playtest visual em navegador real; o Chromium headless do ambiente de build encerrou por timeout com erros DBus/GPU.
