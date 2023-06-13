import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const FaceRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mtcnnForwardParams = {
    maxNumScales: 10,
    scaleFactor: 0.709,
    scoreThresholds: [0.6, 0.7, 0.7],
    minFaceSize: 200,
  };

  const labels = ['alyson-hannigan', 'anna-taylor-joy', 'megan-fox'];

  useEffect(() => {
    const run = async () => {
      await faceapi.loadMtcnnModel('/');
      await faceapi.loadFaceRecognitionModel('/');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
          const imgUrl = `${label}.png`;
          const img = await faceapi.fetchImage(imgUrl);
          const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          if (!fullFaceDescription) {
            throw new Error(`no faces detected for ${label}`);
          }
          const faceDescriptors = [fullFaceDescription.descriptor];
          return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
        }),
      );

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
      <h1>video</h1>
      <video ref={videoRef} autoPlay muted />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FaceRecognition;
