# Relatório de validação — Fase 7.23 · v0.38.2

## Escopo
A v0.38.2 amplia o Mundo Plataforma DS 360 com a **Região 2 — Vila Tecnológica**, preservando as 23 experiências da plataforma e o runtime modular iniciado na v0.38.1.

## Região 2 — Vila Tecnológica
A região mede 80×72 unidades e possui quatro setores: Praça de Conexão, Oficina de Manutenção, Estação de Dados e Centro de Rede. Existem 3 NPCs, 8 pontos interativos, 4 pacotes de dados, 4 checkpoints, 2 plataformas móveis e 3 patrulhas.

### Missão 1 — Oficina em Sincronia
Falar com Lia → ativar 3 módulos internos → retornar à Lia.

### Missão 2 — Pacotes Perdidos
Falar com Ivo → recuperar 4 pacotes → concluir upload na Estação de Dados.

### Missão 3 — Rede da Vila
Falar com Dara → ativar 3 relés → sincronizar o Núcleo da Vila → atravessar o Portal de Continuidade.

## Persistência e migração
O Mundo 360 passa a usar **schema 2** quando carregado com as duas regiões. O save guarda região atual, progresso por região, checkpoint, estado das missões, reparos, dados, relés, vidas e pontuação.

O schema 1 da v0.38.1 é migrado automaticamente:
- save incompleto continua na Região 1;
- save com Vale concluído entra na Região 2;
- a conclusão antiga do Vale não é confundida com conclusão da campanha de duas regiões.

A classe mantém compatibilidade legada: instanciada somente com `region.json`, continua emitindo schema 1 e o Portal Nexus encerra a experiência como antes.

## Arquitetura
- `simulation.mjs`: física, regiões, missões, NPCs, interação e save;
- `render.mjs`: Three.js, troca de região, NPCs, interiores e terminais;
- `game.js`: entradas, HUD, áudio simples e ponte com o portal;
- `region.json`: Vale Nexus;
- `village.json`: Vila Tecnológica.

## Testes específicos
A suíte `test-mundo-plataforma-360-v0.38.2.mjs` aprovou **136/136** verificações, cobrindo geometria, segurança, sequência das três missões, bloqueios por etapa, migração, save schema 2, compatibilidade schema 1, câmera/render, input e integração.

## Regressão
As suítes atuais totalizam **916/916 aprovações e 0 falhas**. A auditoria geral dos 23 jogos registrou **695/695 checks**, sem alertas ou falhas. Há sobreposição conceitual entre essas métricas, por isso são reportadas separadamente.

## Validação de publicação
- **405/405 rotas HTTP 200**;
- **37 scripts próprios** sem erro de sintaxe;
- **61 JSONs** válidos;
- **101 SVGs** XML-válidos;
- **78 referências do Service Worker** existentes, sem caminhos ausentes.

## Validação perceptiva
Foi tentado um smoke visual com Chromium headless. O processo excedeu o limite e registrou falhas de DBus/UPower do ambiente, sem gerar screenshot. Por isso ele não é contabilizado como teste aprovado. Câmera, conforto visual, touch, gamepad, áudio e frame pacing devem ser conferidos em navegador/hardware real conforme `CHECKLIST-TESTES-v0.38.2.md`.

## Próxima etapa
v0.38.3 — Floresta de Circuitos, terceira região do mesmo mundo persistente.
