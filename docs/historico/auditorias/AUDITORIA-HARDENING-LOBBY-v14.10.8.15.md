# Auditoria e Hardening do Lobby — v14.10.8.15

**Data:** 23/08/2026  
**Base:** v14.10.8.14  
**Fase:** P10.9.14 — Lobby mobile/auth hardening  
**Modo:** correção local; sem migration, sem deploy de Edge Function e sem alteração de notas/dados dos alunos.

## 1. Diagnóstico

A auditoria read-only da v14.10.8.14 encontrou 0 críticos, 3 itens altos, 6 médios e 2 baixos. A v14.10.8.15 trata os pontos operacionais do Lobby sem redesign destrutivo e mantém o Padrão Mestre Anti-AI-Slop como referência de UX/UI.

### Resultado por achado

| ID | Severidade | Achado da auditoria | Estado na .15 |
|---|---|---|---|
| A-01 | ALTO | entrada do Lobby sem cache-bust em todos os caminhos | **Resolvido** |
| A-02 | ALTO | dependência de CDN porque SDK Supabase local era placeholder | **Parcial** — loader local-first mantido; bundle UMD oficial ainda pendente |
| A-03 | ALTO | zoom bloqueado / login vulnerável ao teclado virtual | **Resolvido** |
| M-01 | MÉDIO | consultas pós-login sem timeout uniforme | **Resolvido** via `fetch` com timeout/abort de transporte |
| M-02 | MÉDIO | `Promise.race` não cancelava operação original | **Resolvido no transporte** com `AbortController` |
| M-03 | MÉDIO | erro de backend/rede podia aparecer como senha inválida | **Resolvido** |
| M-04 | MÉDIO | presença multiplayer muito agressiva | **Mitigado** — frequência adaptativa e suspensão em aba oculta |
| M-05 | MÉDIO | `prefers-reduced-motion` incompleto | **Resolvido nas animações críticas auditadas** |
| M-06 | MÉDIO | modais sem gerenciamento completo de foco | **Resolvido** |
| B-01 | BAIXO | excesso ornamental no login do Lobby | **Melhorado**; HUD 3D mantém linguagem própria quando funcional |
| B-02 | BAIXO | alguns alvos touch abaixo do ideal | **Resolvido nos controles críticos auditados** |

## 2. Decisões

- O Lobby continua sendo uma experiência 3D; não foi convertido em interface administrativa genérica.
- O login foi simplificado e tornou-se mais operacional, preservando a identidade escura/tech.
- A correção prioriza carregamento, autenticação, toque, teclado, foco, rede e cache antes de efeitos visuais.
- Nenhuma regra de negócio de atividade, liberação, nota, presença pedagógica ou permissão foi alterada.
- O cache-bust foi sincronizado também nos 22 arquivos executáveis que ainda carregavam dependências `.13`, evitando mistura de módulos de releases diferentes no mesmo aparelho.

## 3. UX

### Login e erros

- `user-scalable=no` removido: o usuário pode ampliar a interface.
- Login usa `100dvh`, rolagem vertical e safe-area, reduzindo conflitos com teclado virtual.
- Inputs em contexto touch usam fonte mínima de 16 px para evitar zoom involuntário de navegador.
- Controles críticos usam alvo mínimo de 44 px.
- Falha de rede não dispara fluxo de primeiro cadastro CGM.
- Mensagens agora distinguem:
  - credencial realmente inválida;
  - conta reconhecida, mas falha de rede/dados;
  - falha genérica de inicialização do Lobby.

### Presença

- Heartbeat: 6 s desktop / 8 s touch.
- Poll da lista: 7 s desktop / 9 s touch.
- Com `document.hidden`, o cliente não consulta a lista até a aba voltar a ser relevante.

## 4. UI

O login perdeu elementos promocionais e ornamentos sem função. Mantidos somente elementos que ajudam a reconhecer o Campus DS e comunicar estado. O restante do HUD 3D não foi “achatado” porque parte dos efeitos possui função espacial/interativa.

## 5. Responsividade

- viewport aceita zoom e reflow;
- shell de login acompanha viewport dinâmica (`100dvh`);
- rolagem vertical é permitida quando teclado reduz a área útil;
- controles principais têm dimensões adequadas para touch;
- as entradas Hub → Lobby, Atividades → Lobby e Professor → Lobby carregam `?v=14.10.8.15`.

## 6. Acessibilidade

- zoom restaurado;
- foco inicial ao abrir modal;
- trap de `Tab` dentro do modal;
- `Escape` fecha modal/camadas compatíveis;
- foco retorna ao elemento de origem ao fechar;
- `prefers-reduced-motion: reduce` remove órbita/loading, viagem de portal e transições críticas auditadas.

## 7. Código e estabilidade

### Timeout de transporte

`lobby/assets/supabase.js` usa `AbortController` em um `fetch` próprio com `NETWORK_TIMEOUT_MS=9000`. Isso encerra a requisição real em rede ruim, em vez de apenas abandonar a Promise na interface.

O Lobby mantém limites adicionais de UX:

- autenticação: 11 s;
- restauração de sessão: 10 s.

### Cache

Todos os arquivos executáveis auditados deixaram de referenciar `?v=14.10.8.13` ou `?v=14.10.8.14`. O runtime e o Lobby usam cache `14.10.8.15` nesta candidata.

## 8. Validação

- Node tests: **284/284 PASS**.
- JS/MJS: **863/863** em `node --check`.
- JSON: **460/460** parseados.
- TypeScript: **52/52** sem diagnóstico no `transpileModule`.
- IDs duplicados: **0** nas cinco entradas principais auditadas.
- Referências runtime antigas `.13/.14`: **0** nos HTML/JS/MJS/CSS executáveis atuais.

## 9. Pendências reais

1. **SDK Supabase local real:** `lobby/vendor/supabase/supabase.js` ainda é um slot de 303 bytes. O loader tenta local primeiro, mas jsDelivr/unpkg continuam necessários enquanto o build UMD oficial pinado não for incorporado.
2. **Teste físico:** validar Chrome/Android e Safari/iOS com teclado virtual, rede móvel/instável, alternância 3D ↔ Modo Leve, suspensão/retorno de aba e modal por teclado.
3. **Presença:** foi mitigada, mas continua baseada em polling; se houver sessões muito maiores, vale migrar para estratégia mais eficiente/realtime.
4. **Produção Supabase:** o conector ficou indisponível na revalidação final de 23/08/2026. Nenhuma escrita foi executada; o snapshot preservado no pacote é histórico e datado de 22/08/2026.
5. **Voucher +1:** backend continua condicionado ao gate de backup restaurável estabelecido anteriormente.

## 10. Conclusão

A v14.10.8.15 resolve os problemas de maior risco da auditoria do Lobby, sobretudo cache misto, zoom/teclado, travamento de rede, erros de autenticação enganadores e acessibilidade dos modais. A candidata não deve ser descrita como totalmente offline enquanto o SDK Supabase local real não estiver vendorizado.
