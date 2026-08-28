# Problemas conhecidos e limitações

1. **EduAuth em desenvolvimento:** as chaves atuais são de teste e não podem ser publicadas para uso real.
2. **Recuperação completa de perfil:** o envelope está preparado, mas a redefinição final depende do futuro EduAuth Professor.
3. **Sem confirmação real do Classroom:** abrir o link e marcar as etapas é uma confirmação manual; não existe API/OAuth nesta versão.
4. **Persistência controlada pelo navegador:** dados locais podem ser apagados por políticas do equipamento, modo privado ou limpeza manual.
5. **CSP com estilos inline:** mantida temporariamente para compatibilidade; scripts continuam restritos a arquivos locais.
6. **Segurança front-end:** integridade local não equivale a uma autoridade externa.
7. **Compatibilidade visual automatizada:** deve ser confirmada em Chrome Android, Brave Android, Chromebook, Edge e equipamentos escolares antes da publicação.

## Planilha funcional v2.4.0

A simulação cobre um subconjunto pedagógico de planilhas. Não importa arquivos XLSX/ODS, não sincroniza com Google Workspace e não oferece colaboração simultânea por servidor.


## Drive e documentos v2.4.1

- o Drive, os links, os comentários e as pessoas são simulações locais;
- não existe colaboração simultânea entre dispositivos;
- a exportação configurada dentro da aula simula o processo e não substitui o comprovante oficial da sessão;
- o editor cobre o subconjunto pedagógico necessário e não pretende reproduzir todos os recursos de um editor comercial;
- a validação visual automatizada por Chromium pode ser bloqueada no ambiente de desenvolvimento, exigindo conferência no GitHub Pages.

## Correio empresarial v2.4.2

- A caixa de e-mail, os arquivos e os links são simulações locais; não há envio real nem sincronização com contas Google.
- A validação pedagógica verifica contexto e procedimentos, mas não realiza análise semântica completa de redação.
- A captura visual automatizada do Chromium headless não concluiu no ambiente de desenvolvimento; conferir a página publicada em celular e notebook.


## Retenção e armazenamento v2.4.3

A plataforma renova o perfil por 10 dias após o último salvamento bem-sucedido. Esse período não impede que o navegador, uma janela privada ou políticas administrativas limpem os dados antes. A detecção de modo privado é heurística. Para registros importantes, exporte o backup `.edu-profile`.
