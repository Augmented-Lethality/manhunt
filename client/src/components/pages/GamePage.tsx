import React, { useState, useContext, useEffect } from 'react';
import { BoxGeometry, Mesh, MeshBasicMaterial } from '../webcam';

import KillMode from '../KillMode';
import ChaseCam from '../ChaseCam';

// creating the marker to be used for all players
const geom = new BoxGeometry(20, 20, 20);
const mtl = new MeshBasicMaterial({ color: 0xff0000 });
const marker: Mesh<BoxGeometry, MeshBasicMaterial> = new Mesh(geom, mtl);


const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');

  // creating the markers based on the number of users in the game lobby
  const [hardcodeUidList, setHardCode] = useState<string[]>(['1', '2', '3']);
  const [markers, setMarkers] = useState<Array<Mesh<BoxGeometry, MeshBasicMaterial>>>([]);

  // when the page is mounted, create all of the markers
  useEffect(() => {
    const newMarkers: Array<Mesh<BoxGeometry, MeshBasicMaterial>> = [];
    for (let i = 0; i < hardcodeUidList.length; i++) {
      newMarkers.push(marker);
    }
    setMarkers(newMarkers);
  }, [hardcodeUidList]);

  return (
    <div>
      {gameMode === 'Chase' && <ChaseCam markers={ markers }/>}
      {gameMode === 'Kill' && <KillMode />}
    </div>
  );
}

export default GamePage;
