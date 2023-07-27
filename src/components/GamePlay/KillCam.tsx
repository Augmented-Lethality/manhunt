import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  FaceMatcher,
  createCanvasFromMedia,
  matchDimensions,
  detectAllFaces,
  resizeResults,
  draw,
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  LabeledFaceDescriptors
} from 'face-api.js';
import { useWebcam } from '../../contexts/WebcamProvider';
import TargetRecognition from './KillProgress';
import { useAuth0 } from "@auth0/auth0-react";
import SocketContext from '../../contexts/Socket/SocketContext';

const KillCam: React.FC = () => {
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;
  const videoStarted = webcamContext?.videoStarted;
  const displaySize = { width: window.innerWidth, height: window.innerHeight };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [targetCounter, setTargetCounter] = useState(0);
  const targetCounterGoal = 5;
  let wasBountyDetected = false;
  const { user } = useAuth0();

  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);

  // socket contexts
  const { games, users } = useContext(SocketContext).SocketState;
  const { UpdateGameStatus, AddGameStats } = useContext(SocketContext);

  // storing username of hunted so tensor can compare
  const [huntedUsername, setHuntedUsername] = useState<string>('');

  useEffect(() => {
    if (users.length > 0) {
      loadTensorFlowFaceMatcher();
    }
  }, [users]);

  const loadTensorFlowFaceMatcher = async () => {
    try {
      await loadSsdMobilenetv1Model('/models')
      await loadFaceLandmarkModel('/models')
      await loadFaceRecognitionModel('/models')
      await createFaceMatcher();
    } catch (err) {
      console.error(err);
    }
  };

  const createFaceMatcher = async () => {
    const labeledFaceDescriptors = users.map((player) => {
      // Convert each user's description array back to a Float32Array
      const descriptions = [new Float32Array(player.facialDescriptions)];
      return new LabeledFaceDescriptors(player.username, descriptions);
    });
    setFaceMatcher(new FaceMatcher(labeledFaceDescriptors, 0.5));
  }

  const createCanvas = () => {
    if (videoStarted && webcamRef?.current?.video) {
      canvasRef.current = createCanvasFromMedia(webcamRef.current.video);
    }
  };

  // creating the canvas when the component mounts
  useEffect(() => {
    createCanvas();
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
    if (targetCounter === targetCounterGoal) {
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

  const updateCounter = () => {
    if (wasBountyDetected) {
      setTargetCounter(prevCounter => Math.min(prevCounter + 1, 10));
      wasBountyDetected = false;
    } else {
      setTargetCounter(prevCounter => Math.max(prevCounter - 1, 0));
    }
  };

  const handleVideoOnPlay = () => {
    if (!canvasRef.current || !webcamRef?.current) return;
    matchDimensions(canvasRef.current, displaySize);
    const context = canvasRef.current.getContext('2d');
    if (context) {
      const processVideoFrame = async () => {
        if (faceMatcher && webcamRef?.current?.video && canvasRef.current) {
          const detections = await detectAllFaces(webcamRef.current.video)
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resizedDetections = resizeResults(detections, displaySize);
          context.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
            if (box) {
              const drawBox = new draw.DrawBox(box, { label: name })
              if (canvasRef.current) {
                drawBox.draw(canvasRef.current)
              }
            }
          });
          requestAnimationFrame(processVideoFrame);
        }
      };
      requestAnimationFrame(processVideoFrame);
    } else {
      return;
    }
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <TargetRecognition progress={targetCounter} targetCounterGoal={targetCounterGoal}/>
    </>
  );
}

export default KillCam;
