import { useEffect, useState } from 'react';

interface LocationAccessState {
  checking: boolean;
  accessMessage: string;
  checkLocationAccess: () => void;
}

const useLocationAccess = (): LocationAccessState => {
  const [accessMessage, setAccessMessage] = useState('');
  const [checking, setChecking] = useState(true);

  const checkLocationAccess = () => {
    setChecking(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!position.coords.longitude && !position.coords.latitude) {
          setChecking(false);
          setAccessMessage(`How are you going to be a bounty hunter if you don't have your location on? Go check your settings!`);
        } else {
          setChecking(false);
        }
      },
        (error) => {
          setChecking(false);
          setAccessMessage(
            `Your journey into the Corpoverse awaits, but ${error.message.toLowerCase()}.\n\nCheck your device's location access, then come back and try again.`);
        },
        {}
      );
    } else {
      setChecking(false);
      setAccessMessage('Geolocation is not supported by the browser. Try a different device?');
    }
  };

  useEffect(() => {
    checkLocationAccess();
  }, []);

  return { checking, accessMessage, checkLocationAccess };
};

export default useLocationAccess;
