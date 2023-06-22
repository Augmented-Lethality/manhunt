import React from 'react';
import { Game } from '../../contexts/Socket/SocketContext';



export const GameListItem: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <div>
      <strong>Host: {game.hostName}</strong>
      {/* <strong>Number of Players: {game.users.length}</strong> */}
    </div>
  );
};