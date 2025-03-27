 function cameraInit() {
  const timerCircle = document.getElementById('timer-circle');
  //const animationContainer = document.querySelector('.animation-container');
  const lines = document.querySelectorAll('.line');
  const canvas = document.getElementById('canvas');
  const video = document.createElement('video');
  const buttonContainer = document.querySelector('.button-filter');
  let countdown = 6;
  let mediaRecorder;
  let recordedChunks = [];

  // Attach video element
  video.autoplay = true;
  video.playsInline = true;
  video.style.position = 'fixed';
  video.style.top = '0';
  video.style.left = '0';
  video.style.width = '100vw';
  video.style.height = '100vh';
  video.style.objectFit = 'cover';
  document.body.appendChild(video);

  // Access webcam
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      video.srcObject = stream;
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
    })
    .catch(error => console.error('Error accessing webcam:', error));

  // Countdown timer
  const timer = setInterval(() => {
    countdown--;
    timerCircle.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(timer);
      timerCircle.classList.add('hidden');
      //animationContainer.classList.remove('hidden');

      lines.forEach((line, index) => {
        line.style.animationName = index % 2 === 0 ? 'blue-line-move' : 'yellow-line-move';
        line.style.animationDuration = '1.5s';
        line.style.animationTimingFunction = 'ease-in-out';
        line.style.animationFillMode = 'forwards';
      });

      canvas.classList.remove('hidden');
      buttonContainer.classList.remove('hidden');
      //animationContainer.classList.add('hidden');
      startRecording();
    }
  }, 1000);

  function startRecording() {
    recordedChunks = [];
    mediaRecorder.start();
    setTimeout(stopRecording, 20000); // Record for 20 seconds
  }

  function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      video.srcObject = null;
      video.src = url;
      video.controls = true;
      video.play();

      // Wait a few seconds, then navigate to email.html
      setTimeout(() => {
        goToNextScreen('screen4','screen5',1);
      }, 3000); // Adjust delay as needed
    };
  }
};
