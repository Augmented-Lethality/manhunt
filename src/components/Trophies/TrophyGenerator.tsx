import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';
import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';
import SocketContext, { Player } from '../../contexts/Socket/SocketContext';



const TrophyGenerator: React.FC = () => {
  const trophyRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  const [trophyName, setTrophyName] = useState('');
  const [trophyDescription, setTrophyDescription] = useState('');
  const { player } = useContext(SocketContext).SocketState;

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
    dimensionTwo: useMemo(() => getRandomElement([1, 2, 3]), []),
    dimensionThree: useMemo(() => getRandomElement([1, 2, 3]), []),
    color: useMemo(
      () =>
        getRandomElement([
          'darkred',
          'lightgreen',
          '#3d6cb8',
          'yellow',
          'orange',
          '#202021',
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
      `A token of recognition for exceptional espionage and cunning within The Corpoverse.`,
      `It's dangerous to go alone! Take this.`,
    ];
    const description = getRandomElement(descriptions);
    setTrophyDescription(description);
    return description;
  };

  const postTrophyData = async () => {
    try {
      if (player.authId && trophyName && trophyDescription) {
        await axios.post('/trophies', {
          name: trophyName,
          description: trophyDescription,
          generationConditions: JSON.stringify(trophyData),
          filePath: '',
          ownerId: player.id,
        });
      } else {
        console.log('player is not available');
      }
    } catch (error) {
      console.error('Error posting trophy data:', error);
    }
  };

  const rotateTrophy = () => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += 0.01; // Adjust rotation speed 
    }
  };

  const onFrame = () => {
    rotateTrophy();
  };

  useEffect(() => {
    generateRandomName();
    generateRandomDescription();
  }, []);

  useEffect(() => {
    if (player) {
      postTrophyData();
    }
  }, [trophyDescription, player]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="trophy-container"
    >
      <Canvas onCreated={({ gl }) => gl.setAnimationLoop(onFrame)}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {trophyData.shape === 'box' && (
          <Box
            ref={trophyRef}
            args={[
              trophyData.dimension,
              trophyData.dimensionTwo,
              trophyData.dimensionThree,
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
      {player && (
        <div>
          <h3 style={{ marginBottom: '2px', marginTop: '1em', marginRight: '3em', marginLeft: '3em' }}>{trophyName}</h3>
          <h4 style={{ marginBottom: '2px', marginTop: '1em', marginRight: '3em', marginLeft: '3em' }}>{trophyDescription}</h4>
        </div>
      )}
    </div>
  );
};

export default TrophyGenerator;
