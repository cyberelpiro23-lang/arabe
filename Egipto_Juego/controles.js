export class Controles {
    constructor() {
        // Añadimos " " para el espacio y mantenemos los demás
        this.teclas = { w: false, s: false, a: false, d: false, q: false, " ": false };
        this.teclaPresionada = { q: false, espacio: false };

        window.addEventListener('keydown', (e) => {
            const tecla = e.key.toLowerCase();
            // Verificamos si la tecla existe en nuestro objeto
            if (this.teclas.hasOwnProperty(tecla)) {
                this.teclas[tecla] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const tecla = e.key.toLowerCase();
            if (this.teclas.hasOwnProperty(tecla)) {
                this.teclas[tecla] = false;
                // Reseteamos los bloqueos de un solo toque
                if (tecla === 'q') this.teclaPresionada.q = false;
                if (tecla === ' ') this.teclaPresionada.espacio = false;
            }
        });
    }

    // Para cambiar de personaje (Tecla Q)
    cambioSolicitado() {
        if (this.teclas.q && !this.teclaPresionada.q) {
            this.teclaPresionada.q = true; 
            return true;
        }
        return false;
    }

    // PARA CARGAR/SOLTAR (Tecla Espacio)
    // Este es el método que animacion.js necesita
    accionSolicitada() {
        if (this.teclas[" "] && !this.teclaPresionada.espacio) {
            this.teclaPresionada.espacio = true; 
            return true;
        }
        return false;
    }

    obtenerEstado() {
        return this.teclas;
    }
}