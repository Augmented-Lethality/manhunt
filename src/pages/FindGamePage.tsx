import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
// import GameLobby from './GameLobby';
import axios from 'axios';

import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome } from '../components/Buttons';

import { GameListItem } from '../components/GameLobby/GameListItem';


const FindGamePage: React.FC = () => {

  const { games } = useContext(SocketContext).SocketState;
  const { JoinGame } = useContext(SocketContext);

  const navigate = useNavigate();

  const handleJoinGame = async (host: string) => {
    JoinGame(host);
    navigate('/lobby');
  };

  useEffect(() => {
    console.log(games)
  }, [games])

  return (
    <div>
      {Object.keys(games).length > 0 ? (
        <>
          <strong>Available Games:</strong>
          {games.map((game) => (
            <GameListItem game={game} />
          ))}
        </>
      ) : (
        <p>No game lobbies available</p>
      )}
      <ButtonToHome />
    </div>
  );
}

export default FindGamePage;
