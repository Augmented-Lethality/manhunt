import React, { useEffect } from 'react';
import { Game } from '../../contexts/Socket/SocketContext';



export const GameListItem: React.FC<{ game: Game }> = ({ game }) => {

  useEffect(() => {
    console.log(game)
  }, [])
  return (
    <div>
      <strong>Host: {game[0].hostName}</strong>
      <br />
      <strong>Number of Players: {game[0].users.length}</strong>
    </div>
  );
};