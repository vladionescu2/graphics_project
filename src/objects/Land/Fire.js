import * as THREE from 'three';
import FireParticle from './FireParticle.js'

import PARTICLE from './fire2.png';
import * as Helpers from '../utils/GuiHelpers.js';
import Dat from 'dat.gui';
import MaterialModifier from 'three-material-modifier';

export default class Fire extends THREE.Group {
    constructor(pos, intensity) {
        super();
        this.pos = pos;

        this.fireParams = {
            intensity: Math.min(Math.max(0, intensity), 10),
            windDir: 0,
            windIntensity: 0,
            particleSpeedFactor: 0.02
        }
        this.particleMaxAgeFactor = 70;
        this.fireParams.particleMaxAge = this.particleMaxAge;
        this.particleIncreaseFactor = 50;
        this.fireColor = {
            x: 0.89,
            y: 0.42,
            z: 0.16
        };

        const light = new THREE.PointLight(0xe36a29, 1);
        light.position.y = 2;
        this.light = light;

        const updateLight = () => {
            light.intensity = this.lightIntensity;
            light.distance = this.lightDistance;
        };

        updateLight();
        this.add(light);

        // const helper = new THREE.PointLightHelper(light);
        // this.add(helper);

        const particleTexture = new THREE.TextureLoader().load(PARTICLE);
        this.texture = particleTexture;

        const particles = new THREE.Group();
        this.particles = particles;
        this.add(particles);


        const changeLightPos = () => {
            if (this.fireParams.windIntensity > 0) {
                const rad = Math.PI / 180 * this.fireParams.windDir;
                light.position.x = Math.cos(rad) * this.fireParams.windIntensity * this.fireParams.intensity * 0.03;
                light.position.z = Math.sin(rad) * this.fireParams.windIntensity * this.fireParams.intensity * 0.03;
            }
            else {
                light.position.x = this.pos.x;
                light.position.z = this.pos.z;
            }
        };

        const updateParticleNr = () => {
            const particleDiff = this.particles.children.length - this.particleNr;

            if (particleDiff < 0)
                for (let i = 0; i < -particleDiff; i ++)
                    this.generateParticle();
            else
                for (let i = 0; i < particleDiff; i ++)
                    this.particles.remove(this.particles.children[0]);
        }

        this.generateFire();

        const gui = new Dat.GUI();
        gui.add(this.fireParams, 'windDir', 0, 360, 0.01).onChange(() => changeLightPos()).name('Wind Direction');
        gui.add(this.fireParams, 'windIntensity', 0, 10, 0.01).onChange(() => changeLightPos()).name('Wind Intensity');
        gui.add(this.fireParams, 'intensity', 0, 10, 0.01).name('Fire Intensity')
        .onChange(() => {
            changeLightPos();
            updateLight();
            this.fireParams.particleMaxAge = this.particleMaxAge;
            updateParticleNr();
        });
        const experimentalParams = gui.addFolder('Experimental Parameters');
        experimentalParams.addColor(new Helpers.RGBAColorGUIHelper(this, 'fireColor', this.light), 'value').name('Fire Color').onChange(() => {
            for (let p of this.particles.children)
                p.material.userData.shader.uniforms.u_pColor.value = this.fireColor;
        });
        experimentalParams.add(this, 'particleIncreaseFactor', 10, 100, 1).onChange(() => updateParticleNr()).name('Particle Increase');
        experimentalParams.add(this, 'particleMaxAgeFactor', 10, 200, 1).onChange(() => this.fireParams.particleMaxAge = this.particleMaxAge).name('Particle Max Age');
        experimentalParams.add(this.fireParams, 'particleSpeedFactor', 0.01, 2, 0.01).name('Particle Speed');

        this.increasingPulse = 1;
        this.pulseTime = 0;
    }

    get lightIntensity() {
        return this.fireParams.intensity * 0.3;
    }

    get lightDistance() {
        return this.fireParams.intensity * 20;
    }

    get particleNr() {
        return this.fireParams.intensity * this.particleIncreaseFactor;
    }

    get particleMaxAge() {
        return this.fireParams.intensity * this.particleMaxAgeFactor;
    }


    generateFire() {
        for (let i = 0; i < this.particleNr; i ++) {
            this.generateParticle();
        }
    }

    update(timeStamp) {
        for (let particle of this.particles.children) {
            if (particle.age > this.fireParams.particleMaxAge) {
                this.resetParticlePosition(particle)
                particle.resetState();
            }
            else {
                particle.update(timeStamp);
            }
        }
    
        this.pulseTime ++;
        if (this.pulseTime > 200) {
            this.pulseTime = 0;
            this.increasingPulse *= -1;
        }
        this.light.intensity += this.increasingPulse * 0.002;
        this.light.distance += this.increasingPulse * 0.05;
    }

    generateParticle() {
        let material = new THREE.SpriteMaterial({ map: this.texture, color: 0xffffff, blending: THREE.AdditiveBlending });
        // let new_mat = MaterialModifier.modify(THREE.SpriteMaterial, {
        //     fragmentShader: {
        //         postFragColor: `
        //         vec3 grayscale = (gl_FragColor.x + gl_FragColor.y + gl_FragColor.z) / 3.0;

        //         gl_FragColor = vec4(grayscale * (0.0, 1.0, 0.0), gl_FragColor.w);
        //         `
        //     }
        // })
        
        // const new_particle = new FireParticle(new THREE.SpriteMaterial({ map: this.texture, color: 0xffffff, blending: THREE.AdditiveBlending }), this.fireParams);

        material.onBeforeCompile = (shader) => {
            shader.uniforms.u_pColor = {value: this.fireColor};
            shader.fragmentShader = 'uniform vec3 u_pColor;\n' + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a )', `
            vec3 grayscale = vec3((outgoingLight.x + outgoingLight.y + outgoingLight.z) / 3.0);

            gl_FragColor = vec4(grayscale*u_pColor, diffuseColor.a);
            `);
            // shader.fragmentShader = shader.fragmentShader + `
            // vec3 grayscale = vec3((outgoingLight.x + outgoingLight.y + outgoingLight.z) / 3.0);

            // gl_FragColor = vec4(grayscale*u_pColor, diffuseColor.a);`;

            material.userData.shader = shader;
        }

        const new_particle = new FireParticle(material, this.fireParams);
        this.resetParticlePosition(new_particle);

        this.particles.add(new_particle);
    }

    resetParticlePosition(particle) {
        const maxDist = this.fireParams.intensity * 0.3;
        const maxHeight = this.fireParams.intensity * 0.3;

        const fire_x = maxDist * (Math.random() * 2  - 1);
        const zVariance = Math.sqrt((maxDist - fire_x) * (maxDist + fire_x));
        const fire_z = zVariance * (Math.random() * 2  - 1);
        const d = Math.sqrt((fire_x * fire_x) + (fire_z * fire_z));
        let fire_y = 1 / d > maxHeight ? maxHeight : 1 / d;
        fire_y -= 0.7;

        particle.position.x = this.pos.x + fire_x;
        particle.position.z = this.pos.z + fire_z;
        particle.position.y = this.pos.y + fire_y;
    }
}
