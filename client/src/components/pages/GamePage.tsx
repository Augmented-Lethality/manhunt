import React, {useState} from 'react';
import ChaseMode from '../components/ChaseMode'
import FaceRecognition from "../components/FaceRecognition";
import VideoStream from '../components/VideoStream';

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
      {/* <VideoStream setStream={setStream}/> */}
    </div>
  );
}

export default GamePage;
