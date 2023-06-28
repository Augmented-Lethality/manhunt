import React, { useEffect } from 'react';

import { User } from '../../contexts/Socket/SocketContext';

import AccessReady from './AccessReady';


export const PlayerListItem: React.FC<{ player: User }> = ({ player }) => {

  useEffect(() => {
    // console.log('player:', player)
  })

  return (
    <div>
      <strong>Player: {player.username}</strong>
      <AccessReady />
      <br />
    </div>
  );
};
