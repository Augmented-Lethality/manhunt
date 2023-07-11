import { useEffect, useState } from 'react';

interface OrientationAccessState {
  checking: boolean;
  accessMessage: string;
  checkOrientationAccess: () => void;
}

const useOrientationAccess = (): OrientationAccessState => {
  const [accessMessage, setAccessMessage] = useState('');
  const [checking, setChecking] = useState(true);

  const checkOrientationAccess = () => {
    // if the user is on a mobile device, computers don't have this
    if (window.DeviceOrientationEvent !== undefined
      && typeof (window.DeviceOrientationEvent as any).requestPermission === "function") {
      (window.DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response !== "granted") {
            setChecking(false);
            setAccessMessage('Let me use your orientation??');
          } else {
            setChecking(false);
          }
        })
        .catch(function (error: any) {
          setChecking(false);
          setAccessMessage(
            `No device orientation means no hunting. ${error.message.charAt(0).toUpperCase() + error.message.slice(1).toLowerCase()}.\n\nClick the button to allow access.`);
        });
    } else {
      // they are on a computer so they can't check for this
      setChecking(false);
    }
  };

  useEffect(() => {
    checkOrientationAccess();
  }, []);

  return { checking, accessMessage, checkOrientationAccess };
};

export default useOrientationAccess;
