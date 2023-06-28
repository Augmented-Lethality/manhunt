import React, { useEffect } from 'react';

import { User } from '../../contexts/Socket/SocketContext';

import AccessReady from './AccessReady';


export const PlayerListItem: React.FC<{ player: User }> = ({ player }) => {

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <AccessReady username={player.username} />
      <br />
    </div>
  )
};
