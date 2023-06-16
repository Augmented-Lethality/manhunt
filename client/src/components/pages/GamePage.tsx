import React, {useState} from 'react';
import ChaseMode from '../components/ChaseMode'
import FaceRecognition from "../components/FaceRecognition";

const GamePage: React.FC = () => {
  const [gameMode, setGameMode] = useState('Kill')
  return (
    <div>
      {gameMode === 'Chase' &&
        <ChaseMode/>
      }
      {gameMode === 'Kill' &&
        <FaceRecognition/>
      }
    </div>
  );
}
export default GamePage;