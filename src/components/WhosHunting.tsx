import React, { useContext, useEffect, useState } from 'react';
import { User } from '../contexts/Socket/SocketContext';

export interface IWhosHuntingProps {
  hunted: string;
  setHunted: (victim: string) => void;
}

import SocketContext from '../contexts/Socket/SocketContext';


const WhosHunting: React.FunctionComponent<IWhosHuntingProps> = (props) => {

  const { users } = useContext(SocketContext).SocketState;
  const { setHunted, hunted } = props;

  useEffect(() => {
    // console.log(users)
  }, [])

  // randomly pick a user
  const pickVictim = () => {
    const victim = users[Math.floor(Math.random() * users.length)];
    setHunted(victim.username);
  }

  return (
    <div>
      {hunted.length > 0 ? (<></>) : <button onClick={pickVictim}>Who's Being Hunted?</button>}
    </div>
  );

};

export default WhosHunting;
