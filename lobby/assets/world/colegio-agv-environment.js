import {
  CAMPUS_BLOCKS,
  OUTDOOR_FEATURES,
  FRONT_FACADE_DETAILS,
  EXTERIOR_FURNITURE,
  VEGETATION,
  FENCES,
  GATES,
  COURT_MARKINGS,
  WAYFINDING_SIGNS,
  UTILITY_POINTS,
  SAFETY_POINTS,
  NIGHT_FIXTURES
} from './colegio-agv-data.js';

function addBox(THREE, parent, material, { width, depth, height = 0.12, x = 0, y = height / 2, z = 0, name = '' }) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.name = name;
  mesh.castShadow = height > 0.5;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addPitchedRoof(THREE, parent, material, block) {
  const halfDepth = block.depth / 2 + 0.4;
  const rise = Math.min(1.25, block.depth * 0.08);
  const angle = Math.atan2(rise, halfDepth);
  const slopeDepth = Math.sqrt(halfDepth * halfDepth + rise * rise);
  for (const side of [-1, 1]) {
    const roof = new THREE.Mesh(new THREE.BoxGeometry(block.width + 0.8, 0.18, slopeDepth), material);
    roof.position.set(block.x, block.height + rise / 2 + 0.14, block.z + side * halfDepth / 2);
    roof.rotation.x = side * angle;
    roof.name = `${block.id}_roof_${side < 0 ? 'n' : 's'}`;
    parent.add(roof);
  }
}

function createBench(THREE, parent, materials, item) {
  const group = new THREE.Group();
  group.name = item.id;
  group.position.set(item.x, 0, item.z);
  group.rotation.y = item.rotation || 0;
  addBox(THREE, group, materials.blue, { width: 2.3, depth: 0.42, height: 0.16, y: 0.72, name: `${item.id}_seat` });
  addBox(THREE, group, materials.blue, { width: 2.3, depth: 0.14, height: 0.72, y: 1.03, z: 0.22, name: `${item.id}_back` });
  for (const x of [-0.86, 0.86]) {
    addBox(THREE, group, materials.dark, { width: 0.13, depth: 0.13, height: 0.72, x, y: 0.36, name: `${item.id}_leg` });
  }
  parent.add(group);
}

function createTree(THREE, parent, materials, item) {
  const group = new THREE.Group();
  group.name = item.id;
  group.position.set(item.x, 0, item.z);
  const scale = item.scale || 1;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.24 * scale, 2.6 * scale, 8), materials.trunk);
  trunk.position.y = 1.3 * scale;
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1.25 * scale, 10, 8), materials.leaf);
  crown.position.y = 3.05 * scale;
  group.add(trunk, crown);
  parent.add(group);
}

function createShrub(THREE, parent, materials, item) {
  const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.7 * (item.scale || 1), 9, 7), materials.leaf);
  shrub.scale.y = 0.75;
  shrub.position.set(item.x, 0.55, item.z);
  shrub.name = item.id;
  parent.add(shrub);
}

function createFrontFacade(THREE, parent, materials) {
  const group = new THREE.Group();
  group.name = FRONT_FACADE_DETAILS.id;
  group.position.z = FRONT_FACADE_DETAILS.z;

  addBox(THREE, group, materials.roof, {
    width: FRONT_FACADE_DETAILS.canopy.width,
    depth: FRONT_FACADE_DETAILS.canopy.depth,
    height: 0.22,
    x: FRONT_FACADE_DETAILS.canopy.x,
    y: FRONT_FACADE_DETAILS.canopy.y,
    name: 'colegio_agv_facade_canopy'
  });

  const beamGeometry = new THREE.BoxGeometry(0.42, 4.9, 0.42);
  for (const x of FRONT_FACADE_DETAILS.vPillars) {
    const left = new THREE.Mesh(beamGeometry, materials.blue);
    left.position.set(x - 1.05, 2.3, 0);
    left.rotation.z = -0.34;
    left.name = `colegio_agv_vpillar_${String(x).replace('-', 'm')}_l`;
    const right = new THREE.Mesh(beamGeometry, materials.blue);
    right.position.set(x + 1.05, 2.3, 0);
    right.rotation.z = 0.34;
    right.name = `colegio_agv_vpillar_${String(x).replace('-', 'm')}_r`;
    group.add(left, right);
  }

  // Entrada envidraçada.
  addBox(THREE, group, materials.glass, {
    width: FRONT_FACADE_DETAILS.entrance.width,
    depth: 0.14,
    height: FRONT_FACADE_DETAILS.entrance.height,
    x: FRONT_FACADE_DETAILS.entrance.x,
    y: 1.48,
    z: 2.05,
    name: 'colegio_agv_facade_main_door'
  });

  // Janelas com moldura azul e grades simples, inspiradas nas fotos públicas.
  for (const x of FRONT_FACADE_DETAILS.windowBays) {
    addBox(THREE, group, materials.blue, { width: 3.55, depth: 0.12, height: 2.0, x, y: 2.2, z: 2.05, name: `colegio_agv_window_frame_${x}` });
    addBox(THREE, group, materials.glass, { width: 3.05, depth: 0.14, height: 1.55, x, y: 2.2, z: 2.12, name: `colegio_agv_window_glass_${x}` });
    for (let i = -1; i <= 1; i += 1) {
      addBox(THREE, group, materials.dark, { width: 0.045, depth: 0.08, height: 1.55, x: x + i * 0.75, y: 2.2, z: 2.22, name: `colegio_agv_window_bar_${x}_${i}` });
    }
  }

  // Escada principal.
  for (let i = 0; i < 7; i += 1) {
    addBox(THREE, group, materials.patio, {
      width: 5.4,
      depth: 0.65,
      height: 0.18,
      x: -8.6,
      y: 0.09 + i * 0.14,
      z: 4.7 - i * 0.55,
      name: `colegio_agv_entry_step_${i + 1}`
    });
  }

  // Rampa frontal acessível.
  const ramp = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 10.5), materials.patio);
  ramp.position.set(-2.2, 0.36, 4.5);
  ramp.rotation.x = -0.055;
  ramp.name = 'colegio_agv_entry_ramp';
  group.add(ramp);

  // Corrimãos em ambos os lados da rampa.
  for (const x of [-3.15, -1.25]) {
    addBox(THREE, group, materials.metal, { width: 0.08, depth: 10.2, height: 0.08, x, y: 1.0, z: 4.4, name: `colegio_agv_ramp_rail_${x}` });
  }

  // Placa frontal sem depender de assets externos.
  addBox(THREE, group, materials.sign, { width: 11, depth: 0.13, height: 1.15, x: 4.8, y: 2.85, z: 2.14, name: 'colegio_agv_front_sign' });

  parent.add(group);
}


function createWayfindingSign(THREE, parent, materials, item) {
  const group = new THREE.Group();
  group.name = item.id;
  group.position.set(item.x, 0, item.z);
  group.rotation.y = item.rotation || 0;
  addBox(THREE, group, materials.dark, { width: 0.12, depth: 0.12, height: 1.9, x: 0, y: 0.95, name: `${item.id}_post` });
  const plate = addBox(THREE, group, materials.blue, { width: 3.4, depth: 0.12, height: 0.85, x: 0, y: 1.85, name: `${item.id}_plate` });
  plate.userData.label = item.label;
  parent.add(group);
}

function createUtility(THREE, parent, materials, item) {
  if (item.kind === 'water-fountain') {
    addBox(THREE, parent, materials.metal, { width: 0.72, depth: 0.52, height: 1.08, x: item.x, y: 0.54, z: item.z, name: item.id });
    return;
  }
  if (item.kind === 'air-conditioner') {
    addBox(THREE, parent, materials.light, { width: 1.25, depth: 0.35, height: 0.62, x: item.x, y: item.y || 3.2, z: item.z, name: item.id });
  }
}

function createSafetyPoint(THREE, parent, materials, item) {
  if (item.kind === 'fire-extinguisher') {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.7, 10), materials.red);
    mesh.position.set(item.x, 0.48, item.z);
    mesh.name = item.id;
    parent.add(mesh);
    return;
  }
  if (item.kind === 'exit-sign') {
    const sign = addBox(THREE, parent, materials.exit, { width: 1.3, depth: 0.08, height: 0.45, x: item.x, y: 2.65, z: item.z, name: item.id });
    sign.userData.label = 'SAÍDA';
  }
}

function createNightFixtures(THREE, parent, materials) {
  const group = new THREE.Group();
  group.name = 'colegio_agv_night_fixtures';
  const actualLights = [];
  for (const [index, item] of NIGHT_FIXTURES.entries()) {
    const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.28), materials.emissive);
    fixture.position.set(item.x, item.y, item.z);
    fixture.name = item.id;
    group.add(fixture);
    // Mantém no máximo 2 luzes reais para não penalizar celulares; os demais são emissivos.
    if (index < 2 && THREE.PointLight) {
      const light = new THREE.PointLight(0xfff2c2, 0, 13, 2);
      light.position.set(item.x, item.y - 0.2, item.z + 0.5);
      light.name = `${item.id}_point`;
      group.add(light);
      actualLights.push(light);
    }
  }
  parent.add(group);
  return { group, actualLights };
}

function createPatternedWalkway(THREE, parent, materials, feature) {
  const cols = 5;
  const rows = 16;
  const tw = feature.width / cols;
  const td = feature.depth / rows;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const mat = ((r + c + Math.floor(r / 2)) % 2 === 0) ? materials.walkLight : materials.walkDark;
      addBox(THREE, parent, mat, {
        width: tw,
        depth: td,
        height: 0.055,
        x: feature.x - feature.width / 2 + tw / 2 + c * tw,
        y: 0.04,
        z: feature.z - feature.depth / 2 + td / 2 + r * td,
        name: `${feature.id}_tile_${r}_${c}`
      });
    }
  }
}

export function mountColegioAgvEnvironment3D({ THREE, parent, bounds }) {
  if (!THREE || !parent) return null;
  const group = new THREE.Group();
  group.name = 'colegio_agv_exterior';

  const materials = {
    wall: new THREE.MeshStandardMaterial({ color: 0xf2f6f8, roughness: 0.86 }),
    blue: new THREE.MeshStandardMaterial({ color: 0x0b5fa8, roughness: 0.72 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x6f777c, roughness: 0.95 }),
    ground: new THREE.MeshStandardMaterial({ color: 0x819a72, roughness: 1 }),
    patio: new THREE.MeshStandardMaterial({ color: 0xc9c8c3, roughness: 1 }),
    court: new THREE.MeshStandardMaterial({ color: 0x2f73a9, roughness: 0.9 }),
    road: new THREE.MeshStandardMaterial({ color: 0x555b60, roughness: 1 }),
    sidewalk: new THREE.MeshStandardMaterial({ color: 0xb8b6b1, roughness: 1 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x8ab4c8, roughness: 0.25, metalness: 0.05 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xc7cbd0, roughness: 0.6, metalness: 0.35 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x31383d, roughness: 0.85 }),
    sign: new THREE.MeshStandardMaterial({ color: 0xe8edf0, roughness: 0.7 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x4e7f43, roughness: 1 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x6f523d, roughness: 1 }),
    walkLight: new THREE.MeshStandardMaterial({ color: 0xe2dfd5, roughness: 1 }),
    walkDark: new THREE.MeshStandardMaterial({ color: 0x50565a, roughness: 1 }),
    courtLine: new THREE.MeshStandardMaterial({ color: 0xf2f2ec, roughness: 0.9 }),
    red: new THREE.MeshStandardMaterial({ color: 0xb32626, roughness: 0.72 }),
    light: new THREE.MeshStandardMaterial({ color: 0xe7ecef, roughness: 0.65 }),
    exit: new THREE.MeshStandardMaterial({ color: 0x1d8a52, emissive: 0x0b331f, emissiveIntensity: 0.35, roughness: 0.55 }),
    emissive: new THREE.MeshStandardMaterial({ color: 0xfff4ca, emissive: 0x665b21, emissiveIntensity: 0.18, roughness: 0.5 })
  };

  const worldWidth = bounds.maxX - bounds.minX;
  const worldDepth = bounds.maxZ - bounds.minZ;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(worldWidth, worldDepth), materials.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = 'colegio_agv_ground';
  group.add(ground);

  addBox(THREE, group, materials.road, { width: worldWidth, depth: 4.8, height: 0.1, x: 0, y: 0.03, z: 59.2, name: 'colegio_agv_rua_julia_da_costa' });
  addBox(THREE, group, materials.sidewalk, { width: worldWidth, depth: 2.1, height: 0.09, x: 0, y: 0.04, z: 56.9, name: 'colegio_agv_front_sidewalk' });

  for (const feature of OUTDOOR_FEATURES) {
    if (feature.kind === 'patterned-walkway') {
      createPatternedWalkway(THREE, group, materials, feature);
      continue;
    }
    const material = feature.kind === 'sports-court' ? materials.court : feature.kind === 'green-area' ? materials.ground : materials.patio;
    addBox(THREE, group, material, { width: feature.width, depth: feature.depth, height: 0.11, x: feature.x, z: feature.z, name: feature.id });
  }

  for (const block of CAMPUS_BLOCKS) {
    if (block.facade === 'open-corridor') {
      addBox(THREE, group, materials.roof, { width: block.width, depth: block.depth, height: 0.18, x: block.x, y: block.height, z: block.z, name: `${block.id}_canopy` });
      continue;
    }
    addBox(THREE, group, materials.wall, { width: block.width, depth: block.depth, height: block.height, x: block.x, z: block.z, name: block.id });
    addBox(THREE, group, materials.blue, { width: block.width + 0.04, depth: block.depth + 0.04, height: 0.7, x: block.x, y: 0.35, z: block.z, name: `${block.id}_blue_base` });
    if (block.roof === 'pitched' || block.roof === 'low-pitched') addPitchedRoof(THREE, group, materials.roof, block);
    else addBox(THREE, group, materials.roof, { width: block.width + 0.7, depth: block.depth + 0.7, height: 0.24, x: block.x, y: block.height + 0.12, z: block.z, name: `${block.id}_roof` });
  }

  createFrontFacade(THREE, group, materials);

  for (const item of EXTERIOR_FURNITURE) {
    if (item.kind === 'bench') createBench(THREE, group, materials, item);
    else addBox(THREE, group, materials.sign, { width: 1.8, depth: 0.16, height: 2.2, x: item.x, y: 1.1, z: item.z, name: item.id });
  }

  for (const item of WAYFINDING_SIGNS) createWayfindingSign(THREE, group, materials, item);
  for (const item of UTILITY_POINTS) createUtility(THREE, group, materials, item);
  for (const item of SAFETY_POINTS) createSafetyPoint(THREE, group, materials, item);
  const night = createNightFixtures(THREE, group, materials);

  for (const item of VEGETATION) {
    if (item.kind === 'tree') createTree(THREE, group, materials, item);
    else createShrub(THREE, group, materials, item);
  }

  for (const fence of FENCES) {
    addBox(THREE, group, materials.dark, { width: fence.width, depth: fence.depth, height: fence.height, x: fence.x, y: fence.height / 2, z: fence.z, name: fence.id });
  }
  for (const gate of GATES) {
    const gateGroup = new THREE.Group();
    gateGroup.name = gate.id;
    gateGroup.position.set(gate.x, 0, gate.z);
    for (let i = 0; i < 9; i += 1) {
      addBox(THREE, gateGroup, materials.dark, { width: 0.08, depth: 0.1, height: gate.height, x: -gate.width / 2 + i * (gate.width / 8), y: gate.height / 2, name: `${gate.id}_bar_${i}` });
    }
    addBox(THREE, gateGroup, materials.dark, { width: gate.width, depth: 0.1, height: 0.09, y: 0.2, name: `${gate.id}_rail_bottom` });
    addBox(THREE, gateGroup, materials.dark, { width: gate.width, depth: 0.1, height: 0.09, y: gate.height - 0.2, name: `${gate.id}_rail_top` });
    group.add(gateGroup);
  }

  for (const line of COURT_MARKINGS) {
    addBox(THREE, group, materials.courtLine, { width: line.width, depth: line.depth, height: 0.025, x: line.x, y: 0.13, z: line.z, name: line.id });
  }

  function setWorldTimeMode(mode = 'cycle') {
    const isNight = mode === 'night';
    materials.emissive.emissiveIntensity = isNight ? 1.1 : 0.18;
    materials.exit.emissiveIntensity = isNight ? 0.8 : 0.35;
    for (const light of night.actualLights) light.intensity = isNight ? 1.1 : 0;
  }

  function setWeatherState(weather = 'clear') {
    const kind = String(weather || 'clear').toLowerCase();
    const wet = kind === 'rain' || kind === 'storm';
    const foggy = kind === 'fog';
    materials.road.roughness = wet ? 0.48 : 1;
    materials.sidewalk.roughness = wet ? 0.68 : 1;
    materials.patio.roughness = wet ? 0.7 : 1;
    materials.court.roughness = wet ? 0.62 : 0.9;
    materials.ground.roughness = kind === 'snow' ? 0.86 : 1;
    group.userData.weather = kind;
    group.userData.surfaceWet = wet;
    group.userData.visibilityReduced = foggy || kind === 'storm';
    return { weather: kind, wet, visibilityReduced: group.userData.visibilityReduced };
  }

  parent.add(group);
  return { group, materials, setWorldTimeMode, setWeatherState, night };
}

export function disposeColegioAgvEnvironment3D(handle) {
  const group = handle?.group || handle;
  if (!group) return;
  const geometries = new Set();
  const materials = new Set();
  group.traverse((object) => {
    if (object.geometry && !geometries.has(object.geometry)) {
      geometries.add(object.geometry);
      object.geometry.dispose?.();
    }
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
