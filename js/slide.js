// Función para activar la entrada animada de los slides
function deploySlides() {
    const slide = document.getElementById('slide');
    if (slide) {
      // Asegúrate de que el slide sea visible antes de aplicar la animación
      slide.style.display = 'block';
      
      // Pequeño retraso para asegurar que el cambio de display sea efectivo
      setTimeout(() => {
        slide.classList.add('deployed');
      }, 50);
    }
  }
  
  // Ejecutar después de que la página esté cargada
  window.addEventListener('load', function() {
    // Pequeño retraso para asegurar que todos los elementos estén renderizados
    setTimeout(deploySlides, 500);
  });
  
  // Función para mostrar el slide con animación cuando se cambia entre pantallas
  function showSlideWithAnimation() {
    const slide = document.getElementById('slide');
    if (slide) {
      // Hacer visible el slide
      slide.style.display = 'block';
      
      // Reiniciar animaciones eliminando la clase
      slide.classList.remove('deployed');
      
      // Forzar un reflow para asegurar que el cambio sea efectivo
      void slide.offsetWidth;
      
      // Aplicar la clase para iniciar las animaciones
      setTimeout(() => {
        slide.classList.add('deployed');
      }, 50);
    }
  }
  
// Detectar cambios de orientación
window.addEventListener('orientationchange', function() {
  // Reiniciar las animaciones cuando cambie la orientación
  const slide = document.getElementById('slide');
  if (slide) {
    slide.classList.remove('deployed');
    setTimeout(function() {
      slide.classList.add('deployed');
    }, 100);
  }
});