import {
  FaceMatcher,
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  LabeledFaceDescriptors
} from 'face-api.js';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import Countdown from '../components/Countdown';
import DropDownMenu from '../components/DropDownMenu';
import { Container } from '../styles/Container';
import { GameHeader, Footer } from '../styles/Header';
import { Main } from '../styles/Main';
import Crosshair from 'react-feather/dist/icons/crosshair';
import Home from 'react-feather/dist/icons/home';
import Eye from 'react-feather/dist/icons/eye';


const GamePage: React.FC = () => {

  const navigate = useNavigate();
  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const { users, games } = useContext(SocketContext).SocketState;
  const { LeaveGame } = useContext(SocketContext);

  const { user } = useAuth0();

  useEffect(() => {
    if (users.length > 0) {
      loadTensorFlowFaceMatcher();
      console.log(users)
    }
  }, [users]);

  // whenever the games state changes, if the status is complete, navigate to /gameover endpoint
  useEffect(() => {
    console.log('game status:', games[0].status)

    if (games[0].status === 'complete') {
      navigate('/gameover');
    }
  }, [games])

  const loadTensorFlowFaceMatcher = async () => {
    try {
      await loadSsdMobilenetv1Model('/models')
      await loadFaceLandmarkModel('/models')
      await loadFaceRecognitionModel('/models')
      await createFaceMatcher();
      console.log('did the face success')
    } catch (err) {
      console.error(err);
    }
  };

  const createFaceMatcher = async () => {
    console.log(users)
    const labeledFaceDescriptors = users.map((player) => {
      // Convert each user's description array back to a Float32Array
      const descriptions = [new Float32Array(player.facialDescriptions)];
      return new LabeledFaceDescriptors(player.username, descriptions);
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

  const handleHomeDrop = () => {
    LeaveGame(user);
    navigate('/home')
  }

  return (
    <Container>
      <GameHeader>
        <Countdown />
      </GameHeader>
      <Main>
      {gameMode === 'Chase' ? <ChaseCam />
        : (
          <WebcamProvider>
            <KillCam faceMatcher={faceMatcher} />
          </WebcamProvider>
        )}
      </Main>
      <Footer style={{display:'flex', justifyContent:'end'}}>
        {gameMode === 'Chase'
          ? <Crosshair className='react-icon-large' onClick={handleGameChange} />
          : <Eye className='react-icon-large' onClick={handleGameChange} />}
      </Footer>
    </Container>
  );
}

export default GamePage;
