import React, {useState} from 'react';
import KillMode from '../components/KillMode'
import ChaseMode from '../components/ChaseMode'

function GamePage() {
  const [gameMode, setGameMode] = useState('Chase')
  
  return (
    <div>
      {gameMode === 'Chase' &&
        <ChaseMode/>
      }
      {gameMode === 'Kill' &&
        <KillMode/>
      }
    </div>
  );
}

export default GamePage;
