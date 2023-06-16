import React, { useContext, useEffect } from 'react';
// import { useAuth0 } from "@auth0/auth0-react";

import SocketContext from '../../contexts/Socket/SocketContext';

import { ButtonToHome, ButtonToGame } from '../Buttons';

export interface IGameLobbyProps {};

// THIS IS CURRENTLY SHOWING ALL USERS ONLINE, NOT ONLY THE ONES WITHIN IN THE LOBBY

const GameLobby: React.FunctionComponent<IGameLobbyProps> = (props) => {
  const { socket, uid, users, games } = useContext(SocketContext).SocketState;
  // const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <h2>Game Lobby</h2>
      <p>
        Your Socket User ID: <strong>{uid}</strong><br />
        Total Users Active on App: <strong>{users.length}</strong><br />
        Your Socket ID: <strong>{socket?.id}</strong><br />
      </p>

      <ButtonToGame /><br />
      <ButtonToHome />
    </div>
  );
};

export default GameLobby;
