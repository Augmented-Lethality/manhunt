import React, { useContext, useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import WhosHunting from '../components/WhosHunting';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';
import CheckAccess from '../components/GameLobby/CheckAccess';
import { useAuth0 } from '@auth0/auth0-react';
import HostControls from '../components/GameLobby/HostControls';
import TimerInput from '../components/GameLobby/TimerInput';

const GameLobby: React.FunctionComponent = () => {
  const { user } = useAuth0();
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
    } else {
      // do nothing :)
    }
  }

  return (
    <Container>
      <Header page='Lobby' />
      <Main>
        {showLobby ? (
          <>
            <TimerInput />
            <strong>Host: {games[0].hostName}</strong><br />
            <WhosHunting />
            <br />
            <strong>Players in Lobby:</strong><br />
            {users
              .map((player) => (
                <PlayerListItem key={player.id} player={player} />
              ))}

          </>
        ) : (
          <p>No Players</p>
        )}
        <br />
        <HostControls />
        <CheckAccess />
      </Main>
    </Container>
  );
};

export default GameLobby;
