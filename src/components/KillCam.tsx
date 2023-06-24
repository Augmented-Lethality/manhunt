import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaceMatcher,
  createCanvasFromMedia,
  matchDimensions,
  detectAllFaces,
  resizeResults,
  draw } from 'face-api.js';
import { useWebcam } from '../contexts/WebcamProvider';
import TargetRecognition from './KillProgress';

type KillCamProps = {
  faceMatcher: (FaceMatcher | null)
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
  let [targetCounter, setTargetCounter] = useState(0);
  let wasBountyDetected = false;
  
  useEffect(() => {
    createCanvas()
  }, [])

  useEffect(() => {
    if (faceMatcher) {
      handleVideoOnPlay();
      const intervalId = setInterval(updateCounter, 500);
      return () => clearInterval(intervalId);
    }
  }, [faceMatcher])

  useEffect(()=> {
    console.log('targetCount', targetCounter)
  }, [targetCounter])

  const createCanvas = () => {
    if (videoStarted && webcamRef?.current?.video){
      canvasRef.current = createCanvasFromMedia(webcamRef.current.video);
    }
  };

  const updateCounter = () => {
    if (wasBountyDetected) {
      setTargetCounter(prevCounter => Math.min(prevCounter + 1, 10));
      wasBountyDetected = false;
    } else {
      setTargetCounter(prevCounter => Math.max(prevCounter - 1, 0));
    }
    // COMMENTED OUT FOR TESTING
    // if (targetCounter === 10) {
    //   console.log('Win condition met!');
    //   navigate('/gameover');
    // }
  };

  const handleVideoOnPlay = () => {
    if (canvasRef.current && webcamRef?.current) {
      matchDimensions(canvasRef.current, displaySize);
    }
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
            wasBountyDetected = true;
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
    <div>      
      <canvas ref={canvasRef} style={{ position: 'absolute', top:0, left:0 }} />
     <TargetRecognition progress={targetCounter}/>
    </div>
  );
}

export default KillCam;
