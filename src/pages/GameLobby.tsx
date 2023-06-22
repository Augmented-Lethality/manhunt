import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'

const GameLobby: React.FunctionComponent = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const { socket, uid, games, users, names } = useContext(SocketContext).SocketState;
  const [showHunting, setShowHunting] = useState(false);
  const [currentGame, setCurrentGame] = useState<{gameId: string, uidList: string[], hunted: string }>({gameId: '', uidList: [], hunted: ''});
  const [host, setHost] = useState<string>('');


  // this is so time complex, will need to edit socket emits on server side when I have time
  // I HATE IT
  useEffect(() => {
    const currGame = Object.values(games).find((game) =>
    game.uidList.includes(uid)
    );

    if(currGame) {
      setCurrentGame(currGame);

      if(currGame.hunted.length > 0) {
        setShowHunting(true);
      }
    }

    setHost(currentGame?.uidList[0]);

  }, [games])

  if(!isAuthenticated ){
    return null;
  }

  return (
    <Container>
      <Header>
        <h2>Game Lobby</h2>
        <ButtonToHome />
      </Header>
      <Main>
        {currentGame ? (
          <div>
            {showHunting && <WhosHunting users={currentGame.uidList} host={ host } hunted={ currentGame.hunted }/>}
            {host === uid && !showHunting && (
              <button onClick={() => setShowHunting(!showHunting)}>
                Pick the Victim
              </button>
            )}
            <p>Players:</p>
            <ul>
              {currentGame.uidList.map((playerUid) => (
                <li key={playerUid}>{names[playerUid]}</li>
              ))}
            </ul>
          </div>
        ) : (
          <>
          </>
        )}
        { showHunting && <ButtonToGame />}
      </Main>
      
    </Container>
  );
};

export default GameLobby;
