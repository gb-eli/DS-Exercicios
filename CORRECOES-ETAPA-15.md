# CORREÇÕES — ETAPA 15

## Interiores modularizados e desempenho

Escopo isolado desta etapa: ciclo de vida dos interiores 3D do Lobby Geral. Elevadores/atrações não foram redesenhados e o módulo de laboratório pedagógico/adaptações não foi alterado.

### Problema encontrado
- O runtime 3D construía no boot os 4 laboratórios de turma e os 10 interiores de ferramentas, mesmo todos iniciando invisíveis.
- Geometrias, materiais, texturas, painéis e avatares de recepção eram alocados antes de qualquer aluno entrar em um prédio.
- O Campus externo continuava renderizando e executando atualizações de tráfego, NPCs, portais, atrações e sinalização enquanto o aluno estava dentro de um interior.

### Alterações
- Criados dois domínios de runtime: `campus-exterior-runtime` e `campus-interior-runtime`.
- Ambiente, portais, sinalização, veículos, NPCs, decoração, atrações e avatares remotos foram agrupados no runtime externo.
- Interiores deixaram de ser instanciados no boot.
- `ensureClassInterior()` monta apenas o laboratório de turma solicitado no momento da entrada.
- `ensureToolInterior()` monta apenas o prédio/ferramenta solicitado no momento da entrada.
- Interações internas são registradas somente enquanto o interior correspondente está montado.
- Ao entrar, o exterior é suspenso (`visible=false`) e deixa de participar da colisão de câmera.
- Enquanto o aluno está dentro, tráfego, NPCs, portais, atrações, painéis externos, monotrilho e animações da Praça deixam de ser atualizados.
- A câmera passa a usar somente o grupo de colisão do interior ativo.
- Ao sair, o interior é removido da cena e suas geometrias/materiais/texturas são descartados.
- Avatar de recepção de interiores de ferramenta usa o descarte próprio do sistema de avatar.
- Teleporte a partir de um interior também desmonta o ambiente ativo e restaura o Campus externo.
- Céu/sol/lua externos ficam suspensos dentro do prédio e são restaurados ao sair.
- O modo 2D já desenhava somente o interior ativo e foi preservado.

### Validação
- `validate-campus-interior-runtime-stage15-v65.mjs`: 18/18 PASS.
- Contrato P5.7 de interiores: PASS.
- Etapas 10–14: PASS.
- Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: PASS.
- Suíte geral: 359/368 PASS, exatamente as mesmas 9 falhas anteriores.

Nenhuma migration, Edge Function ou alteração de banco nesta etapa.
