import React, { useContext } from 'react';
import SocketContext, { User } from '../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';

interface WhosHuntingProps {
  setBountyName: React.Dispatch<React.SetStateAction<string | null>>
}

const WhosHunting: React.FunctionComponent<WhosHuntingProps> = ({setBountyName}) => {
  const { user } = useAuth0();
  const { SetHunted } = useContext(SocketContext);
  const { users, games } = useContext(SocketContext).SocketState;
  const game = games[0];

  const pickVictim = (users: User[], SetHunted: (user: User) => void) => {
    //Chose a random victim from the players
    const bounty = users[Math.floor(Math.random() * users.length)];
    //Set the socket context to include the bounty
    SetHunted(bounty);
    //Grab the bounty's username to display to the players
    const matchingUser = users.filter(user => user.authId === games[0].hunted);
    setBountyName(matchingUser[0].username)
  };

  if (!games || games.length === 0) {
    return <div>Loading Lobby</div>;
  }

  return (
    user?.sub === game?.host
    ? <button
        onClick={() => pickVictim(users, SetHunted)}
        style={{maxWidth:'200px'}}>Start
      </button>
    : <button style={{flexGrow: 2}}>Waiting on Host</button>
  )
};

export default WhosHunting;
