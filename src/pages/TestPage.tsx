import React, {useState, useEffect} from 'react';
import { WebcamProvider } from '../contexts/WebcamProvider';
import KillCam from '../components/KillCam';
import axios from 'axios';
import * as faceapi from 'face-api.js';

function TestPage() {
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);

  useEffect(() => {
    loadTensorFlowFaceMatcher();
  }, []);

  const loadTensorFlowFaceMatcher = async () => {
    try {
      await faceapi.loadSsdMobilenetv1Model('/models')
      await faceapi.loadFaceLandmarkModel('/models')
      await faceapi.loadFaceRecognitionModel('/models')
      createFaceMatcher();
    } catch (err) {
      console.error(err);
    }
  };

  const createFaceMatcher = async () => {
    // get All users. AFTER MVP CHANGE TO GET ONLY RELEVANT USERS
    const res = await axios.get('/users');
    console.log(res)
    const faceDescriptors = res.data.filter(user=>user.facialDescriptions).map(user=>user.facialDescriptions);
    const formattedFaceDescriptors = new Float32Array(faceDescriptors)
    setFaceMatcher( new faceapi.FaceMatcher(formattedFaceDescriptors, 0.7));
    console.log('setFaceMatcher')
  }

  return (
    <WebcamProvider>
      <KillCam faceMatcher={faceMatcher}/>
    </WebcamProvider>
  )
}

export default TestPage;
