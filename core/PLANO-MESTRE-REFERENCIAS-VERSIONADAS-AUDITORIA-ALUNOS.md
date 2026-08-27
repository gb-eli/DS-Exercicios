# PLANO DE CORREÇÃO E EVOLUÇÃO — CENTRAL DE EXERCÍCIOS DS


> **Atualização v2 — 22/08/2026:** incluída fase de auditoria e migração das entregas históricas realizadas por repositórios GitHub, preservando commit, origem da entrega, correção por exercício e baixa controlada no portal.

**Documento de continuidade para a conversa principal do sistema**  
**Base atual analisada:** `DS-Exercicios-v14.10.8-AUDITADO.zip`  
**Objetivo central:** impedir que mudanças de código de referência prejudiquem alunos que já começaram atividades e permitir que o sistema reconheça, valide e acompanhe múltiplas versões legítimas do mesmo exercício.

---

# 1. CONTEXTO DO PROBLEMA

A Central de Exercícios passou por várias atualizações de código de referência. Como consequência, existem alunos que começaram a atividade usando uma versão anterior e outros que começaram usando uma versão mais recente.

Além disso, foram publicados aos alunos:

- PNGs com código de referência;
- a Central de Exercícios/site;
- referências armazenadas no Supabase;
- referências locais dentro do ZIP utilizadas como contingência/fallback.

Foi identificado que essas fontes nem sempre são idênticas.

Isso gerou situações como:

- código do PNG diferente do código exibido no site;
- código do site maior ou menor que o código da imagem;
- aluno começar uma atividade com uma referência e continuar depois com outra;
- autocorreção considerar errado um código que, na prática, está correto;
- HTML, CSS e JavaScript pertencentes a versões diferentes;
- código correto funcionalmente, mas diferente textualmente da referência;
- necessidade de preservar trabalhos já iniciados.

A regra daqui para frente deve ser:

> **Nenhum aluno será prejudicado por ter seguido uma versão de referência que foi oficialmente disponibilizada pela escola/sistema.**

---

# 2. PRINCÍPIO DE COMPATIBILIDADE

Não apagar ou invalidar versões anteriores já publicadas.

Cada exercício poderá possuir várias versões oficiais de referência, por exemplo:

- **Versão PNG publicado**
- **Versão Site v14.10.8**
- **Versão atual do Supabase**
- **Versões históricas futuras**

O sistema deverá reconhecer automaticamente qual versão o aluno está utilizando.

Também deve ser possível aceitar uma:

- **solução própria válida**

Ou seja, o aluno não precisa obrigatoriamente reproduzir exatamente o código de referência se a solução estiver correta, funcional e atender aos requisitos da atividade.

---

# 3. NOVO MODELO DE REFERÊNCIAS VERSIONADAS

## 3.1. Criar histórico permanente de referências

Cada exercício deverá possuir um histórico de versões.

Exemplo:

```text
Exercício 08
├── ref_png_2026-08
├── ref_site_v14.10.8
├── ref_supabase_v0.12.2
└── ref_atual
```

Nunca sobrescrever silenciosamente uma referência antiga que já tenha sido usada por alunos.

---

## 3.2. Banco de dados

Criar uma estrutura equivalente a:

### `exercise_reference_versions`

Campos sugeridos:

```text
id
exercise_id
version_key
version_name
source_type
source_label
created_at
published_at
active
is_current
is_accepted
notes
checksum
```

Exemplo de `source_type`:

```text
png
site_zip
supabase
historical
manual
```

---

### `exercise_reference_version_files`

Campos:

```text
id
reference_version_id
filename
language
content
md5
sha256
created_at
```

Cada versão pode possuir:

```text
index.html
estilo.css
script.js
main.py
MainActivity.kt
strings.xml
etc.
```

---

# 4. VERSÕES QUE DEVEM SER PRESERVADAS AGORA

Para os exercícios que já apresentaram divergência, registrar pelo menos:

## Versão A — PNG publicado

Código exatamente igual ao usado para gerar os PNGs já enviados aos alunos.

---

## Versão B — Site / ZIP v14.10.8

Código que estava disponível localmente no projeto/site.

---

## Versão C — Referência atual

Código atualmente considerado referência mais recente no Supabase.

---

# 5. IDENTIFICAÇÃO AUTOMÁTICA DA VERSÃO DO ALUNO

Ao abrir uma atividade já iniciada, o sistema deve analisar os arquivos salvos do aluno.

Comparar o trabalho com todas as versões aceitas.

Exemplo:

```text
Código do aluno
        ↓
Comparação com versão PNG
Comparação com versão Site
Comparação com versão Atual
        ↓
Pontuação de similaridade
        ↓
Identificação da versão mais próxima
```

Resultado:

```text
Versão detectada:
Site v14.10.8 — 94% compatível
```

ou:

```text
Versão detectada:
PNG publicado — 97% compatível
```

ou:

```text
Solução própria válida
```

---

# 6. SELETOR DE VERSÃO NA INTERFACE

Adicionar na área da referência:

```text
Versão da referência:

[ Automática ▼ ]

• Automática
• PNG publicado
• Site v14.10.8
• Versão atual
```

## Modo Automático

Se o aluno já possuir código salvo:

- detectar a versão mais próxima;
- abrir essa referência automaticamente.

Se a atividade estiver vazia:

- usar a versão atual como padrão.

O aluno poderá trocar manualmente para outra versão aceita.

---

# 7. REGISTRAR A VERSÃO UTILIZADA PELO ALUNO

Salvar no progresso do aluno:

```text
reference_version_id
reference_detection_score
reference_detection_method
reference_selected_manually
```

Exemplo:

```text
reference_version = site_v14_10_8
reference_detection_score = 0.94
```

Assim o professor poderá saber posteriormente qual código o aluno estava seguindo.

---

# 8. AUDITORIA COMPLETA DOS CÓDIGOS JÁ SALVOS

Será feita uma auditoria:

```text
TURMA
   ↓
ALUNO
   ↓
ATIVIDADE
   ↓
ARQUIVO
```

Analisar tudo que já foi salvo em:

- `student_files`;
- status da atividade;
- tentativas;
- pontuação automática;
- envio;
- feedback existente.

---

# 9. ANÁLISE ALUNO POR ALUNO

Para cada aluno:

## 9.1. Localizar atividades iniciadas

Classificar como:

```text
Não iniciada
Iniciada
Em andamento
Concluída
Enviada
Bloqueada
```

---

## 9.2. Recuperar todos os arquivos salvos

Exemplo:

```text
Atividade 12

index.html
estilo.css
script.js
```

ou:

```text
main.py
```

---

## 9.3. Identificar versão utilizada

Resultado possível:

```text
PNG publicado
Site v14.10.8
Referência atual
Mistura de versões
Solução própria
Indeterminado
```

---

# 10. NOVA CLASSIFICAÇÃO DAS SOLUÇÕES DOS ALUNOS

Cada atividade deverá receber uma classificação mais inteligente.

## ✅ Correto — versão PNG

Aluno seguiu a versão da imagem publicada.

---

## ✅ Correto — versão Site

Aluno seguiu o código que estava na Central.

---

## ✅ Correto — versão atual

Aluno seguiu a referência atual.

---

## ✅ Correto — solução própria válida

Código diferente da referência, mas funcional.

---

## ⚠️ Funciona com pequenos ajustes

Não possui erro crítico.

Pode haver:

- nome de variável diferente;
- pequena inconsistência;
- elemento desnecessário;
- estilo incompleto;
- acessibilidade;
- organização.

---

## 🧩 Mistura de versões

Exemplo:

```text
HTML = versão PNG
CSS = versão atual
JS = versão site
```

Isso **não significa automaticamente erro**.

O sistema deve testar se os arquivos continuam funcionando juntos.

---

## ❌ Erro funcional

Exemplos:

- JavaScript procura ID inexistente;
- CSS aponta para classe que não existe;
- `script.js` não está conectado ao HTML;
- HTML aponta para arquivo CSS inexistente;
- erro de sintaxe;
- função chamada não existe;
- variável não definida;
- importação incorreta;
- código Python não executa;
- componente Android inexistente.

---

## 🚧 Incompleto

Parte significativa da atividade ainda não foi feita.

---

# 11. VALIDAÇÃO INTELIGENTE — NÃO USAR APENAS IGUALDADE TEXTUAL

O sistema não deve avaliar apenas:

```text
código aluno == código referência
```

Deve avaliar:

```text
estrutura
+
funcionalidade
+
requisitos
+
integração dos arquivos
+
sintaxe
+
comportamento
```

---

# 12. FLEXIBILIDADE DE CÓDIGO

Aceitar diferenças legítimas.

Exemplos:

```javascript
const nome = ...
```

e:

```javascript
let nome = ...
```

podem ser válidos dependendo do exercício.

Também aceitar:

- nomes diferentes de variável;
- comentários adicionais;
- espaços;
- linhas em branco;
- indentação;
- ordem diferente quando não altera comportamento;
- funções equivalentes;
- soluções alternativas corretas.

---

# 13. VALIDAÇÃO HTML

Verificar:

- `<!DOCTYPE html>`;
- estrutura válida;
- tags abertas/fechadas;
- IDs duplicados;
- atributos;
- acessibilidade quando exigida;
- labels;
- `for`;
- elementos necessários;
- arquivos externos.

---

# 14. VALIDAÇÃO CSS

Verificar:

- sintaxe;
- seletores;
- classes utilizadas;
- IDs utilizados;
- propriedades inválidas;
- seletores inexistentes;
- CSS fantasma;
- responsividade;
- regras duplicadas.

---

# 15. VALIDAÇÃO JAVASCRIPT

Verificar:

- sintaxe;
- variáveis;
- funções;
- IDs utilizados;
- eventos;
- seletores;
- elementos inexistentes;
- erros de execução;
- `null`;
- manipulação do DOM;
- fluxo lógico.

---

# 16. VALIDAÇÃO DA CONEXÃO HTML + CSS

Verificar:

```html
<link rel="stylesheet" href="estilo.css">
```

e confirmar que:

```text
estilo.css existe
```

Também verificar se classes/IDs usados no CSS existem no HTML.

---

# 17. VALIDAÇÃO DA CONEXÃO HTML + JAVASCRIPT

Verificar:

```html
<script src="script.js"></script>
```

ou:

```html
<script src="script.js" defer></script>
```

Confirmar:

```text
script.js existe
```

Depois cruzar seletores:

```javascript
document.querySelector("#resultado")
```

com:

```html
<div id="resultado"></div>
```

---

# 18. VALIDAÇÃO CRUZADA HTML + CSS + JS

Criar um **analisador de projeto**.

Exemplo:

```text
index.html
   ↓
IDs encontrados
Classes encontradas
Arquivos importados

estilo.css
   ↓
IDs usados
Classes usadas

script.js
   ↓
IDs procurados
Classes procuradas
Eventos

        ↓

RELATÓRIO DE CONSISTÊNCIA
```

---

# 19. DETECTAR ID QUEBRADO

Exemplo:

HTML:

```html
<p id="mensagem"></p>
```

JavaScript:

```javascript
document.querySelector("#resultado")
```

Resultado:

```text
ERRO CRÍTICO

JavaScript procura:
#resultado

HTML possui:
#mensagem
```

---

# 20. DETECTAR CLASSE QUEBRADA

CSS:

```css
.card {
}
```

HTML não possui:

```html
class="card"
```

Classificar como:

```text
CSS não utilizado
```

Não necessariamente erro crítico, mas indicar possível código fantasma.

---

# 21. DETECTAR ARQUIVOS FALTANDO

Exemplo:

HTML:

```html
<script src="app.js"></script>
```

mas aluno salvou:

```text
script.js
```

Resultado:

```text
ERRO CRÍTICO
Arquivo app.js não encontrado.
```

---

# 22. PYTHON

Para atividades Python:

- validar sintaxe;
- executar em ambiente controlado quando possível;
- detectar `input`;
- detectar exceções;
- analisar saída;
- verificar requisitos da atividade.

Não penalizar apenas por nomes de variáveis diferentes.

---

# 23. MOBILE / KOTLIN / ANDROID

Nas atividades Mobile validar:

```text
MainActivity.kt
strings.xml
Android imports
IDs / recursos
```

Quando houver dependência externa:

- informar biblioteca;
- versão;
- onde adicionar;
- comando ou configuração.

Exemplo:

```text
Arquivo:
build.gradle.kts

Adicionar:
implementation(...)
```

---

# 24. INSTRUÇÕES DE EXECUÇÃO EM CADA ATIVIDADE

Adicionar uma seção:

## Como executar

### Python

```bash
python main.py
```

ou:

```bash
python3 main.py
```

---

### HTML/CSS/JS

```text
Abra index.html no navegador
```

ou usar:

```text
VS Code + Live Server
```

---

### Mobile

```text
Android Studio
↓
Abrir projeto
↓
Executar em emulador ou dispositivo
```

---

# 25. DEPENDÊNCIAS

Cada atividade deverá possuir:

```text
Dependências:
Nenhuma
```

ou:

```text
Dependências:
- biblioteca X
- biblioteca Y
```

Com instrução de instalação.

---

# 26. NOVA TELA DO PROFESSOR — AUDITORIA DE CÓDIGO

Criar painel:

```text
Professor
→ Auditoria de códigos
```

Filtros:

```text
Turma
Aluno
Disciplina
Atividade
Status
Versão
Tipo de erro
```

---

# 27. VISÃO POR ALUNO

Exemplo:

```text
JOÃO SILVA

Atividade 01
✅ Correto
Versão PNG

Atividade 02
⚠ Pequenos ajustes
Versão Site

Atividade 03
❌ Erro crítico
Mistura de versões
```

---

# 28. VISÃO DETALHADA DA ATIVIDADE

Mostrar:

```text
Código do aluno

VS

PNG publicado

VS

Site v14.10.8

VS

Referência atual
```

Com diff linha por linha.

---

# 29. INDICADORES DE SIMILARIDADE

Exemplo:

```text
PNG publicado       91%
Site v14.10.8       97%
Referência atual    74%
```

Resultado:

```text
Versão provável:
Site v14.10.8
```

---

# 30. NÃO DEPENDER SOMENTE DA SIMILARIDADE

Depois de identificar a versão provável:

```text
executar validação funcional
```

Porque um código pode ser:

```text
40% parecido
```

mas totalmente correto.

---

# 31. FEEDBACK AUTOMÁTICO SUGERIDO

Após análise:

```text
Seu código está funcionando corretamente.

Foram encontrados apenas alguns pontos que podem ser melhorados:

• remover CSS não utilizado;
• adicionar type="button";
• melhorar nome da variável.
```

---

# 32. FEEDBACK DE ERRO CRÍTICO

Exemplo:

```text
Foi encontrado um problema que impede o funcionamento da atividade.

O JavaScript procura o elemento:

#resultado

Porém o HTML possui:

#mensagem

Ajuste os nomes para que sejam iguais.
```

---

# 33. NOTIFICAÇÃO AO ALUNO NO PRÓXIMO LOGIN

Aproveitar o mecanismo de feedback já existente no sistema.

Quando houver observação:

```text
Feedback do professor
```

Quando for necessário corrigir:

```text
Ajustes solicitados
```

---

# 34. NÃO NOTIFICAR DESNECESSARIAMENTE

Se o código:

- funciona;
- atende ao exercício;
- apenas usa uma versão diferente;

não enviar alerta negativo.

Pode registrar apenas:

```text
Código validado — versão histórica aceita.
```

---

# 35. NÍVEIS DE GRAVIDADE

## Nível 0

```text
Sem problemas
```

---

## Nível 1

```text
Melhoria opcional
```

---

## Nível 2

```text
Pequeno ajuste recomendado
```

---

## Nível 3

```text
Problema funcional
```

---

## Nível 4

```text
Erro crítico
```

---

# 36. NÃO ALTERAR AUTOMATICAMENTE O CÓDIGO DO ALUNO

A auditoria deve:

```text
analisar
→ explicar
→ sugerir
```

Nunca sobrescrever silenciosamente o arquivo salvo do estudante.

---

# 37. PRESERVAÇÃO DE HISTÓRICO

Toda alteração de aluno deve gerar histórico:

```text
revision
saved_at
content_hash
```

Nunca perder versão anterior.

---

# 38. SNAPSHOTS DO CÓDIGO

Criar snapshots periódicos.

Exemplo:

```text
student_file_versions
```

Campos:

```text
student_file_id
revision
content
hash
created_at
```

---

# 39. DETECTAR ALUNO QUE COMEÇOU COM VERSÃO ANTIGA

Quando abrir a atividade:

```text
Código salvo detectado.
```

Sistema compara com versões históricas.

Exemplo:

```text
Seu código corresponde à referência usada anteriormente.

Você poderá continuar normalmente.
```

---

# 40. AVISO DE MUDANÇA DE REFERÊNCIA

Quando houver nova versão:

```text
A referência desta atividade foi atualizada.

Seu trabalho continuará usando a versão anterior para evitar divergências.
```

Botões:

```text
Continuar versão anterior
Ver versão atual
```

---

# 41. NÃO TROCAR REFERÊNCIA AUTOMATICAMENTE DURANTE A ATIVIDADE

Depois que o aluno começa uma versão:

```text
fixar reference_version_id
```

até ele solicitar alteração ou professor mudar conscientemente.

---

# 42. MIGRAÇÃO DOS ALUNOS ATUAIS

Para alunos que já possuem código:

1. recuperar arquivos;
2. calcular similaridade com todas as versões;
3. identificar versão provável;
4. registrar;
5. validar funcionalidade;
6. gerar relatório;
7. não alterar arquivo.

---

# 43. CASO AMBÍGUO

Se:

```text
PNG = 82%
Site = 83%
```

não escolher automaticamente.

Status:

```text
Versão indeterminada / solução mista
```

Realizar validação funcional.

---

# 44. CASO DE MISTURA DE VERSÕES

Exemplo:

```text
HTML → PNG
CSS → Site
JS → Atual
```

Analisar se:

```text
todos conversam
```

Se funcionarem:

```text
✅ Solução compatível
```

---

# 45. GERAR RELATÓRIO DE AUDITORIA POR TURMA

Exemplo:

```text
2DS

Alunos analisados: 32
Atividades analisadas: 418

Corretas: 301
Pequenos ajustes: 72
Erros funcionais: 31
Erros críticos: 14
```

---

# 46. RELATÓRIO POR ALUNO

Gerar:

```text
Aluno
Turma
Atividade
Arquivos
Versão detectada
Similaridade
Status funcional
Erros
Feedback sugerido
```

---

# 47. RELATÓRIO POR ATIVIDADE

Permitir descobrir:

```text
qual atividade está gerando mais erros
```

Exemplo:

```text
Atividade 09
62% dos alunos com erro no ID #resultado
```

Isso pode indicar problema da própria referência.

---

# 48. DETECTAR BUG DA REFERÊNCIA

Se muitos alunos apresentarem o mesmo problema:

```text
analisar se o problema veio da própria referência
```

Marcar:

```text
Possível erro da atividade
```

---

# 49. COMPARAÇÃO ENTRE REFERÊNCIAS

Criar ferramenta administrativa:

```text
Comparar versões
```

Exemplo:

```text
PNG
VS
Site
VS
Atual
```

Mostrar diff.

---

# 50. CHECKSUMS

Cada arquivo de referência deverá possuir:

```text
MD5
SHA-256
```

Isso permite comprovar que:

```text
PNG = versão X
```

---

# 51. PNGS DE REFERÊNCIA

Os PNGs deverão ser gerados diretamente da versão registrada.

Nunca reconstruir código manualmente.

Fluxo:

```text
Banco
↓
arquivo da referência
↓
hash
↓
render PNG
↓
hash registrado
```

---

# 52. CABEÇALHO DOS PNGS

Mostrar:

```text
Turma
Atividade
Arquivo
Versão da referência
```

Exemplo:

```text
2DS • Atividade 08 • script.js
Referência: Site v14.10.8
```

---

# 53. PADRÃO VISUAL DOS PNGS

Manter:

- tema escuro;
- estilo VS Code/Snap Code;
- fonte monoespaçada;
- números de linha;
- syntax highlighting;
- alto contraste;
- largura baseada na maior linha;
- sem corte horizontal;
- sem corte vertical.

---

# 54. VERIFICAÇÃO AUTOMÁTICA DE CORTE

Antes de exportar PNG:

```text
medir maior linha
medir cabeçalho
medir rodapé
calcular largura
```

Nunca usar limite fixo que corte código.

---

# 55. MOBILE

Para Mobile, manter organização por arquivos.

Exemplo:

```text
MOB04

MainActivity.kt
strings.xml
```

Se futuramente houver:

```text
AndroidManifest.xml
build.gradle.kts
activity_main.xml
```

cada arquivo deve ter PNG separado.

---

# 56. VERSÕES DO MOBILE

Aplicar o mesmo sistema:

```text
PNG publicado
ZIP/site
Supabase atual
```

O aluno poderá continuar em qualquer versão oficialmente disponibilizada.

---

# 57. CORREÇÃO DO FALLBACK LOCAL

Hoje o site possui:

```text
Supabase
+
referência local
```

Essas fontes podem divergir.

A nova regra deve ser:

> A referência local nunca deve ser uma cópia independente sem identificação de versão.

Ela deve apontar explicitamente para uma versão registrada.

---

# 58. MODO OFFLINE

Se o Supabase estiver indisponível:

```text
usar versão local correspondente
```

Mas mostrar:

```text
Modo offline
Referência: Site v14.10.8
```

Nunca apresentar silenciosamente outra versão.

---

# 59. SINCRONIZAÇÃO

Criar rotina:

```text
sync-reference-versions
```

Ela compara:

```text
Supabase
ZIP
referência local
```

e alerta se houver divergência não registrada.

---

# 60. BLOQUEIO DE PUBLICAÇÃO COM REFERÊNCIA DIVERGENTE

Antes de publicar nova versão da Central:

```text
npm run audit-references
```

ou equivalente.

Se:

```text
fallback local != versão registrada
```

falhar o build.

---

# 61. TESTE DE INTEGRIDADE ANTES DE RELEASE

Checklist automático:

```text
HTML válido
CSS válido
JS válido
Python válido
arquivos conectados
IDs existentes
classes existentes
hashes
referências
PNG
fallback
```

---

# 62. NOVA AUDITORIA DE RELEASE

Toda versão deve gerar:

```text
AUDITORIA_REFERENCIAS.md
MANIFESTO_REFERENCIAS.csv
```

---

# 63. PROTEÇÃO DOS TRABALHOS JÁ FEITOS

Antes de qualquer migração:

```text
backup student_files
backup student_exercises
backup feedback
```

Gerar snapshot.

---

# 64. NÃO RECALCULAR NOTAS AUTOMATICAMENTE SEM AUDITORIA

A nova lógica não deve alterar notas antigas automaticamente.

Primeiro:

```text
simular auditoria
```

Depois mostrar ao professor:

```text
Nota atual
Nota sugerida
Motivo
```

---

# 65. APROVAÇÃO HUMANA

Para erros críticos ou mudança de nota:

```text
Professor confirma
```

Principalmente nos dados históricos.

---

# 66. PAINEL DE MIGRAÇÃO

Criar:

```text
Auditoria histórica
```

Mostrar:

```text
Aluno
Atividade
Versão provável
Status
Ação
```

Ações:

```text
Aceitar
Solicitar ajuste
Marcar correto
Revisar
```

---

# 67. PROCESSO DE AUDITORIA DOS ALUNOS — ETAPAS

## Etapa 1 — Inventário

Levantar:

- alunos;
- turmas;
- atividades;
- arquivos;
- status;
- versões.

---

## Etapa 2 — Backup

Snapshot completo antes de qualquer escrita.

---

## Etapa 3 — Comparação de versões

Comparar referências:

```text
PNG
Site
Atual
```

---

## Etapa 4 — Classificação do código do aluno

Detectar versão provável.

---

## Etapa 5 — Validação funcional

Executar analisadores.

---

## Etapa 6 — Identificar erros

Separar:

```text
cosmético
estrutural
funcional
crítico
```

---

## Etapa 7 — Gerar feedback sugerido

Sem ainda notificar.

---

## Etapa 8 — Revisão do professor

Professor aprova feedback.

---

## Etapa 9 — Publicar feedback

Aluno recebe no próximo acesso.

---

# 68. PRIMEIRA AUDITORIA DEVE SER SOMENTE LEITURA

A primeira execução não pode escrever no banco.

Gerar apenas:

```text
relatório
```

Depois revisar.

---

# 69. SEGUNDA FASE — ESCRITA CONTROLADA

Após validar relatório:

- registrar versão;
- atualizar classificação;
- adicionar feedback aprovado;
- manter histórico.

---

# 70. TESTES OBRIGATÓRIOS

Testar com casos reais:

```text
Aluno versão PNG
Aluno versão Site
Aluno versão atual
Aluno mistura versões
Aluno solução própria
Aluno incompleto
Aluno com erro crítico
```

---

# 71. TESTES MOBILE

Casos:

```text
MainActivity correto
strings.xml incorreto
recurso inexistente
import inválido
código misto
```

---

# 72. TESTES OFFLINE

Desconectar Supabase.

Verificar:

```text
qual referência aparece
qual versão é exibida
se o aluno mantém sua versão
```

---

# 73. TESTE DE RECONEXÃO

Fluxo:

```text
offline
↓
aluno digita
↓
salva localmente
↓
internet volta
↓
sincroniza
```

Sem trocar referência.

---

# 74. INDICADOR PARA O ALUNO

Adicionar:

```text
Referência utilizada:
Site v14.10.8
```

ou:

```text
PNG publicado
```

---

# 75. INDICADOR PARA O PROFESSOR

Mostrar:

```text
Versão detectada
Versão selecionada
Compatibilidade
```

---

# 76. NÃO MOSTRAR “ERRADO” APENAS POR DIVERGÊNCIA

Substituir mensagens genéricas como:

```text
Código diferente
```

por:

```text
Seu código utiliza uma abordagem diferente da referência.
Estamos verificando a funcionalidade.
```

---

# 77. PERCENTUAL DE PROGRESSO

Separar:

```text
Progresso de digitação
```

de:

```text
Validação funcional
```

Exemplo:

```text
Progresso: 82%
Validação: 100%
```

Um aluno pode ter código diferente e funcional.

---

# 78. HISTÓRICO DE ALTERAÇÃO DA REFERÊNCIA

Exibir para professor:

```text
v0.12.0
↓
v0.12.1
↓
v0.12.2
```

Com:

```text
data
motivo
arquivos alterados
```

---

# 79. MOTIVO DA NOVA VERSÃO

Obrigatório preencher:

```text
bugfix
melhoria
correção pedagógica
refatoração
```

---

# 80. COMPATIBILIDADE ENTRE VERSÕES

Cada versão poderá declarar:

```text
compatible_with_previous = true
```

ou:

```text
false
```

---

# 81. VERSÃO CONGELADA POR ALUNO

Depois que a versão for identificada:

```text
freeze_reference = true
```

Até:

- aluno solicitar mudança;
- professor autorizar;
- atividade reiniciada.

---

# 82. REABERTURA DE ATIVIDADE

Se professor reabrir:

perguntar:

```text
Manter referência antiga?
Migrar para referência atual?
```

---

# 83. MIGRAÇÃO ASSISTIDA

Se migrar:

mostrar diff:

```text
o que mudou
```

e não apagar código do aluno.

---

# 84. LOG DE AUDITORIA

Registrar ações administrativas:

```text
quem
quando
atividade
ação
versão anterior
versão nova
```

---

# 85. SEGURANÇA

Não expor respostas completas indevidamente para alunos além das regras atuais.

Manter:

- RLS;
- permissões;
- acesso por turma;
- releases;
- bloqueios.

---

# 86. PERFORMANCE

A auditoria de todos os alunos deverá funcionar em lotes.

Exemplo:

```text
20 alunos por lote
```

Evitar processar toda a escola em uma requisição.

---

# 87. CACHE DE RESULTADOS

Salvar análise:

```text
student_code_audits
```

Campos:

```text
student_id
exercise_id
reference_version_id
similarity_score
functional_status
severity
analysis_json
created_at
```

---

# 88. REPROCESSAMENTO

Se a referência mudar:

```text
não apagar auditoria anterior
```

Criar nova revisão.

---

# 89. DASHBOARD DE QUALIDADE DAS ATIVIDADES

Mostrar:

```text
Atividades com maior taxa de erro
Atividades com maior divergência de versão
Referências mais utilizadas
Bugs recorrentes
```

---

# 90. DOCUMENTAÇÃO

Criar documentação técnica:

```text
docs/reference-versioning.md
docs/student-code-audit.md
docs/validator.md
```

---

# 91. ORDEM RECOMENDADA DE IMPLEMENTAÇÃO

## Fase 1 — Congelar e documentar

- não alterar referências atuais;
- registrar PNG/site/atual;
- backup.

---

## Fase 2 — Banco de versões

Criar tabelas de versões e arquivos.

---

## Fase 3 — Importar versões históricas

Cadastrar:

- PNG;
- ZIP v14.10.8;
- Supabase atual.

---

## Fase 4 — Motor de detecção

Comparação e identificação automática.

---

## Fase 5 — Validação funcional

HTML/CSS/JS/Python/Mobile.

---

## Fase 6 — Auditoria dos alunos

Rodar em modo leitura.

---

## Fase 6-A — Auditoria das entregas GitHub legadas

- inventariar links históricos;
- congelar commit SHA;
- mapear exercícios dentro dos repositórios;
- analisar cada atividade separadamente;
- gerar nota/status/deficiências sugeridos;
- manter a primeira passagem somente leitura.

---

## Fase 7 — Painel professor

Visualizar resultados internos e entregas GitHub históricas.

---

## Fase 8 — Feedback

Aprovar e notificar alunos.

---

## Fase 9 — Interface aluno

Mostrar versão utilizada.

---

## Fase 10 — Proteção de releases

Build deve bloquear referências divergentes não versionadas.

---


# 91-A. FASE ESPECÍFICA — MIGRAÇÃO E CORREÇÃO DE ENTREGAS DA PLATAFORMA ANTIGA VIA GITHUB

Algumas atividades foram realizadas antes da Central atual. Nesses casos, o aluno não digitou o código dentro da plataforma nova: ele enviou um **link de repositório GitHub** contendo vários exercícios.

Essas entregas devem ser consideradas válidas e precisam ser migradas para o histórico acadêmico da Central.

A regra será:

> **O repositório GitHub enviado pelo aluno passa a ser uma fonte oficial de evidência da entrega histórica, mas a baixa no portal só ocorre depois da auditoria automática e, quando necessário, revisão do professor.**

## 91-A.1. Origem dos links

Localizar, para cada aluno:

- link GitHub já registrado na plataforma antiga;
- link GitHub salvo no progresso atual, caso exista;
- link enviado em campo de entrega/observação;
- repositório único contendo várias atividades.

Guardar sem alterar o repositório:

```text
student_id
repository_url
repository_owner
repository_name
default_branch
commit_sha_auditado
captured_at
source
```

A auditoria deve sempre registrar o **commit SHA exato** analisado, para que uma alteração futura do repositório não mude silenciosamente o resultado histórico.

---

## 91-A.2. Descoberta automática dos exercícios

Depois de abrir o repositório, o sistema deverá inventariar toda a árvore de arquivos e tentar identificar atividades por:

- número do exercício;
- nome da pasta;
- nome do arquivo;
- README;
- estrutura de arquivos esperada;
- disciplina/turma;
- similaridade com as referências oficiais;
- metadados existentes no portal.

Exemplos de pastas possíveis:

```text
exercicio01/
atividade-01/
01/
frontend/ex01/
python/exercicio_06/
atividades-praticas/ex16/
```

Não depender de um único padrão de nome.

---

## 91-A.3. Repositório com várias atividades

Um mesmo repositório poderá representar várias entregas.

Exemplo:

```text
atividades-praticas/
├── exercicio01/
├── exercicio02/
├── exercicio03/
├── ...
└── exercicio20/
```

O sistema deve avaliar **cada exercício separadamente**.

O resultado de um exercício não pode contaminar os demais.

---

## 91-A.4. Mapeamento GitHub → exercício da Central

Criar uma camada de correspondência:

```text
github_repository
github_path
exercise_id
confidence
mapping_method
```

Métodos possíveis:

```text
exact_folder
filename_pattern
readme_match
reference_similarity
manual_mapping
```

Se a confiança for baixa, não dar baixa automaticamente.

Classificar como:

```text
Mapeamento pendente de revisão
```

---

## 91-A.5. Auditoria do código encontrado no GitHub

Para cada exercício identificado:

1. localizar todos os arquivos relacionados;
2. recuperar o conteúdo;
3. identificar linguagem;
4. comparar com versões históricas aceitas;
5. verificar requisitos da atividade;
6. validar sintaxe;
7. validar integração entre arquivos;
8. executar validações funcionais seguras quando possível;
9. calcular progresso;
10. gerar classificação.

A auditoria GitHub deve utilizar o mesmo motor definido neste plano para:

- HTML;
- CSS;
- JavaScript;
- Python;
- Kotlin/Mobile;
- demais linguagens suportadas futuramente.

---

## 91-A.6. Estados de correção para entrega GitHub

Cada exercício encontrado deverá receber um status:

### ✅ CORRETO

Código funcional e requisitos atendidos.

### ✅ CORRETO — VERSÃO HISTÓRICA

Código corresponde a uma referência antiga oficialmente disponibilizada.

### ✅ CORRETO — SOLUÇÃO PRÓPRIA

Código diferente da referência, porém funcional e compatível com os requisitos.

### ⚠️ PARCIAL

Parte importante foi realizada, mas existem requisitos ausentes ou pequenos problemas.

### 🧩 MISTURA DE VERSÕES

Arquivos aparentam ter sido produzidos a partir de referências diferentes. Deve ser validado como projeto conectado antes de classificar como erro.

### 🚧 INCOMPLETO

Estrutura criada, mas a atividade não foi finalizada.

### ❌ NÃO FUNCIONAL

Código existe, porém possui falha que impede o funcionamento esperado.

### ❌ NÃO ENCONTRADO

Não foi localizado conteúdo suficiente no repositório para relacionar à atividade.

### 🔎 REVISÃO MANUAL

Ambiguidade de mapeamento, resultado técnico inconclusivo ou caso pedagógico que exige decisão do professor.

---

## 91-A.7. Nota e deficiência de código

O relatório deve separar:

```text
nota_atual
nota_sugerida
status_funcional
percentual_requisitos
deficiencias
pontos_corretos
feedback_sugerido
```

Exemplo:

```text
Atividade 08
Status: Parcial
Nota sugerida: 7,0 / 10
Requisitos atendidos: 78%

Deficiências:
- script.js procura #resultado, mas o HTML utiliza #mensagem;
- tratamento de campo vazio ausente.

Pontos corretos:
- HTML estruturado;
- CSS conectado;
- evento principal implementado.
```

A nota sugerida não deve ser aplicada automaticamente na primeira execução histórica.

---

## 91-A.8. Baixa no portal atual

Após auditoria aprovada, a Central poderá registrar a atividade histórica como:

```text
Concluída via GitHub
Parcial via GitHub
Revisão solicitada via GitHub
```

Salvar a origem da baixa:

```text
completion_source = github_legacy
repository_url
repository_commit_sha
repository_path
audit_id
audited_at
approved_by
approved_at
```

Nunca fingir que o código foi digitado no editor da Central.

A origem GitHub precisa continuar visível para professor e auditoria.

---

## 91-A.9. Não copiar silenciosamente o código para student_files

Por padrão, o sistema **não deve transformar automaticamente arquivos do GitHub em arquivos digitados na Central**.

O código deverá permanecer registrado como evidência externa.

Se futuramente houver necessidade de importar os arquivos, usar operação explícita:

```text
Importar cópia para a Central
```

mantendo:

```text
source = github
source_commit_sha
source_path
```

---

## 91-A.10. Congelamento por commit

A auditoria deverá trabalhar contra um commit específico.

Fluxo:

```text
URL do repositório
↓
branch padrão
↓
commit atual
↓
SHA congelado para auditoria
↓
arquivos analisados
```

Se o aluno modificar o repositório depois:

```text
novo commit detectado
```

A auditoria anterior continua preservada.

Uma nova auditoria gera outra revisão.

---

## 91-A.11. Repositórios privados

Repositórios públicos podem ser lidos diretamente.

Para repositórios privados:

- somente acessar quando a conta/conexão autorizada possuir permissão;
- não solicitar senha ou token pessoal do aluno;
- registrar falha de acesso como:

```text
Repositório não acessível com as permissões atuais
```

e encaminhar para revisão.

---

## 91-A.12. Proteção contra código malicioso

Código vindo de repositório de aluno é conteúdo não confiável.

A análise deverá:

- nunca executar código diretamente no servidor principal;
- bloquear acesso livre à rede;
- limitar CPU/memória/tempo;
- impedir leitura de secrets;
- usar sandbox quando execução for necessária;
- preferir análise estática quando suficiente.

HTML/JS deve ser executado somente no ambiente isolado já previsto para preview seguro.

Python e demais linguagens deverão usar execução controlada.

---

## 91-A.13. Tabela sugerida — vínculos de repositório

Criar estrutura equivalente a:

### `student_repository_submissions`

```text
id
student_id
subject_id
repository_url
repository_owner
repository_name
default_branch
source_type
active
created_at
updated_at
```

`source_type` poderá conter:

```text
legacy_platform
current_portal
manual_teacher
```

---

## 91-A.14. Tabela sugerida — auditoria de commit

### `student_repository_audits`

```text
id
student_repository_submission_id
commit_sha
branch
status
started_at
completed_at
analysis_version
summary_json
created_at
```

Nunca sobrescrever uma auditoria antiga.

---

## 91-A.15. Tabela sugerida — resultado por exercício

### `student_repository_exercise_audits`

```text
id
repository_audit_id
student_id
exercise_id
repository_path
mapping_confidence
mapping_method
reference_version_id
reference_similarity
functional_status
severity
requirements_score
suggested_score
analysis_json
feedback_suggested
teacher_decision
approved_by
approved_at
created_at
```

---

## 91-A.16. Primeira passagem obrigatoriamente read-only

Assim como a auditoria dos códigos internos, a primeira auditoria dos repositórios deve:

```text
ler GitHub
+
ler Supabase
+
analisar
+
gerar relatório
```

e **não deve**:

```text
alterar nota
alterar status
marcar concluído
enviar feedback
copiar código
```

---

## 91-A.17. Segunda passagem — baixa controlada

Depois da revisão do relatório:

```text
Professor aprova
↓
Registrar resultado
↓
Dar baixa no exercício
↓
Registrar origem GitHub
↓
Adicionar nota/feedback aprovado
```

Casos totalmente corretos poderão futuramente utilizar aprovação em lote, mas somente depois que o processo estiver validado com casos reais.

---

## 91-A.18. Painel do professor

Adicionar:

```text
Professor
→ Auditoria histórica
→ Entregas GitHub
```

Filtros:

```text
Turma
Aluno
Disciplina
Repositório
Atividade
Status
Nota sugerida
Gravidade
Revisão manual
```

Visão resumida:

```text
JOÃO SILVA
github.com/joao/atividades-praticas

Ex. 01  ✅ Correto            10,0
Ex. 02  ✅ Correto             9,5
Ex. 03  ⚠️ Parcial             7,0
Ex. 04  ❌ Não funcional       4,0
Ex. 05  🔎 Revisão manual       —
```

---

## 91-A.19. Tela detalhada

Mostrar:

```text
Repositório
Commit auditado
Pasta do exercício
Arquivos encontrados
Referência provável
Similaridade
Validação funcional
Requisitos atendidos
Nota sugerida
Deficiências
Feedback sugerido
```

Ações:

```text
Aprovar e dar baixa
Ajustar nota
Solicitar correção
Marcar como correto
Marcar como não correspondente
Reprocessar novo commit
```

---

## 91-A.20. Correção em lote

O sistema deverá conseguir processar repositórios em lotes para não travar a aplicação.

Fluxo sugerido:

```text
Turma
↓
20 alunos por lote
↓
1 repositório por vez por aluno
↓
N exercícios detectados
↓
resultados persistidos em cache
```

O processamento poderá priorizar:

1. alunos com link já registrado;
2. atividades ainda sem baixa;
3. atividades da plataforma antiga;
4. casos com estrutura reconhecida automaticamente.

---

## 91-A.21. Regra de idempotência

O mesmo:

```text
student_id
+
repository_url
+
commit_sha
+
exercise_id
+
analysis_version
```

não deve gerar duas baixas.

Reprocessar o mesmo commit pode atualizar somente a revisão de análise, nunca duplicar conclusão.

---

## 91-A.22. Histórico e rastreabilidade

Toda baixa histórica precisa responder:

```text
Quem entregou?
Onde estava o código?
Qual commit foi analisado?
Qual exercício foi reconhecido?
Qual motor de análise foi usado?
Qual nota foi sugerida?
Quem aprovou a nota final?
Quando o portal recebeu a baixa?
```

---

## 91-A.23. Situação de repositório reorganizado

Se o aluno reorganizou pastas depois da entrega:

- procurar por conteúdo e similaridade, não somente caminho;
- utilizar histórico de commits quando necessário;
- preservar o commit que serviu de evidência;
- não assumir que a pasta atual representa exatamente a entrega original.

Quando não houver evidência suficiente:

```text
Revisão manual
```

---

## 91-A.24. Repositório com atividades extras

Se o repositório contiver exercícios que não pertencem àquela turma/disciplina:

- não registrar baixa automática;
- listar como:

```text
Conteúdo adicional não mapeado
```

Isso evita associar exercício errado ao aluno.

---

## 91-A.25. Compatibilidade com referências versionadas

A auditoria GitHub deve consultar todas as referências aceitas:

```text
PNG publicado
Site antigo
Supabase histórico
Atual
```

Portanto, um código antigo do GitHub não será penalizado só porque a referência atual mudou.

---

## 91-A.26. Integração com solução própria

O código do GitHub também poderá ser classificado como:

```text
Solução própria válida
```

Mesmo com baixa similaridade textual.

Primeiro identificar possível referência; depois validar comportamento e requisitos.

---

## 91-A.27. Nova ordem operacional da migração histórica

A migração completa passa a seguir:

```text
1. Snapshot Supabase
2. Histórico de referências
3. Inventário student_files
4. Inventário dos links GitHub legados
5. Congelar commit de cada repositório
6. Mapear pastas/arquivos para exercícios
7. Auditar código interno da Central
8. Auditar código dos repositórios GitHub
9. Consolidar resultados por aluno
10. Professor revisar
11. Dar baixa controlada no portal
12. Liberar feedback aprovado
```

---

## 91-A.28. Critério de conclusão desta fase

A fase GitHub estará concluída quando for possível afirmar:

```text
1. Todos os links históricos foram inventariados.
2. Cada repositório foi associado ao aluno correto.
3. O commit auditado está registrado.
4. Todos os exercícios reconhecíveis foram mapeados.
5. Cada exercício recebeu avaliação independente.
6. Código antigo continua compatível com referências históricas.
7. Soluções próprias válidas são aceitas.
8. Nota sugerida e deficiências ficam visíveis ao professor.
9. Nenhuma baixa ocorre sem trilha de auditoria.
10. Reprocessamento não duplica notas/conclusões.
11. Código externo não é executado sem sandbox.
12. O portal diferencia claramente entrega interna de entrega GitHub.
```


# 92. CRITÉRIO DE CONCLUSÃO

O sistema estará corrigido quando for possível afirmar:

```text
1. Nenhum aluno perde trabalho por mudança de referência.
2. PNG antigo continua válido.
3. Código do site já publicado continua válido.
4. Referência atual continua válida.
5. Soluções próprias corretas são aceitas.
6. HTML/CSS/JS são avaliados como projeto conectado.
7. O professor sabe qual versão cada aluno usou.
8. Feedback pode ser enviado no próximo login.
9. Todas as referências possuem histórico.
10. Uma futura atualização não repete o problema.
```

---

# 93. REGRA MAIS IMPORTANTE

> **Referência é um guia pedagógico, não uma string absoluta que o aluno precisa copiar perfeitamente.**

A validação deve avaliar se o estudante construiu uma solução válida e se os arquivos funcionam corretamente em conjunto.

---

# 94. PRÓXIMA AÇÃO NA CONVERSA PRINCIPAL

Ao retomar o desenvolvimento na conversa principal:

1. usar o ZIP `DS-Exercicios-v14.10.8-AUDITADO.zip` como base;
2. auditar schema atual do Supabase;
3. localizar `student_files`, `student_exercises` e estruturas de feedback;
4. criar backup;
5. implementar versionamento de referências;
6. importar as versões PNG + Site + Atual;
7. montar auditoria em modo **read-only**;
8. analisar aluno por aluno;
9. gerar relatório antes de qualquer alteração em notas ou feedback;
10. somente após revisão aplicar as notificações.

---

## IMPORTANTE

A primeira auditoria de alunos deve ser **somente leitura**.

Nenhuma nota, arquivo ou feedback do aluno deve ser alterado até que o relatório completo tenha sido conferido.

