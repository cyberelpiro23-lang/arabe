// Niveles.js
export const DATOS_NIVELES = {
    1: {
        // NIVEL 1: Introducción (Un botón en el centro de cada zona)
        botones: [
            { x: -15, z: 0 },  // Abre Puerta 1
            { x: -5, z: 0 },   // Abre Puerta 2
            { x: 5, z: 0 }     // Abre Puerta 3
        ],
        cajas: [
            { x: -5, z: 2 }, 
            { x: 11, z: -2 }, 
            { x: 8, z: 0 }
        ]
    },
    2: {
        // NIVEL 2: Desvío (Los botones no están justo delante de sus puertas)
        botones: [
            { x: -15, z: 0 },   // Botón 1 (Atrás a la izquierda)
            { x: -5, z: -2 },   // Botón 2 (En un rincón de la hab 2)
            { x: -5, z: 2 }      // Botón 3 (Centro de la hab 3)
        ],
        cajas: [
            { x: -5, z: -4 }, 
            { x: 15, z: 4 }, 
            { x: 17, z: -3 }
        ]
    },
    3: {
        // NIVEL 3: Cooperación (Cajas lejos de los botones)
        botones: [
            { x: -15, z: -2 },   // Botón 1
            { x: -5, z: 0 },    // Botón 2 (Arriba)
            { x: -15, z: 2 }     // Botón 3 (Abajo)
        ],
        cajas: [
            { x: 18, z: -4 },  // Caja 1 (Muy atrás)
            { x: 16, z: 3 },    // Caja 2
            { x: -16, z: 3 }     // Caja 3
        ]
    },
    4: {
        // NIVEL 4: El Laberinto Final (Dificultad máxima de posiciones)
        botones: [
            { x: -15, z: 2 },   // Botón 1 (Esquina inicial superior)
            { x: -15, z: -2 },     // Botón 2 (¡Está en la habitación 3!)
            { x:  5, z: 0 }    // Botón 3 (Está en la habitación 2)
        ],
        cajas: [
            { x: -8, z: 0 }, 
            { x: 12, z: -3 }, 
            { x: 12, z: 4 }
        ]
    },
    5: {
    botones: [],
    cajas: []
}
};