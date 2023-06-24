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
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import Countdown from '../components/countdown';
import { Container } from '../styles/Container';
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';
import { GameHeader } from '../styles/Header';
import { FaSkull, FaEye, FaHome } from 'react-icons/fa';
import { GiCrosshair } from 'react-icons/gi';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DropDownMenu from '../components/DropDownMenu';
import { useAuth0 } from '@auth0/auth0-react';


const CrosshairContainer = styled.div`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background: black;
  cursor: pointer;
  width: 28vw;
  height: 28vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;


interface ChaseCamRefType { // declaring type for child method
  turnOffCamera: () => void;
}

const GamePage: React.FC = () => {

  // passing this to the ChaseCam.tsx child so that the method can be used in this parent component
  const chaseCamRef = useRef<ChaseCamRefType>(null);
  const navigate = useNavigate();
  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const { users, games } = useContext(SocketContext).SocketState;
  const { LeaveGame } = useContext(SocketContext);

  const { user } = useAuth0();




  useEffect(() => {
    loadTensorFlowFaceMatcher();
    console.log('use effect happened')
  }, [users]);

  useEffect(() => {
    return () => {
      handleTurnOffCamera(); // turns off all cameras when this component is unmounted
      console.log('should have turned the camera off');
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
      console.log('did the face success')
    } catch (err) {
      console.error(err);
    }
  };

  const createFaceMatcher = async () => {
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

  const handleHomeDrop = () => {
    LeaveGame(user);
    navigate('/home')
  }


  return (
    <Container>
      <GameHeader>
        <Countdown initialCount={5 * 60} />
        <DropDownMenu>
          <div onClick={handleHomeDrop}><FaHome className='react-icon' />home</div>
        </DropDownMenu>
      </GameHeader>
      {gameMode === 'Chase' && <ChaseCam ref={chaseCamRef} />}
      {gameMode === 'Kill' && (
        <WebcamProvider>
          <KillCam faceMatcher={faceMatcher} />
        </WebcamProvider>
      )}
      <CrosshairContainer onClick={handleGameChange}>
        <GiCrosshair style={{ position: 'absolute', fontSize: '9rem' }} />
        <div style={{ background: 'none', border: 'none', position: 'relative', top: '2px' }}>
          {gameMode === 'Chase' ? <FaSkull className='react-icon-large' /> : <FaEye className='react-icon-large' />}
        </div>
      </CrosshairContainer>

    </Container>
  );
}

export default GamePage;
