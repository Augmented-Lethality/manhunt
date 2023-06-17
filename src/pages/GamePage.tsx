import React, { useState, useContext, useEffect } from 'react';
import { BoxGeometry, Mesh, MeshBasicMaterial } from '../components/webcam';
import SocketContext from '../contexts/Socket/SocketContext';

import { ButtonToHome } from '../components/Buttons'


// import KillMode from '../components/KillMode';
import ChaseCam from '../components/ChaseCam';

import KillCam from '../components/KillCam';

// creating the marker to be used for all players
const geom = new BoxGeometry(20, 20, 20);
const mtl = new MeshBasicMaterial({ color: 0xff0000 });
const marker: Mesh<BoxGeometry, MeshBasicMaterial> = new Mesh(geom, mtl);


const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');

  const { socket, uid, users, games } = useContext(SocketContext).SocketState;

  const [userGame, setUserGame] = useState<{ gameId: string; uidList: string[] }>({ gameId: '', uidList: [] });
  const [markerBlueprint, setMarkerBlueprint] = useState<Mesh<BoxGeometry, MeshBasicMaterial>>(marker);
  const [markers, setMarkers] = useState<Array<Mesh<BoxGeometry, MeshBasicMaterial>>>([]);


  useEffect(() => {
    const foundUserGame = Object.values(games).find((game) => game.uidList.includes(uid));
    setUserGame(foundUserGame || { gameId: '', uidList: [] });
  }, [games, uid]);



  // when the page is mounted, create all of the markers
  useEffect(() => {
    const newMarkers: Array<Mesh<BoxGeometry, MeshBasicMaterial>> = [];
    for (let i = 0; i < userGame.uidList.length; i++) {
      newMarkers.push(marker);
    }
    setMarkers(newMarkers);

    console.log(newMarkers.length)
  }, [userGame]);

  const handleGameChange = () => {
    if(gameMode === 'Chase') {
      setGameMode('Kill')
    }
  }

  return (
    <div>
      <ButtonToHome />
      <p>Players in this game:</p>
    <ul>
      {userGame?.uidList.map((playerUid) => (
        <li key={playerUid}>{playerUid}</li>
      ))}
    </ul>
    <button onClick={ handleGameChange }>Go in For the Kill</button>
      {gameMode === 'Chase' && markers.length !== 0 && <ChaseCam markerBlueprint={markerBlueprint} />}
      {gameMode === 'Kill' && markers.length !== 0 && <KillCam />}
    </div>
  );
}

export default GamePage;
