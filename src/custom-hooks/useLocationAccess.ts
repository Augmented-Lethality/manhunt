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

    const timeout = setTimeout(() => {
      setChecking(false);
      setAccessMessage('We have hit the nuclear option; reset the location permissions to \'Ask Next Time\' in your mobile browser, then restart your phone.');
    }, 6000);

    if (!navigator.geolocation) {
      clearTimeout(timeout);
      setChecking(false);
      setAccessMessage('Geolocation is not supported by the browser. Try a different device?');
      return;
    }

    function success(position) {
      clearTimeout(timeout);
      setChecking(false);
      // const latitude = position.coords.latitude;
      // const longitude = position.coords.longitude;
      // alert(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
    }

    function error(error) {
      setChecking(false);
      setAccessMessage(
        `Your journey into the Corpoverse awaits, but ${error.message.toLowerCase()}.\n\nCheck your browser's location settings, then come back and refresh the page.`
      );
    }


    navigator.geolocation.getCurrentPosition(success, error);




    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log(position.coords.latitude)
    //     if (!position.coords.longitude && !position.coords.latitude) {
    //       setChecking(false);
    //       setAccessMessage(`How are you going to be a bounty hunter if you don't have your location on? Go check your settings!`);
    //     } else {
    //       setChecking(false);
    //     }
    //   },
    //   (error) => {
    //     console.log(error.code, error.POSITION_UNAVAILABLE, error.message, error.PERMISSION_DENIED)
    // setChecking(false);
    // setAccessMessage(
    //   `Your journey into the Corpoverse awaits, but ${error.message.toLowerCase()}.\n\nCheck your browser's location settings, then come back and refresh the page.`
    // );
    //   },
    //   { maximumAge: 0, enableHighAccuracy: true, timeout: 2000 }
    // );
  };
  useEffect(() => {
    checkLocationAccess();
  }, []);

  return { checking, accessMessage, checkLocationAccess };
};

export default useLocationAccess;
