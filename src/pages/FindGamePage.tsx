import React, { useContext, useEffect } from 'react';
// import GameLobby from './GameLobby';

import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome } from '../components/Buttons';
import { GameListItem } from '../components/GameLobby/GameListItem';


const FindGamePage: React.FC = () => {
  const { games, users } = useContext(SocketContext).SocketState;

  useEffect(() => {
  }, [users, games]);


  return (
    <div>
      <h1>Users Not in Game: {users.length}</h1>
      {Object.keys(games).length > 0 ? (
        <>
          <strong>Available Games:</strong>
          {games.map((game) => (
            <GameListItem key={game.gameId} game={game} />
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
