import React, { useEffect, useRef } from 'react';



const VideoStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const run = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Browser API navigator.mediaDevices.getUserMedia not available');
        return;
      }

      // Get the aspect ratio of the screen or specific area
      // const aspectRatio = window.innerWidth / window.innerHeight;
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: {
          width: 1280,
          height: 720,
          facingMode: "environment", // Try rear-facing camera first
        }});
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: {
            width: 1280,
            height: 720,
            facingMode: "user", // Fallback to front-facing camera
          }});
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          // Handle error when neither camera is available
          console.error('Failed to access the camera:', err);
        }
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
  }, []);

  return (
    <div style={{ position: 'relative' }}>
    <video ref={videoRef} autoPlay muted style={{ width: '100%', height: 'auto' }} />
  </div>
  );
};

export default VideoStream;
