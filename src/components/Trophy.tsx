import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from 'react-three-fiber';
import { Box, Sphere, Cylinder } from '@react-three/drei';

interface TrophyProps {}

const Trophy: React.FC<TrophyProps> = () => {
  const shapeRef = useRef<THREE.Mesh>(null);
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

    if (shapeRef.current) {
      shapeRef.current.rotation.y += mouseDeltaX * 0.01;
    }
  };

  const getRandomDimension = (): number => {
    const dimensions = [1, 2, 3];
    const randomIndex = Math.floor(Math.random() * dimensions.length);
    return dimensions[randomIndex];
  };

  const getRandomColor = (): string => {
    const colors = ['red', 'lightGreen', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const getRandomShape = (): React.ReactElement => {
    const shapes = [<Box />, <Sphere />, <Cylinder />];
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
  };

  const shape = useMemo(() => getRandomShape(), []);
  const dimension = useMemo(() => getRandomDimension(), []);
  const color = useMemo(() => getRandomColor(), []);

  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <h1>You win this!</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {React.cloneElement(shape, {
          ref: shapeRef,
          args: [dimension, dimension, dimension],
          position: [0, 0, 0],
          rotation: [0, 0.4, 0],
          children: <meshStandardMaterial attach="material" color={color} />,
        })}
      </Canvas>
      <h3>Thanks for playing.</h3>
    </div>
  );
};

export default Trophy;

