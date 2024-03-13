import * as THREE from 'three';
import { BoxBufferGeometry, Mesh, MeshPhongMaterial, Vector3 } from 'three';
import '../Trees/Tree.js';
import '../Trees/TreeGeometry.js';

import Fire from './Fire.js'

export default class Land extends THREE.Group {
  constructor() {    
    super();
    this.name = 'land';

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 500, 500 ), new THREE.MeshPhongMaterial( { color: 0x999999 } ));
    plane.rotation.x = - Math.PI / 2;

    this.fire = new Fire(new Vector3(0, 0.3, 0), 5);

    const stoneGeom = new THREE.DodecahedronGeometry(5, 1);
    stoneGeom.scale(0.08, 0.08, 0.08);
    const stoneMat = new THREE.MeshLambertMaterial({color: 0x555555});

    for (let i = 0; i < 360; i+= 15) {
      const x = Math.cos(i) * 3.2;
      const z = Math.sin(i) * 3.2;

      const stone = new THREE.Mesh(stoneGeom, stoneMat);
      stone.position.set(x, 0, z);
      this.add(stone);
    }
    
    for (let i = 0; i < 360; i+= 20 ) {
      for (let r = 15; r < 40; r+= 9) {
        const x = Math.cos(i) * r + Math.random() * 2;
        const z = Math.sin(i) * r + Math.random() * 2;
        
        let treeShape = new THREE.Tree({
          generations : 4,        // # for branch' hierarchy
          length      : 5.0,      // length of root branch
          uvLength    : 20.0,     // uv.v ratio against geometry length (recommended is generations * length)
          radius      : 0.2,      // radius of root branch
          radiusSegments : 8,     // # of radius segments for each branch geometry
          heightSegments : 8      // # of height segments for each branch geometry
        });
    
        let treeGeom = THREE.TreeGeometry.build(treeShape);

        const tree = new THREE.Mesh(treeGeom, new THREE.MeshLambertMaterial({}));
        tree.castShadow = true;
        tree.position.set(x, 0.5, z);
        this.add(tree);
      }
    }

    this.add(plane, this.fire);
  }
  
  update(timeStamp) {
    this.fire.update(timeStamp);
  }
}
