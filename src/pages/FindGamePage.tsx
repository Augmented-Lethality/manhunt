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
  height: 216px;
  width: 369px;
  margin-top: 47px;
  margin-inline: auto;
  border-radius: 37px;
  color: #eee9d5d9;
  padding: 56px;
  font-family: lobster;
  text-shadow: -2px -2px 0 #000, 2px -1px 0 #000, -2px 2px 0 #000, 1px 1px 0 #000;
  background-size: cover;
  background-image: url(https://d3d9qwhf4u1hj.cloudfront.net/images/find-a-contract.png);
  font-size: 2.7rem;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(5deg);
`
const HomeSign = styled.div<{ onClick: () => void }>`
  height: 208px;
  width: 284px;
  margin-top: 47px;
  margin-inline: auto;
  border-radius: 37px;
  color: #eee9d5d9;
  padding: 45px;
  font-family: lobster;
  text-shadow: -2px -2px 0 #000, 2px -1px 0 #000, -2px 2px 0 #000, 1px 1px 0 #000;
  background-size: cover;
  background-image: url(https://d3d9qwhf4u1hj.cloudfront.net/images/find-game-button.png);
  font-size: 3rem;
  text-align: center;
  box-sizing: border-box;
  background-position: center;

  display: flex;
  justify-content: center;
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
                <HomeSign onClick={() => navigate('/home')}>
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
