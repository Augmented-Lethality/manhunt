import React, { useEffect } from 'react';

import { User } from '../../contexts/Socket/SocketContext';


export const PlayerListItem: React.FC<{ player: User }> = ({ player }) => {

  useEffect(() => {
    // console.log('player:', player)
  })

  return (
    <div>
      <strong>Player: {player.username}</strong>
      <br />
      <strong>Games Won: {player.gamesWon}</strong>
      <br />
    </div>
  );
};
