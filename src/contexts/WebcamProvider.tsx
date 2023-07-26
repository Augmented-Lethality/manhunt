import React, { createContext, useCallback, useRef, useContext, ReactNode, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useLocation } from 'react-router-dom';

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
export const WebcamProvider: React.FC<WebcamProviderProps> = ({ children }) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const [mode, setMode] = useState('environment');
  const [style, setStyle] = useState<any>({
    height: "100%",
    width: "100%",
    objectFit: "cover"
  });

  const setRef = useCallback((webcam: Webcam | null) => {
    webcamRef.current = webcam;
  }, []);

  const handleUserMedia = () => {
    setVideoStarted(true);
  };

  // if the endpoint is profile, have the webcam face the user. otherwise, it faces the environment
  useEffect(() => {
    if (path === '/profile') {
      setMode('user');
    } else {
      setStyle(prevStyle => ({
        ...prevStyle,
        position: "absolute",
      }))
    }
  }, [path]);

  const videoConstraints = {
    height: window.outerWidth,
    width: window.outerHeight,
    facingMode: mode
  };

  return (
    <WebcamContext.Provider value={{ webcamRef, videoStarted }}>
      <Webcam
        audio={false}
        ref={setRef}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
        videoConstraints={videoConstraints}
        style={style}
      />
      {children}
    </WebcamContext.Provider>
  );
};

// Create a hook to use the webcam context
export const useWebcam = () => useContext(WebcamContext);
