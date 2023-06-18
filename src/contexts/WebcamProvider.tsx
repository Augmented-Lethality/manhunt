import React, { createContext, useCallback, useRef, useContext, ReactNode } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user"
};

// Create a context
const WebcamContext = createContext<{ webcamRef: React.RefObject<Webcam> } | null>(null);

interface WebcamProviderProps {
  children: ReactNode;
}

// Create a context provider component
export const WebcamProvider: React.FC<WebcamProviderProps> = ({ children }) => {
  const webcamRef = useRef<Webcam | null>(null);

  const setRef = useCallback((webcam: Webcam | null) => {
    webcamRef.current = webcam;
  }, []);

  return (
    <WebcamContext.Provider value={{ webcamRef }}>
      <Webcam
        audio={false}
        ref={setRef} 
        height={window.innerHeight}
        screenshotFormat="image/jpeg"
        width={window.innerWidth}
        videoConstraints={videoConstraints}
        style={{ position: 'absolute', top: 0, left: 0 }}/>
      {children}
    </WebcamContext.Provider>
  );
};

// Create a hook to use the webcam context
export const useWebcam = () => useContext(WebcamContext);
