import React, {useState, useEffect} from "react";
import axios from "axios";
import { UserData } from "./TrophyGenerator";
import { TrophyData } from "./SavedTrophies";
import { Box, Dodecahedron, Torus } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

interface SingleTrophy {
  user: UserData
}

const SingleTrophy: React.FC<SingleTrophy> = ({user}) => {
  const [trophyData, setTrophyData] = useState<TrophyData | null>(null);
  
  useEffect(()=> {
    fetchUserTrophyData
  }, [])

  // fetch, parse and set the trophy data
  const fetchUserTrophyData = async () => {
    try {
      if (user) {
        const response = await axios.get(`/trophies/${user.id}`)
        setTrophyData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user trophy data:', error);
    }
  };

  return(
    <div key={index}>
      <div
        onMouseDown={(e) => handleMouseDown(e, index)}
        onMouseUp={handleMouseUp}
        onMouseMove={(e) => handleMouseMove(e, index)}
      >
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
            <h6>Designation: {trophy.name}</h6>
            <h6>Report: {trophy.description}</h6>
            <h6>Class: {trophy.shape}</h6>
            <h6>Magnitude: {trophy.dimension}</h6>
            <h6>Chroma: {getColorName(trophy.color)}</h6>
            <h6>Earned on: {trophy.createdAt}</h6>
          </>
        )}
      </div>
    </div>
  )
}

export default SingleTrophy;