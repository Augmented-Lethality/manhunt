import React, { useContext, useEffect } from 'react';
import SocketContext, { User } from '../contexts/Socket/SocketContext';

const pickVictim = (users: User[], SetHunted: (user: User) => void) => {
  const victim = users[Math.floor(Math.random() * users.length)];
  SetHunted(victim);
};

const WhosHunting: React.FunctionComponent = () => {
  const { SetHunted } = useContext(SocketContext);
  const { users, games } = useContext(SocketContext).SocketState;

  // useEffect(() => {
  //   if (games.length > 0 && games[0].hunted.length === 0) {
  //     pickVictim(users, SetHunted);
  //   }
  // }, [games, SetHunted, users]);

  return (
    <div>
      {games.length > 0 && games[0].hunted.length > 0 ? (
        <div>
          <div>Player {games[0].hunted}, You're Being Hunted</div>
          <button onClick={() => pickVictim(users, SetHunted)}>Pick Again</button>
        </div>
      ) : (
        <button onClick={() => pickVictim(users, SetHunted)}>Who's Being Hunted?</button>
      )}
    </div>
  );
};

export default WhosHunting;
