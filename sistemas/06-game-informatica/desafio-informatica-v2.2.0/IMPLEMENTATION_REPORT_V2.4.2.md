# Relatório de implementação — v2.4.2

## Escopo

Reconstrução do correio empresarial simulado e integração do mesmo motor às aulas, avaliações e recuperações do 1º e 2º ADM.

## Entregas principais

- caixa de entrada com mensagens lidas e não lidas;
- tópicos, pesquisa, estrela, pastas, Enviados, Rascunhos e spam simulado;
- leitura obrigatória da solicitação principal;
- Responder, Responder a todos, Encaminhar, CC e CCO;
- rascunho salvo automaticamente no checkpoint;
- seletor de arquivos com Recentes, Downloads e documentos incorretos para conferência;
- inserção de arquivo pelo Drive com controle de acesso;
- validação de destinatários, CC, assunto, corpo, anexo e permissão;
- alertas de arquivo ausente, versão errada, link restrito, assunto insuficiente e estrutura inadequada;
- pasta Enviados e registro da comunicação na linha do tempo;
- uso do motor completo dentro das quatro operações empresariais de avaliação e recuperação.

## Persistência

O checkpoint do estudante mantém:

- pasta atual;
- pesquisa;
- tópico aberto;
- estado lido/não lido;
- estrelas;
- modo de composição;
- campos Para, CC e CCO;
- assunto e corpo;
- anexos;
- links do Drive e acesso do destinatário;
- rascunho e horário do último salvamento;
- mensagens enviadas;
- histórico de ações.

## Compatibilidade curricular

- Aulas 1 e 2 do 1º ADM permanecem preservadas;
- Aula 5 do 1º ADM usa a revisão `2026T2-mail-v242`;
- avaliações e recuperação do 1º ADM usam `2026T2-admin-v242`;
- Aula 3 do 2º ADM usa `2026T2-admin2-mail-v242`;
- avaliação e recuperação do 2º ADM usam `2026T2-admin2-v242`;
- checkpoints incompatíveis de ferramentas anteriores não são aplicados ao novo fluxo.

## Segurança e privacidade

- nenhuma mensagem é enviada para a internet;
- todos os endereços, arquivos e links são fictícios;
- não há integração com Gmail ou Google Drive real;
- entrada textual é escapada antes da renderização;
- não foram usados `eval` ou `new Function`;
- mensagens suspeitas ensinam a não compartilhar senhas ou códigos temporários.

## Responsividade

O correio possui três disposições:

- desktop/notebook: barra superior, navegação lateral, lista, tópico e composição flutuante;
- tablet: navegação compactada e composição dimensionada;
- celular/iPhone/Android: pastas em faixa horizontal, tópico em uma coluna, composição e seletor de arquivos em tela cheia e suporte às safe areas.

## Testes

A suíte completa validou:

- 13 aulas;
- 38 arquivos JavaScript;
- segurança, termos e contas;
- cronômetro e retomada;
- PDFs;
- 19 testes EduAuth;
- 6 testes dos geradores;
- qualidade das questões;
- planilha funcional;
- Drive e documentos;
- correio empresarial;
- integração das quatro operações empresariais.

O teste específico do correio valida criação e normalização do estado, mensagem principal, spam simulado, destinatários, CC, assunto, corpo, anexo, link restrito e retomada do rascunho.

## Publicação

Versão: `2.4.2`

Build: `20260803r23`

Cache: `desafio-informatica-agv-2.4.2-r23`

O arquivo `sw.js` deve ser publicado por último.

## Limitação de validação visual

O Chromium headless disponível no ambiente não concluiu a captura automatizada da página local. A estrutura CSS responsiva e a lógica foram validadas; recomenda-se conferir a publicação em um notebook e um celular após o envio ao GitHub Pages.
