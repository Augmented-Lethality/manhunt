import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import axios from 'axios';
import * as faceapi from 'face-api.js';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import { ButtonToHome } from '../components/Buttons';

const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const { authId, games, names } = useContext(SocketContext).SocketState;
  const [currentGame, setUserGame] = useState<{ gameId: string; authIdList: string[], hunted: string }>({ gameId: '', authIdList: [], hunted: '' });

  useEffect(() => {
    const foundUserGame = Object.values(games).find((game) => game.authIdList.includes(authId));
    setUserGame(foundUserGame || { gameId: '', authIdList: [], hunted: '' });
  }, [authId]);

  useEffect(() => {
    loadTensorFlowFaceMatcher();
  }, []);

  const loadTensorFlowFaceMatcher = async () => {
    try {
      await faceapi.loadSsdMobilenetv1Model('/models')
      await faceapi.loadFaceLandmarkModel('/models')
      await faceapi.loadFaceRecognitionModel('/models')
      createFaceMatcher();
    } catch (err) {
      console.error(err);
    }
  };

  const createFaceMatcher = async () => {
    // get All users. AFTER MVP CHANGE TO GET ONLY RELEVANT USERS
    const res = await axios.get('/users');
    const users = res.data.filter(user => user.facialDescriptions);
    const labeledFaceDescriptors = users.map((user) => {
      // Convert each user's description array back to a Float32Array
      const descriptions = [new Float32Array(user.facialDescriptions)];
      return new faceapi.LabeledFaceDescriptors(user.username, descriptions);
    });
    setFaceMatcher(new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5));
  }

  const handleGameChange = () => {
    if (gameMode === 'Chase') {
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
        {currentGame?.authIdList.map((playerAuthId) => (
          <li key={playerAuthId}>{names[playerAuthId]}</li>
        ))}
      </ul>
      <button onClick={handleGameChange}>{gameMode === 'Chase' ? 'Go in For the Kill' : 'Return to the Chase'}</button>
      {gameMode === 'Chase' && currentGame.hunted.length > 0 && <ChaseCam currentGame={currentGame} />}
      {gameMode === 'Kill' && currentGame.hunted.length > 0 && (
        <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
          <WebcamProvider>
            <KillCam faceMatcher={faceMatcher} />
          </WebcamProvider>
        </div>
      )}
    </div>
  );
}

export default GamePage;
