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
  const [style, setStyle] = useState({});

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
      setStyle({
        height: "100%",
        width: "100%",
        objectFit: "cover",
      })
    } else {
      setMode('environment');
      setStyle({
        position: "absolute",
        height: "100%",
        width: "100%",
        objectFit: "cover",
      })
    }
  }, [path]);

  const videoConstraints = {
    width: window.innerWidth,
    height: window.innerHeight,
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
