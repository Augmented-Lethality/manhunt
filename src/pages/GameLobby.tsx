import React, { useContext, useEffect, } from 'react';
// import { useAuth0 } from "@auth0/auth0-react";

import SocketContext from '../contexts/Socket/SocketContext';

import { ButtonToHome, ButtonToGame } from '../components/Buttons';

export type IGameLobbyProps = {};

const GameLobby: React.FunctionComponent<IGameLobbyProps> = (props) => {
  const { socket, uid, users, games } = useContext(SocketContext).SocketState;
  const { Redirect } = useContext(SocketContext)
  // const { user, isAuthenticated } = useAuth0();

    // if user is part of a game
    const userGame = Object.values(games).find((game) =>
    game.uidList.includes(uid)
    );

    // host
    const host = userGame?.uidList[0];

    const handleClick = () => {
      if(host) {
        Redirect(host, '/onthehunt');
      } else {
        console.error('no host right now :(');
      }
    };


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
{/* <button onClick={handleClick}>Game Time</button> */}
<ButtonToGame />
<ButtonToHome />
    </div>
  );
};

export default GameLobby;
