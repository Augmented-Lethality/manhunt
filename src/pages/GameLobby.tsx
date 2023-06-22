import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
// import WhosHunting from '../components/WhosHunting';
// import { useAuth0 } from "@auth0/auth0-react";

import { PlayerListItem } from '../components/GameLobby/PlayerListItem';

const GameLobby: React.FunctionComponent = (props) => {

  const { games, users } = useContext(SocketContext).SocketState;
  // const [showHunting, setShowHunting] = useState(false);
  // const [currentGame, setCurrentGame] = useState<{ gameId: string, authIdList: string[], hunted: string }>({ gameId: '', authIdList: [], hunted: '' });
  // const [host, setHost] = useState<string>('');

  useEffect(() => {
    console.log("games state should be one game:", games, "users state should be only users in that one game", users)
  }, [games])

  return (
    <div>
      {users.length > 0 ? (
        <>
          <strong>Players in Game:</strong>
          {users.map((player) => (
            <PlayerListItem player={player} />
          ))}
        </>
      ) : (
        <p>No Players</p>
      )}
      <ButtonToHome />
    </div>
  );
};

export default GameLobby;
