import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Radar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  let rotatingLine: THREE.Line;

  // constants that can be altered throughout the radar
  const radarColour = '#008000';
  const radius = 2;
  const maxMapDistance = 3200; // in meters, this is about 2 miles

  // hardcoded locations until I sync this up with the user locations from socket.io
  const fakeLocations = [
    { longitude: -90.074620, latitude: 29.951760 },
    { longitude: -90.09, latitude: 29.955 },

  ]

  // calculates the distance in meters between two sets of lat/long coordinates using the Haversine Equation
  const haversineDistCoords = (playerCoords: { longitude: number; latitude: number; }, otherCoords: { longitude: number; latitude: number; }) => {
    const deltaLongitude = THREE.MathUtils.degToRad(otherCoords.longitude - playerCoords.longitude);
    const deltaLatitude = THREE.MathUtils.degToRad(otherCoords.latitude - playerCoords.latitude);

    const a =
      Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
      Math.cos(THREE.MathUtils.degToRad(playerCoords.latitude)) *
      Math.cos(THREE.MathUtils.degToRad(otherCoords.latitude)) *
      (Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2));

    const distanceLatitude = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371000;
    const distanceLongitude = deltaLongitude * 6371000 * Math.cos(THREE.MathUtils.degToRad(playerCoords.latitude));

    return { distanceLatitude, distanceLongitude };
  }

  // console.log(haversineDistCoords(fakeLocations[0], fakeLocations[1]), 'm')


  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let radar: THREE.Mesh;

    const init = () => {
      // scene
      scene = new THREE.Scene();

      // camera, camera perspective using 400 pixels right now
      camera = new THREE.PerspectiveCamera(75, containerRef.current!.clientWidth / 400, 0.1, 1000);
      camera.position.set(0, 0, 5);

      // renderer, currently at 400 pixels
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current!.clientWidth, 400);
      containerRef.current!.appendChild(renderer.domElement);

      // radar circle
      const geometry = new THREE.CircleGeometry(radius, 32);
      const material = new THREE.MeshBasicMaterial({ color: 'black' });
      radar = new THREE.Mesh(geometry, material);
      scene.add(radar);

      // smaller circle lines in the radar
      const numCircles = 5;
      const radiusDecrement = 0.5;

      // colour for the smaller circles
      const circColor = new THREE.LineBasicMaterial({ color: radarColour });

      // adding the largest circle line for the radar border
      const borderCircle = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2, false).getSpacedPoints(50)
      );
      const border = new THREE.Line(borderCircle, circColor);
      scene.add(border);

      // adding 5 smaller circles of a decrementing radius to look like a radar
      for (let i = 1; i <= numCircles; i++) {
        let circSetup = new THREE.BufferGeometry().setFromPoints(
          new THREE.Path().absarc(0, 0, radius - i * radiusDecrement, 0, Math.PI * radius, false).getSpacedPoints(50)
        );
        let smallerCirc = new THREE.Line(circSetup, circColor);
        scene.add(smallerCirc);
      }

      // the cross lines
      // vertical
      const verticalLineGeometry = new THREE.BufferGeometry();

      verticalLineGeometry.setFromPoints([
        new THREE.Vector3(0, -radius, 0),
        new THREE.Vector3(0, radius, 0)
      ]);

      const verticalLineMaterial = new THREE.LineBasicMaterial({ color: radarColour });
      const verticalLine = new THREE.Line(verticalLineGeometry, verticalLineMaterial);
      scene.add(verticalLine);

      // horizontal
      const horizontalLineGeometry = new THREE.BufferGeometry();
      horizontalLineGeometry.setFromPoints([
        new THREE.Vector3(-radius, 0, 0),
        new THREE.Vector3(radius, 0, 0)
      ]);

      const horizontalLineMaterial = new THREE.LineBasicMaterial({ color: radarColour });
      const horizontalLine = new THREE.Line(horizontalLineGeometry, horizontalLineMaterial);
      scene.add(horizontalLine);


      // rotating radar line
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(radius, 0, 0)]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: radarColour });
      rotatingLine = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(rotatingLine);



      // RADAR DOTS
      const dotGeometry = new THREE.CircleGeometry(0.1, 32);
      const dotMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
      const dotMarker = new THREE.Mesh(dotGeometry, dotMaterial);

      // getting the coordinates in meters to be used
      const meterCoords = haversineDistCoords(fakeLocations[0], fakeLocations[1]);

      if (meterCoords.distanceLatitude < maxMapDistance) {

        // scaling the dot's x/y
        const dotX = ((meterCoords.distanceLatitude / maxMapDistance) * radius);
        const dotY = ((meterCoords.distanceLongitude / maxMapDistance) * radius)

        // adding the dot to the radar, scaled to the radar's radius and max distance
        dotMarker.position.set(dotX, dotY, 0);

        // add dot marker to the scene
        scene.add(dotMarker);
      }

      // render the scene with the animate function so the rotating line updates
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // rotate line around radar, based on the time's seconds rather than framerate
      const time = Date.now() * 0.001;
      const rotationSpeed = 1;
      rotatingLine.rotation.z = time * rotationSpeed;

      // render scene
      renderer.render(scene, camera);
    };

    // initialize the environment
    init();

    return () => {
      // dispose on dismount
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default Radar;
