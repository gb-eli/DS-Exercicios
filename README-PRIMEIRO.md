# AGV DS — Hotfix operacional para a aula de 03/09/2026

Escopo deste pacote:

1. Corrigir a tela vazia de **Retomada & Recuperação** (aluno e professor).
2. Manter habilitado o catálogo **Programação no Desenvolvimento de Sistemas — 3DS**.
3. Ajustar o painel do Modo Prova Prática para a aula de **35 minutos**:
   - 5 min de pré-lobby;
   - 30 min de operação;
   - encerramento manual pelo professor.
4. Garantir que `prova/` entre no manifesto de frontend público.
5. Preservar banco, gabaritos, regras de nota, RLS e autenticação.

## Diagnóstico confirmado

A tela de Recuperação atual possui `login-view` e `app-view` inicialmente ocultos.
Nos JavaScripts `recuperacao/assets/student.js` e `recuperacao/assets/admin.js`
existe um bind obrigatório para `#login-form`, porém os HTML atuais usam apenas
um link para o login oficial e não possuem esse formulário.

Resultado: ocorre erro JavaScript antes da restauração da sessão e a página pode
permanecer completamente vazia.

O hotfix troca o bind por optional chaining:

    $('login-form')?.addEventListener('submit',login);

Também renova o cache-bust dos HTMLs e remove o título antigo
"Recuperações 2DS Sub" da tela docente.

## Modo Prova Prática — configuração para hoje

### DS1
- Disciplina: **Análise e Método para Sistemas**
- Template: `analysis_methods_1ds`
- Pré-lobby: **5 min**
- Operação: **30 min**
- Equipes normais: **3 a 7**
- Fluxo: escolher empresa → entrar na equipe → votação de líder → escolher cargo → professor inicia → desafios.

### DS2
- Disciplina: **Inovação Tecnológica e Empreendedorismo**
- Template: `innovation_2ds`
- Pré-lobby: **5 min**
- Operação: **30 min**
- Mesmo fluxo de empresas, liderança e cargos.

O cronômetro da Prova Prática é informativo. A avaliação é encerrada manualmente
pelo professor.

## 3DS — Retomada e Recuperação

O catálogo já contém `programacao_ds3` com conteúdo de:
- variáveis e tipos em Python;
- funções;
- `if / elif / else`;
- `while`;
- HTML semântico;
- CSS;
- JavaScript;
- missão integrada.

O hotfix não troca o conteúdo pedagógico; corrige o boot da tela para que esse
conteúdo realmente seja exibido.

## Como aplicar

Na pasta raiz do repositório `DS-Exercicios`:

Windows:
    py APLICAR-HOTFIX.py "C:\caminho\DS-Exercicios"

Linux/macOS:
    python3 APLICAR-HOTFIX.py /caminho/DS-Exercicios

Depois valide:

Windows:
    py VALIDAR-HOTFIX.py "C:\caminho\DS-Exercicios"

Linux/macOS:
    python3 VALIDAR-HOTFIX.py /caminho/DS-Exercicios

## Publicação

Este pacote altera apenas arquivos locais do checkout. Após PASS na validação,
faça o processo normal de commit/deploy do projeto.

IMPORTANTE: a integração usada para preparar este hotfix não conseguiu escrever
diretamente no GitHub (HTTP 403) e não possui acesso ao projeto Supabase
`iresvqwyaqotghjssncg`. Portanto, este pacote não afirma que produção já foi
alterada.

Para o Modo Prova Prática, confirme que a migration/RPC e a Edge Function
`practical-exam` da F94.4 HF4 já estão publicadas antes da aula. Não publique
apenas o frontend se o backend HF4 ainda não estiver em produção.
