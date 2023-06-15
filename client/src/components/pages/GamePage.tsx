import * as faceapi from 'face-api.js';
import React, {useEffect, useState, useRef} from 'react';

function GamePage() {

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoHeight = window.innerHeight;
  const videoWidth = window.innerWidth;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const displaySize = { width: videoWidth, height: videoHeight };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.loadSsdMobilenetv1Model('/models')
        await faceapi.loadTinyFaceDetectorModel('/models')
        await faceapi.loadFaceLandmarkModel('/models')
        await faceapi.loadFaceRecognitionModel('/models')
        await faceapi.loadFaceExpressionModel('/models')
        setModelsLoaded(true);
      } catch (err) {
        console.error(err);
        setModelsLoaded(false);
      }
    }

    loadModels();
    console.log('models loaded')
    
    const createCanvas = async () => {
      if(videoRef.current){
        canvasRef.current = await faceapi.createCanvasFromMedia(videoRef.current);
      }
    }
    createCanvas()
    console.log('createdCanvas')
  }, [captureVideo]);


  const startVideo = async () => {
    setCaptureVideo(true);
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: { aspectRatio } })
      if(videoRef.current){
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch(err){
      console.error("error:", err);
    }
  }

  const handleVideoOnPlay = () => {
    if (canvasRef.current && videoRef.current) {
      faceapi.matchDimensions(canvasRef.current, displaySize);
    }

    setInterval(async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, videoWidth, videoHeight);
        }
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        //faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      }
    }, 100);
  };

  const closeWebcam = () => {
    if(videoRef.current && videoRef.current.srcObject){
      const mediaStream = videoRef.current.srcObject as MediaStream;
      videoRef.current.pause();
      mediaStream.getTracks()[0].stop();
      setCaptureVideo(false);
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        {
          captureVideo && modelsLoaded ?
            <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Close Webcam
            </button>
            :
            <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Open Webcam
            </button>
        }
      </div>
      {
        captureVideo ?
          modelsLoaded ?
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
            </div>
            :
            <div>loading...</div>
          :
          <>
          </>
      }
    </div>
  );
}

export default GamePage;

// import React, {useState} from 'react';
// import ChaseMode from '../components/ChaseMode'
// import FaceRecognition from "../components/FaceRecognition";
// import VideoStream from '../components/VideoStream';

// const GamePage: FC = () => {
//   const [gameMode, setGameMode] = useState('Kill')

//   return (
//     <div>
//       {gameMode === 'Chase' &&
//         <ChaseMode/>
//       }
//       {gameMode === 'Kill' &&

//         <FaceRecognition/>
//       }
//       {/* <VideoStream setStream={setStream}/> */}
//     </div>
//   );
// }

// export default GamePage;
