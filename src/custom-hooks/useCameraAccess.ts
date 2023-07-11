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
          `Your camera isn't working because ${error.message.toLowerCase()}.\n\nTrue bounty hunters check their mobile browser's camera access in settings.`
        );
      });
  };

  useEffect(() => {
    checkCameraAccess();
  }, []);

  return { checking, accessMessage, checkCameraAccess };
};

export default useCameraAccess;
