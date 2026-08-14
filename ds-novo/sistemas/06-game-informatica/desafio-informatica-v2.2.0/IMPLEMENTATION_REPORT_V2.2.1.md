# Relatório de implementação — Desafio de Informática AGV v2.2.1

**Data:** 03/08/2026  
**Escopo:** Modo Guiado do 1º ADM, senhas das aulas e painel do professor.

## Implementado

- gerador coletivo de senhas em `professor.html`;
- seleção de turma e aula;
- senha atual sincronizada em janelas de 15 minutos;
- senha anterior para tolerância de solicitações já abertas;
- contagem regressiva e atualização automática;
- cópia de PIN e código-base;
- resumo pedagógico com objetivos e etapas;
- orientação simplificada no modal do estudante;
- cache offline atualizado;
- versionamento interno 2.2.1.

## Revisão pedagógica

### Aula 1 — Criando, organizando e compartilhando planilhas

Conteúdo validado: criação e nomeação, arquivo x aba, células, intervalos, organização de abas, permissões e auditoria final. Total: 10 etapas com reforço.

### Aula 2 — Formatação profissional de planilhas

Conteúdo validado: hierarquia visual, cabeçalho, negrito, cores, bordas, contraste, formatos numéricos, acessibilidade e relatório profissional. Total: 9 etapas com reforço.

## Testes

- validação estática: aprovada;
- termos, privacidade e segurança: aprovados;
- estrutura dos PDFs: aprovada;
- EduAuth Core: 19 testes aprovados;
- gerador de senhas: 4 testes aprovados.

## Limitação conhecida

O modo atual é adequado para controle pedagógico presencial e offline, mas as chaves de desenvolvimento estão no projeto estático. Autenticação forte exige provisionamento externo do EduAuth Professor ou backend.
