import React, { useContext, useEffect, useState, } from 'react';
import { useLocation } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import WhosHunting from '../components/WhosHunting';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import UserListItem from '../components/UserListItem';
import UsersList from '../components/UsersList';
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
  height: 100px;
  border-radius: 10px;
  justify-content: space-evenly;
`;

const GameLobby: React.FC<{}> = () => {
  const { isAuthenticated } = useAuth0();
  const { games, users } = useContext(SocketContext).SocketState;
  // const { Redirect } = useContext(SocketContext);
  const [showLobby, setShowLobby] = useState(false);
  const [bountyName, setBountyName] = useState<string | null>(null)

  // checks to see if the user should be redirected if the game doesn't exist
  const location = useLocation();
  const currentEndpoint = location.pathname;
  // useEffect(() => {
  //   Redirect(currentEndpoint);
  // }, [games]);


  useEffect(() => {
    if (games.length > 0 && users.length > 0) {
      setShowLobby(true);
    } else {
      setShowLobby(false);
    }
  }, [games, users]);


  if (!isAuthenticated) {
    return null
  }

  if (!showLobby) {
    return <PageLoader />
  }

  // if(bountyName) {
  //   return <h2>{bountyName} is being Hunted</h2>
  // }

  return (
    <Container>
      <Header page='Lobby' />
      <Main>
        <ControlsContainer>
          <WhosHunting setBountyName={setBountyName}/>
          <HostControls />
        </ControlsContainer>
        <PlayersContainer>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Players • {users.length}</h1>
          <UserListItem player={users[0]} />
          <UsersList users={users.slice(1)} />
        </PlayersContainer>
        <br />
      </Main>
    </Container>
  );
};

export default GameLobby;
