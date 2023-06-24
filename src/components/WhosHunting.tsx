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
    // console.log(games);
  }, [games, SetHunted, users]);

  if (!games || games.length === 0) {
    return <div>Loading Lobby</div>;
  }

  const game = games[0];

  if (!game.hunted || game.hunted.length === 0) {
    if (user?.sub === game.host) {
      return (
        <div>
          <button onClick={() => pickVictim(users, SetHunted)}>Who's Being Hunted?</button>
        </div>
      );
    } else {
      return <div>Victim Has Not Been Selected</div>;
    }
  }

  return (
    <div>
      <div>Player {game.hunted}, You're Being Hunted</div>
      {user?.sub === game.host && (
        <button onClick={() => pickVictim(users, SetHunted)}>Pick Again</button>
      )}
    </div>
  );
};

export default WhosHunting;
