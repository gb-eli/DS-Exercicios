# Deploy — AGV World F89 v14.10.8.91

## Cenário A — ambiente já está na F88 v14.10.8.90

Não existe migration nova na F89.

1. Fazer backup/rollback da F88.
2. Publicar os arquivos da F89 sobre o frontend atual.
3. Confirmar `LOBBY_VERSION = 14.10.8.91`.
4. Confirmar Service Worker `stage60-f89-campus-performance`.
5. Fazer hard refresh/reabrir o Lobby para ativar o novo Service Worker.
6. Validar Campus Lite e Campus 3D.
7. Validar Estação Central → Vilas/Biblioteca/Labs/Neon.
8. Fazer duas viagens consecutivas de monotrilho para validar criação/dispose/recriação do trilho.
9. Validar modo Econômico/Equilibrado e movimento próximo/distante de prédios.
10. Validar airdrop e Realtime de avatar.

## Cenário B — ambiente anterior à F88

Antes do frontend F89, aplicar o backend acumulado exigido pelas releases anteriores:

- migrations 074 → 079, na ordem;
- Edge Function `lobby-presence` consolidada da linha F88;
- depois publicar a F89.

## Não é necessário na F89

- nenhuma migration 080;
- nenhuma alteração manual de tabela;
- nenhuma alteração de segredo/chave;
- nenhuma mudança de autenticação.

## Checklist rápido pós-deploy

- [ ] versão exibida 14.10.8.91;
- [ ] Lite abre sem baixar Campus 3D previamente;
- [ ] Campus 3D abre sob demanda;
- [ ] Biblioteca/Labs/Neon abrem como runtimes separados;
- [ ] Vilas continuam separadas;
- [ ] monotrilho fica ausente quando ocioso e aparece durante viagem;
- [ ] trem espera 5 s na estação;
- [ ] segunda viagem funciona após o primeiro `dispose()`;
- [ ] qualidade mobile abre pelo botão ⚙ Qualidade;
- [ ] Realtime mostra posição/ações/aparência;
- [ ] airdrop setorial continua carregando somente o destino.

## Rollback

Em caso de regressão de frontend, retornar ao pacote F88 v14.10.8.90. Como a F89 não possui migration nova, o rollback do frontend não exige rollback de banco.
