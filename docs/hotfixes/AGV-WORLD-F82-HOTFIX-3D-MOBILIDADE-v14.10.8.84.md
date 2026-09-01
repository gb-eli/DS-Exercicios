# AGV World F82 — Hotfix 3D, Mobilidade e Teletransporte

**Versão:** v14.10.8.84  
**Base:** O5 v14.10.8.83 — Conexões entre Mundos  
**Escopo:** correção funcional prioritária antes da O6.

## 1. Problema reportado
Os ambientes Mundo Rural, Base de Operações, Estação Orbital, Lua AGV e Marte AGV abriam no modo Lite/2D, mas retornavam ao 2D ao tentar iniciar 3D. Também foi solicitada reorganização do teletransporte, controle de reunião da turma, revisão das vias, pedestres, veículos, colisões, conexões e parada do trem em estações.

## 2. Causas encontradas
- **Rural, Base, Lua e Marte 3D:** os runtimes chamavam o Avatar V2 sem fornecer `spriteLabel`/`emojiSprite`, quebrando antes do primeiro frame.
- **Estação Orbital 3D:** erro de sintaxe no bloco de movimentação impedia o módulo de carregar.
- **Estação Orbital Lite:** o mesmo bloco inválido existia também no runtime 2D.
- **Museu do Hardware 3D:** `museu-hardware-assets.js` possuía uma chave de fechamento excedente; o import recebeu cache-bust da correção.
- **Mobilidade do Campus:** circuito central e eixo sul tinham trechos fora da malha viária; NPCs de pedestres reutilizavam rotas de veículos.
- **Presença dos novos mapas:** a migration 073 original podia deixar uma constraint histórica ativa por divergência de nome.

## 3. Correções aplicadas
### 3D
- Atualizado o contrato do Avatar V2 em Rural, Base, Estação Orbital, Lua e Marte.
- Corrigidos os blocos de sintaxe do runtime orbital Lite/3D.
- Atualizado `world-adapter.js` para cache-bust v14.10.8.84 dos cinco 3D reparados.
- Corrigido o módulo de assets do Museu do Hardware.

### Teletransporte
A janela agora é maior e dividida em:
1. **Campus & Aprendizagem** — Vale, Colégio, Museu.
2. **Exploração & Operações** — Rural, Base, Estação Orbital, Lua, Marte.
3. **Jogos & Lazer** — Parque e Labirinto.

Para equipe/staff:
- **Trazer aluno:** seleciona um aluno online específico.
- **Trazer todos:** reúne todos os alunos no ponto atual.
- O token individual contém `target_id` e só pode ser consumido pelo usuário destinatário.

### Ruas, pedestres e veículos
- Rotas automáticas ajustadas para permanecer dentro da malha de ruas.
- Acessos do eixo sul complementados.
- NPCs de circulação migrados para rotas `ped-*`, separadas das rotas de veículos.
- Validação geométrica F82 amostra todos os circuitos e verifica colisão com os principais prédios.

### Trem
- Parada de **5 segundos** antes da saída de cada estação.
- Parada de **5 segundos** na estação de chegada, permitindo embarque/desembarque antes do próximo percurso.

### Presença / banco
- A `073_lobby_new_worlds.sql` foi corrigida para instalações novas.
- Foi criada **`074_lobby_presence_worlds_hotfix.sql`** para instalações onde a 073 já consta como aplicada.
- `lobby-presence` agora suporta reunião direcionada por `target_id`.

## 4. Validação
- F82: **8/8 PASS**.
- Cinco runtimes reportados: criação + **primeiro frame** aprovados em harness Three.js.
- JavaScript não-vendor: **1.034 arquivos / 0 erros de sintaxe**.
- Imports locais do Lobby: **325 / 0 ausentes**.
- O2–O5: **26/28**; as duas falhas são asserts históricos de hash que proíbem mudanças em migration/Edge/SW e ficaram obsoletos após este hotfix intencional.
- F72–F80: **66/71**; permanecem os cinco falsos negativos F72–F76 por regex de áreas antigas.
- Chat por proximidade: **inalterado** em relação à O5. SHA-256 `d79d006c920f60c5911bfafdebdc5d2309fc1b52a4748bbcdda022b92c164a5f`.

## 5. Limitação do smoke visual
O Chromium da sandbox não inicializou EGL/ANGLE e ficou preso no processo zygote/DBus. Portanto, o hotfix foi validado por testes de contrato, sintaxe, imports, geometria e primeiro-frame via harness, mas **não é correto declarar inspeção visual WebGL completa no Chromium desta sandbox**.

## 6. Implantação obrigatória
1. Publicar os arquivos da versão v14.10.8.84.
2. Executar a nova migration `074_lobby_presence_worlds_hotfix.sql` pelo fluxo normal de migrations.
3. Republicar a Edge Function `lobby-presence`.
4. Confirmar que o Service Worker novo foi ativado (v14.10.8.84) antes de retestar 3D em clientes que já usavam a versão anterior.
5. Testar Rural, Base, Estação Orbital, Lua e Marte alternando Lite → 3D → Lite e mudando entre mundos.

## 7. Rollback
Rollback funcional: retornar para o pacote O5 v14.10.8.83. A migration 074 apenas amplia/repara a constraint de áreas e é compatível com as áreas que já existiam na O5; se um rollback de banco for realmente necessário, deve ser feito de forma explícita e revisado no projeto Supabase antes de remover áreas.
