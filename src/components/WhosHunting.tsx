import React, { useContext, useEffect, useState } from 'react';
import { User } from '../contexts/Socket/SocketContext';
export interface IWhosHuntingProps {
  // host: string
  // hunted: string
  players: any
  // users: User[]
  setHunted: (victim: string) => void
}

import SocketContext from '../contexts/Socket/SocketContext';


const WhosHunting: React.FunctionComponent<IWhosHuntingProps> = (props) => {

  const { players, setHunted } = props;

  useEffect(() => {
    // console.log(players[0])
  }, [])

  // // randomly pick a user
  // const pickVictim = () => {
  //   const victim = players[0].users[Math.floor(Math.random() * players.length)];
  //   setHunted(victim);

  // }

  return (
    <div>
      {/* <button onClick={pickVictim}>Who's Being Hunted?</button> */}
    </div>
  );

};

export default WhosHunting;
