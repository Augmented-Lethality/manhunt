import React, { useContext } from 'react';

import SocketContext from '../../contexts/Socket/SocketContext';

import { ButtonToHome, ButtonToGame } from '../Buttons';

export interface IGameLobbyProps {};

const GameLobby: React.FunctionComponent<IGameLobbyProps> = (props) => {

  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <div>
      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{ uid }</strong><br />
        Users Online: <strong>{ users.length }</strong><br />
        Socket ID: <strong>{ socket?.id }</strong><br />
      </p>
      <ButtonToGame /><br />
      <ButtonToHome />
    </div>
  )
};

export default GameLobby;
