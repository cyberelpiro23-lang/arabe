import * as THREE from 'three';
import { Antorcha } from './Antorcha.js'; 

function crearTexturaSuelo() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const tam = 128; 

    for (let x = 0; x < 512; x += tam) {
        for (let y = 0; y < 512; y += tam) {
            const variacion = Math.random() * 15;
            const r = 100 + variacion; 
            const g = 80 + variacion; 
            const b = 40 + variacion; 

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, tam, tam);

            ctx.strokeStyle = 'rgba(30, 20, 10, 0.8)'; 
            ctx.lineWidth = 6; 
            ctx.strokeRect(x, y, tam, tam);

            for (let i = 0; i < 15; i++) {
                ctx.fillStyle = 'rgba(0,0,0,0.1)';
                ctx.fillRect(x + Math.random() * tam, y + Math.random() * tam, 2, 2);
            }
        }
    }
    const textura = new THREE.CanvasTexture(canvas);
    textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(8, 2); 
    return textura;
}

function crearTexturaPared() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8B8000'; 
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#443a00'; 
    ctx.lineWidth = 4;
    const filas = 6;
    const altoFila = 512 / filas;
    for (let f = 0; f < filas; f++) {
        const y = f * altoFila;
        ctx.beginPath();
        ctx.moveTo(0, y + (Math.random() - 0.5) * 4);
        ctx.lineTo(512, y + (Math.random() - 0.5) * 4);
        ctx.stroke();
        const desplazamiento = (f % 2 === 0) ? 0 : 64;
        for (let x = desplazamiento; x <= 512; x += 128) {
            ctx.beginPath();
            ctx.moveTo(x + (Math.random() - 0.5) * 4, y);
            ctx.lineTo(x + (Math.random() - 0.5) * 4, y + altoFila);
            ctx.stroke();
        }
    }
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.94)'; 
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 45; i++) {
        let x = Math.random() * 512;
        let y = Math.random() * 512;
        ctx.beginPath(); ctx.moveTo(x, y);
        for(let j = 0; j < 3; j++) {
            x += (Math.random() - 0.5) * 50;
            y += Math.random() * 25;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    const textura = new THREE.CanvasTexture(canvas);
    textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
    textura.needsUpdate = true;
    return textura;
}

function crearColumna(escena, x, z, material) {
    const grupoColumna = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 6, 6), material);
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.5), material);
    base.position.y = -2.75;
    const capitel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.5), material);
    capitel.position.y = 2.75;
    grupoColumna.add(cuerpo, base, capitel);
    grupoColumna.position.set(x, 3, z);
    escena.add(grupoColumna);
}

function crearPuertaDecorativa(escena, x, y, z, rotacionY, materialPared) {
    const grupoPuerta = new THREE.Group();

    const hueco = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 4.5),
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
    );
    // CAMBIO: Nombre específico para que NO se borre en el Nivel 5
    hueco.name = "fondoPuertaDecorativa"; 
    hueco.position.z = -0.02; 
    grupoPuerta.add(hueco);

    const matMarco = materialPared.clone();
    matMarco.color.set(0xaa9900); 

    const dintel = new THREE.Mesh(new THREE.BoxGeometry(4, 0.6, 0.4), matMarco);
    dintel.position.y = 2.4;
    grupoPuerta.add(dintel);

    const columnaIzq = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.8, 0.3), matMarco);
    columnaIzq.position.set(-1.7, 0, 0);
    grupoPuerta.add(columnaIzq);

    const columnaDer = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.8, 0.3), matMarco);
    columnaDer.position.set(1.7, 0, 0);
    grupoPuerta.add(columnaDer);

    for(let i = -1; i <= 1; i++) {
        const adorno = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.5), matMarco);
        adorno.position.set(i * 1.3, 2.8, 0);
        grupoPuerta.add(adorno);
    }

    grupoPuerta.position.set(x, y, z);
    grupoPuerta.rotation.y = rotacionY;
    escena.add(grupoPuerta);
}

function crearSombraReja(escena, x, ancho = 1) {
    const geoSombra = new THREE.PlaneGeometry(ancho, 7);
    const matSombra = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        side: THREE.DoubleSide 
    });
    
    const sombra = new THREE.Mesh(geoSombra, matSombra);
    // CAMBIO: Nombre específico para borrar solo estas en el Nivel 5
    sombra.name = "sombraReja"; 
    sombra.position.set(x, 3, -4.74); 
    escena.add(sombra);
}

function crearPilastrasPuerta(escena, x) {
    const geoColumna = new THREE.BoxGeometry(0.8, 6, 0.5);
    const matLiso = new THREE.MeshStandardMaterial({ 
        color: 0xBAA011, 
        roughness: 0.9,
        metalness: 0.1 
    });
    
    const distanciaAlCentro = 0.9; 

    const colIzq = new THREE.Mesh(geoColumna, matLiso);
    colIzq.position.set(x - distanciaAlCentro, 3, -4.6); 
    
    const colDer = new THREE.Mesh(geoColumna, matLiso);
    colDer.position.set(x + distanciaAlCentro, 3, -4.6);

    escena.add(colIzq, colDer);
}

export function crearEscena() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202); 

    const luzAmbiental = new THREE.AmbientLight(0xfff5e6, 0.4); 
    scene.add(luzAmbiental);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.1);
    scene.add(hemiLight);

    const texturaParedBase = crearTexturaPared();
    const obtenerMaterialPared = (repeticionX) => {
        const tex = texturaParedBase.clone();
        tex.repeat.set(repeticionX, 1); 
        tex.needsUpdate = true;
        return new THREE.MeshStandardMaterial({ 
            map: tex, 
            roughness: 0.8, 
            metalness: 0.05
        });
    };

    crearSombraReja(scene, -10); 
    crearSombraReja(scene, 0);   
    crearSombraReja(scene, 10);  

    crearPilastrasPuerta(scene, -10); 
    crearPilastrasPuerta(scene, 0);   
    crearPilastrasPuerta(scene, 10);  

    const suelo = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 10),
        new THREE.MeshStandardMaterial({ map: crearTexturaSuelo(), roughness: 1 })
    );
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    crearColumna(scene, -19.5, -4.5, obtenerMaterialPared(1)); 
    crearColumna(scene, 19.5, -4.5, obtenerMaterialPared(1));  
    crearColumna(scene, -19.5, 4.5, obtenerMaterialPared(1));  
    crearColumna(scene, 19.5, 4.5, obtenerMaterialPared(1));   

    const listaAntorchas = [
        new Antorcha(scene, -6, 3.5, -4.1),
        new Antorcha(scene, 6, 3.5, -4.1),
        new Antorcha(scene, -19.2, 3.5, -2.5), 
        new Antorcha(scene, -19.2, 3.5, 2.5),
        new Antorcha(scene, 19.2, 3.5, -2.5),
        new Antorcha(scene, 19.2, 3.5, 2.5)
    ];

    const pFondo = new THREE.Mesh(new THREE.BoxGeometry(40, 6, 0.5), obtenerMaterialPared(8));
    pFondo.position.set(0, 3, -5);
    scene.add(pFondo);

    const pOeste = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 10), obtenerMaterialPared(2));
    pOeste.position.set(-20, 3, 0);
    scene.add(pOeste);

    const pEste = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 10), obtenerMaterialPared(2));
    pEste.position.set(20, 3, 0);
    scene.add(pEste);

    crearPuertaDecorativa(scene, -19.7, 2.5, 0, Math.PI / 2, obtenerMaterialPared(1));
    crearPuertaDecorativa(scene, 19.7, 2.5, 0, -Math.PI / 2, obtenerMaterialPared(1));

    return { scene, listaAntorchas };
}