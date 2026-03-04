import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Clase que representa a los protagonistas del juego.
 */
export class Personaje {
    constructor(escena, rutaModelo, x, z, manejadorColisiones) {
        this.escena = escena;
        this.modelo = null;
        this.velocidad = 0.12;
        this.mezclador = null;
        this.animaciones = {}; 
        this.accionActual = null;
        this.nombre = rutaModelo.includes('nina') ? "Niña" : "Niño";
        this.objetoCargado = null; 
        this.direccionMirada = new THREE.Vector3(0, 0, 1);
        this.colisiones = manejadorColisiones; 

        // --- AJUSTES DE BRÚJULA DIFERENCIADOS ---
        // 'correr': Ajuste mientras hay movimiento.
        // 'quieto': Ajuste extra que necesita la animación de espera para no girarse.
        this.ajustes = this.nombre === "Niña" ? {
            correr: -Math.PI / 2, 
            quieto:   0  // Si gira 90° de más, prueba con -Math.PI / 2
        } : {
            correr: 0,
            quieto: 0
        };
        
        // Guardamos la rotación pura del mundo para aplicarle los parches después
        this.ultimaRotacionMundo = 0;

        this.cargarModelo(rutaModelo, x, z);
    }

    cargarModelo(ruta, x, z) {
        const loader = new GLTFLoader();
        loader.load(ruta, (gltf) => {
            this.modelo = gltf.scene;

            const escalaFinal = (this.nombre === "Niño") ? 0.5 : 0.33;
            this.modelo.scale.set(escalaFinal, escalaFinal, escalaFinal);
            this.modelo.position.set(x, 0, z);
            
            // Orientación inicial
            this.modelo.rotation.y = this.ajustes.quieto;
            
            this.escena.add(this.modelo);

            this.mezclador = new THREE.AnimationMixer(this.modelo);
            const nombresClips = { 'quieto': 'eapera', 'correr': 'run', 'cargar': 'carga' };
            
            for (const [key, name] of Object.entries(nombresClips)) {
                const animEncontrada = gltf.animations.find(a => a.name === name);
                if (animEncontrada) {
                    animEncontrada.tracks.forEach(track => {
                        track.name = track.name.replace('mixamorig:', '');
                    });
                    this.animaciones[key] = this.mezclador.clipAction(animEncontrada, this.modelo);
                }
            }

            if (this.animaciones['quieto']) {
                this.accionActual = this.animaciones['quieto'];
                this.accionActual.play();
            }
        });
    }

    gestionarObjeto(listaDeCajas) {
        if (!this.modelo || !this.colisiones) return;
        if (this.objetoCargado) {
            const distanciaSonda = 0.8; 
            const puntoX = this.modelo.position.x + this.direccionMirada.x * distanciaSonda;
            const puntoZ = this.modelo.position.z + this.direccionMirada.z * distanciaSonda;
            if (!this.colisiones.puntoOcupado(puntoX, puntoZ)) { 
                this.objetoCargado.estaCargada = false; 
                this.objetoCargado.mesh.position.set(puntoX, 0.35, puntoZ);
                this.objetoCargado = null;
                this.cambiarAnimacion('quieto');
            }
        } else {
            listaDeCajas.forEach(caja => {
                const distancia = this.modelo.position.distanceTo(caja.mesh.position);
                if (distancia < 1.2 && !caja.estaCargada) {
                    caja.estaCargada = true; 
                    this.objetoCargado = caja;
                    this.cambiarAnimacion('cargar');
                }
            });
        }
    }

  cambiarAnimacion(nombre) {
    if (!this.mezclador) return; 
    let animNombre = (this.objetoCargado && nombre === 'correr') ? 'cargar' : nombre;
    const nuevaAccion = this.animaciones[animNombre];
    if (!nuevaAccion || this.accionActual === nuevaAccion) return;
    
    // Cambiamos 0.2 por 0.05 (mucho más rápido) para que no se note el tirón
    if (this.accionActual) this.accionActual.fadeOut(0.01);
    nuevaAccion.reset().fadeIn(0.01).play();
    this.accionActual = nuevaAccion;
}

    actualizar(delta) {
        if (this.mezclador) this.mezclador.update(delta);
        
        if (this.objetoCargado && this.modelo) {
            this.objetoCargado.mesh.position.set(
                this.modelo.position.x + this.direccionMirada.x * 0.7,
                1.3, 
                this.modelo.position.z + this.direccionMirada.z * 0.7
            );
            this.objetoCargado.mesh.rotation.y = this.modelo.rotation.y;
        }
    }

    mover(teclas) {
        if (!this.modelo || !this.colisiones) return;
        let dx = 0; let dz = 0;
        
        if (teclas.w) dz -= 1; if (teclas.s) dz += 1;
        if (teclas.a) dx -= 1; if (teclas.d) dx += 1;

        if (dx !== 0 || dz !== 0) {
            const modulo = Math.sqrt(dx*dx + dz*dz);
            this.direccionMirada.set(dx/modulo, 0, dz/modulo);
            
            // 1. Guardamos la rotación pura que dictan las teclas
            this.ultimaRotacionMundo = Math.atan2(dx, dz);
            
            // 2. Aplicamos el ajuste de CORRER
            this.modelo.rotation.y = this.ultimaRotacionMundo + this.ajustes.correr;
            
            let deseo = new THREE.Vector3(
                this.modelo.position.x + (dx/modulo) * this.velocidad, 
                0, 
                this.modelo.position.z + (dz/modulo) * this.velocidad
            );
            
            let pos = this.colisiones.verificarMovimiento(deseo, 0.4, this);
            this.modelo.position.x = pos.x;
            this.modelo.position.z = pos.z;
            this.cambiarAnimacion('correr'); 
        } else {
            // 3. Aplicamos el ajuste de QUIETO sobre la última dirección grabada
            if (this.modelo) {
                this.modelo.rotation.y = this.ultimaRotacionMundo + this.ajustes.quieto;
            }
            this.cambiarAnimacion('quieto');
        }
    }
}