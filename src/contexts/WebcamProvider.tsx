import React, { createContext, useCallback, useRef, useContext, ReactNode, useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user"
};

// Create a context
const WebcamContext = createContext<{
  webcamRef: React.RefObject<Webcam>,
  videoStarted:boolean
} | null>(null);

interface WebcamProviderProps {
  children: ReactNode;
}

// Create a context provider component
export const WebcamProvider: React.FC<WebcamProviderProps> = ({ children }) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const height = window.innerHeight - 136;
  const width = window.innerWidth; 

  const setRef = useCallback((webcam: Webcam | null) => {
    webcamRef.current = webcam;
  }, []);

  const handleUserMedia = () => {
    setVideoStarted(true);
  };

  return (
    <WebcamContext.Provider value={{ webcamRef, videoStarted }}>
      <Webcam
        audio={false}
        ref={setRef} 
        height={height}
        width={width}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
        videoConstraints={videoConstraints}/>
      {children}
    </WebcamContext.Provider>
  );
};

// Create a hook to use the webcam context
export const useWebcam = () => useContext(WebcamContext);
