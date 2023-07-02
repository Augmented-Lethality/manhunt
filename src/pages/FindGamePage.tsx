import React, { useContext, useEffect } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome } from '../components/Buttons';
import { GameListItem } from '../components/GameLobby/GameListItem';

import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { Container } from '../styles/Container';

const FindGamePage: React.FC = () => {
  const { games, users } = useContext(SocketContext).SocketState;

  useEffect(() => {
  }, [users, games]);


  return (
    <Container>
      <Header page={'Contract Board'} users={users} />
      <Main>
        <h3>{users?.length} Hunter{users?.length !== 1 ? 's' : ''} Searching for Contracts</h3>
        {
          Object.keys(games).length > 0 ? (
            <>
              {games.map((game) => (
                <GameListItem key={game.gameId} game={game} />
              ))}
            </>
          ) : (
            <p>No Bounties Have Been Posted</p>
          )
        }

      </Main>
    </Container>
  );
}

export default FindGamePage;
