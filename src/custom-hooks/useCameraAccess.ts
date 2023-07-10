import { useEffect, useState } from 'react';

interface CameraAccessState {
  checking: boolean;
  accessMessage: string;
  checkCameraAccess: () => void;
}

const useCameraAccess = (): CameraAccessState => {
  const [accessMessage, setAccessMessage] = useState('');
  const [checking, setChecking] = useState(true);

  const checkCameraAccess = () => {
    setChecking(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setChecking(false);
      })
      .catch((error) => {
        setChecking(false);
        setAccessMessage(
          `Your camera isn't working because ${error.message.toLowerCase()}.\nGear up, fix the issue, and click that re-check button like a true bounty hunter you are.`
        );
      });
  };

  useEffect(() => {
    checkCameraAccess();
  }, []);

  return { checking, accessMessage, checkCameraAccess };
};

export default useCameraAccess;
