import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as faceapi from 'face-api.js';

type CanvasProps = {
  videoElement?: HTMLVideoElement | null;
  faceMatcher: faceapi.FaceMatcher | null
};

export interface CanvasHandles {
  detectFaces: () => void;
}

const Canvas: React.FC<CanvasProps> = ({videoElement, faceMatcher}, ref) => {
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    createCanvas()
    console.log('createdCanvas')
  }, [canvasRef])

  useImperativeHandle(ref, () => ({
    detectFaces: () => {
      const height = window.innerHeight;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const width = window.innerWidth;
    const displaySize = { 
      width: height * aspectRatio, 
      height: height 
    };
    if (canvasRef.current && videoElement) {
      faceapi.matchDimensions(canvasRef.current, displaySize);
    }
    setInterval(async () => {
      if (faceMatcher && videoElement && canvasRef.current && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        const detections = await faceapi.detectAllFaces(videoElement).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, width, height);
        }
        //faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
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
    },
  }));
  
  const createCanvas = () => {
    if(videoElement){
      canvasRef.current = faceapi.createCanvasFromMedia(videoElement);
    }
  };

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute' }} />
  )

};

export default Canvas;
