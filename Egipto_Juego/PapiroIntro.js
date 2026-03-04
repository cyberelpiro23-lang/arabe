export function mostrarPapiroIntro(alTerminar) {
    const overlay = document.createElement('div');
    overlay.id = 'papiro-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); /* Un poco más oscuro para que resalte el papiro */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000; 
        opacity: 0;
        transition: opacity 1s ease;
    `;

    const papiro = document.createElement('div');
    papiro.style.cssText = `
        width: 85%;
        max-width: 800px;
        height: 80%;
        max-height: 700px;
        background: url('papiro.png') no-repeat center center; /* RUTA CORREGIDA: Sin assets/ */
        background-size: 100% 100%;
        padding: 60px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        filter: drop-shadow(0px 10px 30px rgba(0,0,0,0.5));
    `;

    const textoContenedor = document.createElement('div');
    textoContenedor.style.cssText = `
        font-family: 'Georgia', serif; 
        color: #3d2b1f; /* Color tinta antigua */
        font-size: 22px;
        line-height: 1.5;
        font-style: italic;
        overflow-y: auto;
        padding: 0 20px;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.5);
    `;

    const historia = `
        <h2 style="margin-top:0; color:#5c4033; font-family:'Times New Roman'">El Despertar de la Profecía</h2>
        <p>Hace eones, bajo el velo dorado del antiguo Egipto, los guardianes del saber ocultaron un poder inimaginable: <strong>"El Secreto de Osiris"</strong>.</p>
        <p>Mucha gente lo ha intentado. Pero una vez Un hombre llamado mongo. Lo iba a intentar con una convicción tan grande que no sabía lo que el destino le aguardaba. ahora por capricho del destino dos niños deberán entrar a este templo.</p>
        <p><strong>El destino descansa sobre sus hombros.</strong></p>
    `;
    textoContenedor.innerHTML = historia;

    const botonSaltar = document.createElement('button');
    botonSaltar.innerText = 'COMENZAR LA BÚSQUEDA';
    botonSaltar.style.cssText = `
        margin-top: 30px;
        padding: 12px 25px;
        font-size: 18px;
        font-family: 'Arial Black', sans-serif;
        background: #5c4033;
        color: #f3e5ab;
        border: 2px solid #3d2b1f;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
    `;

    botonSaltar.onmouseover = () => {
        botonSaltar.style.background = '#3d2b1f';
        botonSaltar.style.transform = 'scale(1.05)';
    };
    botonSaltar.onmouseout = () => {
        botonSaltar.style.background = '#5c4033';
        botonSaltar.style.transform = 'scale(1)';
    };

    botonSaltar.onclick = () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            alTerminar(); 
        }, 1000);
    };

    papiro.appendChild(textoContenedor);
    papiro.appendChild(botonSaltar);
    overlay.appendChild(papiro);
    document.body.appendChild(overlay);

    // Fade-in suave
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);
}