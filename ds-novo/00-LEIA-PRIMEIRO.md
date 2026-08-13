# AGV ECOSSISTEMA UNIFICADO — PACOTE MESTRE DE IMPLEMENTAÇÃO

Este ZIP contém **as 10 plataformas educacionais originais recebidas + a Loja Virtual DS v0.9.6.0-RG**, organizadas sem apagar suas estruturas internas, e uma especificação padronizada para migrá-las para um núcleo comum chamado **AGV Education Core**.

## Objetivo definitivo

Cada plataforma continua com sua própria interface, conteúdo, exercícios, jogos, laboratórios, modo professor e mecânicas. O que passa a ser compartilhado por todas é:

- autenticação única (mesmo login e senha);
- perfil único;
- sessão única/reutilizável entre plataformas;
- registro central de progresso;
- XP global e XP por plataforma;
- pontos globais e por plataforma;
- uma única moeda digital;
- carteira e extrato únicos;
- **Loja Virtual DS v0.9.6.0-RG como Loja Universal oficial**;
- inventário global de skins/itens;
- marketplace de skins entre alunos;
- transferência de moedas entre alunos;
- painel administrativo consolidado;
- auditoria central de ações e transações.

## Regra de ouro

**A plataforma nunca é a autoridade do saldo.** JavaScript do navegador, `localStorage`, IndexedDB, variáveis de jogo e placares locais podem auxiliar UX/offline, mas não podem criar, apagar ou transferir moeda oficial.

Toda alteração econômica oficial deve passar pelo Core e ser validada no servidor.

## Comece por aqui

1. Leia `01-PROMPT-IMPLEMENTACAO-OUTRO-CHAT.md`.
2. Leia `docs/ARQUITETURA-CORE.md`.
3. Leia `docs/LOJA-VIRTUAL-DS-OFICIAL.md`.
4. Leia `docs/SEGURANCA-E-ANTI-FRAUDE.md`.
5. Consulte `docs/MATRIZ-DE-MIGRACAO.md` para saber onde integrar cada plataforma.
6. Use `manifesto-plataformas.json` para identificar a árvore canônica de cada sistema e o serviço compartilhado de loja.
7. Centralize primeiro Auth/economia no Core e conecte a Loja Virtual; depois migre as plataformas uma a uma.

## Pastas

- `loja-universal/` — Loja Virtual DS v0.9.6.0-RG preservada e metadados de integração.
- `sistemas/` — código recebido, organizado por plataforma.
- `core/` — contrato, SQL de referência, SDK e modelos de Edge Functions.
- `docs/` — arquitetura, regras, segurança, matriz e testes.
- `migracao/` — estratégia de migração de dados legados.
- `templates/` — arquivos padrão para novas plataformas.

## Loja Universal canônica

| Componente | Versão | Raiz | Papel |
|---|---:|---|---|
| Loja Virtual DS | 0.9.6.0-RG | `loja-universal/loja-virtual-ds-v0.9.6.0-RG` | Loja/carteira/extrato/inventário/avatar/marketplace compartilhados |

**Importante:** preservar a experiência visual e os assets da loja, mas substituir a autoridade financeira local de `src/core/foundation.js` pelo AGV Education Core. O cliente não decide o valor oficial de recompensas.

## Versões canônicas identificadas

| ID | Versão canônica | Raiz a implementar |
|---|---:|---|
| lab-virtual | 4.28.0 | `sistemas/01-lab-virtual/LABDS` |
| ctf-ds | 3.2.0 | `sistemas/02-ctf-ds/ctf` |
| planetario-ds | 34.0.0 | `sistemas/03-planetario-ds/universods` |
| desafio-ds | 33.0.0-pilot | `sistemas/04-desafio-ds/desafio 33` |
| fliperama-ds | 0.39.0-hotfix1 | `sistemas/05-fliperama-ds/flipds` |
| game-informatica | 2.5.7 / build 20260811r38 | `sistemas/06-game-informatica/desafio-informatica-v2.2.0` |
| lab-sub | 0.1.42 | `sistemas/07-lab-exercicios-sub/versao-aluno` |
| lab-ds1 | 1.12.0 | `sistemas/08-lab-exercicios-ds1/modo-aluno` |
| lab-ds2 | 0.7.1 | `sistemas/09-lab-exercicios-ds2/modo-aluno` |
| lab-ds3 | 0.11.9 | `sistemas/10-lab-exercicios-ds3/modo-aluno` |

Pastas históricas existentes dentro de alguns repositórios foram mantidas para não perder versões anteriores, mas **não devem ser usadas como base principal** quando uma árvore canônica acima estiver indicada.
