import * as faceapi from 'face-api.js';
import React, {useEffect, useState, useRef} from 'react';

const FacialRecognition: React.FC = () => {

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [faceMatcherReady, setFaceMatcherReady] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoHeight = window.innerHeight;
  const videoWidth = window.innerWidth;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const displaySize = { width: videoWidth, height: videoHeight };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    loadModels();
    console.log('models loaded')
  }, []);

  useEffect(() => {
    createCanvas()
    console.log('createdCanvas')
  }, [canvasRef])

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
    setFaceMatcherReady(true);
  }

  const loadModels = async () => {
    try {
      await faceapi.loadSsdMobilenetv1Model('/models')
      await faceapi.loadFaceLandmarkModel('/models')
      await faceapi.loadFaceRecognitionModel('/models')
      await createFaceMatcher();
      console.log('createdFaceMatcher')
      setModelsLoaded(true);
    } catch (err) {
      console.error(err);
      setModelsLoaded(false);
    }
  };

  const createCanvas = () => {
    if(videoRef.current){
      canvasRef.current = faceapi.createCanvasFromMedia(videoRef.current);
    }
  };

  const startVideo = async () => {
    setCaptureVideo(true);
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: { aspectRatio } })
      if(videoRef.current){
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch(err){
      console.error("error:", err);
    }
  }

  const handleVideoOnPlay = () => {
    if (canvasRef.current && videoRef.current) {
      faceapi.matchDimensions(canvasRef.current, displaySize);
    }
    setInterval(async () => {
      if (faceMatcher && videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, videoWidth, videoHeight);
        }
        //faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        // for every face, find best result
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        //for Each, adds a box
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
          if (canvasRef.current) {
              drawBox.draw(canvasRef.current)
          }        
        })
      }
    }, 100);
  };

  const closeWebcam = () => {
    if(videoRef.current && videoRef.current.srcObject){
      const mediaStream = videoRef.current.srcObject as MediaStream;
      videoRef.current.pause();
      mediaStream.getTracks()[0].stop();
      setCaptureVideo(false);
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        {
          captureVideo && modelsLoaded && faceMatcherReady ?
            <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Close Webcam
            </button>
            :
            <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Open Webcam
            </button>
        }
      </div>
      {
        captureVideo ?
          modelsLoaded && faceMatcherReady ?

            <div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
            </div>
            :
            <div>loading...</div>
          :
          <>
          </>
      }
    </div>
  );
}
export default FacialRecognition;
