import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export type TrophyData = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  dimension: number;
  color: string;
  shape: string;
  tubularSegments: number;
  tubeWidth: number;
};

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

const SavedTrophy: React.FC<TrophyData> = () => {
  const trophyRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userTrophyData, setUserTrophyData] = useState<TrophyData[]>([]);
  const [showProps, setShowProps] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<UserData>(`/Users/${user?.sub}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('User Data:', response.data[0]); // Log the response data
      setUserData(response.data[0]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserTrophyData = async () => {
    try {
      if (userData) {
        const response = await axios.get<
          {
            id: number;
            name: string;
            description: string;
            createdAt: string;
            generationConditions: string;
          }[]
        >(`/trophies/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const parsedTrophyData: TrophyData[] = response.data.map((trophy) => {
          const generationConditions = JSON.parse(trophy.generationConditions);
          return {
            id: trophy.id,
            name: trophy.name,
            description: trophy.description,
            createdAt: trophy.createdAt,
            dimension: generationConditions.dimension || 0,
            color: generationConditions.color || '',
            shape: generationConditions.shape || '',
            tubularSegments: generationConditions.tubularSegments || 0,
            tubeWidth: generationConditions.tubeWidth || 0,
          };
        });

        setUserTrophyData(parsedTrophyData);
        console.log(userTrophyData, parsedTrophyData)
      }
    } catch (error) {
      console.error('Error fetching user trophy data:', error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setIsDragging(true);
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (!isDragging) return;
  
    const mouseDeltaX = e.clientX - prevMouseX;
    const mouseDeltaY = e.clientY - prevMouseY;
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);
  
    if (trophyRefs.current[index]?.rotation) {
      trophyRefs.current[index]!.rotation.y += mouseDeltaX * 0.01; // Rotate around Y-axis
      trophyRefs.current[index]!.rotation.x += mouseDeltaY * 0.01; // Rotate around X-axis
    }
  };
  

  const togglePropsView = () => {
    setShowProps(!showProps);
  };

  const toggleTrophies = () => {
    setShowTrophies(!showTrophies);
  };

  const handleClick = () => {
    toggleTrophies();
  };

  useEffect(() => {
    if (showTrophies && userTrophyData.length === 0) {
      fetchUserTrophyData();
    }
  }, [showTrophies]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserTrophyData();
  }, []);

  return (
    <div >
      <h1>Recent Trophies </h1>
      <button onClick={handleClick}>
        {showTrophies ? 'X' : 'See Trophies'}
      </button>
      <button
        onClick={togglePropsView}
        style={{ display: showTrophies ? 'block' : 'none' }}
      >
        {showProps ? 'X' : 'Trophy Details'}
      </button>

      {showTrophies &&
        userTrophyData
          .slice(0)
          .reverse()
          .map((trophy, index) => (
            <div key={index}>
              <div onMouseDown={(e) => handleMouseDown(e, index)}
                onMouseUp={handleMouseUp}
                onMouseMove={(e) => handleMouseMove(e, index)}>
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  {trophy.shape === 'box' && (
                    <Box
                      ref={(ref) => (trophyRefs.current[index] = ref)}
                      args={[
                        trophy.dimension,
                        trophy.dimension,
                        trophy.dimension,
                      ]}
                      position={[0, 0, 0]}
                      rotation={[0, 0.4, 0]}
                    >
                      <meshStandardMaterial
                        attach='material'
                        color={trophy.color}
                      />
                    </Box>
                  )}
                  {trophy.shape === 'polyhedron' && (
                    <Dodecahedron
                    ref={(ref) => (trophyRefs.current[index] = ref)}
                      args={[trophy.dimension, 0]}
                      position={[0, 0, 0]}
                      rotation={[0, 0.4, 0]}
                    >
                      <meshStandardMaterial
                        attach='material'
                        color={trophy.color}
                      />
                    </Dodecahedron>
                  )}
                  {trophy.shape === 'torus' && (
                    <Torus
                    ref={(ref) => (trophyRefs.current[index] = ref)}
                      args={[
                        trophy.dimension,
                        trophy.tubeWidth,
                        16,
                        trophy.tubularSegments,
                      ]}
                      position={[0, 0, 0]}
                      rotation={[0, 0.4, 0]}
                    >
                      <meshStandardMaterial
                        attach='material'
                        color={trophy.color}
                      />
                    </Torus>
                  )}
                </Canvas>
              </div>
              <div>
                {showProps && (
                  <>
                    <h6>Name: {trophy.name}</h6>
                    <p>Description: {trophy.description}</p>
                    <p>Earned at: {trophy.createdAt}</p>
                    <h6>Class: {trophy.shape}</h6>
                    <h6>Size: {trophy.dimension}</h6>
                    <h6>Color: {trophy.color}</h6>
                  </>
                )}
              </div>
            </div>
          ))}
    </div>
  );
};

export default SavedTrophy;
