import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Radar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  let rotatingLine: THREE.Line;

  const radarColour = '#008000';
  const radius = 2;

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
