# Plano mínimo de testes

## Auth

- login em uma plataforma e sessão reconhecida em outra;
- logout invalida/limpa sessão local do Core;
- conta desativada não executa operação econômica;
- aluno não acessa função administrativa.

## Idempotência

- repetir o mesmo `idempotency_key` não duplica XP;
- duplo clique em confirmar transferência não duplica débito;
- retry de rede após timeout retorna o resultado já confirmado.

## Transferência

- saldo suficiente: sucesso;
- saldo insuficiente: nenhum débito/crédito;
- origem = destino: rejeição;
- destinatário inexistente/inativo: rejeição;
- duas transferências concorrentes não deixam saldo negativo;
- ambos os lançamentos usam mesmo `transfer_id`.

## Loja

- preço alterado entre preview e confirmação: revalidar/avisar;
- item inativo: rejeitar;
- saldo insuficiente: rejeitar sem alterar inventário;
- compra concluída: saldo + ledger + inventário + recibo consistentes.

## Marketplace

- vendedor não é dono: rejeitar;
- listagem duplicada: rejeitar;
- comprar próprio item: rejeitar;
- dois compradores simultâneos: apenas um vence;
- venda concluída transfere propriedade e moedas atomicamente.

## Segurança frontend

- editar `localStorage` não muda saldo oficial;
- chamar função JS de recompensa no console não cria moeda sem aceite do servidor;
- alterar `amount`, `price` ou `owner_id` no payload não contorna revalidação;
- service key não existe no bundle/repositório público.

## Regressão

Para cada plataforma: abrir, login, conteúdo principal, completar uma atividade, salvar progresso, recarregar, modo mobile, PWA/Service Worker quando existir e logout.
