import React, { useEffect, useContext } from 'react';
import { Game, } from '../../contexts/Socket/SocketContext';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useNavigate } from 'react-router';

import { useAuth0 } from '@auth0/auth0-react';

export const GameListItem: React.FC<{ game: Game }> = ({ game }) => {

  const { JoinGame } = useContext(SocketContext);
  const { user } = useAuth0();


  const navigate = useNavigate();

  const handleJoinGame = async (host: string, user: any) => {
    JoinGame(host, user);
    navigate('/lobby');
  };

  useEffect(() => {
    console.log(game)
  }, [])
  return (
    <div onClick={() => handleJoinGame(game[0].host, user)}>
      <strong>Host: {game[0].hostName}</strong>
      <br />
      <strong>Number of Players: {game[0].users.length}</strong>
    </div>
  );

};