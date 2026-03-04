/**
 * SISTEMA DE DIÁLOGOS - EL SECRETO DE OSIRIS
 */

// 1. DEFINICIÓN GLOBAL DE FUNCIONES
window.hablar = (personaje, mensaje) => {
    const idBurbuja = `dialogo-${personaje}`;
    const idTexto = `texto-${personaje}`;
    
    const burbuja = document.getElementById(idBurbuja);
    const textoElemento = document.getElementById(idTexto);
    
    if (!burbuja || !textoElemento) {
        console.warn("La burbuja de " + personaje + " no está en el DOM.");
        return;
    }

    textoElemento.innerText = mensaje;
    burbuja.style.display = 'flex';
    
    setTimeout(() => {
        burbuja.style.opacity = '1';
    }, 10);

    // Los diálogos de Medina duran más; los gritos rápidos menos
    const esGrito = mensaje.includes("?!");
    const tiempo = personaje === 'medina' ? 6000 : (esGrito ? 3000 : 4500);

    setTimeout(() => {
        burbuja.style.opacity = '0';
        setTimeout(() => {
            burbuja.style.display = 'none';
        }, 500);
    }, tiempo);
};

window.dispararEvento = (tipo) => {
    const bibliotecaFrases = {
        bienvenida: [
            { p: 'nina', t: "¡Al fin entramos! El templo es enorme." },
            { p: 'nino', t: "¡Y huele a encerrado! Busquemos el secreto." }
        ],
        botonPisado: [
            { p: 'nino', t: "¡Oigo algo! Creo que abrí algo por allá." },
            { p: 'nina', t: "¡Sí! La reja se movió un poco." }
        ],
        cajaMovida: [
            { p: 'nina', t: "Esta caja es pesada... ¡ayúdame!" },
            { p: 'nino', t: "¡Ya voy! Entre los dos es más fácil." }
        ],
        // --- EVENTO DE ENTRADA AL NIVEL 5 ---
        avistamientoMedina: [
            { p: 'nina', t: "¡¿MEDINA?!" },
            { p: 'nino', t: "¡¿MEDINA?! ¡Está ahí adelante!" }
        ],
        // --- ESCENA FINAL AL ACERCARSE ---
        encuentroHerido: [
            { p: 'nina', t: "¡Medina! ¡Estás aquí! Pero... estás herido." },
            { p: 'nino', t: "¡¿Qué te pasó?! ¿Quién te hizo esto?" },
            { p: 'medina', t: "No se preocupen por mí... El guardián me alcanzó, pero logré ocultar la llave." },
            { p: 'medina', t: "Ustedes deben seguir... El verdadero secreto de Osiris está tras esa puerta." }
        ],
        azar: [
            "¿Viste eso? Creo que algo se movió...",
            "Me pregunto cuántos años tendrá este lugar.",
            "¡No te alejes mucho!",
            "¡Qué ganas de terminar para ir a comer algo!"
        ]
    };

    const evento = bibliotecaFrases[tipo];
    if (!evento) return;

    if (Array.isArray(evento) && typeof evento[0] === 'object') {
        evento.forEach((dialogo, index) => {
            // Los gritos de "¡¿MEDINA?!" salen casi al mismo tiempo (delay corto)
            const delay = tipo === 'avistamientoMedina' ? 600 : 5000;
            setTimeout(() => {
                window.hablar(dialogo.p, dialogo.t);
            }, index * delay); 
        });
    } 
    else if (tipo === 'azar') {
        const fraseAzar = evento[Math.floor(Math.random() * evento.length)];
        const p = Math.random() > 0.5 ? 'nina' : 'nino';
        window.hablar(p, fraseAzar);
    }
};

// 2. FUNCIÓN DE INICIALIZACIÓN
export function crearSistemaDialogos() {
    const crearEstiloBase = (tipo) => {
        let posicion = tipo === 'left' ? 'bottom: 30px; left: 30px;' : 
                       tipo === 'right' ? 'bottom: 30px; right: 30px;' :
                       'top: 20px; left: 50%; transform: translateX(-50%);'; 

        let colorBorde = tipo === 'left' ? '#ff69b4' : 
                         tipo === 'right' ? '#00ced1' : '#FFD700';

        return `
            position: absolute;
            ${posicion}
            width: 35%;
            max-width: 400px;
            min-height: 100px;
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid ${colorBorde};
            border-radius: 20px;
            display: none;
            align-items: center;
            padding: 15px;
            z-index: 3000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            opacity: 0;
            transition: opacity 0.5s ease;
            box-shadow: 0 0 25px ${colorBorde}44;
        `;
    };

    const ninaDiv = document.createElement('div');
    ninaDiv.id = 'dialogo-nina';
    ninaDiv.style.cssText = crearEstiloBase('left');
    ninaDiv.innerHTML = `<img src="nina_cara.png" style="width:70px;height:70px;border-radius:50%;margin-right:15px;border:2px solid #ff69b4;object-fit:cover;"><div><strong style="color:#ff69b4;">NINA</strong><p id="texto-nina" style="margin:0;"></p></div>`;

    const ninoDiv = document.createElement('div');
    ninoDiv.id = 'dialogo-nino';
    ninoDiv.style.cssText = crearEstiloBase('right');
    ninoDiv.innerHTML = `<div style="text-align:right;"><strong style="color:#00ced1;">NINO</strong><p id="texto-nino" style="margin:0;"></p></div><img src="nino_cara.png" style="width:70px;height:70px;border-radius:50%;margin-left:15px;border:2px solid #00ced1;object-fit:cover;">`;

    const medinaDiv = document.createElement('div');
    medinaDiv.id = 'dialogo-medina';
    medinaDiv.style.cssText = crearEstiloBase('center');
    medinaDiv.innerHTML = `<img src="medina_cara.png" style="width:80px;height:80px;border-radius:10px;margin-right:15px;border:2px solid #FFD700;object-fit:cover;"><div><strong style="color:#FFD700;">MEDINA (Herido)</strong><p id="texto-medina" style="margin:0;font-style:italic;"></p></div>`;

    document.body.appendChild(ninaDiv);
    document.body.appendChild(ninoDiv);
    document.body.appendChild(medinaDiv);
}