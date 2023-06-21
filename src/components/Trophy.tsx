import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from 'react-three-fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';

interface TrophyProps {}

const Trophy: React.FC<TrophyProps> = () => {
  const trophyRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) return;

    const mouseDeltaX = e.clientX - prevMouseX;
    const mouseDeltaY = e.clientY - prevMouseY;
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);

    if (trophyRef.current) {
      trophyRef.current.rotation.y += mouseDeltaX * 0.01; // Rotate around Y-axis
      trophyRef.current.rotation.x += mouseDeltaY * 0.01; // Rotate around X-axis
    }
  };


  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };
  
  // Generate these Trophy properies randomly from given arrays
  const dimension = useMemo(() => getRandomElement([1, 2, 3]), []);
  const color = useMemo(() => getRandomElement(['darkred', 'lightgreen', 'darkblue', 'yellow', 'orange', 'black', 'pink', 'aquamarine']), []);
  const shape = useMemo(() => getRandomElement(['box', 'polyhedron', 'torus']), []);
  const tubularSegments = useMemo(() => getRandomElement([3, 4, 5, 6, 7, 8, 100]), []);
  const tubeWidth = useMemo(() => getRandomElement([0.1, 0.2, 0.3, 0.4, 0.5]), []);


  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <h1>You win this!</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {shape === 'box' && (
          <Box ref={trophyRef} args={[dimension, dimension, dimension]} position={[0, 0, 0]} rotation={[0, 0.4, 0]}>
            <meshStandardMaterial attach="material" color={color} />
          </Box>
        )}
        {shape === 'polyhedron' && (
          <Dodecahedron ref={trophyRef} args={[dimension, 0]} position={[0, 0, 0]} rotation={[0, 0.4, 0]}>
            <meshStandardMaterial attach="material" color={color} />
          </Dodecahedron>
        )}
        {shape === 'torus' && (
          <Torus
            ref={trophyRef}
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

