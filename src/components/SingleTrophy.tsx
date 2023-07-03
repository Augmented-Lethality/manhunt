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

const singleTrophy: React.FC = () => {
  const trophyRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trophyName, setTrophyName] = useState('');
  const [trophyDescription, setTrophyDescription] = useState('');

  // event handlers
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
  
    const mouseDeltaX = -(e.clientX - prevMouseX);
    const mouseDeltaY = e.clientY - prevMouseY;
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);
  
    if (trophyRef.current) {
      trophyRef.current.rotation.y -= mouseDeltaX * 0.01; // Rotate around Y-axis
      trophyRef.current.rotation.x += mouseDeltaY * 0.01; // Rotate around X-axis
    }
  };
  

  // functions for generating random trophy properties
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

  const generateRandomName = () => {
    const adjectives = [
      'Atomic',
      'Elite',
      'Stellar',
      'Radiating',
      'Executive Excellence',
      'Corporate Compliance Champion',
      'Citizenship',
      'Participation',
      'Employee Appreciation',
    ];
    const nouns = [
      'Trophy',
      'Award',
      'Bounty',
      'Medal',
      'Accolade',
      'Relic',
      'Heirloom',
      'Souvenir',
      'Jewel',
      'Keepsake',
      'Flair',
    ];
    const adjective = getRandomElement(adjectives);
    const noun = getRandomElement(nouns);
    const name = `${adjective} ${noun}`;
    setTrophyName(name);
    return name;
  };

  const generateRandomDescription = () => {
    const descriptions = [
      `Awarded to the most skilled operative in the CorpoReality Autonomy Police.`,
      `A an extremely valuable bounty that seems to never have one owner for too long...`,
      `An extraordinary achievement recognized by the high-tech society of the SOCIETY™.`,
      `A trophy seized from the clutches of the CorpoReality Police, a true symbol of defiance and audacity.`,
      `A token of recognition for exceptional espionage and cunning within The Collective.`,
      `It's dangerous to go alone! Take this.`,
    ];
    const description = getRandomElement(descriptions);
    setTrophyDescription(description);
    return description;
  };

  // data related functions
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

  const postTrophyData = async () => {
    try {
      if (userData && userData.id) {
        await axios.post('/trophies', {
          name: trophyName,
          description: trophyDescription,
          generationConditions: JSON.stringify(trophyData),
          filePath: '',
          ownerId: userData.id,
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
    generateRandomName();
    generateRandomDescription();
  }, []);

  useEffect(() => {
    postTrophyData();
  }, [userData]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="trophy-container"
    >
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
    </div>
  );
};

export default singleTrophy;
