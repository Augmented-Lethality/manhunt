import React, { useContext, useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';
import CheckAccess from '../components/GameLobby/CheckAccess';

const GameLobby: React.FunctionComponent = () => {
  const { games, users } = useContext(SocketContext).SocketState;
  const [showLobby, setShowLobby] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (games.length > 0 && users.length > 0) {
      setShowLobby(true);
      redirectToGame();
    } else {
      setShowLobby(false);
    }
  }, [games, users]);

  const redirectToGame = () => {
    if (games[0].status === 'ongoing') {
      navigate('/onthehunt');
    }
  }

  return (
    <Container>
      <Header page='Lobby' />
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
        <br />
        <CheckAccess />
      </Main>
    </Container>
  );
};

export default GameLobby;
