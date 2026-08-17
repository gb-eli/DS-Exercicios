# Matriz de migração

## P0 — componente compartilhado de economia

| Componente | Versão | Estado atual | Estado alvo | Raiz canônica | Onda |
|---|---:|---|---|---|---|
| `loja-virtual-ds` | 0.9.6.0-RG | carteira/ledger/inventário locais + SDK/adapters | UI universal consumindo autoridade do AGV Core | `loja-universal/loja-virtual-ds-v0.9.6.0-RG` | P0 |

A loja deve ser integrada **antes de espalhar componentes econômicos novos pelas plataformas**, para evitar duplicação de UX e contratos.

## Plataformas educacionais

| Plataforma | Versão | Auth atual | Economia atual | Progresso atual | Raiz canônica | Onda |
|---|---:|---|---|---|---|---|
| `lab-virtual` | 4.28.0 | EduAuth/local storage | local/partial wallet references | rich local progress + XP | `LABDS` | P1 |
| `ctf-ds` | 3.2.0 | EduAuth | local wallet/ledger | local mission progress + XP | `ctf` | P1 |
| `planetario-ds` | 34.0.0 | local profile | none central | rich local XP/progress/evidence | `universods` | P2 |
| `desafio-ds` | 33.0.0-pilot | EduAuth | XP ledger; coin references only | guided lessons + XP ledger | `desafio 33` | P1 |
| `fliperama-ds` | 0.39.0-hotfix1 | local profile/no central auth | no central wallet | local XP/progress per game | `flipds` | P2 |
| `game-informatica` | 2.5.7 build 20260811r38 | EduAuth/local profile | manifest says wallet not applicable | local progress/XP | `desafio-informatica-v2.2.0` | P1 |
| `lab-sub` | 0.1.42 | encrypted local auth | none | local exercise progress | `versao-aluno` | P3 |
| `lab-ds1` | 1.12.0 | local auth contract | none | local per discipline | `modo-aluno` | P3 |
| `lab-ds2` | 0.7.1 | local auth | none | local per discipline | `modo-aluno` | P3 |
| `lab-ds3` | 0.11.9 | local auth | none | local exercise progress | `modo-aluno` | P3 |

## Ondas

### P1 — plataformas que já possuem EduAuth/ledger/estrutura próxima do Core

LAB Virtual, CTF DS, Desafio DS e Game Informática. A prioridade aqui é criar adaptadores e **substituir autoridade local por autoridade central**.

### P2 — plataformas grandes com muito progresso local

Planetário e Fliperama. A integração deve ser incremental, evitando editar dezenas de módulos individualmente: conecte-se aos pontos centrais de persistência/eventos e faça fan-in para o Core.

### P3 — plataformas de exercícios

LAB Sub, DS1, DS2 e DS3. Substituir autenticação local e ligar eventos de abertura/conclusão/progresso ao SDK central, preservando os exercícios e modos professor/aluno.

## Arquivos candidatos

Consulte `manifesto-plataformas.json` e a pasta `_AGV_CORE/` inserida em cada sistema. Os arquivos listados são pontos iniciais; a implementação deve confirmar o fluxo real antes de editar.
