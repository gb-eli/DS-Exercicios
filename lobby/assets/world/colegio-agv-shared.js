export const MAP_VERSION = '1.6.0';
export const BASE_AGV_WORLD = '14.10.8.73';
export const MAP_ID = 'colegio-agv';
export const SCENE_ID = 'colegio-agv';
export const MAP_LABEL = 'Colégio AGV — Alberto Gomes Veiga';

// Escala lógica adotada: 1 unidade ~= 1 metro.
// O perímetro é uma aproximação jogável, não um levantamento topográfico oficial.
export const MAP_BOUNDS = Object.freeze({ minX: -78, maxX: 78, minZ: -62, maxZ: 62 });
export const MAP_SPAWN = Object.freeze({ x: 0, y: 0.08, z: 51 });

export const MAP_RETURN_PORTAL = Object.freeze({
  id: 'colegio_agv_portal_campus',
  type: 'world-portal',
  name: 'Retorno ao Campus',
  label: 'Voltar ao Campus AGV World',
  x: 0, y: 0, z: 57, radius: 3.2,
  interaction: 'travel',
  targetWorldId: 'campus-ds',
  targetSpawn: 'default'
});

export const REAL_WORLD_REFERENCE = Object.freeze({
  name: 'Colégio Estadual Alberto Gomes Veiga — Ensino Médio e Profissional',
  address: 'Rua Júlia da Costa, 780 — Campo Grande — Paranaguá/PR — CEP 83203-060',
  latitude: -25.52209716,
  longitude: -48.51249503,
  inep: '41140370',
  phone: '+55 41 3423-3819',
  referenceDate: '2026-08-31',
  builtAreaCurrentApproxM2: 1459.80,
  expansionNewAreaM2: 1785.11,
  builtAreaAfterExpansionM2: 3244.91,
  liveSchoolPortalSnapshot: Object.freeze({ classes: 54, enrollments: 1433, date: '2026-08-31' }),
  census2025Snapshot: Object.freeze({ enrollments: 1045, classes: 55, teachers: 84 }),
  expansionStatus: 'licitacao-em-fase-de-certame'
});

export const RESEARCH_CONFIDENCE = Object.freeze({
  CONFIRMED: 'confirmed',
  CONFIRMED_VISUAL_APPROX_POSITION: 'confirmed-visual-approx-position',
  CONFIRMED_PRESENCE_APPROX_POSITION: 'confirmed-presence-approx-position',
  CENSUS_CONFIRMED_APPROX_POSITION: 'census-confirmed-approx-position',
  PLANNED_2026: 'planned-2026',
  INFERRED: 'inferred'
});

export const AREAS = Object.freeze([
  { id: 'colegio_agv_area_entrada', name: 'Entrada principal', x: 0, z: 47, radius: 16, kind: 'entrance' },
  { id: 'colegio_agv_area_jardim_frontal', name: 'Jardim frontal', x: 21, z: 45, radius: 15, kind: 'green-area' },
  { id: 'colegio_agv_area_administracao', name: 'Administração e secretaria', x: -8, z: 31, radius: 16, kind: 'administration' },
  { id: 'colegio_agv_area_patio', name: 'Pátio central', x: 0, z: 7, radius: 20, kind: 'social' },
  { id: 'colegio_agv_area_esportes', name: 'Área esportiva', x: 44, z: -10, radius: 24, kind: 'sports' },
  { id: 'colegio_agv_area_pedagogica', name: 'Blocos pedagógicos', x: -20, z: -6, radius: 33, kind: 'academic' },
  { id: 'colegio_agv_area_servicos', name: 'Cozinha e refeitório', x: 23, z: 24, radius: 17, kind: 'services' },
  { id: 'colegio_agv_area_convivencia', name: 'Convivência e circulação', x: -1, z: 15, radius: 23, kind: 'circulation' }
]);

export const LANDMARKS = Object.freeze([
  { id: 'colegio_agv_landmark_portico_v', name: 'Fachada azul com pilares em V', x: 0, z: 39.5, kind: 'architecture', confidence: RESEARCH_CONFIDENCE.CONFIRMED },
  { id: 'colegio_agv_landmark_rampa_entrada', name: 'Rampa e escadaria de acesso', x: -5, z: 43, kind: 'accessibility', confidence: RESEARCH_CONFIDENCE.CONFIRMED },
  { id: 'colegio_agv_landmark_area_verde_frontal', name: 'Jardim / área verde frontal', x: 21, z: 46, kind: 'green-area', confidence: RESEARCH_CONFIDENCE.CONFIRMED },
  { id: 'colegio_agv_landmark_bancos_azuis', name: 'Bancos azuis no jardim frontal', x: 19, z: 45, kind: 'street-furniture', confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_landmark_caminho_mosaico', name: 'Caminho frontal com padrão de piso', x: 3, z: 48, kind: 'walkway', confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION }
]);

export const DESTINATIONS = Object.freeze([
  { id: 'colegio_agv_dest_portao', name: 'Portão principal', x: 0, z: 55, kind: 'entrance', district: 'Frente' },
  { id: 'colegio_agv_dest_entrada', name: 'Entrada principal', x: -7, z: 41.5, kind: 'entrance', district: 'Frente' },
  { id: 'colegio_agv_dest_secretaria', name: 'Secretaria', x: -10, z: 31, kind: 'administration', district: 'Bloco frontal', interiorId: 'colegio_agv_interior_secretaria' },
  { id: 'colegio_agv_dest_diretoria', name: 'Diretoria', x: 4, z: 31, kind: 'administration', district: 'Bloco frontal', interiorId: 'colegio_agv_interior_diretoria' },
  { id: 'colegio_agv_dest_equipe_pedagogica', name: 'Equipe pedagógica', x: 15, z: 31, kind: 'pedagogy', district: 'Bloco frontal', interiorId: 'colegio_agv_interior_equipe_pedagogica' },
  { id: 'colegio_agv_dest_sala_professores', name: 'Sala dos professores', x: -31, z: 23, kind: 'staff', district: 'Ala pedagógica', interiorId: 'colegio_agv_interior_sala_professores' },
  { id: 'colegio_agv_dest_patio', name: 'Pátio central', x: 0, z: 8, kind: 'social', district: 'Centro' },
  { id: 'colegio_agv_dest_sala_modelo', name: 'Sala de aula', x: -30, z: -2, kind: 'classroom', district: 'Ala pedagógica', interiorId: 'colegio_agv_interior_sala_modelo' },
  { id: 'colegio_agv_dest_biblioteca', name: 'Biblioteca / sala de leitura', x: -31, z: 12, kind: 'library', district: 'Ala pedagógica', interiorId: 'colegio_agv_interior_biblioteca' },
  { id: 'colegio_agv_dest_lab_info', name: 'Laboratório de informática', x: -31, z: -17, kind: 'lab', district: 'Ala pedagógica', interiorId: 'colegio_agv_interior_lab_info' },
  { id: 'colegio_agv_dest_lab_ciencias', name: 'Laboratório de Ciências', x: -7, z: -27, kind: 'lab', district: 'Ala pedagógica', interiorId: 'colegio_agv_interior_lab_ciencias' },
  { id: 'colegio_agv_dest_sanitarios', name: 'Sanitários', x: 12, z: -27, kind: 'restroom', district: 'Ala norte', interiorId: 'colegio_agv_interior_sanitarios' },
  { id: 'colegio_agv_dest_refeitorio', name: 'Refeitório', x: 24, z: 23, kind: 'food', district: 'Serviços', interiorId: 'colegio_agv_interior_refeitorio' },
  { id: 'colegio_agv_dest_quadra', name: 'Quadra esportiva', x: 44, z: -12, kind: 'sports', district: 'Esportes' },
  { id: 'colegio_agv_dest_auditorio', name: 'Auditório', x: 24, z: -33, kind: 'auditorium', district: 'Sul', interiorId: 'colegio_agv_interior_auditorio' },
  { id: 'colegio_agv_dest_bebedouro', name: 'Bebedouro / apoio', x: -17, z: 5, kind: 'utility', district: 'Centro' }
]);

export const NPCS = Object.freeze([
  { id: 'colegio_agv_npc_recepcao', role: 'reception-guide', name: 'Guia AGV', x: -3, y: 0, z: 39, area: 'colegio_agv_area_entrada', interaction: 'school-map', routeId: 'colegio_agv_route_support', speed: 0.55 },
  { id: 'colegio_agv_npc_biblioteca', role: 'library-guide', name: 'Guia da Biblioteca', x: -25, y: 0, z: 12, area: 'colegio_agv_area_pedagogica', interaction: 'library-info', routeId: 'colegio_agv_route_support', speed: 0.42, phaseOffset: 11 },
  { id: 'colegio_agv_npc_estudante_01', role: 'student', name: 'Estudante AGV', x: 0, y: 0, z: 51, area: 'colegio_agv_area_entrada', routeId: 'colegio_agv_route_student_entrance', speed: 1.12, phaseOffset: 1 },
  { id: 'colegio_agv_npc_estudante_02', role: 'student', name: 'Estudante AGV', x: -10, y: 0, z: 10, area: 'colegio_agv_area_patio', routeId: 'colegio_agv_route_student_patio', speed: 1.03, phaseOffset: 8 },
  { id: 'colegio_agv_npc_estudante_03', role: 'student', name: 'Estudante AGV', x: 8, y: 0, z: 6, area: 'colegio_agv_area_patio', routeId: 'colegio_agv_route_student_patio', speed: 0.92, phaseOffset: 17 },
  { id: 'colegio_agv_npc_professor_01', role: 'teacher', name: 'Professor(a) AGV', x: -4, y: 0, z: 38, area: 'colegio_agv_area_pedagogica', routeId: 'colegio_agv_route_teacher', speed: 0.72, phaseOffset: 4 },
  { id: 'colegio_agv_npc_apoio_01', role: 'school-support', name: 'Equipe AGV', x: 10, y: 0, z: 18, area: 'colegio_agv_area_convivencia', routeId: 'colegio_agv_route_support', speed: 0.66, phaseOffset: 6 }
]);

export const INTERACTABLES = Object.freeze([
  MAP_RETURN_PORTAL,
  { id: 'colegio_agv_interact_school_directory', type: 'directory', name: 'Mapa da escola', x: 5, z: 40, radius: 2.4, interaction: 'open-directory' },
  { id: 'colegio_agv_interact_historia_fachada', type: 'information', name: 'Identidade arquitetônica do AGV', x: 10, z: 40, radius: 2.2, interaction: 'show-facade-info' },
  { id: 'colegio_agv_interact_school_numbers', type: 'information', name: 'AGV em números', x: 7.2, z: 37.8, radius: 2.0, interaction: 'show-school-numbers' },
  { id: 'colegio_agv_interact_accessibility', type: 'information', name: 'Rota acessível', x: -2.2, z: 43, radius: 2.0, interaction: 'show-accessibility' },
  { id: 'colegio_agv_interact_future_expansion', type: 'information', name: 'Projeto Educação para o Futuro — CE 99/2026', x: 51, z: 29, radius: 2.4, interaction: 'show-expansion-2026' }
]);

export function isInsideBounds(x, z, margin = 0) {
  return x >= MAP_BOUNDS.minX + margin && x <= MAP_BOUNDS.maxX - margin &&
    z >= MAP_BOUNDS.minZ + margin && z <= MAP_BOUNDS.maxZ - margin;
}

export function worldToPresence({ x = 0, y = 0, z = 0 } = {}) {
  const width = MAP_BOUNDS.maxX - MAP_BOUNDS.minX;
  const depth = MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ;
  return { x: (x - MAP_BOUNDS.minX) / width, y, z: (z - MAP_BOUNDS.minZ) / depth };
}

export function presenceToWorld({ x = 0.5, y = 0, z = 0.5 } = {}) {
  const width = MAP_BOUNDS.maxX - MAP_BOUNDS.minX;
  const depth = MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ;
  return { x: MAP_BOUNDS.minX + x * width, y, z: MAP_BOUNDS.minZ + z * depth };
}
