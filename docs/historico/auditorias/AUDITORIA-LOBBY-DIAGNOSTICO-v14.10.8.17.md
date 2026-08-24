# Auditoria — Diagnóstico técnico do Lobby v14.10.8.17

Data: 23/08/2026  
Fase: `P10.9.16-lobby-diagnostics`  
Base: `v14.10.8.16`  
Modo: candidato auditado, sem escrita em produção.

## Objetivo

Adicionar uma camada de diagnóstico de campo ao Lobby para identificar, em celular, tablet ou computador, onde a inicialização parou sem expor dados pessoais do aluno e sem alterar o fluxo normal.

O diagnóstico não é um elemento decorativo. Ele fica oculto durante o uso comum e é destinado a suporte técnico quando há falha de boot, rede, SDK, Service Worker ou runtime 3D.

## Como abrir

- Acrescentar `?diag=1` à URL do Lobby; ou
- usar `Alt + Shift + D`; ou
- usar o botão **Diagnóstico técnico** que é exposto quando ocorre uma falha tratada.

O painel permite atualizar os dados e copiar um JSON técnico para envio ao professor/suporte.

## Dados registrados

- release e etapa atual do boot;
- versão e origem do SDK Supabase;
- tentativas de carregamento do SDK;
- evidência de hit/store do cache do Service Worker;
- suporte, registro e controle do Service Worker;
- estado de rede, tipo efetivo de conexão, RTT/downlink quando disponíveis;
- viewport, visual viewport, DPR, ponteiro coarse, reduced motion;
- memória/hardwareConcurrency quando expostos pelo navegador;
- estado do runtime: 3D ou leve, qualidade, FPS, avatar e primeiro frame;
- últimos eventos técnicos e último erro tratado;
- timing do recurso do SDK quando exposto pela Performance API.

## Dados explicitamente excluídos

O diagnóstico não lê nem exporta:

- nome do aluno;
- e-mail;
- CGM;
- senha;
- access token ou refresh token;
- sessão Supabase;
- `localStorage` ou `sessionStorage`;
- `user_metadata`;
- conteúdo dos códigos do aluno;
- conteúdo de atividades;
- notas ou progresso.

A inspeção estática confirmou que as palavras `e-mail`, `CGM` e `token` aparecem no módulo apenas na mensagem de privacidade que informa que esses dados **não** são incluídos.

## Etapas observáveis

Entre os eventos técnicos instrumentados estão:

- `diagnostics_ready`;
- registro/controle do Service Worker;
- `sdk_attempt`, `sdk_loaded`, `sdk_failed`;
- hit/store do cache persistente do SDK;
- `boot_module_loading`;
- `lobby_boot`;
- `identity_loading` / perfil carregado;
- atividades carregadas;
- `runtime_3d_loading` / `runtime_3d_ready`;
- entrada em runtime leve;
- atualização de qualidade/FPS/avatar;
- `lobby_ready`;
- erro técnico tratado.

## Service Worker e SDK

A release preserva a resiliência introduzida na v14.10.8.16:

1. tenta o slot local de Supabase;
2. usa fontes CDN pinadas quando necessário;
3. o Service Worker pode reutilizar o SDK armazenado após uma carga remota bem-sucedida.

O diagnóstico passa a informar se o SDK foi obtido por fonte local/remota e se o Service Worker respondeu com `hit` ou registrou `stored`.

### Limitação mantida

`lobby/vendor/supabase/supabase.js` ainda é um placeholder. O primeiro acesso em um navegador sem cache anterior **não é garantido offline**. Esta release não declara vendorização completa.

## Responsividade e UX

O painel técnico:

- não aparece durante o fluxo normal;
- possui layout responsivo;
- respeita safe areas;
- usa alvo de toque de 44 px no controle de abertura;
- respeita `prefers-reduced-motion`;
- não introduz gradientes, glow ou animação ornamental;
- preserva as correções de zoom, teclado virtual e reflow das releases anteriores.

## Validação

- regressão cumulativa: **297/297 testes aprovados**;
- teste específico do diagnóstico: **7/7 aprovado**;
- 9 arquivos JavaScript alterados/afetados nesta fase: **9/9 `node --check` aprovado**;
- inventário total JS/MJS no pacote: **868 arquivos**; a base v14.10.8.16 já havia sido validada integralmente e os arquivos novos/alterados foram rechecados nesta fase;
- JSON: **462/462 válidos**;
- IDs duplicados nas cinco entradas principais: **0**;
- referências runtime stale para `.13/.14/.15/.16`: **0** nos executáveis atuais;
- TypeScript: **52 arquivos**, nenhum alterado por esta fase;
- nenhuma migration aplicada;
- nenhuma Edge Function implantada;
- nenhum dado do aluno alterado;
- arquivos cobertos pelo manifesto interno: **3.056** (excluindo os próprios arquivos gerados de lista/hash).

## Limites da validação

Não foi possível realizar um teste físico real em aparelhos Android/iOS nesta execução. O diagnóstico foi criado justamente para permitir que a próxima falha observada em dispositivo real gere evidência técnica reproduzível em vez de depender apenas de relatos como “travou” ou “não abriu”.

O ambiente também não permitiu baixar de forma confiável o bundle UMD oficial do Supabase para vendorização. Nenhum arquivo não verificado foi incorporado.

## Critério de uso em campo

Se um aluno relatar problema:

1. abrir o Lobby com `?diag=1`;
2. reproduzir o problema;
3. abrir/atualizar o diagnóstico;
4. copiar o JSON;
5. enviar o diagnóstico ao professor/suporte.

A leitura do relatório deve priorizar: `stage`, `sdk.source`, `sdk.attempts`, `serviceWorker`, `network`, `viewport`, `runtime` e `lastError`.
