import * as THREE from 'three';

export class Puerta {
    constructor(escena, x, z, ancho = 10) {
        this.escena = escena;
        this.yCerrada = 3.2; // Ajustamos un poco para que las puntas rocen el suelo
        this.yAbierta = 7.0; 

        // 1. EL HITBOX INVISIBLE (Lógica de colisiones)
        const geoHitbox = new THREE.BoxGeometry(0.5, 6, ancho);
        const matHitbox = new THREE.MeshBasicMaterial({ visible: false });
        this.mesh = new THREE.Mesh(geoHitbox, matHitbox);
        this.mesh.position.set(x, this.yCerrada, z);
        this.escena.add(this.mesh);

        // 2. EL GRUPO VISUAL (Estilo Peine con Puntas)
        this.visual = new THREE.Group();
        this.crearBarrotesConPuntas(ancho);
        this.visual.position.set(x, this.yCerrada, z);
        this.escena.add(this.visual);

        this.boundingBox = new THREE.Box3();
    }

    crearBarrotesConPuntas(ancho) {
        const matReja = new THREE.MeshStandardMaterial({ 
            color: 0xaaaaaa, 
            metalness: 0.8, 
            roughness: 0.2 
        });

        const numBarrotes = 10;
        const altoBarrote = 5.5; // Un poco más corto para que quepa la punta

        for (let i = 0; i < numBarrotes; i++) {
            const grupoBarrote = new THREE.Group();

            // El cuerpo del barrote (Cilindro)
            const cuerpoGeo = new THREE.CylinderGeometry(0.12, 0.12, altoBarrote, 8);
            const cuerpo = new THREE.Mesh(cuerpoGeo, matReja);
            grupoBarrote.add(cuerpo);

            // La punta (Cono)
            const puntaGeo = new THREE.ConeGeometry(0.12, 0.6, 8);
            const punta = new THREE.Mesh(puntaGeo, matReja);
            // Posicionamos la punta justo debajo del cilindro
            punta.position.y = -(altoBarrote / 2) - 0.3;
            // Invertimos el cono para que apunte hacia abajo
            punta.rotation.x = Math.PI; 
            grupoBarrote.add(punta);
            
            // Posición en el eje Z (pasillo)
            const posZ = (i * (ancho / (numBarrotes - 1))) - (ancho / 2);
            grupoBarrote.position.set(0, 0, posZ);
            
            this.visual.add(grupoBarrote);
        }

        // Viga Superior (La única que sostiene todo, tipo peine)
        const vigaSup = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, ancho + 0.2), matReja);
        vigaSup.position.y = 2.8; 
        this.visual.add(vigaSup);
    }

    actualizar(estaAbierta) {
        const objetivoY = estaAbierta ? this.yAbierta : this.yCerrada;
        this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, objetivoY, 0.1);
        this.visual.position.y = this.mesh.position.y;
        this.boundingBox.setFromObject(this.mesh);
    }
}