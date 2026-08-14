# Relatório de implementação — v2.4.3

## Escopo aprovado

Fase de confiabilidade e preservação dos dados, com retenção local de 10 dias.

## Implementações

- retenção renovada por 10 dias após cada salvamento;
- migração dos metadados antigos de seis para dez dias;
- indicador global `Salvando…`, `Salvo às HH:MM:SS`, aviso e falha;
- botão **Verificar meu progresso** com releitura do registro criptografado;
- diagnóstico de IndexedDB, persistência, quota, uso estimado e possível modo privado;
- checkpoint redundante criptografado no armazenamento local;
- nova tentativa automática de conexão com o IndexedDB;
- restauração dos registros redundantes ao reconectar;
- backup destacado na Central de Contas;
- exclusão com senha, caixa de confirmação e alerta de irreversibilidade;
- falhas de salvamento registradas na cadeia de auditoria;
- interface responsiva para celular e notebook.

## Limitações

A retenção de 10 dias é uma política da plataforma, mas o navegador ou a administração do equipamento pode limpar os dados antes. O backup `.edu-profile` continua sendo a proteção recomendada para registros importantes. A detecção de modo privado é heurística e é apresentada como possibilidade, não como certeza.
