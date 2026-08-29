# AGV Campus DS — Atualização v14.10.8.46

## Fase D — Avatar V2

Release incremental construída sobre a `v14.10.8.45` (Fase C — Ambiente e Arquitetura).

## Objetivo

Unificar o sistema de personagens do Lobby 3D e melhorar variedade visual, animação e desempenho sem alterar presença online, autenticação, Supabase ou regras pedagógicas.

## Arquivos principais

### Novo

- `lobby/assets/characters/avatar-system.js`

Responsável por:

- inicialização opcional do avatar GLB;
- fallback procedural;
- criação de todos os tipos de avatar;
- aparência determinística;
- acessórios;
- animação;
- emotes;
- LOD;
- descarte de recursos.

### Alterados

- `lobby/assets/lobby3d.js`
- `lobby/assets/rigged-avatar.js`
- `lobby/assets/boot.js`
- `lobby/sw.js`
- arquivos de versão/cache-busting para `14.10.8.46`.

## Arquitetura

Antes, `lobby3d.js` possuía caminhos separados para:

- jogador local;
- usuários remotos;
- NPCs;
- alunos em patrulha;
- grupos sociais;
- avatar procedural;
- avatar rigado.

Agora todos passam pelo contrato:

```js
avatarSystem.createAvatar()
avatarSystem.animate()
avatarSystem.updateEmote()
avatarSystem.applyLOD()
avatarSystem.disposeAvatar()
```

## Aparência determinística

A aparência é derivada de uma seed estável do usuário/personagem. O mesmo usuário tende a receber a mesma combinação visual sem criar novas colunas no banco.

Variações disponíveis nesta release:

- tons de pele;
- cores de cabelo;
- calças;
- tênis;
- cabelo/boné;
- óculos;
- headset;
- mochila;
- relógio.

A cor da turma/equipe continua sendo utilizada como identidade principal da camiseta/detalhe visual.

## Rig GLB

O asset atual foi preservado:

`lobby/assets/models/agv-avatar-rig-v1.glb`

Estrutura validada:

- Root
- Hips
- Torso
- Head
- LeftArm
- RightArm
- LeftLeg
- RightLeg

Clips existentes:

- Idle
- Walk
- Run
- Jump
- Wave

Os acessórios do Avatar V2 podem ser ligados diretamente aos ossos `Head`, `Torso` e `RightArm` quando o rig está disponível.

## Fallback seguro

`rigged-avatar.js` permanece opcional.

Fluxo:

```text
Avatar System
   ↓
Tenta carregar rigged-avatar.js + GLB
   ↓
Sucesso → rigged-glb-v2
Falha   → procedural-v2
```

Uma falha no GLB não deve impedir a abertura do Campus.

## LOD de personagens

O LOD agora é centralizado:

- próximo: animação completa + acessórios + label;
- médio: label reduzida e acessórios limitados;
- distante: frequência da animação reduzida;
- muito distante: sombra/label removidas e avatar ocultado fora do raio útil.

O jogador local não sofre degradação de LOD.

## Service Worker

Passam a integrar o shell local:

- `assets/characters/avatar-system.js`
- `assets/rigged-avatar.js`
- `assets/models/agv-avatar-rig-v1.glb`

Isso reduz risco de falha do Avatar V2 em uma navegação posterior com conexão instável.

## Banco de dados

Nenhuma migration, tabela, coluna, RPC ou policy foi alterada.

A variação visual é calculada no cliente a partir das identificações que já existem no runtime.

## Próxima fase sugerida

### Fase E — Portal V2 + FX

- estrutura arquitetônica de portal mais robusta;
- campo energético em camadas;
- partículas por qualidade;
- luz responsiva à proximidade;
- estado fechado/aberto mais legível;
- efeitos High/Ultra opcionais;
- áudio espacial leve e opcional;
- preservação do modo Eco e fallback.
