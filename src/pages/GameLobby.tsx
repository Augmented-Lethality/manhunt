import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext, { User } from '../contexts/Socket/SocketContext';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import UserListItem from '../components/UserListItem';
import UsersList from '../components/UsersList';
import { useAuth0 } from '@auth0/auth0-react';
import PhoneLoader from '../components/Loaders/PhoneLoader';
import styled from 'styled-components';

import InfoPopup from '../components/Popups/InfoPopup';

const Image = styled.div<{ ishost: string }>`
  position: absolute;
  left: 50%;
  bottom: 0vw;
  transform: translateX(-50%);
  padding: 1rem;
  padding-bottom: 0;
  height: 176vw;
  width: 100%;
  box-sizing: border-box;
  background-image:
    ${props => props.ishost
    ? 'url("https://d3d9qwhf4u1hj.cloudfront.net/images/lobby-host.png")'
    : 'url("https://d3d9qwhf4u1hj.cloudfront.net/images/lobby-guest.png")'};
  background-size: contain;
  background-repeat: no-repeat;
  @media (min-aspect-ratio: 334/700) {
    background-position: center 100px;
  }
`;

const MinusButton = styled.div`
  position: absolute;
  bottom: 131vw;
  left: 41vw;
  height: 13vw;
  width: 12vw;
  // border: 2px solid blue;
  @media (min-aspect-ratio: 334/700) {
    bottom: calc(131vw - 100px);
  }
`;

const PlusButton = styled.div`
  position: absolute;
  bottom: 130vw;
  left: 83vw;
  width: 13vw;
  height: 14vw;
  // border: 2px solid red;
  @media (min-aspect-ratio: 334/700) {
    bottom: calc(130vw - 100px);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  bottom: 140vw;
  left: 58vw;
  height: 22vw;
  width: 21vw;
  // border: 2px solid green;
  @media (min-aspect-ratio: 334/700) {
    bottom: calc(140vw - 100px);
  }
`;
const BackButton = styled.div`
  position: absolute;
  bottom: 134vw;
  left: 8vw;
  height: 22vw;
  width: 22vw;
  // border: 2px solid pink;
  @media (min-aspect-ratio: 334/700) {
    bottom: calc(134vw - 100px);
  }
`;

const PlayersContainer = styled.div`
  position: absolute;
  bottom: 54vw;
  left: 15vw;
  height: 57vw;
  width: 70vw;
  overflow: auto;
  // border: 2px solid cyan;
  @media (min-aspect-ratio: 334/700) {
    bottom: calc(54vw - 100px);
  }
`;
const TimeContainer = styled.div`
  position: absolute;
  bottom: 133vw;
  left: 55vw;
  height: 6vw;
  width: 26vw;
  display: flex;
  justify-content: center;
  color: #009f40;
  font-size: 1.2rem;
  // border: 2px solid yellow;
  @media (min-aspect-ratio: 334/700) {
    bottom: calc(133vw - 100px);
  }
`;

const GameLobby: React.FC<{}> = () => {
  const {
    UpdateGameStatus,
    AddGameStart,
    AddGameDuration,
    SetHunted,
    LeaveGame
  } = useContext(SocketContext);
  const { isAuthenticated, user } = useAuth0();
  const { games, users, player } = useContext(SocketContext).SocketState;
  const [bountyName, setBountyName] = useState<string | null>(null)
  const [isHost, setisHost] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [selected, setSelected] = useState('03:00');
  const listRef = useRef<HTMLUListElement>(null);
  const scrollValues = ['01', '02', '03', '04', '05', '07', '10', '15', '20', '30', '45', '60'];
  const selectedIndex = scrollValues.indexOf(selected.split(':')[0]);
  const navigate = useNavigate();

  //Send the selected time to the socket instance
  useEffect(() => {
    AddGameDuration(Number(selected.slice(0, 2)), user);
  }, [selected])

  //Determine who is the Host
  useEffect(() => {
    (games.length > 0 && games[0].host === user?.sub)
      ? setisHost(true)
      : setisHost(false);
  }, [games]);

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


  if (bountyName) {
    return (
      <>
        <Header page='Lobby' />
        <Main>
          <PhoneLoader />
        </Main>
      </>
    )
  }

  const hostInfoMessage = 'Your controls are on that blue radio over to your right.\n\n'
    + 'To change the game duration, use the red knobs.\n\nWhen you\'re ready to start, hit that big play button!\n\n' +
    'Happy Hunting.';
  const playersInfoMessage = 'Be patient and wait for the host to start the game!'

  const handleBackButton = () => {
    LeaveGame(user);
  }

  return (
    <>
      <Header page='Lobby' />
      <Main style={{ height: '100vh' }}>
        <Image ishost={isHost.toString()} />
        {isHost &&
          <>
            <PlayButton onClick={() => pickVictim(users, SetHunted)} />
            <MinusButton onClick={() => handleArrowClick('minus')} />
            <PlusButton onClick={() => handleArrowClick('plus')} />
            <InfoPopup message={hostInfoMessage} />
          </>
        }
        <BackButton onClick={handleBackButton} />
        <TimeContainer>{selected}</TimeContainer>
        <PlayersContainer>
          <h2 className='digital-h1'>Hunters • {users.length}</h2>
          <UserListItem player={users[0]} />
          <UsersList users={users.slice(1)} />
        </PlayersContainer>
        {!isHost && <InfoPopup message={playersInfoMessage} />}
      </Main>
    </>
  );
};

export default GameLobby;
