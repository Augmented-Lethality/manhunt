import React, { useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { Box } from '@react-three/drei';

export const Trophy: React.FC = () => {
  const cubeRef = useRef<THREE.Mesh>(null);

  // useFrame(() => {
  //   if (cubeRef.current) {
  //     cubeRef.current.rotation.y += 0.01; // Adjust rotation speed
  //   }
  // });

  return (
    <div>
      <h1>You win this!</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box ref={cubeRef} args={[1, 1, 1]} position={[0, 0, 0]} rotation={[0, 0.4, 0]}>
          <meshStandardMaterial attach="material" color="orange" />
        </Box>
      </Canvas>
      <h3>Thanks for playing.</h3>
    </div>
  );
};

