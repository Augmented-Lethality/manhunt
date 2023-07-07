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

const SingleTrophy: React.FC<TrophyData> = () => {
  const trophyRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userTrophyData, setUserTrophyData] = useState<TrophyData[]>([]);
  const [showProps, setShowProps] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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

    // fetch, parse and set the trophy data
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

          //To make the date more readable
          const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
          const [, year, month, day] = dateRegex.exec(trophy.createdAt) || [];
          function getMonthName(month: string) {
            const monthNames = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];

            const monthIndex = parseInt(month, 10) - 1;
            return monthNames[monthIndex];
          }

          return {
            id: trophy.id,
            name: trophy.name,
            description: trophy.description,
            createdAt: `${day} ${getMonthName(month)} ${year}`,
            dimension: generationConditions.dimension || 0,
            color: generationConditions.color || '',
            shape: generationConditions.shape || '',
            tubularSegments: generationConditions.tubularSegments || 0,
            tubeWidth: generationConditions.tubeWidth || 0,
          };
        });

        setUserTrophyData(parsedTrophyData);
      }
    } catch (error) {
      console.error('Error fetching user trophy data:', error);
    }
  };


  const getColorName = (colorCode) => {
    // Map color codes to more fitting color names
    const colorMap = {
      '#3d6cb8': 'Cerulean',
      '#19191a': 'Void',
      lightgreen: 'Radioactive',
      orange: 'Gold',
      darkred: 'Crimson',
      yellow: 'Saffron',
      pink: 'Rose',
      aquamarine: 'Aquamarine',
      // Add color mappings as needed
    };
    // Return color name if exists in color map, otherwise return original
    return colorMap[colorCode] || colorCode;
  };

  const rotateTrophies = () => {
    trophyRefs.current.forEach((trophy) => {
      if (trophy) {
        if (!trophy.userData.initialRotationSet) {
          // Set initial rotation values
          trophy.userData.initialRotationSet = true;
          trophy.userData.rotationSpeed = Math.random() * 0.004; // Random speed between 0 and 0.01
          trophy.userData.rotationDirection = Math.random() < 0.5 ? -1 : 1; // Random direction: -1 or 1
          trophy.userData.rotationAxis = getRandomRotationAxis(); // Random rotation axis: 'x', 'y', or 'z'
        }
        const { rotationSpeed, rotationDirection, rotationAxis } =
          trophy.userData;
        trophy.rotation[rotationAxis] += rotationSpeed * rotationDirection; // Adjust rotation speed and direction around the chosen axis
      }
    });
  };

  const getRandomRotationAxis = () => {
    const axes = ['x', 'y', 'z'];
    return axes[Math.floor(Math.random() * axes.length)];
  };

  const onFrame = () => {
    rotateTrophies();
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
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

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchUserData().then(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setIsLoading(true);
    fetchUserTrophyData()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user trophy data:', error);
        setIsLoading(false);
      });
  }, [userData]);
  

  
  const trophiesToDisplay = userTrophyData.length > 0 ? [userTrophyData[0]] : [];
 

  return (
    <div >
      {trophiesToDisplay
        .slice(0)
        .reverse()
        .map((trophy, index) => (
          <div key={index}>
            <div
              onMouseDown={(e) => handleMouseDown(e, index)}
              onMouseUp={handleMouseUp}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              <Canvas onCreated={({ gl }) => gl.setAnimationLoop(onFrame)}>
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
          </div>
        ))}
      <div>
      </div>
    </div>
  );
};
export default SingleTrophy;
