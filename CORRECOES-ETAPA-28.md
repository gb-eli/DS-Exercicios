# CORREÇÕES — ETAPA 28 / FASE 2.2 — PISTAS E TRILHOS

Base: v14.10.8.65 — Etapa 27, suíte 376/376 PASS.

## Escopo

Esta fase altera apenas pistas/trilhos do Lobby Campus. Não inclui clima, NPC inteligente, subsolo ou controle livre de carro/moto/helicóptero.

## Alterações

### Pista Técnica AGV
- Novo contrato `CAMPUS_MOBILITY_TRACKS`.
- A Pista Técnica reutiliza a rota `mobility-south` e a malha viária existente.
- Não foi criada uma segunda camada de asfalto sobre o Campus.
- Foram adicionadas bordas discretas, balizadores e marca de largada.
- O modo 2D representa a mesma pista por uma linha tracejada discreta.

### Montanha-russa panorâmica
- Circuito continua partindo/retornando à Estação Intermodal.
- O percurso deixou de ser praticamente plano e agora possui variação vertical de aproximadamente 5,1 m.
- Trilho próprio da atração com bitola definida e suportes.
- Em `low/Eco`, usa geometria simplificada de um único tubo para reduzir custo.
- Em qualidade superior, usa dois trilhos, travessas e suportes espaçados.
- Carrinho próprio da montanha-russa; o trem do monotrilho não é mais reaproveitado para a atração.

### Monotrilho
- Viga principal preservada.
- Guias laterais são adicionadas apenas fora do modo Eco.
- Suportes estruturais reduzidos de 44 para 32 (~27% menos pilares), agora com travessa superior.
- Estações ganharam segunda borda iluminada e faixa de segurança.
- 2D diferencia a viga estrutural da linha-guia.

### Cache de publicação
- Cadeia alterada recebeu sufixo `stage28`.
- `vendor-loader`, `boot`, `lobby.js`, runtimes 2D/3D, módulos de experiências/mobilidade, ride/train managers e Service Worker sincronizados.
- Contratos históricos de cache foram atualizados para aceitar sufixos de fase sem remover a exigência da versão base.

## Integridade preservada
- Masterplan e posições dos prédios: preservados.
- Colliders dos prédios/interiores: preservados.
- Autenticação e banco: não alterados.
- Vale do Silício: não alterado nesta fase.
- Veículos utilizáveis: lógica existente preservada; expansão fica para fase própria.

## Validação
- Validador Etapa 28: 20/20 PASS.
- Interações Etapa 16: 22/22 PASS.
- Regressões Vale/Campus/visual/performance: PASS.
- 5 validadores oficiais: PASS.
- Suíte completa: 376/376 PASS — 0 falhas.

## Observação
Validações estáticas/unitárias não substituem teste visual WebGL após publicação em notebook/celular real.
