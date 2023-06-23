import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
// import { useAuth0 } from "@auth0/auth0-react";
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';

const GameLobby: React.FunctionComponent = (props) => {

  const { games, users } = useContext(SocketContext).SocketState;
  const [hunted, setHunted] = useState<string>('');

  useEffect(() => {
    // console.log("games state should be one game:", games, "users state should be only users in that one game", users)
  }, [games])


  // HUNTED IS NOT SET UP
  return (
    <Container>
      <Header>
        <h2>Game Lobby</h2>
        <ButtonToHome />
      </Header>
      <Main>
        {users.length > 0 ? (
          <>
            <strong>Players in Lobby:</strong>
            {hunted.length > 0 ? (<div>Player {hunted}, You're Being Hunted</div>) : (<WhosHunting setHunted={setHunted} hunted={hunted} />)}
            <br />
            <br />
            {users.map((player) => (
              <PlayerListItem key={player.id} player={player} />
            ))}
          </>
        ) : (
          <p>No Players</p>
        )}
        <ButtonToGame />
      </Main>
    </Container>
  );
};

export default GameLobby;
