// Variable global para controlar el tiempo de la animación
let animationDuration = 1; // Duración en segundos - más corto para más olas juntas

// Parámetro para controlar a partir de qué barra se reduce el grosor
const startThinningFromBar = 35;

// Variables para controlar la velocidad del efecto según la orientación
let isLandscape = window.innerWidth > window.innerHeight;
let waveDelayTime = isLandscape ? 20 : 40;
let totalBars = 0;
let animationInProgress = false;
let currentDirection = 1; // Variable global para rastrear la dirección actual

// Función para generar las barras dinámicamente
function generateBars(direction = 1, moveBarsLeft = true) {
  currentDirection = direction; // Guardar la dirección actual
  const container = document.getElementById('barContainer');
  const screenWidth = window.innerWidth;

  // Verificar orientación
  isLandscape = window.innerWidth > window.innerHeight;
  waveDelayTime = isLandscape ? 20 : 40;

  // Ajustar parámetros para mostrar más barras según la orientación
  const maxBarWidth = isLandscape ? 8 : 6;
  const minBarWidth = 3;
  const minSpacing = 3;
  const maxSpacing = 5;

  // Limpiar el contenedor antes de generar nuevas barras
  container.innerHTML = '';

  let totalWidth = 0;
  let barWidth = direction === 1 ? maxBarWidth : minBarWidth; // Iniciar con barras de grosor máximo o mínimo según la dirección // Siempre iniciar con barras de grosor máximo
  let barIndex = 0;

  while (totalWidth < screenWidth) {
    // Calcular el espaciado
    const barSpacing = minSpacing + (maxSpacing - minSpacing) * ((maxBarWidth - barWidth) / (maxBarWidth - minBarWidth));

    // Crear la barra y asignarle sus propiedades
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.dataset.index = barIndex;
    bar.dataset.originalWidth = barWidth; // Guardar el ancho original para usar en la transición
    bar.dataset.targetWidth = direction === 1 ? 
      Math.max(minBarWidth, maxBarWidth - (0.1 * barIndex)) : 
      Math.min(maxBarWidth, minBarWidth + (0.1 * barIndex)); // Calcular el ancho objetivo según la dirección
    bar.style.setProperty('--bar-spacing', `${barSpacing}px`);
    bar.style.flex = `0 0 ${barWidth}px`; // Todas las barras comienzan con el ancho máximo

    // Añadir la barra al contenedor
    container.appendChild(bar);

    // Actualizar el ancho total acumulado
    totalWidth += barWidth + barSpacing;

    // Reducimos el grosor para la siguiente barra (solo para cálculo de espaciado)
    barWidth = direction === 1 ? Math.max(minBarWidth, barWidth - 0.1) : Math.min(maxBarWidth, barWidth + 0.1); // Reducir o aumentar el grosor según la dirección

    // Incrementar el contador de barras
    barIndex++;
  }

  // Guardar el total de barras
  totalBars = barIndex;
}

// Función para iniciar la animación de ola con reordenamiento de barras
function startWaveAnimation() {
  const bars = document.querySelectorAll('.bar');
  
  bars.forEach((bar, index) => {
    const position = index / totalBars;
    const baseAmplitude = isLandscape ? -70 : -90;
    const waveHeight = baseAmplitude * Math.sin(position * Math.PI);
    const waveHeightDown = Math.abs(waveHeight);

    // Primero eliminar cualquier animación anterior
    bar.style.animation = '';
    bar.classList.remove('animating', 'wave-both');

    // Establecer el ancho objetivo basado en la dirección guardada
    const targetWidth = parseFloat(bar.dataset.targetWidth);
    
    // Aplicar transición al ancho durante la animación de ola
    bar.style.transition = 'flex-basis 1.5s ease-in-out';
    
    // Establecer los valores de la ola
    bar.style.setProperty('--wave-height', `${waveHeight}px`);
    bar.style.setProperty('--wave-height-down', `${waveHeightDown}px`);
    bar.style.setProperty('--animation-duration', `${animationDuration}s`);

    // Retraso entre barras
    const delayFactor = isLandscape ? 5 : 10;
    const delay = (index * delayFactor) / 900;
    bar.style.animationDelay = `${delay}s`;
    
    // Aplicar el mismo retraso para la transición del ancho
    setTimeout(() => {
      bar.style.flex = `0 0 ${targetWidth}px`;
    }, delay * 1000);

    // Forzar un reflow para asegurar que los estilos se apliquen antes de añadir la animación
    void bar.offsetWidth;

    // Aplicar la animación
    bar.classList.add('animating', 'wave-both');
  });
}

// Función para disminuir gradualmente la amplitud de la ola
function fadeOutWaveAnimation() {
  const bars = document.querySelectorAll('.bar');
  let amplitude = isLandscape ? 70 : 90;
  const decrementStep = 2;
  const fadeOutInterval = 500;

  const interval = setInterval(() => {
    amplitude -= decrementStep;

    if (amplitude <= 0) {
      clearInterval(interval);
      stopAllAnimations();
      return;
    }

    bars.forEach(bar => {
      const originalHeight = parseFloat(bar.style.getPropertyValue('--wave-height') || 0);
      const ratio = amplitude / (isLandscape ? 70 : 90);
      bar.style.setProperty('--wave-height', `${originalHeight * ratio}px`);
      bar.style.setProperty('--wave-height-down', `${Math.abs(originalHeight) * ratio}px`);
    });
  }, fadeOutInterval);
}

// Función para detener todas las animaciones
function stopAllAnimations() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    bar.classList.remove('animating', 'wave-both');
    bar.style.animation = 'none';
    bar.style.transform = 'translateY(0)';
    // No resetear el ancho de las barras para mantener la dirección actual
  });
}

// Ocultar todas las pantallas al inicio
function hideAllScreens() {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('visible'); // Fade out
    screen.style.opacity = '0'; // Asegurar opacidad 0
    screen.style.pointerEvents = 'none'; // Deshabilitar interacciones
  });
}

// Animación inicial al cargar la página
function initialAnimation() {
  hideAllScreens();

  const container = document.getElementById('container');
  const barContainer = document.getElementById('barContainer');

  // 1. Desplegar las barras de izquierda a derecha
  barContainer.classList.add('deployed');
  container.classList.add('animate');

  // 2. Iniciar la animación de ola después de que las barras se hayan desplegado
  setTimeout(() => {
    startWaveAnimation();
    
    // Desvanecer la ola gradualmente después de un tiempo
    setTimeout(() => {
      fadeOutWaveAnimation();
    }, 2500);
  }, 1000);

  // 3. Mostrar la primera pantalla con fade in
  setTimeout(() => {
    const screen1 = document.getElementById('screen1');
    screen1.classList.add('visible'); // Fade in
    screen1.style.opacity = '1'; // Asegurar opacidad 1
    screen1.style.pointerEvents = 'auto'; // Habilitar interacciones
  }, 1000);

  // 4. Mostrar el botón de la primera pantalla
  setTimeout(() => {
    const buttonScreen1 = document.getElementById('buttonScreen1');
    buttonScreen1.style.display = 'block';
  }, 4000);
}




// Función para ir a la siguiente pantalla
function goToNextScreen(
  currentScreen, 
  nextScreen, 
  direction, 
  hide = false, 
  show = null, 
  transitionConfig = {}
  ) 
  {
  const defaultTransitionConfig = {
    currentScreenFadeOutDuration: 0.5,   // Tiempo para ocultar la pantalla actual
    nextScreenFadeInDuration: 0.5,       // Tiempo para mostrar la nueva pantalla
    fadeOutDelay: 0,        
    fadeInDelay: 800,       
    waveAnimationDelay: 1500, 
    buttonShowDelay: 3000   
  };

  const config = { ...defaultTransitionConfig, ...transitionConfig };

  if (animationInProgress) return;
  animationInProgress = true;

  const container = document.getElementById('container');
  const barContainer = document.getElementById('barContainer');

  // Ocultar el botón actual
  const currentButton = document.getElementById(`button${currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)}`);
  currentButton.style.transition = 'opacity 2s';
  currentButton.style.opacity = '0';
  setTimeout(() => currentButton.style.display = 'none', 2000);

  // Obtener elementos de pantalla
  const currentScreenElement = document.getElementById(currentScreen);
  const nextScreenElement = document.getElementById(nextScreen);

  // Personalizar duración de transición
  currentScreenElement.style.transition = `opacity ${config.currentScreenFadeOutDuration}s ease-in-out`;
  nextScreenElement.style.transition = `opacity ${config.nextScreenFadeInDuration}s ease-in-out`;
  // Detener todas las animaciones de ola antes de iniciar una nueva
  stopAllAnimations();
  
  // Regenerar las barras con la dirección especificada
  const barDirection = direction === 2 ? 2 : 1;
  generateBars(barDirection);
  
  // Ocultar el slide si se solicita
  if (hide) {
    const slideElement = document.getElementById(hide);
    if (slideElement) {
        slideElement.style.transition = 'opacity 1.5s ease';
        slideElement.style.opacity = '0';
        
        // Esperar a que termine la transición antes de aplicar display: none
        setTimeout(() => {
            slideElement.style.display = 'none';
        }, 1500); // 1500ms = 1.5 segundos
    }
}

  // Fade out de la pantalla actual
  setTimeout(() => {
    currentScreenElement.classList.remove('visible');
    currentScreenElement.style.opacity = '0';
    currentScreenElement.style.pointerEvents = 'none';
  }, config.fadeOutDelay);

  // Mostrar la siguiente pantalla con fade in
  setTimeout(() => {
    nextScreenElement.classList.add('visible');
    nextScreenElement.style.opacity = '1';
    nextScreenElement.style.pointerEvents = 'auto';

    // Mostrar el slide si se solicita
    if (show) {
      const slideElement = document.getElementById(show);
      if (slideElement) {
          // Asegurar que el elemento esté oculto inicialmente (transparente)
          slideElement.style.opacity = '0';
          slideElement.style.display = 'block'; // Mostrar (pero aún invisible)
          
          // Forzar un reflow para que la transición funcione
          void slideElement.offsetWidth;
          
          // Aplicar el fade in
          slideElement.style.transition = 'opacity 1.5s ease';
          slideElement.style.opacity = '1';
      }
  }

  // En la función goToNextScreen o en el caso específico de screen7
  if (nextScreen === 'screen7') {
    // Mostrar slide y barras
    const slideElement = document.querySelector('.slide');
    const barContainer = document.getElementById('barContainer');
    
    if (slideElement) {
      slideElement.style.display = 'block';
      slideElement.style.opacity = '1';
    }
    
    if (barContainer) {
      barContainer.style.display = 'flex';
      barContainer.style.opacity = '1';
    }
  
    // Regenerar y animar barras
    generateBars(currentDirection);
    startWaveAnimation();
  }

// === REEMPLAZA ESTO ===
if (nextScreen === 'screen7') {
  // A. Mostrar fondo amarillo
  const slideElement = document.querySelector('.slide');
  if (slideElement) {
    slideElement.style.display = 'block';
    slideElement.style.opacity = '1';
  }
  
  // B. Resetear y animar barras
  generateBars(currentDirection); // Regenerar si es necesario
  animateBarsInScreen7(); // Entrada + ola
  
  // C. Mostrar botón después de 6 segundos (ajustable)
  setTimeout(() => {
    const nextButton = document.getElementById('buttonScreen7');
    if (nextButton) nextButton.style.display = 'block';
  }, 6000);
}

  if (nextScreen === 'screen7') {
    // Resetear y animar barras amarillas
    generateBars(currentDirection); // Regenerar barras (opcional, si necesitas limpiar)
    animateYellowBars(); // Aplicar color amarillo y animación de entrada
  
    // Mostrar slide (fondo amarillo)
    const slideElement = document.querySelector('.slide');
    if (slideElement) {
      slideElement.style.display = 'block';
      slideElement.style.opacity = '1';
    }
  }
  

    // Iniciar la animación de ola inmediatamente
    startWaveAnimation();

    // Desvanecer la ola gradualmente después de un tiempo
    setTimeout(() => {
      fadeOutWaveAnimation();
    }, config.waveAnimationDelay);

    // Mostrar el botón de la siguiente pantalla
    setTimeout(() => {
      const nextButton = document.getElementById(`button${nextScreen.charAt(0).toUpperCase() + nextScreen.slice(1)}`);
      nextButton.style.display = 'block';
      animationInProgress = false;
    }, config.buttonShowDelay);
  }, config.fadeInDelay);
}

// Controlar cambios de orientación y redimensionado
let resizeTimeout;

window.addEventListener('orientationchange', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    isLandscape = window.innerWidth > window.innerHeight;
    waveDelayTime = isLandscape ? 20 : 40;
    stopAllAnimations();
    generateBars(currentDirection); // Mantener la dirección actual
    startWaveAnimation();
  }, 300);
});

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    isLandscape = window.innerWidth > window.innerHeight;
    waveDelayTime = isLandscape ? 20 : 40;
    stopAllAnimations();
    generateBars(currentDirection); // Mantener la dirección actual
    startWaveAnimation();
  }, 250);
});



// === REEMPLAZA ESTO EN TU JS ===
function animateBarsInScreen7() {
  const barContainer = document.getElementById('barContainer');
  
  // 1. Preparar estado inicial (fuera de pantalla)
  barContainer.style.transition = 'none'; // Desactivar transiciones temporalmente
  barContainer.style.left = '-100%';
  
  // 2. Aplicar clases para color amarillo y estilos
  barContainer.classList.add('screen7-active');
  
  // 3. Forzar reflow (para asegurar la animación)
  void barContainer.offsetWidth;
  
  // 4. Activar transición y animar entrada
  barContainer.style.transition = 'left 2.5s cubic-bezier(0.2, 0.8, 0.4, 1)';
  barContainer.style.left = '0';
  
  // 5. Iniciar animación de ola después de la entrada
  setTimeout(() => {
    startWaveAnimation();
  }, 3000);
}


//OCULTA O MUESTRA DIVS
/**
 * Elimina elementos del DOM y muestra otros con fadeIn después de un retraso.
 * @param {string|array} divsEliminar - Selector(es) de los elementos a eliminar.
 * @param {string|array} divsMostrar - Selector(es) de los elementos a mostrar.
 * @param {number} retrasoMs - Retraso en milisegundos antes de mostrar.
 * @param {number} [duracionFade=300] - Duración del fadeIn (opcional).
 */
function removeAndShowDivsConRetraso(divsEliminar, divsMostrar, retrasoMs, duracionFade = 300) {
  // Elimina los elementos (inmediatamente)
  eliminarDivs(divsEliminar);
  
  // Muestra los elementos después del retraso (con fadeIn)
  setTimeout(() => {
    if (divsMostrar && !estaVacio(divsMostrar)) {
      fadeInDivs(divsMostrar, duracionFade);
    }
  }, retrasoMs);
}

// --- Funciones auxiliares COMPLETAS ---
function estaVacio(valor) {
  return (
    valor === null ||
    valor === undefined ||
    (Array.isArray(valor) && valor.length === 0) ||
    (typeof valor === 'string' && valor.trim() === '')
  );
}

function fadeInDivs(selectores, duracion) {
  aplicarAccion(selectores, (div) => {
    div.style.opacity = '0';
    div.style.display = 'block'; // Asegura que el div sea visible antes de animar
    div.style.transition = `opacity ${duracion}ms ease`;
    // Truco para reiniciar la transición
    void div.offsetWidth;
    div.style.opacity = '1';
  });
}

function eliminarDivs(selectores) {
  aplicarAccion(selectores, (div) => div.remove());
}

function aplicarAccion(selectores, accion) {
  const elementos = Array.isArray(selectores) ? selectores : [selectores];
  elementos.forEach(selector => {
    const divs = document.querySelectorAll(selector);
    divs.forEach(div => accion(div));
  });
}
// (Las funciones fadeInDivs, estaVacio y aplicarAccion se mantienen igual)

// (Las funciones fadeOutDivs, fadeInDivs y aplicarAccion siguen igual que antes)

//Un div, si es vacío null
// toggleDivsConFade(
//   "#div1",      // Oculta #div1 con fadeOut
//   "#div2",      // Muestra #div2 con fadeIn después del retraso
//   2000,         // Retraso: 2 segundos
//   500           // Duración del fade: 500ms (opcional, por defecto 300ms)
// );
//varios divs
// toggleDivsConFade(
//   [".clase-a-ocultar", "#otro-div"],  // Oculta estos con fadeOut
//   [".clase-a-mostrar", "#otro"],      // Muestra estos con fadeIn
//   1500                                // Retraso: 1.5 segundos
// );





// Iniciar al cargar la página
window.addEventListener('load', () => {
  console.log('Todo bien');
  generateBars();
  initialAnimation();
});

function animateYellowBars() {
  const barContainer = document.getElementById('barContainer');
  if (!barContainer) return;

  // 1. Cambiar color de las barras a amarillo
  const bars = barContainer.querySelectorAll('.bar');
  bars.forEach(bar => {
    bar.style.backgroundColor = '#FFD244'; // Amarillo
    bar.style.background = 'linear-gradient(to bottom, #FFD244, #FFE180)'; // Degradado opcional
  });

  // 2. Posicionar fuera de la pantalla (izquierda) y animar entrada
  barContainer.style.left = '-100%';
  barContainer.style.transition = 'left 3.5s ease-out';

  // 3. Forzar reflow y activar animación
  setTimeout(() => {
    barContainer.style.left = '0'; // Entra desde la izquierda
  }, 100);

  // 4. Opcional: Animación de ola después de entrar
  setTimeout(() => {
    startWaveAnimation(); // Si quieres el efecto de ola
  }, 3500);
}

// Función para animar las barras con efecto de ola
function animateWaveBars() {
  const barContainer = document.getElementById('barContainer');
  if (!barContainer) return;
  
  // Verificar si estamos en la transición de pantalla 3 a 4
  const screen3 = document.getElementById('screen3');
  const screen4 = document.getElementById('screen4');
  
  // Si estamos en la transición de pantalla 3 a 4, no ejecutar la animación
  if (screen3 && screen4 && 
      window.getComputedStyle(screen3).opacity > 0 && 
      window.getComputedStyle(screen4).opacity > 0) {
    return;
  }
  
  const bars = barContainer.querySelectorAll('div');
  if (bars.length === 0) return;
  
  // Asegurarse de que el contenedor sea visible durante la animación
  barContainer.style.display = 'block';
  barContainer.style.opacity = '1';
  
  // Aplicar la animación con retrasos escalonados
  bars.forEach((bar, index) => {
    // Eliminar clases de animación previas si existen
    bar.classList.remove('bar-wave');
    
    // Calcular el retraso basado en la posición
    const delay = index * 50; // 50ms de retraso entre cada barra
    
    // Aplicar la animación con retraso
    setTimeout(() => {
      bar.style.animationDelay = `${delay}ms`;
      bar.classList.add('bar-wave');
    }, 10);
  });
}
  
  // Mantener visible el contenedor durante la animación
  setTimeout(() => {
    // No ocultamos el contenedor aquí, dejamos que el código existente lo maneje
  }, 3000); // Tiempo suficiente para que termine la animación

