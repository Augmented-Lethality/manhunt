import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export type UserData = {
  id: number;
  username: string;
  email: string;
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  facialDescriptions: Array<number> | null;
  // Add other user data properties as needed
};

const TrophyGenerator: React.FC = () => {
  const trophyRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<UserData>(`/Users/${user?.sub}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setUserData(response.data[0]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

  const trophyData = {
    dimension: useMemo(() => getRandomElement([1, 2, 3]), []),
    color: useMemo(
      () =>
        getRandomElement([
          'darkred',
          'lightgreen',
          '#3d6cb8',
          'yellow',
          'orange',
          '#19191a',
          'pink',
          'aquamarine',
        ]),
      []
    ),
    shape: useMemo(() => getRandomElement(['box', 'polyhedron', 'torus']), []),
    tubularSegments: useMemo(
      () => getRandomElement([3, 4, 5, 6, 7, 8, 100]),
      []
    ),
    tubeWidth: useMemo(() => getRandomElement([0.1, 0.2, 0.3, 0.4, 0.5]), []),
  };

  const postTrophyData = async () => {
    try {
      if (userData && userData.id) {
        setIsClaimed(true);
        console.log('userData.id:', userData.id); // Check the value of userData.id
        await axios.post('/trophies', {
          name: 'Generated Trophy4',
          description: 'A randomly generated trophy',
          generationConditions: JSON.stringify(trophyData),
          filePath: '',
          ownerId: userData.id
        });
      } else {
        console.log('userData is not available');
      }
    } catch (error) {
      console.error('Error posting trophy data:', error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <h1>You win this!</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {trophyData.shape === 'box' && (
          <Box
            ref={trophyRef}
            args={[
              trophyData.dimension,
              trophyData.dimension,
              trophyData.dimension,
            ]}
            position={[0, 0, 0]}
            rotation={[0, 0.4, 0]}
          >
            <meshStandardMaterial attach='material' color={trophyData.color} />
          </Box>
        )}
        {trophyData.shape === 'polyhedron' && (
          <Dodecahedron
            ref={trophyRef}
            args={[trophyData.dimension, 0]}
            position={[0, 0, 0]}
            rotation={[0, 0.4, 0]}
          >
            <meshStandardMaterial attach='material' color={trophyData.color} />
          </Dodecahedron>
        )}
        {trophyData.shape === 'torus' && (
          <Torus
            ref={trophyRef}
            args={[
              trophyData.dimension,
              trophyData.tubeWidth,
              16,
              trophyData.tubularSegments,
            ]}
            position={[0, 0, 0]}
            rotation={[0, 0.4, 0]}
          >
            <meshStandardMaterial attach='material' color={trophyData.color} />
          </Torus>
        )}
      </Canvas>
      {userData && userData.id !== null && (
        <button onClick={postTrophyData} disabled={isClaimed}> {isClaimed ? 'Claimed!' : 'Claim Trophy'}</button>
      )}
    </div>
  );
};

export default TrophyGenerator;
