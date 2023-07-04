import React, { useContext, useEffect } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { GameListItem } from '../components/GameLobby/GameListItem';
import { GameContainer } from '../components/GameLobby/GameListItem';

import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { Container } from '../styles/Container';

const FindGamePage: React.FC = () => {
  const { games, users } = useContext(SocketContext).SocketState;

  useEffect(() => {
  }, [users, games]);


  return (
    <Container>
      <Header page={'Contracts'} users={users} />
      <Main>
        {/* <h3 style={{ textAlign: 'center', marginTop: '10px' }}>{users?.length - 1} Hunter{users?.length - 1 !== 1 ? 's' : ''} Prepared for Slaughter</h3> */}
        {
          Object.keys(games).length > 0 ? (
            <>
              {games.map((game) => (
                <GameListItem key={game.gameId} game={game} />
              ))}
            </>
          ) : (
            <GameContainer>
              <h2>No Bounties Have Been Posted</h2>
            </GameContainer>
          )
        }

      </Main>
    </Container>
  );
}

export default FindGamePage;
