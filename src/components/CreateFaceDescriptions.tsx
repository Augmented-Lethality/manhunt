import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import CapturePhoto from './CapturePhoto'
import { WebcamProvider } from '../contexts/WebcamProvider';
import axios from 'axios';

interface CreateFaceDescriptionsProps {
  setIsVerifying: (verify: boolean) => void;
}



const CreateFaceDescriptions: React.FC<CreateFaceDescriptionsProps> = ({setIsVerifying}) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  
  useEffect(() => {
    loadModels();
    console.log('models loaded')
  }, []);

  
  const loadModels = async () => {
    try {
      await faceapi.loadSsdMobilenetv1Model('/models')
      await faceapi.loadFaceLandmarkModel('/models')
      await faceapi.loadFaceRecognitionModel('/models')
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!img) {
      console.error("No image provided");
      return;
    }
    try {
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        console.error("No face detected in the image");
        return;
      }
      const label = 'user-face1';
      const descriptions = [detection.descriptor];
      const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(label, descriptions);
      const candy = await sendDescriptionToServer(labeledFaceDescriptor);
      setIsVerifying(false)
    } catch (err){
      console.error(err)
    }
  }

  const sendDescriptionToServer = async (labeledFaceDescriptor: faceapi.LabeledFaceDescriptors) => {
    try {
      // Convert descriptor to array for easier serialization
      const descriptorArray = Array.from(labeledFaceDescriptor.descriptors[0]);
      console.log(descriptorArray)
      const response = await axios.patch('user/face-description', {
        label: labeledFaceDescriptor.label,
        descriptor: descriptorArray
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending descriptor to server:', error);
    }
  }

  return (
    img ? 
      (
        <>
        <img src={img.src} alt="Screenshot" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        <button
          onClick={()=>{setIsVerifying(false)}}
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '20px',
            boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 100px',
            border: '2px solid white',
            backdropFilter: 'blur(5px)',
            width: '100px',
            height: '50px',
          }}>
          CANCEL</button>
        <button
          onClick={()=>{setImg(null)}}
          style={{
            position: 'absolute',
            top: '90%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '20px',
            boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 100px',
            border: '2px solid white',
            backdropFilter: 'blur(5px)',
            width: '100px',
            height: '50px',
          }}
        >RETAKE</button>
        <button
          onClick={handleSave}
          style={{
            position: 'absolute',
            top: '90%',
            left: '80%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '20px',
            boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 100px',
            border: '2px solid white',
            backdropFilter: 'blur(5px)',
            width: '100px',
            height: '50px',
          }}
        >SAVE</button>
      </>
    ) : (
      <WebcamProvider>
        <button
          onClick={()=>{setIsVerifying(false)}}
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '20px',
            boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 100px',
            border: '2px solid white',
            backdropFilter: 'blur(5px)',
            width: '100px',
            height: '50px',
          }}>
          CANCEL</button>
        <CapturePhoto img={img} setImg={setImg}/>
      </WebcamProvider>
    )
  )
}

export default CreateFaceDescriptions;
