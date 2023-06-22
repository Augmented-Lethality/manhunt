import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
import { useAuth0 } from "@auth0/auth0-react";

const GameLobby: React.FunctionComponent = (props) => {

  const { socket, games, users, names } = useContext(SocketContext).SocketState;
  const [showHunting, setShowHunting] = useState(false);
  const [currentGame, setCurrentGame] = useState<{ gameId: string, authIdList: string[], hunted: string }>({ gameId: '', authIdList: [], hunted: '' });
  const [host, setHost] = useState<string>('');


  // this is so time complex, will need to edit socket emits on server side when I have time
  // I HATE IT
  useEffect(() => {
    console.log(games)
  }, [games])


  return (
    <div>
      <h2>Game Lobby</h2>
      {/* <ButtonToHome />
      <h2>Game Lobby</h2>
      {currentGame ? (
        <div>
          {showHunting && <WhosHunting users={currentGame.authIdList} host={host} hunted={currentGame.hunted} />}
          {host === authId && !showHunting && (
            <button onClick={() => setShowHunting(!showHunting)}>
              Pick the Victim
            </button>
          )}
          <p>Players:</p>
          <ul>
            {currentGame.authIdList.map((playerAuthId) => (
              <li key={playerAuthId}>{names[playerAuthId]}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
        </>
      )}
      {showHunting && <ButtonToGame />} */}
    </div>
  );
};

export default GameLobby;
