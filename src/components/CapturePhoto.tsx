
import { useWebcam } from '../contexts/WebcamProvider';
import React, { useState, useCallback } from 'react';

interface CapturePhotoProps {
  img: string | null;
  setImg: (img: string | null) => void;
}


const CapturePhoto: React.FC<CapturePhotoProps> = ({img, setImg}) => {
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;
  

  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    if(imageSrc) { 
      setImg(imageSrc);
    }
  }, [webcamRef, setImg]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {img ? (
        <>
          <img src={img} alt="Screenshot" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          <button
            onClick={()=>setImg(null)}
            style={{
              position: 'absolute',
              top: '90%',
              left: '20%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '20px',
              boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 100px',
              border: '2px solid white',
              backdropFilter: 'blur(5px)',
              width: '100px',
              height: '50px',
            }}
          >RETAKE</button>
          <button
            onClick={()=>setImg(null)}
            style={{
              position: 'absolute',
              top: '90%',
              left: '80%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '20px',
              boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 100px',
              border: '2px solid white',
              backdropFilter: 'blur(5px)',
              width: '100px',
              height: '50px',
            }}
          >SAVE</button>
        </>
        
      ) : (
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
      )}
    </div>
  );
};

export default CapturePhoto;