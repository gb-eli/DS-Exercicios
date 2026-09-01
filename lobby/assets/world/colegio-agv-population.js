function disposeGroup(group) {
  if (!group) return;
  const geometries = new Set();
  const materials = new Set();
  group.traverse((obj) => {
    if (obj.geometry && !geometries.has(obj.geometry)) { geometries.add(obj.geometry); obj.geometry.dispose?.(); }
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) if (mat && !materials.has(mat)) { materials.add(mat); mat.dispose?.(); }
  });
  group.removeFromParent?.();
}

function damp(current, target, speed, delta) {
  const t = 1 - Math.exp(-Math.max(0, speed) * Math.max(0, delta));
  return current + (target - current) * t;
}

function shortestAngle(from, to) {
  let d = (to - from + Math.PI) % (Math.PI * 2) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return from + d;
}

export function mountColegioAgvPopulation3D({ THREE, parent, controller }) {
  if (!THREE || !parent || !controller || controller.hasCoreNpcSystem()) return null;
  const root = new THREE.Group();
  root.name = 'colegio_agv_population_fallback';
  root.userData.lowCostNpcFallback = true;
  parent.add(root);

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x285d91, roughness: 0.82 });
  const staffMat = new THREE.MeshStandardMaterial({ color: 0x50585e, roughness: 0.82 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xc9a17d, roughness: 0.9 });
  const proxies = new Map();

  for (const npc of controller.getNpcDefinitions()) {
    const group = new THREE.Group();
    group.name = npc.id;
    group.userData.npcId = npc.id;
    group.userData.role = npc.role;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 1.2, 8), npc.role?.includes('student') ? bodyMat : staffMat);
    body.position.y = 0.72;
    body.name = `${npc.id}_body`;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), headMat);
    head.position.y = 1.55;
    head.name = `${npc.id}_head`;
    group.add(body, head);
    root.add(group);
    proxies.set(npc.id, { group, body, targetX: npc.x || 0, targetZ: npc.z || 0, targetHeading: 0, clock: npc.phaseOffset || 0 });
  }

  function update(snapshots = controller.getNpcSnapshots(), delta = 1 / 30, options = {}) {
    const player = options.player || null;
    const maxDistance = Number.isFinite(options.maxDistance) ? options.maxDistance : Infinity;
    for (const npc of snapshots) {
      const proxy = proxies.get(npc.id);
      if (!proxy) continue;
      proxy.targetX = npc.x;
      proxy.targetZ = npc.z;
      proxy.targetHeading = npc.heading || 0;
      proxy.group.position.x = damp(proxy.group.position.x, proxy.targetX, 9, delta);
      proxy.group.position.z = damp(proxy.group.position.z, proxy.targetZ, 9, delta);
      proxy.group.rotation.y = damp(proxy.group.rotation.y, shortestAngle(proxy.group.rotation.y, proxy.targetHeading), 10, delta);
      proxy.clock += delta * (0.8 + Math.max(0, Number(npc.speed) || 0));
      const moving = Math.hypot(proxy.targetX - proxy.group.position.x, proxy.targetZ - proxy.group.position.z) > 0.035;
      proxy.body.rotation.z = moving ? Math.sin(proxy.clock * 6) * 0.025 : Math.sin(proxy.clock * 1.3) * 0.008;
      proxy.group.position.y = moving ? Math.abs(Math.sin(proxy.clock * 6)) * 0.018 : 0;
      if (player) {
        const distance = Math.hypot((player.x || 0) - proxy.group.position.x, (player.z || 0) - proxy.group.position.z);
        proxy.group.visible = distance <= maxDistance;
      } else proxy.group.visible = true;
    }
  }
  update(controller.getNpcSnapshots(), 1);

  return { group: root, update, dispose: () => disposeGroup(root) };
}
