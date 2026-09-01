import { RESEARCH_CONFIDENCE } from './colegio-agv-shared.js';

// Implantação interna aproximada para gameplay. A Fase 3 acrescenta ambientes confirmados
// pelo Censo/infraestrutura pública, sem alegar posição 1:1 dentro do lote.
export const CAMPUS_BLOCKS = Object.freeze([
  { id: 'colegio_agv_block_front_admin', name: 'Bloco frontal / administração', x: 0, z: 31, width: 54, depth: 14, height: 4.6, roof: 'pitched', facade: 'agv-blue-white', confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_block_classrooms_west', name: 'Ala de salas de aula — oeste', x: -31, z: -5, width: 18, depth: 55, height: 4.3, roof: 'low-pitched', facade: 'agv-blue-white', confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_block_classrooms_north', name: 'Ala de salas de aula — norte', x: -5, z: -27, width: 39, depth: 14, height: 4.3, roof: 'low-pitched', facade: 'agv-blue-white', confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_block_service_east', name: 'Bloco de serviços / alimentação', x: 24, z: 23, width: 24, depth: 16, height: 4.0, roof: 'low-pitched', facade: 'agv-blue-white', confidence: RESEARCH_CONFIDENCE.CONFIRMED_PRESENCE_APPROX_POSITION },
  { id: 'colegio_agv_block_auditorium_south', name: 'Bloco do auditório', x: 24, z: -34, width: 22, depth: 14, height: 5.2, roof: 'low-pitched', facade: 'agv-blue-white', confidence: RESEARCH_CONFIDENCE.CONFIRMED_PRESENCE_APPROX_POSITION },
  { id: 'colegio_agv_block_connector_west', name: 'Ligação coberta frontal/oeste', x: -20, z: 17, width: 6, depth: 19, height: 3.2, roof: 'canopy', facade: 'open-corridor', confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_block_connector_north', name: 'Ligação coberta oeste/norte', x: -20, z: -23, width: 7, depth: 8, height: 3.2, roof: 'canopy', facade: 'open-corridor', confidence: RESEARCH_CONFIDENCE.INFERRED }
]);

export const ROOM_ZONES = Object.freeze([
  { id: 'colegio_agv_block_secretaria', name: 'Secretaria', kind: 'administration-room', x: -11, z: 31, width: 11, depth: 10, door: { x: -11, z: 38.2 }, interiorId: 'colegio_agv_interior_secretaria', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_block_diretoria', name: 'Diretoria', kind: 'administration-room', x: 2.5, z: 31, width: 8, depth: 10, door: { x: 2.5, z: 38.2 }, interiorId: 'colegio_agv_interior_diretoria', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_block_equipe_pedagogica', name: 'Equipe pedagógica', kind: 'pedagogy-room', x: 14.5, z: 31, width: 10, depth: 10, door: { x: 14.5, z: 38.2 }, interiorId: 'colegio_agv_interior_equipe_pedagogica', confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_block_sala_professores', name: 'Sala dos professores', kind: 'staff-room', x: -31, z: 23, width: 14, depth: 9, door: { x: -21.8, z: 23 }, interiorId: 'colegio_agv_interior_sala_professores', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_block_classroom_sample', name: 'Sala de aula — modelo atual', kind: 'classroom-room', x: -31, z: -2, width: 14, depth: 9, door: { x: -21.8, z: -2 }, interiorId: 'colegio_agv_interior_sala_modelo', confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_block_library', name: 'Biblioteca / sala de leitura', kind: 'library-room', x: -31, z: 12, width: 14, depth: 11, door: { x: -21.8, z: 12 }, interiorId: 'colegio_agv_interior_biblioteca', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_block_computer_lab', name: 'Laboratório de informática', kind: 'computer-lab-room', x: -31, z: -17, width: 14, depth: 11, door: { x: -21.8, z: -17 }, interiorId: 'colegio_agv_interior_lab_info', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_block_science_lab', name: 'Laboratório de Ciências / Física / Química / Biologia', kind: 'science-lab-room', x: -7, z: -27, width: 15, depth: 10, door: { x: -7, z: -19.8 }, interiorId: 'colegio_agv_interior_lab_ciencias', confidence: RESEARCH_CONFIDENCE.CONFIRMED_PRESENCE_APPROX_POSITION },
  { id: 'colegio_agv_block_sanitarios', name: 'Sanitários', kind: 'restroom', x: 12, z: -27, width: 10, depth: 10, door: { x: 12, z: -19.8 }, interiorId: 'colegio_agv_interior_sanitarios', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_block_kitchen_refectory', name: 'Cozinha e refeitório', kind: 'food-room', x: 24, z: 23, width: 22, depth: 14, door: { x: 12.2, z: 18 }, interiorId: 'colegio_agv_interior_refeitorio', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_block_auditorium', name: 'Auditório', kind: 'auditorium-room', x: 24, z: -34, width: 20, depth: 12, door: { x: 12.5, z: -31 }, interiorId: 'colegio_agv_interior_auditorio', confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION }
]);

export const OUTDOOR_FEATURES = Object.freeze([
  { id: 'colegio_agv_feature_patio_central', name: 'Pátio central', kind: 'courtyard', x: 0, z: 5, width: 33, depth: 30, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_feature_court_current', name: 'Quadra esportiva descoberta', kind: 'sports-court', x: 45, z: -11, width: 30, depth: 19, confidence: RESEARCH_CONFIDENCE.CENSUS_CONFIRMED_APPROX_POSITION },
  { id: 'colegio_agv_feature_front_lawn', name: 'Área verde frontal', kind: 'green-area', x: 22, z: 46, width: 31, depth: 18, confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_feature_front_lawn_west', name: 'Jardim frontal oeste', kind: 'green-area', x: -20, z: 46, width: 24, depth: 16, confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_feature_main_walkway', name: 'Caminho principal frontal', kind: 'patterned-walkway', x: 0, z: 47, width: 7, depth: 20, confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_feature_internal_spine', name: 'Circulação central', kind: 'walkway', x: 0, z: 17, width: 6, depth: 18, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_feature_west_corridor', name: 'Circulação da ala oeste', kind: 'walkway', x: -20, z: -4, width: 5, depth: 42, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_feature_north_corridor', name: 'Circulação da ala norte', kind: 'walkway', x: -4, z: -18, width: 37, depth: 5, confidence: RESEARCH_CONFIDENCE.INFERRED }
]);

export const FRONT_FACADE_DETAILS = Object.freeze({
  id: 'colegio_agv_facade_detail_set', z: 38.45,
  canopy: { x: -4, y: 3.95, z: 0, width: 31, depth: 4.8 },
  entrance: { x: -8.6, width: 3.0, height: 2.8 },
  vPillars: [-13, -6.5, 0, 6.5],
  windowBays: [-21, -16.5, 9.5, 14, 18.5, 23],
  confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION
});

export const EXTERIOR_FURNITURE = Object.freeze([
  { id: 'colegio_agv_bench_front_01', kind: 'bench', x: 18, z: 49, rotation: Math.PI, confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_bench_front_02', kind: 'bench', x: 23, z: 45, rotation: -Math.PI / 2, confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_bench_front_03', kind: 'bench', x: 17, z: 41, rotation: 0, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_directory_board', kind: 'directory-board', x: 5, z: 40, rotation: 0, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_notice_board_patio', kind: 'notice-board', x: -15, z: 14, rotation: Math.PI / 2, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_trash_bin_patio_01', kind: 'trash-bin', x: 10, z: 11, rotation: 0, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_trash_bin_patio_02', kind: 'trash-bin', x: -12, z: 2, rotation: 0, confidence: RESEARCH_CONFIDENCE.INFERRED }
]);

export const VEGETATION = Object.freeze([
  { id: 'colegio_agv_tree_front_01', kind: 'tree', x: 29, z: 49, scale: 1.1 },
  { id: 'colegio_agv_tree_front_02', kind: 'tree', x: 31, z: 40, scale: 1.25 },
  { id: 'colegio_agv_shrub_front_01', kind: 'shrub', x: -15, z: 41, scale: 0.8 },
  { id: 'colegio_agv_shrub_front_02', kind: 'shrub', x: -11, z: 41, scale: 0.7 },
  { id: 'colegio_agv_shrub_front_03', kind: 'shrub', x: -4, z: 41, scale: 0.65 }
]);

export const FENCES = Object.freeze([
  { id: 'colegio_agv_fence_front_west', x: -40, z: 56.5, width: 72, depth: 0.25, height: 1.8, kind: 'front-fence', confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_fence_front_east', x: 40, z: 56.5, width: 72, depth: 0.25, height: 1.8, kind: 'front-fence', confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION },
  { id: 'colegio_agv_fence_west', x: -76, z: -2, width: 0.25, depth: 113, height: 1.8, kind: 'perimeter', confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_fence_east', x: 76, z: -2, width: 0.25, depth: 113, height: 1.8, kind: 'perimeter', confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_fence_back', x: 0, z: -59, width: 152, depth: 0.25, height: 1.8, kind: 'perimeter', confidence: RESEARCH_CONFIDENCE.INFERRED }
]);

export const GATES = Object.freeze([
  { id: 'colegio_agv_gate_main', name: 'Portão principal', x: 0, z: 56.5, width: 8, height: 2.0, kind: 'pedestrian-main', confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION }
]);

export const ACCESSIBLE_ROUTES = Object.freeze([
  { id: 'colegio_agv_route_access_main', name: 'Rota acessível principal', confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION, points: [
    { x: 2.5, z: 54 }, { x: 2.5, z: 48 }, { x: -1.5, z: 45 }, { x: -2.2, z: 42.5 }, { x: -2.2, z: 39.5 }, { x: 0, z: 35 }, { x: 0, z: 18 }, { x: -18, z: 18 }, { x: -20, z: 5 }
  ] }
]);

export const WAYFINDING_SIGNS = Object.freeze([
  { id: 'colegio_agv_sign_entrada', label: 'ENTRADA / SECRETARIA', x: 0, z: 41.0, rotation: 0, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_sign_pedagogico', label: 'PEDAGÓGICO / PROFESSORES', x: -18, z: 21, rotation: Math.PI / 2, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_sign_labs', label: 'LABORATÓRIOS / SALAS', x: -18, z: -12, rotation: Math.PI / 2, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_sign_refeitorio', label: 'REFEITÓRIO', x: 11, z: 18, rotation: -Math.PI / 2, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_sign_quadra', label: 'QUADRA', x: 26, z: -10, rotation: 0, confidence: RESEARCH_CONFIDENCE.INFERRED }
]);

export const UTILITY_POINTS = Object.freeze([
  { id: 'colegio_agv_utility_bebedouro_01', kind: 'water-fountain', x: -17.5, z: 5, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_utility_bebedouro_02', kind: 'water-fountain', x: 9.5, z: 17, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_utility_ac_front_01', kind: 'air-conditioner', x: -20, z: 38.2, y: 3.35, confidence: RESEARCH_CONFIDENCE.CONFIRMED_VISUAL_APPROX_POSITION }
]);

export const SAFETY_POINTS = Object.freeze([
  { id: 'colegio_agv_safety_extintor_front', kind: 'fire-extinguisher', x: -14.5, z: 37.7, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_safety_extintor_west', kind: 'fire-extinguisher', x: -19.0, z: 2.5, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_safety_extintor_north', kind: 'fire-extinguisher', x: -1.0, z: -18.2, confidence: RESEARCH_CONFIDENCE.INFERRED },
  { id: 'colegio_agv_safety_exit_front', kind: 'exit-sign', x: -8.6, z: 38.7, confidence: RESEARCH_CONFIDENCE.INFERRED }
]);

export const NIGHT_FIXTURES = Object.freeze([
  { id: 'colegio_agv_light_entrance_01', x: -8.6, y: 3.45, z: 39.0 },
  { id: 'colegio_agv_light_entrance_02', x: 2.0, y: 3.45, z: 39.0 },
  { id: 'colegio_agv_light_patio_01', x: 0, y: 3.2, z: 17 },
  { id: 'colegio_agv_light_west_01', x: -20, y: 3.0, z: 6 },
  { id: 'colegio_agv_light_north_01', x: -4, y: 3.0, z: -18 }
]);

export const COURT_MARKINGS = Object.freeze([
  { id: 'colegio_agv_court_line_center', x: 45, z: -11, width: 0.12, depth: 18 },
  { id: 'colegio_agv_court_line_side_n', x: 45, z: -1.6, width: 29, depth: 0.12 },
  { id: 'colegio_agv_court_line_side_s', x: 45, z: -20.4, width: 29, depth: 0.12 },
  { id: 'colegio_agv_court_line_end_w', x: 30.2, z: -11, width: 0.12, depth: 18.8 },
  { id: 'colegio_agv_court_line_end_e', x: 59.8, z: -11, width: 0.12, depth: 18.8 },
  { id: 'colegio_agv_court_circle_hint', x: 45, z: -11, width: 4.4, depth: 0.12 }
]);

export const EXPANSION_2026_FEATURES = Object.freeze([
  { id: 'colegio_agv_future_6_classrooms', name: '6 novas salas de aula', kind: 'planned-classrooms', x: 52, z: 20, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_covered_court', name: 'Quadra poliesportiva coberta', kind: 'planned-covered-court', x: 45, z: -11, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_auditorium', name: 'Implantação / readequação de auditório', kind: 'planned-auditorium', x: 26, z: -35, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_science_lab', name: 'Laboratório de Ciências', kind: 'planned-lab', x: 12, z: -31, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_it_labs', name: '2 laboratórios de informática', kind: 'planned-it-labs', x: -17, z: -31, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_toilets', name: 'Novos sanitários', kind: 'planned-services', x: 17, z: -19, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_covered_walkways', name: 'Passarelas cobertas', kind: 'planned-walkways', x: 5, z: -5, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_library', name: 'Adequação e modernização da biblioteca', kind: 'planned-renovation', x: -31, z: 12, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 },
  { id: 'colegio_agv_future_food_area', name: 'Ampliação da cozinha e refeitório', kind: 'planned-renovation', x: 24, z: 23, confidence: RESEARCH_CONFIDENCE.PLANNED_2026 }
]);

export const COLLISION_RECTS = Object.freeze(CAMPUS_BLOCKS
  .filter((block) => block.facade !== 'open-corridor')
  .map((block) => ({ id: `${block.id}_collision`, x: block.x, z: block.z, width: block.width, depth: block.depth })));
