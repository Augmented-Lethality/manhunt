import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from 'react-three-fiber';
import { Box } from '@react-three/drei';

interface TrophyProps {}

const Trophy: React.FC<TrophyProps> = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
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
  };


  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <h1>You win this!</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box ref={cubeRef} args={[2, 2, 2]} position={[0, 0, 0]} rotation={[0, 0.4, 0]}>
          <meshStandardMaterial attach="material" color={'orange'} />
        </Box>
      </Canvas>
      <h3>Thanks for playing.</h3>
    </div>
  );
};

export default Trophy;

