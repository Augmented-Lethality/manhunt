import React, { useState, useEffect } from 'react';
// import { WebcamProvider } from '../contexts/WebcamProvider';
// import KillCam from '../components/KillCam';
// import axios from 'axios';
// import * as faceapi from 'face-api.js';

import PhoneLoader from '../components/Loaders/PhoneLoader';
import Radar from '../components/Radar/Radar';

function TestPage() {
  // const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);

  // useEffect(() => {
  //   loadTensorFlowFaceMatcher();
  // }, []);

  // const loadTensorFlowFaceMatcher = async () => {
  //   try {
  //     await faceapi.loadSsdMobilenetv1Model('/models')
  //     await faceapi.loadFaceLandmarkModel('/models')
  //     await faceapi.loadFaceRecognitionModel('/models')
  //     createFaceMatcher();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const createFaceMatcher = async () => {
  //   // get All users. AFTER MVP CHANGE TO GET ONLY RELEVANT USERS
  //   const res = await axios.get('/users');
  //   const users = res.data.filter(user => user.facialDescriptions);
  //   const labeledFaceDescriptors = users.map((user) => {
  //     // Convert each user's description array back to a Float32Array
  //     const descriptions = [new Float32Array(user.facialDescriptions)];
  //     return new faceapi.LabeledFaceDescriptors(user.username, descriptions);
  //   });
  //   setFaceMatcher(new faceapi.FaceMatcher(labeledFaceDescriptors, 0.7));
  // }

  // return (
  //   <WebcamProvider>
  //     <KillCam />
  //   </WebcamProvider>
  // )
  return (
    <Radar />
  )

}

export default TestPage;
