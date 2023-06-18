import React, { useContext, useEffect, useState } from 'react';

export interface IWhosHuntingProps {
  users: string[]
  host: string
  hunted: string
}

import SocketContext from '../contexts/Socket/SocketContext';


const WhosHunting: React.FunctionComponent<IWhosHuntingProps> = (props) => {
  const { SetHunted } = useContext(SocketContext);
  const { names } = useContext(SocketContext).SocketState;


  const { users, host, hunted } = props;

  // randomly pick a user
  useEffect(() => {

    const victim = users[Math.floor(Math.random() * users.length)];
    SetHunted(host, victim);


  }, [hunted])

  return (
    <div>
      {hunted.length > 0 && <p>{names[hunted]}, you're being hunted.</p>}
    </div>
  );

};

export default WhosHunting;
