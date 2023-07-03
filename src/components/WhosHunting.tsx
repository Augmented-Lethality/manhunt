import React, { useContext, useEffect, useState } from 'react';
import SocketContext, { User } from '../contexts/Socket/SocketContext';

interface WhosHuntingProps {
  setBountyName: React.Dispatch<React.SetStateAction<string | null>>;
}

const WhosHunting: React.FunctionComponent<WhosHuntingProps> = ({setBountyName}) => {
  const { users, ready } = useContext(SocketContext).SocketState;
  const { SetHunted } = useContext(SocketContext);
  const [hasReadyErrors, setHasReadyErrors] = useState(false);

  // if any of the ready objects don't have a value of 'ok', can't start the game
  useEffect(() => {
    const hasErrors = Object.values(ready).some((errors: string[]) => !errors.includes('ok'));
    setHasReadyErrors(hasErrors);
  }, [ready]);

  const pickVictim = (users: User[], SetHunted: (user: User) => void) => {
    //Chose a random victim from the players
    const bounty = users[Math.floor(Math.random() * users.length)];
    //Set the socket context to include the bounty
    SetHunted(bounty);
    //Grab the bounty's username to display to the players
    const matchingUser = users.filter(player => player.authId === bounty.authId).at(0)?.username || null;
    setBountyName(matchingUser)
  };

  // if (!games || games.length === 0) {
  //   return <div>Loading Lobby</div>;
  // }

  //dont render the start button until the players are all ready
  return (
    !hasReadyErrors
    ? <button
        onClick={() => pickVictim(users, SetHunted)}
        style={{maxWidth:'200px'}}>Start
      </button>
    : <button style={{maxWidth:'200px'}}>Waiting on Players</button>
  )
};

export default WhosHunting;
