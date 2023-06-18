import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import axios from 'axios';
import * as faceapi from 'face-api.js';
// import KillMode from '../components/KillMode';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import { ButtonToHome } from '../components/Buttons';

const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const { uid, games, names } = useContext(SocketContext).SocketState;
  const [currentGame, setUserGame] = useState<{ gameId: string; uidList: string[], hunted: string }>({ gameId: '', uidList: [], hunted: '' });

  useEffect(() => {
    const foundUserGame = Object.values(games).find((game) => game.uidList.includes(uid));
    setUserGame(foundUserGame || { gameId: '', uidList: [], hunted: '' });
  }, [uid]);

  useEffect(() => {
    loadTensorFlowFaceMatcher();
  }, []);

  const loadTensorFlowFaceMatcher = async () => {
    try {
      await faceapi.loadSsdMobilenetv1Model('/models')
      await faceapi.loadFaceLandmarkModel('/models')
      await faceapi.loadFaceRecognitionModel('/models')
      setModelsLoaded(true);
      createFaceMatcher();
    } catch (err) {
      console.error(err);
      setModelsLoaded(false);
    }
  };

  const createFaceMatcher = async () => {
    // get All users. AFTER MVP CHANGE TO GET ONLY RELEVANT USERS
    const res = await axios.get('/users');
    console.log(res)
    const faceDescriptors = res.data.filter(user=>user.facialDescriptions).map(user=>user.facialDescriptions);
    const formattedFaceDescriptors = new Float32Array(faceDescriptors)
    setFaceMatcher( new faceapi.FaceMatcher(formattedFaceDescriptors, 0.7));
    console.log('setFaceMatcher')
  }

  const handleGameChange = () => {
    if(gameMode === 'Chase') {
      setGameMode('Kill')
    } else {
      setGameMode('Chase')
    }
  }

  return (
    <div>
      <ButtonToHome />
      <p>Players in this game:</p>
    <ul>
      {currentGame?.uidList.map((playerUid) => (
        <li key={playerUid}>{names[playerUid]}</li>
      ))}
    </ul>
    <button onClick={ handleGameChange }>{gameMode === 'Chase' ? 'Go in For the Kill' : 'Return to the Chase'}</button>
      {gameMode === 'Chase' && currentGame.hunted.length > 0 && <ChaseCam currentGame={ currentGame }/>}
      {gameMode === 'Kill' && currentGame.hunted.length > 0 && (
        <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
          {/* <WebcamProvider> */}
            <KillCam faceMatcher={faceMatcher}/>
          {/* </WebcamProvider> */}
        </div>
      )}
    </div>
  );
}

export default GamePage;
