import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SocketContext, { User } from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import UserListItem from '../components/UserListItem';
import UsersList from '../components/UsersList';
import { useAuth0 } from '@auth0/auth0-react';
// import PageLoader from '../components/Loading';
import PhoneLoader from '../components/Loaders/PhoneLoader';
import styled from 'styled-components';

import InfoPopup from '../components/Popups/InfoPopup';

const Image = styled.div<{ isHost: boolean }>`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 1rem;
  padding-bottom: 0;
  height: 144vw;
  width: 100%;
  box-sizing: border-box;
  background-image:
    ${props => props.isHost
    ? 'url(/textures/lobby-host.png)'
    : 'url(/textures/lobby-guest.png)'};
  background-size: contain;
  background-repeat: no-repeat;
`;

const MinusButton = styled.div`
  position: absolute;
  bottom: 92vw;
  left: 39vw;
  height: 9vw;
  width: 9vw;
  // border: 2px solid blue;
`;

const PlusButton = styled.div`
  position: absolute;
  bottom: 93vw;
  left: 78vw;
  height: 8vw;
  width: 7vw;
  // border: 2px solid red;
`;

const PlayButton = styled.div`
  position: absolute;
  bottom: 101vw;
  left: 49vw;
  height: 27vw;
  width: 29vw;
  // border: 2px solid green;
`;
const BackButton = styled.div`
  position: absolute;
  bottom: 87vw;
  left: 5vw;
  height: 48vw;
  width: 22vw;
  font-family: lobster;
  color: white;
  padding-top: 10vw;
  text-shadow: -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000;
  font-size: 2rem;
  transform: rotate(358deg);
  // border: 2px solid pink;
`;

const PlayersContainer = styled.div`
  position: absolute;
  bottom: 16vw;
  left: 15vw;
  height: 57vw;
  width: 70vw;
  // border: 2px solid cyan;
`;
const TimeContainer = styled.div`
  position: absolute;
  bottom: 95vw;
  left: 49vw;
  height: 6vw;
  width: 26vw;
  display: flex;
  justify-content: center;
  color: #009f40;
  font-size: 1.2rem;
  // border: 2px solid yellow;
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
    height: calc(100vw * 1.8);
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
  const { Redirect,
    UpdateGameStatus,
    AddGameStart,
    AddGameDuration,
    SetHunted
  } = useContext(SocketContext);
  const { isAuthenticated, user } = useAuth0();
  const { games, users, ready } = useContext(SocketContext).SocketState;
  const [showLobby, setShowLobby] = useState(false);
  const [bountyName, setBountyName] = useState<string | null>(null)
  const [hasReadyErrors, setHasReadyErrors] = useState(false);
  const [isHost, setisHost] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [selected, setSelected] = useState('03:00');
  const listRef = useRef<HTMLUListElement>(null);
  const scrollValues = ['01', '02', '03', '04', '05', '07', '10', '15', '20', '30', '45', '60'];
  const selectedIndex = scrollValues.indexOf(selected.split(':')[0]);
  const navigate = useNavigate();

  // if any of the ready objects don't have a value of 'ok', can't start the game
  // useEffect(() => {
  //   const hasErrors = Object.values(ready).some((errors: string[]) => !errors.includes('ok'));
  //   setHasReadyErrors(hasErrors);
  // }, [ready]);

  //Send the selected time to the socket instance
  useEffect(() => {
    AddGameDuration(Number(selected.slice(0, 2)), user);
  }, [selected])

  // checks to see if the user should be redirected if the game doesn't exist
  // const location = useLocation();
  // const currentEndpoint = location.pathname;
  // useEffect(() => {
  //   Redirect(currentEndpoint);
  // }, [games]);

  //Determine who is the Host
  useEffect(() => {
    (games.length > 0 && games[0].host === user?.sub)
      ? setisHost(true)
      : setisHost(false);
  }, [games]);

  //See if things are still loading
  useEffect(() => {
    if (games.length && games.length < 2 && users.length > 0) {
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

  //Chose a random victim from the players and send to Socket
  const pickVictim = (users: User[], SetHunted: (user: User) => void) => {
    const bounty = users[Math.floor(Math.random() * users.length)];
    //Set the socket context to include the bounty
    SetHunted(bounty);
    //Grab the bounty's username to display to the players
    const matchingUser = users.filter(player => player.authId === bounty.authId).at(0)?.username || null;
    setBountyName(matchingUser)
  };

  useEffect(() => {
    if (bountyName) {
      AddGameStart(Date.now(), user);
      UpdateGameStatus(user, 'ongoing');
    }

  }, [bountyName])

  //Allow clicking the arrows to change the time
  const handleArrowClick = (direction: 'plus' | 'minus') => {
    if (direction === 'minus' && selectedIndex > 0) {
      setSelected(`${scrollValues[selectedIndex - 1]}:00`);
    } else if (direction === 'plus' && selectedIndex < scrollValues.length - 1) {
      setSelected(`${scrollValues[selectedIndex + 1]}:00`);
    }
  };


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

  const hostInfoMessage = 'Use the knobs to change the game duration. Click the play button when you\'re ready to start.'
  const playersInfoMessage = 'Be patient and wait for the host to start the game.'

  return (
    <Container>
      <Header page='Lobby' />
      <Main>
        <Image isHost={isHost} />
        {isHost &&
          <>
            <PlayButton onClick={() => pickVictim(users, SetHunted)} />
            <MinusButton onClick={() => handleArrowClick('minus')} />
            <PlusButton onClick={() => handleArrowClick('plus')} />
            <InfoPopup message={hostInfoMessage} />
          </>
        }
        <BackButton onClick={() => navigate('/home')}>Back</BackButton>
        <TimeContainer>{selected}</TimeContainer>
        <PlayersContainer>
          <h2 className='digital-h1'>Hunters • {users.length}</h2>
          <UserListItem player={users[0]} />
          <UsersList users={users.slice(1)} />
        </PlayersContainer>
        {!isHost && <InfoPopup message={playersInfoMessage} />}
      </Main>
    </Container>
  );
};

export default GameLobby;
