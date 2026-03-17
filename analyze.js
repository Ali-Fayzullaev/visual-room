const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/cozy_modern_living_room/scene.gltf', 'utf8'));
const mn = d.materials.map(m => m.name);

console.log('=== ALL MATERIALS ===');
mn.forEach((name, i) => console.log(i + ': ' + name));

console.log('\n=== ALL MESHES ===');
d.meshes.forEach((mesh, i) => {
  mesh.primitives.forEach((p, pi) => {
    const matName = mn[p.material];
    const acc = d.accessors[p.attributes.POSITION];
    console.log('mesh[' + i + '] prim[' + pi + '] mat=' + matName + ' min=' + JSON.stringify(acc.min) + ' max=' + JSON.stringify(acc.max));
  });
});

console.log('\n=== NODES referencing meshes ===');
d.nodes.forEach((node, i) => {
  if (node.mesh !== undefined) {
    const mesh = d.meshes[node.mesh];
    const matName = mn[mesh.primitives[0].material];
    console.log('node[' + i + '] name="' + (node.name || '') + '" mesh=' + node.mesh + ' mat=' + matName);
  }
});
