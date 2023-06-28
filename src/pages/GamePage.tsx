import {
  FaceMatcher,
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  LabeledFaceDescriptors
} from 'face-api.js';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import Countdown from '../components/countdown';
import DropDownMenu from '../components/DropDownMenu';
import { Container } from '../styles/Container';
import { GameHeader } from '../styles/Header';
import Crosshair from 'react-feather/dist/icons/crosshair';
import Home from 'react-feather/dist/icons/home';
import Eye from 'react-feather/dist/icons/eye';

interface ChaseCamRefType { // declaring type for child method
  turnOffCamera: () => void;
}

const GamePage: React.FC = () => {

  // passing this to the ChaseCam.tsx child so that the method can be used in this parent component
  const chaseCamRef = useRef<ChaseCamRefType>(null);
  const navigate = useNavigate();
  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const { users, games } = useContext(SocketContext).SocketState;
  const { LeaveGame } = useContext(SocketContext);

  const { user } = useAuth0();




  useEffect(() => {
    loadTensorFlowFaceMatcher();
    console.log(users)
  }, [users]);

  useEffect(() => {
    return () => {
      handleTurnOffCamera(); // turns off all cameras when this component is unmounted
    };
  }, []);

  useEffect(() => {
    console.log('game status:', games[0].status)
  }, [games])

  const loadTensorFlowFaceMatcher = async () => {
    try {
      await loadSsdMobilenetv1Model('/models')
      await loadFaceLandmarkModel('/models')
      await loadFaceRecognitionModel('/models')
      await createFaceMatcher();
      console.log('did the face success')
    } catch (err) {
      console.error(err);
    }
  };

  const createFaceMatcher = async () => {
    console.log(users)
    const labeledFaceDescriptors = users.map((player) => {
      // Convert each user's description array back to a Float32Array
      const descriptions = [new Float32Array(player.facialDescriptions)];
      return new LabeledFaceDescriptors(player.username, descriptions);
    });
    setFaceMatcher(new FaceMatcher(labeledFaceDescriptors, 0.5));
  }

  const handleGameChange = () => {
    if (gameMode === 'Chase') {
      setGameMode('Kill')
    } else {
      setGameMode('Chase')
    }
  }

  // the turnOffCamera() is from the ChaseCam child component, passed
  // using the useRef and useImperativeHandle
  const handleTurnOffCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // console.log('Video Okay');
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((error) => {
        console.error('Error accessing video:', error);
      });

  };

  const handleHomeDrop = () => {
    LeaveGame(user);
    navigate('/home')
  }


  return (
    <Container>
      <GameHeader>
        <Countdown initialCount={5 * 60} />
        <DropDownMenu>
          <div onClick={handleHomeDrop}><Home className='react-icon' />home</div>
        </DropDownMenu>
      </GameHeader>
      {gameMode === 'Chase' ? <ChaseCam ref={chaseCamRef} />
        : (
          <WebcamProvider>
            <KillCam faceMatcher={faceMatcher} />
          </WebcamProvider>
        )}
      {gameMode === 'Chase'
        ? <Crosshair className='react-icon-large' onClick={handleGameChange} />
        : <Eye className='react-icon-large' onClick={handleGameChange} />}
    </Container>
  );
}

export default GamePage;
