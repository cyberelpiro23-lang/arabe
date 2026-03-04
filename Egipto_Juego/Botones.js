import * as THREE from 'three';

export class Boton {
    constructor(escena, x, z) {
        this.escena = escena;

        // 1. La Base (Cubo gris plano en el suelo)
        const geoBase = new THREE.BoxGeometry(1.2, 0.1, 1.2);
        const matBase = new THREE.MeshStandardMaterial({ color: 0x444444 });
        this.base = new THREE.Mesh(geoBase, matBase);
        
        // 2. El Botón (Cubo rojo que sobresale)
        const geoBoton = new THREE.BoxGeometry(0.8, 0.3, 0.8);
        this.matBoton = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geoBoton, this.matBoton);

        // Usamos nuestro nuevo método para ubicarlos por primera vez
        this.posicionar(x, z);

        this.escena.add(this.base);
        this.escena.add(this.mesh);

        this.presionado = false;
    }

    // NUEVO MÉTODO: Mueve ambas piezas juntas para que no se desarme el botón
    posicionar(x, z) {
        this.base.position.set(x, 0.05, z);
        this.mesh.position.set(x, 0.2, z);
    }

    actualizar(entidades) {
        let alguienEncima = false;

        entidades.forEach(ent => {
            if (!ent || (ent.nombre && !ent.modelo) || (!ent.nombre && !ent.mesh)) return;
            
            const posEnt = ent.modelo ? ent.modelo.position : ent.mesh.position;
            
            // Calculamos distancia respecto a la base
            const dist = new THREE.Vector2(
                posEnt.x - this.base.position.x,
                posEnt.z - this.base.position.z
            ).length();

            if (dist < 0.7) alguienEncima = true;
        });

        if (alguienEncima) {
            this.mesh.position.y = 0.08; 
            this.matBoton.color.set(0x00ff00); // Verde
            this.presionado = true;
        } else {
            this.mesh.position.y = 0.2; 
            this.matBoton.color.set(0xff0000); // Rojo
            this.presionado = false;
        }

        return this.presionado;
    }
}