import {
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  detectSingleFace,
  LabeledFaceDescriptors
} from 'face-api.js';
import React, { useState, useEffect, useContext } from 'react';
import CapturePhoto from './CapturePhoto'
import axios from 'axios';
import { WebcamProvider } from '../contexts/WebcamProvider';
import { UserData } from '../pages/ProfilePage'
import { Save, Camera } from 'react-feather'
import InfoPopup from './Popups/InfoPopup';
import SocketContext from '../contexts/Socket/SocketContext';

interface CreateFaceDescriptionsProps {
  setPhotoStatus: (verify: string) => void;
  username?: (string);
  userID?: (string);
  setUser: (user: UserData | null) => void;
}

const CreateFaceDescriptions: React.FC<CreateFaceDescriptionsProps> = ({ setPhotoStatus, username, userID, setUser }) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);

  const { UpdateSocketPlayer } = useContext(SocketContext);
  const { player } = useContext(SocketContext).SocketState;


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
      setVerifying(true)
      const labeledFaceDescriptor = await createFaceDescriptor();
      if (labeledFaceDescriptor) {
        sendDescriptionToServer(labeledFaceDescriptor);
      }
    } catch (err) {
      console.error(err)
    }
  }

  const createFaceDescriptor = async () => {
    if (!img || !username) {
      return;
    }
    const detection = await detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      alert("No face detected in the image, please try again");
      return;
    }
    const descriptions = [detection.descriptor];
    const labeledFaceDescriptor = new LabeledFaceDescriptors(username, descriptions);
    return labeledFaceDescriptor;
  }

  const sendDescriptionToServer = async (labeledFaceDescriptor: LabeledFaceDescriptors) => {
    try {
      // Convert descriptor to array for easier serialization
      const descriptorArray = Array.from(labeledFaceDescriptor.descriptors[0]);
      const res = await axios.patch(`/users/face-description/${userID}`, { descriptions: descriptorArray });
      if (res.status === 200) {
        setUser(res.data);
        UpdateSocketPlayer(player.authId);
        setPhotoStatus('profile')
      }
    } catch (error) {
      console.error('Error sending descriptor to server:', error);
    }
  }

  if (img) {
    return (
      <div>
        {verifying && <h1 style={{ position: 'absolute' }}>Verifying</h1>}
        <img src={img.src} alt="Screenshot" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute',
          zIndex: '1',
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          top: '78%',
        }}>
          {!verifying && (
            <>
              <div className='column' style={{ color: 'white' }}>
                <Camera className='react-icon-large' onClick={() => { setImg(null) }} />
                <h4 style={{
                  wordSpacing: '10px',
                  marginTop: '-12px',
                  fontWeight: '400',
                  textAlign: 'center',
                  zIndex: '1'
                }}>retake</h4>
              </div>
              <div className='column' style={{ color: 'white' }}>
                <Save className='react-icon-large' onClick={handleSave} />
                <h4 style={{
                  wordSpacing: '10px',
                  marginTop: '-12px',
                  fontWeight: '400',
                  textAlign: 'center',
                  zIndex: '1'
                }}>save</h4>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const infoMessage = `CorpoPolice require your mug shot, ${player ? player.username : 'Bounty Hunter'}.\n\n` +
    'Step 1.\nPosition your face within the frame, making sure it\'s fully visible.\n\n' +
    'Step 2.\nHold still and take the shot!\n\n' +
    'Step 3.\nIf you\'re happy with it, click the submit button and wait for the process to verify. Otherwise, feel free to retake if you need.';


  return (
    <WebcamProvider>
      <InfoPopup message={infoMessage} />
      <CapturePhoto setImg={setImg} />
    </WebcamProvider>
  )
}

export default CreateFaceDescriptions;
