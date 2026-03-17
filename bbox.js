const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/cozy_modern_living_room/scene.gltf', 'utf8'));
const bin = fs.readFileSync('public/cozy_modern_living_room/scene.bin');
const mn = d.materials.map(m => m.name);
const targets = ['Structure_Windows','Backdrop','Sofa','Carpet','Structure','material_14','Painting','Shelf','CoffeeTable'];
const done = new Set();
d.meshes.forEach((mesh) => {
  const mat = mn[mesh.primitives[0].material];
  if (targets.indexOf(mat) === -1 || done.has(mat)) return;
  done.add(mat);
  const acc = d.accessors[mesh.primitives[0].attributes.POSITION];
  const bv = d.bufferViews[acc.bufferView];
  const off = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  const count = acc.count;
  let minX=1e9, minY=1e9, minZ=1e9, maxX=-1e9, maxY=-1e9, maxZ=-1e9;
  for (let i = 0; i < count; i++) {
    const base = off + i * 12;
    const x = bin.readFloatLE(base);
    const y = bin.readFloatLE(base + 4);
    const z = bin.readFloatLE(base + 8);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
  const cx = ((minX+maxX)/2).toFixed(2);
  const cy = ((minY+maxY)/2).toFixed(2);
  const cz = ((minZ+maxZ)/2).toFixed(2);
  console.log(mat + ' | center:[' + cx + ', ' + cy + ', ' + cz + '] | min:[' + minX.toFixed(2) + ', ' + minY.toFixed(2) + ', ' + minZ.toFixed(2) + '] | max:[' + maxX.toFixed(2) + ', ' + maxY.toFixed(2) + ', ' + maxZ.toFixed(2) + ']');
});
