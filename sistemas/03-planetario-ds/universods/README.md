# COSMOS DS — C5.2

Versão `34.0.0`, construída sobre a C5.1. O COSMOS DS preserva a abertura leve, os 33 módulos anteriores, a Central de Cultura, Astrofotografia, Telescópios, Oficina Espacial, Museu Técnico, trilhas e Enciclopédia e adiciona **Projetos, Carreiras e Curadoria Científica** como 34º módulo carregado somente sob demanda.

## Novidades da C5.2

- seis projetos interdisciplinares;
- oito simulações de profissões do setor espacial;
- rubrica de confiabilidade com cinco critérios;
- oito casos didáticos de fontes;
- portfólio local por estudante;
- miniexposição digital exportável em HTML;
- quatro temas visuais procedurais;
- nova trilha oficial de Projetos e Curadoria;
- integração com Cultura, Enciclopédia, Tecnologia e laboratórios práticos;
- evidência JSON com decisões, fontes, competências e produção;
- abertura inicial e Service Worker leves preservados.

## Execução local

```bash
npm run serve
```

Abra `http://localhost:4173`.

## Validação

```bash
npm run validate
```

A validação cobre estrutura, imports, 34 módulos, dados C5.2, renderizadores, lifecycle, abertura sob demanda, regressão e persistência local.

## Publicação

O projeto é compatível com hospedagem estática e GitHub Pages. Use caminhos relativos e envie o conteúdo da raiz sem criar pastas extras.

## Limites

- os casos de fontes e profissões são simulações didáticas;
- o portfólio fica no navegador do estudante;
- a exposição HTML incorpora apenas textos e dados autorais registrados localmente;
- não existe sincronização entre dispositivos sem uma camada futura de servidor;
- informações científicas reais devem citar suas fontes originais.
