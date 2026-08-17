export const OBSERVATORY_TIMELINE = [
  { id:'ground-optical', year:'1609', label:'Telescópios ópticos', type:'Luz visível', summary:'Instrumentos ópticos ampliaram a observação sistemática do céu e deram origem a técnicas de alinhamento, foco, registro e comparação.', dsLink:'Interface de instrumentos, calibração, aquisição de dados e rastreabilidade.', source:'https://science.nasa.gov/universe/exoplanets/how-we-find-and-characterize/' },
  { id:'hubble', year:'1990', label:'Hubble', type:'UV · visível · infravermelho próximo', summary:'Um observatório acima da atmosfera combina instrumentos, operações de solo, manutenção e pipeline científico.', dsLink:'Sistemas distribuídos, versionamento de instrumentos, telemetria e processamento de imagens.', source:'https://science.nasa.gov/mission/hubble/overview/about-hubble/' },
  { id:'chandra', year:'1999', label:'Chandra', type:'Raios X', summary:'Óptica de incidência rasante e detectores especializados permitem estudar ambientes energéticos invisíveis ao olho humano.', dsLink:'Sensores especializados, formatos científicos, falsos tons e análise orientada ao domínio.', source:'https://science.nasa.gov/mission/chandra/' },
  { id:'webb', year:'2021', label:'James Webb', type:'Infravermelho', summary:'Espelho segmentado, escudo solar, instrumentos frios e operação em L2 formam um sistema altamente integrado.', dsLink:'Arquitetura de componentes, implantação por estados, validação e observabilidade de sistemas críticos.', source:'https://science.nasa.gov/mission/webb/spacecraftoverview/' },
  { id:'multiwavelength', year:'Atual', label:'Astronomia multimensageira', type:'Múltiplas bandas', summary:'Combinar diferentes faixas do espectro revela fenômenos que uma única câmera não consegue mostrar.', dsLink:'Integração de dados, normalização, composição de canais, incerteza e proveniência.', source:'https://science.nasa.gov/asset/webb/the-electromagnetic-spectrum-with-hubble-webb-and-spitzer-highlights/' }
];

export const TELESCOPES = [
  { id:'optical', label:'Óptico', band:'visible', wavelength:'400–700 nm', aperture:2.4, sensitivity:0.78, resolution:0.86, cooling:0, targets:['nebula','galaxy','cluster'], source:'https://science.nasa.gov/mission/hubble/overview/why-have-a-telescope-in-space/' },
  { id:'infrared', label:'Infravermelho', band:'infrared', wavelength:'0,6–28,5 μm', aperture:6.5, sensitivity:0.98, resolution:0.9, cooling:7, targets:['nebula','protostar','galaxy','exoplanet'], source:'https://science.nasa.gov/mission/webb/science-overview/science-explainers/infrared-astronomy/' },
  { id:'radio', label:'Rádio', band:'radio', wavelength:'mm–m', aperture:25, sensitivity:0.72, resolution:0.58, cooling:20, targets:['pulsar','molecular-cloud','galaxy'], source:'https://imagine.gsfc.nasa.gov/science/toolbox/emspectrum1.html' },
  { id:'xray', label:'Raios X', band:'xray', wavelength:'0,01–10 nm', aperture:1.2, sensitivity:0.9, resolution:0.82, cooling:-60, targets:['supernova','black-hole','cluster'], source:'https://science.nasa.gov/mission/chandra/' }
];

export const TARGETS = [
  { id:'nebula', label:'Nebulosa de emissão', distance:'1.340 anos-luz', magnitude:5.0, bands:['visible','infrared','radio'], features:['hidrogênio','poeira','formação estelar'], scene:'nebula' },
  { id:'protostar', label:'Protoestrela em nuvem molecular', distance:'460 anos-luz', magnitude:12.6, bands:['infrared','radio'], features:['poeira','disco','jatos'], scene:'nebula' },
  { id:'galaxy', label:'Galáxia espiral', distance:'2,5 milhões de anos-luz', magnitude:3.4, bands:['visible','infrared','radio','xray'], features:['bojo','braços','halo'], scene:'galaxy' },
  { id:'cluster', label:'Aglomerado de galáxias', distance:'4,6 bilhões de anos-luz', magnitude:18.2, bands:['visible','infrared','xray'], features:['lente gravitacional','gás quente','matéria escura'], scene:'deep' },
  { id:'pulsar', label:'Pulsar', distance:'6.500 anos-luz', magnitude:16.5, bands:['radio','xray'], features:['pulso','campo magnético','remanescente'], scene:'pulsar' },
  { id:'supernova', label:'Remanescente de supernova', distance:'11.000 anos-luz', magnitude:10.1, bands:['visible','radio','xray'], features:['choque','elementos pesados','gás quente'], scene:'supernova' },
  { id:'black-hole', label:'Região de buraco negro', distance:'26.000 anos-luz', magnitude:20.0, bands:['radio','infrared','xray'], features:['disco de acreção','jatos','variabilidade'], scene:'blackhole' },
  { id:'exoplanet', label:'Sistema exoplanetário', distance:'40 anos-luz', magnitude:11.2, bands:['visible','infrared'], features:['trânsito','atmosfera','estrela hospedeira'], scene:'exoplanet' }
];

export const FILTERS = [
  { id:'luminance', label:'Luminância', channel:'L', transmission:0.92, detail:1.0 },
  { id:'red', label:'Vermelho', channel:'R', transmission:0.78, detail:0.82 },
  { id:'green', label:'Verde', channel:'G', transmission:0.74, detail:0.78 },
  { id:'blue', label:'Azul', channel:'B', transmission:0.68, detail:0.76 },
  { id:'halpha', label:'H-alfa', channel:'Hα', transmission:0.55, detail:0.96 },
  { id:'oiii', label:'Oxigênio III', channel:'OIII', transmission:0.49, detail:0.92 },
  { id:'sii', label:'Enxofre II', channel:'SII', transmission:0.44, detail:0.9 },
  { id:'infrared', label:'Infravermelho', channel:'IR', transmission:0.83, detail:0.94 },
  { id:'xray', label:'Raios X', channel:'X', transmission:0.66, detail:0.88 }
];

export const SPECTRAL_LIBRARY = [
  { id:'hydrogen', label:'Hidrogênio', lines:[410.2,434.0,486.1,656.3], color:'rosa', context:'regiões de formação estelar e atmosferas' },
  { id:'helium', label:'Hélio', lines:[447.1,501.6,587.6,667.8], color:'dourado', context:'estrelas quentes e nebulosas' },
  { id:'oxygen', label:'Oxigênio', lines:[495.9,500.7,630.0], color:'ciano', context:'nebulosas e gás ionizado' },
  { id:'sodium', label:'Sódio', lines:[589.0,589.6], color:'amarelo', context:'atmosferas e meio interestelar' },
  { id:'calcium', label:'Cálcio', lines:[393.4,396.8,422.7], color:'violeta', context:'espectros estelares' }
];

export const SPECTRUM_CHALLENGES = [
  { id:'spec-hydrogen', label:'Assinatura de hidrogênio', sample:[410.1,434.2,486.0,656.4], answer:'hydrogen', xp:160 },
  { id:'spec-sodium', label:'Dupleto amarelo', sample:[588.9,589.7], answer:'sodium', xp:160 },
  { id:'spec-oxygen', label:'Gás ionizado', sample:[495.8,500.8,630.1], answer:'oxygen', xp:160 }
];

export const OBSERVATION_CHALLENGES = [
  { id:'obs-dust', targetId:'protostar', telescopeId:'infrared', reason:'A poeira bloqueia parte da luz visível; o infravermelho revela regiões ocultas.', xp:220 },
  { id:'obs-hotgas', targetId:'supernova', telescopeId:'xray', reason:'Gás muito quente e choques energéticos emitem raios X.', xp:220 },
  { id:'obs-pulsar', targetId:'pulsar', telescopeId:'radio', reason:'Pulsos de rádio permitem medir periodicidade e dispersão.', xp:220 },
  { id:'obs-galaxy', targetId:'galaxy', telescopeId:'optical', reason:'A luz visível oferece boa leitura morfológica de bojo e braços.', xp:220 }
];
