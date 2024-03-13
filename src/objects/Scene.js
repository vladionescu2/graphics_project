import { Group } from 'three';
import Land from './Land/Land.js';
import BasicLights from './Lights.js';
import * as THREE from 'three';

export default class SeedScene extends Group {
  constructor() {
    super();

    const land = new Land();
    this.land = land;

    const lights = new BasicLights();

    this.add(land, lights);
  }

  update(timeStamp) {
    // this.rotation.y = timeStamp / 10000;
    this.land.update(timeStamp);
  }
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