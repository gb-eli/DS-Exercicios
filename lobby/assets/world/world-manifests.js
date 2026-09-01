import { createWorldManifest } from './world-manifest.js?v=14.10.8.83-o3';

// O3: catálogo lógico estático. Não importa runtimes 3D nem altera Presença/Chat.
export const CAMPUS_WORLD_MANIFEST=createWorldManifest({
  "id": "campus-ds",
  "scene": "campus",
  "name": "Campus DS",
  "version": "14.10.8.83",
  "category": "campus",
  "enabled": true,
  "spawn": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "bounds": {
    "minX": -56,
    "maxX": 56,
    "minZ": -38,
    "maxZ": 38
  },
  "portals": [
    {
      "id": "vale-portal",
      "name": "Portal Vale do Silício AGV",
      "label": "VALE DO SILÍCIO AGV",
      "type": "vale-portal",
      "x": 0,
      "z": -29.5,
      "targetWorldId": "vale-silicio",
      "radius": 5.8
    },
    {
      "id": "rural-portal",
      "name": "Estrada para o Mundo Rural AGV",
      "label": "MUNDO RURAL AGV",
      "type": "rural-portal",
      "x": 0,
      "z": 34.5,
      "targetWorldId": "rural-agv",
      "radius": 5.8
    },
    {
      "id": "military-portal",
      "name": "Portal Base de Operações AGV",
      "label": "BASE DE OPERAÇÕES AGV",
      "type": "military-portal",
      "x": 50,
      "z": 34.2,
      "targetWorldId": "military-agv",
      "radius": 5.2
    },
    {
      "id": "space-portal",
      "name": "Centro Espacial AGV",
      "label": "ESTAÇÃO ORBITAL AGV",
      "type": "space-portal",
      "x": -50,
      "z": 34.2,
      "targetWorldId": "space-agv",
      "radius": 5.2
    },
    {
      "id": "parque-portal",
      "name": "Portal Parque de Diversões AGV",
      "label": "PARQUE DE DIVERSÕES AGV",
      "type": "parque-portal",
      "x": 50,
      "z": -34.2,
      "targetWorldId": "parque-diversoes-agv",
      "radius": 5.2
    }
  ],
  "connections": [
    "vale-silicio",
    "rural-agv",
    "military-agv",
    "space-agv",
    "parque-diversoes-agv",
    "colegio-agv",
    "labirinto-armadilhas",
    "museu-hardware-agv"
  ],
  "destinations": [
    {
      "id": "unified-platform",
      "name": "Plataforma Unificada",
      "label": "PLATAFORMA UNIFICADA",
      "x": 0,
      "z": 31
    },
    {
      "id": "lab-virtual",
      "name": "Laboratório Virtual DS",
      "label": "LABORATÓRIO VIRTUAL",
      "x": -44,
      "z": -26
    },
    {
      "id": "ctf-ds",
      "name": "CTF DS",
      "label": "CTF DS",
      "x": -44,
      "z": 26
    },
    {
      "id": "cosmos",
      "name": "COSMOS / Planetário DS",
      "label": "COSMOS DS",
      "x": 44,
      "z": -26
    },
    {
      "id": "desafio-ds",
      "name": "Desafio DS",
      "label": "DESAFIO DS",
      "x": 44,
      "z": 26
    },
    {
      "id": "fliperama",
      "name": "Fliperama DS",
      "label": "FLIPERAMA DS",
      "x": -49,
      "z": 0
    },
    {
      "id": "game-info",
      "name": "Desafio Informática",
      "label": "DESAFIO INFORMÁTICA",
      "x": 49,
      "z": 0
    },
    {
      "id": "practical-exam",
      "name": "Centro de Provas Práticas",
      "label": "CENTRO DE PROVAS",
      "x": -15.5,
      "z": -31
    },
    {
      "id": "cinema",
      "name": "Cinema AGV",
      "label": "CINEMA AGV",
      "x": 29,
      "z": 31
    },
    {
      "id": "security-center",
      "name": "Central de Segurança AGV",
      "label": "CENTRAL DE SEGURANÇA",
      "x": -29,
      "z": 31
    },
    {
      "id": "bank",
      "name": "Banco AGV",
      "label": "BANCO AGV",
      "x": -15.5,
      "z": 31
    },
    {
      "id": "store",
      "name": "Loja AGV",
      "label": "LOJA AGV",
      "x": 15.5,
      "z": 31
    }
  ],
  "interiors": [
    {
      "id": "unified-platform",
      "name": "Plataforma Unificada",
      "label": "PLATAFORMA UNIFICADA"
    },
    {
      "id": "lab-virtual",
      "name": "Laboratório Virtual DS",
      "label": "LABORATÓRIO VIRTUAL"
    },
    {
      "id": "ctf-ds",
      "name": "CTF DS",
      "label": "CTF DS"
    },
    {
      "id": "cosmos",
      "name": "COSMOS / Planetário DS",
      "label": "COSMOS DS"
    },
    {
      "id": "desafio-ds",
      "name": "Desafio DS",
      "label": "DESAFIO DS"
    },
    {
      "id": "fliperama",
      "name": "Fliperama DS",
      "label": "FLIPERAMA DS"
    },
    {
      "id": "game-info",
      "name": "Desafio Informática",
      "label": "DESAFIO INFORMÁTICA"
    },
    {
      "id": "practical-exam",
      "name": "Centro de Provas Práticas",
      "label": "CENTRO DE PROVAS"
    },
    {
      "id": "cinema",
      "name": "Cinema AGV",
      "label": "CINEMA AGV"
    },
    {
      "id": "security-center",
      "name": "Central de Segurança AGV",
      "label": "CENTRAL DE SEGURANÇA"
    },
    {
      "id": "bank",
      "name": "Banco AGV",
      "label": "BANCO AGV"
    },
    {
      "id": "store",
      "name": "Loja AGV",
      "label": "LOJA AGV"
    }
  ],
  "npcProfiles": [
    {
      "id": "npc-guide-central",
      "name": "Guia do Campus",
      "role": "Orientação urbana"
    },
    {
      "id": "npc-monitor-west",
      "name": "Monitor Tech Oeste",
      "role": "Apoio de laboratório"
    },
    {
      "id": "npc-monitor-east",
      "name": "Monitor Inovação",
      "role": "Apoio maker"
    },
    {
      "id": "npc-mobility",
      "name": "Agente de Mobilidade",
      "role": "Estações e garagens"
    },
    {
      "id": "npc-vale-link",
      "name": "Embaixador do Vale",
      "role": "Conexão Campus ↔ Vale"
    }
  ],
  "vehicles": [
    {
      "id": "drive-west-car",
      "name": "AGV E-Car",
      "kind": "car",
      "x": -41.2,
      "z": -9.5
    },
    {
      "id": "drive-west-bike",
      "name": "AGV E-Bike",
      "kind": "bike",
      "x": -37,
      "z": -9.5
    },
    {
      "id": "drive-east-van",
      "name": "Maker Van",
      "kind": "van",
      "x": 37,
      "z": 9.5
    },
    {
      "id": "drive-south-shuttle",
      "name": "Shuttle Acadêmico",
      "kind": "bus",
      "x": 28.7,
      "z": -30
    }
  ],
  "environment": {
    "kind": "academic-campus",
    "time": "global",
    "weather": "global"
  },
  "identity": {
    "icon": "🏫",
    "shortName": "Campus",
    "theme": "academic"
  },
  "aliases": [
    "lobby",
    "campus"
  ],
  "sceneAliases": [],
  "presenceArea": "central",
  "presenceAreas": [
    "central",
    "1ds",
    "2ds",
    "3ds",
    "sub"
  ],
  "source": {
    "manifest": "world/campus-manifest.js",
    "destinations": "world/campus-destinations.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": true,
    "npcs": true,
    "vehicles": true
  }
});

export const VALE_WORLD_MANIFEST=createWorldManifest({
  "id": "vale-silicio",
  "scene": "vale",
  "name": "Vale do Silício AGV",
  "version": "14.10.8.66",
  "category": "technology",
  "enabled": true,
  "spawn": {
    "x": 0,
    "y": 0.2,
    "z": -18
  },
  "bounds": {
    "minX": -420,
    "maxX": 420,
    "minZ": -420,
    "maxZ": 420
  },
  "portals": [
    {
      "id": "portal_retorno_lobby",
      "name": "Portal de Retorno ao Lobby",
      "label": "VOLTAR AO CAMPUS DS",
      "type": "return-portal",
      "x": 0,
      "z": -360,
      "targetWorldId": "campus-ds",
      "radius": 7
    }
  ],
  "connections": [
    "campus-ds"
  ],
  "destinations": [
    {
      "id": "praca",
      "name": "Praça Central da Inovação",
      "kind": "landmark",
      "x": 0,
      "z": -18
    },
    {
      "id": "auditorio",
      "name": "Auditório AGV",
      "kind": "environment",
      "x": -80,
      "z": 92
    },
    {
      "id": "refeitorio",
      "name": "Refeitório AGV",
      "kind": "environment",
      "x": 80,
      "z": 90
    },
    {
      "id": "sala-pedra",
      "name": "Sala de Pedra",
      "kind": "environment",
      "x": -80,
      "z": -100
    },
    {
      "id": "hall-inovacao",
      "name": "Hall da Inovação AGV",
      "kind": "environment",
      "x": 80,
      "z": -100
    },
    {
      "id": "esportes",
      "name": "Complexo Esportivo",
      "kind": "sport",
      "x": 0,
      "z": 315
    },
    {
      "id": "hangar",
      "name": "Hangar AGV",
      "kind": "mobility",
      "x": -350,
      "z": -315
    },
    {
      "id": "pista",
      "name": "Pista de Corrida",
      "kind": "mobility",
      "x": -235,
      "z": -310
    },
    {
      "id": "retorno",
      "name": "Portal de Retorno",
      "kind": "portal",
      "x": 0,
      "z": -350
    }
  ],
  "interiors": [
    {
      "id": "vale-company-interiors",
      "name": "Interiores das empresas",
      "kind": "dynamic",
      "dynamic": true
    }
  ],
  "npcProfiles": [
    {
      "id": "tirza",
      "name": "Tirza",
      "type": "vale-npc",
      "role": "Diretora",
      "x": -13,
      "z": -7
    },
    {
      "id": "vitor",
      "name": "Vitor",
      "type": "vale-npc",
      "role": "Diretor",
      "x": 13,
      "z": -7
    },
    {
      "id": "pedagoga",
      "name": "Pedagoga",
      "type": "vale-npc",
      "role": "Equipe pedagógica",
      "x": 0,
      "z": 20
    },
    {
      "id": "marcia",
      "name": "Márcia",
      "type": "vale-npc",
      "role": "Inspetora",
      "x": -28,
      "z": -20
    },
    {
      "id": "arlene",
      "name": "Arlene",
      "type": "vale-npc",
      "role": "Inspetora",
      "x": 28,
      "z": -20
    }
  ],
  "vehicles": [
    {
      "id": "carro-01",
      "name": "Carro elétrico",
      "kind": "carro",
      "type": "vale-vehicle",
      "x": -95,
      "z": 0
    },
    {
      "id": "onibus-01",
      "name": "Ônibus do Campus",
      "kind": "ônibus",
      "type": "vale-vehicle",
      "x": 0,
      "z": 86
    },
    {
      "id": "caminhao-01",
      "name": "Caminhão de logística",
      "kind": "caminhão",
      "type": "vale-vehicle",
      "x": -112,
      "z": 92
    },
    {
      "id": "moto-01",
      "name": "Moto elétrica",
      "kind": "moto",
      "type": "vale-vehicle",
      "x": 115,
      "z": -130
    },
    {
      "id": "bike-01",
      "name": "Bicicleta AGV",
      "kind": "bicicleta",
      "type": "vale-vehicle",
      "x": 36,
      "z": 58
    },
    {
      "id": "drone-01",
      "name": "Drone AGV",
      "kind": "drone",
      "type": "vale-vehicle",
      "x": -340,
      "y": 18,
      "z": -330
    },
    {
      "id": "heli-01",
      "name": "Helicóptero AGV",
      "kind": "helicóptero",
      "type": "vale-vehicle",
      "x": -360,
      "y": 2,
      "z": -350
    }
  ],
  "environment": {
    "kind": "technology-city",
    "time": "global",
    "weather": "global"
  },
  "identity": {
    "icon": "🏙️",
    "shortName": "Vale",
    "theme": "technology"
  },
  "aliases": [
    "vale"
  ],
  "sceneAliases": [],
  "presenceArea": "vale-silicio",
  "presenceAreas": [
    "vale-silicio"
  ],
  "source": {
    "shared": "world/vale-silicio-shared.js",
    "runtimeData": "world/vale-silicio-data.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": true,
    "npcs": true,
    "vehicles": true
  }
});

export const RURAL_WORLD_MANIFEST=createWorldManifest({
  "id": "rural-agv",
  "scene": "rural",
  "name": "Mundo Rural AGV",
  "version": "14.10.8.82",
  "category": "rural",
  "enabled": true,
  "spawn": {
    "x": 0,
    "z": -128,
    "y": 0
  },
  "bounds": {
    "minX": -180,
    "maxX": 180,
    "minZ": -160,
    "maxZ": 160
  },
  "portals": [
    {
      "id": "rural-return",
      "name": "Portal de Retorno ao Campus",
      "type": "rural-return-portal",
      "x": 0,
      "z": -145,
      "targetWorldId": "campus-ds",
      "radius": 7
    }
  ],
  "connections": [
    "campus-ds"
  ],
  "destinations": [
    {
      "id": "entrada",
      "name": "Estrada de Entrada",
      "kind": "road",
      "x": 0,
      "z": -128
    },
    {
      "id": "fazenda",
      "name": "Fazenda Pedagógica AGV",
      "kind": "farm",
      "x": -52,
      "z": -18
    },
    {
      "id": "celeiro",
      "name": "Celeiro e Silo",
      "kind": "farm",
      "x": -78,
      "z": -4
    },
    {
      "id": "ponte",
      "name": "Ponte do Rio Veiga",
      "kind": "bridge",
      "x": 24,
      "z": 22
    },
    {
      "id": "rio",
      "name": "Rio Veiga",
      "kind": "river",
      "x": 70,
      "z": 24
    },
    {
      "id": "pasto",
      "name": "Pasto dos Animais",
      "kind": "animals",
      "x": -18,
      "z": 72
    },
    {
      "id": "pomar",
      "name": "Pomar Experimental",
      "kind": "orchard",
      "x": 82,
      "z": -44
    },
    {
      "id": "mirante-rural",
      "name": "Mirante Rural",
      "kind": "viewpoint",
      "x": 118,
      "z": 92
    },
    {
      "id": "retorno",
      "name": "Portal de Retorno",
      "kind": "portal",
      "x": 0,
      "z": -145
    }
  ],
  "interiors": [],
  "npcProfiles": [],
  "vehicles": [],
  "environment": {
    "kind": "rural",
    "time": "global",
    "weather": "global",
    "animals": true
  },
  "identity": {
    "icon": "🌾",
    "shortName": "Rural",
    "theme": "nature"
  },
  "aliases": [
    "rural"
  ],
  "sceneAliases": [],
  "presenceArea": "rural-agv",
  "presenceAreas": [
    "rural-agv"
  ],
  "source": {
    "world": "world/rural-world.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": false,
    "npcs": false,
    "vehicles": false
  }
});

export const MILITARY_WORLD_MANIFEST=createWorldManifest({
  "id": "military-agv",
  "scene": "military",
  "name": "Base de Operações AGV",
  "version": "14.10.8.82",
  "category": "operations",
  "enabled": true,
  "spawn": {
    "x": 0,
    "z": -148,
    "y": 0
  },
  "bounds": {
    "minX": -210,
    "maxX": 210,
    "minZ": -175,
    "maxZ": 175
  },
  "portals": [
    {
      "id": "military-return",
      "name": "Portal de Retorno ao Campus",
      "type": "military-return-portal",
      "x": 0,
      "z": -162,
      "targetWorldId": "campus-ds",
      "radius": 7
    }
  ],
  "connections": [
    "campus-ds"
  ],
  "destinations": [
    {
      "id": "entrada",
      "name": "Portaria da Base",
      "kind": "checkpoint",
      "x": 0,
      "z": -145
    },
    {
      "id": "comando",
      "name": "Centro de Operações",
      "kind": "operations",
      "x": -42,
      "z": -58
    },
    {
      "id": "hangar-logistica",
      "name": "Hangar de Logística",
      "kind": "hangar",
      "x": 58,
      "z": -52
    },
    {
      "id": "hangar-engenharia",
      "name": "Hangar de Engenharia",
      "kind": "hangar",
      "x": 96,
      "z": 18
    },
    {
      "id": "pista",
      "name": "Pista de Aviação",
      "kind": "runway",
      "x": 10,
      "z": 62
    },
    {
      "id": "resgate",
      "name": "Centro de Resgate",
      "kind": "rescue",
      "x": -82,
      "z": 28
    },
    {
      "id": "treinamento",
      "name": "Circuito de Treinamento",
      "kind": "training",
      "x": -94,
      "z": 92
    },
    {
      "id": "torre",
      "name": "Torre de Observação",
      "kind": "viewpoint",
      "x": 138,
      "z": 104
    },
    {
      "id": "retorno",
      "name": "Retorno ao Campus",
      "kind": "portal",
      "x": 0,
      "z": -162
    }
  ],
  "interiors": [
    {
      "id": "logistics",
      "name": "Hangar de Logística"
    },
    {
      "id": "engineering",
      "name": "Hangar de Engenharia"
    }
  ],
  "npcProfiles": [],
  "vehicles": [
    {
      "id": "support-truck",
      "name": "Caminhão Logístico AGV",
      "kind": "truck",
      "type": "military-support-vehicle",
      "x": 47,
      "z": -36
    },
    {
      "id": "rescue-van",
      "name": "Van de Resgate AGV",
      "kind": "rescue",
      "type": "military-support-vehicle",
      "x": -67,
      "z": 35
    },
    {
      "id": "engineering-rover",
      "name": "Rover de Engenharia",
      "kind": "rover",
      "type": "military-support-vehicle",
      "x": 83,
      "z": 31
    },
    {
      "id": "observation-heli",
      "name": "Helicóptero de Observação",
      "kind": "helicopter",
      "type": "military-support-vehicle",
      "x": 48,
      "z": 77
    }
  ],
  "environment": {
    "kind": "operations-base",
    "time": "global",
    "weather": "global"
  },
  "identity": {
    "icon": "🛠️",
    "shortName": "Base",
    "theme": "operations"
  },
  "aliases": [
    "base-operacoes"
  ],
  "sceneAliases": [],
  "presenceArea": "military-agv",
  "presenceAreas": [
    "military-agv"
  ],
  "source": {
    "world": "world/military-world.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": true,
    "npcs": false,
    "vehicles": true
  }
});

export const SPACE_WORLD_MANIFEST=createWorldManifest({
  "id": "space-agv",
  "scene": "space",
  "name": "Estação Orbital AGV",
  "version": "14.10.8.82",
  "category": "space",
  "enabled": true,
  "spawn": {
    "x": 0,
    "z": 84,
    "y": 0
  },
  "bounds": {
    "minX": -150,
    "maxX": 150,
    "minZ": -110,
    "maxZ": 110
  },
  "portals": [
    {
      "id": "space-return",
      "name": "Transporte de Retorno ao Campus",
      "type": "space-return-portal",
      "x": 0,
      "z": 99,
      "targetWorldId": "campus-ds",
      "radius": 7
    },
    {
      "id": "space-moon-transfer",
      "name": "Transporte Lunar AGV",
      "type": "moon-portal",
      "x": 28,
      "z": 83,
      "targetWorldId": "moon-agv",
      "radius": 7
    },
    {
      "id": "space-mars-transfer",
      "name": "Transporte Marciano AGV",
      "type": "mars-portal",
      "x": -28,
      "z": 83,
      "targetWorldId": "mars-agv",
      "radius": 7
    }
  ],
  "connections": [
    "campus-ds",
    "moon-agv",
    "mars-agv"
  ],
  "destinations": [
    {
      "id": "arrival",
      "name": "Doca de Chegada",
      "kind": "dock",
      "x": 0,
      "z": 84
    },
    {
      "id": "mission-control",
      "name": "Controle de Missão Orbital",
      "kind": "operations",
      "x": -38,
      "z": 42
    },
    {
      "id": "science-lab",
      "name": "Laboratório de Ciências",
      "kind": "science",
      "x": 38,
      "z": 35
    },
    {
      "id": "habitat",
      "name": "Módulo de Habitação",
      "kind": "habitat",
      "x": -38,
      "z": -12
    },
    {
      "id": "robotics",
      "name": "Robótica e Satélites",
      "kind": "robotics",
      "x": 38,
      "z": -18
    },
    {
      "id": "cupola",
      "name": "Cúpula de Observação da Terra",
      "kind": "viewpoint",
      "x": 0,
      "z": -66
    },
    {
      "id": "solar",
      "name": "Painéis Solares",
      "kind": "energy",
      "x": 82,
      "z": 2
    },
    {
      "id": "interplanetary",
      "name": "Central Interplanetária AGV",
      "kind": "navigation",
      "x": 0,
      "z": 58
    },
    {
      "id": "deep-space",
      "name": "Exploração Profunda AGV",
      "kind": "science",
      "x": 42,
      "z": 58
    },
    {
      "id": "space-telescope",
      "name": "Telescópio Espacial AGV",
      "kind": "viewpoint",
      "x": 12,
      "z": -79
    },
    {
      "id": "moon-transfer",
      "name": "Transporte para a Lua",
      "kind": "moon",
      "x": 28,
      "z": 83
    },
    {
      "id": "mars-transfer",
      "name": "Transporte para Marte",
      "kind": "mars",
      "x": -28,
      "z": 83
    },
    {
      "id": "return",
      "name": "Retorno ao Campus",
      "kind": "portal",
      "x": 0,
      "z": 99
    }
  ],
  "interiors": [],
  "npcProfiles": [],
  "vehicles": [],
  "environment": {
    "kind": "orbital-station",
    "time": "global",
    "weather": "none"
  },
  "identity": {
    "icon": "🚀",
    "shortName": "Órbita",
    "theme": "space"
  },
  "aliases": [
    "estacao-orbital"
  ],
  "sceneAliases": [],
  "presenceArea": "space-agv",
  "presenceAreas": [
    "space-agv"
  ],
  "source": {
    "world": "world/space-world.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": false,
    "npcs": false,
    "vehicles": false
  }
});

export const MOON_WORLD_MANIFEST=createWorldManifest({
  "id": "moon-agv",
  "scene": "moon",
  "name": "Lua AGV",
  "version": "14.10.8.82",
  "category": "space",
  "enabled": true,
  "spawn": {
    "x": 0,
    "z": 112,
    "y": 0
  },
  "bounds": {
    "minX": -180,
    "maxX": 180,
    "minZ": -145,
    "maxZ": 145
  },
  "portals": [
    {
      "id": "moon-return-space",
      "name": "Módulo de Ascensão Lunar",
      "type": "moon-return-space-portal",
      "x": 0,
      "z": 130,
      "targetWorldId": "space-agv",
      "radius": 8
    }
  ],
  "connections": [
    "space-agv"
  ],
  "destinations": [
    {
      "id": "landing",
      "name": "Área de Pouso Lunar",
      "kind": "landing",
      "x": 0,
      "z": 112
    },
    {
      "id": "command",
      "name": "Base Lunar — Comando",
      "kind": "base",
      "x": 0,
      "z": 68
    },
    {
      "id": "science",
      "name": "Laboratório de Geociências",
      "kind": "science",
      "x": 42,
      "z": 52
    },
    {
      "id": "habitat",
      "name": "Habitat Lunar",
      "kind": "habitat",
      "x": -42,
      "z": 50
    },
    {
      "id": "rover",
      "name": "Rover Lunar AGV",
      "kind": "rover",
      "x": -48,
      "z": 20
    },
    {
      "id": "crater-veiga",
      "name": "Cratera Veiga",
      "kind": "crater",
      "x": 72,
      "z": -48
    },
    {
      "id": "crater-ds",
      "name": "Cratera DS",
      "kind": "crater",
      "x": -82,
      "z": -54
    },
    {
      "id": "earth-view",
      "name": "Mirante Terra Azul",
      "kind": "viewpoint",
      "x": 0,
      "z": -112
    },
    {
      "id": "return",
      "name": "Retorno à Estação Orbital",
      "kind": "portal",
      "x": 0,
      "z": 130
    }
  ],
  "interiors": [],
  "npcProfiles": [],
  "vehicles": [
    {
      "id": "moon-rover-01",
      "name": "Rover Lunar AGV",
      "type": "moon-rover",
      "x": -48,
      "z": 20,
      "radius": 7
    }
  ],
  "environment": {
    "kind": "lunar-surface",
    "time": "global",
    "weather": "none",
    "gravity": 1.62
  },
  "identity": {
    "icon": "🌕",
    "shortName": "Lua",
    "theme": "lunar"
  },
  "aliases": [
    "lua"
  ],
  "sceneAliases": [],
  "presenceArea": "moon-agv",
  "presenceAreas": [
    "moon-agv"
  ],
  "source": {
    "world": "world/moon-world.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": false,
    "npcs": false,
    "vehicles": true
  }
});

export const MARS_WORLD_MANIFEST=createWorldManifest({
  "id": "mars-agv",
  "scene": "mars",
  "name": "Marte AGV",
  "version": "14.10.8.82",
  "category": "space",
  "enabled": true,
  "spawn": {
    "x": 0,
    "z": 142,
    "y": 0
  },
  "bounds": {
    "minX": -220,
    "maxX": 220,
    "minZ": -175,
    "maxZ": 175
  },
  "portals": [
    {
      "id": "mars-return-space",
      "name": "Módulo de Ascensão Marciano",
      "type": "mars-return-space-portal",
      "x": 0,
      "z": 160,
      "targetWorldId": "space-agv",
      "radius": 8
    }
  ],
  "connections": [
    "space-agv"
  ],
  "destinations": [
    {
      "id": "landing",
      "name": "Área de Pouso Marciana",
      "kind": "landing",
      "x": 0,
      "z": 142
    },
    {
      "id": "command",
      "name": "Base Marciana — Comando",
      "kind": "base",
      "x": 0,
      "z": 92
    },
    {
      "id": "geology",
      "name": "Laboratório de Geologia",
      "kind": "science",
      "x": 48,
      "z": 72
    },
    {
      "id": "habitat",
      "name": "Habitat Marciano",
      "kind": "habitat",
      "x": -48,
      "z": 72
    },
    {
      "id": "greenhouse",
      "name": "Estufa Experimental",
      "kind": "science",
      "x": 0,
      "z": 48
    },
    {
      "id": "rover",
      "name": "Rover Marciano AGV",
      "kind": "rover",
      "x": -62,
      "z": 35
    },
    {
      "id": "canyon",
      "name": "Cânion Veiga",
      "kind": "canyon",
      "x": 0,
      "z": -78
    },
    {
      "id": "crater-veiga",
      "name": "Cratera Veiga Mars",
      "kind": "crater",
      "x": 92,
      "z": -56
    },
    {
      "id": "crater-ds",
      "name": "Cratera DS Mars",
      "kind": "crater",
      "x": -106,
      "z": -64
    },
    {
      "id": "horizon",
      "name": "Mirante Horizonte Vermelho",
      "kind": "viewpoint",
      "x": 0,
      "z": -145
    },
    {
      "id": "weather",
      "name": "Estação Meteorológica",
      "kind": "science",
      "x": 38,
      "z": -18
    },
    {
      "id": "return",
      "name": "Retorno à Estação Orbital",
      "kind": "portal",
      "x": 0,
      "z": 160
    }
  ],
  "interiors": [],
  "npcProfiles": [],
  "vehicles": [
    {
      "id": "mars-rover-01",
      "name": "Rover Marciano AGV",
      "type": "mars-rover",
      "x": -62,
      "z": 35,
      "radius": 7
    }
  ],
  "environment": {
    "kind": "martian-surface",
    "time": "global",
    "weather": "local-atmosphere",
    "gravity": 3.71
  },
  "identity": {
    "icon": "🔴",
    "shortName": "Marte",
    "theme": "mars"
  },
  "aliases": [
    "marte"
  ],
  "sceneAliases": [],
  "presenceArea": "mars-agv",
  "presenceAreas": [
    "mars-agv"
  ],
  "source": {
    "world": "world/mars-world.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": false,
    "npcs": false,
    "vehicles": true
  }
});

export const PARQUE_WORLD_MANIFEST=createWorldManifest({
  "id": "parque-diversoes-agv",
  "scene": "parque",
  "name": "Parque de Diversões AGV",
  "version": "14.10.8.80-f7",
  "category": "entertainment",
  "enabled": true,
  "spawn": {
    "x": 0,
    "y": 0.2,
    "z": 145
  },
  "bounds": {
    "minX": -180,
    "maxX": 180,
    "minZ": -180,
    "maxZ": 180
  },
  "portals": [
    {
      "id": "parque-retorno-campus",
      "name": "Portal de Retorno ao Campus DS",
      "label": "VOLTAR AO CAMPUS DS",
      "type": "return-portal",
      "x": 0,
      "y": 0,
      "z": 164,
      "targetWorldId": "campus-ds",
      "targetSpawn": "main",
      "radius": 7
    }
  ],
  "connections": [
    "campus-ds"
  ],
  "destinations": [
    {
      "id": "entrada",
      "name": "Entrada Principal",
      "kind": "landmark",
      "x": 0,
      "z": 145
    },
    {
      "id": "praca",
      "name": "Praça Central",
      "kind": "landmark",
      "x": 0,
      "z": 18
    },
    {
      "id": "coaster",
      "name": "Montanha-Russa",
      "kind": "ride",
      "x": -77,
      "z": -43
    },
    {
      "id": "race",
      "name": "Circuito AGV Racing",
      "kind": "race",
      "x": -92,
      "z": 48
    },
    {
      "id": "parkour",
      "name": "Sky Obby AGV",
      "kind": "challenge",
      "x": 52,
      "z": -42
    },
    {
      "id": "slide",
      "name": "Mega Escorregador",
      "kind": "ride",
      "x": 132,
      "z": 39
    },
    {
      "id": "shooting",
      "name": "Tiro ao Alvo",
      "kind": "challenge",
      "x": 82,
      "z": 100
    },
    {
      "id": "return",
      "name": "Voltar ao Campus",
      "kind": "portal",
      "x": 0,
      "z": 164
    }
  ],
  "interiors": [],
  "npcProfiles": [
    {
      "id": "npc-bia-guia",
      "name": "Bia",
      "type": "park-npc",
      "role": "Guia do Parque",
      "x": -8,
      "z": 120,
      "radius": 4.2
    },
    {
      "id": "npc-caio-monitor-obby",
      "name": "Caio",
      "type": "park-npc",
      "role": "Monitor do Sky Obby",
      "x": 47,
      "z": -34,
      "radius": 4.2
    },
    {
      "id": "npc-luna-coaster",
      "name": "Luna",
      "type": "park-npc",
      "role": "Operadora da Montanha-Russa",
      "x": -70,
      "z": -36,
      "radius": 4.2
    },
    {
      "id": "npc-davi-racing",
      "name": "Davi",
      "type": "park-npc",
      "role": "Fiscal AGV Racing",
      "x": -82,
      "z": 52,
      "radius": 4.2
    },
    {
      "id": "npc-maya-slide",
      "name": "Maya",
      "type": "park-npc",
      "role": "Monitora do Mega Slide",
      "x": 139,
      "z": 43,
      "radius": 4.2
    },
    {
      "id": "npc-neo-tiro",
      "name": "Neo",
      "type": "park-npc",
      "role": "Instrutor de Tiro ao Alvo",
      "x": 69,
      "z": 108,
      "radius": 4.2
    },
    {
      "id": "npc-socorrista",
      "name": "Rafa",
      "type": "park-npc",
      "role": "Primeiros Socorros",
      "x": 24,
      "z": 116,
      "radius": 4.2
    },
    {
      "id": "npc-fotografa",
      "name": "Nina",
      "type": "park-npc",
      "role": "Fotógrafa do Parque",
      "x": -24,
      "z": 16,
      "radius": 4.2
    }
  ],
  "vehicles": [
    {
      "id": "parque-coaster",
      "name": "Montanha-Russa Vulcão",
      "kind": "ride"
    },
    {
      "id": "parque-race-karts",
      "name": "Karts AGV Racing",
      "kind": "kart"
    }
  ],
  "environment": {
    "kind": "amusement-park",
    "time": "global",
    "weather": "global"
  },
  "identity": {
    "icon": "🎢",
    "shortName": "Parque",
    "theme": "amusement"
  },
  "aliases": [
    "parque"
  ],
  "sceneAliases": [],
  "presenceArea": "parque-diversoes-agv",
  "presenceAreas": [
    "parque-diversoes-agv"
  ],
  "source": {
    "shared": "world/parque-diversoes-agv-shared.js"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": false,
    "npcs": true,
    "vehicles": true
  }
});

export const COLEGIO_WORLD_MANIFEST=createWorldManifest({
  "id": "colegio-agv",
  "scene": "colegio",
  "name": "Colégio AGV — Alberto Gomes Veiga",
  "version": "1.6.0",
  "category": "education",
  "enabled": true,
  "spawn": {
    "x": 0,
    "y": 0.08,
    "z": 51
  },
  "bounds": {
    "minX": -78,
    "maxX": 78,
    "minZ": -62,
    "maxZ": 62
  },
  "portals": [
    {
      "id": "colegio_agv_portal_campus",
      "name": "Retorno ao Campus",
      "label": "Voltar ao Campus AGV World",
      "type": "world-portal",
      "x": 0,
      "y": 0,
      "z": 57,
      "targetWorldId": "campus-ds",
      "targetSpawn": "default",
      "radius": 3.2
    }
  ],
  "connections": [
    "campus-ds"
  ],
  "destinations": [
    {
      "id": "colegio_agv_dest_portao",
      "name": "Portão principal",
      "kind": "entrance",
      "x": 0,
      "z": 55
    },
    {
      "id": "colegio_agv_dest_entrada",
      "name": "Entrada principal",
      "kind": "entrance",
      "x": -7,
      "z": 41.5
    },
    {
      "id": "colegio_agv_dest_secretaria",
      "name": "Secretaria",
      "kind": "administration",
      "x": -10,
      "z": 31,
      "interiorId": "colegio_agv_interior_secretaria"
    },
    {
      "id": "colegio_agv_dest_diretoria",
      "name": "Diretoria",
      "kind": "administration",
      "x": 4,
      "z": 31,
      "interiorId": "colegio_agv_interior_diretoria"
    },
    {
      "id": "colegio_agv_dest_equipe_pedagogica",
      "name": "Equipe pedagógica",
      "kind": "pedagogy",
      "x": 15,
      "z": 31,
      "interiorId": "colegio_agv_interior_equipe_pedagogica"
    },
    {
      "id": "colegio_agv_dest_sala_professores",
      "name": "Sala dos professores",
      "kind": "staff",
      "x": -31,
      "z": 23,
      "interiorId": "colegio_agv_interior_sala_professores"
    },
    {
      "id": "colegio_agv_dest_patio",
      "name": "Pátio central",
      "kind": "social",
      "x": 0,
      "z": 8
    },
    {
      "id": "colegio_agv_dest_sala_modelo",
      "name": "Sala de aula",
      "kind": "classroom",
      "x": -30,
      "z": -2,
      "interiorId": "colegio_agv_interior_sala_modelo"
    },
    {
      "id": "colegio_agv_dest_biblioteca",
      "name": "Biblioteca / sala de leitura",
      "kind": "library",
      "x": -31,
      "z": 12,
      "interiorId": "colegio_agv_interior_biblioteca"
    },
    {
      "id": "colegio_agv_dest_lab_info",
      "name": "Laboratório de informática",
      "kind": "lab",
      "x": -31,
      "z": -17,
      "interiorId": "colegio_agv_interior_lab_info"
    },
    {
      "id": "colegio_agv_dest_lab_ciencias",
      "name": "Laboratório de Ciências",
      "kind": "lab",
      "x": -7,
      "z": -27,
      "interiorId": "colegio_agv_interior_lab_ciencias"
    },
    {
      "id": "colegio_agv_dest_sanitarios",
      "name": "Sanitários",
      "kind": "restroom",
      "x": 12,
      "z": -27,
      "interiorId": "colegio_agv_interior_sanitarios"
    },
    {
      "id": "colegio_agv_dest_refeitorio",
      "name": "Refeitório",
      "kind": "food",
      "x": 24,
      "z": 23,
      "interiorId": "colegio_agv_interior_refeitorio"
    },
    {
      "id": "colegio_agv_dest_quadra",
      "name": "Quadra esportiva",
      "kind": "sports",
      "x": 44,
      "z": -12
    },
    {
      "id": "colegio_agv_dest_auditorio",
      "name": "Auditório",
      "kind": "auditorium",
      "x": 24,
      "z": -33,
      "interiorId": "colegio_agv_interior_auditorio"
    },
    {
      "id": "colegio_agv_dest_bebedouro",
      "name": "Bebedouro / apoio",
      "kind": "utility",
      "x": -17,
      "z": 5
    }
  ],
  "interiors": [
    {
      "id": "colegio_agv_interior_secretaria",
      "name": "Secretaria"
    },
    {
      "id": "colegio_agv_interior_diretoria",
      "name": "Diretoria"
    },
    {
      "id": "colegio_agv_interior_equipe_pedagogica",
      "name": "Equipe pedagógica"
    },
    {
      "id": "colegio_agv_interior_sala_professores",
      "name": "Sala dos professores"
    },
    {
      "id": "colegio_agv_interior_sala_modelo",
      "name": "Sala de aula — modelo atual"
    },
    {
      "id": "colegio_agv_interior_biblioteca",
      "name": "Biblioteca / Sala de leitura"
    },
    {
      "id": "colegio_agv_interior_lab_info",
      "name": "Laboratório de Informática"
    },
    {
      "id": "colegio_agv_interior_lab_ciencias",
      "name": "Laboratório de Ciências"
    },
    {
      "id": "colegio_agv_interior_sanitarios",
      "name": "Sanitários"
    },
    {
      "id": "colegio_agv_interior_refeitorio",
      "name": "Refeitório / cozinha"
    },
    {
      "id": "colegio_agv_interior_auditorio",
      "name": "Auditório"
    }
  ],
  "npcProfiles": [
    {
      "id": "colegio_agv_npc_recepcao",
      "name": "Guia AGV",
      "role": "reception-guide",
      "x": -3,
      "y": 0,
      "z": 39
    },
    {
      "id": "colegio_agv_npc_biblioteca",
      "name": "Guia da Biblioteca",
      "role": "library-guide",
      "x": -25,
      "y": 0,
      "z": 12
    },
    {
      "id": "colegio_agv_npc_estudante_01",
      "name": "Estudante AGV",
      "role": "student",
      "x": 0,
      "y": 0,
      "z": 51
    },
    {
      "id": "colegio_agv_npc_estudante_02",
      "name": "Estudante AGV",
      "role": "student",
      "x": -10,
      "y": 0,
      "z": 10
    },
    {
      "id": "colegio_agv_npc_estudante_03",
      "name": "Estudante AGV",
      "role": "student",
      "x": 8,
      "y": 0,
      "z": 6
    },
    {
      "id": "colegio_agv_npc_professor_01",
      "name": "Professor(a) AGV",
      "role": "teacher",
      "x": -4,
      "y": 0,
      "z": 38
    },
    {
      "id": "colegio_agv_npc_apoio_01",
      "name": "Equipe AGV",
      "role": "school-support",
      "x": 10,
      "y": 0,
      "z": 18
    }
  ],
  "vehicles": [],
  "environment": {
    "kind": "school",
    "time": "global",
    "weather": "global"
  },
  "identity": {
    "icon": "🏫",
    "shortName": "Colégio AGV",
    "theme": "school"
  },
  "aliases": [
    "colegio"
  ],
  "sceneAliases": [
    "colegio-agv"
  ],
  "presenceArea": "colegio-agv",
  "presenceAreas": [
    "colegio-agv"
  ],
  "source": {
    "shared": "world/colegio-agv-shared.js",
    "officialPackage": "AGV-WORLD-MAPA-COLEGIO-AGV-v1.6.0-F7"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": true,
    "npcs": true,
    "vehicles": false
  }
});

export const LABIRINTO_WORLD_MANIFEST=createWorldManifest({
  "id": "labirinto-armadilhas",
  "scene": "labirinto",
  "name": "Labirinto com Armadilhas",
  "version": "1.1.0",
  "category": "challenge",
  "enabled": true,
  "spawn": {
    "x": -43,
    "y": 0,
    "z": 43,
    "id": "labirinto_armadilhas_spawn"
  },
  "bounds": {
    "minX": -50,
    "maxX": 50,
    "minZ": -50,
    "maxZ": 50
  },
  "portals": [
    {
      "id": "labirinto_armadilhas_portal_lobby",
      "name": "Portal do Lobby",
      "label": "Voltar ao Lobby",
      "type": "world-portal",
      "x": -45,
      "z": 45,
      "targetWorldId": "campus-ds",
      "targetSpawn": "default",
      "radius": 3.4
    }
  ],
  "connections": [
    "campus-ds"
  ],
  "destinations": [
    {
      "id": "labirinto_armadilhas_dest_inicio",
      "name": "Entrada do Labirinto",
      "kind": "spawn",
      "x": -43,
      "z": 43
    },
    {
      "id": "labirinto_armadilhas_cp_01_dest",
      "name": "Checkpoint 01",
      "kind": "checkpoint",
      "x": -31,
      "z": 22
    },
    {
      "id": "labirinto_armadilhas_cp_02_dest",
      "name": "Checkpoint 02",
      "kind": "checkpoint",
      "x": -14,
      "z": -4
    },
    {
      "id": "labirinto_armadilhas_cp_03_dest",
      "name": "Checkpoint 03",
      "kind": "checkpoint",
      "x": 13,
      "z": -9
    },
    {
      "id": "labirinto_armadilhas_cp_04_dest",
      "name": "Checkpoint 04",
      "kind": "checkpoint",
      "x": 35,
      "z": -31
    },
    {
      "id": "labirinto_armadilhas_dest_chegada",
      "name": "Chegada",
      "kind": "challenge-finish",
      "x": 43,
      "z": -43
    }
  ],
  "interiors": [],
  "npcProfiles": [],
  "vehicles": [],
  "environment": {
    "kind": "challenge-maze",
    "time": "fixed",
    "weather": "none"
  },
  "identity": {
    "icon": "🧩",
    "shortName": "Labirinto",
    "theme": "challenge"
  },
  "aliases": [
    "labirinto"
  ],
  "sceneAliases": [
    "labyrinth-traps"
  ],
  "presenceArea": "labirinto-armadilhas",
  "presenceAreas": [
    "labirinto-armadilhas"
  ],
  "source": {
    "shared": "world/labirinto-armadilhas-shared.js",
    "officialPackage": "AGV-WORLD-MAPA-LABIRINTO-ARMADILHAS-v1.1.0"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": false,
    "npcs": false,
    "vehicles": false
  }
});

export const MUSEU_WORLD_MANIFEST=createWorldManifest({
  "id": "museu-hardware-agv",
  "scene": "museu",
  "name": "Museu do Hardware AGV",
  "version": "0.8.0",
  "category": "museum",
  "enabled": true,
  "spawn": {
    "x": 0,
    "y": 0.2,
    "z": 132
  },
  "bounds": {
    "minX": -178,
    "maxX": 178,
    "minZ": -142,
    "maxZ": 158
  },
  "portals": [
    {
      "id": "museu_hardware_agv_portal_campus",
      "name": "Portal de Retorno ao Campus DS",
      "label": "VOLTAR AO CAMPUS DS",
      "type": "return-portal",
      "x": 0,
      "z": 148,
      "targetWorldId": "campus-ds",
      "targetSpawn": "central",
      "radius": 7
    }
  ],
  "connections": [
    "campus-ds"
  ],
  "destinations": [
    {
      "id": "museu-hardware:entrada",
      "name": "Entrada do Museu do Hardware",
      "kind": "entrance",
      "x": 0,
      "z": 132
    },
    {
      "id": "museu-hardware:atrio",
      "name": "Átrio da Evolução",
      "kind": "landmark",
      "x": 0,
      "z": 4
    },
    {
      "id": "museu-hardware:meeting-point",
      "name": "Ponto de encontro",
      "kind": "meeting-point",
      "x": 0,
      "z": 22
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_origens",
      "name": "Origens da Computação",
      "kind": "gallery",
      "x": -112,
      "z": -74
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_home",
      "name": "Revolução Doméstica",
      "kind": "gallery",
      "x": -48,
      "z": -80
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_console",
      "name": "Primeiros Consoles",
      "kind": "gallery",
      "x": 22,
      "z": -82
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_8bit",
      "name": "Era 8-bit",
      "kind": "gallery",
      "x": 92,
      "z": -70
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_16_32",
      "name": "16/32-bit e 3D",
      "kind": "gallery",
      "x": 118,
      "z": -12
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_arcade",
      "name": "Arcades",
      "kind": "gallery",
      "x": 102,
      "z": 60
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_portateis",
      "name": "Portáteis",
      "kind": "gallery",
      "x": 54,
      "z": 112
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_pc",
      "name": "PC Pessoal",
      "kind": "gallery",
      "x": -18,
      "z": 117
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_pc_gamer",
      "name": "PC Gamer",
      "kind": "gallery",
      "x": -86,
      "z": 104
    },
    {
      "id": "museu-hardware:museu_hardware_agv_galeria_atual",
      "name": "Geração Atual",
      "kind": "gallery",
      "x": -120,
      "z": 40
    },
    {
      "id": "museu-hardware:retorno",
      "name": "Portal de Retorno ao Campus DS",
      "kind": "portal",
      "x": 0,
      "z": 144
    }
  ],
  "interiors": [],
  "npcProfiles": [
    {
      "id": "museu_hardware_agv_npc_guia",
      "name": "Guia AGV",
      "type": "museum-guide",
      "role": "Recepção",
      "x": -8,
      "z": 126
    },
    {
      "id": "museu_hardware_agv_npc_curador",
      "name": "Curador Tech",
      "type": "museum-guide",
      "role": "Curadoria",
      "x": 14,
      "z": 10
    },
    {
      "id": "museu_hardware_agv_npc_arcade",
      "name": "Monitor Arcade",
      "type": "museum-guide",
      "role": "Interatividade",
      "x": 84,
      "z": 56
    }
  ],
  "vehicles": [],
  "environment": {
    "kind": "museum",
    "time": "indoor",
    "weather": "none"
  },
  "identity": {
    "icon": "🏛️",
    "shortName": "Museu",
    "theme": "hardware"
  },
  "aliases": [
    "museu-hardware",
    "museu-hardware"
  ],
  "sceneAliases": [
    "museu-hardware"
  ],
  "presenceArea": "museu-hardware",
  "presenceAreas": [
    "museu-hardware"
  ],
  "source": {
    "shared": "world/museu-hardware-shared.js",
    "officialPackage": "AGV-WORLD-MAPA-MUSEU-HARDWARE-v0.8.0-F1-F9"
  },
  "capabilities": {
    "lite": true,
    "threeD": true,
    "interiors": false,
    "npcs": true,
    "vehicles": false
  }
});

export const WORLD_MANIFESTS=Object.freeze([CAMPUS_WORLD_MANIFEST,VALE_WORLD_MANIFEST,RURAL_WORLD_MANIFEST,MILITARY_WORLD_MANIFEST,SPACE_WORLD_MANIFEST,MOON_WORLD_MANIFEST,MARS_WORLD_MANIFEST,PARQUE_WORLD_MANIFEST,COLEGIO_WORLD_MANIFEST,LABIRINTO_WORLD_MANIFEST,MUSEU_WORLD_MANIFEST]);
