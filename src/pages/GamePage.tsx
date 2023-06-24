import {
  FaceMatcher,
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  LabeledFaceDescriptors
} from 'face-api.js';
import React, { useState, useContext, useEffect, useRef } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import axios from 'axios';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import { ButtonToHome } from '../components/Buttons';
import Countdown from '../components/countdown';
import { Container } from '../styles/Container';
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';

interface ChaseCamRefType { // declaring type for child method
  turnOffCamera: () => void;
}

const GamePage: React.FC = () => {

  // passing this to the ChaseCam.tsx child so that the method can be used in this parent component
  const chaseCamRef = useRef<ChaseCamRefType>(null);

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const { users, games } = useContext(SocketContext).SocketState;


  useEffect(() => {
    loadTensorFlowFaceMatcher();
    return () => {
      handleTurnOffCamera(); // turns off all cameras when this component is unmounted
    };
  }, []);

  useEffect(() => {
    console.log('game status:', games[0].status)
  }, [games])

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

  // the turnOffCamera() is from the ChaseCam child component, passed
  // using the useRef and useImperativeHandle
  const handleTurnOffCamera = () => {
    if (chaseCamRef.current) {
      chaseCamRef.current.turnOffCamera();
    }
  };


  return (
    <Container>
      <ButtonToHome />
      <Countdown initialCount={5 * 60} />
      {/* <strong>Users in Game:</strong>
      {users.map((player) => (
        <PlayerListItem key={player.id} player={player} />
      ))} */}
      <button onClick={handleGameChange}>{gameMode === 'Chase' ? 'Go in For the Kill' : 'Return to the Chase'}</button>
      {gameMode === 'Chase' && <ChaseCam ref={chaseCamRef} />}
      {
        gameMode === 'Kill' && (
          <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
            <WebcamProvider>
              <KillCam faceMatcher={faceMatcher} />
            </WebcamProvider>
          </div>
        )
      }
    </Container >
  );
}

export default GamePage;
