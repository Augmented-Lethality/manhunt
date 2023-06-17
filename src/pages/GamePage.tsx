import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';

// import KillMode from '../components/KillMode';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';


const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');

  const { uid, games, names } = useContext(SocketContext).SocketState;

  const [currentGame, setUserGame] = useState<{ gameId: string; uidList: string[], hunted: string }>({ gameId: '', uidList: [], hunted: '' });

  useEffect(() => {
    const foundUserGame = Object.values(games).find((game) => game.uidList.includes(uid));
    setUserGame(foundUserGame || { gameId: '', uidList: [], hunted: '' });

  }, [uid]);

  const handleGameChange = () => {
    if(gameMode === 'Chase') {
      setGameMode('Kill')
    }
  }

  return (
    <div>
      <p>Players in this game:</p>
    <ul>
      {currentGame?.uidList.map((playerUid) => (
        <li key={playerUid}>{names[playerUid]}</li>
      ))}
    </ul>
    <button onClick={ handleGameChange }>Go in For the Kill</button>
      {gameMode === 'Chase' && currentGame.hunted.length > 0 && <ChaseCam currentGame={ currentGame }/>}
      {gameMode === 'Kill' && currentGame.hunted.length > 0 && <KillCam />}
    </div>
  );
}

export default GamePage;
