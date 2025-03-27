    const capaExterna = document.querySelector('.capa-externa');
    const capaInterna = document.querySelector('.capa-interna');
    const circulo = document.querySelector('.circulo');
    const boton = document.getElementById('buttonScreen1');

    // Variables configurables
    const porcentajeDiámetroLandscape = 30; // Diámetro como porcentaje del ancho en modo landscape
    const porcentajeDiámetroPortrait = 80;  // Diámetro como porcentaje del ancho en modo portrait (1080x1920)
    const velocidadCierre = 1; // Velocidad de la animación de cierre en segundos
    const velocidadBaseMin = 0.06; // Velocidad mínima
    const velocidadBaseMax = 0.10; // Velocidad máxima
    const porcentajeSalida = 40; // Porcentaje de la circunferencia que puede salir de la pantalla

    let x, y; // Posición del centro del círculo (en porcentajes)
    let velocidadX, velocidadY; // Velocidades en cada eje
    let diametro; // Diámetro actual del círculo (en píxeles)
    let radio; // Radio del círculo (en píxeles)
    
    let animando = false; // Controla si la animación está en curso
    let ultimoReboteX = 0; // Tiempo del último rebote en X
    let ultimoReboteY = 0; // Tiempo del último rebote en Y
    let cooldownRebote = 500; // Milisegundos entre rebotes para evitar rebotes múltiples

    // Función para generar un número aleatorio entre min y max
    function aleatorio(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Función para detectar si estamos en modo portrait o landscape
    function esModoPodrtrait() {
      return window.innerHeight > window.innerWidth;
    }

    // Función para calcular el diámetro según la orientación de la pantalla
    function calcularDiametro() {
      if (esModoPodrtrait()) {
        // Si estamos en modo portrait (1080x1920 o similar)
        return (window.innerWidth * porcentajeDiámetroPortrait) / 100;
      } else {
        // Si estamos en modo landscape
        return (window.innerWidth * porcentajeDiámetroLandscape) / 100;
      }
    }

    // Función para inicializar el círculo con velocidades aleatorias
    function inicializarCirculo() {
      diametro = calcularDiametro();
      radio = diametro / 2;
      
      // Posición inicial centrada (en porcentajes)
      x = 50;
      y = 50;
      
      // Establecer velocidades aleatorias iniciales
      asignarVelocidadesAleatorias();
      
      // Establecer el círculo inicial
      actualizarPosicionCirculo();
    }

    // Función para asignar velocidades aleatorias
    function asignarVelocidadesAleatorias() {
      // Asignar velocidades aleatorias dentro del rango
      const velocidadMagnitud = aleatorio(velocidadBaseMin, velocidadBaseMax);
      
      // Ángulo aleatorio para la dirección
      const angulo = aleatorio(0, Math.PI * 2);
      
      // Velocidades en X e Y basadas en el ángulo
      velocidadX = velocidadMagnitud * Math.cos(angulo);
      velocidadY = velocidadMagnitud * Math.sin(angulo);
      
      // Asegurar que las velocidades no sean muy pequeñas
      if (Math.abs(velocidadX) < 0.03) {
        velocidadX = velocidadX >= 0 ? 0.03 : -0.03;
      }
      if (Math.abs(velocidadY) < 0.03) {
        velocidadY = velocidadY >= 0 ? 0.03 : -0.03;
      }
    }

    // Función para actualizar la posición del círculo mediante clip-path
    function actualizarPosicionCirculo() {
      // Convertir posición de porcentaje a píxeles
      const xPx = (x / 100) * window.innerWidth;
      const yPx = (y / 100) * window.innerHeight;
      
      // Actualizar la posición del círculo en ambas capas
      capaExterna.style.clipPath = `circle(${radio}px at ${xPx}px ${yPx}px)`;
      capaInterna.style.clipPath = `circle(${radio}px at ${xPx}px ${yPx}px)`;
    }

    // Función para mover el círculo
    function moverCirculo() {
      if (!animando) return;
      
      // Mover el círculo según su velocidad actual
      x += velocidadX;
      y += velocidadY;
      
      // Calcular los límites de la pantalla en porcentaje
      const limiteIzquierdo = 0;
      const limiteDerecho = 100;
      const limiteSuperior = 0;
      const limiteInferior = 100;
      
      // Calcular el radio como porcentaje de la pantalla
      const radioRelativoX = (radio / window.innerWidth) * 100;
      const radioRelativoY = (radio / window.innerHeight) * 100;
      
      // Calcular el punto en el que debe rebotar (considerando que sale el 60% del círculo)
      const reboteIzquierdo = limiteIzquierdo - radioRelativoX * (porcentajeSalida / 600);
      const reboteDerecho = limiteDerecho + radioRelativoX * (porcentajeSalida / 600);
      const reboteSuperior = limiteSuperior - radioRelativoY * (porcentajeSalida / 600);
      const reboteInferior = limiteInferior + radioRelativoY * (porcentajeSalida / 600);
      
      const ahora = Date.now();

      // Verificar si ha llegado a un punto de rebote en X
      if (x <= reboteIzquierdo && ahora - ultimoReboteX > cooldownRebote) {
        velocidadX = Math.abs(velocidadX) * aleatorio(0.9, 1.1); // Rebote con variación
        
        // A veces cambiar ligeramente la velocidad Y también
        if (Math.random() > 0.5) {
          velocidadY = velocidadY * aleatorio(0.85, 1.15);
        }
        
        ultimoReboteX = ahora;
      } else if (x >= reboteDerecho && ahora - ultimoReboteX > cooldownRebote) {
        velocidadX = -Math.abs(velocidadX) * aleatorio(0.9, 1.1); // Rebote con variación
        
        // A veces cambiar ligeramente la velocidad Y también
        if (Math.random() > 0.5) {
          velocidadY = velocidadY * aleatorio(0.85, 1.15);
        }
        
        ultimoReboteX = ahora;
      }
      
      // Verificar si ha llegado a un punto de rebote en Y
      if (y <= reboteSuperior && ahora - ultimoReboteY > cooldownRebote) {
        velocidadY = Math.abs(velocidadY) * aleatorio(0.9, 1.1); // Rebote con variación
        
        // A veces cambiar ligeramente la velocidad X también
        if (Math.random() > 0.5) {
          velocidadX = velocidadX * aleatorio(0.85, 1.15);
        }
        
        ultimoReboteY = ahora;
      } else if (y >= reboteInferior && ahora - ultimoReboteY > cooldownRebote) {
        velocidadY = -Math.abs(velocidadY) * aleatorio(0.9, 1.1); // Rebote con variación
        
        // A veces cambiar ligeramente la velocidad X también
        if (Math.random() > 0.5) {
          velocidadX = velocidadX * aleatorio(0.85, 1.15);
        }
        
        ultimoReboteY = ahora;
      }
      
      // Cada cierto tiempo (baja probabilidad), hacer un cambio aleatorio en la velocidad
      if (Math.random() < 0.001) {  // 0.1% de probabilidad en cada frame
        // Cambiar ligeramente la velocidad para evitar patrones repetitivos
        velocidadX = velocidadX * aleatorio(0.8, 1.2);
        velocidadY = velocidadY * aleatorio(0.8, 1.2);
        
        // Asegurarse que la velocidad no sea ni muy rápida ni muy lenta
        const velocidadTotal = Math.sqrt(velocidadX * velocidadX + velocidadY * velocidadY);
        if (velocidadTotal < velocidadBaseMin) {
          // Normalizar y aumentar
          const factor = velocidadBaseMin / velocidadTotal;
          velocidadX *= factor;
          velocidadY *= factor;
        } else if (velocidadTotal > velocidadBaseMax) {
          // Normalizar y reducir
          const factor = velocidadBaseMax / velocidadTotal;
          velocidadX *= factor;
          velocidadY *= factor;
        }
      }
      
      // Actualizar la posición visual del círculo
      actualizarPosicionCirculo();
      
      // Solicitar el siguiente frame de animación
      requestAnimationFrame(moverCirculo);
    }

    // Iniciar el efecto al hacer clic en el botón
    boton.addEventListener('click', () => {
    // Ocultar el botón inmediatamente
    boton.style.display = 'none';
  
    // Esperar 3 segundos antes de comenzar la animación
    setTimeout(() => {
      // Calcular el diámetro
      diametro = calcularDiametro();
      radio = diametro / 2;
  
      // Posición inicial en el centro
      const centroX = window.innerWidth / 2;
      const centroY = window.innerHeight / 2;
  
      // Animación inicial: el círculo aparece en el centro
      capaExterna.style.transition = `clip-path ${velocidadCierre}s ease-in-out`;
      capaInterna.style.transition = `clip-path ${velocidadCierre}s ease-in-out`;
  
      capaExterna.style.clipPath = `circle(${radio}px at ${centroX}px ${centroY}px)`;
      capaInterna.style.clipPath = `circle(${radio}px at ${centroX}px ${centroY}px)`;
  
      // Después de la animación inicial, comenzar el movimiento
      setTimeout(() => {
        // Quitar la transición para el movimiento fluido
        capaExterna.style.transition = 'none';
        capaInterna.style.transition = 'none';
  
        // Inicializar variables
        inicializarCirculo();
        
        //AGREGA CLASS PARA EFECTO CIRCULO
        // Iniciar animación
        animando = true;
        moverCirculo();
      }, velocidadCierre * 1000);
    }, 1400); // Esperar 3 segundos (3000 milisegundos)
  });

  function eliminarEfectoCirculo() {
    // Detener completamente la animación
    animando = false;
    
    // Revertir los estilos de clip-path
    capaExterna.style.clipPath = '';
    capaInterna.style.clipPath = '';
    
    // Opcional: Restaurar cualquier estilo que hayas modificado
    capaExterna.style.transition = '';
    capaInterna.style.transition = '';
}

    // Recalcular dimensiones al redimensionar la ventana
    window.addEventListener('resize', () => {
      if (animando) {
        // Actualizar diámetro y radio
        diametro = calcularDiametro();
        radio = diametro / 2;
        
        // Actualizar posición del círculo
        actualizarPosicionCirculo();
      }
    });


  function reducirDiametroYCambiarColor() {
        // Cambiar el color a blanco
        capaInterna.style.transition = 'background-color 1.5s ease-in-out';
        capaInterna.style.backgroundColor = '#ffffff';
        
        // Ajustar z-index para que quede detrás de las barras
        capaInterna.style.zIndex = '1';
        
        // Quitar la capa interna de la pantalla 3
        const capaInternaScreen3 = document.querySelector('.screen3 .capa-interna');
        if (capaInternaScreen3) {
            capaInternaScreen3.style.display = 'none';
        }
        
        // Reducir el tamaño gradualmente
        const reduccionGradual = setInterval(() => {
            radio = radio * 0.99;
            if (radio < diametro * 0.4) {
                clearInterval(reduccionGradual);
            }
        }, 50);
  }

  function agrandarDiametroYCambiarColor() {
    // Cambiar el color a blanco
    capaInterna.style.transition = 'background-color 1.5s ease-in-out';
    capaInterna.style.backgroundColor = '#ffffff';
    
    // Ajustar z-index para que quede detrás de las barras
    capaInterna.style.zIndex = '1';
    
    // Quitar la capa interna de la pantalla 3
    const capaInternaScreen3 = document.querySelector('.screen3 .capa-interna');
    if (capaInternaScreen3) {
        capaInternaScreen3.style.display = 'none';
    }
    
    // Reducir el tamaño gradualmente
    const aumentoGradual = setInterval(() => {
      radio = radio * 10; // Aumenta el radio en un 1% en cada iteración
      if (radio > diametro * 3) { // Detiene el intervalo cuando el radio supera el doble del diámetro (ajusta este valor según necesites)
          clearInterval(aumentoGradual);
      }
  }, 50);
}

function desactivarEfectoCircular() {
    // Obtener todos los elementos con clip-path
    capaInterna.style.zIndex = '5';
    capaExterna.style.zIndex = '7';
}

// Modificar el evento del botón
document.getElementById('buttonScreen2').addEventListener('click', function() {
  setTimeout(reducirDiametroYCambiarColor, 1500);
});