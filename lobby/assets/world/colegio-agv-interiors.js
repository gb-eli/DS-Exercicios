const studentDesks = (prefix, rows = 3, cols = 6, startX = -4.7, startZ = -0.8, dx = 1.9, dz = 2.0) =>
  Array.from({ length: rows * cols }, (_, index) => ({
    id: `${prefix}_${String(index + 1).padStart(2, '0')}`,
    type: 'student-desk',
    x: startX + (index % cols) * dx,
    z: startZ + Math.floor(index / cols) * dz
  }));

const INTERIORS = Object.freeze({
  colegio_agv_interior_secretaria: {
    id: 'colegio_agv_interior_secretaria', name: 'Secretaria', size: { width: 11, depth: 10, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 3.2 },
    confidence: 'census-confirmed-approx-position',
    stations: [
      { id: 'colegio_agv_secretaria_balcao', type: 'counter', x: 0, z: -1.0 },
      { id: 'colegio_agv_secretaria_pc_01', type: 'computer-desk', x: -3.4, z: -3.0 },
      { id: 'colegio_agv_secretaria_pc_02', type: 'computer-desk', x: 0, z: -3.0 },
      { id: 'colegio_agv_secretaria_arquivo', type: 'cabinet', x: 4.1, z: -3.0 },
      { id: 'colegio_agv_secretaria_impressora', type: 'printer', x: 3.8, z: 1.8 },
      { id: 'colegio_agv_secretaria_mural', type: 'bulletin-board', x: -4.9, z: 0.5 },
      { id: 'colegio_agv_secretaria_extintor', type: 'fire-extinguisher', x: 4.8, z: 3.8 }
    ]
  },
  colegio_agv_interior_diretoria: {
    id: 'colegio_agv_interior_diretoria', name: 'Diretoria', size: { width: 8, depth: 10, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 3.2 },
    confidence: 'census-confirmed-approx-position',
    stations: [
      { id: 'colegio_agv_diretoria_mesa', type: 'teacher-desk', x: 0, z: -2.1 },
      { id: 'colegio_agv_diretoria_pc', type: 'computer-desk', x: -2.1, z: -2.8 },
      { id: 'colegio_agv_diretoria_arquivo', type: 'cabinet', x: 3.1, z: -2.6 },
      { id: 'colegio_agv_diretoria_reuniao', type: 'meeting-table', x: 0, z: 1.2 },
      { id: 'colegio_agv_diretoria_mural', type: 'bulletin-board', x: -3.45, z: 0.2 }
    ]
  },
  colegio_agv_interior_equipe_pedagogica: {
    id: 'colegio_agv_interior_equipe_pedagogica', name: 'Equipe pedagógica', size: { width: 10, depth: 10, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 3.2 },
    confidence: 'inferred',
    notes: 'Setor funcional representado para gameplay; posição interna não confirmada por planta pública.',
    stations: [
      { id: 'colegio_agv_pedagogico_mesa_01', type: 'computer-desk', x: -2.8, z: -2.5 },
      { id: 'colegio_agv_pedagogico_mesa_02', type: 'computer-desk', x: 0, z: -2.5 },
      { id: 'colegio_agv_pedagogico_mesa_03', type: 'computer-desk', x: 2.8, z: -2.5 },
      { id: 'colegio_agv_pedagogico_reuniao', type: 'meeting-table', x: 0, z: 1.1 },
      { id: 'colegio_agv_pedagogico_mural', type: 'bulletin-board', x: -4.45, z: 0 },
      { id: 'colegio_agv_pedagogico_arquivo', type: 'cabinet', x: 4.1, z: 2.2 }
    ]
  },
  colegio_agv_interior_sala_professores: {
    id: 'colegio_agv_interior_sala_professores', name: 'Sala dos professores', size: { width: 14, depth: 9, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 3.2 },
    confidence: 'census-confirmed-approx-position',
    stations: [
      { id: 'colegio_agv_professores_mesa_01', type: 'meeting-table', x: -2.7, z: 0 },
      { id: 'colegio_agv_professores_mesa_02', type: 'meeting-table', x: 2.7, z: 0 },
      { id: 'colegio_agv_professores_armario_01', type: 'cabinet', x: -5.7, z: -2.8 },
      { id: 'colegio_agv_professores_armario_02', type: 'cabinet', x: 5.7, z: -2.8 },
      { id: 'colegio_agv_professores_pc', type: 'computer-desk', x: 0, z: -3.1 },
      { id: 'colegio_agv_professores_cafe', type: 'coffee-counter', x: 5.4, z: 2.8 },
      { id: 'colegio_agv_professores_mural', type: 'bulletin-board', x: -6.45, z: 0 }
    ]
  },
  colegio_agv_interior_sala_modelo: {
    id: 'colegio_agv_interior_sala_modelo', name: 'Sala de aula — modelo atual', size: { width: 14, depth: 9, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 3.3 },
    confidence: 'inferred',
    notes: 'Modelagem de gameplay; notícia de 2026 registra salas atuais com divisórias em madeira.',
    stations: [
      { id: 'colegio_agv_sala_quadro', type: 'board', x: 0, z: -4.25 },
      { id: 'colegio_agv_sala_professor', type: 'teacher-desk', x: 0, z: -2.9 },
      { id: 'colegio_agv_sala_projetor', type: 'projector', x: 0, z: 0 },
      { id: 'colegio_agv_sala_tv', type: 'tv', x: 5.9, z: -2.8 },
      { id: 'colegio_agv_sala_ventilador_01', type: 'wall-fan', x: -6.2, z: -2.4 },
      { id: 'colegio_agv_sala_ventilador_02', type: 'wall-fan', x: 6.2, z: 1.8 },
      ...studentDesks('colegio_agv_sala_carteira')
    ]
  },
  colegio_agv_interior_biblioteca: {
    id: 'colegio_agv_interior_biblioteca', name: 'Biblioteca / Sala de leitura', size: { width: 14, depth: 11, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 4.0 },
    confidence: 'census-confirmed-approx-position',
    stations: [
      { id: 'colegio_agv_bib_estante_01', type: 'bookshelf', x: -5.3, z: -2.8 },
      { id: 'colegio_agv_bib_estante_02', type: 'bookshelf', x: -5.3, z: 1.0 },
      { id: 'colegio_agv_bib_estante_03', type: 'bookshelf', x: 5.3, z: -2.8 },
      { id: 'colegio_agv_bib_estante_04', type: 'bookshelf', x: 5.3, z: 1.0 },
      { id: 'colegio_agv_bib_mesa_01', type: 'study-table', x: -2.0, z: -0.5 },
      { id: 'colegio_agv_bib_mesa_02', type: 'study-table', x: 2.0, z: -0.5 },
      { id: 'colegio_agv_bib_atendimento', type: 'counter', x: 0, z: -4.3 },
      { id: 'colegio_agv_bib_pc', type: 'computer-desk', x: 3.5, z: 3.4 }
    ]
  },
  colegio_agv_interior_lab_info: {
    id: 'colegio_agv_interior_lab_info', name: 'Laboratório de Informática', size: { width: 14, depth: 11, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 4.0 },
    confidence: 'census-confirmed-approx-position',
    notes: 'Quantidade de estações é uma representação de gameplay; o Censo 2025 registra computadores na escola, não a distribuição por sala.',
    stations: [
      ...Array.from({ length: 16 }, (_, index) => ({
        id: `colegio_agv_pc_${String(index + 1).padStart(2, '0')}`,
        type: 'computer-desk', x: -4.8 + (index % 4) * 3.2, z: -3.3 + Math.floor(index / 4) * 2.25
      })),
      { id: 'colegio_agv_labinfo_quadro', type: 'board', x: 0, z: -5.25 },
      { id: 'colegio_agv_labinfo_switch', type: 'network-rack', x: 6.0, z: -4.2 },
      { id: 'colegio_agv_labinfo_projetor', type: 'projector', x: 0, z: 0 }
    ]
  },
  colegio_agv_interior_lab_ciencias: {
    id: 'colegio_agv_interior_lab_ciencias', name: 'Laboratório de Ciências', size: { width: 15, depth: 10, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 3.7 },
    confidence: 'confirmed-presence-approx-position',
    stations: [
      { id: 'colegio_agv_lab_bancada_01', type: 'science-bench', x: -3.3, z: -0.5 },
      { id: 'colegio_agv_lab_bancada_02', type: 'science-bench', x: 3.3, z: -0.5 },
      { id: 'colegio_agv_lab_bancada_03', type: 'science-bench', x: 0, z: 2.0 },
      { id: 'colegio_agv_lab_quadro', type: 'board', x: 0, z: -4.75 },
      { id: 'colegio_agv_lab_armario', type: 'cabinet', x: 6.3, z: -3.4 },
      { id: 'colegio_agv_lab_pia', type: 'sink-bench', x: -6.2, z: -3.4 },
      { id: 'colegio_agv_lab_extintor', type: 'fire-extinguisher', x: 6.7, z: 3.6 }
    ]
  },
  colegio_agv_interior_sanitarios: {
    id: 'colegio_agv_interior_sanitarios', name: 'Sanitários', size: { width: 10, depth: 10, height: 3.4 },
    spawn: { x: 0, y: 0.08, z: 3.4 },
    confidence: 'census-confirmed-approx-position',
    notes: 'O Censo confirma sanitários na escola; divisão, quantidade e posição são aproximações.',
    stations: [
      { id: 'colegio_agv_wc_divisoria_01', type: 'partition', x: -2.8, z: -1.0 },
      { id: 'colegio_agv_wc_divisoria_02', type: 'partition', x: 0, z: -1.0 },
      { id: 'colegio_agv_wc_divisoria_03', type: 'partition', x: 2.8, z: -1.0 },
      { id: 'colegio_agv_wc_pia_01', type: 'sink-bench', x: -2.2, z: 2.3 },
      { id: 'colegio_agv_wc_pia_02', type: 'sink-bench', x: 2.2, z: 2.3 },
      { id: 'colegio_agv_wc_espelho', type: 'mirror', x: 0, z: 4.65 }
    ]
  },
  colegio_agv_interior_refeitorio: {
    id: 'colegio_agv_interior_refeitorio', name: 'Refeitório / cozinha', size: { width: 22, depth: 14, height: 3.6 },
    spawn: { x: 0, y: 0.08, z: 5.2 },
    confidence: 'census-confirmed-approx-position',
    stations: [
      ...Array.from({ length: 10 }, (_, index) => ({
        id: `colegio_agv_refeitorio_mesa_${String(index + 1).padStart(2, '0')}`,
        type: 'cafeteria-table', x: -7.8 + (index % 5) * 3.9, z: -1.8 + Math.floor(index / 5) * 4.3
      })),
      { id: 'colegio_agv_refeitorio_balcao', type: 'counter', x: 0, z: -5.7 },
      { id: 'colegio_agv_refeitorio_cozinha_bancada', type: 'kitchen-counter', x: 7.9, z: -4.3 },
      { id: 'colegio_agv_refeitorio_pia', type: 'sink-bench', x: 5.2, z: -5.4 },
      { id: 'colegio_agv_refeitorio_despensa', type: 'cabinet', x: -9.1, z: -4.7 },
      { id: 'colegio_agv_refeitorio_bebedouro', type: 'water-fountain', x: 9.4, z: 4.5 }
    ]
  },
  colegio_agv_interior_auditorio: {
    id: 'colegio_agv_interior_auditorio', name: 'Auditório', size: { width: 20, depth: 12, height: 4.5 },
    spawn: { x: 0, y: 0.08, z: 4.8 },
    confidence: 'census-confirmed-approx-position',
    stations: [
      { id: 'colegio_agv_auditorio_palco', type: 'stage', x: 0, z: -4.8 },
      { id: 'colegio_agv_auditorio_tela', type: 'screen', x: 0, z: -5.85 },
      { id: 'colegio_agv_auditorio_projetor', type: 'projector', x: 0, z: 0 },
      ...Array.from({ length: 24 }, (_, index) => ({
        id: `colegio_agv_auditorio_assento_${String(index + 1).padStart(2, '0')}`,
        type: 'auditorium-seat', x: -6.8 + (index % 8) * 1.95, z: -2.0 + Math.floor(index / 8) * 2.1
      }))
    ]
  }
});

export function getInteriorDefinition(id) { return INTERIORS[id] || null; }
export function listInteriors() { return Object.values(INTERIORS); }

function box(THREE, parent, material, width, height, depth, x, y, z, name) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.name = name;
  mesh.castShadow = height > 0.8;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(THREE, parent, material, radius, height, x, y, z, name) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 12), material);
  mesh.position.set(x, y, z);
  mesh.name = name;
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function addStation(THREE, group, mats, station) {
  const t = station.type;
  if (t === 'board' || t === 'screen' || t === 'bulletin-board' || t === 'mirror') {
    const mat = t === 'mirror' ? mats.glass : (t === 'bulletin-board' ? mats.cork : mats.accent);
    box(THREE, group, mat, t === 'screen' ? 5 : 4.2, t === 'screen' ? 2.3 : 1.6, 0.1, station.x, 1.9, station.z, station.id);
    return;
  }
  if (t === 'bookshelf') { box(THREE, group, mats.wood, 1.15, 2.35, 3.0, station.x, 1.18, station.z, station.id); return; }
  if (t === 'cabinet' || t === 'network-rack') {
    box(THREE, group, t === 'network-rack' ? mats.dark : mats.gray, t === 'network-rack' ? 0.9 : 1.2, 2.1, t === 'network-rack' ? 0.8 : 2.4, station.x, 1.05, station.z, station.id); return;
  }
  if (t === 'computer-desk') {
    const desk = box(THREE, group, mats.wood, 2.3, 0.72, 0.8, station.x, 0.36, station.z, station.id);
    box(THREE, desk, mats.dark, 0.9, 0.62, 0.08, 0, 0.72, -0.22, `${station.id}_monitor`);
    box(THREE, group, mats.blue, 0.62, 0.46, 0.55, station.x, 0.23, station.z + 0.78, `${station.id}_chair`);
    box(THREE, group, mats.blue, 0.62, 0.62, 0.14, station.x, 0.72, station.z + 1.0, `${station.id}_chair_back`); return;
  }
  if (t === 'science-bench' || t === 'sink-bench' || t === 'kitchen-counter') {
    const width = t === 'science-bench' ? 4.6 : t === 'kitchen-counter' ? 3.4 : 2.8;
    const bench = box(THREE, group, mats.gray, width, 0.9, 1.25, station.x, 0.45, station.z, station.id);
    if (t === 'sink-bench') box(THREE, bench, mats.dark, 0.9, 0.08, 0.55, 0, 0.49, 0, `${station.id}_sink`);
    return;
  }
  if (t === 'stage') { box(THREE, group, mats.wood, 9.5, 0.42, 2.2, station.x, 0.21, station.z, station.id); return; }
  if (t === 'auditorium-seat') {
    box(THREE, group, mats.blue, 1.05, 0.62, 0.75, station.x, 0.31, station.z, station.id);
    box(THREE, group, mats.blue, 1.05, 0.72, 0.18, station.x, 0.83, station.z - 0.3, `${station.id}_back`); return;
  }
  if (t === 'student-desk') {
    box(THREE, group, mats.wood, 1.25, 0.68, 0.6, station.x, 0.34, station.z, station.id);
    box(THREE, group, mats.blue, 0.55, 0.44, 0.48, station.x, 0.22, station.z + 0.68, `${station.id}_chair`);
    box(THREE, group, mats.blue, 0.55, 0.58, 0.12, station.x, 0.67, station.z + 0.88, `${station.id}_chair_back`); return;
  }
  if (t === 'teacher-desk' || t === 'counter' || t === 'coffee-counter') {
    const width = t === 'counter' ? 5.2 : t === 'coffee-counter' ? 2.4 : 2.6;
    box(THREE, group, mats.wood, width, 0.82, 0.9, station.x, 0.41, station.z, station.id);
    if (t === 'teacher-desk') {
      box(THREE, group, mats.blue, 0.65, 0.48, 0.58, station.x, 0.24, station.z + 0.86, `${station.id}_chair`);
      box(THREE, group, mats.blue, 0.65, 0.65, 0.14, station.x, 0.75, station.z + 1.1, `${station.id}_chair_back`);
    }
    return;
  }
  if (t === 'projector') { box(THREE, group, mats.light, 0.9, 0.24, 0.6, station.x, 3.0, station.z, station.id); return; }
  if (t === 'tv') { box(THREE, group, mats.dark, 1.6, 1.05, 0.12, station.x, 1.85, station.z, station.id); return; }
  if (t === 'wall-fan') { cylinder(THREE, group, mats.gray, 0.42, 0.18, station.x, 2.3, station.z, station.id).rotation.x = Math.PI / 2; return; }
  if (t === 'printer') { box(THREE, group, mats.light, 0.8, 0.55, 0.65, station.x, 0.75, station.z, station.id); return; }
  if (t === 'fire-extinguisher') { cylinder(THREE, group, mats.red, 0.14, 0.75, station.x, 0.5, station.z, station.id); return; }
  if (t === 'partition') { box(THREE, group, mats.wall, 2.1, 2.2, 0.12, station.x, 1.1, station.z, station.id); return; }
  if (t === 'water-fountain') { box(THREE, group, mats.metal, 0.8, 1.1, 0.55, station.x, 0.55, station.z, station.id); return; }
  const w = t === 'cafeteria-table' ? 2.8 : t === 'meeting-table' ? 3.3 : 2.4;
  box(THREE, group, mats.wood, w, 0.72, 1.3, station.x, 0.36, station.z, station.id);
  if (t === 'cafeteria-table' || t === 'meeting-table' || t === 'study-table') {
    for (const side of [-1, 1]) {
      box(THREE, group, mats.blue, 0.58, 0.44, 0.5, station.x, 0.22, station.z + side * 1.0, `${station.id}_chair_${side < 0 ? 'n' : 's'}`);
    }
  }
}

function addCeilingFixtures(THREE, group, mats, def) {
  const countX = Math.max(2, Math.floor(def.size.width / 5));
  const countZ = Math.max(2, Math.floor(def.size.depth / 5));
  for (let rz = 0; rz < countZ; rz += 1) {
    for (let cx = 0; cx < countX; cx += 1) {
      const x = -def.size.width / 2 + (cx + 1) * (def.size.width / (countX + 1));
      const z = -def.size.depth / 2 + (rz + 1) * (def.size.depth / (countZ + 1));
      box(THREE, group, mats.light, 1.4, 0.08, 0.24, x, def.size.height - 0.1, z, `${def.id}_ceiling_${rz}_${cx}`);
    }
  }
}

export function mountColegioAgvInterior3D({ THREE, parent, interiorId }) {
  const def = getInteriorDefinition(interiorId);
  if (!def || !THREE || !parent) return null;
  const group = new THREE.Group();
  group.name = interiorId;
  group.userData.agvDisposable = true;
  group.userData.interiorDefinition = def;

  const mats = {
    floor: new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.9 }),
    wall: new THREE.MeshStandardMaterial({ color: 0xf3f6f8, roughness: 0.85 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x0d5ea6, roughness: 0.72 }),
    blue: new THREE.MeshStandardMaterial({ color: 0x155f9e, roughness: 0.8 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x916f4f, roughness: 0.88 }),
    gray: new THREE.MeshStandardMaterial({ color: 0x737a7f, roughness: 0.85 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x20292f, roughness: 0.72 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xb8c0c6, roughness: 0.55, metalness: 0.35 }),
    light: new THREE.MeshStandardMaterial({ color: 0xf3f0db, emissive: 0x4a471e, emissiveIntensity: 0.14, roughness: 0.6 }),
    red: new THREE.MeshStandardMaterial({ color: 0xb42626, roughness: 0.7 }),
    cork: new THREE.MeshStandardMaterial({ color: 0xa87a4d, roughness: 0.95 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xa8c5d1, roughness: 0.2, metalness: 0.08 })
  };

  box(THREE, group, mats.floor, def.size.width, 0.15, def.size.depth, 0, -0.075, 0, `${interiorId}_floor`);
  const wh = def.size.height, wt = 0.18;
  box(THREE, group, mats.wall, def.size.width, wh, wt, 0, wh / 2, -def.size.depth / 2, `${interiorId}_wall_n`);
  box(THREE, group, mats.wall, def.size.width, wh, wt, 0, wh / 2, def.size.depth / 2, `${interiorId}_wall_s`);
  box(THREE, group, mats.wall, wt, wh, def.size.depth, -def.size.width / 2, wh / 2, 0, `${interiorId}_wall_w`);
  box(THREE, group, mats.wall, wt, wh, def.size.depth, def.size.width / 2, wh / 2, 0, `${interiorId}_wall_e`);
  box(THREE, group, mats.accent, def.size.width - 0.3, 0.14, 0.12, 0, 0.75, -def.size.depth / 2 + 0.12, `${interiorId}_blue_band`);

  addCeilingFixtures(THREE, group, mats, def);
  for (const station of def.stations) addStation(THREE, group, mats, station);
  parent.add(group);
  return group;
}

export function disposeInterior3D(group) {
  if (!group) return;
  const geometries = new Set();
  const materials = new Set();
  group.traverse((object) => {
    if (object.geometry && !geometries.has(object.geometry)) { geometries.add(object.geometry); object.geometry.dispose?.(); }
    const mats = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of mats) {
      if (!material || materials.has(material)) continue;
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) value.dispose?.();
      material.dispose?.();
    }
  });
  group.removeFromParent?.();
}
