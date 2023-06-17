import React, { useRef, useState, useCallback } from 'react';
import Webcam from "react-webcam";

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user"
};

const CapturePhoto: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if(imageSrc) { 
      setImgSrc(imageSrc);
    }
  }, [webcamRef, setImgSrc]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {imgSrc ? (
        <>
          <img src={imgSrc} alt="Screenshot" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          <button
            onClick={()=>setImgSrc(null)}
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
          >
          RETAKE
          </button>

          <button
            onClick={()=>setImgSrc(null)}
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
          >
          SAVE
          </button>
        </>
        
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            height={window.innerHeight}
            screenshotFormat="image/jpeg"
            width={window.innerWidth}
            videoConstraints={videoConstraints}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
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
        </>

      )}

    </div>
  );
};

export default CapturePhoto;
