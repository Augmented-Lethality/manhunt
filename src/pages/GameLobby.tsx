import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';

const GameLobby: React.FunctionComponent = () => {
  const { user } = useAuth0();
  const { games, users } = useContext(SocketContext).SocketState;
  const [showLobby, setShowLobby] = useState(false);

  useEffect(() => {
    if (games.length > 0 && users.length > 0) {
      setShowLobby(true);
    } else {
      setShowLobby(false);
    }
  }, [games, users]);

  return (
    <Container>
      <Header>
        <h2>Game Lobby</h2>
        <ButtonToHome />
      </Header>
      <Main>
        {showLobby ? (
          <>
            <WhosHunting />
            <br />
            {users.map((player) => (
              <PlayerListItem key={player.id} player={player} />
            ))}
            {games.length > 0 && games[0].hunted.length > 0 && <ButtonToGame />}
          </>
        ) : (
          <p>No Players</p>
        )}
      </Main>
    </Container>
  );
};

export default GameLobby;
