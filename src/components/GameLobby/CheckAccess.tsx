import React, { useEffect, useContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { AccessPopup } from '../Popups/AccessPopup';
import { useNavigate } from 'react-router-dom';

const CheckAccess: React.FC = () => {
  const { user } = useAuth0();
  const { users } = useContext(SocketContext).SocketState;
  const { UpdateReady } = useContext(SocketContext);

  const navigate = useNavigate();


  const [videoAccessError, setVideoAccessError] = useState(false);
  const [locationAccessError, setLocationAccessError] = useState(false);
  const [orientationAccessError, setOrientationAccessError] = useState(false);
  const [bioDataError, setBioDataError] = useState(false);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // if there's errors, send them to the ready state to update the green or red icons to indicate the user is ready or not
  useEffect(() => {
    if (user?.sub) {
      const errorMessages: string[] = [];

      switch (true) {
        case videoAccessError:
          // errorMessages.push('video');
          break;
        case locationAccessError:
          errorMessages.push('location');
          break;
        case orientationAccessError:
          errorMessages.push('orientation');
          break;
        case bioDataError:
          errorMessages.push('bio data');
          break;
        default:
          break;
      }

      if (errorMessages.length) {
        UpdateReady({ [user.sub]: errorMessages });
      } else {
        UpdateReady({ [user.sub]: ['ok'] });
      }
    }
  }, [videoAccessError, locationAccessError, orientationAccessError, bioDataError]);

  // turns the camera on and off
  const checkVideoAccess = () => {
    // navigator.mediaDevices
    //   .getUserMedia({ video: true })
    //   .then((stream) => {
    //     stream.getTracks().forEach((track) => track.stop());
    //   })
    //   .catch((error) => {
    //     // setVideoAccessError(true);
    //     setErrorMessages((prevMessages) => [...prevMessages,
    //     `Your camera isn't working because ${error.message.toLowerCase()}.
    //     Gear up, fix the issue, and reload that refresh button like a true bounty hunter you are.`]);
    //   });
  };

  // checks to see if user location is accessible 
  const checkLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!position.coords.longitude && !position.coords.latitude) {
          setLocationAccessError(true);
          setErrorMessages((prevMessages) => [...prevMessages,
            `How are you going to be a bounty hunter if you don't have your location on? Go check your settings!`]);
        }
      },
        (error) => {
          setLocationAccessError(true);
          setErrorMessages((prevMessages) => [...prevMessages,
          `Your journey into the Corpoverse awaits, but ${error.message.toLowerCase()}.
          Go fix your location, then come back and refresh the page.`]);
        },
        {}
      );
    } else {
      setLocationAccessError(true);
      setErrorMessages((prevMessages) => [...prevMessages, 'Geolocation is not supported by the browser. Try a different device?']);
    }
  };

  // phones need to get access through clicking a button now
  const checkOrientationAccess = () => {
    // if the user is on a mobile device, computers don't have this
    if (window.DeviceOrientationEvent !== undefined && typeof (window.DeviceOrientationEvent as any).requestPermission === "function") {
      (window.DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response !== "granted") {
            setOrientationAccessError(true);
            setErrorMessages((prevMessages) => [...prevMessages, 'Let me use your orientation??']);
          } else {
            // sets it as false if the user clicks the button and allows access
            setOrientationAccessError(false);
          }
        })
        .catch(function (error: any) {
          setOrientationAccessError(true);
          setErrorMessages((prevMessages) => [...prevMessages,
          `No device orientation means no hunting. ${error.message.charAt(0).toUpperCase() + error.message.slice(1).toLowerCase()}.
          Click the button to allow access.`]);
        });
    };
  };

  // if there's no bio data, let them know they need to go to their profiles
  const checkBioData = () => {
    const player = users.find((player) => player.authId === user?.sub);
    if (player && !player.facialDescriptions) {
      setBioDataError(true);
      setErrorMessages((prevMessages) => [...prevMessages,
        `Corpoverse requires all participants to submit their facial structures. Please visit your profile page to add your biodata.
        Thank you for your cooperation.`]);
    }
  };

  // when component mounts, check the access of everything
  useEffect(() => {
    checkVideoAccess();
    checkLocationAccess();
    checkOrientationAccess();
    checkBioData();
  }, []);

  // this is what makes the popup show up if there's any error messages
  return (
    <div>
      {errorMessages.length > 0 &&
        <AccessPopup
          content={`${errorMessages.join('\n\n')}`}
          accessFunctions={{
            orientation: checkOrientationAccess,
            biodata: () => navigate('/profile'),
          }}
          errorMessages={errorMessages}
        />
      }

    </div>
  );
};

export default CheckAccess;


