
import React, { useState, useContext, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import { WebcamTestProvider } from '../contexts/WebcamTestPro';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import Countdown from '../components/Countdown';
import DropDownMenu from '../components/DropDownMenu';
import { Container } from '../styles/Container';
import { GameHeader } from '../styles/Header';
import Crosshair from 'react-feather/dist/icons/crosshair';
import Home from 'react-feather/dist/icons/home';
import Eye from 'react-feather/dist/icons/eye';


const GamePage: React.FC = () => {

  const navigate = useNavigate();

  const { user } = useAuth0();

  const { games } = useContext(SocketContext).SocketState;
  const { LeaveGame } = useContext(SocketContext);

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');

  // whenever the games state changes, if the status is complete, navigate to /gameover endpoint
  useEffect(() => {

    if (games[0].status === 'complete') {
      navigate('/gameover');
    }
  }, [games])


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
        <DropDownMenu>
          <div onClick={handleHomeDrop}><Home className='react-icon' />home</div>
        </DropDownMenu>
      </GameHeader>
      {gameMode === 'Chase' ? (
        <WebcamTestProvider key="chaseCam">
          <ChaseCam />
        </WebcamTestProvider>
      ) : (
        <WebcamProvider key="killCam">
          <KillCam />
        </WebcamProvider>
      )}
      {gameMode === 'Chase'
        ? <Crosshair className='react-icon-large' onClick={handleGameChange} />
        : <Eye className='react-icon-large' onClick={handleGameChange} />}
    </Container>
  );
}

export default GamePage;
