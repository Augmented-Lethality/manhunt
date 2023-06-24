import React, { useContext, useEffect } from 'react';
import SocketContext, { User } from '../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';

const pickVictim = (users: User[], SetHunted: (user: User) => void) => {
  const victim = users[Math.floor(Math.random() * users.length)];
  SetHunted(victim);
};

const WhosHunting: React.FunctionComponent = () => {
  const { user } = useAuth0();

  const { SetHunted } = useContext(SocketContext);
  const { users, games } = useContext(SocketContext).SocketState;

  useEffect(() => {

  }, [games, SetHunted, users]);

  return (
    <div>
      {games.length > 0 && games[0].hunted.length > 0 ? (
        <div>
          <div>Player {games[0].hunted}, You're Being Hunted</div>
          {user?.sub === games[0].host ? <button onClick={() => pickVictim(users, SetHunted)}>Pick Again</button>
            : <></>
          }
        </div>
      ) : (
        <>
          {user?.sub === games[0].host ? <button onClick={() => pickVictim(users, SetHunted)}>Who's Being Hunted?</button>
            : <div>Victim Has Not Been Selected</div>
          }
        </>
      )}
    </div>
  );
};

export default WhosHunting;
