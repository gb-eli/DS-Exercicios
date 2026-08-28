import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
import { requireLiveAuthSession } from "./session-guard.ts";

const H = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};
const J = (x: unknown, s = 200) => new Response(JSON.stringify(x), { status: s, headers: { ...H, "Content-Type": "application/json" } });
const now = () => new Date().toISOString();
const id = (v: unknown) => String(v || "").trim();
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const STAFF = ["teacher", "admin", "super_admin"];

const ROLES = [
  ["analysis", "Análise de Sistemas / Product Owner", "🧭", "Problema, atores, requisitos, escopo, regras e prioridade do produto"],
  ["backend", "Back-end", "⚙️", "Python básico, variáveis, funções, condicionais, laços, bibliotecas e regras do servidor"],
  ["frontend", "Front-end", "🖥️", "HTML, CSS, semântica, navegação, links, imagens, organização e interface no navegador"],
  ["database", "Banco de Dados", "🗄️", "Tabelas, registros, SELECT, WHERE, AND, OR e filtros SQL básicos"],
  ["qa", "QA / Testador", "🧪", "Análise de bugs, falhas, códigos quebrados, testes e critérios de aceite"],
  ["designer", "Design / UX/UI", "🎨", "Cores, RGB, tipografia, protótipos de baixa/alta fidelidade e experiência"],
  ["cyber", "Cyber Segurança", "🛡️", "Criptografia, hash SHA-256, XSS, sanitização, injeções, phishing e disponibilidade"],
  ["business", "Inovação & Empreendedorismo", "🚀", "MVP, Business Model Canvas, startup, pitch, vendas, negociação e validação"],
];

const ROOM_THEMES = new Set(["cyber","neon","ocean","violet","sunset","matrix","corporate","mono"]);
const ROOM_MASCOTS = new Set(["robot","owl","fox","dragon","wolf","eagle","octopus","capybara"]);
function safeEmblem(value: unknown) {
  const data = String(value || "").trim();
  if (!data) return null;
  if (data.length > 450000) throw new Error("emblem_too_large");
  const match = data.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("invalid_emblem_format");
  const bytes = Math.floor(match[2].length * 3 / 4) - ((match[2].match(/=+$/)?.[0].length) || 0);
  if (bytes > 320 * 1024) throw new Error("emblem_too_large");
  return data;
}

type ChallengeSeed = {
  challenge_key: string;
  phase_no: number;
  title: string;
  prompt: string;
  challenge_type: "quiz_single" | "quiz_multi" | "drag_match" | "drag_classify" | "drag_order" | "short_text" | "code_text";
  scope: "individual" | "clan";
  role_key: string | null;
  points: number;
  xp_max: number;
  public_config: Record<string, unknown>;
  answer_key: Record<string, unknown>;
  depends_on_keys: string[];
};

const Q = (
  key: string,
  phase: number,
  title: string,
  prompt: string,
  type: ChallengeSeed["challenge_type"],
  scope: ChallengeSeed["scope"],
  role: string | null,
  points: number,
  xpMax: number,
  opts: Record<string, unknown> = {},
  correct: unknown = null,
  deps: string[] = [],
): ChallengeSeed => ({
  challenge_key: key,
  phase_no: phase,
  title,
  prompt,
  challenge_type: type,
  scope,
  role_key: role,
  points,
  xp_max: xpMax,
  public_config: opts,
  answer_key: correct === null ? {} : { correct },
  depends_on_keys: deps,
});

const G = (instructions: string, teamHelp: string, timeHint: string, extra: Record<string, unknown> = {}) => ({
  instructions,
  team_help: teamHelp,
  time_hint: timeHint,
  ...extra,
});

const T: Record<string, { subject_slug: string; subject_name: string; description: string; challenges: ChallengeSeed[] }> = {
  analysis_methods_1ds: {
    subject_slug: "analise-e-metodo-para-sistemas",
    subject_name: "Análise e Método para Sistemas",
    description: "Prova prática em software house. Cada integrante escolhe uma área diferente; a equipe pode usar até 6 das 8 áreas. O progresso fica salvo no servidor para continuar na próxima aula.",
    challenges: [
      Q("kickoff", 1, "Briefing da software house", "A empresa Atlas Software recebeu um pedido para criar um sistema de chamados internos. Hoje as solicitações chegam por mensagens, não há prioridade clara e ninguém sabe o estado de cada chamado. Qual conjunto de ações é mais adequado antes da implementação?", "quiz_multi", "clan", null, .10, 50, G(
        "Leiam o cenário juntos e marquem todas as decisões coerentes para o início do projeto.",
        "O líder da equipe envia esta resposta. Os demais integrantes discutem e justificam as escolhas.",
        "3 min",
        { options: [
          { id:"a", label:"Entender usuários, problema atual e objetivo que o sistema precisa atender." },
          { id:"b", label:"Definir requisitos, limites do escopo e uma primeira prioridade de entrega." },
          { id:"c", label:"Escolher uma tecnologia e iniciar o código antes de validar a necessidade." },
          { id:"d", label:"Criar um fluxo inicial e validar a proposta antes de ampliar funcionalidades." },
        ] }
      ), ["a","b","d"]),

      Q("analysis_main", 2, "Análise — RF ou RNF?", "O cliente enviou seis solicitações para o sistema de chamados. Classifique cada uma como Requisito Funcional (RF) ou Requisito Não Funcional (RNF).", "drag_classify", "individual", "analysis", .45, 100, G(
        "Arraste cada solicitação para RF ou RNF. RF descreve o que o sistema faz; RNF descreve qualidade, restrição ou característica de funcionamento.",
        "Você pode ouvir Front-end, Back-end e QA para discutir impactos, mas a classificação final é responsabilidade da área de Análise.",
        "6 min",
        { items:[
          {id:"r1",label:"Permitir abrir um chamado informando título, descrição e setor."},
          {id:"r2",label:"Permitir alterar o estado do chamado entre aberto, andamento e concluído."},
          {id:"r3",label:"Exibir o histórico de alterações realizadas em cada chamado."},
          {id:"r4",label:"A página principal deve responder em até dois segundos na rede escolar."},
          {id:"r5",label:"O sistema deve funcionar adequadamente em computador e celular."},
          {id:"r6",label:"Somente usuários autorizados podem visualizar chamados restritos."},
        ],targets:[{id:"rf",label:"Requisito Funcional — RF"},{id:"rnf",label:"Requisito Não Funcional — RNF"}] }
      ), {r1:"rf",r2:"rf",r3:"rf",r4:"rnf",r5:"rnf",r6:"rnf"}, ["kickoff"]),
      Q("analysis_check", 3, "Análise — prioridade e escopo", "A primeira versão precisa resolver o problema principal sem crescer demais. Qual decisão representa melhor uma boa definição de escopo?", "quiz_single", "individual", "analysis", .15, 50, G(
        "Escolha a alternativa que preserva o objetivo principal e reduz complexidade desnecessária.",
        "Produto e equipe podem discutir prioridade. A resposta final é da área de Análise.",
        "2 min",
        {options:[
          {id:"a",label:"Entregar abertura, acompanhamento e conclusão de chamados antes de recursos acessórios."},
          {id:"b",label:"Entregar chat, ranking e personalização antes do fluxo principal de chamados."},
          {id:"c",label:"Implementar todas as ideias do cliente sem separar prioridade ou dependência."},
          {id:"d",label:"Escolher apenas recursos visuais e deixar as regras de negócio para outra versão."},
        ]}
      ), ["a"], ["analysis_main"]),

      Q("backend_main", 2, "Back-end — regra em Python", "No servidor, o sistema classifica prioridade pela quantidade de horas em aberto. Complete uma função Python simples usando variável, if, elif e else: até 2 horas = 'baixa'; até 8 horas = 'media'; acima disso = 'alta'.", "code_text", "individual", "backend", .45, 100, G(
        "Escreva uma função curta chamada prioridade(horas). Use if, elif e else e retorne uma string. Depois explique em uma frase por que essa lógica pertence ao Back-end.",
        "QA pode sugerir valores de teste; Análise pode conferir a regra. O Back-end escreve e envia o código.",
        "7 min",
        {min_length:100,placeholder:"def prioridade(horas):\n    if ...\n        return ...\n    elif ...\n        return ...\n    else:\n        return ...\n\nPor que fica no Back-end: ..."}
      ), null, ["kickoff"]),
      Q("backend_check", 3, "Back-end — fundamentos", "Quais afirmações descrevem corretamente fundamentos básicos do Back-end em Python?", "quiz_multi", "individual", "backend", .15, 50, G(
        "Marque todas as alternativas corretas. Há mais de uma resposta válida.",
        "A equipe pode discutir exemplos, mas o Back-end envia a seleção final.",
        "3 min",
        {options:[
          {id:"a",label:"Variáveis armazenam valores que podem ser usados durante a execução do programa."},
          {id:"b",label:"Funções agrupam uma lógica reutilizável e podem receber parâmetros ou retornar valores."},
          {id:"c",label:"O comando import permite utilizar módulos ou bibliotecas disponíveis no ambiente Python."},
          {id:"d",label:"O laço while executa uma única vez e não depende de nenhuma condição lógica."},
        ]}
      ), ["a","b","c"], ["backend_main"]),

      Q("frontend_main", 2, "Front-end — estrutura HTML e CSS", "A página do sistema precisa ter cabeçalho, navegação, conteúdo principal, um link para ajuda, uma imagem e rodapé. Qual trecho organiza melhor uma estrutura semântica e conecta corretamente o CSS externo?", "quiz_single", "individual", "frontend", .45, 100, G(
        "Compare as alternativas observando tags semânticas, link do CSS, link de navegação e imagem com caminho definido.",
        "Design pode comentar hierarquia visual e Análise pode confirmar o fluxo. O Front-end envia a resposta.",
        "5 min",
        {options:[
          {id:"a",label:"<link rel='stylesheet' href='style.css'> com <header>, <nav>, <main>, <a href='ajuda.html'>, <img src='logo.png'> e <footer>."},
          {id:"b",label:"<script href='style.css'> com <top>, <menu>, <body-main>, <link url='ajuda.html'>, <image href='logo.png'> e <bottom>."},
          {id:"c",label:"<css src='style.css'> com <header>, <navigation>, <content>, <a src='ajuda.html'>, <img href='logo.png'> e <footer>."},
          {id:"d",label:"<style link='style.css'> com <head-area>, <nav>, <main>, <url href='ajuda.html'>, <photo src='logo.png'> e <foot>."},
        ]}
      ), ["a"], ["kickoff"]),
      Q("frontend_check", 3, "Front-end — CSS básico", "Quais declarações CSS realizam corretamente as alterações descritas?", "quiz_multi", "individual", "frontend", .15, 50, G(
        "Marque todas as declarações válidas. Considere sintaxe CSS básica.",
        "Design pode discutir aparência, mas o Front-end envia a resposta técnica.",
        "3 min",
        {options:[
          {id:"a",label:"body { background-color: #f2f2f2; } altera a cor de fundo da página."},
          {id:"b",label:"p { color: #222222; } altera a cor do texto dos parágrafos selecionados."},
          {id:"c",label:"strong { font-weight: 700; } pode deixar o texto selecionado em negrito."},
          {id:"d",label:"body { text-font: Arial; } é a propriedade padrão para definir família de fonte."},
        ]}
      ), ["a","b","c"], ["frontend_main"]),

      Q("database_main", 2, "Banco de Dados — SELECT com AND", "Considere a tabela usuarios(id, nome, setor, ativo). A empresa precisa listar o nome dos usuários do setor 'TI' que estão ativos. Qual consulta atende exatamente ao pedido?", "quiz_single", "individual", "database", .45, 100, G(
        "Analise SELECT, FROM e WHERE. O filtro precisa exigir setor TI E usuário ativo ao mesmo tempo.",
        "Back-end pode discutir de onde a consulta seria chamada. Banco de Dados envia a consulta correta.",
        "5 min",
        {options:[
          {id:"a",label:"SELECT nome FROM usuarios WHERE setor = 'TI' AND ativo = true;"},
          {id:"b",label:"SELECT nome FROM usuarios WHERE setor = 'TI' OR ativo = true;"},
          {id:"c",label:"SELECT setor FROM usuarios WHERE nome = 'TI' AND ativo = true;"},
          {id:"d",label:"SELECT nome FROM usuarios WHERE setor = 'TI' AND ativo = false;"},
        ]}
      ), ["a"], ["kickoff"]),
      Q("database_check", 3, "Banco de Dados — filtrar registros", "Tabela chamados: #1 TI aberto alta; #2 RH concluído baixa; #3 TI aberto baixa; #4 TI concluído alta. Quais registros seriam retornados por WHERE setor='TI' AND (status='aberto' OR prioridade='alta')?", "quiz_multi", "individual", "database", .15, 50, G(
        "Aplique primeiro o setor TI e depois verifique se o chamado está aberto OU possui prioridade alta.",
        "A equipe pode calcular junto, mas Banco de Dados registra a seleção final.",
        "3 min",
        {options:[
          {id:"a",label:"Registro #1 — setor TI, status aberto e prioridade alta."},
          {id:"b",label:"Registro #2 — setor RH, status concluído e prioridade baixa."},
          {id:"c",label:"Registro #3 — setor TI, status aberto e prioridade baixa."},
          {id:"d",label:"Registro #4 — setor TI, status concluído e prioridade alta."},
        ]}
      ), ["a","c","d"], ["database_main"]),

      Q("qa_main", 2, "QA — encontre os bugs", "O código abaixo deveria calcular o total e exibir 'aprovado' quando total >= 10:\n\npreco = 5\nquantidade = 2\ntotal = preco * quantdade\nif total >= 10\n    print('aprovado')\n\nQuais problemas precisam ser corrigidos?", "quiz_multi", "individual", "qa", .45, 100, G(
        "Marque todos os erros reais. Procure nome de variável, pontuação e estrutura do bloco condicional.",
        "Back-end pode explicar a intenção do código, mas QA deve identificar e registrar os defeitos.",
        "5 min",
        {options:[
          {id:"a",label:"A variável quantdade está escrita diferente de quantidade e causa referência inválida."},
          {id:"b",label:"A linha do if precisa terminar com dois-pontos para abrir corretamente o bloco."},
          {id:"c",label:"A função print precisa obrigatoriamente ser substituída por uma função chamada show."},
          {id:"d",label:"A multiplicação com asterisco é inválida em Python e deve ser escrita usando a letra x."},
        ]}
      ), ["a","b"], ["kickoff"]),
      Q("qa_check", 3, "QA — caso de teste", "Requisito: um chamado concluído não pode voltar diretamente para 'aberto' sem reabertura autorizada. Qual teste valida melhor essa regra?", "quiz_single", "individual", "qa", .15, 50, G(
        "Escolha o caso que exercita diretamente a regra e verifica o resultado esperado.",
        "Análise pode confirmar o requisito e Back-end pode explicar a validação. QA envia o teste escolhido.",
        "2 min",
        {options:[
          {id:"a",label:"Tentar alterar concluído para aberto sem autorização e confirmar que a operação é recusada."},
          {id:"b",label:"Abrir a tela inicial e confirmar que o logotipo aparece com o tamanho esperado."},
          {id:"c",label:"Cadastrar outro usuário e confirmar que o nome aparece na lista de participantes."},
          {id:"d",label:"Trocar a cor do botão e confirmar que o novo estilo foi aplicado no navegador."},
        ]}
      ), ["a"], ["qa_main"]),

      Q("designer_main", 2, "Design — protótipo, cor e tipografia", "Antes de desenvolver as telas finais, a equipe precisa validar fluxo e depois refinar aparência. Quais afirmações estão corretas?", "quiz_multi", "individual", "designer", .45, 100, G(
        "Marque todas as afirmações corretas sobre baixa/alta fidelidade, RGB e tipografia.",
        "Front-end pode discutir implementação visual. Design é responsável por justificar e enviar a seleção.",
        "5 min",
        {options:[
          {id:"a",label:"Baixa fidelidade prioriza estrutura e fluxo sem exigir acabamento visual detalhado."},
          {id:"b",label:"Alta fidelidade aproxima cores, tipografia, componentes e interações do produto final."},
          {id:"c",label:"RGB representa combinações de vermelho, verde e azul usadas em cores de tela."},
          {id:"d",label:"Tipografia serve apenas para decorar e não influencia hierarquia nem legibilidade da interface."},
        ]}
      ), ["a","b","c"], ["kickoff"]),
      Q("designer_check", 3, "Design — protótipo prático", "Crie um protótipo simples da tela principal do sistema de chamados no Figma ou Marvel App. Ele deve mostrar cabeçalho, navegação, lista de chamados, estado/prioridade e ação principal. Cole abaixo o link compartilhável do protótipo.", "short_text", "individual", "designer", .15, 50, G(
        "Crie o protótipo fora do portal, habilite acesso por link e cole somente a URL compartilhável acompanhada de uma frase explicando se é baixa ou alta fidelidade.",
        "A equipe pode revisar o protótipo. O Designer é responsável pelo link. Esta missão fica aguardando validação manual do professor.",
        "10–15 min, podendo continuar na próxima aula",
        {min_length:20,url_required:true,teacher_validation:true,placeholder:"https://www.figma.com/... ou https://marvelapp.com/...\nTipo do protótipo: ..."}
      ), null, ["designer_main"]),

      Q("cyber_main", 2, "Cyber — integridade com SHA-256", "Documento recebido:\nRELATORIO-AGV|cliente=ByteWorks|versao=1|status=ALTERADO\n\nHash SHA-256 de referência:\n4ee9e29a355a6f2fdbd7b7985c3a671826fbf0335c3f3a020bc75b72b5f9581a\n\nCalcule o SHA-256 exato do texto recebido em uma ferramenta de hash e determine a integridade.", "quiz_single", "individual", "cyber", .45, 100, G(
        "Copie exatamente a linha do documento, gere SHA-256 e compare com o hash de referência. Não altere espaços, letras ou sinais.",
        "Outro integrante pode conferir a cópia do texto, mas Cyber Segurança é responsável pela verificação e envio.",
        "6 min",
        {options:[
          {id:"a",label:"O documento está íntegro porque o SHA-256 calculado coincide exatamente com a referência."},
          {id:"b",label:"O documento foi alterado porque o SHA-256 calculado não coincide com a referência informada."},
          {id:"c",label:"A integridade não pode ser analisada porque SHA-256 funciona somente com arquivos binários."},
          {id:"d",label:"A integridade está garantida porque o texto possui a palavra versao e um status preenchido."},
        ]}
      ), ["b"], ["kickoff"]),
      Q("cyber_check", 3, "Cyber — ataques e proteção", "Quais relações entre risco e proteção estão corretas em uma aplicação web?", "quiz_multi", "individual", "cyber", .15, 50, G(
        "Marque todas as relações corretas. Considere proteção básica no navegador e principalmente no servidor.",
        "Back-end pode discutir validação de entrada. Cyber Segurança registra a análise final.",
        "4 min",
        {options:[
          {id:"a",label:"XSS pode ser reduzido escapando saída e sanitizando conteúdo quando HTML controlado for permitido."},
          {id:"b",label:"SQL Injection pode ser reduzida usando consultas parametrizadas em vez de concatenar entrada do usuário."},
          {id:"c",label:"Phishing pode ser reduzido com verificação de origem, treinamento e uso de canais oficiais conhecidos."},
          {id:"d",label:"DDoS é resolvido apenas escondendo o botão de login no Front-end sem proteção de infraestrutura."},
        ]}
      ), ["a","b","c"], ["cyber_main"]),

      Q("business_main", 2, "Negócios — Business Model Canvas", "A Atlas Software precisa organizar seu modelo de negócio. Relacione cada exemplo ao bloco correto do Business Model Canvas.", "drag_match", "individual", "business", .45, 100, G(
        "Associe os exemplos aos blocos do BMC. O objetivo é identificar como a solução cria, entrega e captura valor.",
        "Análise e equipe podem discutir público e proposta; Inovação & Empreendedorismo registra o modelo final.",
        "7 min",
        {items:[
          {id:"b1",label:"Escolas que precisam controlar chamados internos."},
          {id:"b2",label:"Reduzir perda de solicitações e dar visibilidade ao atendimento."},
          {id:"b3",label:"Portal web e apresentação comercial para instituições."},
          {id:"b4",label:"Suporte e acompanhamento durante a implantação."},
          {id:"b5",label:"Assinatura mensal paga pela instituição."},
          {id:"b6",label:"Equipe de desenvolvimento e infraestrutura em nuvem."},
          {id:"b7",label:"Desenvolver, manter e evoluir o sistema."},
          {id:"b8",label:"Provedor de nuvem e parceiro de implantação."},
          {id:"b9",label:"Hospedagem, suporte e horas da equipe."},
        ],targets:[
          {id:"segments",label:"Segmentos de clientes"},{id:"value",label:"Proposta de valor"},{id:"channels",label:"Canais"},
          {id:"relations",label:"Relacionamento com clientes"},{id:"revenue",label:"Fontes de receita"},{id:"resources",label:"Recursos principais"},
          {id:"activities",label:"Atividades principais"},{id:"partners",label:"Parcerias principais"},{id:"costs",label:"Estrutura de custos"},
        ]}
      ), {b1:"segments",b2:"value",b3:"channels",b4:"relations",b5:"revenue",b6:"resources",b7:"activities",b8:"partners",b9:"costs"}, ["kickoff"]),
      Q("business_check", 3, "Negócios — MVP, pitch e negociação", "Quais decisões combinam com uma startup que quer validar rapidamente a solução antes de investir em uma versão completa?", "quiz_multi", "individual", "business", .15, 50, G(
        "Marque todas as estratégias coerentes com MVP, pitch e validação comercial.",
        "Todos podem discutir viabilidade; Inovação & Empreendedorismo envia a decisão final.",
        "4 min",
        {options:[
          {id:"a",label:"Construir o menor conjunto de funcionalidades capaz de testar a proposta de valor com usuários reais."},
          {id:"b",label:"Preparar um pitch curto que conecte problema, solução, público, valor e próximo passo esperado."},
          {id:"c",label:"Negociar entendendo necessidade, limite e valor para buscar uma proposta aceitável para as partes."},
          {id:"d",label:"Adicionar todos os recursos imaginados antes de mostrar qualquer versão ou conversar com possíveis clientes."},
        ]}
      ), ["a","b","c"], ["business_main"]),

      Q("final", 4, "Entrega da equipe — decisão executiva", "A equipe precisa registrar uma síntese final: qual problema será resolvido, quais áreas foram assumidas, duas decisões técnicas importantes, um risco que precisa ser controlado e o que entraria na primeira versão. Incluam uma frase de justificativa para a prioridade escolhida.", "short_text", "clan", null, .10, 150, G(
        "Façam uma síntese curta e objetiva. Não repitam respostas completas; conectem as decisões das áreas escolhidas pela equipe.",
        "Todos revisam. O líder envia a entrega coletiva. Ela permanece salva junto com as entregas individuais.",
        "5 min",
        {min_length:180,placeholder:"Problema... Áreas... Decisões... Risco... Primeira versão... Justificativa..."}
      ), null, ["kickoff"]),
    ],
  },

  innovation_2ds: {
    subject_slug: "inovacao-tecnologica-e-empreendedorismo",
    subject_name: "Inovação Tecnológica e Empreendedorismo",
    description: "Prova prática em startup de tecnologia. Cada integrante escolhe uma área diferente; a equipe pode usar até 6 das 8 áreas. O progresso fica salvo no servidor para continuar na próxima aula.",
    challenges: [
      Q("kickoff", 1, "Briefing da startup", "A startup InovaTrack quer criar uma plataforma para pequenas empresas registrarem equipamentos, ocorrências e inspeções. O produto precisa ser simples, seguro e testável antes de crescer. Quais decisões fazem sentido no início?", "quiz_multi", "clan", null, .10, 50, G(
        "Conversem e marquem todas as decisões coerentes para transformar a ideia em uma solução validável.",
        "O líder envia a resposta coletiva. Cada integrante deve explicar como sua área ajudaria a validar a proposta.",
        "3 min",
        {options:[
          {id:"a",label:"Definir problema, público e proposta de valor antes de expandir funcionalidades."},
          {id:"b",label:"Construir um MVP pequeno e observar o uso real antes de investir na versão completa."},
          {id:"c",label:"Escolher tecnologias apenas pela novidade, mesmo sem relação com a necessidade do cliente."},
          {id:"d",label:"Planejar requisitos, experiência, segurança e forma de validar o modelo de negócio."},
        ]}
      ), ["a","b","d"]),

      Q("analysis_main", 2, "Análise — requisitos da startup", "Classifique os pedidos da InovaTrack como Requisito Funcional (RF) ou Requisito Não Funcional (RNF).", "drag_classify", "individual", "analysis", .45, 100, G(
        "Arraste cada item para RF ou RNF. Pense no que o sistema faz e nas qualidades/restrições que deve respeitar.",
        "Back-end, Front-end e QA podem ajudar a discutir impacto. Análise de Sistemas registra a classificação.",
        "6 min",
        {items:[
          {id:"r1",label:"Cadastrar equipamento com identificação, setor e responsável."},
          {id:"r2",label:"Registrar ocorrência vinculada a um equipamento existente."},
          {id:"r3",label:"Exibir um painel com inspeções pendentes e concluídas."},
          {id:"r4",label:"A tela principal deve funcionar sem quebra em celular e computador."},
          {id:"r5",label:"Dados restritos devem ser visíveis apenas para perfis autorizados."},
          {id:"r6",label:"As consultas mais frequentes devem responder em tempo adequado ao uso."},
        ],targets:[{id:"rf",label:"Requisito Funcional — RF"},{id:"rnf",label:"Requisito Não Funcional — RNF"}]}
      ), {r1:"rf",r2:"rf",r3:"rf",r4:"rnf",r5:"rnf",r6:"rnf"}, ["kickoff"]),
      Q("analysis_check", 3, "Análise — situação-problema", "Um cliente pede 'colocar inteligência artificial' sem explicar para quê. Qual resposta do analista é mais adequada?", "quiz_single", "individual", "analysis", .15, 50, G(
        "Escolha a alternativa que primeiro procura entender necessidade, resultado e critério de sucesso.",
        "Negócios pode discutir valor; Análise envia a decisão final.",
        "2 min",
        {options:[
          {id:"a",label:"Perguntar qual problema precisa ser resolvido, quais dados existem e qual resultado seria considerado útil."},
          {id:"b",label:"Adicionar qualquer modelo de IA disponível para que o produto pareça mais moderno na apresentação."},
          {id:"c",label:"Recusar a ideia imediatamente porque tecnologias novas nunca devem entrar em produtos em validação."},
          {id:"d",label:"Substituir o MVP por uma versão completa e usar IA em todas as telas antes de testar com usuários."},
        ]}
      ), ["a"], ["analysis_main"]),

      Q("backend_main", 2, "Back-end — Python aplicado", "A startup calcula o nível de atenção de uma ocorrência. Escreva uma função Python nivel(risco) usando if, elif e else: risco >= 8 retorna 'alto'; risco >= 4 retorna 'medio'; caso contrário retorna 'baixo'.", "code_text", "individual", "backend", .45, 100, G(
        "Use uma variável/parâmetro, blocos condicionais e return. Depois explique o papel dessa função no servidor.",
        "QA pode sugerir testes com 2, 5 e 9; Análise pode validar a regra. Back-end envia o código.",
        "7 min",
        {min_length:100,placeholder:"def nivel(risco):\n    if ...\n        return ...\n    elif ...\n        return ...\n    else:\n        return ...\n\nUso no Back-end: ..."}
      ), null, ["kickoff"]),
      Q("backend_check", 3, "Back-end — Python e servidor", "Quais afirmações estão corretas sobre conceitos básicos usados no Back-end?", "quiz_multi", "individual", "backend", .15, 50, G(
        "Marque todas as afirmações verdadeiras.",
        "A equipe pode discutir exemplos, mas Back-end registra as respostas.",
        "3 min",
        {options:[
          {id:"a",label:"Uma função pode receber parâmetros e retornar um resultado usado por outras partes do sistema."},
          {id:"b",label:"if e elif permitem executar blocos diferentes conforme condições avaliadas pelo programa."},
          {id:"c",label:"while pode repetir um bloco enquanto uma condição permanecer verdadeira e precisa de cuidado para terminar."},
          {id:"d",label:"import serve exclusivamente para alterar cores do HTML e não possui relação com módulos Python."},
        ]}
      ), ["a","b","c"], ["backend_main"]),

      Q("frontend_main", 2, "Front-end — HTML semântico", "A startup quer uma página com cabeçalho, menu, conteúdo, imagem do produto, link 'Saiba mais' e rodapé. Qual estrutura é tecnicamente mais adequada?", "quiz_single", "individual", "frontend", .45, 100, G(
        "Observe tags semânticas, atributos href/src e ligação do arquivo CSS externo.",
        "Design pode comentar hierarquia; Front-end envia a estrutura escolhida.",
        "5 min",
        {options:[
          {id:"a",label:"<link rel='stylesheet' href='app.css'> com <header>, <nav>, <main>, <img src='produto.jpg'>, <a href='mais.html'> e <footer>."},
          {id:"b",label:"<script rel='stylesheet' src='app.css'> com <top>, <menu>, <main>, <image href='produto.jpg'>, <a src='mais.html'> e <bottom>."},
          {id:"c",label:"<css href='app.css'> com <header>, <navigation>, <body>, <img href='produto.jpg'>, <link src='mais.html'> e <footer>."},
          {id:"d",label:"<style src='app.css'> com <headbox>, <nav>, <content>, <photo src='produto.jpg'>, <url href='mais.html'> e <foot>."},
        ]}
      ), ["a"], ["kickoff"]),
      Q("frontend_check", 3, "Front-end — CSS essencial", "Quais regras CSS estão corretas para fundo, texto, fonte e negrito?", "quiz_multi", "individual", "frontend", .15, 50, G(
        "Marque todas as regras válidas de CSS básico.",
        "Design pode discutir resultado visual. Front-end envia a seleção técnica.",
        "3 min",
        {options:[
          {id:"a",label:"body { background-color: rgb(245,245,245); } define uma cor de fundo usando RGB."},
          {id:"b",label:"h1 { color: #1f2937; } define a cor do texto do título selecionado."},
          {id:"c",label:"body { font-family: Arial, sans-serif; } define uma família de fontes para a página."},
          {id:"d",label:"strong { text-bold: true; } é a propriedade CSS padrão para aplicar peso em negrito."},
        ]}
      ), ["a","b","c"], ["frontend_main"]),

      Q("database_main", 2, "Banco de Dados — consulta SQL", "Tabela equipamentos(id, nome, setor, status). A startup quer listar nome e status dos equipamentos do setor 'LAB' cujo status seja 'ativo'. Qual consulta atende ao pedido?", "quiz_single", "individual", "database", .45, 100, G(
        "Analise SELECT, FROM e WHERE. Os dois filtros precisam ser verdadeiros ao mesmo tempo.",
        "Back-end pode explicar como usaria o resultado. Banco de Dados envia a consulta.",
        "5 min",
        {options:[
          {id:"a",label:"SELECT nome, status FROM equipamentos WHERE setor = 'LAB' AND status = 'ativo';"},
          {id:"b",label:"SELECT nome, status FROM equipamentos WHERE setor = 'LAB' OR status = 'ativo';"},
          {id:"c",label:"SELECT setor, status FROM equipamentos WHERE nome = 'LAB' AND status = 'ativo';"},
          {id:"d",label:"SELECT nome, status FROM equipamentos WHERE setor = 'LAB' AND status = 'inativo';"},
        ]}
      ), ["a"], ["kickoff"]),
      Q("database_check", 3, "Banco de Dados — AND e OR", "Tabela: #1 Drone LAB ativo; #2 Roteador ADM ativo; #3 Notebook LAB manutenção; #4 Sensor LAB ativo. Quais registros atendem WHERE setor='LAB' AND (status='ativo' OR nome='Notebook')?", "quiz_multi", "individual", "database", .15, 50, G(
        "Aplique o filtro do setor e depois avalie as condições dentro dos parênteses.",
        "A equipe pode conferir os registros; Banco de Dados envia a seleção.",
        "3 min",
        {options:[
          {id:"a",label:"Registro #1 — Drone, setor LAB e status ativo."},
          {id:"b",label:"Registro #2 — Roteador, setor ADM e status ativo."},
          {id:"c",label:"Registro #3 — Notebook, setor LAB e status manutenção."},
          {id:"d",label:"Registro #4 — Sensor, setor LAB e status ativo."},
        ]}
      ), ["a","c","d"], ["database_main"]),

      Q("qa_main", 2, "QA — análise de código quebrado", "O código deveria calcular faturamento e exibir uma mensagem quando o valor superar 1000:\n\npreco = 50\nclientes = 25\nfaturamento = preco * clientess\nif faturamento > 1000\n    print('meta atingida')\n\nQuais erros precisam ser corrigidos?", "quiz_multi", "individual", "qa", .45, 100, G(
        "Marque os defeitos reais. Procure inconsistência de nome e sintaxe do if.",
        "Back-end pode explicar o fluxo esperado. QA registra os bugs encontrados.",
        "5 min",
        {options:[
          {id:"a",label:"clientess está diferente da variável clientes definida anteriormente e causa erro de nome."},
          {id:"b",label:"A instrução if precisa de dois-pontos ao final da condição antes do bloco indentado."},
          {id:"c",label:"O operador maior que não existe em Python e deve ser substituído pelo operador de atribuição."},
          {id:"d",label:"A função print não pode receber texto entre aspas e deve receber apenas valores numéricos."},
        ]}
      ), ["a","b"], ["kickoff"]),
      Q("qa_check", 3, "QA — priorizar falha", "Durante o teste, o botão tem um pequeno desalinhamento visual e, ao mesmo tempo, usuários conseguem enviar o mesmo pagamento duas vezes. Qual falha deve receber prioridade maior?", "quiz_single", "individual", "qa", .15, 50, G(
        "Escolha pela combinação de impacto, risco e gravidade para o usuário/negócio.",
        "Negócios e Back-end podem discutir impacto. QA registra a prioridade.",
        "2 min",
        {options:[
          {id:"a",label:"Pagamento duplicado, porque pode gerar dano financeiro e inconsistência de dados para usuários."},
          {id:"b",label:"Alinhamento visual, porque qualquer diferença de pixels sempre impede a operação do produto."},
          {id:"c",label:"As duas falhas têm exatamente a mesma gravidade e nunca precisam ser priorizadas."},
          {id:"d",label:"Nenhuma falha deve ser registrada até que o produto esteja completamente pronto para produção."},
        ]}
      ), ["a"], ["qa_main"]),

      Q("designer_main", 2, "Design — cores e fidelidade", "Quais afirmações estão corretas para uma interface digital que precisa ser legível e validável?", "quiz_multi", "individual", "designer", .45, 100, G(
        "Marque as afirmações corretas sobre RGB, tipografia, contraste e prototipação.",
        "Front-end pode discutir implementação. Design é responsável pela decisão visual.",
        "5 min",
        {options:[
          {id:"a",label:"RGB usa intensidades de vermelho, verde e azul para representar cores em telas digitais."},
          {id:"b",label:"Tipografia e contraste afetam leitura, hierarquia e facilidade de localizar informações importantes."},
          {id:"c",label:"Baixa fidelidade ajuda a testar organização e fluxo antes de investir em acabamento detalhado."},
          {id:"d",label:"Alta fidelidade deve evitar cores e tipografia para permanecer distante da aparência do produto final."},
        ]}
      ), ["a","b","c"], ["kickoff"]),
      Q("designer_check", 3, "Design — protótipo prático", "Crie no Figma ou Marvel App um protótipo da tela principal da InovaTrack com cabeçalho, menu, resumo de equipamentos, ocorrências/inspeções e ação principal. Cole o link compartilhável e indique se o protótipo está em baixa ou alta fidelidade.", "short_text", "individual", "designer", .15, 50, G(
        "Habilite acesso por link. Cole a URL e uma frase indicando o nível de fidelidade e a decisão visual principal.",
        "A equipe pode testar o protótipo. O Designer envia. Esta missão fica aguardando validação manual do professor.",
        "10–15 min, podendo continuar na próxima aula",
        {min_length:20,url_required:true,teacher_validation:true,placeholder:"https://www.figma.com/... ou https://marvelapp.com/...\nFidelidade: ...\nDecisão visual: ..."}
      ), null, ["designer_main"]),

      Q("cyber_main", 2, "Cyber — verificar SHA-256", "Documento recebido:\nSTARTUP-INSPECAO|cliente=AgroNova|versao=2|status=APROVADO\n\nHash SHA-256 de referência:\neb2eefb6a8b613ddcf843f74d3cfc990bdbaa6e1aeffc42a313d70fdbf328077\n\nGere SHA-256 para o texto exato e determine a integridade.", "quiz_single", "individual", "cyber", .45, 100, G(
        "Copie exatamente a linha, gere o hash SHA-256 em uma ferramenta e compare com a referência fornecida.",
        "Outro integrante pode conferir se o texto foi copiado corretamente. Cyber Segurança envia a conclusão.",
        "6 min",
        {options:[
          {id:"a",label:"O documento está íntegro porque o SHA-256 calculado coincide exatamente com a referência."},
          {id:"b",label:"O documento está alterado porque o SHA-256 calculado não coincide com a referência informada."},
          {id:"c",label:"O documento é íntegro apenas porque possui nome de cliente e um campo de versão preenchido."},
          {id:"d",label:"A comparação não é possível porque SHA-256 só pode ser utilizado para senhas de usuários."},
        ]}
      ), ["a"], ["kickoff"]),
      Q("cyber_check", 3, "Cyber — ameaças web", "Quais afirmações representam relações corretas entre ameaça e proteção?", "quiz_multi", "individual", "cyber", .15, 50, G(
        "Marque todas as alternativas corretas. Pense em validação, sanitização e proteção no servidor.",
        "Back-end pode discutir implementação. Cyber Segurança registra a análise final.",
        "4 min",
        {options:[
          {id:"a",label:"XSS pode explorar conteúdo injetado na página; escape de saída e sanitização adequada ajudam a reduzir o risco."},
          {id:"b",label:"SQL Injection pode explorar consultas montadas com entrada do usuário; parâmetros ajudam a evitar concatenação perigosa."},
          {id:"c",label:"Phishing usa engenharia social para induzir ações; verificar origem e usar canal oficial reduz o risco."},
          {id:"d",label:"DDoS é impedido apenas com CSS e JavaScript no navegador, sem necessidade de proteção de rede ou servidor."},
        ]}
      ), ["a","b","c"], ["cyber_main"]),

      Q("business_main", 2, "Negócios — Business Model Canvas", "Relacione os exemplos da InovaTrack aos nove blocos do Business Model Canvas.", "drag_match", "individual", "business", .45, 100, G(
        "Associe cada exemplo ao bloco do BMC que melhor representa aquela decisão de negócio.",
        "A equipe pode discutir proposta, público e custos. Inovação & Empreendedorismo envia o modelo.",
        "7 min",
        {items:[
          {id:"b1",label:"Pequenas empresas que precisam organizar equipamentos e inspeções."},
          {id:"b2",label:"Reduzir desorganização e facilitar decisões com informações centralizadas."},
          {id:"b3",label:"Site, demonstrações e contato comercial com empresas interessadas."},
          {id:"b4",label:"Onboarding, suporte e acompanhamento do cliente durante o uso."},
          {id:"b5",label:"Assinatura mensal conforme quantidade de usuários ou equipamentos."},
          {id:"b6",label:"Equipe técnica, infraestrutura e conhecimento do domínio atendido."},
          {id:"b7",label:"Desenvolver, operar, vender e melhorar continuamente a plataforma."},
          {id:"b8",label:"Provedores de nuvem e parceiros de implantação ou integração."},
          {id:"b9",label:"Infraestrutura, equipe, suporte, vendas e manutenção da solução."},
        ],targets:[
          {id:"segments",label:"Segmentos de clientes"},{id:"value",label:"Proposta de valor"},{id:"channels",label:"Canais"},
          {id:"relations",label:"Relacionamento com clientes"},{id:"revenue",label:"Fontes de receita"},{id:"resources",label:"Recursos principais"},
          {id:"activities",label:"Atividades principais"},{id:"partners",label:"Parcerias principais"},{id:"costs",label:"Estrutura de custos"},
        ]}
      ), {b1:"segments",b2:"value",b3:"channels",b4:"relations",b5:"revenue",b6:"resources",b7:"activities",b8:"partners",b9:"costs"}, ["kickoff"]),
      Q("business_check", 3, "Negócios — MVP, pitch, venda e negociação", "Quais estratégias combinam com validação de uma startup antes de escalar o produto?", "quiz_multi", "individual", "business", .15, 50, G(
        "Marque todas as estratégias coerentes com MVP, pitch, vendas e negociação.",
        "Todos podem discutir proposta de valor. Inovação & Empreendedorismo envia a decisão.",
        "4 min",
        {options:[
          {id:"a",label:"Usar um MVP para testar hipótese, observar comportamento e coletar feedback do público-alvo."},
          {id:"b",label:"Fazer um pitch curto conectando problema, solução, diferencial, público e chamada para o próximo passo."},
          {id:"c",label:"Em uma negociação, investigar interesses e limites para construir uma proposta de valor viável para as partes."},
          {id:"d",label:"Evitar conversar com clientes até que todas as funcionalidades imaginadas estejam prontas e sem possibilidade de mudança."},
        ]}
      ), ["a","b","c"], ["business_main"]),

      Q("final", 4, "Entrega da equipe — pitch técnico", "Registrem uma síntese final da startup: problema, público, áreas assumidas, duas decisões técnicas, um risco de segurança/qualidade, proposta de valor e o que entraria no MVP. Finalizem com uma estratégia simples de validação com usuários.", "short_text", "clan", null, .10, 150, G(
        "Escrevam um pitch técnico curto que conecte as contribuições das áreas escolhidas pela equipe.",
        "Todos revisam. O líder envia a resposta coletiva. O progresso fica salvo para continuidade entre as aulas.",
        "5 min",
        {min_length:200,placeholder:"Problema e público... Áreas... Decisões técnicas... Risco... Proposta de valor... MVP... Validação..."}
      ), null, ["kickoff"]),
    ],
  },
};

function elapsed(s: any) {
  if (!s.started_at) return 0;
  const end = s.status === "paused" && s.paused_at ? Date.parse(s.paused_at) : Date.now();
  return Math.max(0, Math.floor((end - Date.parse(s.started_at)) / 1000) - Number(s.pause_total_seconds || 0));
}
function remaining(s: any) {
  return Math.max(0, Number(s.duration_minutes || 0) * 60 - elapsed(s));
}
function lobbyRemaining(s: any) {
  if (!s.lobby_opened_at) return Number(s.lobby_duration_minutes || 15) * 60;
  const spent = Math.max(0, Math.floor((Date.now() - Date.parse(s.lobby_opened_at)) / 1000));
  return Math.max(0, Number(s.lobby_duration_minutes || 15) * 60 - spent);
}
async function refresh(db: any, s: any) {
  if (!s) return s;
  if (s.status === "score_scheduled" && s.score_publish_at && Date.parse(s.score_publish_at) <= Date.now()) {
    const { data } = await db.from("practical_exam_sessions").update({ status: "published", updated_at: now() }).eq("id", s.id).select().single();
    return data || s;
  }
  if (s.status === "running" && remaining(s) <= 0) {
    const { data } = await db.from("practical_exam_sessions").update({ status: "finished", finished_at: now(), updated_at: now() }).eq("id", s.id).select().single();
    return data || s;
  }
  return s;
}

async function staff(db: any, u: any) {
  const [{ data: p }, { data: w }] = await Promise.all([
    db.from("profiles").select("id,full_name,email,role,active,must_change_password").eq("id", u.id).maybeSingle(),
    db.from("staff_allowlist").select("role,full_name").eq("email", String(u.email).toLowerCase()).eq("active", true).maybeSingle(),
  ]);
  const role = String(w?.role || p?.role || "");
  if (!p?.active || p.must_change_password || !STAFF.includes(role)) return null;
  const admin = ["admin", "super_admin"].includes(role);
  const { data: t } = admin ? { data: [] } : await db.from("teacher_classes").select("class_id").eq("teacher_email", String(u.email).toLowerCase()).eq("active", true);
  return { role, admin, assigned: admin ? null : (t || []).map((x: any) => String(x.class_id)), full_name: w?.full_name || p.full_name };
}
function scope(ctx: any, cid: unknown) {
  if (!ctx.admin && !ctx.assigned.includes(String(cid))) throw new Error("class_out_of_scope");
}

async function recomputeLeader(db: any, sessionId: string, clanId: string) {
  const { data: members } = await db.from("practical_exam_members")
    .select("student_id,joined_at,updated_at")
    .eq("session_id", sessionId).eq("clan_id", clanId).neq("status","removed")
    .order("joined_at", { ascending: true });
  const valid = new Map((members || []).map((m:any)=>[String(m.student_id), m]));
  if (!valid.size) {
    await db.from("practical_exam_clans").update({ leader_id:null, leader_elected_at:null, updated_at:now() }).eq("id", clanId).eq("session_id", sessionId);
    return { leader_id:null, tied:false, counts:{} };
  }
  const { data: votes } = await db.from("practical_exam_leader_votes")
    .select("voter_id,candidate_id").eq("session_id", sessionId).eq("clan_id", clanId);
  const counts:Record<string,number> = {};
  for (const v of votes || []) {
    const voter=String(v.voter_id), candidate=String(v.candidate_id);
    if (!valid.has(voter) || !valid.has(candidate)) continue;
    counts[candidate]=(counts[candidate]||0)+1;
  }
  const maxVotes=Math.max(0,...Object.values(counts));
  const winners=maxVotes>0?Object.entries(counts).filter(([,n])=>n===maxVotes).map(([candidate])=>candidate):[];
  const leaderId=winners.length===1?winners[0]:null;
  await db.from("practical_exam_clans").update({
    leader_id:leaderId,
    leader_elected_at:leaderId?now():null,
    updated_at:now(),
  }).eq("id", clanId).eq("session_id", sessionId);
  return { leader_id:leaderId, tied:winners.length>1, counts, max_votes:maxVotes };
}

async function assertWaitingLeader(db:any, sessionId:string, userId:string) {
  const { data: member } = await db.from("practical_exam_members")
    .select("student_id,clan_id").eq("session_id", sessionId).eq("student_id", userId).neq("status","removed").maybeSingle();
  if (!member?.clan_id) throw new Error("join_room_first");
  const { data: session } = await db.from("practical_exam_sessions").select("status").eq("id", sessionId).maybeSingle();
  if (session?.status !== "waiting_room") throw new Error("room_settings_locked");
  const { data: clan } = await db.from("practical_exam_clans").select("*").eq("session_id",sessionId).eq("id",member.clan_id).eq("active",true).maybeSingle();
  if (!clan || String(clan.leader_id||"") !== String(userId)) throw new Error("leader_only");
  return { member, session, clan };
}

function xpParts(c: any) {
  const max = clamp(Math.round(Number(c.xp_max || 0)), 0, 500);
  const completion = Math.round(max * .4);
  return { max, completion, quality: max - completion };
}
function ownerForSubmission(sub: any) {
  if (sub.student_id) return { type: "student", ownerId: String(sub.student_id), student_id: sub.student_id, clan_id: null };
  return { type: "clan", ownerId: String(sub.clan_id), student_id: null, clan_id: sub.clan_id };
}
async function setXpAward(db: any, sub: any, challenge: any, component: "completion" | "quality", xp: number, maxXp: number) {
  const owner = ownerForSubmission(sub);
  const award_key = `${sub.session_id}:${sub.challenge_id}:${owner.type}:${owner.ownerId}:${component}`;
  const row = {
    session_id: sub.session_id,
    challenge_id: sub.challenge_id,
    student_id: owner.student_id,
    clan_id: owner.clan_id,
    component,
    xp: clamp(Math.round(xp), 0, Math.max(0, Math.round(maxXp))),
    max_xp: Math.max(0, Math.round(maxXp)),
    source_submission_id: sub.id,
    award_key,
    computed_at: now(),
    updated_at: now(),
  };
  const { error } = await db.from("practical_exam_xp_awards").upsert(row, { onConflict: "award_key" });
  if (error) throw error;
}
function automaticChallenge(type: string) {
  return ["quiz_single", "quiz_multi", "drag_match", "drag_classify", "drag_order"].includes(String(type));
}
function stringArray(v: any) {
  return Array.isArray(v) ? [...new Set(v.map((x) => String(x)).filter(Boolean))] : [];
}
function automaticAnswer(c: any, ans: any) {
  const type = String(c.challenge_type || "");
  const points = Number(c.points || 0);
  if (type === "quiz_single") {
    const choice = String(ans?.choice || "");
    const allowed = (c.public_config?.options || []).map((o: any) => String(o.id));
    if (!choice || !allowed.includes(choice)) throw new Error("invalid_answer");
    const correct = stringArray(c.answer_key?.correct);
    const ratio = correct.includes(choice) ? 1 : 0;
    return { answer: { choice }, score: Number((points * ratio).toFixed(2)), ratio };
  }
  if (type === "quiz_multi") {
    const choices = stringArray(ans?.choices);
    const allowed = (c.public_config?.options || []).map((o: any) => String(o.id));
    if (!choices.length || choices.some((x) => !allowed.includes(x))) throw new Error("invalid_answer");
    const correct = stringArray(c.answer_key?.correct);
    const correctSet = new Set(correct);
    const right = choices.filter((x) => correctSet.has(x)).length;
    const wrong = choices.length - right;
    const ratio = clamp((right - wrong) / Math.max(1, correct.length), 0, 1);
    return { answer: { choices }, score: Number((points * ratio).toFixed(2)), ratio };
  }
  if (type === "drag_match" || type === "drag_classify") {
    const items = (c.public_config?.items || []).map((x: any) => String(x.id));
    const targets = new Set((c.public_config?.targets || []).map((x: any) => String(x.id)));
    const raw = ans?.matches && typeof ans.matches === "object" && !Array.isArray(ans.matches) ? ans.matches : {};
    const matches: Record<string,string> = {};
    for (const item of items) {
      const target = String(raw[item] || "");
      if (!target || !targets.has(target)) throw new Error("complete_all_items");
      matches[item] = target;
    }
    const correct = c.answer_key?.correct && typeof c.answer_key.correct === "object" ? c.answer_key.correct : {};
    const hit = items.filter((item: string) => String(correct[item] || "") === matches[item]).length;
    const ratio = hit / Math.max(1, items.length);
    return { answer: { matches }, score: Number((points * ratio).toFixed(2)), ratio };
  }
  if (type === "drag_order") {
    const itemIds = (c.public_config?.items || []).map((x: any) => String(x.id));
    const order = stringArray(ans?.order);
    if (order.length !== itemIds.length || new Set(order).size !== itemIds.length || order.some((x) => !itemIds.includes(x))) throw new Error("complete_all_items");
    const correct = stringArray(c.answer_key?.correct);
    const hit = order.filter((x, i) => x === correct[i]).length;
    const ratio = hit / Math.max(1, correct.length);
    return { answer: { order }, score: Number((points * ratio).toFixed(2)), ratio };
  }
  throw new Error("challenge_requires_manual_answer");
}
async function syncXpAfterSubmit(db: any, sub: any, challenge: any) {
  const p = xpParts(challenge);
  await setXpAward(db, sub, challenge, "completion", p.completion, p.completion);
  if (automaticChallenge(challenge.challenge_type)) {
    const score = Number(sub.auto_score || 0);
    const ratio = Number(challenge.points || 0) > 0 ? clamp(score / Number(challenge.points), 0, 1) : 0;
    await setXpAward(db, sub, challenge, "quality", Math.round(p.quality * ratio), p.quality);
  } else {
    await setXpAward(db, sub, challenge, "quality", 0, p.quality);
  }
}
async function syncXpAfterGrade(db: any, sub: any, challenge: any) {
  const p = xpParts(challenge);
  await setXpAward(db, sub, challenge, "completion", p.completion, p.completion);
  const effective = Number(sub.manual_score ?? sub.auto_score ?? 0);
  const ratio = Number(challenge.points || 0) > 0 ? clamp(effective / Number(challenge.points), 0, 1) : 0;
  await setXpAward(db, sub, challenge, "quality", Math.round(p.quality * ratio), p.quality);
}

function phaseProgress(challenges: any[], submissions: any[]) {
  const ids = new Set(submissions.map((s: any) => String(s.challenge_id)));
  const phases: Record<string, any> = {};
  for (const c of challenges) {
    const k = String(c.phase_no || 1);
    const p = phases[k] || { completed: 0, total: 0, percent: 0 };
    p.total += 1;
    if (ids.has(String(c.id))) p.completed += 1;
    phases[k] = p;
  }
  for (const p of Object.values(phases) as any[]) p.percent = Math.round((p.completed / Math.max(1, p.total)) * 100);
  return phases;
}

function metrics(s: any, cs: any[], ms: any[], subs: any[], roles: any[], awards: any[]) {
  const roleById = new Map(roles.map((r: any) => [String(r.id), r.role_key]));
  const finalized = subs.filter((x: any) => String(x.status || "") !== "draft");
  const members: Record<string, any> = {};
  const clans: Record<string, any> = {};

  for (const m of ms) {
    const rk = roleById.get(String(m.role_id || ""));
    const mine = cs.filter((c: any) => c.scope === "individual" && c.role_key === rk);
    const ids = new Set(mine.map((c: any) => String(c.id)));
    const mySubs = finalized.filter((x: any) => String(x.student_id) === String(m.student_id) && ids.has(String(x.challenge_id)));
    const possible = mine.reduce((a: number, c: any) => a + Number(c.points || 0), 0);
    const earned = mySubs.reduce((a: number, x: any) => a + Number(x.manual_score ?? x.auto_score ?? 0), 0);
    const xpMax = mine.reduce((a: number, c: any) => a + Number(c.xp_max || 0), 0);
    const xpEarned = awards.filter((a: any) => String(a.student_id) === String(m.student_id)).reduce((a: number, x: any) => a + Number(x.xp || 0), 0);
    members[String(m.student_id)] = {
      role_key: rk || null,
      completed_count: mySubs.length,
      total_count: mine.length,
      progress_percent: Math.round((mySubs.length / Math.max(1, mine.length)) * 100),
      phase_progress: phaseProgress(mine, mySubs),
      individual_raw_score: possible ? (earned / possible) * Number(s.max_score) : 0,
      group_raw_score: 0,
      adjustment: Number(m.individual_adjustment || 0),
      final_score: 0,
      xp_earned: xpEarned,
      xp_max: xpMax,
      xp_percent: xpMax ? Math.round((xpEarned / xpMax) * 100) : 0,
      online: !!(m.last_seen_at && Date.now() - Date.parse(m.last_seen_at) < 70000),
      last_submission_at: mySubs.map((x: any) => x.submitted_at).filter(Boolean).sort().at(-1) || null,
    };
  }

  for (const clan of new Set(ms.map((m: any) => String(m.clan_id || "")).filter(Boolean))) {
    const team = ms.filter((m: any) => String(m.clan_id) === clan);
    const occupied = new Set(team.map((m: any) => roleById.get(String(m.role_id || ""))).filter(Boolean));
    const relevant = cs.filter((c: any) => c.scope === "clan" || occupied.has(c.role_key));
    const relevantIds = new Set(relevant.map((c: any) => String(c.id)));
    const teamSubs = finalized.filter((x: any) => String(x.clan_id) === clan && relevantIds.has(String(x.challenge_id)));
    const uniqueSubmitted = new Set(teamSubs.map((x: any) => String(x.challenge_id)));
    const possible = relevant.reduce((a: number, c: any) => a + Number(c.points || 0), 0);
    const earned = teamSubs.reduce((a: number, x: any) => a + Number(x.manual_score ?? x.auto_score ?? 0), 0);
    const groupRaw = possible ? (earned / possible) * Number(s.max_score) : 0;
    const clanChallenges = relevant.filter((c: any) => c.scope === "clan");
    const clanXpMax = clanChallenges.reduce((a: number, c: any) => a + Number(c.xp_max || 0), 0);
    const clanXp = awards.filter((a: any) => String(a.clan_id) === clan).reduce((a: number, x: any) => a + Number(x.xp || 0), 0);
    const memberMetrics = team.map((m: any) => members[String(m.student_id)]).filter(Boolean);
    const avgMemberXpPercent = memberMetrics.length ? memberMetrics.reduce((a: number, x: any) => a + Number(x.xp_percent || 0), 0) / memberMetrics.length : 0;
    const clanXpPercent = clanXpMax ? (clanXp / clanXpMax) * 100 : 0;
    const rankingXp = Math.round(clamp(avgMemberXpPercent, 0, 100) * 7 + clamp(clanXpPercent, 0, 100) * 3);
    clans[clan] = {
      completed_count: uniqueSubmitted.size,
      total_count: relevant.length,
      progress_percent: Math.round((uniqueSubmitted.size / Math.max(1, relevant.length)) * 100),
      phase_progress: phaseProgress(relevant, teamSubs),
      raw_score: clamp(groupRaw, 0, Number(s.max_score)),
      xp_earned_raw: memberMetrics.reduce((a: number, x: any) => a + Number(x.xp_earned || 0), 0) + clanXp,
      ranking_xp: rankingXp,
      member_xp_average_percent: Math.round(avgMemberXpPercent),
      clan_xp: clanXp,
      clan_xp_max: clanXpMax,
      online_count: memberMetrics.filter((x: any) => x.online).length,
      ready_count: team.filter((m: any) => !!m.role_id).length,
    };
    for (const m of team) {
      const mm = members[String(m.student_id)];
      if (!mm) continue;
      mm.group_raw_score = clans[clan].raw_score;
      mm.final_score = clamp(
        mm.group_raw_score * Number(s.group_weight) + mm.individual_raw_score * Number(s.individual_weight) + Number(mm.adjustment || 0),
        0,
        Number(s.max_score),
      );
    }
  }

  const teamRanking = Object.entries(clans).map(([clan_id, m]: any) => ({ clan_id, ...m }))
    .sort((a: any, b: any) => b.ranking_xp - a.ranking_xp || b.progress_percent - a.progress_percent || b.raw_score - a.raw_score);
  const studentRanking = ms.filter((m: any) => m.clan_id && m.role_id).map((m: any) => ({
    student_id: String(m.student_id),
    clan_id: String(m.clan_id),
    role_id: String(m.role_id),
    name: m.student?.full_name || "Aluno",
    ...members[String(m.student_id)],
  })).sort((a: any, b: any) => b.xp_earned - a.xp_earned || b.xp_percent - a.xp_percent || b.progress_percent - a.progress_percent || String(a.name).localeCompare(String(b.name), "pt-BR"));

  return { clans, members, rankings: { teams: teamRanking, students: studentRanking } };
}

function practicalLearningModeAccommodation(config: any) {
  const cfg = config && typeof config === "object" ? config : {};
  const features = cfg.features && typeof cfg.features === "object" ? cfg.features : {};
  const supervision = cfg.supervision && typeof cfg.supervision === "object" ? cfg.supervision : {};
  const profileKey = String(cfg.profile_key || cfg.adaptation_profile || "");
  const supervisionMode = String(supervision.mode || "");
  const home = profileKey.includes("home") || supervisionMode === "home_study" || supervisionMode === "relaxed" || supervision.require_fullscreen === false || features.independent_study === true || features.home_detailed_guidance === true;
  return {
    adapted: String(cfg.default_mode || "") === "adapted" || !!profileKey,
    reduce_motion: features.reduced_visual_load === true || features.predictable_feedback === true || cfg.reduce_motion === true,
    focus_mode: features.focus_cues !== false || features.reduced_visual_load === true,
    font_scale: features.larger_controls === true ? 1.12 : 1,
    fullscreen_optional: home,
    home_study: home,
    extra_checkpoints: features.extra_checkpoints === true || features.micro_steps === true,
  };
}
async function practicalStudentAccommodation(db: any, userId: string | null) {
  const base = { adapted:false, reduce_motion:false, focus_mode:false, font_scale:1, fullscreen_optional:false, home_study:false, extra_checkpoints:false };
  if (!userId) return base;
  try {
    const { data: row, error } = await db.from("student_accommodations")
      .select("config").eq("student_id", userId).is("exercise_id", null)
      .eq("accommodation_type", "learning_mode").eq("active", true)
      .order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (error || !row?.config) return base;
    return { ...base, ...practicalLearningModeAccommodation(row.config) };
  } catch {
    return base;
  }
}

async function bundle(db: any, s: any, studentId: string | null = null, isStaff = false) {
  const [ca, ro, ch, me, su, xp, votes, blocked] = await Promise.all([
    db.from("practical_exam_clans").select("*").eq("session_id", s.id).eq("active", true).order("display_order"),
    db.from("practical_exam_roles").select("*").eq("session_id", s.id).eq("active", true).order("display_order"),
    db.from("practical_exam_challenges").select(isStaff ? "*" : "id,session_id,challenge_key,phase_no,title,prompt,challenge_type,scope,role_key,points,xp_max,public_config,depends_on_keys,display_order,active").eq("session_id", s.id).eq("active", true).order("phase_no").order("display_order"),
    db.from("practical_exam_members").select("*").eq("session_id", s.id).neq("status", "removed"),
    db.from("practical_exam_submissions").select("*").eq("session_id", s.id),
    db.from("practical_exam_xp_awards").select("session_id,challenge_id,student_id,clan_id,component,xp,max_xp,source_submission_id,computed_at").eq("session_id", s.id),
    db.from("practical_exam_leader_votes").select("clan_id,voter_id,candidate_id,updated_at").eq("session_id", s.id),
    studentId ? db.from("practical_exam_clan_blocks").select("clan_id").eq("session_id",s.id).eq("student_id",studentId).eq("active",true) : Promise.resolve({data:[]}),
  ]);
  const { data: classMemberships } = await db.from("class_memberships").select("user_id").eq("class_id",s.class_id).eq("active",true);
  const classIds=(classMemberships||[]).map((x:any)=>String(x.user_id));
  const memberIds=(me.data||[]).map((x:any)=>String(x.student_id));
  const allIds=[...new Set([...classIds,...memberIds])];
  const { data: ps } = allIds.length ? await db.from("profiles").select("id,full_name,email,role,active").in("id", allIds).eq("role","student").eq("active",true) : { data: [] };
  const pm = new Map((ps || []).map((p: any) => [String(p.id), p]));
  const members = (me.data || []).map((m: any) => ({ ...m, student: pm.get(String(m.student_id)) })).filter((m:any)=>m.student);
  const M = metrics(s, ch.data || [], members, su.data || [], ro.data || [], xp.data || []);
  const clansRaw=ca.data||[];
  const clanMap=new Map(clansRaw.map((c:any)=>[String(c.id),c]));
  const roleMap=new Map((ro.data||[]).map((r:any)=>[String(r.id),r]));

  const sessionWithTimers = { ...s, remaining_seconds: remaining(s), lobby_remaining_seconds: lobbyRemaining(s) };
  if (isStaff) {
    const staffMembers = members.map((m:any)=>({
      ...m,
      is_leader:!!m.clan_id&&String(clanMap.get(String(m.clan_id))?.leader_id||"")===String(m.student_id),
      progress:M.members[String(m.student_id)]||null,
    }));
    const { data: ev } = await db.from("practical_exam_events").select("*").eq("session_id", s.id).order("occurred_at", { ascending: false }).limit(200);
    return { session: sessionWithTimers, clans: clansRaw, roles: ro.data || [], challenges: ch.data || [], members:staffMembers, submissions: su.data || [], events: ev || [], metrics: M, leader_votes:votes.data||[] };
  }

  const accommodation = await practicalStudentAccommodation(db, studentId);
  const mine = members.find((m: any) => String(m.student_id) === String(studentId));
  const clan = mine?.clan_id ? String(mine.clan_id) : null;
  const currentClan=clan?clanMap.get(clan):null;
  const rawTeam = members.filter((m: any) => clan && String(m.clan_id) === clan);
  const leaderId = currentClan?.leader_id ? String(currentClan.leader_id) : null;
  const leader=leaderId?rawTeam.find((m:any)=>String(m.student_id)===leaderId)||null:null;
  const role = (ro.data || []).find((r: any) => String(r.id) === String(mine?.role_id));
  const tids = new Set(rawTeam.map((m: any) => String(m.student_id)));
  const visible = (su.data || []).filter((x: any) => x.student_id ? tids.has(String(x.student_id)) : String(x.clan_id) === String(clan));
  const finalizedVisible = visible.filter((x: any) => String(x.status || "") !== "draft");
  const done = new Set(finalizedVisible.map((x: any) => (ch.data || []).find((c: any) => String(c.id) === String(x.challenge_id))?.challenge_key).filter(Boolean));
  const challenges = (ch.data || []).map((c: any) => {
    const locked = (c.depends_on_keys || []).some((k: string) => !done.has(k));
    const own = visible.find((x: any) => String(x.challenge_id) === String(c.id) && (c.scope === "clan" ? String(x.clan_id) === String(clan) : String(x.student_id) === String(studentId)));
    const draft = own && String(own.status) === "draft";
    const allowedOwner = c.scope === "clan" ? String(studentId) === leaderId : c.role_key === role?.role_key;
    return {
      ...c,
      locked,
      team_submitted: done.has(c.challenge_key),
      can_submit: s.status === "running" && !locked && !!clan && allowedOwner && !done.has(c.challenge_key),
      can_edit_draft: ["running","paused"].includes(String(s.status)) && !locked && !!clan && allowedOwner && !done.has(c.challenge_key),
      submission: own ? { id: own.id, status: own.status, answer: own.answer, submitted_at: own.submitted_at, updated_at: own.updated_at, draft, ...(s.status === "published" && !draft ? { score: Number(own.manual_score ?? own.auto_score ?? 0), feedback: own.feedback } : {}) } : null,
    };
  });
  const myMetric = mine ? M.members[String(studentId)] : null;
  const teamMetric = clan ? M.clans[clan] || null : null;
  const team = rawTeam.map((m: any) => ({
    ...m,
    is_leader: String(m.student_id) === leaderId,
    progress: M.members[String(m.student_id)] || null,
  }));
  const clanNames = new Map(clansRaw.map((x: any) => [String(x.id), x.name]));
  const publicRankings = {
    teams: (M.rankings.teams || []).map((x: any, i: number) => ({ position:i+1, clan_id:x.clan_id, name:clanNames.get(String(x.clan_id)) || "Equipe", xp:Number(x.ranking_xp||0), progress_percent:Number(x.progress_percent||0) })),
    students: (M.rankings.students || []).map((x: any, i: number) => ({ position:i+1, student_id:x.student_id, name:x.name, clan_id:x.clan_id, clan_name:clanNames.get(String(x.clan_id)) || "Equipe", role_key:x.role_key, xp:Number(x.xp_earned||0), xp_percent:Number(x.xp_percent||0), progress_percent:Number(x.progress_percent||0) })),
  };
  const roomStudentRanking=(M.rankings.students||[]).filter((x:any)=>clan&&String(x.clan_id)===clan).map((x:any,i:number)=>({
    position:i+1,student_id:x.student_id,name:x.name,role_key:x.role_key,xp:Number(x.xp_earned||0),progress_percent:Number(x.progress_percent||0)
  }));

  const memberByStudent=new Map(members.map((m:any)=>[String(m.student_id),m]));
  const roster=(ps||[]).filter((x:any)=>classIds.includes(String(x.id))).sort((a:any,b:any)=>String(a.full_name||"").localeCompare(String(b.full_name||""),"pt-BR")).map((p:any)=>{
    const m=memberByStudent.get(String(p.id));
    const c=m?.clan_id?clanMap.get(String(m.clan_id)):null;
    const r=m?.role_id?roleMap.get(String(m.role_id)):null;
    return { student_id:p.id,name:p.full_name||"Aluno",clan_id:m?.clan_id||null,clan_name:c?.name||null,role_id:m?.role_id||null,role_key:r?.role_key||null,role_name:r?.name||null,is_leader:!!c?.leader_id&&String(c.leader_id)===String(p.id) };
  });
  const roomCards=clansRaw.map((c:any)=>({
    id:c.id,name:c.name,display_order:c.display_order,theme_key:c.theme_key||"cyber",accent_color:c.accent_color||"#22d3ee",mascot_key:c.mascot_key||"robot",emblem_data_url:c.emblem_data_url||null,company_name:c.company_name||"",company_cnpj:c.company_cnpj||"",company_city:c.company_city||"",company_phone:c.company_phone||"",leader_id:c.leader_id||null,
    count:members.filter((m:any)=>String(m.clan_id)===String(c.id)).length,
    members:members.filter((m:any)=>String(m.clan_id)===String(c.id)).map((m:any)=>({student_id:m.student_id,name:m.student?.full_name||"Aluno",role_id:m.role_id||null,role_name:roleMap.get(String(m.role_id||""))?.name||null,is_leader:String(c.leader_id||"")===String(m.student_id)})),
  }));
  const teamVotes=(votes.data||[]).filter((v:any)=>clan&&String(v.clan_id)===clan);
  const counts:Record<string,number>={};
  for(const v of teamVotes) counts[String(v.candidate_id)]=(counts[String(v.candidate_id)]||0)+1;
  const maxVotes=Math.max(0,...Object.values(counts));
  const tied=maxVotes>0&&Object.values(counts).filter((n:any)=>Number(n)===maxVotes).length>1;
  const election=clan?{
    my_vote:teamVotes.find((v:any)=>String(v.voter_id)===String(studentId))?.candidate_id||null,
    counts,
    max_votes:maxVotes,
    tied,
    total_votes:teamVotes.length,
  }:null;

  return {
    session: {
      id: s.id,
      class_id: s.class_id,
      subject_name: s.subject_name,
      subject_slug: s.subject_slug,
      title: s.title,
      description: s.description,
      status: s.status,
      lobby_duration_minutes: s.lobby_duration_minutes,
      lobby_opened_at: s.lobby_opened_at,
      lobby_remaining_seconds: lobbyRemaining(s),
      duration_minutes: s.duration_minutes,
      max_score: s.max_score,
      group_weight: s.group_weight,
      individual_weight: s.individual_weight,
      max_clan_size: s.max_clan_size,
      started_at: s.started_at,
      paused_at: s.paused_at,
      finished_at: s.finished_at,
      score_publish_at: s.score_publish_at,
      remaining_seconds: remaining(s),
    },
    accommodation,
    clans: roomCards,
    roles: ro.data || [],
    me: mine ? { ...mine, is_leader: String(mine.student_id) === leaderId } : null,
    leader: leader ? { student_id:leader.student_id, name:leader.student?.full_name || "Líder" } : null,
    election,
    lobby_roster:roster,
    blocked_clan_ids:(blocked.data||[]).map((x:any)=>String(x.clan_id)),
    team,
    challenges,
    rankings: { ...publicRankings, room_students:roomStudentRanking },
    team_progress: teamMetric,
    xp: mine ? { individual: { earned: myMetric?.xp_earned || 0, max: myMetric?.xp_max || 0, percent: myMetric?.xp_percent || 0 }, team: { ranking_xp: teamMetric?.ranking_xp || 0, progress_percent: teamMetric?.progress_percent || 0 } } : null,
    score: s.status === "published" && mine ? M.members[String(studentId)] : null,
  };
}

async function pending(db: any, sid: string) {
  const { data } = await db.from("practical_exam_submissions").select("manual_score,challenge:practical_exam_challenges(challenge_type)").eq("session_id", sid).neq("status", "draft");
  return (data || []).filter((x: any) => ["short_text", "code_text"].includes(x.challenge?.challenge_type) && x.manual_score == null).length;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const ah = req.headers.get("Authorization") || "";
    const a = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: ah } } });
    const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const { data: { user } } = await a.auth.getUser();
    if (!user) return J({ error: "unauthorized" }, 401);
    const live = await requireLiveAuthSession(db, ah, user.id);
    if (!live.ok) return J({ error: live.error }, live.status);
    const { data: p } = await db.from("profiles").select("role,active,must_change_password").eq("id", user.id).maybeSingle();
    if (!p?.active || p.must_change_password) return J({ error: "forbidden" }, 403);
    const b = await req.json().catch(() => ({}));
    const act = String(b.action || "student_state");

    if (act === "hub_state") {
      if (p.role === "student") {
        const { data: m } = await db.from("class_memberships").select("class_id").eq("user_id", user.id).eq("active", true);
        const ids = (m || []).map((x: any) => x.class_id);
        if (!ids.length) return J({ active: false, count: 0 });
        const { data: ss } = await db.from("practical_exam_sessions").select("id,title,subject_name,status,class_id,lobby_duration_minutes,lobby_opened_at,duration_minutes").in("class_id", ids).in("status", ["waiting_room", "locked", "running", "paused"]).order("created_at", { ascending: false });
        return J({ active: !!ss?.length, count: ss?.length || 0, session: ss?.[0] || null, role: "student" });
      }
      const c = await staff(db, user);
      if (!c) return J({ active: false, count: 0 });
      let q = db.from("practical_exam_sessions").select("id,title,subject_name,status,class_id,lobby_duration_minutes,lobby_opened_at,duration_minutes").in("status", ["waiting_room", "locked", "running", "paused"]);
      if (!c.admin) q = q.in("class_id", c.assigned);
      const { data } = await q;
      return J({ active: !!data?.length, count: data?.length || 0, session: data?.[0] || null, role: c.role });
    }

    if (act === "student_state") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const { data: m } = await db.from("class_memberships").select("class_id").eq("user_id", user.id).eq("active", true);
      const cids = (m || []).map((x: any) => String(x.class_id));
      const sid = id(b.session_id);
      if (!sid) {
        const accommodation = await practicalStudentAccommodation(db, user.id);
        if (!cids.length) return J({ sessions: [], accommodation });
        const { data: ss } = await db.from("practical_exam_sessions").select("*").in("class_id", cids).in("status", ["waiting_room", "locked", "running", "paused", "finished", "grading", "score_scheduled", "published"]).order("created_at", { ascending: false }).limit(12);
        const out = [];
        for (let s of ss || []) out.push(await refresh(db, s));
        return J({ sessions: out.map((s: any) => ({ ...s, remaining_seconds: remaining(s), lobby_remaining_seconds: lobbyRemaining(s) })), accommodation });
      }
      let { data: s } = await db.from("practical_exam_sessions").select("*").eq("id", sid).maybeSingle();
      if (!s || !cids.includes(String(s.class_id))) return J({ error: "out_of_scope" }, 403);
      s = await refresh(db, s);
      return J(await bundle(db, s, user.id, false));
    }

    if (act === "join_clan") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const sid=id(b.session_id), newClan=id(b.clan_id);
      const { data: before } = await db.from("practical_exam_members").select("clan_id").eq("session_id",sid).eq("student_id",user.id).maybeSingle();
      const oldClan=before?.clan_id?String(before.clan_id):null;
      const { data, error } = await a.rpc("practical_exam_join_clan", { p_session_id:sid, p_clan_id:newClan });
      if (error) return J({ error: error.message }, 409);
      await db.from("practical_exam_leader_votes").delete().eq("session_id",sid).eq("voter_id",user.id);
      if(oldClan&&oldClan!==newClan){
        await db.from("practical_exam_leader_votes").delete().eq("session_id",sid).eq("clan_id",oldClan).eq("candidate_id",user.id);
        await recomputeLeader(db,sid,oldClan);
      }
      await recomputeLeader(db,sid,newClan);
      return J(data || { ok:true });
    }

    if (act === "select_role") return J({ error:"role_assignment_by_leader" },403);

    if (act === "leave_clan") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const sid = id(b.session_id);
      const { data: s } = await db.from("practical_exam_sessions").select("status").eq("id", sid).maybeSingle();
      if (s?.status !== "waiting_room") return J({ error: "waiting_room_closed" }, 409);
      const { data: member }=await db.from("practical_exam_members").select("clan_id").eq("session_id",sid).eq("student_id",user.id).maybeSingle();
      const oldClan=member?.clan_id?String(member.clan_id):null;
      await db.from("practical_exam_members").update({ clan_id: null, role_id: null, status: "waiting", updated_at: now() }).eq("session_id", sid).eq("student_id", user.id);
      await db.from("practical_exam_leader_votes").delete().eq("session_id",sid).or(`voter_id.eq.${user.id},candidate_id.eq.${user.id}`);
      if(oldClan)await recomputeLeader(db,sid,oldClan);
      return J({ ok: true });
    }

    if (act === "vote_leader") {
      if (p.role !== "student") return J({ error:"student_only" },403);
      const sid=id(b.session_id), candidate=id(b.candidate_id);
      const { data:s }=await db.from("practical_exam_sessions").select("status").eq("id",sid).maybeSingle();
      if(s?.status!=="waiting_room")return J({error:"voting_closed"},409);
      const { data:me }=await db.from("practical_exam_members").select("clan_id").eq("session_id",sid).eq("student_id",user.id).neq("status","removed").maybeSingle();
      if(!me?.clan_id)return J({error:"join_room_first"},409);
      const { data:target }=await db.from("practical_exam_members").select("student_id").eq("session_id",sid).eq("clan_id",me.clan_id).eq("student_id",candidate).neq("status","removed").maybeSingle();
      if(!target)return J({error:"candidate_not_in_room"},409);
      const z=await db.from("practical_exam_leader_votes").upsert({session_id:sid,clan_id:me.clan_id,voter_id:user.id,candidate_id:candidate,updated_at:now()},{onConflict:"session_id,voter_id"});
      if(z.error)throw z.error;
      const election=await recomputeLeader(db,sid,String(me.clan_id));
      await db.from("practical_exam_events").insert({session_id:sid,student_id:user.id,clan_id:me.clan_id,actor_id:user.id,event_type:"leader_vote",metadata:{candidate_id:candidate,tied:election.tied}});
      return J({ok:true,election});
    }

    if (act === "leader_update_room") {
      if (p.role !== "student") return J({ error:"student_only" },403);
      const sid=id(b.session_id);
      let ctx;
      try{ctx=await assertWaitingLeader(db,sid,user.id);}catch(e){return J({error:String((e as Error).message)},403);}
      const theme=String(b.theme_key||ctx.clan.theme_key||"cyber");
      if(!ROOM_THEMES.has(theme))return J({error:"invalid_theme"},400);
      const mascot=String(b.mascot_key||ctx.clan.mascot_key||"robot");
      if(!ROOM_MASCOTS.has(mascot))return J({error:"invalid_mascot"},400);
      const accent=String(b.accent_color||ctx.clan.accent_color||"#22d3ee");
      if(!/^#[0-9A-Fa-f]{6}$/.test(accent))return J({error:"invalid_accent_color"},400);
      let emblem=null;try{emblem=safeEmblem(b.emblem_data_url??ctx.clan.emblem_data_url);}catch(error){return J({error:String((error as Error).message)},400);}
      const name=String(b.name||ctx.clan.name||"").trim().slice(0,42);
      if(name.length<2)return J({error:"room_name_too_short"},400);
      const patch={
        name,
        theme_key:theme,
        accent_color:accent,
        mascot_key:mascot,
        emblem_data_url:emblem,
        company_name:String(b.company_name||"").trim().slice(0,80)||null,
        company_cnpj:String(b.company_cnpj||"").trim().slice(0,24)||null,
        company_city:String(b.company_city||"").trim().slice(0,80)||null,
        company_phone:String(b.company_phone||"").trim().slice(0,30)||null,
        updated_at:now(),
      };
      const z=await db.from("practical_exam_clans").update(patch).eq("id",ctx.clan.id).eq("session_id",sid).select().single();
      if(z.error)throw z.error;
      await db.from("practical_exam_events").insert({session_id:sid,clan_id:ctx.clan.id,actor_id:user.id,event_type:"leader_room_updated",metadata:{theme_key:theme,accent_color:accent,mascot_key:mascot,emblem_updated:Object.prototype.hasOwnProperty.call(b,"emblem_data_url")}});
      return J({ok:true,clan:z.data});
    }

    if (act === "leader_assign_role") {
      if (p.role !== "student") return J({ error:"student_only" },403);
      const sid=id(b.session_id), student=id(b.student_id), roleId=id(b.role_id);
      let ctx;
      try{ctx=await assertWaitingLeader(db,sid,user.id);}catch(e){return J({error:String((e as Error).message)},403);}
      const [{data:target},{data:roleRow}]=await Promise.all([
        db.from("practical_exam_members").select("student_id,clan_id").eq("session_id",sid).eq("student_id",student).eq("clan_id",ctx.clan.id).neq("status","removed").maybeSingle(),
        db.from("practical_exam_roles").select("id").eq("session_id",sid).eq("id",roleId).eq("active",true).maybeSingle(),
      ]);
      if(!target)return J({error:"member_not_in_room"},404);
      if(!roleRow)return J({error:"role_not_found"},404);
      const {data:taken}=await db.from("practical_exam_members").select("student_id").eq("session_id",sid).eq("clan_id",ctx.clan.id).eq("role_id",roleId).neq("student_id",student).neq("status","removed").maybeSingle();
      if(taken)return J({error:"role_taken"},409);
      const z=await db.from("practical_exam_members").update({role_id:roleId,role_selected_at:now(),status:"ready",updated_at:now()}).eq("session_id",sid).eq("student_id",student).select().single();
      if(z.error)throw z.error;
      await db.from("practical_exam_events").insert({session_id:sid,student_id:student,clan_id:ctx.clan.id,actor_id:user.id,event_type:"leader_role_assigned",metadata:{role_id:roleId}});
      return J({ok:true,member:z.data});
    }

    if (act === "leader_kick_member") {
      if (p.role !== "student") return J({ error:"student_only" },403);
      const sid=id(b.session_id), student=id(b.student_id);
      let ctx;
      try{ctx=await assertWaitingLeader(db,sid,user.id);}catch(e){return J({error:String((e as Error).message)},403);}
      if(student===String(user.id))return J({error:"leader_cannot_kick_self"},409);
      const {data:target}=await db.from("practical_exam_members").select("student_id").eq("session_id",sid).eq("student_id",student).eq("clan_id",ctx.clan.id).neq("status","removed").maybeSingle();
      if(!target)return J({error:"member_not_in_room"},404);
      await db.from("practical_exam_members").update({clan_id:null,role_id:null,status:"waiting",updated_at:now()}).eq("session_id",sid).eq("student_id",student);
      await db.from("practical_exam_clan_blocks").upsert({session_id:sid,clan_id:ctx.clan.id,student_id:student,kicked_by:user.id,active:true,reason:"leader_kick",updated_at:now()},{onConflict:"session_id,clan_id,student_id"});
      await db.from("practical_exam_leader_votes").delete().eq("session_id",sid).eq("clan_id",ctx.clan.id).or(`voter_id.eq.${student},candidate_id.eq.${student}`);
      await recomputeLeader(db,sid,String(ctx.clan.id));
      await db.from("practical_exam_events").insert({session_id:sid,student_id:student,clan_id:ctx.clan.id,actor_id:user.id,event_type:"leader_member_kicked",metadata:{}});
      return J({ok:true});
    }


    if (act === "team_chat_list" || act === "team_chat_send") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const sid = id(b.session_id);
      const { data: session } = await db.from("practical_exam_sessions").select("id,class_id,status").eq("id", sid).maybeSingle();
      if (!session) return J({ error: "not_found" }, 404);
      const { data: membership } = await db.from("class_memberships").select("user_id")
        .eq("class_id", session.class_id).eq("user_id", user.id).eq("active", true).maybeSingle();
      if (!membership) return J({ error: "out_of_scope" }, 403);
      const { data: member } = await db.from("practical_exam_members")
        .select("clan_id,status").eq("session_id", sid).eq("student_id", user.id).maybeSingle();
      if (!member?.clan_id || member.status === "removed") return J({ error: "join_guild_first" }, 409);
      if (act === "team_chat_send") {
        if (!["waiting_room","locked","running","paused"].includes(String(session.status))) return J({ error: "chat_unavailable" }, 409);
        const message = String(b.message || "").trim().slice(0, 500);
        if (!message) return J({ error: "empty_message" }, 400);
        const { data: last } = await db.from("practical_exam_team_chat_messages")
          .select("created_at").eq("session_id", sid).eq("sender_id", user.id)
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (last?.created_at && Date.now() - Date.parse(last.created_at) < 900) return J({ error: "chat_rate_limited" }, 429);
        const inserted = await db.from("practical_exam_team_chat_messages").insert({
          session_id: sid, clan_id: member.clan_id, sender_id: user.id, message,
        }).select("id,session_id,clan_id,sender_id,message,created_at").single();
        if (inserted.error) throw inserted.error;
        await db.from("practical_exam_events").insert({
          session_id:sid,student_id:user.id,clan_id:member.clan_id,actor_id:user.id,
          event_type:"team_chat_message",metadata:{message_id:inserted.data.id}
        });
      }
      const { data: rows, error } = await db.from("practical_exam_team_chat_messages")
        .select("id,sender_id,message,created_at").eq("session_id", sid).eq("clan_id", member.clan_id)
        .order("created_at", { ascending: true }).limit(100);
      if (error) throw error;
      const senderIds=[...new Set((rows||[]).map((x:any)=>String(x.sender_id)))];
      const { data: profiles } = senderIds.length
        ? await db.from("profiles").select("id,full_name").in("id",senderIds)
        : { data: [] };
      const names=new Map((profiles||[]).map((x:any)=>[String(x.id),String(x.full_name||"Aluno")]));
      return J({ messages:(rows||[]).map((x:any)=>({...x,sender_name:names.get(String(x.sender_id))||"Aluno"})) });
    }

    if (act === "heartbeat") {
      await db.from("practical_exam_members").update({ last_seen_at: now(), status: "active", updated_at: now() }).eq("session_id", id(b.session_id)).eq("student_id", user.id);
      return J({ ok: true });
    }

    if (act === "log_event") {
      const sid = id(b.session_id), type = String(b.event_type || "");
      if (!["focus_exit", "fullscreen_exit", "reconnect", "help_opened"].includes(type)) return J({ error: "invalid_event" }, 400);
      const { data: m } = await db.from("practical_exam_members").select("clan_id").eq("session_id", sid).eq("student_id", user.id).maybeSingle();
      if (m) await db.from("practical_exam_events").insert({ session_id: sid, student_id: user.id, clan_id: m.clan_id, actor_id: user.id, event_type: type, metadata: {} });
      return J({ ok: true });
    }

    if (act === "save_draft") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const sid = id(b.session_id), cid = id(b.challenge_id);
      const { data: s } = await db.from("practical_exam_sessions").select("status").eq("id", sid).maybeSingle();
      if (!s || !["running","paused"].includes(String(s.status))) return J({ error: "exam_not_available" }, 409);
      const [{ data: m }, { data: c }] = await Promise.all([
        db.from("practical_exam_members").select("*,role:practical_exam_roles(role_key)").eq("session_id", sid).eq("student_id", user.id).maybeSingle(),
        db.from("practical_exam_challenges").select("id,scope,role_key,challenge_type,public_config").eq("id", cid).eq("session_id", sid).eq("active", true).maybeSingle(),
      ]);
      if (!m?.clan_id || !c) return J({ error: "not_ready" }, 403);
      if (c.scope === "individual" && c.role_key !== m.role?.role_key) return J({ error: "challenge_belongs_to_another_role" }, 403);
      if (c.scope === "clan") {
        const { data: clanRow } = await db.from("practical_exam_clans").select("leader_id").eq("session_id",sid).eq("id",m.clan_id).maybeSingle();
        if (!clanRow?.leader_id || String(clanRow.leader_id) !== String(user.id)) return J({ error: "leader_only_collective_submission" }, 403);
      }
      const ans = b.answer && typeof b.answer === "object" ? b.answer : {};
      let safeAnswer:any = ans;
      if (["short_text","code_text"].includes(String((c as any).challenge_type))) {
        const text = String(ans.text || "").slice(0,7000);
        safeAnswer = { text };
      }
      const existing = c.scope === "clan"
        ? await db.from("practical_exam_submissions").select("id,status").eq("challenge_id", cid).eq("clan_id", m.clan_id).is("student_id", null).maybeSingle()
        : await db.from("practical_exam_submissions").select("id,status").eq("challenge_id", cid).eq("student_id", user.id).maybeSingle();
      if (existing.data && String(existing.data.status) !== "draft") return J({ ok:true, already_submitted:true });
      const row:any = { session_id:sid,challenge_id:cid,clan_id:m.clan_id,submitted_by:user.id,answer:safeAnswer,status:"draft",updated_at:now(),submitted_at:null,auto_score:null,manual_score:null,feedback:null,reviewed_at:null,reviewed_by:null };
      const z = existing.data
        ? await db.from("practical_exam_submissions").update(row).eq("id", existing.data.id).select("id,status,updated_at").single()
        : await db.from("practical_exam_submissions").insert(c.scope === "clan" ? {...row,student_id:null} : {...row,student_id:user.id}).select("id,status,updated_at").single();
      if (z.error) throw z.error;
      return J({ ok:true, draft:z.data });
    }

    if (act === "submit") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const sid = id(b.session_id), cid = id(b.challenge_id);
      let { data: s } = await db.from("practical_exam_sessions").select("*").eq("id", sid).maybeSingle();
      s = await refresh(db, s);
      if (s?.status !== "running") return J({ error: s?.status === "paused" ? "exam_paused" : "exam_not_running" }, 409);
      const [{ data: m }, { data: c }] = await Promise.all([
        db.from("practical_exam_members").select("*,role:practical_exam_roles(role_key)").eq("session_id", sid).eq("student_id", user.id).maybeSingle(),
        db.from("practical_exam_challenges").select("*").eq("id", cid).eq("session_id", sid).eq("active", true).maybeSingle(),
      ]);
      if (!m?.clan_id || !c) return J({ error: "not_ready" }, 403);
      if (c.scope === "individual" && c.role_key !== m.role?.role_key) return J({ error: "challenge_belongs_to_another_role" }, 403);
      if (c.scope === "clan") {
        const { data: clanRow } = await db.from("practical_exam_clans").select("leader_id").eq("session_id",sid).eq("id",m.clan_id).maybeSingle();
        if (!clanRow?.leader_id || String(clanRow.leader_id) !== String(user.id)) return J({ error: "leader_only_collective_submission" }, 403);
      }
      if ((c.depends_on_keys || []).length) {
        const d = await bundle(db, s, user.id, false);
        const cc = d.challenges.find((x: any) => String(x.id) === cid);
        if (cc?.locked) return J({ error: "dependencies_pending" }, 409);
      }

      const existing = c.scope === "clan"
        ? await db.from("practical_exam_submissions").select("id,status").eq("challenge_id", cid).eq("clan_id", m.clan_id).is("student_id", null).maybeSingle()
        : await db.from("practical_exam_submissions").select("id,status").eq("challenge_id", cid).eq("student_id", user.id).maybeSingle();
      if (existing.data && String(existing.data.status) !== "draft") return J({ error: "already_submitted" }, 409);

      const ans = b.answer && typeof b.answer === "object" ? b.answer : {};
      const base: any = { session_id: sid, challenge_id: cid, clan_id: m.clan_id, submitted_by: user.id, answer: ans, status: "submitted", submitted_at: now(), updated_at: now() };
      if (automaticChallenge(c.challenge_type)) {
        try {
          const graded = automaticAnswer(c, ans);
          base.answer = graded.answer;
          base.auto_score = graded.score;
        } catch (e) {
          const code = String((e as Error)?.message || "invalid_answer");
          return J({ error: code }, 400);
        }
      } else {
        const text = String(ans.text || "").trim();
        const min = Number(c.public_config?.min_length || 10);
        if (text.length < min) return J({ error: "answer_too_short", min_length: min }, 400);
        if (text.length > 7000) return J({ error: "answer_too_long" }, 400);
        if (c.public_config?.url_required && !/https?:\/\/[^\s]+/i.test(text)) return J({ error: "prototype_link_required" }, 400);
        base.answer = { text };
      }
      const insertRow = c.scope === "clan" ? { ...base, student_id: null } : { ...base, student_id: user.id };
      const z = existing.data
        ? await db.from("practical_exam_submissions").update(insertRow).eq("id", existing.data.id).select().single()
        : await db.from("practical_exam_submissions").insert(insertRow).select().single();
      if (z.error) {
        if (String(z.error.code) === "23505") return J({ error: "already_submitted" }, 409);
        throw z.error;
      }
      await syncXpAfterSubmit(db, z.data, c);
      await db.from("practical_exam_events").insert({ session_id: sid, student_id: user.id, clan_id: m.clan_id, actor_id: user.id, event_type: "challenge_submitted", metadata: { challenge_id: cid } });
      return J({ ok: true, submission: z.data });
    }

    const c = await staff(db, user);
    if (!c) return J({ error: "staff_only" }, 403);

    if (act === "staff_simulator_catalog") {
      let cq = db.from("classes").select("id,code,name,shift").eq("active", true).order("name");
      if (!c.admin) cq = cq.in("id", c.assigned);
      const { data: classes } = await cq;
      const requestedClass = id(b.class_id);
      let roster: any[] = [];
      if (requestedClass) {
        scope(c, requestedClass);
        const { data: cm } = await db.from("class_memberships").select("user_id").eq("class_id", requestedClass).eq("active", true);
        const ids = (cm || []).map((x: any) => x.user_id);
        if (ids.length) {
          const { data: r } = await db.from("profiles").select("id,full_name").in("id", ids).eq("role", "student").eq("active", true).order("full_name");
          roster = r || [];
        }
      }
      return J({
        staff: { id: c.id, full_name: c.full_name, role: c.role, admin: c.admin },
        classes: classes || [],
        roster,
        roles: ROLES.map((r) => ({ role_key: r[0], name: r[1], icon: r[2], description: r[3] })),
        room_themes: [...ROOM_THEMES],
        room_mascots: [...ROOM_MASCOTS],
        templates: Object.entries(T).map(([key, v]) => ({
          key, subject_slug: v.subject_slug, subject_name: v.subject_name, description: v.description,
          challenges: v.challenges.map((x) => ({ ...x, public_config: x.public_config || {}, answer_key: x.answer_key || {} }))
        })),
        simulation: true
      });
    }

    if (act === "staff_overview") {
      let q = db.from("practical_exam_sessions").select("*").order("created_at", { ascending: false }).limit(80);
      if (!c.admin) q = q.in("class_id", c.assigned);
      const { data: ss } = await q;
      let cq = db.from("classes").select("id,code,name,shift").eq("active", true).order("name");
      if (!c.admin) cq = cq.in("id", c.assigned);
      const { data: classes } = await cq;
      const { data: subjects } = await db.from("subjects").select("id,slug,name").eq("active", true).order("name");
      let detail = null;
      const sid = id(b.session_id);
      if (sid) {
        let s = ss?.find((x: any) => String(x.id) === sid);
        if (!s) s = (await db.from("practical_exam_sessions").select("*").eq("id", sid).maybeSingle()).data;
        if (s) {
          s = await refresh(db, s);
          scope(c, s.class_id);
          detail = await bundle(db, s, null, true);
          const { data: cm } = await db.from("class_memberships").select("user_id").eq("class_id", s.class_id).eq("active", true);
          const ids = (cm || []).map((x: any) => x.user_id);
          const { data: r } = ids.length ? await db.from("profiles").select("id,full_name,email").in("id", ids).eq("role", "student").eq("active", true).order("full_name") : { data: [] };
          detail.roster = r || [];
        }
      }
      return J({ staff: c, classes: classes || [], subjects: subjects || [], sessions: ss || [], detail, templates: Object.entries(T).map(([key, v]) => ({ key, subject_slug: v.subject_slug, subject_name: v.subject_name, description: v.description })) });
    }

    if (act === "create_session") {
      const class_id = id(b.class_id), tk = String(b.template_key || ""), title = String(b.title || "").trim(), t = T[tk];
      if (!class_id || !t || !title) return J({ error: "missing_or_invalid_parameters" }, 400);
      scope(c, class_id);
      const max = clamp(Number(b.max_score || 5), .5, 100), gw = clamp(Number(b.group_weight ?? .5), 0, 1);
      const { data: s, error } = await db.from("practical_exam_sessions").insert({
        class_id,
        subject_slug: t.subject_slug,
        subject_name: t.subject_name,
        title: title.slice(0, 180),
        description: String(b.description || t.description).slice(0, 1200),
        template_key: tk,
        status: "draft",
        lobby_duration_minutes: clamp(Number(b.lobby_duration_minutes || 15), 5, 60),
        duration_minutes: clamp(Number(b.duration_minutes || 50), 10, 180),
        max_score: max,
        group_weight: gw,
        individual_weight: 1 - gw,
        max_clan_size: clamp(Number(b.max_clan_size || 6), 2, 6),
        created_by: user.id,
      }).select().single();
      if (error) throw error;
      const n = clamp(Number(b.clan_count || 6), 2, 12);
      await Promise.all([
        db.from("practical_exam_clans").insert(Array.from({ length: n }, (_, i) => ({ session_id: s.id, name: `SALA ${i+1}`, display_order: i + 1, theme_key:"cyber" }))),
        db.from("practical_exam_roles").insert(ROLES.map((r, i) => ({ session_id: s.id, role_key: r[0], name: r[1], icon: r[2], description: r[3], display_order: i + 1 }))),
        db.from("practical_exam_challenges").insert(t.challenges.map((x, i) => ({ ...x, session_id: s.id, points: Number((x.points * max / 5).toFixed(2)), display_order: i + 1 }))),
      ]);
      return J({ ok: true, session: s });
    }

    if (act === "update_session_settings") {
      const sid = id(b.session_id);
      const { data: s } = await db.from("practical_exam_sessions").select("*").eq("id", sid).maybeSingle();
      if (!s) return J({ error: "not_found" }, 404);
      scope(c, s.class_id);
      if (!["draft", "waiting_room", "locked"].includes(s.status) || s.started_at) return J({ error: "settings_locked_after_start" }, 409);
      const maxClan = clamp(Number(b.max_clan_size ?? s.max_clan_size), 2, 6);
      const { data: counts } = await db.from("practical_exam_members").select("clan_id").eq("session_id", sid).neq("status", "removed");
      const byClan = new Map<string, number>();
      for (const m of counts || []) if (m.clan_id) byClan.set(String(m.clan_id), (byClan.get(String(m.clan_id)) || 0) + 1);
      if ([...byClan.values()].some((n) => n > maxClan)) return J({ error: "new_clan_limit_below_current_occupancy" }, 409);
      const gw = clamp(Number(b.group_weight ?? s.group_weight), 0, 1);
      const z = await db.from("practical_exam_sessions").update({
        max_clan_size: maxClan,
        lobby_duration_minutes: clamp(Number(b.lobby_duration_minutes ?? s.lobby_duration_minutes), 5, 60),
        duration_minutes: clamp(Number(b.duration_minutes ?? s.duration_minutes), 10, 180),
        group_weight: gw,
        individual_weight: 1 - gw,
        updated_at: now(),
      }).eq("id", sid).select().single();
      if (z.error) throw z.error;
      await db.from("practical_exam_events").insert({ session_id: sid, actor_id: user.id, event_type: "session_settings_updated", metadata: { max_clan_size: maxClan } });
      return J({ ok: true, session: z.data });
    }

    if (act === "session_control") {
      const sid = id(b.session_id), cmd = String(b.command || "");
      const { data: s } = await db.from("practical_exam_sessions").select("*").eq("id", sid).maybeSingle();
      if (!s) return J({ error: "not_found" }, 404);
      scope(c, s.class_id);
      const x: any = { updated_at: now() };
      if (cmd === "open_waiting" && ["draft", "locked"].includes(s.status)) { x.status = "waiting_room"; x.lobby_opened_at = now(); }
      else if (cmd === "lock" && s.status === "waiting_room") x.status = "locked";
      else if (cmd === "start" && ["waiting_room", "locked"].includes(s.status)) {
        const { data: ready } = await db.from("practical_exam_members").select("student_id,clan_id,role_id").eq("session_id", sid).neq("status","removed");
        const assigned = (ready || []).filter((m:any)=>m.clan_id);
        if(!assigned.length)return J({error:"no_teams_ready"},409);
        const pendingAreas = assigned.filter((m:any)=>!m.role_id);
        if (pendingAreas.length) return J({ error:"areas_pending", pending:pendingAreas.length },409);
        const occupied=[...new Set(assigned.map((m:any)=>String(m.clan_id)))];
        const {data:roomRows}=await db.from("practical_exam_clans").select("id,leader_id").eq("session_id",sid).in("id",occupied);
        const missingLeaders=(roomRows||[]).filter((r:any)=>!r.leader_id);
        if(missingLeaders.length)return J({error:"leaders_pending",pending:missingLeaders.length},409);
        x.status = "running"; x.started_at = s.started_at || now(); x.paused_at = null;
      }
      else if (cmd === "pause" && s.status === "running") { x.status = "paused"; x.paused_at = now(); }
      else if (cmd === "resume" && s.status === "paused") { x.status = "running"; x.pause_total_seconds = Number(s.pause_total_seconds || 0) + (s.paused_at ? Math.floor((Date.now() - Date.parse(s.paused_at)) / 1000) : 0); x.paused_at = null; }
      else if (cmd === "finish" && ["running", "paused", "locked"].includes(s.status)) { x.status = "finished"; x.finished_at = now(); x.paused_at = null; }
      else if (cmd === "grading" && ["finished", "score_scheduled"].includes(s.status)) { x.status = "grading"; x.score_publish_at = null; }
      else if (cmd === "add_time") x.duration_minutes = Number(s.duration_minutes) + clamp(Number(b.minutes || 5), 1, 60);
      else if (cmd === "schedule_scores" && ["finished", "grading", "score_scheduled"].includes(s.status)) {
        const pc = await pending(db, sid); if (pc) return J({ error: "manual_grading_pending", pending: pc }, 409);
        if (!b.publish_at || Date.parse(b.publish_at) <= Date.now()) return J({ error: "invalid_publish_time" }, 400);
        x.status = "score_scheduled"; x.score_publish_at = new Date(b.publish_at).toISOString();
      } else if (cmd === "publish_scores" && ["finished", "grading", "score_scheduled"].includes(s.status)) {
        const pc = await pending(db, sid); if (pc) return J({ error: "manual_grading_pending", pending: pc }, 409);
        x.status = "published"; x.score_publish_at = now();
      } else if (cmd === "cancel" && s.status !== "published") x.status = "cancelled";
      else return J({ error: "invalid_transition" }, 409);
      const z = await db.from("practical_exam_sessions").update(x).eq("id", sid).select().single();
      if (z.error) throw z.error;
      await db.from("practical_exam_events").insert({ session_id: sid, actor_id: user.id, event_type: `session_${cmd}`, metadata: {} });
      return J({ ok: true, session: z.data });
    }

    if (act === "move_member") {
      const sid = id(b.session_id), student = id(b.student_id), clan = b.clan_id ? id(b.clan_id) : null, role = b.role_id ? id(b.role_id) : null;
      const { data: s } = await db.from("practical_exam_sessions").select("*").eq("id", sid).maybeSingle();
      if (!s) return J({ error: "not_found" }, 404);
      scope(c, s.class_id);
      if(s.started_at || ["running","paused","finished","grading","score_scheduled","published","cancelled"].includes(String(s.status))) return J({error:"team_composition_locked_after_start"},409);
      const [{ data: membership }, { data: studentProfile }, {data:oldMember}] = await Promise.all([
        db.from("class_memberships").select("user_id").eq("class_id", s.class_id).eq("user_id", student).eq("active", true).maybeSingle(),
        db.from("profiles").select("id,role,active").eq("id", student).maybeSingle(),
        db.from("practical_exam_members").select("student_id,clan_id").eq("session_id",sid).eq("student_id",student).maybeSingle(),
      ]);
      if (!membership || !studentProfile?.active || studentProfile.role !== "student") return J({ error: "student_out_of_scope" }, 403);
      const oldClan=oldMember?.clan_id?String(oldMember.clan_id):null;
      if (clan) {
        const { count } = await db.from("practical_exam_members").select("*", { count: "exact", head: true }).eq("session_id", sid).eq("clan_id", clan).neq("student_id", student).neq("status", "removed");
        if (Number(count) >= Number(s.max_clan_size)) return J({ error: "clan_full" }, 409);
      }
      if (role && clan) {
        const { data: taken } = await db.from("practical_exam_members").select("student_id").eq("session_id", sid).eq("clan_id", clan).eq("role_id", role).neq("student_id", student).neq("status", "removed").maybeSingle();
        if (taken) return J({ error: "role_taken" }, 409);
      }
      const row: any = { session_id: sid, student_id: student, clan_id: clan, role_id: clan ? role : null, status: clan ? (role ? "ready" : "waiting") : "waiting", updated_at: now(), last_seen_at: now() };
      const z = oldMember ? await db.from("practical_exam_members").update(row).eq("session_id", sid).eq("student_id", student).select().single() : await db.from("practical_exam_members").insert(row).select().single();
      if (z.error) throw z.error;
      await db.from("practical_exam_leader_votes").delete().eq("session_id",sid).or(`voter_id.eq.${student},candidate_id.eq.${student}`);
      if(clan)await db.from("practical_exam_clan_blocks").update({active:false,updated_at:now()}).eq("session_id",sid).eq("clan_id",clan).eq("student_id",student);
      if(oldClan)await recomputeLeader(db,sid,oldClan);
      if(clan&&clan!==oldClan)await recomputeLeader(db,sid,clan);
      await db.from("practical_exam_events").insert({ session_id: sid, student_id: student, clan_id: clan, actor_id: user.id, event_type: "member_moved_by_staff", metadata: { role_id: role } });
      return J({ ok: true, member: z.data });
    }

    if (act === "grade_submission") {
      const subId = id(b.submission_id);
      const { data: x } = await db.from("practical_exam_submissions").select("*,challenge:practical_exam_challenges(*),session:practical_exam_sessions(class_id,status)").eq("id", subId).maybeSingle();
      if (!x) return J({ error: "not_found" }, 404);
      scope(c, x.session.class_id);
      if (x.session.status === "published") return J({ error: "scores_already_published" }, 409);
      const score = clamp(Number(b.score || 0), 0, Number(x.challenge.points));
      const z = await db.from("practical_exam_submissions").update({ manual_score: score, feedback: String(b.feedback || "").slice(0, 2000) || null, status: "reviewed", reviewed_at: now(), reviewed_by: user.id, updated_at: now() }).eq("id", subId).select().single();
      if (z.error) throw z.error;
      await syncXpAfterGrade(db, z.data, x.challenge);
      await db.from("practical_exam_events").insert({ session_id: x.session_id, student_id: x.student_id, clan_id: x.clan_id, actor_id: user.id, event_type: "submission_graded", metadata: { challenge_id: x.challenge_id, score } });
      return J({ ok: true, submission: z.data });
    }

    if (act === "update_challenge") {
      const cid = id(b.challenge_id);
      const { data: x } = await db.from("practical_exam_challenges").select("session_id").eq("id", cid).maybeSingle();
      const { data: s } = x ? await db.from("practical_exam_sessions").select("class_id,status,started_at").eq("id", x.session_id).maybeSingle() : { data: null };
      if (!s) return J({ error: "not_found" }, 404);
      scope(c, s.class_id);
      if (s.started_at || ["running", "paused", "finished", "grading", "score_scheduled", "published", "cancelled"].includes(s.status)) return J({ error: "challenge_edit_locked" }, 409);
      const z = await db.from("practical_exam_challenges").update({
        phase_no: clamp(Number(b.phase_no || 1), 1, 50),
        points: clamp(Number(b.points || 0), 0, 100),
        xp_max: clamp(Math.round(Number(b.xp_max || 0)), 0, 500),
        updated_at: now(),
      }).eq("id", cid).select().single();
      if (z.error) throw z.error;
      return J({ ok: true, challenge: z.data });
    }

    if (act === "reset_submission") {
      const rid = id(b.submission_id);
      const { data: x } = await db.from("practical_exam_submissions").select("session_id,student_id,clan_id,challenge_id").eq("id", rid).maybeSingle();
      const { data: s } = x ? await db.from("practical_exam_sessions").select("class_id,status").eq("id", x.session_id).maybeSingle() : { data: null };
      if (!s) return J({ error: "not_found" }, 404);
      scope(c, s.class_id);
      if (s.status === "published") return J({ error: "scores_already_published" }, 409);
      await db.from("practical_exam_xp_awards").delete().eq("source_submission_id", rid);
      await db.from("practical_exam_submissions").delete().eq("id", rid);
      if (s.status === "score_scheduled") await db.from("practical_exam_sessions").update({ status: "grading", score_publish_at: null, updated_at: now() }).eq("id", x.session_id);
      await db.from("practical_exam_events").insert({ session_id: x.session_id, student_id: x.student_id, clan_id: x.clan_id, actor_id: user.id, event_type: "submission_reopened", metadata: { challenge_id: x.challenge_id } });
      return J({ ok: true });
    }

    return J({ error: "unknown_action" }, 400);
  } catch (e) {
    const m = String((e as Error)?.message || e);
    return J({ error: m.includes("out_of_scope") ? m : "internal_error", detail: m }, m.includes("out_of_scope") ? 403 : 500);
  }
});
