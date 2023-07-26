import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import InfoPopup from '../Popups/InfoPopup';
import styled from 'styled-components';

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  height: 100vh;
  color: transparent;
  text-shadow: 0 0 4px black;
`;


export type TrophyData = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  dimension: number;
  dimensionTwo: number;
  dimensionThree: number;
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

const SavedTrophies: React.FC<TrophyData> = () => {
  const trophyRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userTrophyData, setUserTrophyData] = useState<TrophyData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoaded, setHasLoaded] = useState(false);

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
            dimensionTwo: generationConditions.dimensionTwo || 0,
            dimensionThree: generationConditions.dimensionThree || 0,
            color: generationConditions.color || '',
            shape: generationConditions.shape || '',
            tubularSegments: generationConditions.tubularSegments || 0,
            tubeWidth: generationConditions.tubeWidth || 0,
          };
        });

        setUserTrophyData(parsedTrophyData);
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching user trophy data:', error);
      setHasLoaded(true);
    }
  };

  const getColorName = (colorCode) => {
    // Map color codes to more fitting color names
    const colorMap = {
      '#3d6cb8': 'Cerulean',
      '#202021': 'Void',
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
    const getRandomRotationAxis = () => {
      const axes = ['x', 'y', 'z'];
      return axes[Math.floor(Math.random() * axes.length)];
    };

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserTrophyData().catch((error) => {
      console.error('Error fetching user trophy data:', error);
    });
  }, [userData]);

  const trophiesPerPage = 9;
  const startIndex = (currentPage - 1) * trophiesPerPage;
  const endIndex = startIndex + trophiesPerPage;
  const trophiesToDisplay = userTrophyData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(userTrophyData.length / trophiesPerPage);

  const infoMessage = 'Oooh, shiny!\n\nEarn trophies when you win games.';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hasLoaded === false ? (
        <LoadingMessage>
          <h2>LOADING...</h2>
        </LoadingMessage>
      ) : (
        <div>
          {trophiesToDisplay.length === 0 ? (
            <div
              className='glassmorphism'
              style={{
                fontWeight: 'bold',
                borderRadius: '1em',
                padding: '1em',
                width: '100%',
                textAlign: 'center',
                marginTop: '1em',
              }}
            >
              <h3>No Trophies?!?</h3>
              <h3>Get Out There and Hunt!</h3>
              <iframe
                src='https://giphy.com/embed/v3mSElAsyJSqA'
                width='250'
                height='250'
                frameBorder='0'
                allowFullScreen
              ></iframe>
              <InfoPopup message={infoMessage} />
            </div>
          ) : (
            trophiesToDisplay
              .slice(0)
              .reverse()
              .map((trophy, index) => (
                <div key={index}>
                  <div
                    className='glassmorphism'
                    onMouseDown={(e) => handleMouseDown(e, index)}
                    onMouseUp={handleMouseUp}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    style={{
                      marginTop: '2em',
                      borderRadius: '1em',
                      padding: '1em',
                      width: '100%',
                    }}
                  >
                    <Canvas
                      onCreated={({ gl }) => gl.setAnimationLoop(onFrame)}
                    >
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      {trophy.shape === 'box' && (
                        <Box
                          ref={(ref) => (trophyRefs.current[index] = ref)}
                          args={[
                            trophy.dimension,
                            trophy.dimensionTwo,
                            trophy.dimensionThree,
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

                    <details style={{ textAlign: 'left' }}>
                      <summary
                        style={{ textAlign: 'right', marginInline: '0px' }}
                      >
                        Details
                      </summary>
                      <div style={{ fontSize: '0.75em', padding: '1em' }}>
                        <div>
                          <strong>Designation:</strong> {trophy.name}
                        </div>
                        <div>
                          <strong>Report:</strong> {trophy.description}
                        </div>
                        <div>
                          <strong>Class:</strong> {trophy.shape}
                        </div>
                        <div>
                          <strong>Magnitude:</strong> {trophy.dimension}
                        </div>
                        <div>
                          <strong>Chroma:</strong> {getColorName(trophy.color)}
                        </div>
                        <div>
                          <strong>Earned on:</strong> {trophy.createdAt}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              ))
          )}

          <div
            style={{
              display: 'flex',
              alignSelf: 'center',
              position: 'sticky',
              bottom: 1,
            }}
          >
            <div style={{marginRight: '2em'}}>
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    width: '70%',
                    marginLeft: '0',
                  }}
                >
                  <div></div>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
              {totalPages > 1 && (
                <span
                  style={{
                    display: 'flex',
                  }}
                >
                  Page {currentPage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedTrophies;
