# Proteção das respostas — CTF DS v3.2.0

## O que mudou

As respostas não ficam mais registradas como strings, índices corretos ou funções `validate` dentro do catálogo público de missões.

Para 62 missões de resposta determinística, o projeto utiliza **verificadores selados por AES-GCM**:

1. a resposta do aluno é normalizada;
2. ela participa da derivação de uma chave específica da missão;
3. a chave tenta abrir um pequeno comprovante criptográfico;
4. somente a resposta aceita abre um comprovante com o identificador correto da missão;
5. o sistema cria um comprovante reduzido vinculado ao perfil do aluno.

Para seis atividades de código com várias soluções possíveis, a plataforma utiliza testes estruturais. Eles verificam propriedades defensivas, sem exigir uma única cópia textual da solução.

## O que não existe mais

- lista pública `fase → resposta`;
- flags dentro de funções de validação;
- índices corretos registrados no objeto da missão;
- sequências corretas diretamente no catálogo;
- campo simples de saldo considerado autoridade;
- recompensas baseadas apenas no valor visual do DOM.

## Artefatos que precisam aparecer no laboratório

Algumas missões ensinam inspeção do DOM. Nessas atividades, a pista precisa existir no elemento quando a missão estiver aberta. Esses valores são materializados somente durante a renderização da missão e não ficam associados ao validador no catálogo público.

## Pacotes dos casos investigativos

Os conteúdos dos vinte casos investigativos não são publicados como uma lista legível de pistas. Os casos são empacotados em `mission-case-packets.js`, ofuscados em pacotes V2, decodificados somente quando o caso específico é solicitado e removidos do cache em memória quando a missão é fechada. Essa camada reduz pesquisas casuais por endereço, porta, trecho de log ou evidência.

Essa proteção é **ofuscação operacional**, não criptografia com segredo de servidor. Como o decodificador também precisa existir no navegador, um usuário avançado ainda pode reconstruir os dados. A validação das respostas continua independente, utilizando os comprovantes AES-GCM e validadores estruturais já existentes.

## Eventos de segurança

A plataforma pode registrar localmente:

- conclusão de várias fases em poucos segundos sem interação observada;
- divergência entre moedas/XP visuais e o extrato;
- cadeia de transações alterada;
- item inserido sem transação correspondente;
- backup incompatível ou corrompido.

Esses eventos **não causam banimento automático**. Eles bloqueiam somente as operações que dependem do estado inconsistente e solicitam conferência humana.

## Limitação da arquitetura

O projeto funciona integralmente no GitHub Pages. Um usuário com controle completo do navegador pode estudar o JavaScript, observar a execução e testar hipóteses localmente. Portanto, esta arquitetura:

- impede descoberta casual por busca de texto;
- dificulta a criação de uma lista de respostas;
- detecta alterações simples de progresso e carteira;
- melhora a rastreabilidade da evidência;
- não oferece o mesmo nível de autoridade de uma validação em servidor.

Para avaliações de alta importância, recomenda-se futuramente validar as capturas em um backend institucional ou por autorizações assinadas específicas.
