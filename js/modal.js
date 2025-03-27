// Obtener referencias a los elementos del DOM
const modal = document.getElementById('modal');
const trigger = document.getElementById('tip');
const closeModalBtn = document.getElementById('close-modal');
const buttonScreen3 = document.getElementById('buttonScreen3');

// Abrir el modal cuando se hace clic en el div con id="tip"
trigger.addEventListener('click', () => {
    modal.style.display = 'block';
    buttonScreen3.style.zIndex = 9;
});

// Cerrar el modal cuando se hace clic en el botón de cerrar (la "X")
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    buttonScreen3.style.zIndex = 10;
});