import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from 'react-three-fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';

interface TrophyProps {}


const Trophy: React.FC<TrophyProps> = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const dodecahedronRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);

  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setPrevMouseX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) return;

    const mouseDeltaX = e.clientX - prevMouseX;
    setPrevMouseX(e.clientX);

    if (cubeRef.current) {
      cubeRef.current.rotation.y += mouseDeltaX * 0.01;
    }

    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.y += mouseDeltaX * 0.01;
    }

    if (torusRef.current) {
      torusRef.current.rotation.y += mouseDeltaX * 0.01;
    }
  };

  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const getRandomDimension = (): number => {
    const dimensions = [1, 2, 3];
    return getRandomElement(dimensions);
  };
  
  const getRandomColor = (): string => {
    const colors = ['darkred', 'lightgreen', 'darkblue', 'yellow', 'orange', 'black', 'pink', 'aquamarine'];
    return getRandomElement(colors);
  }  

  const getRandomShape = (): string => {
    const shapes = ['box', 'polyhedron', 'torus'];
    return getRandomElement(shapes);
  };

  const getRandomTubularSegments = (): number => {
    const segments = [3, 4, 5, 6, 7, 8, 100];
    return getRandomElement(segments);
  };

  const getRandomTubeWidth = (): number => {
    const tubeWidths = [0.1, 0.2, 0.3, 0.4, 0.5];
    return getRandomElement(tubeWidths);
  };
  
  const dimension = useMemo(() => getRandomDimension(), []);
  const color = useMemo(() => getRandomColor(), []);
  const shape = useMemo(() => getRandomShape(), []);
  const tubularSegments = useMemo(() => getRandomTubularSegments(), []);
  const tubeWidth = useMemo(() => getRandomTubeWidth(), []);


  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <h1>You win this!</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {shape === 'box' && (
          <Box ref={cubeRef} args={[dimension, dimension, dimension]} position={[0, 0, 0]} rotation={[0, 0.4, 0]}>
            <meshStandardMaterial attach="material" color={color} />
          </Box>
        )}
        {shape === 'polyhedron' && (
          <Dodecahedron ref={dodecahedronRef} args={[dimension, 0]} position={[0, 0, 0]} rotation={[0, 0.4, 0]}>
            <meshStandardMaterial attach="material" color={color} />
          </Dodecahedron>
        )}
        {shape === 'torus' && (
          <Torus
            ref={torusRef}
            args={[dimension , tubeWidth, 16, tubularSegments]} 
            position={[0, 0, 0]}
            rotation={[0, 0.4, 0]} 
          >
            <meshStandardMaterial attach="material" color={color} />
          </Torus>
        )}
        
      </Canvas>
      <h3>Thanks for playing.</h3>
    </div>
  );
};

export default Trophy;

