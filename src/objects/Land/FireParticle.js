import * as THREE from 'three';

export default class FireParticle extends THREE.Sprite {
    constructor(spriteMaterial, params) {
        super(spriteMaterial);
        this.params = params;

        this.bonusAge = 0;
        this.resetState();
    }

    update(timeStamp) {
        this.age += this.params.intensity * 0.4;
        this.position.y += this.speed * this.params.particleSpeedFactor;

        let rad;
        if (this.params.windIntensity > 0) {
            rad = Math.PI / 180 * this.params.windDir;
            this.position.x += Math.cos(rad) * this.params.windIntensity * 0.004;
            this.position.z += Math.sin(rad) * this.params.windIntensity * 0.004;
        }

        const remain = this.params.particleMaxAge + this.bonusAge - this.age;
        if (remain / this.params.particleMaxAge < 0.1)
            this.material.opacity -= 0.02;
    }

    resetState() {
        this.age = Math.random() * this.params.particleMaxAge;
        this.speed = Math.random();
        this.material.opacity = 1;
        const new_scale = (Math.random() + 1) * 0.5;
        this.scale.set(new_scale, new_scale, new_scale);
        this.material.rotation = Math.random() * 2 * Math.PI;
    }
}