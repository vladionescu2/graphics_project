/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three';
import SeedScene from './objects/Scene.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from 'three';
import Stats from 'stats.js';

import Dat from 'dat.gui';
import init from 'three-dat.gui'; // Import initialization method
init(Dat); // Init three-dat.gui with Dat

const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true});
const seedScene = new SeedScene();

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


// scene
scene.add(seedScene);
window.scene = scene;
window.THREE = THREE;

// scene.fog = new THREE.Fog(0x000000, 30, 60);

// camera
camera.position.set(6,3,-10);
camera.lookAt(new Vector3(0,0,0));
const controls = new OrbitControls( camera, renderer.domElement );

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  stats.begin();
  renderer.render(scene, camera);
  seedScene.update && seedScene.update(timeStamp);
  stats.end();
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => { 
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

// dom
document.body.style.margin = 0;
document.body.appendChild( renderer.domElement );

// document.querySelector('canvas').style.background = 'black';

