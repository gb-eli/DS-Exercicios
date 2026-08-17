# Relatório de implementação — Desafio de Informática AGV v2.2.0

**Data:** 30/07/2026  
**Base:** versão 2.1.0 com EduAuth Offline estrutural  
**Arquitetura:** GitHub Pages, totalmente front-end

## 1. Diagnóstico inicial

A plataforma contém:

- `index.html` e `professor.html` como pontos de entrada;
- módulos JavaScript para aulas guiadas, diagnósticos, minijogos, perfis, PDF, horário, Classroom, catálogo de ferramentas e EduAuth;
- IndexedDB para perfis criptografados e cofre do professor;
- `sessionStorage` para sessão e autorizações temporárias;
- service worker e Cache API para arquivos estáticos;
- resultados em PDF, JSON e `.agvresult`;
- XP motivacional calculado a partir do desempenho;
- nenhuma loja, carteira, moeda, inventário ou compra.

Os principais pontos de entrada de dados são nome do perfil, respostas textuais, arquivos de perfil, resultados importados pelo professor, código-base EduAuth e links configurados.

## 2. Riscos encontrados

| Risco | Situação anterior | Tratamento |
|---|---|---|
| Aceite genérico ou ausente | Não havia registro versionado completo | Termo geral e regras específicas, hashes e histórico por perfil |
| XSS em arquivo importado | Conteúdo importado dependia principalmente de escape na renderização | Sanitização para objeto novo, schema, limites e rejeição de chaves perigosas |
| Prototype pollution | Não havia validação transversal explícita | Rejeição de `__proto__`, `constructor` e `prototype` |
| URL perigosa | Catálogo confiava na configuração estática | Validação de protocolo antes de abrir link |
| CSV formula injection | Texto poderia iniciar com fórmula | Prefixo neutralizador na exportação |
| XP interpretado como nota ou moeda | Rotulagem não era sempre explícita | “XP motivacional”, política `affectsGrade:false` e documentação |
| Termos ausentes no PDF | Evidência não mostrava regras vigentes | Página/seção de aceite no diagnóstico e no comprovante guiado |
| CSP ausente | Sem política explícita | CSP com scripts locais, sem `unsafe-eval` |

## 3. Correções implementadas

### Termo e compromisso pedagógico

- fluxo obrigatório depois da criação ou abertura do perfil;
- caixas não marcadas previamente;
- resumo, texto integral, política de privacidade e aviso de simulações;
- opção para baixar cópia;
- recusa preserva o perfil e bloqueia novas atividades;
- exportação do perfil disponível antes do novo aceite;
- versão, hash SHA-256, identificador, horário, fuso, método e histórico;
- aceite específico separado para cada modalidade de atividade;
- novo aceite exigido quando a versão relevante mudar.

### Segurança de dados importados

- limite de 8 MB por arquivo e 250 resultados por importação;
- validação de profundidade, quantidade de campos e arrays;
- rejeição de objetos circulares e protótipos não permitidos;
- limpeza e limite de tamanho para nomes, perguntas, respostas, eventos e identificadores;
- normalização de datas e números;
- limites coerentes de proficiência, integridade, XP e totais;
- turma e tipo de resultado validados;
- deduplicação por ID somente depois da sanitização.

### Evidência e avaliação

- resultado inclui resumo do termo geral e das regras da atividade;
- PDF do diagnóstico ganhou página de compromisso pedagógico;
- PDF da aula guiada ganhou bloco de aceite;
- XP renomeado como motivacional;
- relatório explica que proficiência, evidência e revisão do professor são os critérios relevantes;
- rubrica configurável criada sem conversão automática em nota.

### Privacidade e permissões

- política em linguagem simples;
- manifesto central versionado;
- alternativas para armazenamento, arquivos, download, cópia e voz;
- câmera, microfone, localização, biometria e reconhecimento facial explicitamente não solicitados;
- nenhuma permissão opcional influencia XP ou avaliação.

### Créditos e atualização

- créditos coletivos sem nomes individuais automáticos;
- arquivo de colaboradores sujeito à autorização;
- animação de agradecimento de sete segundos, pulável e exibida uma vez por versão;
- respeito a redução de movimento;
- changelog, manifesto de versão e problemas conhecidos.

## 4. Funcionalidades reaproveitadas

Foram mantidos:

- todas as 10 aulas e conteúdos;
- diagnósticos geral e por turma;
- tempo mínimo de 25 minutos e máximo de 50 minutos;
- perfis locais criptografados;
- central de conclusão e Google Classroom;
- PDFs e painel do professor;
- EduAuth Offline estrutural;
- funcionamento offline;
- acessibilidade, temas e horário escolar.

## 5. Itens não aplicáveis

Não foram criados:

- loja;
- carteira;
- três saldos;
- ledger de moedas;
- inventário;
- personagens compráveis;
- compras, estornos ou recibos de loja.

A auditoria não encontrou esses módulos. Criá-los apenas para cumprir uma lista transversal acrescentaria complexidade e desviaria o foco pedagógico. O estado está documentado em `economy-manifest.json` e `wallet-schema-not-applicable.json`.

Também não foram solicitadas permissões de câmera, microfone ou localização porque nenhuma atividade atual depende delas.

## 6. Arquivos principais criados

- `assets/js/terms.js`
- `assets/js/security.js`
- `TERMS.md`
- `PRIVACY.md`
- `SIMULATION_NOTICE.md`
- `PERMISSIONS.md`
- `EDUCATIONAL_USE.md`
- `ASSESSMENT.md`
- `SECURITY.md`
- `CREDITS.md`
- `MIGRATION.md`
- `RECOVERY.md`
- `KNOWN_ISSUES.md`
- `PUBLICATION_CHECKLIST.md`
- `terms-manifest.json`
- `permissions-manifest.json`
- `assessment-rubric.json`
- `version-manifest.json`
- `contributors.config.json`
- `economy-manifest.json`
- `wallet-schema-not-applicable.json`
- `tests/security-terms.test.mjs`
- `tests/pdf-structure.test.mjs`

## 7. Arquivos principais modificados

- `index.html`
- `professor.html`
- `assets/css/app.css`
- `assets/js/app.js`
- `assets/js/storage.js`
- `assets/js/teacher.js`
- `assets/js/result-pdf.js`
- `assets/js/completion-pdf.js`
- `assets/js/crypto.js`
- `assets/js/data.js`
- `assets/js/tool-discovery.js`
- `assets/js/eduauth/config.js`
- `sw.js`
- `package.json`
- `README.md`
- `CHANGELOG.md`
- `CONFIGURACAO.md`
- `RELATORIO_TESTES.md`

## 8. Testes executados

`npm test` foi aprovado:

- validação estática de 10 aulas e 33 arquivos JavaScript;
- JSONs e imports;
- recursos do cache offline;
- ausência de chave privada, `eval` e `new Function`;
- termos e hashes;
- aceite de outro perfil ou hash alterado;
- XSS, URL perigosa, `__proto__` e arquivo excessivo;
- estrutura de PDF: 14 páginas para diagnóstico com 66 respostas e uma página para aula guiada;
- 19 testes EduAuth Core.

A tentativa de abrir o Chromium headless neste ambiente não terminou antes do limite e apresentou dependências de sistema/DBus. Por isso, a validação visual real em navegadores permanece no checklist de publicação e não foi declarada como aprovada.

## 9. Limitações honestas

- aplicação front-end não possui autoridade central;
- um usuário avançado pode alterar o ambiente em execução;
- logs e hashes locais não são absolutamente invioláveis;
- CSP mantém estilos inline por compatibilidade;
- Classroom possui confirmação manual, sem API;
- persistência depende do navegador;
- EduAuth ainda contém chaves de desenvolvimento;
- recuperação final depende do EduAuth Professor.

## 10. Como testar

```bash
python -m http.server 8080
npm test
```

Depois:

1. crie um perfil;
2. leia e aceite o termo;
3. abra uma aula e aceite as regras específicas;
4. gere uma evidência;
5. confira a seção de termos no PDF;
6. importe o resultado no painel do professor;
7. teste arquivo malicioso e arquivo corrompido;
8. teste celular, Chromebook, Brave, Chrome e Edge;
9. valide o GitHub Pages em janela anônima.

## 11. Como publicar

Siga `PUBLICATION_CHECKLIST.md`. O bloqueio principal é o provisionamento de produção do EduAuth. Não publique as chaves de teste para uma atividade real.

## 12. Como restaurar um perfil

- importe um `.edu-profile` válido usando a senha correspondente;
- não altere manualmente o conteúdo;
- quando o EduAuth Professor estiver provisionado, utilize o envelope de recuperação para redefinir a senha sem revelar a anterior;
- mantenha o backup antigo até confirmar que o perfil restaurado abre e contém o progresso.

## 13. Como conferir a economia

Não há carteira ou saldo para reconciliar. Confirme `economy-manifest.json`: loja, carteira e moeda virtual devem permanecer desativadas. O XP é somente um indicador derivado da atividade e não pode ser gasto nem determinar nota.

## 14. Como aprovar nomes nos créditos

Edite `contributors.config.json` somente após autorização e revisão do professor. Prefira turma ou grupo. Não publique e-mail, nota, diagnóstico, ID acadêmico ou comentário privado integral.

## 15. Estado final

```text
SEGURANÇA, TERMOS E PRIVACIDADE TRANSVERSAIS: IMPLEMENTADOS
LOJA E CARTEIRA: NÃO APLICÁVEIS
EDUAUTH PRODUÇÃO: PENDENTE
PUBLICAÇÃO EM AULA REAL: BLOQUEADA ATÉ PROVISIONAMENTO
```
