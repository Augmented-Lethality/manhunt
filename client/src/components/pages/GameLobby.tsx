import React, { useContext, useEffect, } from 'react';
import { useNavigate } from 'react-router';
// import { useAuth0 } from "@auth0/auth0-react";

import SocketContext from '../../contexts/Socket/SocketContext';

import { ButtonToHome, ButtonToGame } from '../Buttons';

export type IGameLobbyProps = {};

const GameLobby: React.FunctionComponent<IGameLobbyProps> = (props) => {
  const { socket, uid, users, games } = useContext(SocketContext).SocketState;
  // const { user, isAuthenticated } = useAuth0();

    // if user is part of a game
    const userGame = Object.values(games).find((game) =>
    game.uidList.includes(uid)
    );

    // host
    const host = userGame ? userGame.uidList[0] : null;


  return (
    <div>
      <h2>Game Lobby</h2>
      <p>
        Your Socket User ID: <strong>{uid}</strong><br />
        Total Users Active on App: <strong>{users.length}</strong><br />
        Your Socket ID: <strong>{socket?.id}</strong><br />
      </p>
      {userGame ? (
  <div>
    <h3>Game Lobby for Game {userGame.gameId}</h3>
    <p>Players in this game:</p>
    <ul>
      {userGame.uidList.map((playerUid) => (
        <li key={playerUid}>{playerUid}</li>
      ))}
    </ul>
  </div>
) : (
      <>
      </>
)}

{uid === host && <ButtonToGame />}
<ButtonToHome />
    </div>
  );
};

export default GameLobby;
