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

class RGBAColorGUIHelper {
  constructor(obj, prop, light) {
    this.obj = obj;
    this.light = light;
    this.prop = prop;
  }
  get value() {
    return `#${Math.floor(this.obj[this.prop].x * 255).toString(16)}${Math.floor(this.obj[this.prop].y * 255).toString(16)}${Math.floor(this.obj[this.prop].z * 255).toString(16)}`;
  }
  set value(hexString) {
    this.obj[this.prop] = {
      x: parseInt(hexString.substring(1,3), 16) / 255,
      y: parseInt(hexString.substring(3,5), 16) / 255,
      z: parseInt(hexString.substring(5,7), 16) / 255,
    }
    this.light.color.set(hexString);
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

export {ColorGUIHelper, RGBAColorGUIHelper, DegRadHelper, updateLight, makeXYZGUI};