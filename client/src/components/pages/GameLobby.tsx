import React, { useContext, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import SocketContext from '../../contexts/Socket/SocketContext';
import ButtonCreateRoom from '../ButtonCreateRoom';


import { ButtonToHome, ButtonToGame } from '../Buttons';

export interface IGameLobbyProps {};

const GameLobby: React.FunctionComponent<IGameLobbyProps> = (props) => {
  const { socket, uid, users, games } = useContext(SocketContext).SocketState;
  const { user, isAuthenticated } = useAuth0();

  console.log(Object.values(games));

  return (
    <div>
      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{uid}</strong><br />
        Users Online: <strong>{users.length}</strong><br />
        Socket ID: <strong>{socket?.id}</strong><br />
        Your user AuthToken: <strong>{user?.sub}</strong><br />
        <ButtonCreateRoom />
      </p>
      {Object.keys(games).length > 0 && (
          <>
            <strong>The Games:</strong>
            <ul>
              {Object.keys(games).map((host) => (
                <li key={host}>
                  Game ID: {games[host].gameId}, Host: {host}, Users: {games[host].uidList.join(', ')}
                </li>
              ))}
            </ul>
          </>
        )}

      <ButtonToGame /><br />
      <ButtonToHome />
    </div>
  );
};

export default GameLobby;
