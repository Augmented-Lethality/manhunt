
import React, { useState, useContext, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import { WebcamChaseProvider } from '../contexts/WebcamChaseProvider';
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
  const { user } = useAuth0();
  const { LeaveGame } = useContext(SocketContext);

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');


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
      {gameMode === 'Chase' ? (
        <WebcamChaseProvider key="chaseCam">
          <ChaseCam />
        </WebcamChaseProvider>
      ) : (
        <WebcamProvider key="killCam">
          <KillCam />
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
