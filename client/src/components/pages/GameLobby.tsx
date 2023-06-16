import React, { useContext, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import SocketContext from '../../contexts/Socket/SocketContext';
import ButtonToHome from '../components/buttons/ButtontoHome';
import ButtonToGame from '../components/buttons/ButtontoGame';
import ButtonCreateRoom from '../components/ButtonCreateRoom';

export interface IGameLobbyProps {};

const GameLobby: React.FunctionComponent<IGameLobbyProps> = (props) => {
  const { socket, uid, users, games } = useContext(SocketContext).SocketState;
  const { user, isAuthenticated } = useAuth0();

  console.log(games);

  return (
    <div>
      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{uid}</strong><br />
        Users Online: <strong>{users.length}</strong><br />
        Socket ID: <strong>{socket?.id}</strong><br />
        Your user AuthToken: <strong>{user?.sub}</strong><br />
        <ButtonCreateRoom />
            <strong>The Games:</strong>
      </p>
      <ButtonToGame /><br />
      <ButtonToHome />
    </div>
  );
};

export default GameLobby;
