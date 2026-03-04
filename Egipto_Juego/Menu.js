export function crearMenu(alEmpezar) {
    // 1. Crear el contenedor principal
    const menu = document.createElement('div');
    menu.id = 'menu-principal';
    menu.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: url('fondo_menu.png') no-repeat center center; /* CAMBIADO A .PNG */
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        transition: opacity 1s ease;
    `;

    // 2. Título del Juego (Para que quede bien arriba)
    const titulo = document.createElement('h1');
    titulo.innerText = 'EL SECRETO DE OSIRIS';
    titulo.style.cssText = `
        color: #FFD700;
        font-size: 60px;
        font-family: 'Arial Black', sans-serif;
        text-shadow: 4px 4px 10px rgba(0,0,0,0.8);
        margin-bottom: 20px;
        text-align: center;
    `;

    // 3. Botón de Inicio
    const boton = document.createElement('button');
    boton.innerText = 'COMENZAR AVENTURA';
    boton.style.cssText = `
        padding: 20px 40px;
        font-size: 24px;
        font-family: 'Arial Black', sans-serif;
        background: #FFD700;
        color: #222;
        border: 4px solid #fff;
        border-radius: 15px;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        margin-top: 200px; 
        transition: transform 0.2s;
    `;

    // Efectos del botón
    boton.onmouseover = () => boton.style.transform = 'scale(1.1)';
    boton.onmouseout = () => boton.style.transform = 'scale(1)';

    boton.onclick = () => {
        menu.style.opacity = '0'; 
        setTimeout(() => {
            menu.remove(); 
            alEmpezar();   
        }, 1000);
    };

    menu.appendChild(titulo); // Agregamos el título
    menu.appendChild(boton);
    document.body.appendChild(menu);
}