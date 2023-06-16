import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';

import React, { useRef, useEffect, useState } from 'react';

import {WebcamRendererLocal, LocationBasedLocal} from "./webcam.js"

// had to add this in the decs.d.ts file to use in typescript. currently set as any

const ChaseCam: React.FC = () => {

  const [boxLatitude, setBoxLatitude] = useState<number | null>(null);
  const [boxLongitude, setBoxLongitude] = useState<number | null>(null);

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

  useEffect(() => {
    // checks if the canvas HTML element is there, otherwise return and don't touch
    // the rest of the code
    if (!canvasRef.current) return;

    // otherwise it isn't null and assigns it
    const canvas = canvasRef.current;

    // new scene, camera, and renderer
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1.33, 0.1, 10000);
    const renderer = new WebGLRenderer({ canvas: canvas, alpha: true });

    // new video element
    // const video = document.getElementById('video1') as HTMLVideoElement;

    // LocationBased object for AR, takes scene and camera
    const arjs = new LocationBasedLocal(scene, camera);

    // renders the webcam stream as the background for the scene
    // I THINK THIS IS THE PROBLEM
    const cam = new WebcamRendererLocal(renderer, '#video1');

    // create a red box to render on the screen that stays in the defined location
    const geom = new BoxGeometry(20, 20, 20);
    const mtl = new MeshBasicMaterial({ color: 0xff0000 });
    const box = new Mesh(geom, mtl);

    arjs.setMarkerPosition = (latitude, longitude) => {
      const markerLatitude = latitude + 0.001;
      const markerLongitude = longitude;

      console.log(markerLatitude, markerLongitude)

      arjs.markerLatitude = markerLatitude;
      arjs.markerLongitude = markerLongitude;

      setBoxLatitude(markerLatitude);
      setBoxLongitude(markerLongitude);

      console.log('going into box:', markerLatitude, markerLongitude)
      arjs.add(box, markerLatitude, markerLongitude);

      return [markerLatitude, markerLongitude];
    };

    // box location in long/lat, HARDCODED FOR MY COORDINATES

    // on desktop so need the fake gps
    arjs.startGps();

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
// REACT THREE FIBER NOTES IF NEEDED
/*
<Canvas />:
- It sets up a Scene and a Camera, the basic building blocks necessary for rendering
- It renders our scene every frame, you do not need a traditional render-loop

<mesh />
- see something in our scene
- direct equivalent to new THREE.Mesh()
- the geometry and material automatically attach to their parent

Passing constructor arguments:
- Instead of: new THREE.BoxGeometry(2, 2, 2)
- Do this instead: <boxGeometry args={[2, 2, 2]} />
- Note that every time you change args, the object must be re-constructed!

*/

export default ChaseCam;
