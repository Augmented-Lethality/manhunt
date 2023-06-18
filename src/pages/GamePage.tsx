import React, {useState} from 'react';
import ChaseCam from '../components/ChaseCam'
import KillCam from "../components/KillCam";
import { WebcamProvider } from '../contexts/WebcamProvider';

function GamePage() {
  const [gameMode, setGameMode] = useState('Kill')
  
  return (
    <div>
      {gameMode === 'Chase' &&
        <ChaseCam />
      }
      {gameMode === 'Kill' &&
      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        <WebcamProvider>
          <KillCam/>
        </WebcamProvider>
      </div>
      }
    </div>
  );
}
export default GamePage;