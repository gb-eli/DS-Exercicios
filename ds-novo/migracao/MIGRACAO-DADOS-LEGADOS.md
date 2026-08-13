# Migração de dados legados

## O que pode migrar automaticamente com menor risco

- preferências visuais;
- progresso de exercício;
- evidências/entregas locais;
- histórico de módulos abertos;
- configurações de acessibilidade.

## O que exige política de confiança

- XP local;
- pontos locais;
- moedas/saldo local;
- itens/skins cuja propriedade só existe no navegador.

Como o aluno pode editar armazenamento local, **não creditar automaticamente moedas oficiais lendo `localStorage`**. Para preservar saldo legado, use uma importação administrativa única com origem registrada, arquivo/evidência exportada e trilha de auditoria.

## Estratégia

1. detectar legado;
2. gerar snapshot local com versão/origem;
3. apresentar preview ao usuário/admin quando necessário;
4. enviar para endpoint de migração;
5. backend deduplica por `legacy_fingerprint`;
6. registrar eventos como `migration`;
7. marcar migração concluída;
8. manter legado somente para rollback por período definido.
