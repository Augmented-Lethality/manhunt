import { FaceMatcher, createCanvasFromMedia, matchDimensions, detectAllFaces, resizeResults, draw } from 'face-api.js';
import React, { useEffect, useRef } from 'react';
import { useWebcam } from '../contexts/WebcamProvider';
import { useNavigate } from 'react-router-dom';
import TargetRecognition from './TargetRecognition'
type KillCamProps = {
  faceMatcher: FaceMatcher | null;
}

const KillCam: React.FC<KillCamProps> = ({ faceMatcher }) => {
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;
  const videoStarted = webcamContext?.videoStarted;
  const navigate = useNavigate();
  const videoHeight = window.innerHeight;
  const videoWidth = window.innerWidth;
  const displaySize = { width: videoWidth, height: videoHeight };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const targetCounterRef = useRef<number>(0);
  const wasCatCatMcGeeDetectedRef = useRef<boolean>(false);

  useEffect(() => {
    createCanvas();
  }, [])

  useEffect(() => {
    if (faceMatcher) {
      handleVideoOnPlay();
      const intervalId = setInterval(updateCounter, 500);
      return () => clearInterval(intervalId);
    }
  }, [faceMatcher])

  const createCanvas = () => {
    if (videoStarted && webcamRef?.current?.video) {
      canvasRef.current = createCanvasFromMedia(webcamRef.current.video);
      if (canvasRef.current) {
        matchDimensions(canvasRef.current, displaySize);
      }
    }
  };

  const updateCounter = () => {
    if (wasCatCatMcGeeDetectedRef.current) {
      targetCounterRef.current = Math.min(targetCounterRef.current + 1, 10);
      wasCatCatMcGeeDetectedRef.current = false;
    } else {
      targetCounterRef.current = Math.max(targetCounterRef.current - 1, 0);
    }
    console.log('targetCount', targetCounterRef.current)
    if (targetCounterRef.current === 10) {
      console.log('Win condition met!');
      navigate('/gameover');
    }
  };

  const handleVideoOnPlay = () => {
    const processVideoFrame = async () => {
      if (faceMatcher && webcamRef?.current?.video && canvasRef.current) {
        const detections = await detectAllFaces(webcamRef.current.video)
          .withFaceLandmarks()
          .withFaceDescriptors();
        const resizedDetections = resizeResults(detections, displaySize);
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, videoWidth, videoHeight);
        }
        draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
          const name = result.toString()
          const sliceIndex = name.indexOf(' (')
          const detectedFace = name.slice(0, sliceIndex)
          if (detectedFace === 'Cat Cat McGee') {
            wasCatCatMcGeeDetectedRef.current = true;
          }
          const box = resizedDetections[i].detection.box
          const drawBox = new draw.DrawBox(box, { label: name })
          if (canvasRef.current) {
            drawBox.draw(canvasRef.current)
          }
        });
        setTimeout(processVideoFrame, 100);
      }
    };
    setTimeout(processVideoFrame, 100);
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px', display: 'flex', justifyContent: 'center' }}>      
      <canvas ref={canvasRef} style={{ position: 'absolute' }} />
      {/* <TargetRecognition target/> */}
    </div>
  );
}

export default KillCam;
