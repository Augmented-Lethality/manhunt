import React, { useContext, useEffect, useState } from 'react';
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

  const [huntedName, setHuntedName] = useState('');

  useEffect(() => {
    // console.log(games);
    if (games[0].hunted.length > 0 && users) {
      const matchingUser = users.filter(user => user.authId === games[0].hunted);
      setHuntedName(matchingUser[0].username)
    }
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
      <div>{huntedName}, You're Being Hunted</div>
      {user?.sub === game.host && (
        <button onClick={() => pickVictim(users, SetHunted)}>Pick Again</button>
      )}
    </div>
  );
};

export default WhosHunting;
