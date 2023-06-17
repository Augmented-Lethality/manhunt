import React, { useContext, useEffect, useState } from 'react';

export interface IWhosHuntingProps {
  users: string[]
  host: string
}

import SocketContext from '../contexts/Socket/SocketContext';


const WhosHunting: React.FunctionComponent<IWhosHuntingProps> = (props) => {
  const { SetHunted } = useContext(SocketContext);
  const [victim, setVictim] = useState('');

  const { users, host } = props;

  // randomly pick a user
  useEffect(() => {

    const victim = users[Math.floor(Math.random() * users.length)];
    setVictim(victim);

    SetHunted(host, victim);


  }, [])

  return (
    <div>
      {victim && victim.length > 0 && <p>{victim}, you're being hunted.</p>}
    </div>
  );

};

export default WhosHunting;
