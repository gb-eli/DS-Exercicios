# Publicação no GitHub Pages

## Antes de enviar

1. Abra `js/config/platform-config.js`.
2. Confira instituição, curso, disciplina e atividade.
3. Cadastre o link do Classroom somente quando ele for válido.
4. Cadastre links de outras plataformas somente quando estiverem publicados.
5. Execute `npm run check`.
6. Não adicione `.env`, tokens, chaves privadas ou o arquivo de recuperação do professor.

## Envio pelo site do GitHub

1. Crie um repositório.
2. Use **Add file → Upload files**.
3. Envie todos os arquivos e pastas, incluindo `.nojekyll`.
4. Faça o commit.
5. Abra **Settings → Pages**.
6. Escolha **Deploy from a branch**.
7. Escolha `main` e `/ (root)`.
8. Salve.

## Atualizações

Substitua os arquivos alterados, faça novo commit e aguarde o GitHub Pages publicar novamente. O Service Worker usa uma versão de cache própria; atualize `CACHE` em `sw.js` sempre que publicar uma nova versão.

## Teste após publicar

- abrir no celular;
- criar perfil de teste;
- fechar e desbloquear;
- abrir missão e gaveta de ferramentas;
- gerar evidência;
- testar Classroom, se configurado;
- testar instalação como PWA;
- conferir console do navegador;
- excluir o perfil de teste.

## Verificação EduAuth antes da publicação

A versão 2.1.0 pode ser publicada para testes de interface e compatibilidade. As autorizações reais ainda não devem ser usadas enquanto `productionProvisioned` estiver como `false`.

Antes do uso operacional:

1. abra `eduauth-platform-manifest.json`;
2. configure `repository` e `origin`;
3. provisione chaves com o futuro EduAuth Professor;
4. substitua a configuração de teste;
5. execute `npm run check`;
6. confirme que nenhuma chave privada está no repositório;
7. publique uma nova versão para atualizar o cache offline.
