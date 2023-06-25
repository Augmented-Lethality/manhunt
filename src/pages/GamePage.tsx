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
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import Countdown from '../components/countdown';
import { Container } from '../styles/Container';
import { GameHeader } from '../styles/Header';
import { FaSkull, FaEye, FaHome } from 'react-icons/fa';
import { GiCrosshair } from 'react-icons/gi';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DropDownMenu from '../components/DropDownMenu';

const CrosshairContainer = styled.div`
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 7rem;
`;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const { users } = useContext(SocketContext).SocketState;
  const [currentGame, setUserGame] = useState();


  useEffect(() => {
    loadTensorFlowFaceMatcher();
  }, [users]);

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
    const labeledFaceDescriptors = users.map((user) => {
      console.log('user', user);
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
      <GameHeader>
        <Countdown initialCount={5*60}/>
        {/* <strong>Users in Game:</strong>
        {users.map((player) => (
          <PlayerListItem key={player.id} player={player} />
        ))} */}
        <DropDownMenu>
          <div onClick={()=>{navigate('/home')}}><FaHome className='react-icon'/>home</div>
        </DropDownMenu>
      </GameHeader>
      {gameMode === 'Chase' && <ChaseCam />}
      {gameMode === 'Kill' && (
        <WebcamProvider>
          <KillCam faceMatcher={faceMatcher} />
        </WebcamProvider>
      )}
        <CrosshairContainer onClick={handleGameChange}>
          <GiCrosshair style={{ position: 'absolute' }}/>
          <div style={{position:'relative', top:'2px'}}>
            {gameMode === 'Chase' ? <FaSkull className='react-icon-large'/> : <FaEye className='react-icon-large'/>}
          </div>
        </CrosshairContainer>

    </Container>
  );
}

export default GamePage;
