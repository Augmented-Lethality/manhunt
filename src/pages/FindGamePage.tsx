import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { GameListItem } from '../components/GameLobby/GameListItem';
import styled from 'styled-components';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { useAuth0 } from '@auth0/auth0-react';

import PhoneLoader from '../components/Loaders/PhoneLoader';
import { useNavigate } from 'react-router-dom';

const NoContracts = styled.div`
  height: 134px;
  width: 291px;
  margin-top: 47px;
  margin-inline: auto;
  border-radius: 33px;
  color: white;
  font-family: lobster;
  text-shadow: -2px -2px 0 #000, 2px -1px 0 #000, -2px 2px 0 #000, 1px 1px 0 #000;
  background-size: cover;
  background-position: center;
  border: solid black;
  background-image: url(https://manhuntar.s3.amazonaws.com/images/find-a-contract.png);
  background-color: #eba134;
  font-size: 2.7rem;
  justify-content: center;
  display: flex;
  align-items: center;
  transform: rotate(5deg);
`
const HomeSign = styled.div<{ onClick: () => void }>`
  height: 208px;
  width: 285px;
  margin-top: 47px;
  margin-inline: auto;
  border-radius: 57px;
  color: white;
  font-family: lobster;
  text-shadow: -2px -2px 0 #000, 2px -1px 0 #000, -2px 2px 0 #000, 1px 1px 0 #000;
  background-size: cover;
  background-position: center;
  border: solid black;
  background-image: url(https://d3d9qwhf4u1hj.cloudfront.net/images/find-a-game.png);
  background-color: #9c2e1e;
  font-size: 3rem;
  justify-content: center;
  display: flex;
  align-items: center;
`

const FindGamePage: React.FC = () => {
  const { games, users, player } = useContext(SocketContext).SocketState;
  const { user } = useAuth0();
  const { LeaveGame } = useContext(SocketContext);
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);

  useEffect(() => {
  }, [users, games]);

  const handleHome = () => {
    LeaveGame(user);
    navigate('/home');
  }

  return (
    <>
      <Header page={'Contracts'} users={users} />
      <Main>
        {joining ? (
          <PhoneLoader />
        ) : (
          <>
            {games.length > 0 ? (
              games.map((game) => {
                if (game.host === player.authId) {
                  LeaveGame(user);
                  return null;
                }
                return <GameListItem key={game.gameId} game={game} setJoining={setJoining} />
              })
            ) : (
              <>
                <NoContracts>
                  No Contracts!
                </NoContracts>
                <HomeSign onClick={handleHome}>
                  Back Home
                </HomeSign>
              </>
            )}
          </>
        )}
      </Main>
    </>
  );
}

export default FindGamePage;
