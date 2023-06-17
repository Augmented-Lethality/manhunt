import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
// import { useAuth0 } from "@auth0/auth0-react";
// const { user, isAuthenticated } = useAuth0();


const GameLobby: React.FunctionComponent = (props) => {

  const { socket, uid, users, games } = useContext(SocketContext).SocketState;
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
    }

    setHost(currentGame?.uidList[0]);


  }, [games])


  return (
    <div>
      <h2>Game Lobby</h2>
      <p>
        Your Socket User ID: <strong>{uid}</strong>
        <br />
        Total Users Active on App: <strong>{users.length}</strong>
        <br />
        Your Socket ID: <strong>{socket?.id}</strong>
        <br />
      </p>
      {currentGame ? (
        <div>
          <h3>Game Lobby for Game {currentGame.gameId}</h3>
          {showHunting && <WhosHunting users={currentGame.uidList} host={ host }/>}
          {host === uid && !showHunting && (
            <button onClick={() => setShowHunting(!showHunting)}>
              Pick the Victim
            </button>
          )}
          <p>Players in this game:</p>
          <ul>
            {currentGame.uidList.map((playerUid) => (
              <li key={playerUid}>{playerUid}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
        </>
      )}
      <ButtonToGame />
      <ButtonToHome />
    </div>
  );
};

export default GameLobby;
