import {
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  detectSingleFace,
  LabeledFaceDescriptors
} from 'face-api.js';
import React, { useState, useEffect } from 'react';
import CapturePhoto from './CapturePhoto'
import { WebcamProvider } from '../contexts/WebcamProvider';
import axios from 'axios';
import {UserData} from '../pages/ProfilePage'
import { IoCameraReverseSharp } from 'react-icons/io5'
import { GiSave} from 'react-icons/gi'


interface CreateFaceDescriptionsProps {
  setPhotoStatus: (verify: string) => void;
  username?: (string);
  userID?: (string);
  setUser: (user: UserData | null) => void;
}

const CreateFaceDescriptions: React.FC<CreateFaceDescriptionsProps> = ({setPhotoStatus, username, userID, setUser}) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    loadModels();
  }, []);
  
  const loadModels = async () => {
    try {
      await loadSsdMobilenetv1Model('/models')
      await loadFaceLandmarkModel('/models')
      await loadFaceRecognitionModel('/models')
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!img || !username) {
      return;
    }
    try {
      const detection = await detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        alert("No face detected in the image, please try again");
        return;
      }
      const descriptions = [detection.descriptor];
      const labeledFaceDescriptor = new LabeledFaceDescriptors(username, descriptions);
      sendDescriptionToServer(labeledFaceDescriptor);
      setPhotoStatus('profile')
    } catch (err){
      console.error(err)
    }
  }

  const sendDescriptionToServer = async (labeledFaceDescriptor: LabeledFaceDescriptors) => {
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

  if(img){
    return (
      <div>
        <img src={img.src} alt="Screenshot" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        <div style={{
          position:'absolute',
          zIndex:'1',
          bottom: '5vh',
          display: 'flex',
          justifyContent: 'space-around',
          width:'100%'
          }}>
          <IoCameraReverseSharp className='react-icon-large' onClick={()=>{setImg(null)}}/>
          <GiSave className='react-icon-large' onClick={handleSave}/>
        </div>
      </div>
    )
  }

  return (
    <WebcamProvider>
      <CapturePhoto img={img} setImg={setImg}/>
    </WebcamProvider>
  )
}

export default CreateFaceDescriptions;
