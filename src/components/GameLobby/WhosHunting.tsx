import React, { useContext, useEffect, useState } from 'react';
import SocketContext, { User } from '../../contexts/Socket/SocketContext';
import styled from 'styled-components';

const StartContainer = styled.div`
  color: black;
  font-weight: 600;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 13px;
  border-radius: 10px;
`

interface WhosHuntingProps {
  setBountyName: React.Dispatch<React.SetStateAction<string | null>>;
}

const WhosHunting: React.FunctionComponent<WhosHuntingProps> = ({ setBountyName }) => {
  const { users, ready } = useContext(SocketContext).SocketState;
  const { SetHunted } = useContext(SocketContext);
  const [hasReadyErrors, setHasReadyErrors] = useState(false);

  // if any of the ready objects don't have a value of 'ok', can't start the game
  // useEffect(() => {
  //   const hasErrors = Object.values(ready).some((errors: string[]) => !errors.includes('ok'));
  //   setHasReadyErrors(hasErrors);
  // }, [ready]);

  const pickVictim = (users: User[], SetHunted: (user: User) => void) => {
    //Chose a random victim from the players
    const bounty = users[Math.floor(Math.random() * users.length)];
    //Set the socket context to include the bounty
    SetHunted(bounty);
    //Grab the bounty's username to display to the players
    const matchingUser = users.filter(player => player.authId === bounty.authId).at(0)?.username || null;
    setBountyName(matchingUser)
  };


  return (
    <StartContainer>
      <>
        <h3 className='button-label'>Start</h3>
        <button
          onClick={() => pickVictim(users, SetHunted)}
          className='metal-button'>⏻</button>
      </>

    </StartContainer>
  )

  // return (
  //   <StartContainer>
  //     { !hasReadyErrors ? (
  //     <>
  //       <h3 className='button-label'>Start</h3>
  //       <button
  //         onClick={() => pickVictim(users, SetHunted)}
  //         className='metal-button'>⏻</button>
  //     </>
  //     ) : (
  //       <>
  //         <span className='button-label'>Waiting on Players</span>
  //         <button style={{maxWidth:'200px'}}/>
  //       </>
  //     )}
  //   </StartContainer>
  // )
};

export default WhosHunting;
