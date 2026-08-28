export const lessons = [
  {
    id: 'lesson-awareness', title: 'Consciência e Engenharia Social', duration: '8 min', icon: '◈', track: 'Blue Team',
    summary: 'Reconheça manipulação, phishing, urgência falsa e canais de verificação.',
    sections: [
      { title: 'O atacante explora pessoas', text: 'Engenharia social usa confiança, medo, curiosidade ou urgência para induzir ações. A defesa começa desacelerando a decisão.' },
      { title: 'Verifique por outro canal', text: 'Não use o link ou telefone da própria mensagem suspeita. Abra o aplicativo oficial ou procure o contato por uma fonte confiável.' },
      { title: 'Reporte sem vergonha', text: 'Relatar rapidamente reduz o impacto. Em segurança, esconder um erro costuma ser mais perigoso que o erro inicial.' },
    ],
  },
  {
    id: 'lesson-crypto', title: 'Criptografia sem Mistério', duration: '10 min', icon: '◇', track: 'Criptografia',
    summary: 'Diferencie codificação, cifra, hash e criptografia moderna.',
    sections: [
      { title: 'Codificação não é segredo', text: 'Base64 e binário mudam a representação dos dados, mas não protegem o conteúdo.' },
      { title: 'Cifras clássicas', text: 'César é útil para aprender deslocamento, mas não é segura para uso real porque há poucas chaves possíveis.' },
      { title: 'Hash e integridade', text: 'Um hash resume o conteúdo. Pequenas alterações geram resultados diferentes, ajudando a verificar integridade.' },
    ],
  },
  {
    id: 'lesson-data', title: 'Dados, Binário e Conversões', duration: '9 min', icon: '01', track: 'Criptografia',
    summary: 'Converta texto, bytes, binário, hexadecimal e Base64.',
    sections: [
      { title: 'Tudo vira bytes', text: 'Textos, imagens e programas são representados como sequências de bytes. O significado depende do formato e da codificação.' },
      { title: 'ASCII e Unicode', text: 'ASCII cobre um conjunto pequeno; Unicode representa caracteres de muitos idiomas. UTF-8 é uma codificação amplamente usada.' },
      { title: 'Ferramentas como apoio', text: 'Use conversores para validar hipóteses, mas registre o caminho lógico para conseguir repetir a análise.' },
    ],
  },
  {
    id: 'lesson-web', title: 'Segurança de Aplicações Web', duration: '12 min', icon: '⌘', track: 'Web Security',
    summary: 'Entenda DOM, entradas não confiáveis, XSS e separação de dados.',
    sections: [
      { title: 'Toda entrada é não confiável', text: 'Dados do usuário, URL, armazenamento e APIs precisam ser tratados conforme o contexto de saída.' },
      { title: 'textContent antes de innerHTML', text: 'Para exibir texto, prefira APIs que não interpretem marcação. HTML dinâmico exige sanitização robusta e política clara.' },
      { title: 'CTF local e ético', text: 'Inspecionar esta plataforma é permitido porque o ambiente foi feito para ensino. Nunca teste sistemas de terceiros sem autorização.' },
    ],
  },
  {
    id: 'lesson-secure-code', title: 'Código Seguro por Padrão', duration: '11 min', icon: '{ }', track: 'Web Security',
    summary: 'Parametrização, segredos, validação e falhas seguras.',
    sections: [
      { title: 'Separe comando e dado', text: 'Consultas parametrizadas impedem que um valor seja interpretado como parte do comando SQL.' },
      { title: 'Segredo não pertence ao frontend', text: 'Chaves sensíveis em JavaScript público podem ser lidas. Use backend e gerenciadores de segredo quando houver dado real.' },
      { title: 'Falhe de modo seguro', text: 'Erros devem informar o necessário ao usuário e registrar detalhes para a equipe, sem expor internals.' },
    ],
  },
  {
    id: 'lesson-auth', title: 'Identidade e Controle de Acesso', duration: '10 min', icon: '⚿', track: 'Blue Team',
    summary: 'Senhas, MFA, sessões, menor privilégio e revisão de acesso.',
    sections: [
      { title: 'Comprimento vence truques', text: 'Frases-senha longas, únicas e armazenadas em gerenciador são melhores que padrões curtos e previsíveis.' },
      { title: 'MFA reduz risco', text: 'Um segundo fator dificulta o uso de uma senha vazada. Métodos resistentes a phishing são preferíveis.' },
      { title: 'Menor privilégio', text: 'Permissões devem refletir a tarefa atual, com expiração e revisão periódica.' },
    ],
  },
  {
    id: 'lesson-network', title: 'Redes, Portas e TLS', duration: '12 min', icon: '◉', track: 'Redes & IoT',
    summary: 'Compreenda portas, protocolos, HTTPS, segmentação e exposição.',
    sections: [
      { title: 'Porta é um ponto lógico', text: 'Serviços escutam em portas. Conhecer padrões ajuda a interpretar tráfego, mas portas diferentes não substituem segurança.' },
      { title: 'TLS protege em trânsito', text: 'HTTPS cifra a comunicação e valida o certificado do servidor, mas não garante que o conteúdo do site seja honesto.' },
      { title: 'Segmentar limita movimento', text: 'Separar redes de usuários, servidores e IoT reduz o alcance de uma falha.' },
    ],
  },
  {
    id: 'lesson-iot', title: 'IoT e Câmeras Seguras', duration: '8 min', icon: '◉', track: 'Redes & IoT',
    summary: 'Proteja dispositivos, firmware, acesso remoto e rede.',
    sections: [
      { title: 'Troque padrões', text: 'Credenciais padrão são amplamente conhecidas e automatizadas em ataques.' },
      { title: 'Atualize firmware', text: 'Correções de segurança fecham vulnerabilidades conhecidas. Dispositivos sem suporte devem ser substituídos ou isolados.' },
      { title: 'Exponha o mínimo', text: 'Evite acesso direto pela internet. Use VPN, autenticação forte e listas de controle quando necessário.' },
    ],
  },
  {
    id: 'lesson-logs', title: 'Logs e Forense Digital', duration: '13 min', icon: '⌕', track: 'Forense Digital',
    summary: 'Investigue eventos preservando integridade e contexto.',
    sections: [
      { title: 'Linha do tempo', text: 'Correlacione horário, usuário, origem, ação e resultado. Um evento isolado pode enganar.' },
      { title: 'Hash e cadeia de custódia', text: 'Registre quem coletou, quando, como e qual hash foi calculado. Isso permite demonstrar integridade.' },
      { title: 'Não altere o original', text: 'Trabalhe em cópias controladas e preserve a fonte sempre que possível.' },
    ],
  },
  {
    id: 'lesson-incident', title: 'Resposta a Incidentes', duration: '14 min', icon: '!', track: 'Blue Team',
    summary: 'Prepare, detecte, contenha, erradique, recupere e aprenda.',
    sections: [
      { title: 'Preparação reduz caos', text: 'Papéis, contatos, backups e procedimentos devem existir antes do incidente.' },
      { title: 'Conter sem destruir', text: 'Isole o risco enquanto preserva evidências e continuidade essencial.' },
      { title: 'Lições aprendidas', text: 'Após recuperar, revise causa, controles, comunicação e indicadores para evitar repetição.' },
    ],
  },
];

export const getLesson = (id) => lessons.find((lesson) => lesson.id === id);
