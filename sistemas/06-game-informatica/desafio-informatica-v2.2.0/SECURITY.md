# Segurança da Plataforma

## Arquitetura

Aplicação estática para GitHub Pages, sem backend. Perfis locais usam IndexedDB, chave aleatória por perfil, PBKDF2-HMAC-SHA-256 e AES-GCM-256. Autorizações de aula e exceções usam a integração estrutural do EduAuth Offline.

## Reforços desta versão

- senha mestre do painel definida na publicação e verificada por PBKDF2-HMAC-SHA-256;
- senha mestre ausente do código e da documentação pública em texto aberto;
- bloqueio progressivo após tentativas incorretas;
- encerramento automático do painel após 12 minutos sem atividade;
- botão de bloqueio imediato e página marcada como `noindex`;

- validação de schema e tamanho antes de importar resultados;
- rejeição de `__proto__`, `constructor` e `prototype`;
- limpeza de nomes, respostas, eventos e identificadores;
- bloqueio de URLs com protocolos não permitidos;
- neutralização de fórmulas perigosas na exportação CSV;
- CSP com scripts locais, sem `unsafe-eval`;
- aceite versionado dentro do perfil criptografado;
- hashes dos termos e regras específicas;
- tokens de integridade contendo o estado resumido do aceite.

## Limitações honestas

Um usuário com controle total do navegador pode alterar o ambiente de execução, remover a tela de login ou inspecionar verificadores. A proteção front-end reduz acesso casual e adulterações simples, detecta inconsistências e evita confiar diretamente em valores importados, mas não substitui um servidor autoritativo ou identidade institucional.

A CSP mantém `style-src 'unsafe-inline'` por compatibilidade com estilos existentes. O EduAuth ainda usa chaves de desenvolvimento e não deve ser utilizado em atividade real antes do provisionamento de produção.

## Comunicação responsável

Não explore uma falha encontrada. Registre módulo, versão, navegador, dispositivo e passos mínimos e comunique o professor. Nunca inclua senhas, dados de colegas ou chaves em relatórios.
