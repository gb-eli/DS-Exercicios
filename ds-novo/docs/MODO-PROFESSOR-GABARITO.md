# Modo Professor — atividade do aluno + gabarito protegido

## Objetivo

O professor deve conseguir abrir a atividade que um aluno está fazendo e comparar, lado a lado:

- progresso/estado real do aluno;
- resposta esperada ou gabarito;
- arquivos de solução preenchidos;
- explicação passo a passo;
- critérios de validação/rubrica;
- erros comuns;
- dicas de intervenção pedagógica.

## Regra de segurança

O gabarito **não pode existir no bundle do aluno** e não pode ser liberado por CSS, atributo `hidden`, DevTools ou `localStorage`.

A fonte protegida é `activity_teacher_content`. A tabela tem RLS e nenhum `SELECT` para `anon` ou `authenticated`.

O acesso acontece somente pela Edge Function `agv-teacher-activity`, com JWT obrigatório. Ela confirma:

1. usuário autenticado;
2. papel `teacher`, `admin` ou `super_admin` em `profiles`;
3. se professor comum, interseção entre `teacher_classes` e `class_memberships` do aluno;
4. plataforma e atividade solicitadas;
5. só então busca o conteúdo privado.

Admin/super_admin têm escopo global. Professor comum fica restrito às turmas atribuídas no servidor.

## Contrato do conteúdo

Cada referência pode conter:

```json
{
  "answerText": "resposta-modelo ou resultado esperado",
  "explanation": "explicação conceitual e passo a passo",
  "solution": {
    "files": {
      "index.html": "...",
      "estilo.css": "...",
      "script.js": "..."
    },
    "fields": {},
    "expectedOutput": {},
    "steps": []
  },
  "rubric": [],
  "interventionTips": []
}
```

## Fontes privadas já disponíveis

Os pacotes Professor existentes devem ser usados como fonte de ingestão, nunca publicados na árvore Aluno:

- 1DS Professor v1.12.0 — código completo, passos, validação e orientação do professor;
- 2DS Professor v0.12.0 — Front-End completo e Inovação;
- 3DS Professor Guiado v0.12.1 — código completo e aula guiada;
- Sub Professor v0.1.45 — Front-End e Mobile com arquivos completos e explicações.

Para atividades abertas (por exemplo Inovação), o “gabarito” deve ser uma **resposta-modelo/rubrica**, não uma única frase obrigatória.

## IDs canônicos propostos para os laboratórios de exercícios

- `exercise:introducao-programacao:01`
- `exercise:analise-metodo-sistemas:01`
- `exercise:programacao-front-end:01`
- `exercise:inovacao-tecnologica-empreendedorismo:01`
- `exercise:programacao-desenvolvimento-sistemas:01`
- `exercise:programacao-front-end-sub:01`
- `exercise:programacao-mobile-sub:01`

O mesmo ID deverá ser usado em `activity_progress` e `activity_teacher_content` quando essas quatro plataformas forem migradas ao Core.

## UX prevista

No Console Professor:

1. selecionar turma;
2. selecionar aluno;
3. ver “atividade atual / recentes / pendentes”;
4. abrir atividade;
5. lado esquerdo: estado do aluno;
6. lado direito: **Gabarito explicado**;
7. alternar entre arquivos da solução;
8. mostrar rubrica e intervenção;
9. opcionalmente abrir acompanhamento ao vivo quando a plataforma oferecer Realtime.

A resposta protegida nunca é enviada ao aluno, mesmo que ele descubra o `activity_id`.
