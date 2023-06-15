import React, {useState} from 'react';
import KillMode from '../components/KillMode'
// import ChaseMode from '../components/ChaseMode'

import ChaseCam from '../components/ChaseCam';

function GamePage() {
  const [gameMode, setGameMode] = useState('Chase')

  return (
    <div>
      {gameMode === 'Chase' &&
        <ChaseCam />
      }
      {gameMode === 'Kill' &&
        <KillMode/>
      }
    </div>
  );
}

export default GamePage;
