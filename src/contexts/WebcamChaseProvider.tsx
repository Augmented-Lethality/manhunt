import React, { createContext, useCallback, useRef, useContext, ReactNode, useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "environment"
};

// Create a context
const WebcamChaseContext = createContext<{
  webcamRef: React.RefObject<Webcam>,
  videoStarted: boolean
} | null>(null);

interface WebcamProviderProps {
  children: ReactNode;
}

export const WebcamChaseProvider: React.FC<WebcamProviderProps> = ({ children }) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [videoStarted, setVideoStarted] = useState(false);


  const setRef = useCallback((webcam: Webcam | null) => {
    webcamRef.current = webcam;
  }, []);


  return (
    <WebcamChaseContext.Provider value={{ webcamRef, videoStarted }}>
      <Webcam
        audio={false}
        ref={setRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints} />
      {children}
    </WebcamChaseContext.Provider>
  );
};

// Create a hook to use the webcam context
export const useWebcam = () => useContext(WebcamChaseContext);
