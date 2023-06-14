import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
// import VideoStream from './VideoStream';


const FaceRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mtcnnForwardParams = {
    maxNumScales: 10,
    scaleFactor: 0.709,
    scoreThresholds: [0.6, 0.7, 0.7],
    minFaceSize: 200,
  };

  const labels = ['alyson-hannigan', 'anya-taylor-joy', 'megan-fox'];


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

  useEffect(() => {
    const run = async () => {
      try{
        await faceapi.loadFaceRecognitionModel('/models')
        await faceapi.loadMtcnnModel('/models')
      } catch (err){
        console.error(err)
        return;
      }
      let labeledFaceDescriptors;
      try {
        labeledFaceDescriptors = await Promise.all(
          labels.map(async label => {
            const imgUrl = `/assets/${label}.jpg`;
            const img = await faceapi.fetchImage(imgUrl);
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (!fullFaceDescription) {
              throw new Error(`no faces detected for ${label}`);
            }
            const faceDescriptors = [fullFaceDescription.descriptor];
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
          }),
        );
      } catch (err) {
        console.error('Failed to create labeled face descriptors:', err);
        return;
      }

      const maxDescriptorDistance = 0.6;
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

      const onPlay = async () => {
        const options = new faceapi.MtcnnOptions(mtcnnForwardParams);
        if(videoRef.current){
          const fullFaceDescriptions = await faceapi.detectAllFaces(videoRef.current, options).withFaceLandmarks().withFaceDescriptors();
          const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor));

          results.forEach((bestMatch, i) => {
            const box = fullFaceDescriptions[i].detection.box;
            const text = bestMatch.toString();
            const drawBox = new faceapi.draw.DrawBox(box, { label: text });
            if(canvasRef.current){
              drawBox.draw(canvasRef.current);
            }
          });
        }
        setTimeout(() => onPlay(), 100);
      };

      if (videoRef.current) {
        videoRef.current.onplay = onPlay;
      }
    };

    run();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} />
      <video ref={videoRef} autoPlay muted style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default FaceRecognition;
