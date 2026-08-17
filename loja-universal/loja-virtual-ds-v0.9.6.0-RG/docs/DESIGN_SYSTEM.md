# Design System Oficial — Loja Virtual DS v0.3.0

## Princípios

1. **Informação progressiva:** a tela inicial mostra saldo disponível, personagem e acessos principais. Extrato técnico, saldos bloqueados e auditoria aparecem apenas após solicitação.
2. **Consistência entre plataformas:** nomes, estados, raridades, descontos, componentes e comportamento responsivo permanecem iguais.
3. **Cena visual protegida:** interfaces textuais usam DOM; visualização 3D ficará isolada no renderizador.
4. **Desempenho adaptativo:** pacotes da loja, inventário, avatar e animações carregam separadamente.
5. **Acessibilidade:** raridades não dependem somente de cor, modais respondem à tecla Esc e existe modo de redução de movimento.

## Identidade

- Nome da loja: **Loja Virtual DS**.
- Nome da carteira: **Carteira Virtual DS**.
- Moeda: **Moeda DS**, símbolo `DS`.
- Tema: tecnológico educacional escuro, com ciano, violeta, dourado e rosa como acentos.

## Hierarquia

- Título principal: 34–72 px, conforme a tela.
- Títulos de seção: 23–34 px.
- Componentes: 9–15 px.
- Metadados: 7–10 px.

## Componentes oficiais

- topbar;
- sidebar;
- mobile navigation;
- quick card;
- product card;
- promotion banner;
- wallet balance card;
- ledger entry;
- inventory item;
- avatar stage;
- status chip;
- rarity chip;
- validation flow;
- module loader;
- toast;
- modal de produto.

## Estados financeiros

- Disponível;
- Reservado;
- Pendente;
- Em análise;
- Bloqueado;
- Liberado.

## Descontos oficiais

`10%`, `25%`, `38%`, `60%`, `80%`, `99%` e `Grátis`.

## Raridades

Básico, Raro, Épico, Lendário, Mítico e Relíquia. Cada item deve exibir nome textual da raridade além da moldura visual.
