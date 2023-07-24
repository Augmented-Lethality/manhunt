import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import NoTrophyInfoPopup from '../Popups/NoTrophyInfoPopup';
import TrophyInfoPopup from '../Popups/TrophyInfoPopup';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  height: 100vh;
  color: transparent;
  text-shadow: 0 0 4px black;
`;

const TrophyContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const GlassmorphismDiv = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 1em;
  padding: 1em;
  width: 100%;
  text-align: center;
  margin-top: 1em;
`;

const CanvasWrapper = styled.div`
  margin-top: 4em;
  border-radius: 1em;
  padding: 4em;
  width: 100%;
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

type ProfileData = {
  id: number;
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  image: string;
};


const OtherSavedTrophies: React.FC<TrophyData> = () => {
  const trophyRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { user, isAuthenticated } = useAuth0();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { username } = useParams();

  const [userTrophyData, setUserTrophyData] = useState<TrophyData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoaded, setHasLoaded] = useState(false);

  
  const infoMessage = 'Oooh, shiny!\n\nEarn trophies when you win games.';

  const calculateTrophyPosition = (index: number, totalTrophies: number) => {
    const angle = (2 * Math.PI * index) / totalTrophies;
    const radius = 5; // Adjust the radius as needed
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return [x, 0, z] as [number, number, number]; // Convert the array to Vector3
  };
 

  const fetchUserData = async () => {
    try {
      const res = await axios.get<ProfileData>(`/users/name/${username}`);
      setProfileData(res.data);
      setHasLoaded(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  // fetch, parse and set the trophy data
  const fetchUserTrophyData = async () => {
    try {
      if (profileData) {
        const response = await axios.get<
          {
            id: number;
            name: string;
            description: string;
            createdAt: string;
            generationConditions: string;
          }[]
        >(`/trophies/${profileData.id}`, {
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserTrophyData().catch((error) => {
      console.error('Error fetching user trophy data:', error);
    });
  }, [profileData]);


  return (
    <TrophyContainer>
      {hasLoaded === false ? (
        <LoadingMessage>
          <h2>LOADING...</h2>
        </LoadingMessage>
      ) : (
        <div>
          {userTrophyData.length === 0 ? (
            <GlassmorphismDiv>
              <h3>No Trophies?!?</h3>
              <h3>Must be a novice bounty hunter</h3>
              <iframe
                src='https://giphy.com/embed/v3mSElAsyJSqA'
                width='250'
                height='250'
                frameBorder='0'
                allowFullScreen
              ></iframe>
              <NoTrophyInfoPopup message={infoMessage} />
            </GlassmorphismDiv>
          ) : (
            <div>
              {userTrophyData.map((trophy, index) => (
                <div key={index}>
                  <CanvasWrapper>
                    <Canvas  camera={{ position: [0, 0, 15], fov: 50, up: [0, 0, 1], near: 0.1, far: 100 }}>
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
                          position={calculateTrophyPosition(index, userTrophyData.length)}
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
                          position={calculateTrophyPosition(index, userTrophyData.length)}
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
                          position={calculateTrophyPosition(index, userTrophyData.length)}
                          rotation={[0, 0.4, 0]}
                        >
                          <meshStandardMaterial
                            attach='material'
                            color={trophy.color}
                          />
                        </Torus>
                      )}
                    </Canvas>
                    <div>
                      <TrophyInfoPopup
                        message={`${trophy.name}
                        Report: ${trophy.description}
                        Class: ${trophy.shape}
                        Magnitude: ${trophy.dimension}
                        Chroma: ${trophy.color}
                        Earned On: ${trophy.createdAt}
                      `}
                      />
                    </div>
                  </CanvasWrapper>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </TrophyContainer>
  );
};

export default OtherSavedTrophies;
