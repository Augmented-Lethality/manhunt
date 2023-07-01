import React, { createContext, useCallback, useRef, useContext, ReactNode, useState } from 'react';
import Webcam from 'react-webcam';

// Create a context
const WebcamContext = createContext<{
  webcamRef: React.RefObject<Webcam>,
  videoStarted: boolean
} | null>(null);

interface WebcamProviderProps {
  children: ReactNode;
  selfieMode?: boolean;
}

// Create a context provider component
export const WebcamProvider: React.FC<WebcamProviderProps> = ({ children }, selfieMode) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [videoStarted, setVideoStarted] = useState(false);

  const setRef = useCallback((webcam: Webcam | null) => {
    webcamRef.current = webcam;
  }, []);

  const handleUserMedia = () => {
    setVideoStarted(true);
  };

  const videoConstraints = {
    width: window.innerWidth,
    height: window.innerHeight - 136,
    facingMode: selfieMode ? "environment" : "user"
  };

  return (
    <WebcamContext.Provider value={{ webcamRef, videoStarted }}>
      <Webcam
        audio={false}
        ref={setRef}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
        videoConstraints={videoConstraints}/>
      {children}
    </WebcamContext.Provider>
  );
};

// Create a hook to use the webcam context
export const useWebcam = () => useContext(WebcamContext);
