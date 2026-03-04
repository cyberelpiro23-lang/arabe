import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let modeloMedina = null; // Referencia interna

export function cargarMedina(scene) {
    const loader = new GLTFLoader();
    let mezcladorMedina;

    loader.load('assets/erido.glb', (gltf) => {
        modeloMedina = gltf.scene;
        scene.add(modeloMedina);
        
        // --- POSICIÓN FINAL NIVEL 5 ---
        modeloMedina.position.set(10, 0, -4); 
        modeloMedina.scale.set(0.6, 0.6, 0.6);
        
        // Empieza invisible hasta que lleguemos al Nivel 5
        modeloMedina.visible = false;

        if (gltf.animations.length > 0) {
            mezcladorMedina = new THREE.AnimationMixer(modeloMedina);
            const clip = gltf.animations.find(a => a.name.toLowerCase().includes('erido')) || gltf.animations[0];
            
            clip.tracks.forEach(track => {
                track.name = track.name.replace('mixamorig:', '');
            });

            const action = mezcladorMedina.clipAction(clip);
            action.play();
        }

        window.medinaUpdate = (delta) => {
            if (mezcladorMedina && modeloMedina.visible) {
                mezcladorMedina.update(delta);
            }
        };
    });

    return { 
        actualizar: (delta) => { if(window.medinaUpdate) window.medinaUpdate(delta); },
        mostrar: () => { if(modeloMedina) modeloMedina.visible = true; },
        ocultar: () => { if(modeloMedina) modeloMedina.visible = false; }
    };
}