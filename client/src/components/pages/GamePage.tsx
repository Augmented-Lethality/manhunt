import React, {useState} from 'react';
import KillMode from '../KillMode'
import ChaseCam from '../ChaseCam'
import FaceRecognition from "../FaceRecognition";

function GamePage() {
  const [gameMode, setGameMode] = useState('Chase')
  
  return (
    <div>
      {gameMode === 'Chase' &&
        <ChaseCam />
      }
      {gameMode === 'Kill' &&
        <FaceRecognition/>
      }
    </div>
  );
}
export default GamePage;