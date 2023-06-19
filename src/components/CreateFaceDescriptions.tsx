import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import CapturePhoto from './CapturePhoto'
import { WebcamProvider } from '../contexts/WebcamProvider';
import axios from 'axios';
import {UserData} from '../pages/ProfilePage'

interface CreateFaceDescriptionsProps {
  setIsVerifying: (verify: boolean) => void;
  username?: (string);
  userID?: (string);
  setUser: (user: UserData | null) => void;
}

const CreateFaceDescriptions: React.FC<CreateFaceDescriptionsProps> = ({setIsVerifying, username, userID, setUser}) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  console.log(username)
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
    // This is just to get typescript to stop throwing an err
    if(!username){
      return
    }
    try {
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        alert("No face detected in the image, please try again");
        return;
      }
      const descriptions = [detection.descriptor];
      const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(username, descriptions);
      sendDescriptionToServer(labeledFaceDescriptor);
      setIsVerifying(false)
    } catch (err){
      console.error(err)
    }
  }

  const sendDescriptionToServer = async (labeledFaceDescriptor: faceapi.LabeledFaceDescriptors) => {
    try {
      // Convert descriptor to array for easier serialization
      const descriptorArray = Array.from(labeledFaceDescriptor.descriptors[0]);
      const res = await axios.patch(`/users/face-description/${userID}`, {descriptions: descriptorArray});
      if(res.status === 200){
        setUser(res.data)
      }
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
            width: '50px',
            height: '50px',
          }}>
          X</button>
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
            width: '50px',
            height: '50px',
          }}>
          X</button>
        <CapturePhoto img={img} setImg={setImg}/>
      </WebcamProvider>
    )
  )
}

export default CreateFaceDescriptions;
