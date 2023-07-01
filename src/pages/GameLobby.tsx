import React, { useContext, useEffect, useState, } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import WhosHunting from '../components/WhosHunting';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import UserListItem from '../components/UserListItem';
import UsersList from '../components/UsersList';
import CheckAccess from '../components/GameLobby/CheckAccess';
import { useAuth0 } from '@auth0/auth0-react';
import HostControls from '../components/GameLobby/HostControls';
import PageLoader from '../components/Loading';
import styled from 'styled-components';

const PlayersContainer = styled.div`
  background-color: #2E303C;
  padding: 20px;
  margin-inline: 20px;
  flex-grow: 1;
  border-radius: 10px;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  //margin-inline: 20px;
  background-color: #2E303C;
  padding: 10px;
  height: 60px;
  border-radius: 10px;
`;

const GameLobby: React.FC<{}> = () => {
  const { isAuthenticated } = useAuth0();
  const { games, users } = useContext(SocketContext).SocketState;
  const [showLobby, setShowLobby] = useState(false);

  useEffect(() => {
    if (games.length > 0 && users.length > 0) {
      setShowLobby(true);
    } else {
      setShowLobby(false);
    }
    console.log('games', games, '\nusers', users)
  }, [games, users]);


  if (!isAuthenticated) {
    return null
  }

  if (!showLobby) {
    return <PageLoader />
  }

  return (
    <Container>
      <Header page='Lobby' />
      <Main>
        <ControlsContainer>
          <WhosHunting />
          <HostControls />
          <CheckAccess />
        </ControlsContainer>
        <PlayersContainer>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Players • {users.length}</h1>
          <UserListItem user={users[0]} />
          <UsersList users={users.slice(1)} />
          {/* <strong>Host: {games[0].hostName}</strong><br /> */}
          {/* <br /> */}
          {/* <strong>Players in Lobby:</strong><br /> */}

          {/* {users
            .map((player) => (
              <UserListItem key={player.id} user={player} />
            ))} */}

        </PlayersContainer>
        <br />
      </Main>
    </Container>
  );
};

export default GameLobby;
