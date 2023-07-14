import React, { useRef, useEffect, useContext } from 'react';

import {
  MathUtils,
  Scene,
  Line,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  MeshBasicMaterial,
  CircleGeometry,
  LineBasicMaterial,
  BufferGeometry,
  Path,
  Vector3,

} from '../GamePlay/webcam.js'

import SocketContext, { PlayerCoords } from '../../contexts/Socket/SocketContext';

const Radar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  let rotatingLine: Line;

  const { locations, player, playerCoords } = useContext(SocketContext).SocketState;

  // constants that can be altered throughout the radar
  const radarColour = '#008000';
  const radius = 2;
  const maxMapDistance = 4000; // in meters, this is about 2 miles
  const height = 250;

  // hardcoded locations until I sync this up with the user locations from socket.io
  const fakeLocations = [
    { longitude: -90.074620, latitude: 29.951760 },
    { longitude: -90.09, latitude: 29.955 },
  ]

  // calculates the distance in meters between two sets of lat/long coordinates using the Haversine Equation
  const haversineDistCoords = (playerCoords: PlayerCoords, otherCoords: { longitude: number; latitude: number; }) => {
    const deltaLongitude = MathUtils.degToRad(otherCoords.longitude - playerCoords.longitude);
    const deltaLatitude = MathUtils.degToRad(otherCoords.latitude - playerCoords.latitude);

    const a =
      Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
      Math.cos(MathUtils.degToRad(playerCoords.latitude)) *
      Math.cos(MathUtils.degToRad(otherCoords.latitude)) *
      (Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2));

    const distanceLatitude = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371000;
    const distanceLongitude = deltaLongitude * 6371000 * Math.cos(MathUtils.degToRad(playerCoords.latitude));

    return { distanceLatitude, distanceLongitude };
  }

  // console.log(haversineDistCoords(fakeLocations[0], fakeLocations[1]), 'm')
  const sceneRadarRef = useRef<Scene>(new Scene());

  // RADAR DOTS
  const dotGeometry = new CircleGeometry(0.1, 32);
  const dotMaterial = new MeshBasicMaterial({ color: 'red' });
  const dotMarker = new Mesh(dotGeometry, dotMaterial);


  useEffect(() => {
    // let sceneRadar: Scene;
    let cameraRadar: PerspectiveCamera;
    let rendererRadar: WebGLRenderer;
    let radar: Mesh;

    const init = () => {

      // camera, camera perspective using 400 pixels right now
      cameraRadar = new PerspectiveCamera(75, containerRef.current!.clientWidth / height, 0.1, 1000);
      cameraRadar.position.set(0, 0, 5);

      // renderer, currently at height pixels
      rendererRadar = new WebGLRenderer({ antialias: true, alpha: true });
      rendererRadar.setSize(containerRef.current!.clientWidth, height);
      containerRef.current!.appendChild(rendererRadar.domElement);

      // radar circle
      const geometry = new CircleGeometry(radius, 32);
      const material = new MeshBasicMaterial({ color: 'black' });
      radar = new Mesh(geometry, material);
      sceneRadarRef.current.add(radar);

      // smaller circle lines in the radar
      const numCircles = 5;
      const radiusDecrement = 0.5;

      // colour for the smaller circles
      const circColor = new LineBasicMaterial({ color: radarColour });

      // adding the largest circle line for the radar border
      const borderCircle = new BufferGeometry().setFromPoints(
        new Path().absarc(0, 0, radius, 0, Math.PI * 2, false).getSpacedPoints(50)
      );
      const border = new Line(borderCircle, circColor);
      sceneRadarRef.current.add(border);

      // adding 5 smaller circles of a decrementing radius to look like a radar
      for (let i = 1; i <= numCircles; i++) {
        let circSetup = new BufferGeometry().setFromPoints(
          new Path().absarc(0, 0, radius - i * radiusDecrement, 0, Math.PI * radius, false).getSpacedPoints(50)
        );
        let smallerCirc = new Line(circSetup, circColor);
        sceneRadarRef.current.add(smallerCirc);
      }

      // the cross lines
      // vertical
      const verticalLineGeometry = new BufferGeometry();

      verticalLineGeometry.setFromPoints([
        new Vector3(0, -radius, 0),
        new Vector3(0, radius, 0)
      ]);

      const verticalLineMaterial = new LineBasicMaterial({ color: radarColour });
      const verticalLine = new Line(verticalLineGeometry, verticalLineMaterial);
      sceneRadarRef.current.add(verticalLine);

      // horizontal
      const horizontalLineGeometry = new BufferGeometry();
      horizontalLineGeometry.setFromPoints([
        new Vector3(-radius, 0, 0),
        new Vector3(radius, 0, 0)
      ]);

      const horizontalLineMaterial = new LineBasicMaterial({ color: radarColour });
      const horizontalLine = new Line(horizontalLineGeometry, horizontalLineMaterial);
      sceneRadarRef.current.add(horizontalLine);


      // rotating radar line
      const lineGeometry = new BufferGeometry();
      lineGeometry.setFromPoints([new Vector3(0, 0, 0), new Vector3(radius, 0, 0)]);
      const lineMaterial = new LineBasicMaterial({ color: radarColour });
      rotatingLine = new Line(lineGeometry, lineMaterial);
      sceneRadarRef.current.add(rotatingLine);


      // IF NEED TO USE FAKE DATA, UNCOMMENT THIS:
      // const meterCoords = haversineDistCoords(fakeLocations[0], fakeLocations[1]);

      // if (meterCoords.distanceLatitude < maxMapDistance) {

      //   // scaling the dot's x/y
      //   const dotX = ((meterCoords.distanceLatitude / maxMapDistance) * radius);
      //   const dotY = ((meterCoords.distanceLongitude / maxMapDistance) * radius)

      //   // adding the dot to the radar, scaled to the radar's radius and max distance
      //   dotMarker.position.set(dotX, dotY, 0);

      //   // add dot marker to the sceneRadar
      //   sceneRadarRef.current.add(dotMarker);
      // }

      // render the sceneRadar with the animate function so the rotating line updates
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // rotate line around radar, based on the time's seconds rather than framerate
      const time = Date.now() * 0.001;
      const rotationSpeed = 1;
      rotatingLine.rotation.z = time * rotationSpeed;

      // render sceneRadar
      rendererRadar.render(sceneRadarRef.current, cameraRadar);
    };

    // initialize the environment
    init();

    return () => {
      // dispose on dismount
      rendererRadar.dispose();
    };
  }, []);


  useEffect(() => {

    if (locations.length === 0 || playerCoords.latitude === 0) return;

    // iterating through the locations in socket.io (all locations of players in the current game)
    for (const playerLocation of locations) {
      // console.log('playerLocation:', playerLocation)

      // place dots for other players, not the current player
      if (playerLocation.authId !== player.authId) {

        // calculate the coordinates in meters
        const meterCoords = haversineDistCoords(playerCoords, playerLocation);

        // scaling the dot's x/y to the radar coordinate system
        const dotX = ((meterCoords.distanceLatitude / maxMapDistance) * radius);
        const dotY = ((meterCoords.distanceLongitude / maxMapDistance) * radius);

        // see if there's an existing dot
        const dotToUpdate = sceneRadarRef.current.children.find((child) => child.userData.id === playerLocation.authId);
        // update dot
        if (dotToUpdate) {
          meterCoords.distanceLatitude < maxMapDistance ? dotToUpdate.position.set(dotX, dotY, 0) : dotToUpdate.remove();
        } else {
          if (meterCoords.distanceLatitude < maxMapDistance) {
            const clonedDot = dotMarker.clone();
            clonedDot.userData.id = playerLocation.authId;
            // adding the dot to the radar, scaled to the radar's radius and max distance
            clonedDot.position.set(dotX, dotY, 0);

            // add dot marker to the sceneRadar
            sceneRadarRef.current.add(clonedDot);
          }
        }
      }
    }
  }, [locations]); // happens every time a new location is read

  const canvasHeight = `${height}px`
  return <div ref={containerRef} style={{ width: '100%', height: canvasHeight, bottom: 0, position: 'fixed' }} />;
};

export default Radar;
