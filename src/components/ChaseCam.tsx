import React, { useRef, useEffect, useState, useContext, } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useWebcam } from '../contexts/WebcamChaseProvider';

import {
  LocationBasedLocal,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  DeviceOrientationControls,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "./webcam.js"

import SocketContext from '../contexts/Socket/SocketContext';


const ChaseCam: React.FC = () => {

  const { user } = useAuth0();
  const { games, locations, users } = useContext(SocketContext).SocketState;
  const [userTextures, setUserTextures] = useState({});

  // comes from the webcam context that this component is wrapped in
  const webcamContext = useWebcam();
  const webcamRef = webcamContext?.webcamRef;

  ////////// create markers to render on the screen that stays in the defined location ///////////
  // create sprite materials
  const killMtl = new SpriteMaterial({ color: 0xff0000, sizeAttenuation: false }); // red
  const vicMtl = new SpriteMaterial({ color: 0x476930, sizeAttenuation: false }); // victim
  // const hardCodeMtl = new SpriteMaterial({ color: 0x993399, sizeAttenuation: false });

  // create sprites
  const killers = new Sprite(killMtl);
  const victim = new Sprite(vicMtl);
  // const hardCodeMarker = new Sprite(hardCodeMtl);

  // set size of sprites
  const spriteSize = 0.5;
  killers.scale.set(spriteSize, spriteSize, 1);
  victim.scale.set(spriteSize, spriteSize, 1);
  // hardCodeMarker.scale.set(spriteSize, spriteSize, 1);

  // loads the pictures of the users onto the markers if they have a google photo
  const textureLoader = new TextureLoader();
  //////////////////////////////////////////////////////////////////


  // this will add the location to the DB
  const { AddLocation } = useContext(SocketContext);

  // storing the marker long/lat so we can compare new coordinates to the old ones
  const [userLatitude, setUserLatitude] = useState<number>(0);
  const [userLongitude, setUserLongitude] = useState<number>(0);

  // the refs to be used in the useEffect
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIdRef = useRef<number | null>(null);   // tracks the animation frame rate from requestAnimationFrame
  const cameraRef = useRef<PerspectiveCamera | null>(null); // renders the markers
  const arjsRef = useRef<LocationBasedLocal | null>(null); // gets the locations
  const webcamRendererRef = useRef<HTMLVideoElement | null>(null); // HTML element for the video
  const deviceOrientationControlsRef = useRef<DeviceOrientationControls | null>(null);

  // getting the pictures for the textures, gravatar was giving a CORS error
  useEffect(() => {
    const textureObject = {};
    users.forEach(async (person) => {

      if (!person.image.includes("gravatar") && person.image !== user?.sub) {
        const texture = textureLoader.load(person.image);
        textureObject[person.authId] = texture;
      }
    });
    setUserTextures(textureObject);
  }, [users, user])

  useEffect(() => {

    // checks if the canvas HTML element is there, otherwise return and don't touch
    // the rest of the code
    if (!canvasRef.current) return;

    // canvas is the HTML element canvas
    const canvas = canvasRef.current;

    // new scene, camera, and renderer
    const scene = new Scene();

    // camera to view the markers
    const camera = new PerspectiveCamera(80, 2, 0.1, 50000);

    // rendering the scene
    const renderer = new WebGLRenderer({ canvas: canvas, alpha: true });

    // LocationBased object for AR, takes scene and camera
    arjsRef.current = new LocationBasedLocal(scene, camera);

    // renders the webcam stream as the background for the scene, this is an AR.js class that I edited
    if (webcamRef?.current?.video) {
      webcamRendererRef.current = webcamRef?.current?.video;
    }

    // start the device orientation controls for mobile
    deviceOrientationControlsRef.current = new DeviceOrientationControls(camera);

    // start the location
    arjsRef.current.startGps();

    // can be used outside of the useEffect scope, check above
    cameraRef.current = camera;

    // sets size of canvas, renders the scene but with the camera, and
    // requests the next animation frame
    function render() {

      // setting the camera width/height, determined by device and canvas on the page
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
      deviceOrientationControlsRef.current?.update();
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(render);


      // getting the user position determined by AR.js LocationBasedLocal
      // this is only for the user, not all of the players
      const userPositions = arjsRef.current?.getUserPosition();

      // testing if the userPositions are the same as the old ones
      // if not, update the local user's state
      if (userLatitude !== userPositions?.latitude || userLongitude !== userPositions?.longitude) {
        setUserLatitude(userPositions?.latitude);
        setUserLongitude(userPositions?.longitude);
      }

    }

    // kick starts the loop of rendering the canvas
    frameIdRef.current = requestAnimationFrame(render);


    // clean up
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (canvasRef.current) {
        canvasRef.current.remove();
      }

      arjsRef.current?.stopGps();
    };
  }, []);
  /////// /////////////////////////////////// //////


  useEffect(() => {
    // console.log('inserting into AddLocation:', typeof userLongitude, userLongitude)

    // if it isn't 0 (the default), store it into the DB using the socket.io function I made/imported
    if (userLongitude) {
      AddLocation(user, games[0].gameId, userLongitude, userLatitude);
      // console.log('added userLong and userLat', typeof userLongitude);
    }

  }, [userLatitude, userLongitude]) // happens every time the userLat and userLong is updated by the AR.js LocationBasedLocal


  // NOTE: THIS IS VERY TIME COMPLEX SO I WILL BE POLISHING THIS IN POLISH WEEK
  useEffect(() => {

    if (locations.length === 0) return;

    // iterating through the locations of the current locations state in socket.io (all locations of players in the current game)
    for (const playerLocation of locations) {
      // these will be the marker's long and lat for that player
      const markerLong = playerLocation.longitude;
      const markerLat = playerLocation.latitude;

      const existingMarkers: string[] = [];

      if (arjsRef.current !== null) {
        arjsRef.current._scene.children.forEach((child: { userData: { id: string } }) => {
          if (!existingMarkers.includes(child.userData.id)) {
            existingMarkers.push(child.userData.id);
          }
        });
      }

      // if the current player in the locations state's authId matches the current user's authId,
      // don't place a marker because there's no point in a marker being on top of you
      if (playerLocation.authId !== user?.sub) {
        // if a marker has not been placed for the player yet
        if (!existingMarkers.includes(playerLocation.authId)) {
          // if the player is being hunted
          if (playerLocation.authId === games[0].hunted) {
            // make the marker's id = the the player's authId
            victim.userData.id = playerLocation.authId;
            // set the user's picture as the map texture for the victim
            const texture = userTextures[playerLocation.authId];
            if (texture) {
              // console.log('texture:', texture, userTextures)
              victim.material.map = texture;
              victim.material.needsUpdate = true; // re-process with the new material texture
            }
            // add the marker to the scene at their long/lat and an elevation of 10 so it's mid height
            arjsRef.current?.add(victim, markerLong, markerLat, 5);
            // console.log(`Added NEW victim marker`);
          } else {
            // make another killer marker to place and add to the scene
            const clonedKiller = killers.clone();
            clonedKiller.userData.id = playerLocation.authId;
            // set the user's picture as the map texture for the killer
            const texture = userTextures[playerLocation.authId];
            if (texture) {
              clonedKiller.material.map = texture;
              clonedKiller.material.needsUpdate = true; // re-process with the new material texture
            }
            arjsRef.current?.add(clonedKiller, markerLong, markerLat, 5);
            // console.log(`Added NEW killer marker`);
          }
        } else {
          // find the existing marker
          const markerToUpdate = arjsRef.current?._scene.children.find((child) => child.userData.id === playerLocation.authId);
          // a marker has already been added so only updating the world position
          arjsRef.current?.setWorldPosition(markerToUpdate, markerLong, markerLat, 5);
          // console.log('updated the location of an existing marker')
        }


      } else {
        // USE THIS IF YOU NEED TO TEST A MARKER RENDERING

        // arjsRef.current?.add(victim, markerLong, markerLat + 0.01, 10);
        // console.log('added a fake marker for player 0.1 away')
      }

    }

  }, [locations]); // happens every time a new location is read


  return (
    // <div style={{ height: '100%', width: '100%' }}>
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: '132px', left: 0 }}
    // style={{ width: '100%', height: '100%' }}
    />
    // </div>
  );
};

export default ChaseCam;
