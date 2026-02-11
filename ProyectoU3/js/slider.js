document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".slider-track");
    if (!track) return;

    // 1. Clonación de las cards originales para el bucle
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let xPosition = 0;
    const speed = 1.2; // Velocidad del catálogo
    let isPaused = false;

    function animate() {
        if (!isPaused) {
            xPosition += speed;
    
            const resetPoint = track.scrollWidth / 2;

            if (xPosition >= resetPoint) {
                xPosition = 0;
            }
            
            track.style.transform = `translateX(-${xPosition}px)`;
        }
        requestAnimationFrame(animate);
    }

    // Iniciar cuando las imágenes de los alojamientos estén cargadas
    window.addEventListener('load', () => {
        animate();
    });

    // Pausa al pasar el mouse para inspeccionar alojamientos
    track.addEventListener("mouseenter", () => isPaused = true);
    track.addEventListener("mouseleave", () => isPaused = false);
});
