import * as faceapi from 'face-api.js';
import React, {useEffect, useState, useRef} from 'react';
import VideoStream from '../components/VideoStream';
import Canvas from '../components/Canvas'

function GamePage() {
  
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);

  useEffect(() => {
    loadModels();
    console.log('models loaded')
  }, []);

  const createFaceMatcher = async () => {
    const labels = ['alyson-hannigan', 'anya-taylor-joy', 'kalypso-homan', 'megan-fox'];
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

  const loadModels = async () => {
    try {
      await faceapi.loadSsdMobilenetv1Model('/models')
      await faceapi.loadTinyFaceDetectorModel('/models')
      await faceapi.loadFaceLandmarkModel('/models')
      await faceapi.loadFaceRecognitionModel('/models')
      await faceapi.loadFaceExpressionModel('/models')
      await createFaceMatcher();
      console.log('createdFaceMatcher')
      setModelsLoaded(true);
    } catch (err) {
      console.error(err);
      setModelsLoaded(false);
    }
  };

  return (
    <div>
      {
        modelsLoaded ?
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <VideoStream readyToPlay={!!faceMatcher}>
                <Canvas faceMatcher={faceMatcher}/>
              </VideoStream>           
              
            </div>
          </div>
        :
          <div>loading...</div>
      }
    </div>
  );
}

export default GamePage;

// import React, {useState} from 'react';
// import ChaseMode from '../components/ChaseMode'
// import FaceRecognition from "../components/FaceRecognition";
// import VideoStream from '../components/VideoStream';

// const GamePage: FC = () => {
//   const [gameMode, setGameMode] = useState('Kill')

//   return (
//     <div>
//       {gameMode === 'Chase' &&
//         <ChaseMode/>
//       }
//       {gameMode === 'Kill' &&

//         <FaceRecognition/>
//       }
//       {/* <VideoStream setStream={setStream}/> */}
//     </div>
//   );
// }

// export default GamePage;
