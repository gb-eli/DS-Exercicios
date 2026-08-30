# Status de implementação — v14.10.8.65

## Estado

**RELEASE CANDIDATE CONSOLIDADA — validações estáticas da Cidade Viva aprovadas; smoke visual real pós-deploy ainda obrigatório.**

## Implementado nesta versão

- 5 circuitos de tráfego urbano;
- 6 veículos de ambientação em movimento;
- 4 veículos do Campus utilizáveis;
- HUD de veículo ativo;
- 5 NPCs urbanos em circulação;
- 5 painéis de sinalização dinâmica;
- 5 eventos urbanos rotativos;
- cabine física de elevador no 3D com sequência de viagem;
- assinatura visual específica para 10 interiores principais;
- paridade funcional 2D/3D para os sistemas de Cidade Viva;
- boot, Service Worker e reparo validando `campus-mobility-systems.js`;
- autenticação unificada preservada;
- Etapa 2 de manutenção: recuperação temporária centralizada por e-mail institucional + CGM;
- Etapa 2 de manutenção: migration 063 adicionada para finalizar com segurança a troca obrigatória de senha.

## Validação local da release

A validação oficial da v14.10.8.65 registra PASS para:

- `validate-campus-city-v62.mjs`;
- `validate-campus-interiors-v63.mjs`;
- `validate-campus-live-v64.mjs`;
- `validate-campus-mobility-v65.mjs`;
- `validate-unified-auth-v59.mjs`.

Também foram verificados os imports locais e a sintaxe JS/MJS do Lobby.

## Pendente antes de considerar produção totalmente encerrada

- smoke visual real em Chrome/WebGL;
- smoke em Android;
- regressão do restante do portal fora do escopo específico da Cidade Viva;
- confirmação dos fluxos Admin, Professor e CTF após publicação;
- aplicar/revisar `core/database/063_p10920_password_change_finalize.sql` no Supabase antes do teste de produção da recuperação por CGM.

## Regra de segurança

Nenhum `service_role`, `sb_secret` ou Client Secret foi adicionado ao frontend. A Etapa 2 inclui uma migration server-side versionada (`063_p10920_password_change_finalize.sql`), que deve ser aplicada apenas no Supabase.

## Correção incremental — Etapa 3

Concluída a consolidação do Login Único/Google e do retorno de sessão após troca obrigatória de senha. O Google permanece centralizado em `/auth/`; o Hub não duplica autenticação. O destino original passa a ser reaproveitado com validação de segurança após a senha definitiva. Recuperação duplicada em Atividades removida. Testes focados: 13/13 PASS; regressão CGM: 5/5 PASS; suíte geral: 307/368 PASS.

## Correção incremental — Etapa 4

Concluída a compatibilidade do painel Admin. Os fluxos atuais de sessão, AAL2, revogação, supervisão e gestão administrativa já estavam íntegros; a única regressão desta área era o contrato visual legado do menu. Os rótulos foram reconciliados sem desfazer o redesign. Testes administrativos e de sessão: PASS; suíte geral: 308/368 PASS.


## Correção incremental — Etapa 5

Concluída a correção isolada do CTF DS / bridge Core. A migração para Login Único foi mantida: não foi reintroduzido login por senha dentro do CTF. Foram corrigidos handlers reais de `Trocar de conta` e `Sair`, que referenciavam funções inexistentes e podiam gerar `ReferenceError`; os controles agora encerram a sessão institucional compartilhada, preservam/checkpointam o cache local e retornam ao `/auth/`. O contrato P6.7 e o teste piloto do CTF foram reconciliados com a arquitetura atual. Testes focados do CTF/Core: PASS; cinco validadores oficiais: PASS; suíte geral: 309/368 PASS, com 59 falhas remanescentes fora deste escopo.
