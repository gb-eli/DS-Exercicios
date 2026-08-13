# Validação do pacote

Data de preparação: 13/08/2026.

## Fontes

- 10 arquivos ZIP recebidos foram extraídos.
- 3.064 arquivos-fonte foram comparados por tamanho + CRC com os arquivos dos ZIPs originais.
- Resultado: **100% preservados**.
- Detalhes: `docs/VERIFICACAO-FONTES.json`.
- SHA-256 dos ZIPs recebidos: `SOURCE_ARCHIVES.sha256`.

## Arquivos adicionados

A preparação adicionou somente documentação/contratos/scaffolding de integração:

- `00-LEIA-PRIMEIRO.md`;
- `01-PROMPT-IMPLEMENTACAO-OUTRO-CHAT.md`;
- `manifesto-plataformas.json`;
- `core/`;
- `docs/`;
- `migracao/`;
- `templates/`;
- `_AGV_CORE/` dentro da pasta externa de cada sistema.

Nenhum arquivo original foi substituído por este processo.

## Validações executadas

- todos os JSONs do pacote foram parseados sem erro;
- SDK/template JavaScript adicionados passaram em `node --check`;
- scan textual básico não encontrou padrões óbvios de `service_role`, chave privada ou segredo Stripe nos fontes analisados;
- fontes originais foram comparadas com os ZIPs de entrada.

## Limite desta entrega

O SQL, SDK e contratos em `core/` são **baseline de implementação**, ainda não foram aplicados no projeto Supabase real. O chat de implementação deve adaptar as migrations ao banco existente, validar contra a documentação/changelog atual, executar advisors e realizar testes concorrentes antes de produção.

## Loja Virtual DS adicionada em 13/08/2026

- Versão: `0.9.6.0-RG`
- Arquivos na origem: **865**
- Arquivos extraídos: **865**
- Divergências SHA-256 por arquivo: **0**
- Papel: Loja Universal oficial do ecossistema; autoridade financeira será migrada para o AGV Education Core.
