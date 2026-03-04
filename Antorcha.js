import * as THREE from 'three';

export class Antorcha {
    constructor(escena, x, y, z) {
        this.escena = escena;
        this.grupo = new THREE.Group();

        // 1. El Soporte (Madera/Metal oscuro)
        const geoSoporte = new THREE.BoxGeometry(0.15, 0.5, 0.15);
        const matSoporte = new THREE.MeshStandardMaterial({ color: 0x332211 });
        const soporte = new THREE.Mesh(geoSoporte, matSoporte);
        this.grupo.add(soporte);

        // 2. La Llama (Un cono pequeño brillante)
        const geoLlama = new THREE.ConeGeometry(0.1, 0.3, 8);
        this.matLlama = new THREE.MeshBasicMaterial({ color: 0xff8800 });
        this.llama = new THREE.Mesh(geoLlama, this.matLlama);
        this.llama.position.y = 0.35;
        this.grupo.add(this.llama);

        // 3. La Luz (Naranja cálida que ilumina la pared y el suelo)
        this.luz = new THREE.PointLight(0xff4400, 15, 10);
        this.luz.position.y = 0.5;
        this.grupo.add(this.luz);

        this.grupo.position.set(x, y, z);
        this.escena.add(this.grupo);
        
        this.reloj = 0;
    }

    actualizar(delta) {
        this.reloj += delta * 10;
        // Efecto de parpadeo (variación aleatoria de intensidad y escala)
        const variacion = Math.sin(this.reloj) * 0.2 + (Math.random() * 0.1);
        this.luz.intensity = 15 + variacion * 10;
        
        const escalaLlama = 1 + variacion * 0.5;
        this.llama.scale.set(escalaLlama, escalaLlama, escalaLlama);
    }
}