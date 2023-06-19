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
        height={window.innerHeight}
        width={window.innerWidth}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
        videoConstraints={videoConstraints}
        style={{ position: 'absolute', top: 0, left: 0 }}/>
      {children}
    </WebcamContext.Provider>
  );
};

// Create a hook to use the webcam context
export const useWebcam = () => useContext(WebcamContext);
