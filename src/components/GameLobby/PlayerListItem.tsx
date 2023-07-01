import React, { useEffect, useContext, useState } from 'react';
import { User } from '../../contexts/Socket/SocketContext';
import SocketContext from '../../contexts/Socket/SocketContext';
import AccessReady from './AccessReady';
import CheckAccess from './CheckAccess';


export const PlayerListItem: React.FC<{ player: User }> = ({ player }) => {
  const { ready } = useContext(SocketContext).SocketState;
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (ready[player.authId]) {
      setErrors(ready[player.authId]);
    }
  }, [ready, player.authId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CheckAccess />
      <AccessReady player={player} errors={errors} />
      <br />
    </div>
  );
};

