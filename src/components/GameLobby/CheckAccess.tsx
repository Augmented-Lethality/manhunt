import React, { useEffect, useContext, useState } from 'react';
import { AccessContext } from '../../contexts/AccessContext';

const CheckAccess: React.FC = () => {

  const { videoAccessError, locationAccessError, orientationAccessError,
    setVideoAccessError, setLocationAccessError, setOrientationAccessError, } = useContext(AccessContext);

  // turns the camera on and off
  const checkVideoAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // console.log('Video Okay');
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((error) => {
        console.error('Error accessing video:', error);
        setVideoAccessError(true);
      });
  };

  const checkLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!position.coords.longitude && !position.coords.latitude) {
          // console.log('Could not get the positions');
          setLocationAccessError(true);
        } else {
          // console.log('got the positions');
        }
      },
        (error) => {
          console.error('Error getting location:', error);
          setLocationAccessError(true);
        },
        {}
      );
    } else {
      console.error('Geolocation is not supported by the browser');
      setLocationAccessError(true);
    }
  };

  const checkOrientationAccess = () => {
    // if the user is on a mobile device, computers don't have this
    if (window.DeviceOrientationEvent !== undefined && typeof (window.DeviceOrientationEvent as any).requestPermission === "function") {
      (window.DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response !== "granted") {
            setOrientationAccessError(true);
          } else {
            // sets it as false if the user clicks the button and allows access
            setOrientationAccessError(false);
          }
        })
        .catch(function (error: any) {
          console.error("Unable to use DeviceOrientation:", error);
          setOrientationAccessError(true);
        });
    };
  };

  useEffect(() => {
    checkVideoAccess();
    checkLocationAccess();
    checkOrientationAccess();
  }, []);

  return (
    <div>
      {videoAccessError && <button onClick={checkVideoAccess}>Allow Camera Access</button>}
      {locationAccessError && <strong>Error: Can't Access Location, Ensure Your Browser Allows Location Access</strong>}
      {orientationAccessError && <button onClick={checkOrientationAccess}>Allow Device Orientation Access</button>}
    </div>
  );
};

export default CheckAccess;