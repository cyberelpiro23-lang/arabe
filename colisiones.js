import * as THREE from 'three';

export class ManejadorColisiones {
    constructor() {
        this.limitesSuelo = { xMin: -19, xMax: 19, zMin: -4, zMax: 4};
        this.obstaculosActivos = []; 
        this.personajes = []; 
    }

    actualizarObstaculos(listaObstaculos) {
        this.obstaculosActivos = listaObstaculos || [];
    }

    registrarPersonajes(listaPersonajes) {
        // Filtramos para asegurar que no guardamos nulos
        this.personajes = listaPersonajes.filter(p => p !== null);
    }

    puntoOcupado(x, z) {
        const limiteRealX = 19.8; 
        const limiteRealZ = 4.8;

        if (x < -limiteRealX || x > limiteRealX || z < -limiteRealZ || z > limiteRealZ) return true; 

        for (const obstaculo of this.obstaculosActivos) {
            if (!obstaculo || !obstaculo.mesh || obstaculo.estaCargada) continue; 
            const pos = obstaculo.mesh.position;
            if (pos.y > 3) continue; 

            const anchoX = obstaculo.mesh.geometry.parameters.width / 2;
            const anchoZ = obstaculo.mesh.geometry.parameters.depth / 2;

            if (x >= pos.x - anchoX && x <= pos.x + anchoX && z >= pos.z - anchoZ && z <= pos.z + anchoZ) return true; 
        }
        return false; 
    }

    verificarMovimiento(posicionDeseada, radioPersonaje, quienSeMueve) {
        let x = posicionDeseada.x;
        let z = posicionDeseada.z;

        // --- 1. COLISIÓN CON OBSTÁCULOS ---
        this.obstaculosActivos.forEach(obstaculo => {
            if (!obstaculo || !obstaculo.mesh || obstaculo.estaCargada) return; 
            const posObs = obstaculo.mesh.position;
            if (posObs.y > 4) return;

            const mitadX = obstaculo.mesh.geometry.parameters.width / 2;
            const mitadZ = obstaculo.mesh.geometry.parameters.depth / 2;

            const cercanoX = Math.max(posObs.x - mitadX, Math.min(x, posObs.x + mitadX));
            const cercanoZ = Math.max(posObs.z - mitadZ, Math.min(z, posObs.z + mitadZ));

            const distX = x - cercanoX;
            const distZ = z - cercanoZ;
            const distanciaSq = (distX * distX) + (distZ * distZ);

            if (distanciaSq < (radioPersonaje * radioPersonaje)) {
                const distancia = Math.sqrt(distanciaSq);
                if (distancia > 0) {
                    const traslape = radioPersonaje - distancia;
                    x += (distX / distancia) * traslape;
                    z += (distZ / distancia) * traslape;
                }
            }
        });

        // --- 2. COLISIÓN ENTRE PERSONAJES (Aquí estaba el error de Flash) ---
        this.personajes.forEach(otro => {
            // SEGURIDAD: Si 'otro' es el mismo que se mueve, o no tiene modelo, o es indefinido... SALTAMOS.
            if (!otro || otro === quienSeMueve || !otro.modelo) return;

            const posOtro = otro.modelo.position;
            const dx = x - posOtro.x;
            const dz = z - posOtro.z;
            const distanciaSq = dx * dx + dz * dz;
            const radioSeguridad = radioPersonaje + 0.4; // Bajé a 0.4 para que no se empujen de tan lejos
            
            if (distanciaSq < (radioSeguridad * radioSeguridad)) {
                const distancia = Math.sqrt(distanciaSq);
                // Si la distancia es casi 0, evitamos división por cero que causa el Flash
                if (distancia > 0.01) {
                    const traslape = radioSeguridad - distancia;
                    x += (dx / distancia) * traslape;
                    z += (dz / distancia) * traslape;
                }
            }
        });

        // --- 3. LÍMITES DEL SUELO ---
        x = Math.max(this.limitesSuelo.xMin + radioPersonaje, Math.min(this.limitesSuelo.xMax - radioPersonaje, x));
        z = Math.max(this.limitesSuelo.zMin + radioPersonaje, Math.min(this.limitesSuelo.zMax - radioPersonaje, z));

        return new THREE.Vector3(x, 0, z);
    }
}