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
// import PageLoader from '../components/Loading';
import PhoneLoader from '../components/Loaders/PhoneLoader';
import styled from 'styled-components';
import { ButtonToGame } from '../styles/Buttons';
import TimerInput from '../components/GameLobby/TimerInput';

const PlayersContainer = styled.div`
  width: 60%;
  margin: 24px;
  margin-inline: auto;
  padding: 20px;
  margin-bottom: 0;
  flex-grow: 1;
`;
const ControlsBorder = styled.div`
  position: relative;
  display: flex;
  align-items: end;
  margin: 50px;
  border-radius: 25px 25px 5px 5px;
  height: 150px;
  background-image: radial-gradient(circle at center, #433222 0.06rem, #17140d 0.06rem);
  background-size: 0.21rem 0.25rem;
  box-shadow: -5px 15px 80px 10px #000000f0, 0px 0px 0 10px #000000, 0 0 0 16px #2eb694, 0 0 0 17px #449086, 0 0 0 20px #1bc3ad, 0 0 0 30px #48d4b9, 0px -2px 0px 32px #76deca;
`

  const ControlsContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 20px;
    height: 55%;
    width: 80%;
    margin-inline: auto;
    /* margin-bottom: -2px; */
    border-radius: 30px;
    background-image: radial-gradient(circle at center, #9a9b98 0.1rem, #a8a884 0.1rem);
    box-shadow: -3px 5px 7px 3px #00000069, 0 0 0 2px white;
    background-size: 0.15rem 0.25rem;
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
    return <PhoneLoader />
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
        <ControlsBorder>
          <ControlsContainer>
            {showControls ? (
              <>
                <WhosHunting setBountyName={setBountyName} />
                <TimerInput />
                {games[0].hunted.length > 0 && !hasReadyErrors && games[0].timeConstraints && <ButtonToGame />}
              </>
            ) : (
              <>
              <button className='metal-button'></button>
                <div style={{
                  padding: '12px',
                  margin: '-42px, -13px, -44px',
                  borderRadius: '26px'}}
                  className='digital'
                >
                  <h5 style={{fontSize:'1.4rem'}}>Waiting on Host</h5>
                  <h4>{games[0].timeConstraints}:00</h4>
                  </div>
                </>
            )
            }
          </ControlsContainer>
        </ControlsBorder>
        <PlayersContainer
          style={{borderRadius:'12px 12px 0px 0px'}}
          className="digital digital-container">
          <h1 className='digital-h1'>Hunters • {users.length}</h1>
          <UserListItem player={users[0]} />
          <UsersList users={users.slice(1)} />
        </PlayersContainer>
        <br />
      </Main>
    </Container>
  );
};

export default GameLobby;
