import * as THREE from 'three';

export class Caja {
    constructor(escena, x, z, color = 0x5d4037) {
        this.escena = escena;
        this.ancho = 1;
        this.alto = 1;
        this.profundo = 1;
        this.estaCargada = false;
        // Crear la malla visual
        const geometria = new THREE.BoxGeometry(this.ancho, this.alto, this.profundo);
        const material = new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.7,
            metalness: 0.2
        });

        this.mesh = new THREE.Mesh(geometria, material);
        
        // La posicionamos (el y: 0.5 es para que la base toque el suelo)
        this.mesh.position.set(x, 0.5, z);
        
        // Añadimos a la escena
        this.escena.add(this.mesh);
        
        // Propiedad para efectos futuros (levitación, etc.)
        this.velocidadLevitacion = 0;
    }

    // Si algún día quieres que la caja haga algo especial cada frame
    actualizar(tiempo) {
        // Ejemplo: una pequeña oscilación si queremos que sea mágica
        // this.mesh.position.y = 0.5 + Math.sin(tiempo) * 0.1;
    }

    get limites() {
        return {
            xMin: this.mesh.position.x - this.ancho / 2,
            xMax: this.mesh.position.x + this.ancho / 2,
            zMin: this.mesh.position.z - this.profundo / 2,
            zMax: this.mesh.position.z + this.profundo / 2
        };
    }
}