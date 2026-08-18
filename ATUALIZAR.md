# Atualização v14.8.2 → v14.8.3

P8.3 — Sessão única, Lobby geral e atividades por turma.

## Aplicação
Sobrescreva os arquivos deste ZIP na raiz do repositório.
Não há arquivos para remover.

## O que muda
- primeiro acesso pelo Hub preserva a sessão ao encaminhar para criação da senha pessoal;
- Lobby aceita aluno, professor, administrador e super administrador autenticados;
- Lobby e Atividades usam explicitamente a mesma chave de sessão Supabase canônica;
- o aluno continua recebendo somente disciplinas/exercícios da própria turma e conforme liberação;
- `activity-progress` e `student-files` continuam revalidando a turma no backend, portanto URL direta de outra turma não concede acesso.

## Backend
Não requer SQL, migration ou novo deploy de Edge Function nesta versão.
A validação privada do Exercício 04 do 3DS continua uma pendência separada: não liberar o Ex04 até o backend privado estar implantado.
