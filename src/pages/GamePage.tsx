import {
  FaceMatcher,
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  LabeledFaceDescriptors
} from 'face-api.js';
import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import axios from 'axios';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import { ButtonToHome } from '../components/Buttons';
import Countdown from '../components/countdown';
import { Container } from '../styles/Container';
const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const { games } = useContext(SocketContext).SocketState;
  const [currentGame, setUserGame] = useState();


  useEffect(() => {
    loadTensorFlowFaceMatcher();
  }, []);

  const loadTensorFlowFaceMatcher = async () => {
    try {
      await loadSsdMobilenetv1Model('/models')
      await loadFaceLandmarkModel('/models')
      await loadFaceRecognitionModel('/models')
      createFaceMatcher();
    } catch (err) {
      console.error(err);
    }
  };

  const createFaceMatcher = async () => {
    // get All users. AFTER MVP CHANGE TO GET ONLY RELEVANT USERS
    const res = await axios.get('/users');
    const users = res.data.filter(user => user.facialDescriptions);
    const labeledFaceDescriptors = users.map((user) => {
      // Convert each user's description array back to a Float32Array
      const descriptions = [new Float32Array(user.facialDescriptions)];
      return new LabeledFaceDescriptors(user.username, descriptions);
    });
    setFaceMatcher(new FaceMatcher(labeledFaceDescriptors, 0.5));
  }

  const handleGameChange = () => {
    if (gameMode === 'Chase') {
      setGameMode('Kill')
    } else {
      setGameMode('Chase')
    }
  }

  return (
    <Container>
      <ButtonToHome />
      <Countdown initialCount={5*60}/>
      <button onClick={handleGameChange}>{gameMode === 'Chase' ? 'Go in For the Kill' : 'Return to the Chase'}</button>
      {gameMode === 'Chase' && <ChaseCam />}
      {gameMode === 'Kill' && (
        <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
          <WebcamProvider>
            <KillCam faceMatcher={faceMatcher} />
          </WebcamProvider>
        </div>
      )}
    </Container>
  );
}

export default GamePage;
