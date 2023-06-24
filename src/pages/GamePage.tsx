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
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';
import { Main } from '../styles/Main';
import { GameHeader } from '../styles/Header';
import { FaSkull, FaEye } from 'react-icons/fa';
import { GiCrosshair } from 'react-icons/gi';
import { styled } from 'styled-components';

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

const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const { users } = useContext(SocketContext).SocketState;
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
        <ButtonToHome />
        <Countdown id='boop' initialCount={5*60}/>
        {/* <strong>Users in Game:</strong>
        {users.map((player) => (
          <PlayerListItem key={player.id} player={player} />
        ))} */}
      </GameHeader>
      <Main>
      {gameMode === 'Chase' && <ChaseCam />}
      {gameMode === 'Kill' && (
        <WebcamProvider>
          <KillCam faceMatcher={faceMatcher} />
        </WebcamProvider>
      )}
        <CrosshairContainer onClick={handleGameChange}>
          <GiCrosshair style={{ position: 'absolute', fontSize: '9rem' }}/>
          <div style={{background: 'none', border: 'none'}}>
            {gameMode === 'Chase' ? <FaSkull className='react-icon-large'/> : <FaEye className='react-icon-large'/>}
          </div>
        </CrosshairContainer>
      </Main>

    </Container>
    //   <ButtonToHome />
    //   <Countdown initialCount={5 * 60} />
    //   {/* <strong>Users in Game:</strong>
    //   {users.map((player) => (
    //     <PlayerListItem key={player.id} player={player} />
    //   ))} */}
    //   <button onClick={handleGameChange}>{gameMode === 'Chase' ? 'Go in For the Kill' : 'Return to the Chase'}</button>
    //   {gameMode === 'Chase' && <ChaseCam />}
    //   {
    //     gameMode === 'Kill' && (
    //       <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
    //         <WebcamProvider>
    //           <KillCam faceMatcher={faceMatcher} />
    //         </WebcamProvider>
    //       </div>
    //     )
    //   }
    // </Container >
  );
}

export default GamePage;
