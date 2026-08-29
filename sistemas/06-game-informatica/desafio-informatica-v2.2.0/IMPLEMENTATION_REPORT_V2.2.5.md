# Relatório de implementação — v2.2.5

## Escopo

Revisão de segurança do painel, tempo pedagógico, persistência, retomada, qualidade das questões, tutorial assistido, registros e responsividade.

## Correções críticas

1. O cronômetro da tela final agora incrementa e salva o mesmo `activeSeconds` usado pela validação.
2. A conclusão das etapas cria um checkpoint `awaitingCompletion`; a retomada abre diretamente a validação final.
3. Etapas práticas, questões, fórmulas e demonstrações mantêm checkpoints próprios.
4. Um checkpoint emergencial em `sessionStorage` complementa o perfil criptografado em caso de atualização abrupta.

## Segurança

A senha mestre solicitada foi convertida em verificador PBKDF2-HMAC-SHA-256 com salt aleatório e 360.000 iterações. A dica configurada é “senha admin SEED TI nova.”. A senha em texto aberto não integra o projeto. Como o GitHub Pages é estático, a barreira protege contra acesso casual, mas autenticação institucional forte ainda requer backend ou provedor de identidade.

## Experiência pedagógica

- duração típica: 15–25 minutos;
- mínimo automático: 12min30s;
- tutorial **Não entendi** sem entrega de resposta;
- atividades práticas com estado persistente;
- alternativas equilibradas e auditadas;
- logs detalhados no PDF.

## Compatibilidade

Refinamentos para mouse, teclado e toque, áreas mínimas de 44 px, safe areas de iPhone, tabelas e planilhas roláveis, uma ou duas colunas conforme a largura, modo paisagem e preferência por movimento reduzido.
