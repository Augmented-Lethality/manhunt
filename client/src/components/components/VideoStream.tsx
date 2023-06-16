import React, { useEffect, useRef, ReactElement } from 'react';
import { CanvasHandles } from './Canvas';

type VideoStreamProps = {
  readyToPlay: boolean;
  children: React.ReactNode;
};

const VideoStream: React.FC<VideoStreamProps> = ({readyToPlay, children}) => {
  const canvasRef = useRef<CanvasHandles | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (readyToPlay && videoRef.current) {
      videoRef.current.play();
      canvasRef.current?.detectFaces(); // Call the detectFaces function
    }
  }, [readyToPlay]);

  useEffect(() => {
    const run = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Browser API navigator.mediaDevices.getUserMedia not available');
        return;
      }
      // const aspectRatio = window.innerWidth / window.innerHeight;
      let stream;
      //const aspectRatio = window.innerWidth / window.innerHeight;
      try {
        const aspectRatio = window.innerWidth / window.innerHeight;
        stream = await navigator.mediaDevices.getUserMedia({ video: {aspectRatio}});
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Failed to access the camera:', err);
      }
    };
    run();
    // Cleanup function to stop the video stream when the component is unmounted
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [readyToPlay]);

  return (
    <div style={{ position: 'relative' }}>
      <video ref={videoRef} muted style={{ width: '100%', height: 'auto' }} />
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement, { videoElement: videoRef.current });
        }
        return child;
      })}
    </div>
  );
};

export default VideoStream;
