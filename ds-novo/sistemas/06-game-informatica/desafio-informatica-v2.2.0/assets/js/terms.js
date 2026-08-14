import { APP_VERSION } from './data.js?v=20260811r38';

const enc=new TextEncoder();

export const GENERAL_TERMS={
  id:'desafio-informatica-termo-geral',
  version:'1.2.0',
  updatedAt:'2026-08-03',
  title:'Termo de Ciência, Uso Responsável e Compromisso Pedagógico',
  summary:'Para utilizar esta plataforma, comprometo-me a realizar as atividades conforme as orientações do professor e as normas da escola. Não alterarei código, armazenamento, pontuação, XP, respostas, tempo ou registros para obter vantagem. Entendo que a plataforma tem finalidade exclusivamente educacional e que cenários, personagens, dados e situações podem ser fictícios ou simulados.',
  sections:[
    {title:'1. Finalidade educacional',text:'Esta plataforma é utilizada exclusivamente para aprendizagem, prática, revisão, diagnóstico, recuperação, experimentação, simulação e produção de evidências escolares. A tecnologia, a gamificação e os relatórios existem para apoiar o aprendizado, não para substituir a orientação do professor.'},
    {title:'2. Realização das atividades',text:'O estudante deve realizar pessoalmente as etapas solicitadas, seguir a sequência pedagógica, dedicar o tempo previsto, entregar a evidência no formato indicado, observar o prazo do Google Classroom e informar dificuldades técnicas de forma verdadeira. Etapas somente podem ser puladas quando a atividade permitir ou quando houver autorização registrada do professor.'},
    {title:'3. Integridade acadêmica',text:'Não é permitido copiar respostas sem autorização, entregar atividade feita por outra pessoa, modificar pontuação, XP, tempo, progresso, tentativas, respostas, emblemas, resultados ou evidências; importar arquivos adulterados; explorar falhas para obter vantagem; apagar registros; falsificar conclusão; ou orientar colegas a burlar a atividade.'},
    {title:'4. Código e ferramentas de desenvolvimento',text:'Não é permitido alterar DOM, objetos globais, IndexedDB, localStorage, Cache API, arquivos JSON, parâmetros da URL, arquivos exportados ou o código da plataforma para obter vantagem. Ferramentas de desenvolvedor somente podem ser utilizadas quando fizerem parte da atividade ou forem autorizadas pelo professor. Uma falha encontrada deve ser comunicada, não explorada.'},
    {title:'5. Uso responsável dos equipamentos',text:'Devem ser respeitadas as normas da escola e do laboratório. Não se deve instalar programas sem autorização, acessar contas de outras pessoas, apagar arquivos de colegas, alterar configurações do equipamento escolar, danificar dispositivos ou abandonar uma sessão desbloqueada em computador compartilhado.'},
    {title:'6. Segurança e cibersegurança',text:'Qualquer conteúdo de segurança deve ser utilizado somente em ambientes educacionais autorizados, simulados, locais ou expressamente liberados pelo professor. Não é permitido atacar redes, contas, sites, serviços, equipamentos ou dados reais, testar senhas de terceiros, fazer varreduras externas ou executar ações fora do escopo da atividade.'},
    {title:'7. Cenários fictícios e simulações',text:'Empresas, redes, incidentes, personagens, credenciais, mensagens, documentos, moedas, transações e demais elementos podem ser fictícios, adaptados ou simulados para fins pedagógicos. Eles não representam acusações, fatos reais ou autorização para agir fora da plataforma.'},
    {title:'8. Colaboração e feedback',text:'Erros e sugestões devem ser relatados com respeito e, quando possível, com módulo, etapa, navegador, dispositivo e passos para reproduzir. O feedback não autoriza automaticamente a publicação do nome completo do estudante e não deve incluir dados pessoais desnecessários.'},
    {title:'9. XP, recompensas e gamificação',text:'XP, emblemas, minijogos e recompensas são elementos virtuais educacionais. Não possuem valor financeiro, não podem ser vendidos e não determinam nota. Nesta plataforma não existe compra com dinheiro real, saque, investimento, criptomoeda ou conversão de recompensa em benefício financeiro.'},
    {title:'10. Registro de progresso e auditoria',text:'A plataforma pode registrar localmente progresso, etapas, tentativas, tempo de participação, exportações, importações, aceite dos termos, mudanças de versão, eventos de integridade e autorizações do professor. Esses registros auxiliam continuidade, segurança, avaliação pedagógica e comprovação da atividade.'},
    {title:'11. Dados pessoais e privacidade',text:'Somente os dados necessários ao funcionamento e à identificação da atividade devem ser utilizados. O aceite não autoriza coleta ilimitada, publicidade, venda de dados, publicação automática de nome ou imagem, monitoramento invasivo ou compartilhamento com anunciantes. Os perfis protegidos ficam criptografados no navegador do usuário.'},
    {title:'12. Créditos e reconhecimento',text:'Contribuições de estudantes podem ser reconhecidas por turma, grupo, primeiro nome e inicial ou apelido aprovado. Não devem ser publicados e-mail, nota, diagnóstico, identificação acadêmica, dados sensíveis ou comentários privados completos sem autorização e finalidade pedagógica clara.'},
    {title:'13. Inconsistências e revisão humana',text:'Quando houver indício de adulteração, a plataforma pode colocar o resultado em análise, bloquear temporariamente uma ação, preservar o último estado válido e solicitar revisão. Não deve haver punição automática definitiva sem conferência humana e aplicação das normas da escola.'},
    {title:'14. Acessibilidade e apoio',text:'Dificuldade técnica, necessidade educacional específica, recurso de acessibilidade ou adaptação autorizada não devem ser tratados como trapaça. O estudante pode solicitar ajuda, adaptação, revisão humana e alternativa de acesso quando necessário.'},
    {title:'15. Atualizações',text:'Alterações relevantes nas regras, privacidade, segurança, exportação, integrações ou responsabilidades exigem novo aceite. Os registros anteriores permanecem no histórico. Correções sem mudança de sentido podem ser registradas sem bloquear novamente a atividade.'},
    {title:'16. Declaração final',text:'Ao aceitar, o estudante confirma que teve acesso ao resumo, pôde abrir o termo completo e a política de privacidade, compreendeu a finalidade educacional e as regras de integridade e sabe que pode pedir esclarecimentos ao professor.'}
  ]
};

export const PRIVACY_NOTICE={
  id:'desafio-informatica-privacidade',
  version:'1.0.0',
  updatedAt:'2026-07-30',
  title:'Política de Privacidade em linguagem simples',
  points:[
    'A plataforma funciona sem backend próprio e não envia o perfil para um servidor da plataforma.',
    'Nome, turma, progresso, respostas, resultados, preferências e aceites podem ficar no navegador, dentro de um perfil criptografado com senha.',
    'A sessão temporária não garante permanência depois que a aba, o navegador ou o equipamento forem fechados ou limpos.',
    'Arquivos de resultado e backup somente são criados quando o usuário escolhe exportar. O destino final do arquivo é controlado pelo navegador e pelo sistema operacional.',
    'Abrir o Google Classroom não confirma que a atividade foi entregue. A plataforma não possui OAuth nem API do Classroom.',
    'Não são solicitados localização, câmera, microfone, biometria, contatos ou histórico de navegação nesta versão.',
    'O usuário pode exportar o perfil protegido, remover o perfil deste computador e consultar os registros de aceite.',
    'O perfil local é renovado por até 10 dias após cada salvamento; o navegador pode remover os dados antes em modo privado, por política administrativa ou por limpeza manual.',
    'Logs locais ajudam a detectar inconsistências, mas não são equivalentes a uma auditoria central ou prova absoluta de identidade.'
  ]
};

export const SIMULATION_NOTICE={
  id:'desafio-informatica-simulacoes',version:'1.0.0',updatedAt:'2026-07-30',
  title:'Aviso de Cenários Educacionais e Simulações Fictícias',
  text:'As planilhas, empresas, pessoas, mensagens, valores, redes, incidentes, personagens e situações apresentados nas atividades podem ser fictícios ou adaptados. Eles existem para praticar Informática Empresarial e competências tecnológicas em ambiente seguro. Não devem ser interpretados como fatos reais, acusações ou autorização para acessar sistemas, contas, redes ou dados sem permissão.'
};

export const EDUCATIONAL_USE_NOTICE={
  id:'desafio-informatica-uso-educacional',version:'1.0.0',
  text:'Todo o conteúdo desta plataforma foi criado para aprendizagem, prática segura e desenvolvimento de competências tecnológicas. Não utilize códigos, técnicas ou ferramentas para acessar, testar, modificar, prejudicar ou interferir em sistemas, redes, contas, dispositivos ou dados sem autorização.'
};

export const PERMISSIONS_MANIFEST={
  schema:'agv-permissions-manifest',schemaVersion:1,version:'1.0.0',platformId:'desafio-informatica-agv',updatedAt:'2026-07-30',
  permissions:[
    {id:'persistent-storage',permission:'Armazenamento persistente',required:false,educationalPurpose:'Manter o perfil criptografado, o progresso e os aceites neste dispositivo.',dataUsed:['perfil','progresso','resultados','preferências','aceites'],processingLocation:'dispositivo',stored:true,retention:'até 10 dias desde o último salvamento, sujeito às políticas do navegador',shared:false,fallbackMode:'sessão temporária e exportação manual',revocationInstructions:'Remova o perfil pela Central de perfis ou limpe os dados do site no navegador.',enabled:true},
    {id:'file-import',permission:'Seleção de arquivo',required:false,educationalPurpose:'Importar um backup de perfil ou resultado escolhido pelo próprio usuário.',dataUsed:['somente o arquivo selecionado'],processingLocation:'dispositivo',stored:'somente após validação e confirmação',retention:'conforme o perfil ou cofre local',shared:false,fallbackMode:'continuar sem importar',revocationInstructions:'Cancele o seletor ou remova os dados importados.',enabled:true},
    {id:'file-export',permission:'Download de arquivo',required:false,educationalPurpose:'Gerar PDF, resultado, termo ou backup para continuidade e entrega.',dataUsed:['dados da atividade atual'],processingLocation:'dispositivo',stored:'arquivo criado pelo navegador',retention:'controlada pelo usuário',shared:false,fallbackMode:'continuar e tentar novamente em navegador compatível',revocationInstructions:'Apague o arquivo na pasta Downloads quando não for mais necessário.',enabled:true},
    {id:'clipboard-write',permission:'Copiar para a área de transferência',required:false,educationalPurpose:'Copiar o código-base EduAuth ou informações explicitamente selecionadas.',dataUsed:['texto solicitado pelo usuário'],processingLocation:'dispositivo',stored:false,retention:'temporária na área de transferência',shared:false,fallbackMode:'digitação manual',revocationInstructions:'Não use o botão copiar; substitua o conteúdo da área de transferência.',enabled:true},
    {id:'speech-synthesis',permission:'Síntese de voz',required:false,educationalPurpose:'Ler o código-base EduAuth em voz alta como recurso de acessibilidade.',dataUsed:['código-base público'],processingLocation:'dispositivo',stored:false,retention:'somente durante a leitura',shared:false,fallbackMode:'leitura visual ou cópia',revocationInstructions:'Interrompa a leitura ou desative voz no aparelho.',enabled:true}
  ],
  explicitlyNotRequested:['câmera','microfone','localização','notificações','Bluetooth','USB','biometria','reconhecimento facial']
};

export const ACTIVITY_RULES={
  guided:{
    id:'guided-rules',version:'1.2.0',title:'Regras do Modo Guiado',
    rules:['As aulas do 1º e do 2º ADM podem ser abertas sem senha, inclusive para estudo em casa e regularização de atividades atrasadas.','A atividade segue etapas progressivas e registra o progresso.','A aula é registrada como concluída assim que todas as etapas forem finalizadas.','O comprovante em PDF é liberado após 5 minutos de sessão ou por código coletivo do professor baseado na turma, data e hora.','A atividade foi planejada para aproximadamente 15 a 25 minutos, sem impedir continuidade posterior.','A atividade deve ser realizada pelo estudante, com ajuda permitida conforme orientação do professor.','A evidência final é um PDF a ser anexado no Google Classroom.','Acertos, correções, tentativas e uso da ajuda são indicadores pedagógicos e não determinam a nota automaticamente.'],
    teacherAuthorizationRequired:false
  },
  'diagnostic-general':{
    id:'diagnostic-general-rules',version:'1.1.0',title:'Regras do Diagnóstico Geral',
    rules:['O diagnóstico possui finalidade educacional e não produz laudo clínico.','São previstas 66 questões e tempo máximo de 50 minutos.','O resultado automático é liberado após pelo menos 15 minutos, salvo código coletivo do professor baseado na turma, data e hora.','Cópia, colagem, troca de aba e tentativas de atalhos podem gerar eventos de integridade local.','Questões não respondidas permanecem identificadas no relatório.','Proficiência, evidências e critérios do professor são mais importantes que XP ou velocidade.'],
    teacherAuthorizationRequired:false
  },
  'diagnostic-class':{
    id:'diagnostic-class-rules',version:'1.1.0',title:'Regras do Diagnóstico da Turma',
    rules:['O diagnóstico possui finalidade educacional e não produz laudo clínico.','São previstas 55 questões com aprofundamento nos conteúdos da turma e tempo máximo de 50 minutos.','O resultado automático é liberado após pelo menos 15 minutos, salvo código coletivo do professor baseado na turma, data e hora.','Cópia, colagem, troca de aba e tentativas de atalhos podem gerar eventos de integridade local.','Questões não respondidas permanecem identificadas no relatório.','A interpretação final deve ser realizada pelo professor e não depende de moedas, compras ou cosméticos.'],
    teacherAuthorizationRequired:false
  }
};

function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==='object')return Object.keys(value).sort().reduce((out,key)=>{out[key]=stable(value[key]);return out},{});
  return value;
}
function hex(bytes){return [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function digest(value){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(JSON.stringify(stable(value))))))}
function uid(){return crypto.randomUUID?.()||[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,'0')).join('')}
function now(){return new Date().toISOString()}

export async function prepareTermsRuntime(){
  const termsHash=await digest({summary:GENERAL_TERMS.summary,sections:GENERAL_TERMS.sections,privacy:PRIVACY_NOTICE,simulation:SIMULATION_NOTICE,educationalUse:EDUCATIONAL_USE_NOTICE});
  const activityHashes={};for(const [key,rules] of Object.entries(ACTIVITY_RULES))activityHashes[key]=await digest(rules);
  return {termsHash,activityHashes};
}

export function validGeneralAcceptance(record,{profileId,termsHash}={}){
  return Boolean(record&&record.status==='ACCEPTED'&&record.profileId===profileId&&record.termsId===GENERAL_TERMS.id&&record.termsVersion===GENERAL_TERMS.version&&record.termsHash===termsHash&&record.platformVersion===APP_VERSION);
}

export function validActivityAcceptance(record,{profileId,activityKey,rulesHash}={}){
  const rules=ACTIVITY_RULES[activityKey];return Boolean(rules&&record&&record.status==='ACCEPTED'&&record.profileId===profileId&&record.activityId===activityKey&&record.activityTermsVersion===rules.version&&record.rulesHash===rulesHash);
}

export function buildGeneralAcceptance({profileId,classId,termsHash,deviceSessionId,fullTermsOpened=false,privacyNoticeViewed=false,reachedEnd=false,bulkAccepted=false,previousAcceptanceId=''}){
  return {acceptanceId:uid(),profileId,termsId:GENERAL_TERMS.id,termsVersion:GENERAL_TERMS.version,termsHash,platformId:'desafio-informatica-agv',platformVersion:APP_VERSION,activityId:'platform-general',activityTermsVersion:null,classId,acceptedAt:now(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo',acceptanceMethod:bulkAccepted?'guided-read-and-bulk-confirm':'checkbox-and-button',readConfirmation:true,responsibleUseConfirmation:true,privacyNoticeViewed:Boolean(privacyNoticeViewed),fullTermsOpened:Boolean(fullTermsOpened),reachedEnd:Boolean(reachedEnd),bulkAccepted:Boolean(bulkAccepted),deviceSessionId,appSchemaVersion:12,status:'ACCEPTED',previousAcceptanceId:previousAcceptanceId||null,integrityTag:termsHash.slice(0,24)};
}

export function buildActivityAcceptance({profileId,classId,activityKey,rulesHash,deviceSessionId,generalAcceptanceId=''}){
  const rules=ACTIVITY_RULES[activityKey];if(!rules)throw new Error('Regras da atividade não encontradas.');
  return {activityAcceptanceId:uid(),profileId,activityId:activityKey,activityTermsId:rules.id,activityTermsVersion:rules.version,acceptedAt:now(),rulesHash,teacherAuthorizationRequired:Boolean(rules.teacherAuthorizationRequired),generalAcceptanceId:generalAcceptanceId||null,deviceSessionId,status:'ACCEPTED',integrityTag:rulesHash.slice(0,24)};
}

export function evidenceTermsSummary(generalAcceptance,activityAcceptance){
  return {status:generalAcceptance?'aceito':'não validado',generalTermsVersion:generalAcceptance?.termsVersion||GENERAL_TERMS.version,activityTermsVersion:activityAcceptance?.activityTermsVersion||'não registrado',acceptedAt:generalAcceptance?.acceptedAt||'',generalAcceptanceId:generalAcceptance?.acceptanceId?.slice(0,12)||'',activityAcceptanceId:activityAcceptance?.activityAcceptanceId?.slice(0,12)||'',recordIntegrity:Boolean(generalAcceptance&&activityAcceptance),educationalPurpose:true};
}

export function termsMarkdown(){
  const sections=GENERAL_TERMS.sections.map(section=>`## ${section.title}\n\n${section.text}`).join('\n\n');
  const privacy=PRIVACY_NOTICE.points.map(point=>`- ${point}`).join('\n');
  return `# ${GENERAL_TERMS.title}\n\n**Versão:** ${GENERAL_TERMS.version}\n**Atualização:** ${GENERAL_TERMS.updatedAt}\n\n## Resumo\n\n${GENERAL_TERMS.summary}\n\n${sections}\n\n# Política de Privacidade em linguagem simples\n\n${privacy}\n\n# Aviso de simulações\n\n${SIMULATION_NOTICE.text}\n\n# Finalidade educacional\n\n${EDUCATIONAL_USE_NOTICE.text}\n`;
}
