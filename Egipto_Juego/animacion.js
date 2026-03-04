import * as THREE from 'three';
import { Boton } from './Botones.js';
import { Puerta } from './Puertas.js';
import { DATOS_NIVELES } from './Niveles.js'; 

const reloj = new THREE.Clock();
let nivelCompletado = false; 
let nivelActual = 1;
let personajeMisterioso = null; 
let juegoIniciado = false; 
let cinematicaIniciada = false; 
let bloqueoControl = false; 
let tiempoUltimoDialogoAzar = 0; 

// --- FUNCIONES DE SOPORTE ---

function fundidoANegro(duracion, accionIntermedia) {
    const fade = document.createElement('div');
    fade.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: black; opacity: 0; transition: opacity ${duracion/2}ms; z-index: 2000;
    `;
    document.body.appendChild(fade);
    setTimeout(() => fade.style.opacity = '1', 10);
    setTimeout(() => {
        if (accionIntermedia) accionIntermedia();
        fade.style.opacity = '0';
        setTimeout(() => fade.remove(), duracion/2);
    }, duracion/2);
}

function mostrarCartelIntermedio(esElFinal, alClickearSiguiente) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); display: flex;
        justify-content: center; align-items: center; z-index: 999;
    `;
    const cartel = document.createElement('div');
    cartel.style.cssText = `
        background: rgba(20, 20, 20, 0.95); color: #FFD700;
        padding: 50px; border: 5px solid #FFD700;
        font-family: 'Arial Black', sans-serif; text-align: center;
        border-radius: 30px; box-shadow: 0 0 50px rgba(255, 215, 0, 0.4);
    `;
    const titulo = esElFinal ? "CONTINUARÁ..." : "¡NIVEL COMPLETADO!";
    const subtitulo = esElFinal ? "El secreto de Medina será revelado." : "Ambos han cruzado con éxito.";
    const textoBoton = esElFinal ? "REINTENTAR" : "SIGUIENTE NIVEL";

    cartel.innerHTML = `
        <h1 style="margin: 0; font-size: 50px;">${titulo}</h1>
        <p style="font-size: 22px; color: #fff;">${subtitulo}</p>
        <button id="btnSiguiente" style="
            margin-top: 30px; padding: 15px 30px; background: #FFD700;
            border: none; border-radius: 10px; cursor: pointer; font-size: 20px; font-weight: bold;
        ">${textoBoton}</button>
    `;
    overlay.appendChild(cartel);
    document.body.appendChild(overlay);
    document.getElementById('btnSiguiente').onclick = () => {
        document.body.removeChild(overlay);
        if (esElFinal) {
            location.reload();
        } else {
            nivelCompletado = false;
            alClickearSiguiente(); 
        }
    };
}

function verificarVictoria(nina, nino, alGanar) {
    if (nivelCompletado || !nina.modelo || !nino.modelo) return;
    
    if (nivelActual === 5) {
        if (!cinematicaIniciada && (nina.modelo.position.x > 0 || nino.modelo.position.x > 0)) {
            cinematicaIniciada = true; 
            bloqueoControl = true; 
            
            fundidoANegro(2000, () => {
                nina.modelo.position.set(4, 0, 1);
                nino.modelo.position.set(4, 0, -1);
                
                window.dispararEvento('encuentroHerido');
                
                setTimeout(() => {
                    bloqueoControl = false;
                }, 15000);
            });
        }
        
        if (cinematicaIniciada && !bloqueoControl && nina.modelo.position.x > 15 && nino.modelo.position.x > 15) {
            nivelCompletado = true;
            mostrarCartelIntermedio(true, alGanar);
        }
    } 
    else if (nivelActual < 5 && nina.modelo.position.x > 15 && nino.modelo.position.x > 15) {
        nivelCompletado = true;
        mostrarCartelIntermedio(false, alGanar);
    }
}

// --- FUNCIÓN PRINCIPAL ---
export function ejecutarAnimacion(renderer, scene, camera, nina, nino, input, cajas, antorchas) {
    let personajeActivo = nina;    
    juegoIniciado = true; 

    // --- 1. MOSTRAR CONTROLES AL TERMINAR INTRO ---
    const panelControles = document.getElementById('debug-info');
    if (panelControles) panelControles.style.display = 'block';

    window.dispararEvento('bienvenida');

    const botones = [new Boton(scene, -15, 0), new Boton(scene, -5, 0), new Boton(scene, 5, 0)];
    const puertas = [new Puerta(scene, -10, 0), new Puerta(scene, 0, 0), new Puerta(scene, 10, 0)];

    const cargarConfiguracionNivel = (num) => {
        nivelActual = num;
        
        // --- 2. ACTUALIZAR HUD: NIVEL X / 4 ---
        const nivelDisplay = document.getElementById('nivel-display');
        if (nivelDisplay) {
            // Si es el nivel 5 (final), ponemos algo especial o lo ocultamos
            if (num < 5) {
                nivelDisplay.innerText = `Nivel: ${num} / 4`;
            } else {
                nivelDisplay.innerText = `Nivel Final: El Encuentro`;
            }
        }

        const datos = DATOS_NIVELES[num] || DATOS_NIVELES[1];
        if (num !== 5) {
            cinematicaIniciada = false;
            bloqueoControl = false;
        }

        botones.forEach((b, i) => {
            const existe = !!(datos.botones && datos.botones[i]);
            b.base.visible = b.mesh.visible = existe;
            b.yaHablo = false; 
            if (existe) b.posicionar(datos.botones[i].x, datos.botones[i].z);
            else b.posicionar(0, -500); 
        });

        cajas.forEach((c, i) => {
            const existe = !!(datos.cajas && datos.cajas[i]);
            c.mesh.visible = existe;
            c.yaHabloCaja = false; 
            if (existe) {
                c.mesh.position.set(datos.cajas[i].x, 0.35, datos.cajas[i].z);
                c.estaCargada = false;
            } else {
                c.mesh.position.y = -500; 
            }
        });

        puertas.forEach((p) => {
            const esNivel5 = (num === 5);
            p.mesh.visible = p.visual.visible = !esNivel5;
            p.mesh.position.y = esNivel5 ? -500 : 3.2;
            if (esNivel5) p.visual.position.y = -500;
        });

        if (num === 5) {
            if (window.medinaRef && window.medinaRef.mostrar) {
                window.medinaRef.mostrar();
            }
            setTimeout(() => {
                window.dispararEvento('avistamientoMedina');
            }, 600);
        } else {
            if (window.medinaRef && window.medinaRef.ocultar) {
                window.medinaRef.ocultar();
            }
        }

        if (nina.modelo) nina.modelo.position.set(-18, 0, 2);
        if (nino.modelo) nino.modelo.position.set(-18, 0, -2);
    };

    cargarConfiguracionNivel(nivelActual);

    const proximoNivel = () => {
        nivelActual++;
        cargarConfiguracionNivel(nivelActual);
    };

    const loop = () => {
        requestAnimationFrame(loop);
        const delta = reloj.getDelta();
        if (!juegoIniciado) return;

        const teclas = input.obtenerEstado();

        tiempoUltimoDialogoAzar += delta;
        if (tiempoUltimoDialogoAzar > 35 && !bloqueoControl) {
            window.dispararEvento('azar');
            tiempoUltimoDialogoAzar = 0;
        }

        if (antorchas) {
            antorchas.forEach(a => { if(a.actualizar) a.actualizar(delta); });
        }

        if (!nivelCompletado) {
            if (input.cambioSolicitado() && !bloqueoControl) {
                personajeActivo = (personajeActivo === nina) ? nino : nina;
            }

            let obs = (nivelActual < 5) ? [...cajas, ...puertas.map(p => ({mesh: p.mesh}))] : [];
            personajeActivo.colisiones.actualizarObstaculos(obs);

            if (input.accionSolicitada() && nivelActual < 5) {
                const exito = personajeActivo.gestionarObjeto(cajas);
                const cajaCerca = cajas.find(c => !c.yaHabloCaja && c.mesh.position.distanceTo(personajeActivo.modelo.position) < 2);
                if (cajaCerca) {
                    window.dispararEvento('cajaMovida');
                    cajaCerca.yaHabloCaja = true;
                }
            }

            personajeActivo.mover(bloqueoControl ? {} : teclas);
            const personajeInactivo = (personajeActivo === nina) ? nino : nina;
            personajeInactivo.mover({});

            nino.actualizar(delta);
            nina.actualizar(delta);

            if (nivelActual < 5) {
                const objsParaBotones = [nina, nino, ...cajas];
                puertas.forEach((p, i) => {
                    const pisado = botones[i].actualizar(objsParaBotones);
                    p.actualizar(pisado);
                    
                    if (pisado && !botones[i].yaHablo) {
                        window.dispararEvento('botonPisado');
                        botones[i].yaHablo = true;
                    }
                });
            }

            verificarVictoria(nina, nino, proximoNivel);
        }
        renderer.render(scene, camera);
    };
    loop();
}