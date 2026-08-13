# Portal unificado e UI compartilhada

## Central AGV

A unificação deve ter um **portal/launchpad central**. Após o login, o aluno vê as plataformas liberadas para sua turma e entra em cada uma sem criar uma nova conta.

A Central exibe, no mínimo:

- identidade/avatar;
- turma;
- nível/XP global;
- pontos;
- saldo de moedas;
- atalhos para Loja, Inventário, Extrato, Transferir e Marketplace;
- cards das plataformas;
- progresso resumido por plataforma;
- conquistas/avisos quando existirem.

## Componentes compartilhados dentro das plataformas

Cada plataforma pode manter seu layout, mas deve reutilizar os mesmos componentes/contratos para informações globais:

1. `AccountChip` — avatar/nome e saída.
2. `WalletChip` — saldo oficial, sempre vindo do Core/cache identificado.
3. `XPChip` — XP global e, opcionalmente, XP da plataforma.
4. `StoreButton` — abre Loja Universal.
5. `InventoryButton` — inventário global.
6. `TransactionHistory` — extrato único.
7. `TransferCoins` — destinatário, valor, preview e confirmação.
8. `Marketplace` — ofertas e inventário vendável.
9. `TransactionConfirmModal` — padrão único para confirmação.
10. `CoreSyncStatus` — online/sincronizando/offline/erro.

## Padrão de confirmação

Antes de confirmar transferência/compra, mostrar de forma explícita:

- operação;
- destinatário/vendedor quando houver;
- item quando houver;
- valor;
- taxa, se houver;
- saldo atual;
- saldo estimado após operação;
- botão Cancelar;
- botão Confirmar.

Após o commit, mostrar `receipt/reference id`, valor e novo saldo. Nunca mostrar “sucesso” antes da resposta oficial do Core.

## Estrutura de deploy recomendada

```text
/
├── portal/
├── admin/
├── shared/agv-core/
└── apps/
    ├── lab-virtual/
    ├── ctf-ds/
    ├── planetario-ds/
    ├── desafio-ds/
    ├── fliperama-ds/
    ├── game-informatica/
    ├── lab-sub/
    ├── lab-ds1/
    ├── lab-ds2/
    └── lab-ds3/
```

Esta é uma estrutura de publicação alvo; o pacote-fonte mantém os repositórios como foram recebidos.


## Console Professor

O alvo de deploy inclui também `/professor/`. A página não contém gabaritos; ela autentica o docente, reutiliza `staff-dashboard` para obter somente alunos/turmas autorizados e chama `agv-teacher-activity` para buscar a referência privada sob demanda.

Layout recomendado: lista de alunos → atividades recentes/pendentes → painel lado a lado com estado do aluno e **Gabarito explicado** (resposta-modelo, arquivos, explicação, rubrica e intervenção).

Se uma plataforma tiver Realtime, o painel poderá combinar esta referência privada com o acompanhamento ao vivo do aluno. O conteúdo protegido nunca é enviado ao canal do aluno.
