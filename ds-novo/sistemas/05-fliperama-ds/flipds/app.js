(() => {
  const __modules = Object.create(null);
  const __cache = Object.create(null);
  globalThis.__loadPhaser = (() => {
    let pending;
    return () => {
      if (globalThis.Phaser) return Promise.resolve(globalThis.Phaser);
      if (!pending) pending = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = './phaser.js';
        script.async = true;
        script.onload = () => globalThis.Phaser ? resolve(globalThis.Phaser) : reject(new Error('Phaser não inicializado'));
        script.onerror = () => reject(new Error('Falha ao carregar phaser.js'));
        document.head.appendChild(script);
      });
      return pending;
    };
  })();
  __modules["core/benchmark/device-benchmark"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recommendGraphicsMode = recommendGraphicsMode;
    exports.runDeviceBenchmark = runDeviceBenchmark;
    function recommendGraphicsMode(profile) {
        let score = profile.frameScore;
        score += Math.min(profile.logicalProcessors, 12) * 2;
        score += Math.min(profile.memoryGb ?? 4, 16) * 1.5;
        if (profile.webgl2)
            score += 14;
        if (profile.pixelRatio > 2)
            score -= 8;
        if (score >= 100)
            return 'ultra';
        if (score >= 80)
            return 'alto';
        if (score >= 55)
            return 'medio';
        return 'baixo';
    }
    async function runDeviceBenchmark(durationMs = 500) {
        const startedAt = performance.now();
        let frames = 0;
        await new Promise((resolve) => {
            const sample = (now) => {
                frames += 1;
                if (now - startedAt >= durationMs)
                    resolve();
                else
                    requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
        });
        const elapsed = performance.now() - startedAt;
        const frameScore = Math.min(60, (frames / elapsed) * 1000);
        const canvas = document.createElement('canvas');
        const profile = {
            logicalProcessors: navigator.hardwareConcurrency || 2,
            memoryGb: navigator.deviceMemory,
            pixelRatio: window.devicePixelRatio || 1,
            webgl2: Boolean(canvas.getContext('webgl2')),
            frameScore,
        };
        return {
            ...profile,
            recommendedMode: recommendGraphicsMode(profile),
            completedAt: new Date().toISOString(),
        };
    }
    
  };
  __modules["core/dynamic-game-loader"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.supportsPlayableModule = supportsPlayableModule;
    exports.loadGameRuntime = loadGameRuntime;
    const modules = {
        'vector-tennis': () => Promise.resolve().then(() => __importStar(__require("games/vector-tennis/index"))),
        'space-blocks': () => Promise.resolve().then(() => __importStar(__require("games/space-blocks/index"))),
        'vector-fleet': () => Promise.resolve().then(() => __importStar(__require("games/vector-fleet/index"))),
        'block-reactor': () => Promise.resolve().then(() => __importStar(__require("games/block-reactor/index"))),
        'orbital-sentinel': () => Promise.resolve().then(() => __importStar(__require("games/orbital-sentinel/index"))),
        'trap-lab': () => Promise.resolve().then(() => __importStar(__require("games/trap-lab/index"))),
        'data-maze': () => Promise.resolve().then(() => __importStar(__require("games/data-maze/index"))),
        'room-quest': () => Promise.resolve().then(() => __importStar(__require("games/room-quest/index"))),
        'raster-rally': () => Promise.resolve().then(() => __importStar(__require("games/raster-rally/index"))),
        'state-quest-rpg': () => Promise.resolve().then(() => __importStar(__require("games/state-quest-rpg/index"))),
        'bit-bridge-16': () => Promise.resolve().then(() => __importStar(__require("games/bit-bridge-16/index"))),
        'raycast-corridors': () => Promise.resolve().then(() => __importStar(__require("games/raycast-corridors/index"))),
        'polygon-sector-94': () => Promise.resolve().then(() => __importStar(__require("games/polygon-sector-94/index"))),
        'camera-evolution': () => Promise.resolve().then(() => __importStar(__require("games/camera-evolution/index"))),
        'voxelcraft-ds': () => Promise.resolve().then(() => __importStar(__require("games/voxelcraft-ds/index"))),
        'board-arena': () => Promise.resolve().then(() => __importStar(__require("games/board-arena/index"))),
        'puzzle-forge': () => Promise.resolve().then(() => __importStar(__require("games/puzzle-forge/index"))),
    };
    function supportsPlayableModule(gameId) {
        return gameId in modules;
    }
    async function loadGameRuntime(gameId) {
        const importer = modules[gameId];
        if (!importer)
            throw new Error('Esta experiência ainda está no catálogo de desenvolvimento.');
        return (await importer()).createRuntime();
    }
    
  };
  __modules["core/game-runtime"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    
  };
  __modules["core/runtime-registry"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RuntimeRegistry = void 0;
    class RuntimeRegistry {
        #factories = new Map();
        register(type, factory) {
            if (this.#factories.has(type))
                throw new Error(`Runtime já registrado: ${type}`);
            this.#factories.set(type, factory);
        }
        resolve(type) {
            const factory = this.#factories.get(type);
            if (!factory)
                throw new Error(`Runtime indisponível: ${type}`);
            return factory;
        }
        supports(type) {
            return this.#factories.has(type);
        }
    }
    exports.RuntimeRegistry = RuntimeRegistry;
    
  };
  __modules["core/settings/platform-settings"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_SETTINGS = void 0;
    exports.isPlatformSettings = isPlatformSettings;
    exports.DEFAULT_SETTINGS = {
        schemaVersion: 1,
        graphicsMode: 'automatico',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        muted: false,
        showPerformance: false,
    };
    function isPlatformSettings(value) {
        if (!value || typeof value !== 'object')
            return false;
        const candidate = value;
        return candidate.schemaVersion === 1
            && ['automatico', 'baixo', 'medio', 'alto', 'ultra', 'historico'].includes(candidate.graphicsMode ?? '')
            && typeof candidate.reducedMotion === 'boolean'
            && typeof candidate.muted === 'boolean'
            && typeof candidate.showPerformance === 'boolean';
    }
    
  };
  __modules["core/storage/arcade-storage"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArcadeStorage = void 0;
    const platform_settings_1 = __require("core/settings/platform-settings");
    const DATABASE_NAME = 'arcade-ds';
    const DATABASE_VERSION = 1;
    const SETTINGS_STORE = 'settings';
    const SAVES_STORE = 'saves';
    class ArcadeStorage {
        #database;
        async loadSettings() {
            const value = await this.#get(SETTINGS_STORE, 'platform');
            return (0, platform_settings_1.isPlatformSettings)(value) ? value : platform_settings_1.DEFAULT_SETTINGS;
        }
        saveSettings(settings) {
            return this.#put(SETTINGS_STORE, settings, 'platform');
        }
        async loadGame(gameId) {
            return await this.#get(SAVES_STORE, gameId);
        }
        saveGame(snapshot) {
            return this.#put(SAVES_STORE, snapshot, snapshot.gameId);
        }
        async #get(storeName, key) {
            const database = await this.#open();
            return await new Promise((resolve, reject) => {
                const request = database.transaction(storeName, 'readonly').objectStore(storeName).get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error ?? new Error('Falha ao ler armazenamento local'));
            });
        }
        async #put(storeName, value, key) {
            const database = await this.#open();
            await new Promise((resolve, reject) => {
                const transaction = database.transaction(storeName, 'readwrite');
                transaction.objectStore(storeName).put(value, key);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error ?? new Error('Falha ao salvar armazenamento local'));
            });
        }
        #open() {
            if (!this.#database) {
                this.#database = new Promise((resolve, reject) => {
                    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
                    request.onupgradeneeded = () => {
                        const database = request.result;
                        if (!database.objectStoreNames.contains(SETTINGS_STORE))
                            database.createObjectStore(SETTINGS_STORE);
                        if (!database.objectStoreNames.contains(SAVES_STORE))
                            database.createObjectStore(SAVES_STORE);
                    };
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error ?? new Error('IndexedDB indisponível'));
                });
            }
            return this.#database;
        }
    }
    exports.ArcadeStorage = ArcadeStorage;
    
  };
  __modules["data/game-presentations"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gamePresentation = gamePresentation;
    const PRESENTATIONS = {
        'puzzle-forge': {
            objective: 'Resolver quatro tipos de quebra-cabeça — caminhos, circuitos, sequências e labirintos — observando como matrizes e estados controlam cada desafio.',
            victory: 'Conectar a rota, energizar todos os terminais, repetir a sequência ou alcançar a saída do labirinto.',
            defeat: 'No modo sequência, atingir o limite de erros; nos demais modos, o desafio permanece aberto até a solução.',
            howToPlay: ['Escolha a experiência e a dificuldade.', 'Use clique ou toque nas grades de caminho, circuito e sequência.', 'No labirinto, mova com teclado, toque ou gamepad.', 'Abra o Editor para montar e testar um labirinto 7×7 próprio.'],
            controls: ['Mouse/toque: selecionar células.', 'Teclado: WASD ou setas no labirinto; P para pausar.', 'Celular: direcional em quatro sentidos.'],
            structure: ['Caminhos rotativos 5×5.', 'Circuito lógico 5×5 com vizinhança ortogonal.', 'Sequência de memória 4×4.', 'Labirinto 7×7 com editor de paredes.'],
            scoring: ['Pontos por acertos e progresso.', 'Bônus por concluir com poucos movimentos e erros.', 'Tempo, erros e movimentos reduzem o bônus final.'],
            logic: ['Matrizes guardam células e estados.', 'Vizinhança ortogonal altera o circuito.', 'Cursores validam a ordem da sequência.', 'O labirinto valida limites, paredes e posição do jogador.'],
        },
        'board-arena': {
            objective: 'Vencer a CPU em desafios de tabuleiro, alternando entre Jogo da Velha e Dama 8×8 para estudar estratégia, bloqueio e geração de jogadas.',
            victory: 'Completar uma linha no Jogo da Velha ou eliminar/bloquear as peças da CPU na Dama.',
            defeat: 'A CPU completa uma linha, captura todas as peças ou deixa o jogador sem movimentos legais.',
            howToPlay: ['Escolha Jogo da Velha ou Dama e selecione a dificuldade.', 'Toque ou clique diretamente nas casas do tabuleiro.', 'Na Dama, selecione primeiro a peça e depois a casa de destino.', 'Observe mensagens de captura, promoção e movimentos inválidos.'],
            controls: ['Mouse ou toque diretamente no tabuleiro.', 'P pausa e retoma a partida.'],
            structure: ['Jogo da Velha 3 × 3 contra CPU.', 'Dama 8 × 8 com capturas obrigatórias, promoção e CPU didática.', 'Xadrez, ludo e mancala permanecem planejados para expansão.'],
            scoring: ['Vitórias e capturas aumentam a pontuação.', 'Promoções e partidas concluídas em menos movimentos geram bônus.', 'Capturas da CPU reduzem parte da pontuação.'],
            logic: ['Matrizes representam tabuleiro e peças.', 'A simulação gera movimentos legais antes de aceitar uma ação.', 'A CPU prioriza vitória, bloqueio, captura, promoção e controle central.', 'O estado completo pode ser salvo e restaurado.'],
        },
        'vector-tennis': {
            objective: 'Devolver a bola, controlar o ângulo da raquete e alcançar cinco pontos antes da CPU.',
            victory: 'Marcar cinco pontos antes do adversário.', defeat: 'A CPU alcança cinco pontos primeiro.',
            howToPlay: ['Saque para iniciar cada ponto.', 'Mova a raquete acompanhando a altura da bola.', 'Use a região de contato para alterar o ângulo do rebote.'],
            controls: ['Teclado: W/S ou ↑/↓; Espaço para sacar.', 'Celular: botões subir, sacar e descer.'],
            structure: ['Partida única até cinco pontos.', 'Trajetória com gravidade e velocidade progressiva.', 'Registro da maior sequência de rebatidas.'],
            scoring: ['1 ponto quando a bola ultrapassa a raquete adversária.', 'Sem bônus artificiais: o placar reproduz a lógica do esporte arcade.'],
            logic: ['Coordenadas normalizadas.', 'Velocidade multiplicada pelo tempo.', 'Colisão por limites e máquina de estados.'],
        },
        'block-reactor': {
            objective: 'Desmontar o reator de blocos usando rebotes, bônus e leitura de trajetória.',
            victory: 'Concluir as três fases ou a fase personalizada.', defeat: 'Perder todas as vidas antes de remover os blocos.',
            howToPlay: ['Mova a raquete sob a bola.', 'Lance a bola e ajuste o rebote pela posição do contato.', 'Capture power-ups e evite deixar a bola sair pela base.'],
            controls: ['Teclado: A/D ou ←/→; Espaço para lançar.', 'Celular: esquerda, lançar e direita.'],
            structure: ['Três fases orientadas a dados.', 'Blocos comuns, resistentes, explosivos e de bônus.', 'Editor 8 × 5 integrado.'],
            scoring: ['Pontos por bloco removido.', 'Bônus por combos e power-ups.', 'Recompensa adicional ao concluir a fase.'],
            logic: ['Colisão AABB.', 'Reflexão vetorial.', 'Layouts serializáveis e editor desacoplado.'],
        },
        'orbital-sentinel': {
            objective: 'Defender a estação contra formações invasoras e atravessar quatro ondas.',
            victory: 'Eliminar as quatro formações.', defeat: 'Perder todas as vidas ou permitir que a formação alcance a estação.',
            howToPlay: ['Mova a sentinela horizontalmente.', 'Dispare mantendo o limite de projéteis.', 'Use as barreiras como proteção temporária.'],
            controls: ['Teclado: A/D ou ←/→; Espaço para disparar.', 'Celular: esquerda, disparar e direita.'],
            structure: ['45 inimigos por onda.', 'Três tipos de unidades e barreiras destrutíveis.', 'Velocidade aumenta conforme a formação diminui.'],
            scoring: ['Pontuação varia pelo tipo de inimigo.', 'Bônus por onda e vidas restantes.'],
            logic: ['Formação em matriz.', 'Escolha determinística de atiradores.', 'Colisão de projéteis e dificuldade emergente.'],
        },
        'vector-fleet': {
            objective: 'Sobreviver a cinco ondas controlando rotação, impulso e inércia no espaço.',
            victory: 'Concluir a quinta onda.', defeat: 'Perder todas as naves.',
            howToPlay: ['Gire a nave para definir a direção.', 'Acelere em pulsos para controlar a inércia.', 'Dispare e use as bordas conectadas do espaço.'],
            controls: ['Teclado: A/D ou ←/→; W/↑ para propulsor; Espaço para disparar.', 'Celular: girar, propulsor e disparar.'],
            structure: ['Cinco ondas progressivas.', 'Asteroides fragmentáveis.', 'Espaço toroidal com objetos reaparecendo na borda oposta.'],
            scoring: ['Pontos por fragmento destruído.', 'Bônus ao limpar ondas rapidamente.'],
            logic: ['Vetores, ângulos e inércia.', 'Fragmentação orientada a estados.', 'Colisões circulares.'],
        },
        'data-maze': {
            objective: 'Coletar todos os dados do labirinto enquanto drones com personalidades distintas perseguem o jogador.',
            victory: 'Limpar os três labirintos.', defeat: 'Perder todas as vidas para os drones.',
            howToPlay: ['Escolha a direção antes das curvas.', 'Colete nós de energia para tornar drones vulneráveis.', 'Use túneis laterais e rotas alternativas.'],
            controls: ['Teclado: WASD ou setas.', 'Celular: direcional em quatro sentidos.'],
            structure: ['Três mapas autorais.', 'Quatro drones com estratégias diferentes.', 'Nós de energia, bônus e túneis conectados.'],
            scoring: ['Pontos por dados e nós de energia.', 'Combo crescente ao capturar drones vulneráveis.', 'Bônus de conclusão de mapa.'],
            logic: ['Tilemap e busca em largura.', 'Fila de direção.', 'Patrulha, perseguição, vulnerabilidade e retorno.'],
        },
        'room-quest': {
            objective: 'Explorar oito salas, montar o inventário e recuperar o Núcleo de Memória.',
            victory: 'Levar o núcleo de volta ao Observatório.', defeat: 'Esgotar a energia da expedição.',
            howToPlay: ['Explore as saídas disponíveis em cada sala.', 'Colete itens e ative terminais.', 'Use chaves, flags e combinações para liberar novas passagens.'],
            controls: ['Teclado: WASD ou setas; E para interagir.', 'Celular: direcional e botão interagir.'],
            structure: ['Oito salas conectadas como grafo.', 'Inventário persistente.', 'Objetivo de ida e volta com alterações permanentes.'],
            scoring: ['Pontos por sala descoberta, item e terminal.', 'Bônus ao recuperar e devolver o núcleo.'],
            logic: ['Grafo de salas.', 'Flags globais.', 'Condições de passagem e inventário serializável.'],
        },
        'raster-rally': {
            objective: 'Completar três circuitos pseudo-3D antes do cronômetro terminar.',
            victory: 'Finalizar as três pistas.', defeat: 'Esgotar o tempo ou perder toda a integridade.',
            howToPlay: ['Acelere nas retas e prepare a entrada das curvas.', 'Freie para preservar aderência.', 'Ultrapasse rivais e atravesse checkpoints para ganhar tempo.'],
            controls: ['Teclado: W/↑ acelerar; S/↓ frear; A/D ou ←/→ esterçar.', 'Celular: esquerda, acelerar, frear e direita.'],
            structure: ['Três pistas autorais com duas voltas.', 'Curvas, elevação, clima e rivais.', 'Projeção por segmentos e sprites escalados.'],
            scoring: ['Pontos por distância, ultrapassagem e checkpoint.', 'Bônus de tempo e melhor volta.', 'Penalidade por colisões e saída da pista.'],
            logic: ['Interpolação de segmentos.', 'Perspectiva pseudo-3D.', 'Aderência e força centrífuga.'],
        },
        'space-blocks': {
            objective: 'Organizar peças espaciais, completar linhas e impedir que a matriz alcance o topo.',
            victory: 'No modo prática, superar a melhor pontuação; no progressivo, avançar o máximo possível.', defeat: 'A grade não comporta uma nova peça.',
            howToPlay: ['Mova e gire a peça ativa.', 'Planeje usando a prévia da próxima peça.', 'Use queda rápida ou instantânea quando a posição estiver segura.'],
            controls: ['Teclado: A/D ou ←/→; W/↑ para girar; S/↓ descer; Espaço para queda.', 'Celular: mover, descer, girar e queda.'],
            structure: ['Matriz 10 × 20.', 'Sacola de sete peças.', 'Níveis com velocidade crescente.'],
            scoring: ['Pontos por peça posicionada.', 'Recompensas maiores por múltiplas linhas simultâneas.', 'Nível multiplica ganhos.'],
            logic: ['Matrizes.', 'Rotação e wall kick.', 'Detecção e remoção de linhas.'],
        },
        'trap-lab': {
            objective: 'Superar três circuitos de plataforma e programar a sequência correta dos portões.',
            victory: 'Concluir a terceira fase.', defeat: 'Perder todas as vidas nas armadilhas.',
            howToPlay: ['Mova e salte entre plataformas.', 'Ative checkpoints antes de trechos difíceis.', 'Interaja com terminais e aplique a sequência lógica.'],
            controls: ['Teclado: A/D ou ←/→; W/↑/Espaço para pular; E para interagir.', 'Celular: esquerda, pular, interagir e direita.'],
            structure: ['Três fases 42 × 14.', 'Armadilhas temporizadas.', 'Editor de sequência aguardar → desativar → abrir.'],
            scoring: ['Pontos por fragmento, checkpoint e portão.', 'Bônus de conclusão e penalidade por reinício.'],
            logic: ['Física por subpassos.', 'Eventos, temporizadores e checkpoints.', 'Sequência de comandos validada como dados.'],
        },
        'state-quest-rpg': {
            objective: 'Concluir três missões, evoluir o personagem e decidir o destino do Núcleo.',
            victory: 'Alcançar um dos dois finais.', defeat: 'Perder todos os pontos de vida sem recursos de recuperação.',
            howToPlay: ['Explore os três mapas e converse com NPCs.', 'Equipe itens e enfrente inimigos por turnos.', 'Escolha respostas que alteram missões e o final.'],
            controls: ['Teclado: WASD/setas; E interagir; Enter/Espaço confirmar; Esc/Q alternativa.', 'Celular: direcional, interagir, confirmar e alternativa.'],
            structure: ['Três mapas e três missões encadeadas.', 'Inventário, equipamentos, atributos e experiência.', 'Diálogos ramificados e dois finais.'],
            scoring: ['Pontos por missão, batalha, descoberta e decisão.', 'Experiência aumenta nível e atributos.'],
            logic: ['Máquinas de estado de missões.', 'Árvores de diálogo.', 'Combate por turnos e persistência do mundo.'],
        },
        'bit-bridge-16': {
            objective: 'Atravessar uma mesma fase alternando entre apresentações de 8 e 16 bits.',
            victory: 'Coletar oito fragmentos e alcançar o portal.', defeat: 'Perder todas as vidas.',
            howToPlay: ['Mova e salte pelas quatro zonas.', 'Colete fragmentos e registre checkpoints.', 'Alterne a geração para comparar gráficos sem reiniciar a lógica.'],
            controls: ['Teclado: A/D ou ←/→; W/↑/Espaço pular; C/X alternar.', 'Celular: esquerda, pular, 8↔16 e direita.'],
            structure: ['Uma simulação compartilhada.', 'Apresentação 8 bits e 16 bits.', 'Quatro zonas, checkpoints e nove fragmentos.'],
            scoring: ['Pontos por fragmento, checkpoint e troca comparativa.', 'Bônus por conclusão e vidas restantes.'],
            logic: ['Renderização desacoplada.', 'Paletas, sprites, paralaxe e canais de áudio comparados.'],
        },
        'polygon-sector-94': {
            objective: 'Coletar três núcleos poligonais, ativar checkpoints e alcançar o portal de extração na primeira arena 3D real da plataforma.',
            victory: 'Entrar no portal após sincronizar os três núcleos.', defeat: 'Perder todas as vidas nos pulsos geométricos ou deixar o cronômetro terminar.',
            howToPlay: ['Avance e gire o explorador pela arena low-poly.', 'Salte sobre rampas e obstáculos para alcançar áreas elevadas.', 'Alterne câmera e materiais para comparar o pipeline 3D sem reiniciar a missão.', 'Colete os três núcleos e alcance o portal ao sul.'],
            controls: ['Teclado: W/↑ avançar; S/↓ recuar; A/D ou ←/→ girar; Espaço pular; Q material; C câmera.', 'Celular: girar, avançar/recuar, pular, material e câmera.'],
            structure: ['Arena autoral com limites, pilares, plataformas e três rampas.', 'Três núcleos, dois checkpoints, três pulsos de risco e um portal final.', 'Câmeras fixa, primeira pessoa e terceira pessoa; materiais flat, procedural e PBR didático.'],
            scoring: ['400 pontos por núcleo e 250 por checkpoint.', 'Bônus pela conclusão, tempo restante e comparação de câmera/material.', 'Penalidade de 150 pontos ao sofrer dano.'],
            logic: ['Estado 3D serializável separado do renderizador.', 'Matrizes modelo, visão e projeção.', 'Colisão por volumes, gravidade, salto e altura de rampas.', 'Shaders WebGL com degradação por modo gráfico.'],
        },
        'camera-evolution': {
            objective: 'Explorar a arena, coletar três lentes e experimentar seis sistemas de câmera com diferentes campos de visão.',
            victory: 'Alcançar o portal após coletar as três lentes.', defeat: 'Perder todas as vidas nos pulsos ou deixar o tempo terminar.',
            howToPlay: ['Movimente o avatar pela arena tridimensional.', 'Troque entre fixa, orbital, primeira pessoa, terceira pessoa, perseguição e superior.', 'Alterne o FOV entre 45°, 60° e 75° e observe visibilidade, velocidade e conforto.', 'Colete as três lentes e alcance a saída.'],
            controls: ['Teclado: W/↑ avançar; S/↓ recuar; A/D ou ←/→ girar; Espaço pular; C câmera; Q FOV.', 'Celular: girar, avançar/recuar, pular, câmera e FOV.'],
            structure: ['Arena 3D autoral com rampas, pilares e plataformas.', 'Seis camera rigs sobre uma simulação compartilhada.', 'Três lentes, dois checkpoints, riscos temporizados e portal final.'],
            scoring: ['75 pontos pela primeira visita a cada câmera e 10 por ajuste de FOV.', '400 pontos por lente e 250 por checkpoint.', 'Bônus por conclusão e tempo restante; penalidade ao sofrer dano.'],
            logic: ['Posição e missão independentes da câmera.', 'Matrizes lookAt e perspectiva.', 'Offsets, alvos, órbita, visão superior e câmera fixa por setores.', 'FOV alterando projeção sem reiniciar a simulação.'],
        },
        'raycast-corridors': {
            objective: 'Explorar um complexo 2.5D, obter duas chaves, ativar três terminais e alcançar a extração.',
            victory: 'Entrar na área de extração após sincronizar os três terminais.', defeat: 'Perder todas as vidas nos pulsos ou deixar o tempo acabar.',
            howToPlay: ['Avance e recue pelos corredores.', 'Gire a câmera, encontre chaves e abra portas.', 'Ative terminais para criar checkpoints e liberar a saída.', 'Alterne entre primeira pessoa, mapa e tela dividida.'],
            controls: ['Teclado: W/↑ avançar; S/↓ recuar; A/D ou ←/→ girar; E interagir; M alternar visão.', 'Celular: girar, avançar/recuar, interagir e visão.'],
            structure: ['Mapa 24 × 18 como fonte única do mundo.', 'Duas chaves, duas portas, três terminais e duas zonas de pulso.', 'Raycasting DDA com resolução adaptada ao modo gráfico.'],
            scoring: ['225 pontos por chave.', '175 por porta e 350 por terminal.', 'Bônus de extração, tempo restante e exploração; penalidade por dano.'],
            logic: ['DDA por coluna.', 'Correção perpendicular contra olho-de-peixe.', 'Colisão circular na grade.', 'Objetos projetados com teste de oclusão.'],
        },
        'voxelcraft-ds': {
            objective: 'Explorar um mundo procedural, coletar recursos tecnológicos e construir estruturas enquanto observa chunks, física, câmera e renderização trabalhando juntos.',
            victory: 'Não existe um único final obrigatório: as missões educativas registram progresso, construção, exploração e domínio técnico.',
            defeat: 'A sessão pode ser interrompida por vida esgotada ou falha de desempenho, mantendo o mundo salvo para continuação.',
            howToPlay: ['Escolha o modo Aprendizagem, Livre ou Desafio.', 'Explore o mundo, quebre blocos e colete recursos.', 'Use o inventário para selecionar blocos e construir.', 'Observe o painel educativo e os indicadores de chunks, triângulos e FPS.'],
            controls: ['Computador: WASD/setas, mouse, Espaço, Shift, C e cliques.', 'Celular: dois joysticks e botões de pular, quebrar, construir, consumir e agachar.'],
            structure: ['Mundo procedural carregado em chunks.', 'Greedy meshing e descarte de geometria distante.', 'Inventário, XP, missões e alterações persistidas em IndexedDB próprio do Fliperama.'],
            scoring: ['XP por coleta, construção, exploração e missões.', 'O modo Desafio amplia metas e recompensas.', 'O mundo permanece salvo no dispositivo.'],
            logic: ['Streaming por distância.', 'Mapeamento de blocos e edições serializáveis.', 'Ciclo de vida Three.js com descarte de recursos.', 'Qualidade automática por capacidade do dispositivo.'],
        },
    };
    function gamePresentation(game) {
        const override = PRESENTATIONS[game.id] ?? fallbackPresentation(game);
        return {
            ...override,
            logoUrl: `./media/games/${game.id}/logo.svg`,
            previews: [`./media/games/${game.id}/preview-01.svg`, `./media/games/${game.id}/preview-02.svg`],
        };
    }
    function fallbackPresentation(game) {
        return {
            objective: `Explorar o conceito de ${game.genre.join(', ')} dentro da evolução histórica dos jogos.`,
            victory: 'O objetivo final será definido durante a fase correspondente.',
            defeat: 'As condições de falha serão documentadas com a simulação.',
            howToPlay: ['Conhecer a referência histórica.', 'Executar o tutorial do laboratório.', 'Aplicar as mecânicas e observar a comparação técnica.'],
            controls: [game.mobileReady ? 'Teclado, toque e controles adaptados ao gênero.' : 'Experiência planejada inicialmente para desktop.'],
            structure: [`Fase ${game.releasePhase} do Fliperama DS.`, `Runtime ${game.runtime}.`, `Tecnologias previstas: ${game.technology.join(', ')}.`],
            scoring: ['O sistema de pontuação será definido junto às regras e aos testes da fase.'],
            logic: game.educationalConcepts.map((concept) => `Aplicação de ${concept}.`),
        };
    }
    
  };
  __modules["data/museum-hardware"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SENSOR_MUSEUM = exports.CONTROLLER_MUSEUM = exports.CONSOLE_MUSEUM = void 0;
    exports.CONSOLE_MUSEUM = [
        {
            id: 'atari-2600', title: 'Atari 2600', category: 'console', year: '1977', company: 'Atari', generation: '2ª geração',
            originalTechnology: 'Cartuchos ROM, CPU MOS 6507 e gráficos em sprites/tile simples.',
            contribution: 'Popularizou o console doméstico com troca de cartuchos e ajudou a formar o mercado inicial dos videogames em casa.',
            detail2d: 'Frente clássica em madeira escura, chaves metálicas e um cartucho no topo.',
            detail3d: 'Gabinete baixo retangular com ranhuras superiores e encaixe para cartuchos.',
            sourceLabel: 'Atari history', sourceUrl: 'https://atari.com/',
        },
        {
            id: 'nes', title: 'Nintendo Entertainment System', category: 'console', year: '1983–1985', company: 'Nintendo', generation: '3ª geração',
            originalTechnology: 'Cartuchos, CPU 8 bits, PPU dedicada e controle digital em cruz.',
            contribution: 'Reorganizou o mercado após a crise dos games e consolidou mascotes, level design e design padronizado de controles.',
            detail2d: 'Caixa cinza com tampa frontal para cartuchos e linhas retangulares marcantes.',
            detail3d: 'Corpo em camadas com tampa basculante e design compacto para a sala.',
            sourceLabel: 'Nintendo history', sourceUrl: 'https://www.nintendo.com/',
        },
        {
            id: 'mega-drive', title: 'Mega Drive / Genesis', category: 'console', year: '1988', company: 'Sega', generation: '4ª geração · 16 bits',
            originalTechnology: 'CPU Motorola 68000, Z80 auxiliar, áudio FM e sprites com mais cores.',
            contribution: 'Marcou a era 16 bits com identidade visual forte, velocidade, trilhas em FM e competição direta com a Nintendo.',
            detail2d: 'Círculo central, cartucho superior e acabamento preto brilhante.',
            detail3d: 'Formato ovalado com camadas elevadas e relevo central para cartucho.',
            sourceLabel: 'SEGA · Mega Drive', sourceUrl: 'https://www.sega.jp/',
        },
        {
            id: 'playstation-family', title: 'Família PlayStation 1 → 5', category: 'console', year: '1994–2020', company: 'Sony', generation: '32 bits até 9ª geração',
            originalTechnology: 'CD-ROM, DVD, Blu-ray, GPUs dedicadas e serviços online integrados.',
            contribution: 'Mostrou a evolução do 3D poligonal, mídia óptica, áudio em alta qualidade e ecossistemas de jogos cada vez mais conectados.',
            detail2d: 'Linha do tempo do cinza do PS1 ao design branco e preto curvo do PS5.',
            detail3d: 'Silhuetas comparativas mostrando mudanças de volume, refrigeração e verticalidade.',
            sourceLabel: 'PlayStation history', sourceUrl: 'https://www.playstation.com/en-us/playstation-history/',
        },
        {
            id: 'xbox-family', title: 'Família Xbox', category: 'console', year: '2001–2020', company: 'Microsoft', generation: '6ª a 9ª geração',
            originalTechnology: 'Arquiteturas x86, discos internos, serviços online e integração multimídia.',
            contribution: 'Fortaleceu o jogo online em console, a assinatura de serviços e a convergência entre PC e videogame.',
            detail2d: 'Do X preto com verde do Xbox original ao bloco minimalista das Series.',
            detail3d: 'Volumes robustos, resfriamento amplo e design funcional voltado ao desempenho.',
            sourceLabel: 'Xbox history', sourceUrl: 'https://www.xbox.com/',
        },
        {
            id: 'game-boy-switch', title: 'Portáteis Nintendo · Game Boy → Switch', category: 'console', year: '1989–2017', company: 'Nintendo', generation: 'Portáteis e híbridos',
            originalTechnology: 'LCDs portáteis, cartuchos, mídias híbridas e controles destacáveis.',
            contribution: 'Levaram os jogos para qualquer lugar, da tela monocromática aos consoles híbridos com dock.',
            detail2d: 'Do retângulo vertical do Game Boy ao tablet híbrido com Joy-Con.',
            detail3d: 'Comparação entre ergonomia, espessura, acoplamento e modos portátil/mesa/TV.',
            sourceLabel: 'Nintendo systems', sourceUrl: 'https://www.nintendo.com/',
        },
    ];
    exports.CONTROLLER_MUSEUM = [
        {
            id: 'arcade-stick', title: 'Joystick de Fliperama', category: 'controller', year: '1970s–atual', company: 'Diversos fabricantes', generation: 'Arcade clássico',
            originalTechnology: 'Microswitches, alavanca digital, botões grandes e gabinete dedicado.',
            contribution: 'Definiu a linguagem dos fliperamas com ações rápidas, resistência física e botões coloridos marcantes.',
            detail2d: 'Base retangular, alavanca alta e botões grandes em fileiras.',
            detail3d: 'Mesa de comando inclinada com relevo e área de apoio para as mãos.',
            sourceLabel: 'Arcade history', sourceUrl: 'https://www.arcade-museum.com/',
        },
        {
            id: 'nes-controller', title: 'Controle NES', category: 'controller', year: '1983–1985', company: 'Nintendo', generation: 'Controle digital',
            originalTechnology: 'D-pad, botões A/B e start/select em placa simples com fio.',
            contribution: 'Padronizou o direcional em cruz para jogos de plataforma, ação e aventura em consoles domésticos.',
            detail2d: 'Retângulo compacto com cruz direcional à esquerda e dois botões vermelhos.',
            detail3d: 'Design baixo e fino, com bordas retas e cabo saindo pela parte superior.',
            sourceLabel: 'Nintendo history', sourceUrl: 'https://www.nintendo.com/',
        },
        {
            id: 'dualshock', title: 'DualShock / DualSense', category: 'controller', year: '1997–2020', company: 'Sony', generation: 'Analógicos modernos',
            originalTechnology: 'Dois analógicos, vibração, gatilhos e sensores adicionais nas gerações recentes.',
            contribution: 'Popularizou os sticks duplos e elevou o controle a um dispositivo com feedback tátil e leitura de movimento.',
            detail2d: 'Pegadas simétricas, analógicos centrais e quatro botões de símbolo.',
            detail3d: 'Corpo ergonômico curvo com gatilhos superiores e grips pronunciados.',
            sourceLabel: 'PlayStation history', sourceUrl: 'https://www.playstation.com/en-us/playstation-history/',
        },
        {
            id: 'xbox-controller', title: 'Controle Xbox', category: 'controller', year: '2001–atual', company: 'Microsoft', generation: 'Analógico assimétrico',
            originalTechnology: 'Analógicos assimétricos, gatilhos, motores de vibração e conexão ampla.',
            contribution: 'Ajudou a consolidar ergonomia moderna para tiro, corrida e exploração 3D.',
            detail2d: 'Do formato grande inicial ao layout refinado com analógicos assimétricos.',
            detail3d: 'Pegadas robustas, gatilhos amplos e face arredondada.',
            sourceLabel: 'Xbox history', sourceUrl: 'https://www.xbox.com/',
        },
        {
            id: 'wheel-pedals', title: 'Volante e Pedais', category: 'controller', year: '1980s–atual', company: 'Arcades e simuladores', generation: 'Controle especializado',
            originalTechnology: 'Eixos analógicos, sensores de rotação, pedais e feedback de força.',
            contribution: 'Aumentaram o realismo em corrida e pilotagem, conectando posição física ao comportamento do jogo.',
            detail2d: 'Volante circular com base frontal, conjunto de pedais e seletor lateral.',
            detail3d: 'Cockpit de simulação com mesa, coluna e pedais inclinados.',
            sourceLabel: 'Racing sim history', sourceUrl: 'https://www.logitechg.com/',
        },
    ];
    exports.SENSOR_MUSEUM = [
        {
            id: 'light-gun', title: 'Light Gun / Pistola Óptica', category: 'sensor', year: '1980s–1990s', company: 'Diversos fabricantes', generation: 'Sensor óptico clássico',
            originalTechnology: 'Leitura sincronizada com varredura CRT para detectar alvos luminosos.',
            contribution: 'Criou experiências de tiro apontando para a tela e mostrou uma forma precoce de interação fora do direcional.',
            detail2d: 'Formato de pistola apontando para a tela com cabo e gatilho frontal.',
            detail3d: 'Corpo volumoso com encaixe de mão, cano e mira simples.',
            sourceLabel: 'Gaming history', sourceUrl: 'https://www.mobygames.com/',
        },
        {
            id: 'kinect', title: 'Kinect', category: 'sensor', year: '2010', company: 'Microsoft', generation: 'Captura corporal',
            originalTechnology: 'Câmera RGB, sensores de profundidade e rastreamento esquelético.',
            contribution: 'Levou o corpo inteiro para o jogo sem controle nas mãos e popularizou visão computacional no entretenimento doméstico.',
            detail2d: 'Barra horizontal com lentes, base de apoio e LEDs.',
            detail3d: 'Corpo alongado com duas câmeras frontais e inclinação de mesa/TV.',
            sourceLabel: 'Xbox Kinect', sourceUrl: 'https://www.xbox.com/',
        },
        {
            id: 'ps-camera-vr', title: 'Câmeras PlayStation e VR', category: 'sensor', year: '2013–2016', company: 'Sony', generation: 'Rastreamento e realidade virtual',
            originalTechnology: 'Câmeras estéreo, LEDs rastreáveis, headset estereoscópico e baixa latência.',
            contribution: 'Expandiram a noção de presença espacial, controle por movimento e imersão em mundos 3D.',
            detail2d: 'Câmera fina em barra e headset com viseira frontal iluminada.',
            detail3d: 'Conjunto volumétrico com headset, sensores e espaço ao redor do jogador.',
            sourceLabel: 'PlayStation VR', sourceUrl: 'https://www.playstation.com/',
        },
        {
            id: 'flight-hotas', title: 'Manete / HOTAS e sensores de simulação', category: 'sensor', year: '1990s–atual', company: 'Diversas marcas', generation: 'Simulação avançada',
            originalTechnology: 'Eixos analógicos, aceleradores separados, hats digitais e sensores de precisão.',
            contribution: 'Aprofundaram simuladores de voo, navegação e operação técnica com múltiplos comandos dedicados.',
            detail2d: 'Manche vertical com base e acelerador lateral separado.',
            detail3d: 'Cockpit técnico com dois módulos, botões e alavancas extras.',
            sourceLabel: 'Flight sim hardware', sourceUrl: 'https://www.thrustmaster.com/',
        },
    ];
    
  };
  __modules["data/museum-timeline"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MUSEUM_TIMELINE = void 0;
    exports.MUSEUM_TIMELINE = [
        {
            id: 'oxo-1952', year: 1952, releaseDate: '1952', era: '1950-1969', title: 'OXO', genre: 'estratégia',
            contribution: 'Um dos primeiros jogos gráficos: jogo da velha contra o computador.',
            people: ['Alexander S. Douglas'], companies: ['Universidade de Cambridge'], platforms: ['EDSAC'], operatingSystems: ['Ambiente do EDSAC'],
            originalTechnology: 'Tela CRT de 35 × 15 pontos e entrada por disco telefônico.', commercialModel: 'Pesquisa acadêmica; sem venda comercial.',
            sourceLabel: 'Computer History Museum', sourceUrl: 'https://www.computerhistory.org/timeline/1952/', arcadeDsRelation: 'Board Arena DS · Jogo da Velha e Dama jogáveis na Fase 7.',
        },
        {
            id: 'tennis-for-two-1958', year: 1958, releaseDate: '24 de outubro de 1958', era: '1950-1969', title: 'Tennis for Two', genre: 'esporte',
            contribution: 'Demonstrou trajetória, gravidade e interação de dois jogadores em um osciloscópio.',
            people: ['William Higinbotham', 'David Potter'], companies: ['Brookhaven National Laboratory'], platforms: ['Computador analógico', 'Osciloscópio'], operatingSystems: ['Circuitos analógicos; sem sistema operacional'],
            originalTechnology: 'Computador analógico e display vetorial.', commercialModel: 'Demonstração pública gratuita em laboratório.',
            sourceLabel: 'Computer History Museum', sourceUrl: 'https://www.computerhistory.org/revolution/computer-games/16/187', arcadeDsRelation: 'Vector Tennis · jogável.',
        },
        {
            id: 'spacewar-1962', year: 1962, releaseDate: '1962', era: '1950-1969', title: 'Spacewar!', genre: 'combate espacial',
            contribution: 'Popularizou controle em tempo real, gravidade, projéteis e distribuição de software entre universidades.',
            people: ['Steve Russell', 'Martin Graetz', 'Wayne Wiitanen'], companies: ['MIT'], platforms: ['DEC PDP-1'], operatingSystems: ['Monitor do PDP-1'],
            originalTechnology: 'Assembly do PDP-1 e display vetorial.', commercialModel: 'Projeto universitário compartilhado; não vendido como produto.',
            sourceLabel: 'Computer History Museum', sourceUrl: 'https://computerhistory.org/stories/computers-and-games-love-story/', arcadeDsRelation: 'Base histórica do Vector Fleet.',
        },
        {
            id: 'computer-space-1971', year: 1971, releaseDate: 'novembro de 1971', era: '1970-1979', title: 'Computer Space', genre: 'arcade espacial',
            contribution: 'Primeiro videogame arcade comercial produzido em série.',
            people: ['Nolan Bushnell', 'Ted Dabney'], companies: ['Nutting Associates', 'Syzygy'], platforms: ['Gabinete arcade'], operatingSystems: ['Lógica TTL; sem sistema operacional'],
            originalTechnology: 'Circuitos TTL, sem microprocessador, RAM ou ROM.', commercialModel: 'Gabinete operado por moeda; valor por partida definido pelo operador.',
            sourceLabel: 'Computer History Museum', sourceUrl: 'https://www.computerhistory.org/timeline/graphics-games/', arcadeDsRelation: 'Marco documental da transição laboratório → mercado.',
        },
        {
            id: 'pong-1972', year: 1972, releaseDate: '29 de novembro de 1972', era: '1970-1979', title: 'Pong', genre: 'esporte arcade',
            contribution: 'Transformou a ideia de jogo eletrônico em indústria de arcade de massa.',
            people: ['Allan Alcorn', 'Nolan Bushnell'], companies: ['Atari'], platforms: ['Gabinete arcade'], operatingSystems: ['Hardware dedicado; sem sistema operacional'],
            originalTechnology: 'Circuitos digitais discretos e tela raster.', commercialModel: 'Gabinete operado por moeda; preço da partida variava.',
            sourceLabel: 'Computer History Museum', sourceUrl: 'https://computerhistory.org/stories/computers-and-games-love-story/', arcadeDsRelation: 'Comparação histórica com jogos de raquete e rebote.',
        },
        {
            id: 'breakout-1976', year: 1976, releaseDate: '13 de maio de 1976', era: '1970-1979', title: 'Breakout', genre: 'rebatedor',
            contribution: 'Converteu raquete e bola em progressão individual contra uma parede de blocos.',
            people: ['Nolan Bushnell', 'Steve Bristow', 'Steve Wozniak', 'Steve Jobs'], companies: ['Atari'], platforms: ['Gabinete arcade'], operatingSystems: ['Circuitos lógicos; sem sistema operacional'],
            originalTechnology: 'Hardware dedicado e vídeo raster.', commercialModel: 'Gabinete operado por moeda.',
            sourceLabel: 'Atari', sourceUrl: 'https://atari.com/blogs/atari/new-insight-into-breakout-s-origins', arcadeDsRelation: 'Reator de Blocos · jogável.',
        },
        {
            id: 'space-invaders-1978', year: 1978, releaseDate: 'junho–julho de 1978', era: '1970-1979', title: 'Space Invaders', genre: 'tiro fixo',
            contribution: 'Consolidou ondas inimigas responsivas, barreiras destrutíveis, vidas e dificuldade progressiva.',
            people: ['Tomohiro Nishikado'], companies: ['Taito', 'Midway'], platforms: ['Gabinete arcade', 'posteriormente Atari 2600'], operatingSystems: ['Programa em ROM; sem sistema operacional'],
            originalTechnology: 'Intel 8080, framebuffer raster, assembly e áudio analógico.', commercialModel: 'Arcade operado por moeda; o valor por partida variava conforme operador e região.',
            sourceLabel: 'Entrevista com o criador', sourceUrl: 'https://www.wired.com/story/space-invaders-45-years-tomohiro-nishikado/', arcadeDsRelation: 'Sentinela Orbital · jogável na Fase 3.2.',
        },
        {
            id: 'asteroids-1979', year: 1979, releaseDate: 'novembro de 1979', era: '1970-1979', title: 'Asteroids', genre: 'nave vetorial',
            contribution: 'Aprimorou inércia, rotação, bordas conectadas e fragmentação em display vetorial.',
            people: ['Lyle Rains', 'Ed Logg'], companies: ['Atari'], platforms: ['Gabinete arcade'], operatingSystems: ['Programa em ROM; sem sistema operacional'],
            originalTechnology: 'Processador MOS 6502 e monitor vetorial.', commercialModel: 'Gabinete operado por moeda.',
            sourceLabel: 'Computer History Museum', sourceUrl: 'https://www.computerhistory.org/timeline/graphics-games/', arcadeDsRelation: 'Vector Fleet · jogável.',
        },
        {
            id: 'pac-man-1980', year: 1980, releaseDate: '22 de maio de 1980', era: '1980-1989', title: 'PAC-MAN', genre: 'labirinto',
            contribution: 'Popularizou coleta em labirintos, itens de poder e perseguidores com padrões de decisão distintos.',
            people: ['Toru Iwatani'], companies: ['Namco'], platforms: ['Gabinete arcade', 'conversões posteriores para consoles e computadores'], operatingSystems: ['Hardware arcade dedicado; sem sistema operacional'],
            originalTechnology: 'Hardware arcade de 8 bits, sprites, tilemap e lógica de perseguição.', commercialModel: 'Gabinete operado por moeda; o valor por partida variava conforme operador e região.',
            sourceLabel: 'Bandai Namco Holdings', sourceUrl: 'https://www.bandainamco.co.jp/en/about/history/namco.html', arcadeDsRelation: 'Labirinto de Dados · jogável na Fase 4.1 com arte, mapas, drones e código próprios.',
        },
        {
            id: 'adventure-1980', year: 1980, releaseDate: '1980', era: '1980-1989', title: 'Adventure', genre: 'ação e aventura',
            contribution: 'Mostrou como salas conectadas, objetos, chaves e condições podiam formar um mundo explorável em um console doméstico.',
            people: ['Warren Robinett'], companies: ['Atari'], platforms: ['Atari 2600'], operatingSystems: ['Cartucho executado diretamente no console'],
            originalTechnology: 'Cartucho, sprites, salas conectadas e estado compacto em hardware de memória restrita.', commercialModel: 'Cartucho comercial para console doméstico.',
            sourceLabel: 'Atari', sourceUrl: 'https://atari.com/pages/adventure', arcadeDsRelation: 'Aventura de Salas · jogável na Fase 4.2 com mapas, objetos, lógica e código próprios.',
        },
        {
            id: 'pole-position-1982', year: 1982, releaseDate: '1982', era: '1980-1989', title: 'Pole Position', genre: 'corrida arcade',
            contribution: 'Consolidou a corrida pseudo-3D com pista em perspectiva, sprites escalados, classificação, cronômetro e gabinete dedicado.',
            people: ['Equipe de desenvolvimento da Namco'], companies: ['Namco', 'Atari sob licença na América do Norte'], platforms: ['Gabinete arcade', 'conversões posteriores para consoles e computadores'], operatingSystems: ['Hardware arcade dedicado; sem sistema operacional'],
            originalTechnology: 'Segmentos rasterizados, sprites escalados, múltiplos processadores e controles dedicados de volante e pedais.', commercialModel: 'Gabinete operado por moeda; preço por partida definido pelo operador.',
            sourceLabel: 'Arcade Archives', sourceUrl: 'https://www.arcadearchives.com/en/title/aca-263/', arcadeDsRelation: 'Raster Rally · jogável na Fase 4.3 com pistas, veículos, paisagens, regras e código próprios.',
        },
        {
            id: 'tetris-1984', year: 1984, releaseDate: 'junho de 1984', era: '1980-1989', title: 'Tetris', genre: 'puzzle',
            contribution: 'Mostrou como regras mínimas, matrizes e aumento de velocidade criam profundidade duradoura.',
            people: ['Alexey Pajitnov'], companies: ['Academia de Ciências da União Soviética'], platforms: ['Electronika 60', 'PC', 'Game Boy', 'mais de 50 plataformas'], operatingSystems: ['Terminal do Electronika 60; versões posteriores variadas'],
            originalTechnology: 'Pascal em terminal de texto na primeira versão.', commercialModel: 'Criação acadêmica; licenciamento comercial posterior.',
            sourceLabel: 'The Tetris Company', sourceUrl: 'https://tetris.com/corporate-bios', arcadeDsRelation: 'Space Blocks · laboratório inspirado e autoral.',
        },
        {
            id: 'super-mario-1985', year: 1985, releaseDate: '13 de setembro de 1985', era: '1980-1989', title: 'Super Mario Bros.', genre: 'plataforma',
            contribution: 'Estabeleceu referência de rolagem lateral, física legível e design progressivo de fases em consoles domésticos.',
            people: ['Shigeru Miyamoto', 'Takashi Tezuka'], companies: ['Nintendo'], platforms: ['Famicom', 'NES'], operatingSystems: ['Cartucho executado diretamente no console'],
            originalTechnology: 'CPU Ricoh 2A03/6502, sprites e tilemaps.', commercialModel: 'Cartucho comercial; preço variava por região e pacote do console.',
            sourceLabel: 'Nintendo', sourceUrl: 'https://www.nintendo.com/jp/character/mario/en/history/smb/index.html', arcadeDsRelation: 'Trap Lab · laboratório jogável com personagem, mapas e regras próprios.',
        },
        {
            id: 'dragon-quest-1986', year: 1986, releaseDate: '27 de maio de 1986', era: '1980-1989', title: 'Dragon Quest', genre: 'RPG',
            contribution: 'Ajudou a popularizar nos consoles a jornada orientada por atributos, experiência, inventário, conversas e progressão narrativa.',
            people: ['Yuji Horii', 'Akira Toriyama', 'Koichi Sugiyama e equipe Chunsoft'], companies: ['Enix', 'Chunsoft'], platforms: ['Famicom', 'conversões e relançamentos posteriores'], operatingSystems: ['Cartucho executado diretamente no console'],
            originalTechnology: 'Tilemaps, sprites, menus, tabelas de atributos e progressão controlada por estados.', commercialModel: 'Cartucho comercial para console doméstico; preço variava conforme região e edição.',
            sourceLabel: 'Square Enix · Dragon Quest I & II', sourceUrl: 'https://dragonquest.square-enix-games.com/games/pt-br/dragon-quest-1-2-hd2d-remake/', arcadeDsRelation: 'State Quest RPG · jogável na Fase 4.4 com mundo, personagens, missões, arte, áudio e código próprios.',
        },
        {
            id: 'mega-drive-1988', year: 1988, releaseDate: '29 de outubro de 1988', era: '1980-1989', title: 'Mega Drive', genre: 'console de 16 bits',
            contribution: 'Representa a transição para uma geração doméstica com CPU de 16 bits, paletas ampliadas, sprites maiores, rolagem mais rica e áudio com mais vozes.',
            people: ['Equipes de hardware e software da Sega'], companies: ['Sega'], platforms: ['Mega Drive', 'Genesis em mercados posteriores'], operatingSystems: ['Firmware e cartuchos executados diretamente no console'],
            originalTechnology: 'CPU Motorola 68000, processador Z80 de apoio, vídeo baseado em tiles e sprites e síntese FM/PSG.', commercialModel: 'Console doméstico e cartuchos comerciais vendidos no varejo; preços variavam por região e pacote.',
            sourceLabel: 'SEGA · Mega Drive', sourceUrl: 'https://vc.sega.jp/about_md.html', arcadeDsRelation: 'Ponte 8→16 Bits · jogável na Fase 4.5 com uma simulação autoral apresentada em duas gerações gráficas e sonoras.',
        },
        {
            id: 'raycasting-1992', year: 1992, releaseDate: '1992', era: '1990-1999', title: 'Raycasting em primeira pessoa', genre: 'ação e exploração 2.5D',
            contribution: 'Mapas bidimensionais em grade passaram a gerar corredores em primeira pessoa por emissão de raios e projeção de paredes por colunas.',
            people: ['Programadores e designers da geração de engines 2.5D'], companies: ['Diversos estúdios de jogos para PC'], platforms: ['Computadores pessoais'], operatingSystems: ['MS-DOS e ambientes equivalentes'],
            originalTechnology: 'DDA em mapas 2D, projeção por colunas, sprites em perspectiva e aritmética otimizada para CPU.', commercialModel: 'Jogos comerciais e distribuição shareware; valores variavam conforme edição e região.',
            sourceLabel: 'Computer History Museum', sourceUrl: 'https://www.computerhistory.org/timeline/graphics-games/', arcadeDsRelation: 'Corredores Raycast · jogável na Fase 5.1 com mapa, missão, texturas procedurais, áudio e código próprios.',
        },
        {
            id: 'playstation-1994', year: 1994, releaseDate: '3 de dezembro de 1994', era: '1990-1999', title: 'PlayStation', genre: 'plataforma de jogos',
            contribution: 'Popularizou mídia óptica, áudio em CD e mundos 3D texturizados no mercado doméstico.',
            people: ['Ken Kutaragi e equipes da Sony'], companies: ['Sony Computer Entertainment'], platforms: ['PlayStation'], operatingSystems: ['Firmware proprietário do console'],
            originalTechnology: 'CPU R3000A de 32 bits, GPU dedicada e CD-ROM.', commercialModel: 'Console e jogos vendidos no varejo.',
            sourceLabel: 'PlayStation', sourceUrl: 'https://www.playstation.com/en-us/playstation-history/1994-ps-one/', arcadeDsRelation: 'Setor Poligonal 94 · jogável na Fase 5.2 com arena, missão, câmeras, materiais, shaders e código próprios.',
        },
        {
            id: 'quake-1996', year: 1996, releaseDate: '22 de junho de 1996', era: '1990-1999', title: 'Quake', genre: 'FPS 3D',
            contribution: 'Acelerou a adoção de mundos totalmente 3D, rede, câmera em primeira pessoa e gráficos acelerados.',
            people: ['John Carmack', 'John Romero e equipe id Software'], companies: ['id Software', 'GT Interactive'], platforms: ['MS-DOS', 'Windows', 'Linux', 'Mac', 'consoles posteriores'], operatingSystems: ['DOS e sistemas desktop posteriores'],
            originalTechnology: 'Engine 3D, lightmaps, cliente-servidor e OpenGL em versões aceleradas.', commercialModel: 'Shareware e versão comercial completa.',
            sourceLabel: 'id Software', sourceUrl: 'https://www.idsoftware.com/', arcadeDsRelation: 'Referência complementar para a evolução posterior das arenas 3D; a reconstrução do Fliperama DS permanece autoral.',
        },
        {
            id: 'camera-3d-1996', year: 1996, releaseDate: '1996', era: '1990-1999', title: 'Câmeras nos mundos 3D', genre: 'design de câmera',
            contribution: 'A expansão dos mundos 3D consolidou câmeras fixas, primeira pessoa, terceira pessoa e perseguição como partes essenciais do controle e do level design.',
            people: ['Equipes de design, programação e direção de câmera da geração 32/64 bits'], companies: ['Diversos estúdios de consoles e PC'], platforms: ['PlayStation', 'Nintendo 64', 'Saturn', 'PC'], operatingSystems: ['Sistemas de console e computadores pessoais'],
            originalTechnology: 'Matrizes de visão e projeção, controle analógico, camera rigs, zonas por setor e campos de visão definidos por gênero.', commercialModel: 'Jogos comerciais em CD-ROM, cartucho e distribuição para computadores.',
            sourceLabel: 'PlayStation History', sourceUrl: 'https://www.playstation.com/en-us/playstation-history/1994-ps-one/', arcadeDsRelation: 'Câmeras em Evolução · jogável na Fase 5.3 com arena, missão, câmera e código próprios.',
        },
        {
            id: 'counter-strike-1999', year: 1999, releaseDate: '19 de junho de 1999 (primeiro beta)', era: '1990-1999', title: 'Counter-Strike', genre: 'FPS tático',
            contribution: 'Transformou um mod comunitário em referência de objetivos por equipe e competição online.',
            people: ['Minh Le', 'Jess Cliffe'], companies: ['Valve', 'comunidade do mod Half-Life'], platforms: ['PC'], operatingSystems: ['Windows; versões posteriores em outros sistemas'],
            originalTechnology: 'GoldSrc, rede cliente-servidor e mapas BSP.', commercialModel: 'Mod gratuito de Half-Life; produto comercial posterior.',
            sourceLabel: 'Valve / Counter-Strike', sourceUrl: 'https://blog.counter-strike.net/history/', arcadeDsRelation: 'Cyber Arena 360 será inspirada no gênero, sem copiar mapas, armas ou marca.',
        },
        {
            id: 'gta-iii-2001', year: 2001, releaseDate: '22 de outubro de 2001', era: '2000-2009', title: 'Grand Theft Auto III', genre: 'ação em mundo aberto',
            contribution: 'Consolidou cidade 3D aberta, missões, veículos, pedestres e narrativa sistêmica em escala comercial.',
            people: ['Equipe DMA Design / Rockstar North'], companies: ['DMA Design', 'Rockstar Games'], platforms: ['PlayStation 2', 'PC', 'Xbox', 'plataformas posteriores'], operatingSystems: ['Sistema do PS2, Windows e sistemas posteriores'],
            originalTechnology: 'Renderização 3D, streaming urbano e IA de tráfego/pedestres.', commercialModel: 'Jogo comercial de varejo.',
            sourceLabel: 'Rockstar Games', sourceUrl: 'https://www.rockstargames.com/games/grandtheftauto3', arcadeDsRelation: 'Cidade Missão 360 será um laboratório original de exploração e objetivos.',
        },
        {
            id: 'asphalt-8-2013', year: 2013, releaseDate: '22 de agosto de 2013', era: '2010-2019', title: 'Asphalt 8: Airborne', genre: 'corrida arcade',
            contribution: 'Representa a evolução de corrida 3D de alta velocidade para celulares, com saltos, eventos e atualização contínua.',
            people: ['Equipes Gameloft Barcelona e, posteriormente, Gameloft Kharkiv'], companies: ['Gameloft'], platforms: ['iOS', 'Android', 'Windows e outras'], operatingSystems: ['iOS, Android, Windows'],
            originalTechnology: 'Renderização 3D móvel, física arcade, conteúdo por download e serviços online.', commercialModel: 'Lançamento premium; depois modelo gratuito com compras opcionais.',
            sourceLabel: 'Gameloft', sourceUrl: 'https://www.gameloft.com/blog/players/asphalt-20-years-gaming', arcadeDsRelation: 'Nitro Horizon 360 será uma pista autoral com física e veículos próprios.',
        },
        {
            id: 'vr-2016', year: 2016, releaseDate: '13 de outubro de 2016', era: '2010-2019', title: 'PlayStation VR', genre: 'realidade virtual',
            contribution: 'Levou rastreamento de cabeça, visão estereoscópica e jogos imersivos a um console doméstico de massa.',
            people: ['Equipes Sony Interactive Entertainment'], companies: ['Sony Interactive Entertainment'], platforms: ['PlayStation 4', 'PlayStation 5 com adaptador'], operatingSystems: ['Sistema PlayStation'],
            originalTechnology: 'Headset estereoscópico, sensores, câmera e renderização de baixa latência.', commercialModel: 'Headset e jogos vendidos separadamente.',
            sourceLabel: 'PlayStation', sourceUrl: 'https://www.playstation.com/en-us/playstation-history/2013-ps4-ps-vr/', arcadeDsRelation: 'Pesquisa para arenas 360 e modos imersivos web.',
        },
        {
            id: 'counter-strike-2-2023', year: 2023, releaseDate: '27 de setembro de 2023', era: '2020-atual', title: 'Counter-Strike 2', genre: 'FPS competitivo',
            contribution: 'Representa iluminação moderna, simulação de fumaça e infraestrutura competitiva de serviço contínuo.',
            people: ['Equipes Valve'], companies: ['Valve'], platforms: ['PC'], operatingSystems: ['Windows e Linux'],
            originalTechnology: 'Source 2, Vulkan/DirectX e serviços online.', commercialModel: 'Gratuito para jogar com itens opcionais.',
            sourceLabel: 'Counter-Strike', sourceUrl: 'https://www.counter-strike.net/cs2', arcadeDsRelation: 'Referência de evolução; o laboratório DS será educativo, não uma réplica.',
        },
        {
            id: 'games-2026', year: 2026, releaseDate: 'estado documentado em 2026', era: '2020-atual', title: 'Jogos em qualquer tela', genre: 'ecossistema contemporâneo',
            contribution: 'Em 2026, jogos históricos coexistem com cloud, realidade espacial, consoles híbridos, celulares e até sistemas de entretenimento veicular.',
            people: ['Desenvolvedores, comunidades e empresas de várias gerações'], companies: ['Ecossistema global de jogos'], platforms: ['PC', 'PlayStation 5', 'Xbox Series', 'Nintendo Switch 2', 'mobile', 'cloud', 'Apple Vision Pro', 'infotainment'], operatingSystems: ['Windows, Linux, Android, iOS, sistemas de console, sistemas espaciais e embarcados'],
            originalTechnology: 'Ray tracing, upscaling, streaming, cross-play, realidade espacial e distribuição contínua.', commercialModel: 'Venda unitária, assinatura, gratuito para jogar, arcade e catálogos digitais.',
            sourceLabel: 'The Tetris Company · panorama 2026', sourceUrl: 'https://tetris.com/news/the-tetris-company-celebrates-world-tetris-day', arcadeDsRelation: 'Destino da linha do tempo: arenas 3D 360 escaláveis e laboratórios autorais.',
        },
    ];
    
  };
  __modules["data/roadmap"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ARCADE_ROADMAP = void 0;
    exports.ARCADE_ROADMAP = [
        {
            id: 'fase-6-1', phase: 'Fase 6.1 · v0.18.1', title: 'Portal, catálogo inteligente e planejamento educacional', status: 'concluido', category: 'Estrutura', dimension: 'Híbrido', engine: 'TypeScript + DOM + Canvas/WebGL sob demanda',
            gameModes: ['Catálogo', 'Museu', 'Roadmap', 'Controle de versão'], controls: ['Mouse', 'Toque', 'Teclado'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Evolução dos jogos', 'Classificação por gênero', 'História da tecnologia', 'Comparação de engines'], technology: ['Filtros', 'version.json', 'PWA', 'museus'],
            summary: 'Consolida filtros, controle de atualização, próximos lançamentos e a organização pedagógica de todo o Fliperama DS.',
        },
        {
            id: 'board-arena-ds', phase: 'Fase 7.0 · v0.19.0', title: 'Board Arena DS', status: 'concluido', category: 'Tabuleiro e estratégia', dimension: '2D', engine: 'Phaser 2D + TypeScript',
            gameModes: ['Jogo da Velha', 'Dama 8×8', 'CPU Aprendiz', 'CPU Estrategista'], controls: ['Mouse', 'Toque', 'Teclado para pausa'], graphics: ['Histórico', 'Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Algoritmos de decisão', 'Matriz e coordenadas', 'Regras e turnos', 'IA básica'], technology: ['Phaser', 'máquina de estados', 'geração de jogadas legais', 'persistência'],
            summary: 'Primeira coleção jogável de tabuleiro: Jogo da Velha e Dama 8×8 contra CPU. Xadrez, ludo e mancala permanecem planejados para expansão.',
        },
        {
            id: 'puzzle-forge-ds', phase: 'Fase 7.1 · v0.20.0', title: 'Puzzle Forge DS', status: 'concluido', category: 'Quebra-cabeça', dimension: '2D', engine: 'Phaser 2D',
            gameModes: ['Caminhos rotativos', 'Circuitos lógicos', 'Sequência de memória', 'Labirinto', 'Editor 7×7'], controls: ['Mouse', 'Toque', 'Teclado'], graphics: ['Histórico', 'Baixo', 'Médio', 'Alto'],
            learning: ['Lógica', 'Sequências', 'Matrizes', 'Busca de caminhos'], technology: ['Matrizes', 'vizinhança ortogonal', 'máquina de estados', 'editor de dados'],
            summary: 'Quatro experiências jogáveis e um editor de labirinto demonstram matrizes, estados, sequências, vizinhança e busca de caminhos.',
        },
        {
            id: 'motion-beat-ds', phase: 'Fase 7 · Clássicos 2D', title: 'Motion Beat DS', status: 'planejado', category: 'Ritmo e movimento', dimension: 'Híbrido', engine: 'Phaser 2D + Web Audio',
            gameModes: ['Ritmo clássico', 'Sequência corporal', 'Modo acessível', 'Cooperação'], controls: ['Teclado', 'Toque', 'Gamepad', 'Sensores quando disponíveis'], graphics: ['Baixo', 'Médio', 'Alto'],
            learning: ['Tempo', 'Sincronização', 'Eventos', 'Acessibilidade'], technology: ['Web Audio', 'gamepad API', 'eventos temporizados'],
            summary: 'Experiência musical ligada ao Museu de Sensores, mostrando a evolução dos jogos de ritmo, dança e controles por movimento.',
        },
        {
            id: 'farm-evolution-ds', phase: 'Fase 8 · Gestão e produção', title: 'Farm Evolution DS', status: 'planejado', category: 'Fazenda e gestão', dimension: '2.5D', engine: 'Phaser Isométrico',
            gameModes: ['Campanha', 'Livre', 'Desafio de produção', 'Modo aula'], controls: ['Mouse', 'Toque', 'Teclado'], graphics: ['Baixo', 'Médio', 'Alto'],
            learning: ['Planejamento', 'Ciclos produtivos', 'Economia', 'Sustentabilidade'], technology: ['Grade isométrica', 'simulação de tempo', 'inventário', 'fila de produção'],
            summary: 'Simulador de fazenda com plantio, colheita, animais, máquinas e cadeia produtiva, conectando gestão, tecnologia e sustentabilidade.',
        },
        {
            id: 'city-architect-ds', phase: 'Fase 8 · Gestão e produção', title: 'City Architect DS', status: 'planejado', category: 'Cidade e construção', dimension: '2.5D', engine: 'Phaser + Canvas/WebGL',
            gameModes: ['Cidade livre', 'Missões urbanas', 'Planejamento sustentável', 'Modo aula'], controls: ['Mouse', 'Toque', 'Teclado'], graphics: ['Baixo', 'Médio', 'Alto'],
            learning: ['Planejamento urbano', 'Recursos', 'Trânsito', 'Serviços públicos'], technology: ['Tilemap', 'pathfinding', 'simulação econômica', 'camadas de dados'],
            summary: 'Construção de bairros, ruas, energia, água e serviços, com indicadores visuais e desafios educacionais de planejamento urbano.',
        },
        {
            id: 'kitchen-studio-ds', phase: 'Fase 8 · Gestão e produção', title: 'Kitchen Studio DS', status: 'planejado', category: 'Cozinha e fabricação de alimentos', dimension: '2.5D', engine: 'Phaser 2D/2.5D',
            gameModes: ['Receitas guiadas', 'Cozinha livre', 'Desafio de tempo', 'Linha de produção'], controls: ['Arrastar e soltar', 'Toque', 'Mouse', 'Teclado'], graphics: ['Baixo', 'Médio', 'Alto'],
            learning: ['Algoritmos em sequência', 'Tempo e temperatura', 'Higiene e segurança', 'Organização de processos'], technology: ['Drag and drop', 'fila de tarefas', 'temporizadores', 'estados de alimento'],
            summary: 'Cozinha interativa com forno, fogão, fritura, montagem de pratos, tortas, salgados, massas e receitas em etapas arrastáveis.',
        },
        {
            id: 'food-factory-ds', phase: 'Fase 8 · Gestão e produção', title: 'Food Factory DS', status: 'planejado', category: 'Fábrica e automação', dimension: '2.5D', engine: 'Phaser + simulação determinística',
            gameModes: ['Produção guiada', 'Fábrica livre', 'Otimização', 'Desafio de qualidade'], controls: ['Mouse', 'Toque', 'Teclado'], graphics: ['Baixo', 'Médio', 'Alto'],
            learning: ['Automação', 'Esteiras', 'Controle de qualidade', 'Eficiência'], technology: ['Máquina de estados', 'grafo de produção', 'eventos', 'sensores simulados'],
            summary: 'Linha de fabricação de alimentos com esteiras, misturadores, fornos, embalagens e inspeção, conectando programação e automação industrial.',
        },
        {
            id: 'vehicle-studio-ds', phase: 'Fase 9 · Veículos e mecânica', title: 'Vehicle Studio DS', status: 'planejado', category: 'Visualização e personalização', dimension: '3D/360', engine: 'Three.js',
            gameModes: ['Showroom', 'Comparação histórica', 'Personalização', 'Explodido técnico'], controls: ['Mouse', 'Toque', 'Gamepad'], graphics: ['Automático', 'Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Evolução automotiva', 'Materiais', 'Aerodinâmica', 'Componentes'], technology: ['PBR', 'LOD', 'câmera 360', 'carregamento sob demanda'],
            summary: 'Galeria de motos, carros, vans, caminhões e veículos especiais por ano, modelo, cor, roda, pneu, acessórios e configuração visual.',
        },
        {
            id: 'mechanic-garage-ds', phase: 'Fase 9 · Veículos e mecânica', title: 'Mechanic Garage DS', status: 'planejado', category: 'Simulador de mecânica', dimension: '3D', engine: 'Three.js + física simplificada',
            gameModes: ['Diagnóstico', 'Montagem guiada', 'Manutenção livre', 'Desafio técnico'], controls: ['Mouse', 'Toque', 'Gamepad'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Diagnóstico', 'Sequência de montagem', 'Segurança', 'Sistemas mecânicos'], technology: ['Peças modulares', 'encaixes', 'animações', 'checklist técnico'],
            summary: 'Oficina interativa com motor, freios, suspensão, pneus, fluidos, ferramentas e animações de desmontagem e montagem.',
        },
        {
            id: 'vehicle-constructor-ds', phase: 'Fase 9 · Veículos e mecânica', title: 'Vehicle Constructor DS', status: 'planejado', category: 'Construtor de veículos', dimension: '3D', engine: 'Three.js',
            gameModes: ['Construção livre', 'Projeto por requisitos', 'Teste de estabilidade', 'Modo aula'], controls: ['Mouse', 'Toque', 'Gamepad'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Projeto', 'Compatibilidade', 'Centro de massa', 'Custos'], technology: ['Sistema modular', 'snap points', 'simulação física', 'benchmark'],
            summary: 'Construtor de veículos com chassis, carroceria, motor, rodas, suspensão, cabine, acessórios e validação técnica da montagem.',
        },
        {
            id: 'transport-fleet-ds', phase: 'Fase 9 · Veículos e mecânica', title: 'Transport Fleet DS', status: 'planejado', category: 'Logística e veículos pesados', dimension: '3D', engine: 'Three.js',
            gameModes: ['Rotas', 'Entregas', 'Garagem', 'Gestão de frota'], controls: ['Teclado', 'Toque', 'Gamepad', 'Volante opcional'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Logística', 'Rotas', 'Consumo', 'Manutenção preventiva'], technology: ['Mapa 3D', 'IA de trânsito', 'física arcade', 'telemetria'],
            summary: 'Simulação com caminhões, vans e ônibus, planejamento de rotas, carga, consumo e cuidados com a frota.',
        },
        {
            id: 'nitro-horizon-360', phase: 'Fase 9 · Veículos e mecânica', title: 'Nitro Horizon 360', status: 'planejado', category: 'Corrida', dimension: '3D/360', engine: 'Three.js',
            gameModes: ['Treino', 'Corrida rápida', 'Campeonato', 'Contrarrelógio'], controls: ['Teclado', 'Toque', 'Gamepad', 'Volante opcional'], graphics: ['Automático', 'Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Velocidade', 'Aceleração', 'Trajetória', 'Física arcade'], technology: ['Física veicular', 'partículas', 'sombras', 'telemetria'],
            summary: 'Corrida 3D autoral com evolução gráfica, comparação de física histórica e suporte progressivo a controles especializados.',
        },
        {
            id: 'flight-vector-3d', phase: 'Fase 9 · Veículos e mecânica', title: 'Flight Vector 3D', status: 'planejado', category: 'Voo e simulação', dimension: '3D', engine: 'Three.js',
            gameModes: ['Treino', 'Rotas', 'Resgate', 'Desafio climático'], controls: ['Teclado', 'Toque', 'Gamepad', 'HOTAS opcional'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Vetores', 'Altitude', 'Velocidade', 'Clima'], technology: ['Física simplificada', 'vento', 'instrumentos', 'partículas'],
            summary: 'Simulador arcade de voo com rotas, instrumentos, vento, nuvens, chuva e integração com o museu de controles especializados.',
        },
        {
            id: 'adventure-vault-360', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Adventure Vault 360', status: 'planejado', category: 'Aventura', dimension: '3D/360', engine: 'Three.js',
            gameModes: ['Campanha', 'Exploração', 'Quebra-cabeças', 'Modo história'], controls: ['Teclado e mouse', 'Toque', 'Gamepad'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Narrativa', 'Estados', 'Inventário', 'Level design'], technology: ['Câmera terceira pessoa', 'gatilhos', 'inventário', 'shaders'],
            summary: 'Aventura narrativa com exploração, objetos, chaves, enigmas e evolução visual das aventuras 2D para mundos 3D.',
        },
        {
            id: 'neon-horror-lab', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Neon Horror Lab', status: 'planejado', category: 'Suspense e terror', dimension: '3D', engine: 'Three.js',
            gameModes: ['Exploração', 'Sobrevivência sem violência gráfica', 'Mistério', 'Modo acessível'], controls: ['Teclado e mouse', 'Toque', 'Gamepad'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Iluminação', 'Áudio espacial', 'IA por estados', 'Atmosfera'], technology: ['Sombras', 'fog', 'áudio 3D', 'eventos procedurais'],
            summary: 'Jogo de suspense e terror leve focado em atmosfera, lanternas, sons, enigmas e comportamento de entidades sem conteúdo gráfico explícito.',
        },
        {
            id: 'code-chronicles-rpg', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Code Chronicles RPG', status: 'planejado', category: 'RPG', dimension: '3D', engine: 'Three.js',
            gameModes: ['Campanha', 'Missões', 'Batalha por turnos', 'Exploração'], controls: ['Teclado', 'Toque', 'Gamepad'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Classes e objetos', 'Árvores de decisão', 'Inventário', 'Progressão'], technology: ['ECS simplificado', 'diálogos', 'quests', 'save versionado'],
            summary: 'RPG educacional com classes, missões, diálogos e evolução de personagem, explicando a programação por trás de sistemas de progressão.',
        },
        {
            id: 'cyber-arena-360', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Cyber Arena 360', status: 'planejado', category: 'FPS educativo', dimension: '3D/360', engine: 'Three.js',
            gameModes: ['Treino', 'Objetivos por equipe', 'Captura de dados', 'Defesa de terminal'], controls: ['Teclado e mouse', 'Toque', 'Gamepad'], graphics: ['Automático', 'Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Vetores', 'Raycast', 'IA por estados', 'Rede simulada'], technology: ['FPS', 'raycasting 3D', 'bots', 'partículas'],
            summary: 'Arena autoral de ação tática não realista, com foco em objetivos, leitura espacial e programação de agentes.',
        },
        {
            id: 'frontline-protocol-360', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Protocolo de Fronteira 360', status: 'planejado', category: 'Ação tática', dimension: '3D/360', engine: 'Three.js',
            gameModes: ['Briefing', 'Missões', 'Cooperação local simulada', 'Análise de decisão'], controls: ['Teclado e mouse', 'Toque', 'Gamepad'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Planejamento', 'Máquina de estados', 'Objetivos', 'Telemetria'], technology: ['Mapas modulares', 'IA', 'missões', 'HUD'],
            summary: 'Expansão tática com objetivos, rotas, cobertura e análise das decisões do jogador.',
        },
        {
            id: 'urban-mission-360', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Cidade Missão 360', status: 'planejado', category: 'Aventura urbana', dimension: '3D/360', engine: 'Three.js',
            gameModes: ['Exploração', 'Missões', 'Veículos', 'Eventos urbanos'], controls: ['Teclado', 'Toque', 'Gamepad'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Mundo aberto', 'IA de trânsito', 'Sistema de missões', 'Streaming de cenário'], technology: ['Chunks urbanos', 'pathfinding', 'eventos', 'veículos'],
            summary: 'Cidade 3D autoral com pedestres simplificados, trânsito, veículos e missões educacionais.',
        },
        {
            id: 'rail-scope-arcade', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Rail Scope Arcade', status: 'planejado', category: 'Tiro sobre trilhos', dimension: '3D', engine: 'Three.js',
            gameModes: ['Campanha', 'Precisão', 'Cooperação', 'Museu interativo'], controls: ['Mouse', 'Toque', 'Gamepad', 'Mira por sensor quando disponível'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['Raycast', 'Câmeras', 'Sensores de apontamento', 'Eventos'], technology: ['Spline camera', 'raycast', 'alvos', 'partículas'],
            summary: 'Experiência de tiro não realista que demonstra a evolução das pistolas ópticas, sensores e sistemas modernos de apontamento.',
        },
        {
            id: 'nexus-reality-2026', phase: 'Fase 10 · Experiências 3D avançadas', title: 'Nexus Reality 2026', status: 'planejado', category: 'Futuro dos jogos', dimension: '3D/360', engine: 'Three.js + WebXR opcional',
            gameModes: ['Desktop', 'Mobile', 'Experiência espacial', 'Museu do futuro'], controls: ['Mouse', 'Toque', 'Gamepad', 'XR opcional'], graphics: ['Baixo', 'Médio', 'Alto', 'Ultra'],
            learning: ['XR', 'Cloud', 'Cross-play', 'Interfaces espaciais'], technology: ['WebXR', 'streaming conceitual', 'sensores', 'renderização adaptativa'],
            summary: 'Síntese educacional dos jogos contemporâneos, realidade estendida, múltiplas telas e serviços conectados.',
        },
    ];
    
  };
  __modules["domain/game-manifest"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GRAPHICS_MODES = exports.RUNTIME_TYPES = exports.FIDELITY_TYPES = exports.ERAS = void 0;
    exports.validateManifest = validateManifest;
    exports.ERAS = [
        '1950-1969',
        '1970-1979',
        '1980-1989',
        '1990-1999',
        '2000-2009',
        '2010-2019',
        '2020-atual',
    ];
    exports.FIDELITY_TYPES = [
        'reconstrucao-educacional',
        'jogo-inspirado',
        'emulacao-autorizada',
        'referencia-historica',
    ];
    exports.RUNTIME_TYPES = ['dom', 'phaser', 'webgl', 'three', 'wasm'];
    exports.GRAPHICS_MODES = ['automatico', 'baixo', 'medio', 'alto', 'ultra', 'historico'];
    function validateManifest(manifest) {
        const errors = [];
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.id))
            errors.push('id deve usar kebab-case');
        if (manifest.id !== manifest.slug)
            errors.push('slug deve coincidir com id na versão 1');
        if (!exports.ERAS.includes(manifest.era))
            errors.push('era inválida');
        if (!exports.RUNTIME_TYPES.includes(manifest.runtime))
            errors.push('runtime inválido');
        if (!exports.FIDELITY_TYPES.includes(manifest.fidelity))
            errors.push('classificação de fidelidade inválida');
        if (manifest.packageSizeBudgetKb <= 0)
            errors.push('orçamento do pacote deve ser positivo');
        if (manifest.historicalReferences.length === 0)
            errors.push('ao menos uma referência histórica é obrigatória');
        if (manifest.educationalConcepts.length === 0)
            errors.push('conceitos educacionais são obrigatórios');
        return errors;
    }
    
  };
  __modules["games/bit-bridge-16/audio/bit-bridge-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BitBridgeAudio = void 0;
    class BitBridgeAudio {
        #context;
        #muted;
        #generation = '8-bit';
        constructor(muted) {
            this.#muted = muted;
        }
        setGeneration(generation) {
            this.#generation = generation;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const presets = {
                jump: [this.#generation === '8-bit' ? 290 : 360, 0.08, 'square'],
                'generation-changed': [this.#generation === '8-bit' ? 220 : 520, 0.15, this.#generation === '8-bit' ? 'square' : 'triangle'],
                'fragment-collected': [this.#generation === '8-bit' ? 660 : 880, 0.12, 'square'],
                checkpoint: [440, 0.16, 'triangle'],
                damage: [120, 0.14, 'sawtooth'],
                'life-lost': [90, 0.2, 'square'],
                'zone-changed': [520, 0.1, 'triangle'],
                finished: [740, 0.28, 'triangle'],
            };
            const [frequency, duration, type] = presets[event];
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            if (this.#generation === '16-bit')
                oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, context.currentTime + duration);
            gain.gain.setValueAtTime(0.04, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.BitBridgeAudio = BitBridgeAudio;
    
  };
  __modules["games/bit-bridge-16/content/bit-bridge-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BIT_BRIDGE_COMPARISON = exports.BIT_BRIDGE_PSEUDOCODE = exports.BIT_BRIDGE_HISTORY = void 0;
    exports.BIT_BRIDGE_HISTORY = {
        title: 'Quando 8 bits deram lugar a mundos 16 bits mais ricos',
        paragraphs: [
            'No fim dos anos 1980 e início dos anos 1990, consoles e computadores de 16 bits ampliaram memória, variedade de cores, tamanho de sprites, canais de áudio e capacidade de rolagem. A evolução não substituiu as regras dos jogos: ela permitiu representar a mesma lógica com mais camadas visuais e sonoras.',
            'A transição foi gradual. Técnicas como tilemaps, sprites e áudio sintetizado permaneceram, mas passaram a combinar paletas maiores, animações mais longas, paralaxe, efeitos e cenários com maior densidade.',
            'Ponte 8→16 Bits é um laboratório autoral. A mesma simulação controla movimento, colisões, coleta, checkpoints e objetivo; o usuário alterna instantaneamente entre duas apresentações para observar o custo e o ganho de cada geração.',
        ],
        sourceUrl: 'https://www.computerhistory.org/timeline/graphics-games/',
    };
    exports.BIT_BRIDGE_PSEUDOCODE = `CRIAR UMA ÚNICA SIMULAÇÃO:
      guardar posição, velocidade, fragmentos, vidas e checkpoints
      executar movimento, gravidade e colisões sem depender dos gráficos
    
    AO ESCOLHER 8 BITS:
      reduzir resolução interna e paleta
      usar sprites menores e animações curtas
      desenhar uma camada de fundo e três canais sonoros
    
    AO ESCOLHER 16 BITS:
      ampliar paleta, sprites e quadros de animação
      desenhar quatro camadas de paralaxe
      adicionar partículas, gradientes e mais canais sonoros
    
    AO ALTERNAR A GERAÇÃO:
      preservar exatamente o estado da simulação
      trocar somente renderização e arranjo sonoro
      atualizar o painel técnico comparativo
    
    PARA CONCLUIR:
      coletar oito fragmentos de memória
      registrar checkpoints
      alcançar o portal final com a ponte estabilizada`;
    exports.BIT_BRIDGE_COMPARISON = [
        ['Simulação', 'Movimento e regras compactas em hardware limitado', 'A mesma simulação TypeScript alimenta as duas apresentações'],
        ['Resolução', '256 × 224 como referência didática', '320 × 224 com área visual mais detalhada'],
        ['Paleta', '16 cores simultâneas no modo histórico do laboratório', '64 cores selecionadas para gradientes, iluminação e cenários'],
        ['Sprites', 'Personagem 16 × 24 e dois quadros principais', 'Personagem 24 × 32 e seis quadros de animação'],
        ['Cenário', 'Uma camada de fundo e repetição de tiles', 'Quatro camadas de paralaxe com velocidades diferentes'],
        ['Áudio', 'Três vozes sintetizadas', 'Oito canais conceituais com timbres e efeitos adicionais'],
        ['Memória estimada', '32 kB para o pacote visual didático', '256 kB para mais quadros, cores e áudio'],
        ['Identidade', 'Limites inspirados na geração de 8 bits', 'Comparação autoral sem reproduzir jogo, personagem ou cenário comercial'],
    ];
    
  };
  __modules["games/bit-bridge-16/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const bit_bridge_runtime_1 = __require("games/bit-bridge-16/phaser/bit-bridge-runtime");
    function createRuntime() {
        return new bit_bridge_runtime_1.BitBridgeRuntime();
    }
    
  };
  __modules["games/bit-bridge-16/phaser/bit-bridge-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BitBridgeRuntime = void 0;
    const bit_bridge_audio_1 = __require("games/bit-bridge-16/audio/bit-bridge-audio");
    const bit_bridge_simulation_1 = __require("games/bit-bridge-16/simulation/bit-bridge-simulation");
    class BitBridgeRuntime {
        id = 'bit-bridge-16';
        state = 'not-loaded';
        #simulation = new bit_bridge_simulation_1.BitBridgeSimulation();
        #game;
        #graphics;
        #title;
        #stats;
        #message;
        #tech;
        #audio;
        #context;
        #time = 0;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new bit_bridge_simulation_1.BitBridgeSimulation(parseMode(context.parameters?.mode));
            this.#audio = new bit_bridge_audio_1.BitBridgeAudio(context.muted);
            this.#audio.setGeneration(this.#simulation.state.generation);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class BitBridgeScene extends Phaser.Scene {
                #view;
                constructor() { super('bit-bridge-16'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    owner.#title = this.add.text(20, 14, '', {
                        fontFamily: 'monospace', fontSize: '20px', fontStyle: 'bold', color: '#f4fbff',
                    });
                    owner.#stats = this.add.text(20, 43, '', {
                        fontFamily: 'monospace', fontSize: '13px', color: '#c4d5e8',
                    });
                    owner.#tech = this.add.text(0, 16, '', {
                        fontFamily: 'monospace', fontSize: '12px', color: '#d9ecff', align: 'left',
                        backgroundColor: '#08111ed9', padding: { x: 10, y: 8 },
                    });
                    owner.#message = this.add.text(20, 0, '', {
                        fontFamily: 'system-ui', fontSize: '14px', color: '#e8f3ff', wordWrap: { width: 820 },
                        backgroundColor: '#020711c7', padding: { x: 8, y: 5 },
                    });
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(time, delta) {
                    owner.#time = time;
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 1000,
                height: 650,
                backgroundColor: '#030712',
                transparent: false,
                scene: BitBridgeScene,
                render: {
                    antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo',
                    pixelArt: context.graphicsMode === 'historico',
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            if (this.#simulation.state.status === 'won' || this.#simulation.state.status === 'lost')
                this.#simulation.restart(this.#simulation.state.mode);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve', detail: { generation: this.#simulation.state.generation } });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-left')
                this.#simulation.setMoveLeft(input.active);
            if (input.action === 'move-right')
                this.#simulation.setMoveRight(input.active);
            if (input.action === 'jump' && input.active)
                this.#processEvents(this.#simulation.jump());
            if (input.action === 'primary-action' && input.active)
                this.#processEvents(this.#simulation.toggleGeneration());
            this.#redraw();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            this.#audio?.setGeneration(this.#simulation.state.generation);
            this.state = this.#simulation.state.status === 'won' || this.#simulation.state.status === 'lost' ? 'finished' : 'paused';
            this.#redraw();
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#title = undefined;
            this.#stats = undefined;
            this.#message = undefined;
            this.#tech = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            if (events.includes('generation-changed'))
                this.#audio?.setGeneration(current.generation);
            for (const event of events) {
                if (event === 'finished') {
                    this.state = 'finished';
                    this.#context?.onEvent?.({
                        type: 'finished',
                        detail: {
                            winner: current.status === 'won' ? 'player' : 'system',
                            score: current.score,
                            fragments: current.fragments.length,
                            lives: current.lives,
                            switches: current.switches,
                            generation: current.generation,
                            elapsed: Math.round(current.elapsedMs / 1000),
                        },
                    });
                }
                else {
                    this.#context?.onEvent?.({
                        type: 'progress',
                        detail: {
                            event,
                            score: current.score,
                            fragments: current.fragments.length,
                            lives: current.lives,
                            zone: current.zone,
                            generation: current.generation,
                        },
                    });
                }
            }
        }
        #redraw() {
            if (!this.#graphics || !this.#game)
                return;
            this.#draw(this.#graphics, this.#game.scale.width, this.#game.scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const historical = state.generation === '8-bit';
            const worldTop = Math.max(88, Math.min(116, height * 0.17));
            const worldHeight = Math.max(360, height - worldTop - 54);
            const scale = worldHeight / 600;
            const viewportWidth = width / scale;
            const cameraX = clamp(state.player.x - viewportWidth * 0.34, 0, bit_bridge_simulation_1.BIT_BRIDGE_WORLD_WIDTH - viewportWidth);
            const worldX = (value) => (value - cameraX) * scale;
            const worldY = (value) => worldTop + value * scale;
            graphics.clear();
            if (historical)
                this.#drawEightBitBackground(graphics, width, height, worldTop, cameraX, scale);
            else
                this.#drawSixteenBitBackground(graphics, width, height, worldTop, cameraX, scale);
            graphics.fillStyle(historical ? 0x254c59 : 0x173f4a, 1);
            graphics.fillRect(0, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y), width, Math.max(1, height - worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y)));
            graphics.fillStyle(historical ? 0x4f8a72 : 0x3ab47a, 1);
            graphics.fillRect(0, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y), width, Math.max(2, 8 * scale));
            for (const platform of bit_bridge_simulation_1.BIT_BRIDGE_PLATFORMS) {
                const x = worldX(platform.x);
                const platformWidth = platform.width * scale;
                if (x + platformWidth < 0 || x > width)
                    continue;
                graphics.fillStyle(historical ? 0xb86f3d : 0x9f5b3b, 1);
                graphics.fillRect(x, worldY(platform.y), platformWidth, platform.height * scale);
                graphics.fillStyle(historical ? 0xe3ba5d : 0xf0c85d, 1);
                graphics.fillRect(x, worldY(platform.y), platformWidth, Math.max(2, 5 * scale));
                if (!historical) {
                    graphics.fillStyle(0x552f2f, 0.55);
                    for (let block = 12; block < platform.width; block += 28)
                        graphics.fillRect(worldX(platform.x + block), worldY(platform.y + 8), 5 * scale, 8 * scale);
                }
            }
            for (const hazard of bit_bridge_simulation_1.BIT_BRIDGE_HAZARDS) {
                const x = worldX(hazard.x);
                if (x + hazard.width * scale < 0 || x > width)
                    continue;
                const spikes = Math.max(2, Math.floor(hazard.width / 18));
                for (let index = 0; index < spikes; index += 1) {
                    const left = x + index * (hazard.width / spikes) * scale;
                    const spikeWidth = (hazard.width / spikes) * scale;
                    graphics.fillStyle(historical ? 0xd94b4b : 0xff526f, 1);
                    graphics.fillTriangle(left, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y), left + spikeWidth / 2, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y - 24), left + spikeWidth, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y));
                }
            }
            for (const checkpoint of bit_bridge_simulation_1.BIT_BRIDGE_CHECKPOINTS) {
                const x = worldX(checkpoint);
                if (x < -30 || x > width + 30)
                    continue;
                const active = checkpoint <= state.checkpointX;
                graphics.fillStyle(active ? 0x68e7ff : 0x526173, 1);
                graphics.fillRect(x, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y - 95), Math.max(2, 5 * scale), 95 * scale);
                graphics.fillStyle(active ? 0xeafaff : 0x8996a7, active ? 0.95 : 0.6);
                graphics.fillTriangle(x + 5 * scale, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y - 95), x + 38 * scale, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y - 78), x + 5 * scale, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y - 62));
            }
            for (const fragment of bit_bridge_simulation_1.BIT_BRIDGE_FRAGMENTS) {
                if (state.fragments.includes(fragment.id))
                    continue;
                const x = worldX(fragment.x);
                const y = worldY(fragment.y);
                if (x < -30 || x > width + 30)
                    continue;
                const pulse = historical || this.#context?.reducedMotion ? 1 : 1 + Math.sin(this.#time * 0.006 + fragment.id) * 0.16;
                const size = 10 * scale * pulse;
                graphics.fillStyle(historical ? 0xffe36b : 0x7cf6ff, 0.25);
                graphics.fillCircle(x, y, size * 1.9);
                graphics.fillStyle(historical ? 0xffe36b : 0xeaffff, 1);
                graphics.fillRect(x - size, y - size, size * 2, size * 2);
                if (!historical) {
                    graphics.lineStyle(Math.max(1, 2 * scale), 0x68b9ff, 0.9);
                    graphics.strokeRect(x - size * 1.35, y - size * 1.35, size * 2.7, size * 2.7);
                }
            }
            const portalX = worldX(bit_bridge_simulation_1.BIT_BRIDGE_WORLD_WIDTH - 130);
            if (portalX > -120 && portalX < width + 120) {
                const ready = state.fragments.length >= bit_bridge_simulation_1.BIT_BRIDGE_REQUIRED_FRAGMENTS;
                graphics.lineStyle(Math.max(3, 8 * scale), ready ? 0x6fffe9 : 0x6c6175, 0.9);
                graphics.strokeRoundedRect(portalX - 38 * scale, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y - 118), 76 * scale, 118 * scale, 22 * scale);
                if (ready && !historical) {
                    graphics.fillStyle(0x6fffe9, 0.18 + Math.sin(this.#time * 0.005) * 0.06);
                    graphics.fillRoundedRect(portalX - 31 * scale, worldY(bit_bridge_simulation_1.BIT_BRIDGE_GROUND_Y - 109), 62 * scale, 105 * scale, 18 * scale);
                }
            }
            this.#drawPlayer(graphics, worldX(state.player.x), worldY(state.player.y), scale, state);
            const spec = bit_bridge_simulation_1.BIT_GENERATION_SPECS[state.generation];
            this.#title?.setText(`PONTE 8→16 BITS · ${state.generation.toUpperCase()}`);
            this.#stats?.setText(`PONTOS ${state.score}   VIDAS ${state.lives}   FRAGMENTOS ${state.fragments.length}/${bit_bridge_simulation_1.BIT_BRIDGE_REQUIRED_FRAGMENTS}   ZONA ${state.zone}/4   TROCAS ${state.switches}`);
            this.#tech?.setText([
                spec.internalResolution,
                `${spec.paletteColors} cores`,
                `sprite ${spec.spriteSize}`,
                `${spec.animationFrames} quadros`,
                `${spec.parallaxLayers} camada${spec.parallaxLayers > 1 ? 's' : ''}`,
                `${spec.audioChannels} canais de áudio`,
                `~${spec.estimatedMemoryKb} kB`,
            ]).setPosition(Math.max(10, width - 178), 14);
            this.#message?.setText(state.message).setPosition(20, Math.max(worldTop + 8, height - 42));
        }
        #drawEightBitBackground(graphics, width, height, top, cameraX, scale) {
            graphics.fillStyle(0x101b3d, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x263f73, 1);
            graphics.fillRect(0, top, width, 150 * scale);
            graphics.fillStyle(0xefc75e, 1);
            graphics.fillRect(width * 0.74, top + 36 * scale, 42 * scale, 42 * scale);
            graphics.fillStyle(0x315d69, 1);
            const tile = Math.max(8, 32 * scale);
            const offset = -((cameraX * 0.08 * scale) % tile);
            for (let x = offset; x < width + tile; x += tile) {
                const heightVariant = 45 + (Math.floor((x - offset) / tile) % 4) * 14;
                graphics.fillRect(x, top + 280 * scale - heightVariant * scale, tile + 1, heightVariant * scale);
            }
            graphics.fillStyle(0x24474e, 1);
            graphics.fillRect(0, top + 280 * scale, width, height);
        }
        #drawSixteenBitBackground(graphics, width, height, top, cameraX, scale) {
            graphics.fillGradientStyle(0x07152f, 0x07152f, 0x315a7b, 0x315a7b, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0xffd878, 0.95);
            graphics.fillCircle(width * 0.75, top + 65 * scale, 38 * scale);
            const layers = [
                { speed: 0.05, color: 0x2a5574, baseline: 255, amplitude: 65, step: 180 },
                { speed: 0.12, color: 0x276568, baseline: 325, amplitude: 50, step: 135 },
                { speed: 0.22, color: 0x24584f, baseline: 405, amplitude: 38, step: 100 },
                { speed: 0.36, color: 0x183e38, baseline: 465, amplitude: 26, step: 75 },
            ];
            for (const layer of layers) {
                graphics.fillStyle(layer.color, 1);
                const offset = -((cameraX * layer.speed * scale) % (layer.step * scale));
                const points = [{ x: 0, y: height }];
                for (let index = -1; index < width / (layer.step * scale) + 3; index += 1) {
                    const x = offset + index * layer.step * scale;
                    const wave = Math.sin(index * 1.7 + layer.speed * 10) * layer.amplitude;
                    points.push({ x, y: top + (layer.baseline - layer.amplitude + wave) * scale });
                }
                points.push({ x: width, y: height });
                graphics.fillPoints(points, true);
            }
            if (!this.#context?.reducedMotion && this.#context?.graphicsMode !== 'baixo') {
                graphics.fillStyle(0xd7fbff, 0.5);
                for (let index = 0; index < 20; index += 1) {
                    const x = (index * 97 + this.#time * 0.012) % (width + 40) - 20;
                    const y = top + ((index * 53) % Math.max(100, height - top - 150));
                    graphics.fillCircle(x, y, 1.5 + (index % 3));
                }
            }
        }
        #drawPlayer(graphics, x, y, scale, state) {
            const historical = state.generation === '8-bit';
            if (state.player.invulnerableMs > 0 && Math.floor(state.player.invulnerableMs / 100) % 2 === 0)
                return;
            const facing = state.player.facing;
            if (historical) {
                const pixel = Math.max(2, 4 * scale);
                graphics.fillStyle(0x78e2ff, 1);
                graphics.fillRect(x + 4 * scale, y, 14 * scale, 10 * scale);
                graphics.fillStyle(0xf4dc9a, 1);
                graphics.fillRect(x + 6 * scale, y + 10 * scale, 12 * scale, 8 * scale);
                graphics.fillStyle(0x4067c4, 1);
                graphics.fillRect(x + 3 * scale, y + 18 * scale, 17 * scale, 10 * scale);
                graphics.fillStyle(0x162448, 1);
                graphics.fillRect(x + (facing > 0 ? 14 : 6) * scale, y + 12 * scale, pixel, pixel);
                const walk = Math.abs(state.player.vx) > 20 && Math.floor(this.#time / 140) % 2 === 1;
                graphics.fillRect(x + (walk ? 3 : 5) * scale, y + 28 * scale, 6 * scale, 4 * scale);
                graphics.fillRect(x + (walk ? 13 : 11) * scale, y + 28 * scale, 6 * scale, 4 * scale);
            }
            else {
                const bob = state.player.onGround && Math.abs(state.player.vx) > 20 ? Math.sin(this.#time * 0.018) * 1.5 * scale : 0;
                graphics.fillStyle(0x66e8ff, 0.2);
                graphics.fillCircle(x + 11 * scale, y + 16 * scale + bob, 22 * scale);
                graphics.fillStyle(0x3d7ae8, 1);
                graphics.fillRoundedRect(x + 2 * scale, y + 13 * scale + bob, 20 * scale, 16 * scale, 5 * scale);
                graphics.fillStyle(0xf5dca5, 1);
                graphics.fillCircle(x + 11 * scale, y + 9 * scale + bob, 9 * scale);
                graphics.fillStyle(0x93efff, 1);
                graphics.fillRoundedRect(x + 2 * scale, y + bob, 18 * scale, 8 * scale, 4 * scale);
                graphics.fillStyle(0x102a55, 1);
                graphics.fillCircle(x + (facing > 0 ? 15 : 7) * scale, y + 8 * scale + bob, 1.6 * scale);
                const stride = Math.sin(this.#time * 0.022) * Math.min(5, Math.abs(state.player.vx) / 45) * scale;
                graphics.lineStyle(Math.max(2, 4 * scale), 0x1f3966, 1);
                graphics.lineBetween(x + 8 * scale, y + 28 * scale + bob, x + 7 * scale - stride, y + 34 * scale + bob);
                graphics.lineBetween(x + 16 * scale, y + 28 * scale + bob, x + 17 * scale + stride, y + 34 * scale + bob);
            }
        }
    }
    exports.BitBridgeRuntime = BitBridgeRuntime;
    function parseMode(value) {
        return value === 'classico' || value === 'expandido' ? value : 'comparativo';
    }
    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
    
  };
  __modules["games/bit-bridge-16/simulation/bit-bridge-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BitBridgeSimulation = exports.BIT_BRIDGE_CHECKPOINTS = exports.BIT_BRIDGE_HAZARDS = exports.BIT_BRIDGE_FRAGMENTS = exports.BIT_BRIDGE_PLATFORMS = exports.BIT_BRIDGE_REQUIRED_FRAGMENTS = exports.BIT_BRIDGE_GROUND_Y = exports.BIT_BRIDGE_WORLD_WIDTH = exports.BIT_GENERATION_SPECS = void 0;
    exports.BIT_GENERATION_SPECS = {
        '8-bit': {
            label: 'Apresentação 8 bits',
            internalResolution: '256 × 224',
            paletteColors: 16,
            spriteSize: '16 × 24 px',
            animationFrames: 2,
            parallaxLayers: 1,
            audioChannels: 3,
            estimatedMemoryKb: 32,
        },
        '16-bit': {
            label: 'Apresentação 16 bits',
            internalResolution: '320 × 224',
            paletteColors: 64,
            spriteSize: '24 × 32 px',
            animationFrames: 6,
            parallaxLayers: 4,
            audioChannels: 8,
            estimatedMemoryKb: 256,
        },
    };
    exports.BIT_BRIDGE_WORLD_WIDTH = 4200;
    exports.BIT_BRIDGE_GROUND_Y = 520;
    exports.BIT_BRIDGE_REQUIRED_FRAGMENTS = 8;
    exports.BIT_BRIDGE_PLATFORMS = [
        { x: 260, y: 450, width: 180, height: 22 },
        { x: 570, y: 405, width: 190, height: 22 },
        { x: 880, y: 455, width: 160, height: 22 },
        { x: 1210, y: 390, width: 210, height: 22 },
        { x: 1540, y: 440, width: 190, height: 22 },
        { x: 1900, y: 370, width: 220, height: 22 },
        { x: 2260, y: 430, width: 180, height: 22 },
        { x: 2580, y: 350, width: 220, height: 22 },
        { x: 2960, y: 420, width: 200, height: 22 },
        { x: 3300, y: 365, width: 210, height: 22 },
        { x: 3660, y: 440, width: 180, height: 22 },
    ];
    exports.BIT_BRIDGE_FRAGMENTS = [
        { id: 0, x: 350, y: 410 },
        { id: 1, x: 660, y: 365 },
        { id: 2, x: 950, y: 415 },
        { id: 3, x: 1320, y: 350 },
        { id: 4, x: 1660, y: 400 },
        { id: 5, x: 2020, y: 330 },
        { id: 6, x: 2690, y: 310 },
        { id: 7, x: 3400, y: 325 },
        { id: 8, x: 3750, y: 400 },
    ];
    exports.BIT_BRIDGE_HAZARDS = [
        { x: 780, width: 72 },
        { x: 1450, width: 78 },
        { x: 2160, width: 82 },
        { x: 2840, width: 88 },
        { x: 3540, width: 90 },
    ];
    exports.BIT_BRIDGE_CHECKPOINTS = [1050, 2150, 3200];
    const MODE_START_GENERATION = {
        comparativo: '8-bit',
        classico: '8-bit',
        expandido: '16-bit',
    };
    class BitBridgeSimulation {
        #state;
        constructor(mode = 'comparativo') {
            this.#state = initialState(mode);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status !== 'ready')
                return;
            this.#state = { ...this.#state, status: 'playing', message: 'Colete oito fragmentos e atravesse a Ponte de Bits.' };
        }
        restart(mode = this.#state.mode) {
            this.#state = initialState(mode);
            this.start();
        }
        setMoveLeft(active) {
            if (this.#state.status !== 'playing')
                return;
            this.#state = { ...this.#state, moveLeft: active };
        }
        setMoveRight(active) {
            if (this.#state.status !== 'playing')
                return;
            this.#state = { ...this.#state, moveRight: active };
        }
        jump() {
            if (this.#state.status !== 'playing' || !this.#state.player.onGround)
                return [];
            this.#state = {
                ...this.#state,
                player: { ...this.#state.player, vy: -560, onGround: false },
                message: 'Salto executado pela mesma lógica nas duas gerações.',
            };
            return ['jump'];
        }
        toggleGeneration() {
            if (this.#state.status !== 'playing' || this.#state.mode !== 'comparativo')
                return [];
            const generation = this.#state.generation === '8-bit' ? '16-bit' : '8-bit';
            this.#state = {
                ...this.#state,
                generation,
                switches: this.#state.switches + 1,
                score: this.#state.score + 15,
                message: `${exports.BIT_GENERATION_SPECS[generation].label}: a simulação foi preservada; apenas a apresentação mudou.`,
            };
            return ['generation-changed'];
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const dt = Math.min(Math.max(deltaMs, 0), 50) / 1000;
            const events = [];
            const direction = Number(this.#state.moveRight) - Number(this.#state.moveLeft);
            const acceleration = this.#state.player.onGround ? 1150 : 720;
            const maxSpeed = this.#state.generation === '16-bit' ? 310 : 285;
            let vx = this.#state.player.vx + direction * acceleration * dt;
            if (direction === 0)
                vx *= Math.pow(this.#state.player.onGround ? 0.001 : 0.12, dt);
            vx = clamp(vx, -maxSpeed, maxSpeed);
            let vy = Math.min(820, this.#state.player.vy + 1450 * dt);
            let x = clamp(this.#state.player.x + vx * dt, 0, exports.BIT_BRIDGE_WORLD_WIDTH - this.#state.player.width);
            let y = this.#state.player.y + vy * dt;
            let onGround = false;
            const previousBottom = this.#state.player.y + this.#state.player.height;
            const nextBottom = y + this.#state.player.height;
            const platforms = [{ x: 0, y: exports.BIT_BRIDGE_GROUND_Y, width: exports.BIT_BRIDGE_WORLD_WIDTH, height: 100 }, ...exports.BIT_BRIDGE_PLATFORMS];
            for (const platform of platforms) {
                const horizontallyAligned = x + this.#state.player.width > platform.x && x < platform.x + platform.width;
                if (vy >= 0 && horizontallyAligned && previousBottom <= platform.y + 8 && nextBottom >= platform.y) {
                    y = platform.y - this.#state.player.height;
                    vy = 0;
                    onGround = true;
                    break;
                }
            }
            const facing = direction === 0 ? this.#state.player.facing : direction < 0 ? -1 : 1;
            let next = {
                ...this.#state,
                elapsedMs: this.#state.elapsedMs + deltaMs,
                distance: Math.max(this.#state.distance, x),
                player: {
                    ...this.#state.player,
                    x,
                    y,
                    vx,
                    vy,
                    onGround,
                    facing,
                    invulnerableMs: Math.max(0, this.#state.player.invulnerableMs - deltaMs),
                },
            };
            for (const fragment of exports.BIT_BRIDGE_FRAGMENTS) {
                if (next.fragments.includes(fragment.id))
                    continue;
                if (overlaps(next.player.x, next.player.y, next.player.width, next.player.height, fragment.x - 12, fragment.y - 12, 24, 24)) {
                    next = {
                        ...next,
                        fragments: [...next.fragments, fragment.id],
                        score: next.score + 250,
                        message: `Fragmento ${next.fragments.length + 1}/${exports.BIT_BRIDGE_REQUIRED_FRAGMENTS} coletado.`,
                    };
                    events.push('fragment-collected');
                }
            }
            const reachedCheckpoint = [...exports.BIT_BRIDGE_CHECKPOINTS].reverse().find((checkpoint) => next.player.x >= checkpoint && checkpoint > next.checkpointX);
            if (reachedCheckpoint !== undefined) {
                next = { ...next, checkpointX: reachedCheckpoint, score: next.score + 120, message: 'Checkpoint geracional registrado.' };
                events.push('checkpoint');
            }
            const zone = Math.min(3, Math.floor(next.player.x / 1050) + 1);
            if (zone !== next.zone) {
                next = { ...next, zone, score: next.score + 100, message: `Zona ${zone}/4 alcançada.` };
                events.push('zone-changed');
            }
            const touchingHazard = next.player.invulnerableMs <= 0 && exports.BIT_BRIDGE_HAZARDS.some((hazard) => overlaps(next.player.x, next.player.y, next.player.width, next.player.height, hazard.x, exports.BIT_BRIDGE_GROUND_Y - 24, hazard.width, 24));
            if (touchingHazard || next.player.y > 700) {
                const damaged = applyDamage(next);
                next = damaged.state;
                events.push(...damaged.events);
            }
            if (next.player.x >= exports.BIT_BRIDGE_WORLD_WIDTH - 180) {
                if (next.fragments.length >= exports.BIT_BRIDGE_REQUIRED_FRAGMENTS) {
                    next = {
                        ...next,
                        status: 'won',
                        score: next.score + 2000 + Math.max(0, 600 - Math.floor(next.elapsedMs / 1000)) * 2,
                        message: 'Ponte concluída: a mesma lógica atravessou duas gerações gráficas.',
                    };
                    events.push('finished');
                }
                else {
                    next = { ...next, player: { ...next.player, x: exports.BIT_BRIDGE_WORLD_WIDTH - 260, vx: 0 }, message: `Ainda faltam ${exports.BIT_BRIDGE_REQUIRED_FRAGMENTS - next.fragments.length} fragmentos para estabilizar a ponte.` };
                }
            }
            this.#state = next;
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save da Ponte 8→16 Bits incompatível');
            this.#state = cloneState(state);
        }
    }
    exports.BitBridgeSimulation = BitBridgeSimulation;
    function initialState(mode) {
        const generation = MODE_START_GENERATION[mode];
        return {
            schemaVersion: 1,
            mode,
            status: 'ready',
            generation,
            player: { x: 60, y: exports.BIT_BRIDGE_GROUND_Y - 32, vx: 0, vy: 0, width: 22, height: 32, onGround: true, facing: 1, invulnerableMs: 0 },
            moveLeft: false,
            moveRight: false,
            lives: 4,
            score: 0,
            fragments: [],
            checkpointX: 60,
            zone: 1,
            switches: 0,
            elapsedMs: 0,
            distance: 60,
            message: mode === 'comparativo' ? 'Alterne entre 8 e 16 bits sem reiniciar a simulação.' : `Modo fixo ${exports.BIT_GENERATION_SPECS[generation].label}.`,
        };
    }
    function applyDamage(state) {
        const lives = state.lives - 1;
        if (lives <= 0) {
            return {
                state: { ...state, lives: 0, status: 'lost', player: { ...state.player, vx: 0, vy: 0 }, message: 'A ponte perdeu estabilidade. Reinicie a experiência.' },
                events: ['damage', 'life-lost', 'finished'],
            };
        }
        return {
            state: {
                ...state,
                lives,
                score: Math.max(0, state.score - 80),
                player: { ...state.player, x: state.checkpointX, y: exports.BIT_BRIDGE_GROUND_Y - state.player.height, vx: 0, vy: 0, onGround: true, invulnerableMs: 1600 },
                message: `Instabilidade detectada. Retorno ao checkpoint com ${lives} vidas.`,
            },
            events: ['damage', 'life-lost'],
        };
    }
    function cloneState(state) {
        return { ...state, player: { ...state.player }, fragments: [...state.fragments] };
    }
    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
    function overlaps(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }
    
  };
  __modules["games/block-reactor/audio/block-reactor-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockReactorAudio = void 0;
    class BlockReactorAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const tones = {
                launch: [360, 0.06, 'square', 0.025], 'wall-hit': [190, 0.035, 'square', 0.012], 'paddle-hit': [280, 0.05, 'triangle', 0.022],
                'block-hit': [470, 0.045, 'square', 0.018], 'block-destroyed': [640, 0.07, 'triangle', 0.024], explosion: [82, 0.19, 'sawtooth', 0.03],
                'power-up-spawned': [720, 0.12, 'sine', 0.02], 'power-up-collected': [920, 0.22, 'triangle', 0.028], 'life-lost': [96, 0.25, 'sawtooth', 0.03],
                'level-complete': [780, 0.3, 'triangle', 0.028], victory: [1050, 0.45, 'triangle', 0.032], 'game-over': [48, 0.5, 'sawtooth', 0.034],
                pause: [150, 0.08, 'square', 0.018],
            };
            const [frequency, duration, type, volume] = tones[event];
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            if (event === 'explosion' || event === 'life-lost' || event === 'game-over') {
                oscillator.frequency.exponentialRampToValueAtTime(Math.max(28, frequency * 0.42), context.currentTime + duration);
            }
            gain.gain.setValueAtTime(volume, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration);
        }
        dispose() {
            if (this.#context)
                void this.#context.close();
            this.#context = undefined;
        }
    }
    exports.BlockReactorAudio = BlockReactorAudio;
    
  };
  __modules["games/block-reactor/content/block-reactor-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BLOCK_REACTOR_COMPARISON = exports.BLOCK_REACTOR_PSEUDOCODE = exports.BLOCK_REACTOR_HISTORY = void 0;
    exports.BLOCK_REACTOR_HISTORY = {
        title: 'Quando uma raquete passou a desmontar paredes',
        paragraphs: [
            'Em 1976, Breakout transformou a lógica de raquete e bola em um desafio individual: a bola deixou de atravessar apenas uma quadra e passou a remover uma parede de blocos.',
            'A própria Atari registra que o projeto nasceu após o sucesso de Pong e preservou suas mecânicas centrais de bola e raquete. O gabinete original usava circuitos dedicados, antes de versões domésticas ampliarem o gênero.',
            'Reator de Blocos é uma reconstrução educacional autoral. Fases, identidade, power-ups, editor e código foram desenvolvidos para o Fliperama DS, sem reutilizar arte, áudio ou implementação comercial.',
        ],
        sourceUrl: 'https://atari.com/blogs/atari/new-insight-into-breakout-s-origins',
    };
    exports.BLOCK_REACTOR_PSEUDOCODE = `A CADA PASSO DA SIMULAÇÃO:
      mover a raquete conforme a entrada
      mover a bola por velocidade × tempo
      rebater a bola nas paredes e na raquete
    
    SE A BOLA TOCAR UM BLOCO:
      reduzir a resistência do bloco
      inverter o eixo correto da velocidade
      se o bloco for destruído:
        somar pontos e aumentar a sequência
        ativar explosão ou liberar power-up quando necessário
    
    SE NÃO RESTAREM BLOCOS:
      carregar a próxima fase
      após a última fase, concluir a campanha
    
    SE A BOLA SAIR DA ARENA:
      remover uma vida e preparar novo lançamento`;
    exports.BLOCK_REACTOR_COMPARISON = [
        ['Objetivo', 'Remover uma parede usando bola e raquete', 'Campanha autoral de três fases e laboratório personalizado'],
        ['Blocos', 'Fileiras com valores e resistência definidos pelo hardware', 'Comuns, resistentes, explosivos e blocos de bônus'],
        ['Controle', 'Controlador físico dedicado', 'Teclado, toque responsivo e pausa automática'],
        ['Progressão', 'Pontuação e número limitado de bolas', 'Vidas, sequência, multiplicador e três power-ups temporários'],
        ['Criação', 'Layout fixo do gabinete', 'Editor 8 × 5 com teste imediato da fase criada'],
        ['Aprendizagem', 'Mecânica compreendida pela prática', 'Colisão AABB, vetores, dados de fase e estado serializável explicados'],
    ];
    
  };
  __modules["games/block-reactor/editor/block-layout"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EDITOR_ROWS = exports.EDITOR_COLUMNS = void 0;
    exports.isValidEditorLayout = isValidEditorLayout;
    exports.EDITOR_COLUMNS = 8;
    exports.EDITOR_ROWS = 5;
    function isValidEditorLayout(layout) {
        return layout.length === exports.EDITOR_COLUMNS * exports.EDITOR_ROWS && /^[.nreb]+$/.test(layout) && /[nreb]/.test(layout);
    }
    
  };
  __modules["games/block-reactor/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const block_reactor_runtime_1 = __require("games/block-reactor/phaser/block-reactor-runtime");
    function createRuntime() {
        return new block_reactor_runtime_1.BlockReactorRuntime();
    }
    
  };
  __modules["games/block-reactor/phaser/block-reactor-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockReactorRuntime = void 0;
    const block_reactor_audio_1 = __require("games/block-reactor/audio/block-reactor-audio");
    const block_reactor_simulation_1 = __require("games/block-reactor/simulation/block-reactor-simulation");
    class BlockReactorRuntime {
        id = 'block-reactor';
        state = 'not-loaded';
        #simulation = new block_reactor_simulation_1.BlockReactorSimulation();
        #game;
        #graphics;
        #audio;
        #context;
        #left = false;
        #right = false;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            const customLayout = typeof context.parameters?.layout === 'string' ? context.parameters.layout : undefined;
            this.#simulation = new block_reactor_simulation_1.BlockReactorSimulation(parseMode(context.parameters?.mode), Date.now(), customLayout);
            this.#audio = new block_reactor_audio_1.BlockReactorAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class BlockReactorScene extends Phaser.Scene {
                #view;
                constructor() { super('block-reactor'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 620,
                backgroundColor: '#030710',
                transparent: false,
                scene: BlockReactorScene,
                render: { antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo', pixelArt: context.graphicsMode === 'historico' },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'victory' || current.status === 'game-over')
                this.#simulation.restart(current.mode, current.customLayout);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve' });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#clearMovement();
            this.#audio?.play('pause');
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-left')
                this.#left = input.active;
            if (input.action === 'move-right')
                this.#right = input.active;
            this.#simulation.setPaddleDirection(this.#left === this.#right ? 0 : this.#left ? -1 : 1);
            if (input.action === 'primary-action' && input.active)
                this.#processEvents(this.#simulation.launch());
            this.#redraw();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'victory' || status === 'game-over' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#clearMovement();
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #clearMovement() {
            this.#left = false;
            this.#right = false;
            this.#simulation.setPaddleDirection(0);
        }
        #processEvents(events) {
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            if (events.some((event) => ['block-destroyed', 'power-up-collected', 'life-lost', 'level-complete'].includes(event))) {
                const progressEvent = events.includes('level-complete')
                    ? 'level-complete'
                    : events.includes('life-lost')
                        ? 'life-lost'
                        : events.includes('power-up-collected')
                            ? 'power-up-collected'
                            : 'block-destroyed';
                this.#context?.onEvent?.({
                    type: 'progress',
                    detail: {
                        score: current.score,
                        lives: current.lives,
                        level: current.level,
                        combo: current.combo,
                        remaining: current.blocks.filter((block) => block.alive).length,
                        event: progressEvent,
                    },
                });
            }
            if (events.includes('victory') || events.includes('game-over')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: events.includes('victory') ? 'player' : 'reactor',
                        score: current.score,
                        lives: current.lives,
                        level: current.level,
                        bestCombo: current.bestCombo,
                        custom: Boolean(current.customLayout),
                    },
                });
            }
        }
        #redraw() {
            const graphics = this.#graphics;
            const scale = this.#game?.scale;
            if (graphics && scale)
                this.#draw(graphics, scale.width, scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const mode = this.#context?.graphicsMode ?? 'medio';
            const historical = mode === 'historico';
            const primary = historical ? 0xf5f5f5 : 0x49e7ff;
            const accent = historical ? 0xbebebe : 0x9273ff;
            const minSize = Math.min(width, height);
            graphics.clear();
            graphics.fillStyle(historical ? 0x050505 : 0x030710, 1);
            graphics.fillRect(0, 0, width, height);
            if (!historical && mode !== 'baixo') {
                graphics.lineStyle(1, primary, 0.07);
                const step = Math.max(34, Math.floor(minSize / 11));
                for (let x = 0; x < width; x += step)
                    graphics.lineBetween(x, 0, x, height);
                for (let y = 0; y < height; y += step)
                    graphics.lineBetween(0, y, width, y);
                if (mode === 'alto' || mode === 'ultra') {
                    graphics.fillStyle(accent, 0.05);
                    graphics.fillCircle(state.ball.x * width, state.ball.y * height, minSize * 0.085);
                }
            }
            graphics.lineStyle(Math.max(1, minSize * 0.002), primary, historical ? 0.72 : 0.22);
            graphics.strokeRect(1, 1, width - 2, height - 2);
            state.blocks.filter((block) => block.alive).forEach((block) => this.#drawBlock(graphics, block, width, height, historical));
            for (const powerUp of state.powerUps) {
                const color = powerUpColor(powerUp.type, historical);
                const radius = Math.max(8, minSize * 0.018);
                graphics.fillStyle(color, historical ? 0.88 : 0.96);
                graphics.fillCircle(powerUp.x * width, powerUp.y * height, radius);
                graphics.lineStyle(2, historical ? 0x111111 : 0x041119, 0.9);
                graphics.strokeCircle(powerUp.x * width, powerUp.y * height, radius * 0.55);
            }
            const paddleWidth = this.#simulation.paddleWidth() * width;
            const paddleHeight = Math.max(9, 0.025 * height);
            graphics.fillStyle(primary, 1);
            graphics.fillRoundedRect(state.paddleX * width - paddleWidth / 2, 0.91 * height - paddleHeight / 2, paddleWidth, paddleHeight, historical ? 0 : paddleHeight / 2);
            if (!historical) {
                graphics.fillStyle(0xffffff, 0.68);
                graphics.fillRect(state.paddleX * width - paddleWidth * 0.28, 0.91 * height - paddleHeight / 2, paddleWidth * 0.56, Math.max(2, paddleHeight * 0.22));
            }
            const ballX = state.ball.x * width;
            const ballY = state.ball.y * height;
            const radius = Math.max(5, state.ball.radius * minSize);
            if (!historical && mode !== 'baixo' && !state.serving) {
                graphics.lineStyle(Math.max(2, radius * 0.7), accent, 0.28);
                graphics.lineBetween(ballX, ballY, ballX - state.ball.vx * minSize * 0.1, ballY - state.ball.vy * minSize * 0.1);
            }
            graphics.fillStyle(historical ? 0xffffff : 0xf7fbff, 1);
            graphics.fillCircle(ballX, ballY, radius);
            const activeEffects = [state.effects.widePaddleMs, state.effects.doubleScoreMs, state.effects.slowBallMs].filter((value) => value > 0).length;
            if (activeEffects > 0) {
                graphics.lineStyle(Math.max(1, minSize * 0.002), accent, 0.62);
                graphics.strokeRoundedRect(12, height - 18, Math.min(width - 24, activeEffects * 58), 6, 3);
            }
        }
        #drawBlock(graphics, block, width, height, historical) {
            const x = (block.x - block.width / 2) * width;
            const y = (block.y - block.height / 2) * height;
            const blockWidth = block.width * width;
            const blockHeight = block.height * height;
            const color = blockColor(block, historical);
            graphics.fillStyle(color, historical ? 0.9 : block.hits < block.maxHits ? 0.5 : 0.88);
            graphics.fillRoundedRect(x, y, blockWidth, blockHeight, historical ? 0 : Math.max(2, blockHeight * 0.12));
            graphics.lineStyle(Math.max(1, blockHeight * 0.055), historical ? 0x111111 : 0xffffff, historical ? 0.5 : 0.26);
            graphics.strokeRoundedRect(x + 1, y + 1, blockWidth - 2, blockHeight - 2, historical ? 0 : Math.max(2, blockHeight * 0.12));
            if (block.type === 'resistant') {
                graphics.lineBetween(x + blockWidth * 0.2, y + blockHeight * 0.5, x + blockWidth * 0.8, y + blockHeight * 0.5);
            }
            else if (block.type === 'explosive') {
                graphics.lineBetween(x + blockWidth * 0.4, y + blockHeight * 0.25, x + blockWidth * 0.6, y + blockHeight * 0.75);
                graphics.lineBetween(x + blockWidth * 0.6, y + blockHeight * 0.25, x + blockWidth * 0.4, y + blockHeight * 0.75);
            }
            else if (block.type === 'bonus') {
                graphics.strokeCircle(x + blockWidth / 2, y + blockHeight / 2, Math.max(3, blockHeight * 0.22));
            }
        }
    }
    exports.BlockReactorRuntime = BlockReactorRuntime;
    function blockColor(block, historical) {
        if (historical)
            return block.type === 'resistant' ? 0xb7b7b7 : block.type === 'explosive' ? 0xe6e6e6 : 0xd0d0d0;
        if (block.type === 'resistant')
            return 0x6d7cff;
        if (block.type === 'explosive')
            return 0xff5d7a;
        if (block.type === 'bonus')
            return 0xffd166;
        const colors = [0x49e7ff, 0x4ee0a8, 0x9273ff, 0xff7ac8];
        return colors[block.id % colors.length];
    }
    function powerUpColor(type, historical) {
        if (historical)
            return 0xffffff;
        if (type === 'wide-paddle')
            return 0x49e7ff;
        if (type === 'double-score')
            return 0xffd166;
        return 0x9273ff;
    }
    function parseMode(value) {
        if (value === 'campanha-facil' || value === 'campanha-desafio' || value === 'pratica')
            return value;
        return 'campanha-normal';
    }
    
  };
  __modules["games/block-reactor/simulation/block-reactor-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockReactorSimulation = exports.isValidEditorLayout = void 0;
    exports.blocksFromEditorLayout = blocksFromEditorLayout;
    const block_layout_1 = __require("games/block-reactor/editor/block-layout");
    var block_layout_2 = __require("games/block-reactor/editor/block-layout");
    Object.defineProperty(exports, "isValidEditorLayout", { enumerable: true, get: function () { return block_layout_2.isValidEditorLayout; } });
    const MODE_SPECS = {
        'campanha-facil': { lives: 5, ballSpeed: 0.39, paddleWidth: 0.19 },
        'campanha-normal': { lives: 3, ballSpeed: 0.46, paddleWidth: 0.155 },
        'campanha-desafio': { lives: 3, ballSpeed: 0.54, paddleWidth: 0.13 },
        pratica: { lives: 9, ballSpeed: 0.42, paddleWidth: 0.19 },
    };
    const PADDLE_Y = 0.91;
    const PADDLE_HEIGHT = 0.025;
    const PADDLE_SPEED = 0.86;
    const MAX_LEVEL = 3;
    const EFFECT_DURATION_MS = 8500;
    const SLOW_FACTOR = 0.76;
    class BlockReactorSimulation {
        #state;
        #paddleDirection = 0;
        constructor(mode = 'campanha-normal', seed = Date.now(), customLayout) {
            this.#state = this.#initialState(mode, seed >>> 0, customLayout);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing' };
        }
        launch() {
            if (this.#state.status !== 'playing' || !this.#state.serving)
                return [];
            const speed = MODE_SPECS[this.#state.mode].ballSpeed * (1 + (this.#state.level - 1) * 0.065);
            const direction = this.#state.rngState % 2 === 0 ? 1 : -1;
            this.#state = {
                ...this.#state,
                serving: false,
                ball: { ...this.#state.ball, vx: speed * 0.54 * direction, vy: -speed * 0.84 },
                rngState: nextRandom(this.#state.rngState),
            };
            return ['launch'];
        }
        restart(mode = this.#state.mode, customLayout = this.#state.customLayout) {
            this.#paddleDirection = 0;
            this.#state = this.#initialState(mode, nextRandom(this.#state.rngState), customLayout);
        }
        setPaddleDirection(direction) {
            this.#paddleDirection = direction;
        }
        paddleWidth() {
            return MODE_SPECS[this.#state.mode].paddleWidth * (this.#state.effects.widePaddleMs > 0 ? 1.45 : 1);
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 34);
            const dt = safeDelta / 1000;
            const events = [];
            const previousEffects = this.#state.effects;
            const effects = {
                widePaddleMs: Math.max(0, previousEffects.widePaddleMs - safeDelta),
                doubleScoreMs: Math.max(0, previousEffects.doubleScoreMs - safeDelta),
                slowBallMs: Math.max(0, previousEffects.slowBallMs - safeDelta),
            };
            const paddleWidth = MODE_SPECS[this.#state.mode].paddleWidth * (effects.widePaddleMs > 0 ? 1.45 : 1);
            const paddleX = clamp(this.#state.paddleX + this.#paddleDirection * PADDLE_SPEED * dt, paddleWidth / 2, 1 - paddleWidth / 2);
            let ball = this.#state.serving
                ? { ...this.#state.ball, x: paddleX, y: PADDLE_Y - 0.045 }
                : { ...this.#state.ball, x: this.#state.ball.x + this.#state.ball.vx * dt, y: this.#state.ball.y + this.#state.ball.vy * dt };
            if (previousEffects.slowBallMs > 0 && effects.slowBallMs === 0 && !this.#state.serving) {
                ball = { ...ball, vx: ball.vx / SLOW_FACTOR, vy: ball.vy / SLOW_FACTOR };
            }
            if (!this.#state.serving) {
                if (ball.x <= ball.radius || ball.x >= 1 - ball.radius) {
                    ball = { ...ball, x: clamp(ball.x, ball.radius, 1 - ball.radius), vx: -ball.vx };
                    events.push('wall-hit');
                }
                if (ball.y <= ball.radius) {
                    ball = { ...ball, y: ball.radius, vy: Math.abs(ball.vy) };
                    events.push('wall-hit');
                }
            }
            const paddleTop = PADDLE_Y - PADDLE_HEIGHT / 2;
            const paddleHit = !this.#state.serving
                && ball.vy > 0
                && ball.y + ball.radius >= paddleTop
                && ball.y - ball.radius <= PADDLE_Y + PADDLE_HEIGHT / 2
                && Math.abs(ball.x - paddleX) <= paddleWidth / 2 + ball.radius;
            if (paddleHit) {
                const offset = clamp((ball.x - paddleX) / (paddleWidth / 2), -1, 1);
                const speed = Math.max(MODE_SPECS[this.#state.mode].ballSpeed, Math.hypot(ball.vx, ball.vy));
                ball = { ...ball, y: paddleTop - ball.radius, vx: speed * offset * 0.78, vy: -Math.abs(speed * (0.72 + (1 - Math.abs(offset)) * 0.18)) };
                events.push('paddle-hit');
            }
            let blocks = this.#state.blocks.map((block) => ({ ...block }));
            let powerUps = this.#state.powerUps.map((powerUp) => ({ ...powerUp, y: powerUp.y + 0.19 * dt }));
            let score = this.#state.score;
            let combo = this.#state.combo;
            let bestCombo = this.#state.bestCombo;
            let nextEntityId = this.#state.nextEntityId;
            let rngState = this.#state.rngState;
            let level = this.#state.level;
            let lives = this.#state.lives;
            let serving = this.#state.serving;
            let status = this.#state.status;
            if (!serving) {
                const target = blocks.find((block) => block.alive && circleIntersectsBlock(ball, block));
                if (target) {
                    events.push('block-hit');
                    ball = reflectFromBlock(ball, target);
                    const remainingHits = target.hits - 1;
                    blocks = blocks.map((block) => block.id === target.id ? { ...block, hits: Math.max(0, remainingHits), alive: remainingHits > 0 } : block);
                    if (remainingHits <= 0) {
                        combo += 1;
                        bestCombo = Math.max(bestCombo, combo);
                        score += blockScore(target, level, combo, effects.doubleScoreMs > 0);
                        events.push('block-destroyed');
                        if (target.type === 'explosive') {
                            const nearby = blocks.filter((block) => block.alive && Math.hypot(block.x - target.x, block.y - target.y) < 0.145);
                            if (nearby.length > 0) {
                                blocks = blocks.map((block) => nearby.some((candidate) => candidate.id === block.id) ? { ...block, hits: 0, alive: false } : block);
                                score += nearby.length * 65 * level * (effects.doubleScoreMs > 0 ? 2 : 1);
                            }
                            events.push('explosion');
                        }
                        if (target.type === 'bonus') {
                            rngState = nextRandom(rngState);
                            const types = ['wide-paddle', 'double-score', 'slow-ball'];
                            powerUps.push({ id: nextEntityId++, x: target.x, y: target.y, type: types[rngState % types.length] });
                            events.push('power-up-spawned');
                        }
                    }
                }
            }
            const caught = powerUps.filter((powerUp) => powerUp.y >= paddleTop - 0.02 && powerUp.y <= PADDLE_Y + 0.04 && Math.abs(powerUp.x - paddleX) <= paddleWidth / 2 + 0.025);
            let nextEffects = effects;
            if (caught.length > 0) {
                nextEffects = { ...effects };
                for (const powerUp of caught) {
                    if (powerUp.type === 'wide-paddle')
                        nextEffects = { ...nextEffects, widePaddleMs: EFFECT_DURATION_MS };
                    if (powerUp.type === 'double-score')
                        nextEffects = { ...nextEffects, doubleScoreMs: EFFECT_DURATION_MS };
                    if (powerUp.type === 'slow-ball') {
                        if (nextEffects.slowBallMs <= 0 && !serving)
                            ball = { ...ball, vx: ball.vx * SLOW_FACTOR, vy: ball.vy * SLOW_FACTOR };
                        nextEffects = { ...nextEffects, slowBallMs: EFFECT_DURATION_MS };
                    }
                }
                const caughtIds = new Set(caught.map((powerUp) => powerUp.id));
                powerUps = powerUps.filter((powerUp) => !caughtIds.has(powerUp.id));
                events.push('power-up-collected');
            }
            powerUps = powerUps.filter((powerUp) => powerUp.y < 1.05);
            if (!serving && ball.y - ball.radius > 1) {
                lives -= 1;
                combo = 0;
                serving = true;
                ball = spawnBall(paddleX);
                events.push('life-lost');
                if (lives <= 0) {
                    status = 'game-over';
                    events.push('game-over');
                }
            }
            if (status === 'playing' && blocks.every((block) => !block.alive)) {
                events.push('level-complete');
                if (this.#state.customLayout || (level >= MAX_LEVEL && this.#state.mode !== 'pratica')) {
                    status = 'victory';
                    events.push('victory');
                }
                else {
                    level = level >= MAX_LEVEL ? 1 : level + 1;
                    blocks = createLevel(level, nextEntityId);
                    nextEntityId += blocks.length;
                    serving = true;
                    combo = 0;
                    ball = spawnBall(paddleX);
                }
            }
            this.#state = {
                ...this.#state,
                paddleX,
                ball,
                blocks,
                powerUps,
                effects: nextEffects,
                score,
                lives,
                level,
                combo,
                bestCombo,
                elapsedMs: this.#state.elapsedMs + safeDelta,
                serving,
                status,
                rngState,
                nextEntityId,
            };
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Reator de Blocos incompatível');
            if (!(state.mode in MODE_SPECS))
                throw new Error('Modo salvo inválido');
            if (!['ready', 'playing', 'victory', 'game-over'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (state.lives < 0 || state.level < 1 || state.level > MAX_LEVEL)
                throw new Error('Progresso salvo inválido');
            if (state.customLayout && !(0, block_layout_1.isValidEditorLayout)(state.customLayout))
                throw new Error('Fase personalizada inválida');
            this.#paddleDirection = 0;
            this.#state = cloneState(state);
        }
        #initialState(mode, seed, customLayout) {
            const safeLayout = customLayout && (0, block_layout_1.isValidEditorLayout)(customLayout) ? customLayout : undefined;
            const blocks = safeLayout ? blocksFromEditorLayout(safeLayout, 1) : createLevel(1, 1);
            return {
                schemaVersion: 1,
                mode,
                status: 'ready',
                paddleX: 0.5,
                ball: spawnBall(0.5),
                blocks,
                powerUps: [],
                effects: { widePaddleMs: 0, doubleScoreMs: 0, slowBallMs: 0 },
                score: 0,
                lives: MODE_SPECS[mode].lives,
                level: 1,
                combo: 0,
                bestCombo: 0,
                elapsedMs: 0,
                serving: true,
                rngState: seed || 0x6d2b79f5,
                nextEntityId: blocks.length + 1,
                customLayout: safeLayout,
            };
        }
    }
    exports.BlockReactorSimulation = BlockReactorSimulation;
    function blocksFromEditorLayout(layout, firstId = 1) {
        if (!(0, block_layout_1.isValidEditorLayout)(layout))
            throw new Error('Layout do editor inválido');
        const typeBySymbol = { n: 'normal', r: 'resistant', e: 'explosive', b: 'bonus' };
        const blocks = [];
        for (let index = 0; index < layout.length; index += 1) {
            const symbol = layout[index];
            if (symbol === '.')
                continue;
            const column = index % block_layout_1.EDITOR_COLUMNS;
            const row = Math.floor(index / block_layout_1.EDITOR_COLUMNS);
            blocks.push(makeBlock(firstId + blocks.length, column, row, block_layout_1.EDITOR_COLUMNS, typeBySymbol[symbol]));
        }
        return blocks;
    }
    function createLevel(level, firstId) {
        const columns = level === 1 ? 8 : 10;
        const rows = level === 1 ? 4 : level === 2 ? 5 : 6;
        const blocks = [];
        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                if (level === 2 && row === 2 && (column === 0 || column === columns - 1))
                    continue;
                if (level === 3 && (row + column) % 7 === 0)
                    continue;
                let type = 'normal';
                if (level >= 2 && (row * columns + column) % 9 === 4)
                    type = 'resistant';
                if (level >= 2 && (row + column * 2) % 13 === 5)
                    type = 'explosive';
                if ((row * 3 + column * 5 + level) % 17 === 7)
                    type = 'bonus';
                blocks.push(makeBlock(firstId + blocks.length, column, row, columns, type));
            }
        }
        return blocks;
    }
    function makeBlock(id, column, row, columns, type) {
        const gap = 0.009;
        const width = (0.84 - gap * (columns - 1)) / columns;
        const maxHits = type === 'resistant' ? 2 : 1;
        return {
            id,
            x: 0.08 + width / 2 + column * (width + gap),
            y: 0.12 + row * 0.058,
            width,
            height: 0.041,
            type,
            hits: maxHits,
            maxHits,
            alive: true,
        };
    }
    function spawnBall(paddleX) {
        return { x: paddleX, y: PADDLE_Y - 0.045, vx: 0, vy: 0, radius: 0.012 };
    }
    function circleIntersectsBlock(ball, block) {
        const nearestX = clamp(ball.x, block.x - block.width / 2, block.x + block.width / 2);
        const nearestY = clamp(ball.y, block.y - block.height / 2, block.y + block.height / 2);
        return Math.hypot(ball.x - nearestX, ball.y - nearestY) <= ball.radius;
    }
    function reflectFromBlock(ball, block) {
        const horizontalOverlap = block.width / 2 + ball.radius - Math.abs(ball.x - block.x);
        const verticalOverlap = block.height / 2 + ball.radius - Math.abs(ball.y - block.y);
        if (horizontalOverlap < verticalOverlap)
            return { ...ball, vx: -ball.vx };
        return { ...ball, vy: -ball.vy };
    }
    function blockScore(block, level, combo, doubled) {
        const base = block.type === 'resistant' ? 160 : block.type === 'explosive' ? 140 : block.type === 'bonus' ? 180 : 100;
        return Math.round((base * level + Math.min(combo, 10) * 12) * (doubled ? 2 : 1));
    }
    function cloneState(state) {
        return {
            ...state,
            ball: { ...state.ball },
            blocks: state.blocks.map((block) => ({ ...block })),
            powerUps: state.powerUps.map((powerUp) => ({ ...powerUp })),
            effects: { ...state.effects },
        };
    }
    function nextRandom(state) {
        return (Math.imul(state, 1664525) + 1013904223) >>> 0;
    }
    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
    
  };
  __modules["games/board-arena/content/board-arena-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BOARD_ARENA_COMPARISON = exports.BOARD_ARENA_PSEUDOCODE = exports.BOARD_ARENA_HISTORY = void 0;
    exports.BOARD_ARENA_HISTORY = {
        title: 'Dos jogos de tabuleiro às inteligências artificiais',
        paragraphs: [
            'Jogos de tabuleiro atravessam séculos porque transformam regras simples, informação visível e tomada de decisão em desafios profundos. Dama e xadrez usam tabuleiros em grade; o jogo da velha resume a ideia de linhas, turnos e bloqueio em apenas nove casas.',
            'Na computação, esses jogos se tornaram laboratórios para matrizes, árvores de decisão, avaliação de estados e busca de jogadas. A reconstrução do Fliperama DS mantém as regras em uma simulação serializável e usa Phaser somente para desenhar o tabuleiro e receber o toque.',
            'Esta primeira versão entrega Jogo da Velha e Dama 8×8. Xadrez, ludo e mancala permanecem no roadmap para expansões posteriores, sem serem apresentados como módulos concluídos.',
        ],
        sourceUrl: 'https://www.chessprogramming.org/Main_Page',
    };
    exports.BOARD_ARENA_PSEUDOCODE = `estado = criar_tabuleiro(modo)
    
    quando jogador selecionar casa:
      validar turno e movimento
      aplicar jogada em uma cópia do estado
      verificar vitória, empate ou promoção
    
    se partida continuar:
      gerar jogadas legais da CPU
      priorizar vitória, bloqueio ou captura
      aplicar melhor jogada disponível
    
    salvar:
      tabuleiro, turno, peças, pontuação e tempo
    renderizar:
      Phaser apenas lê o estado e desenha a grade`;
    exports.BOARD_ARENA_COMPARISON = [
        ['Tabuleiro', 'Peças físicas e regras memorizadas', 'Matriz serializável validada pela simulação'],
        ['Adversário', 'Outro jogador presencial', 'CPU didática com prioridade de bloqueio e captura'],
        ['Interface', 'Casas e peças materiais', 'Phaser 2D responsivo com mouse e toque'],
        ['Programação', 'Não aplicável ao tabuleiro físico', 'TypeScript estrito, geração de jogadas e máquina de estados'],
        ['Aprendizado', 'Estratégia e antecipação', 'Estratégia, matrizes, algoritmos e persistência'],
    ];
    
  };
  __modules["games/board-arena/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const board_arena_runtime_1 = __require("games/board-arena/phaser/board-arena-runtime");
    function createRuntime() {
        return new board_arena_runtime_1.BoardArenaRuntime();
    }
    
  };
  __modules["games/board-arena/phaser/board-arena-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoardArenaRuntime = void 0;
    const board_arena_simulation_1 = __require("games/board-arena/simulation/board-arena-simulation");
    class BoardArenaRuntime {
        id = 'board-arena';
        state = 'not-loaded';
        #simulation = new board_arena_simulation_1.BoardArenaSimulation();
        #game;
        #context;
        #graphics;
        #message;
        #title;
        #graphicsMode = 'medio';
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            const configuration = parseConfiguration(context.parameters?.mode);
            this.#simulation = new board_arena_simulation_1.BoardArenaSimulation(configuration.mode, configuration.difficulty);
            this.#graphicsMode = context.graphicsMode;
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class BoardArenaScene extends Phaser.Scene {
                constructor() { super('board-arena'); }
                create() {
                    owner.#graphics = this.add.graphics();
                    owner.#title = this.add.text(0, 0, '', {
                        color: '#f7fbff', fontFamily: 'ui-monospace, monospace', fontSize: '22px', fontStyle: 'bold', align: 'center',
                    }).setOrigin(.5, 0);
                    owner.#message = this.add.text(0, 0, '', {
                        color: '#a9bdd8', fontFamily: 'system-ui, sans-serif', fontSize: '16px', align: 'center', wordWrap: { width: 760 },
                    }).setOrigin(.5, 0);
                    this.input.on('pointerdown', (pointer) => owner.#handlePointer(pointer.x, pointer.y, this.scale.width, this.scale.height));
                    this.scale.on('resize', () => owner.#draw(this.scale.width, this.scale.height));
                    owner.#draw(this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    owner.#simulation.step(delta);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 620,
                backgroundColor: '#050914',
                transparent: false,
                scene: BoardArenaScene,
                render: { antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo', pixelArt: context.graphicsMode === 'historico' },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            if (this.state === 'finished')
                this.#simulation.restart();
            this.#simulation.start();
            this.state = 'playing';
            this.#drawCurrent();
            this.#context?.onEvent?.({ type: 'serve', detail: { mode: this.#simulation.state.mode } });
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active)
                this.state === 'playing' ? this.pause() : this.resume();
            if (input.action === 'primary-action' && input.active && this.state !== 'playing')
                this.start();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state, board: [...state.board] } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            this.state = this.#simulation.state.status === 'playing' ? 'paused' : this.#simulation.state.status === 'ready' ? 'menu' : 'finished';
            this.#drawCurrent();
        }
        dispose() {
            this.#game?.destroy(true);
            this.#game = undefined;
            this.#graphics = undefined;
            this.#message = undefined;
            this.#title = undefined;
            this.state = 'disposed';
        }
        #handlePointer(x, y, width, height) {
            if (this.state !== 'playing')
                return;
            const geometry = boardGeometry(this.#simulation.state.mode, width, height);
            const col = Math.floor((x - geometry.x) / geometry.cell);
            const row = Math.floor((y - geometry.y) / geometry.cell);
            const size = this.#simulation.state.mode === 'velha' ? 3 : 8;
            if (row < 0 || row >= size || col < 0 || col >= size)
                return;
            const events = this.#simulation.select(row * size + col);
            this.#draw(width, height);
            const state = this.#simulation.state;
            this.#context?.onEvent?.({
                type: 'progress',
                detail: {
                    mode: state.mode,
                    moves: state.moveCount,
                    score: state.score,
                    playerCaptures: state.playerCaptures,
                    cpuCaptures: state.cpuCaptures,
                    event: events.includes('capture') ? 'capture' : events.includes('promotion') ? 'promotion' : events.includes('invalid') ? 'invalid' : 'move',
                },
            });
            if (events.includes('finished')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: state.status === 'player-won' ? 'player' : state.status === 'cpu-won' ? 'cpu' : 'draw',
                        score: state.score,
                        moves: state.moveCount,
                        playerCaptures: state.playerCaptures,
                        cpuCaptures: state.cpuCaptures,
                        mode: state.mode,
                    },
                });
            }
        }
        #drawCurrent() {
            if (!this.#game)
                return;
            this.#draw(this.#game.scale.width, this.#game.scale.height);
        }
        #draw(width, height) {
            const graphics = this.#graphics;
            if (!graphics)
                return;
            const state = this.#simulation.state;
            const historical = this.#graphicsMode === 'historico';
            const geometry = boardGeometry(state.mode, width, height);
            graphics.clear();
            graphics.fillGradientStyle(historical ? 0x050505 : 0x071126, historical ? 0x050505 : 0x0b1730, 0x030610, 0x030610, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.lineStyle(1, historical ? 0x343434 : 0x17314e, .45);
            for (let x = 0; x < width; x += 36)
                graphics.lineBetween(x, 0, x, height);
            for (let y = 0; y < height; y += 36)
                graphics.lineBetween(0, y, width, y);
            this.#title?.setPosition(width / 2, 18).setText(state.mode === 'velha' ? 'BOARD ARENA DS · JOGO DA VELHA' : 'BOARD ARENA DS · DAMA 8×8');
            this.#message?.setPosition(width / 2, height - 54).setText(state.message).setWordWrapWidth(Math.min(780, width - 36));
            if (state.mode === 'velha')
                this.#drawTicTacToe(graphics, geometry, state);
            else
                this.#drawCheckers(graphics, geometry, state);
        }
        #drawTicTacToe(graphics, geometry, state) {
            graphics.fillStyle(0x07172a, .98);
            graphics.fillRoundedRect(geometry.x - 10, geometry.y - 10, geometry.cell * 3 + 20, geometry.cell * 3 + 20, 16);
            graphics.lineStyle(Math.max(2, geometry.cell * .025), this.#graphicsMode === 'historico' ? 0xffffff : 0x49e7ff, .9);
            for (let i = 1; i < 3; i += 1) {
                graphics.lineBetween(geometry.x + geometry.cell * i, geometry.y, geometry.x + geometry.cell * i, geometry.y + geometry.cell * 3);
                graphics.lineBetween(geometry.x, geometry.y + geometry.cell * i, geometry.x + geometry.cell * 3, geometry.y + geometry.cell * i);
            }
            state.board.forEach((piece, index) => {
                if (piece === '.')
                    return;
                const row = Math.floor(index / 3);
                const col = index % 3;
                const cx = geometry.x + col * geometry.cell + geometry.cell / 2;
                const cy = geometry.y + row * geometry.cell + geometry.cell / 2;
                const radius = geometry.cell * .27;
                if (piece === 'X') {
                    graphics.lineStyle(Math.max(5, geometry.cell * .055), 0x49e7ff, 1);
                    graphics.lineBetween(cx - radius, cy - radius, cx + radius, cy + radius);
                    graphics.lineBetween(cx + radius, cy - radius, cx - radius, cy + radius);
                }
                else {
                    graphics.lineStyle(Math.max(5, geometry.cell * .055), 0xa46fff, 1);
                    graphics.strokeCircle(cx, cy, radius);
                }
            });
        }
        #drawCheckers(graphics, geometry, state) {
            graphics.fillStyle(0x121a29, 1);
            graphics.fillRoundedRect(geometry.x - 12, geometry.y - 12, geometry.cell * 8 + 24, geometry.cell * 8 + 24, 18);
            for (let row = 0; row < 8; row += 1) {
                for (let col = 0; col < 8; col += 1) {
                    const index = row * 8 + col;
                    const dark = (row + col) % 2 === 1;
                    graphics.fillStyle(dark ? 0x213a54 : 0xb6d6df, 1);
                    graphics.fillRect(geometry.x + col * geometry.cell, geometry.y + row * geometry.cell, geometry.cell, geometry.cell);
                    if (state.selectedIndex === index) {
                        graphics.lineStyle(Math.max(3, geometry.cell * .06), 0xffd166, 1);
                        graphics.strokeRect(geometry.x + col * geometry.cell + 3, geometry.y + row * geometry.cell + 3, geometry.cell - 6, geometry.cell - 6);
                    }
                    const piece = state.board[index];
                    if (!piece || piece === '.')
                        continue;
                    const cx = geometry.x + col * geometry.cell + geometry.cell / 2;
                    const cy = geometry.y + row * geometry.cell + geometry.cell / 2;
                    const player = piece.toLowerCase() === 'r';
                    graphics.fillStyle(player ? 0xff5d73 : 0x151922, 1);
                    graphics.fillCircle(cx, cy, geometry.cell * .34);
                    graphics.lineStyle(Math.max(2, geometry.cell * .035), player ? 0xffb7c1 : 0x8ea1bf, 1);
                    graphics.strokeCircle(cx, cy, geometry.cell * .34);
                    graphics.fillStyle(player ? 0x9b2438 : 0x2f3a4d, 1);
                    graphics.fillCircle(cx, cy + geometry.cell * .04, geometry.cell * .24);
                    if (piece === 'R' || piece === 'B') {
                        graphics.lineStyle(Math.max(2, geometry.cell * .035), 0xffd166, 1);
                        graphics.strokeCircle(cx, cy, geometry.cell * .18);
                        graphics.lineBetween(cx - geometry.cell * .12, cy, cx + geometry.cell * .12, cy);
                    }
                }
            }
        }
    }
    exports.BoardArenaRuntime = BoardArenaRuntime;
    function boardGeometry(mode, width, height) {
        const size = mode === 'velha' ? 3 : 8;
        const availableHeight = Math.max(220, height - 150);
        const boardSize = Math.min(width - 40, availableHeight, mode === 'velha' ? 460 : 560);
        const cell = boardSize / size;
        return { x: (width - boardSize) / 2, y: 72 + Math.max(0, (availableHeight - boardSize) / 2), cell };
    }
    function parseConfiguration(value) {
        const text = String(value ?? 'velha-aprendiz');
        return {
            mode: text.startsWith('dama') ? 'dama' : 'velha',
            difficulty: text.endsWith('estrategista') ? 'estrategista' : 'aprendiz',
        };
    }
    
  };
  __modules["games/board-arena/simulation/board-arena-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoardArenaSimulation = void 0;
    const EMPTY = '.';
    const PLAYER_MAN = 'r';
    const PLAYER_KING = 'R';
    const CPU_MAN = 'b';
    const CPU_KING = 'B';
    const TIC_PLAYER = 'X';
    const TIC_CPU = 'O';
    class BoardArenaSimulation {
        #state;
        constructor(mode = 'velha', difficulty = 'aprendiz') {
            this.#state = BoardArenaSimulation.initialState(mode, difficulty);
        }
        static initialState(mode, difficulty) {
            return {
                schemaVersion: 1,
                mode,
                difficulty,
                board: mode === 'velha' ? Array(9).fill(EMPTY) : createCheckersBoard(),
                turn: 'player',
                status: 'ready',
                selectedIndex: null,
                moveCount: 0,
                playerCaptures: 0,
                cpuCaptures: 0,
                elapsedMs: 0,
                score: 0,
                message: mode === 'velha' ? 'Escolha uma casa para iniciar.' : 'Selecione uma peça vermelha para começar.',
            };
        }
        get state() {
            return this.#state;
        }
        start() {
            if (this.#state.status === 'player-won' || this.#state.status === 'cpu-won' || this.#state.status === 'draw') {
                this.restart(this.#state.mode, this.#state.difficulty);
            }
            this.#state = { ...this.#state, status: 'playing', turn: 'player' };
        }
        restart(mode = this.#state.mode, difficulty = this.#state.difficulty) {
            this.#state = BoardArenaSimulation.initialState(mode, difficulty);
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return;
            this.#state = { ...this.#state, elapsedMs: this.#state.elapsedMs + Math.min(100, Math.max(0, deltaMs)) };
        }
        select(index) {
            if (this.#state.status !== 'playing' || this.#state.turn !== 'player')
                return ['invalid'];
            if (this.#state.mode === 'velha')
                return this.#playTicTacToe(index);
            return this.#playCheckers(index);
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Board Arena incompatível');
            const expectedSize = state.mode === 'velha' ? 9 : 64;
            if (!Array.isArray(state.board) || state.board.length !== expectedSize)
                throw new Error('Tabuleiro salvo inválido');
            this.#state = { ...state, board: [...state.board] };
        }
        #playTicTacToe(index) {
            if (index < 0 || index >= 9 || this.#state.board[index] !== EMPTY) {
                this.#state = { ...this.#state, message: 'Escolha uma casa vazia.' };
                return ['invalid'];
            }
            const board = [...this.#state.board];
            board[index] = TIC_PLAYER;
            let next = this.#afterTicMove(board, 'player');
            if (next.status !== 'playing') {
                this.#state = next;
                return ['move', 'finished'];
            }
            const cpuIndex = chooseTicCpuMove(next.board, this.#state.difficulty);
            if (cpuIndex !== null) {
                const cpuBoard = [...next.board];
                cpuBoard[cpuIndex] = TIC_CPU;
                next = this.#afterTicMove(cpuBoard, 'cpu');
            }
            this.#state = next;
            return next.status === 'playing' ? ['move'] : ['move', 'finished'];
        }
        #afterTicMove(board, actor) {
            const winner = ticWinner(board);
            const moveCount = this.#state.moveCount + 1;
            if (winner === TIC_PLAYER)
                return this.#finish(board, 'player-won', 1000 + Math.max(0, 120 - moveCount * 8), 'Linha completa. Vitória do jogador!');
            if (winner === TIC_CPU)
                return this.#finish(board, 'cpu-won', Math.max(0, this.#state.score - 50), 'A CPU completou uma linha.');
            if (board.every((cell) => cell !== EMPTY))
                return this.#finish(board, 'draw', 250, 'Empate: o tabuleiro foi preenchido.');
            return {
                ...this.#state,
                board: [...board],
                moveCount,
                turn: actor === 'player' ? 'cpu' : 'player',
                message: actor === 'player' ? 'A CPU analisou sua jogada.' : 'Sua vez: procure a melhor linha.',
            };
        }
        #playCheckers(index) {
            if (index < 0 || index >= 64)
                return ['invalid'];
            const board = [...this.#state.board];
            const selected = this.#state.selectedIndex;
            if (selected === null) {
                if (!isPlayerPiece(board[index])) {
                    this.#state = { ...this.#state, message: 'Selecione uma peça vermelha.' };
                    return ['invalid'];
                }
                const legal = legalMovesFor(board, 'player');
                if (!legal.some((move) => move.from === index)) {
                    this.#state = { ...this.#state, message: 'Esta peça não possui movimento legal.' };
                    return ['invalid'];
                }
                this.#state = { ...this.#state, selectedIndex: index, message: 'Agora escolha a casa de destino.' };
                return ['move'];
            }
            if (isPlayerPiece(board[index])) {
                this.#state = { ...this.#state, selectedIndex: index, message: 'Peça selecionada. Escolha o destino.' };
                return ['move'];
            }
            const move = legalMovesFor(board, 'player').find((candidate) => candidate.from === selected && candidate.to === index);
            if (!move) {
                this.#state = { ...this.#state, selectedIndex: null, message: 'Movimento inválido. Selecione outra peça.' };
                return ['invalid'];
            }
            const playerResult = applyCheckersMove(board, move);
            let state = {
                ...this.#state,
                board: playerResult.board,
                selectedIndex: null,
                turn: 'cpu',
                moveCount: this.#state.moveCount + 1,
                playerCaptures: this.#state.playerCaptures + (move.capture === undefined ? 0 : 1),
                score: this.#state.score + (move.capture === undefined ? 20 : 140) + (playerResult.promoted ? 80 : 0),
                message: move.capture === undefined ? 'Movimento concluído. A CPU está jogando.' : 'Captura realizada. A CPU está jogando.',
            };
            const afterPlayer = checkCheckersFinished(state);
            if (afterPlayer.status !== 'playing') {
                this.#state = afterPlayer;
                return ['move', ...(move.capture === undefined ? [] : ['capture']), ...(playerResult.promoted ? ['promotion'] : []), 'finished'];
            }
            const cpuMoves = legalMovesFor(afterPlayer.board, 'cpu');
            if (cpuMoves.length === 0) {
                this.#state = this.#finish(afterPlayer.board, 'player-won', afterPlayer.score + 900, 'A CPU ficou sem movimentos. Vitória!');
                return ['move', 'finished'];
            }
            const cpuMove = chooseCheckersCpuMove(cpuMoves, this.#state.difficulty);
            const cpuResult = applyCheckersMove(afterPlayer.board, cpuMove);
            state = {
                ...afterPlayer,
                board: cpuResult.board,
                turn: 'player',
                moveCount: afterPlayer.moveCount + 1,
                cpuCaptures: afterPlayer.cpuCaptures + (cpuMove.capture === undefined ? 0 : 1),
                score: Math.max(0, afterPlayer.score - (cpuMove.capture === undefined ? 0 : 70)),
                message: cpuMove.capture === undefined ? 'Sua vez. Analise o tabuleiro.' : 'A CPU capturou uma peça. Planeje a resposta.',
            };
            const finished = checkCheckersFinished(state);
            this.#state = finished;
            const events = ['move'];
            if (move.capture !== undefined || cpuMove.capture !== undefined)
                events.push('capture');
            if (playerResult.promoted || cpuResult.promoted)
                events.push('promotion');
            if (finished.status !== 'playing')
                events.push('finished');
            return events;
        }
        #finish(board, status, score, message) {
            return { ...this.#state, board: [...board], status, turn: 'player', selectedIndex: null, score, message };
        }
    }
    exports.BoardArenaSimulation = BoardArenaSimulation;
    function createCheckersBoard() {
        const board = Array(64).fill(EMPTY);
        for (let row = 0; row < 3; row += 1) {
            for (let col = 0; col < 8; col += 1)
                if ((row + col) % 2 === 1)
                    board[row * 8 + col] = CPU_MAN;
        }
        for (let row = 5; row < 8; row += 1) {
            for (let col = 0; col < 8; col += 1)
                if ((row + col) % 2 === 1)
                    board[row * 8 + col] = PLAYER_MAN;
        }
        return board;
    }
    function ticWinner(board) {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (const [a, b, c] of lines)
            if (board[a] !== EMPTY && board[a] === board[b] && board[a] === board[c])
                return board[a] ?? null;
        return null;
    }
    function chooseTicCpuMove(board, difficulty) {
        const empty = board.map((cell, index) => cell === EMPTY ? index : -1).filter((index) => index >= 0);
        if (empty.length === 0)
            return null;
        const findFinisher = (symbol) => {
            for (const index of empty) {
                const candidate = [...board];
                candidate[index] = symbol;
                if (ticWinner(candidate) === symbol)
                    return index;
            }
            return null;
        };
        const win = findFinisher(TIC_CPU);
        if (win !== null)
            return win;
        const block = findFinisher(TIC_PLAYER);
        if (block !== null)
            return block;
        if (difficulty === 'estrategista') {
            if (board[4] === EMPTY)
                return 4;
            for (const corner of [0, 2, 6, 8])
                if (board[corner] === EMPTY)
                    return corner;
        }
        return empty[0] ?? null;
    }
    function isPlayerPiece(piece) { return piece === PLAYER_MAN || piece === PLAYER_KING; }
    function isCpuPiece(piece) { return piece === CPU_MAN || piece === CPU_KING; }
    function legalMovesFor(board, actor) {
        const pieces = board.map((piece, index) => ({ piece, index })).filter(({ piece }) => actor === 'player' ? isPlayerPiece(piece) : isCpuPiece(piece));
        const all = pieces.flatMap(({ piece, index }) => legalMovesForPiece(board, index, piece));
        const captures = all.filter((move) => move.capture !== undefined);
        return captures.length > 0 ? captures : all;
    }
    function legalMovesForPiece(board, index, piece) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const isKing = piece === PLAYER_KING || piece === CPU_KING;
        const directions = isKing ? [-1, 1] : piece === PLAYER_MAN ? [-1] : [1];
        const enemy = piece === PLAYER_MAN || piece === PLAYER_KING ? isCpuPiece : isPlayerPiece;
        const moves = [];
        for (const rowDirection of directions) {
            for (const colDirection of [-1, 1]) {
                const nextRow = row + rowDirection;
                const nextCol = col + colDirection;
                if (!inside(nextRow, nextCol))
                    continue;
                const nextIndex = nextRow * 8 + nextCol;
                if (board[nextIndex] === EMPTY) {
                    moves.push({ from: index, to: nextIndex });
                    continue;
                }
                const jumpRow = row + rowDirection * 2;
                const jumpCol = col + colDirection * 2;
                if (enemy(board[nextIndex]) && inside(jumpRow, jumpCol)) {
                    const jumpIndex = jumpRow * 8 + jumpCol;
                    if (board[jumpIndex] === EMPTY)
                        moves.push({ from: index, to: jumpIndex, capture: nextIndex });
                }
            }
        }
        return moves;
    }
    function applyCheckersMove(board, move) {
        const next = [...board];
        let piece = next[move.from] ?? EMPTY;
        next[move.from] = EMPTY;
        if (move.capture !== undefined)
            next[move.capture] = EMPTY;
        const targetRow = Math.floor(move.to / 8);
        let promoted = false;
        if (piece === PLAYER_MAN && targetRow === 0) {
            piece = PLAYER_KING;
            promoted = true;
        }
        if (piece === CPU_MAN && targetRow === 7) {
            piece = CPU_KING;
            promoted = true;
        }
        next[move.to] = piece;
        return { board: next, promoted };
    }
    function chooseCheckersCpuMove(moves, difficulty) {
        const captures = moves.filter((move) => move.capture !== undefined);
        if (captures.length > 0)
            return captures[0];
        if (difficulty === 'estrategista') {
            const promotion = moves.find((move) => Math.floor(move.to / 8) === 7);
            if (promotion)
                return promotion;
            const central = moves.slice().sort((a, b) => Math.abs((a.to % 8) - 3.5) - Math.abs((b.to % 8) - 3.5));
            return central[0];
        }
        return moves[0];
    }
    function checkCheckersFinished(state) {
        const playerPieces = state.board.filter(isPlayerPiece).length;
        const cpuPieces = state.board.filter(isCpuPiece).length;
        if (cpuPieces === 0)
            return { ...state, status: 'player-won', score: state.score + 1000, message: 'Todas as peças adversárias foram capturadas.' };
        if (playerPieces === 0)
            return { ...state, status: 'cpu-won', message: 'A CPU capturou todas as suas peças.' };
        if (legalMovesFor(state.board, 'player').length === 0)
            return { ...state, status: 'cpu-won', message: 'Você ficou sem movimentos legais.' };
        if (legalMovesFor(state.board, 'cpu').length === 0)
            return { ...state, status: 'player-won', score: state.score + 900, message: 'A CPU ficou sem movimentos legais.' };
        if (state.moveCount >= 120)
            return { ...state, status: 'draw', score: state.score + 200, message: 'Empate por limite didático de movimentos.' };
        return state;
    }
    function inside(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
  };
  __modules["games/camera-evolution/audio/camera-evolution-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CameraEvolutionAudio = void 0;
    class CameraEvolutionAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const tones = {
                'core-collected': [720, 0.16, 'triangle'],
                checkpoint: [520, 0.2, 'sine'],
                'camera-changed': [310, 0.08, 'square'],
                'fov-changed': [420, 0.1, 'sawtooth'],
                jump: [260, 0.08, 'triangle'],
                damage: [95, 0.22, 'sawtooth'],
                'life-lost': [72, 0.3, 'square'],
                'gate-unlocked': [880, 0.35, 'sine'],
                finished: [1040, 0.5, 'triangle'],
            };
            const [frequency, duration, type] = tones[event];
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.72), context.currentTime + duration);
            gain.gain.setValueAtTime(0.0001, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.085, context.currentTime + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration + 0.02);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.CameraEvolutionAudio = CameraEvolutionAudio;
    
  };
  __modules["games/camera-evolution/content/camera-evolution-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CAMERA_EVOLUTION_COMPARISON = exports.CAMERA_EVOLUTION_PSEUDOCODE = exports.CAMERA_EVOLUTION_HISTORY = void 0;
    exports.CAMERA_EVOLUTION_HISTORY = {
        title: 'A câmera deixa de observar e passa a dirigir a experiência',
        paragraphs: [
            'A consolidação do 3D nos anos 1990 transformou a câmera em parte central do projeto dos jogos. Câmeras fixas favoreciam composição e suspense; primeira pessoa reforçava precisão e presença; terceira pessoa ampliava leitura corporal, exploração e combate.',
            'Câmeras em Evolução é um laboratório autoral do Fliperama DS. A mesma arena, missão e simulação podem ser observadas por câmera fixa por setores, orbital, primeira pessoa, terceira pessoa, perseguição e visão superior.',
            'O laboratório também compara campos de visão de 45°, 60° e 75°, mostrando como enquadramento, percepção de velocidade, navegação, visibilidade de obstáculos e conforto mudam sem alterar as regras do mundo.',
        ],
        sourceUrl: 'https://www.playstation.com/en-us/playstation-history/1994-ps-one/',
    };
    exports.CAMERA_EVOLUTION_PSEUDOCODE = `INICIAR laboratório de câmeras
      carregar arena, lentes, checkpoints e avatar
      manter posição e missão fora do renderizador
    
    A CADA QUADRO
      aplicar movimento, rotação, gravidade e colisões
      atualizar objetivos e cronômetro
      selecionar câmera ativa
      calcular posição, alvo e campo de visão
      construir matrizes de visão e projeção
    
    AO TROCAR CÂMERA
      preservar posição, vidas, lentes e pontuação
      alternar fixa, orbital, primeira pessoa, terceira pessoa, perseguição e superior
    
    SALVAR
      estado da missão, câmera, FOV e câmeras visitadas`;
    exports.CAMERA_EVOLUTION_COMPARISON = [
        ['Câmera fixa', 'Composição por sala ou setor e controle parcialmente desacoplado', 'Pontos altos reposicionados conforme o setor do avatar'],
        ['Primeira pessoa', 'Visão alinhada ao personagem e leitura precisa da direção', 'Câmera na altura dos olhos com alvo frontal'],
        ['Terceira pessoa', 'Avatar visível e espaço para leitura de animação e obstáculos', 'Câmera posterior elevada com alvo antecipado'],
        ['Perseguição', 'Seguimento mais distante e sensação de velocidade', 'Offset lateral e alvo projetado à frente'],
        ['Orbital e superior', 'Inspeção espacial e leitura estratégica', 'Órbita automática e visão vertical sobre a mesma simulação'],
        ['Campo de visão', 'Escolha ligada a gênero, tela, conforto e desempenho', 'Alternância 45° / 60° / 75° com estado preservado'],
    ];
    
  };
  __modules["games/camera-evolution/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const camera_evolution_runtime_1 = __require("games/camera-evolution/webgl/camera-evolution-runtime");
    function createRuntime() {
        return new camera_evolution_runtime_1.CameraEvolutionRuntime();
    }
    
  };
  __modules["games/camera-evolution/simulation/camera-evolution-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CameraEvolutionSimulation = exports.POLYGON_EXIT = exports.POLYGON_HAZARDS = exports.POLYGON_CHECKPOINTS = exports.POLYGON_CORES = exports.ARENA_RAMPS = exports.ARENA_BOXES = exports.POLYGON_CORES_REQUIRED = exports.ARENA_BOUNDS = void 0;
    exports.groundHeightAt = groundHeightAt;
    exports.collides = collides;
    exports.distance2 = distance2;
    exports.distance3 = distance3;
    exports.ARENA_BOUNDS = { minX: -10, maxX: 10, minZ: -8, maxZ: 8 };
    exports.POLYGON_CORES_REQUIRED = 3;
    exports.ARENA_BOXES = [
        { id: 'north-wall', x: 0, z: -7.65, width: 20, depth: 0.7, height: 2.2, kind: 'wall' },
        { id: 'south-wall-left', x: -5.8, z: 7.65, width: 8.4, depth: 0.7, height: 2.2, kind: 'wall' },
        { id: 'south-wall-right', x: 5.8, z: 7.65, width: 8.4, depth: 0.7, height: 2.2, kind: 'wall' },
        { id: 'west-wall', x: -9.65, z: 0, width: 0.7, depth: 16, height: 2.2, kind: 'wall' },
        { id: 'east-wall', x: 9.65, z: 0, width: 0.7, depth: 16, height: 2.2, kind: 'wall' },
        { id: 'center-block', x: 0, z: 0, width: 3.2, depth: 2.4, height: 2.7, kind: 'platform' },
        { id: 'pillar-nw', x: -5.8, z: -3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'pillar-ne', x: 5.8, z: -3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'pillar-sw', x: -5.8, z: 3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'pillar-se', x: 5.8, z: 3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'bridge-west', x: -3.8, z: 0.3, width: 2.5, depth: 1.2, height: 1.1, kind: 'platform' },
        { id: 'bridge-east', x: 3.8, z: -0.3, width: 2.5, depth: 1.2, height: 1.1, kind: 'platform' },
    ];
    exports.ARENA_RAMPS = [
        { id: 'ramp-west', x: -3.8, z: 1.7, width: 2.4, depth: 2.0, height: 1.1, axis: 'z', direction: -1 },
        { id: 'ramp-east', x: 3.8, z: -1.7, width: 2.4, depth: 2.0, height: 1.1, axis: 'z', direction: 1 },
        { id: 'ramp-center', x: 0, z: 2.1, width: 2.6, depth: 1.8, height: 2.7, axis: 'z', direction: -1 },
    ];
    exports.POLYGON_CORES = [
        { id: 'core-cyan', x: -7.4, y: 0.75, z: -5.1 },
        { id: 'core-magenta', x: 7.1, y: 0.75, z: -4.9 },
        { id: 'core-amber', x: 0, y: 3.45, z: 0 },
    ];
    exports.POLYGON_CHECKPOINTS = [
        { id: 'checkpoint-west', x: -7.0, y: 0.05, z: 4.8 },
        { id: 'checkpoint-east', x: 7.0, y: 0.05, z: 4.8 },
    ];
    exports.POLYGON_HAZARDS = [
        { id: 'hazard-west', x: -3.2, y: 0.05, z: -4.8 },
        { id: 'hazard-east', x: 3.2, y: 0.05, z: 4.8 },
        { id: 'hazard-center', x: 0, y: 0.05, z: -3.2 },
    ];
    exports.POLYGON_EXIT = { id: 'exit', x: 0, y: 0.05, z: 7.15 };
    const START = { x: 0, y: 0, z: -6.2, angle: Math.PI / 2, verticalVelocity: 0 };
    const PLAYER_RADIUS = 0.38;
    const GRAVITY = 13.5;
    const DIFFICULTIES = {
        cadete: { lives: 5, timeMs: 360_000, moveSpeed: 4.2, turnSpeed: 2.5, jumpSpeed: 6.0, hazardPeriodMs: 2500 },
        piloto: { lives: 4, timeMs: 300_000, moveSpeed: 4.7, turnSpeed: 2.8, jumpSpeed: 6.15, hazardPeriodMs: 1900 },
        arquiteto: { lives: 3, timeMs: 240_000, moveSpeed: 5.1, turnSpeed: 3.05, jumpSpeed: 6.2, hazardPeriodMs: 1400 },
    };
    class CameraEvolutionSimulation {
        #state;
        constructor(difficulty = 'piloto') {
            this.#state = initialState(difficulty);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready') {
                this.#state = { ...this.#state, status: 'playing', message: 'Colete três lentes, experimente as seis câmeras e alcance o portal de saída.' };
            }
        }
        restart(difficulty = this.#state.difficulty) {
            this.#state = initialState(difficulty);
            this.start();
        }
        setMovement(action, active) {
            if (this.#state.status !== 'playing')
                return;
            const property = action === 'forward' ? 'moveForward' : action === 'backward' ? 'moveBackward' : action === 'turn-left' ? 'turnLeft' : 'turnRight';
            this.#state = { ...this.#state, [property]: active };
        }
        jump() {
            if (this.#state.status !== 'playing')
                return [];
            const ground = groundHeightAt(this.#state.player.x, this.#state.player.z);
            if (this.#state.player.y > ground + 0.03 || this.#state.player.verticalVelocity > 0.01)
                return [];
            this.#state = {
                ...this.#state,
                player: { ...this.#state.player, verticalVelocity: DIFFICULTIES[this.#state.difficulty].jumpSpeed },
                message: 'Salto aplicado ao avatar de teste.',
            };
            return ['jump'];
        }
        toggleCamera() {
            if (this.#state.status !== 'playing')
                return [];
            const order = ['third-person', 'chase', 'first-person', 'fixed', 'orbital', 'top-down'];
            const cameraMode = order[(order.indexOf(this.#state.cameraMode) + 1) % order.length];
            const visitedCameras = this.#state.visitedCameras.includes(cameraMode) ? this.#state.visitedCameras : [...this.#state.visitedCameras, cameraMode];
            this.#state = { ...this.#state, cameraMode, visitedCameras, score: this.#state.score + (visitedCameras.length > this.#state.visitedCameras.length ? 75 : 5), message: `Câmera alterada para ${cameraLabel(cameraMode)}.` };
            return ['camera-changed'];
        }
        toggleFov() {
            if (this.#state.status !== 'playing')
                return [];
            const fovDegrees = this.#state.fovDegrees === 45 ? 60 : this.#state.fovDegrees === 60 ? 75 : 45;
            this.#state = { ...this.#state, fovDegrees, score: this.#state.score + 10, message: `Campo de visão ajustado para ${fovDegrees}°.` };
            return ['fov-changed'];
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const dtMs = Math.min(Math.max(deltaMs, 0), 50);
            const dt = dtMs / 1000;
            const spec = DIFFICULTIES[this.#state.difficulty];
            const events = [];
            let state = {
                ...this.#state,
                elapsedMs: this.#state.elapsedMs + dtMs,
                remainingMs: Math.max(0, this.#state.remainingMs - dtMs),
                damageCooldownMs: Math.max(0, this.#state.damageCooldownMs - dtMs),
            };
            const turn = (state.turnRight ? 1 : 0) - (state.turnLeft ? 1 : 0);
            const angle = normalizeAngle(state.player.angle + turn * spec.turnSpeed * dt);
            const direction = (state.moveForward ? 1 : 0) - (state.moveBackward ? 1 : 0);
            let x = state.player.x;
            let z = state.player.z;
            if (direction !== 0) {
                const distance = direction * spec.moveSpeed * dt;
                const nextX = x + Math.cos(angle) * distance;
                const nextZ = z + Math.sin(angle) * distance;
                if (!collides(nextX, z))
                    x = nextX;
                if (!collides(x, nextZ))
                    z = nextZ;
            }
            const ground = groundHeightAt(x, z);
            let verticalVelocity = state.player.verticalVelocity - GRAVITY * dt;
            let y = state.player.y + verticalVelocity * dt;
            if (y <= ground) {
                y = ground;
                verticalVelocity = 0;
            }
            state = { ...state, player: { x, y, z, angle, verticalVelocity } };
            for (const core of exports.POLYGON_CORES) {
                if (!state.collectedCores.includes(core.id) && distance3(state.player, core) < 0.8) {
                    const collectedCores = [...state.collectedCores, core.id];
                    const unlocked = collectedCores.length >= exports.POLYGON_CORES_REQUIRED && state.collectedCores.length < exports.POLYGON_CORES_REQUIRED;
                    state = { ...state, collectedCores, score: state.score + 400, message: unlocked ? 'Três núcleos sincronizados: o portal de saída está ativo.' : `Núcleo ${collectedCores.length}/${exports.POLYGON_CORES_REQUIRED} coletado.` };
                    events.push('core-collected');
                    if (unlocked)
                        events.push('gate-unlocked');
                }
            }
            for (const checkpoint of exports.POLYGON_CHECKPOINTS) {
                if (!state.activatedCheckpoints.includes(checkpoint.id) && distance2(state.player, checkpoint) < 0.85) {
                    state = {
                        ...state,
                        activatedCheckpoints: [...state.activatedCheckpoints, checkpoint.id],
                        checkpoint: { ...state.player, verticalVelocity: 0 },
                        remainingMs: Math.min(spec.timeMs, state.remainingMs + 15_000),
                        score: state.score + 250,
                        message: 'Checkpoint geométrico registrado e tempo ampliado.',
                    };
                    events.push('checkpoint');
                }
            }
            const hazardActiveNow = Math.floor(state.elapsedMs / spec.hazardPeriodMs) % 2 === 0;
            const touchedHazard = exports.POLYGON_HAZARDS.some((hazard) => distance2(state.player, hazard) < 0.9);
            if (hazardActiveNow && touchedHazard && state.damageCooldownMs <= 0) {
                const lives = state.lives - 1;
                events.push('damage');
                if (lives <= 0) {
                    state = { ...state, lives: 0, status: 'lost', message: 'A malha de segurança encerrou a sessão.' };
                    events.push('finished');
                }
                else {
                    state = {
                        ...state,
                        lives,
                        player: { ...state.checkpoint },
                        damageCooldownMs: 1800,
                        score: Math.max(0, state.score - 150),
                        message: `Pulso de câmeras detectado. Retorno ao checkpoint com ${lives} vidas.`,
                    };
                    events.push('life-lost');
                }
            }
            if (distance2(state.player, exports.POLYGON_EXIT) < 1.05) {
                if (state.collectedCores.length >= exports.POLYGON_CORES_REQUIRED) {
                    state = {
                        ...state,
                        status: 'won',
                        score: state.score + 1500 + Math.floor(state.remainingMs / 100),
                        message: 'Laboratório concluído: câmeras, campo de visão e movimento foram comparados.',
                    };
                    events.push('finished');
                }
                else {
                    state = { ...state, message: `Portal bloqueado: faltam ${exports.POLYGON_CORES_REQUIRED - state.collectedCores.length} núcleos.` };
                }
            }
            if (state.remainingMs <= 0 && state.status === 'playing') {
                state = { ...state, status: 'lost', message: 'Tempo de exploração esgotado.' };
                events.push('finished');
            }
            this.#state = state;
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Versão de save incompatível');
            this.#state = cloneState(state);
        }
    }
    exports.CameraEvolutionSimulation = CameraEvolutionSimulation;
    function groundHeightAt(x, z) {
        for (const ramp of exports.ARENA_RAMPS) {
            const localX = (x - (ramp.x - ramp.width / 2)) / ramp.width;
            const localZ = (z - (ramp.z - ramp.depth / 2)) / ramp.depth;
            if (localX >= 0 && localX <= 1 && localZ >= 0 && localZ <= 1) {
                const progress = ramp.axis === 'x' ? localX : localZ;
                return ramp.height * (ramp.direction === 1 ? progress : 1 - progress);
            }
        }
        for (const box of exports.ARENA_BOXES) {
            if (box.kind !== 'platform')
                continue;
            if (Math.abs(x - box.x) <= box.width / 2 - PLAYER_RADIUS * 0.4 && Math.abs(z - box.z) <= box.depth / 2 - PLAYER_RADIUS * 0.4)
                return box.height;
        }
        return 0;
    }
    function collides(x, z) {
        if (x < exports.ARENA_BOUNDS.minX + PLAYER_RADIUS || x > exports.ARENA_BOUNDS.maxX - PLAYER_RADIUS || z < exports.ARENA_BOUNDS.minZ + PLAYER_RADIUS || z > exports.ARENA_BOUNDS.maxZ - PLAYER_RADIUS)
            return true;
        const playerGround = groundHeightAt(x, z);
        return exports.ARENA_BOXES.some((box) => {
            if (box.kind === 'platform' && playerGround >= box.height - 0.08)
                return false;
            return Math.abs(x - box.x) < box.width / 2 + PLAYER_RADIUS && Math.abs(z - box.z) < box.depth / 2 + PLAYER_RADIUS;
        });
    }
    function distance2(a, b) {
        return Math.hypot(a.x - b.x, a.z - b.z);
    }
    function distance3(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    function initialState(difficulty) {
        const spec = DIFFICULTIES[difficulty];
        return {
            schemaVersion: 1,
            difficulty,
            status: 'ready',
            player: { ...START },
            checkpoint: { ...START },
            moveForward: false,
            moveBackward: false,
            turnLeft: false,
            turnRight: false,
            collectedCores: [],
            activatedCheckpoints: [],
            lives: spec.lives,
            score: 0,
            elapsedMs: 0,
            remainingMs: spec.timeMs,
            damageCooldownMs: 0,
            cameraMode: 'third-person',
            materialMode: 'pbr',
            fovDegrees: 60,
            visitedCameras: ['third-person'],
            message: 'Laboratório pronto. Compare seis sistemas de câmera na mesma arena.',
        };
    }
    function cloneState(state) {
        return {
            ...state,
            player: { ...state.player },
            checkpoint: { ...state.checkpoint },
            collectedCores: [...state.collectedCores],
            activatedCheckpoints: [...state.activatedCheckpoints],
            visitedCameras: [...state.visitedCameras],
        };
    }
    function normalizeAngle(angle) {
        const full = Math.PI * 2;
        return ((angle % full) + full) % full;
    }
    function cameraLabel(mode) {
        if (mode === 'first-person')
            return 'primeira pessoa';
        if (mode === 'fixed')
            return 'fixa por setor';
        if (mode === 'orbital')
            return 'orbital';
        if (mode === 'top-down')
            return 'visão superior';
        if (mode === 'chase')
            return 'perseguição';
        return 'terceira pessoa';
    }
    
  };
  __modules["games/camera-evolution/webgl/camera-evolution-renderer"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CameraEvolutionRenderer = void 0;
    const camera_evolution_simulation_1 = __require("games/camera-evolution/simulation/camera-evolution-simulation");
    const VERTEX_SHADER = `
    attribute vec3 a_position;
    attribute vec3 a_normal;
    uniform mat4 u_model;
    uniform mat4 u_viewProjection;
    varying vec3 v_normal;
    varying vec3 v_world;
    void main() {
      vec4 world = u_model * vec4(a_position, 1.0);
      v_world = world.xyz;
      v_normal = normalize(mat3(u_model) * a_normal);
      gl_Position = u_viewProjection * world;
    }`;
    const FRAGMENT_SHADER = `
    precision mediump float;
    uniform vec3 u_color;
    uniform vec3 u_lightDirection;
    uniform vec3 u_cameraPosition;
    uniform int u_materialMode;
    uniform float u_emissive;
    uniform float u_alpha;
    varying vec3 v_normal;
    varying vec3 v_world;
    void main() {
      vec3 normal = normalize(v_normal);
      vec3 lightDirection = normalize(-u_lightDirection);
      float diffuse = max(dot(normal, lightDirection), 0.0);
      vec3 color = u_color;
      if (u_materialMode == 1) {
        float checker = mod(floor(v_world.x * 1.6) + floor(v_world.z * 1.6) + floor(v_world.y * 1.6), 2.0);
        color *= mix(0.58, 1.18, checker);
      }
      float lighting = 0.82;
      if (u_materialMode == 2) {
        vec3 viewDirection = normalize(u_cameraPosition - v_world);
        vec3 halfDirection = normalize(lightDirection + viewDirection);
        float specular = pow(max(dot(normal, halfDirection), 0.0), 28.0);
        lighting = 0.24 + diffuse * 0.82 + specular * 0.55;
      } else if (u_materialMode == 1) {
        lighting = 0.42 + diffuse * 0.72;
      }
      gl_FragColor = vec4(color * lighting + color * u_emissive, u_alpha);
    }`;
    class CameraEvolutionRenderer {
        #canvas;
        #gl;
        #program;
        #cube;
        #octahedron;
        #graphicsMode;
        #reducedMotion;
        #positionLocation;
        #normalLocation;
        #modelLocation;
        #viewProjectionLocation;
        #colorLocation;
        #lightDirectionLocation;
        #cameraLocation;
        #materialLocation;
        #emissiveLocation;
        #alphaLocation;
        #drawCalls = 0;
        #triangles = 0;
        #disposed = false;
        #contextLost = false;
        constructor(canvas, graphicsMode, reducedMotion) {
            this.#canvas = canvas;
            this.#graphicsMode = graphicsMode;
            this.#reducedMotion = reducedMotion;
            const gl = canvas.getContext('webgl', {
                antialias: graphicsMode !== 'baixo' && graphicsMode !== 'historico',
                alpha: false,
                depth: true,
                powerPreference: graphicsMode === 'alto' || graphicsMode === 'ultra' ? 'high-performance' : 'default',
            });
            if (!gl)
                throw new Error('WebGL indisponível neste navegador.');
            this.#gl = gl;
            this.#program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
            this.#positionLocation = gl.getAttribLocation(this.#program, 'a_position');
            this.#normalLocation = gl.getAttribLocation(this.#program, 'a_normal');
            this.#modelLocation = requiredUniform(gl, this.#program, 'u_model');
            this.#viewProjectionLocation = requiredUniform(gl, this.#program, 'u_viewProjection');
            this.#colorLocation = requiredUniform(gl, this.#program, 'u_color');
            this.#lightDirectionLocation = requiredUniform(gl, this.#program, 'u_lightDirection');
            this.#cameraLocation = requiredUniform(gl, this.#program, 'u_cameraPosition');
            this.#materialLocation = requiredUniform(gl, this.#program, 'u_materialMode');
            this.#emissiveLocation = requiredUniform(gl, this.#program, 'u_emissive');
            this.#alphaLocation = requiredUniform(gl, this.#program, 'u_alpha');
            this.#cube = createGeometry(gl, cubeVertices(), cubeNormals(), cubeIndices());
            this.#octahedron = createGeometry(gl, octahedronVertices(), octahedronNormals(), octahedronIndices());
            canvas.addEventListener('webglcontextlost', this.#onContextLost, false);
            canvas.addEventListener('webglcontextrestored', this.#onContextRestored, false);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
        resize(width, height, devicePixelRatio) {
            const scale = resolutionScale(this.#graphicsMode);
            const pixelRatio = Math.min(devicePixelRatio, this.#graphicsMode === 'ultra' ? 2 : this.#graphicsMode === 'alto' ? 1.6 : 1.25);
            const renderWidth = Math.max(2, Math.floor(width * pixelRatio * scale));
            const renderHeight = Math.max(2, Math.floor(height * pixelRatio * scale));
            if (this.#canvas.width !== renderWidth || this.#canvas.height !== renderHeight) {
                this.#canvas.width = renderWidth;
                this.#canvas.height = renderHeight;
                this.#canvas.style.width = `${Math.max(1, width)}px`;
                this.#canvas.style.height = `${Math.max(1, height)}px`;
            }
        }
        render(state, nowMs) {
            if (this.#disposed || this.#contextLost)
                return { drawCalls: 0, triangles: 0, resolutionScale: resolutionScale(this.#graphicsMode) };
            const gl = this.#gl;
            this.#drawCalls = 0;
            this.#triangles = 0;
            gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
            const historical = this.#graphicsMode === 'historico';
            gl.clearColor(historical ? 0.012 : 0.018, historical ? 0.025 : 0.035, historical ? 0.018 : 0.07, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.useProgram(this.#program);
            const camera = cameraForState(state);
            const projection = perspective(state.fovDegrees * Math.PI / 180, Math.max(0.2, this.#canvas.width / this.#canvas.height), 0.1, 80);
            const view = lookAt(camera.position, camera.target, { x: 0, y: 1, z: 0 });
            const viewProjection = multiply(projection, view);
            gl.uniformMatrix4fv(this.#viewProjectionLocation, false, viewProjection);
            gl.uniform3f(this.#lightDirectionLocation, -0.55, -1, 0.35);
            gl.uniform3f(this.#cameraLocation, camera.position.x, camera.position.y, camera.position.z);
            const materialMode = historical ? 'flat' : state.materialMode;
            const pulse = this.#reducedMotion ? 1 : 0.75 + Math.sin(nowMs * 0.004) * 0.25;
            this.#drawCube(transform(0, -0.28, 0, 20, 0.5, 16), historical ? [0.08, 0.16, 0.1] : [0.09, 0.14, 0.22], materialMode);
            this.#drawGrid(materialMode, historical);
            camera_evolution_simulation_1.ARENA_BOXES.forEach((box, index) => {
                const baseColor = box.kind === 'pillar'
                    ? historical ? [0.18, 0.5, 0.28] : [0.18 + (index % 2) * 0.05, 0.42, 0.62]
                    : box.kind === 'platform'
                        ? historical ? [0.14, 0.4, 0.22] : [0.38, 0.18, 0.52]
                        : historical ? [0.1, 0.34, 0.18] : [0.12, 0.23, 0.38];
                this.#drawCube(transform(box.x, box.height / 2, box.z, box.width, box.height, box.depth), baseColor, materialMode);
            });
            camera_evolution_simulation_1.ARENA_RAMPS.forEach((ramp) => {
                const angle = Math.atan2(ramp.height, ramp.axis === 'x' ? ramp.width : ramp.depth) * ramp.direction;
                const length = Math.hypot(ramp.axis === 'x' ? ramp.width : ramp.depth, ramp.height);
                const model = ramp.axis === 'x'
                    ? transform(ramp.x, ramp.height / 2 - 0.08, ramp.z, length, 0.28, ramp.depth, 0, 0, -angle)
                    : transform(ramp.x, ramp.height / 2 - 0.08, ramp.z, ramp.width, 0.28, length, angle, 0, 0);
                this.#drawCube(model, historical ? [0.22, 0.55, 0.3] : [0.28, 0.48, 0.68], materialMode);
            });
            camera_evolution_simulation_1.POLYGON_CHECKPOINTS.forEach((checkpoint) => {
                const active = state.activatedCheckpoints.includes(checkpoint.id);
                this.#drawCube(transform(checkpoint.x, 0.05, checkpoint.z, 1.35, 0.1, 1.35), active ? [0.18, 0.95, 0.62] : [0.12, 0.34, 0.42], materialMode, active ? 0.28 : 0.02);
                for (let bar = 0; bar < 4; bar += 1) {
                    const angle = bar * Math.PI / 2;
                    this.#drawCube(transform(checkpoint.x + Math.cos(angle) * 0.65, 0.55, checkpoint.z + Math.sin(angle) * 0.65, 0.09, 1.0, 0.09), active ? [0.32, 1, 0.72] : [0.18, 0.5, 0.58], materialMode, active ? 0.35 : 0.05);
                }
            });
            camera_evolution_simulation_1.POLYGON_HAZARDS.forEach((hazard, index) => {
                const active = Math.floor(state.elapsedMs / (state.difficulty === 'arquiteto' ? 1400 : state.difficulty === 'cadete' ? 2500 : 1900)) % 2 === 0;
                const glow = active ? pulse : 0.2;
                this.#drawCube(transform(hazard.x, 0.04, hazard.z, 1.55, 0.08, 1.55, 0, nowMs * 0.0005 * (index + 1), 0), active ? [1, 0.16, 0.28] : [0.28, 0.06, 0.1], materialMode, glow * 0.4);
            });
            camera_evolution_simulation_1.POLYGON_CORES.forEach((core, index) => {
                if (state.collectedCores.includes(core.id))
                    return;
                const colors = historical ? [[0.3, 1, 0.45], [0.3, 1, 0.45], [0.3, 1, 0.45]] : [[0.15, 0.95, 1], [1, 0.2, 0.72], [1, 0.68, 0.12]];
                const bob = this.#reducedMotion ? 0 : Math.sin(nowMs * 0.003 + index * 2) * 0.16;
                this.#drawGeometry(this.#octahedron, transform(core.x, core.y + bob, core.z, 0.65, 0.9, 0.65, nowMs * 0.0008, nowMs * 0.0011, 0), colors[index], materialMode, 0.55);
            });
            const unlocked = state.collectedCores.length >= 3;
            this.#drawPortal(camera_evolution_simulation_1.POLYGON_EXIT, unlocked, materialMode, nowMs, historical);
            this.#drawPlayer(state, materialMode, historical);
            return { drawCalls: this.#drawCalls, triangles: this.#triangles, resolutionScale: resolutionScale(this.#graphicsMode) };
        }
        dispose() {
            if (this.#disposed)
                return;
            this.#disposed = true;
            const gl = this.#gl;
            [this.#cube, this.#octahedron].forEach((geometry) => {
                gl.deleteBuffer(geometry.position);
                gl.deleteBuffer(geometry.normal);
                gl.deleteBuffer(geometry.index);
            });
            gl.deleteProgram(this.#program);
            this.#canvas.removeEventListener('webglcontextlost', this.#onContextLost, false);
            this.#canvas.removeEventListener('webglcontextrestored', this.#onContextRestored, false);
        }
        #onContextLost = (event) => {
            event.preventDefault();
            this.#contextLost = true;
        };
        #onContextRestored = () => {
            this.#contextLost = false;
        };
        #drawGrid(materialMode, historical) {
            if (this.#graphicsMode === 'baixo')
                return;
            for (let x = camera_evolution_simulation_1.ARENA_BOUNDS.minX + 1; x < camera_evolution_simulation_1.ARENA_BOUNDS.maxX; x += 1) {
                this.#drawCube(transform(x, 0.006, 0, 0.018, 0.012, 15), historical ? [0.08, 0.32, 0.14] : [0.08, 0.34, 0.48], materialMode, 0.08);
            }
            for (let z = camera_evolution_simulation_1.ARENA_BOUNDS.minZ + 1; z < camera_evolution_simulation_1.ARENA_BOUNDS.maxZ; z += 1) {
                this.#drawCube(transform(0, 0.006, z, 19, 0.012, 0.018), historical ? [0.08, 0.32, 0.14] : [0.08, 0.34, 0.48], materialMode, 0.08);
            }
        }
        #drawPlayer(state, materialMode, historical) {
            const player = state.player;
            if (state.cameraMode !== 'first-person') {
                this.#drawCube(transform(player.x, player.y + 0.56, player.z, 0.62, 0.85, 0.62, 0, -player.angle + Math.PI / 2, 0), historical ? [0.42, 1, 0.52] : [0.3, 0.72, 1], materialMode, 0.08);
                this.#drawCube(transform(player.x, player.y + 1.18, player.z, 0.46, 0.38, 0.46, 0, -player.angle + Math.PI / 2, 0), historical ? [0.58, 1, 0.62] : [0.82, 0.9, 1], materialMode, 0.12);
                this.#drawCube(transform(player.x + Math.cos(player.angle) * 0.37, player.y + 0.78, player.z + Math.sin(player.angle) * 0.37, 0.18, 0.18, 0.44, 0, -player.angle + Math.PI / 2, 0), [1, 0.45, 0.16], materialMode, 0.18);
                if (this.#graphicsMode !== 'baixo')
                    this.#drawCube(transform(player.x, 0.018, player.z, 0.76, 0.025, 0.76), [0.02, 0.03, 0.05], 'flat', 0, 0.45);
            }
        }
        #drawPortal(point, unlocked, materialMode, nowMs, historical) {
            const color = unlocked ? historical ? [0.35, 1, 0.48] : [0.2, 1, 0.7] : historical ? [0.18, 0.38, 0.22] : [0.22, 0.25, 0.34];
            for (let part = 0; part < 10; part += 1) {
                const angle = part / 10 * Math.PI * 2 + (unlocked && !this.#reducedMotion ? nowMs * 0.00025 : 0);
                const x = point.x + Math.cos(angle) * 1.25;
                const y = 1.55 + Math.sin(angle) * 1.25;
                this.#drawCube(transform(x, y, point.z, 0.28, 0.28, 0.38, 0, 0, angle), color, materialMode, unlocked ? 0.45 : 0.03);
            }
        }
        #drawCube(model, color, materialMode, emissive = 0, alpha = 1) {
            this.#drawGeometry(this.#cube, model, color, materialMode, emissive, alpha);
        }
        #drawGeometry(geometry, model, color, materialMode, emissive = 0, alpha = 1) {
            const gl = this.#gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, geometry.position);
            gl.enableVertexAttribArray(this.#positionLocation);
            gl.vertexAttribPointer(this.#positionLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, geometry.normal);
            gl.enableVertexAttribArray(this.#normalLocation);
            gl.vertexAttribPointer(this.#normalLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.index);
            gl.uniformMatrix4fv(this.#modelLocation, false, model);
            gl.uniform3f(this.#colorLocation, color[0], color[1], color[2]);
            gl.uniform1i(this.#materialLocation, materialMode === 'flat' ? 0 : materialMode === 'texture' ? 1 : 2);
            gl.uniform1f(this.#emissiveLocation, emissive);
            gl.uniform1f(this.#alphaLocation, alpha);
            gl.drawElements(gl.TRIANGLES, geometry.indexCount, gl.UNSIGNED_SHORT, 0);
            this.#drawCalls += 1;
            this.#triangles += geometry.indexCount / 3;
        }
    }
    exports.CameraEvolutionRenderer = CameraEvolutionRenderer;
    function resolutionScale(mode) {
        if (mode === 'baixo')
            return 0.62;
        if (mode === 'medio' || mode === 'automatico')
            return 0.82;
        if (mode === 'historico')
            return 0.58;
        if (mode === 'alto')
            return 1;
        return 1.12;
    }
    function cameraForState(state) {
        const player = state.player;
        const forward = { x: Math.cos(player.angle), z: Math.sin(player.angle) };
        const right = { x: -forward.z, z: forward.x };
        if (state.cameraMode === 'first-person')
            return {
                position: { x: player.x, y: player.y + 1.05, z: player.z },
                target: { x: player.x + forward.x * 5, y: player.y + 0.92, z: player.z + forward.z * 5 },
            };
        if (state.cameraMode === 'fixed') {
            const sectorX = player.x < -2 ? -7 : player.x > 2 ? 7 : 0;
            const sectorZ = player.z < 0 ? -10 : 10;
            return { position: { x: sectorX + 7, y: 12, z: sectorZ }, target: { x: player.x, y: player.y + 0.7, z: player.z } };
        }
        if (state.cameraMode === 'orbital') {
            const orbit = state.elapsedMs * 0.00035;
            return { position: { x: player.x + Math.cos(orbit) * 7, y: player.y + 5, z: player.z + Math.sin(orbit) * 7 }, target: { x: player.x, y: player.y + 0.7, z: player.z } };
        }
        if (state.cameraMode === 'top-down')
            return { position: { x: player.x + 0.01, y: player.y + 15, z: player.z + 0.01 }, target: { x: player.x, y: player.y, z: player.z } };
        if (state.cameraMode === 'chase')
            return {
                position: { x: player.x - forward.x * 7 + right.x * 1.2, y: player.y + 2.25, z: player.z - forward.z * 7 + right.z * 1.2 },
                target: { x: player.x + forward.x * 3.6, y: player.y + 0.65, z: player.z + forward.z * 3.6 },
            };
        return {
            position: { x: player.x - forward.x * 5.3, y: player.y + 3.2, z: player.z - forward.z * 5.3 },
            target: { x: player.x + forward.x * 1.6, y: player.y + 0.75, z: player.z + forward.z * 1.6 },
        };
    }
    function createProgram(gl, vertexSource, fragmentSource) {
        const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        const program = gl.createProgram();
        if (!program)
            throw new Error('Não foi possível criar o programa WebGL.');
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program) ?? 'Erro desconhecido';
            gl.deleteProgram(program);
            throw new Error(`Falha ao ligar shaders: ${log}`);
        }
        return program;
    }
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        if (!shader)
            throw new Error('Não foi possível criar shader WebGL.');
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader) ?? 'Erro desconhecido';
            gl.deleteShader(shader);
            throw new Error(`Falha ao compilar shader: ${log}`);
        }
        return shader;
    }
    function requiredUniform(gl, program, name) {
        const location = gl.getUniformLocation(program, name);
        if (!location)
            throw new Error(`Uniform obrigatório ausente: ${name}`);
        return location;
    }
    function createGeometry(gl, vertices, normals, indices) {
        const position = gl.createBuffer();
        const normal = gl.createBuffer();
        const index = gl.createBuffer();
        if (!position || !normal || !index)
            throw new Error('Falha ao criar buffers WebGL.');
        gl.bindBuffer(gl.ARRAY_BUFFER, position);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, normal);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return { position, normal, index, indexCount: indices.length };
    }
    function cubeVertices() {
        return [
            -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
            0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
            -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
        ];
    }
    function cubeNormals() {
        return [
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        ];
    }
    function cubeIndices() {
        return [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
    }
    function octahedronVertices() {
        return [0, 1, 0, 1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, -1, 0, -1, 0];
    }
    function octahedronNormals() {
        const source = octahedronVertices();
        const normals = [];
        for (let index = 0; index < source.length; index += 3) {
            const length = Math.hypot(source[index], source[index + 1], source[index + 2]) || 1;
            normals.push(source[index] / length, source[index + 1] / length, source[index + 2] / length);
        }
        return normals;
    }
    function octahedronIndices() {
        return [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1, 5, 2, 1, 5, 3, 2, 5, 4, 3, 5, 1, 4];
    }
    function transform(x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) {
        const cx = Math.cos(rx), sxn = Math.sin(rx);
        const cy = Math.cos(ry), syn = Math.sin(ry);
        const cz = Math.cos(rz), szn = Math.sin(rz);
        return new Float32Array([
            (cy * cz) * sx, (sxn * syn * cz + cx * szn) * sx, (-cx * syn * cz + sxn * szn) * sx, 0,
            (-cy * szn) * sy, (-sxn * syn * szn + cx * cz) * sy, (cx * syn * szn + sxn * cz) * sy, 0,
            syn * sz, -sxn * cy * sz, cx * cy * sz, 0,
            x, y, z, 1,
        ]);
    }
    function perspective(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0,
        ]);
    }
    function lookAt(eye, target, up) {
        let zx = eye.x - target.x, zy = eye.y - target.y, zz = eye.z - target.z;
        let length = Math.hypot(zx, zy, zz) || 1;
        zx /= length;
        zy /= length;
        zz /= length;
        let xx = up.y * zz - up.z * zy;
        let xy = up.z * zx - up.x * zz;
        let xz = up.x * zy - up.y * zx;
        length = Math.hypot(xx, xy, xz) || 1;
        xx /= length;
        xy /= length;
        xz /= length;
        const yx = zy * xz - zz * xy;
        const yy = zz * xx - zx * xz;
        const yz = zx * xy - zy * xx;
        return new Float32Array([
            xx, yx, zx, 0,
            xy, yy, zy, 0,
            xz, yz, zz, 0,
            -(xx * eye.x + xy * eye.y + xz * eye.z),
            -(yx * eye.x + yy * eye.y + yz * eye.z),
            -(zx * eye.x + zy * eye.y + zz * eye.z),
            1,
        ]);
    }
    function multiply(a, b) {
        const out = new Float32Array(16);
        for (let column = 0; column < 4; column += 1) {
            for (let row = 0; row < 4; row += 1) {
                out[column * 4 + row] =
                    a[row] * b[column * 4] +
                        a[4 + row] * b[column * 4 + 1] +
                        a[8 + row] * b[column * 4 + 2] +
                        a[12 + row] * b[column * 4 + 3];
            }
        }
        return out;
    }
    
  };
  __modules["games/camera-evolution/webgl/camera-evolution-runtime"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CameraEvolutionRuntime = void 0;
    const camera_evolution_audio_1 = __require("games/camera-evolution/audio/camera-evolution-audio");
    const camera_evolution_simulation_1 = __require("games/camera-evolution/simulation/camera-evolution-simulation");
    const camera_evolution_renderer_1 = __require("games/camera-evolution/webgl/camera-evolution-renderer");
    class CameraEvolutionRuntime {
        id = 'camera-evolution';
        state = 'not-loaded';
        #simulation = new camera_evolution_simulation_1.CameraEvolutionSimulation();
        #renderer;
        #canvas;
        #overlay;
        #context;
        #audio;
        #resizeObserver;
        #animationFrame = 0;
        #lastFrame = 0;
        #lastStats = { drawCalls: 0, triangles: 0, resolutionScale: 1 };
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new camera_evolution_simulation_1.CameraEvolutionSimulation(parseDifficulty(context.parameters?.difficulty));
            this.#audio = new camera_evolution_audio_1.CameraEvolutionAudio(context.muted);
            const canvas = document.createElement('canvas');
            canvas.className = 'polygon-webgl-canvas';
            canvas.setAttribute('aria-label', 'Arena de câmeras tridimensional');
            const overlay = document.createElement('div');
            overlay.className = 'polygon-webgl-overlay';
            overlay.setAttribute('aria-live', 'polite');
            context.container.replaceChildren(canvas, overlay);
            this.#canvas = canvas;
            this.#overlay = overlay;
            try {
                this.#renderer = new camera_evolution_renderer_1.CameraEvolutionRenderer(canvas, context.graphicsMode, context.reducedMotion);
            }
            catch (error) {
                context.container.innerHTML = `<div class="webgl-fallback"><strong>WebGL indisponível</strong><p>${error instanceof Error ? error.message : 'Não foi possível iniciar o renderizador 3D.'}</p></div>`;
                throw error;
            }
            this.#resizeObserver = new ResizeObserver(() => this.#resize());
            this.#resizeObserver.observe(context.container);
            this.#resize();
            this.#render(performance.now());
            this.state = 'tutorial';
            context.onEvent?.({ type: 'ready', detail: { renderer: 'webgl', runtime: 'camera-evolution' } });
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'won' || current.status === 'lost')
                this.#simulation.restart(current.difficulty);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#lastFrame = performance.now();
            this.#context?.onEvent?.({ type: 'serve', detail: { difficulty: this.#simulation.state.difficulty, camera: this.#simulation.state.cameraMode } });
            this.#scheduleFrame();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            cancelAnimationFrame(this.#animationFrame);
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
            this.#render(performance.now());
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#lastFrame = performance.now();
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
            this.#scheduleFrame();
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-up')
                this.#simulation.setMovement('forward', input.active);
            else if (input.action === 'move-down')
                this.#simulation.setMovement('backward', input.active);
            else if (input.action === 'move-left')
                this.#simulation.setMovement('turn-left', input.active);
            else if (input.action === 'move-right')
                this.#simulation.setMovement('turn-right', input.active);
            else if (input.action === 'jump' && input.active)
                this.#processEvents(this.#simulation.jump());
            else if (input.action === 'primary-action' && input.active)
                this.#processEvents(this.#simulation.toggleFov());
            else if (input.action === 'secondary-action' && input.active)
                this.#processEvents(this.#simulation.toggleCamera());
            this.#render(performance.now());
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'won' || status === 'lost' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#render(performance.now());
        }
        dispose() {
            cancelAnimationFrame(this.#animationFrame);
            this.#resizeObserver?.disconnect();
            this.#renderer?.dispose();
            this.#audio?.dispose();
            this.#canvas?.remove();
            this.#overlay?.remove();
            this.#renderer = undefined;
            this.#canvas = undefined;
            this.#overlay = undefined;
            this.state = 'disposed';
        }
        #scheduleFrame() {
            cancelAnimationFrame(this.#animationFrame);
            this.#animationFrame = requestAnimationFrame((now) => this.#frame(now));
        }
        #frame(now) {
            if (this.state !== 'playing')
                return;
            const delta = Math.min(50, Math.max(0, now - this.#lastFrame));
            this.#lastFrame = now;
            this.#processEvents(this.#simulation.step(delta));
            this.#render(now);
            if (this.state === 'playing')
                this.#scheduleFrame();
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            const current = this.#simulation.state;
            events.forEach((event) => this.#audio?.play(event));
            for (const event of events) {
                if (event === 'finished') {
                    this.state = 'finished';
                    cancelAnimationFrame(this.#animationFrame);
                    this.#context?.onEvent?.({
                        type: 'finished',
                        detail: {
                            winner: current.status === 'won' ? 'player' : 'system',
                            score: current.score,
                            lives: current.lives,
                            cores: current.collectedCores.length,
                            checkpoints: current.activatedCheckpoints.length,
                            elapsed: Math.round(current.elapsedMs / 1000),
                            cameras: current.visitedCameras.length,
                            fov: current.fovDegrees,
                        },
                    });
                }
                else {
                    this.#context?.onEvent?.({
                        type: 'progress',
                        detail: {
                            event,
                            score: current.score,
                            lives: current.lives,
                            cores: current.collectedCores.length,
                            checkpoints: current.activatedCheckpoints.length,
                            camera: current.cameraMode,
                            fov: current.fovDegrees,
                            cameras: current.visitedCameras.length,
                        },
                    });
                }
            }
        }
        #resize() {
            const container = this.#context?.container;
            if (!container || !this.#renderer)
                return;
            const rect = container.getBoundingClientRect();
            this.#renderer.resize(Math.max(320, rect.width), Math.max(260, rect.height), window.devicePixelRatio || 1);
            this.#render(performance.now());
        }
        #render(now) {
            if (!this.#renderer)
                return;
            this.#lastStats = this.#renderer.render(this.#simulation.state, now);
            this.#updateOverlay();
        }
        #updateOverlay() {
            if (!this.#overlay)
                return;
            const state = this.#simulation.state;
            const camera = cameraRuntimeLabel(state.cameraMode);
            this.#overlay.innerHTML = `<span>${camera}</span><span>FOV ${state.fovDegrees}°</span><span>${state.visitedCameras.length}/6 CÂMERAS</span><span>${state.collectedCores.length}/${camera_evolution_simulation_1.POLYGON_CORES_REQUIRED} LENTES</span><span>${this.#lastStats.drawCalls} DRAWS · ${this.#lastStats.triangles} TRI</span><small>${state.message}</small>`;
        }
    }
    exports.CameraEvolutionRuntime = CameraEvolutionRuntime;
    function parseDifficulty(value) {
        return value === 'cadete' || value === 'arquiteto' ? value : 'piloto';
    }
    function cameraRuntimeLabel(mode) {
        return mode === 'first-person' ? '1ª PESSOA' : mode === 'fixed' ? 'FIXA' : mode === 'orbital' ? 'ORBITAL' : mode === 'top-down' ? 'SUPERIOR' : mode === 'chase' ? 'PERSEGUIÇÃO' : '3ª PESSOA';
    }
    
  };
  __modules["games/data-maze/audio/data-maze-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataMazeAudio = void 0;
    class DataMazeAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const frequencies = {
                pellet: 470,
                'power-node': 240,
                'drone-captured': 820,
                'player-hit': 105,
                bonus: 720,
                'level-complete': 640,
                victory: 980,
                'game-over': 72,
            };
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = event === 'player-hit' || event === 'game-over' ? 'sawtooth' : event === 'power-node' ? 'triangle' : 'square';
            oscillator.frequency.setValueAtTime(frequencies[event], context.currentTime);
            if (event === 'power-node')
                oscillator.frequency.exponentialRampToValueAtTime(520, context.currentTime + 0.18);
            gain.gain.setValueAtTime(event === 'pellet' ? 0.018 : 0.045, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (event === 'power-node' ? 0.2 : 0.11));
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + (event === 'power-node' ? 0.21 : 0.12));
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.DataMazeAudio = DataMazeAudio;
    
  };
  __modules["games/data-maze/content/data-maze-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DATA_MAZE_COMPARISON = exports.DATA_MAZE_PSEUDOCODE = exports.DATA_MAZE_HISTORY = void 0;
    exports.DATA_MAZE_HISTORY = {
        title: 'Quando inimigos passaram a perseguir com comportamentos distintos',
        paragraphs: [
            'Em 1980, os jogos de labirinto ganharam enorme visibilidade nos arcades. O jogador precisava ler rotas, coletar elementos e reagir a perseguidores que pareciam tomar decisões diferentes dentro da mesma grade.',
            'PAC-MAN, criado por Toru Iwatani e lançado pela Namco, tornou-se uma referência histórica dessa mudança ao combinar tilemap, túneis, itens de poder, pontuação e quatro perseguidores com padrões próprios.',
            'Labirinto de Dados é uma reconstrução educacional autoral. O núcleo controlável, os drones, os três mapas, as cores, o áudio, a lógica, a arte e o código são próprios; a obra comercial aparece somente como contexto histórico e técnico.',
        ],
        sourceUrl: 'https://www.bandainamco.co.jp/en/about/history/namco.html',
    };
    exports.DATA_MAZE_PSEUDOCODE = `A CADA PASSO DA SIMULAÇÃO:
      ler a próxima direção solicitada
      se o corredor permitir, mover o núcleo uma célula
      coletar bits e nós de energia presentes na célula
    
    PARA CADA DRONE:
      escolher o modo patrulha, perseguição, vulnerável ou retorno
      calcular o alvo conforme a personalidade do drone
      avaliar os corredores disponíveis
      mover pela rota de menor custo sem atravessar paredes
    
    AO ATIVAR UM NÓ DE ENERGIA:
      tornar os drones temporariamente vulneráveis
      aumentar a pontuação por capturas consecutivas
    
    AO COLIDIR COM UM DRONE ATIVO:
      perder uma vida
      restaurar as posições iniciais do mapa
    
    AO COLETAR TODOS OS DADOS:
      carregar o próximo labirinto
      após o terceiro mapa, concluir a campanha`;
    exports.DATA_MAZE_COMPARISON = [
        ['Mapa', 'Labirinto em grade formado por tiles reutilizados', 'Três mapas autorais gerados por corredores e dados versionados'],
        ['Perseguição', 'Padrões distintos criavam a sensação de personalidades', 'Quatro drones com alvos, estados e busca de rota próprios'],
        ['Energia', 'Itens especiais invertiam temporariamente a relação de risco', 'Nós de energia, combo progressivo e estado vulnerável serializável'],
        ['Tecnologia', 'Hardware arcade de 8 bits, sprites e memória restrita', 'TypeScript determinístico, busca em largura e Phaser sob demanda'],
        ['Controle', 'Joystick digital de quatro direções', 'Teclado, toque, tela cheia móvel e fila de direção'],
        ['Identidade', 'Obra comercial de 1980', 'Núcleo, drones, mapas, interface, áudio, arte e código próprios do Fliperama DS'],
    ];
    
  };
  __modules["games/data-maze/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const data_maze_runtime_1 = __require("games/data-maze/phaser/data-maze-runtime");
    function createRuntime() {
        return new data_maze_runtime_1.DataMazeRuntime();
    }
    
  };
  __modules["games/data-maze/levels/data-maze-levels"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DATA_MAZE_LEVELS = exports.MAZE_ROWS = exports.MAZE_COLUMNS = void 0;
    exports.tileAt = tileAt;
    exports.pointKey = pointKey;
    exports.createCollectibles = createCollectibles;
    exports.MAZE_COLUMNS = 23;
    exports.MAZE_ROWS = 19;
    function buildLayout(spec) {
        const grid = Array.from({ length: exports.MAZE_ROWS }, () => Array.from({ length: exports.MAZE_COLUMNS }, () => '#'));
        for (const row of spec.horizontalRows) {
            for (let column = 1; column < exports.MAZE_COLUMNS - 1; column += 1)
                grid[row][column] = ' ';
        }
        for (const column of spec.verticalColumns) {
            for (let row = 1; row < exports.MAZE_ROWS - 1; row += 1)
                grid[row][column] = ' ';
        }
        for (let column = 0; column < exports.MAZE_COLUMNS; column += 1)
            grid[spec.tunnelRow][column] = ' ';
        spec.extraCarves?.forEach(({ column, row }) => { grid[row][column] = ' '; });
        spec.extraWalls?.forEach(({ column, row }) => { grid[row][column] = '#'; });
        return grid.map((row) => row.join(''));
    }
    const levelOneLayout = buildLayout({
        horizontalRows: [1, 4, 7, 10, 13, 16, 17],
        verticalColumns: [1, 5, 9, 13, 17, 21],
        tunnelRow: 10,
        extraCarves: [
            { column: 11, row: 7 }, { column: 11, row: 8 }, { column: 11, row: 9 },
            { column: 10, row: 8 }, { column: 12, row: 8 },
        ],
        extraWalls: [
            { column: 9, row: 4 }, { column: 13, row: 4 },
            { column: 5, row: 13 }, { column: 17, row: 13 },
        ],
    });
    const levelTwoLayout = buildLayout({
        horizontalRows: [1, 3, 6, 9, 12, 15, 17],
        verticalColumns: [1, 3, 7, 11, 15, 19, 21],
        tunnelRow: 9,
        extraCarves: [
            { column: 9, row: 8 }, { column: 10, row: 8 }, { column: 12, row: 8 }, { column: 13, row: 8 },
            { column: 9, row: 10 }, { column: 10, row: 10 }, { column: 12, row: 10 }, { column: 13, row: 10 },
        ],
        extraWalls: [
            { column: 7, row: 3 }, { column: 15, row: 3 },
            { column: 3, row: 15 }, { column: 19, row: 15 },
        ],
    });
    const levelThreeLayout = buildLayout({
        horizontalRows: [1, 5, 8, 10, 13, 17],
        verticalColumns: [1, 4, 8, 11, 14, 18, 21],
        tunnelRow: 10,
        extraCarves: [
            { column: 10, row: 7 }, { column: 12, row: 7 },
            { column: 10, row: 9 }, { column: 12, row: 9 },
            { column: 10, row: 11 }, { column: 11, row: 11 }, { column: 12, row: 11 },
        ],
        extraWalls: [
            { column: 4, row: 5 }, { column: 18, row: 5 },
            { column: 8, row: 13 }, { column: 14, row: 13 },
        ],
    });
    exports.DATA_MAZE_LEVELS = [
        {
            id: 1,
            name: 'Memória Central',
            layout: levelOneLayout,
            tunnelRow: 10,
            playerStart: { column: 1, row: 17 },
            enemyStarts: [
                { column: 9, row: 10 }, { column: 13, row: 10 }, { column: 9, row: 7 }, { column: 13, row: 7 },
            ],
            powerNodes: [{ column: 1, row: 1 }, { column: 21, row: 1 }, { column: 1, row: 16 }, { column: 21, row: 16 }],
            bonusNode: { column: 11, row: 8 },
        },
        {
            id: 2,
            name: 'Barramento Cruzado',
            layout: levelTwoLayout,
            tunnelRow: 9,
            playerStart: { column: 1, row: 17 },
            enemyStarts: [
                { column: 11, row: 9 }, { column: 7, row: 9 }, { column: 15, row: 9 }, { column: 11, row: 6 },
            ],
            powerNodes: [{ column: 1, row: 1 }, { column: 21, row: 1 }, { column: 1, row: 15 }, { column: 21, row: 15 }],
            bonusNode: { column: 11, row: 12 },
        },
        {
            id: 3,
            name: 'Núcleo Recursivo',
            layout: levelThreeLayout,
            tunnelRow: 10,
            playerStart: { column: 1, row: 17 },
            enemyStarts: [
                { column: 11, row: 10 }, { column: 8, row: 10 }, { column: 14, row: 10 }, { column: 11, row: 8 },
            ],
            powerNodes: [{ column: 1, row: 1 }, { column: 21, row: 1 }, { column: 1, row: 13 }, { column: 21, row: 17 }],
            bonusNode: { column: 11, row: 11 },
        },
    ];
    function tileAt(level, column, row) {
        if (row < 0 || row >= exports.MAZE_ROWS || column < 0 || column >= exports.MAZE_COLUMNS)
            return '#';
        return level.layout[row]?.[column] ?? '#';
    }
    function pointKey(column, row) {
        return `${column}:${row}`;
    }
    function createCollectibles(level) {
        const excluded = new Set([
            pointKey(level.playerStart.column, level.playerStart.row),
            ...level.enemyStarts.map((point) => pointKey(point.column, point.row)),
            pointKey(level.bonusNode.column, level.bonusNode.row),
        ]);
        const powerNodes = level.powerNodes.map((point) => pointKey(point.column, point.row));
        powerNodes.forEach((key) => excluded.add(key));
        const pellets = [];
        for (let row = 0; row < exports.MAZE_ROWS; row += 1) {
            for (let column = 0; column < exports.MAZE_COLUMNS; column += 1) {
                if (tileAt(level, column, row) !== '#' && !excluded.has(pointKey(column, row)))
                    pellets.push(pointKey(column, row));
            }
        }
        return { pellets, powerNodes };
    }
    for (const level of exports.DATA_MAZE_LEVELS) {
        if (level.layout.length !== exports.MAZE_ROWS || level.layout.some((row) => row.length !== exports.MAZE_COLUMNS)) {
            throw new Error(`Mapa inválido no Data Maze: ${level.name}`);
        }
    }
    
  };
  __modules["games/data-maze/phaser/data-maze-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataMazeRuntime = void 0;
    const data_maze_audio_1 = __require("games/data-maze/audio/data-maze-audio");
    const data_maze_levels_1 = __require("games/data-maze/levels/data-maze-levels");
    const data_maze_simulation_1 = __require("games/data-maze/simulation/data-maze-simulation");
    class DataMazeRuntime {
        id = 'data-maze';
        state = 'not-loaded';
        #simulation = new data_maze_simulation_1.DataMazeSimulation();
        #game;
        #graphics;
        #audio;
        #context;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new data_maze_simulation_1.DataMazeSimulation(parseDifficulty(context.parameters?.difficulty), Date.now());
            this.#audio = new data_maze_audio_1.DataMazeAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class DataMazeScene extends Phaser.Scene {
                #view;
                constructor() { super('data-maze'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 680,
                backgroundColor: '#020611',
                transparent: false,
                scene: DataMazeScene,
                render: {
                    antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo',
                    pixelArt: context.graphicsMode === 'historico',
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'victory' || current.status === 'game-over')
                this.#simulation.restart(current.difficulty);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve', detail: { level: this.#simulation.state.level } });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing' || !input.active)
                return;
            const direction = directionFromAction(input.action);
            if (direction !== 'none')
                this.#simulation.setDirection(direction);
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'victory' || status === 'game-over' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            const progressEvent = events.find((event) => event !== 'pellet');
            if (progressEvent && !['victory', 'game-over'].includes(progressEvent)) {
                this.#context?.onEvent?.({
                    type: 'progress',
                    detail: {
                        event: progressEvent,
                        score: current.score,
                        lives: current.lives,
                        level: current.level,
                        remaining: current.pellets.length + current.powerNodes.length,
                        power: Math.round(current.powerRemainingMs),
                    },
                });
            }
            if (events.includes('victory') || events.includes('game-over')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: events.includes('victory') ? 'player' : 'drones',
                        score: current.score,
                        lives: current.lives,
                        level: current.level,
                    },
                });
            }
        }
        #redraw() {
            const graphics = this.#graphics;
            const scale = this.#game?.scale;
            if (graphics && scale)
                this.#draw(graphics, scale.width, scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const level = data_maze_levels_1.DATA_MAZE_LEVELS[state.level - 1] ?? data_maze_levels_1.DATA_MAZE_LEVELS[0];
            const mode = this.#context?.graphicsMode ?? 'medio';
            const historical = mode === 'historico';
            const low = mode === 'baixo';
            const padding = Math.max(12, Math.min(width, height) * 0.025);
            const tile = Math.max(8, Math.min((width - padding * 2) / data_maze_levels_1.MAZE_COLUMNS, (height - padding * 2) / data_maze_levels_1.MAZE_ROWS));
            const mazeWidth = tile * data_maze_levels_1.MAZE_COLUMNS;
            const mazeHeight = tile * data_maze_levels_1.MAZE_ROWS;
            const originX = (width - mazeWidth) / 2;
            const originY = (height - mazeHeight) / 2;
            const primary = historical ? 0xf0f0f0 : 0x4de7ff;
            const wall = historical ? 0xbdbdbd : 0x304f9f;
            const wallFill = historical ? 0x252525 : 0x0b1c43;
            const accent = historical ? 0xffffff : 0x65f0ad;
            const dangerColors = historical ? [0xd8d8d8, 0xbdbdbd, 0x9f9f9f, 0x7f7f7f] : [0xff627d, 0xffb45e, 0xb976ff, 0x54d6ff];
            const pelletSet = new Set(state.pellets);
            const powerSet = new Set(state.powerNodes);
            const pulse = 0.72 + Math.sin(state.elapsedMs / 130) * 0.18;
            graphics.clear();
            graphics.fillStyle(historical ? 0x050505 : 0x020611, 1);
            graphics.fillRect(0, 0, width, height);
            if (!historical && !low) {
                graphics.lineStyle(1, primary, 0.035);
                for (let x = originX; x <= originX + mazeWidth; x += tile)
                    graphics.lineBetween(x, originY, x, originY + mazeHeight);
                for (let y = originY; y <= originY + mazeHeight; y += tile)
                    graphics.lineBetween(originX, y, originX + mazeWidth, y);
            }
            for (let row = 0; row < data_maze_levels_1.MAZE_ROWS; row += 1) {
                for (let column = 0; column < data_maze_levels_1.MAZE_COLUMNS; column += 1) {
                    const x = originX + column * tile;
                    const y = originY + row * tile;
                    if ((0, data_maze_levels_1.tileAt)(level, column, row) === '#') {
                        graphics.fillStyle(wallFill, 1);
                        graphics.fillRoundedRect(x + tile * 0.08, y + tile * 0.08, tile * 0.84, tile * 0.84, tile * 0.18);
                        graphics.lineStyle(Math.max(1, tile * 0.06), wall, historical ? 0.8 : 0.72);
                        graphics.strokeRoundedRect(x + tile * 0.12, y + tile * 0.12, tile * 0.76, tile * 0.76, tile * 0.16);
                        continue;
                    }
                    const key = (0, data_maze_levels_1.pointKey)(column, row);
                    const centerX = x + tile / 2;
                    const centerY = y + tile / 2;
                    if (pelletSet.has(key)) {
                        graphics.fillStyle(primary, historical ? 0.85 : 0.9);
                        graphics.fillCircle(centerX, centerY, Math.max(1.5, tile * 0.085));
                    }
                    if (powerSet.has(key)) {
                        graphics.fillStyle(accent, pulse);
                        graphics.fillCircle(centerX, centerY, tile * 0.22);
                        graphics.lineStyle(Math.max(1, tile * 0.045), accent, 0.5);
                        graphics.strokeCircle(centerX, centerY, tile * 0.32);
                    }
                }
            }
            if (state.bonusVisible && !state.bonusCollected) {
                const x = originX + (level.bonusNode.column + 0.5) * tile;
                const y = originY + (level.bonusNode.row + 0.5) * tile;
                graphics.fillStyle(accent, 0.95);
                graphics.fillTriangle(x, y - tile * 0.34, x - tile * 0.34, y, x + tile * 0.34, y);
                graphics.fillTriangle(x, y + tile * 0.34, x - tile * 0.34, y, x + tile * 0.34, y);
                graphics.fillStyle(historical ? 0x050505 : 0x020611, 1);
                graphics.fillCircle(x, y, tile * 0.1);
            }
            state.enemies.forEach((enemy, index) => this.#drawEnemy(graphics, enemy, index, originX, originY, tile, dangerColors[index], historical, state.elapsedMs));
            this.#drawPlayer(graphics, state, originX, originY, tile, primary, accent, historical);
            if (state.powerRemainingMs > 0) {
                const ratio = Math.min(1, state.powerRemainingMs / 8200);
                graphics.fillStyle(historical ? 0x222222 : 0x07152d, 0.95);
                graphics.fillRoundedRect(originX, Math.max(4, originY - tile * 0.62), mazeWidth, tile * 0.34, tile * 0.12);
                graphics.fillStyle(accent, 0.95);
                graphics.fillRoundedRect(originX, Math.max(4, originY - tile * 0.62), mazeWidth * ratio, tile * 0.34, tile * 0.12);
            }
        }
        #drawPlayer(graphics, state, originX, originY, tile, primary, accent, historical) {
            if (state.invulnerableMs > 0 && Math.floor(state.invulnerableMs / 90) % 2 === 1)
                return;
            const x = originX + (state.player.column + 0.5) * tile;
            const y = originY + (state.player.row + 0.5) * tile;
            const size = tile * 0.38;
            graphics.fillStyle(primary, 1);
            graphics.fillTriangle(x, y - size, x - size, y, x + size, y);
            graphics.fillTriangle(x, y + size, x - size, y, x + size, y);
            graphics.fillStyle(historical ? 0x050505 : 0x020611, 1);
            graphics.fillCircle(x, y, size * 0.45);
            graphics.fillStyle(accent, 1);
            graphics.fillCircle(x, y, size * 0.21);
            const vector = directionVector(state.player.direction);
            graphics.lineStyle(Math.max(2, tile * 0.09), accent, 1);
            graphics.lineBetween(x, y, x + vector.x * size * 0.85, y + vector.y * size * 0.85);
        }
        #drawEnemy(graphics, enemy, index, originX, originY, tile, color, historical, elapsedMs) {
            const x = originX + (enemy.column + 0.5) * tile;
            const y = originY + (enemy.row + 0.5) * tile;
            const vulnerable = enemy.mode === 'vulnerable';
            const returning = enemy.mode === 'returning';
            const bodyColor = vulnerable ? (historical ? 0xffffff : 0x6ff4ff) : color;
            const alpha = returning ? 0.42 : 0.96;
            const size = tile * 0.31;
            graphics.fillStyle(bodyColor, alpha);
            graphics.fillRoundedRect(x - size, y - size * 0.72, size * 2, size * 1.44, size * 0.28);
            graphics.lineStyle(Math.max(1, tile * 0.055), bodyColor, alpha);
            graphics.lineBetween(x - size * 0.65, y - size * 0.72, x - size * 0.9, y - size * 1.1);
            graphics.lineBetween(x + size * 0.65, y - size * 0.72, x + size * 0.9, y - size * 1.1);
            const legOffset = Math.sin(elapsedMs / 100 + index) * tile * 0.05;
            graphics.lineBetween(x - size * 0.7, y + size * 0.55, x - size * 1.05, y + size + legOffset);
            graphics.lineBetween(x + size * 0.7, y + size * 0.55, x + size * 1.05, y + size - legOffset);
            graphics.fillStyle(historical ? 0x050505 : 0x020611, 1);
            graphics.fillCircle(x - size * 0.38, y - size * 0.08, size * 0.18);
            graphics.fillCircle(x + size * 0.38, y - size * 0.08, size * 0.18);
            if (vulnerable) {
                graphics.lineStyle(Math.max(1, tile * 0.05), historical ? 0x050505 : 0x020611, 1);
                graphics.lineBetween(x - size * 0.45, y + size * 0.35, x + size * 0.45, y + size * 0.35);
            }
        }
    }
    exports.DataMazeRuntime = DataMazeRuntime;
    function parseDifficulty(value) {
        if (value === 'aprendiz' || value === 'arquiteto')
            return value;
        return 'operador';
    }
    function directionFromAction(action) {
        if (action === 'move-up')
            return 'up';
        if (action === 'move-down')
            return 'down';
        if (action === 'move-left')
            return 'left';
        if (action === 'move-right')
            return 'right';
        return 'none';
    }
    function directionVector(direction) {
        if (direction === 'up')
            return { x: 0, y: -1 };
        if (direction === 'down')
            return { x: 0, y: 1 };
        if (direction === 'left')
            return { x: -1, y: 0 };
        if (direction === 'right')
            return { x: 1, y: 0 };
        return { x: 0, y: 0 };
    }
    
  };
  __modules["games/data-maze/simulation/data-maze-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataMazeSimulation = void 0;
    const data_maze_levels_1 = __require("games/data-maze/levels/data-maze-levels");
    const DIFFICULTIES = {
        aprendiz: { lives: 5, playerMoveMs: 145, enemyMoveMs: 205, powerMs: 8200 },
        operador: { lives: 4, playerMoveMs: 135, enemyMoveMs: 170, powerMs: 6500 },
        arquiteto: { lives: 3, playerMoveMs: 125, enemyMoveMs: 145, powerMs: 5000 },
    };
    const PERSONALITIES = ['tracker', 'predictor', 'guardian', 'wanderer'];
    const DIRECTION_ORDER = ['up', 'left', 'down', 'right'];
    const MAX_LEVEL = data_maze_levels_1.DATA_MAZE_LEVELS.length;
    class DataMazeSimulation {
        #state;
        constructor(difficulty = 'operador', seed = Date.now()) {
            this.#state = this.#initialState(difficulty, seed >>> 0);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing' };
        }
        restart(difficulty = this.#state.difficulty) {
            this.#state = this.#initialState(difficulty, nextRandom(this.#state.rngState));
        }
        setDirection(direction) {
            if (direction === 'none')
                return;
            this.#state = { ...this.#state, player: { ...this.#state.player, queuedDirection: direction } };
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 100);
            const spec = DIFFICULTIES[this.#state.difficulty];
            const events = [];
            let state = {
                ...this.#state,
                elapsedMs: this.#state.elapsedMs + safeDelta,
                levelElapsedMs: this.#state.levelElapsedMs + safeDelta,
                powerRemainingMs: Math.max(0, this.#state.powerRemainingMs - safeDelta),
                invulnerableMs: Math.max(0, this.#state.invulnerableMs - safeDelta),
                playerMoveTimerMs: this.#state.playerMoveTimerMs - safeDelta,
                enemyMoveTimerMs: this.#state.enemyMoveTimerMs - safeDelta,
            };
            if (state.powerRemainingMs <= 0 && this.#state.powerRemainingMs > 0) {
                state = { ...state, combo: 0, enemies: state.enemies.map((enemy) => enemy.mode === 'vulnerable' ? { ...enemy, mode: globalMode(state.levelElapsedMs) } : enemy) };
            }
            state = this.#resolveCollisions(state, events);
            let playerMoves = 0;
            while (state.playerMoveTimerMs <= 0 && playerMoves < 3 && state.status === 'playing') {
                state = { ...state, playerMoveTimerMs: state.playerMoveTimerMs + spec.playerMoveMs };
                state = this.#movePlayer(state, events);
                state = this.#resolveCollisions(state, events);
                playerMoves += 1;
                if (this.#allCollected(state))
                    state = this.#advanceLevel(state, events);
            }
            let enemyMoves = 0;
            while (state.enemyMoveTimerMs <= 0 && enemyMoves < 3 && state.status === 'playing') {
                const levelSpeed = Math.max(92, spec.enemyMoveMs - (state.level - 1) * 8);
                state = { ...state, enemyMoveTimerMs: state.enemyMoveTimerMs + levelSpeed };
                state = this.#moveEnemies(state);
                state = this.#resolveCollisions(state, events);
                enemyMoves += 1;
            }
            const remaining = state.pellets.length + state.powerNodes.length;
            if (!state.bonusCollected && !state.bonusVisible && remaining <= Math.floor(state.initialCollectibleCount * 0.45)) {
                state = { ...state, bonusVisible: true };
            }
            if (state.bonusVisible && !state.bonusCollected) {
                const level = data_maze_levels_1.DATA_MAZE_LEVELS[state.level - 1];
                if (state.player.column === level.bonusNode.column && state.player.row === level.bonusNode.row) {
                    state = { ...state, score: state.score + 500 * state.level, bonusVisible: false, bonusCollected: true };
                    events.push('bonus');
                }
            }
            this.#state = state;
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Labirinto de Dados incompatível');
            if (!(state.difficulty in DIFFICULTIES))
                throw new Error('Dificuldade salva inválida');
            if (!['ready', 'playing', 'victory', 'game-over'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (state.level < 1 || state.level > MAX_LEVEL || state.lives < 0)
                throw new Error('Progresso salvo inválido');
            this.#state = cloneState(state);
        }
        #movePlayer(state, events) {
            const level = data_maze_levels_1.DATA_MAZE_LEVELS[state.level - 1];
            let direction = state.player.direction;
            if (canMove(level, state.player, state.player.queuedDirection))
                direction = state.player.queuedDirection;
            if (!canMove(level, state.player, direction))
                direction = 'none';
            const next = nextPoint(level, state.player, direction);
            let nextState = { ...state, player: { ...next, direction, queuedDirection: state.player.queuedDirection } };
            const key = (0, data_maze_levels_1.pointKey)(next.column, next.row);
            if (nextState.pellets.includes(key)) {
                nextState = { ...nextState, pellets: nextState.pellets.filter((item) => item !== key), score: nextState.score + 10 };
                events.push('pellet');
            }
            if (nextState.powerNodes.includes(key)) {
                nextState = {
                    ...nextState,
                    powerNodes: nextState.powerNodes.filter((item) => item !== key),
                    score: nextState.score + 50,
                    powerRemainingMs: DIFFICULTIES[nextState.difficulty].powerMs,
                    combo: 0,
                    enemies: nextState.enemies.map((enemy) => enemy.mode === 'returning' ? enemy : { ...enemy, mode: 'vulnerable' }),
                };
                events.push('power-node');
            }
            return nextState;
        }
        #moveEnemies(state) {
            const level = data_maze_levels_1.DATA_MAZE_LEVELS[state.level - 1];
            let rngState = state.rngState;
            const mode = globalMode(state.levelElapsedMs);
            const enemies = state.enemies.map((enemy) => {
                if (enemy.mode === 'returning' && enemy.column === enemy.home.column && enemy.row === enemy.home.row) {
                    enemy = { ...enemy, mode: state.powerRemainingMs > 0 ? 'vulnerable' : mode };
                }
                else if (enemy.mode !== 'returning') {
                    enemy = { ...enemy, mode: state.powerRemainingMs > 0 ? 'vulnerable' : mode };
                }
                const candidates = availableDirections(level, enemy);
                if (candidates.length === 0)
                    return { ...enemy, direction: 'none' };
                const reverse = opposite(enemy.direction);
                const forwardCandidates = candidates.filter((direction) => direction !== reverse);
                const choices = forwardCandidates.length > 0 ? forwardCandidates : candidates;
                let direction;
                if (enemy.personality === 'wanderer' && enemy.mode !== 'returning') {
                    rngState = nextRandom(rngState);
                    direction = choices[rngState % choices.length];
                }
                else {
                    const target = targetForEnemy(enemy, state.player, level, enemy.mode);
                    const scored = choices.map((candidate) => {
                        const point = nextPoint(level, enemy, candidate);
                        const distance = pathDistance(level, point, target);
                        return { candidate, distance: enemy.mode === 'vulnerable' ? -distance : distance };
                    });
                    scored.sort((a, b) => a.distance - b.distance || DIRECTION_ORDER.indexOf(a.candidate) - DIRECTION_ORDER.indexOf(b.candidate));
                    direction = scored[0].candidate;
                }
                const next = nextPoint(level, enemy, direction);
                return { ...enemy, ...next, direction };
            });
            return { ...state, enemies, rngState };
        }
        #resolveCollisions(state, events) {
            let nextState = state;
            for (const enemy of nextState.enemies) {
                if (enemy.column !== nextState.player.column || enemy.row !== nextState.player.row)
                    continue;
                if (enemy.mode === 'vulnerable') {
                    const gain = 200 * (2 ** Math.min(nextState.combo, 3));
                    nextState = {
                        ...nextState,
                        score: nextState.score + gain,
                        combo: nextState.combo + 1,
                        enemies: nextState.enemies.map((item) => item.id === enemy.id ? { ...item, column: item.home.column, row: item.home.row, direction: 'none', mode: 'returning' } : item),
                    };
                    events.push('drone-captured');
                    continue;
                }
                if (enemy.mode === 'returning' || nextState.invulnerableMs > 0)
                    continue;
                const lives = nextState.lives - 1;
                if (lives <= 0) {
                    events.push('player-hit', 'game-over');
                    return { ...nextState, lives: 0, status: 'game-over' };
                }
                events.push('player-hit');
                return resetActors({ ...nextState, lives, powerRemainingMs: 0, combo: 0, invulnerableMs: 1400 });
            }
            return nextState;
        }
        #allCollected(state) {
            return state.pellets.length === 0 && state.powerNodes.length === 0;
        }
        #advanceLevel(state, events) {
            if (state.level >= MAX_LEVEL) {
                events.push('victory');
                return { ...state, status: 'victory', score: state.score + state.lives * 1000 };
            }
            const level = state.level + 1;
            const next = createLevelState(level, state.difficulty, state.rngState, state.score + 750, state.lives);
            events.push('level-complete');
            return { ...next, status: 'playing', elapsedMs: state.elapsedMs };
        }
        #initialState(difficulty, seed) {
            return createLevelState(1, difficulty, seed || 0x6d2b79f5, 0, DIFFICULTIES[difficulty].lives);
        }
    }
    exports.DataMazeSimulation = DataMazeSimulation;
    function createLevelState(levelNumber, difficulty, seed, score, lives) {
        const level = data_maze_levels_1.DATA_MAZE_LEVELS[levelNumber - 1];
        const collectibles = (0, data_maze_levels_1.createCollectibles)(level);
        const enemies = level.enemyStarts.map((start, index) => ({
            id: index + 1,
            column: start.column,
            row: start.row,
            direction: 'none',
            personality: PERSONALITIES[index],
            mode: 'patrol',
            home: { ...start },
        }));
        return {
            schemaVersion: 1,
            difficulty,
            status: 'ready',
            level: levelNumber,
            score,
            lives,
            elapsedMs: 0,
            levelElapsedMs: 0,
            player: { ...level.playerStart, direction: 'none', queuedDirection: 'left' },
            enemies,
            pellets: [...collectibles.pellets],
            powerNodes: [...collectibles.powerNodes],
            powerRemainingMs: 0,
            invulnerableMs: 1200,
            combo: 0,
            playerMoveTimerMs: 0,
            enemyMoveTimerMs: 350,
            bonusVisible: false,
            bonusCollected: false,
            initialCollectibleCount: collectibles.pellets.length + collectibles.powerNodes.length,
            rngState: seed,
        };
    }
    function resetActors(state) {
        const level = data_maze_levels_1.DATA_MAZE_LEVELS[state.level - 1];
        return {
            ...state,
            player: { ...level.playerStart, direction: 'none', queuedDirection: 'left' },
            enemies: level.enemyStarts.map((start, index) => ({
                id: index + 1,
                column: start.column,
                row: start.row,
                direction: 'none',
                personality: PERSONALITIES[index],
                mode: 'patrol',
                home: { ...start },
            })),
            playerMoveTimerMs: 280,
            enemyMoveTimerMs: 650,
        };
    }
    function globalMode(levelElapsedMs) {
        const cycle = levelElapsedMs % 27000;
        return cycle < 7000 ? 'patrol' : 'chase';
    }
    function targetForEnemy(enemy, player, level, mode) {
        if (mode === 'returning')
            return enemy.home;
        if (mode === 'patrol') {
            const corners = {
                tracker: { column: data_maze_levels_1.MAZE_COLUMNS - 2, row: 1 },
                predictor: { column: 1, row: 1 },
                guardian: { column: data_maze_levels_1.MAZE_COLUMNS - 2, row: data_maze_levels_1.MAZE_ROWS - 2 },
                wanderer: { column: 1, row: data_maze_levels_1.MAZE_ROWS - 2 },
            };
            return nearestWalkable(level, corners[enemy.personality]);
        }
        if (enemy.personality === 'predictor') {
            let target = { column: player.column, row: player.row };
            for (let index = 0; index < 4; index += 1)
                target = nextPoint(level, target, player.direction);
            return nearestWalkable(level, target);
        }
        if (enemy.personality === 'guardian') {
            const distance = Math.abs(enemy.column - player.column) + Math.abs(enemy.row - player.row);
            return distance < 6 ? nearestWalkable(level, { column: 1, row: data_maze_levels_1.MAZE_ROWS - 2 }) : { column: player.column, row: player.row };
        }
        return { column: player.column, row: player.row };
    }
    function nearestWalkable(level, point) {
        if ((0, data_maze_levels_1.tileAt)(level, point.column, point.row) !== '#')
            return point;
        for (let radius = 1; radius < Math.max(data_maze_levels_1.MAZE_COLUMNS, data_maze_levels_1.MAZE_ROWS); radius += 1) {
            for (let row = Math.max(0, point.row - radius); row <= Math.min(data_maze_levels_1.MAZE_ROWS - 1, point.row + radius); row += 1) {
                for (let column = Math.max(0, point.column - radius); column <= Math.min(data_maze_levels_1.MAZE_COLUMNS - 1, point.column + radius); column += 1) {
                    if ((0, data_maze_levels_1.tileAt)(level, column, row) !== '#')
                        return { column, row };
                }
            }
        }
        return level.playerStart;
    }
    function pathDistance(level, start, target) {
        const queue = [{ point: start, distance: 0 }];
        const visited = new Set([(0, data_maze_levels_1.pointKey)(start.column, start.row)]);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.point.column === target.column && current.point.row === target.row)
                return current.distance;
            for (const direction of DIRECTION_ORDER) {
                const next = nextPoint(level, current.point, direction);
                const key = (0, data_maze_levels_1.pointKey)(next.column, next.row);
                if (visited.has(key) || (0, data_maze_levels_1.tileAt)(level, next.column, next.row) === '#')
                    continue;
                visited.add(key);
                queue.push({ point: next, distance: current.distance + 1 });
            }
        }
        return 999;
    }
    function availableDirections(level, actor) {
        return DIRECTION_ORDER.filter((direction) => canMove(level, actor, direction));
    }
    function canMove(level, actor, direction) {
        if (direction === 'none')
            return false;
        const next = nextPoint(level, actor, direction);
        return (0, data_maze_levels_1.tileAt)(level, next.column, next.row) !== '#';
    }
    function nextPoint(level, actor, direction) {
        let column = actor.column;
        let row = actor.row;
        if (direction === 'up')
            row -= 1;
        if (direction === 'down')
            row += 1;
        if (direction === 'left')
            column -= 1;
        if (direction === 'right')
            column += 1;
        if (row === level.tunnelRow && column < 0)
            column = data_maze_levels_1.MAZE_COLUMNS - 1;
        if (row === level.tunnelRow && column >= data_maze_levels_1.MAZE_COLUMNS)
            column = 0;
        return { column, row };
    }
    function opposite(direction) {
        if (direction === 'up')
            return 'down';
        if (direction === 'down')
            return 'up';
        if (direction === 'left')
            return 'right';
        if (direction === 'right')
            return 'left';
        return 'none';
    }
    function nextRandom(state) {
        let value = state || 0x6d2b79f5;
        value ^= value << 13;
        value ^= value >>> 17;
        value ^= value << 5;
        return value >>> 0;
    }
    function cloneState(state) {
        return {
            ...state,
            player: { ...state.player },
            enemies: state.enemies.map((enemy) => ({ ...enemy, home: { ...enemy.home } })),
            pellets: [...state.pellets],
            powerNodes: [...state.powerNodes],
        };
    }
    
  };
  __modules["games/orbital-sentinel/audio/orbital-sentinel-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrbitalSentinelAudio = void 0;
    class OrbitalSentinelAudio {
        muted;
        #context;
        constructor(muted) {
            this.muted = muted;
        }
        unlock() {
            if (this.muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const frequencies = {
                'player-fire': 520,
                'enemy-fire': 150,
                'enemy-hit': 240,
                'barrier-hit': 105,
                'player-hit': 72,
                'wave-cleared': 680,
                victory: 920,
                'game-over': 58,
            };
            oscillator.type = event === 'player-fire' ? 'square' : event === 'victory' ? 'triangle' : 'sawtooth';
            oscillator.frequency.setValueAtTime(frequencies[event] ?? 180, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, (frequencies[event] ?? 180) * 0.58), context.currentTime + 0.09);
            gain.gain.setValueAtTime(0.035, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.11);
        }
        dispose() {
            if (this.#context)
                void this.#context.close();
            this.#context = undefined;
        }
    }
    exports.OrbitalSentinelAudio = OrbitalSentinelAudio;
    
  };
  __modules["games/orbital-sentinel/content/orbital-sentinel-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ORBITAL_SENTINEL_COMPARISON = exports.ORBITAL_SENTINEL_PSEUDOCODE = exports.ORBITAL_SENTINEL_HISTORY = void 0;
    exports.ORBITAL_SENTINEL_HISTORY = {
        title: 'Quando inimigos passaram a responder ao jogador',
        paragraphs: [
            'Em 1978, Space Invaders consolidou o tiro em formação: o jogador se movia horizontalmente, protegia-se atrás de barreiras destrutíveis e enfrentava inimigos que aceleravam à medida que o grupo diminuía.',
            'O projeto de Tomohiro Nishikado usou processador Intel 8080, framebuffer raster e programação em linguagem de montagem. A limitação do hardware acabou produzindo uma característica histórica: menos inimigos na tela significavam atualizações mais rápidas.',
            'Sentinela Orbital é uma reconstrução educacional autoral. Formação, símbolos, áudio, interface, código, ondas e identidade visual pertencem ao Fliperama DS; nenhum ROM, sprite, mapa ou código comercial é incluído.',
        ],
        sourceUrl: 'https://www.wired.com/story/space-invaders-45-years-tomohiro-nishikado/',
    };
    exports.ORBITAL_SENTINEL_PSEUDOCODE = `A CADA PASSO DA SIMULAÇÃO:
      mover a sentinela conforme a entrada
      avançar a formação na direção atual
      ao tocar a borda, inverter e descer a formação
      acelerar conforme restarem menos inimigos
    
    AO DISPARAR:
      criar um projétil se não houver outro ativo
      testar colisão com inimigos e barreiras
    
    QUANDO UM INIMIGO DISPARAR:
      escolher o defensor mais baixo de uma coluna
      testar barreiras e a posição do jogador
    
    SE A FORMAÇÃO TERMINAR:
      iniciar a próxima onda
      após a quarta onda, concluir a missão`;
    exports.ORBITAL_SENTINEL_COMPARISON = [
        ['Estrutura', 'Formação fixa que desce e acelera', 'Formação autoral em quatro ondas determinísticas'],
        ['Defesa', 'Escudos pixelados e destrutíveis', 'Células de barreira com dois níveis de integridade'],
        ['Tecnologia', 'Intel 8080, framebuffer raster e assembly', 'TypeScript determinístico com renderização Phaser isolada'],
        ['Controle', 'Gabinete arcade com movimento e disparo', 'Teclado, toque, pausa automática e tela cheia móvel'],
        ['Visual', 'CRT monocromático com sobreposições de cor', 'Modo Histórico monocromático e modos DS escaláveis'],
        ['Preservação', 'Programa e gabinete comercial de 1978', 'Reconstrução educacional sem ROM, assets, nomes ou código original'],
    ];
    
  };
  __modules["games/orbital-sentinel/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const orbital_sentinel_runtime_1 = __require("games/orbital-sentinel/phaser/orbital-sentinel-runtime");
    function createRuntime() {
        return new orbital_sentinel_runtime_1.OrbitalSentinelRuntime();
    }
    
  };
  __modules["games/orbital-sentinel/phaser/orbital-sentinel-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrbitalSentinelRuntime = void 0;
    const orbital_sentinel_audio_1 = __require("games/orbital-sentinel/audio/orbital-sentinel-audio");
    const orbital_sentinel_simulation_1 = __require("games/orbital-sentinel/simulation/orbital-sentinel-simulation");
    class OrbitalSentinelRuntime {
        id = 'orbital-sentinel';
        state = 'not-loaded';
        #simulation = new orbital_sentinel_simulation_1.OrbitalSentinelSimulation();
        #game;
        #graphics;
        #audio;
        #context;
        #left = false;
        #right = false;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new orbital_sentinel_simulation_1.OrbitalSentinelSimulation(parseDifficulty(context.parameters?.difficulty), Date.now());
            this.#audio = new orbital_sentinel_audio_1.OrbitalSentinelAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class OrbitalSentinelScene extends Phaser.Scene {
                #view;
                constructor() { super('orbital-sentinel'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 620,
                backgroundColor: '#02060d',
                transparent: false,
                scene: OrbitalSentinelScene,
                render: { antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo', pixelArt: context.graphicsMode === 'historico' },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'victory' || current.status === 'game-over')
                this.#simulation.restart(current.difficulty);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve' });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#clearMovement();
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-left')
                this.#left = input.active;
            if (input.action === 'move-right')
                this.#right = input.active;
            this.#simulation.setMoveDirection(this.#left === this.#right ? 0 : this.#left ? -1 : 1);
            if (input.action === 'primary-action' && input.active)
                this.#processEvents(this.#simulation.fire());
            this.#redraw();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'victory' || status === 'game-over' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#clearMovement();
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #clearMovement() {
            this.#left = false;
            this.#right = false;
            this.#simulation.setMoveDirection(0);
        }
        #processEvents(events) {
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            if (events.some((event) => ['enemy-hit', 'barrier-hit', 'player-hit', 'wave-cleared'].includes(event))) {
                const progressEvent = events.includes('wave-cleared')
                    ? 'wave-cleared'
                    : events.includes('player-hit')
                        ? 'player-hit'
                        : events.includes('barrier-hit')
                            ? 'barrier-hit'
                            : 'enemy-hit';
                this.#context?.onEvent?.({
                    type: 'progress',
                    detail: {
                        score: current.score,
                        lives: current.lives,
                        wave: current.wave,
                        remaining: current.enemies.filter((enemy) => enemy.alive).length,
                        event: progressEvent,
                    },
                });
            }
            if (events.includes('victory') || events.includes('game-over')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: events.includes('victory') ? 'player' : 'formation',
                        score: current.score,
                        lives: current.lives,
                        wave: current.wave,
                    },
                });
            }
        }
        #redraw() {
            const graphics = this.#graphics;
            const scale = this.#game?.scale;
            if (graphics && scale)
                this.#draw(graphics, scale.width, scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const mode = this.#context?.graphicsMode ?? 'medio';
            const historical = mode === 'historico';
            const primary = historical ? 0xf3f3f3 : 0x49e7ff;
            const enemyColors = historical ? [0xd0d0d0, 0xe0e0e0, 0xf3f3f3] : [0x4ee0a8, 0x9273ff, 0xff7ac8];
            const minSize = Math.min(width, height);
            graphics.clear();
            graphics.fillStyle(historical ? 0x030303 : 0x02060d, 1);
            graphics.fillRect(0, 0, width, height);
            if (!historical && mode !== 'baixo') {
                graphics.lineStyle(1, primary, 0.065);
                const grid = Math.max(32, Math.floor(minSize / 12));
                for (let x = 0; x <= width; x += grid)
                    graphics.lineBetween(x, 0, x, height);
                for (let y = 0; y <= height; y += grid)
                    graphics.lineBetween(0, y, width, y);
                if (mode === 'alto' || mode === 'ultra') {
                    graphics.fillStyle(0x9273ff, 0.045);
                    graphics.fillCircle(width * 0.5, height * 0.38, minSize * 0.31);
                }
            }
            state.enemies.filter((enemy) => enemy.alive).forEach((enemy) => this.#drawEnemy(graphics, enemy, width, height, enemyColors[enemy.kind - 1]));
            state.barriers.filter((cell) => cell.health > 0).forEach((cell) => {
                graphics.fillStyle(historical ? (cell.health === 2 ? 0xe4e4e4 : 0x898989) : (cell.health === 2 ? 0x4ee0a8 : 0x237e66), 0.95);
                graphics.fillRect((cell.x - cell.width / 2) * width, (cell.y - cell.height / 2) * height, Math.max(2, cell.width * width), Math.max(2, cell.height * height));
            });
            state.shots.forEach((shot) => {
                const color = shot.owner === 'player' ? primary : historical ? 0xaaaaaa : 0xff5d7a;
                graphics.lineStyle(Math.max(2, minSize * 0.004), color, 1);
                graphics.lineBetween(shot.x * width, shot.y * height - minSize * 0.013, shot.x * width, shot.y * height + minSize * 0.013);
            });
            if (state.invulnerableMs <= 0 || Math.floor(state.invulnerableMs / 90) % 2 === 0) {
                const x = state.playerX * width;
                const y = 0.91 * height;
                graphics.fillStyle(primary, 1);
                graphics.fillTriangle(x, y - minSize * 0.035, x - minSize * 0.047, y + minSize * 0.027, x + minSize * 0.047, y + minSize * 0.027);
                graphics.fillStyle(historical ? 0x030303 : 0x02060d, 1);
                graphics.fillTriangle(x, y - minSize * 0.018, x - minSize * 0.022, y + minSize * 0.015, x + minSize * 0.022, y + minSize * 0.015);
            }
            graphics.lineStyle(Math.max(1, minSize * 0.002), primary, historical ? 0.6 : 0.18);
            graphics.lineBetween(0, height * 0.96, width, height * 0.96);
        }
        #drawEnemy(graphics, enemy, width, height, color) {
            const size = Math.min(width, height) * 0.024;
            const x = enemy.x * width;
            const y = enemy.y * height;
            graphics.fillStyle(color, 0.95);
            if (enemy.kind === 3) {
                graphics.fillCircle(x, y, size);
                graphics.fillRect(x - size * 1.25, y, size * 2.5, size * 0.6);
            }
            else if (enemy.kind === 2) {
                graphics.fillTriangle(x, y - size, x - size * 1.2, y + size * 0.75, x + size * 1.2, y + size * 0.75);
                graphics.fillCircle(x, y + size * 0.12, size * 0.34);
            }
            else {
                graphics.fillRoundedRect(x - size * 1.15, y - size * 0.72, size * 2.3, size * 1.44, size * 0.25);
                graphics.fillStyle(0x02060d, 0.88);
                graphics.fillCircle(x - size * 0.42, y - size * 0.08, size * 0.18);
                graphics.fillCircle(x + size * 0.42, y - size * 0.08, size * 0.18);
            }
        }
    }
    exports.OrbitalSentinelRuntime = OrbitalSentinelRuntime;
    function parseDifficulty(value) {
        if (value === 'cadete' || value === 'elite')
            return value;
        return 'defensor';
    }
    
  };
  __modules["games/orbital-sentinel/simulation/orbital-sentinel-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrbitalSentinelSimulation = void 0;
    const DIFFICULTIES = {
        cadete: { lives: 4, formationSpeed: 0.043, enemyFireMs: 1180, enemyShotSpeed: 0.31 },
        defensor: { lives: 3, formationSpeed: 0.058, enemyFireMs: 880, enemyShotSpeed: 0.38 },
        elite: { lives: 2, formationSpeed: 0.076, enemyFireMs: 650, enemyShotSpeed: 0.46 },
    };
    const PLAYER_Y = 0.91;
    const PLAYER_SPEED = 0.68;
    const PLAYER_SHOT_SPEED = -0.83;
    const PLAYER_FIRE_COOLDOWN_MS = 320;
    const MAX_WAVE = 4;
    class OrbitalSentinelSimulation {
        #state;
        #moveDirection = 0;
        constructor(difficulty = 'defensor', seed = Date.now()) {
            this.#state = this.#initialState(difficulty, seed >>> 0);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing' };
        }
        restart(difficulty = this.#state.difficulty) {
            this.#moveDirection = 0;
            this.#state = this.#initialState(difficulty, nextRandom(this.#state.rngState));
        }
        setMoveDirection(direction) {
            this.#moveDirection = direction;
        }
        fire() {
            if (this.#state.status !== 'playing' || this.#state.playerFireCooldownMs > 0)
                return [];
            if (this.#state.shots.some((shot) => shot.owner === 'player'))
                return [];
            this.#state = {
                ...this.#state,
                playerFireCooldownMs: PLAYER_FIRE_COOLDOWN_MS,
                shots: [...this.#state.shots, { id: this.#state.nextEntityId, owner: 'player', x: this.#state.playerX, y: PLAYER_Y - 0.04, vy: PLAYER_SHOT_SPEED }],
                nextEntityId: this.#state.nextEntityId + 1,
            };
            return ['player-fire'];
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 34);
            const dt = safeDelta / 1000;
            const spec = DIFFICULTIES[this.#state.difficulty];
            const events = [];
            let playerX = clamp(this.#state.playerX + this.#moveDirection * PLAYER_SPEED * dt, 0.055, 0.945);
            let enemies = this.#state.enemies.map((enemy) => ({ ...enemy }));
            let barriers = this.#state.barriers.map((cell) => ({ ...cell }));
            let shots = this.#state.shots.map((shot) => ({ ...shot, y: shot.y + shot.vy * dt }));
            let direction = this.#state.formationDirection;
            let enemyFireTimerMs = this.#state.enemyFireTimerMs - safeDelta;
            let playerFireCooldownMs = Math.max(0, this.#state.playerFireCooldownMs - safeDelta);
            let invulnerableMs = Math.max(0, this.#state.invulnerableMs - safeDelta);
            let score = this.#state.score;
            let lives = this.#state.lives;
            let wave = this.#state.wave;
            let rngState = this.#state.rngState;
            let nextEntityId = this.#state.nextEntityId;
            let status = this.#state.status;
            const aliveBefore = enemies.filter((enemy) => enemy.alive);
            if (aliveBefore.length > 0) {
                const acceleration = 1 + (1 - aliveBefore.length / enemies.length) * 2.35 + (wave - 1) * 0.16;
                const shift = direction * spec.formationSpeed * acceleration * dt;
                const minX = Math.min(...aliveBefore.map((enemy) => enemy.x));
                const maxX = Math.max(...aliveBefore.map((enemy) => enemy.x));
                if (minX + shift < 0.055 || maxX + shift > 0.945) {
                    direction = direction === 1 ? -1 : 1;
                    enemies = enemies.map((enemy) => enemy.alive ? { ...enemy, y: enemy.y + 0.034 } : enemy);
                }
                else {
                    enemies = enemies.map((enemy) => enemy.alive ? { ...enemy, x: enemy.x + shift } : enemy);
                }
            }
            if (enemyFireTimerMs <= 0) {
                const shooters = lowestEnemies(enemies);
                if (shooters.length > 0) {
                    rngState = nextRandom(rngState);
                    const shooter = shooters[rngState % shooters.length];
                    shots.push({ id: nextEntityId++, owner: 'enemy', x: shooter.x, y: shooter.y + 0.026, vy: spec.enemyShotSpeed + wave * 0.018 });
                    events.push('enemy-fire');
                }
                rngState = nextRandom(rngState);
                enemyFireTimerMs = spec.enemyFireMs * (0.78 + (rngState % 45) / 100);
            }
            const removedShots = new Set();
            for (const shot of shots) {
                if (shot.owner === 'player') {
                    const target = enemies.find((enemy) => enemy.alive && Math.abs(enemy.x - shot.x) <= 0.032 && Math.abs(enemy.y - shot.y) <= 0.025);
                    if (target) {
                        enemies = enemies.map((enemy) => enemy.id === target.id ? { ...enemy, alive: false } : enemy);
                        removedShots.add(shot.id);
                        score += target.kind === 3 ? 30 : target.kind === 2 ? 20 : 10;
                        events.push('enemy-hit');
                    }
                }
            }
            for (const shot of shots) {
                if (removedShots.has(shot.id))
                    continue;
                const cell = barriers.find((candidate) => candidate.health > 0 && pointInside(shot.x, shot.y, candidate));
                if (!cell)
                    continue;
                barriers = barriers.map((candidate) => candidate.id === cell.id ? { ...candidate, health: Math.max(0, candidate.health - 1) } : candidate);
                removedShots.add(shot.id);
                events.push('barrier-hit');
            }
            for (const shot of shots) {
                if (removedShots.has(shot.id) || shot.owner !== 'enemy' || invulnerableMs > 0)
                    continue;
                if (Math.abs(shot.x - playerX) <= 0.042 && Math.abs(shot.y - PLAYER_Y) <= 0.035) {
                    removedShots.add(shot.id);
                    lives -= 1;
                    invulnerableMs = 1350;
                    events.push('player-hit');
                    if (lives <= 0) {
                        lives = 0;
                        status = 'game-over';
                        events.push('game-over');
                    }
                }
            }
            shots = shots.filter((shot) => !removedShots.has(shot.id) && shot.y > -0.08 && shot.y < 1.08);
            if (status === 'playing' && enemies.some((enemy) => enemy.alive && enemy.y >= 0.84)) {
                lives = 0;
                status = 'game-over';
                events.push('game-over');
            }
            if (status === 'playing' && enemies.every((enemy) => !enemy.alive)) {
                if (wave >= MAX_WAVE) {
                    status = 'victory';
                    events.push('victory');
                }
                else {
                    wave += 1;
                    enemies = createEnemies(nextEntityId, wave);
                    nextEntityId += enemies.length;
                    shots = [];
                    direction = wave % 2 === 0 ? -1 : 1;
                    enemyFireTimerMs = spec.enemyFireMs;
                    barriers = barriers.map((cell) => ({ ...cell, health: Math.max(cell.health, 1) }));
                    events.push('wave-cleared');
                }
            }
            this.#state = {
                ...this.#state,
                playerX,
                enemies,
                shots,
                barriers,
                formationDirection: direction,
                enemyFireTimerMs,
                playerFireCooldownMs,
                invulnerableMs,
                score,
                lives,
                wave,
                elapsedMs: this.#state.elapsedMs + safeDelta,
                rngState,
                nextEntityId,
                status,
            };
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Sentinela Orbital incompatível');
            if (!(state.difficulty in DIFFICULTIES))
                throw new Error('Dificuldade salva inválida');
            if (!['ready', 'playing', 'victory', 'game-over'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (state.lives < 0 || state.wave < 1 || state.wave > MAX_WAVE)
                throw new Error('Progresso salvo inválido');
            this.#moveDirection = 0;
            this.#state = cloneState(state);
        }
        #initialState(difficulty, seed) {
            const enemies = createEnemies(1, 1);
            const barriers = createBarriers(enemies.length + 1);
            return {
                schemaVersion: 1,
                difficulty,
                status: 'ready',
                playerX: 0.5,
                enemies,
                shots: [],
                barriers,
                formationDirection: 1,
                enemyFireTimerMs: DIFFICULTIES[difficulty].enemyFireMs,
                playerFireCooldownMs: 0,
                invulnerableMs: 0,
                score: 0,
                lives: DIFFICULTIES[difficulty].lives,
                wave: 1,
                elapsedMs: 0,
                rngState: seed || 0x6d2b79f5,
                nextEntityId: enemies.length + barriers.length + 1,
            };
        }
    }
    exports.OrbitalSentinelSimulation = OrbitalSentinelSimulation;
    function createEnemies(firstId, wave) {
        const enemies = [];
        const rows = 5;
        const columns = 9;
        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                enemies.push({
                    id: firstId + enemies.length,
                    row,
                    column,
                    x: 0.18 + column * 0.08,
                    y: 0.115 + row * 0.067 + (wave - 1) * 0.006,
                    kind: row === 0 ? 3 : row < 3 ? 2 : 1,
                    alive: true,
                });
            }
        }
        return enemies;
    }
    function createBarriers(firstId) {
        const cells = [];
        const centers = [0.2, 0.4, 0.6, 0.8];
        for (const center of centers) {
            for (let row = 0; row < 3; row += 1) {
                for (let column = 0; column < 7; column += 1) {
                    if (row === 2 && column >= 2 && column <= 4)
                        continue;
                    cells.push({
                        id: firstId + cells.length,
                        x: center - 0.045 + column * 0.015,
                        y: 0.735 + row * 0.014,
                        width: 0.014,
                        height: 0.013,
                        health: 2,
                    });
                }
            }
        }
        return cells;
    }
    function lowestEnemies(enemies) {
        const lowestByColumn = new Map();
        enemies.filter((enemy) => enemy.alive).forEach((enemy) => {
            const current = lowestByColumn.get(enemy.column);
            if (!current || enemy.row > current.row)
                lowestByColumn.set(enemy.column, enemy);
        });
        return [...lowestByColumn.values()];
    }
    function pointInside(x, y, cell) {
        return Math.abs(x - cell.x) <= cell.width / 2 && Math.abs(y - cell.y) <= cell.height / 2;
    }
    function cloneState(state) {
        return {
            ...state,
            enemies: state.enemies.map((enemy) => ({ ...enemy })),
            shots: state.shots.map((shot) => ({ ...shot })),
            barriers: state.barriers.map((cell) => ({ ...cell })),
        };
    }
    function nextRandom(state) {
        return (Math.imul(state, 1664525) + 1013904223) >>> 0;
    }
    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
    
  };
  __modules["games/polygon-sector-94/audio/polygon-sector-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PolygonSectorAudio = void 0;
    class PolygonSectorAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const tones = {
                'core-collected': [720, 0.16, 'triangle'],
                checkpoint: [520, 0.2, 'sine'],
                'camera-changed': [310, 0.08, 'square'],
                'material-changed': [420, 0.1, 'sawtooth'],
                jump: [260, 0.08, 'triangle'],
                damage: [95, 0.22, 'sawtooth'],
                'life-lost': [72, 0.3, 'square'],
                'gate-unlocked': [880, 0.35, 'sine'],
                finished: [1040, 0.5, 'triangle'],
            };
            const [frequency, duration, type] = tones[event];
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.72), context.currentTime + duration);
            gain.gain.setValueAtTime(0.0001, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.085, context.currentTime + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration + 0.02);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.PolygonSectorAudio = PolygonSectorAudio;
    
  };
  __modules["games/polygon-sector-94/content/polygon-sector-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.POLYGON_SECTOR_COMPARISON = exports.POLYGON_SECTOR_PSEUDOCODE = exports.POLYGON_SECTOR_HISTORY = void 0;
    exports.POLYGON_SECTOR_HISTORY = {
        title: 'Da projeção 2.5D aos mundos construídos por polígonos',
        paragraphs: [
            'Na primeira metade da década de 1990, consoles, computadores e arcades passaram a dedicar mais processamento à transformação de vértices, projeção de triângulos, câmeras e superfícies texturizadas. O cenário deixou de ser apenas uma imagem simulando profundidade e passou a existir como geometria navegável.',
            'Setor Poligonal 94 é um laboratório autoral do Fliperama DS. A arena, o explorador, os núcleos, os obstáculos, os shaders, a física e o código foram criados para explicar a passagem ao 3D em tempo real sem reutilizar mapas, personagens ou recursos comerciais.',
            'A experiência permite alternar câmera fixa, primeira pessoa e terceira pessoa, além de comparar cor plana, textura procedural e iluminação especular didática. O objetivo é mostrar que a mesma simulação pode receber diferentes câmeras e materiais sem alterar suas regras.',
        ],
        sourceUrl: 'https://www.playstation.com/en-us/playstation-history/1994-ps-one/',
    };
    exports.POLYGON_SECTOR_PSEUDOCODE = `INICIAR arena poligonal
      carregar caixas, rampas, núcleos e checkpoints
      manter estado do jogador fora do renderizador
    
    A CADA QUADRO
      ler ações de movimento e rotação
      aplicar gravidade, salto e altura das rampas
      resolver colisões contra limites e volumes
      coletar núcleos próximos
      registrar checkpoints
      verificar pulsos de risco e portal final
    
    RENDERIZAR
      escolher câmera fixa, primeira ou terceira pessoa
      projetar vértices com matrizes modelo, visão e projeção
      aplicar material flat, procedural ou PBR didático
      desenhar a mesma simulação com a apresentação escolhida
    
    SALVAR
      posição, câmera, material, núcleos, vidas, tempo e pontuação`;
    exports.POLYGON_SECTOR_COMPARISON = [
        ['Geometria', 'Cenários construídos com poucos polígonos e forte limitação de memória', 'Arena autoral com volumes simples, rampas e métricas visíveis'],
        ['Câmera', 'Câmeras frequentemente vinculadas ao gênero e às limitações do hardware', 'Troca imediata entre fixa, primeira e terceira pessoa'],
        ['Materiais', 'Cor por vértice, texturas pequenas e filtragem limitada', 'Flat, textura procedural e iluminação especular comparáveis'],
        ['Física', 'Colisores simplificados e respostas aproximadas', 'Simulação serializável com limites, volumes, salto, gravidade e rampas'],
        ['Renderização', 'Pipeline gráfico especializado do console ou computador', 'WebGL local com shaders próprios e degradação por qualidade'],
        ['Identidade', 'Referências comerciais da transição ao 3D', 'Mapa, missão, arte, áudio, shaders e código próprios do Fliperama DS'],
    ];
    
  };
  __modules["games/polygon-sector-94/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const polygon_sector_runtime_1 = __require("games/polygon-sector-94/webgl/polygon-sector-runtime");
    function createRuntime() {
        return new polygon_sector_runtime_1.PolygonSectorRuntime();
    }
    
  };
  __modules["games/polygon-sector-94/simulation/polygon-sector-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PolygonSectorSimulation = exports.POLYGON_EXIT = exports.POLYGON_HAZARDS = exports.POLYGON_CHECKPOINTS = exports.POLYGON_CORES = exports.ARENA_RAMPS = exports.ARENA_BOXES = exports.POLYGON_CORES_REQUIRED = exports.ARENA_BOUNDS = void 0;
    exports.groundHeightAt = groundHeightAt;
    exports.collides = collides;
    exports.distance2 = distance2;
    exports.distance3 = distance3;
    exports.ARENA_BOUNDS = { minX: -10, maxX: 10, minZ: -8, maxZ: 8 };
    exports.POLYGON_CORES_REQUIRED = 3;
    exports.ARENA_BOXES = [
        { id: 'north-wall', x: 0, z: -7.65, width: 20, depth: 0.7, height: 2.2, kind: 'wall' },
        { id: 'south-wall-left', x: -5.8, z: 7.65, width: 8.4, depth: 0.7, height: 2.2, kind: 'wall' },
        { id: 'south-wall-right', x: 5.8, z: 7.65, width: 8.4, depth: 0.7, height: 2.2, kind: 'wall' },
        { id: 'west-wall', x: -9.65, z: 0, width: 0.7, depth: 16, height: 2.2, kind: 'wall' },
        { id: 'east-wall', x: 9.65, z: 0, width: 0.7, depth: 16, height: 2.2, kind: 'wall' },
        { id: 'center-block', x: 0, z: 0, width: 3.2, depth: 2.4, height: 2.7, kind: 'platform' },
        { id: 'pillar-nw', x: -5.8, z: -3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'pillar-ne', x: 5.8, z: -3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'pillar-sw', x: -5.8, z: 3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'pillar-se', x: 5.8, z: 3.7, width: 1.4, depth: 1.4, height: 3.6, kind: 'pillar' },
        { id: 'bridge-west', x: -3.8, z: 0.3, width: 2.5, depth: 1.2, height: 1.1, kind: 'platform' },
        { id: 'bridge-east', x: 3.8, z: -0.3, width: 2.5, depth: 1.2, height: 1.1, kind: 'platform' },
    ];
    exports.ARENA_RAMPS = [
        { id: 'ramp-west', x: -3.8, z: 1.7, width: 2.4, depth: 2.0, height: 1.1, axis: 'z', direction: -1 },
        { id: 'ramp-east', x: 3.8, z: -1.7, width: 2.4, depth: 2.0, height: 1.1, axis: 'z', direction: 1 },
        { id: 'ramp-center', x: 0, z: 2.1, width: 2.6, depth: 1.8, height: 2.7, axis: 'z', direction: -1 },
    ];
    exports.POLYGON_CORES = [
        { id: 'core-cyan', x: -7.4, y: 0.75, z: -5.1 },
        { id: 'core-magenta', x: 7.1, y: 0.75, z: -4.9 },
        { id: 'core-amber', x: 0, y: 3.45, z: 0 },
    ];
    exports.POLYGON_CHECKPOINTS = [
        { id: 'checkpoint-west', x: -7.0, y: 0.05, z: 4.8 },
        { id: 'checkpoint-east', x: 7.0, y: 0.05, z: 4.8 },
    ];
    exports.POLYGON_HAZARDS = [
        { id: 'hazard-west', x: -3.2, y: 0.05, z: -4.8 },
        { id: 'hazard-east', x: 3.2, y: 0.05, z: 4.8 },
        { id: 'hazard-center', x: 0, y: 0.05, z: -3.2 },
    ];
    exports.POLYGON_EXIT = { id: 'exit', x: 0, y: 0.05, z: 7.15 };
    const START = { x: 0, y: 0, z: -6.2, angle: Math.PI / 2, verticalVelocity: 0 };
    const PLAYER_RADIUS = 0.38;
    const GRAVITY = 13.5;
    const DIFFICULTIES = {
        cadete: { lives: 5, timeMs: 360_000, moveSpeed: 4.2, turnSpeed: 2.5, jumpSpeed: 6.0, hazardPeriodMs: 2500 },
        piloto: { lives: 4, timeMs: 300_000, moveSpeed: 4.7, turnSpeed: 2.8, jumpSpeed: 6.15, hazardPeriodMs: 1900 },
        arquiteto: { lives: 3, timeMs: 240_000, moveSpeed: 5.1, turnSpeed: 3.05, jumpSpeed: 6.2, hazardPeriodMs: 1400 },
    };
    class PolygonSectorSimulation {
        #state;
        constructor(difficulty = 'piloto') {
            this.#state = initialState(difficulty);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready') {
                this.#state = { ...this.#state, status: 'playing', message: 'Colete três núcleos poligonais e alcance o portal de saída.' };
            }
        }
        restart(difficulty = this.#state.difficulty) {
            this.#state = initialState(difficulty);
            this.start();
        }
        setMovement(action, active) {
            if (this.#state.status !== 'playing')
                return;
            const property = action === 'forward' ? 'moveForward' : action === 'backward' ? 'moveBackward' : action === 'turn-left' ? 'turnLeft' : 'turnRight';
            this.#state = { ...this.#state, [property]: active };
        }
        jump() {
            if (this.#state.status !== 'playing')
                return [];
            const ground = groundHeightAt(this.#state.player.x, this.#state.player.z);
            if (this.#state.player.y > ground + 0.03 || this.#state.player.verticalVelocity > 0.01)
                return [];
            this.#state = {
                ...this.#state,
                player: { ...this.#state.player, verticalVelocity: DIFFICULTIES[this.#state.difficulty].jumpSpeed },
                message: 'Impulso vertical aplicado ao corpo poligonal.',
            };
            return ['jump'];
        }
        toggleCamera() {
            if (this.#state.status !== 'playing')
                return [];
            const cameraMode = this.#state.cameraMode === 'third-person' ? 'first-person' : this.#state.cameraMode === 'first-person' ? 'fixed' : 'third-person';
            this.#state = { ...this.#state, cameraMode, score: this.#state.score + 5, message: `Câmera alterada para ${cameraLabel(cameraMode)}.` };
            return ['camera-changed'];
        }
        toggleMaterial() {
            if (this.#state.status !== 'playing')
                return [];
            const materialMode = this.#state.materialMode === 'flat' ? 'texture' : this.#state.materialMode === 'texture' ? 'pbr' : 'flat';
            this.#state = { ...this.#state, materialMode, score: this.#state.score + 5, message: `Material alterado para ${materialLabel(materialMode)}.` };
            return ['material-changed'];
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const dtMs = Math.min(Math.max(deltaMs, 0), 50);
            const dt = dtMs / 1000;
            const spec = DIFFICULTIES[this.#state.difficulty];
            const events = [];
            let state = {
                ...this.#state,
                elapsedMs: this.#state.elapsedMs + dtMs,
                remainingMs: Math.max(0, this.#state.remainingMs - dtMs),
                damageCooldownMs: Math.max(0, this.#state.damageCooldownMs - dtMs),
            };
            const turn = (state.turnRight ? 1 : 0) - (state.turnLeft ? 1 : 0);
            const angle = normalizeAngle(state.player.angle + turn * spec.turnSpeed * dt);
            const direction = (state.moveForward ? 1 : 0) - (state.moveBackward ? 1 : 0);
            let x = state.player.x;
            let z = state.player.z;
            if (direction !== 0) {
                const distance = direction * spec.moveSpeed * dt;
                const nextX = x + Math.cos(angle) * distance;
                const nextZ = z + Math.sin(angle) * distance;
                if (!collides(nextX, z))
                    x = nextX;
                if (!collides(x, nextZ))
                    z = nextZ;
            }
            const ground = groundHeightAt(x, z);
            let verticalVelocity = state.player.verticalVelocity - GRAVITY * dt;
            let y = state.player.y + verticalVelocity * dt;
            if (y <= ground) {
                y = ground;
                verticalVelocity = 0;
            }
            state = { ...state, player: { x, y, z, angle, verticalVelocity } };
            for (const core of exports.POLYGON_CORES) {
                if (!state.collectedCores.includes(core.id) && distance3(state.player, core) < 0.8) {
                    const collectedCores = [...state.collectedCores, core.id];
                    const unlocked = collectedCores.length >= exports.POLYGON_CORES_REQUIRED && state.collectedCores.length < exports.POLYGON_CORES_REQUIRED;
                    state = { ...state, collectedCores, score: state.score + 400, message: unlocked ? 'Três núcleos sincronizados: o portal de saída está ativo.' : `Núcleo ${collectedCores.length}/${exports.POLYGON_CORES_REQUIRED} coletado.` };
                    events.push('core-collected');
                    if (unlocked)
                        events.push('gate-unlocked');
                }
            }
            for (const checkpoint of exports.POLYGON_CHECKPOINTS) {
                if (!state.activatedCheckpoints.includes(checkpoint.id) && distance2(state.player, checkpoint) < 0.85) {
                    state = {
                        ...state,
                        activatedCheckpoints: [...state.activatedCheckpoints, checkpoint.id],
                        checkpoint: { ...state.player, verticalVelocity: 0 },
                        remainingMs: Math.min(spec.timeMs, state.remainingMs + 15_000),
                        score: state.score + 250,
                        message: 'Checkpoint geométrico registrado e tempo ampliado.',
                    };
                    events.push('checkpoint');
                }
            }
            const hazardActiveNow = Math.floor(state.elapsedMs / spec.hazardPeriodMs) % 2 === 0;
            const touchedHazard = exports.POLYGON_HAZARDS.some((hazard) => distance2(state.player, hazard) < 0.9);
            if (hazardActiveNow && touchedHazard && state.damageCooldownMs <= 0) {
                const lives = state.lives - 1;
                events.push('damage');
                if (lives <= 0) {
                    state = { ...state, lives: 0, status: 'lost', message: 'A malha de segurança encerrou a sessão.' };
                    events.push('finished');
                }
                else {
                    state = {
                        ...state,
                        lives,
                        player: { ...state.checkpoint },
                        damageCooldownMs: 1800,
                        score: Math.max(0, state.score - 150),
                        message: `Pulso poligonal detectado. Retorno ao checkpoint com ${lives} vidas.`,
                    };
                    events.push('life-lost');
                }
            }
            if (distance2(state.player, exports.POLYGON_EXIT) < 1.05) {
                if (state.collectedCores.length >= exports.POLYGON_CORES_REQUIRED) {
                    state = {
                        ...state,
                        status: 'won',
                        score: state.score + 1500 + Math.floor(state.remainingMs / 100),
                        message: 'Setor concluído: polígonos, câmera, materiais e física foram sincronizados.',
                    };
                    events.push('finished');
                }
                else {
                    state = { ...state, message: `Portal bloqueado: faltam ${exports.POLYGON_CORES_REQUIRED - state.collectedCores.length} núcleos.` };
                }
            }
            if (state.remainingMs <= 0 && state.status === 'playing') {
                state = { ...state, status: 'lost', message: 'Tempo de exploração esgotado.' };
                events.push('finished');
            }
            this.#state = state;
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Versão de save incompatível');
            this.#state = cloneState(state);
        }
    }
    exports.PolygonSectorSimulation = PolygonSectorSimulation;
    function groundHeightAt(x, z) {
        for (const ramp of exports.ARENA_RAMPS) {
            const localX = (x - (ramp.x - ramp.width / 2)) / ramp.width;
            const localZ = (z - (ramp.z - ramp.depth / 2)) / ramp.depth;
            if (localX >= 0 && localX <= 1 && localZ >= 0 && localZ <= 1) {
                const progress = ramp.axis === 'x' ? localX : localZ;
                return ramp.height * (ramp.direction === 1 ? progress : 1 - progress);
            }
        }
        for (const box of exports.ARENA_BOXES) {
            if (box.kind !== 'platform')
                continue;
            if (Math.abs(x - box.x) <= box.width / 2 - PLAYER_RADIUS * 0.4 && Math.abs(z - box.z) <= box.depth / 2 - PLAYER_RADIUS * 0.4)
                return box.height;
        }
        return 0;
    }
    function collides(x, z) {
        if (x < exports.ARENA_BOUNDS.minX + PLAYER_RADIUS || x > exports.ARENA_BOUNDS.maxX - PLAYER_RADIUS || z < exports.ARENA_BOUNDS.minZ + PLAYER_RADIUS || z > exports.ARENA_BOUNDS.maxZ - PLAYER_RADIUS)
            return true;
        const playerGround = groundHeightAt(x, z);
        return exports.ARENA_BOXES.some((box) => {
            if (box.kind === 'platform' && playerGround >= box.height - 0.08)
                return false;
            return Math.abs(x - box.x) < box.width / 2 + PLAYER_RADIUS && Math.abs(z - box.z) < box.depth / 2 + PLAYER_RADIUS;
        });
    }
    function distance2(a, b) {
        return Math.hypot(a.x - b.x, a.z - b.z);
    }
    function distance3(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    function initialState(difficulty) {
        const spec = DIFFICULTIES[difficulty];
        return {
            schemaVersion: 1,
            difficulty,
            status: 'ready',
            player: { ...START },
            checkpoint: { ...START },
            moveForward: false,
            moveBackward: false,
            turnLeft: false,
            turnRight: false,
            collectedCores: [],
            activatedCheckpoints: [],
            lives: spec.lives,
            score: 0,
            elapsedMs: 0,
            remainingMs: spec.timeMs,
            damageCooldownMs: 0,
            cameraMode: 'third-person',
            materialMode: 'flat',
            message: 'Setor pronto. Inicie para explorar a primeira arena poligonal.',
        };
    }
    function cloneState(state) {
        return {
            ...state,
            player: { ...state.player },
            checkpoint: { ...state.checkpoint },
            collectedCores: [...state.collectedCores],
            activatedCheckpoints: [...state.activatedCheckpoints],
        };
    }
    function normalizeAngle(angle) {
        const full = Math.PI * 2;
        return ((angle % full) + full) % full;
    }
    function cameraLabel(mode) {
        return mode === 'first-person' ? 'primeira pessoa' : mode === 'fixed' ? 'câmera fixa' : 'terceira pessoa';
    }
    function materialLabel(mode) {
        return mode === 'flat' ? 'cor plana' : mode === 'texture' ? 'textura procedural' : 'iluminação PBR didática';
    }
    
  };
  __modules["games/polygon-sector-94/webgl/polygon-sector-renderer"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PolygonSectorRenderer = void 0;
    const polygon_sector_simulation_1 = __require("games/polygon-sector-94/simulation/polygon-sector-simulation");
    const VERTEX_SHADER = `
    attribute vec3 a_position;
    attribute vec3 a_normal;
    uniform mat4 u_model;
    uniform mat4 u_viewProjection;
    varying vec3 v_normal;
    varying vec3 v_world;
    void main() {
      vec4 world = u_model * vec4(a_position, 1.0);
      v_world = world.xyz;
      v_normal = normalize(mat3(u_model) * a_normal);
      gl_Position = u_viewProjection * world;
    }`;
    const FRAGMENT_SHADER = `
    precision mediump float;
    uniform vec3 u_color;
    uniform vec3 u_lightDirection;
    uniform vec3 u_cameraPosition;
    uniform int u_materialMode;
    uniform float u_emissive;
    uniform float u_alpha;
    varying vec3 v_normal;
    varying vec3 v_world;
    void main() {
      vec3 normal = normalize(v_normal);
      vec3 lightDirection = normalize(-u_lightDirection);
      float diffuse = max(dot(normal, lightDirection), 0.0);
      vec3 color = u_color;
      if (u_materialMode == 1) {
        float checker = mod(floor(v_world.x * 1.6) + floor(v_world.z * 1.6) + floor(v_world.y * 1.6), 2.0);
        color *= mix(0.58, 1.18, checker);
      }
      float lighting = 0.82;
      if (u_materialMode == 2) {
        vec3 viewDirection = normalize(u_cameraPosition - v_world);
        vec3 halfDirection = normalize(lightDirection + viewDirection);
        float specular = pow(max(dot(normal, halfDirection), 0.0), 28.0);
        lighting = 0.24 + diffuse * 0.82 + specular * 0.55;
      } else if (u_materialMode == 1) {
        lighting = 0.42 + diffuse * 0.72;
      }
      gl_FragColor = vec4(color * lighting + color * u_emissive, u_alpha);
    }`;
    class PolygonSectorRenderer {
        #canvas;
        #gl;
        #program;
        #cube;
        #octahedron;
        #graphicsMode;
        #reducedMotion;
        #positionLocation;
        #normalLocation;
        #modelLocation;
        #viewProjectionLocation;
        #colorLocation;
        #lightDirectionLocation;
        #cameraLocation;
        #materialLocation;
        #emissiveLocation;
        #alphaLocation;
        #drawCalls = 0;
        #triangles = 0;
        #disposed = false;
        #contextLost = false;
        constructor(canvas, graphicsMode, reducedMotion) {
            this.#canvas = canvas;
            this.#graphicsMode = graphicsMode;
            this.#reducedMotion = reducedMotion;
            const gl = canvas.getContext('webgl', {
                antialias: graphicsMode !== 'baixo' && graphicsMode !== 'historico',
                alpha: false,
                depth: true,
                powerPreference: graphicsMode === 'alto' || graphicsMode === 'ultra' ? 'high-performance' : 'default',
            });
            if (!gl)
                throw new Error('WebGL indisponível neste navegador.');
            this.#gl = gl;
            this.#program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
            this.#positionLocation = gl.getAttribLocation(this.#program, 'a_position');
            this.#normalLocation = gl.getAttribLocation(this.#program, 'a_normal');
            this.#modelLocation = requiredUniform(gl, this.#program, 'u_model');
            this.#viewProjectionLocation = requiredUniform(gl, this.#program, 'u_viewProjection');
            this.#colorLocation = requiredUniform(gl, this.#program, 'u_color');
            this.#lightDirectionLocation = requiredUniform(gl, this.#program, 'u_lightDirection');
            this.#cameraLocation = requiredUniform(gl, this.#program, 'u_cameraPosition');
            this.#materialLocation = requiredUniform(gl, this.#program, 'u_materialMode');
            this.#emissiveLocation = requiredUniform(gl, this.#program, 'u_emissive');
            this.#alphaLocation = requiredUniform(gl, this.#program, 'u_alpha');
            this.#cube = createGeometry(gl, cubeVertices(), cubeNormals(), cubeIndices());
            this.#octahedron = createGeometry(gl, octahedronVertices(), octahedronNormals(), octahedronIndices());
            canvas.addEventListener('webglcontextlost', this.#onContextLost, false);
            canvas.addEventListener('webglcontextrestored', this.#onContextRestored, false);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
        resize(width, height, devicePixelRatio) {
            const scale = resolutionScale(this.#graphicsMode);
            const pixelRatio = Math.min(devicePixelRatio, this.#graphicsMode === 'ultra' ? 2 : this.#graphicsMode === 'alto' ? 1.6 : 1.25);
            const renderWidth = Math.max(2, Math.floor(width * pixelRatio * scale));
            const renderHeight = Math.max(2, Math.floor(height * pixelRatio * scale));
            if (this.#canvas.width !== renderWidth || this.#canvas.height !== renderHeight) {
                this.#canvas.width = renderWidth;
                this.#canvas.height = renderHeight;
                this.#canvas.style.width = `${Math.max(1, width)}px`;
                this.#canvas.style.height = `${Math.max(1, height)}px`;
            }
        }
        render(state, nowMs) {
            if (this.#disposed || this.#contextLost)
                return { drawCalls: 0, triangles: 0, resolutionScale: resolutionScale(this.#graphicsMode) };
            const gl = this.#gl;
            this.#drawCalls = 0;
            this.#triangles = 0;
            gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
            const historical = this.#graphicsMode === 'historico';
            gl.clearColor(historical ? 0.012 : 0.018, historical ? 0.025 : 0.035, historical ? 0.018 : 0.07, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.useProgram(this.#program);
            const camera = cameraForState(state);
            const projection = perspective(55 * Math.PI / 180, Math.max(0.2, this.#canvas.width / this.#canvas.height), 0.1, 80);
            const view = lookAt(camera.position, camera.target, { x: 0, y: 1, z: 0 });
            const viewProjection = multiply(projection, view);
            gl.uniformMatrix4fv(this.#viewProjectionLocation, false, viewProjection);
            gl.uniform3f(this.#lightDirectionLocation, -0.55, -1, 0.35);
            gl.uniform3f(this.#cameraLocation, camera.position.x, camera.position.y, camera.position.z);
            const materialMode = historical ? 'flat' : state.materialMode;
            const pulse = this.#reducedMotion ? 1 : 0.75 + Math.sin(nowMs * 0.004) * 0.25;
            this.#drawCube(transform(0, -0.28, 0, 20, 0.5, 16), historical ? [0.08, 0.16, 0.1] : [0.09, 0.14, 0.22], materialMode);
            this.#drawGrid(materialMode, historical);
            polygon_sector_simulation_1.ARENA_BOXES.forEach((box, index) => {
                const baseColor = box.kind === 'pillar'
                    ? historical ? [0.18, 0.5, 0.28] : [0.18 + (index % 2) * 0.05, 0.42, 0.62]
                    : box.kind === 'platform'
                        ? historical ? [0.14, 0.4, 0.22] : [0.38, 0.18, 0.52]
                        : historical ? [0.1, 0.34, 0.18] : [0.12, 0.23, 0.38];
                this.#drawCube(transform(box.x, box.height / 2, box.z, box.width, box.height, box.depth), baseColor, materialMode);
            });
            polygon_sector_simulation_1.ARENA_RAMPS.forEach((ramp) => {
                const angle = Math.atan2(ramp.height, ramp.axis === 'x' ? ramp.width : ramp.depth) * ramp.direction;
                const length = Math.hypot(ramp.axis === 'x' ? ramp.width : ramp.depth, ramp.height);
                const model = ramp.axis === 'x'
                    ? transform(ramp.x, ramp.height / 2 - 0.08, ramp.z, length, 0.28, ramp.depth, 0, 0, -angle)
                    : transform(ramp.x, ramp.height / 2 - 0.08, ramp.z, ramp.width, 0.28, length, angle, 0, 0);
                this.#drawCube(model, historical ? [0.22, 0.55, 0.3] : [0.28, 0.48, 0.68], materialMode);
            });
            polygon_sector_simulation_1.POLYGON_CHECKPOINTS.forEach((checkpoint) => {
                const active = state.activatedCheckpoints.includes(checkpoint.id);
                this.#drawCube(transform(checkpoint.x, 0.05, checkpoint.z, 1.35, 0.1, 1.35), active ? [0.18, 0.95, 0.62] : [0.12, 0.34, 0.42], materialMode, active ? 0.28 : 0.02);
                for (let bar = 0; bar < 4; bar += 1) {
                    const angle = bar * Math.PI / 2;
                    this.#drawCube(transform(checkpoint.x + Math.cos(angle) * 0.65, 0.55, checkpoint.z + Math.sin(angle) * 0.65, 0.09, 1.0, 0.09), active ? [0.32, 1, 0.72] : [0.18, 0.5, 0.58], materialMode, active ? 0.35 : 0.05);
                }
            });
            polygon_sector_simulation_1.POLYGON_HAZARDS.forEach((hazard, index) => {
                const active = Math.floor(state.elapsedMs / (state.difficulty === 'arquiteto' ? 1400 : state.difficulty === 'cadete' ? 2500 : 1900)) % 2 === 0;
                const glow = active ? pulse : 0.2;
                this.#drawCube(transform(hazard.x, 0.04, hazard.z, 1.55, 0.08, 1.55, 0, nowMs * 0.0005 * (index + 1), 0), active ? [1, 0.16, 0.28] : [0.28, 0.06, 0.1], materialMode, glow * 0.4);
            });
            polygon_sector_simulation_1.POLYGON_CORES.forEach((core, index) => {
                if (state.collectedCores.includes(core.id))
                    return;
                const colors = historical ? [[0.3, 1, 0.45], [0.3, 1, 0.45], [0.3, 1, 0.45]] : [[0.15, 0.95, 1], [1, 0.2, 0.72], [1, 0.68, 0.12]];
                const bob = this.#reducedMotion ? 0 : Math.sin(nowMs * 0.003 + index * 2) * 0.16;
                this.#drawGeometry(this.#octahedron, transform(core.x, core.y + bob, core.z, 0.65, 0.9, 0.65, nowMs * 0.0008, nowMs * 0.0011, 0), colors[index], materialMode, 0.55);
            });
            const unlocked = state.collectedCores.length >= 3;
            this.#drawPortal(polygon_sector_simulation_1.POLYGON_EXIT, unlocked, materialMode, nowMs, historical);
            this.#drawPlayer(state, materialMode, historical);
            return { drawCalls: this.#drawCalls, triangles: this.#triangles, resolutionScale: resolutionScale(this.#graphicsMode) };
        }
        dispose() {
            if (this.#disposed)
                return;
            this.#disposed = true;
            const gl = this.#gl;
            [this.#cube, this.#octahedron].forEach((geometry) => {
                gl.deleteBuffer(geometry.position);
                gl.deleteBuffer(geometry.normal);
                gl.deleteBuffer(geometry.index);
            });
            gl.deleteProgram(this.#program);
            this.#canvas.removeEventListener('webglcontextlost', this.#onContextLost, false);
            this.#canvas.removeEventListener('webglcontextrestored', this.#onContextRestored, false);
        }
        #onContextLost = (event) => {
            event.preventDefault();
            this.#contextLost = true;
        };
        #onContextRestored = () => {
            this.#contextLost = false;
        };
        #drawGrid(materialMode, historical) {
            if (this.#graphicsMode === 'baixo')
                return;
            for (let x = polygon_sector_simulation_1.ARENA_BOUNDS.minX + 1; x < polygon_sector_simulation_1.ARENA_BOUNDS.maxX; x += 1) {
                this.#drawCube(transform(x, 0.006, 0, 0.018, 0.012, 15), historical ? [0.08, 0.32, 0.14] : [0.08, 0.34, 0.48], materialMode, 0.08);
            }
            for (let z = polygon_sector_simulation_1.ARENA_BOUNDS.minZ + 1; z < polygon_sector_simulation_1.ARENA_BOUNDS.maxZ; z += 1) {
                this.#drawCube(transform(0, 0.006, z, 19, 0.012, 0.018), historical ? [0.08, 0.32, 0.14] : [0.08, 0.34, 0.48], materialMode, 0.08);
            }
        }
        #drawPlayer(state, materialMode, historical) {
            const player = state.player;
            if (state.cameraMode !== 'first-person') {
                this.#drawCube(transform(player.x, player.y + 0.56, player.z, 0.62, 0.85, 0.62, 0, -player.angle + Math.PI / 2, 0), historical ? [0.42, 1, 0.52] : [0.3, 0.72, 1], materialMode, 0.08);
                this.#drawCube(transform(player.x, player.y + 1.18, player.z, 0.46, 0.38, 0.46, 0, -player.angle + Math.PI / 2, 0), historical ? [0.58, 1, 0.62] : [0.82, 0.9, 1], materialMode, 0.12);
                this.#drawCube(transform(player.x + Math.cos(player.angle) * 0.37, player.y + 0.78, player.z + Math.sin(player.angle) * 0.37, 0.18, 0.18, 0.44, 0, -player.angle + Math.PI / 2, 0), [1, 0.45, 0.16], materialMode, 0.18);
                if (this.#graphicsMode !== 'baixo')
                    this.#drawCube(transform(player.x, 0.018, player.z, 0.76, 0.025, 0.76), [0.02, 0.03, 0.05], 'flat', 0, 0.45);
            }
        }
        #drawPortal(point, unlocked, materialMode, nowMs, historical) {
            const color = unlocked ? historical ? [0.35, 1, 0.48] : [0.2, 1, 0.7] : historical ? [0.18, 0.38, 0.22] : [0.22, 0.25, 0.34];
            for (let part = 0; part < 10; part += 1) {
                const angle = part / 10 * Math.PI * 2 + (unlocked && !this.#reducedMotion ? nowMs * 0.00025 : 0);
                const x = point.x + Math.cos(angle) * 1.25;
                const y = 1.55 + Math.sin(angle) * 1.25;
                this.#drawCube(transform(x, y, point.z, 0.28, 0.28, 0.38, 0, 0, angle), color, materialMode, unlocked ? 0.45 : 0.03);
            }
        }
        #drawCube(model, color, materialMode, emissive = 0, alpha = 1) {
            this.#drawGeometry(this.#cube, model, color, materialMode, emissive, alpha);
        }
        #drawGeometry(geometry, model, color, materialMode, emissive = 0, alpha = 1) {
            const gl = this.#gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, geometry.position);
            gl.enableVertexAttribArray(this.#positionLocation);
            gl.vertexAttribPointer(this.#positionLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, geometry.normal);
            gl.enableVertexAttribArray(this.#normalLocation);
            gl.vertexAttribPointer(this.#normalLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.index);
            gl.uniformMatrix4fv(this.#modelLocation, false, model);
            gl.uniform3f(this.#colorLocation, color[0], color[1], color[2]);
            gl.uniform1i(this.#materialLocation, materialMode === 'flat' ? 0 : materialMode === 'texture' ? 1 : 2);
            gl.uniform1f(this.#emissiveLocation, emissive);
            gl.uniform1f(this.#alphaLocation, alpha);
            gl.drawElements(gl.TRIANGLES, geometry.indexCount, gl.UNSIGNED_SHORT, 0);
            this.#drawCalls += 1;
            this.#triangles += geometry.indexCount / 3;
        }
    }
    exports.PolygonSectorRenderer = PolygonSectorRenderer;
    function resolutionScale(mode) {
        if (mode === 'baixo')
            return 0.62;
        if (mode === 'medio' || mode === 'automatico')
            return 0.82;
        if (mode === 'historico')
            return 0.58;
        if (mode === 'alto')
            return 1;
        return 1.12;
    }
    function cameraForState(state) {
        const player = state.player;
        const forward = { x: Math.cos(player.angle), z: Math.sin(player.angle) };
        if (state.cameraMode === 'first-person') {
            return {
                position: { x: player.x, y: player.y + 1.05, z: player.z },
                target: { x: player.x + forward.x * 4, y: player.y + 0.95, z: player.z + forward.z * 4 },
            };
        }
        if (state.cameraMode === 'fixed') {
            return { position: { x: 14, y: 18, z: 18 }, target: { x: 0, y: 0.5, z: 0 } };
        }
        return {
            position: { x: player.x - forward.x * 5.3, y: player.y + 3.2, z: player.z - forward.z * 5.3 },
            target: { x: player.x + forward.x * 1.6, y: player.y + 0.75, z: player.z + forward.z * 1.6 },
        };
    }
    function createProgram(gl, vertexSource, fragmentSource) {
        const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        const program = gl.createProgram();
        if (!program)
            throw new Error('Não foi possível criar o programa WebGL.');
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program) ?? 'Erro desconhecido';
            gl.deleteProgram(program);
            throw new Error(`Falha ao ligar shaders: ${log}`);
        }
        return program;
    }
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        if (!shader)
            throw new Error('Não foi possível criar shader WebGL.');
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader) ?? 'Erro desconhecido';
            gl.deleteShader(shader);
            throw new Error(`Falha ao compilar shader: ${log}`);
        }
        return shader;
    }
    function requiredUniform(gl, program, name) {
        const location = gl.getUniformLocation(program, name);
        if (!location)
            throw new Error(`Uniform obrigatório ausente: ${name}`);
        return location;
    }
    function createGeometry(gl, vertices, normals, indices) {
        const position = gl.createBuffer();
        const normal = gl.createBuffer();
        const index = gl.createBuffer();
        if (!position || !normal || !index)
            throw new Error('Falha ao criar buffers WebGL.');
        gl.bindBuffer(gl.ARRAY_BUFFER, position);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, normal);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return { position, normal, index, indexCount: indices.length };
    }
    function cubeVertices() {
        return [
            -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
            0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
            -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
        ];
    }
    function cubeNormals() {
        return [
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        ];
    }
    function cubeIndices() {
        return [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
    }
    function octahedronVertices() {
        return [0, 1, 0, 1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, -1, 0, -1, 0];
    }
    function octahedronNormals() {
        const source = octahedronVertices();
        const normals = [];
        for (let index = 0; index < source.length; index += 3) {
            const length = Math.hypot(source[index], source[index + 1], source[index + 2]) || 1;
            normals.push(source[index] / length, source[index + 1] / length, source[index + 2] / length);
        }
        return normals;
    }
    function octahedronIndices() {
        return [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1, 5, 2, 1, 5, 3, 2, 5, 4, 3, 5, 1, 4];
    }
    function transform(x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) {
        const cx = Math.cos(rx), sxn = Math.sin(rx);
        const cy = Math.cos(ry), syn = Math.sin(ry);
        const cz = Math.cos(rz), szn = Math.sin(rz);
        return new Float32Array([
            (cy * cz) * sx, (sxn * syn * cz + cx * szn) * sx, (-cx * syn * cz + sxn * szn) * sx, 0,
            (-cy * szn) * sy, (-sxn * syn * szn + cx * cz) * sy, (cx * syn * szn + sxn * cz) * sy, 0,
            syn * sz, -sxn * cy * sz, cx * cy * sz, 0,
            x, y, z, 1,
        ]);
    }
    function perspective(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0,
        ]);
    }
    function lookAt(eye, target, up) {
        let zx = eye.x - target.x, zy = eye.y - target.y, zz = eye.z - target.z;
        let length = Math.hypot(zx, zy, zz) || 1;
        zx /= length;
        zy /= length;
        zz /= length;
        let xx = up.y * zz - up.z * zy;
        let xy = up.z * zx - up.x * zz;
        let xz = up.x * zy - up.y * zx;
        length = Math.hypot(xx, xy, xz) || 1;
        xx /= length;
        xy /= length;
        xz /= length;
        const yx = zy * xz - zz * xy;
        const yy = zz * xx - zx * xz;
        const yz = zx * xy - zy * xx;
        return new Float32Array([
            xx, yx, zx, 0,
            xy, yy, zy, 0,
            xz, yz, zz, 0,
            -(xx * eye.x + xy * eye.y + xz * eye.z),
            -(yx * eye.x + yy * eye.y + yz * eye.z),
            -(zx * eye.x + zy * eye.y + zz * eye.z),
            1,
        ]);
    }
    function multiply(a, b) {
        const out = new Float32Array(16);
        for (let column = 0; column < 4; column += 1) {
            for (let row = 0; row < 4; row += 1) {
                out[column * 4 + row] =
                    a[row] * b[column * 4] +
                        a[4 + row] * b[column * 4 + 1] +
                        a[8 + row] * b[column * 4 + 2] +
                        a[12 + row] * b[column * 4 + 3];
            }
        }
        return out;
    }
    
  };
  __modules["games/polygon-sector-94/webgl/polygon-sector-runtime"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PolygonSectorRuntime = void 0;
    const polygon_sector_audio_1 = __require("games/polygon-sector-94/audio/polygon-sector-audio");
    const polygon_sector_simulation_1 = __require("games/polygon-sector-94/simulation/polygon-sector-simulation");
    const polygon_sector_renderer_1 = __require("games/polygon-sector-94/webgl/polygon-sector-renderer");
    class PolygonSectorRuntime {
        id = 'polygon-sector-94';
        state = 'not-loaded';
        #simulation = new polygon_sector_simulation_1.PolygonSectorSimulation();
        #renderer;
        #canvas;
        #overlay;
        #context;
        #audio;
        #resizeObserver;
        #animationFrame = 0;
        #lastFrame = 0;
        #lastStats = { drawCalls: 0, triangles: 0, resolutionScale: 1 };
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new polygon_sector_simulation_1.PolygonSectorSimulation(parseDifficulty(context.parameters?.difficulty));
            this.#audio = new polygon_sector_audio_1.PolygonSectorAudio(context.muted);
            const canvas = document.createElement('canvas');
            canvas.className = 'polygon-webgl-canvas';
            canvas.setAttribute('aria-label', 'Arena poligonal tridimensional');
            const overlay = document.createElement('div');
            overlay.className = 'polygon-webgl-overlay';
            overlay.setAttribute('aria-live', 'polite');
            context.container.replaceChildren(canvas, overlay);
            this.#canvas = canvas;
            this.#overlay = overlay;
            try {
                this.#renderer = new polygon_sector_renderer_1.PolygonSectorRenderer(canvas, context.graphicsMode, context.reducedMotion);
            }
            catch (error) {
                context.container.innerHTML = `<div class="webgl-fallback"><strong>WebGL indisponível</strong><p>${error instanceof Error ? error.message : 'Não foi possível iniciar o renderizador 3D.'}</p></div>`;
                throw error;
            }
            this.#resizeObserver = new ResizeObserver(() => this.#resize());
            this.#resizeObserver.observe(context.container);
            this.#resize();
            this.#render(performance.now());
            this.state = 'tutorial';
            context.onEvent?.({ type: 'ready', detail: { renderer: 'webgl', runtime: 'polygon-sector-94' } });
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'won' || current.status === 'lost')
                this.#simulation.restart(current.difficulty);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#lastFrame = performance.now();
            this.#context?.onEvent?.({ type: 'serve', detail: { difficulty: this.#simulation.state.difficulty, camera: this.#simulation.state.cameraMode } });
            this.#scheduleFrame();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            cancelAnimationFrame(this.#animationFrame);
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
            this.#render(performance.now());
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#lastFrame = performance.now();
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
            this.#scheduleFrame();
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-up')
                this.#simulation.setMovement('forward', input.active);
            else if (input.action === 'move-down')
                this.#simulation.setMovement('backward', input.active);
            else if (input.action === 'move-left')
                this.#simulation.setMovement('turn-left', input.active);
            else if (input.action === 'move-right')
                this.#simulation.setMovement('turn-right', input.active);
            else if (input.action === 'jump' && input.active)
                this.#processEvents(this.#simulation.jump());
            else if (input.action === 'primary-action' && input.active)
                this.#processEvents(this.#simulation.toggleMaterial());
            else if (input.action === 'secondary-action' && input.active)
                this.#processEvents(this.#simulation.toggleCamera());
            this.#render(performance.now());
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'won' || status === 'lost' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#render(performance.now());
        }
        dispose() {
            cancelAnimationFrame(this.#animationFrame);
            this.#resizeObserver?.disconnect();
            this.#renderer?.dispose();
            this.#audio?.dispose();
            this.#canvas?.remove();
            this.#overlay?.remove();
            this.#renderer = undefined;
            this.#canvas = undefined;
            this.#overlay = undefined;
            this.state = 'disposed';
        }
        #scheduleFrame() {
            cancelAnimationFrame(this.#animationFrame);
            this.#animationFrame = requestAnimationFrame((now) => this.#frame(now));
        }
        #frame(now) {
            if (this.state !== 'playing')
                return;
            const delta = Math.min(50, Math.max(0, now - this.#lastFrame));
            this.#lastFrame = now;
            this.#processEvents(this.#simulation.step(delta));
            this.#render(now);
            if (this.state === 'playing')
                this.#scheduleFrame();
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            const current = this.#simulation.state;
            events.forEach((event) => this.#audio?.play(event));
            for (const event of events) {
                if (event === 'finished') {
                    this.state = 'finished';
                    cancelAnimationFrame(this.#animationFrame);
                    this.#context?.onEvent?.({
                        type: 'finished',
                        detail: {
                            winner: current.status === 'won' ? 'player' : 'system',
                            score: current.score,
                            lives: current.lives,
                            cores: current.collectedCores.length,
                            checkpoints: current.activatedCheckpoints.length,
                            elapsed: Math.round(current.elapsedMs / 1000),
                        },
                    });
                }
                else {
                    this.#context?.onEvent?.({
                        type: 'progress',
                        detail: {
                            event,
                            score: current.score,
                            lives: current.lives,
                            cores: current.collectedCores.length,
                            checkpoints: current.activatedCheckpoints.length,
                            camera: current.cameraMode,
                            material: current.materialMode,
                        },
                    });
                }
            }
        }
        #resize() {
            const container = this.#context?.container;
            if (!container || !this.#renderer)
                return;
            const rect = container.getBoundingClientRect();
            this.#renderer.resize(Math.max(320, rect.width), Math.max(260, rect.height), window.devicePixelRatio || 1);
            this.#render(performance.now());
        }
        #render(now) {
            if (!this.#renderer)
                return;
            this.#lastStats = this.#renderer.render(this.#simulation.state, now);
            this.#updateOverlay();
        }
        #updateOverlay() {
            if (!this.#overlay)
                return;
            const state = this.#simulation.state;
            const camera = state.cameraMode === 'first-person' ? '1ª PESSOA' : state.cameraMode === 'fixed' ? 'FIXA' : '3ª PESSOA';
            const material = state.materialMode === 'flat' ? 'FLAT' : state.materialMode === 'texture' ? 'TEXTURA' : 'PBR DIDÁTICO';
            this.#overlay.innerHTML = `<span>${camera}</span><span>${material}</span><span>${state.collectedCores.length}/${polygon_sector_simulation_1.POLYGON_CORES_REQUIRED} NÚCLEOS</span><span>${this.#lastStats.drawCalls} DRAWS · ${this.#lastStats.triangles} TRI</span><small>${state.message}</small>`;
        }
    }
    exports.PolygonSectorRuntime = PolygonSectorRuntime;
    function parseDifficulty(value) {
        return value === 'cadete' || value === 'arquiteto' ? value : 'piloto';
    }
    
  };
  __modules["games/puzzle-forge/content/puzzle-forge-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PUZZLE_FORGE_COMPARISON = exports.PUZZLE_FORGE_PSEUDOCODE = exports.PUZZLE_FORGE_HISTORY = void 0;
    exports.PUZZLE_FORGE_HISTORY = {
        title: 'Quebra-cabeças digitais, matrizes e algoritmos de busca',
        paragraphs: [
            'Quebra-cabeças digitais evoluíram de problemas abstratos em terminais e tabuleiros para experiências visuais com física, circuitos, caminhos, lógica espacial e editores de fases.',
            'Puzzle Forge DS transforma quatro estruturas clássicas — caminho, circuito, sequência e labirinto — em um laboratório educacional autoral para estudar matrizes, vizinhança, estados, memória e busca de rotas.',
        ],
        sourceUrl: 'https://www.computerhistory.org/timeline/graphics-games/',
    };
    exports.PUZZLE_FORGE_PSEUDOCODE = `selecionar modo e dificuldade
    criar grade serializável
    
    se modo = CAMINHO:
      ao tocar, girar peça 90 graus
      verificar rota entre início e saída
    
    se modo = CIRCUITO:
      alternar célula e vizinhos ortogonais
      verificar se todos os terminais estão ativos
    
    se modo = SEQUÊNCIA:
      comparar toque com próximo índice esperado
      avançar cursor ou reiniciar após erro
    
    se modo = LABIRINTO:
      validar limites e paredes
      mover jogador
      concluir ao alcançar a saída
    
    salvar grade, pontuação, tempo, erros e progresso`;
    exports.PUZZLE_FORGE_COMPARISON = [
        ['Representação', 'Papéis, peças físicas e circuitos discretos', 'Matrizes numéricas e estado serializável em TypeScript'],
        ['Interação', 'Manipulação direta de peças e anotações', 'Clique, toque, teclado e controles móveis'],
        ['Validação', 'Conferência manual das regras', 'Regras determinísticas e verificação automática'],
        ['Criação', 'Desenho livre em papel quadriculado', 'Editor 7×7 que envia somente dados para a simulação'],
        ['Aprendizado', 'Estratégia e raciocínio lógico', 'Matrizes, vizinhança, grafos, sequência e máquina de estados'],
    ];
    
  };
  __modules["games/puzzle-forge/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const puzzle_forge_runtime_1 = __require("games/puzzle-forge/phaser/puzzle-forge-runtime");
    function createRuntime() {
        return new puzzle_forge_runtime_1.PuzzleForgeRuntime();
    }
    
  };
  __modules["games/puzzle-forge/phaser/puzzle-forge-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PuzzleForgeRuntime = void 0;
    const puzzle_forge_simulation_1 = __require("games/puzzle-forge/simulation/puzzle-forge-simulation");
    class PuzzleForgeRuntime {
        id = 'puzzle-forge';
        state = 'not-loaded';
        #simulation = new puzzle_forge_simulation_1.PuzzleForgeSimulation();
        #game;
        #context;
        #graphics;
        #title;
        #message;
        #scene;
        #sequenceLabels = [];
        #graphicsMode = 'medio';
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            const config = parseConfiguration(context.parameters?.mode);
            const layout = typeof context.parameters?.layout === 'string' ? context.parameters.layout : undefined;
            this.#simulation = new puzzle_forge_simulation_1.PuzzleForgeSimulation(config.mode, config.difficulty, layout);
            this.#graphicsMode = context.graphicsMode;
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class PuzzleForgeScene extends Phaser.Scene {
                constructor() { super('puzzle-forge'); }
                create() {
                    owner.#scene = this;
                    owner.#graphics = this.add.graphics();
                    owner.#title = this.add.text(0, 0, '', { color: '#f8fbff', fontFamily: 'ui-monospace, monospace', fontSize: '22px', fontStyle: 'bold', align: 'center' }).setOrigin(.5, 0);
                    owner.#message = this.add.text(0, 0, '', { color: '#adc1db', fontFamily: 'system-ui, sans-serif', fontSize: '16px', align: 'center', wordWrap: { width: 780 } }).setOrigin(.5, 0);
                    this.input.on('pointerdown', (pointer) => owner.#handlePointer(pointer.x, pointer.y, this.scale.width, this.scale.height));
                    this.scale.on('resize', () => owner.#draw(this.scale.width, this.scale.height));
                    owner.#draw(this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) { owner.#simulation.step(delta); }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 640,
                backgroundColor: '#050914',
                transparent: false,
                scene: PuzzleForgeScene,
                render: { antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo', pixelArt: context.graphicsMode === 'historico' },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            this.#simulation.start();
            this.state = 'playing';
            this.#drawCurrent();
            this.#context?.onEvent?.({ type: 'serve', detail: { mode: this.#simulation.state.mode } });
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (input.action === 'primary-action' && input.active && this.state !== 'playing') {
                this.start();
                return;
            }
            if (!input.active || this.state !== 'playing' || this.#simulation.state.mode !== 'labirinto')
                return;
            const direction = input.action === 'move-up' ? 'up' : input.action === 'move-down' ? 'down' : input.action === 'move-left' ? 'left' : input.action === 'move-right' ? 'right' : undefined;
            if (!direction)
                return;
            this.#applyEvents(this.#simulation.move(direction));
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state, board: [...state.board], target: [...state.target], sequence: [...state.sequence] } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            this.state = this.#simulation.state.status === 'playing' ? 'paused' : this.#simulation.state.status === 'ready' ? 'menu' : 'finished';
            this.#drawCurrent();
        }
        dispose() {
            this.#game?.destroy(true);
            this.#game = undefined;
            this.#graphics = undefined;
            this.#title = undefined;
            this.#message = undefined;
            this.state = 'disposed';
        }
        #handlePointer(x, y, width, height) {
            if (this.state !== 'playing')
                return;
            const state = this.#simulation.state;
            const geometry = gridGeometry(state.mode, width, height);
            const col = Math.floor((x - geometry.x) / geometry.cell);
            const row = Math.floor((y - geometry.y) / geometry.cell);
            if (row < 0 || row >= geometry.size || col < 0 || col >= geometry.size)
                return;
            const index = row * geometry.size + col;
            if (state.mode === 'labirinto') {
                const currentRow = Math.floor(state.playerIndex / geometry.size);
                const currentCol = state.playerIndex % geometry.size;
                const direction = row === currentRow - 1 && col === currentCol ? 'up' : row === currentRow + 1 && col === currentCol ? 'down' : row === currentRow && col === currentCol - 1 ? 'left' : row === currentRow && col === currentCol + 1 ? 'right' : undefined;
                if (direction)
                    this.#applyEvents(this.#simulation.move(direction));
                return;
            }
            this.#applyEvents(this.#simulation.select(index));
        }
        #applyEvents(events) {
            this.#drawCurrent();
            const state = this.#simulation.state;
            this.#context?.onEvent?.({ type: 'progress', detail: { mode: state.mode, moves: state.moves, mistakes: state.mistakes, score: state.score, stage: state.stage, progress: state.mode === 'sequencia' ? state.sequenceCursor : 0, event: events.includes('invalid') ? 'invalid' : events.includes('finished') ? 'completed' : events[0] ?? 'move' } });
            if (events.includes('finished')) {
                this.state = 'finished';
                this.#context?.onEvent?.({ type: 'finished', detail: { winner: state.status === 'won' ? 'player' : 'cpu', score: state.score, moves: state.moves, mistakes: state.mistakes, mode: state.mode } });
            }
        }
        #drawCurrent() {
            if (!this.#game)
                return;
            this.#draw(this.#game.scale.width, this.#game.scale.height);
        }
        #draw(width, height) {
            const graphics = this.#graphics;
            if (!graphics)
                return;
            const state = this.#simulation.state;
            const historical = this.#graphicsMode === 'historico';
            const geometry = gridGeometry(state.mode, width, height);
            const cyan = historical ? 0xe8e8e8 : 0x49e7ff;
            const violet = historical ? 0x9b9b9b : 0xa46fff;
            graphics.clear();
            graphics.fillGradientStyle(historical ? 0x050505 : 0x061125, historical ? 0x050505 : 0x0c1933, 0x02050c, 0x02050c, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.lineStyle(1, historical ? 0x333333 : 0x16304f, .4);
            for (let x = 0; x < width; x += 36)
                graphics.lineBetween(x, 0, x, height);
            for (let y = 0; y < height; y += 36)
                graphics.lineBetween(0, y, width, y);
            this.#title?.setPosition(width / 2, 18).setText(titleFor(state.mode));
            this.#message?.setPosition(width / 2, height - 52).setText(state.message).setWordWrapWidth(Math.min(800, width - 32));
            if (state.mode !== 'sequencia' && this.#sequenceLabels.length > 0) {
                this.#sequenceLabels.forEach((label) => label.destroy());
                this.#sequenceLabels = [];
            }
            if (state.mode === 'caminho')
                this.#drawPath(graphics, geometry, state, cyan, violet);
            else if (state.mode === 'circuito')
                this.#drawCircuit(graphics, geometry, state, cyan, violet);
            else if (state.mode === 'sequencia')
                this.#drawSequence(graphics, geometry, state, cyan, violet);
            else
                this.#drawMaze(graphics, geometry, state, cyan, violet);
        }
        #drawPath(graphics, geometry, state, cyan, violet) {
            for (let index = 0; index < state.board.length; index += 1) {
                const row = Math.floor(index / geometry.size);
                const col = index % geometry.size;
                const x = geometry.x + col * geometry.cell;
                const y = geometry.y + row * geometry.cell;
                const cx = x + geometry.cell / 2;
                const cy = y + geometry.cell / 2;
                graphics.fillStyle(0x08192d, .96);
                graphics.fillRoundedRect(x + 3, y + 3, geometry.cell - 6, geometry.cell - 6, Math.max(5, geometry.cell * .1));
                graphics.lineStyle(Math.max(4, geometry.cell * .09), index === 0 || index === state.goalIndex ? violet : cyan, .9);
                const orientation = state.board[index] ?? 0;
                if (orientation % 2 === 0)
                    graphics.lineBetween(cx, y + geometry.cell * .18, cx, y + geometry.cell * .82);
                else
                    graphics.lineBetween(x + geometry.cell * .18, cy, x + geometry.cell * .82, cy);
                graphics.fillStyle(index === 0 ? 0x55ff9a : index === state.goalIndex ? 0xffd166 : cyan, 1);
                graphics.fillCircle(cx, cy, geometry.cell * .08);
            }
        }
        #drawCircuit(graphics, geometry, state, cyan, violet) {
            for (let index = 0; index < state.board.length; index += 1) {
                const row = Math.floor(index / geometry.size);
                const col = index % geometry.size;
                const x = geometry.x + col * geometry.cell;
                const y = geometry.y + row * geometry.cell;
                const active = state.board[index] === 1;
                graphics.fillStyle(active ? cyan : 0x101a2d, active ? .82 : .95);
                graphics.fillRoundedRect(x + 5, y + 5, geometry.cell - 10, geometry.cell - 10, geometry.cell * .15);
                graphics.lineStyle(2, active ? 0xffffff : violet, active ? .85 : .45);
                graphics.strokeRoundedRect(x + 7, y + 7, geometry.cell - 14, geometry.cell - 14, geometry.cell * .12);
                graphics.fillStyle(active ? 0xffffff : 0x53637b, 1);
                graphics.fillCircle(x + geometry.cell / 2, y + geometry.cell / 2, geometry.cell * .11);
            }
        }
        #drawSequence(graphics, geometry, state, cyan, violet) {
            const order = new Map(state.sequence.map((cell, index) => [cell, index + 1]));
            for (let index = 0; index < state.board.length; index += 1) {
                const row = Math.floor(index / geometry.size);
                const col = index % geometry.size;
                const x = geometry.x + col * geometry.cell;
                const y = geometry.y + row * geometry.cell;
                const sequenceNumber = order.get(index);
                const completed = sequenceNumber !== undefined && sequenceNumber <= state.sequenceCursor;
                graphics.fillStyle(completed ? 0x42f59b : sequenceNumber ? 0x172b4d : 0x0d1728, .96);
                graphics.fillRoundedRect(x + 5, y + 5, geometry.cell - 10, geometry.cell - 10, geometry.cell * .14);
                graphics.lineStyle(2, sequenceNumber ? (completed ? 0xffffff : cyan) : violet, sequenceNumber ? .8 : .25);
                graphics.strokeRoundedRect(x + 7, y + 7, geometry.cell - 14, geometry.cell - 14, geometry.cell * .12);
            }
            const scene = this.#scene;
            if (!scene)
                return;
            this.#sequenceLabels.forEach((label) => label.destroy());
            this.#sequenceLabels = [];
            for (const [cell, number] of order.entries()) {
                const row = Math.floor(cell / geometry.size);
                const col = cell % geometry.size;
                const label = scene.add.text(geometry.x + col * geometry.cell + geometry.cell / 2, geometry.y + row * geometry.cell + geometry.cell / 2, String(number), { color: number <= state.sequenceCursor ? '#06130c' : '#eaf8ff', fontFamily: 'ui-monospace, monospace', fontSize: `${Math.max(18, geometry.cell * .3)}px`, fontStyle: 'bold' }).setOrigin(.5);
                label.setDepth(10);
                this.#sequenceLabels.push(label);
            }
        }
        #drawMaze(graphics, geometry, state, cyan, violet) {
            for (let index = 0; index < state.board.length; index += 1) {
                const row = Math.floor(index / geometry.size);
                const col = index % geometry.size;
                const x = geometry.x + col * geometry.cell;
                const y = geometry.y + row * geometry.cell;
                const wall = state.board[index] === 1;
                graphics.fillStyle(wall ? 0x27334b : 0x07172a, 1);
                graphics.fillRect(x + 2, y + 2, geometry.cell - 4, geometry.cell - 4);
                if (!wall) {
                    graphics.lineStyle(1, cyan, .12);
                    graphics.strokeRect(x + 4, y + 4, geometry.cell - 8, geometry.cell - 8);
                }
                if (index === state.goalIndex) {
                    graphics.fillStyle(0xffd166, .9);
                    graphics.fillRoundedRect(x + geometry.cell * .22, y + geometry.cell * .22, geometry.cell * .56, geometry.cell * .56, geometry.cell * .12);
                }
            }
            const playerRow = Math.floor(state.playerIndex / geometry.size);
            const playerCol = state.playerIndex % geometry.size;
            graphics.fillStyle(violet, 1);
            graphics.fillCircle(geometry.x + playerCol * geometry.cell + geometry.cell / 2, geometry.y + playerRow * geometry.cell + geometry.cell / 2, geometry.cell * .28);
            graphics.lineStyle(3, 0xffffff, .9);
            graphics.strokeCircle(geometry.x + playerCol * geometry.cell + geometry.cell / 2, geometry.y + playerRow * geometry.cell + geometry.cell / 2, geometry.cell * .28);
        }
    }
    exports.PuzzleForgeRuntime = PuzzleForgeRuntime;
    function parseConfiguration(value) {
        const text = String(value ?? 'caminho-aprendiz');
        const [modeRaw, difficultyRaw] = text.split('-');
        const mode = modeRaw === 'circuito' || modeRaw === 'sequencia' || modeRaw === 'labirinto' ? modeRaw : 'caminho';
        const difficulty = difficultyRaw === 'desafio' ? 'desafio' : 'aprendiz';
        return { mode, difficulty };
    }
    function titleFor(mode) {
        return mode === 'caminho' ? 'PUZZLE FORGE DS · CAMINHOS ROTATIVOS' : mode === 'circuito' ? 'PUZZLE FORGE DS · CIRCUITOS LÓGICOS' : mode === 'sequencia' ? 'PUZZLE FORGE DS · SEQUÊNCIA DE MEMÓRIA' : 'PUZZLE FORGE DS · LABIRINTO 7×7';
    }
    function gridGeometry(mode, width, height) {
        const size = puzzle_forge_simulation_1.PUZZLE_GRID_SIZES[mode];
        const cell = Math.max(36, Math.min((width - 56) / size, (height - 130) / size));
        return { size, cell, x: (width - cell * size) / 2, y: 58 + (height - 120 - cell * size) / 2 };
    }
    
  };
  __modules["games/puzzle-forge/simulation/puzzle-forge-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PUZZLE_GRID_SIZES = exports.PuzzleForgeSimulation = void 0;
    exports.sanitizeMaze = sanitizeMaze;
    const PATH_SIZE = 5;
    const CIRCUIT_SIZE = 5;
    const SEQUENCE_SIZE = 4;
    const MAZE_SIZE = 7;
    const DEFAULT_MAZE = [
        '.......',
        '.###.#.',
        '...#.#.',
        '##.#...',
        '...###.',
        '.#.....',
        '...##..',
    ].join('');
    const PATH_TARGET = [
        1, 1, 1, 2, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 1, 1,
    ];
    const PATH_START = 0;
    const PATH_GOAL = 24;
    class PuzzleForgeSimulation {
        #state;
        constructor(mode = 'caminho', difficulty = 'aprendiz', customLayout) {
            this.#state = PuzzleForgeSimulation.initialState(mode, difficulty, customLayout);
        }
        static initialState(mode, difficulty, customLayout) {
            if (mode === 'caminho') {
                const scramble = difficulty === 'aprendiz'
                    ? PATH_TARGET.map((orientation, index) => index % 3 === 0 ? (orientation + 1) % 4 : orientation)
                    : PATH_TARGET.map((orientation, index) => (orientation + ((index * 3 + 1) % 4)) % 4);
                return baseState(mode, difficulty, scramble, [...PATH_TARGET], PATH_START, PATH_GOAL, [], 'Gire as peças para criar uma rota contínua do núcleo até a saída.');
            }
            if (mode === 'circuito') {
                const target = Array(CIRCUIT_SIZE * CIRCUIT_SIZE).fill(1);
                const board = difficulty === 'aprendiz'
                    ? [1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1]
                    : [0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
                return baseState(mode, difficulty, board, target, 0, board.length - 1, [], 'Ative todos os nós. Cada toque alterna a célula e seus vizinhos.');
            }
            if (mode === 'sequencia') {
                const sequence = difficulty === 'aprendiz' ? [0, 5, 10, 15, 6, 9] : [3, 12, 5, 10, 1, 14, 7, 8, 0, 15];
                return baseState(mode, difficulty, Array(SEQUENCE_SIZE * SEQUENCE_SIZE).fill(0), [], 0, 0, sequence, 'Repita a sequência indicada pelos números, na ordem correta.');
            }
            const maze = sanitizeMaze(customLayout);
            return baseState(mode, difficulty, [...maze].map((cell) => cell === '#' ? 1 : 0), [], 0, MAZE_SIZE * MAZE_SIZE - 1, [], 'Leve o marcador até a saída usando o menor caminho possível.');
        }
        get state() { return this.#state; }
        start() {
            if (this.#state.status === 'won' || this.#state.status === 'lost') {
                this.#state = PuzzleForgeSimulation.initialState(this.#state.mode, this.#state.difficulty, this.#state.mode === 'labirinto' ? this.#mazeLayout() : undefined);
            }
            this.#state = { ...this.#state, status: 'playing' };
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return;
            this.#state = { ...this.#state, elapsedMs: this.#state.elapsedMs + Math.min(100, Math.max(0, deltaMs)) };
        }
        select(index) {
            if (this.#state.status !== 'playing')
                return ['invalid'];
            if (this.#state.mode === 'caminho')
                return this.#rotatePath(index);
            if (this.#state.mode === 'circuito')
                return this.#toggleCircuit(index);
            if (this.#state.mode === 'sequencia')
                return this.#selectSequence(index);
            return ['invalid'];
        }
        move(direction) {
            if (this.#state.status !== 'playing' || this.#state.mode !== 'labirinto')
                return ['invalid'];
            const row = Math.floor(this.#state.playerIndex / MAZE_SIZE);
            const col = this.#state.playerIndex % MAZE_SIZE;
            const delta = direction === 'up' ? [-1, 0] : direction === 'down' ? [1, 0] : direction === 'left' ? [0, -1] : [0, 1];
            const nextRow = row + delta[0];
            const nextCol = col + delta[1];
            if (nextRow < 0 || nextRow >= MAZE_SIZE || nextCol < 0 || nextCol >= MAZE_SIZE)
                return this.#invalid('A borda do labirinto bloqueia esse movimento.');
            const next = nextRow * MAZE_SIZE + nextCol;
            if (this.#state.board[next] === 1)
                return this.#invalid('Há uma parede nessa direção.');
            const moves = this.#state.moves + 1;
            if (next === this.#state.goalIndex) {
                this.#state = { ...this.#state, playerIndex: next, moves, score: this.#finishScore(900), status: 'won', message: 'Saída encontrada. Labirinto concluído!' };
                return ['move', 'finished'];
            }
            this.#state = { ...this.#state, playerIndex: next, moves, score: this.#state.score + 15, message: 'Continue analisando as rotas disponíveis.' };
            return ['move'];
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Puzzle Forge incompatível');
            const expected = state.mode === 'caminho' || state.mode === 'circuito' ? 25 : state.mode === 'sequencia' ? 16 : 49;
            if (!Array.isArray(state.board) || state.board.length !== expected)
                throw new Error('Grade salva inválida');
            this.#state = { ...state, board: [...state.board], target: [...state.target], sequence: [...state.sequence] };
        }
        #rotatePath(index) {
            if (index < 0 || index >= PATH_SIZE * PATH_SIZE)
                return ['invalid'];
            const board = [...this.#state.board];
            board[index] = ((board[index] ?? 0) + 1) % 4;
            const moves = this.#state.moves + 1;
            const solved = board.every((value, cell) => value === this.#state.target[cell]);
            if (solved) {
                this.#state = { ...this.#state, board, moves, score: this.#finishScore(1100), status: 'won', message: 'Rota de energia conectada com sucesso!' };
                return ['rotate', 'finished'];
            }
            this.#state = { ...this.#state, board, moves, score: this.#state.score + 8, message: 'Peça girada. Verifique se os segmentos estão conectados.' };
            return ['rotate'];
        }
        #toggleCircuit(index) {
            if (index < 0 || index >= CIRCUIT_SIZE * CIRCUIT_SIZE)
                return ['invalid'];
            const board = [...this.#state.board];
            const row = Math.floor(index / CIRCUIT_SIZE);
            const col = index % CIRCUIT_SIZE;
            for (const [dr, dc] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]) {
                const rr = row + dr;
                const cc = col + dc;
                if (rr >= 0 && rr < CIRCUIT_SIZE && cc >= 0 && cc < CIRCUIT_SIZE) {
                    const cell = rr * CIRCUIT_SIZE + cc;
                    board[cell] = board[cell] === 1 ? 0 : 1;
                }
            }
            const moves = this.#state.moves + 1;
            if (board.every((value) => value === 1)) {
                this.#state = { ...this.#state, board, moves, score: this.#finishScore(1200), status: 'won', message: 'Todos os terminais receberam energia!' };
                return ['toggle', 'finished'];
            }
            this.#state = { ...this.#state, board, moves, score: this.#state.score + 10, message: 'Circuito alterado. Observe o efeito nos vizinhos.' };
            return ['toggle'];
        }
        #selectSequence(index) {
            if (index < 0 || index >= SEQUENCE_SIZE * SEQUENCE_SIZE)
                return ['invalid'];
            const expected = this.#state.sequence[this.#state.sequenceCursor];
            if (index !== expected) {
                const mistakes = this.#state.mistakes + 1;
                const lost = mistakes >= (this.#state.difficulty === 'aprendiz' ? 4 : 3);
                this.#state = {
                    ...this.#state,
                    mistakes,
                    sequenceCursor: 0,
                    moves: this.#state.moves + 1,
                    score: Math.max(0, this.#state.score - 60),
                    status: lost ? 'lost' : 'playing',
                    message: lost ? 'Limite de erros atingido. Tente novamente.' : 'Ordem incorreta. A sequência reiniciou.',
                };
                return lost ? ['invalid', 'finished'] : ['invalid'];
            }
            const cursor = this.#state.sequenceCursor + 1;
            const moves = this.#state.moves + 1;
            if (cursor === this.#state.sequence.length) {
                this.#state = { ...this.#state, sequenceCursor: cursor, moves, score: this.#finishScore(1000), status: 'won', message: 'Sequência completa. Memória lógica validada!' };
                return ['sequence-hit', 'finished'];
            }
            this.#state = { ...this.#state, sequenceCursor: cursor, moves, score: this.#state.score + 75, message: `Acerto ${cursor}/${this.#state.sequence.length}. Continue.` };
            return ['sequence-hit'];
        }
        #invalid(message) {
            this.#state = { ...this.#state, mistakes: this.#state.mistakes + 1, message };
            return ['invalid'];
        }
        #finishScore(base) {
            return Math.max(100, base + this.#state.score - this.#state.moves * 12 - this.#state.mistakes * 40 - Math.floor(this.#state.elapsedMs / 1000));
        }
        #mazeLayout() {
            return this.#state.board.map((cell) => cell === 1 ? '#' : '.').join('');
        }
    }
    exports.PuzzleForgeSimulation = PuzzleForgeSimulation;
    function baseState(mode, difficulty, board, target, playerIndex, goalIndex, sequence, message) {
        return {
            schemaVersion: 1,
            mode,
            difficulty,
            status: 'ready',
            board: [...board],
            target: [...target],
            playerIndex,
            goalIndex,
            sequence: [...sequence],
            sequenceCursor: 0,
            stage: 1,
            moves: 0,
            mistakes: 0,
            elapsedMs: 0,
            score: 0,
            message,
        };
    }
    function sanitizeMaze(layout) {
        if (!layout || layout.length !== MAZE_SIZE * MAZE_SIZE || [...layout].some((cell) => cell !== '.' && cell !== '#'))
            return DEFAULT_MAZE;
        const chars = [...layout];
        chars[0] = '.';
        chars[chars.length - 1] = '.';
        return chars.join('');
    }
    exports.PUZZLE_GRID_SIZES = { caminho: PATH_SIZE, circuito: CIRCUIT_SIZE, sequencia: SEQUENCE_SIZE, labirinto: MAZE_SIZE };
    
  };
  __modules["games/raster-rally/audio/raster-rally-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RasterRallyAudio = void 0;
    class RasterRallyAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const frequencies = {
                checkpoint: 620,
                'lap-complete': 760,
                'track-complete': 880,
                collision: 95,
                'off-road': 145,
                overtake: 520,
                victory: 1040,
                'game-over': 68,
            };
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = event === 'collision' || event === 'game-over' ? 'sawtooth' : event === 'off-road' ? 'triangle' : 'square';
            oscillator.frequency.setValueAtTime(frequencies[event], context.currentTime);
            if (event === 'checkpoint' || event === 'lap-complete' || event === 'track-complete') {
                oscillator.frequency.exponentialRampToValueAtTime(frequencies[event] * 1.45, context.currentTime + 0.16);
            }
            gain.gain.setValueAtTime(event === 'off-road' ? 0.022 : 0.045, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.21);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.RasterRallyAudio = RasterRallyAudio;
    
  };
  __modules["games/raster-rally/content/raster-rally-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RASTER_RALLY_COMPARISON = exports.RASTER_RALLY_PSEUDOCODE = exports.RASTER_RALLY_HISTORY = void 0;
    exports.RASTER_RALLY_HISTORY = {
        title: 'Quando a estrada parecia 3D antes dos polígonos',
        paragraphs: [
            'No começo dos anos 1980, máquinas de arcade ainda não desenhavam pistas com grandes quantidades de polígonos. A sensação de profundidade era criada projetando faixas horizontais, alterando a largura da estrada e escalando carros e objetos conforme a distância.',
            'Pole Position, desenvolvido pela Namco e lançado em 1982, tornou-se uma referência importante da corrida pseudo-3D ao combinar perspectiva de pista, classificação, cronômetro e um gabinete dedicado com volante e pedais.',
            'Raster Rally é um laboratório autoral do Fliperama DS. As três pistas, veículos, regras, paisagens, interface, áudio e código são próprios; a referência histórica é utilizada somente para explicar a evolução técnica do gênero.',
        ],
        sourceUrl: 'https://www.arcadearchives.com/en/title/aca-263/',
    };
    exports.RASTER_RALLY_PSEUDOCODE = `AO INICIAR UMA PISTA:
      carregar segmentos, voltas, clima e limite de tempo
      posicionar o veículo e criar rivais com velocidades próprias
    
    A CADA QUADRO:
      ler acelerador, freio e direção
      atualizar velocidade com aceleração, resistência e frenagem
      consultar curva, elevação e largura do segmento atual
      aplicar aderência e força centrífuga
      avançar a distância do veículo e dos rivais
    
    PARA DESENHAR A ESTRADA:
      percorrer segmentos do horizonte até a câmera
      projetar largura e altura de cada faixa pela profundidade
      acumular curvas para deslocar o centro da pista
      desenhar céu, terreno, acostamento, asfalto e marcações
      escalar rivais e objetos conforme a distância
    
    AO PASSAR UM CHECKPOINT:
      adicionar pontos e alguns segundos ao cronômetro
    
    AO CONCLUIR UMA VOLTA:
      registrar o tempo da volta
      preservar a melhor marca
    
    AO TERMINAR DUAS VOLTAS:
      liberar a próxima pista
      após a terceira pista, concluir o campeonato`;
    exports.RASTER_RALLY_COMPARISON = [
        ['Profundidade', 'Faixas raster e sprites escalados simulavam uma estrada tridimensional', 'Segmentos autorais são projetados em tempo real com largura, curva e elevação'],
        ['Controle', 'Gabinetes dedicados usavam volante, acelerador e freio', 'Teclado e toque alimentam ações normalizadas e independentes do renderizador'],
        ['Corrida', 'Cronômetro, classificação e rivais criavam pressão contínua', 'Três pistas, checkpoints, voltas, rivais, ultrapassagens e integridade do veículo'],
        ['Visual', 'Baixa resolução, paleta restrita e repetição de sprites', 'Modo Histórico reduz detalhes; modos DS acrescentam camadas, clima e partículas leves'],
        ['Lógica', 'Hardware e código específicos para arcade', 'Simulação TypeScript serializável, testada sem Phaser e desenhada sob demanda'],
        ['Identidade', 'Obra comercial histórica de 1982', 'Pistas, carros, paisagens, áudio, regras visuais e código próprios'],
    ];
    
  };
  __modules["games/raster-rally/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const raster_rally_runtime_1 = __require("games/raster-rally/phaser/raster-rally-runtime");
    function createRuntime() {
        return new raster_rally_runtime_1.RasterRallyRuntime();
    }
    
  };
  __modules["games/raster-rally/phaser/raster-rally-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RasterRallyRuntime = void 0;
    const raster_rally_audio_1 = __require("games/raster-rally/audio/raster-rally-audio");
    const raster_rally_simulation_1 = __require("games/raster-rally/simulation/raster-rally-simulation");
    const raster_rally_tracks_1 = __require("games/raster-rally/tracks/raster-rally-tracks");
    const OPPONENT_COLORS = [0xff5c7a, 0x4de7ff, 0xffcf58, 0x8cff88, 0xb88cff, 0xff8a55];
    class RasterRallyRuntime {
        id = 'raster-rally';
        state = 'not-loaded';
        #simulation = new raster_rally_simulation_1.RasterRallySimulation();
        #game;
        #graphics;
        #title;
        #statusText;
        #speedText;
        #timerText;
        #audio;
        #context;
        #left = false;
        #right = false;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new raster_rally_simulation_1.RasterRallySimulation(parseDifficulty(context.parameters?.difficulty));
            this.#audio = new raster_rally_audio_1.RasterRallyAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class RasterRallyScene extends Phaser.Scene {
                #view;
                constructor() { super('raster-rally'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    owner.#title = this.add.text(24, 18, '', {
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '20px',
                        fontStyle: 'bold',
                        color: '#eff7ff',
                    });
                    owner.#statusText = this.add.text(24, 48, '', {
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '14px',
                        color: '#c9daef',
                    });
                    owner.#speedText = this.add.text(24, 76, '', {
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        fontStyle: 'bold',
                        color: '#ffffff',
                    });
                    owner.#timerText = this.add.text(24, 102, '', {
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        color: '#ffffff',
                    });
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 1100,
                height: 700,
                backgroundColor: '#050812',
                transparent: false,
                scene: RasterRallyScene,
                render: {
                    antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo',
                    pixelArt: context.graphicsMode === 'historico',
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'victory' || current.status === 'game-over')
                this.#simulation.restart(current.difficulty);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve', detail: { track: this.#simulation.track.title, lap: this.#simulation.state.lap } });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#simulation.setThrottle(false);
            this.#simulation.setBrake(false);
            this.#simulation.setSteering(0);
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (!['playing', 'tutorial', 'paused'].includes(this.state))
                return;
            if (input.action === 'move-up')
                this.#simulation.setThrottle(input.active);
            if (input.action === 'move-down')
                this.#simulation.setBrake(input.active);
            if (input.action === 'move-left')
                this.#left = input.active;
            if (input.action === 'move-right')
                this.#right = input.active;
            this.#simulation.setSteering((this.#right ? 1 : 0) - (this.#left ? 1 : 0));
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'victory' || status === 'game-over' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#title = undefined;
            this.#statusText = undefined;
            this.#speedText = undefined;
            this.#timerText = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            const progressEvent = events.find((event) => !['off-road', 'victory', 'game-over'].includes(event));
            if (progressEvent) {
                this.#context?.onEvent?.({
                    type: 'progress',
                    detail: {
                        event: progressEvent,
                        track: current.trackIndex + 1,
                        trackTitle: this.#simulation.track.title,
                        lap: current.lap,
                        checkpoint: current.checkpoint,
                        score: current.score,
                        speed: Math.round(current.speed),
                        damage: current.damage,
                        overtakes: current.overtakes,
                        time: Math.ceil(current.remainingMs / 1000),
                    },
                });
            }
            if (events.includes('victory') || events.includes('game-over')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: events.includes('victory') ? 'player' : 'clock',
                        score: current.score,
                        track: current.trackIndex + 1,
                        lap: current.lap,
                        overtakes: current.overtakes,
                        damage: current.damage,
                        bestLap: current.bestLapMs ?? 0,
                    },
                });
            }
        }
        #redraw() {
            const graphics = this.#graphics;
            const scale = this.#game?.scale;
            if (graphics && scale)
                this.#draw(graphics, scale.width, scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const track = this.#simulation.track;
            const mode = this.#context?.graphicsMode ?? 'medio';
            const historical = mode === 'historico';
            const low = mode === 'baixo';
            const high = mode === 'alto' || mode === 'ultra';
            const horizon = height * (historical ? 0.39 : 0.36);
            const bottom = height + 4;
            const roadHeight = bottom - horizon;
            graphics.clear();
            this.#drawSky(graphics, width, horizon, track, historical, low);
            this.#drawBackdrop(graphics, width, horizon, track, state.elapsedMs, historical, low);
            const projections = this.#projectRoad(width, horizon, roadHeight, track, state.progress, state.lateral, historical, high);
            for (let index = projections.length - 2; index >= 0; index -= 1) {
                const far = projections[index + 1];
                const near = projections[index];
                const segment = track.segments[near.segmentIndex] ?? track.segments[0];
                const alternating = Math.floor((state.progress / track.segmentLength) + index) % 2 === 0;
                const roadColor = historical ? (alternating ? 0x444444 : 0x383838) : alternating ? track.road : shade(track.road, -12);
                const shoulderColor = historical ? (alternating ? 0xd7d7d7 : 0x8d8d8d) : alternating ? track.shoulder : shade(track.shoulder, -25);
                const grassColor = historical ? (alternating ? 0x121212 : 0x1b1b1b) : alternating ? track.ground : shade(track.ground, -10);
                graphics.fillStyle(grassColor, 1);
                graphics.fillPoints([
                    { x: 0, y: far.y }, { x: width, y: far.y }, { x: width, y: near.y }, { x: 0, y: near.y },
                ], true);
                graphics.fillStyle(shoulderColor, 1);
                graphics.fillPoints([
                    { x: far.center - far.halfWidth * 1.16, y: far.y },
                    { x: far.center + far.halfWidth * 1.16, y: far.y },
                    { x: near.center + near.halfWidth * 1.16, y: near.y },
                    { x: near.center - near.halfWidth * 1.16, y: near.y },
                ], true);
                graphics.fillStyle(roadColor, 1);
                graphics.fillPoints([
                    { x: far.center - far.halfWidth * segment.width, y: far.y },
                    { x: far.center + far.halfWidth * segment.width, y: far.y },
                    { x: near.center + near.halfWidth * segment.width, y: near.y },
                    { x: near.center - near.halfWidth * segment.width, y: near.y },
                ], true);
                if ((index + Math.floor(state.progress / track.segmentLength)) % 5 < 2) {
                    graphics.fillStyle(historical ? 0xf1f1f1 : 0xf7f5d4, 0.92);
                    const laneWidthFar = Math.max(1, far.halfWidth * 0.015);
                    const laneWidthNear = Math.max(1, near.halfWidth * 0.015);
                    for (const lane of [-1 / 3, 1 / 3]) {
                        graphics.fillPoints([
                            { x: far.center + far.halfWidth * lane - laneWidthFar, y: far.y },
                            { x: far.center + far.halfWidth * lane + laneWidthFar, y: far.y },
                            { x: near.center + near.halfWidth * lane + laneWidthNear, y: near.y },
                            { x: near.center + near.halfWidth * lane - laneWidthNear, y: near.y },
                        ], true);
                    }
                }
                if (!low && index % (historical ? 12 : 8) === 0) {
                    this.#drawScenery(graphics, near, segment.scenery, track, historical, index);
                }
            }
            this.#drawOpponents(graphics, projections, width, height, state, track, historical);
            this.#drawPlayerCar(graphics, width, height, state.lateral, track.accent, historical, state.damage);
            if (track.weather === 'rain' && !historical)
                this.#drawRain(graphics, width, height, state.elapsedMs, low ? 18 : high ? 56 : 34);
            if (track.weather === 'mist' && !historical)
                this.#drawMist(graphics, width, horizon, state.elapsedMs, low ? 2 : 5);
            const best = state.bestLapMs === null ? '--:--.--' : formatTime(state.bestLapMs);
            this.#title?.setText(`${track.title.toUpperCase()} · PISTA ${state.trackIndex + 1}/3 · VOLTA ${state.lap}/${track.laps}`);
            this.#statusText?.setText(`${state.message} · ultrapassagens ${state.overtakes} · integridade ${Math.max(0, 100 - state.damage)}%`);
            this.#speedText?.setText(`${String(Math.round(state.speed)).padStart(3, '0')} km/h`);
            this.#timerText?.setText(`TEMPO ${formatTime(state.remainingMs)} · MELHOR ${best}`);
            this.#statusText?.setWordWrapWidth(Math.max(260, width * 0.68));
        }
        #projectRoad(width, horizon, roadHeight, track, progress, lateral, historical, high) {
            const count = historical ? 58 : high ? 120 : 88;
            const cameraSegment = Math.floor(progress / track.segmentLength);
            const offset = (progress % track.segmentLength) / track.segmentLength;
            const projections = [];
            let curveOffset = -lateral * width * 0.22;
            let curveVelocity = 0;
            let baseElevation = (0, raster_rally_tracks_1.segmentAt)(track, progress).elevation;
            for (let index = 0; index <= count; index += 1) {
                const depth = index / count;
                const worldIndex = (cameraSegment + index) % track.segments.length;
                const segment = track.segments[worldIndex] ?? track.segments[0];
                const perspective = Math.pow(depth, 0.58);
                const y = horizon + roadHeight * (1 - perspective) - (segment.elevation - baseElevation) * roadHeight * (1 - depth) * 0.16;
                const halfWidth = width * (historical ? 0.43 : 0.46) * (1 - depth * 0.92);
                curveVelocity += segment.curve * (1 - depth) * 0.016;
                curveOffset += curveVelocity * width * 0.012;
                const center = width / 2 + curveOffset * (1 - depth * 0.58);
                projections.push({ center, halfWidth, y, segmentIndex: worldIndex });
                baseElevation += (segment.elevation - baseElevation) * 0.02;
            }
            if (offset > 0) {
                return projections.map((projection, index) => ({ ...projection, y: projection.y + Math.min(8, offset * index * 0.05) }));
            }
            return projections;
        }
        #drawSky(graphics, width, horizon, track, historical, low) {
            const bands = low || historical ? 5 : 18;
            for (let index = 0; index < bands; index += 1) {
                const t = index / Math.max(1, bands - 1);
                const color = historical ? shade(0x222222, Math.round(t * 24)) : mix(track.skyTop, track.skyBottom, t);
                graphics.fillStyle(color, 1);
                graphics.fillRect(0, (horizon / bands) * index, width, horizon / bands + 1);
            }
        }
        #drawBackdrop(graphics, width, horizon, track, elapsedMs, historical, low) {
            const accent = historical ? 0xbcbcbc : track.accent;
            graphics.fillStyle(historical ? 0x5d5d5d : mix(track.skyBottom, track.ground, 0.42), 1);
            const drift = Math.sin(elapsedMs / 5000) * 10;
            graphics.beginPath();
            graphics.moveTo(0, horizon);
            const peaks = low ? 8 : 15;
            for (let index = 0; index <= peaks; index += 1) {
                const x = (width / peaks) * index;
                const height = 18 + Math.abs(Math.sin(index * 1.77 + track.id.length)) * (low ? 30 : 62);
                graphics.lineTo(x + drift, horizon - height);
            }
            graphics.lineTo(width, horizon);
            graphics.closePath();
            graphics.fillPath();
            if (!low && track.id === 'aurora-coast') {
                graphics.fillStyle(historical ? 0xd8d8d8 : 0xffdc7a, 0.9);
                graphics.fillCircle(width * 0.79, horizon * 0.46, Math.min(width, horizon) * 0.055);
            }
            graphics.lineStyle(2, accent, historical ? 0.3 : 0.22);
            graphics.lineBetween(0, horizon - 1, width, horizon - 1);
        }
        #drawScenery(graphics, projection, scenery, track, historical, index) {
            const scale = Math.max(0.08, 1 - index / 120);
            const size = 10 + scale * 42;
            const side = index % 2 === 0 ? -1 : 1;
            const x = projection.center + side * projection.halfWidth * 1.42;
            const y = projection.y;
            const color = historical ? 0xc8c8c8 : scenery === 'coast' ? 0x52d2c2 : scenery === 'mountain' ? 0x8e9a8b : scenery === 'forest' ? 0x4d9b62 : track.accent;
            graphics.fillStyle(color, 0.95);
            if (scenery === 'forest' || scenery === 'coast') {
                graphics.fillRect(x - size * 0.08, y - size * 0.42, size * 0.16, size * 0.42);
                graphics.fillTriangle(x, y - size, x - size * 0.38, y - size * 0.35, x + size * 0.38, y - size * 0.35);
            }
            else if (scenery === 'city') {
                graphics.fillRect(x - size * 0.3, y - size, size * 0.6, size);
                graphics.fillStyle(historical ? 0x303030 : 0xffe36e, 0.8);
                graphics.fillRect(x - size * 0.15, y - size * 0.75, size * 0.1, size * 0.12);
                graphics.fillRect(x + size * 0.05, y - size * 0.52, size * 0.1, size * 0.12);
            }
            else {
                graphics.fillTriangle(x, y - size, x - size * 0.5, y, x + size * 0.5, y);
            }
        }
        #drawOpponents(graphics, projections, width, height, state, track, historical) {
            const totalLength = (0, raster_rally_tracks_1.trackLength)(track) * track.laps;
            const viewDistance = track.segmentLength * (projections.length - 1);
            const visible = state.opponents
                .map((opponent) => ({ opponent, distance: wrappedAhead(opponent.progress, state.progress, totalLength) }))
                .filter(({ distance }) => distance > 0 && distance < viewDistance)
                .sort((first, second) => second.distance - first.distance);
            for (const { opponent, distance } of visible) {
                const index = Math.min(projections.length - 1, Math.max(1, Math.floor(distance / track.segmentLength)));
                const projection = projections[index];
                const scale = Math.max(0.09, 1 - index / projections.length);
                const carWidth = width * 0.075 * scale;
                const carHeight = height * 0.11 * scale;
                const x = projection.center + opponent.lane * projection.halfWidth - carWidth / 2;
                const y = projection.y - carHeight;
                const color = historical ? 0xd8d8d8 : OPPONENT_COLORS[opponent.colorIndex % OPPONENT_COLORS.length];
                graphics.fillStyle(0x000000, 0.28);
                graphics.fillRoundedRect(x + carWidth * 0.08, y + carHeight * 0.12, carWidth, carHeight, carWidth * 0.12);
                graphics.fillStyle(color, 1);
                graphics.fillRoundedRect(x, y, carWidth, carHeight, carWidth * 0.16);
                graphics.fillStyle(historical ? 0x303030 : 0x10253b, 1);
                graphics.fillRect(x + carWidth * 0.18, y + carHeight * 0.18, carWidth * 0.64, carHeight * 0.24);
                graphics.fillStyle(historical ? 0xffffff : 0xffe565, 1);
                graphics.fillRect(x + carWidth * 0.13, y + carHeight * 0.73, carWidth * 0.16, carHeight * 0.12);
                graphics.fillRect(x + carWidth * 0.71, y + carHeight * 0.73, carWidth * 0.16, carHeight * 0.12);
            }
        }
        #drawPlayerCar(graphics, width, height, lateral, accent, historical, damage) {
            const carWidth = Math.min(160, width * 0.17);
            const carHeight = Math.min(105, height * 0.16);
            const x = width / 2 + lateral * width * 0.2 - carWidth / 2;
            const y = height - carHeight - Math.max(12, height * 0.025);
            const color = historical ? 0xf2f2f2 : damage > 72 ? 0xff6a66 : accent;
            graphics.fillStyle(0x000000, 0.38);
            graphics.fillEllipse(x + carWidth / 2, y + carHeight * 0.92, carWidth * 1.12, carHeight * 0.28);
            graphics.fillStyle(color, 1);
            graphics.fillRoundedRect(x, y + carHeight * 0.25, carWidth, carHeight * 0.68, carWidth * 0.16);
            graphics.fillStyle(historical ? 0x333333 : 0x102238, 1);
            graphics.fillRoundedRect(x + carWidth * 0.2, y, carWidth * 0.6, carHeight * 0.5, carWidth * 0.1);
            graphics.fillStyle(historical ? 0xffffff : 0x7fe9ff, 0.85);
            graphics.fillRect(x + carWidth * 0.28, y + carHeight * 0.1, carWidth * 0.44, carHeight * 0.19);
            graphics.fillStyle(0x090b0f, 1);
            graphics.fillRect(x + carWidth * 0.04, y + carHeight * 0.72, carWidth * 0.19, carHeight * 0.26);
            graphics.fillRect(x + carWidth * 0.77, y + carHeight * 0.72, carWidth * 0.19, carHeight * 0.26);
            graphics.fillStyle(historical ? 0xffffff : 0xff4e62, 1);
            graphics.fillRect(x + carWidth * 0.12, y + carHeight * 0.62, carWidth * 0.18, carHeight * 0.12);
            graphics.fillRect(x + carWidth * 0.7, y + carHeight * 0.62, carWidth * 0.18, carHeight * 0.12);
        }
        #drawRain(graphics, width, height, elapsedMs, count) {
            graphics.lineStyle(1, 0xbfe9ff, 0.42);
            for (let index = 0; index < count; index += 1) {
                const x = ((index * 83 + elapsedMs * 0.19) % (width + 60)) - 30;
                const y = ((index * 137 + elapsedMs * 0.43) % (height + 80)) - 40;
                graphics.lineBetween(x, y, x - 8, y + 20);
            }
        }
        #drawMist(graphics, width, horizon, elapsedMs, bands) {
            for (let index = 0; index < bands; index += 1) {
                const offset = Math.sin(elapsedMs / 2400 + index) * width * 0.04;
                graphics.fillStyle(0xd8edf3, 0.035 + index * 0.012);
                graphics.fillEllipse(width * (0.18 + index * 0.2) + offset, horizon * (0.74 + (index % 2) * 0.16), width * 0.42, horizon * 0.22);
            }
        }
    }
    exports.RasterRallyRuntime = RasterRallyRuntime;
    function parseDifficulty(value) {
        if (value === 'novato' || value === 'campeao')
            return value;
        return 'piloto';
    }
    function wrappedAhead(first, second, totalLength) {
        const direct = first - second;
        return direct >= 0 ? direct : direct + totalLength;
    }
    function formatTime(milliseconds) {
        const safe = Math.max(0, Math.round(milliseconds));
        const minutes = Math.floor(safe / 60_000);
        const seconds = Math.floor((safe % 60_000) / 1000);
        const hundredths = Math.floor((safe % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
    }
    function mix(first, second, amount) {
        const t = Math.min(1, Math.max(0, amount));
        const r = Math.round(((first >> 16) & 0xff) * (1 - t) + ((second >> 16) & 0xff) * t);
        const g = Math.round(((first >> 8) & 0xff) * (1 - t) + ((second >> 8) & 0xff) * t);
        const b = Math.round((first & 0xff) * (1 - t) + (second & 0xff) * t);
        return (r << 16) | (g << 8) | b;
    }
    function shade(color, delta) {
        const r = Math.min(255, Math.max(0, ((color >> 16) & 0xff) + delta));
        const g = Math.min(255, Math.max(0, ((color >> 8) & 0xff) + delta));
        const b = Math.min(255, Math.max(0, (color & 0xff) + delta));
        return (r << 16) | (g << 8) | b;
    }
    
  };
  __modules["games/raster-rally/simulation/raster-rally-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RasterRallySimulation = void 0;
    const raster_rally_tracks_1 = __require("games/raster-rally/tracks/raster-rally-tracks");
    const DIFFICULTIES = {
        novato: {
            acceleration: 70,
            brakePower: 125,
            maxSpeed: 255,
            grip: 2.3,
            offRoadGrip: 0.9,
            opponentCount: 4,
            opponentBoost: 0.88,
            timeScale: 1.22,
            damageLimit: 120,
        },
        piloto: {
            acceleration: 64,
            brakePower: 118,
            maxSpeed: 270,
            grip: 2,
            offRoadGrip: 0.75,
            opponentCount: 6,
            opponentBoost: 0.97,
            timeScale: 1,
            damageLimit: 100,
        },
        campeao: {
            acceleration: 60,
            brakePower: 112,
            maxSpeed: 282,
            grip: 1.72,
            offRoadGrip: 0.62,
            opponentCount: 8,
            opponentBoost: 1.035,
            timeScale: 0.91,
            damageLimit: 85,
        },
    };
    class RasterRallySimulation {
        #state;
        constructor(difficulty = 'piloto') {
            this.#state = this.#initialState(difficulty);
        }
        get state() {
            return cloneState(this.#state);
        }
        get track() {
            return raster_rally_tracks_1.RASTER_RALLY_TRACKS[this.#state.trackIndex] ?? raster_rally_tracks_1.RASTER_RALLY_TRACKS[0];
        }
        start() {
            if (this.#state.status === 'ready') {
                this.#state = { ...this.#state, status: 'playing', message: 'Acelere, complete as voltas e alcance a próxima pista.' };
            }
        }
        restart(difficulty = this.#state.difficulty) {
            this.#state = this.#initialState(difficulty);
            this.start();
        }
        setThrottle(active) {
            this.#state = { ...this.#state, throttle: active };
        }
        setBrake(active) {
            this.#state = { ...this.#state, brake: active };
        }
        setSteering(value) {
            this.#state = { ...this.#state, steering: clamp(value, -1, 1) };
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 100);
            const dt = safeDelta / 1000;
            const spec = DIFFICULTIES[this.#state.difficulty];
            const track = this.track;
            const length = (0, raster_rally_tracks_1.trackLength)(track);
            const previousProgress = this.#state.progress;
            const previousLap = Math.floor(previousProgress / length);
            const previousCheckpoint = checkpointIndex(previousProgress, length);
            const events = [];
            let speed = this.#state.speed;
            if (this.#state.throttle)
                speed += spec.acceleration * dt;
            else
                speed -= 27 * dt;
            if (this.#state.brake)
                speed -= spec.brakePower * dt;
            speed -= Math.max(0, speed - spec.maxSpeed) * 2.5 * dt;
            const segment = (0, raster_rally_tracks_1.segmentAt)(track, previousProgress);
            const roadLimit = Math.max(0.72, segment.width);
            const offRoad = Math.abs(this.#state.lateral) > roadLimit;
            if (offRoad)
                speed -= (58 + speed * 0.18) * dt;
            speed = clamp(speed, 0, spec.maxSpeed);
            const speedRatio = speed / spec.maxSpeed;
            const steeringPower = (offRoad ? spec.offRoadGrip : spec.grip) * (0.28 + speedRatio * 0.92);
            const centrifugal = segment.curve * speedRatio * speedRatio * 0.72;
            let lateral = this.#state.lateral + (this.#state.steering * steeringPower - centrifugal) * dt;
            lateral = clamp(lateral, -1.7, 1.7);
            const progress = previousProgress + speed * dt;
            const elapsedMs = this.#state.elapsedMs + safeDelta;
            const currentLapMs = this.#state.currentLapMs + safeDelta;
            const remainingMs = Math.max(0, this.#state.remainingMs - safeDelta);
            const collisionCooldownMs = Math.max(0, this.#state.collisionCooldownMs - safeDelta);
            const offRoadCooldownMs = Math.max(0, this.#state.offRoadCooldownMs - safeDelta);
            let damage = this.#state.damage;
            let score = this.#state.score + Math.round(speed * dt * (offRoad ? 0.14 : 0.24));
            let overtakes = this.#state.overtakes;
            const opponents = this.#advanceOpponents(this.#state.opponents, safeDelta, spec, track);
            let nextCollisionCooldown = collisionCooldownMs;
            for (const opponent of opponents) {
                const relative = shortestProgressDistance(opponent.progress, progress, length * track.laps);
                if (Math.abs(relative) < 12 && Math.abs(opponent.lane - lateral) < 0.32 && nextCollisionCooldown <= 0 && speed > 35) {
                    speed *= 0.54;
                    damage += 14;
                    lateral = clamp(lateral + (lateral <= opponent.lane ? -0.2 : 0.2), -1.7, 1.7);
                    nextCollisionCooldown = 900;
                    events.push('collision');
                    break;
                }
            }
            const previousAhead = this.#state.opponents.filter((opponent) => shortestProgressDistance(opponent.progress, previousProgress, length * track.laps) > 0).length;
            const nextAhead = opponents.filter((opponent) => shortestProgressDistance(opponent.progress, progress, length * track.laps) > 0).length;
            if (nextAhead < previousAhead) {
                overtakes += previousAhead - nextAhead;
                score += (previousAhead - nextAhead) * 300;
                events.push('overtake');
            }
            let nextOffRoadCooldown = offRoadCooldownMs;
            if (offRoad && nextOffRoadCooldown <= 0 && speed > 45) {
                nextOffRoadCooldown = 650;
                damage += 2;
                events.push('off-road');
            }
            let nextState = {
                ...this.#state,
                progress,
                speed,
                lateral,
                elapsedMs,
                remainingMs,
                score,
                damage,
                overtakes,
                currentLapMs,
                collisionCooldownMs: nextCollisionCooldown,
                offRoadCooldownMs: nextOffRoadCooldown,
                opponents,
                message: offRoad ? 'Fora da pista: reduza a velocidade e retorne ao asfalto.' : this.#state.message,
            };
            const nextCheckpoint = checkpointIndex(progress, length);
            if (nextCheckpoint !== previousCheckpoint && Math.floor(progress / length) === previousLap) {
                nextState = {
                    ...nextState,
                    checkpoint: nextCheckpoint,
                    score: nextState.score + 500,
                    remainingMs: Math.min(track.timeLimitMs * spec.timeScale, nextState.remainingMs + 5_000),
                    message: `Checkpoint ${nextCheckpoint}/4 alcançado.`,
                };
                events.push('checkpoint');
            }
            const completedLaps = Math.floor(progress / length);
            if (completedLaps > previousLap) {
                const finishedLapMs = currentLapMs;
                const bestLapMs = this.#state.bestLapMs === null ? finishedLapMs : Math.min(this.#state.bestLapMs, finishedLapMs);
                nextState = {
                    ...nextState,
                    lap: Math.min(track.laps, completedLaps + 1),
                    checkpoint: 0,
                    bestLapMs,
                    currentLapMs: 0,
                    score: nextState.score + 1_500,
                    message: `Volta ${Math.min(completedLaps, track.laps)}/${track.laps} concluída.`,
                };
                events.push('lap-complete');
            }
            if (progress >= length * track.laps) {
                if (this.#state.trackIndex < raster_rally_tracks_1.RASTER_RALLY_TRACKS.length - 1) {
                    nextState = this.#stateForNextTrack(nextState);
                    events.push('track-complete');
                }
                else {
                    nextState = {
                        ...nextState,
                        status: 'victory',
                        speed: 0,
                        throttle: false,
                        brake: false,
                        score: nextState.score + Math.round(nextState.remainingMs / 10) + 5_000,
                        message: 'Campeonato Raster concluído.',
                    };
                    events.push('victory');
                }
            }
            if (nextState.remainingMs <= 0 || nextState.damage >= spec.damageLimit) {
                nextState = {
                    ...nextState,
                    status: 'game-over',
                    speed: 0,
                    throttle: false,
                    brake: false,
                    message: nextState.remainingMs <= 0 ? 'O cronômetro chegou a zero.' : 'O veículo atingiu o limite de integridade.',
                };
                events.push('game-over');
            }
            this.#state = nextState;
            return deduplicate(events);
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Raster Rally incompatível');
            if (!(state.difficulty in DIFFICULTIES))
                throw new Error('Dificuldade salva inválida');
            if (!['ready', 'playing', 'victory', 'game-over'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (state.trackIndex < 0 || state.trackIndex >= raster_rally_tracks_1.RASTER_RALLY_TRACKS.length)
                throw new Error('Pista salva inválida');
            if (state.progress < 0 || state.speed < 0 || state.damage < 0 || state.remainingMs < 0)
                throw new Error('Progresso salvo inválido');
            this.#state = cloneState(state);
        }
        #initialState(difficulty) {
            const track = raster_rally_tracks_1.RASTER_RALLY_TRACKS[0];
            const spec = DIFFICULTIES[difficulty];
            return {
                schemaVersion: 1,
                difficulty,
                status: 'ready',
                trackIndex: 0,
                lap: 1,
                progress: 0,
                speed: 0,
                lateral: 0,
                steering: 0,
                throttle: false,
                brake: false,
                elapsedMs: 0,
                remainingMs: Math.round(track.timeLimitMs * spec.timeScale),
                score: 0,
                damage: 0,
                checkpoint: 0,
                overtakes: 0,
                bestLapMs: null,
                currentLapMs: 0,
                collisionCooldownMs: 0,
                offRoadCooldownMs: 0,
                opponents: createOpponents(track, spec, difficulty),
                message: 'Prepare o veículo para o Circuito Aurora.',
            };
        }
        #stateForNextTrack(state) {
            const trackIndex = state.trackIndex + 1;
            const track = raster_rally_tracks_1.RASTER_RALLY_TRACKS[trackIndex];
            const spec = DIFFICULTIES[state.difficulty];
            return {
                ...state,
                trackIndex,
                lap: 1,
                progress: 0,
                speed: Math.min(state.speed, spec.maxSpeed * 0.42),
                lateral: 0,
                checkpoint: 0,
                currentLapMs: 0,
                remainingMs: Math.round(track.timeLimitMs * spec.timeScale),
                opponents: createOpponents(track, spec, state.difficulty),
                collisionCooldownMs: 1_000,
                message: `${track.title} liberado.`,
                score: state.score + 2_500,
            };
        }
        #advanceOpponents(opponents, deltaMs, spec, track) {
            const totalLength = (0, raster_rally_tracks_1.trackLength)(track) * track.laps;
            return opponents.map((opponent, index) => {
                const segment = (0, raster_rally_tracks_1.segmentAt)(track, opponent.progress);
                const curvePenalty = Math.abs(segment.curve) * 0.07;
                const oscillation = Math.sin((opponent.progress / 180) + index * 1.9) * 0.035;
                const speed = opponent.speed * spec.opponentBoost * (1 - curvePenalty) + oscillation * 50;
                return {
                    ...opponent,
                    progress: Math.min(totalLength + 30, opponent.progress + Math.max(35, speed) * (deltaMs / 1000)),
                };
            });
        }
    }
    exports.RasterRallySimulation = RasterRallySimulation;
    function createOpponents(track, spec, difficulty) {
        const base = difficulty === 'novato' ? 150 : difficulty === 'piloto' ? 162 : 174;
        return Array.from({ length: spec.opponentCount }, (_, index) => ({
            id: `rival-${index + 1}`,
            progress: 150 + index * 92,
            lane: [-0.62, 0.48, -0.1, 0.7, -0.74, 0.18, 0.58, -0.42][index] ?? 0,
            speed: base + (index % 3) * 11 + track.segments.length * 0.06,
            colorIndex: index % 6,
        }));
    }
    function checkpointIndex(progress, length) {
        const lapProgress = ((progress % length) + length) % length;
        return Math.floor((lapProgress / length) * 4);
    }
    function shortestProgressDistance(first, second, totalLength) {
        const direct = first - second;
        const wrappedForward = direct + totalLength;
        const wrappedBackward = direct - totalLength;
        return [direct, wrappedForward, wrappedBackward].reduce((best, candidate) => Math.abs(candidate) < Math.abs(best) ? candidate : best, direct);
    }
    function deduplicate(events) {
        return [...new Set(events)];
    }
    function cloneState(state) {
        return {
            ...state,
            opponents: state.opponents.map((opponent) => ({ ...opponent })),
        };
    }
    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
    
  };
  __modules["games/raster-rally/tracks/raster-rally-tracks"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RASTER_RALLY_TRACKS = void 0;
    exports.trackLength = trackLength;
    exports.segmentAt = segmentAt;
    function repeat(count, curve, elevation, width, scenery) {
        return Array.from({ length: count }, () => ({ curve, elevation, width, scenery }));
    }
    function transition(count, fromCurve, toCurve, fromElevation, toElevation, width, scenery) {
        return Array.from({ length: count }, (_, index) => {
            const t = count <= 1 ? 1 : index / (count - 1);
            const eased = t * t * (3 - 2 * t);
            return {
                curve: fromCurve + (toCurve - fromCurve) * eased,
                elevation: fromElevation + (toElevation - fromElevation) * eased,
                width,
                scenery,
            };
        });
    }
    const auroraSegments = [
        ...repeat(18, 0, 0, 1, 'coast'),
        ...transition(12, 0, 0.75, 0, 0.15, 1, 'coast'),
        ...repeat(14, 0.75, 0.15, 0.96, 'coast'),
        ...transition(10, 0.75, -0.55, 0.15, 0.45, 0.96, 'city'),
        ...repeat(14, -0.55, 0.45, 0.9, 'city'),
        ...transition(12, -0.55, 0.2, 0.45, -0.1, 0.94, 'coast'),
        ...repeat(14, 0.2, -0.1, 1, 'coast'),
        ...transition(10, 0.2, 0, -0.1, 0, 1, 'coast'),
    ];
    const serraSegments = [
        ...repeat(12, 0, 0, 0.92, 'mountain'),
        ...transition(14, 0, 0.8, 0, 0.55, 0.88, 'mountain'),
        ...repeat(12, 0.8, 0.55, 0.86, 'mountain'),
        ...transition(10, 0.8, -0.9, 0.55, 0.85, 0.82, 'forest'),
        ...repeat(13, -0.9, 0.85, 0.8, 'forest'),
        ...transition(12, -0.9, 0.45, 0.85, 0.25, 0.82, 'mountain'),
        ...repeat(12, 0.45, 0.25, 0.88, 'mountain'),
        ...transition(10, 0.45, -0.35, 0.25, -0.35, 0.9, 'forest'),
        ...repeat(12, -0.35, -0.35, 0.94, 'forest'),
        ...transition(11, -0.35, 0, -0.35, 0, 0.92, 'mountain'),
    ];
    const tempestSegments = [
        ...repeat(10, 0, 0, 0.9, 'city'),
        ...transition(12, 0, -0.7, 0, 0.25, 0.86, 'city'),
        ...repeat(10, -0.7, 0.25, 0.82, 'city'),
        ...transition(10, -0.7, 0.95, 0.25, -0.15, 0.78, 'forest'),
        ...repeat(12, 0.95, -0.15, 0.78, 'forest'),
        ...transition(12, 0.95, -0.85, -0.15, 0.65, 0.76, 'mountain'),
        ...repeat(10, -0.85, 0.65, 0.74, 'mountain'),
        ...transition(10, -0.85, 0.7, 0.65, 0.15, 0.78, 'forest'),
        ...repeat(11, 0.7, 0.15, 0.8, 'forest'),
        ...transition(11, 0.7, -0.45, 0.15, -0.3, 0.84, 'city'),
        ...repeat(10, -0.45, -0.3, 0.88, 'city'),
        ...transition(10, -0.45, 0, -0.3, 0, 0.9, 'city'),
    ];
    exports.RASTER_RALLY_TRACKS = [
        {
            id: 'aurora-coast',
            title: 'Circuito Aurora',
            subtitle: 'Retas costeiras e curvas amplas ao entardecer',
            laps: 2,
            segmentLength: 55,
            timeLimitMs: 108_000,
            skyTop: 0x10245b,
            skyBottom: 0xff7b72,
            ground: 0x173f3a,
            road: 0x28313f,
            shoulder: 0xeed55b,
            accent: 0x57f2e5,
            weather: 'clear',
            segments: auroraSegments,
        },
        {
            id: 'serra-circuit',
            title: 'Circuito da Serra',
            subtitle: 'Subidas, descidas e curvas fechadas entre montanhas',
            laps: 2,
            segmentLength: 52,
            timeLimitMs: 124_000,
            skyTop: 0x14283d,
            skyBottom: 0x91b4c6,
            ground: 0x244b31,
            road: 0x30343a,
            shoulder: 0xff8c52,
            accent: 0x8bff8b,
            weather: 'mist',
            segments: serraSegments,
        },
        {
            id: 'tempest-run',
            title: 'Rota Tempestade',
            subtitle: 'Pista estreita, chuva leve e mudanças rápidas de direção',
            laps: 2,
            segmentLength: 50,
            timeLimitMs: 134_000,
            skyTop: 0x060c22,
            skyBottom: 0x344d68,
            ground: 0x182c2a,
            road: 0x202832,
            shoulder: 0x66c7ff,
            accent: 0xb997ff,
            weather: 'rain',
            segments: tempestSegments,
        },
    ];
    function trackLength(track) {
        return track.segments.length * track.segmentLength;
    }
    function segmentAt(track, distance) {
        const length = trackLength(track);
        const wrapped = ((distance % length) + length) % length;
        return track.segments[Math.floor(wrapped / track.segmentLength)] ?? track.segments[0];
    }
    
  };
  __modules["games/raycast-corridors/audio/raycast-corridors-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RaycastCorridorsAudio = void 0;
    class RaycastCorridorsAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted || this.#context)
                return;
            const Context = window.AudioContext ?? window.webkitAudioContext;
            if (Context)
                this.#context = new Context();
        }
        play(event) {
            if (this.#muted || !this.#context)
                return;
            const tones = {
                'key-collected': [620, 0.12, 'square'],
                'door-opened': [180, 0.18, 'sawtooth'],
                'terminal-activated': [420, 0.22, 'triangle'],
                'view-changed': [760, 0.06, 'sine'],
                damage: [90, 0.2, 'sawtooth'],
                'life-lost': [130, 0.32, 'square'],
                'exit-unlocked': [880, 0.35, 'triangle'],
                finished: [1040, 0.5, 'sine'],
            };
            const [frequency, duration, type] = tones[event];
            const oscillator = this.#context.createOscillator();
            const gain = this.#context.createGain();
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.0001, this.#context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, this.#context.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.#context.currentTime + duration);
            oscillator.connect(gain).connect(this.#context.destination);
            oscillator.start();
            oscillator.stop(this.#context.currentTime + duration + 0.02);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.RaycastCorridorsAudio = RaycastCorridorsAudio;
    
  };
  __modules["games/raycast-corridors/content/raycast-corridors-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RAYCAST_CORRIDORS_COMPARISON = exports.RAYCAST_CORRIDORS_PSEUDOCODE = exports.RAYCAST_CORRIDORS_HISTORY = void 0;
    exports.RAYCAST_CORRIDORS_HISTORY = {
        title: 'Quando um mapa 2D passou a parecer um mundo em primeira pessoa',
        paragraphs: [
            'No início dos anos 1990, técnicas de raycasting permitiram transformar grades bidimensionais em corredores vistos em primeira pessoa. Cada coluna da tela podia ser calculada emitindo um raio no mapa, medindo a distância até a parede e projetando uma faixa vertical proporcionalmente à proximidade.',
            'Esse método não criava um mundo poligonal completo: paredes permaneciam alinhadas à grade e pisos e tetos eram simplificados. Ainda assim, a sensação de profundidade, velocidade e exploração abriu uma ponte decisiva entre jogos 2D e ambientes 3D posteriores.',
            'Corredores Raycast é uma missão autoral. O mapa superior, a projeção em primeira pessoa e a tela dividida leem exatamente o mesmo estado; portas, chaves, terminais, colisões e extração continuam independentes do renderizador.',
        ],
        sourceUrl: 'https://www.computerhistory.org/timeline/graphics-games/',
    };
    exports.RAYCAST_CORRIDORS_PSEUDOCODE = `PARA CADA QUADRO:
      atualizar ângulo e posição no mapa 2D
      impedir entrada em paredes e portas fechadas
      coletar chaves e verificar zonas de risco
    
    PARA CADA COLUNA DA VISÃO:
      calcular o ângulo do raio dentro do campo de visão
      avançar pela grade com DDA até encontrar uma parede
      corrigir a distância perpendicular para evitar olho-de-peixe
      projetar a altura da faixa com base na distância
      aplicar cor, textura procedural e sombra conforme lado e profundidade
    
    AO INTERAGIR:
      se houver porta e uma chave disponível, abrir
      se houver terminal, ativar e registrar checkpoint
      liberar a extração após três terminais
    
    AO TROCAR VISÃO:
      preservar posição, inventário, portas e tempo
      alternar entre primeira pessoa, mapa e tela dividida`;
    exports.RAYCAST_CORRIDORS_COMPARISON = [
        ['Mundo', 'Mapa 2D em grade usado como geometria do cenário', 'A mesma matriz alimenta minimapa, colisões e projeção em primeira pessoa'],
        ['Projeção', 'Uma faixa vertical por raio emitido', 'Contagem de raios dinâmica conforme o modo gráfico e o tamanho da tela'],
        ['Distorção', 'Distância direta poderia causar efeito olho-de-peixe', 'Distância perpendicular corrigida pelo ângulo entre câmera e raio'],
        ['Texturas', 'Paredes e portas com padrões simples repetidos', 'Texturas procedurais próprias, sem arquivos pesados no núcleo'],
        ['Interação', 'Chaves, portas e interruptores em mapas compactos', 'Duas chaves, três terminais, checkpoints, pulsos e extração autoral'],
        ['Visão técnica', 'Jogador via apenas a câmera em muitos títulos', 'Primeira pessoa, mapa superior e tela dividida alternáveis em tempo real'],
        ['Identidade', 'Referência à evolução do gênero em 1992', 'Mapa, missão, símbolos, áudio, interface e código inteiramente próprios'],
    ];
    
  };
  __modules["games/raycast-corridors/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const raycast_corridors_runtime_1 = __require("games/raycast-corridors/phaser/raycast-corridors-runtime");
    function createRuntime() {
        return new raycast_corridors_runtime_1.RaycastCorridorsRuntime();
    }
    
  };
  __modules["games/raycast-corridors/phaser/raycast-corridors-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RaycastCorridorsRuntime = void 0;
    const raycast_corridors_audio_1 = __require("games/raycast-corridors/audio/raycast-corridors-audio");
    const raycast_corridors_simulation_1 = __require("games/raycast-corridors/simulation/raycast-corridors-simulation");
    class RaycastCorridorsRuntime {
        id = 'raycast-corridors';
        state = 'not-loaded';
        #simulation = new raycast_corridors_simulation_1.RaycastCorridorsSimulation();
        #game;
        #graphics;
        #title;
        #stats;
        #message;
        #audio;
        #context;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new raycast_corridors_simulation_1.RaycastCorridorsSimulation(parseDifficulty(context.parameters?.difficulty));
            this.#audio = new raycast_corridors_audio_1.RaycastCorridorsAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class RaycastScene extends Phaser.Scene {
                #view;
                constructor() { super('raycast-corridors'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    owner.#title = this.add.text(18, 14, '', { fontFamily: 'monospace', fontSize: '17px', color: '#dffaff', fontStyle: 'bold' }).setDepth(20);
                    owner.#stats = this.add.text(18, 40, '', { fontFamily: 'monospace', fontSize: '13px', color: '#84deff' }).setDepth(20);
                    owner.#message = this.add.text(18, this.scale.height - 36, '', { fontFamily: 'system-ui', fontSize: '13px', color: '#d5def0', wordWrap: { width: Math.max(240, this.scale.width - 36) } }).setDepth(20);
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 650,
                backgroundColor: '#02050b',
                transparent: false,
                scene: RaycastScene,
                render: { antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo', pixelArt: context.graphicsMode === 'historico' },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'won' || current.status === 'lost')
                this.#simulation.restart(current.difficulty);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve', detail: { difficulty: this.#simulation.state.difficulty } });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-up')
                this.#simulation.setMovement('forward', input.active);
            else if (input.action === 'move-down')
                this.#simulation.setMovement('backward', input.active);
            else if (input.action === 'move-left')
                this.#simulation.setMovement('turn-left', input.active);
            else if (input.action === 'move-right')
                this.#simulation.setMovement('turn-right', input.active);
            else if (input.action === 'interact' && input.active)
                this.#processEvents(this.#simulation.interact());
            else if (input.action === 'secondary-action' && input.active)
                this.#processEvents(this.#simulation.toggleView());
            this.#redraw();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'won' || status === 'lost' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            for (const event of events) {
                if (event === 'finished') {
                    this.state = 'finished';
                    this.#context?.onEvent?.({
                        type: 'finished',
                        detail: {
                            winner: current.status === 'won' ? 'player' : 'system',
                            score: current.score,
                            lives: current.lives,
                            keys: current.keys.length,
                            terminals: current.activeTerminals.length,
                            doors: current.openedDoors.length,
                            elapsed: Math.round(current.elapsedMs / 1000),
                        },
                    });
                }
                else {
                    this.#context?.onEvent?.({
                        type: 'progress',
                        detail: { event, score: current.score, lives: current.lives, keys: current.keys.length, terminals: current.activeTerminals.length, doors: current.openedDoors.length, view: current.viewMode },
                    });
                }
            }
        }
        #redraw() {
            if (this.#graphics && this.#game)
                this.#draw(this.#graphics, this.#game.scale.width, this.#game.scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            graphics.clear();
            graphics.fillStyle(0x02050b, 1);
            graphics.fillRect(0, 0, width, height);
            const contentTop = 72;
            const contentBottom = Math.max(contentTop + 200, height - 48);
            const contentHeight = contentBottom - contentTop;
            if (state.viewMode === 'map') {
                this.#drawMap(graphics, 0, contentTop, width, contentHeight, state, true);
            }
            else if (state.viewMode === 'split') {
                const mapWidth = width >= 760 ? Math.min(300, width * 0.32) : width;
                if (width >= 760) {
                    this.#drawFirstPerson(graphics, 0, contentTop, width - mapWidth, contentHeight, state);
                    this.#drawMap(graphics, width - mapWidth, contentTop, mapWidth, contentHeight, state, false);
                }
                else {
                    const firstHeight = contentHeight * 0.68;
                    this.#drawFirstPerson(graphics, 0, contentTop, width, firstHeight, state);
                    this.#drawMap(graphics, 0, contentTop + firstHeight, width, contentHeight - firstHeight, state, false);
                }
            }
            else {
                this.#drawFirstPerson(graphics, 0, contentTop, width, contentHeight, state);
                this.#drawMiniMap(graphics, width - Math.min(190, width * 0.34) - 12, contentTop + 12, Math.min(190, width * 0.34), Math.min(145, contentHeight * 0.32), state);
            }
            this.#title?.setText(`CORREDORES RAYCAST · ${state.viewMode === 'first-person' ? '1ª PESSOA' : state.viewMode === 'split' ? 'TELA DIVIDIDA' : 'MAPA TÉCNICO'}`);
            this.#stats?.setText(`PONTOS ${state.score}   VIDAS ${state.lives}   CHAVES ${state.keys.length}/${raycast_corridors_simulation_1.RAYCAST_KEYS_TOTAL}   TERMINAIS ${state.activeTerminals.length}/${raycast_corridors_simulation_1.RAYCAST_TERMINALS_REQUIRED}   TEMPO ${Math.ceil(state.remainingMs / 1000)}s`);
            this.#message?.setText(state.message).setPosition(18, Math.max(76, height - 35));
        }
        #drawFirstPerson(graphics, x, y, width, height, state) {
            const historical = this.#context?.graphicsMode === 'historico';
            graphics.fillStyle(historical ? 0x050505 : 0x071122, 1);
            graphics.fillRect(x, y, width, height / 2);
            graphics.fillStyle(historical ? 0x151515 : 0x111620, 1);
            graphics.fillRect(x, y + height / 2, width, height / 2);
            if (!historical && this.#context?.graphicsMode !== 'baixo') {
                graphics.lineStyle(1, 0x4de7ff, 0.08);
                for (let line = 1; line < 7; line += 1) {
                    const ratio = line / 7;
                    const floorY = y + height / 2 + (height / 2) * ratio * ratio;
                    graphics.lineBetween(x, floorY, x + width, floorY);
                }
            }
            const rayCount = this.#rayCount(width);
            const rays = (0, raycast_corridors_simulation_1.castView)(state, rayCount);
            const columnWidth = width / rayCount;
            rays.forEach((hit, index) => {
                const wallHeight = Math.min(height * 1.5, height / hit.correctedDistance);
                const top = y + height / 2 - wallHeight / 2;
                const distanceShade = Math.max(0.18, 1 - hit.correctedDistance / 18);
                const sideShade = hit.side === 'horizontal' ? 0.72 : 1;
                const base = hit.tile === 'D' ? [0xe08a3b, 0x9a5027] : historical ? [0xe8e8e8, 0x858585] : [0x48d6ff, 0x244a8c];
                const stripe = Math.floor(hit.textureOffset * 8) % 2 === 0;
                const color = stripe ? base[0] : base[1];
                graphics.fillStyle(color, distanceShade * sideShade);
                graphics.fillRect(x + index * columnWidth, top, Math.ceil(columnWidth + 0.5), wallHeight);
                if (!historical && this.#context?.graphicsMode !== 'baixo' && stripe) {
                    graphics.fillStyle(0xe8fbff, 0.055 * distanceShade);
                    graphics.fillRect(x + index * columnWidth, top, Math.max(1, columnWidth * 0.22), wallHeight);
                }
            });
            this.#drawProjectedObjects(graphics, x, y, width, height, state, rays);
            graphics.lineStyle(1, historical ? 0xffffff : 0x7deaff, 0.65);
            graphics.lineBetween(x + width / 2 - 8, y + height / 2, x + width / 2 + 8, y + height / 2);
            graphics.lineBetween(x + width / 2, y + height / 2 - 8, x + width / 2, y + height / 2 + 8);
        }
        #drawProjectedObjects(graphics, x, y, width, height, state, rays) {
            const objects = [];
            for (let row = 0; row < raycast_corridors_simulation_1.RAYCAST_ROWS; row += 1)
                for (let column = 0; column < raycast_corridors_simulation_1.RAYCAST_COLUMNS; column += 1) {
                    const tile = (0, raycast_corridors_simulation_1.tileAt)(column, row);
                    const key = (0, raycast_corridors_simulation_1.pointKey)(column, row);
                    if (tile === 'K' && !state.keys.includes(key))
                        objects.push({ column, row, tile });
                    else if (tile === 'T' && !state.activeTerminals.includes(key))
                        objects.push({ column, row, tile });
                    else if (tile === 'E')
                        objects.push({ column, row, tile });
                    else if (tile === 'H')
                        objects.push({ column, row, tile });
                }
            const fov = Math.PI / 3;
            objects.map((object) => {
                const dx = object.column + 0.5 - state.player.x;
                const dy = object.row + 0.5 - state.player.y;
                const distance = Math.hypot(dx, dy);
                let relative = Math.atan2(dy, dx) - state.player.angle;
                while (relative > Math.PI)
                    relative -= Math.PI * 2;
                while (relative < -Math.PI)
                    relative += Math.PI * 2;
                return { ...object, distance, relative };
            }).filter((object) => Math.abs(object.relative) < fov * 0.55 && object.distance > 0.25)
                .sort((a, b) => b.distance - a.distance)
                .forEach((object) => {
                const screenX = x + width * (0.5 + object.relative / fov);
                const rayIndex = Math.max(0, Math.min(rays.length - 1, Math.floor((screenX - x) / width * rays.length)));
                if (rays[rayIndex].distance < object.distance - 0.35)
                    return;
                const size = Math.min(height * 0.42, height / object.distance * 0.72);
                const baseY = y + height / 2 + size * 0.45;
                const color = object.tile === 'K' ? 0xffdd67 : object.tile === 'T' ? 0x63f5b8 : object.tile === 'E' ? 0xd16cff : 0xff536b;
                graphics.fillStyle(color, object.tile === 'H' && !(0, raycast_corridors_simulation_1.hazardActive)(state.elapsedMs, 1600) ? 0.25 : 0.92);
                if (object.tile === 'K') {
                    graphics.fillCircle(screenX, baseY - size * 0.48, size * 0.18);
                    graphics.fillRect(screenX - size * 0.05, baseY - size * 0.48, size * 0.1, size * 0.45);
                    graphics.fillRect(screenX, baseY - size * 0.18, size * 0.2, size * 0.08);
                }
                else if (object.tile === 'T') {
                    graphics.fillRoundedRect(screenX - size * 0.2, baseY - size * 0.72, size * 0.4, size * 0.72, size * 0.06);
                    graphics.fillStyle(0x08121c, 1);
                    graphics.fillRect(screenX - size * 0.12, baseY - size * 0.62, size * 0.24, size * 0.22);
                }
                else if (object.tile === 'E') {
                    graphics.lineStyle(Math.max(2, size * 0.05), color, 0.9);
                    graphics.strokeRoundedRect(screenX - size * 0.28, baseY - size * 0.86, size * 0.56, size * 0.86, size * 0.22);
                }
                else {
                    graphics.fillTriangle(screenX, baseY - size * 0.68, screenX - size * 0.22, baseY, screenX + size * 0.22, baseY);
                }
            });
        }
        #drawMap(graphics, x, y, width, height, state, detailed) {
            graphics.fillStyle(0x040914, 1);
            graphics.fillRect(x, y, width, height);
            const padding = detailed ? 28 : 12;
            const tileSize = Math.max(3, Math.min((width - padding * 2) / raycast_corridors_simulation_1.RAYCAST_COLUMNS, (height - padding * 2) / raycast_corridors_simulation_1.RAYCAST_ROWS));
            const mapWidth = tileSize * raycast_corridors_simulation_1.RAYCAST_COLUMNS;
            const mapHeight = tileSize * raycast_corridors_simulation_1.RAYCAST_ROWS;
            const originX = x + (width - mapWidth) / 2;
            const originY = y + (height - mapHeight) / 2;
            for (let row = 0; row < raycast_corridors_simulation_1.RAYCAST_ROWS; row += 1)
                for (let column = 0; column < raycast_corridors_simulation_1.RAYCAST_COLUMNS; column += 1) {
                    const tile = raycast_corridors_simulation_1.RAYCAST_MAP[row][column];
                    const key = (0, raycast_corridors_simulation_1.pointKey)(column, row);
                    const cellX = originX + column * tileSize;
                    const cellY = originY + row * tileSize;
                    if (tile === '#') {
                        graphics.fillStyle(0x17345d, 1);
                        graphics.fillRect(cellX, cellY, tileSize + 0.4, tileSize + 0.4);
                    }
                    else if (tile === 'D' && !state.openedDoors.includes(key)) {
                        graphics.fillStyle(0xd57935, 1);
                        graphics.fillRect(cellX, cellY, tileSize, tileSize);
                    }
                    else if (tile === 'K' && !state.keys.includes(key)) {
                        graphics.fillStyle(0xffdd67, 1);
                        graphics.fillCircle(cellX + tileSize / 2, cellY + tileSize / 2, tileSize * 0.28);
                    }
                    else if (tile === 'T') {
                        graphics.fillStyle(state.activeTerminals.includes(key) ? 0x5cf3ac : 0x2b7f78, 1);
                        graphics.fillRect(cellX + tileSize * 0.2, cellY + tileSize * 0.2, tileSize * 0.6, tileSize * 0.6);
                    }
                    else if (tile === 'E') {
                        graphics.lineStyle(Math.max(1, tileSize * 0.16), 0xd16cff, 1);
                        graphics.strokeRect(cellX + tileSize * 0.1, cellY + tileSize * 0.1, tileSize * 0.8, tileSize * 0.8);
                    }
                    else if (tile === 'H') {
                        graphics.fillStyle((0, raycast_corridors_simulation_1.hazardActive)(state.elapsedMs, 1600) ? 0xff536b : 0x512a43, 1);
                        graphics.fillTriangle(cellX + tileSize / 2, cellY + tileSize * 0.1, cellX + tileSize * 0.1, cellY + tileSize * 0.9, cellX + tileSize * 0.9, cellY + tileSize * 0.9);
                    }
                }
            const playerX = originX + state.player.x * tileSize;
            const playerY = originY + state.player.y * tileSize;
            graphics.fillStyle(0xeaffff, 1);
            graphics.fillCircle(playerX, playerY, Math.max(2.5, tileSize * 0.34));
            graphics.lineStyle(Math.max(1, tileSize * 0.12), 0x68e7ff, 1);
            graphics.lineBetween(playerX, playerY, playerX + Math.cos(state.player.angle) * tileSize * 1.2, playerY + Math.sin(state.player.angle) * tileSize * 1.2);
            if (detailed) {
                const rays = (0, raycast_corridors_simulation_1.castView)(state, 31);
                graphics.lineStyle(1, 0x68e7ff, 0.15);
                rays.forEach((ray) => graphics.lineBetween(playerX, playerY, originX + (state.player.x + Math.cos(ray.rayAngle) * ray.distance) * tileSize, originY + (state.player.y + Math.sin(ray.rayAngle) * ray.distance) * tileSize));
            }
        }
        #drawMiniMap(graphics, x, y, width, height, state) {
            graphics.fillStyle(0x02050b, 0.86);
            graphics.fillRoundedRect(x, y, width, height, 8);
            this.#drawMap(graphics, x + 4, y + 4, width - 8, height - 8, state, false);
            graphics.lineStyle(1, 0x68e7ff, 0.55);
            graphics.strokeRoundedRect(x, y, width, height, 8);
        }
        #rayCount(width) {
            const mode = this.#context?.graphicsMode ?? 'medio';
            if (mode === 'baixo')
                return Math.max(72, Math.min(112, Math.floor(width / 7)));
            if (mode === 'historico')
                return Math.max(96, Math.min(160, Math.floor(width / 5)));
            if (mode === 'alto')
                return Math.max(180, Math.min(300, Math.floor(width / 3)));
            if (mode === 'ultra')
                return Math.max(240, Math.min(420, Math.floor(width / 2.2)));
            return Math.max(128, Math.min(220, Math.floor(width / 4)));
        }
    }
    exports.RaycastCorridorsRuntime = RaycastCorridorsRuntime;
    function parseDifficulty(value) {
        return value === 'explorador' || value === 'arquiteto' ? value : 'operador';
    }
    
  };
  __modules["games/raycast-corridors/simulation/raycast-corridors-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RaycastCorridorsSimulation = exports.RAYCAST_KEYS_TOTAL = exports.RAYCAST_TERMINALS_REQUIRED = exports.RAYCAST_ROWS = exports.RAYCAST_COLUMNS = exports.RAYCAST_MAP = void 0;
    exports.castRay = castRay;
    exports.castView = castView;
    exports.tileAt = tileAt;
    exports.pointKey = pointKey;
    exports.isSolid = isSolid;
    exports.normalizeAngle = normalizeAngle;
    exports.hazardActive = hazardActive;
    exports.RAYCAST_MAP = [
        '########################',
        '#S....#......#.........#',
        '#.##..#.####.#.#####.#.#',
        '#....K#....#.#.....#.#.#',
        '#######.##.#.#####.#.#.#',
        '#.......##.#.....#.#...#',
        '#.#####....#####.#.###.#',
        '#.#...D....#...#.#...#.#',
        '#.#.#####T.#.#.#.###.#.#',
        '#.#.....####.#.#.....#.#',
        '#.#####......#.#####.#.#',
        '#.....#.######..H..#.#.#',
        '#.###.#.#....#####.#.#.#',
        '#T..#...#..K.....#...#.#',
        '###.#####.######.#####.#',
        '#...D.....#....T.......#',
        '#.........#....H.....E.#',
        '########################',
    ];
    exports.RAYCAST_COLUMNS = exports.RAYCAST_MAP[0].length;
    exports.RAYCAST_ROWS = exports.RAYCAST_MAP.length;
    exports.RAYCAST_TERMINALS_REQUIRED = 3;
    exports.RAYCAST_KEYS_TOTAL = 2;
    const DIFFICULTIES = {
        explorador: { lives: 5, timeMs: 360_000, moveSpeed: 2.35, turnSpeed: 2.25, hazardPeriodMs: 2100 },
        operador: { lives: 4, timeMs: 300_000, moveSpeed: 2.55, turnSpeed: 2.5, hazardPeriodMs: 1650 },
        arquiteto: { lives: 3, timeMs: 240_000, moveSpeed: 2.7, turnSpeed: 2.75, hazardPeriodMs: 1250 },
    };
    const START = { x: 1.5, y: 1.5, angle: 0 };
    const FOV = Math.PI / 3;
    class RaycastCorridorsSimulation {
        #state;
        constructor(difficulty = 'operador') {
            this.#state = initialState(difficulty);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing', message: 'Localize duas chaves, ative três terminais e alcance a extração.' };
        }
        restart(difficulty = this.#state.difficulty) {
            this.#state = initialState(difficulty);
            this.start();
        }
        setMovement(action, active) {
            if (this.#state.status !== 'playing')
                return;
            const property = action === 'forward' ? 'moveForward' : action === 'backward' ? 'moveBackward' : action === 'turn-left' ? 'turnLeft' : 'turnRight';
            this.#state = { ...this.#state, [property]: active };
        }
        toggleView() {
            if (this.#state.status !== 'playing')
                return [];
            const viewMode = this.#state.viewMode === 'first-person' ? 'split' : this.#state.viewMode === 'split' ? 'map' : 'first-person';
            this.#state = { ...this.#state, viewMode, score: this.#state.score + 5, message: `Visualização alterada para ${viewMode === 'first-person' ? 'primeira pessoa' : viewMode === 'split' ? 'tela dividida' : 'mapa técnico'}.` };
            return ['view-changed'];
        }
        interact() {
            if (this.#state.status !== 'playing')
                return [];
            const events = [];
            const targetX = Math.floor(this.#state.player.x + Math.cos(this.#state.player.angle) * 0.85);
            const targetY = Math.floor(this.#state.player.y + Math.sin(this.#state.player.angle) * 0.85);
            const key = pointKey(targetX, targetY);
            const tile = tileAt(targetX, targetY);
            if (tile === 'D' && !this.#state.openedDoors.includes(key)) {
                const availableKeys = this.#state.keys.length - this.#state.openedDoors.length;
                if (availableKeys <= 0) {
                    this.#state = { ...this.#state, message: 'Porta bloqueada: encontre uma chave de acesso.' };
                    return [];
                }
                this.#state = { ...this.#state, openedDoors: [...this.#state.openedDoors, key], score: this.#state.score + 175, message: 'Porta de dados aberta. A geometria do mapa foi atualizada.' };
                events.push('door-opened');
            }
            else if (tile === 'T' && !this.#state.activeTerminals.includes(key)) {
                const activeTerminals = [...this.#state.activeTerminals, key];
                const unlocked = activeTerminals.length >= exports.RAYCAST_TERMINALS_REQUIRED && this.#state.activeTerminals.length < exports.RAYCAST_TERMINALS_REQUIRED;
                this.#state = {
                    ...this.#state,
                    activeTerminals,
                    checkpoint: { ...this.#state.player },
                    score: this.#state.score + 350,
                    remainingMs: Math.min(DIFFICULTIES[this.#state.difficulty].timeMs, this.#state.remainingMs + 18_000),
                    message: unlocked ? 'Todos os terminais ativos: a rota de extração foi liberada.' : `Terminal ${activeTerminals.length}/${exports.RAYCAST_TERMINALS_REQUIRED} sincronizado e salvo como checkpoint.`,
                };
                events.push('terminal-activated');
                if (unlocked)
                    events.push('exit-unlocked');
            }
            else {
                this.#state = { ...this.#state, message: 'Nenhum dispositivo interativo à frente.' };
            }
            return events;
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const dtMs = Math.min(Math.max(deltaMs, 0), 50);
            const dt = dtMs / 1000;
            const spec = DIFFICULTIES[this.#state.difficulty];
            const events = [];
            let state = {
                ...this.#state,
                elapsedMs: this.#state.elapsedMs + dtMs,
                remainingMs: Math.max(0, this.#state.remainingMs - dtMs),
                damageCooldownMs: Math.max(0, this.#state.damageCooldownMs - dtMs),
            };
            const turn = (state.turnRight ? 1 : 0) - (state.turnLeft ? 1 : 0);
            const angle = normalizeAngle(state.player.angle + turn * spec.turnSpeed * dt);
            const direction = (state.moveForward ? 1 : 0) - (state.moveBackward ? 1 : 0);
            let x = state.player.x;
            let y = state.player.y;
            if (direction !== 0) {
                const distance = direction * spec.moveSpeed * dt;
                const nextX = x + Math.cos(angle) * distance;
                const nextY = y + Math.sin(angle) * distance;
                if (!isSolid(nextX, y, state.openedDoors))
                    x = nextX;
                if (!isSolid(x, nextY, state.openedDoors))
                    y = nextY;
            }
            state = { ...state, player: { x, y, angle }, steps: state.steps + (direction !== 0 ? 1 : 0) };
            const cellX = Math.floor(x);
            const cellY = Math.floor(y);
            const cellKey = pointKey(cellX, cellY);
            const tile = tileAt(cellX, cellY);
            if (tile === 'K' && !state.keys.includes(cellKey)) {
                state = { ...state, keys: [...state.keys, cellKey], score: state.score + 225, message: `Chave ${state.keys.length + 1}/${exports.RAYCAST_KEYS_TOTAL} coletada.` };
                events.push('key-collected');
            }
            if (tile === 'H' && state.damageCooldownMs <= 0 && hazardActive(state.elapsedMs, spec.hazardPeriodMs)) {
                const lives = state.lives - 1;
                events.push('damage');
                if (lives <= 0) {
                    state = { ...state, lives: 0, status: 'lost', message: 'A defesa do complexo encerrou a missão.' };
                    events.push('finished');
                }
                else {
                    state = { ...state, lives, player: { ...state.checkpoint }, damageCooldownMs: 1600, score: Math.max(0, state.score - 120), message: `Pulso de segurança detectado. Retorno ao checkpoint com ${lives} vidas.` };
                    events.push('life-lost');
                }
            }
            if (tile === 'E') {
                if (state.activeTerminals.length >= exports.RAYCAST_TERMINALS_REQUIRED) {
                    state = { ...state, status: 'won', score: state.score + 1200 + Math.floor(state.remainingMs / 100), message: 'Extração concluída: o mapa 2D gerou uma missão completa em primeira pessoa.' };
                    events.push('finished');
                }
                else {
                    state = { ...state, message: `Extração bloqueada: faltam ${exports.RAYCAST_TERMINALS_REQUIRED - state.activeTerminals.length} terminais.` };
                }
            }
            if (state.remainingMs <= 0 && state.status === 'playing') {
                state = { ...state, status: 'lost', message: 'Tempo de missão esgotado.' };
                events.push('finished');
            }
            this.#state = state;
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save dos Corredores Raycast incompatível');
            if (!(state.difficulty in DIFFICULTIES))
                throw new Error('Dificuldade salva inválida');
            if (!['ready', 'playing', 'won', 'lost'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (isSolid(state.player.x, state.player.y, state.openedDoors))
                throw new Error('Posição salva inválida');
            this.#state = cloneState(state);
        }
    }
    exports.RaycastCorridorsSimulation = RaycastCorridorsSimulation;
    function castRay(state, rayAngle, cameraAngle = state.player.angle, maxDistance = 32) {
        const posX = state.player.x;
        const posY = state.player.y;
        const dirX = Math.cos(rayAngle);
        const dirY = Math.sin(rayAngle);
        let mapX = Math.floor(posX);
        let mapY = Math.floor(posY);
        const deltaX = Math.abs(1 / (Math.abs(dirX) < 1e-9 ? 1e-9 : dirX));
        const deltaY = Math.abs(1 / (Math.abs(dirY) < 1e-9 ? 1e-9 : dirY));
        const stepX = dirX < 0 ? -1 : 1;
        const stepY = dirY < 0 ? -1 : 1;
        let sideX = dirX < 0 ? (posX - mapX) * deltaX : (mapX + 1 - posX) * deltaX;
        let sideY = dirY < 0 ? (posY - mapY) * deltaY : (mapY + 1 - posY) * deltaY;
        let side = 'vertical';
        let tile = '#';
        let distance = maxDistance;
        for (let iterations = 0; iterations < 128; iterations += 1) {
            if (sideX < sideY) {
                sideX += deltaX;
                mapX += stepX;
                side = 'vertical';
            }
            else {
                sideY += deltaY;
                mapY += stepY;
                side = 'horizontal';
            }
            tile = tileAt(mapX, mapY);
            if (tile === '#' || (tile === 'D' && !state.openedDoors.includes(pointKey(mapX, mapY)))) {
                distance = side === 'vertical'
                    ? (mapX - posX + (1 - stepX) / 2) / (Math.abs(dirX) < 1e-9 ? 1e-9 : dirX)
                    : (mapY - posY + (1 - stepY) / 2) / (Math.abs(dirY) < 1e-9 ? 1e-9 : dirY);
                break;
            }
        }
        distance = Math.min(maxDistance, Math.max(0.0001, Math.abs(distance)));
        const hitX = posX + dirX * distance;
        const hitY = posY + dirY * distance;
        const textureOffset = side === 'vertical' ? hitY - Math.floor(hitY) : hitX - Math.floor(hitX);
        return {
            distance,
            correctedDistance: Math.max(0.0001, distance * Math.cos(rayAngle - cameraAngle)),
            tile,
            mapX,
            mapY,
            side,
            textureOffset,
            rayAngle,
        };
    }
    function castView(state, rayCount, fov = FOV) {
        const count = Math.max(1, Math.floor(rayCount));
        return Array.from({ length: count }, (_, index) => {
            const t = count === 1 ? 0.5 : index / (count - 1);
            return castRay(state, state.player.angle - fov / 2 + t * fov, state.player.angle);
        });
    }
    function tileAt(column, row) {
        if (row < 0 || row >= exports.RAYCAST_ROWS || column < 0 || column >= exports.RAYCAST_COLUMNS)
            return '#';
        return exports.RAYCAST_MAP[row]?.[column] ?? '#';
    }
    function pointKey(column, row) {
        return `${column},${row}`;
    }
    function isSolid(x, y, openedDoors) {
        const radius = 0.2;
        const samples = [
            [x - radius, y - radius], [x + radius, y - radius],
            [x - radius, y + radius], [x + radius, y + radius],
        ];
        return samples.some(([sampleX, sampleY]) => {
            const column = Math.floor(sampleX);
            const row = Math.floor(sampleY);
            const tile = tileAt(column, row);
            return tile === '#' || (tile === 'D' && !openedDoors.includes(pointKey(column, row)));
        });
    }
    function normalizeAngle(angle) {
        const circle = Math.PI * 2;
        return ((angle % circle) + circle) % circle;
    }
    function hazardActive(elapsedMs, periodMs) {
        return elapsedMs % periodMs < periodMs * 0.48;
    }
    function initialState(difficulty) {
        return {
            schemaVersion: 1,
            difficulty,
            status: 'ready',
            player: { ...START },
            moveForward: false,
            moveBackward: false,
            turnLeft: false,
            turnRight: false,
            keys: [],
            openedDoors: [],
            activeTerminals: [],
            checkpoint: { ...START },
            lives: DIFFICULTIES[difficulty].lives,
            score: 0,
            elapsedMs: 0,
            remainingMs: DIFFICULTIES[difficulty].timeMs,
            damageCooldownMs: 0,
            viewMode: 'split',
            steps: 0,
            message: 'A projeção está pronta. Inicie para explorar o mapa 2D em primeira pessoa.',
        };
    }
    function cloneState(state) {
        return {
            ...state,
            player: { ...state.player },
            checkpoint: { ...state.checkpoint },
            keys: [...state.keys],
            openedDoors: [...state.openedDoors],
            activeTerminals: [...state.activeTerminals],
        };
    }
    
  };
  __modules["games/room-quest/audio/room-quest-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RoomQuestAudio = void 0;
    class RoomQuestAudio {
        #context;
        #muted;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted || typeof AudioContext === 'undefined')
                return;
            this.#context ??= new AudioContext();
            void this.#context.resume();
        }
        play(event) {
            if (this.#muted || !this.#context)
                return;
            const tones = {
                'room-changed': [330, 495, 0.08],
                'item-collected': [520, 780, 0.11],
                'terminal-activated': [280, 620, 0.18],
                'door-locked': [130, 90, 0.12],
                'hazard-hit': [180, 70, 0.2],
                'lore-read': [410, 520, 0.1],
                'core-secured': [440, 880, 0.28],
                victory: [523, 1046, 0.45],
                'game-over': [180, 55, 0.5],
            };
            const tone = tones[event];
            if (!tone)
                return;
            const oscillator = this.#context.createOscillator();
            const gain = this.#context.createGain();
            const now = this.#context.currentTime;
            oscillator.type = event === 'hazard-hit' || event === 'game-over' ? 'sawtooth' : 'square';
            oscillator.frequency.setValueAtTime(tone[0], now);
            oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, tone[1]), now + tone[2]);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + tone[2]);
            oscillator.connect(gain).connect(this.#context.destination);
            oscillator.start(now);
            oscillator.stop(now + tone[2] + 0.02);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.RoomQuestAudio = RoomQuestAudio;
    
  };
  __modules["games/room-quest/content/room-quest-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROOM_QUEST_COMPARISON = exports.ROOM_QUEST_PSEUDOCODE = exports.ROOM_QUEST_HISTORY = void 0;
    exports.ROOM_QUEST_HISTORY = {
        title: 'Quando uma aventura passou a existir como um mundo de salas conectadas',
        paragraphs: [
            'No início dos anos 1980, consoles domésticos trabalhavam com memória, resolução e quantidade de sprites extremamente limitadas. Em vez de representar um mundo inteiro ao mesmo tempo, jogos de aventura podiam dividi-lo em salas e reaproveitar regras simples de transição.',
            'Adventure, desenvolvido por Warren Robinett para o Atari 2600 e lançado em 1980, tornou-se referência por combinar exploração, objetos transportáveis, chaves, castelos, criaturas e uma das primeiras surpresas ocultas amplamente conhecidas em um jogo comercial.',
            'Aventura de Salas é um laboratório autoral do Fliperama DS. O complexo, os itens, os terminais, o objetivo, o visual, o áudio, o código e todos os mapas são próprios; a obra histórica aparece somente para contextualizar a evolução do gênero.',
        ],
        sourceUrl: 'https://atari.com/pages/adventure',
    };
    exports.ROOM_QUEST_PSEUDOCODE = `AO INICIAR A CAMPANHA:
      posicionar o explorador no observatório
      criar inventário, flags globais e registro de salas visitadas
    
    AO TENTAR MUDAR DE SALA:
      consultar a saída da célula atual
      verificar itens e flags exigidos
      se a condição for verdadeira, carregar a sala de destino
      caso contrário, manter o jogador e explicar o bloqueio
    
    AO COLETAR UM OBJETO:
      adicionar o identificador ao inventário
      marcar a entidade como coletada
      preservar esse estado ao sair e voltar para a sala
    
    AO INTERAGIR COM UM TERMINAL:
      verificar o item necessário
      ativar uma flag global como energia ou sinal
      permitir que outras salas consultem essa flag
    
    AO ENTRAR EM UMA ZONA INSTÁVEL:
      reduzir a energia
      restaurar a posição segura da sala
    
    AO RECUPERAR O NÚCLEO DE MEMÓRIA:
      voltar ao observatório
      interagir com o console principal
      concluir a campanha e calcular a pontuação final`;
    exports.ROOM_QUEST_COMPARISON = [
        ['Mundo', 'Salas conectadas e labirintos representavam um reino maior que a tela', 'Oito salas autorais organizadas como grafo com múltiplas rotas'],
        ['Objetos', 'Chaves e objetos alteravam as possibilidades de exploração', 'Inventário persistente com chave, fusível, engrenagem, prisma e núcleo'],
        ['Condições', 'Portas e castelos dependiam de objetos ou estados', 'Saídas consultam itens e flags globais antes de mudar de sala'],
        ['Persistência', 'O cartucho precisava representar o mundo com poucos dados', 'Save serializável preserva sala, itens, flags, visitas e entidades'],
        ['Tecnologia', 'Atari 2600, cartucho, sprites e memória muito restrita', 'TypeScript determinístico, dados orientados a salas e Phaser sob demanda'],
        ['Identidade', 'Obra comercial histórica de 1980', 'Complexo, personagens, mapas, itens, objetivo, arte, áudio e código próprios'],
    ];
    
  };
  __modules["games/room-quest/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const room_quest_runtime_1 = __require("games/room-quest/phaser/room-quest-runtime");
    function createRuntime() {
        return new room_quest_runtime_1.RoomQuestRuntime();
    }
    
  };
  __modules["games/room-quest/levels/room-quest-levels"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROOM_QUEST_ROOM_IDS = exports.ROOM_QUEST_ROOMS = exports.ROOM_ROWS = exports.ROOM_COLUMNS = void 0;
    exports.roomPointKey = roomPointKey;
    exports.isRoomWalkable = isRoomWalkable;
    exports.roomExitAt = roomExitAt;
    exports.roomEntityAt = roomEntityAt;
    exports.ROOM_COLUMNS = 16;
    exports.ROOM_ROWS = 10;
    const pointKey = (column, row) => `${column},${row}`;
    const points = (items) => items.map((item) => pointKey(item.column, item.row));
    exports.ROOM_QUEST_ROOMS = {
        observatory: {
            id: 'observatory',
            title: 'Observatório Inicial',
            subtitle: 'O mapa começa e termina neste console.',
            accent: 0x65f5ff,
            background: 0x061522,
            start: { column: 3, row: 5 },
            obstacles: points([
                { column: 5, row: 2 }, { column: 6, row: 2 }, { column: 9, row: 2 }, { column: 10, row: 2 },
                { column: 5, row: 7 }, { column: 6, row: 7 }, { column: 9, row: 7 }, { column: 10, row: 7 },
                { column: 12, row: 4 }, { column: 12, row: 5 },
            ]),
            hazards: [],
            exits: [
                { id: 'observatory-east', column: 15, row: 5, targetRoom: 'gallery', targetPosition: { column: 1, row: 5 }, direction: 'right', label: 'Galeria Central' },
            ],
            entities: [
                { id: 'observatory-console', column: 8, row: 4, type: 'goal', label: 'Console de restauração', requiresItem: 'memory-core', score: 2500, message: 'O Núcleo de Memória foi reinserido. A rede histórica está restaurada.' },
                { id: 'observatory-map', column: 2, row: 2, type: 'lore', label: 'Mapa do complexo', score: 100, message: 'O complexo forma um grafo de oito salas. Portas e terminais alteram o caminho disponível.' },
            ],
        },
        gallery: {
            id: 'gallery',
            title: 'Galeria Central',
            subtitle: 'O ponto de conexão entre os setores.',
            accent: 0xffca5f,
            background: 0x18100a,
            start: { column: 2, row: 5 },
            obstacles: points([
                { column: 6, row: 2 }, { column: 7, row: 2 }, { column: 8, row: 2 }, { column: 9, row: 2 },
                { column: 6, row: 7 }, { column: 7, row: 7 }, { column: 8, row: 7 }, { column: 9, row: 7 },
                { column: 4, row: 4 }, { column: 4, row: 5 }, { column: 11, row: 4 }, { column: 11, row: 5 },
            ]),
            hazards: [],
            exits: [
                { id: 'gallery-west', column: 0, row: 5, targetRoom: 'observatory', targetPosition: { column: 14, row: 5 }, direction: 'left', label: 'Observatório' },
                { id: 'gallery-east', column: 15, row: 5, targetRoom: 'workshop', targetPosition: { column: 1, row: 5 }, direction: 'right', label: 'Oficina' },
                { id: 'gallery-south', column: 8, row: 9, targetRoom: 'garden', targetPosition: { column: 8, row: 1 }, direction: 'down', label: 'Jardim de Circuitos' },
                { id: 'gallery-north', column: 8, row: 0, targetRoom: 'archive', targetPosition: { column: 8, row: 8 }, direction: 'up', label: 'Arquivo Submerso', requiresItem: 'copper-key' },
                { id: 'gallery-vault', column: 1, row: 1, targetRoom: 'vault', targetPosition: { column: 13, row: 8 }, direction: 'up', label: 'Cofre de Memória', requiresFlags: ['power-online', 'signal-aligned'] },
            ],
            entities: [
                { id: 'gallery-plaque', column: 8, row: 5, type: 'lore', label: 'Placa central', score: 100, message: 'Cada sala preserva seu estado: itens coletados, portas abertas e terminais ativados continuam alterados.' },
            ],
        },
        workshop: {
            id: 'workshop',
            title: 'Oficina de Componentes',
            subtitle: 'Ferramentas antigas ainda abrem caminhos.',
            accent: 0xff7d62,
            background: 0x1b0d0a,
            start: { column: 2, row: 5 },
            obstacles: points([
                { column: 4, row: 2 }, { column: 5, row: 2 }, { column: 6, row: 2 },
                { column: 10, row: 2 }, { column: 11, row: 2 },
                { column: 4, row: 6 }, { column: 5, row: 6 }, { column: 6, row: 6 },
                { column: 10, row: 6 }, { column: 11, row: 6 }, { column: 12, row: 6 },
            ]),
            hazards: points([{ column: 8, row: 4 }, { column: 8, row: 5 }]),
            exits: [
                { id: 'workshop-west', column: 0, row: 5, targetRoom: 'gallery', targetPosition: { column: 14, row: 5 }, direction: 'left', label: 'Galeria Central' },
                { id: 'workshop-south', column: 8, row: 9, targetRoom: 'reactor', targetPosition: { column: 8, row: 1 }, direction: 'down', label: 'Reator' },
            ],
            entities: [
                { id: 'copper-key', column: 12, row: 3, type: 'item', label: 'Chave de cobre', item: 'copper-key', score: 300, message: 'Chave de cobre adicionada ao inventário. Ela corresponde à porta do arquivo.' },
                { id: 'signal-gear', column: 5, row: 4, type: 'item', label: 'Engrenagem de sinal', item: 'signal-gear', score: 300, message: 'Engrenagem de sinal coletada. O mecanismo da torre poderá ser alinhado.' },
                { id: 'workshop-note', column: 13, row: 7, type: 'lore', label: 'Diagrama', score: 100, message: 'Itens são dados persistentes. Uma condição consulta o inventário antes de liberar uma transição.' },
            ],
        },
        garden: {
            id: 'garden',
            title: 'Jardim de Circuitos',
            subtitle: 'Trilhas elétricas escondem uma célula de energia.',
            accent: 0x84ff8a,
            background: 0x07170d,
            start: { column: 8, row: 2 },
            obstacles: points([
                { column: 3, row: 2 }, { column: 3, row: 3 }, { column: 3, row: 4 },
                { column: 6, row: 5 }, { column: 7, row: 5 }, { column: 8, row: 5 }, { column: 9, row: 5 },
                { column: 12, row: 3 }, { column: 12, row: 4 }, { column: 12, row: 5 },
            ]),
            hazards: points([{ column: 5, row: 7 }, { column: 6, row: 7 }, { column: 9, row: 7 }, { column: 10, row: 7 }]),
            exits: [
                { id: 'garden-north', column: 8, row: 0, targetRoom: 'gallery', targetPosition: { column: 8, row: 8 }, direction: 'up', label: 'Galeria Central' },
                { id: 'garden-east', column: 15, row: 5, targetRoom: 'signal-tower', targetPosition: { column: 1, row: 5 }, direction: 'right', label: 'Torre de Sinal' },
            ],
            entities: [
                { id: 'fuse-cell', column: 2, row: 7, type: 'item', label: 'Célula-fusível', item: 'fuse-cell', score: 300, message: 'Célula-fusível coletada. O reator poderá voltar a distribuir energia.' },
                { id: 'garden-lore', column: 13, row: 2, type: 'lore', label: 'Sensor botânico', score: 100, message: 'As zonas pulsantes são perigos persistentes. O modo escolhido define quanta energia a exploração suporta.' },
            ],
        },
        reactor: {
            id: 'reactor',
            title: 'Reator de Energia',
            subtitle: 'Um terminal transforma um item em estado global.',
            accent: 0xf55cff,
            background: 0x160619,
            start: { column: 8, row: 2 },
            obstacles: points([
                { column: 4, row: 3 }, { column: 4, row: 4 }, { column: 4, row: 5 }, { column: 4, row: 6 },
                { column: 11, row: 3 }, { column: 11, row: 4 }, { column: 11, row: 5 }, { column: 11, row: 6 },
                { column: 7, row: 4 }, { column: 8, row: 4 }, { column: 9, row: 4 },
            ]),
            hazards: points([{ column: 6, row: 7 }, { column: 7, row: 7 }, { column: 8, row: 7 }, { column: 9, row: 7 }]),
            exits: [
                { id: 'reactor-north', column: 8, row: 0, targetRoom: 'workshop', targetPosition: { column: 8, row: 8 }, direction: 'up', label: 'Oficina' },
            ],
            entities: [
                { id: 'reactor-terminal', column: 8, row: 6, type: 'terminal', label: 'Painel do reator', requiresItem: 'fuse-cell', grantsFlag: 'power-online', score: 600, message: 'Célula-fusível instalada. A energia voltou a circular por todo o complexo.' },
                { id: 'reactor-lore', column: 2, row: 2, type: 'lore', label: 'Medidor', score: 100, message: 'Uma flag global registra a energia ligada. Outras salas podem consultar esse estado sem conhecer o terminal.' },
            ],
        },
        archive: {
            id: 'archive',
            title: 'Arquivo Submerso',
            subtitle: 'A chave certa revela dados preservados.',
            accent: 0x5fa8ff,
            background: 0x07101d,
            start: { column: 8, row: 7 },
            obstacles: points([
                { column: 3, row: 2 }, { column: 4, row: 2 }, { column: 5, row: 2 },
                { column: 10, row: 2 }, { column: 11, row: 2 }, { column: 12, row: 2 },
                { column: 3, row: 6 }, { column: 4, row: 6 }, { column: 11, row: 6 }, { column: 12, row: 6 },
            ]),
            hazards: points([
                { column: 6, row: 3 }, { column: 7, row: 3 }, { column: 8, row: 3 }, { column: 9, row: 3 },
                { column: 6, row: 4 }, { column: 9, row: 4 }, { column: 6, row: 5 }, { column: 9, row: 5 },
            ]),
            exits: [
                { id: 'archive-south', column: 8, row: 9, targetRoom: 'gallery', targetPosition: { column: 8, row: 1 }, direction: 'down', label: 'Galeria Central' },
            ],
            entities: [
                { id: 'memory-prism', column: 8, row: 4, type: 'item', label: 'Prisma de memória', item: 'memory-prism', score: 450, message: 'Prisma de memória coletado. O cofre reconhecerá a assinatura histórica.' },
                { id: 'archive-terminal', column: 2, row: 7, type: 'terminal', label: 'Registro do arquivo', grantsFlag: 'archive-open', score: 200, message: 'O arquivo foi indexado. A chave de cobre permanece no inventário para demonstrar itens reutilizáveis.' },
            ],
        },
        'signal-tower': {
            id: 'signal-tower',
            title: 'Torre de Sinal',
            subtitle: 'A orientação correta libera a segunda condição do cofre.',
            accent: 0xffe85f,
            background: 0x171609,
            start: { column: 2, row: 5 },
            obstacles: points([
                { column: 5, row: 2 }, { column: 5, row: 3 }, { column: 5, row: 4 },
                { column: 10, row: 5 }, { column: 10, row: 6 }, { column: 10, row: 7 },
                { column: 7, row: 7 }, { column: 8, row: 7 },
            ]),
            hazards: points([{ column: 7, row: 3 }, { column: 8, row: 3 }, { column: 9, row: 3 }]),
            exits: [
                { id: 'tower-west', column: 0, row: 5, targetRoom: 'garden', targetPosition: { column: 14, row: 5 }, direction: 'left', label: 'Jardim de Circuitos' },
            ],
            entities: [
                { id: 'signal-terminal', column: 13, row: 2, type: 'terminal', label: 'Mecanismo de alinhamento', requiresItem: 'signal-gear', grantsFlag: 'signal-aligned', score: 600, message: 'Engrenagem acoplada. A torre enviou o padrão correto ao cofre.' },
                { id: 'tower-lore', column: 12, row: 7, type: 'lore', label: 'Antena histórica', score: 100, message: 'As salas não formam uma sequência linear: o jogador escolhe a ordem e o grafo orienta a exploração.' },
            ],
        },
        vault: {
            id: 'vault',
            title: 'Cofre de Memória',
            subtitle: 'Duas flags globais e um item local protegem o objetivo.',
            accent: 0xffffff,
            background: 0x101218,
            start: { column: 13, row: 7 },
            obstacles: points([
                { column: 4, row: 2 }, { column: 5, row: 2 }, { column: 10, row: 2 }, { column: 11, row: 2 },
                { column: 4, row: 7 }, { column: 5, row: 7 }, { column: 10, row: 7 }, { column: 11, row: 7 },
                { column: 7, row: 3 }, { column: 8, row: 3 }, { column: 7, row: 6 }, { column: 8, row: 6 },
            ]),
            hazards: points([{ column: 6, row: 4 }, { column: 9, row: 4 }, { column: 6, row: 5 }, { column: 9, row: 5 }]),
            exits: [
                { id: 'vault-south', column: 13, row: 9, targetRoom: 'gallery', targetPosition: { column: 2, row: 2 }, direction: 'down', label: 'Galeria Central' },
            ],
            entities: [
                { id: 'vault-seal', column: 8, row: 5, type: 'terminal', label: 'Selo do cofre', requiresItem: 'memory-prism', grantsFlag: 'vault-open', score: 700, message: 'O prisma confirmou a assinatura. O compartimento central foi aberto.' },
                { id: 'memory-core', column: 8, row: 4, type: 'item', label: 'Núcleo de Memória', item: 'memory-core', requiresFlag: 'vault-open', score: 1200, message: 'Núcleo de Memória protegido. Retorne ao Observatório Inicial.' },
            ],
        },
    };
    exports.ROOM_QUEST_ROOM_IDS = Object.keys(exports.ROOM_QUEST_ROOMS);
    function roomPointKey(column, row) {
        return pointKey(column, row);
    }
    function isRoomWalkable(room, column, row) {
        if (column < 0 || row < 0 || column >= exports.ROOM_COLUMNS || row >= exports.ROOM_ROWS)
            return false;
        const key = pointKey(column, row);
        const border = column === 0 || row === 0 || column === exports.ROOM_COLUMNS - 1 || row === exports.ROOM_ROWS - 1;
        if (border && !room.exits.some((exit) => exit.column === column && exit.row === row))
            return false;
        return !room.obstacles.includes(key);
    }
    function roomExitAt(room, column, row) {
        return room.exits.find((exit) => exit.column === column && exit.row === row);
    }
    function roomEntityAt(room, column, row) {
        return room.entities.find((entity) => entity.column === column && entity.row === row);
    }
    
  };
  __modules["games/room-quest/phaser/room-quest-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RoomQuestRuntime = void 0;
    const room_quest_audio_1 = __require("games/room-quest/audio/room-quest-audio");
    const room_quest_levels_1 = __require("games/room-quest/levels/room-quest-levels");
    const room_quest_simulation_1 = __require("games/room-quest/simulation/room-quest-simulation");
    const ITEM_LABELS = {
        'copper-key': 'CHAVE',
        'fuse-cell': 'FUSÍVEL',
        'signal-gear': 'ENGRENAGEM',
        'memory-prism': 'PRISMA',
        'memory-core': 'NÚCLEO',
    };
    class RoomQuestRuntime {
        id = 'room-quest';
        state = 'not-loaded';
        #simulation = new room_quest_simulation_1.RoomQuestSimulation();
        #game;
        #graphics;
        #title;
        #message;
        #inventory;
        #audio;
        #context;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new room_quest_simulation_1.RoomQuestSimulation(parseMode(context.parameters?.mode));
            this.#audio = new room_quest_audio_1.RoomQuestAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class RoomQuestScene extends Phaser.Scene {
                #view;
                #titleText;
                #messageText;
                #inventoryText;
                constructor() { super('room-quest'); }
                create() {
                    this.#view = this.add.graphics();
                    this.#titleText = this.add.text(24, 18, '', { fontFamily: 'monospace', fontSize: '20px', color: '#dffcff', fontStyle: 'bold' });
                    this.#messageText = this.add.text(24, 0, '', { fontFamily: 'system-ui', fontSize: '15px', color: '#d7e3f5', wordWrap: { width: 900 } });
                    this.#inventoryText = this.add.text(24, 0, '', { fontFamily: 'monospace', fontSize: '13px', color: '#a8b9cf' });
                    owner.#graphics = this.#view;
                    owner.#title = this.#titleText;
                    owner.#message = this.#messageText;
                    owner.#inventory = this.#inventoryText;
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 680,
                backgroundColor: '#030610',
                transparent: false,
                scene: RoomQuestScene,
                render: {
                    antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo',
                    pixelArt: context.graphicsMode === 'historico',
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'victory' || current.status === 'game-over')
                this.#simulation.restart(current.mode);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve', detail: { room: this.#simulation.state.roomId } });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'interact' && input.active) {
                this.#processEvents(this.#simulation.interact());
                this.#redraw();
                return;
            }
            const direction = directionFromAction(input.action);
            if (direction === 'none')
                return;
            if (input.active)
                this.#simulation.setDirection(direction);
            else
                this.#simulation.stopDirection(direction);
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'victory' || status === 'game-over' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#title = undefined;
            this.#message = undefined;
            this.#inventory = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            const progressEvent = events.find((event) => event !== 'lore-read');
            if (progressEvent && !['victory', 'game-over'].includes(progressEvent)) {
                this.#context?.onEvent?.({
                    type: 'progress',
                    detail: {
                        event: progressEvent,
                        room: current.roomId,
                        roomTitle: room_quest_levels_1.ROOM_QUEST_ROOMS[current.roomId].title,
                        energy: current.energy,
                        inventory: current.inventory.length,
                        flags: current.flags.length,
                        visited: current.visitedRooms.length,
                        message: current.message,
                        score: current.score,
                    },
                });
            }
            if (events.includes('victory') || events.includes('game-over')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: events.includes('victory') ? 'player' : 'complex',
                        score: current.score,
                        energy: current.energy,
                        rooms: current.visitedRooms.length,
                        steps: current.steps,
                    },
                });
            }
        }
        #redraw() {
            if (!this.#graphics || !this.#game)
                return;
            this.#draw(this.#graphics, this.#game.scale.width, this.#game.scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const room = room_quest_levels_1.ROOM_QUEST_ROOMS[state.roomId];
            const historical = this.#context?.graphicsMode === 'historico';
            const reduced = this.#context?.graphicsMode === 'baixo';
            const tile = Math.max(18, Math.min((width - 40) / room_quest_levels_1.ROOM_COLUMNS, (height - 170) / room_quest_levels_1.ROOM_ROWS));
            const roomWidth = tile * room_quest_levels_1.ROOM_COLUMNS;
            const roomHeight = tile * room_quest_levels_1.ROOM_ROWS;
            const originX = (width - roomWidth) / 2;
            const originY = 78;
            const accent = historical ? 0xe8e8e8 : room.accent;
            const background = historical ? 0x080808 : room.background;
            graphics.clear();
            graphics.fillStyle(0x02040a, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(background, 1);
            graphics.fillRoundedRect(originX - 4, originY - 4, roomWidth + 8, roomHeight + 8, historical ? 0 : 8);
            for (let row = 0; row < room_quest_levels_1.ROOM_ROWS; row += 1) {
                for (let column = 0; column < room_quest_levels_1.ROOM_COLUMNS; column += 1) {
                    const x = originX + column * tile;
                    const y = originY + row * tile;
                    const key = (0, room_quest_levels_1.roomPointKey)(column, row);
                    const border = column === 0 || row === 0 || column === room_quest_levels_1.ROOM_COLUMNS - 1 || row === room_quest_levels_1.ROOM_ROWS - 1;
                    const exit = room.exits.find((candidate) => candidate.column === column && candidate.row === row);
                    if ((border && !exit) || room.obstacles.includes(key)) {
                        graphics.fillStyle(historical ? 0xcfcfcf : darken(room.accent), 0.92);
                        graphics.fillRect(x + 1, y + 1, tile - 2, tile - 2);
                        graphics.lineStyle(Math.max(1, tile * 0.04), historical ? 0x555555 : room.accent, 0.42);
                        graphics.strokeRect(x + tile * 0.16, y + tile * 0.16, tile * 0.68, tile * 0.68);
                    }
                    else {
                        graphics.fillStyle(historical ? 0x171717 : 0x07101b, 0.88);
                        graphics.fillRect(x + 1, y + 1, tile - 2, tile - 2);
                        if (!reduced) {
                            graphics.lineStyle(1, historical ? 0x2d2d2d : room.accent, 0.1);
                            graphics.strokeRect(x + 2, y + 2, tile - 4, tile - 4);
                        }
                    }
                    if (exit)
                        drawExit(graphics, x, y, tile, accent, Boolean(exit.requiresItem || exit.requiresFlag || exit.requiresFlags));
                    if (room.hazards.includes(key))
                        drawHazard(graphics, x, y, tile, accent, state.elapsedMs, historical, reduced);
                }
            }
            for (const entity of room.entities) {
                if (state.collectedEntities.includes(entity.id))
                    continue;
                if (entity.type === 'terminal' && entity.grantsFlag && state.flags.includes(entity.grantsFlag)) {
                    drawEntity(graphics, entity, originX, originY, tile, accent, true, historical);
                }
                else {
                    drawEntity(graphics, entity, originX, originY, tile, accent, false, historical);
                }
            }
            const px = originX + (state.player.column + 0.5) * tile;
            const py = originY + (state.player.row + 0.5) * tile;
            graphics.fillStyle(historical ? 0xffffff : 0x7dfcff, 1);
            graphics.fillRoundedRect(px - tile * 0.28, py - tile * 0.28, tile * 0.56, tile * 0.56, tile * 0.12);
            graphics.lineStyle(Math.max(1, tile * 0.06), historical ? 0x111111 : 0x03101d, 1);
            const look = directionVector(state.player.facing);
            graphics.lineBetween(px, py, px + look.x * tile * 0.34, py + look.y * tile * 0.34);
            graphics.fillStyle(historical ? 0x111111 : 0x03101d, 1);
            graphics.fillCircle(px - tile * 0.09, py - tile * 0.08, tile * 0.045);
            graphics.fillCircle(px + tile * 0.09, py - tile * 0.08, tile * 0.045);
            const energyWidth = Math.min(230, width * 0.25);
            const energyMax = state.mode === 'explorador' ? 7 : state.mode === 'cartografo' ? 5 : 3;
            graphics.fillStyle(0x0c1522, 1);
            graphics.fillRoundedRect(originX, originY + roomHeight + 12, energyWidth, 12, 6);
            graphics.fillStyle(accent, 1);
            graphics.fillRoundedRect(originX, originY + roomHeight + 12, energyWidth * (state.energy / energyMax), 12, 6);
            this.#title?.setText(`${room.title.toUpperCase()} · SALA ${state.visitedRooms.length}/8`);
            this.#title?.setPosition(Math.max(20, originX), 18);
            this.#message?.setText(state.message);
            this.#message?.setPosition(Math.max(20, originX), originY + roomHeight + 36);
            this.#message?.setWordWrapWidth(Math.max(260, roomWidth * 0.62));
            const inventory = state.inventory.length > 0 ? state.inventory.map((item) => ITEM_LABELS[item]).join(' · ') : 'VAZIO';
            this.#inventory?.setText(`ENERGIA ${state.energy} · INVENTÁRIO ${inventory} · FLAGS ${state.flags.length}`);
            this.#inventory?.setPosition(Math.max(20, originX), Math.min(height - 24, originY + roomHeight + 70));
        }
    }
    exports.RoomQuestRuntime = RoomQuestRuntime;
    function drawExit(graphics, x, y, tile, accent, conditional) {
        graphics.fillStyle(conditional ? 0xffb45f : accent, 0.94);
        graphics.fillRect(x + tile * 0.18, y + tile * 0.08, tile * 0.64, tile * 0.84);
        graphics.fillStyle(0x07101b, 1);
        graphics.fillRect(x + tile * 0.32, y + tile * 0.22, tile * 0.36, tile * 0.7);
    }
    function drawHazard(graphics, x, y, tile, accent, elapsedMs, historical, reduced) {
        const pulse = reduced ? 0.7 : 0.52 + Math.sin(elapsedMs / 170 + x) * 0.22;
        graphics.fillStyle(historical ? 0xffffff : 0xff477e, pulse);
        graphics.fillTriangle(x + tile * 0.5, y + tile * 0.12, x + tile * 0.12, y + tile * 0.86, x + tile * 0.88, y + tile * 0.86);
        graphics.lineStyle(Math.max(1, tile * 0.05), historical ? 0x111111 : accent, 0.7);
        graphics.lineBetween(x + tile * 0.5, y + tile * 0.34, x + tile * 0.5, y + tile * 0.62);
    }
    function drawEntity(graphics, entity, originX, originY, tile, accent, activated, historical) {
        const x = originX + (entity.column + 0.5) * tile;
        const y = originY + (entity.row + 0.5) * tile;
        const color = historical ? 0xffffff : activated ? 0x77ff8f : entity.type === 'item' ? 0xffdb67 : entity.type === 'goal' ? 0x7dfcff : accent;
        if (entity.type === 'item') {
            graphics.fillStyle(color, 1);
            graphics.fillTriangle(x, y - tile * 0.3, x - tile * 0.28, y, x, y + tile * 0.3);
            graphics.fillTriangle(x, y - tile * 0.3, x + tile * 0.28, y, x, y + tile * 0.3);
            return;
        }
        graphics.fillStyle(color, activated ? 0.72 : 1);
        graphics.fillRoundedRect(x - tile * 0.28, y - tile * 0.3, tile * 0.56, tile * 0.6, tile * 0.08);
        graphics.fillStyle(historical ? 0x111111 : 0x06101c, 1);
        graphics.fillRect(x - tile * 0.18, y - tile * 0.18, tile * 0.36, tile * 0.18);
        graphics.fillCircle(x, y + tile * 0.14, tile * 0.06);
    }
    function parseMode(value) {
        if (value === 'explorador' || value === 'arquivista')
            return value;
        return 'cartografo';
    }
    function directionFromAction(action) {
        if (action === 'move-up')
            return 'up';
        if (action === 'move-down')
            return 'down';
        if (action === 'move-left')
            return 'left';
        if (action === 'move-right')
            return 'right';
        return 'none';
    }
    function directionVector(direction) {
        if (direction === 'up')
            return { x: 0, y: -1 };
        if (direction === 'down')
            return { x: 0, y: 1 };
        if (direction === 'left')
            return { x: -1, y: 0 };
        if (direction === 'right')
            return { x: 1, y: 0 };
        return { x: 0, y: 0 };
    }
    function darken(color) {
        const red = Math.floor(((color >> 16) & 0xff) * 0.34);
        const green = Math.floor(((color >> 8) & 0xff) * 0.34);
        const blue = Math.floor((color & 0xff) * 0.34);
        return (red << 16) | (green << 8) | blue;
    }
    
  };
  __modules["games/room-quest/simulation/room-quest-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RoomQuestSimulation = void 0;
    const room_quest_levels_1 = __require("games/room-quest/levels/room-quest-levels");
    const MODES = {
        explorador: { energy: 7, moveMs: 150, hazardCost: 1 },
        cartografo: { energy: 5, moveMs: 135, hazardCost: 1 },
        arquivista: { energy: 3, moveMs: 120, hazardCost: 1 },
    };
    const ITEM_LABELS = {
        'copper-key': 'Chave de cobre',
        'fuse-cell': 'Célula-fusível',
        'signal-gear': 'Engrenagem de sinal',
        'memory-prism': 'Prisma de memória',
        'memory-core': 'Núcleo de Memória',
    };
    class RoomQuestSimulation {
        #state;
        constructor(mode = 'cartografo') {
            this.#state = this.#initialState(mode);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing', message: 'Explore o complexo e recupere o Núcleo de Memória.' };
        }
        restart(mode = this.#state.mode) {
            this.#state = this.#initialState(mode);
            this.start();
        }
        setDirection(direction) {
            this.#state = { ...this.#state, player: { ...this.#state.player, queuedDirection: direction, facing: direction === 'none' ? this.#state.player.facing : direction } };
        }
        stopDirection(direction) {
            if (this.#state.player.queuedDirection !== direction)
                return;
            this.#state = { ...this.#state, player: { ...this.#state.player, queuedDirection: 'none' } };
        }
        interact() {
            if (this.#state.status !== 'playing')
                return [];
            const room = room_quest_levels_1.ROOM_QUEST_ROOMS[this.#state.roomId];
            const points = interactionPoints(this.#state.player);
            const entity = points.map((point) => (0, room_quest_levels_1.roomEntityAt)(room, point.column, point.row)).find((candidate) => Boolean(candidate));
            if (!entity) {
                this.#state = { ...this.#state, message: 'Nenhum objeto interativo está ao alcance.' };
                return [];
            }
            if (entity.type === 'item')
                return this.#collectEntity(entity);
            if (entity.type === 'terminal')
                return this.#activateTerminal(entity);
            if (entity.type === 'goal')
                return this.#activateGoal(entity);
            return this.#readLore(entity);
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 100);
            const spec = MODES[this.#state.mode];
            let state = { ...this.#state, elapsedMs: this.#state.elapsedMs + safeDelta, moveTimerMs: this.#state.moveTimerMs - safeDelta };
            const events = [];
            let moves = 0;
            while (state.moveTimerMs <= 0 && state.player.queuedDirection !== 'none' && state.status === 'playing' && moves < 2) {
                state = { ...state, moveTimerMs: state.moveTimerMs + spec.moveMs };
                const result = this.#move(state);
                state = result.state;
                events.push(...result.events);
                moves += 1;
            }
            this.#state = state;
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save da Aventura de Salas incompatível');
            if (!(state.mode in MODES))
                throw new Error('Modo salvo inválido');
            if (!room_quest_levels_1.ROOM_QUEST_ROOM_IDS.includes(state.roomId))
                throw new Error('Sala salva inválida');
            if (!['ready', 'playing', 'victory', 'game-over'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (state.energy < 0 || state.steps < 0)
                throw new Error('Progresso salvo inválido');
            this.#state = cloneState(state);
        }
        #move(state) {
            const direction = state.player.queuedDirection;
            const vector = directionVector(direction);
            const room = room_quest_levels_1.ROOM_QUEST_ROOMS[state.roomId];
            const next = { column: state.player.column + vector.column, row: state.player.row + vector.row };
            if (!(0, room_quest_levels_1.isRoomWalkable)(room, next.column, next.row)) {
                return { state: { ...state, message: 'A estrutura bloqueia essa direção.' }, events: [] };
            }
            let nextState = {
                ...state,
                steps: state.steps + 1,
                player: { ...state.player, ...next, facing: direction },
                message: room.subtitle,
            };
            const exit = (0, room_quest_levels_1.roomExitAt)(room, next.column, next.row);
            if (exit) {
                const missing = missingExitRequirement(exit.requiresItem, exit.requiresFlag, exit.requiresFlags, nextState);
                if (missing) {
                    return {
                        state: { ...state, player: { ...state.player, facing: direction }, message: `${exit.label} bloqueado: ${missing}.` },
                        events: ['door-locked'],
                    };
                }
                const roomEntries = { ...nextState.roomEntries, [exit.targetRoom]: nextState.roomEntries[exit.targetRoom] + 1 };
                const visitedRooms = nextState.visitedRooms.includes(exit.targetRoom) ? nextState.visitedRooms : [...nextState.visitedRooms, exit.targetRoom];
                nextState = {
                    ...nextState,
                    roomId: exit.targetRoom,
                    player: { ...exit.targetPosition, facing: direction, queuedDirection: 'none' },
                    visitedRooms,
                    roomEntries,
                    score: nextState.score + (visitedRooms.length > nextState.visitedRooms.length ? 150 : 25),
                    message: `Entrada em ${room_quest_levels_1.ROOM_QUEST_ROOMS[exit.targetRoom].title}.`,
                };
                return { state: nextState, events: ['room-changed'] };
            }
            const key = (0, room_quest_levels_1.roomPointKey)(next.column, next.row);
            if (room.hazards.includes(key)) {
                const energy = nextState.energy - MODES[nextState.mode].hazardCost;
                if (energy <= 0) {
                    return { state: { ...nextState, energy: 0, status: 'game-over', message: 'A energia do explorador foi esgotada.' }, events: ['hazard-hit', 'game-over'] };
                }
                nextState = {
                    ...nextState,
                    energy,
                    score: Math.max(0, nextState.score - 100),
                    player: { ...room.start, facing: 'down', queuedDirection: 'none' },
                    message: 'Zona instável detectada. Retorno ao ponto seguro da sala.',
                };
                return { state: nextState, events: ['hazard-hit'] };
            }
            const entity = (0, room_quest_levels_1.roomEntityAt)(room, next.column, next.row);
            if (entity?.type === 'item') {
                this.#state = nextState;
                const itemEvents = this.#collectEntity(entity);
                return { state: this.#state, events: itemEvents };
            }
            return { state: nextState, events: [] };
        }
        #collectEntity(entity) {
            if (!entity.item)
                return [];
            if (this.#state.collectedEntities.includes(entity.id)) {
                this.#state = { ...this.#state, message: `${entity.label} já foi coletado.` };
                return [];
            }
            if (entity.requiresFlag && !this.#state.flags.includes(entity.requiresFlag)) {
                this.#state = { ...this.#state, message: `${entity.label} ainda está protegido por uma condição do mundo.` };
                return ['door-locked'];
            }
            const inventory = this.#state.inventory.includes(entity.item) ? this.#state.inventory : [...this.#state.inventory, entity.item];
            const flags = entity.item === 'memory-core' && !this.#state.flags.includes('core-secured') ? [...this.#state.flags, 'core-secured'] : this.#state.flags;
            this.#state = {
                ...this.#state,
                inventory,
                flags,
                collectedEntities: [...this.#state.collectedEntities, entity.id],
                score: this.#state.score + entity.score,
                message: entity.message,
            };
            return entity.item === 'memory-core' ? ['item-collected', 'core-secured'] : ['item-collected'];
        }
        #activateTerminal(entity) {
            if (entity.grantsFlag && this.#state.flags.includes(entity.grantsFlag)) {
                this.#state = { ...this.#state, message: `${entity.label} já permanece ativo.` };
                return [];
            }
            if (entity.requiresItem && !this.#state.inventory.includes(entity.requiresItem)) {
                this.#state = { ...this.#state, message: `${entity.label} exige ${ITEM_LABELS[entity.requiresItem]}.` };
                return ['door-locked'];
            }
            if (entity.requiresFlag && !this.#state.flags.includes(entity.requiresFlag)) {
                this.#state = { ...this.#state, message: `${entity.label} depende de outra condição ainda inativa.` };
                return ['door-locked'];
            }
            const flags = entity.grantsFlag && !this.#state.flags.includes(entity.grantsFlag) ? [...this.#state.flags, entity.grantsFlag] : this.#state.flags;
            const activatedEntities = this.#state.activatedEntities.includes(entity.id) ? this.#state.activatedEntities : [...this.#state.activatedEntities, entity.id];
            this.#state = {
                ...this.#state,
                flags,
                activatedEntities,
                score: this.#state.score + entity.score,
                message: entity.message,
            };
            return ['terminal-activated'];
        }
        #activateGoal(entity) {
            if (entity.requiresItem && !this.#state.inventory.includes(entity.requiresItem)) {
                this.#state = { ...this.#state, message: 'O console aguarda o Núcleo de Memória guardado no cofre.' };
                return ['door-locked'];
            }
            this.#state = {
                ...this.#state,
                status: 'victory',
                score: this.#state.score + entity.score + this.#state.energy * 250 + this.#state.visitedRooms.length * 100,
                message: entity.message,
                activatedEntities: this.#state.activatedEntities.includes(entity.id) ? this.#state.activatedEntities : [...this.#state.activatedEntities, entity.id],
            };
            return ['victory'];
        }
        #readLore(entity) {
            if (this.#state.activatedEntities.includes(entity.id)) {
                this.#state = { ...this.#state, message: entity.message };
                return [];
            }
            this.#state = {
                ...this.#state,
                activatedEntities: [...this.#state.activatedEntities, entity.id],
                score: this.#state.score + entity.score,
                message: entity.message,
            };
            return ['lore-read'];
        }
        #initialState(mode) {
            const roomEntries = Object.fromEntries(room_quest_levels_1.ROOM_QUEST_ROOM_IDS.map((id) => [id, id === 'observatory' ? 1 : 0]));
            const start = room_quest_levels_1.ROOM_QUEST_ROOMS.observatory.start;
            return {
                schemaVersion: 1,
                mode,
                status: 'ready',
                roomId: 'observatory',
                player: { ...start, facing: 'right', queuedDirection: 'none' },
                score: 0,
                energy: MODES[mode].energy,
                elapsedMs: 0,
                steps: 0,
                moveTimerMs: 0,
                inventory: [],
                flags: [],
                collectedEntities: [],
                activatedEntities: [],
                visitedRooms: ['observatory'],
                roomEntries,
                message: 'O complexo histórico aguarda exploração.',
            };
        }
    }
    exports.RoomQuestSimulation = RoomQuestSimulation;
    function cloneState(state) {
        return {
            ...state,
            player: { ...state.player },
            inventory: [...state.inventory],
            flags: [...state.flags],
            collectedEntities: [...state.collectedEntities],
            activatedEntities: [...state.activatedEntities],
            visitedRooms: [...state.visitedRooms],
            roomEntries: { ...state.roomEntries },
        };
    }
    function missingExitRequirement(item, flag, flags, state) {
        if (item && !state.inventory.includes(item))
            return ITEM_LABELS[item];
        if (flag && !state.flags.includes(flag))
            return 'condição do mundo ainda inativa';
        const missingFlags = flags?.filter((candidate) => !state.flags.includes(candidate)) ?? [];
        if (missingFlags.length > 0)
            return 'energia e sinal devem estar ativos';
        return undefined;
    }
    function interactionPoints(player) {
        const vector = directionVector(player.facing);
        return [
            { column: player.column, row: player.row },
            { column: player.column + vector.column, row: player.row + vector.row },
            { column: player.column, row: player.row - 1 },
            { column: player.column + 1, row: player.row },
            { column: player.column, row: player.row + 1 },
            { column: player.column - 1, row: player.row },
        ];
    }
    function directionVector(direction) {
        if (direction === 'up')
            return { column: 0, row: -1 };
        if (direction === 'down')
            return { column: 0, row: 1 };
        if (direction === 'left')
            return { column: -1, row: 0 };
        if (direction === 'right')
            return { column: 1, row: 0 };
        return { column: 0, row: 0 };
    }
    
  };
  __modules["games/space-blocks/audio/space-blocks-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpaceBlocksAudio = void 0;
    class SpaceBlocksAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const tones = {
                move: [130, 0.025], rotate: [240, 0.045], pause: [170, 0.08],
                'piece-locked': [95, 0.06], 'line-cleared': [520, 0.16], 'level-up': [760, 0.22], 'game-over': [70, 0.35],
            };
            const [frequency, duration] = tones[event];
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = event === 'line-cleared' || event === 'level-up' ? 'triangle' : 'square';
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            gain.gain.setValueAtTime(0.035, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration);
        }
        dispose() {
            if (this.#context)
                void this.#context.close();
            this.#context = undefined;
        }
    }
    exports.SpaceBlocksAudio = SpaceBlocksAudio;
    
  };
  __modules["games/space-blocks/content/space-blocks-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SPACE_BLOCKS_COMPARISON = exports.SPACE_BLOCKS_PSEUDOCODE = exports.SPACE_BLOCKS_HISTORY = void 0;
    exports.SPACE_BLOCKS_HISTORY = {
        title: 'Matrizes que transformaram o gênero de puzzle',
        paragraphs: [
            'Em 1984, Alexey Pajitnov criou um jogo de encaixe no computador Electronika 60. A ausência de gráficos sofisticados tornou a grade, as formas e as regras de rotação o centro da experiência.',
            'Space Blocks é uma obra autoral inspirada nessa contribuição histórica ao gênero. Ele não reutiliza código, nome, identidade visual, música ou assets do jogo comercial citado como referência.',
            'A versão DS torna visíveis os conceitos de matriz, coordenadas, colisão, rotação, filas e máquina de estados usados em muitos sistemas de software.',
        ],
        sourceUrl: 'https://tetris.com/history-of-tetris',
    };
    exports.SPACE_BLOCKS_PSEUDOCODE = `A CADA QUADRO:
      acumular tempo desde a última queda
      se o intervalo do nível terminou:
        tentar mover a peça uma linha abaixo
        se houver colisão:
          fixar a peça na matriz
          remover linhas completas
          atualizar pontuação e nível
          criar a próxima peça
    
    AO GIRAR:
      calcular a próxima orientação
      testar a posição atual e pequenas correções laterais
      aceitar a primeira posição sem colisão`;
    exports.SPACE_BLOCKS_COMPARISON = [
        ['Representação', 'Caracteres em terminal monocromático', 'Grade vetorial responsiva com identidade espacial'],
        ['Controle', 'Teclado', 'Teclado e botões de toque adaptados'],
        ['Progressão', 'Velocidade crescente', 'Modo progressivo e prática sem aceleração'],
        ['Aprendizagem', 'Lógica implícita', 'Matriz, rotação e pseudocódigo explicados'],
    ];
    
  };
  __modules["games/space-blocks/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const space_blocks_runtime_1 = __require("games/space-blocks/phaser/space-blocks-runtime");
    function createRuntime() {
        return new space_blocks_runtime_1.SpaceBlocksRuntime();
    }
    
  };
  __modules["games/space-blocks/phaser/space-blocks-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpaceBlocksRuntime = void 0;
    const space_blocks_audio_1 = __require("games/space-blocks/audio/space-blocks-audio");
    const space_blocks_simulation_1 = __require("games/space-blocks/simulation/space-blocks-simulation");
    const COLORS = {
        I: 0x49e7ff, O: 0xffd166, T: 0xa98bff, S: 0x67f5a1,
        Z: 0xff7188, J: 0x629cff, L: 0xffa34d,
    };
    class SpaceBlocksRuntime {
        id = 'space-blocks';
        state = 'not-loaded';
        #simulation = new space_blocks_simulation_1.SpaceBlocksSimulation();
        #game;
        #graphics;
        #audio;
        #context;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new space_blocks_simulation_1.SpaceBlocksSimulation(parseMode(context.parameters?.mode));
            this.#audio = new space_blocks_audio_1.SpaceBlocksAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class SpaceBlocksScene extends Phaser.Scene {
                #view;
                constructor() { super('space-blocks'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 620,
                backgroundColor: '#050914',
                transparent: false,
                scene: SpaceBlocksScene,
                render: {
                    antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo',
                    pixelArt: context.graphicsMode === 'historico',
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            if (this.#simulation.state.status === 'game-over')
                this.#simulation.restart(parseMode(this.#context?.parameters?.mode));
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve' });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#audio?.play('pause');
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-left' && input.active && this.#simulation.moveHorizontal(-1))
                this.#audio?.play('move');
            if (input.action === 'move-right' && input.active && this.#simulation.moveHorizontal(1))
                this.#audio?.play('move');
            if (input.action === 'move-down')
                this.#simulation.setSoftDrop(input.active);
            if (input.action === 'primary-action' && input.active && this.#simulation.rotate())
                this.#audio?.play('rotate');
            if (input.action === 'secondary-action' && input.active)
                this.#processEvents(this.#simulation.hardDrop());
            this.#redraw();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            this.state = this.#simulation.state.status === 'game-over' ? 'finished' : this.#simulation.state.status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #processEvents(events) {
            events.forEach((event) => this.#audio?.play(event));
            if (events.includes('piece-locked')) {
                const current = this.#simulation.state;
                this.#context?.onEvent?.({ type: 'progress', detail: { score: current.score, lines: current.lines, level: current.level } });
            }
            if (events.includes('game-over')) {
                const current = this.#simulation.state;
                this.state = 'finished';
                this.#context?.onEvent?.({ type: 'finished', detail: { winner: 'board', score: current.score, lines: current.lines, level: current.level } });
            }
        }
        #redraw() {
            const graphics = this.#graphics;
            const scale = this.#game?.scale;
            if (graphics && scale)
                this.#draw(graphics, scale.width, scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const mode = this.#context?.graphicsMode ?? 'medio';
            const historical = mode === 'historico';
            const sideWidth = Math.min(160, Math.max(88, width * 0.22));
            const cell = Math.max(8, Math.floor(Math.min((height - 28) / space_blocks_simulation_1.BOARD_HEIGHT, (width - sideWidth - 28) / space_blocks_simulation_1.BOARD_WIDTH)));
            const boardWidth = cell * space_blocks_simulation_1.BOARD_WIDTH;
            const boardHeight = cell * space_blocks_simulation_1.BOARD_HEIGHT;
            const playAreaWidth = width - sideWidth;
            const originX = Math.max(12, Math.floor((playAreaWidth - boardWidth) / 2));
            const originY = Math.max(12, Math.floor((height - boardHeight) / 2));
            const colorFor = (kind) => historical ? 0x8cffaa : COLORS[kind];
            graphics.clear();
            graphics.fillStyle(historical ? 0x020a04 : 0x050914, 1);
            graphics.fillRect(0, 0, width, height);
            if (!historical && mode !== 'baixo') {
                graphics.fillStyle(0x7fefff, mode === 'ultra' ? 0.32 : 0.18);
                const stars = mode === 'ultra' ? 80 : 34;
                for (let index = 0; index < stars; index += 1) {
                    const x = (index * 97 + 31) % Math.max(1, Math.floor(width));
                    const y = (index * 53 + 17) % Math.max(1, Math.floor(height));
                    graphics.fillCircle(x, y, index % 7 === 0 ? 1.5 : 0.7);
                }
            }
            graphics.fillStyle(historical ? 0x031108 : 0x081226, 0.96);
            graphics.fillRect(originX, originY, boardWidth, boardHeight);
            graphics.lineStyle(1, historical ? 0x1e6b36 : 0x193555, 0.65);
            for (let column = 0; column <= space_blocks_simulation_1.BOARD_WIDTH; column += 1)
                graphics.lineBetween(originX + column * cell, originY, originX + column * cell, originY + boardHeight);
            for (let row = 0; row <= space_blocks_simulation_1.BOARD_HEIGHT; row += 1)
                graphics.lineBetween(originX, originY + row * cell, originX + boardWidth, originY + row * cell);
            state.board.forEach((row, y) => row.forEach((kind, x) => {
                if (kind !== 0)
                    drawCell(graphics, originX + x * cell, originY + y * cell, cell, colorFor(kind), historical);
            }));
            const ghost = { ...state.activePiece, y: this.#simulation.ghostY() };
            graphics.lineStyle(Math.max(1, cell * 0.06), historical ? 0x8cffaa : colorFor(ghost.kind), 0.3);
            space_blocks_simulation_1.SpaceBlocksSimulation.cells(ghost).forEach(([x, y]) => graphics.strokeRect(originX + x * cell + 3, originY + y * cell + 3, cell - 6, cell - 6));
            space_blocks_simulation_1.SpaceBlocksSimulation.cells(state.activePiece).forEach(([x, y]) => {
                if (y >= 0)
                    drawCell(graphics, originX + x * cell, originY + y * cell, cell, colorFor(state.activePiece.kind), historical);
            });
            const previewCell = Math.max(10, Math.min(24, Math.floor(sideWidth / 5)));
            const previewX = playAreaWidth + Math.floor((sideWidth - previewCell * 4) / 2);
            const previewY = Math.max(24, originY + cell * 2);
            graphics.lineStyle(1, historical ? 0x2f8c49 : 0x315477, 0.8);
            graphics.strokeRect(previewX - 8, previewY - 8, previewCell * 4 + 16, previewCell * 4 + 16);
            space_blocks_simulation_1.SpaceBlocksSimulation.previewCells(state.nextPiece).forEach(([x, y]) => drawCell(graphics, previewX + x * previewCell, previewY + y * previewCell, previewCell, colorFor(state.nextPiece), historical));
        }
    }
    exports.SpaceBlocksRuntime = SpaceBlocksRuntime;
    function drawCell(graphics, x, y, size, color, historical) {
        const inset = Math.max(1, Math.floor(size * 0.08));
        graphics.fillStyle(color, historical ? 0.82 : 0.92);
        graphics.fillRect(x + inset, y + inset, size - inset * 2, size - inset * 2);
        graphics.lineStyle(Math.max(1, size * 0.045), historical ? 0xc7ffd5 : 0xffffff, historical ? 0.35 : 0.24);
        graphics.strokeRect(x + inset + 1, y + inset + 1, size - inset * 2 - 2, size - inset * 2 - 2);
    }
    function parseMode(value) {
        return value === 'pratica' ? 'pratica' : 'progressivo';
    }
    
  };
  __modules["games/space-blocks/simulation/space-blocks-simulation"] = (module, exports) => {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpaceBlocksSimulation = exports.BOARD_HEIGHT = exports.BOARD_WIDTH = void 0;
    exports.BOARD_WIDTH = 10;
    exports.BOARD_HEIGHT = 20;
    const PIECES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const SHAPES = {
        I: [
            [[0, 1], [1, 1], [2, 1], [3, 1]],
            [[2, 0], [2, 1], [2, 2], [2, 3]],
            [[0, 2], [1, 2], [2, 2], [3, 2]],
            [[1, 0], [1, 1], [1, 2], [1, 3]],
        ],
        O: [
            [[1, 0], [2, 0], [1, 1], [2, 1]],
            [[1, 0], [2, 0], [1, 1], [2, 1]],
            [[1, 0], [2, 0], [1, 1], [2, 1]],
            [[1, 0], [2, 0], [1, 1], [2, 1]],
        ],
        T: [
            [[1, 0], [0, 1], [1, 1], [2, 1]],
            [[1, 0], [1, 1], [2, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1], [1, 2]],
            [[1, 0], [0, 1], [1, 1], [1, 2]],
        ],
        S: [
            [[1, 0], [2, 0], [0, 1], [1, 1]],
            [[1, 0], [1, 1], [2, 1], [2, 2]],
            [[1, 1], [2, 1], [0, 2], [1, 2]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
        ],
        Z: [
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[2, 0], [1, 1], [2, 1], [1, 2]],
            [[0, 1], [1, 1], [1, 2], [2, 2]],
            [[1, 0], [0, 1], [1, 1], [0, 2]],
        ],
        J: [
            [[0, 0], [0, 1], [1, 1], [2, 1]],
            [[1, 0], [2, 0], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1], [2, 2]],
            [[1, 0], [1, 1], [0, 2], [1, 2]],
        ],
        L: [
            [[2, 0], [0, 1], [1, 1], [2, 1]],
            [[1, 0], [1, 1], [1, 2], [2, 2]],
            [[0, 1], [1, 1], [2, 1], [0, 2]],
            [[0, 0], [1, 0], [1, 1], [1, 2]],
        ],
    };
    class SpaceBlocksSimulation {
        #state;
        #softDrop = false;
        constructor(mode = 'progressivo', seed = Date.now()) {
            this.#state = this.#initialState(mode, seed >>> 0);
        }
        get state() {
            return this.#cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing' };
        }
        restart(mode = this.#state.mode) {
            this.#softDrop = false;
            this.#state = this.#initialState(mode, (this.#state.rngState + 1) >>> 0);
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 250);
            let accumulator = this.#state.dropAccumulatorMs + safeDelta;
            const interval = this.#softDrop ? 45 : this.#dropInterval();
            const events = [];
            this.#state = { ...this.#state, elapsedMs: this.#state.elapsedMs + safeDelta };
            while (accumulator >= interval && this.#state.status === 'playing') {
                accumulator -= interval;
                if (!this.#tryMove(0, 1))
                    events.push(...this.#lockPiece());
                else if (this.#softDrop)
                    this.#state = { ...this.#state, score: this.#state.score + 1 };
            }
            this.#state = { ...this.#state, dropAccumulatorMs: accumulator };
            return events;
        }
        moveHorizontal(direction) {
            return this.#state.status === 'playing' && this.#tryMove(direction, 0);
        }
        setSoftDrop(active) {
            this.#softDrop = active;
        }
        rotate() {
            if (this.#state.status !== 'playing')
                return false;
            const rotated = { ...this.#state.activePiece, rotation: (this.#state.activePiece.rotation + 1) % 4 };
            for (const offset of [0, -1, 1, -2, 2]) {
                const candidate = { ...rotated, x: rotated.x + offset };
                if (!this.#collides(candidate)) {
                    this.#state = { ...this.#state, activePiece: candidate };
                    return true;
                }
            }
            return false;
        }
        hardDrop() {
            if (this.#state.status !== 'playing')
                return [];
            let distance = 0;
            while (this.#tryMove(0, 1))
                distance += 1;
            this.#state = { ...this.#state, score: this.#state.score + distance * 2 };
            return this.#lockPiece();
        }
        ghostY() {
            let y = this.#state.activePiece.y;
            while (!this.#collides({ ...this.#state.activePiece, y: y + 1 }))
                y += 1;
            return y;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Space Blocks incompatível');
            if (state.board.length !== exports.BOARD_HEIGHT || state.board.some((row) => row.length !== exports.BOARD_WIDTH))
                throw new Error('Grade salva inválida');
            if (!PIECES.includes(state.activePiece.kind) || !PIECES.includes(state.nextPiece))
                throw new Error('Peça salva inválida');
            this.#softDrop = false;
            this.#state = this.#cloneState(state);
        }
        static cells(piece) {
            const shape = SHAPES[piece.kind][piece.rotation % 4];
            if (!shape)
                throw new Error('Rotação de peça inválida');
            return shape.map(([x, y]) => [x + piece.x, y + piece.y]);
        }
        static previewCells(kind) {
            const shape = SHAPES[kind][0];
            if (!shape)
                throw new Error('Prévia de peça inválida');
            return shape;
        }
        #initialState(mode, seed) {
            const random = this.#takePiece([], seed || 0x6d2b79f5);
            const next = this.#takePiece(random.bag, random.rngState);
            return {
                schemaVersion: 1,
                mode,
                board: emptyBoard(),
                activePiece: spawnPiece(random.piece),
                nextPiece: next.piece,
                bag: next.bag,
                rngState: next.rngState,
                score: 0,
                lines: 0,
                level: 1,
                elapsedMs: 0,
                dropAccumulatorMs: 0,
                status: 'ready',
            };
        }
        #tryMove(dx, dy) {
            const candidate = { ...this.#state.activePiece, x: this.#state.activePiece.x + dx, y: this.#state.activePiece.y + dy };
            if (this.#collides(candidate))
                return false;
            this.#state = { ...this.#state, activePiece: candidate };
            return true;
        }
        #collides(piece) {
            return _a.cells(piece).some(([x, y]) => {
                if (x < 0 || x >= exports.BOARD_WIDTH || y >= exports.BOARD_HEIGHT)
                    return true;
                if (y < 0)
                    return false;
                return this.#state.board[y]?.[x] !== 0;
            });
        }
        #lockPiece() {
            const board = this.#state.board.map((row) => [...row]);
            for (const [x, y] of _a.cells(this.#state.activePiece)) {
                if (y < 0)
                    return this.#finishGame();
                const row = board[y];
                if (!row)
                    return this.#finishGame();
                row[x] = this.#state.activePiece.kind;
            }
            const remaining = board.filter((row) => row.some((cell) => cell === 0));
            const cleared = exports.BOARD_HEIGHT - remaining.length;
            while (remaining.length < exports.BOARD_HEIGHT)
                remaining.unshift(Array(exports.BOARD_WIDTH).fill(0));
            const oldLevel = this.#state.level;
            const lines = this.#state.lines + cleared;
            const level = this.#state.mode === 'progressivo' ? Math.floor(lines / 10) + 1 : 1;
            const lineScores = [0, 100, 300, 500, 800];
            const next = this.#takePiece(this.#state.bag, this.#state.rngState);
            const activePiece = spawnPiece(this.#state.nextPiece);
            this.#state = {
                ...this.#state,
                board: remaining,
                activePiece,
                nextPiece: next.piece,
                bag: next.bag,
                rngState: next.rngState,
                score: this.#state.score + (lineScores[cleared] ?? 0) * oldLevel,
                lines,
                level,
                dropAccumulatorMs: 0,
            };
            if (this.#collides(activePiece))
                return this.#finishGame();
            const events = ['piece-locked'];
            if (cleared > 0)
                events.push('line-cleared');
            if (level > oldLevel)
                events.push('level-up');
            return events;
        }
        #finishGame() {
            this.#state = { ...this.#state, status: 'game-over' };
            return ['game-over'];
        }
        #dropInterval() {
            if (this.#state.mode === 'pratica')
                return 900;
            return Math.max(90, 820 - (this.#state.level - 1) * 65);
        }
        #takePiece(bag, rngState) {
            let nextBag = [...bag];
            let state = rngState;
            if (nextBag.length === 0) {
                nextBag = [...PIECES];
                for (let index = nextBag.length - 1; index > 0; index -= 1) {
                    state = nextRandom(state);
                    const swap = state % (index + 1);
                    const current = nextBag[index];
                    const replacement = nextBag[swap];
                    if (!current || !replacement)
                        throw new Error('Falha ao embaralhar peças');
                    nextBag[index] = replacement;
                    nextBag[swap] = current;
                }
            }
            const piece = nextBag.shift();
            if (!piece)
                throw new Error('Sacola de peças vazia');
            return { piece, bag: nextBag, rngState: state };
        }
        #cloneState(state) {
            return { ...state, board: state.board.map((row) => [...row]), activePiece: { ...state.activePiece }, bag: [...state.bag] };
        }
    }
    exports.SpaceBlocksSimulation = SpaceBlocksSimulation;
    _a = SpaceBlocksSimulation;
    function emptyBoard() {
        return Array.from({ length: exports.BOARD_HEIGHT }, () => Array(exports.BOARD_WIDTH).fill(0));
    }
    function spawnPiece(kind) {
        return { kind, rotation: 0, x: 3, y: 0 };
    }
    function nextRandom(state) {
        return (Math.imul(state, 1664525) + 1013904223) >>> 0;
    }
    
  };
  __modules["games/state-quest-rpg/audio/state-quest-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StateQuestAudio = void 0;
    class StateQuestAudio {
        #context;
        #muted;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted || typeof AudioContext === 'undefined')
                return;
            this.#context ??= new AudioContext();
            void this.#context.resume();
        }
        play(event) {
            if (this.#muted || !this.#context)
                return;
            const tones = {
                'map-changed': [294, 440, 0.1],
                'item-collected': [520, 780, 0.12],
                'quest-started': [330, 660, 0.18],
                'quest-ready': [440, 880, 0.2],
                'quest-completed': [523, 1046, 0.32],
                dialogue: [360, 440, 0.08],
                'combat-started': [180, 120, 0.16],
                'enemy-hit': [220, 330, 0.08],
                'player-hit': [170, 80, 0.12],
                'enemy-defeated': [392, 784, 0.2],
                'player-defeated': [130, 55, 0.35],
                'level-up': [523, 1318, 0.34],
                healed: [440, 660, 0.16],
                'door-locked': [120, 85, 0.12],
                'ending-preserve': [392, 1174, 0.5],
                'ending-reset': [294, 880, 0.5],
            };
            const tone = tones[event];
            if (!tone)
                return;
            const oscillator = this.#context.createOscillator();
            const gain = this.#context.createGain();
            const now = this.#context.currentTime;
            oscillator.type = event === 'player-hit' || event === 'player-defeated' ? 'sawtooth' : 'square';
            oscillator.frequency.setValueAtTime(tone[0], now);
            oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, tone[1]), now + tone[2]);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + tone[2]);
            oscillator.connect(gain).connect(this.#context.destination);
            oscillator.start(now);
            oscillator.stop(now + tone[2] + 0.03);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.StateQuestAudio = StateQuestAudio;
    
  };
  __modules["games/state-quest-rpg/content/state-quest-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STATE_QUEST_COMPARISON = exports.STATE_QUEST_PSEUDOCODE = exports.STATE_QUEST_HISTORY = void 0;
    exports.STATE_QUEST_HISTORY = {
        title: 'Quando atributos, missões e escolhas transformaram a jornada',
        paragraphs: [
            'Na geração de 8 bits, RPGs de console organizaram mundos extensos usando tilemaps, menus, tabelas de atributos, inventários e estados compactos. O progresso deixou de depender apenas de reflexos: conversar, explorar, ganhar experiência e concluir missões passaram a alterar permanentemente o mundo.',
            'Dragon Quest, lançado originalmente no Japão em 1986 para o Famicom, tornou-se uma referência importante para a popularização do RPG em consoles. A série continua associada a jornadas por vilas, campos, personagens, monstros e evolução do herói.',
            'State Quest RPG é um laboratório autoral. Vila, mapas, personagens, missões, inimigos, dois finais, arte, áudio, regras e código são próprios; a referência histórica aparece somente para contextualizar a evolução do gênero.',
        ],
        sourceUrl: 'https://dragonquest.square-enix-games.com/games/pt-br/dragon-quest-1-2-hd2d-remake/',
    };
    exports.STATE_QUEST_PSEUDOCODE = `AO INICIAR A CAMPANHA:
      criar o herói com atributos, inventário e equipamento inicial
      marcar a primeira missão como disponível
      posicionar o herói na Vila de Itera
    
    A CADA MOVIMENTO:
      verificar paredes, personagens, inimigos e saídas
      mudar de mapa somente quando as condições forem atendidas
      preservar mapas visitados, itens coletados e inimigos derrotados
    
    AO CONVERSAR:
      consultar o estado atual da missão
      apresentar diálogo e duas decisões possíveis
      atualizar missão, recompensa, equipamento e flags globais
    
    AO ENTRAR EM COMBATE:
      calcular dano com ataque, defesa e equipamento
      permitir atacar, defender ou usar poção
      conceder experiência e créditos ao derrotar o inimigo
      subir de nível quando a experiência atingir o limite
    
    AO CONCLUIR AS DUAS MISSÕES:
      liberar o passe para a Instalação do Núcleo
      abrir a missão final
    
    NO CONSOLE DO NÚCLEO:
      escolher PRESERVAR ou REINICIAR
      registrar um dos dois finais e concluir a campanha`;
    exports.STATE_QUEST_COMPARISON = [
        ['Mundo', 'Tilemaps compactos representavam vilas, campos e masmorras', 'Três mapas autorais conectados, com visitas e mudanças persistentes'],
        ['Personagem', 'Atributos numéricos definiam força e sobrevivência', 'HP, nível, experiência, ataque, defesa, créditos e equipamentos serializáveis'],
        ['Missões', 'Diálogos e flags controlavam o avanço da narrativa', 'Três missões encadeadas, recompensas e estados locked/available/active/ready/completed'],
        ['Combate', 'Menus por turno tornavam decisões legíveis em hardware limitado', 'Ataque, defesa, poção, inimigos escalados por modo e progressão de nível'],
        ['Escolhas', 'Histórias lineares começaram a incorporar decisões e consequências', 'O Console do Núcleo oferece dois finais persistentes e claramente distintos'],
        ['Identidade', 'Obra comercial histórica de 1986', 'Mundo, personagens, monstros, narrativa, arte, áudio e código próprios'],
    ];
    
  };
  __modules["games/state-quest-rpg/data/state-quest-world"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STATE_QUEST_ENEMIES = exports.STATE_QUEST_MAPS = exports.STATE_QUEST_ROWS = exports.STATE_QUEST_COLUMNS = void 0;
    exports.stateQuestPointKey = stateQuestPointKey;
    exports.stateQuestTileAt = stateQuestTileAt;
    exports.isStateQuestWalkable = isStateQuestWalkable;
    exports.stateQuestEntityAt = stateQuestEntityAt;
    exports.stateQuestExitAt = stateQuestExitAt;
    exports.directionVector = directionVector;
    exports.STATE_QUEST_COLUMNS = 18;
    exports.STATE_QUEST_ROWS = 12;
    const VILLAGE_TILES = [
        '##################',
        '#................#',
        '#................#',
        '#................#',
        '#......####......#',
        '#......#..#......#',
        '#......#..#......#',
        '#......####......#',
        '#................#',
        '#................#',
        '#................#',
        '##################',
    ];
    const WILDS_TILES = [
        '##################',
        '#................#',
        '#....~~..........#',
        '#................#',
        '#.....######.....#',
        '#.....#....#.....#',
        '#.....#....#.....#',
        '#.....######.....#',
        '#..........~~....#',
        '#................#',
        '#................#',
        '##################',
    ];
    const CORE_TILES = [
        '##################',
        '#................#',
        '#................#',
        '#....########....#',
        '#....#......#....#',
        '#....#......#....#',
        '#....#......#....#',
        '#....#......#....#',
        '#....########....#',
        '#................#',
        '#................#',
        '##################',
    ];
    exports.STATE_QUEST_MAPS = {
        village: {
            id: 'village',
            title: 'Vila de Itera',
            subtitle: 'Um pequeno centro de dados onde cada morador mantém uma parte da memória coletiva.',
            tiles: VILLAGE_TILES,
            start: { column: 2, row: 9 },
            accent: 0x64e6b2,
            background: 0x071c22,
            entities: [
                { id: 'archivist-lina', type: 'npc', column: 4, row: 2, label: 'Arquivista Lina', color: 0x78e8ff, questId: 'light-source' },
                { id: 'engineer-teo', type: 'npc', column: 13, row: 2, label: 'Engenheiro Teo', color: 0xffc85a, questId: 'lost-signal' },
                { id: 'healer-aya', type: 'npc', column: 8, row: 9, label: 'Curadora Aya', color: 0xff82bd },
                { id: 'village-potion', type: 'item', column: 12, row: 9, label: 'Poção de dados', color: 0xa97cff, itemId: 'potion' },
            ],
            exits: [
                { id: 'village-to-wilds', column: 16, row: 9, targetMap: 'wilds', target: { column: 1, row: 9 }, label: 'Caminho para o Campo de Ruído' },
            ],
        },
        wilds: {
            id: 'wilds',
            title: 'Campo de Ruído',
            subtitle: 'Pacotes corrompidos percorrem as trilhas entre a vila e a instalação central.',
            tiles: WILDS_TILES,
            start: { column: 1, row: 9 },
            accent: 0xd2f16d,
            background: 0x10200c,
            entities: [
                { id: 'glitch-a', type: 'enemy', column: 3, row: 2, label: 'Glitch Alfa', color: 0xff5b68, enemyId: 'glitch-a' },
                { id: 'glitch-b', type: 'enemy', column: 14, row: 2, label: 'Glitch Beta', color: 0xff765b, enemyId: 'glitch-b' },
                { id: 'glitch-c', type: 'enemy', column: 14, row: 8, label: 'Glitch Gama', color: 0xff9b5b, enemyId: 'glitch-c' },
                { id: 'light-crystal', type: 'item', column: 3, row: 8, label: 'Cristal de Luz', color: 0x74f7ff, itemId: 'light-crystal', questId: 'light-source' },
                { id: 'wild-potion', type: 'item', column: 9, row: 2, label: 'Poção de dados', color: 0xa97cff, itemId: 'potion' },
            ],
            exits: [
                { id: 'wilds-to-village', column: 1, row: 9, targetMap: 'village', target: { column: 15, row: 9 }, label: 'Retorno à Vila de Itera' },
                { id: 'wilds-to-core', column: 16, row: 9, targetMap: 'core', target: { column: 1, row: 9 }, label: 'Portão da Instalação', requiresFlag: 'facility-pass' },
            ],
        },
        core: {
            id: 'core',
            title: 'Instalação do Núcleo',
            subtitle: 'A memória central aguarda uma decisão que mudará o futuro da vila.',
            tiles: CORE_TILES,
            start: { column: 1, row: 9 },
            accent: 0x9b8cff,
            background: 0x100b24,
            entities: [
                { id: 'sentinel-a', type: 'enemy', column: 4, row: 2, label: 'Sentinela Vetorial', color: 0xf05cff, enemyId: 'sentinel-a' },
                { id: 'sentinel-b', type: 'enemy', column: 13, row: 2, label: 'Sentinela de Estado', color: 0xc45cff, enemyId: 'sentinel-b' },
                { id: 'core-console', type: 'console', column: 9, row: 6, label: 'Console do Núcleo', color: 0x70f0ff, questId: 'core-choice' },
                { id: 'core-potion', type: 'item', column: 15, row: 9, label: 'Poção de dados', color: 0xa97cff, itemId: 'potion' },
            ],
            exits: [
                { id: 'core-to-wilds', column: 1, row: 9, targetMap: 'wilds', target: { column: 15, row: 9 }, label: 'Retorno ao Campo de Ruído' },
            ],
        },
    };
    exports.STATE_QUEST_ENEMIES = {
        'glitch-a': { id: 'glitch-a', label: 'Glitch Alfa', hp: 15, attack: 5, defense: 1, xp: 28, gold: 5 },
        'glitch-b': { id: 'glitch-b', label: 'Glitch Beta', hp: 18, attack: 6, defense: 1, xp: 32, gold: 6 },
        'glitch-c': { id: 'glitch-c', label: 'Glitch Gama', hp: 21, attack: 7, defense: 2, xp: 38, gold: 7 },
        'sentinel-a': { id: 'sentinel-a', label: 'Sentinela Vetorial', hp: 28, attack: 8, defense: 3, xp: 48, gold: 10 },
        'sentinel-b': { id: 'sentinel-b', label: 'Sentinela de Estado', hp: 34, attack: 9, defense: 4, xp: 58, gold: 12 },
    };
    function stateQuestPointKey(column, row) {
        return `${column},${row}`;
    }
    function stateQuestTileAt(map, column, row) {
        return map.tiles[row]?.[column] ?? '#';
    }
    function isStateQuestWalkable(map, column, row) {
        return stateQuestTileAt(map, column, row) !== '#';
    }
    function stateQuestEntityAt(map, column, row) {
        return map.entities.find((entity) => entity.column === column && entity.row === row);
    }
    function stateQuestExitAt(map, column, row) {
        return map.exits.find((exit) => exit.column === column && exit.row === row);
    }
    function directionVector(direction) {
        if (direction === 'up')
            return { column: 0, row: -1 };
        if (direction === 'down')
            return { column: 0, row: 1 };
        if (direction === 'left')
            return { column: -1, row: 0 };
        if (direction === 'right')
            return { column: 1, row: 0 };
        return { column: 0, row: 0 };
    }
    
  };
  __modules["games/state-quest-rpg/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const state_quest_runtime_1 = __require("games/state-quest-rpg/phaser/state-quest-runtime");
    function createRuntime() {
        return new state_quest_runtime_1.StateQuestRuntime();
    }
    
  };
  __modules["games/state-quest-rpg/phaser/state-quest-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StateQuestRuntime = void 0;
    const state_quest_audio_1 = __require("games/state-quest-rpg/audio/state-quest-audio");
    const state_quest_world_1 = __require("games/state-quest-rpg/data/state-quest-world");
    const state_quest_simulation_1 = __require("games/state-quest-rpg/simulation/state-quest-simulation");
    class StateQuestRuntime {
        id = 'state-quest-rpg';
        state = 'not-loaded';
        #simulation = new state_quest_simulation_1.StateQuestSimulation();
        #game;
        #graphics;
        #title;
        #stats;
        #message;
        #audio;
        #context;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new state_quest_simulation_1.StateQuestSimulation(parseMode(context.parameters?.mode));
            this.#audio = new state_quest_audio_1.StateQuestAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class StateQuestScene extends Phaser.Scene {
                #view;
                constructor() { super('state-quest-rpg'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    owner.#title = this.add.text(24, 16, '', {
                        fontFamily: 'monospace', fontSize: '20px', fontStyle: 'bold', color: '#e9fbff',
                    });
                    owner.#stats = this.add.text(24, 45, '', {
                        fontFamily: 'monospace', fontSize: '13px', color: '#b7cae4',
                    });
                    owner.#message = this.add.text(24, 0, '', {
                        fontFamily: 'system-ui', fontSize: '14px', color: '#dce8f8', wordWrap: { width: 900 },
                    });
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 1000,
                height: 720,
                backgroundColor: '#030611',
                transparent: false,
                scene: StateQuestScene,
                render: {
                    antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo',
                    pixelArt: context.graphicsMode === 'historico',
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            if (this.#simulation.state.status === 'ending')
                this.#simulation.restart(this.#simulation.state.mode);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve', detail: { map: this.#simulation.state.mapId } });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'interact' && input.active) {
                this.#processEvents(this.#simulation.interact());
                this.#redraw();
                return;
            }
            if (input.action === 'confirm' && input.active) {
                this.#processEvents(this.#simulation.choose(true));
                this.#redraw();
                return;
            }
            if (input.action === 'cancel' && input.active) {
                this.#processEvents(this.#simulation.choose(false));
                this.#redraw();
                return;
            }
            const direction = directionFromAction(input.action);
            if (direction === 'none')
                return;
            if (input.active)
                this.#simulation.setDirection(direction);
            else
                this.#simulation.stopDirection(direction);
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            this.state = this.#simulation.state.status === 'ending'
                ? 'finished'
                : this.#simulation.state.status === 'ready'
                    ? 'menu'
                    : 'paused';
            this.#redraw();
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#title = undefined;
            this.#stats = undefined;
            this.#message = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            if (events.includes('ending-preserve') || events.includes('ending-reset')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: 'player',
                        ending: current.ending ?? 'preserve',
                        score: current.score,
                        level: current.player.level,
                        quests: Object.values(current.quests).filter((stage) => stage === 'completed').length,
                        maps: current.visitedMaps.length,
                        steps: current.steps,
                    },
                });
                return;
            }
            const significant = events.find((event) => event !== 'dialogue');
            if (!significant)
                return;
            this.#context?.onEvent?.({
                type: 'progress',
                detail: {
                    event: significant,
                    map: current.mapId,
                    mapTitle: state_quest_world_1.STATE_QUEST_MAPS[current.mapId].title,
                    level: current.player.level,
                    hp: current.player.hp,
                    maxHp: current.player.maxHp,
                    quests: Object.values(current.quests).filter((stage) => stage === 'completed').length,
                    score: current.score,
                    message: current.message,
                },
            });
        }
        #redraw() {
            if (!this.#graphics || !this.#game)
                return;
            this.#draw(this.#graphics, this.#game.scale.width, this.#game.scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const map = state_quest_world_1.STATE_QUEST_MAPS[state.mapId];
            const historical = this.#context?.graphicsMode === 'historico';
            const low = this.#context?.graphicsMode === 'baixo';
            const tile = Math.max(17, Math.min((width - 42) / state_quest_world_1.STATE_QUEST_COLUMNS, (height - 210) / state_quest_world_1.STATE_QUEST_ROWS));
            const mapWidth = tile * state_quest_world_1.STATE_QUEST_COLUMNS;
            const mapHeight = tile * state_quest_world_1.STATE_QUEST_ROWS;
            const originX = (width - mapWidth) / 2;
            const originY = width < 560 ? 98 : 82;
            const accent = historical ? 0xe8e8e8 : map.accent;
            graphics.clear();
            graphics.fillStyle(0x02040b, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(historical ? 0x090909 : map.background, 1);
            graphics.fillRoundedRect(originX - 5, originY - 5, mapWidth + 10, mapHeight + 10, historical ? 0 : 10);
            for (let row = 0; row < state_quest_world_1.STATE_QUEST_ROWS; row += 1) {
                for (let column = 0; column < state_quest_world_1.STATE_QUEST_COLUMNS; column += 1) {
                    const symbol = map.tiles[row]?.[column] ?? '#';
                    const x = originX + column * tile;
                    const y = originY + row * tile;
                    if (symbol === '#') {
                        graphics.fillStyle(historical ? 0x555555 : 0x17324d, 1);
                        graphics.fillRect(x + 1, y + 1, tile - 2, tile - 2);
                        if (!historical && !low) {
                            graphics.lineStyle(1, 0x315b7d, 0.7);
                            graphics.strokeRect(x + 3, y + 3, tile - 6, tile - 6);
                        }
                    }
                    else {
                        const checker = (row + column) % 2 === 0;
                        graphics.fillStyle(historical ? (checker ? 0x171717 : 0x1e1e1e) : (checker ? 0x0b1822 : 0x0d1d28), 1);
                        graphics.fillRect(x, y, tile, tile);
                        if (symbol === '~') {
                            graphics.fillStyle(historical ? 0x777777 : 0x7a2e91, 0.8);
                            graphics.fillRect(x + tile * 0.12, y + tile * 0.38, tile * 0.76, tile * 0.24);
                        }
                    }
                }
            }
            for (const exit of map.exits) {
                const x = originX + exit.column * tile;
                const y = originY + exit.row * tile;
                graphics.fillStyle(exit.requiresFlag && !state.flags.includes(exit.requiresFlag) ? 0x7f3545 : accent, 0.7);
                graphics.fillRect(x + tile * 0.18, y + tile * 0.18, tile * 0.64, tile * 0.64);
            }
            map.entities.forEach((entity) => {
                if (!isVisible(entity, state))
                    return;
                drawEntity(graphics, entity, originX + entity.column * tile, originY + entity.row * tile, tile, historical);
            });
            const playerX = originX + state.player.column * tile;
            const playerY = originY + state.player.row * tile;
            graphics.fillStyle(historical ? 0xffffff : 0x65f5c5, 1);
            graphics.fillCircle(playerX + tile / 2, playerY + tile / 2, tile * 0.31);
            graphics.lineStyle(Math.max(1, tile * 0.07), historical ? 0x222222 : 0x07151b, 1);
            const facing = facingOffset(state.player.facing, tile * 0.22);
            graphics.lineBetween(playerX + tile / 2, playerY + tile / 2, playerX + tile / 2 + facing.x, playerY + tile / 2 + facing.y);
            this.#title?.setText(`${map.title} · NÍVEL ${state.player.level}`);
            const attack = state.player.attack + (state.equipment.weapon === 'lumen-blade' ? 3 : 0);
            const defense = state.player.defense + (state.equipment.armor === 'signal-shield' ? 2 : 0);
            this.#stats?.setWordWrapWidth(Math.max(250, width - 48));
            this.#stats?.setText(width < 560
                ? `HP ${state.player.hp}/${state.player.maxHp} · XP ${state.player.xp}/${state.player.level * 60} · ATQ ${attack} · DEF ${defense}
    POÇÕES ${state.inventory.potion} · CRÉDITOS ${state.player.gold}`
                : `HP ${state.player.hp}/${state.player.maxHp} · XP ${state.player.xp}/${state.player.level * 60} · ATQ ${attack} · DEF ${defense} · POÇÕES ${state.inventory.potion} · CRÉDITOS ${state.player.gold}`);
            const footerY = Math.min(height - 82, originY + mapHeight + 14);
            this.#message?.setPosition(24, footerY).setWordWrapWidth(Math.max(260, width - 48));
            this.#message?.setText(`${state.message}\nMissões: ${questSummary(state)} · Equipamento: ${equipmentLabel(state)}`);
            if (state.dialogue)
                drawDialogue(graphics, width, height, state.dialogue.speaker, state.dialogue.text, state.dialogue.primaryLabel, state.dialogue.secondaryLabel, historical);
            if (state.combat)
                drawCombat(graphics, width, height, state, historical);
            if (state.status === 'ending')
                drawEnding(graphics, width, height, state, historical);
        }
    }
    exports.StateQuestRuntime = StateQuestRuntime;
    function drawEntity(graphics, entity, x, y, tile, historical) {
        const color = historical ? 0xd8d8d8 : entity.color;
        if (entity.type === 'npc') {
            graphics.fillStyle(color, 1);
            graphics.fillCircle(x + tile / 2, y + tile * 0.42, tile * 0.24);
            graphics.fillRoundedRect(x + tile * 0.28, y + tile * 0.58, tile * 0.44, tile * 0.28, tile * 0.08);
        }
        else if (entity.type === 'enemy') {
            graphics.fillStyle(color, 1);
            graphics.fillRect(x + tile * 0.18, y + tile * 0.18, tile * 0.64, tile * 0.64);
            graphics.fillStyle(0x101018, 1);
            graphics.fillRect(x + tile * 0.3, y + tile * 0.34, tile * 0.12, tile * 0.12);
            graphics.fillRect(x + tile * 0.58, y + tile * 0.34, tile * 0.12, tile * 0.12);
        }
        else if (entity.type === 'console') {
            graphics.fillStyle(color, 1);
            graphics.fillRoundedRect(x + tile * 0.15, y + tile * 0.2, tile * 0.7, tile * 0.6, tile * 0.08);
            graphics.fillStyle(0x07101a, 1);
            graphics.fillRect(x + tile * 0.27, y + tile * 0.32, tile * 0.46, tile * 0.22);
        }
        else {
            graphics.fillStyle(color, 1);
            graphics.fillTriangle(x + tile / 2, y + tile * 0.1, x + tile * 0.86, y + tile / 2, x + tile / 2, y + tile * 0.9);
            graphics.fillTriangle(x + tile / 2, y + tile * 0.1, x + tile * 0.14, y + tile / 2, x + tile / 2, y + tile * 0.9);
        }
    }
    function drawDialogue(graphics, width, height, speaker, text, primary, secondary, historical) {
        const panelWidth = Math.min(width - 32, 780);
        const panelHeight = Math.min(180, height * 0.32);
        const x = (width - panelWidth) / 2;
        const y = height - panelHeight - 18;
        graphics.fillStyle(historical ? 0x111111 : 0x07101d, 0.97);
        graphics.fillRoundedRect(x, y, panelWidth, panelHeight, historical ? 0 : 12);
        graphics.lineStyle(2, historical ? 0xdddddd : 0x5ee8ce, 1);
        graphics.strokeRoundedRect(x, y, panelWidth, panelHeight, historical ? 0 : 12);
        drawPixelText(graphics, speaker.toUpperCase(), x + 18, y + 18, historical ? 0xffffff : 0x79f5df, 3);
        drawWrappedText(graphics, text, x + 18, y + 48, panelWidth - 36, historical ? 0xeeeeee : 0xdde9fa);
        drawPixelText(graphics, `ENTER: ${primary}   ·   ESC/Q: ${secondary}`, x + 18, y + panelHeight - 28, historical ? 0xffffff : 0xffd76a, 2);
    }
    function drawCombat(graphics, width, height, state, historical) {
        const combat = state.combat;
        if (!combat)
            return;
        const panelWidth = Math.min(width - 32, 720);
        const panelHeight = 170;
        const x = (width - panelWidth) / 2;
        const y = height - panelHeight - 18;
        graphics.fillStyle(historical ? 0x111111 : 0x160812, 0.98);
        graphics.fillRoundedRect(x, y, panelWidth, panelHeight, historical ? 0 : 12);
        graphics.lineStyle(2, historical ? 0xdddddd : 0xff647d, 1);
        graphics.strokeRoundedRect(x, y, panelWidth, panelHeight, historical ? 0 : 12);
        drawPixelText(graphics, `COMBATE · ${combat.label.toUpperCase()}`, x + 18, y + 18, historical ? 0xffffff : 0xff8799, 3);
        drawPixelText(graphics, `INIMIGO ${combat.hp}/${combat.maxHp} HP    HERÓI ${state.player.hp}/${state.player.maxHp} HP`, x + 18, y + 54, 0xffffff, 2);
        drawWrappedText(graphics, combat.message, x + 18, y + 80, panelWidth - 36, historical ? 0xeeeeee : 0xdde9fa);
        drawPixelText(graphics, 'ENTER/ESPAÇO: ATACAR   ·   ESC/Q: DEFENDER OU USAR POÇÃO', x + 18, y + panelHeight - 27, historical ? 0xffffff : 0xffd76a, 2);
    }
    function drawEnding(graphics, width, height, state, historical) {
        graphics.fillStyle(0x000000, 0.78);
        graphics.fillRect(0, 0, width, height);
        const title = state.ending === 'preserve' ? 'FINAL: MEMÓRIA PRESERVADA' : 'FINAL: NOVO CICLO';
        drawPixelText(graphics, title, Math.max(24, width / 2 - title.length * 7), height * 0.36, historical ? 0xffffff : 0x7af4df, 4);
        drawWrappedText(graphics, state.message, width * 0.18, height * 0.47, width * 0.64, historical ? 0xeeeeee : 0xe7f0ff);
    }
    function drawPixelText(graphics, text, x, y, color, scale) {
        const charWidth = 4 * scale;
        graphics.fillStyle(color, 1);
        [...text].forEach((character, index) => {
            if (character === ' ')
                return;
            const code = character.charCodeAt(0);
            for (let row = 0; row < 5; row += 1) {
                for (let column = 0; column < 3; column += 1) {
                    if (((code >> ((row * 3 + column) % 7)) & 1) === 1 || row === 4) {
                        graphics.fillRect(x + index * charWidth + column * scale, y + row * scale, scale, scale);
                    }
                }
            }
        });
    }
    function drawWrappedText(graphics, text, x, y, maxWidth, color) {
        const words = text.split(/\s+/);
        const scale = 2;
        const charWidth = 8;
        let line = '';
        let lineIndex = 0;
        for (const word of words) {
            const candidate = line ? `${line} ${word}` : word;
            if (candidate.length * charWidth > maxWidth && line) {
                drawPixelText(graphics, line.toUpperCase(), x, y + lineIndex * 16, color, scale);
                line = word;
                lineIndex += 1;
            }
            else
                line = candidate;
        }
        if (line)
            drawPixelText(graphics, line.toUpperCase(), x, y + lineIndex * 16, color, scale);
    }
    function isVisible(entity, state) {
        if (entity.type === 'enemy' && entity.enemyId)
            return !state.defeatedEnemies.includes(entity.enemyId);
        if (entity.type === 'item')
            return !state.collectedEntities.includes(entity.id);
        return true;
    }
    function questSummary(state) {
        const labels = {
            locked: 'bloqueada', available: 'disponível', active: 'em andamento', ready: 'objetivo pronto', completed: 'concluída',
        };
        return Object.entries(state.quests)
            .map(([id, stage]) => `${(0, state_quest_simulation_1.stateQuestQuestLabel)(id)}: ${labels[stage]}`)
            .join(' · ');
    }
    function equipmentLabel(state) {
        const weapon = state.equipment.weapon === 'lumen-blade' ? 'Lâmina Lúmen' : 'Lâmina de treino';
        const armor = state.equipment.armor === 'signal-shield' ? 'Escudo de Sinal' : 'Casaco de tecido';
        return `${weapon} + ${armor}`;
    }
    function directionFromAction(action) {
        if (action === 'move-up')
            return 'up';
        if (action === 'move-down')
            return 'down';
        if (action === 'move-left')
            return 'left';
        if (action === 'move-right')
            return 'right';
        return 'none';
    }
    function parseMode(value) {
        return value === 'viajante' || value === 'cronista' ? value : 'estrategista';
    }
    function facingOffset(direction, amount) {
        if (direction === 'up')
            return { x: 0, y: -amount };
        if (direction === 'down')
            return { x: 0, y: amount };
        if (direction === 'left')
            return { x: -amount, y: 0 };
        return { x: amount, y: 0 };
    }
    
  };
  __modules["games/state-quest-rpg/simulation/state-quest-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StateQuestSimulation = void 0;
    exports.stateQuestQuestLabel = stateQuestQuestLabel;
    const state_quest_world_1 = __require("games/state-quest-rpg/data/state-quest-world");
    const MODE_SPECS = {
        viajante: { maxHp: 42, moveMs: 155, enemyScale: 0.82, startingPotions: 3 },
        estrategista: { maxHp: 34, moveMs: 140, enemyScale: 1, startingPotions: 2 },
        cronista: { maxHp: 28, moveMs: 125, enemyScale: 1.18, startingPotions: 1 },
    };
    const QUEST_LABELS = {
        'light-source': 'Fonte de Luz',
        'lost-signal': 'Sinal Perdido',
        'core-choice': 'Decisão do Núcleo',
    };
    class StateQuestSimulation {
        #state;
        constructor(mode = 'estrategista') {
            this.#state = this.#initialState(mode);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status !== 'ready')
                return;
            this.#state = { ...this.#state, status: 'playing', message: 'Converse com a Arquivista Lina para iniciar a primeira missão.' };
        }
        restart(mode = this.#state.mode) {
            this.#state = this.#initialState(mode);
            this.start();
        }
        setDirection(direction) {
            if (this.#state.status !== 'playing')
                return;
            this.#state = {
                ...this.#state,
                player: {
                    ...this.#state.player,
                    queuedDirection: direction,
                    facing: direction === 'none' ? this.#state.player.facing : direction,
                },
            };
        }
        stopDirection(direction) {
            if (this.#state.player.queuedDirection !== direction)
                return;
            this.#state = { ...this.#state, player: { ...this.#state.player, queuedDirection: 'none' } };
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 100);
            const moveMs = MODE_SPECS[this.#state.mode].moveMs;
            let nextState = {
                ...this.#state,
                elapsedMs: this.#state.elapsedMs + safeDelta,
                moveTimerMs: this.#state.moveTimerMs - safeDelta,
            };
            const events = [];
            let moves = 0;
            while (nextState.moveTimerMs <= 0 && nextState.player.queuedDirection !== 'none' && nextState.status === 'playing' && moves < 2) {
                nextState = { ...nextState, moveTimerMs: nextState.moveTimerMs + moveMs };
                const result = this.#move(nextState);
                nextState = result.state;
                events.push(...result.events);
                moves += 1;
            }
            this.#state = nextState;
            return events;
        }
        interact() {
            if (this.#state.status === 'dialogue')
                return this.choose(true);
            if (this.#state.status !== 'playing')
                return [];
            const map = state_quest_world_1.STATE_QUEST_MAPS[this.#state.mapId];
            const entity = interactionPoints(this.#state.player)
                .map((point) => (0, state_quest_world_1.stateQuestEntityAt)(map, point.column, point.row))
                .filter((candidate) => candidate !== undefined)
                .find((candidate) => this.#isVisibleEntity(candidate));
            if (!entity) {
                this.#state = { ...this.#state, message: 'Não há personagem ou objeto interativo ao alcance.' };
                return [];
            }
            if (entity.type === 'npc')
                return this.#interactNpc(entity);
            if (entity.type === 'item')
                return this.#collectItem(entity);
            if (entity.type === 'console')
                return this.#interactConsole(entity);
            return [];
        }
        choose(primary) {
            if (this.#state.status === 'combat')
                return this.#combatAction(primary);
            if (this.#state.status !== 'dialogue' || !this.#state.dialogue)
                return [];
            const dialogue = this.#state.dialogue;
            if (dialogue.context === 'accept-light') {
                if (primary) {
                    this.#state = {
                        ...this.#state,
                        status: 'playing',
                        dialogue: undefined,
                        quests: { ...this.#state.quests, 'light-source': 'active' },
                        message: 'Missão Fonte de Luz iniciada: encontre o Cristal de Luz no Campo de Ruído.',
                    };
                    return ['quest-started'];
                }
                return this.#closeDialogue('A missão continuará disponível quando você estiver pronto.');
            }
            if (dialogue.context === 'complete-light') {
                if (!primary)
                    return this.#closeDialogue('Lina aguardará o cristal para concluir a restauração.');
                const quests = { ...this.#state.quests, 'light-source': 'completed', 'lost-signal': 'available' };
                const flags = addUnique(this.#state.flags, 'light-restored');
                const rewarded = this.#awardExperience({
                    ...this.#state,
                    status: 'playing',
                    dialogue: undefined,
                    quests,
                    flags,
                    equipment: { ...this.#state.equipment, weapon: 'lumen-blade' },
                    inventory: { ...this.#state.inventory, lightCrystal: Math.max(0, this.#state.inventory.lightCrystal - 1) },
                    score: this.#state.score + 900,
                    message: 'Fonte de Luz restaurada. A Lâmina Lúmen aumenta seu ataque.',
                }, 55);
                this.#state = rewarded.state;
                return rewarded.leveled ? ['quest-completed', 'level-up'] : ['quest-completed'];
            }
            if (dialogue.context === 'accept-signal') {
                if (primary) {
                    this.#state = {
                        ...this.#state,
                        status: 'playing',
                        dialogue: undefined,
                        quests: { ...this.#state.quests, 'lost-signal': 'active' },
                        message: 'Missão Sinal Perdido iniciada: neutralize os três Glitches do Campo de Ruído.',
                    };
                    return ['quest-started'];
                }
                return this.#closeDialogue('Teo manterá o diagnóstico aberto para outra tentativa.');
            }
            if (dialogue.context === 'complete-signal') {
                if (!primary)
                    return this.#closeDialogue('Teo aguardará a confirmação para emitir o passe.');
                const quests = { ...this.#state.quests, 'lost-signal': 'completed', 'core-choice': 'available' };
                const flags = addUnique(addUnique(this.#state.flags, 'signal-restored'), 'facility-pass');
                const rewarded = this.#awardExperience({
                    ...this.#state,
                    status: 'playing',
                    dialogue: undefined,
                    quests,
                    flags,
                    equipment: { ...this.#state.equipment, armor: 'signal-shield' },
                    score: this.#state.score + 1200,
                    message: 'Sinal restaurado. O Escudo de Sinal e o passe da instalação foram liberados.',
                }, 70);
                this.#state = rewarded.state;
                return rewarded.leveled ? ['quest-completed', 'level-up'] : ['quest-completed'];
            }
            if (dialogue.context === 'heal') {
                if (!primary)
                    return this.#closeDialogue('Aya continuará disponível para restaurar seus pontos de vida.');
                if (this.#state.player.hp >= this.#state.player.maxHp)
                    return this.#closeDialogue('Seus pontos de vida já estão completos.');
                if (this.#state.player.gold < 5)
                    return this.#closeDialogue('São necessários 5 créditos para a restauração.');
                this.#state = {
                    ...this.#state,
                    status: 'playing',
                    dialogue: undefined,
                    player: { ...this.#state.player, hp: this.#state.player.maxHp, gold: this.#state.player.gold - 5 },
                    message: 'Aya restaurou todos os pontos de vida por 5 créditos.',
                };
                return ['healed'];
            }
            if (dialogue.context === 'ending-choice') {
                const ending = primary ? 'preserve' : 'reset';
                this.#state = {
                    ...this.#state,
                    status: 'ending',
                    dialogue: undefined,
                    ending,
                    quests: { ...this.#state.quests, 'core-choice': 'completed' },
                    flags: addUnique(this.#state.flags, 'core-access'),
                    score: this.#state.score + (primary ? 1800 : 1600),
                    message: primary
                        ? 'Você preservou a memória antiga e criou uma camada segura para o futuro.'
                        : 'Você reiniciou o núcleo e abriu espaço para uma nova história construída pela vila.',
                };
                return [primary ? 'ending-preserve' : 'ending-reset'];
            }
            return this.#closeDialogue(dialogue.text);
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do State Quest RPG incompatível');
            if (!(state.mode in MODE_SPECS))
                throw new Error('Modo salvo inválido');
            if (!(state.mapId in state_quest_world_1.STATE_QUEST_MAPS))
                throw new Error('Mapa salvo inválido');
            if (!['ready', 'playing', 'dialogue', 'combat', 'ending'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (state.player.hp < 0 || state.player.maxHp <= 0 || state.player.level < 1)
                throw new Error('Atributos salvos inválidos');
            this.#state = cloneState(state);
        }
        #move(state) {
            const direction = state.player.queuedDirection;
            const vector = (0, state_quest_world_1.directionVector)(direction);
            const map = state_quest_world_1.STATE_QUEST_MAPS[state.mapId];
            const next = { column: state.player.column + vector.column, row: state.player.row + vector.row };
            if (!(0, state_quest_world_1.isStateQuestWalkable)(map, next.column, next.row)) {
                return { state: { ...state, message: 'O terreno bloqueia essa direção.' }, events: [] };
            }
            const entity = (0, state_quest_world_1.stateQuestEntityAt)(map, next.column, next.row);
            if (entity?.type === 'npc' || entity?.type === 'console') {
                return { state: { ...state, player: { ...state.player, facing: direction }, message: `${entity.label} está à frente. Use INTERAGIR.` }, events: [] };
            }
            if (entity?.type === 'enemy' && entity.enemyId && !state.defeatedEnemies.includes(entity.enemyId)) {
                const enemy = state_quest_world_1.STATE_QUEST_ENEMIES[entity.enemyId];
                if (enemy)
                    return { state: this.#beginCombat(state, enemy), events: ['combat-started'] };
            }
            let nextState = {
                ...state,
                player: { ...state.player, ...next, facing: direction },
                steps: state.steps + 1,
                message: map.subtitle,
            };
            const exit = (0, state_quest_world_1.stateQuestExitAt)(map, next.column, next.row);
            if (exit) {
                if (exit.requiresFlag && !nextState.flags.includes(exit.requiresFlag)) {
                    return {
                        state: { ...state, player: { ...state.player, facing: direction }, message: `${exit.label} bloqueado: conclua a missão Sinal Perdido.` },
                        events: ['door-locked'],
                    };
                }
                const visitedMaps = addUnique(nextState.visitedMaps, exit.targetMap);
                nextState = {
                    ...nextState,
                    mapId: exit.targetMap,
                    player: { ...nextState.player, ...exit.target, queuedDirection: 'none' },
                    visitedMaps,
                    score: nextState.score + (visitedMaps.length > nextState.visitedMaps.length ? 200 : 20),
                    message: `Entrada em ${state_quest_world_1.STATE_QUEST_MAPS[exit.targetMap].title}.`,
                };
                return { state: nextState, events: ['map-changed'] };
            }
            if (entity?.type === 'item' && this.#isVisibleEntityInState(entity, nextState)) {
                this.#state = nextState;
                const events = this.#collectItem(entity);
                return { state: this.#state, events };
            }
            return { state: nextState, events: [] };
        }
        #interactNpc(entity) {
            if (entity.id === 'archivist-lina') {
                const stage = this.#state.quests['light-source'];
                if (stage === 'available')
                    return this.#openDialogue('Arquivista Lina', 'A fonte de luz apagou. Você aceita recuperar o Cristal de Luz no Campo de Ruído?', 'ACEITAR', 'AGORA NÃO', 'accept-light');
                if (stage === 'active')
                    return this.#openDialogue('Arquivista Lina', 'O cristal pulsa no setor sudoeste do Campo de Ruído. Traga-o para a vila.', 'ENTENDI', 'FECHAR', 'close');
                if (stage === 'ready')
                    return this.#openDialogue('Arquivista Lina', 'O cristal está íntegro. Deseja restaurar a fonte e equipar a Lâmina Lúmen?', 'RESTAURAR', 'DEPOIS', 'complete-light');
                return this.#openDialogue('Arquivista Lina', 'A fonte voltou a iluminar os arquivos. Cada memória preservada fortalece a vila.', 'FECHAR', 'FECHAR', 'close');
            }
            if (entity.id === 'engineer-teo') {
                const stage = this.#state.quests['lost-signal'];
                if (stage === 'locked')
                    return this.#openDialogue('Engenheiro Teo', 'Primeiro precisamos restaurar a Fonte de Luz. Sem ela, não consigo rastrear os Glitches.', 'FECHAR', 'FECHAR', 'close');
                if (stage === 'available')
                    return this.#openDialogue('Engenheiro Teo', 'Três Glitches interrompem o sinal. Você aceita neutralizá-los?', 'ACEITAR', 'AGORA NÃO', 'accept-signal');
                if (stage === 'active') {
                    const remaining = 3 - this.#glitchesDefeated(this.#state);
                    return this.#openDialogue('Engenheiro Teo', `Ainda restam ${remaining} Glitches no Campo de Ruído.`, 'FECHAR', 'FECHAR', 'close');
                }
                if (stage === 'ready')
                    return this.#openDialogue('Engenheiro Teo', 'O sinal foi estabilizado. Deseja receber o passe e o Escudo de Sinal?', 'CONCLUIR', 'DEPOIS', 'complete-signal');
                return this.#openDialogue('Engenheiro Teo', 'O canal está limpo e o portão da instalação reconhece seu passe.', 'FECHAR', 'FECHAR', 'close');
            }
            return this.#openDialogue('Curadora Aya', 'Posso restaurar seus pontos de vida por 5 créditos.', 'CURAR', 'CANCELAR', 'heal');
        }
        #interactConsole(_entity) {
            if (this.#state.quests['core-choice'] === 'locked') {
                return this.#openDialogue('Console do Núcleo', 'Acesso negado. As missões da vila ainda não foram concluídas.', 'FECHAR', 'FECHAR', 'close');
            }
            if (this.#state.quests['core-choice'] === 'available') {
                this.#state = { ...this.#state, quests: { ...this.#state.quests, 'core-choice': 'active' } };
            }
            return this.#openDialogue('Console do Núcleo', 'Escolha o destino da memória: preservar os registros antigos com uma camada segura ou reiniciar o núcleo para a vila escrever uma nova história.', 'PRESERVAR', 'REINICIAR', 'ending-choice');
        }
        #collectItem(entity) {
            if (!entity.itemId || this.#state.collectedEntities.includes(entity.id))
                return [];
            if (entity.itemId === 'light-crystal' && this.#state.quests['light-source'] !== 'active') {
                this.#state = { ...this.#state, message: 'O Cristal de Luz está dormente. Converse com a Arquivista Lina.' };
                return [];
            }
            const inventory = {
                ...this.#state.inventory,
                [entity.itemId === 'potion' ? 'potion' : 'lightCrystal']: entity.itemId === 'potion' ? this.#state.inventory.potion + 1 : this.#state.inventory.lightCrystal + 1,
            };
            const quests = entity.itemId === 'light-crystal'
                ? { ...this.#state.quests, 'light-source': 'ready' }
                : this.#state.quests;
            this.#state = {
                ...this.#state,
                inventory,
                quests,
                collectedEntities: [...this.#state.collectedEntities, entity.id],
                score: this.#state.score + (entity.itemId === 'potion' ? 120 : 450),
                message: entity.itemId === 'potion' ? 'Poção de dados coletada.' : 'Cristal de Luz coletado. Retorne à Arquivista Lina.',
            };
            return entity.itemId === 'light-crystal' ? ['item-collected', 'quest-ready'] : ['item-collected'];
        }
        #beginCombat(state, enemy) {
            const scale = MODE_SPECS[state.mode].enemyScale;
            const hp = Math.max(1, Math.round(enemy.hp * scale));
            return {
                ...state,
                status: 'combat',
                player: { ...state.player, queuedDirection: 'none' },
                combat: {
                    enemyId: enemy.id,
                    label: enemy.label,
                    hp,
                    maxHp: hp,
                    attack: Math.max(1, Math.round(enemy.attack * scale)),
                    defense: enemy.defense,
                    xp: enemy.xp,
                    gold: enemy.gold,
                    guarded: false,
                    message: `${enemy.label} interceptou sua rota.`,
                },
                message: `Combate iniciado contra ${enemy.label}.`,
            };
        }
        #combatAction(primary) {
            const combat = this.#state.combat;
            if (!combat)
                return [];
            if (!primary && this.#state.inventory.potion > 0 && this.#state.player.hp < this.#state.player.maxHp) {
                const healed = Math.min(16, this.#state.player.maxHp - this.#state.player.hp);
                this.#state = {
                    ...this.#state,
                    inventory: { ...this.#state.inventory, potion: this.#state.inventory.potion - 1 },
                    player: { ...this.#state.player, hp: this.#state.player.hp + healed },
                    combat: { ...combat, guarded: true, message: `Poção usada: +${healed} HP. Defesa preparada.` },
                    message: `Poção usada: +${healed} HP.`,
                };
                return this.#enemyTurn(true, ['healed']);
            }
            if (!primary) {
                this.#state = { ...this.#state, combat: { ...combat, guarded: true, message: 'Defesa preparada para reduzir o próximo dano.' }, message: 'Você assumiu postura defensiva.' };
                return this.#enemyTurn(true, []);
            }
            const attack = this.#state.player.attack + weaponBonus(this.#state.equipment.weapon);
            const damage = Math.max(1, attack - combat.defense);
            const remaining = combat.hp - damage;
            if (remaining <= 0)
                return this.#defeatEnemy(combat, damage);
            this.#state = {
                ...this.#state,
                combat: { ...combat, hp: remaining, guarded: false, message: `Você causou ${damage} de dano.` },
                score: this.#state.score + damage * 8,
                message: `${combat.label} recebeu ${damage} de dano.`,
            };
            return this.#enemyTurn(false, ['enemy-hit']);
        }
        #enemyTurn(guarded, initialEvents) {
            const combat = this.#state.combat;
            if (!combat)
                return initialEvents;
            const mitigation = this.#state.player.defense + armorBonus(this.#state.equipment.armor) + (guarded ? 3 : 0);
            const damage = Math.max(1, combat.attack - mitigation);
            const hp = this.#state.player.hp - damage;
            if (hp <= 0) {
                const map = state_quest_world_1.STATE_QUEST_MAPS.village;
                this.#state = {
                    ...this.#state,
                    status: 'playing',
                    mapId: 'village',
                    combat: undefined,
                    player: {
                        ...this.#state.player,
                        ...map.start,
                        hp: Math.max(1, Math.ceil(this.#state.player.maxHp / 2)),
                        gold: Math.max(0, this.#state.player.gold - 3),
                        queuedDirection: 'none',
                    },
                    message: 'Aya recuperou o herói na vila. Três créditos foram usados na restauração.',
                };
                return [...initialEvents, 'player-hit', 'player-defeated'];
            }
            this.#state = {
                ...this.#state,
                player: { ...this.#state.player, hp },
                combat: { ...combat, guarded: false, message: `${combat.message} ${combat.label} causou ${damage} de dano.` },
                message: `${combat.label} causou ${damage} de dano.`,
            };
            return [...initialEvents, 'player-hit'];
        }
        #defeatEnemy(combat, damage) {
            const defeatedEnemies = addUnique(this.#state.defeatedEnemies, combat.enemyId);
            let quests = this.#state.quests;
            const events = ['enemy-hit', 'enemy-defeated'];
            if (this.#state.quests['lost-signal'] === 'active' && this.#glitchesDefeated({ ...this.#state, defeatedEnemies }) >= 3) {
                quests = { ...quests, 'lost-signal': 'ready' };
                events.push('quest-ready');
            }
            const rewarded = this.#awardExperience({
                ...this.#state,
                status: 'playing',
                combat: undefined,
                defeatedEnemies,
                quests,
                player: { ...this.#state.player, gold: this.#state.player.gold + combat.gold },
                score: this.#state.score + combat.xp * 12 + damage * 8,
                message: quests['lost-signal'] === 'ready'
                    ? 'Os três Glitches foram neutralizados. Retorne ao Engenheiro Teo.'
                    : `${combat.label} neutralizado. +${combat.xp} XP e +${combat.gold} créditos.`,
            }, combat.xp);
            this.#state = rewarded.state;
            if (rewarded.leveled)
                events.push('level-up');
            return events;
        }
        #awardExperience(state, amount) {
            let player = { ...state.player, xp: state.player.xp + amount };
            let leveled = false;
            while (player.xp >= player.level * 60) {
                player = {
                    ...player,
                    xp: player.xp - player.level * 60,
                    level: player.level + 1,
                    maxHp: player.maxHp + 5,
                    hp: player.maxHp + 5,
                    attack: player.attack + 2,
                    defense: player.defense + 1,
                };
                leveled = true;
            }
            return { state: { ...state, player }, leveled };
        }
        #openDialogue(speaker, text, primaryLabel, secondaryLabel, context) {
            this.#state = { ...this.#state, status: 'dialogue', dialogue: { speaker, text, primaryLabel, secondaryLabel, context }, player: { ...this.#state.player, queuedDirection: 'none' }, message: text };
            return ['dialogue'];
        }
        #closeDialogue(message) {
            this.#state = { ...this.#state, status: 'playing', dialogue: undefined, message };
            return [];
        }
        #isVisibleEntity(entity) {
            return this.#isVisibleEntityInState(entity, this.#state);
        }
        #isVisibleEntityInState(entity, state) {
            if (entity.type === 'enemy' && entity.enemyId)
                return !state.defeatedEnemies.includes(entity.enemyId);
            if (entity.type === 'item')
                return !state.collectedEntities.includes(entity.id);
            return true;
        }
        #glitchesDefeated(state) {
            return ['glitch-a', 'glitch-b', 'glitch-c'].filter((id) => state.defeatedEnemies.includes(id)).length;
        }
        #initialState(mode) {
            const spec = MODE_SPECS[mode];
            return {
                schemaVersion: 1,
                mode,
                status: 'ready',
                mapId: 'village',
                player: {
                    ...state_quest_world_1.STATE_QUEST_MAPS.village.start,
                    facing: 'right',
                    queuedDirection: 'none',
                    hp: spec.maxHp,
                    maxHp: spec.maxHp,
                    level: 1,
                    xp: 0,
                    attack: 7,
                    defense: 2,
                    gold: 8,
                },
                inventory: { potion: spec.startingPotions, lightCrystal: 0 },
                equipment: { weapon: 'training-blade', armor: 'cloth-coat' },
                quests: { 'light-source': 'available', 'lost-signal': 'locked', 'core-choice': 'locked' },
                flags: [],
                collectedEntities: [],
                defeatedEnemies: [],
                visitedMaps: ['village'],
                score: 0,
                elapsedMs: 0,
                steps: 0,
                moveTimerMs: 0,
                message: `Modo ${mode}: procure a Arquivista Lina.`,
            };
        }
    }
    exports.StateQuestSimulation = StateQuestSimulation;
    function interactionPoints(player) {
        const facing = (0, state_quest_world_1.directionVector)(player.facing);
        return [
            { column: player.column, row: player.row },
            { column: player.column + facing.column, row: player.row + facing.row },
            { column: player.column, row: player.row - 1 },
            { column: player.column - 1, row: player.row },
            { column: player.column + 1, row: player.row },
            { column: player.column, row: player.row + 1 },
        ];
    }
    function weaponBonus(weapon) {
        return weapon === 'lumen-blade' ? 3 : 0;
    }
    function armorBonus(armor) {
        return armor === 'signal-shield' ? 2 : 0;
    }
    function addUnique(values, value) {
        return values.includes(value) ? values : [...values, value];
    }
    function cloneState(state) {
        return {
            ...state,
            player: { ...state.player },
            inventory: { ...state.inventory },
            equipment: { ...state.equipment },
            quests: { ...state.quests },
            flags: [...state.flags],
            collectedEntities: [...state.collectedEntities],
            defeatedEnemies: [...state.defeatedEnemies],
            visitedMaps: [...state.visitedMaps],
            dialogue: state.dialogue ? { ...state.dialogue } : undefined,
            combat: state.combat ? { ...state.combat } : undefined,
        };
    }
    function stateQuestQuestLabel(id) {
        return QUEST_LABELS[id];
    }
    
  };
  __modules["games/trap-lab/audio/trap-lab-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrapLabAudio = void 0;
    class TrapLabAudio {
        #muted;
        #context;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            const frequencies = {
                jump: 360,
                collectible: 760,
                checkpoint: 520,
                'sequence-solved': 880,
                'sequence-failed': 130,
                'life-lost': 95,
                'level-complete': 640,
                victory: 980,
                'game-over': 75,
            };
            const frequency = frequencies[event];
            if (!frequency)
                return;
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = event === 'life-lost' || event === 'game-over' ? 'sawtooth' : 'square';
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.045, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.13);
        }
        dispose() {
            void this.#context?.close();
            this.#context = undefined;
        }
    }
    exports.TrapLabAudio = TrapLabAudio;
    
  };
  __modules["games/trap-lab/content/trap-lab-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TRAP_LAB_COMPARISON = exports.TRAP_LAB_PSEUDOCODE = exports.TRAP_LAB_HISTORY = void 0;
    exports.TRAP_LAB_HISTORY = {
        title: 'Quando o cenário passou a ensinar pelo movimento',
        paragraphs: [
            'Em 1985, jogos de plataforma para consoles de 8 bits consolidaram sprites, tilemaps, rolagem lateral e fases que ensinavam suas regras pela própria disposição do cenário.',
            'Super Mario Bros., de Shigeru Miyamoto e Takashi Tezuka, tornou-se uma referência histórica desse período ao combinar leitura visual, aceleração, saltos e progressão de dificuldade dentro das limitações do Famicom e do NES.',
            'Trap Lab é um laboratório autoral do Fliperama DS. Personagem, mapas, armadilhas, portões, lógica, arte, áudio e código são próprios; a obra histórica aparece somente como contexto técnico e educacional.',
        ],
        sourceUrl: 'https://www.nintendo.com/jp/character/mario/en/history/smb/index.html',
    };
    exports.TRAP_LAB_PSEUDOCODE = `A CADA PASSO DA SIMULAÇÃO:
      aplicar aceleração horizontal conforme a entrada
      aplicar gravidade e limitar a velocidade de queda
      mover por pequenos subpassos
      resolver colisões contra tiles sólidos e portões
    
    AO TOCAR UM CHECKPOINT:
      salvar a posição segura
      registrar o progresso da fase
    
    AO INTERAGIR COM UM TERMINAL:
      ler a sequência criada no editor
      se a ordem for correta, desativar armadilhas e abrir o portão
      se a ordem for incorreta, ativar o pulso de risco
    
    AO TOCAR UMA ARMADILHA OU CAIR:
      perder uma vida
      retornar ao último checkpoint
    
    AO ALCANÇAR A SAÍDA:
      carregar a próxima fase
      após a terceira fase, concluir o laboratório`;
    exports.TRAP_LAB_COMPARISON = [
        ['Cenário', 'Tiles reutilizados para formar fases laterais', 'Três mapas autorais orientados a dados e desenhados proceduralmente'],
        ['Movimento', 'Aceleração, salto e colisão ajustados ao hardware de 8 bits', 'Física determinística em TypeScript, separada do Phaser'],
        ['Progressão', 'Obstáculos ensinados pela ordem das fases', 'Checkpoints, portões, terminais e sequência lógica editável'],
        ['Tecnologia', 'Ricoh 2A03/6502, sprites e tilemaps', 'Tilemap serializável, subpassos de física e renderização dinâmica'],
        ['Controle', 'Controle digital de console', 'Teclado, toque, tela cheia móvel e pausa automática'],
        ['Identidade', 'Obra comercial de 1985', 'Personagem, mapas, regras, arte e código próprios do Fliperama DS'],
    ];
    
  };
  __modules["games/trap-lab/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const trap_lab_runtime_1 = __require("games/trap-lab/phaser/trap-lab-runtime");
    function createRuntime() {
        return new trap_lab_runtime_1.TrapLabRuntime();
    }
    
  };
  __modules["games/trap-lab/levels/trap-lab-levels"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TRAP_LEVELS = exports.TRAP_ROWS = exports.TRAP_COLUMNS = void 0;
    exports.tileAt = tileAt;
    exports.findTile = findTile;
    exports.TRAP_COLUMNS = 42;
    exports.TRAP_ROWS = 14;
    function createGrid() {
        return Array.from({ length: exports.TRAP_ROWS }, () => Array(exports.TRAP_COLUMNS).fill('.'));
    }
    function fill(grid, row, from, to, tile) {
        for (let column = from; column <= to; column += 1)
            grid[row][column] = tile;
    }
    function set(grid, row, column, tile) {
        grid[row][column] = tile;
    }
    function freezeLevel(id, title, hint, build) {
        const grid = createGrid();
        build(grid);
        const rows = grid.map((row) => row.join(''));
        if (rows.length !== exports.TRAP_ROWS || rows.some((row) => row.length !== exports.TRAP_COLUMNS))
            throw new Error('Mapa do Trap Lab inválido');
        return { id, title, hint, rows };
    }
    exports.TRAP_LEVELS = [
        freezeLevel(1, 'Leitura de terreno', 'Use o ritmo dos espinhos e alcance o primeiro checkpoint.', (grid) => {
            fill(grid, 13, 0, 41, '#');
            fill(grid, 10, 5, 10, '#');
            fill(grid, 8, 14, 20, '#');
            fill(grid, 11, 24, 28, '#');
            fill(grid, 9, 31, 36, '#');
            set(grid, 12, 2, 'S');
            set(grid, 12, 11, '^');
            set(grid, 12, 12, '^');
            set(grid, 7, 17, '*');
            set(grid, 12, 21, 'C');
            set(grid, 12, 29, '^');
            set(grid, 12, 30, '^');
            set(grid, 8, 34, '*');
            set(grid, 12, 39, 'E');
        }),
        freezeLevel(2, 'Sequência de segurança', 'Use o terminal e execute a sequência lógica antes do portão.', (grid) => {
            fill(grid, 13, 0, 41, '#');
            fill(grid, 13, 15, 17, '.');
            fill(grid, 10, 12, 19, '#');
            fill(grid, 9, 22, 27, '#');
            fill(grid, 11, 32, 36, '#');
            fill(grid, 9, 30, 30, 'G');
            fill(grid, 10, 30, 30, 'G');
            fill(grid, 11, 30, 30, 'G');
            fill(grid, 12, 30, 30, 'G');
            set(grid, 12, 2, 'S');
            set(grid, 12, 8, 'T');
            set(grid, 12, 11, '^');
            set(grid, 9, 16, '*');
            set(grid, 12, 21, 'C');
            set(grid, 8, 25, '*');
            set(grid, 12, 28, '^');
            set(grid, 12, 38, 'E');
        }),
        freezeLevel(3, 'Circuito de precisão', 'Combine checkpoints, saltos e o terminal final para concluir o laboratório.', (grid) => {
            fill(grid, 13, 0, 41, '#');
            fill(grid, 13, 9, 11, '.');
            fill(grid, 13, 24, 26, '.');
            fill(grid, 10, 5, 8, '#');
            fill(grid, 8, 12, 16, '#');
            fill(grid, 11, 19, 23, '#');
            fill(grid, 9, 27, 31, '#');
            fill(grid, 7, 34, 38, '#');
            fill(grid, 8, 40, 40, 'G');
            fill(grid, 9, 40, 40, 'G');
            fill(grid, 10, 40, 40, 'G');
            fill(grid, 11, 40, 40, 'G');
            fill(grid, 12, 40, 40, 'G');
            set(grid, 12, 2, 'S');
            set(grid, 9, 7, '*');
            set(grid, 7, 14, 'C');
            set(grid, 12, 18, '^');
            set(grid, 10, 21, '*');
            set(grid, 8, 29, 'C');
            set(grid, 6, 36, '*');
            set(grid, 8, 38, 'T');
            set(grid, 12, 41, 'E');
        }),
    ];
    function tileAt(level, column, row) {
        if (column < 0 || column >= exports.TRAP_COLUMNS || row < 0 || row >= exports.TRAP_ROWS)
            return '#';
        return (level.rows[row]?.[column] ?? '#');
    }
    function findTile(level, tile) {
        for (let row = 0; row < exports.TRAP_ROWS; row += 1) {
            const column = level.rows[row].indexOf(tile);
            if (column >= 0)
                return { x: column + 0.5, y: row + 0.5 };
        }
        return undefined;
    }
    
  };
  __modules["games/trap-lab/phaser/trap-lab-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrapLabRuntime = void 0;
    const trap_lab_audio_1 = __require("games/trap-lab/audio/trap-lab-audio");
    const trap_lab_levels_1 = __require("games/trap-lab/levels/trap-lab-levels");
    const trap_lab_simulation_1 = __require("games/trap-lab/simulation/trap-lab-simulation");
    class TrapLabRuntime {
        id = 'trap-lab';
        state = 'not-loaded';
        #simulation = new trap_lab_simulation_1.TrapLabSimulation();
        #game;
        #graphics;
        #audio;
        #context;
        #left = false;
        #right = false;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new trap_lab_simulation_1.TrapLabSimulation(parseMode(context.parameters?.mode), parseSequence(context.parameters?.sequence));
            this.#audio = new trap_lab_audio_1.TrapLabAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class TrapLabScene extends Phaser.Scene {
                #view;
                constructor() { super('trap-lab'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 620,
                backgroundColor: '#050914',
                transparent: false,
                scene: TrapLabScene,
                render: {
                    antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo',
                    pixelArt: context.graphicsMode === 'historico',
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'victory' || current.status === 'game-over')
                this.#simulation.restart(current.mode, current.sequence);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve', detail: { level: this.#simulation.state.level } });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#clearMovement();
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-left')
                this.#left = input.active;
            if (input.action === 'move-right')
                this.#right = input.active;
            this.#simulation.setMoveDirection(this.#left === this.#right ? 0 : this.#left ? -1 : 1);
            if (input.action === 'jump' && input.active)
                this.#processEvents(this.#simulation.jump());
            if (input.action === 'interact' && input.active)
                this.#processEvents(this.#simulation.interact());
            this.#redraw();
        }
        snapshot() {
            const state = this.#simulation.state;
            return {
                schemaVersion: 1,
                gameId: this.id,
                elapsedMs: state.elapsedMs,
                score: state.score,
                payload: { ...state },
            };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'victory' || status === 'game-over' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#clearMovement();
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #clearMovement() {
            this.#left = false;
            this.#right = false;
            this.#simulation.setMoveDirection(0);
        }
        #processEvents(events) {
            if (events.length === 0)
                return;
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            const progressEvent = events.find((event) => event !== 'jump');
            if (progressEvent) {
                this.#context?.onEvent?.({
                    type: 'progress',
                    detail: {
                        event: progressEvent,
                        score: current.score,
                        lives: current.lives,
                        level: current.level,
                        deaths: current.deaths,
                        gateOpen: current.gateOpen,
                    },
                });
            }
            if (events.includes('victory') || events.includes('game-over')) {
                this.state = 'finished';
                this.#context?.onEvent?.({
                    type: 'finished',
                    detail: {
                        winner: events.includes('victory') ? 'player' : 'traps',
                        score: current.score,
                        lives: current.lives,
                        level: current.level,
                        deaths: current.deaths,
                    },
                });
            }
        }
        #redraw() {
            const graphics = this.#graphics;
            const scale = this.#game?.scale;
            if (graphics && scale)
                this.#draw(graphics, scale.width, scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const level = trap_lab_levels_1.TRAP_LEVELS[state.level - 1] ?? trap_lab_levels_1.TRAP_LEVELS[0];
            const mode = this.#context?.graphicsMode ?? 'medio';
            const historical = mode === 'historico';
            const low = mode === 'baixo';
            const tileSize = Math.max(18, height / trap_lab_levels_1.TRAP_ROWS);
            const visibleColumns = width / tileSize;
            const cameraX = clamp(state.player.x - visibleColumns * 0.45, 0, Math.max(0, trap_lab_levels_1.TRAP_COLUMNS - visibleColumns));
            const worldX = (column) => (column - cameraX) * tileSize;
            const worldY = (row) => row * tileSize;
            const primary = historical ? 0xf2f2f2 : 0x49e7ff;
            const secondary = historical ? 0xb0b0b0 : 0x9273ff;
            const accent = historical ? 0xd5d5d5 : 0x4ee0a8;
            const danger = historical ? 0x8d8d8d : 0xff5d7a;
            const trapActive = (0, trap_lab_simulation_1.isTrapCurrentlyActive)(state);
            graphics.clear();
            graphics.fillStyle(historical ? 0x050505 : 0x050914, 1);
            graphics.fillRect(0, 0, width, height);
            if (!historical && !low) {
                graphics.lineStyle(1, primary, 0.055);
                for (let column = Math.floor(cameraX); column <= Math.ceil(cameraX + visibleColumns); column += 1) {
                    const x = worldX(column);
                    graphics.lineBetween(x, 0, x, height);
                }
                for (let row = 0; row <= trap_lab_levels_1.TRAP_ROWS; row += 1)
                    graphics.lineBetween(0, worldY(row), width, worldY(row));
            }
            const startColumn = Math.max(0, Math.floor(cameraX) - 1);
            const endColumn = Math.min(trap_lab_levels_1.TRAP_COLUMNS - 1, Math.ceil(cameraX + visibleColumns) + 1);
            for (let row = 0; row < trap_lab_levels_1.TRAP_ROWS; row += 1) {
                for (let column = startColumn; column <= endColumn; column += 1) {
                    const tile = (0, trap_lab_levels_1.tileAt)(level, column, row);
                    const x = worldX(column);
                    const y = worldY(row);
                    if (tile === '#') {
                        graphics.fillStyle(historical ? 0x9a9a9a : 0x14233f, 1);
                        graphics.fillRect(x, y, tileSize, tileSize);
                        graphics.lineStyle(Math.max(1, tileSize * 0.035), historical ? 0xd8d8d8 : 0x284b75, 0.75);
                        graphics.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
                    }
                    else if (tile === '^') {
                        graphics.fillStyle(trapActive ? danger : (historical ? 0x555555 : 0x49233a), trapActive ? 1 : 0.45);
                        graphics.fillTriangle(x, y + tileSize, x + tileSize * 0.5, y + tileSize * 0.2, x + tileSize, y + tileSize);
                    }
                    else if (tile === 'C') {
                        graphics.lineStyle(Math.max(2, tileSize * 0.06), accent, 0.9);
                        graphics.lineBetween(x + tileSize * 0.5, y + tileSize * 0.15, x + tileSize * 0.5, y + tileSize * 0.9);
                        graphics.fillStyle(accent, 0.9);
                        graphics.fillTriangle(x + tileSize * 0.52, y + tileSize * 0.18, x + tileSize * 0.92, y + tileSize * 0.34, x + tileSize * 0.52, y + tileSize * 0.5);
                    }
                    else if (tile === 'T') {
                        graphics.fillStyle(secondary, 0.95);
                        graphics.fillRoundedRect(x + tileSize * 0.16, y + tileSize * 0.18, tileSize * 0.68, tileSize * 0.72, tileSize * 0.08);
                        graphics.fillStyle(historical ? 0x101010 : 0x050914, 1);
                        graphics.fillRect(x + tileSize * 0.28, y + tileSize * 0.3, tileSize * 0.44, tileSize * 0.24);
                        graphics.fillStyle(state.sequenceSolved ? accent : primary, 1);
                        graphics.fillCircle(x + tileSize * 0.5, y + tileSize * 0.68, tileSize * 0.08);
                    }
                    else if (tile === 'G' && !state.gateOpen) {
                        graphics.fillStyle(secondary, 0.85);
                        graphics.fillRect(x + tileSize * 0.12, y, tileSize * 0.18, tileSize);
                        graphics.fillRect(x + tileSize * 0.42, y, tileSize * 0.18, tileSize);
                        graphics.fillRect(x + tileSize * 0.72, y, tileSize * 0.18, tileSize);
                    }
                    else if (tile === 'E') {
                        graphics.lineStyle(Math.max(2, tileSize * 0.06), accent, 1);
                        graphics.strokeRoundedRect(x + tileSize * 0.16, y + tileSize * 0.08, tileSize * 0.68, tileSize * 0.86, tileSize * 0.12);
                        graphics.fillStyle(accent, 0.18);
                        graphics.fillRect(x + tileSize * 0.24, y + tileSize * 0.16, tileSize * 0.52, tileSize * 0.7);
                    }
                    else if (tile === '*') {
                        const id = `${state.level}:${column}:${row}`;
                        if (!state.collected.includes(id)) {
                            graphics.fillStyle(primary, 1);
                            graphics.fillCircle(x + tileSize * 0.5, y + tileSize * 0.5, tileSize * 0.13);
                            graphics.lineStyle(Math.max(1, tileSize * 0.035), primary, 0.45);
                            graphics.strokeCircle(x + tileSize * 0.5, y + tileSize * 0.5, tileSize * 0.23);
                        }
                    }
                }
            }
            const playerX = worldX(state.player.x) - tileSize * 0.31;
            const playerY = worldY(state.player.y) - tileSize * 0.44;
            graphics.fillStyle(primary, 1);
            graphics.fillRoundedRect(playerX, playerY, tileSize * 0.62, tileSize * 0.88, tileSize * 0.12);
            graphics.fillStyle(historical ? 0x050505 : 0x050914, 1);
            graphics.fillRect(playerX + tileSize * 0.14, playerY + tileSize * 0.18, tileSize * 0.12, tileSize * 0.12);
            graphics.fillRect(playerX + tileSize * 0.36, playerY + tileSize * 0.18, tileSize * 0.12, tileSize * 0.12);
            graphics.fillStyle(accent, 1);
            graphics.fillRect(playerX + tileSize * 0.12, playerY + tileSize * 0.7, tileSize * 0.38, tileSize * 0.08);
            graphics.fillStyle(historical ? 0x111111 : 0x07101e, 0.9);
            graphics.fillRoundedRect(12, 12, Math.min(width - 24, 320), 40, 8);
            graphics.lineStyle(1, primary, 0.35);
            graphics.strokeRoundedRect(12, 12, Math.min(width - 24, 320), 40, 8);
        }
    }
    exports.TrapLabRuntime = TrapLabRuntime;
    function parseMode(value) {
        if (value === 'explorador' || value === 'precisao')
            return value;
        return 'programador';
    }
    function parseSequence(value) {
        if (typeof value !== 'string')
            return ['aguardar', 'desativar', 'abrir'];
        return value.split(',').filter((command) => ['aguardar', 'desativar', 'abrir', 'verificar'].includes(command)).slice(0, 3);
    }
    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
    
  };
  __modules["games/trap-lab/simulation/trap-lab-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrapLabSimulation = void 0;
    exports.isTrapCurrentlyActive = isTrapCurrentlyActive;
    const trap_lab_levels_1 = __require("games/trap-lab/levels/trap-lab-levels");
    const MODE_SPECS = {
        explorador: { lives: 5, moveSpeed: 6.4, acceleration: 34, jumpSpeed: 11.8, trapPeriodMs: 1900 },
        programador: { lives: 4, moveSpeed: 6.9, acceleration: 40, jumpSpeed: 11.6, trapPeriodMs: 1500 },
        precisao: { lives: 3, moveSpeed: 7.4, acceleration: 48, jumpSpeed: 11.3, trapPeriodMs: 1180 },
    };
    const CORRECT_SEQUENCE = ['aguardar', 'desativar', 'abrir'];
    const PLAYER_HALF_WIDTH = 0.31;
    const PLAYER_HALF_HEIGHT = 0.44;
    const GRAVITY = 29;
    const MAX_FALL_SPEED = 17;
    const INTERACT_DISTANCE = 1.45;
    function isTrapCurrentlyActive(state) {
        return !state.trapDisabled && state.trapTimerMs < MODE_SPECS[state.mode].trapPeriodMs * 0.58;
    }
    class TrapLabSimulation {
        #state;
        #moveDirection = 0;
        constructor(mode = 'programador', sequence = CORRECT_SEQUENCE) {
            this.#state = this.#initialState(mode, normalizeSequence(sequence));
        }
        get state() {
            return cloneState(this.#state);
        }
        get level() {
            return trap_lab_levels_1.TRAP_LEVELS[this.#state.level - 1] ?? trap_lab_levels_1.TRAP_LEVELS[0];
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing' };
        }
        restart(mode = this.#state.mode, sequence = this.#state.sequence) {
            this.#moveDirection = 0;
            this.#state = this.#initialState(mode, normalizeSequence(sequence));
        }
        setMoveDirection(direction) {
            this.#moveDirection = direction;
        }
        jump() {
            if (this.#state.status !== 'playing' || !this.#state.player.grounded)
                return [];
            this.#state = {
                ...this.#state,
                player: { ...this.#state.player, vy: -MODE_SPECS[this.#state.mode].jumpSpeed, grounded: false },
            };
            return ['jump'];
        }
        interact() {
            if (this.#state.status !== 'playing')
                return [];
            const terminal = findNearestTile(this.level, 'T', this.#state.player.x, this.#state.player.y);
            if (!terminal || distance(terminal.x, terminal.y, this.#state.player.x, this.#state.player.y) > INTERACT_DISTANCE)
                return [];
            const solved = sequencesMatch(this.#state.sequence, CORRECT_SEQUENCE);
            if (solved) {
                if (this.#state.sequenceSolved)
                    return [];
                this.#state = {
                    ...this.#state,
                    gateOpen: true,
                    trapDisabled: true,
                    sequenceSolved: true,
                    score: this.#state.score + 250,
                };
                return ['sequence-solved'];
            }
            this.#state = {
                ...this.#state,
                trapDisabled: false,
                trapTimerMs: 0,
                sequenceSolved: false,
            };
            return ['sequence-failed'];
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 34);
            const events = [];
            const spec = MODE_SPECS[this.#state.mode];
            let state = cloneState(this.#state);
            let remainingMs = safeDelta;
            while (remainingMs > 0 && state.status === 'playing') {
                const sliceMs = Math.min(remainingMs, 8.5);
                const dt = sliceMs / 1000;
                const targetVx = this.#moveDirection * spec.moveSpeed;
                const vx = approach(state.player.vx, targetVx, spec.acceleration * dt);
                const vy = Math.min(MAX_FALL_SPEED, state.player.vy + GRAVITY * dt);
                let player = { ...state.player, vx, vy };
                player = moveHorizontal(this.level, player, vx * dt, state.gateOpen);
                player = moveVertical(this.level, player, vy * dt, state.gateOpen);
                let trapTimerMs = state.trapDisabled ? state.trapTimerMs : (state.trapTimerMs + sliceMs) % spec.trapPeriodMs;
                const trapActive = !state.trapDisabled && trapTimerMs < spec.trapPeriodMs * 0.58;
                let checkpoint = state.checkpoint;
                let score = state.score;
                let collected = [...state.collected];
                const checkpointTile = findOverlappingTile(this.level, player, 'C');
                if (checkpointTile && (Math.abs(checkpoint.x - checkpointTile.x) > 0.1 || Math.abs(checkpoint.y - checkpointTile.y) > 0.1)) {
                    checkpoint = { x: checkpointTile.x, y: checkpointTile.y - 0.46 };
                    score += 100;
                    events.push('checkpoint');
                }
                const collectible = findOverlappingTile(this.level, player, '*', collected);
                if (collectible) {
                    const id = tileId(this.#state.level, collectible.column, collectible.row);
                    collected.push(id);
                    score += 75;
                    events.push('collectible');
                }
                state = {
                    ...state,
                    player,
                    checkpoint,
                    score,
                    collected,
                    trapTimerMs,
                    elapsedMs: state.elapsedMs + sliceMs,
                };
                if ((trapActive && findOverlappingTile(this.level, player, '^')) || player.y > trap_lab_levels_1.TRAP_ROWS + 1.5) {
                    state = this.#loseLife(state, events);
                    break;
                }
                if (findOverlappingTile(this.level, player, 'E')) {
                    state = this.#completeLevel(state, events);
                    break;
                }
                remainingMs -= sliceMs;
            }
            this.#state = state;
            return events;
        }
        restore(snapshot) {
            if (snapshot.schemaVersion !== 1)
                throw new Error('Save do Trap Lab incompatível');
            if (!trap_lab_levels_1.TRAP_LEVELS[snapshot.level - 1])
                throw new Error('Fase salva inválida');
            this.#moveDirection = 0;
            this.#state = cloneState({ ...snapshot, sequence: normalizeSequence(snapshot.sequence) });
        }
        #loseLife(state, events) {
            const lives = Math.max(0, state.lives - 1);
            events.push('life-lost');
            if (lives === 0) {
                events.push('game-over');
                return { ...state, lives: 0, deaths: state.deaths + 1, status: 'game-over', player: { ...state.player, vx: 0, vy: 0 } };
            }
            return {
                ...state,
                lives,
                deaths: state.deaths + 1,
                player: { x: state.checkpoint.x, y: state.checkpoint.y, vx: 0, vy: 0, grounded: false },
                trapTimerMs: 0,
            };
        }
        #completeLevel(state, events) {
            if (state.level >= trap_lab_levels_1.TRAP_LEVELS.length) {
                events.push('victory');
                return { ...state, status: 'victory', score: state.score + 1000, player: { ...state.player, vx: 0, vy: 0 } };
            }
            const nextLevel = state.level + 1;
            const start = startForLevel(trap_lab_levels_1.TRAP_LEVELS[nextLevel - 1]);
            events.push('level-complete');
            return {
                ...state,
                level: nextLevel,
                player: { x: start.x, y: start.y, vx: 0, vy: 0, grounded: false },
                checkpoint: start,
                score: state.score + 500,
                gateOpen: false,
                trapDisabled: false,
                trapTimerMs: 0,
                sequenceSolved: false,
            };
        }
        #initialState(mode, sequence) {
            const start = startForLevel(trap_lab_levels_1.TRAP_LEVELS[0]);
            return {
                schemaVersion: 1,
                mode,
                status: 'ready',
                level: 1,
                player: { x: start.x, y: start.y, vx: 0, vy: 0, grounded: false },
                checkpoint: start,
                lives: MODE_SPECS[mode].lives,
                score: 0,
                deaths: 0,
                collected: [],
                gateOpen: false,
                trapDisabled: false,
                trapTimerMs: 0,
                sequence,
                sequenceSolved: false,
                elapsedMs: 0,
            };
        }
    }
    exports.TrapLabSimulation = TrapLabSimulation;
    function startForLevel(level) {
        const start = (0, trap_lab_levels_1.findTile)(level, 'S');
        if (!start)
            throw new Error(`Fase ${level.id} sem início`);
        return { x: start.x, y: start.y - 0.46 };
    }
    function moveHorizontal(level, player, amount, gateOpen) {
        if (amount === 0)
            return { ...player, vx: approach(player.vx, 0, 0.01) };
        let x = player.x + amount;
        const direction = Math.sign(amount);
        const edge = x + direction * PLAYER_HALF_WIDTH;
        const rows = coveredRows(player.y);
        for (const row of rows) {
            const column = Math.floor(edge);
            if (isSolid((0, trap_lab_levels_1.tileAt)(level, column, row), gateOpen)) {
                x = direction > 0 ? column - PLAYER_HALF_WIDTH - 0.001 : column + 1 + PLAYER_HALF_WIDTH + 0.001;
                return { ...player, x, vx: 0 };
            }
        }
        return { ...player, x: clamp(x, PLAYER_HALF_WIDTH, trap_lab_levels_1.TRAP_COLUMNS - PLAYER_HALF_WIDTH), vx: player.vx };
    }
    function moveVertical(level, player, amount, gateOpen) {
        if (amount === 0)
            return player;
        let y = player.y + amount;
        const direction = Math.sign(amount);
        const edge = y + direction * PLAYER_HALF_HEIGHT;
        const columns = coveredColumns(player.x);
        for (const column of columns) {
            const row = Math.floor(edge);
            if (isSolid((0, trap_lab_levels_1.tileAt)(level, column, row), gateOpen)) {
                y = direction > 0 ? row - PLAYER_HALF_HEIGHT - 0.001 : row + 1 + PLAYER_HALF_HEIGHT + 0.001;
                return { ...player, y, vy: 0, grounded: direction > 0 };
            }
        }
        return { ...player, y, vy: player.vy, grounded: false };
    }
    function coveredRows(y) {
        return integerRange(Math.floor(y - PLAYER_HALF_HEIGHT + 0.02), Math.floor(y + PLAYER_HALF_HEIGHT - 0.02));
    }
    function coveredColumns(x) {
        return integerRange(Math.floor(x - PLAYER_HALF_WIDTH + 0.02), Math.floor(x + PLAYER_HALF_WIDTH - 0.02));
    }
    function integerRange(from, to) {
        const values = [];
        for (let value = from; value <= to; value += 1)
            values.push(value);
        return values;
    }
    function isSolid(tile, gateOpen) {
        return tile === '#' || (tile === 'G' && !gateOpen);
    }
    function findOverlappingTile(level, player, target, excluded = []) {
        const minColumn = Math.floor(player.x - PLAYER_HALF_WIDTH);
        const maxColumn = Math.floor(player.x + PLAYER_HALF_WIDTH);
        const minRow = Math.floor(player.y - PLAYER_HALF_HEIGHT);
        const maxRow = Math.floor(player.y + PLAYER_HALF_HEIGHT);
        for (let row = minRow; row <= maxRow; row += 1) {
            for (let column = minColumn; column <= maxColumn; column += 1) {
                if ((0, trap_lab_levels_1.tileAt)(level, column, row) !== target)
                    continue;
                if (excluded.includes(tileId(level.id, column, row)))
                    continue;
                return { column, row, x: column + 0.5, y: row + 0.5 };
            }
        }
        return undefined;
    }
    function findNearestTile(level, target, x, y) {
        let best;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let row = 0; row < trap_lab_levels_1.TRAP_ROWS; row += 1) {
            for (let column = 0; column < trap_lab_levels_1.TRAP_COLUMNS; column += 1) {
                if ((0, trap_lab_levels_1.tileAt)(level, column, row) !== target)
                    continue;
                const candidate = { column, row, x: column + 0.5, y: row + 0.5 };
                const candidateDistance = distance(candidate.x, candidate.y, x, y);
                if (candidateDistance < bestDistance) {
                    best = candidate;
                    bestDistance = candidateDistance;
                }
            }
        }
        return best;
    }
    function normalizeSequence(sequence) {
        const valid = sequence.filter((command) => ['aguardar', 'desativar', 'abrir', 'verificar'].includes(command));
        return (valid.length === 3 ? valid : CORRECT_SEQUENCE).slice(0, 3);
    }
    function sequencesMatch(left, right) {
        return left.length === right.length && left.every((value, index) => value === right[index]);
    }
    function cloneState(state) {
        return {
            ...state,
            player: { ...state.player },
            checkpoint: { ...state.checkpoint },
            collected: [...state.collected],
            sequence: [...state.sequence],
        };
    }
    function tileId(level, column, row) {
        return `${level}:${column}:${row}`;
    }
    function distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }
    function approach(value, target, amount) {
        if (value < target)
            return Math.min(target, value + amount);
        if (value > target)
            return Math.max(target, value - amount);
        return value;
    }
    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
    
  };
  __modules["games/vector-fleet/audio/vector-fleet-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorFleetAudio = void 0;
    class VectorFleetAudio {
        #muted;
        #context;
        #lastThrustAt = 0;
        constructor(muted) {
            this.#muted = muted;
        }
        unlock() {
            if (this.#muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.#muted)
                return;
            this.unlock();
            const context = this.#context;
            if (!context)
                return;
            if (event === 'thrust' && context.currentTime - this.#lastThrustAt < 0.085)
                return;
            if (event === 'thrust')
                this.#lastThrustAt = context.currentTime;
            const tones = {
                shot: [620, 0.055, 'square'], thrust: [72, 0.07, 'sawtooth'], pause: [180, 0.09, 'square'],
                'asteroid-hit': [125, 0.11, 'triangle'], 'ship-hit': [58, 0.32, 'sawtooth'],
                'wave-cleared': [720, 0.22, 'triangle'], victory: [940, 0.42, 'triangle'], 'game-over': [46, 0.5, 'sawtooth'],
            };
            const [frequency, duration, type] = tones[event];
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            if (event === 'ship-hit' || event === 'game-over')
                oscillator.frequency.exponentialRampToValueAtTime(Math.max(24, frequency * 0.45), context.currentTime + duration);
            gain.gain.setValueAtTime(event === 'thrust' ? 0.012 : 0.032, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration);
        }
        dispose() {
            if (this.#context)
                void this.#context.close();
            this.#context = undefined;
        }
    }
    exports.VectorFleetAudio = VectorFleetAudio;
    
  };
  __modules["games/vector-fleet/content/vector-fleet-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VECTOR_FLEET_COMPARISON = exports.VECTOR_FLEET_PSEUDOCODE = exports.VECTOR_FLEET_HISTORY = void 0;
    exports.VECTOR_FLEET_HISTORY = {
        title: 'Quando linhas luminosas desenharam o espaço',
        paragraphs: [
            'No fim da década de 1970, arcades com displays vetoriais desenhavam formas diretamente com linhas luminosas, produzindo movimentos nítidos e uma estética diferente das grades de pixels tradicionais.',
            'O Computer History Museum registra que Lunar Lander foi o primeiro arcade da Atari a usar esse tipo de display e que Asteroids veio logo depois, tornando-se um grande sucesso.',
            'Vector Fleet é uma obra autoral inspirada nessa etapa tecnológica. A simulação DS demonstra vetores, ângulos, aceleração, inércia, reaparecimento nas bordas e fragmentação sem reutilizar código, arte, áudio ou identidade comercial.',
        ],
        sourceUrl: 'https://www.computerhistory.org/revolution/minicomputers/11/366/1962',
    };
    exports.VECTOR_FLEET_PSEUDOCODE = `A CADA PASSO DA SIMULAÇÃO:
      girar a nave conforme a entrada
      se o propulsor estiver ativo:
        somar aceleração na direção do ângulo
      aplicar inércia e limitar a velocidade
      mover nave, tiros e asteroides
      reaparecer no lado oposto ao cruzar uma borda
    
    PARA CADA TIRO:
      testar distância até os asteroides
      se houver colisão:
        remover o tiro e o asteroide
        fragmentar asteroides grandes
        somar pontos
    
    SE A ARENA FICAR VAZIA:
      iniciar a próxima onda
      após a quinta onda, concluir a missão`;
    exports.VECTOR_FLEET_COMPARISON = [
        ['Representação', 'Linhas monocromáticas em display vetorial', 'Geometria vetorial responsiva com modos Histórico e DS'],
        ['Movimento', 'Rotação, propulsão e inércia', 'Simulação determinística com velocidade limitada'],
        ['Arena', 'Objetos reaparecem no lado oposto', 'Espaço toroidal preservado em qualquer resolução'],
        ['Progressão', 'Sobrevivência e pontuação', 'Cinco ondas, três dificuldades e save independente'],
        ['Aprendizagem', 'Regras percebidas durante o jogo', 'Vetores, ângulos e colisões explicados em pseudocódigo'],
    ];
    
  };
  __modules["games/vector-fleet/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const vector_fleet_runtime_1 = __require("games/vector-fleet/phaser/vector-fleet-runtime");
    function createRuntime() {
        return new vector_fleet_runtime_1.VectorFleetRuntime();
    }
    
  };
  __modules["games/vector-fleet/phaser/vector-fleet-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorFleetRuntime = void 0;
    const vector_fleet_audio_1 = __require("games/vector-fleet/audio/vector-fleet-audio");
    const vector_fleet_simulation_1 = __require("games/vector-fleet/simulation/vector-fleet-simulation");
    class VectorFleetRuntime {
        id = 'vector-fleet';
        state = 'not-loaded';
        #simulation = new vector_fleet_simulation_1.VectorFleetSimulation();
        #game;
        #graphics;
        #audio;
        #context;
        #left = false;
        #right = false;
        #thrust = false;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            this.#simulation = new vector_fleet_simulation_1.VectorFleetSimulation(parseDifficulty(context.parameters?.difficulty));
            this.#audio = new vector_fleet_audio_1.VectorFleetAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class VectorFleetScene extends Phaser.Scene {
                #view;
                constructor() { super('vector-fleet'); }
                create() {
                    this.#view = this.add.graphics();
                    owner.#graphics = this.#view;
                    this.scale.on('resize', () => owner.#draw(this.#view, this.scale.width, this.scale.height));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    if (owner.#thrust)
                        owner.#audio?.play('thrust');
                    owner.#processEvents(owner.#simulation.step(delta));
                    owner.#draw(this.#view, this.scale.width, this.scale.height);
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 620,
                backgroundColor: '#030710',
                transparent: false,
                scene: VectorFleetScene,
                render: { antialias: context.graphicsMode !== 'historico' && context.graphicsMode !== 'baixo', pixelArt: context.graphicsMode === 'historico' },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            const current = this.#simulation.state;
            if (current.status === 'victory' || current.status === 'game-over')
                this.#simulation.restart(current.difficulty);
            this.#audio?.unlock();
            this.#simulation.start();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve' });
            this.#redraw();
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#clearMovement();
            this.#audio?.play('pause');
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'pause' && input.active) {
                this.state === 'playing' ? this.pause() : this.resume();
                return;
            }
            if (this.state !== 'playing')
                return;
            if (input.action === 'move-left')
                this.#left = input.active;
            if (input.action === 'move-right')
                this.#right = input.active;
            if (input.action === 'move-up')
                this.#thrust = input.active;
            this.#simulation.setRotation(this.#left === this.#right ? 0 : this.#left ? -1 : 1);
            this.#simulation.setThrust(this.#thrust);
            if (input.action === 'primary-action' && input.active)
                this.#processEvents(this.#simulation.fire());
            this.#redraw();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 1, gameId: this.id, elapsedMs: state.elapsedMs, score: state.score, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.status;
            this.state = status === 'victory' || status === 'game-over' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
            this.#redraw();
        }
        dispose() {
            this.#clearMovement();
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#graphics = undefined;
            this.#game = undefined;
            this.state = 'disposed';
        }
        #clearMovement() {
            this.#left = false;
            this.#right = false;
            this.#thrust = false;
            this.#simulation.setRotation(0);
            this.#simulation.setThrust(false);
        }
        #processEvents(events) {
            events.forEach((event) => this.#audio?.play(event));
            const current = this.#simulation.state;
            if (events.includes('asteroid-hit') || events.includes('ship-hit') || events.includes('wave-cleared')) {
                this.#context?.onEvent?.({ type: 'progress', detail: { score: current.score, lives: current.lives, wave: current.wave, event: events.at(-1) ?? '' } });
            }
            if (events.includes('victory') || events.includes('game-over')) {
                this.state = 'finished';
                this.#context?.onEvent?.({ type: 'finished', detail: { winner: events.includes('victory') ? 'player' : 'fleet', score: current.score, lives: current.lives, wave: current.wave } });
            }
        }
        #redraw() {
            const graphics = this.#graphics;
            const scale = this.#game?.scale;
            if (graphics && scale)
                this.#draw(graphics, scale.width, scale.height);
        }
        #draw(graphics, width, height) {
            const state = this.#simulation.state;
            const mode = this.#context?.graphicsMode ?? 'medio';
            const historical = mode === 'historico';
            const primary = historical ? 0x9affad : 0x49e7ff;
            const accent = historical ? 0xd2ffda : 0xa98bff;
            const minSize = Math.min(width, height);
            graphics.clear();
            graphics.fillStyle(historical ? 0x010703 : 0x030710, 1);
            graphics.fillRect(0, 0, width, height);
            if (mode !== 'baixo') {
                const stars = mode === 'ultra' ? 110 : mode === 'alto' ? 72 : 38;
                for (let index = 0; index < stars; index += 1) {
                    const x = (index * 149 + 41) % Math.max(1, Math.floor(width));
                    const y = (index * 83 + 17) % Math.max(1, Math.floor(height));
                    graphics.fillStyle(index % 9 === 0 ? accent : primary, historical ? 0.22 : 0.28);
                    graphics.fillCircle(x, y, index % 11 === 0 ? 1.4 : 0.65);
                }
            }
            graphics.lineStyle(1, primary, historical ? 0.18 : 0.1);
            graphics.strokeRect(1, 1, width - 2, height - 2);
            for (const asteroid of state.asteroids) {
                for (const [x, y] of wrappedPositions(asteroid.x * width, asteroid.y * height, width, height))
                    this.#drawAsteroid(graphics, asteroid, x, y, minSize, primary, accent, historical);
            }
            for (const bullet of state.bullets) {
                for (const [x, y] of wrappedPositions(bullet.x * width, bullet.y * height, width, height)) {
                    graphics.fillStyle(accent, 0.95);
                    graphics.fillCircle(x, y, Math.max(2, minSize * 0.004));
                }
            }
            const visible = state.ship.invulnerableMs <= 0 || Math.floor(state.ship.invulnerableMs / 110) % 2 === 0;
            if (visible) {
                for (const [x, y] of wrappedPositions(state.ship.x * width, state.ship.y * height, width, height)) {
                    this.#drawShip(graphics, x, y, state.ship.angle, minSize, primary, accent, historical);
                }
            }
        }
        #drawShip(graphics, x, y, angle, minSize, primary, accent, historical) {
            const size = Math.max(11, minSize * 0.032);
            const nose = pointAt(x, y, angle, size * 1.2);
            const left = pointAt(x, y, angle + 2.45, size);
            const notch = pointAt(x, y, angle + Math.PI, size * 0.42);
            const right = pointAt(x, y, angle - 2.45, size);
            graphics.lineStyle(historical ? 1.5 : 2, primary, 0.98);
            graphics.beginPath();
            graphics.moveTo(nose.x, nose.y);
            graphics.lineTo(left.x, left.y);
            graphics.lineTo(notch.x, notch.y);
            graphics.lineTo(right.x, right.y);
            graphics.closePath();
            graphics.strokePath();
            if (this.#thrust) {
                const flame = pointAt(x, y, angle + Math.PI, size * (historical ? 1.4 : 1.7));
                graphics.lineStyle(2, accent, 0.85);
                graphics.lineBetween(notch.x, notch.y, flame.x, flame.y);
            }
        }
        #drawAsteroid(graphics, asteroid, x, y, minSize, primary, accent, historical) {
            const radius = asteroid.radius * minSize;
            const vertices = 10;
            graphics.lineStyle(historical ? 1.25 : Math.max(1.5, radius * 0.055), asteroid.tier === 1 ? accent : primary, historical ? 0.82 : 0.9);
            graphics.beginPath();
            for (let index = 0; index < vertices; index += 1) {
                const angle = asteroid.rotation + (index / vertices) * Math.PI * 2;
                const noise = 0.76 + (((asteroid.id * 31 + index * 17) % 29) / 100);
                const px = x + Math.cos(angle) * radius * noise;
                const py = y + Math.sin(angle) * radius * noise;
                if (index === 0)
                    graphics.moveTo(px, py);
                else
                    graphics.lineTo(px, py);
            }
            graphics.closePath();
            graphics.strokePath();
        }
    }
    exports.VectorFleetRuntime = VectorFleetRuntime;
    function wrappedPositions(x, y, width, height) {
        return [-width, 0, width].flatMap((dx) => [-height, 0, height].map((dy) => [x + dx, y + dy]));
    }
    function pointAt(x, y, angle, distance) {
        return { x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance };
    }
    function parseDifficulty(value) {
        return value === 'cadete' || value === 'comandante' ? value : 'piloto';
    }
    
  };
  __modules["games/vector-fleet/simulation/vector-fleet-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorFleetSimulation = void 0;
    const SPECS = {
        cadete: { initialAsteroids: 2, asteroidSpeed: 0.055, shipAcceleration: 0.36, maxShipSpeed: 0.32, shotCooldownMs: 190 },
        piloto: { initialAsteroids: 3, asteroidSpeed: 0.072, shipAcceleration: 0.34, maxShipSpeed: 0.30, shotCooldownMs: 230 },
        comandante: { initialAsteroids: 4, asteroidSpeed: 0.092, shipAcceleration: 0.32, maxShipSpeed: 0.28, shotCooldownMs: 270 },
    };
    const TARGET_WAVE = 5;
    const BULLET_LIFETIME_MS = 1250;
    const SHIP_RADIUS = 0.024;
    class VectorFleetSimulation {
        #state;
        #rotationDirection = 0;
        #thrusting = false;
        constructor(difficulty = 'piloto', seed = Date.now()) {
            this.#state = this.#initialState(difficulty, seed >>> 0);
        }
        get state() {
            return cloneState(this.#state);
        }
        start() {
            if (this.#state.status === 'ready')
                this.#state = { ...this.#state, status: 'playing' };
        }
        restart(difficulty = this.#state.difficulty) {
            this.#rotationDirection = 0;
            this.#thrusting = false;
            this.#state = this.#initialState(difficulty, (this.#state.rngState + 1) >>> 0);
        }
        setRotation(direction) {
            this.#rotationDirection = direction;
        }
        setThrust(active) {
            this.#thrusting = active;
        }
        fire() {
            if (this.#state.status !== 'playing' || this.#state.shotCooldownMs > 0 || this.#state.bullets.length >= 8)
                return [];
            const directionX = Math.cos(this.#state.ship.angle);
            const directionY = Math.sin(this.#state.ship.angle);
            const bullet = {
                id: this.#state.nextEntityId,
                x: wrap(this.#state.ship.x + directionX * 0.035),
                y: wrap(this.#state.ship.y + directionY * 0.035),
                vx: this.#state.ship.vx + directionX * 0.58,
                vy: this.#state.ship.vy + directionY * 0.58,
                ageMs: 0,
            };
            this.#state = {
                ...this.#state,
                bullets: [...this.#state.bullets, bullet],
                shotCooldownMs: SPECS[this.#state.difficulty].shotCooldownMs,
                nextEntityId: this.#state.nextEntityId + 1,
            };
            return ['shot'];
        }
        step(deltaMs) {
            if (this.#state.status !== 'playing')
                return [];
            const safeDelta = Math.min(Math.max(deltaMs, 0), 100);
            const dt = safeDelta / 1000;
            const spec = SPECS[this.#state.difficulty];
            const events = [];
            let ship = this.#advanceShip(this.#state.ship, dt, safeDelta, spec);
            let bullets = this.#state.bullets
                .map((bullet) => ({ ...bullet, x: wrap(bullet.x + bullet.vx * dt), y: wrap(bullet.y + bullet.vy * dt), ageMs: bullet.ageMs + safeDelta }))
                .filter((bullet) => bullet.ageMs < BULLET_LIFETIME_MS);
            let asteroids = this.#state.asteroids.map((asteroid) => ({
                ...asteroid,
                x: wrap(asteroid.x + asteroid.vx * dt),
                y: wrap(asteroid.y + asteroid.vy * dt),
                rotation: asteroid.rotation + asteroid.spin * dt,
            }));
            let score = this.#state.score;
            let rngState = this.#state.rngState;
            let nextEntityId = this.#state.nextEntityId;
            const destroyedBullets = new Set();
            const destroyedAsteroids = new Set();
            const fragments = [];
            for (const bullet of bullets) {
                const asteroid = asteroids.find((candidate) => !destroyedAsteroids.has(candidate.id) && toroidalDistance(bullet.x, bullet.y, candidate.x, candidate.y) <= candidate.radius + 0.008);
                if (!asteroid)
                    continue;
                destroyedBullets.add(bullet.id);
                destroyedAsteroids.add(asteroid.id);
                score += asteroid.tier === 3 ? 20 : asteroid.tier === 2 ? 50 : 100;
                events.push('asteroid-hit');
                if (asteroid.tier > 1) {
                    for (const turn of [-0.72, 0.72]) {
                        const angle = Math.atan2(asteroid.vy, asteroid.vx) + turn;
                        const speed = Math.hypot(asteroid.vx, asteroid.vy) * 1.28;
                        fragments.push({
                            id: nextEntityId++, x: asteroid.x, y: asteroid.y,
                            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                            radius: asteroid.radius * 0.62, tier: (asteroid.tier - 1),
                            rotation: asteroid.rotation + turn, spin: asteroid.spin * -1.2,
                        });
                    }
                }
            }
            bullets = bullets.filter((bullet) => !destroyedBullets.has(bullet.id));
            asteroids = [...asteroids.filter((asteroid) => !destroyedAsteroids.has(asteroid.id)), ...fragments];
            let lives = this.#state.lives;
            if (ship.invulnerableMs <= 0 && asteroids.some((asteroid) => toroidalDistance(ship.x, ship.y, asteroid.x, asteroid.y) <= asteroid.radius + SHIP_RADIUS)) {
                lives -= 1;
                events.push('ship-hit');
                ship = spawnShip(lives > 0 ? 2200 : 0);
                if (lives <= 0)
                    events.push('game-over');
            }
            let wave = this.#state.wave;
            let waveDelayMs = asteroids.length === 0 ? this.#state.waveDelayMs + safeDelta : 0;
            let status = lives <= 0 ? 'game-over' : 'playing';
            if (status === 'playing' && asteroids.length === 0 && waveDelayMs >= 850) {
                if (wave >= TARGET_WAVE) {
                    status = 'victory';
                    events.push('victory');
                }
                else {
                    wave += 1;
                    const spawned = spawnWave(wave, spec, rngState, nextEntityId);
                    asteroids = [...spawned.asteroids];
                    rngState = spawned.rngState;
                    nextEntityId = spawned.nextEntityId;
                    waveDelayMs = 0;
                    events.push('wave-cleared');
                }
            }
            this.#state = {
                ...this.#state, ship, bullets, asteroids, score, lives, wave, status,
                elapsedMs: this.#state.elapsedMs + safeDelta,
                shotCooldownMs: Math.max(0, this.#state.shotCooldownMs - safeDelta),
                waveDelayMs, rngState, nextEntityId,
            };
            return events;
        }
        restore(state) {
            if (state.schemaVersion !== 1)
                throw new Error('Save do Vector Fleet incompatível');
            if (!(state.difficulty in SPECS))
                throw new Error('Dificuldade salva inválida');
            if (!['ready', 'playing', 'victory', 'game-over'].includes(state.status))
                throw new Error('Estado salvo inválido');
            if (state.lives < 0 || state.wave < 1 || state.wave > TARGET_WAVE)
                throw new Error('Progresso salvo inválido');
            this.#rotationDirection = 0;
            this.#thrusting = false;
            this.#state = cloneState(state);
        }
        #advanceShip(ship, dt, deltaMs, spec) {
            const angle = ship.angle + this.#rotationDirection * 3.7 * dt;
            let vx = ship.vx;
            let vy = ship.vy;
            if (this.#thrusting) {
                vx += Math.cos(angle) * spec.shipAcceleration * dt;
                vy += Math.sin(angle) * spec.shipAcceleration * dt;
            }
            const damping = Math.pow(0.992, deltaMs / 16.667);
            vx *= damping;
            vy *= damping;
            const speed = Math.hypot(vx, vy);
            if (speed > spec.maxShipSpeed) {
                const factor = spec.maxShipSpeed / speed;
                vx *= factor;
                vy *= factor;
            }
            return {
                x: wrap(ship.x + vx * dt), y: wrap(ship.y + vy * dt), vx, vy, angle,
                invulnerableMs: Math.max(0, ship.invulnerableMs - deltaMs),
            };
        }
        #initialState(difficulty, seed) {
            const spec = SPECS[difficulty];
            const spawned = spawnWave(1, spec, seed || 0x6d2b79f5, 1);
            return {
                schemaVersion: 1, difficulty, status: 'ready', ship: spawnShip(1800), bullets: [],
                asteroids: spawned.asteroids, score: 0, lives: 3, wave: 1, elapsedMs: 0,
                shotCooldownMs: 0, waveDelayMs: 0, rngState: spawned.rngState, nextEntityId: spawned.nextEntityId,
            };
        }
    }
    exports.VectorFleetSimulation = VectorFleetSimulation;
    function spawnWave(wave, spec, rngState, nextEntityId) {
        const asteroids = [];
        let state = rngState;
        const count = Math.min(7, spec.initialAsteroids + Math.floor((wave - 1) / 2));
        for (let index = 0; index < count; index += 1) {
            state = nextRandom(state);
            const edge = state % 4;
            state = nextRandom(state);
            const offset = 0.08 + (state / 0xffffffff) * 0.84;
            state = nextRandom(state);
            const angle = (state / 0xffffffff) * Math.PI * 2;
            const speed = spec.asteroidSpeed * (1 + wave * 0.075 + (state % 19) / 100);
            const position = edgePosition(edge, offset);
            asteroids.push({
                id: nextEntityId++, x: position.x, y: position.y,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                radius: 0.058, tier: 3, rotation: angle, spin: (index % 2 === 0 ? 1 : -1) * (0.18 + (state % 17) / 100),
            });
        }
        return { asteroids, rngState: state, nextEntityId };
    }
    function edgePosition(edge, offset) {
        if (edge === 0)
            return { x: offset, y: 0.06 };
        if (edge === 1)
            return { x: 0.94, y: offset };
        if (edge === 2)
            return { x: offset, y: 0.94 };
        return { x: 0.06, y: offset };
    }
    function spawnShip(invulnerableMs) {
        return { x: 0.5, y: 0.5, vx: 0, vy: 0, angle: -Math.PI / 2, invulnerableMs };
    }
    function cloneState(state) {
        return { ...state, ship: { ...state.ship }, bullets: state.bullets.map((bullet) => ({ ...bullet })), asteroids: state.asteroids.map((asteroid) => ({ ...asteroid })) };
    }
    function wrap(value) {
        return ((value % 1) + 1) % 1;
    }
    function toroidalDistance(ax, ay, bx, by) {
        const dx = Math.min(Math.abs(ax - bx), 1 - Math.abs(ax - bx));
        const dy = Math.min(Math.abs(ay - by), 1 - Math.abs(ay - by));
        return Math.hypot(dx, dy);
    }
    function nextRandom(state) {
        return (Math.imul(state, 1664525) + 1013904223) >>> 0;
    }
    
  };
  __modules["games/vector-tennis/audio/vector-tennis-audio"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorTennisAudio = void 0;
    class VectorTennisAudio {
        muted;
        #context;
        constructor(muted) {
            this.muted = muted;
        }
        unlock() {
            if (this.muted)
                return;
            this.#context ??= new AudioContext();
            if (this.#context.state === 'suspended')
                void this.#context.resume();
        }
        play(event) {
            if (this.muted)
                return;
            this.unlock();
            if (!this.#context)
                return;
            const tones = {
                'wall-hit': [180, 0.035, 'square'],
                'paddle-hit': [420, 0.045, 'square'],
                'player-point': [660, 0.11, 'sine'],
                'cpu-point': [120, 0.14, 'sawtooth'],
                'match-finished': [880, 0.2, 'sine'],
                serve: [300, 0.06, 'square'],
                pause: [210, 0.055, 'triangle'],
            };
            const [frequency, duration, type] = tones[event];
            const oscillator = this.#context.createOscillator();
            const gain = this.#context.createGain();
            const now = this.#context.currentTime;
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, now);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.07, now + 0.006);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            oscillator.connect(gain).connect(this.#context.destination);
            oscillator.start(now);
            oscillator.stop(now + duration + 0.01);
        }
        dispose() {
            if (this.#context)
                void this.#context.close();
            this.#context = undefined;
        }
    }
    exports.VectorTennisAudio = VectorTennisAudio;
    
  };
  __modules["games/vector-tennis/content/vector-tennis-content"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VECTOR_TENNIS_COMPARISON = exports.VECTOR_TENNIS_PSEUDOCODE = exports.VECTOR_TENNIS_HISTORY = void 0;
    exports.VECTOR_TENNIS_HISTORY = {
        title: 'Antes dos arcades: Tennis for Two',
        paragraphs: [
            'Em 18 de outubro de 1958, visitantes do Brookhaven National Laboratory jogaram Tennis for Two usando dois controles ligados a um computador analógico e um osciloscópio.',
            'A tela mostrava uma visão lateral simplificada: quadra, rede e um ponto luminoso em movimento. A trajetória era calculada por circuitos que representavam gravidade e colisões.',
            'Vector Tennis é uma reconstrução educacional autoral. Ele não reproduz o circuito original: transforma os mesmos conceitos de trajetória, velocidade e rebote em TypeScript com uma simulação determinística.',
        ],
        sourceUrl: 'https://www.bnl.gov/about/history/firstvideo.php',
        sourceLabel: 'Brookhaven National Laboratory — The First Video Game?',
    };
    exports.VECTOR_TENNIS_PSEUDOCODE = `A CADA PASSO DA SIMULAÇÃO
      limitar tempo máximo do quadro
      mover a raquete do jogador
      aproximar a CPU da posição da bola
    
      SE a partida aguarda saque
        manter a bola no centro
      SENÃO
        posição da bola += velocidade × tempo
    
        SE tocar o topo ou a base
          inverter velocidade vertical
    
        SE tocar uma raquete
          inverter velocidade horizontal
          calcular novo ângulo pelo ponto de contato
    
        SE sair pela esquerda ou direita
          registrar ponto
          centralizar a bola
          verificar vitória em 5 pontos`;
    exports.VECTOR_TENNIS_COMPARISON = [
        ['Tela', 'Osciloscópio monocromático', 'Canvas responsivo com Phaser'],
        ['Processamento', 'Computador analógico e circuitos', 'Simulação determinística em TypeScript'],
        ['Entrada', 'Dois controles físicos', 'Teclado, toque e gamepad futuro'],
        ['Visual', 'Linhas e ponto luminoso', 'Modo Histórico ou grade tecnológica DS'],
        ['Persistência', 'Sem save', 'Estado serializável em IndexedDB'],
        ['Objetivo didático', 'Exposição científica interativa', 'Coordenadas, velocidade, colisão e estados'],
    ];
    
  };
  __modules["games/vector-tennis/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const vector_tennis_runtime_1 = __require("games/vector-tennis/phaser/vector-tennis-runtime");
    function createRuntime() {
        return new vector_tennis_runtime_1.VectorTennisRuntime();
    }
    
  };
  __modules["games/vector-tennis/phaser/vector-tennis-runtime"] = (module, exports) => {
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || (function () {
        var ownKeys = function(o) {
            ownKeys = Object.getOwnPropertyNames || function (o) {
                var ar = [];
                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                return ar;
            };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorTennisRuntime = void 0;
    const vector_tennis_audio_1 = __require("games/vector-tennis/audio/vector-tennis-audio");
    const vector_tennis_simulation_1 = __require("games/vector-tennis/simulation/vector-tennis-simulation");
    class VectorTennisRuntime {
        id = 'vector-tennis';
        state = 'not-loaded';
        #simulation = new vector_tennis_simulation_1.VectorTennisSimulation();
        #game;
        #audio;
        #context;
        #movingUp = false;
        #movingDown = false;
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            const difficulty = parseDifficulty(context.parameters?.difficulty);
            this.#simulation = new vector_tennis_simulation_1.VectorTennisSimulation(difficulty);
            this.#audio = new vector_tennis_audio_1.VectorTennisAudio(context.muted);
            const Phaser = await globalThis.__loadPhaser();
            const simulation = this.#simulation;
            const graphicsMode = context.graphicsMode;
            const owner = this;
            let resolveReady;
            const ready = new Promise((resolve) => { resolveReady = resolve; });
            class VectorTennisScene extends Phaser.Scene {
                #graphics;
                constructor() { super('vector-tennis'); }
                create() {
                    this.#graphics = this.add.graphics();
                    this.scale.on('resize', () => owner.#draw(this.#graphics, this.scale.width, this.scale.height, graphicsMode));
                    owner.#draw(this.#graphics, this.scale.width, this.scale.height, graphicsMode);
                    owner.state = 'tutorial';
                    context.onEvent?.({ type: 'ready' });
                    resolveReady?.();
                }
                update(_time, delta) {
                    if (owner.state !== 'playing')
                        return;
                    const events = simulation.step(delta / 1000);
                    owner.#draw(this.#graphics, this.scale.width, this.scale.height, graphicsMode);
                    events.forEach((event) => owner.#audio?.play(event));
                    if (events.includes('player-point') || events.includes('cpu-point')) {
                        context.onEvent?.({
                            type: 'point',
                            detail: { playerScore: simulation.state.playerScore, cpuScore: simulation.state.cpuScore },
                        });
                    }
                    if (events.includes('match-finished')) {
                        owner.state = 'finished';
                        context.onEvent?.({
                            type: 'finished',
                            detail: {
                                winner: simulation.state.matchStatus === 'player-won' ? 'player' : 'cpu',
                                playerScore: simulation.state.playerScore,
                                cpuScore: simulation.state.cpuScore,
                                longestRally: simulation.state.longestRally,
                            },
                        });
                    }
                }
            }
            this.#game = new Phaser.Game({
                type: Phaser.AUTO,
                parent: context.container,
                width: 960,
                height: 540,
                backgroundColor: '#050914',
                transparent: false,
                scene: VectorTennisScene,
                render: { antialias: graphicsMode !== 'historico' && graphicsMode !== 'baixo', pixelArt: graphicsMode === 'historico' },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                audio: { noAudio: true },
            });
            await ready;
        }
        start() {
            if (this.state === 'finished' || this.#simulation.state.matchStatus === 'player-won' || this.#simulation.state.matchStatus === 'cpu-won') {
                this.#simulation.restart();
            }
            this.#audio?.unlock();
            this.#audio?.play('serve');
            this.#simulation.serve();
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'serve' });
        }
        pause() {
            if (this.state !== 'playing')
                return;
            this.state = 'paused';
            this.#audio?.play('pause');
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        }
        resume() {
            if (this.state !== 'paused')
                return;
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        }
        dispatch(input) {
            if (input.action === 'move-up')
                this.#movingUp = input.active;
            if (input.action === 'move-down')
                this.#movingDown = input.active;
            const direction = (this.#movingDown ? 1 : 0) - (this.#movingUp ? 1 : 0);
            this.#simulation.setPlayerDirection(direction);
            if (input.action === 'primary-action' && input.active)
                this.start();
            if (input.action === 'pause' && input.active)
                this.state === 'playing' ? this.pause() : this.resume();
        }
        snapshot() {
            const state = this.#simulation.state;
            return { schemaVersion: 2, gameId: this.id, elapsedMs: state.elapsedMs, score: state.playerScore, payload: { ...state } };
        }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            this.#simulation.restore(snapshot.payload);
            const status = this.#simulation.state.matchStatus;
            this.state = status === 'player-won' || status === 'cpu-won' ? 'finished' : status === 'playing' ? 'paused' : 'menu';
        }
        dispose() {
            this.#audio?.dispose();
            this.#game?.destroy(true);
            this.#game = undefined;
            this.state = 'disposed';
        }
        #draw(graphics, width, height, graphicsMode) {
            const state = this.#simulation.state;
            const historical = graphicsMode === 'historico';
            const scale = Math.min(width / 960, height / 540);
            const paddleWidth = Math.max(8, 13 * scale);
            const paddleHeight = height * 0.24;
            graphics.clear();
            if (!historical) {
                graphics.fillGradientStyle(0x071126, 0x071126, 0x030610, 0x030610, 1);
                graphics.fillRect(0, 0, width, height);
                graphics.lineStyle(1, 0x102b46, 0.32);
                for (let x = 0; x < width; x += Math.max(32, width / 18))
                    graphics.lineBetween(x, 0, x, height);
                for (let y = 0; y < height; y += Math.max(32, height / 10))
                    graphics.lineBetween(0, y, width, y);
            }
            graphics.lineStyle(Math.max(1, scale), historical ? 0xffffff : 0x23415f, 0.8);
            graphics.strokeRect(1, 1, width - 2, height - 2);
            for (let y = 12; y < height; y += 28)
                graphics.lineBetween(width / 2, y, width / 2, Math.min(y + 13, height));
            graphics.fillStyle(historical ? 0xffffff : 0x49e7ff, 1);
            graphics.fillRoundedRect(width * 0.05, state.leftY * height - paddleHeight / 2, paddleWidth, paddleHeight, historical ? 0 : 3);
            graphics.fillStyle(historical ? 0xffffff : 0x9273ff, 1);
            graphics.fillRoundedRect(width * 0.95 - paddleWidth, state.rightY * height - paddleHeight / 2, paddleWidth, paddleHeight, historical ? 0 : 3);
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(state.ballX * width, state.ballY * height, Math.max(5, width * 0.009));
        }
    }
    exports.VectorTennisRuntime = VectorTennisRuntime;
    function parseDifficulty(value) {
        return value === 'iniciante' || value === 'desafio' ? value : 'normal';
    }
    
  };
  __modules["games/vector-tennis/simulation/vector-tennis-simulation"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorTennisSimulation = exports.DIFFICULTY_PRESETS = void 0;
    exports.DIFFICULTY_PRESETS = {
        iniciante: { cpuSpeed: 0.32, ballSpeed: 0.38, cpuError: 0.07 },
        normal: { cpuSpeed: 0.46, ballSpeed: 0.43, cpuError: 0.025 },
        desafio: { cpuSpeed: 0.58, ballSpeed: 0.49, cpuError: 0 },
    };
    const PADDLE_HEIGHT = 0.24;
    const BALL_RADIUS = 0.018;
    const PADDLE_SPEED = 0.72;
    const DEFAULT_TARGET_SCORE = 5;
    class VectorTennisSimulation {
        #state;
        #playerDirection = 0;
        constructor(difficulty = 'normal') {
            this.#state = VectorTennisSimulation.initialState(difficulty);
        }
        static initialState(difficulty = 'normal') {
            return {
                schemaVersion: 2,
                leftY: 0.5,
                rightY: 0.5,
                ballX: 0.5,
                ballY: 0.5,
                ballVx: exports.DIFFICULTY_PRESETS[difficulty].ballSpeed,
                ballVy: 0.2,
                playerScore: 0,
                cpuScore: 0,
                elapsedMs: 0,
                serving: true,
                difficulty,
                targetScore: DEFAULT_TARGET_SCORE,
                matchStatus: 'ready',
                rallyHits: 0,
                longestRally: 0,
            };
        }
        get state() {
            return this.#state;
        }
        setPlayerDirection(direction) {
            this.#playerDirection = direction;
        }
        serve() {
            if (this.#state.matchStatus === 'player-won' || this.#state.matchStatus === 'cpu-won')
                return;
            if (this.#state.serving)
                this.#state = { ...this.#state, serving: false, matchStatus: 'playing' };
        }
        restart(difficulty = this.#state.difficulty) {
            this.#state = VectorTennisSimulation.initialState(difficulty);
            this.#playerDirection = 0;
        }
        step(deltaSeconds) {
            const events = [];
            const dt = Math.min(deltaSeconds, 1 / 30);
            const state = this.#state;
            const leftY = clampPaddle(state.leftY + this.#playerDirection * PADDLE_SPEED * dt);
            const preset = exports.DIFFICULTY_PRESETS[state.difficulty];
            const errorOffset = preset.cpuError * Math.sin(state.elapsedMs / 370);
            const cpuTarget = state.ballY + errorOffset;
            const cpuDelta = Math.sign(cpuTarget - state.rightY) * Math.min(Math.abs(cpuTarget - state.rightY), preset.cpuSpeed * dt);
            const rightY = clampPaddle(state.rightY + cpuDelta);
            if (state.serving || state.matchStatus !== 'playing') {
                this.#state = { ...state, leftY, rightY, elapsedMs: state.elapsedMs + dt * 1000 };
                return events;
            }
            let ballX = state.ballX + state.ballVx * dt;
            let ballY = state.ballY + state.ballVy * dt;
            let ballVx = state.ballVx;
            let ballVy = state.ballVy;
            let rallyHits = state.rallyHits;
            let longestRally = state.longestRally;
            if (ballY <= BALL_RADIUS || ballY >= 1 - BALL_RADIUS) {
                ballY = Math.min(1 - BALL_RADIUS, Math.max(BALL_RADIUS, ballY));
                ballVy *= -1;
                events.push('wall-hit');
            }
            const hitLeft = ballVx < 0 && ballX <= 0.075 && ballX >= 0.045 && Math.abs(ballY - leftY) <= PADDLE_HEIGHT / 2;
            const hitRight = ballVx > 0 && ballX >= 0.925 && ballX <= 0.955 && Math.abs(ballY - rightY) <= PADDLE_HEIGHT / 2;
            if (hitLeft || hitRight) {
                ballX = hitLeft ? 0.076 : 0.924;
                ballVx *= -1.045;
                const paddleY = hitLeft ? leftY : rightY;
                ballVy = clamp((ballY - paddleY) * 2.1, -0.66, 0.66);
                rallyHits += 1;
                longestRally = Math.max(longestRally, rallyHits);
                events.push('paddle-hit');
            }
            if (ballX < -BALL_RADIUS) {
                this.#state = this.#afterPoint(state.playerScore, state.cpuScore + 1, -1, longestRally);
                events.push('cpu-point');
                if (this.#state.matchStatus === 'cpu-won')
                    events.push('match-finished');
                return events;
            }
            if (ballX > 1 + BALL_RADIUS) {
                this.#state = this.#afterPoint(state.playerScore + 1, state.cpuScore, 1, longestRally);
                events.push('player-point');
                if (this.#state.matchStatus === 'player-won')
                    events.push('match-finished');
                return events;
            }
            this.#state = { ...state, leftY, rightY, ballX, ballY, ballVx, ballVy, rallyHits, longestRally, elapsedMs: state.elapsedMs + dt * 1000 };
            return events;
        }
        restore(state) {
            if (state.schemaVersion === 1) {
                this.#state = {
                    ...VectorTennisSimulation.initialState('normal'),
                    ...state,
                    schemaVersion: 2,
                    difficulty: 'normal',
                    targetScore: DEFAULT_TARGET_SCORE,
                    matchStatus: state.serving ? 'ready' : 'playing',
                    rallyHits: 0,
                    longestRally: 0,
                };
                return;
            }
            if (state.schemaVersion !== 2)
                throw new Error('Save do Vector Tennis incompatível');
            this.#state = { ...state };
        }
        #afterPoint(playerScore, cpuScore, direction, longestRally) {
            const matchStatus = playerScore >= this.#state.targetScore
                ? 'player-won'
                : cpuScore >= this.#state.targetScore ? 'cpu-won' : 'ready';
            return {
                ...this.#state,
                playerScore,
                cpuScore,
                ballX: 0.5,
                ballY: 0.5,
                ballVx: exports.DIFFICULTY_PRESETS[this.#state.difficulty].ballSpeed * direction,
                ballVy: ((playerScore + cpuScore) % 2 === 0 ? 0.2 : -0.2),
                serving: true,
                matchStatus,
                rallyHits: 0,
                longestRally,
            };
        }
    }
    exports.VectorTennisSimulation = VectorTennisSimulation;
    function clampPaddle(value) {
        return clamp(value, PADDLE_HEIGHT / 2, 1 - PADDLE_HEIGHT / 2);
    }
    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
    
  };
  __modules["games/voxelcraft-ds/index"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRuntime = createRuntime;
    const voxelcraft_runtime_1 = __require("games/voxelcraft-ds/voxelcraft-runtime");
    function createRuntime() { return new voxelcraft_runtime_1.VoxelCraftRuntime(); }
    
  };
  __modules["games/voxelcraft-ds/voxelcraft-runtime"] = (module, exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VoxelCraftRuntime = void 0;
    const QUALITY_MAP = { automatico: 'auto', baixo: 'low', medio: 'medium', alto: 'high', ultra: 'ultra', historico: 'low' };
    class VoxelCraftRuntime {
        id = 'voxelcraft-ds';
        state = 'not-loaded';
        #context;
        #frame;
        #listener;
        #summary = { mode: 'learning', quality: 'auto', xp: 0, progress: 0, chunks: 0, triangles: 0, edits: 0, savedAt: 0 };
        async mount(context) {
            this.state = 'loading';
            this.#context = context;
            const mode = String(context.parameters?.mode ?? 'learning');
            const quality = QUALITY_MAP[context.graphicsMode] ?? 'medium';
            this.#summary.mode = mode;
            this.#summary.quality = quality;
            const frame = document.createElement('iframe');
            frame.className = 'voxelcraft-runtime-frame';
            frame.title = 'VoxelCraft DS 3D';
            frame.allow = 'fullscreen; gamepad';
            frame.setAttribute('allowfullscreen', '');
            frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals');
            const url = new URL('./games/voxelcraft-ds/index.html', window.location.href);
            url.searchParams.set('embed', '1');
            url.searchParams.set('mode', mode);
            url.searchParams.set('quality', quality);
            frame.src = url.toString();
            context.container.replaceChildren(frame);
            this.#frame = frame;
            await new Promise((resolve, reject) => {
                const timeout = window.setTimeout(() => reject(new Error('VoxelCraft não respondeu ao carregamento.')), 12000);
                this.#listener = (event) => {
                    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.source !== 'fliperama-ds-voxelcraft')
                        return;
                    const type = String(event.data.type ?? '');
                    const detail = event.data.detail && typeof event.data.detail === 'object' ? event.data.detail : {};
                    if (type === 'ready') {
                        window.clearTimeout(timeout);
                        this.state = 'tutorial';
                        context.onEvent?.({ type: 'ready', detail: { renderer: 'three', runtime: 'voxelcraft-ds', isolatedStorage: true } });
                        resolve();
                    }
                    else if (type === 'started') {
                        this.state = 'playing';
                        context.onEvent?.({ type: 'serve', detail: { mode: String(detail.mode ?? mode), quality: String(detail.quality ?? quality) } });
                    }
                    else if (type === 'progress') {
                        this.#summary.xp = Number(detail.xp ?? this.#summary.xp) || 0;
                        this.#summary.progress = Number(detail.progress ?? this.#summary.progress) || 0;
                        this.#summary.chunks = Number(detail.chunks ?? this.#summary.chunks) || 0;
                        this.#summary.triangles = Number(detail.triangles ?? this.#summary.triangles) || 0;
                        context.onEvent?.({ type: 'progress', detail: { event: 'voxel-progress', xp: this.#summary.xp, progress: this.#summary.progress, chunks: this.#summary.chunks, triangles: this.#summary.triangles } });
                    }
                    else if (type === 'saved') {
                        this.#summary.xp = Number(detail.xp ?? this.#summary.xp) || 0;
                        this.#summary.edits = Number(detail.edits ?? this.#summary.edits) || 0;
                        this.#summary.savedAt = Number(detail.savedAt ?? Date.now()) || Date.now();
                    }
                    else if (type === 'stopped')
                        this.state = 'menu';
                    else if (type === 'exit')
                        context.onEvent?.({ type: 'pause-changed', detail: { paused: true, requestedExit: true } });
                };
                window.addEventListener('message', this.#listener);
                frame.addEventListener('error', () => { window.clearTimeout(timeout); reject(new Error('Falha ao carregar os arquivos do VoxelCraft.')); }, { once: true });
            });
        }
        start() {
            this.#post('start', { mode: this.#summary.mode, quality: this.#summary.quality, continue: true });
            this.state = 'playing';
        }
        pause() { if (this.state === 'playing') {
            this.#post('pause');
            this.state = 'paused';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: true } });
        } }
        resume() { if (this.state === 'paused' || this.state === 'tutorial') {
            this.#post('resume');
            this.state = 'playing';
            this.#context?.onEvent?.({ type: 'pause-changed', detail: { paused: false } });
        } }
        dispatch(input) { if (input.action === 'pause' && input.active)
            this.state === 'playing' ? this.pause() : this.resume(); }
        snapshot() { return { schemaVersion: 1, gameId: this.id, elapsedMs: 0, score: this.#summary.xp, payload: { ...this.#summary } }; }
        restore(snapshot) {
            if (snapshot.gameId !== this.id)
                throw new Error('Save pertence a outro jogo');
            const payload = snapshot.payload;
            this.#summary = { ...this.#summary, ...payload, mode: typeof payload.mode === 'string' ? payload.mode : this.#summary.mode, quality: typeof payload.quality === 'string' ? payload.quality : this.#summary.quality };
            this.state = 'tutorial';
        }
        dispose() {
            this.#post('shutdown');
            if (this.#listener)
                window.removeEventListener('message', this.#listener);
            this.#frame?.remove();
            this.#listener = undefined;
            this.#frame = undefined;
            this.state = 'disposed';
        }
        #post(type, detail = {}) { this.#frame?.contentWindow?.postMessage({ source: 'fliperama-ds', type, detail }, location.origin); }
    }
    exports.VoxelCraftRuntime = VoxelCraftRuntime;
    
  };
  __modules["main"] = (module, exports) => {
    "use strict";
    var __importDefault = (this && this.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    const catalog_json_1 = __importDefault(__require("data/catalog.json"));
    const museum_timeline_1 = __require("data/museum-timeline");
    const roadmap_1 = __require("data/roadmap");
    const museum_hardware_1 = __require("data/museum-hardware");
    const game_presentations_1 = __require("data/game-presentations");
    const device_benchmark_1 = __require("core/benchmark/device-benchmark");
    const dynamic_game_loader_1 = __require("core/dynamic-game-loader");
    const platform_settings_1 = __require("core/settings/platform-settings");
    const arcade_storage_1 = __require("core/storage/arcade-storage");
    const game_manifest_1 = __require("domain/game-manifest");
    const block_reactor_content_1 = __require("games/block-reactor/content/block-reactor-content");
    const block_layout_1 = __require("games/block-reactor/editor/block-layout");
    const orbital_sentinel_content_1 = __require("games/orbital-sentinel/content/orbital-sentinel-content");
    const trap_lab_content_1 = __require("games/trap-lab/content/trap-lab-content");
    const data_maze_content_1 = __require("games/data-maze/content/data-maze-content");
    const room_quest_content_1 = __require("games/room-quest/content/room-quest-content");
    const raster_rally_content_1 = __require("games/raster-rally/content/raster-rally-content");
    const state_quest_content_1 = __require("games/state-quest-rpg/content/state-quest-content");
    const bit_bridge_content_1 = __require("games/bit-bridge-16/content/bit-bridge-content");
    const raycast_corridors_content_1 = __require("games/raycast-corridors/content/raycast-corridors-content");
    const polygon_sector_content_1 = __require("games/polygon-sector-94/content/polygon-sector-content");
    const camera_evolution_content_1 = __require("games/camera-evolution/content/camera-evolution-content");
    const space_blocks_content_1 = __require("games/space-blocks/content/space-blocks-content");
    const vector_fleet_content_1 = __require("games/vector-fleet/content/vector-fleet-content");
    const vector_tennis_content_1 = __require("games/vector-tennis/content/vector-tennis-content");
    const board_arena_content_1 = __require("games/board-arena/content/board-arena-content");
    const puzzle_forge_content_1 = __require("games/puzzle-forge/content/puzzle-forge-content");
    const gameProfiles = {
        'vector-tennis': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { iniciante: 'Iniciante', normal: 'Normal', desafio: 'Desafio' }, defaultOption: 'normal',
            tutorialTitle: 'Devolva a bola e alcance 5 pontos',
            tutorialSteps: ['Mova com W/S, setas ou toque', 'Rebata usando o ângulo da raquete', 'Pressione Sacar após cada ponto'],
            keyboardHelp: 'W/S ou ↑/↓ · Espaço: sacar · P: pausar',
            touchControls: [
                { action: 'move-up', label: '▲', aria: 'Mover para cima' },
                { action: 'primary-action', label: 'SACAR', aria: 'Sacar bola' },
                { action: 'move-down', label: '▼', aria: 'Mover para baixo' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', Space: 'primary-action', KeyP: 'pause' },
            hud: ['VOCÊ', 'CPU', 'META'], history: vector_tennis_content_1.VECTOR_TENNIS_HISTORY, historyEyebrow: '1958 · ORIGENS',
            logicTitle: 'Da trajetória ao ponto', logicIntro: 'A simulação guarda números e estados serializáveis. O Phaser apenas desenha o resultado calculado.',
            pseudocode: vector_tennis_content_1.VECTOR_TENNIS_PSEUDOCODE, concepts: ['Coordenadas normalizadas', 'Velocidade × tempo', 'Colisão por limites', 'Máquina de estados'], comparison: vector_tennis_content_1.VECTOR_TENNIS_COMPARISON,
        },
        'space-blocks': {
            optionLabel: 'Modo', optionParameter: 'mode',
            options: { progressivo: 'Progressivo', pratica: 'Prática' }, defaultOption: 'progressivo',
            tutorialTitle: 'Encaixe as constelações e complete linhas',
            tutorialSteps: ['Mova com A/D ou setas laterais', 'Gire com W, ↑ ou X', 'Use Espaço para queda instantânea'],
            keyboardHelp: 'A/D ou ←/→ · W/↑: girar · S/↓: descer · Espaço: queda · P: pausar',
            touchControls: [
                { action: 'move-left', label: '◀', aria: 'Mover para esquerda' },
                { action: 'move-down', label: '▼', aria: 'Acelerar queda' },
                { action: 'primary-action', label: '↻', aria: 'Girar peça' },
                { action: 'secondary-action', label: 'QUEDA', aria: 'Queda instantânea' },
                { action: 'move-right', label: '▶', aria: 'Mover para direita' },
            ],
            keyActions: { ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', ArrowDown: 'move-down', KeyS: 'move-down', ArrowUp: 'primary-action', KeyW: 'primary-action', KeyX: 'primary-action', Space: 'secondary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'LINHAS', 'NÍVEL'], history: space_blocks_content_1.SPACE_BLOCKS_HISTORY, historyEyebrow: '1984 · ERA DOS PUZZLES',
            logicTitle: 'Da matriz à remoção de linhas', logicIntro: 'O tabuleiro é uma matriz serializável. A cena Phaser desenha células, peça ativa e prévia sem controlar as regras.',
            pseudocode: space_blocks_content_1.SPACE_BLOCKS_PSEUDOCODE, concepts: ['Matriz 10 × 20', 'Rotação e wall kick', 'Sacola de sete peças', 'Máquina de estados'], comparison: space_blocks_content_1.SPACE_BLOCKS_COMPARISON,
        },
        'vector-fleet': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { cadete: 'Cadete', piloto: 'Piloto', comandante: 'Comandante' }, defaultOption: 'piloto',
            tutorialTitle: 'Atravesse cinco ondas e preserve sua frota',
            tutorialSteps: ['Gire com A/D ou setas laterais', 'Acelere com W ou seta para cima', 'Dispare com Espaço e use as bordas conectadas'],
            keyboardHelp: 'A/D ou ←/→: girar · W/↑: acelerar · Espaço: disparar · P: pausar',
            touchControls: [
                { action: 'move-left', label: '↶', aria: 'Girar para esquerda' },
                { action: 'move-up', label: 'PROPULSOR', aria: 'Ativar propulsor' },
                { action: 'primary-action', label: 'DISPARAR', aria: 'Disparar' },
                { action: 'move-right', label: '↷', aria: 'Girar para direita' },
            ],
            keyActions: { ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', ArrowUp: 'move-up', KeyW: 'move-up', Space: 'primary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'ONDA'], history: vector_fleet_content_1.VECTOR_FLEET_HISTORY, historyEyebrow: '1979 · ERA VETORIAL',
            logicTitle: 'Ângulos, impulso e espaço toroidal', logicIntro: 'A nave, os tiros e os asteroides vivem em coordenadas normalizadas. O Phaser recebe uma fotografia do estado e desenha linhas responsivas.',
            pseudocode: vector_fleet_content_1.VECTOR_FLEET_PSEUDOCODE, concepts: ['Vetores e ângulos', 'Aceleração e inércia', 'Espaço toroidal', 'Fragmentação e ondas'], comparison: vector_fleet_content_1.VECTOR_FLEET_COMPARISON,
        },
        'block-reactor': {
            optionLabel: 'Sessão', optionParameter: 'mode',
            options: { 'campanha-facil': 'Campanha · Fácil', 'campanha-normal': 'Campanha · Normal', 'campanha-desafio': 'Campanha · Desafio', pratica: 'Prática contínua' }, defaultOption: 'campanha-normal',
            tutorialTitle: 'Rebata, combine efeitos e desmonte o reator',
            tutorialSteps: ['Mova com A/D, setas ou toque', 'Use Espaço ou LANÇAR para soltar a bola', 'Capture bônus e conclua as três fases'],
            keyboardHelp: 'A/D ou ←/→: mover · Espaço: lançar · P: pausar',
            touchControls: [
                { action: 'move-left', label: '◀', aria: 'Mover raquete para esquerda' },
                { action: 'primary-action', label: 'LANÇAR', aria: 'Lançar bola' },
                { action: 'move-right', label: '▶', aria: 'Mover raquete para direita' },
            ],
            keyActions: { ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', Space: 'primary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'FASE'], history: block_reactor_content_1.BLOCK_REACTOR_HISTORY, historyEyebrow: '1976 · ARCADE DE BLOCOS',
            logicTitle: 'Vetores, colisões e fases orientadas a dados', logicIntro: 'Raquete, bola, blocos, power-ups e layouts existem na simulação serializável. O Phaser apenas representa a fotografia calculada.',
            pseudocode: block_reactor_content_1.BLOCK_REACTOR_PSEUDOCODE, concepts: ['Colisão círculo × AABB', 'Reflexão por eixo', 'Combos e power-ups', 'Fases orientadas a dados'], comparison: block_reactor_content_1.BLOCK_REACTOR_COMPARISON,
        },
        'orbital-sentinel': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { cadete: 'Cadete', defensor: 'Defensor', elite: 'Elite' }, defaultOption: 'defensor',
            tutorialTitle: 'Proteja a estação durante quatro ondas',
            tutorialSteps: ['Mova com A/D, setas ou toque', 'Dispare com Espaço ou o botão ATIRAR', 'Use as barreiras e não deixe a formação descer'],
            keyboardHelp: 'A/D ou ←/→: mover · Espaço: disparar · P: pausar',
            touchControls: [
                { action: 'move-left', label: '◀', aria: 'Mover sentinela para esquerda' },
                { action: 'primary-action', label: 'ATIRAR', aria: 'Disparar pulso' },
                { action: 'move-right', label: '▶', aria: 'Mover sentinela para direita' },
            ],
            keyActions: { ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', Space: 'primary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'ONDA'], history: orbital_sentinel_content_1.ORBITAL_SENTINEL_HISTORY, historyEyebrow: '1978 · INVASORES E MICROPROCESSADORES',
            logicTitle: 'Formações, projéteis e dificuldade emergente', logicIntro: 'Inimigos, tiros, barreiras e progressão vivem na simulação serializável. O Phaser apenas desenha a fotografia atual e encaminha ações.',
            pseudocode: orbital_sentinel_content_1.ORBITAL_SENTINEL_PSEUDOCODE, concepts: ['Formação bidimensional', 'Colisão ponto × célula', 'Gerador determinístico', 'Dificuldade progressiva'], comparison: orbital_sentinel_content_1.ORBITAL_SENTINEL_COMPARISON,
        },
        'data-maze': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { aprendiz: 'Aprendiz', operador: 'Operador', arquiteto: 'Arquiteto' }, defaultOption: 'operador',
            tutorialTitle: 'Colete todos os dados em três labirintos',
            tutorialSteps: ['Mova com WASD, setas ou toque', 'Use os nós de energia para inverter o risco', 'Observe como cada drone escolhe uma rota diferente'],
            keyboardHelp: 'WASD ou setas: mover · P: pausar',
            touchControls: [
                { action: 'move-up', label: '▲', aria: 'Mover núcleo para cima' },
                { action: 'move-left', label: '◀', aria: 'Mover núcleo para esquerda' },
                { action: 'move-down', label: '▼', aria: 'Mover núcleo para baixo' },
                { action: 'move-right', label: '▶', aria: 'Mover núcleo para direita' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'FASE'], history: data_maze_content_1.DATA_MAZE_HISTORY, historyEyebrow: '1980 · LABIRINTOS E IA',
            logicTitle: 'Rotas, estados e personalidades de perseguição', logicIntro: 'A grade, os itens, o núcleo e os quatro drones vivem em uma simulação determinística. O Phaser recebe apenas o estado atual para desenhar.',
            pseudocode: data_maze_content_1.DATA_MAZE_PSEUDOCODE, concepts: ['Grade 23 × 19', 'Busca em largura', 'Máquinas de estado', 'Fila de direção e túneis'], comparison: data_maze_content_1.DATA_MAZE_COMPARISON,
        },
        'room-quest': {
            optionLabel: 'Modo', optionParameter: 'mode',
            options: { explorador: 'Explorador', cartografo: 'Cartógrafo', arquivista: 'Arquivista' }, defaultOption: 'cartografo',
            tutorialTitle: 'Explore oito salas e restaure o Núcleo de Memória',
            tutorialSteps: ['Mova com WASD, setas ou toque', 'Use E ou INTERAGIR perto de itens e terminais', 'Observe como inventário e flags liberam novas rotas'],
            keyboardHelp: 'WASD ou setas: mover · E: interagir · P: pausar',
            touchControls: [
                { action: 'move-up', label: '▲', aria: 'Mover explorador para cima' },
                { action: 'move-left', label: '◀', aria: 'Mover explorador para esquerda' },
                { action: 'interact', label: 'INTERAGIR', aria: 'Interagir com item ou terminal' },
                { action: 'move-right', label: '▶', aria: 'Mover explorador para direita' },
                { action: 'move-down', label: '▼', aria: 'Mover explorador para baixo' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', KeyE: 'interact', Space: 'interact', KeyP: 'pause' },
            hud: ['PONTOS', 'ENERGIA', 'SALAS'], history: room_quest_content_1.ROOM_QUEST_HISTORY, historyEyebrow: '1980 · AVENTURA E EXPLORAÇÃO',
            logicTitle: 'Grafos, inventário e condições persistentes', logicIntro: 'As salas, saídas, objetos, flags e entidades são dados serializáveis. O Phaser representa apenas a sala atual e encaminha ações.',
            pseudocode: room_quest_content_1.ROOM_QUEST_PSEUDOCODE, concepts: ['Grafo de oito salas', 'Inventário persistente', 'Flags globais', 'Condições de passagem'], comparison: room_quest_content_1.ROOM_QUEST_COMPARISON,
        },
        'raster-rally': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { novato: 'Novato', piloto: 'Piloto', campeao: 'Campeão' }, defaultOption: 'piloto',
            tutorialTitle: 'Complete três pistas pseudo-3D antes do tempo acabar',
            tutorialSteps: ['Acelere com W, seta para cima ou toque', 'Esterce com A/D ou setas laterais', 'Freie com S ou seta para baixo e preserve a integridade'],
            keyboardHelp: 'W/↑: acelerar · S/↓: frear · A/D ou ←/→: esterçar · P: pausar',
            touchControls: [
                { action: 'move-left', label: '◀', aria: 'Esterçar para esquerda' },
                { action: 'move-up', label: 'ACELERAR', aria: 'Acelerar veículo' },
                { action: 'move-down', label: 'FREAR', aria: 'Frear veículo' },
                { action: 'move-right', label: '▶', aria: 'Esterçar para direita' },
            ],
            keyActions: { ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', KeyP: 'pause' },
            hud: ['PONTOS', 'TEMPO', 'PISTA'], history: raster_rally_content_1.RASTER_RALLY_HISTORY, historyEyebrow: '1982 · CORRIDA PSEUDO-3D',
            logicTitle: 'Segmentos, projeção e sprites escalados', logicIntro: 'Velocidade, aderência, rivais, checkpoints e progressão vivem na simulação serializável. O Phaser projeta faixas e desenha a pista sob demanda.',
            pseudocode: raster_rally_content_1.RASTER_RALLY_PSEUDOCODE, concepts: ['Pista por segmentos', 'Projeção em perspectiva', 'Curvas e elevação', 'Aderência e força centrífuga', 'Sprites escalados'], comparison: raster_rally_content_1.RASTER_RALLY_COMPARISON,
        },
        'state-quest-rpg': {
            optionLabel: 'Modo', optionParameter: 'mode',
            options: { viajante: 'Viajante', estrategista: 'Estrategista', cronista: 'Cronista' }, defaultOption: 'estrategista',
            tutorialTitle: 'Conclua três missões e decida o destino do Núcleo',
            tutorialSteps: ['Mova com WASD, setas ou toque', 'Use E/INTERAGIR para conversar e examinar objetos', 'Em diálogos e combates, confirme com Enter/Espaço ou escolha a alternativa com Esc/Q'],
            keyboardHelp: 'WASD/setas: mover · E: interagir · Enter/Espaço: confirmar/atacar · Esc/Q: alternativa/defender · P: pausar',
            touchControls: [
                { action: 'move-up', label: '▲', aria: 'Mover herói para cima' },
                { action: 'move-left', label: '◀', aria: 'Mover herói para esquerda' },
                { action: 'interact', label: 'INTERAGIR', aria: 'Conversar ou examinar' },
                { action: 'confirm', label: 'CONFIRMAR', aria: 'Confirmar escolha ou atacar' },
                { action: 'cancel', label: 'ALTERNATIVA', aria: 'Escolher alternativa, defender ou usar poção' },
                { action: 'move-right', label: '▶', aria: 'Mover herói para direita' },
                { action: 'move-down', label: '▼', aria: 'Mover herói para baixo' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', KeyE: 'interact', Enter: 'confirm', Space: 'confirm', Escape: 'cancel', KeyQ: 'cancel', KeyP: 'pause' },
            hud: ['PONTOS', 'HP', 'NÍVEL'], history: state_quest_content_1.STATE_QUEST_HISTORY, historyEyebrow: '1986 · RPG, MISSÕES E ESTADOS',
            logicTitle: 'Atributos, missões e consequências persistentes', logicIntro: 'Mapas, personagem, inventário, equipamentos, diálogos, combates e missões vivem em uma simulação serializável. O Phaser apenas desenha o estado e encaminha ações.',
            pseudocode: state_quest_content_1.STATE_QUEST_PSEUDOCODE, concepts: ['Três mapas por tilemap', 'Máquina de estados de missões', 'Atributos e progressão', 'Diálogos ramificados', 'Dois finais persistentes'], comparison: state_quest_content_1.STATE_QUEST_COMPARISON,
        },
        'bit-bridge-16': {
            optionLabel: 'Apresentação', optionParameter: 'mode',
            options: { comparativo: 'Comparativo · alternar ao vivo', classico: '8 bits fixo', expandido: '16 bits fixo' }, defaultOption: 'comparativo',
            tutorialTitle: 'Atravesse a mesma fase em duas gerações técnicas',
            tutorialSteps: ['Mova com A/D, setas ou toque', 'Salte com W, ↑, Espaço ou PULAR', 'Use C, X ou ALTERNAR para trocar 8 ↔ 16 bits sem reiniciar'],
            keyboardHelp: 'A/D ou ←/→: mover · W/↑/Espaço: pular · C/X: alternar geração · P: pausar',
            touchControls: [
                { action: 'move-left', label: '◀', aria: 'Mover personagem para esquerda' },
                { action: 'jump', label: 'PULAR', aria: 'Pular' },
                { action: 'primary-action', label: '8 ↔ 16', aria: 'Alternar entre apresentação 8 e 16 bits' },
                { action: 'move-right', label: '▶', aria: 'Mover personagem para direita' },
            ],
            keyActions: { ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', ArrowUp: 'jump', KeyW: 'jump', Space: 'jump', KeyC: 'primary-action', KeyX: 'primary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'FRAGMENTOS'], history: bit_bridge_content_1.BIT_BRIDGE_HISTORY, historyEyebrow: '1988–1991 · PONTE 8→16 BITS',
            logicTitle: 'Uma simulação, duas apresentações', logicIntro: 'Movimento, gravidade, colisões, fragmentos, checkpoints e objetivo vivem em uma única simulação. A geração selecionada altera somente desenho, animação e áudio.',
            pseudocode: bit_bridge_content_1.BIT_BRIDGE_PSEUDOCODE, concepts: ['Resolução e paleta', 'Sprites e quadros de animação', 'Paralaxe em camadas', 'Áudio por canais', 'Renderização desacoplada'], comparison: bit_bridge_content_1.BIT_BRIDGE_COMPARISON,
        },
        'polygon-sector-94': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { cadete: 'Cadete', piloto: 'Piloto', arquiteto: 'Arquiteto' }, defaultOption: 'piloto',
            tutorialTitle: 'Explore a primeira arena poligonal e sincronize três núcleos',
            tutorialSteps: ['Avance com W/↑ e recue com S/↓', 'Gire com A/D ou setas; Espaço aplica salto', 'Use Q para materiais e C para câmera sem reiniciar a missão'],
            keyboardHelp: 'W/↑: avançar · S/↓: recuar · A/D ou ←/→: girar · Espaço: pular · Q: material · C: câmera · P: pausar',
            touchControls: [
                { action: 'move-left', label: '↶', aria: 'Girar para esquerda' },
                { action: 'move-up', label: 'AVANÇAR', aria: 'Avançar' },
                { action: 'jump', label: 'PULAR', aria: 'Pular' },
                { action: 'primary-action', label: 'MATERIAL', aria: 'Alternar material' },
                { action: 'secondary-action', label: 'CÂMERA', aria: 'Alternar câmera' },
                { action: 'move-down', label: 'RECUAR', aria: 'Recuar' },
                { action: 'move-right', label: '↷', aria: 'Girar para direita' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', Space: 'jump', KeyQ: 'primary-action', KeyC: 'secondary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'NÚCLEOS'], history: polygon_sector_content_1.POLYGON_SECTOR_HISTORY, historyEyebrow: '1994 · PRIMEIROS MUNDOS POLIGONAIS',
            logicTitle: 'Vértices, câmeras e shaders em uma arena real', logicIntro: 'Movimento, física, objetivos e save vivem fora do WebGL. O renderer transforma malhas por matrizes e aplica materiais sem controlar as regras.',
            pseudocode: polygon_sector_content_1.POLYGON_SECTOR_PSEUDOCODE, concepts: ['Vértices e triângulos', 'Matrizes MVP', 'Câmeras 3D', 'Shaders e materiais', 'Colisão por volumes'], comparison: polygon_sector_content_1.POLYGON_SECTOR_COMPARISON,
        },
        'camera-evolution': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { cadete: 'Cadete', piloto: 'Piloto', arquiteto: 'Arquiteto' }, defaultOption: 'piloto',
            tutorialTitle: 'Compare seis câmeras na mesma arena sem reiniciar a missão',
            tutorialSteps: ['Avance com W/↑ e recue com S/↓', 'Gire com A/D ou setas e salte com Espaço', 'Use C para alternar câmera e Q para mudar o campo de visão'],
            keyboardHelp: 'W/↑: avançar · S/↓: recuar · A/D ou ←/→: girar · Espaço: pular · C: câmera · Q: FOV · P: pausar',
            touchControls: [
                { action: 'move-left', label: '↶', aria: 'Girar para esquerda' },
                { action: 'move-up', label: 'AVANÇAR', aria: 'Avançar' },
                { action: 'jump', label: 'PULAR', aria: 'Pular' },
                { action: 'secondary-action', label: 'CÂMERA', aria: 'Alternar sistema de câmera' },
                { action: 'primary-action', label: 'FOV', aria: 'Alternar campo de visão' },
                { action: 'move-down', label: 'RECUAR', aria: 'Recuar' },
                { action: 'move-right', label: '↷', aria: 'Girar para direita' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', Space: 'jump', KeyQ: 'primary-action', KeyC: 'secondary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'CÂMERAS'], history: camera_evolution_content_1.CAMERA_EVOLUTION_HISTORY, historyEyebrow: '1996 · A CÂMERA COMO MECÂNICA',
            logicTitle: 'Matrizes de visão, rigs e campo de visão', logicIntro: 'A missão e o avatar permanecem na simulação. Cada câmera calcula posição, alvo e projeção sem alterar as regras do mundo.',
            pseudocode: camera_evolution_content_1.CAMERA_EVOLUTION_PSEUDOCODE, concepts: ['Seis camera rigs', 'Matriz de visão', 'FOV 45°/60°/75°', 'Enquadramento e level design', 'Simulação preservada'], comparison: camera_evolution_content_1.CAMERA_EVOLUTION_COMPARISON,
        },
        'raycast-corridors': {
            optionLabel: 'Dificuldade', optionParameter: 'difficulty',
            options: { explorador: 'Explorador', operador: 'Operador', arquiteto: 'Arquiteto' }, defaultOption: 'operador',
            tutorialTitle: 'Ative a rede e alcance a extração em primeira pessoa',
            tutorialSteps: ['Avance com W/↑ e recue com S/↓', 'Gire com A/D ou setas laterais', 'Use E para portas e terminais; M alterna mapa, primeira pessoa e tela dividida'],
            keyboardHelp: 'W/↑: avançar · S/↓: recuar · A/D ou ←/→: girar · E: interagir · M: visão · P: pausar',
            touchControls: [
                { action: 'move-left', label: '↶', aria: 'Girar para esquerda' },
                { action: 'move-up', label: 'AVANÇAR', aria: 'Avançar' },
                { action: 'interact', label: 'INTERAGIR', aria: 'Abrir porta ou ativar terminal' },
                { action: 'secondary-action', label: 'VISÃO', aria: 'Alternar visualização' },
                { action: 'move-down', label: 'RECUAR', aria: 'Recuar' },
                { action: 'move-right', label: '↷', aria: 'Girar para direita' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', KeyE: 'interact', KeyM: 'secondary-action', Tab: 'secondary-action', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'TERMINAIS'], history: raycast_corridors_content_1.RAYCAST_CORRIDORS_HISTORY, historyEyebrow: '1992 · MAPA 2D → VISÃO 2.5D',
            logicTitle: 'DDA, campo de visão e projeção por colunas', logicIntro: 'Movimento, colisões, chaves, portas, terminais e missão vivem no mapa 2D serializável. O Phaser recebe raios corrigidos e desenha a visão 2.5D.',
            pseudocode: raycast_corridors_content_1.RAYCAST_CORRIDORS_PSEUDOCODE, concepts: ['Mapa 24 × 18', 'Raycasting DDA', 'Correção olho-de-peixe', 'Resolução horizontal dinâmica', 'Três visualizações'], comparison: raycast_corridors_content_1.RAYCAST_CORRIDORS_COMPARISON,
        },
        'trap-lab': {
            optionLabel: 'Modo', optionParameter: 'mode',
            options: { explorador: 'Explorador', programador: 'Programador', precisao: 'Precisão' }, defaultOption: 'programador',
            tutorialTitle: 'Supere três fases e programe os terminais',
            tutorialSteps: ['Mova com A/D, setas ou toque', 'Salte com Espaço, W ou o botão PULAR', 'Use E ou INTERAGIR perto dos terminais'],
            keyboardHelp: 'A/D ou ←/→: mover · W/↑/Espaço: pular · E: interagir · P: pausar',
            touchControls: [
                { action: 'move-left', label: '◀', aria: 'Mover personagem para esquerda' },
                { action: 'jump', label: 'PULAR', aria: 'Pular' },
                { action: 'interact', label: 'INTERAGIR', aria: 'Interagir com terminal' },
                { action: 'move-right', label: '▶', aria: 'Mover personagem para direita' },
            ],
            keyActions: { ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', ArrowUp: 'jump', KeyW: 'jump', Space: 'jump', KeyE: 'interact', KeyP: 'pause' },
            hud: ['PONTOS', 'VIDAS', 'FASE'], history: trap_lab_content_1.TRAP_LAB_HISTORY, historyEyebrow: '1985 · PLATAFORMAS E TILEMAPS',
            logicTitle: 'Tiles, estados e sequências programáveis', logicIntro: 'Movimento, colisões, checkpoints, armadilhas e portões vivem na simulação serializável. O editor envia somente uma sequência de comandos validada.',
            pseudocode: trap_lab_content_1.TRAP_LAB_PSEUDOCODE, concepts: ['Tilemap 42 × 14', 'Física por subpassos', 'Checkpoints e eventos', 'Sequência lógica'], comparison: trap_lab_content_1.TRAP_LAB_COMPARISON,
        },
        'puzzle-forge': {
            optionLabel: 'Experiência e dificuldade', optionParameter: 'mode',
            options: {
                'caminho-aprendiz': 'Caminhos rotativos · Aprendiz',
                'caminho-desafio': 'Caminhos rotativos · Desafio',
                'circuito-aprendiz': 'Circuitos lógicos · Aprendiz',
                'circuito-desafio': 'Circuitos lógicos · Desafio',
                'sequencia-aprendiz': 'Sequência de memória · Aprendiz',
                'sequencia-desafio': 'Sequência de memória · Desafio',
                'labirinto-aprendiz': 'Labirinto 7×7 · Aprendiz',
                'labirinto-desafio': 'Labirinto 7×7 · Desafio',
            },
            defaultOption: 'caminho-aprendiz',
            tutorialTitle: 'Resolva a grade usando lógica e observação',
            tutorialSteps: ['Escolha um dos quatro tipos de puzzle', 'Toque ou clique nas células para alterar a grade', 'No labirinto, use setas, WASD ou o direcional móvel', 'Abra o Editor para criar e testar um labirinto próprio'],
            keyboardHelp: 'Mouse/toque: selecionar · WASD/setas: labirinto · P: pausar',
            touchControls: [
                { action: 'move-up', label: '▲', aria: 'Mover para cima no labirinto' },
                { action: 'move-left', label: '◀', aria: 'Mover para esquerda no labirinto' },
                { action: 'move-down', label: '▼', aria: 'Mover para baixo no labirinto' },
                { action: 'move-right', label: '▶', aria: 'Mover para direita no labirinto' },
            ],
            keyActions: { ArrowUp: 'move-up', KeyW: 'move-up', ArrowDown: 'move-down', KeyS: 'move-down', ArrowLeft: 'move-left', KeyA: 'move-left', ArrowRight: 'move-right', KeyD: 'move-right', KeyP: 'pause', Enter: 'primary-action', Space: 'primary-action' },
            hud: ['PONTOS', 'MOVIMENTOS', 'ERROS'], history: puzzle_forge_content_1.PUZZLE_FORGE_HISTORY, historyEyebrow: '1982 · PUZZLES EM GRADE',
            logicTitle: 'Matrizes, vizinhança, sequência e busca de caminhos', logicIntro: 'Cada experiência usa uma simulação TypeScript determinística e serializável. O Phaser desenha a grade e traduz clique, toque ou direção em uma ação validada.',
            pseudocode: puzzle_forge_content_1.PUZZLE_FORGE_PSEUDOCODE, concepts: ['Matriz 4×4, 5×5 e 7×7', 'Vizinhança ortogonal', 'Máquina de estados', 'Sequências e cursores', 'Editor orientado a dados'], comparison: puzzle_forge_content_1.PUZZLE_FORGE_COMPARISON,
        },
        'board-arena': {
            optionLabel: 'Jogo e dificuldade', optionParameter: 'mode',
            options: {
                'velha-aprendiz': 'Jogo da Velha · Aprendiz',
                'velha-estrategista': 'Jogo da Velha · Estrategista',
                'dama-aprendiz': 'Dama 8×8 · Aprendiz',
                'dama-estrategista': 'Dama 8×8 · Estrategista',
            },
            defaultOption: 'velha-aprendiz',
            tutorialTitle: 'Escolha a melhor jogada contra a CPU',
            tutorialSteps: ['Selecione o modo e a dificuldade', 'Toque ou clique diretamente nas casas', 'Na Dama, selecione a peça e depois o destino', 'Use capturas, promoções e bloqueios para vencer'],
            keyboardHelp: 'Mouse/toque: selecionar casa · P: pausar',
            touchControls: [],
            keyActions: { KeyP: 'pause', Enter: 'primary-action', Space: 'primary-action' },
            hud: ['PONTOS', 'JOGADAS', 'CAPTURAS'], history: board_arena_content_1.BOARD_ARENA_HISTORY, historyEyebrow: '1952 · TABULEIROS NA COMPUTAÇÃO',
            logicTitle: 'Matrizes, movimentos legais e CPU didática', logicIntro: 'As regras, turnos, capturas e vitórias vivem em uma simulação TypeScript serializável. O Phaser apenas desenha o tabuleiro e converte clique ou toque em uma casa.',
            pseudocode: board_arena_content_1.BOARD_ARENA_PSEUDOCODE, concepts: ['Matriz 3×3 e 8×8', 'Máquina de estados', 'Geração de movimentos legais', 'Prioridade de captura e bloqueio', 'Persistência'], comparison: board_arena_content_1.BOARD_ARENA_COMPARISON,
        },
        'voxelcraft-ds': {
            optionLabel: 'Modo', optionParameter: 'mode',
            options: { learning: 'Aprendizagem', free: 'Livre', challenge: 'Desafio' }, defaultOption: 'learning',
            tutorialTitle: 'Explore, colete e construa no mundo voxel',
            tutorialSteps: ['Escolha continuar ou criar um novo mundo dentro do jogo', 'Mova, olhe e pule usando teclado ou controles móveis', 'Quebre blocos, selecione recursos e construa', 'Acompanhe chunks, FPS, triângulos, XP e missões'],
            keyboardHelp: 'WASD/setas · mouse: olhar · Espaço: pular · Shift: correr · C: agachar · cliques: quebrar/construir',
            touchControls: [],
            keyActions: { KeyP: 'pause' },
            hud: ['XP', 'CHUNKS', 'EDIÇÕES'],
            history: { title: 'Mundos voxel e construção procedural', paragraphs: ['Os mundos em blocos tornaram visíveis conceitos de grade tridimensional, geração procedural, streaming e persistência.', 'Nesta versão DS, o gênero é usado como laboratório educacional autoral de Three.js, chunks, inventário e desempenho adaptativo.'], sourceUrl: 'https://threejs.org/' },
            historyEyebrow: '2011 · MUNDOS VOXEL',
            logicTitle: 'Chunks, malhas e persistência', logicIntro: 'O mundo mantém regras e edições serializáveis; o Three.js transforma apenas os chunks próximos em geometria renderizável.',
            pseudocode: `detectarDispositivo()
    carregarChunksProximos(jogador)
    para cada chunk:
      gerarTerrenoProcedural()
      aplicarEdicoesSalvas()
      criarMalhaOtimizada()
    aoQuebrarOuConstruir():
      salvarEdicaoNoIndexedDB()`,
            concepts: ['Chunks e streaming', 'Greedy meshing', 'Inventário e eventos', 'IndexedDB isolado'],
            comparison: [['Mundo', 'Blocos e chunks autorais', 'Referência ao gênero sandbox voxel'], ['Armazenamento', 'Namespace próprio do Fliperama', 'Não compartilha gravações novas com o Lab'], ['Renderização', 'Three.js local e perfis adaptativos', 'Sem dependência de CDN']],
        },
    };
    const catalog = catalog_json_1.default.slice().sort((first, second) => first.year - second.year || first.title.localeCompare(second.title, 'pt-BR'));
    const playableCount = catalog.filter((game) => (0, dynamic_game_loader_1.supportsPlayableModule)(game.id)).length;
    const invalid = catalog.flatMap((game) => (0, game_manifest_1.validateManifest)(game).map((error) => `${game.id}: ${error}`));
    if (invalid.length > 0)
        throw new Error(`Catálogo inválido:\n${invalid.join('\n')}`);
    const eraLabels = {
        '1950-1969': 'Origens', '1970-1979': 'Primeiros arcades', '1980-1989': 'Era 8 bits',
        '1990-1999': 'Transição 2D/3D', '2000-2009': 'Mundos 3D', '2010-2019': 'Indie, mobile e VR', '2020-atual': 'Era contemporânea',
    };
    const statusLabels = { planejado: 'Planejado', prototipo: 'Protótipo', jogavel: 'Jogável', publicado: 'Publicado' };
    const graphicsLabels = { automatico: 'Automático', baixo: 'Baixo', medio: 'Médio', alto: 'Alto', ultra: 'Ultra', historico: 'Histórico' };
    const roadmapStatusLabels = { concluido: 'Concluído', 'em-andamento': 'Em andamento', 'proxima-fase': 'Próxima fase', planejado: 'Planejado' };
    const BUILD_INFO = {
        version: '0.20.0',
        label: 'v0.20.0',
        phase: 'Fase 7.1',
        channel: 'Estável',
        publishedAt: '2026-08-03T12:05:00Z',
        notes: [
            'Puzzle Forge DS adicionado como o 17º laboratório jogável.',
            'Quatro experiências completas: caminhos rotativos, circuitos lógicos, sequência de memória e labirinto 7×7.',
            'Editor de labirintos orientado a dados, controles desktop/mobile e persistência da sessão.',
            'História, programação, lógica, pseudocódigo, comparação técnica e roadmap educacional atualizados.',
        ],
    };
    const storage = new arcade_storage_1.ArcadeStorage();
    let settings = platform_settings_1.DEFAULT_SETTINGS;
    let runtime;
    let hudTimer;
    let fpsAnimation;
    let openSequence = 0;
    let runtimeLoading = false;
    let activeGameId = '';
    let activeCustomLayout;
    const catalogFilters = { era: undefined, genre: 'todos', technology: 'todos', company: 'todos', query: '', quick: 'todos' };
    let versionDialogCheckedAt = '';
    let activeTrapSequence = ['aguardar', 'desativar', 'abrir'];
    let editorLayout = ['nnnnnnnn', 'nrrnnrrn', 'nnebbenn', 'n.e..e.n', 'nnb..bnn'].join('');
    let puzzleEditorLayout = ['.......', '.###.#.', '...#.#.', '##.#...', '...###.', '.#.....', '...##..'].join('');
    const selectedOptions = Object.fromEntries(Object.entries(gameProfiles).map(([id, profile]) => [id, profile.defaultOption]));
    const app = document.querySelector('#app');
    if (!app)
        throw new Error('Elemento #app não encontrado');
    app.innerHTML = `
      <header class="topbar">
        <a class="brand" href="#inicio" aria-label="Fliperama DS — início"><span class="brand-mark" aria-hidden="true">DS</span><span><strong>FLIPERAMA DS</strong><small>A Evolução dos Jogos · plataforma completa</small></span></a>
        <nav aria-label="Navegação principal"><a href="#linha-do-tempo">Linha do tempo</a><a href="#catalogo">Laboratórios</a><a href="#planejamento">Planejamento</a><a href="#museu">Museu</a><a href="#desempenho">Desempenho</a><a href="#arquitetura">Como funciona</a></nav>
        <div class="topbar-actions"><button id="version-toggle" class="version-chip" aria-label="Abrir controle de versão">${BUILD_INFO.label}</button><button id="settings-toggle" class="icon-button" aria-label="Abrir configurações" aria-expanded="false">⚙</button></div>
      </header>
      <aside id="settings-panel" class="settings-panel" aria-label="Configurações" hidden>
        <div class="settings-head"><div><p class="eyebrow">PREFERÊNCIAS</p><h2>Configurações</h2></div><button id="settings-close" class="icon-button" aria-label="Fechar configurações">×</button></div>
        <label>Qualidade gráfica<select id="graphics-mode">${game_manifest_1.GRAPHICS_MODES.map((mode) => `<option value="${mode}">${graphicsLabels[mode]}</option>`).join('')}</select></label>
        <label class="switch-row"><span>Reduzir movimentos</span><input id="reduced-motion" type="checkbox"></label>
        <label class="switch-row"><span>Silenciar áudio</span><input id="muted" type="checkbox"></label>
        <label class="switch-row"><span>Exibir desempenho</span><input id="show-performance" type="checkbox"></label>
        <p class="settings-note">As preferências ficam neste dispositivo e podem ser alteradas a qualquer momento.</p>
      </aside>
      <main id="inicio">
        <section class="hero">
          <div class="hero-copy"><p class="eyebrow">${BUILD_INFO.phase.toUpperCase()} · CATÁLOGO INTELIGENTE E MUSEUS</p><h1>Jogue a história.<br><span>Entenda a evolução.</span></h1><p class="lead">O Fliperama DS agora permite navegar por categoria, tecnologia, empresa, época e status. A plataforma reúne jogos jogáveis, próximos lançamentos, controle de atualização e um museu de consoles, controles e sensores.</p><div class="hero-actions"><a class="button primary" href="#catalogo">Abrir laboratórios</a><a class="button secondary" href="#planejamento">Ver próximos jogos</a></div></div>
          <div class="hero-panel" aria-label="Status da plataforma"><div class="scanline"></div><p class="panel-title">NÚCLEO DO SISTEMA</p><dl><div><dt>Catálogo</dt><dd>${catalog.length} módulos independentes</dd></div><div><dt>Jogos completos</dt><dd>${playableCount} laboratórios jogáveis</dd></div><div><dt>Museus</dt><dd>${museum_hardware_1.CONSOLE_MUSEUM.length + museum_hardware_1.CONTROLLER_MUSEUM.length + museum_hardware_1.SENSOR_MUSEUM.length} fichas técnicas</dd></div><div><dt>Versão</dt><dd>${BUILD_INFO.label}</dd></div><div><dt>Qualidade</dt><dd id="active-quality">Automático</dd></div></dl></div>
        </section>
        <section id="linha-do-tempo" class="section"><div class="section-heading"><p class="eyebrow">LINHA DO TEMPO · 1952–2026</p><h2>Do CRT de laboratório aos mundos em 360°</h2><p>Os registros estão em ordem de lançamento e informam pessoas, empresas, plataformas, sistemas, tecnologia, modelo comercial e relação com cada laboratório do Fliperama DS.</p></div><div class="timeline" role="list">${game_manifest_1.ERAS.map((era) => `<button class="era" data-era="${era}" role="listitem"><span>${era}</span><strong>${eraLabels[era]}</strong></button>`).join('')}</div><div class="milestone-heading"><strong id="milestone-title">Todos os marcos históricos</strong><span id="milestone-count">${museum_timeline_1.MUSEUM_TIMELINE.length} registros</span></div><div id="milestone-strip" class="milestone-strip"></div></section>
        <section id="catalogo" class="section catalog-section"><div class="section-heading row"><div><p class="eyebrow">CATÁLOGO MODULAR</p><h2 id="catalog-title">Escolha seu jogo com filtros inteligentes</h2><p>Use a busca lateral para encontrar experiências por gênero, tecnologia, empresa, época e status de lançamento.</p></div><button id="clear-filter" class="text-button" hidden>Limpar filtros</button></div><div class="catalog-layout"><aside class="catalog-sidebar"><p class="sidebar-title">Encontrar jogos</p><label>Busca rápida<input id="catalog-search" type="search" placeholder="Ex.: corrida, Atari, puzzle, câmera"></label><label>Categoria<select id="genre-filter"></select></label><label>Tecnologia<select id="technology-filter"></select></label><label>Empresa<select id="company-filter"></select></label><div class="quick-filter-group"><span>Atalhos</span><div id="quick-filters" class="quick-filters"><button class="quick-filter active" data-quick-filter="todos">Todos</button><button class="quick-filter" data-quick-filter="jogaveis">Jogáveis</button><button class="quick-filter" data-quick-filter="recentes">Recentes</button><button class="quick-filter" data-quick-filter="em-breve">Em breve</button></div></div><div id="catalog-summary" class="catalog-summary"></div></aside><div class="catalog-content-area"><div class="catalog-toolbar"><div id="active-filters" class="active-filters"></div></div><div id="highlights-strip" class="highlights-strip"></div><div id="game-grid" class="game-grid"></div></div></div></section>
        <section id="planejamento" class="section roadmap-section"><div class="section-heading"><p class="eyebrow">PRÓXIMAS FASES</p><h2>Jogos planejados, migrações e melhorias do portal</h2><p>O roadmap mistura o que já está entregue, o que entrou agora e quais experiências serão construídas nas próximas fases.</p></div><div id="roadmap-grid" class="roadmap-grid"></div></section>
        <section id="museu" class="section museum-section"><div class="section-heading"><p class="eyebrow">MUSEU INTERATIVO</p><h2>Consoles, controles e sensores que moldaram os jogos</h2><p>Além da história dos jogos, o Fliperama DS passa a documentar a evolução do hardware, dos periféricos e das formas de interação.</p></div><div class="museum-stack"><div><div class="museum-heading"><h3>Museu de consoles</h3><span>2D + estudo 3D conceitual</span></div><div id="museum-consoles" class="museum-grid"></div></div><div><div class="museum-heading"><h3>Museu de controles</h3><span>Arcade, digital, analógico e especializado</span></div><div id="museum-controllers" class="museum-grid"></div></div><div><div class="museum-heading"><h3>Museu de sensores e periféricos</h3><span>Corpo, câmera, movimento e simulação</span></div><div id="museum-sensors" class="museum-grid"></div></div></div></section>
        <section id="desempenho" class="section performance-section"><div class="section-heading"><p class="eyebrow">DESEMPENHO</p><h2>Qualidade adequada ao seu dispositivo</h2><p>O teste curto observa estabilidade de quadros e capacidades gerais. A recomendação nunca bloqueia sua escolha manual.</p></div><div class="performance-card"><div id="benchmark-status"><strong>Teste ainda não executado</strong><span>Leva menos de um segundo e não envia dados.</span></div><button id="run-benchmark" class="button primary">Executar benchmark</button><div id="benchmark-result" class="benchmark-result" hidden></div></div></section>
        <section id="arquitetura" class="section architecture"><div class="section-heading"><p class="eyebrow">ARQUITETURA</p><h2>Um portal leve. Motores isolados.</h2></div><div class="architecture-grid"><article><span>01</span><h3>Portal</h3><p>Catálogo, histórico, museus e preferências carregam sem antecipar os jogos.</p></article><article><span>02</span><h3>Curadoria</h3><p>Filtros, roadmap e controle de versão ajudam o aluno a entender o que já existe e o que ainda será construído.</p></article><article><span>03</span><h3>Renderização</h3><p>Phaser 2D, WebGL puro e Three.js entram apenas quando uma experiência precisa deles.</p></article><article><span>04</span><h3>Persistência</h3><p>Configurações e progresso usam dados versionados, nunca objetos do motor.</p></article></div></section>
      </main>
      <dialog id="details-dialog" class="details-dialog">
        <article class="details-shell">
          <header class="details-header"><div><p class="eyebrow">PRÉVIA DO LABORATÓRIO</p><h2 id="details-title"></h2></div><button id="details-close" class="icon-button" aria-label="Fechar prévia">×</button></header>
          <div class="details-hero"><img id="details-logo" alt=""><div id="details-previews" class="details-previews"></div></div>
          <div id="details-content" class="details-content"></div>
          <footer class="details-actions"><button id="details-play" class="button primary">Abrir laboratório</button><button id="details-dismiss" class="button secondary">Voltar ao catálogo</button></footer>
        </article>
      </dialog>
      <dialog id="version-dialog" class="details-dialog version-dialog">
        <article class="details-shell">
          <header class="details-header"><div><p class="eyebrow">CONTROLE DE VERSÃO</p><h2>Versão e última atualização</h2></div><button id="version-close" class="icon-button" aria-label="Fechar controle de versão">×</button></header>
          <div class="version-panel"><div class="version-status"><strong id="version-current">${BUILD_INFO.label}</strong><span id="version-relative"></span></div><dl class="version-grid"><div><dt>Versão nesta aba</dt><dd id="version-tab">${BUILD_INFO.label}</dd></div><div><dt>Última versão publicada</dt><dd id="version-published">${BUILD_INFO.label}</dd></div><div><dt>Data e hora registradas</dt><dd id="version-datetime"></dd></div><div><dt>Canal</dt><dd id="version-channel">${BUILD_INFO.channel}</dd></div><div><dt>Última verificação</dt><dd id="version-checked">Ainda não verificada</dd></div></dl><div class="version-notes"><h3>Atualizações desta versão</h3><ul id="version-notes-list">${BUILD_INFO.notes.map((note) => `<li>${note}</li>`).join('')}</ul></div><p id="version-warning" class="settings-note">A verificação consulta somente o arquivo público version.json do próprio Fliperama DS. Nenhum dado pessoal é enviado.</p></div>
          <footer class="details-actions"><button id="version-refresh" class="button primary">Verificar agora</button><button id="version-dismiss" class="button secondary">Fechar</button></footer>
        </article>
      </dialog>
      <dialog id="game-dialog" class="game-dialog">
        <div class="game-shell">
          <header class="game-header"><div><p class="eyebrow">LABORATÓRIO JOGÁVEL</p><h2 id="game-title"></h2></div><div class="scoreboard" aria-live="polite"><span><i id="hud-label-1"></i><strong id="hud-value-1">0</strong></span><span><i id="hud-label-2"></i><strong id="hud-value-2">0</strong></span><span><i id="hud-label-3"></i><strong id="hud-value-3">0</strong></span></div><div class="lab-actions"><button id="history-shortcut" class="lab-action" aria-label="Abrir modo História">História</button><button id="fullscreen-toggle" class="lab-action" aria-label="Jogar em tela cheia">Tela cheia</button><button id="game-close" class="icon-button" aria-label="Voltar ao catálogo">×</button></div></header>
          <nav class="game-tabs" aria-label="Conteúdo do jogo" role="tablist"><button class="active" data-panel="play" role="tab" aria-selected="true">Jogar</button><button data-panel="guide" role="tab" aria-selected="false">Como funciona</button><button data-panel="history" role="tab" aria-selected="false">História</button><button data-panel="code" role="tab" aria-selected="false">Lógica</button><button data-panel="comparison" role="tab" aria-selected="false">Comparação</button><button id="editor-tab" data-panel="editor" role="tab" aria-selected="false" hidden>Editor</button></nav>
          <section id="panel-play" class="game-panel play-panel" role="tabpanel">
            <div id="game-stage" class="game-stage"><div id="game-canvas" class="game-canvas"><div class="game-loading"><span class="loader"></span>Carregando motor do laboratório…</div></div>
              <div id="game-onboarding" class="game-overlay onboarding"><p class="eyebrow">COMO JOGAR</p><h3 id="tutorial-title"></h3><div id="tutorial-steps" class="tutorial-steps"></div><label><span id="game-option-label"></span><select id="game-option"></select></label><button id="start-match" class="button primary">Começar partida</button></div>
              <div id="game-result" class="game-overlay result-overlay" hidden><p class="eyebrow">SESSÃO CONCLUÍDA</p><h3 id="result-title"></h3><p id="result-summary"></p><button id="rematch" class="button primary">Jogar novamente</button></div>
            </div>
            <div class="game-help"><span id="keyboard-help"></span><span id="game-state">Preparando</span></div>
            <div id="touch-controls" class="touch-controls" aria-label="Controles móveis"></div>
          </section>
          <section id="panel-guide" class="game-panel learning-panel" role="tabpanel" hidden></section>
          <section id="panel-history" class="game-panel learning-panel" role="tabpanel" hidden></section>
          <section id="panel-code" class="game-panel learning-panel" role="tabpanel" hidden></section>
          <section id="panel-comparison" class="game-panel learning-panel" role="tabpanel" hidden></section>
          <section id="panel-editor" class="game-panel learning-panel editor-panel" role="tabpanel" hidden></section>
        </div>
      </dialog>
      <div id="performance-overlay" class="performance-overlay" hidden>FPS <strong id="fps-value">--</strong><span id="quality-value">AUTO</span></div>
      <footer><span>Fliperama DS ${BUILD_INFO.label} · ${BUILD_INFO.phase}</span><span>Reconstruções autorais · Conteúdo educacional · Pesquisa com fontes</span></footer>`;
    const gameGrid = query('#game-grid');
    const catalogTitle = query('#catalog-title');
    const clearFilter = query('#clear-filter');
    const milestoneStrip = query('#milestone-strip');
    const settingsPanel = query('#settings-panel');
    const settingsToggle = query('#settings-toggle');
    const versionToggle = query('#version-toggle');
    const versionDialog = query('#version-dialog');
    const gameDialog = query('#game-dialog');
    const detailsDialog = query('#details-dialog');
    const catalogSearch = query('#catalog-search');
    const genreFilter = query('#genre-filter');
    const technologyFilter = query('#technology-filter');
    const companyFilter = query('#company-filter');
    const catalogSummary = query('#catalog-summary');
    const activeFiltersHost = query('#active-filters');
    const highlightsStrip = query('#highlights-strip');
    function activeProfile() {
        const profile = gameProfiles[activeGameId];
        if (!profile)
            throw new Error('Perfil do jogo não encontrado');
        return profile;
    }
    function gameCompany(game) {
        return game.historicalReferences[0]?.company ?? 'Não informado';
    }
    function uniqueCatalogValues(pick) {
        const values = catalog.flatMap((game) => {
            const result = pick(game);
            return Array.isArray(result) ? [...result] : [result];
        });
        return [...new Set(values)].sort((first, second) => first.localeCompare(second, 'pt-BR'));
    }
    function hasActiveFilters() {
        return Boolean(catalogFilters.era || catalogFilters.query || catalogFilters.genre !== 'todos' || catalogFilters.technology !== 'todos' || catalogFilters.company !== 'todos' || catalogFilters.quick !== 'todos');
    }
    function syncCatalogForms() {
        catalogSearch.value = catalogFilters.query;
        genreFilter.value = catalogFilters.genre;
        technologyFilter.value = catalogFilters.technology;
        companyFilter.value = catalogFilters.company;
        document.querySelectorAll('.quick-filter').forEach((button) => button.classList.toggle('active', button.dataset.quickFilter === catalogFilters.quick));
        clearFilter.hidden = !hasActiveFilters();
    }
    function configureCatalogFilters() {
        const withDefault = (label, items) => [
            `<option value="todos">${label}</option>`,
            ...items.map((item) => `<option value="${item}">${item}</option>`),
        ].join('');
        genreFilter.innerHTML = withDefault('Todas as categorias', uniqueCatalogValues((game) => game.genre));
        technologyFilter.innerHTML = withDefault('Todas as tecnologias', uniqueCatalogValues((game) => game.technology));
        companyFilter.innerHTML = withDefault('Todas as empresas', uniqueCatalogValues((game) => gameCompany(game)));
        syncCatalogForms();
    }
    function matchingGames() {
        const searchTerms = catalogFilters.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        return catalog.filter((game) => {
            if (catalogFilters.era && game.era !== catalogFilters.era)
                return false;
            if (catalogFilters.genre !== 'todos' && !game.genre.includes(catalogFilters.genre))
                return false;
            if (catalogFilters.technology !== 'todos' && !game.technology.includes(catalogFilters.technology))
                return false;
            if (catalogFilters.company !== 'todos' && gameCompany(game) !== catalogFilters.company)
                return false;
            if (catalogFilters.quick === 'jogaveis' && !(0, dynamic_game_loader_1.supportsPlayableModule)(game.id))
                return false;
            if (catalogFilters.quick === 'em-breve' && game.status !== 'planejado')
                return false;
            if (catalogFilters.quick === 'recentes' && game.releasePhase < 5)
                return false;
            if (searchTerms.length > 0) {
                const haystack = [game.title, game.subtitle, gameCompany(game), game.era, String(game.year), ...game.genre, ...game.technology, ...game.educationalConcepts].join(' ').toLowerCase();
                if (!searchTerms.every((term) => haystack.includes(term)))
                    return false;
            }
            return true;
        });
    }
    function renderHighlights() {
        const recent = catalog.filter((game) => (0, dynamic_game_loader_1.supportsPlayableModule)(game.id)).slice().sort((first, second) => second.releasePhase - first.releasePhase || second.year - first.year).slice(0, 4);
        const upcoming = catalog.filter((game) => game.status === 'planejado').slice().sort((first, second) => first.releasePhase - second.releasePhase).slice(0, 4);
        const card = (title, items, accent) => `<article class="highlight-card" data-accent="${accent}"><p class="eyebrow">${title}</p><ul>${items.map((game) => `<li><strong>${game.title}</strong><span>${game.year} · ${gameCompany(game)} · Fase ${game.releasePhase}</span></li>`).join('')}</ul></article>`;
        highlightsStrip.innerHTML = `${card('Adicionados recentemente', recent, 'recentes')}${card('Próximos lançamentos', upcoming, 'embreve')}`;
    }
    function renderCatalogSummary(games) {
        const playable = games.filter((game) => (0, dynamic_game_loader_1.supportsPlayableModule)(game.id)).length;
        const planned = games.filter((game) => game.status === 'planejado').length;
        catalogSummary.innerHTML = `<div><strong>${games.length}</strong><span>Resultados visíveis</span></div><div><strong>${playable}</strong><span>Jogáveis agora</span></div><div><strong>${planned}</strong><span>Em breve</span></div>`;
    }
    function renderActiveFilterChips() {
        const chips = [];
        if (catalogFilters.era)
            chips.push(`<span>${catalogFilters.era}</span>`);
        if (catalogFilters.genre !== 'todos')
            chips.push(`<span>${catalogFilters.genre}</span>`);
        if (catalogFilters.technology !== 'todos')
            chips.push(`<span>${catalogFilters.technology}</span>`);
        if (catalogFilters.company !== 'todos')
            chips.push(`<span>${catalogFilters.company}</span>`);
        if (catalogFilters.query)
            chips.push(`<span>Busca: ${catalogFilters.query}</span>`);
        if (catalogFilters.quick !== 'todos')
            chips.push(`<span>${catalogFilters.quick.replace('-', ' ')}</span>`);
        activeFiltersHost.innerHTML = chips.length > 0 ? chips.join('') : '<span class="empty-chip">Sem filtros ativos</span>';
    }
    function applyCatalogFilters() {
        syncCatalogForms();
        const filtered = matchingGames();
        catalogTitle.textContent = catalogFilters.era ? `Laboratórios · ${eraLabels[catalogFilters.era]} · ${catalogFilters.era}` : 'Escolha seu jogo com filtros inteligentes';
        renderCatalogSummary(filtered);
        renderActiveFilterChips();
        renderGames(filtered);
    }
    function renderRoadmap() {
        query('#roadmap-grid').innerHTML = roadmap_1.ARCADE_ROADMAP.map((item) => `<article class="roadmap-card"><div class="roadmap-top"><span>${item.phase}</span><b>${roadmapStatusLabels[item.status]}</b></div><h3>${item.title}</h3><p>${item.summary}</p><dl class="roadmap-specs"><div><dt>Engine</dt><dd>${item.engine}</dd></div><div><dt>Visual</dt><dd>${item.dimension}</dd></div><div><dt>Modos</dt><dd>${item.gameModes.join(', ')}</dd></div><div><dt>Controles</dt><dd>${item.controls.join(', ')}</dd></div><div><dt>Gráficos</dt><dd>${item.graphics.join(', ')}</dd></div><div><dt>Aprendizagem</dt><dd>${item.learning.join(', ')}</dd></div></dl><div class="tags">${item.technology.map((technology) => `<span>${technology}</span>`).join('')}</div><footer><strong>${item.category}</strong></footer></article>`).join('');
    }
    function renderMuseumGroup(targetId, items) {
        query(`#${targetId}`).innerHTML = items.map((item) => `<article class="museum-card"><div class="museum-card-top"><span>${item.year}</span><b>${item.company}</b></div><h3>${item.title}</h3><div class="museum-visuals"><div class="museum-shot" data-mode="2D"><span>Vista 2D</span><strong>${item.detail2d}</strong></div><div class="museum-shot" data-mode="3D"><span>Estudo 3D</span><strong>${item.detail3d}</strong></div></div><p>${item.contribution}</p><dl><div><dt>Geração</dt><dd>${item.generation}</dd></div><div><dt>Tecnologia</dt><dd>${item.originalTechnology}</dd></div></dl><a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noreferrer">${item.sourceLabel} ↗</a></article>`).join('');
    }
    function formatDateTime(value) {
        return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value));
    }
    function formatRelativeTime(value) {
        const deltaMinutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
        if (deltaMinutes < 1)
            return 'Atualizado agora';
        if (deltaMinutes < 60)
            return `Atualizado há ${deltaMinutes} minuto${deltaMinutes === 1 ? '' : 's'}`;
        const hours = Math.round(deltaMinutes / 60);
        if (hours < 24)
            return `Atualizado há ${hours} hora${hours === 1 ? '' : 's'}`;
        const days = Math.round(hours / 24);
        return `Atualizado há ${days} dia${days === 1 ? '' : 's'}`;
    }
    async function refreshVersionDialog() {
        const warning = query('#version-warning');
        query('#version-current').textContent = BUILD_INFO.label;
        query('#version-tab').textContent = BUILD_INFO.label;
        query('#version-channel').textContent = BUILD_INFO.channel;
        query('#version-datetime').textContent = formatDateTime(BUILD_INFO.publishedAt);
        query('#version-relative').textContent = formatRelativeTime(BUILD_INFO.publishedAt);
        try {
            const response = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
            const latest = await response.json();
            query('#version-published').textContent = `v${latest.version}`;
            query('#version-datetime').textContent = formatDateTime(latest.publishedAt);
            query('#version-relative').textContent = formatRelativeTime(latest.publishedAt);
            query('#version-channel').textContent = latest.channel ?? BUILD_INFO.channel;
            if (Array.isArray(latest.notes) && latest.notes.length > 0)
                query('#version-notes-list').innerHTML = latest.notes.map((note) => `<li>${note}</li>`).join('');
            warning.textContent = latest.version === BUILD_INFO.version
                ? 'Versão atual confirmada. Esta aba está alinhada com a última publicação conhecida.'
                : `Atenção: esta aba ainda mostra ${BUILD_INFO.label}, mas a publicação disponível já está em v${latest.version}. Atualize o cache e recarregue.`;
        }
        catch {
            warning.textContent = 'Não foi possível consultar version.json agora. Os dados locais desta aba continuam disponíveis.';
            query('#version-published').textContent = BUILD_INFO.label;
        }
        versionDialogCheckedAt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
        query('#version-checked').textContent = versionDialogCheckedAt;
    }
    function renderGames(games) {
        if (games.length === 0) {
            gameGrid.innerHTML = '<article class="empty-state"><h3>Nenhum jogo encontrado</h3><p>Ajuste a busca ou remova filtros para ver todo o catálogo disponível.</p></article>';
            return;
        }
        gameGrid.innerHTML = games.map((game) => {
            const playable = (0, dynamic_game_loader_1.supportsPlayableModule)(game.id);
            const presentation = (0, game_presentations_1.gamePresentation)(game);
            return `<article class="game-card" data-runtime="${game.runtime}" data-game-card="${game.id}">
          <div class="card-visual">
            <span class="runtime">${game.runtime.toUpperCase()}</span>
            <img class="card-preview primary-preview" src="${presentation.previews[0]}" alt="Prévia de ${game.title}" loading="lazy">
            <img class="card-preview secondary-preview" src="${presentation.previews[1]}" alt="Segunda prévia de ${game.title}" loading="lazy">
            <img class="card-logo" src="${presentation.logoUrl}" alt="Logo ${game.title}" loading="lazy">
            <span class="phase">FASE ${game.releasePhase}</span>
            <span class="preview-hint">Passe o mouse para outra tela</span>
          </div>
          <div class="card-content"><div class="card-meta"><span>${game.year} · ${game.era}</span><span>${statusLabels[game.status]}</span></div><h3>${game.title}</h3><p>${game.subtitle}</p><div class="tags">${[...game.genre.slice(0, 2), ...game.educationalConcepts.slice(0, 2)].slice(0, 4).map((tag) => `<span>${tag}</span>`).join('')}</div><div class="card-footer"><span>${gameCompany(game)}</span><span>${game.mobileReady ? 'Mobile ✓' : 'Desktop'}</span></div><div class="card-actions"><button class="card-action details" data-details-id="${game.id}">Ver prévia e instruções</button><button class="card-action ${playable ? 'playable' : ''}" data-game-id="${game.id}" ${playable ? '' : 'disabled'}>${playable ? 'Abrir laboratório' : `Planejado · Fase ${game.releasePhase}`}</button></div></div>
        </article>`;
        }).join('');
        gameGrid.querySelectorAll('[data-details-id]').forEach((button) => button.addEventListener('click', () => openGameDetails(button.dataset.detailsId ?? '')));
        gameGrid.querySelectorAll('[data-game-id]:not(:disabled)').forEach((button) => button.addEventListener('click', () => void openGame(button.dataset.gameId ?? '')));
    }
    function renderGuideMarkup(game, presentation) {
        const section = (title, items) => `<section><h4>${title}</h4><ol>${items.map((item) => `<li>${item}</li>`).join('')}</ol></section>`;
        const runtimeLabels = {
            dom: 'HTML/CSS/DOM', phaser: 'Phaser + Canvas', webgl: 'WebGL + GLSL', three: 'Three.js/WebGL', wasm: 'WebAssembly',
        };
        const reference = game.historicalReferences[0];
        const technicalProfile = `<section class="programming-profile"><h4>Tecnologia e programação</h4><dl><div><dt>Linguagem desta reconstrução</dt><dd>TypeScript em modo estrito</dd></div><div><dt>Runtime e renderização</dt><dd>${runtimeLabels[game.runtime]}</dd></div><div><dt>Técnicas estudadas</dt><dd>${game.technology.join(', ')}</dd></div><div><dt>Tecnologia da referência histórica</dt><dd>${reference?.originalTechnology ?? 'Tecnologia histórica documentada na ficha do módulo'}</dd></div></dl></section>`;
        return `<div class="guide-intro"><img src="${presentation.logoUrl}" alt="Logo ${game.title}"><div><p class="eyebrow">GUIA DO JOGO</p><h3>Como funciona ${game.title}</h3><p>${presentation.objective}</p></div></div><div class="guide-outcomes"><span><b>Vitória</b>${presentation.victory}</span><span><b>Derrota</b>${presentation.defeat}</span></div><div class="guide-grid">${section('Passo a passo', presentation.howToPlay)}${section('Controles', presentation.controls)}${section('Estrutura', presentation.structure)}${section('Pontuação', presentation.scoring)}${section('Lógica principal', presentation.logic)}</div>${technicalProfile}`;
    }
    function openGameDetails(gameId) {
        const game = catalog.find((item) => item.id === gameId);
        if (!game)
            return;
        const presentation = (0, game_presentations_1.gamePresentation)(game);
        query('#details-title').textContent = game.title;
        const logo = query('#details-logo');
        logo.src = presentation.logoUrl;
        logo.alt = `Logo ${game.title}`;
        query('#details-previews').innerHTML = presentation.previews.map((preview, index) => `<figure><img src="${preview}" alt="Prévia ${index + 1} de ${game.title}"><figcaption>Tela ${index + 1} · ${index === 0 ? 'visão do jogo' : 'informações e estrutura'}</figcaption></figure>`).join('');
        query('#details-content').innerHTML = renderGuideMarkup(game, presentation);
        const play = query('#details-play');
        play.hidden = !(0, dynamic_game_loader_1.supportsPlayableModule)(game.id);
        play.dataset.gameId = game.id;
        detailsDialog.showModal();
    }
    function renderMilestones(records) {
        milestoneStrip.innerHTML = records.map((record) => `<details class="milestone-card"><summary><span>${record.releaseDate}</span><strong>${record.title}</strong><small>${record.genre}</small></summary><div class="milestone-details"><p>${record.contribution}</p><dl><div><dt>Pessoas</dt><dd>${record.people.join(', ')}</dd></div><div><dt>Empresas</dt><dd>${record.companies.join(', ')}</dd></div><div><dt>Plataformas</dt><dd>${record.platforms.join(', ')}</dd></div><div><dt>Sistema</dt><dd>${record.operatingSystems.join(', ')}</dd></div><div><dt>Tecnologia</dt><dd>${record.originalTechnology}</dd></div><div><dt>Preço/modelo</dt><dd>${record.commercialModel}</dd></div><div><dt>No Fliperama DS</dt><dd>${record.arcadeDsRelation}</dd></div></dl><a class="source-link" href="${record.sourceUrl}" target="_blank" rel="noreferrer">${record.sourceLabel} ↗</a></div></details>`).join('');
        query('#milestone-count').textContent = `${records.length} ${records.length === 1 ? 'registro' : 'registros'}`;
    }
    function setEraFilter(era) {
        catalogFilters.era = era;
        document.querySelectorAll('.era').forEach((button) => button.classList.toggle('active', button.dataset.era === era));
        const milestones = era ? museum_timeline_1.MUSEUM_TIMELINE.filter((record) => record.era === era) : museum_timeline_1.MUSEUM_TIMELINE;
        renderMilestones(milestones);
        query('#milestone-title').textContent = era ? `${eraLabels[era]} · ${era}` : 'Todos os marcos históricos';
        applyCatalogFilters();
    }
    async function openGame(gameId) {
        if (detailsDialog.open)
            detailsDialog.close();
        activeGameId = gameId;
        activeCustomLayout = undefined;
        const game = catalog.find((item) => item.id === gameId);
        if (!game || !gameProfiles[gameId])
            return;
        renderGameProfile(game, activeProfile());
        query('#game-onboarding').hidden = false;
        query('#game-result').hidden = true;
        gameDialog.showModal();
        document.body.classList.add('game-open');
        showGamePanel('history');
    }
    function milestoneForGame(gameId) {
        const recordIds = {
            'vector-tennis': 'tennis-for-two-1958',
            'block-reactor': 'breakout-1976',
            'orbital-sentinel': 'space-invaders-1978',
            'vector-fleet': 'asteroids-1979',
            'space-blocks': 'tetris-1984',
            'trap-lab': 'super-mario-1985',
            'data-maze': 'pac-man-1980',
            'room-quest': 'adventure-1980',
            'raster-rally': 'pole-position-1982',
            'state-quest-rpg': 'dragon-quest-1986',
            'bit-bridge-16': 'mega-drive-1988',
            'raycast-corridors': 'raycasting-1992',
            'polygon-sector-94': 'playstation-1994',
            'camera-evolution': 'camera-3d-1996',
        };
        return museum_timeline_1.MUSEUM_TIMELINE.find((record) => record.id === recordIds[gameId]);
    }
    function renderHistoricalSheet(record) {
        return `<section class="historical-sheet" aria-label="Ficha técnica histórica"><h4>Ficha técnica do original</h4><dl><div><dt>Lançamento</dt><dd>${record.releaseDate}</dd></div><div><dt>Criação</dt><dd>${record.people.join(', ')}</dd></div><div><dt>Empresas</dt><dd>${record.companies.join(', ')}</dd></div><div><dt>Plataformas</dt><dd>${record.platforms.join(', ')}</dd></div><div><dt>Sistema</dt><dd>${record.operatingSystems.join(', ')}</dd></div><div><dt>Tecnologia/linguagem</dt><dd>${record.originalTechnology}</dd></div><div><dt>Preço/modelo</dt><dd>${record.commercialModel}</dd></div></dl></section>`;
    }
    function renderGameProfile(game, profile) {
        query('#game-title').textContent = game.title;
        profile.hud.forEach((label, index) => query(`#hud-label-${index + 1}`).textContent = label);
        query('#tutorial-title').textContent = profile.tutorialTitle;
        query('#tutorial-steps').innerHTML = profile.tutorialSteps.map((step, index) => `<span><b>0${index + 1}</b>${step}</span>`).join('');
        query('#game-option-label').textContent = profile.optionLabel;
        query('#game-option').innerHTML = Object.entries(profile.options).map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
        query('#game-option').value = selectedOptions[activeGameId] ?? profile.defaultOption;
        query('#keyboard-help').textContent = profile.keyboardHelp;
        const touch = query('#touch-controls');
        touch.dataset.game = activeGameId;
        touch.innerHTML = profile.touchControls.map((control) => `<button data-action="${control.action}" aria-label="${control.aria}">${control.label}</button>`).join('');
        bindTouchControls();
        const presentation = (0, game_presentations_1.gamePresentation)(game);
        query('#panel-guide').innerHTML = renderGuideMarkup(game, presentation);
        const milestone = milestoneForGame(game.id);
        query('#panel-history').innerHTML = `<p class="eyebrow">${profile.historyEyebrow}</p><h3>${profile.history.title}</h3>${profile.history.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}${milestone ? renderHistoricalSheet(milestone) : ''}<a class="source-link" href="${profile.history.sourceUrl}" target="_blank" rel="noreferrer">Consultar fonte histórica ↗</a><div class="history-next"><button class="button primary" data-history-play>Entrar no jogo</button><span>O jogo abrirá em tela cheia no celular ao iniciar a partida.</span></div>`;
        query('[data-history-play]').addEventListener('click', () => showGamePanel('play'));
        query('#panel-code').innerHTML = `<p class="eyebrow">LABORATÓRIO DE LÓGICA</p><h3>${profile.logicTitle}</h3><p>${profile.logicIntro}</p><pre><code>${profile.pseudocode}</code></pre><div class="concept-grid">${profile.concepts.map((concept) => `<span>${concept}</span>`).join('')}</div>`;
        query('#panel-comparison').innerHTML = `<p class="eyebrow">HISTÓRICO × DS</p><h3>O que foi preservado e o que mudou</h3><div class="comparison-table" role="table">${profile.comparison.map(([item, historical, modern]) => `<div role="row"><strong role="cell">${item}</strong><span role="cell">${historical}</span><span role="cell">${modern}</span></div>`).join('')}</div><p class="comparison-note">Selecione <strong>Histórico</strong> nas configurações gráficas para experimentar a apresentação monocromática.</p>`;
        const editorTab = query('#editor-tab');
        editorTab.hidden = activeGameId !== 'block-reactor' && activeGameId !== 'trap-lab' && activeGameId !== 'puzzle-forge';
        editorTab.textContent = activeGameId === 'trap-lab' ? 'Sequência' : activeGameId === 'puzzle-forge' ? 'Editor 7×7' : 'Editor';
        if (activeGameId === 'block-reactor')
            renderBlockEditor();
        else if (activeGameId === 'trap-lab')
            renderTrapEditor();
        else if (activeGameId === 'puzzle-forge')
            renderPuzzleEditor();
        else
            query('#panel-editor').innerHTML = '';
        updateHud(undefined);
    }
    function renderBlockEditor() {
        const symbols = ['.', 'n', 'r', 'e', 'b'];
        const labels = { '.': 'Vazio', n: 'Comum', r: 'Resistente', e: 'Explosivo', b: 'Bônus' };
        const panel = query('#panel-editor');
        panel.innerHTML = `<p class="eyebrow">LABORATÓRIO DE FASES</p><h3>Editor progressivo 8 × 5</h3><p>Toque em uma célula para alternar o tipo de bloco. A fase é enviada como dados para a simulação, sem criar regras dentro do editor ou do Phaser.</p><div class="editor-legend">${symbols.map((symbol) => `<span data-type="${symbol}"><i></i>${labels[symbol]}</span>`).join('')}</div><div class="block-editor" role="grid" aria-label="Grade da fase">${[...editorLayout].map((symbol, index) => `<button data-index="${index}" data-type="${symbol}" role="gridcell" aria-label="Linha ${Math.floor(index / block_layout_1.EDITOR_COLUMNS) + 1}, coluna ${(index % block_layout_1.EDITOR_COLUMNS) + 1}: ${labels[symbol]}"><span>${symbol === '.' ? '+' : symbol.toUpperCase()}</span></button>`).join('')}</div><div class="editor-actions"><button id="editor-clear" class="button secondary">Limpar</button><button id="editor-pattern" class="button secondary">Restaurar exemplo</button><button id="editor-test" class="button primary">Testar esta fase</button></div><p id="editor-status" class="comparison-note">${block_layout_1.EDITOR_COLUMNS} colunas × ${block_layout_1.EDITOR_ROWS} linhas · ${[...editorLayout].filter((symbol) => symbol !== '.').length} blocos ativos.</p>`;
        panel.querySelectorAll('[data-index]').forEach((button) => button.addEventListener('click', () => {
            const index = Number(button.dataset.index);
            const current = editorLayout[index];
            const next = symbols[(symbols.indexOf(current) + 1) % symbols.length];
            editorLayout = `${editorLayout.slice(0, index)}${next}${editorLayout.slice(index + 1)}`;
            renderBlockEditor();
        }));
        query('#editor-clear').addEventListener('click', () => { editorLayout = '.'.repeat(block_layout_1.EDITOR_COLUMNS * block_layout_1.EDITOR_ROWS); renderBlockEditor(); });
        query('#editor-pattern').addEventListener('click', () => { editorLayout = ['nnnnnnnn', 'nrrnnrrn', 'nnebbenn', 'n.e..e.n', 'nnb..bnn'].join(''); renderBlockEditor(); });
        query('#editor-test').addEventListener('click', () => {
            if (!(0, block_layout_1.isValidEditorLayout)(editorLayout)) {
                query('#editor-status').textContent = 'Adicione pelo menos um bloco antes de testar.';
                return;
            }
            activeCustomLayout = editorLayout;
            selectedOptions['block-reactor'] = 'pratica';
            query('#game-option').value = 'pratica';
            query('#game-onboarding').hidden = false;
            query('#game-result').hidden = true;
            query('#start-match').textContent = 'Testar fase criada';
            showGamePanel('play');
            void mountActiveGame(false);
        });
    }
    function renderPuzzleEditor() {
        const panel = query('#panel-editor');
        panel.innerHTML = `<p class="eyebrow">OFICINA DE LABIRINTOS</p><h3>Editor 7 × 7</h3><p>Toque nas células para criar ou remover paredes. O início permanece no canto superior esquerdo e a saída no canto inferior direito.</p><div class="puzzle-editor" role="grid" aria-label="Editor de labirinto 7 por 7">${[...puzzleEditorLayout].map((cell, index) => `<button data-puzzle-index="${index}" data-wall="${cell === '#'}" role="gridcell" aria-label="${cell === '#' ? 'Parede' : 'Caminho'} na linha ${Math.floor(index / 7) + 1}, coluna ${(index % 7) + 1}" ${index === 0 || index === 48 ? 'disabled' : ''}><span>${index === 0 ? 'S' : index === 48 ? 'G' : cell === '#' ? '■' : '·'}</span></button>`).join('')}</div><div class="editor-actions"><button id="puzzle-editor-clear" class="button secondary">Limpar paredes</button><button id="puzzle-editor-pattern" class="button secondary">Restaurar exemplo</button><button id="puzzle-editor-test" class="button primary">Testar labirinto</button></div><p class="comparison-note">A grade é enviada como uma cadeia de 49 caracteres para a simulação, mantendo regras e renderização desacopladas.</p>`;
        panel.querySelectorAll('[data-puzzle-index]').forEach((button) => button.addEventListener('click', () => {
            const index = Number(button.dataset.puzzleIndex);
            if (index === 0 || index === 48)
                return;
            const next = puzzleEditorLayout[index] === '#' ? '.' : '#';
            puzzleEditorLayout = `${puzzleEditorLayout.slice(0, index)}${next}${puzzleEditorLayout.slice(index + 1)}`;
            renderPuzzleEditor();
        }));
        query('#puzzle-editor-clear').addEventListener('click', () => { puzzleEditorLayout = '.'.repeat(49); renderPuzzleEditor(); });
        query('#puzzle-editor-pattern').addEventListener('click', () => { puzzleEditorLayout = ['.......', '.###.#.', '...#.#.', '##.#...', '...###.', '.#.....', '...##..'].join(''); renderPuzzleEditor(); });
        query('#puzzle-editor-test').addEventListener('click', () => {
            activeCustomLayout = puzzleEditorLayout;
            selectedOptions['puzzle-forge'] = 'labirinto-aprendiz';
            query('#game-option').value = 'labirinto-aprendiz';
            query('#game-onboarding').hidden = false;
            query('#game-result').hidden = true;
            query('#start-match').textContent = 'Testar labirinto criado';
            showGamePanel('play');
            void mountActiveGame(false);
        });
    }
    function renderTrapEditor() {
        const commands = ['aguardar', 'desativar', 'abrir', 'verificar'];
        const labels = {
            aguardar: 'Aguardar pulso seguro',
            desativar: 'Desativar armadilhas',
            abrir: 'Abrir portão',
            verificar: 'Verificar sensores',
        };
        const panel = query('#panel-editor');
        panel.innerHTML = `<p class="eyebrow">LABORATÓRIO DE ALGORITMOS</p><h3>Editor de sequência lógica</h3><p>Monte três passos para o terminal de segurança. A sequência é enviada como dados para a simulação e pode ser alterada sem modificar o mapa ou o Phaser.</p><div class="sequence-editor">${activeTrapSequence.map((command, index) => `<label><span>PASSO ${index + 1}</span><select data-sequence-index="${index}">${commands.map((item) => `<option value="${item}" ${item === command ? 'selected' : ''}>${labels[item]}</option>`).join('')}</select></label>`).join('')}</div><div class="editor-actions"><button id="sequence-example" class="button secondary">Restaurar exemplo</button><button id="sequence-test" class="button primary">Aplicar e testar</button></div><p id="sequence-status" class="comparison-note">Sequência atual: ${activeTrapSequence.map((command) => labels[command]).join(' → ')}.</p>`;
        panel.querySelectorAll('[data-sequence-index]').forEach((select) => select.addEventListener('change', () => {
            const next = [...activeTrapSequence];
            next[Number(select.dataset.sequenceIndex)] = select.value;
            activeTrapSequence = next;
            renderTrapEditor();
        }));
        query('#sequence-example').addEventListener('click', () => {
            activeTrapSequence = ['aguardar', 'desativar', 'abrir'];
            renderTrapEditor();
        });
        query('#sequence-test').addEventListener('click', () => {
            query('#game-onboarding').hidden = false;
            query('#game-result').hidden = true;
            query('#start-match').textContent = 'Testar sequência';
            showGamePanel('play');
            void mountActiveGame(false);
        });
    }
    async function mountActiveGame(restoreSave) {
        if (runtimeLoading)
            return;
        runtimeLoading = true;
        const sequence = ++openSequence;
        runtime?.dispose();
        runtime = undefined;
        const canvas = query('#game-canvas');
        canvas.innerHTML = '<div class="game-loading"><span class="loader"></span>Carregando motor do laboratório…</div>';
        try {
            const nextRuntime = await (0, dynamic_game_loader_1.loadGameRuntime)(activeGameId);
            if (sequence !== openSequence || !gameDialog.open)
                return nextRuntime.dispose();
            canvas.innerHTML = '';
            const profile = activeProfile();
            await nextRuntime.mount({
                container: canvas, graphicsMode: resolvedGraphicsMode(), reducedMotion: settings.reducedMotion, muted: settings.muted, locale: 'pt-BR',
                parameters: {
                    [profile.optionParameter]: selectedOptions[activeGameId] ?? profile.defaultOption,
                    ...((activeGameId === 'block-reactor' || activeGameId === 'puzzle-forge') && activeCustomLayout ? { layout: activeCustomLayout } : {}),
                    ...(activeGameId === 'trap-lab' ? { sequence: activeTrapSequence.join(',') } : {}),
                },
                onEvent: handleRuntimeEvent,
            });
            if (sequence !== openSequence || !gameDialog.open)
                return nextRuntime.dispose();
            runtime = nextRuntime;
            let restored = false;
            if (restoreSave) {
                const save = await storage.loadGame(activeGameId);
                if (save) {
                    try {
                        runtime.restore(save);
                        restoreSelectedOption(save.payload);
                        restored = true;
                    }
                    catch {
                        restored = false;
                    }
                }
            }
            query('#start-match').textContent = restored ? 'Continuar sessão' : 'Começar partida';
            startHudUpdates();
            startFpsMonitor();
            updateHud(runtime.snapshot());
            query('#game-state').textContent = 'Tutorial aberto';
        }
        catch (error) {
            canvas.innerHTML = `<div class="game-error"><strong>Não foi possível abrir.</strong><span>${error instanceof Error ? error.message : 'Erro inesperado'}</span></div>`;
        }
        finally {
            runtimeLoading = false;
        }
    }
    function restoreSelectedOption(payload) {
        const profile = activeProfile();
        let candidate;
        if (activeGameId === 'vector-tennis')
            candidate = payload.difficulty;
        else if (activeGameId === 'space-blocks')
            candidate = payload.mode;
        else if (activeGameId === 'vector-fleet')
            candidate = payload.difficulty;
        else if (activeGameId === 'orbital-sentinel')
            candidate = payload.difficulty;
        else if (activeGameId === 'trap-lab')
            candidate = payload.mode;
        else if (activeGameId === 'data-maze')
            candidate = payload.difficulty;
        else if (activeGameId === 'room-quest')
            candidate = payload.mode;
        else if (activeGameId === 'raster-rally')
            candidate = payload.difficulty;
        else if (activeGameId === 'state-quest-rpg')
            candidate = payload.mode;
        else if (activeGameId === 'bit-bridge-16')
            candidate = payload.mode;
        else if (activeGameId === 'raycast-corridors')
            candidate = payload.difficulty;
        else if (activeGameId === 'polygon-sector-94')
            candidate = payload.difficulty;
        else if (activeGameId === 'camera-evolution')
            candidate = payload.difficulty;
        else if (activeGameId === 'board-arena') {
            const boardState = payload;
            candidate = `${boardState.mode ?? 'velha'}-${boardState.difficulty ?? 'aprendiz'}`;
        }
        else if (activeGameId === 'puzzle-forge') {
            const puzzleState = payload;
            candidate = `${puzzleState.mode ?? 'caminho'}-${puzzleState.difficulty ?? 'aprendiz'}`;
        }
        else if (activeGameId === 'voxelcraft-ds')
            candidate = String(payload.mode ?? 'learning');
        else
            candidate = payload.mode;
        if (candidate && candidate in profile.options) {
            selectedOptions[activeGameId] = candidate;
            query('#game-option').value = candidate;
        }
        if (activeGameId === 'trap-lab') {
            const sequence = payload.sequence;
            if (sequence?.length === 3)
                activeTrapSequence = [...sequence];
        }
    }
    function handleRuntimeEvent(event) {
        if (event.type === 'serve')
            query('#game-state').textContent = 'Em jogo';
        if (event.type === 'point')
            query('#game-state').textContent = 'Ponto concluído · pressione Sacar';
        if (event.type === 'progress') {
            if (activeGameId === 'puzzle-forge') {
                const eventName = event.detail?.event;
                query('#game-state').textContent = eventName === 'invalid'
                    ? `Ação inválida · ${event.detail?.mistakes ?? 0} erros`
                    : eventName === 'completed'
                        ? 'Desafio concluído'
                        : `${event.detail?.moves ?? 0} movimentos · ${event.detail?.score ?? 0} pontos`;
            }
            if (activeGameId === 'board-arena') {
                const eventName = event.detail?.event;
                query('#game-state').textContent = eventName === 'capture'
                    ? `Captura registrada · ${event.detail?.playerCaptures ?? 0} × ${event.detail?.cpuCaptures ?? 0}`
                    : eventName === 'promotion'
                        ? 'Peça promovida a dama'
                        : eventName === 'invalid'
                            ? 'Movimento inválido · revise a regra'
                            : `${event.detail?.moves ?? 0} jogadas · ${event.detail?.score ?? 0} pontos`;
            }
            if (activeGameId === 'voxelcraft-ds')
                query('#game-state').textContent = `${event.detail?.progress ?? 0}% da missão · ${event.detail?.xp ?? 0} XP`;
            if (activeGameId === 'space-blocks')
                query('#game-state').textContent = Number(event.detail?.lines ?? 0) > 0 ? `${event.detail?.lines} linhas concluídas` : 'Peça posicionada';
            if (activeGameId === 'vector-fleet')
                query('#game-state').textContent = event.detail?.event === 'wave-cleared' ? `Onda ${event.detail?.wave} iniciada` : event.detail?.event === 'ship-hit' ? `${event.detail?.lives} vidas restantes` : 'Asteroide neutralizado';
            if (activeGameId === 'orbital-sentinel')
                query('#game-state').textContent = event.detail?.event === 'wave-cleared' ? `Onda ${event.detail?.wave} iniciada` : event.detail?.event === 'player-hit' ? `${event.detail?.lives} vidas restantes` : event.detail?.event === 'barrier-hit' ? 'Barreira danificada' : `${event.detail?.remaining} invasores restantes`;
            if (activeGameId === 'data-maze') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'level-complete'
                    ? `Labirinto ${event.detail?.level} iniciado`
                    : progressEvent === 'player-hit'
                        ? `${event.detail?.lives} vidas restantes · núcleo restaurado`
                        : progressEvent === 'power-node'
                            ? 'Nó de energia ativo · drones vulneráveis'
                            : progressEvent === 'drone-captured'
                                ? 'Drone capturado · combo aumentado'
                                : progressEvent === 'bonus'
                                    ? 'Pacote de dados bônus coletado'
                                    : `${event.detail?.remaining} dados restantes`;
            }
            if (activeGameId === 'raster-rally') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'checkpoint'
                    ? `Checkpoint ${event.detail?.checkpoint ?? 0}/4 · +5 segundos`
                    : progressEvent === 'lap-complete'
                        ? `Volta ${event.detail?.lap ?? 1} iniciada`
                        : progressEvent === 'track-complete'
                            ? `${event.detail?.trackTitle ?? 'Nova pista'} liberada`
                            : progressEvent === 'collision'
                                ? `Colisão · integridade ${Math.max(0, 100 - Number(event.detail?.damage ?? 0))}%`
                                : progressEvent === 'overtake'
                                    ? `Ultrapassagem ${event.detail?.overtakes ?? 0}`
                                    : `${event.detail?.speed ?? 0} km/h · ${event.detail?.time ?? 0}s`;
            }
            if (activeGameId === 'room-quest') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'room-changed'
                    ? `${event.detail?.roomTitle ?? 'Nova sala'} · ${event.detail?.visited ?? 1}/8 visitadas`
                    : progressEvent === 'item-collected'
                        ? `Item coletado · inventário ${event.detail?.inventory ?? 0}`
                        : progressEvent === 'terminal-activated'
                            ? `Terminal ativado · ${event.detail?.flags ?? 0} condições globais`
                            : progressEvent === 'door-locked'
                                ? String(event.detail?.message ?? 'Passagem bloqueada')
                                : progressEvent === 'hazard-hit'
                                    ? `Zona instável · energia ${event.detail?.energy ?? 0}`
                                    : progressEvent === 'core-secured'
                                        ? 'Núcleo de Memória protegido · retorne ao Observatório'
                                        : String(event.detail?.message ?? 'Complexo atualizado');
            }
            if (activeGameId === 'state-quest-rpg') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'quest-started'
                    ? 'Nova missão iniciada'
                    : progressEvent === 'quest-ready'
                        ? 'Objetivo concluído · retorne ao responsável'
                        : progressEvent === 'quest-completed'
                            ? `Missão concluída · nível ${event.detail?.level ?? 1}`
                            : progressEvent === 'combat-started'
                                ? 'Combate por turnos iniciado'
                                : progressEvent === 'enemy-defeated'
                                    ? `Inimigo neutralizado · nível ${event.detail?.level ?? 1}`
                                    : progressEvent === 'level-up'
                                        ? `Nível ${event.detail?.level ?? 1} alcançado`
                                        : progressEvent === 'player-defeated'
                                            ? 'Herói restaurado na Vila de Itera'
                                            : progressEvent === 'map-changed'
                                                ? String(event.detail?.mapTitle ?? 'Novo mapa')
                                                : progressEvent === 'door-locked'
                                                    ? 'Passagem bloqueada por uma condição de missão'
                                                    : String(event.detail?.message ?? 'Estado da jornada atualizado');
            }
            if (activeGameId === 'polygon-sector-94') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'core-collected'
                    ? `${event.detail?.cores ?? 0}/3 núcleos sincronizados`
                    : progressEvent === 'checkpoint'
                        ? 'Checkpoint poligonal registrado'
                        : progressEvent === 'camera-changed'
                            ? `Câmera: ${event.detail?.camera ?? '3D'}`
                            : progressEvent === 'material-changed'
                                ? `Material: ${event.detail?.material ?? 'flat'}`
                                : progressEvent === 'life-lost'
                                    ? `${event.detail?.lives ?? 0} vidas restantes`
                                    : 'Pipeline 3D atualizado';
            }
            if (activeGameId === 'camera-evolution') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'camera-changed'
                    ? `Câmera: ${event.detail?.camera ?? '3D'} · ${event.detail?.cameras ?? 1}/6 estudadas`
                    : progressEvent === 'fov-changed'
                        ? `Campo de visão: ${event.detail?.fov ?? 60}°`
                        : progressEvent === 'core-collected'
                            ? `${event.detail?.cores ?? 0}/3 lentes coletadas`
                            : progressEvent === 'checkpoint'
                                ? 'Checkpoint de enquadramento registrado'
                                : progressEvent === 'life-lost'
                                    ? `${event.detail?.lives ?? 0} vidas restantes`
                                    : 'Sistema de câmera atualizado';
            }
            if (activeGameId === 'bit-bridge-16') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'generation-changed'
                    ? `Apresentação ${event.detail?.generation ?? '8-bit'} · simulação preservada`
                    : progressEvent === 'fragment-collected'
                        ? `Fragmento ${event.detail?.fragments ?? 0}/8 coletado`
                        : progressEvent === 'checkpoint'
                            ? 'Checkpoint geracional registrado'
                            : progressEvent === 'life-lost'
                                ? `${event.detail?.lives ?? 0} vidas restantes · retorno ao checkpoint`
                                : progressEvent === 'zone-changed'
                                    ? `Zona ${event.detail?.zone ?? 1}/4 alcançada`
                                    : 'Ponte técnica atualizada';
            }
            if (activeGameId === 'raycast-corridors') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'key-collected'
                    ? `Chave ${event.detail?.keys ?? 0}/2 coletada`
                    : progressEvent === 'door-opened'
                        ? `Porta ${event.detail?.doors ?? 0}/2 aberta`
                        : progressEvent === 'terminal-activated'
                            ? `Terminal ${event.detail?.terminals ?? 0}/3 sincronizado`
                            : progressEvent === 'view-changed'
                                ? `Visão: ${event.detail?.view ?? 'split'}`
                                : progressEvent === 'life-lost'
                                    ? `${event.detail?.lives ?? 0} vidas · retorno ao checkpoint`
                                    : progressEvent === 'exit-unlocked'
                                        ? 'Extração liberada'
                                        : 'Mapa 2.5D atualizado';
            }
            if (activeGameId === 'trap-lab') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'level-complete'
                    ? `Fase ${event.detail?.level} iniciada`
                    : progressEvent === 'life-lost'
                        ? `${event.detail?.lives} vidas restantes · retorno ao checkpoint`
                        : progressEvent === 'checkpoint'
                            ? 'Checkpoint registrado'
                            : progressEvent === 'sequence-solved'
                                ? 'Sequência correta · portão aberto'
                                : progressEvent === 'sequence-failed'
                                    ? 'Sequência incorreta · revise o editor'
                                    : progressEvent === 'collectible'
                                        ? 'Fragmento lógico coletado'
                                        : 'Circuito atualizado';
            }
            if (activeGameId === 'block-reactor') {
                const progressEvent = event.detail?.event;
                query('#game-state').textContent = progressEvent === 'level-complete'
                    ? `Fase ${event.detail?.level} preparada`
                    : progressEvent === 'life-lost'
                        ? `${event.detail?.lives} vidas restantes · lance novamente`
                        : progressEvent === 'power-up-collected'
                            ? 'Power-up ativado'
                            : `${event.detail?.remaining} blocos restantes`;
            }
        }
        if (event.type === 'pause-changed')
            query('#game-state').textContent = event.detail?.paused ? 'Pausado · pressione P' : 'Em jogo';
        if (event.type === 'finished') {
            if (activeGameId === 'puzzle-forge') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Puzzle resolvido!' : 'Sequência interrompida';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.moves ?? 0} movimentos · ${event.detail?.mistakes ?? 0} erros · modo ${event.detail?.mode ?? 'puzzle'}.`;
            }
            else if (activeGameId === 'board-arena') {
                const winner = event.detail?.winner;
                query('#result-title').textContent = winner === 'player' ? 'Vitória estratégica!' : winner === 'draw' ? 'Empate no tabuleiro' : 'A CPU venceu esta rodada';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.moves ?? 0} jogadas · capturas ${event.detail?.playerCaptures ?? 0} × ${event.detail?.cpuCaptures ?? 0}.`;
            }
            else if (activeGameId === 'vector-tennis') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Vitória!' : 'A CPU venceu desta vez';
                query('#result-summary').textContent = `Placar ${event.detail?.playerScore ?? 0} × ${event.detail?.cpuScore ?? 0} · maior troca: ${event.detail?.longestRally ?? 0} rebatidas.`;
            }
            else if (activeGameId === 'space-blocks') {
                query('#result-title').textContent = 'A grade chegou ao limite';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.lines ?? 0} linhas · nível ${event.detail?.level ?? 1}.`;
            }
            else if (activeGameId === 'block-reactor') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? (event.detail?.custom ? 'Fase personalizada concluída!' : 'Reator estabilizado!') : 'O reator venceu esta sessão';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · fase ${event.detail?.level ?? 1} · melhor sequência: ${event.detail?.bestCombo ?? 0}.`;
            }
            else if (activeGameId === 'data-maze') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Rede de dados estabilizada!' : 'Os drones bloquearam o núcleo';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · labirinto ${event.detail?.level ?? 1} · ${event.detail?.lives ?? 0} vidas restantes.`;
            }
            else if (activeGameId === 'raster-rally') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Campeonato Raster concluído!' : 'A corrida foi encerrada';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · pista ${event.detail?.track ?? 1}/3 · ${event.detail?.overtakes ?? 0} ultrapassagens · integridade ${Math.max(0, 100 - Number(event.detail?.damage ?? 0))}%.`;
            }
            else if (activeGameId === 'state-quest-rpg') {
                const ending = event.detail?.ending === 'reset' ? 'Novo Ciclo' : 'Memória Preservada';
                query('#result-title').textContent = `State Quest concluído · ${ending}`;
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · nível ${event.detail?.level ?? 1} · ${event.detail?.quests ?? 3}/3 missões · ${event.detail?.maps ?? 3}/3 mapas · ${event.detail?.steps ?? 0} passos.`;
            }
            else if (activeGameId === 'polygon-sector-94') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Setor Poligonal sincronizado!' : 'A malha encerrou a exploração';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.cores ?? 0}/3 núcleos · ${event.detail?.checkpoints ?? 0}/2 checkpoints · ${event.detail?.elapsed ?? 0}s.`;
            }
            else if (activeGameId === 'camera-evolution') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Laboratório de câmeras concluído!' : 'A sessão de câmera foi encerrada';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.cameras ?? 1}/6 câmeras · FOV ${event.detail?.fov ?? 60}° · ${event.detail?.cores ?? 0}/3 lentes · ${event.detail?.elapsed ?? 0}s.`;
            }
            else if (activeGameId === 'raycast-corridors') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Extração Raycast concluída!' : 'Missão encerrada pelo complexo';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.keys ?? 0}/2 chaves · ${event.detail?.terminals ?? 0}/3 terminais · ${event.detail?.doors ?? 0}/2 portas · ${event.detail?.elapsed ?? 0}s.`;
            }
            else if (activeGameId === 'bit-bridge-16') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Ponte 8→16 Bits estabilizada!' : 'A ponte perdeu estabilidade';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.fragments ?? 0}/8 fragmentos · ${event.detail?.switches ?? 0} alternâncias · ${event.detail?.elapsed ?? 0}s.`;
            }
            else if (activeGameId === 'room-quest') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Memória histórica restaurada!' : 'A energia da expedição terminou';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · ${event.detail?.rooms ?? 1}/8 salas · ${event.detail?.steps ?? 0} passos · energia ${event.detail?.energy ?? 0}.`;
            }
            else if (activeGameId === 'trap-lab') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Circuito concluído!' : 'O laboratório reiniciou a sessão';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · fase ${event.detail?.level ?? 1} · ${event.detail?.deaths ?? 0} reinícios.`;
            }
            else if (activeGameId === 'orbital-sentinel') {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Estação protegida!' : 'A formação alcançou a estação';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · onda ${event.detail?.wave ?? 1} · ${event.detail?.lives ?? 0} vidas restantes.`;
            }
            else {
                const won = event.detail?.winner === 'player';
                query('#result-title').textContent = won ? 'Missão concluída!' : 'A frota foi perdida';
                query('#result-summary').textContent = `${event.detail?.score ?? 0} pontos · onda ${event.detail?.wave ?? 1} · ${event.detail?.lives ?? 0} vidas restantes.`;
            }
            query('#game-result').hidden = false;
            query('#game-state').textContent = 'Sessão concluída';
        }
    }
    function startMatch() {
        query('#game-onboarding').hidden = true;
        query('#game-result').hidden = true;
        runtime?.start();
        if (window.matchMedia('(max-width: 700px)').matches && !document.fullscreenElement)
            void enterGameFullscreen();
    }
    async function closeGame() {
        openSequence += 1;
        if (runtime) {
            await storage.saveGame(runtime.snapshot());
            runtime.dispose();
            runtime = undefined;
        }
        stopRuntimeMonitors();
        if (document.fullscreenElement)
            await document.exitFullscreen().catch(() => undefined);
        gameDialog.close();
        document.body.classList.remove('game-open');
    }
    function dispatch(action, active) {
        runtime?.dispatch({ action, active, value: active ? 1 : 0, timestamp: performance.now() });
    }
    function startHudUpdates() {
        if (hudTimer)
            window.clearInterval(hudTimer);
        hudTimer = window.setInterval(() => { if (runtime)
            updateHud(runtime.snapshot()); }, 100);
    }
    function updateHud(snapshot) {
        if (activeGameId === 'puzzle-forge') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.moves ?? 0, state?.mistakes ?? 0);
        }
        else if (activeGameId === 'board-arena') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.moveCount ?? 0, state?.playerCaptures ?? 0);
        }
        else if (activeGameId === 'space-blocks') {
            const state = snapshot?.payload;
            setHud(state?.score ?? 0, state?.lines ?? 0, state?.level ?? 1);
        }
        else if (activeGameId === 'vector-fleet') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 3, state?.wave ?? 1);
        }
        else if (activeGameId === 'block-reactor') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 3, state?.level ?? 1);
        }
        else if (activeGameId === 'orbital-sentinel') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 3, state?.wave ?? 1);
        }
        else if (activeGameId === 'data-maze') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 4, state?.level ?? 1);
        }
        else if (activeGameId === 'raster-rally') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, Math.ceil((state?.remainingMs ?? 0) / 1000), (state?.trackIndex ?? 0) + 1);
        }
        else if (activeGameId === 'polygon-sector-94') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 4, state?.collectedCores?.length ?? 0);
        }
        else if (activeGameId === 'camera-evolution') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 4, state?.visitedCameras?.length ?? 1);
        }
        else if (activeGameId === 'voxelcraft-ds') {
            const state = snapshot?.payload;
            setHud(Number(state?.xp ?? snapshot?.score ?? 0), Number(state?.chunks ?? 0), Number(state?.edits ?? 0));
        }
        else if (activeGameId === 'raycast-corridors') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 4, state?.activeTerminals?.length ?? 0);
        }
        else if (activeGameId === 'bit-bridge-16') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 4, state?.fragments?.length ?? 0);
        }
        else if (activeGameId === 'state-quest-rpg') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.player?.hp ?? 0, state?.player?.level ?? 1);
        }
        else if (activeGameId === 'room-quest') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.energy ?? 5, state?.visitedRooms?.length ?? 1);
        }
        else if (activeGameId === 'trap-lab') {
            const state = snapshot?.payload;
            setHud(state?.score ?? snapshot?.score ?? 0, state?.lives ?? 4, state?.level ?? 1);
        }
        else {
            const state = snapshot?.payload;
            setHud(state?.playerScore ?? snapshot?.score ?? 0, state?.cpuScore ?? 0, 5);
        }
    }
    function setHud(first, second, third) {
        query('#hud-value-1').textContent = String(first);
        query('#hud-value-2').textContent = String(second);
        query('#hud-value-3').textContent = String(third);
    }
    function startFpsMonitor() {
        if (fpsAnimation)
            window.cancelAnimationFrame(fpsAnimation);
        let frames = 0;
        let sampleStarted = performance.now();
        const tick = (now) => {
            frames += 1;
            if (now - sampleStarted >= 500) {
                query('#fps-value').textContent = String(Math.round((frames * 1000) / (now - sampleStarted)));
                frames = 0;
                sampleStarted = now;
            }
            if (gameDialog.open)
                fpsAnimation = window.requestAnimationFrame(tick);
        };
        fpsAnimation = window.requestAnimationFrame(tick);
    }
    function stopRuntimeMonitors() {
        if (hudTimer)
            window.clearInterval(hudTimer);
        if (fpsAnimation)
            window.cancelAnimationFrame(fpsAnimation);
        hudTimer = undefined;
        fpsAnimation = undefined;
    }
    function showGamePanel(panel) {
        document.querySelectorAll('.game-tabs button').forEach((button) => {
            const active = button.dataset.panel === panel;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('.game-panel').forEach((section) => { section.hidden = section.id !== `panel-${panel}`; });
        if (panel !== 'play' && runtime?.state === 'playing')
            dispatch('pause', true);
        if (panel === 'play' && !runtime)
            void mountActiveGame(true);
    }
    async function enterGameFullscreen() {
        if (!document.fullscreenElement && gameDialog.requestFullscreen)
            await gameDialog.requestFullscreen().catch(() => undefined);
    }
    async function toggleGameFullscreen() {
        showGamePanel('play');
        if (document.fullscreenElement)
            await document.exitFullscreen().catch(() => undefined);
        else
            await enterGameFullscreen();
    }
    function resolvedGraphicsMode() {
        if (settings.graphicsMode !== 'automatico')
            return settings.graphicsMode;
        const stored = sessionStorage.getItem('fliperama-ds-recommended-mode') ?? sessionStorage.getItem('arcade-ds-recommended-mode');
        return stored ?? 'medio';
    }
    async function updateSettings(next) {
        settings = next;
        document.documentElement.dataset.motion = settings.reducedMotion ? 'reduced' : 'full';
        query('#active-quality').textContent = graphicsLabels[settings.graphicsMode];
        query('#quality-value').textContent = graphicsLabels[resolvedGraphicsMode()].toUpperCase();
        query('#performance-overlay').hidden = !settings.showPerformance;
        await storage.saveSettings(settings);
    }
    function syncSettingsForm() {
        query('#graphics-mode').value = settings.graphicsMode;
        query('#reduced-motion').checked = settings.reducedMotion;
        query('#muted').checked = settings.muted;
        query('#show-performance').checked = settings.showPerformance;
        void updateSettings(settings);
    }
    async function benchmark() {
        const button = query('#run-benchmark');
        button.disabled = true;
        button.textContent = 'Testando…';
        query('#benchmark-status').innerHTML = '<strong>Medindo estabilidade</strong><span>Mantenha esta aba visível por um instante.</span>';
        const result = await (0, device_benchmark_1.runDeviceBenchmark)();
        showBenchmark(result);
        sessionStorage.setItem('fliperama-ds-recommended-mode', result.recommendedMode);
        button.disabled = false;
        button.textContent = 'Testar novamente';
    }
    function showBenchmark(result) {
        const target = query('#benchmark-result');
        target.hidden = false;
        target.innerHTML = `<div><span>Recomendação</span><strong>${graphicsLabels[result.recommendedMode]}</strong></div><div><span>Quadros observados</span><strong>${Math.round(result.frameScore)} FPS</strong></div><div><span>Processadores lógicos</span><strong>${result.logicalProcessors}</strong></div><div><span>WebGL 2</span><strong>${result.webgl2 ? 'Disponível' : 'Indisponível'}</strong></div>`;
        query('#benchmark-status').innerHTML = '<strong>Teste concluído</strong><span>O modo Automático usará esta recomendação nesta sessão.</span>';
        query('#quality-value').textContent = graphicsLabels[resolvedGraphicsMode()].toUpperCase();
    }
    function bindTouchControls() {
        query('#touch-controls').querySelectorAll('button').forEach((button) => {
            const action = button.dataset.action;
            button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); dispatch(action, true); });
            ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => button.addEventListener(name, () => dispatch(action, false)));
        });
    }
    document.querySelectorAll('.era').forEach((button) => button.addEventListener('click', () => setEraFilter(button.dataset.era)));
    clearFilter.addEventListener('click', () => { catalogFilters.genre = 'todos'; catalogFilters.technology = 'todos'; catalogFilters.company = 'todos'; catalogFilters.query = ''; catalogFilters.quick = 'todos'; setEraFilter(); });
    catalogSearch.addEventListener('input', () => { catalogFilters.query = catalogSearch.value; applyCatalogFilters(); });
    genreFilter.addEventListener('change', () => { catalogFilters.genre = genreFilter.value; applyCatalogFilters(); });
    technologyFilter.addEventListener('change', () => { catalogFilters.technology = technologyFilter.value; applyCatalogFilters(); });
    companyFilter.addEventListener('change', () => { catalogFilters.company = companyFilter.value; applyCatalogFilters(); });
    document.querySelectorAll('.quick-filter').forEach((button) => button.addEventListener('click', () => { catalogFilters.quick = button.dataset.quickFilter; applyCatalogFilters(); }));
    settingsToggle.addEventListener('click', () => { settingsPanel.hidden = !settingsPanel.hidden; settingsToggle.setAttribute('aria-expanded', String(!settingsPanel.hidden)); });
    versionToggle.addEventListener('click', () => { void refreshVersionDialog(); versionDialog.showModal(); });
    query('#settings-close').addEventListener('click', () => { settingsPanel.hidden = true; settingsToggle.setAttribute('aria-expanded', 'false'); });
    query('#graphics-mode').addEventListener('change', (event) => void updateSettings({ ...settings, graphicsMode: event.currentTarget.value }));
    ['reduced-motion', 'muted', 'show-performance'].forEach((id) => query(`#${id}`).addEventListener('change', (event) => {
        const property = id === 'reduced-motion' ? 'reducedMotion' : id === 'show-performance' ? 'showPerformance' : 'muted';
        void updateSettings({ ...settings, [property]: event.currentTarget.checked });
    }));
    query('#version-close').addEventListener('click', () => versionDialog.close());
    query('#version-dismiss').addEventListener('click', () => versionDialog.close());
    query('#version-refresh').addEventListener('click', () => void refreshVersionDialog());
    versionDialog.addEventListener('cancel', (event) => { event.preventDefault(); versionDialog.close(); });
    query('#details-close').addEventListener('click', () => detailsDialog.close());
    query('#details-dismiss').addEventListener('click', () => detailsDialog.close());
    query('#details-play').addEventListener('click', (event) => void openGame(event.currentTarget.dataset.gameId ?? ''));
    detailsDialog.addEventListener('cancel', (event) => { event.preventDefault(); detailsDialog.close(); });
    query('#run-benchmark').addEventListener('click', () => void benchmark());
    query('#game-close').addEventListener('click', () => void closeGame());
    query('#history-shortcut').addEventListener('click', () => showGamePanel('history'));
    query('#fullscreen-toggle').addEventListener('click', () => void toggleGameFullscreen());
    query('#start-match').addEventListener('click', startMatch);
    query('#rematch').addEventListener('click', startMatch);
    query('#game-option').addEventListener('change', (event) => {
        selectedOptions[activeGameId] = event.currentTarget.value;
        if (activeGameId === 'block-reactor' || activeGameId === 'puzzle-forge')
            activeCustomLayout = undefined;
        query('#start-match').textContent = 'Começar partida';
        void mountActiveGame(false);
    });
    document.querySelectorAll('.game-tabs button').forEach((button) => button.addEventListener('click', () => showGamePanel(button.dataset.panel ?? 'play')));
    gameDialog.addEventListener('cancel', (event) => { event.preventDefault(); void closeGame(); });
    window.addEventListener('keydown', (event) => {
        if (!gameDialog.open || query('#panel-play').hidden || !query('#game-onboarding').hidden)
            return;
        const action = activeProfile().keyActions[event.code];
        if (!action || (event.repeat && ['primary-action', 'secondary-action', 'pause'].includes(action)))
            return;
        event.preventDefault();
        dispatch(action, true);
    });
    window.addEventListener('keyup', (event) => {
        if (!gameDialog.open || query('#panel-play').hidden || !query('#game-onboarding').hidden)
            return;
        const action = activeProfile().keyActions[event.code];
        if (!action)
            return;
        event.preventDefault();
        dispatch(action, false);
    });
    window.addEventListener('blur', () => { if (gameDialog.open && runtime?.state === 'playing')
        dispatch('pause', true); });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && runtime) {
            if (runtime.state === 'playing')
                dispatch('pause', true);
            void storage.saveGame(runtime.snapshot());
        }
    });
    document.addEventListener('fullscreenchange', () => {
        query('#fullscreen-toggle').textContent = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia';
    });
    function query(selector) {
        const element = document.querySelector(selector);
        if (!element)
            throw new Error(`Elemento não encontrado: ${selector}`);
        return element;
    }
    configureCatalogFilters();
    renderHighlights();
    renderRoadmap();
    renderMuseumGroup('museum-consoles', museum_hardware_1.CONSOLE_MUSEUM);
    renderMuseumGroup('museum-controllers', museum_hardware_1.CONTROLLER_MUSEUM);
    renderMuseumGroup('museum-sensors', museum_hardware_1.SENSOR_MUSEUM);
    applyCatalogFilters();
    renderMilestones(museum_timeline_1.MUSEUM_TIMELINE);
    void refreshVersionDialog();
    void storage.loadSettings().then((stored) => { settings = stored; syncSettingsForm(); }).catch(() => syncSettingsForm());
    if ('serviceWorker' in navigator && (location.protocol !== 'file:'))
        void navigator.serviceWorker.register('./sw.js');
    
  };
  __modules["data/catalog.json"] = (module, exports) => {
    module.exports = [
      {
        "schemaVersion": 1,
        "id": "vector-tennis",
        "slug": "vector-tennis",
        "title": "Vector Tennis",
        "subtitle": "Trajetória e rebote nos primórdios dos jogos eletrônicos",
        "era": "1950-1969",
        "year": 1958,
        "genre": [
          "esporte",
          "arcade"
        ],
        "technology": [
          "vetores",
          "trajetória",
          "colisão"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "reconstrucao-educacional",
        "historicalReferences": [
          {
            "title": "Tennis for Two",
            "year": 1958,
            "company": "Brookhaven National Laboratory",
            "platform": "Computador analógico e osciloscópio",
            "originalTechnology": "Circuitos analógicos e tela vetorial",
            "note": "Referência histórica; a implementação DS será autoral."
          }
        ],
        "educationalConcepts": [
          "coordenadas",
          "velocidade",
          "gravidade",
          "colisão"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 700,
        "releasePhase": 2
      },
      {
        "schemaVersion": 1,
        "id": "space-blocks",
        "slug": "space-blocks",
        "title": "Space Blocks",
        "subtitle": "Puzzle espacial de encaixe, rotação e planejamento",
        "era": "1980-1989",
        "year": 1984,
        "genre": [
          "puzzle",
          "espacial"
        ],
        "technology": [
          "grade",
          "matrizes",
          "rotação"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Tetris",
            "year": 1984,
            "company": "Academia de Ciências da União Soviética",
            "platform": "Electronika 60",
            "originalTechnology": "Pascal em terminal de texto",
            "note": "Referência histórica do gênero; identidade, peças e apresentação serão próprias."
          }
        ],
        "educationalConcepts": [
          "matrizes",
          "rotação",
          "detecção de linhas",
          "máquina de estados"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "move-down",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 900,
        "releasePhase": 2
      },
      {
        "schemaVersion": 1,
        "id": "vector-fleet",
        "slug": "vector-fleet",
        "title": "Vector Fleet",
        "subtitle": "Nave vetorial, inércia e sobrevivência espacial",
        "era": "1970-1979",
        "year": 1979,
        "genre": [
          "nave",
          "shooter"
        ],
        "technology": [
          "vetores",
          "inércia",
          "ondas"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Asteroids",
            "year": 1979,
            "company": "Atari",
            "platform": "Arcade",
            "originalTechnology": "Display vetorial e hardware dedicado",
            "note": "Referência mecânica e histórica, sem reutilização de assets ou código."
          }
        ],
        "educationalConcepts": [
          "vetores",
          "ângulos",
          "inércia",
          "fragmentação"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "move-up",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 950,
        "releasePhase": 2
      },
      {
        "schemaVersion": 1,
        "id": "block-reactor",
        "slug": "block-reactor",
        "title": "Reator de Blocos",
        "subtitle": "Rebatedor arcade com blocos especiais, power-ups e editor",
        "era": "1970-1979",
        "year": 1976,
        "genre": [
          "arcade",
          "rebatedor"
        ],
        "technology": [
          "colisão",
          "vetores",
          "dados de fase"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "reconstrucao-educacional",
        "historicalReferences": [
          {
            "title": "Breakout",
            "year": 1976,
            "company": "Atari",
            "platform": "Arcade",
            "originalTechnology": "Circuitos lógicos dedicados e tela raster",
            "note": "Referência histórica do gênero; fases, código, áudio, arte e identidade da versão DS são autorais."
          }
        ],
        "educationalConcepts": [
          "colisão AABB",
          "vetores",
          "máquina de estados",
          "editor de dados"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1100,
        "releasePhase": 3
      },
      {
        "schemaVersion": 1,
        "id": "orbital-sentinel",
        "slug": "orbital-sentinel",
        "title": "Sentinela Orbital",
        "subtitle": "Formações invasoras, barreiras destrutíveis e ondas progressivas",
        "era": "1970-1979",
        "year": 1978,
        "genre": [
          "tiro",
          "defesa",
          "arcade"
        ],
        "technology": [
          "formações",
          "projéteis",
          "barreiras"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "reconstrucao-educacional",
        "historicalReferences": [
          {
            "title": "Space Invaders",
            "year": 1978,
            "company": "Taito / Midway",
            "platform": "Arcade; posteriormente Atari 2600 e outras plataformas",
            "originalTechnology": "Intel 8080, framebuffer raster e linguagem de montagem",
            "note": "Referência histórica; formação, símbolos, áudio, arte, código e identidade do Fliperama DS são autorais."
          }
        ],
        "educationalConcepts": [
          "formações",
          "colisão de projéteis",
          "barreiras destrutíveis",
          "dificuldade progressiva"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1100,
        "releasePhase": 3.2
      },
      {
        "schemaVersion": 1,
        "id": "trap-lab",
        "slug": "trap-lab",
        "title": "Trap Lab",
        "subtitle": "Plataforma de precisão com checkpoints e lógica programável",
        "era": "1980-1989",
        "year": 1985,
        "genre": [
          "plataforma",
          "trap"
        ],
        "technology": [
          "tilemap 42 × 14",
          "física por subpassos",
          "eventos e checkpoints"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Jogos de plataforma de 8 bits",
            "year": 1985,
            "company": "Diversos estúdios",
            "platform": "Arcades e consoles de 8 bits",
            "originalTechnology": "Sprites, tilemaps e rolagem lateral",
            "note": "Referência histórica do gênero; personagem, fases, armadilhas, arte, áudio e código são autorais."
          }
        ],
        "educationalConcepts": [
          "eventos",
          "condições",
          "temporizadores",
          "design de fases"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "jump",
          "interact",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1400,
        "releasePhase": 3.3
      },
      {
        "schemaVersion": 1,
        "id": "cyber-arena-360",
        "slug": "cyber-arena-360",
        "title": "Cyber Arena 360",
        "subtitle": "Arena tecnológica 3D com objetivos educacionais",
        "era": "2000-2009",
        "year": 2004,
        "genre": [
          "fps",
          "arena",
          "tático"
        ],
        "technology": [
          "3d",
          "bots",
          "física"
        ],
        "runtime": "three",
        "status": "planejado",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Evolução dos FPS táticos",
            "year": 2004,
            "company": "Diversos estúdios",
            "platform": "Computadores pessoais",
            "originalTechnology": "Engines 3D, rede e IA baseada em navegação",
            "note": "Referência de gênero; mapas, personagens e objetivos serão originais e educacionais."
          }
        ],
        "educationalConcepts": [
          "vetores 3D",
          "raycasting",
          "máquina de estados",
          "navegação"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "look-x",
          "look-y",
          "primary-action",
          "interact",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 12000,
        "releasePhase": 6
      },
      {
        "schemaVersion": 1,
        "id": "polygon-sector-94",
        "slug": "polygon-sector-94",
        "title": "Setor Poligonal 94",
        "subtitle": "Primeira arena 3D real com polígonos, câmeras e materiais comparáveis",
        "era": "1990-1999",
        "year": 1994,
        "genre": [
          "exploração",
          "plataforma 3D",
          "laboratório gráfico"
        ],
        "technology": [
          "WebGL",
          "matrizes 3D",
          "shaders",
          "malhas low-poly",
          "câmeras"
        ],
        "runtime": "webgl",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "PlayStation e a popularização doméstica do 3D poligonal",
            "year": 1994,
            "company": "Sony Computer Entertainment",
            "platform": "PlayStation",
            "originalTechnology": "CPU de 32 bits, GPU dedicada, polígonos texturizados e CD-ROM",
            "note": "Referência histórica da transição; arena, missão, personagem, materiais, shaders e código são autorais."
          },
          {
            "title": "Evolução dos mundos totalmente 3D",
            "year": 1996,
            "company": "Diversos estúdios de PC e consoles",
            "platform": "PC, PlayStation, Nintendo 64, Saturn e arcades",
            "originalTechnology": "Malhas poligonais, câmeras 3D, texturas, lightmaps e aceleração gráfica",
            "note": "Contexto técnico complementar, sem reprodução de mapas, personagens, armas ou código comercial."
          }
        ],
        "educationalConcepts": [
          "vértices e triângulos",
          "matrizes modelo-visão-projeção",
          "câmeras 3D",
          "shaders e materiais",
          "colisão por volumes"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "jump",
          "primary-action",
          "secondary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 2500,
        "releasePhase": 5.2
      },
      {
        "schemaVersion": 1,
        "id": "camera-evolution",
        "slug": "camera-evolution",
        "title": "Câmeras em Evolução",
        "subtitle": "Seis sistemas de câmera e três campos de visão sobre a mesma arena 3D",
        "era": "1990-1999",
        "year": 1996,
        "genre": [
          "exploração 3D",
          "laboratório de câmera",
          "level design"
        ],
        "technology": [
          "WebGL",
          "matrizes de visão",
          "projeção perspectiva",
          "camera rigs",
          "campo de visão"
        ],
        "runtime": "webgl",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Consolidação das câmeras em mundos 3D",
            "year": 1996,
            "company": "Diversos estúdios de consoles e PC",
            "platform": "PlayStation, Nintendo 64, Saturn e PC",
            "originalTechnology": "Câmeras fixas, primeira e terceira pessoa, matrizes 3D e controle analógico",
            "note": "Contexto histórico; arena, missão, câmeras, arte, áudio, shaders e código são autorais."
          },
          {
            "title": "Evolução do enquadramento interativo",
            "year": 1998,
            "company": "Diversos estúdios",
            "platform": "Consoles de 32/64 bits e PC",
            "originalTechnology": "Câmeras de perseguição, colisão, zonas mortas e campos de visão específicos por gênero",
            "note": "Comparação técnica, sem reutilizar personagens, mapas, interfaces ou recursos comerciais."
          }
        ],
        "educationalConcepts": [
          "matriz de visão",
          "câmera fixa por setores",
          "primeira e terceira pessoa",
          "perseguição e órbita",
          "campo de visão e level design"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "jump",
          "primary-action",
          "secondary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 2600,
        "releasePhase": 5.3
      },
      {
        "schemaVersion": 1,
        "id": "frontline-protocol-360",
        "slug": "frontline-protocol-360",
        "title": "Protocolo de Fronteira 360",
        "subtitle": "Campanha FPS 3D autoral com objetivos, aliados e espaços conectados",
        "era": "2000-2009",
        "year": 2003,
        "genre": [
          "fps",
          "missão",
          "aventura"
        ],
        "technology": [
          "3d",
          "ia",
          "narrativa"
        ],
        "runtime": "three",
        "status": "planejado",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Evolução das campanhas FPS",
            "year": 2003,
            "company": "Diversos estúdios",
            "platform": "PC, PlayStation e Xbox",
            "originalTechnology": "Engines 3D, eventos roteirizados, IA e áudio espacial",
            "note": "Referência de gênero; história, facções, cenários, equipamentos e missões serão originais e não realistas."
          }
        ],
        "educationalConcepts": [
          "máquinas de estado",
          "objetivos",
          "navegação 3D",
          "áudio espacial"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "look-x",
          "look-y",
          "primary-action",
          "interact",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 18000,
        "releasePhase": 7
      },
      {
        "schemaVersion": 1,
        "id": "urban-mission-360",
        "slug": "urban-mission-360",
        "title": "Cidade Missão 360",
        "subtitle": "Distrito 3D explorável com veículos, personagens e missões educacionais",
        "era": "2000-2009",
        "year": 2001,
        "genre": [
          "ação",
          "aventura",
          "mundo aberto"
        ],
        "technology": [
          "streaming",
          "tráfego",
          "missões"
        ],
        "runtime": "three",
        "status": "planejado",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Evolução dos mundos urbanos 3D",
            "year": 2001,
            "company": "Diversos estúdios",
            "platform": "PlayStation 2, PC e Xbox",
            "originalTechnology": "Streaming de cenário, IA de tráfego e sistemas de missão",
            "note": "Referência de gênero; cidade, narrativa, veículos, personagens e atividades serão integralmente autorais e educacionais."
          }
        ],
        "educationalConcepts": [
          "streaming por setores",
          "grafos de missão",
          "ia de tráfego",
          "persistência"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "look-x",
          "look-y",
          "interact",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 22000,
        "releasePhase": 8
      },
      {
        "schemaVersion": 1,
        "id": "nitro-horizon-360",
        "slug": "nitro-horizon-360",
        "title": "Nitro Horizon 360",
        "subtitle": "Corrida 3D arcade com pistas, nitro, saltos e física escalável",
        "era": "2010-2019",
        "year": 2013,
        "genre": [
          "corrida",
          "arcade",
          "missão"
        ],
        "technology": [
          "veículos",
          "física",
          "lod"
        ],
        "runtime": "three",
        "status": "planejado",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Evolução das corridas 3D em dispositivos móveis",
            "year": 2013,
            "company": "Diversos estúdios",
            "platform": "iOS, Android, Windows e consoles",
            "originalTechnology": "Renderização 3D móvel, física arcade, eventos e conteúdo sob demanda",
            "note": "Referência de gênero; carros, pistas, marcas, sons, interface e física serão autorais."
          }
        ],
        "educationalConcepts": [
          "física veicular",
          "splines",
          "câmera de perseguição",
          "níveis de detalhe"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "move-up",
          "move-down",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 20000,
        "releasePhase": 9
      },
      {
        "schemaVersion": 1,
        "id": "nexus-reality-2026",
        "slug": "nexus-reality-2026",
        "title": "Nexus Reality 2026",
        "subtitle": "Arena contemporânea para comparar WebGL, WebGPU, VR e resolução dinâmica",
        "era": "2020-atual",
        "year": 2026,
        "genre": [
          "missão",
          "aventura",
          "imersivo"
        ],
        "technology": [
          "webgpu",
          "webxr",
          "upscaling"
        ],
        "runtime": "three",
        "status": "planejado",
        "fidelity": "referencia-historica",
        "historicalReferences": [
          {
            "title": "Ecossistema contemporâneo de jogos em 2026",
            "year": 2026,
            "company": "Ecossistema global de hardware, engines e estúdios",
            "platform": "PC, PlayStation 5, Xbox Series, Nintendo Switch 2, mobile, cloud e computação espacial",
            "originalTechnology": "Ray tracing, upscaling, realidade espacial, cross-play e distribuição contínua",
            "note": "Laboratório técnico autoral para comparar recursos modernos sem depender de uma franquia comercial."
          }
        ],
        "educationalConcepts": [
          "resolução dinâmica",
          "gpu",
          "realidade espacial",
          "degradação graciosa"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "look-x",
          "look-y",
          "interact",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 24000,
        "releasePhase": 10
      },
      {
        "schemaVersion": 1,
        "id": "data-maze",
        "slug": "data-maze",
        "title": "Labirinto de Dados",
        "subtitle": "Rotas, coleta e inteligência artificial em uma grade de perseguição",
        "era": "1980-1989",
        "year": 1980,
        "genre": [
          "labirinto",
          "estratégia",
          "arcade"
        ],
        "technology": [
          "tilemap",
          "busca de rota",
          "máquina de estados"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "reconstrucao-educacional",
        "historicalReferences": [
          {
            "title": "PAC-MAN",
            "year": 1980,
            "company": "Namco",
            "platform": "Gabinete arcade",
            "originalTechnology": "Hardware arcade de 8 bits, sprites e tilemap",
            "note": "Referência histórica do gênero; personagens, mapas, regras visuais, áudio e código do laboratório são próprios."
          }
        ],
        "educationalConcepts": [
          "grade e coordenadas",
          "busca em largura",
          "máquinas de estado",
          "estratégias de perseguição"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 850,
        "releasePhase": 4.1
      },
      {
        "schemaVersion": 1,
        "id": "room-quest",
        "slug": "room-quest",
        "title": "Aventura de Salas",
        "subtitle": "Exploração por telas, inventário e condições de passagem",
        "era": "1980-1989",
        "year": 1981,
        "genre": [
          "aventura",
          "exploração"
        ],
        "technology": [
          "salas conectadas",
          "inventário",
          "flags"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Adventure",
            "year": 1980,
            "company": "Atari",
            "platform": "Atari 2600",
            "originalTechnology": "Cartucho, sprites e salas conectadas",
            "note": "Referência conceitual para uma aventura autoral sem reutilização de mapas, personagens ou código."
          }
        ],
        "educationalConcepts": [
          "grafos",
          "inventário",
          "condições",
          "persistência"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "interact",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 950,
        "releasePhase": 4.2
      },
      {
        "schemaVersion": 1,
        "id": "raster-rally",
        "slug": "raster-rally",
        "title": "Raster Rally",
        "subtitle": "Corrida pseudo-3D com linhas, curvas e sprites escalados",
        "era": "1980-1989",
        "year": 1982,
        "genre": [
          "corrida",
          "arcade"
        ],
        "technology": [
          "pseudo-3D",
          "segmentos projetados",
          "linhas rasterizadas",
          "sprites escalados"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Pole Position",
            "year": 1982,
            "company": "Namco",
            "platform": "Gabinete arcade",
            "originalTechnology": "Sprites escalados e pista raster pseudo-3D",
            "note": "Referência técnica para pistas, veículos e regras totalmente autorais."
          }
        ],
        "educationalConcepts": [
          "perspectiva",
          "interpolação",
          "curvas e elevação",
          "velocidade e aderência",
          "máquina de estados"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "move-up",
          "move-down",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1200,
        "releasePhase": 4.3
      },
      {
        "schemaVersion": 1,
        "id": "state-quest-rpg",
        "slug": "state-quest-rpg",
        "title": "State Quest RPG",
        "subtitle": "Missões, diálogos e progressão controlados por estados",
        "era": "1980-1989",
        "year": 1986,
        "genre": [
          "RPG",
          "missão"
        ],
        "technology": [
          "máquina de estados",
          "diálogos",
          "inventário"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Dragon Quest",
            "year": 1986,
            "company": "Enix",
            "platform": "Famicom",
            "originalTechnology": "Sprites, tilemaps, menus e progressão por estados",
            "note": "Referência histórica de estrutura; mundo, personagens, narrativa, inimigos, arte, áudio e código do State Quest RPG são próprios."
          }
        ],
        "educationalConcepts": [
          "máquina de estados de missões",
          "árvores de diálogo",
          "atributos e experiência",
          "inventário e equipamentos",
          "escolhas persistentes"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "interact",
          "confirm",
          "cancel",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1200,
        "releasePhase": 4.4
      },
      {
        "schemaVersion": 1,
        "id": "bit-bridge-16",
        "slug": "bit-bridge-16",
        "title": "Ponte 8→16 Bits",
        "subtitle": "A mesma simulação em duas gerações de gráficos, animação e áudio",
        "era": "1980-1989",
        "year": 1989,
        "genre": [
          "plataforma",
          "laboratório visual",
          "comparação"
        ],
        "technology": [
          "paletas",
          "paralaxe",
          "sprites",
          "áudio por canais",
          "simulação independente do renderizador"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Mega Drive / transição 16 bits",
            "year": 1988,
            "company": "Sega",
            "platform": "Mega Drive",
            "originalTechnology": "CPU Motorola 68000, vídeo por tiles e sprites, paleta ampliada e áudio sintetizado",
            "note": "Referência histórica da transição; personagem, mundo, regras, arte, áudio e código do laboratório são próprios."
          }
        ],
        "educationalConcepts": [
          "profundidade de cor",
          "sprites e animação",
          "paralaxe",
          "canais de áudio",
          "separação entre lógica e apresentação"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-left",
          "move-right",
          "jump",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1200,
        "releasePhase": 4.5
      },
      {
        "schemaVersion": 1,
        "id": "raycast-corridors",
        "slug": "raycast-corridors",
        "title": "Corredores Raycast",
        "subtitle": "Mapa 2D transformado em missão 2.5D em primeira pessoa",
        "era": "1990-1999",
        "year": 1992,
        "genre": [
          "exploração",
          "primeira pessoa",
          "labirinto"
        ],
        "technology": [
          "raycasting DDA",
          "projeção por colunas",
          "mapa em grade",
          "texturas procedurais"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Evolução dos jogos com raycasting",
            "year": 1992,
            "company": "Diversos estúdios",
            "platform": "Computadores pessoais com DOS",
            "originalTechnology": "Mapas 2D em grade, DDA, projeção por colunas e sprites 2D em perspectiva",
            "note": "Referência técnica da transição 2D para 2.5D; mapa, missão, arte, áudio, interface e código são autorais."
          }
        ],
        "educationalConcepts": [
          "DDA",
          "campo de visão",
          "correção olho-de-peixe",
          "colisão em grade",
          "projeção 2.5D"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "interact",
          "secondary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1500,
        "releasePhase": 5.1
      },
      {
        "schemaVersion": 1,
        "id": "voxelcraft-ds",
        "slug": "voxelcraft-ds",
        "title": "VoxelCraft DS 3D",
        "subtitle": "Mundo voxel educacional com chunks, construção e renderização adaptativa",
        "era": "2010-2019",
        "year": 2011,
        "genre": [
          "sandbox",
          "construção",
          "exploração"
        ],
        "technology": [
          "Three.js",
          "chunks",
          "greedy meshing",
          "IndexedDB"
        ],
        "runtime": "three",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Jogos sandbox voxel da década de 2010",
            "year": 2011,
            "company": "Diversos estúdios",
            "platform": "Computadores, consoles e dispositivos móveis",
            "originalTechnology": "Mundos em blocos, geração procedural e renderização 3D em tempo real",
            "note": "Referência histórica do gênero; mundo, código, identidade e conteúdo educacional desta versão são próprios do projeto DS."
          }
        ],
        "educationalConcepts": [
          "chunks e streaming",
          "estruturas de dados",
          "persistência local",
          "renderização 3D"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "look-x",
          "look-y",
          "jump",
          "primary-action",
          "secondary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 2600,
        "releasePhase": 6
      },
      {
        "schemaVersion": 1,
        "id": "board-arena",
        "slug": "board-arena",
        "title": "Board Arena DS",
        "subtitle": "Jogo da Velha e Dama 8×8 como laboratório de matrizes, turnos e IA",
        "era": "1950-1969",
        "year": 1952,
        "genre": [
          "tabuleiro",
          "estratégia",
          "quebra-cabeça"
        ],
        "technology": [
          "matrizes",
          "árvores de decisão",
          "geração de jogadas",
          "máquina de estados"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "reconstrucao-educacional",
        "historicalReferences": [
          {
            "title": "Programas de tabuleiro nos primeiros computadores",
            "year": 1952,
            "company": "Universidades de Manchester e Cambridge",
            "platform": "Ferranti Mark 1 e EDSAC",
            "originalTechnology": "Código de máquina, memória limitada, telas CRT e regras representadas como estados discretos",
            "note": "Referência histórica à computação de jogos de tabuleiro; interface, CPU, arte, código e conteúdo do Board Arena DS são autorais."
          }
        ],
        "educationalConcepts": [
          "matrizes e coordenadas",
          "turnos e validação",
          "busca de jogadas",
          "estratégia e bloqueio",
          "persistência de estado"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 950,
        "releasePhase": 7
      },
      {
        "schemaVersion": 1,
        "id": "puzzle-forge",
        "slug": "puzzle-forge",
        "title": "Puzzle Forge DS",
        "subtitle": "Caminhos, circuitos, sequências, labirintos e editor de fases",
        "era": "1980-1989",
        "year": 1982,
        "genre": [
          "puzzle",
          "lógica",
          "educacional"
        ],
        "technology": [
          "matrizes",
          "vizinhança",
          "busca de caminhos",
          "máquina de estados"
        ],
        "runtime": "phaser",
        "status": "jogavel",
        "fidelity": "jogo-inspirado",
        "historicalReferences": [
          {
            "title": "Sokoban e quebra-cabeças computacionais",
            "year": 1982,
            "company": "Thinking Rabbit e indústria de jogos para computadores pessoais",
            "platform": "Computadores pessoais e conversões posteriores",
            "originalTechnology": "Grades discretas, regras determinísticas, movimentação por células e memória compacta",
            "note": "Referência histórica ao desenvolvimento de puzzles em grade; fases, identidade, código e apresentação do Puzzle Forge DS são autorais."
          }
        ],
        "educationalConcepts": [
          "matrizes e coordenadas",
          "vizinhança ortogonal",
          "sequências e memória",
          "grafos e caminhos",
          "editor orientado a dados"
        ],
        "supportedGraphicsModes": [
          "automatico",
          "baixo",
          "medio",
          "alto",
          "ultra",
          "historico"
        ],
        "inputActions": [
          "move-up",
          "move-down",
          "move-left",
          "move-right",
          "primary-action",
          "pause"
        ],
        "mobileReady": true,
        "packageSizeBudgetKb": 1050,
        "releasePhase": 7
      }
    ];
  };
  function __require(id) {
    if (__cache[id]) return __cache[id].exports;
    const factory = __modules[id];
    if (!factory) throw new Error('Módulo não encontrado: ' + id);
    const module = { exports: {} };
    __cache[id] = module;
    factory(module, module.exports);
    return module.exports;
  }
  __require('main');
})();
