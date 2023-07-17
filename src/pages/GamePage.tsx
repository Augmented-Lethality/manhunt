
import React, { useState, useContext, useEffect, } from 'react';
import { useLocation } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import { WebcamChaseProvider } from '../contexts/WebcamChaseProvider';
import ChaseCam from '../components/GamePlay/ChaseCam';
import KillCam from '../components/GamePlay/KillCam';
import Countdown from '../components/GameLobby/Countdown';
import { GameHeader } from '../styles/Header';
import { Main } from '../styles/Main';
import { Crosshair, Eye } from 'react-feather';
import DropDownMenu from '../components/DropDownMenu';

const GamePage: React.FC = () => {
  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const { games, users } = useContext(SocketContext).SocketState;
  const { Redirect } = useContext(SocketContext);

  const [huntedMessage, setHuntedMessage] = useState('');

  // checks to see if the user should be redirected if the game doesn't exist
  // const location = useLocation();
  // const currentEndpoint = location.pathname;
  // useEffect(() => {
  //   Redirect(currentEndpoint);
  // }, [games]);

  useEffect(() => {
    if (users.length > 0) {
      const huntedObj = users.find(person => person.authId === games[0].hunted);

      if (huntedObj) {
        setHuntedMessage(`${huntedObj.username} is being hunted!`)
      }
    }

  }, [])


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
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          {gameMode === 'Chase' ? (
            <div className='column centered'>
              <h5>Kill Mode</h5>
              <Crosshair className='react-icon' onClick={handleGameChange} />
            </div>
          ) : (
            <div className='column centered'>
              <h5>Chase Mode</h5>
              <Eye className='react-icon' onClick={handleGameChange} />
            </div>
          )}
          <DropDownMenu page={'Game'} />
        </div>
        <Countdown />
        {huntedMessage && <h3>{huntedMessage}</h3>}
      </GameHeader>
      <Main style={{ height: '100vh', paddingTop: '0px' }}>
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
    </>
  );
}

export default GamePage;
