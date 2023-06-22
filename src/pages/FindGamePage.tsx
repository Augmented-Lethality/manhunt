import React, { useEffect, useState, useContext } from 'react';
// import GameLobby from './GameLobby';

import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome } from '../components/Buttons';

import { GameListItem } from '../components/GameLobby/GameListItem';


const FindGamePage: React.FC = () => {

  const { games } = useContext(SocketContext).SocketState;

  // useEffect(() => {
  //   console.log(games)
  // }, [games])

  return (
    <div>
      {Object.keys(games).length > 0 ? (
        <>
          <strong>Available Games:</strong>
          {games.map((game) => (
            <GameListItem game={game} />
          ))}
        </>
      ) : (
        <p>No game lobbies available</p>
      )}
      <ButtonToHome />
    </div>
  );
}

export default FindGamePage;
