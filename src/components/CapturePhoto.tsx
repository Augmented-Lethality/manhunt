
import { useWebcam } from '../contexts/WebcamProvider';
import React, { useState, useCallback } from 'react';

interface CapturePhotoProps {
  img: HTMLImageElement | null;
  setImg: (img: HTMLImageElement | null) => void;
}


const CapturePhoto: React.FC<CapturePhotoProps> = ({img, setImg}) => {
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;
  

  const capture = useCallback(() => {
    const screenShot = webcamRef?.current?.getScreenshot();
    if(screenShot) { 
      const image = new Image();
      image.src = screenShot;
      image.onload = async () => {
      setImg(image);
      };
    }
  }, [webcamRef, setImg]);

  return (
    <div style={{
    position:'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw' }}>
      <button
        onClick={capture}
        style={{
          position: 'absolute',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 100px',
          border: '2px solid white',
          backdropFilter: 'blur(5px)',
          width: '100px',
          height: '100px',
        }}
      />
    </div>
  );
};

export default CapturePhoto;