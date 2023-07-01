import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaceMatcher,
  createCanvasFromMedia,
  matchDimensions,
  detectAllFaces,
  resizeResults,
  draw
} from 'face-api.js';
import { useWebcam } from '../contexts/WebcamProvider';
import TargetRecognition from './KillProgress';
import { useAuth0 } from "@auth0/auth0-react";

import SocketContext from '../contexts/Socket/SocketContext';


type KillCamProps = {
  faceMatcher: (FaceMatcher | null)
}

const KillCam: React.FC<KillCamProps> = ({ faceMatcher }) => {
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;
  const videoStarted = webcamContext?.videoStarted;
  const navigate = useNavigate();
  const videoHeight = window.innerHeight - 196;
  const videoWidth = window.innerWidth;
  const displaySize = { width: videoWidth, height: videoHeight };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let [targetCounter, setTargetCounter] = useState(0);
  let wasBountyDetected = false;
  const { user } = useAuth0();

  // socket contexts
  const { games, users } = useContext(SocketContext).SocketState;
  const { UpdateGameStatus, AddGameStats } = useContext(SocketContext);

  // storing username of hunted so tensor can compare
  const [huntedUsername, setHuntedUsername] = useState<string>('');


  // creating the canvas when the component mounts
  useEffect(() => {
    createCanvas();
    return () => {
      // Stop the camera here using webcamRef.current

      // Example:
      if (webcamRef?.current?.video) {
        webcamRef.current.video.pause();
        webcamRef.current.video.srcObject = null;
      }
    };
  }, [])

  // if faceMatcher and huntedUsername are both set, start the handleVideoPlay()
  useEffect(() => {
    if (faceMatcher && huntedUsername) {
      handleVideoOnPlay();
      const intervalId = setInterval(updateCounter, 500);
      return () => clearInterval(intervalId);
    }
  }, [faceMatcher, huntedUsername])

  // whenever targetCounter is updated, if it's at 10, navigate the users
  // NEED TO CHANGE BACK FOR PRODUCTION
  useEffect(() => {
    if (targetCounter === 100) {
      console.log('made it to 1')
      AddGameStats(user);
      UpdateGameStatus(user, 'complete')
    }
  }, [targetCounter])

  // setting the huntedUsername based on the authID in the hunted column of the game
  useEffect(() => {
    if (games.length > 0) {
      const huntedUser = users.filter(user => user.authId === games[0].hunted)[0];
      setHuntedUsername(huntedUser.username);
    }
  }, [users])

  const createCanvas = () => {
    if (videoStarted && webcamRef?.current?.video) {
      canvasRef.current = createCanvasFromMedia(webcamRef.current.video);
    }
  };

  const updateCounter = () => {
    if (wasBountyDetected) {
      setTargetCounter(prevCounter => Math.min(prevCounter + 1, 10));
      wasBountyDetected = false;
    } else {
      setTargetCounter(prevCounter => Math.max(prevCounter - 1, 0));
    }

  };

  const handleVideoOnPlay = () => {
    if (canvasRef.current && webcamRef?.current) {
      matchDimensions(canvasRef.current, displaySize);
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const processVideoFrame = async () => {
          if (faceMatcher && webcamRef?.current?.video && canvasRef.current) {
            const detections = await detectAllFaces(webcamRef.current.video)
              .withFaceLandmarks()
              .withFaceDescriptors();
            const resizedDetections = resizeResults(detections, displaySize);
            context.clearRect(0, 0, videoWidth, videoHeight);
            draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            results.forEach((result, i) => {
              const name = result.toString()
              const sliceIndex = name.indexOf(' (')
              const detectedFace = name.slice(0, sliceIndex)
              if (detectedFace === huntedUsername) {
                wasBountyDetected = true;
              }
              const box = resizedDetections[i].detection.box
              const drawBox = new draw.DrawBox(box, { label: name })
              if (canvasRef.current) {
                drawBox.draw(canvasRef.current)
              }
            });
            setTimeout(processVideoFrame, 100);
          }
        };
        setTimeout(processVideoFrame, 100);
      }
    }
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: '132px', left: 0 }} />
      <TargetRecognition progress={targetCounter} />
    </>
  );
}

export default KillCam;
