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
import PageLoader from '../components/Loading';
import styled from 'styled-components';
import { ButtonToGame } from '../styles/Buttons';
import TimerInput from '../components/GameLobby/TimerInput';

const PlayersContainer = styled.div`
  background: url(/textures/paper.png);
  background-size: cover;
  background-position: center;
  padding: 20px;
  margin-inline: 20px;
  margin-bottom: 0;
  flex-grow: 1;
  border-radius: 10px;
  box-shadow: 0 0 10px 10px #0000004d;
`;

const ControlsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 20px;
  padding: 10px;
  height: 100px;
  border-radius: 10px;
  justify-content: space-evenly;
  background-image: radial-gradient(circle at center, #595755 0.06rem, #000000 0.06rem);
  background-size: 0.21rem 0.25rem;
  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    box-shadow: 0 0 0 1.5px #ffffff54, 0 0 0 3px grey, 0.5px -0.5px 0 12px #00000069,
      0 0 0 12px #6f5454, 0 0 0 13.5px #0000004a, 0 0 0 15px grey, -13px 13px 10px 10px #0000004a;
  // box-shadow:
  //   0 0 0 1.5px #ffffff54,
  //   0 0 0 3px grey,
  //   0.5px -0.5px 0 12px #00000069,
  //   0 0 0 12px #6f5454,
  //   0 0 0 13.5px #0000004a,
  //   0 0 0 15px grey,
  //   -13px 13px 10px 10px #0000004a;
  //   display: flex;
  //   align-items: center;
  //   margin: 20px;
  //   padding: 10px;
  //   height: 100px;
  //   border-radius: 10px;
  //   justify-content: space-evenly;
  //   background-image: radial-gradient( circle at center, #595755 0.06rem, #000000 0.06rem );
  //   background-size: 0.21rem 0.25rem;
`;

const CountdownContainer = styled.div`
  background: url(/textures/paper.png);
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 50px;
  margin-inline: 20px;
  padding: 56px;
  height: 30vh;
  border-radius: 10px;
  justify-content: space-around;
`

const GameLobby: React.FC<{}> = () => {
  const { isAuthenticated, user } = useAuth0();
  const { games, users, ready } = useContext(SocketContext).SocketState;
  const { Redirect, UpdateGameStatus, AddGameStart } = useContext(SocketContext);
  const [showLobby, setShowLobby] = useState(false);
  const [bountyName, setBountyName] = useState<string | null>(null)
  const [hasReadyErrors, setHasReadyErrors] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // checks to see if the user should be redirected if the game doesn't exist
  // const location = useLocation();
  // const currentEndpoint = location.pathname;
  // useEffect(() => {
  //   Redirect(currentEndpoint);
  // }, [games]);

  //Determine who can see the controls and who can't
  useEffect(() => {
    (games.length > 0 && games[0].host === user?.sub)
      ? setShowControls(true)
      : setShowControls(false);
  }, [games]);

  //See if things are still loading
  useEffect(() => {
    if (games.length > 0 && users.length > 0) {
      setShowLobby(true);
    } else {
      setShowLobby(false);
    }
  }, [games, users]);

  //starts the countdown to enter the game
  // useEffect(() => {
  //   //decreases the countdown by one every second
  //   let timeoutId
  //   if (bountyName && countdown > 0) {
  //     timeoutId = setTimeout(() => setCountdown(countdown => countdown - 1), 1000);
  //   }
  //   // once the countdown reaches 0, navigate all players in lobby to game
  //   if (!countdown) {
  //     UpdateGameStatus(user, 'ongoing');
  //     AddGameStart(Date.now(), user);
  //   }
  //   return () => clearTimeout(timeoutId);
  // }, [bountyName, countdown])

  useEffect(() => {
    if (bountyName) {
      AddGameStart(Date.now(), user);
      UpdateGameStatus(user, 'ongoing');
    }

  }, [bountyName])

  if (!isAuthenticated) {
    return null
  }

  if (!showLobby) {
    return <PageLoader />
  }

  if (bountyName) {
    return (
      <Container>
        <Header page='Lobby' />
        <Main>
          <CountdownContainer>
            <h1>{countdown}</h1>
            <h2>{bountyName} is being Hunted</h2>
          </CountdownContainer>
        </Main>
      </Container>
    )
  }

  return (
    <Container>
      <Header page='Lobby' />
      <Main>
        <ControlsContainer>
          {showControls ? (
            <>
              <WhosHunting setBountyName={setBountyName} />
              <TimerInput />
              {games[0].hunted.length > 0 && !hasReadyErrors && games[0].timeConstraints && <ButtonToGame />}
            </>
          ) : (
            <>
              <button>Waiting on Host</button>
              <h2>{games[0].timeConstraints}:00</h2>
            </>
          )
          }
        </ControlsContainer>
        <PlayersContainer>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Liscenced Hunters • {users.length}</h1>
          <UserListItem player={users[0]} />
          <UsersList users={users.slice(1)} />
        </PlayersContainer>
        <br />
      </Main>
    </Container>
  );
};

export default GameLobby;
