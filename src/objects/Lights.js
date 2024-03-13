import { Group, SpotLight, PointLight, AmbientLight, HemisphereLight, Color, Scene } from 'three';
import * as THREE from 'three';

import Dat from 'dat.gui';

export default class BasicLights extends Group {
  constructor(...args) {
    super(...args);

    // const point = new PointLight(0xFFFFFF, 1, 10, 1);
    // const dir = new SpotLight(0xFFFFFF, 0.8, 7, 0.8, 1, 1);
    // const ambi = new AmbientLight( 0x404040 , 0.66);
    // const hemi = new HemisphereLight( 0xffffbb, 0x080820, 1.15 );
    // const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    // dirLight.position.set(5, 10, 3);
    // dirLight.target.position.set(0, 0, 0);
    // this.add(dirLight);
    // this.add(dirLight.target);

    // // dir.position.set(5, 1, 2);
    // // dir.target.position.set(0,0,0);

    // // this.add(point)
    // // point.position.set(0, 1, 5);

    // // const pointHelper = new THREE.PointLightHelper(point);
    // // this.add(pointHelper);
    // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
    // this.add(dirLightHelper);
    
    // const gui = new Dat.GUI();
    // const dirLightConfig = gui.addFolder('DirectionalLight');
    // dirLightConfig.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('color');
    // dirLightConfig.add(dirLight, 'intensity', 0, 2, 0.01);

    // const pointConfig = gui.addFolder('PointLight');
    // pointConfig.addColor(new ColorGUIHelper(point, 'color'), 'value').name('color');
    // pointConfig.add(point, 'intensity', 0, 2, 0.01);
    // pointConfig.add(point, 'distance', 0, 40);
    // makeXYZGUI(pointConfig, point.position, updateLight(pointHelper));

    // this.add(ambi, hemi, dir);
    
  }
}

function updateLight(helper) {
  helper.target && helper.target.updateMatrixWorld();
  helper.update();
}

function makeXYZGUI(toAdd, vector3, onChangeFn) {
  toAdd.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  toAdd.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  toAdd.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  toAdd.open();
}

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return Math.radToDeg(this.obj[this.prop]);
  }
  set value(v) {
    this.obj[this.prop] = Math.degToRad(v);
  }
}
