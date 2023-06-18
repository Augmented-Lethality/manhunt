import React, { useState } from 'react';
import * as faceapi from 'face-api.js';
import CapturePhoto from './CapturePhoto'
import { WebcamProvider } from '../contexts/WebcamProvider';
import axios from 'axios';

const CreateFaceDescriptions: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  
  const handleSave = async () => {
    if (!img) {
      console.error("No image provided");
      return;
    }
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      console.error("No face detected in the image");
      return;
    }
    const label = 'user-face1';
    const descriptions = [detection.descriptor];
    const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(label, descriptions);
    // Assuming sendDescriptionToServer is an async function that takes a LabeledFaceDescriptors
    sendDescriptionToServer(labeledFaceDescriptor);
  }

  const sendDescriptionToServer = async (labeledFaceDescriptor: faceapi.LabeledFaceDescriptors) => {
    try {
      // Convert descriptor to array for easier serialization
      const descriptorArray = Array.from(labeledFaceDescriptor.descriptors[0]);
  
      const response = await axios.post('game/face-description', {
        label: labeledFaceDescriptor.label,
        descriptor: descriptorArray
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending descriptor to server:', error);
    }
  }

  return (
      <WebcamProvider>
        <CapturePhoto img={img} setImg={setImg} />
      </WebcamProvider>
  )
}

export default CreateFaceDescriptions;
