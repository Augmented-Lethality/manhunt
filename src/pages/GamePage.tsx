import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
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
    loadModels();
    console.log('models loaded')
  }, []);

  const loadModels = async () => {
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
    const labels = ['kalypso-homan'];
    const promises = labels.map(async label => {
      const descriptions: Float32Array[] = [];
      const img = await faceapi.fetchImage(`assets/${label}.jpg`);
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if(detection){
        descriptions.push(detection.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    });
    const labeledFaceDescriptors = await Promise.all(promises);
    setFaceMatcher( new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6));
  }

  const handleGameChange = () => {
    if(gameMode === 'Chase') {
      setGameMode('Kill')
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
    <button onClick={ handleGameChange }>Go in For the Kill</button>
      {gameMode === 'Chase' && currentGame.hunted.length > 0 && <ChaseCam currentGame={ currentGame }/>}
      {gameMode === 'Kill' && currentGame.hunted.length > 0 && (
        <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
          <WebcamProvider>
            <KillCam/>
          </WebcamProvider>
        </div>
      )}
    </div>
  );
}

export default GamePage;
