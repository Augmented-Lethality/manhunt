
import React, { useState, useContext, useEffect, } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import { WebcamChaseProvider } from '../contexts/WebcamChaseProvider';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import Countdown from '../components/Countdown';
import { GameHeader } from '../styles/Header';
import { Main } from '../styles/Main';
import { Crosshair, Eye } from 'react-feather';

import styled from 'styled-components';

const MainGame = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  position: relative;
`;

const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const { games } = useContext(SocketContext).SocketState;
  const { Redirect } = useContext(SocketContext);

  // checks to see if the user should be redirected if the game doesn't exist
  const location = useLocation();
  const currentEndpoint = location.pathname;
  useEffect(() => {
    Redirect(currentEndpoint);
  }, [games]);


  const handleGameChange = () => {
    if (gameMode === 'Chase') {
      setGameMode('Kill')
    } else {
      setGameMode('Chase')
    }
  }

  return (
    <>
      <GameHeader>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {gameMode === 'Chase' ? (
            <>
              <h5>Switch to</h5>
              <Crosshair className='react-icon-large' onClick={handleGameChange} />
              <h5>Kill Mode</h5>
            </>
          ) : (
            <>
              <h5>Switch to</h5>
              <Eye className='react-icon-large' onClick={handleGameChange} />
              <h5>Chase Mode</h5>
            </>
          )}
        </div>
        <Countdown />
      </GameHeader>
      <MainGame>
        {gameMode === 'Chase' ? (
          <WebcamChaseProvider key="chaseCam">
            <ChaseCam />
          </WebcamChaseProvider>
        ) : (
          <WebcamProvider key="killCam">
            <KillCam />
          </WebcamProvider>
        )}
      </MainGame>
    </>
  );
}

export default GamePage;
