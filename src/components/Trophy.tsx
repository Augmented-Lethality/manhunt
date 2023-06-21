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

  const getRandomDimension = (): number => {
    const dimensions = [1, 2, 3];
    const randomIndex = Math.floor(Math.random() * dimensions.length);
    return dimensions[randomIndex];
  };
  
  const getRandomColor = (): string => {
    const colors = ['darkred', 'lightgreen', 'blue', 'yellow', 'orange', 'purple', 'pink'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }  

  const getRandomShape = (): string => {
    const shapes = ['box', 'polyhedron', 'torus'];
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
  };

  const shape = useMemo(() => getRandomShape(), []);
  const dimension = useMemo(() => getRandomDimension(), []);
  const color = useMemo(() => getRandomColor(), []);

  const trophyObj = {
    shape: shape,
    dimension: dimension,
    color,
  };

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
            args={[dimension, 0.2, 16, 100]} // Adjust the arguments according to your desired torus shape
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

