window.BehaviorScenarios = (() => {
  const CONFIG = {
    2: { blocking:true, scenarios:[
      {id:'claro', label:'Ativar modo claro', match:{text:{mensagem:'Modo claro ativado'}}},
      {id:'escuro', label:'Ativar modo escuro', match:{text:{mensagem:'Modo escuro ativado'}}}
    ]},
    5: { blocking:true, scenarios:[
      {id:'aumentar', label:'Aumentar contador', match:{targetText:'Aumentar'}},
      {id:'diminuir', label:'Diminuir contador', match:{targetText:'Diminuir'}},
      {id:'zerar', label:'Zerar contador', match:{targetText:'Zerar'}}
    ]},
    6: { blocking:true, scenarios:[
      {id:'somar', label:'Testar soma', match:{targetText:'Somar'}},
      {id:'subtrair', label:'Testar subtração', match:{targetText:'Subtrair'}},
      {id:'multiplicar', label:'Testar multiplicação', match:{targetText:'Multiplicar'}},
      {id:'dividir', label:'Testar divisão', match:{targetText:'Dividir'}}
    ]},
    7: { blocking:true, scenarios:[
      {id:'fahrenheit', label:'Converter para Fahrenheit', match:{text:{resultado:'°F'}}},
      {id:'kelvin', label:'Converter para Kelvin', match:{text:{resultado:' K'}}}
    ]},
    8: { blocking:true, scenarios:[
      {id:'aprovado', label:'Testar situação Aprovado', match:{text:{resultado:'Aprovado'}}},
      {id:'recuperacao', label:'Testar situação Recuperação', match:{text:{resultado:'Recuperação'}}},
      {id:'reprovado', label:'Testar situação Reprovado', match:{text:{resultado:'Reprovado'}}}
    ]},
    9: { blocking:true, scenarios:[
      {id:'vazio', label:'Testar campo vazio', match:{text:{mensagem:'campo nome está vazio'}}},
      {id:'curto', label:'Testar nome curto', match:{text:{mensagem:'pelo menos 3 caracteres'}}},
      {id:'valido', label:'Testar nome válido', match:{text:{mensagem:'preenchido corretamente'}}}
    ]},
    10: { blocking:true, scenarios:[
      {id:'vazio', label:'Testar campos vazios', match:{text:{resultado:'preencha o usuário e a senha'}}},
      {id:'correto', label:'Testar acesso permitido', match:{text:{resultado:'acesso permitido'}}},
      {id:'incorreto', label:'Testar credenciais incorretas', match:{text:{resultado:'usuário ou senha incorretos'}}}
    ]},
    18: { blocking:true, scenarios:[
      {id:'click', label:'Testar evento click', match:{text:{ultimoEvento:'click'}}},
      {id:'input', label:'Testar evento input', match:{text:{ultimoEvento:'input'}}},
      {id:'mouseenter', label:'Testar mouseenter', match:{text:{ultimoEvento:'mouseenter'}}},
      {id:'mouseleave', label:'Testar mouseleave', match:{text:{ultimoEvento:'mouseleave'}}}
    ]},
    19: { blocking:true, scenarios:[
      {id:'tema', label:'Alternar tema', match:{text:{classesAtivas:'tema-escuro'}}},
      {id:'destaque', label:'Alternar destaque', match:{text:{classesAtivas:'destaque'}}},
      {id:'oculto', label:'Ocultar detalhes', match:{text:{classesAtivas:'oculto'}}}
    ]},
    25: { blocking:false, note:'Cenários externos recomendados; não bloqueiam a conclusão se o serviço estiver indisponível.', scenarios:[
      {id:'invalido', label:'CEP inválido', match:{text:{estadoConsulta:'CEP inválido'}}},
      {id:'sucesso', label:'CEP existente', match:{text:{estadoConsulta:'Concluída'}}},
      {id:'inexistente', label:'CEP inexistente', match:{text:{estadoConsulta:'Não encontrado'}}}
    ]},
    26: { blocking:false, note:'Cenários externos recomendados; HTTP/conexão dependem do ambiente e não bloqueiam a conclusão.', scenarios:[
      {id:'validacao', label:'Erro de validação local', match:{text:{tipoErro:'Validação'}}},
      {id:'sucesso', label:'Consulta concluída', match:{text:{estadoConsulta:'Concluída'}}},
      {id:'inexistente', label:'CEP inexistente', match:{text:{tipoErro:'CEP inexistente'}}}
    ]},
    27: { blocking:true, scenarios:[
      {id:'convencional', label:'Executar função convencional', match:{text:{ultimaForma:'Função convencional'}}},
      {id:'arrow', label:'Executar arrow com bloco', match:{text:{ultimaForma:'Arrow com bloco'}}},
      {id:'comparar', label:'Comparar as três formas', match:{text:{ultimaForma:'Três formas', equivalencia:'Sim'}}}
    ]},
    28: { blocking:true, scenarios:[
      {id:'desconto', label:'Transformar com desconto', match:{text:{mensagem:'desconto'}}},
      {id:'acrescimo', label:'Transformar com acréscimo', match:{text:{mensagem:'acréscimo'}}}
    ]}
  };

  function ensureState(state) {
    if (!state.behaviorScenarios || typeof state.behaviorScenarios !== 'object') state.behaviorScenarios = {};
    return state.behaviorScenarios;
  }
  function config(exercise) { return CONFIG[Number(exercise?.numero)] || null; }
  function textMatch(actual, expected) {
    return String(actual ?? '').toLocaleLowerCase('pt-BR').includes(String(expected ?? '').toLocaleLowerCase('pt-BR'));
  }
  function matches(rule, detail) {
    const snap = detail?.snapshot || {};
    if (rule.targetId && String(detail?.id || '') !== rule.targetId) return false;
    if (rule.targetText && !textMatch(detail?.targetText, rule.targetText)) return false;
    for (const [id,value] of Object.entries(rule.text || {})) if (!textMatch(snap.text?.[id], value)) return false;
    for (const [id,value] of Object.entries(rule.value || {})) if (!textMatch(snap.value?.[id], value)) return false;
    return true;
  }
  function observe(state, exercise, detail) {
    const cfg = config(exercise);
    if (!cfg) return [];
    const store = ensureState(state);
    const completed = [];
    cfg.scenarios.forEach(scenario => {
      if (!store[scenario.id] && matches(scenario.match || {}, detail)) {
        store[scenario.id] = { at:new Date().toISOString(), event:detail?.event || '', target:detail?.id || detail?.targetText || '' };
        completed.push(scenario.id);
      }
    });
    return completed;
  }
  function status(state, exercise) {
    const cfg = config(exercise);
    if (!cfg) return {configured:false, blocking:false, scenarios:[], completed:0, total:0, missing:[]};
    const store = ensureState(state);
    const scenarios = cfg.scenarios.map(item => ({...item, done:Boolean(store[item.id])}));
    return {
      configured:true, blocking:Boolean(cfg.blocking), note:cfg.note || '',
      scenarios, completed:scenarios.filter(x=>x.done).length, total:scenarios.length,
      missing:scenarios.filter(x=>!x.done).map(x=>x.id)
    };
  }
  function resetAfterEdit(state) {
    // Cenários são resultados de testes anteriores do projeto e devem ser refeitos após edição.
    state.behaviorScenarios = {};
  }
  return { CONFIG, ensureState, config, observe, status, resetAfterEdit };
})();