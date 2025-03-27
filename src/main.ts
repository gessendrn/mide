import { bootstrapCameraKit } from '@snap/camera-kit';
import { CameraKitSession } from '@snap/camera-kit'; // Make sure this import exists

(window as any).fetchLensFromGroup = async (groupKey: string) => {
  console.log(`Fetching lenses for group: ${groupKey}`);
  return Promise.resolve([]); // Placeholder response
};


(async function () {
  /////Production robot
  // const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzMzNzg3Mjc0LCJzdWIiOiI4MjcyMDk0MC0yMTZhLTRkYzctYmYxMy04MzhiOTgyMGMwMDR-UFJPRFVDVElPTn45MzY1MjZkOS0zZDE1LTQ2ZDEtODAxNS01NjAwMDVmMzg5OTUifQ.D5_JKKlPg6ifI5HzsOX2YviHJDrMpsM0JaPqaCZR2pA';
  //Staging robot
  // const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzMzNzg3Mjc0LCJzdWIiOiI4MjcyMDk0MC0yMTZhLTRkYzctYmYxMy04MzhiOTgyMGMwMDR-U1RBR0lOR340NDM1YjU5MC00ODM5LTQzOTQtYThiMy0xMTA1OWM1YTZlYmIifQ.UqjgXrC2CC5KebJP0qdI1NVGCzki7l1mYrH42MiVNKg'; // Replace with your API token from SnapKit Portal
  ///Staging Rol
  const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzMzOTQ3MzA0LCJzdWIiOiI3OGRiM2MzNi1iODk3LTRmN2UtOTNkNy1lOThhY2Q1MDBmMDJ-U1RBR0lOR34xMzMxNTI5Yy04OTAzLTRhOGItYjRhNi1kYjJhOGJlYzE1ZWUifQ.hvmjfa8Eb4ZaU9RgWSNLMXhRTaY97LRc7StizzLGY_c';
  //let session;
  let session: CameraKitSession;
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: Blob[] = [];
  let isRecording = false; // Track recording state
  
  //declare function fetchLensFromGroup(groupKey: string): Promise<any>;


  try {
    const cameraKit = await bootstrapCameraKit({ apiToken });

    // Select the canvas element to use as the live render target
    const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;

    // Create a session with the specified live render target
    session = await cameraKit.createSession({ liveRenderTarget });

    // Get the user's camera stream

    // const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1080  }, // Desired width (e.g., Full HD)
          height: { ideal: 1920 }, // Desired height (e.g., Full HD)
          frameRate: { ideal: 30 }, // Optional: frame rate
          aspectRatio: 9 / 16, // Ensures a vertical aspect ratio

          facingMode: "user", // Use "environment" for rear camera
        },
});
// Create a hidden <video> element for preprocessing the video feed
        const video = document.createElement('video');
        video.srcObject = mediaStream;
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;

        video.onloadedmetadata = async () => {
          // Flip the canvas feed using CSS

          liveRenderTarget.style.transform = 'scaleX(-1) rotate(-0deg)';

          // Pass the video feed to Snap Camera Kit
          await session.setSource(video);

          // Start the session
          await session.play();
        };

        // Toggle Recording
	(window as any).toggleRecording = () => {

//            window.toggleRecording = () => {
              if (!isRecording) {
                startRecording();
              } else {
                stopRecording();
              }
            };

            // Start Recording
   function startRecording() {
     if (!session.output?.live) {
       console.error('No live output available for recording');
       return;
     }
     const stream = session.output.live.captureStream();
     mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

     mediaRecorder.ondataavailable = (event) => {
       if (event.data.size > 0) recordedChunks.push(event.data);
     };

     mediaRecorder.onstop = saveRecording;

     recordedChunks = [];
     mediaRecorder.start();
     isRecording = true;
     updateButtonState();
     console.log('Recording started');
     setTimeout(() => {
	(window as any).fetchLensFromGroup('c0f4df6f-0536-413c-8979-69ab443a4604');
       
	//fetchLensFromGroup('c0f4df6f-0536-413c-8979-69ab443a4604');
       // await session.applyLens(lens);
     }, 1500);

   }

   // Stop Recording
   function stopRecording() {
     if (mediaRecorder && mediaRecorder.state === 'recording') {
       mediaRecorder.stop();
       isRecording = false;
       updateButtonState();
       console.log('Recording stopped');
     }
   }

   // Save Recording
   function saveRecording() {
     const blob = new Blob(recordedChunks, { type: 'video/mp4' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `video_snap_lens_${Date.now()}.mp4`;
     a.click();
     URL.revokeObjectURL(url);
     console.log('Recording saved');
     //window.location.href = 'email.html'; // Redirect to dialogos.html

   }

   // Update Button State
   function updateButtonState() {
     const recordButton = document.getElementById('record-button') as HTMLButtonElement;
     recordButton.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
   }

    // await session.setSource(mediaStream);

    // Start the session
    // await session.play();

    const lens = await cameraKit.lensRepository.loadLens(
      '3033ab6d-4e78-42a0-9853-d7b6ae09e9b4',
      'c0f4df6f-0536-413c-8979-69ab443a4604'
    );
    // const lens = await cameraKit.lensRepository.loadLens(
    //   '3033ab6d-4e78-42a0-9853-d7b6ae09e9b4',
    //   'c0f4df6f-0536-413c-8979-69ab443a4604'
    // );
     // Match animation duration
    await session.applyLens(lens);
    // fetchLensFromGroup('68faf5d3-5acc-47fd-82db-7f16e775290d');
    // fetchLensFromGroup('c0f4df6f-0536-413c-8979-69ab443a4605');

    // Fetch lenses dynamically
  //  (window as any).fetchLensFromGroup = async (groupKey: string) => {
  //console.log(`Fetching lenses for group: ${groupKey}`);
  //return Promise.resolve([]); // Placeholder response
//};

//(window as any).fetchLensFromGroup('c0f4df6f-0536-413c-8979-69ab443a4604');
(window as any).fetchLensFromGroup=async (groupKey: string) => {
//    window.fetchLensFromGroup = async (groupKey: string) => {
      const { lenses } = await cameraKit.lensRepository.loadLensGroups([groupKey]);
      console.log('Lenses:', lenses);

      // console.log(getRandomInt(3));
      if (lenses.length > 0) {
        let aux=getRandomInt(lenses.length);
        await session.applyLens(lenses[aux]); // Apply the first lens in the group
        console.log('Applied Lens:', lenses[aux].id);
      } else {
        console.error('No lenses found in the group');
        alert('No lenses found in the group:'+groupKey);
      }
    };
  } catch (error) {
    console.error('Error initializing Snap Camera Kit:', error);
  }
})();

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
