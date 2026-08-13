# STATUS DE IMPLEMENTAÇÃO — AGV EDUCATION CORE

**Data:** 13/08/2026  
**Pacote-base:** AGV-ECOSSISTEMA-UNIFICADO v2  
**Estado:** Fase 0 concluída + Core central implantado parcialmente + início P0

## Concluído

- baseline das árvores canônicas P0/P1;
- regressões Loja/CTF/Game registradas;
- AGVCoreSDK v0.2.0;
- contrato de reward claim sem `amount`;
- DSStoreSDK com transporte `agv-core`;
- configuração segura da Loja criada e desativada por padrão;
- documentação de ativação P0;
- schema compatível de aprendizagem/carteira no Supabase central;
- `agv-progress-event` v2 e `agv-reward-claim` v1;
- 11 plataformas/serviços registrados no catálogo central.

## Não concluído ainda

- catálogo de atividades e regras de recompensa populados;
- compra/carteira/inventário da Loja usando backend oficial;
- migração P1;
- migração P2/P3.

## Regra operacional

Não definir `AGV_CORE_CONFIG.enabled=true` antes de o backend central estar implantado e testado.
