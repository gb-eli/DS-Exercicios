export const MESH_BVH_COLLIDER_VERSION=1;

function pushTri(out,a,b,c){out.push(...a,...b,...c);}
function addBox(out,{minX,maxX,minZ,maxZ},y0=0,y1=12){
  const A=[minX,y0,minZ],B=[maxX,y0,minZ],C=[maxX,y0,maxZ],D=[minX,y0,maxZ],E=[minX,y1,minZ],F=[maxX,y1,minZ],G=[maxX,y1,maxZ],H=[minX,y1,maxZ];
  pushTri(out,A,C,B);pushTri(out,A,D,C);pushTri(out,E,F,G);pushTri(out,E,G,H);
  pushTri(out,A,E,H);pushTri(out,A,H,D);pushTri(out,B,C,G);pushTri(out,B,G,F);
  pushTri(out,A,B,F);pushTri(out,A,F,E);pushTri(out,D,H,G);pushTri(out,D,G,C);
}

export function createAabbColliderGeometry({THREE,colliders=[],height=12}={}){
  if(!THREE?.BufferGeometry||!THREE?.Float32BufferAttribute)throw new Error('three_geometry_api_missing');
  const positions=[];for(const c of colliders||[])if(Number.isFinite(c?.minX)&&Number.isFinite(c?.maxX)&&Number.isFinite(c?.minZ)&&Number.isFinite(c?.maxZ))addBox(positions,c,0,height);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.computeBoundingBox?.();geometry.computeBoundingSphere?.();
  geometry.userData={...(geometry.userData||{}),agvColliderBoxes:(colliders||[]).length,agvColliderTriangles:Math.floor(positions.length/9)};
  return geometry;
}

export function createMeshBVHStaticCollider({THREE,MeshBVH,colliders=[],height=12}={}){
  if(typeof MeshBVH!=='function')throw new Error('mesh_bvh_constructor_missing');
  const geometry=createAabbColliderGeometry({THREE,colliders,height}),tree=new MeshBVH(geometry,{maxLeafTris:12});
  const sphere=new THREE.Sphere(new THREE.Vector3(),1),ray=new THREE.Ray(new THREE.Vector3(),new THREE.Vector3(0,0,1));
  let queries=0,hits=0;
  function intersectsSphere({x=0,y=1,z=0,radius=.6}={}){queries++;sphere.center.set(Number(x)||0,Number(y)||0,Number(z)||0);sphere.radius=Math.max(.05,Number(radius)||.6);const hit=!!tree.intersectsSphere(sphere);if(hit)hits++;return hit;}
  function raycastFirst({from,to}={}){if(!from||!to)return null;queries++;ray.origin.set(Number(from.x)||0,Number(from.y)||.6,Number(from.z)||0);ray.direction.set((Number(to.x)||0)-ray.origin.x,(Number(to.y)||.6)-ray.origin.y,(Number(to.z)||0)-ray.origin.z);const max=ray.direction.length();if(max<1e-5)return null;ray.direction.multiplyScalar(1/max);const hit=tree.raycastFirst(ray,THREE.DoubleSide,0,max);if(hit)hits++;return hit||null;}
  function diagnostics(){return Object.freeze({ready:true,kind:'three-mesh-bvh',boxes:geometry.userData.agvColliderBoxes||0,triangles:geometry.userData.agvColliderTriangles||0,queries,hits});}
  function dispose(){try{geometry.dispose?.();}catch{}}
  return Object.freeze({intersectsSphere,raycastFirst,diagnostics,dispose,geometry,tree});
}
