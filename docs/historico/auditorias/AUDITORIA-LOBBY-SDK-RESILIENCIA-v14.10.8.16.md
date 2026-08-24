# Auditoria — Resiliência do SDK do Lobby v14.10.8.16

Data: 23/08/2026  
Fase: `P10.9.15-lobby-sdk-resilience`  
Base: `v14.10.8.15`

## Objetivo

Reduzir a dependência operacional do Lobby em relação aos CDNs do `@supabase/supabase-js`, sem fingir que o bundle oficial está vendorizado localmente e sem alterar banco, autenticação server-side, notas ou arquivos dos alunos.

## Diagnóstico de entrada

A v14.10.8.15 já possuía:

- fonte local prioritária em `lobby/vendor/supabase/supabase.js`;
- jsDelivr e unpkg como contingência;
- timeout real de rede no cliente Supabase;
- proteção contra login infinito;
- cache-bust sincronizado.

Porém o arquivo local tinha apenas 303 bytes e era um placeholder. Em uma primeira abertura, o Lobby ainda precisava alcançar pelo menos um CDN para obter o SDK.

## Decisões

1. O placeholder local foi **mantido e documentado**, em vez de ser apresentado como bundle oficial.
2. As fontes remotas foram atualizadas e pinadas em `@supabase/supabase-js 2.112.3`.
3. O Lobby passou a registrar um Service Worker próprio antes do `vendor-loader`.
4. O Service Worker mantém em cache a resposta do SDK depois da primeira carga bem-sucedida.
5. O bloqueio baseado em `navigator.onLine === false` foi removido do caminho de carregamento remoto: mesmo offline, o pedido é tentado para que o Service Worker possa respondê-lo a partir do cache.
6. Caches antigos `agv-lobby-runtime-*` são removidos na ativação de uma nova release.
7. O cache-bust executável foi sincronizado em `14.10.8.16` para evitar mistura `.15/.16`.
8. As outras superfícies críticas que carregam Supabase JS por UMD também foram alinhadas para a versão pinada `2.112.3`.

## Fluxo resultante

```text
Lobby
→ tenta bundle local
→ prepara Service Worker
→ tenta jsDelivr 2.112.3
→ se sucesso, Service Worker preserva a resposta
→ se falhar, tenta unpkg 2.112.3
→ acessos posteriores podem receber o SDK do cache persistente
→ boot.js
→ Lobby
```

## O que isso resolve

- reduz dependência repetida de CDN a cada abertura;
- melhora reabertura em rede escolar instável;
- permite que uma cópia já obtida seja reutilizada quando o aparelho estiver sem conectividade externa ao CDN;
- mantém fallback entre duas origens;
- elimina a inconsistência de versões do SDK entre Lobby, Atividades e bootstrap central.

## Limite importante

A primeira abertura em um navegador que nunca carregou o Lobby ainda precisa:

- do bundle local oficial, se ele vier a ser incorporado; ou
- de pelo menos uma carga bem-sucedida por jsDelivr/unpkg.

Portanto esta versão melhora significativamente a resiliência, mas **não é declarada como primeiro-acesso 100% offline**.

## Segurança e privacidade

- nenhum `service_role`, `sb_secret_` ou segredo privado foi introduzido;
- o Service Worker só trata GETs do Lobby e os dois URLs exatos do SDK;
- nenhuma migration foi aplicada;
- nenhuma Edge Function foi alterada;
- nenhuma nota, progresso, claim ou código de aluno foi modificado.

## Validação

- regressão cumulativa: 290/290;
- testes específicos da fase: 6;
- loader mantém fonte local primeiro;
- SDK pinado em 2.112.3 nas superfícies críticas;
- Service Worker usa cache-first para o SDK e stale-while-revalidate para shell local;
- `skipWaiting()` + `clients.claim()` garantem troca rápida de versão;
- placeholder local continua explicitamente identificado como não oficial.

## Pendências

1. Incorporar fisicamente o bundle UMD oficial local para eliminar a dependência de CDN também no primeiro acesso.
2. Smoke test físico pós-publicação em Chrome/Android e Safari/iOS.
3. Revalidar estado ao vivo do Supabase quando o conector estiver disponível.
4. Backend do voucher segue aguardando backup restaurável antes da ativação.

## Fechamento quantitativo

- suíte cumulativa: **290/290**;
- testes específicos desta fase: **6/6**;
- JavaScript/MJS: **866/866** sem erro de sintaxe;
- JSON: **461/461** válidos;
- tokens runtime remanescentes da release `.15`: **0**;
- referências runtime ao SDK `2.111.0`: **0**.

Essas verificações cobrem o artefato candidato. Elas não substituem o smoke test físico pós-publicação.

## Integridade do artefato

O fechamento do pacote cobre **3.052 arquivos** no manifesto SHA-256 (sem contar os próprios arquivos gerados de lista/hash), com **3.052/3.052 hashes conferidos**. A varredura de privacidade não encontrou os nomes/repositórios identificáveis usados nos relatórios privados de auditoria GitHub.
