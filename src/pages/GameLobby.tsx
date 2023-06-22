import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
// import { useAuth0 } from "@auth0/auth0-react";

import { PlayerListItem } from '../components/GameLobby/PlayerListItem';

const GameLobby: React.FunctionComponent = (props) => {

  const { games, users } = useContext(SocketContext).SocketState;
  // const [showHunting, setShowHunting] = useState(false);
  // const [currentGame, setCurrentGame] = useState<{ gameId: string, authIdList: string[], hunted: string }>({ gameId: '', authIdList: [], hunted: '' });
  // const [host, setHost] = useState<string>('');

  const [hunted, setHunted] = useState<string>('');
  const [huntedName, setHuntedName] = useState<string>('');

  useEffect(() => {
    console.log("games state should be one game:", games, "users state should be only users in that one game", users)
  }, [games])

  useEffect(() => {

  }, [hunted])

  // HUNTED IS NOT SET UP
  return (
    <div>
      {users.length > 0 ? (
        <>
          <strong>Players in Lobby:</strong>
          {hunted.length > 0 ? (<div>Player {hunted}, You're Being Hunted</div>) : (<WhosHunting players={games} setHunted={setHunted} />)}
          <br />
          <br />
          {users.map((player) => (
            <PlayerListItem key={player.id} player={player} />
          ))}
        </>
      ) : (
        <p>No Players</p>
      )}
      <ButtonToHome />
      <ButtonToGame />
    </div>
  );
};

export default GameLobby;
