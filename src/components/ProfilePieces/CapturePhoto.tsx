
import { useWebcam } from '../../contexts/WebcamProvider';
import React, { useCallback } from 'react';

interface CapturePhotoProps {
  setImg: (img: HTMLImageElement | null) => void;
}

const CapturePhoto: React.FC<CapturePhotoProps> = ({ setImg }) => {
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;

  const capture = useCallback(() => {
    const screenShot = webcamRef?.current?.getScreenshot();
    if (screenShot) {
      const image = new Image();
      image.src = screenShot;
      image.onload = async () => {
        setImg(image);
      };
    }
  }, [webcamRef, setImg]);

  return (
    <button
      onClick={capture}
      style={{
        position: 'absolute',
        left: '50%',
        top: '80vh',
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
  );
};

export default CapturePhoto;