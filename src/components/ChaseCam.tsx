import React, { useRef, useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import {
  WebcamRendererLocal,
  LocationBasedLocal,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  DeviceOrientationControls,
} from "./webcam.js"

import SocketContext from '../contexts/Socket/SocketContext';

// had to add this in the decs.d.ts file to use in typescript. currently set as any


const ChaseCam: React.FC = () => {

  const { user } = useAuth0();

  const { users, games, locations } = useContext(SocketContext).SocketState;


  // create markers to render on the screen that stays in the defined location
  const geom = new BoxGeometry(20, 20, 20);
  const killMtl = new MeshBasicMaterial({ color: 0xff0000 }); // red
  const vicMtl = new MeshBasicMaterial({ color: 0x476930 }); // victim
  const hardCodeMtl = new MeshBasicMaterial({ color: 0x993399 });
  const killers = new Mesh(geom, killMtl); // blueprint, will need to clone
  const victim = new Mesh(geom, vicMtl); // only one, don't need to clone
  const hardCodeMarker = new Mesh(geom, hardCodeMtl);

  const { AddLocation } = useContext(SocketContext);

  // storing the marker long/lat so we can compare new coordinates to the old ones
  const [userLatitude, setUserLatitude] = useState<number | any>(null);
  const [userLongitude, setUserLongitude] = useState<number | any>(null);
  const [firstPosition, setFirstPosition] = useState<boolean | null>(false);

  // the canvas element to render the scene
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // tracks the animation frame rate from requestAnimationFrame
  const frameIdRef = useRef<number | null>(null);

  // camera rotation step in radians (the THREE.Math.degToRad(2) is deprecated or something)
  const rotationStep = (2 * Math.PI) / 180;

  // checks if the mouse button is being held down on the scene
  const mousedownRef = useRef(false);

  // stores the last position of the mouse
  const lastXRef = useRef(0);

  // the camera reference in the three library
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  // arjs reference
  const arjsRef = useRef<LocationBasedLocal | null>(null);


  useEffect(() => {
    // checks if the canvas HTML element is there, otherwise return and don't touch
    // the rest of the code
    if (!canvasRef.current) return;

    // otherwise it isn't null and assigns it
    const canvas = canvasRef.current;

    // new scene, camera, and renderer
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1.33, 0.00000001, 100000000000000);
    const renderer = new WebGLRenderer({ canvas: canvas });

    // LocationBased object for AR, takes scene and camera
    arjsRef.current = new LocationBasedLocal(scene, camera);

    // renders the webcam stream as the background for the scene
    const cam = new WebcamRendererLocal(renderer);

    // start the device orientation controls for mobile
    const deviceOrientationControls = new DeviceOrientationControls(camera);

    // start the location
    arjsRef.current.startGps();

    // can be used outside of the useEffect scope, check above
    cameraRef.current = camera;

    // sets size of canvas, renders the scene but with the camera, and
    // requests the next animation frame
    function render() {

      // setting the camera width of the device
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      // send updates when the phone tilts
      deviceOrientationControls.update();
      // update the camera's feed
      cam.update();
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(render);


      const userPositions = arjsRef.current?.getUserPosition();

      // testing if the userPositions are the same as the old ones
      // if not, update the state
      if (userLatitude !== userPositions?.latitude || userLongitude !== userPositions?.longitude) {
        setUserLatitude(userPositions?.latitude);
        setUserLongitude(userPositions?.longitude);
      }

    }

    // kick starts the loop of rendering the canvas
    frameIdRef.current = requestAnimationFrame(render);

    /////// FOR DESKTOP TESTING //////
    const handleMouseDown = () => {
      mousedownRef.current = true;
    };

    const handleMouseUp = () => {
      mousedownRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mousedownRef.current) return;
      if (e.clientX < lastXRef.current) {
        camera.rotation.y -= rotationStep;
        if (camera.rotation.y < 0) {
          camera.rotation.y += 2 * Math.PI;
        }
      } else if (e.clientX > lastXRef.current) {
        camera.rotation.y += rotationStep;
        if (camera.rotation.y > 2 * Math.PI) {
          camera.rotation.y -= 2 * Math.PI;
        }
      }
      lastXRef.current = e.clientX;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  /////// /////////////////////////////////// //////

  useEffect(() => {
    console.log(user)

    if (userLongitude && userLatitude) {
      AddLocation(user, games[0].gameId, userLongitude, userLatitude);
      console.log('added userLong and userLat');

      // hardcoded marker to test if the user location is working, should render right in front of them
      arjsRef.current?.add(hardCodeMarker, userLongitude, userLatitude + 0.001, 10);
    }

  }, [userLatitude, userLongitude])

  useEffect(() => {
    if (locations.length === 0) {
      console.log('There are no locations to plot.');
      return;
    }

    for (const userLocation of locations) {
      const markerLong = userLocation.longitude;
      const markerLat = userLocation.latitude;

      let playerExists = false; // Flag to check if player exists in the scene

      // Iterate through the children of the AR scene to check if the player already exists
      arjsRef.current?._scene.children.forEach((child) => {
        if (child.userData.id === player.authId) {
          // Player already exists, so set its position instead of adding it
          child.setWorldPosition(markerLong, markerLat, 10);
          playerExists = true;
          console.log(`Updated position for ${player.username}`);
          return; // Exit the forEach loop
        }
      });

      if (!playerExists) {
        // Player doesn't exist in the scene, so add it
        for (let player of users) {
          if (player.authId === games[0].hunted) {
            victim.userData.id = player.authId;
            arjsRef.current?.add(victim, markerLong, markerLat, 10);
            console.log(`Added marker for ${player.username}`);
          } else {
            const clonedKiller = killers.clone();
            clonedKiller.userData.id = player.authId;
            arjsRef.current?.add(clonedKiller, markerLong, markerLat, 10);
            console.log(`Added marker for ${player.username}`);
          }
        }
      }
    }
  }, [locations]);


  //   const fakeLocations =
  //   [
  //     [-73.9932334, 44.205],
  //     [-73.9932334, 44.202],
  //   ]

  // fakeLocations.forEach(coordinates => {
  //   console.log('logging coordinates:', coordinates[0], coordinates[1])
  //   arjsRef.current?.add(hardCodeMarker, coordinates[0], coordinates[1]);
  // });


  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
    </div >
  );
};

export default ChaseCam;
