document.getElementById('startButton').addEventListener('click', function() {
    const circle = document.getElementById('countdownCircle');
    circle.classList.remove('hidden-count');
    let count = 3;
    circle.textContent = count;
  
    const interval = setInterval(() => {
      count--;
      if (count >= 0) {
        circle.textContent = count;
      } else {
        clearInterval(interval);
        circle.classList.add('hidden-count');
      }
    }, 1000);
  });