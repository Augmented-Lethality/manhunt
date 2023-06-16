import React, {useState} from 'react';
import ChaseCam from '../components/ChaseCam'
import KillCam from "../components/KillCam";

function GamePage() {
  const [gameMode, setGameMode] = useState('Chase')
  
  return (
    <div>
      {gameMode === 'Chase' &&
        <ChaseCam />
      }
      {gameMode === 'Kill' &&
        <KillCam/>
      }
    </div>
  );
}
export default GamePage;