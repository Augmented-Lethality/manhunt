import React, { useRef, useEffect, useState, useContext } from 'react';

import {
  WebcamRendererLocal,
  LocationBasedLocal,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh, } from "./webcam.js"

  import SocketContext from '../contexts/Socket/SocketContext.js';

// had to add this in the decs.d.ts file to use in typescript. currently set as any

type ChaseCamProps = {
  markerBlueprint: Mesh<BoxGeometry, MeshBasicMaterial>;
};

const ChaseCam: React.FC<ChaseCamProps> = ({ markerBlueprint }) => {

  const { socket, uid, users, games, locations } = useContext(SocketContext).SocketState;
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
    const renderer = new WebGLRenderer({ canvas: canvas, alpha: true });

    // new video element
    // const video = document.getElementById('video1') as HTMLVideoElement;

    // LocationBased object for AR, takes scene and camera
    arjsRef.current = new LocationBasedLocal(scene, camera);

    // renders the webcam stream as the background for the scene
    const cam = new WebcamRendererLocal(renderer, '#video1');

    // start the location
    arjsRef.current.startGps();

    // can be used outside of the useEffect scope, check above
    cameraRef.current = camera;

    // sets size of canvas, renders the scene but with the camera, and
    // requests the next animation frame
    function render() {
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
      cam.update();
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(render);

      const userPositions = arjsRef.current?.getUserPosition();

      // testing if the userPositions are the same as the old ones
      // if not, update the state
      if(userLatitude !== userPositions?.latitude || userLongitude !== userPositions?.longitude) {
          setUserLatitude(userPositions?.latitude);
          setUserLongitude(userPositions?.longitude);
      }

    }

    // kick starts the loop of rendering the canvas
    frameIdRef.current = requestAnimationFrame(render);

    // all of this below handles the fake movement in desktop, got most of it from the
    // AR.js docs but needed to edit it a little bit
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

  // create a red box to render on the screen that stays in the defined location
  const geom = new BoxGeometry(20, 20, 20);
  const mtl = new MeshBasicMaterial({ color: 0xff0000 });
  const box = new Mesh(geom, mtl);

  useEffect(() => {

    // // if the positions aren't null (why try to render a box at null positions)
    // if(userLatitude !== null) {
    //   // console.log('they changed', userLongitude, userLatitude)

    //   const markerLong = userLongitude;
    //   const markerLat = userLatitude + .001;

    //   console.log('marker positions: ', markerLong, markerLat, )

    //   // if the box has not been set on the map yet
    //   if(!firstPosition) {
    //     console.log('not set, adding');
    //     arjsRef.current?.add(box, markerLong, markerLat, 10);

    //     // store this in the state so we know the first box has been set and we don't need to call the .add() function
    //     setFirstPosition(true);
    //   } else {
    //     console.log('set, changing position');

    //     // don't create a new box with add, just edit the old one
    //     arjsRef.current?.setWorldPosition(box, markerLong, markerLat)
    //   }

    // }
    let theId = '';
    for (const host in games) {
      if (games.hasOwnProperty(host)) {
        const game = games[host];
        if (game.uidList.includes(uid)) {
          theId = game.gameId;
        }
      }
    }
    AddLocation(theId, userLongitude, userLatitude);


  }, [userLatitude, userLongitude])

  useEffect(() => {

    // getting the user locations from the locations of the socket state
    const userLocations = Object.values(locations);

    if (userLocations.length === 0) {
      console.log('There are no locations to plot.');
      return;
    }

    // markers that have been added are stored in this array
    const addedMarkers: Array<Mesh<BoxGeometry, MeshBasicMaterial>> = [];

    // iterating through the locations of the current locations state
    for (const userLocation of userLocations) {
      const { latitude, longitude } = userLocation;
      const markerLong = longitude;
      const markerLat = latitude;

      // checking if there's a marker that exists already
      const existingMarker = addedMarkers.find((marker) => marker.userData.id === uid);

      // if it exists, then just change the location, don't make a new one
      if (existingMarker) {
        arjsRef.current?.setWorldPosition(existingMarker, markerLong, markerLat);
      } else {
        // make a clone of the markerBlueprint
        const clonedMarker = markerBlueprint.clone();
        clonedMarker.userData.id = uid;
        arjsRef.current?.add(clonedMarker, markerLong, markerLat, 10);

        // add the marker to the addedMarkers array so it can be checked if it was already put onto the map
        addedMarkers.push(clonedMarker);
      }
    }
  }, [locations]);



  return (
    <>
      <video
        id='video1'
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
    </>
  );
};

export default ChaseCam;
