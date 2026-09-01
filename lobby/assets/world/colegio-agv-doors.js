import { ROOM_ZONES } from './colegio-agv-data.js';

function damp(current, target, speed, delta) {
  const t = 1 - Math.exp(-Math.max(0, speed) * Math.max(0, delta));
  return current + (target - current) * t;
}

export function mountColegioAgvDoors3D({ THREE, parent, controller }) {
  if (!THREE || !parent || !controller) return null;
  const group = new THREE.Group();
  group.name = 'colegio_agv_interactive_doors';
  parent.add(group);
  const material = new THREE.MeshStandardMaterial({ color: 0x164f82, roughness: 0.72, transparent: true, opacity: 0.96 });
  const doors = new Map();

  for (const room of ROOM_ZONES) {
    const horizontalWall = Math.abs(room.door.z - room.z) >= Math.abs(room.door.x - room.x);
    const geometry = horizontalWall
      ? new THREE.BoxGeometry(1.35, 2.15, 0.12)
      : new THREE.BoxGeometry(0.12, 2.15, 1.35);
    const pivot = new THREE.Group();
    pivot.name = `${room.id}_door_pivot`;
    pivot.position.set(room.door.x, 0, room.door.z);
    const mesh = new THREE.Mesh(geometry, material.clone?.() || material);
    mesh.position.set(0, 1.075, 0);
    mesh.name = `${room.id}_door_visual`;
    mesh.userData.interaction = 'enter-building';
    mesh.userData.interactableId = `${room.id}_entry`;
    mesh.userData.targetId = room.interiorId;
    mesh.userData.roomId = room.id;
    pivot.add(mesh);
    group.add(pivot);
    doors.set(room.interiorId, { mesh, pivot, horizontalWall, openness: 0 });
  }

  function update(delta = 1 / 60) {
    for (const [interiorId, door] of doors) {
      const target = controller.isDoorOpen(interiorId) ? 1 : 0;
      door.openness = damp(door.openness, target, 10, delta);
      const amount = door.openness;
      // Movimento de correr lateralmente evita depender da direção das dobradiças reais.
      door.mesh.position.x = door.horizontalWall ? amount * 0.74 : 0;
      door.mesh.position.z = door.horizontalWall ? 0 : amount * 0.74;
      door.mesh.material.opacity = 0.96 - amount * 0.42;
      door.mesh.userData.open = target > 0.5;
      door.mesh.userData.openAmount = amount;
    }
  }

  function getDoorAnimationState() {
    return Object.fromEntries([...doors].map(([id, door]) => [id, Number(door.openness.toFixed(3))]));
  }

  update(1);
  return { group, update, getDoorAnimationState };
}
