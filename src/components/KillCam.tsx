import * as faceapi from 'face-api.js';
import React, {useEffect, useState, useRef} from 'react';
import { useWebcam } from '../contexts/WebcamProvider';
import { useNavigate } from 'react-router-dom';

type KillCamProps = {
  faceMatcher: (faceapi.FaceMatcher | null)
}
const KillCam: React.FC<KillCamProps> = ({faceMatcher}) => {
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;
  const  videoStarted = webcamContext?.videoStarted;
  const navigate = useNavigate();
  const videoHeight = window.innerHeight;
  const videoWidth = window.innerWidth;
  const displaySize = { width: videoWidth, height: videoHeight };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    createCanvas()
    console.log('createdCanvas')
  }, [])

  useEffect(() => {
    handleVideoOnPlay();
  }, [faceMatcher])

  const createCanvas = () => {
    if (videoStarted && webcamRef?.current?.video){
      canvasRef.current = faceapi.createCanvasFromMedia(webcamRef.current.video);
    }
  };

  const handleVideoOnPlay = () => {
    console.log('handling video play')
    if (canvasRef.current && webcamRef?.current) {
      faceapi.matchDimensions(canvasRef.current, displaySize);
      console.log('matching facial dimensions')
    }
    setInterval(async () => {
      if (faceMatcher && webcamRef?.current?.video && canvasRef.current) {
        console.log('1');
        const detections = await faceapi
          .detectAllFaces(webcamRef.current.video)
          .withFaceLandmarks()
          .withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, videoWidth, videoHeight);
        }
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        // for every face, find best result
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))   
        //for Each, adds a box
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
          if (canvasRef.current) {
              drawBox.draw(canvasRef.current)
          }        
        })
      }
    }, 100);
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px', display: 'flex', justifyContent: 'center' }}>      
      <button style={{ position: 'absolute', top:'10%' }} onClick={()=>{navigate('/gameover')}}> wow you won the game! </button>
      <canvas ref={canvasRef} style={{ position: 'absolute' }} />
    </div>
  );
}

export default KillCam;
