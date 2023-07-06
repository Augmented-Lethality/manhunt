import React, { useEffect, useContext } from 'react';
import { Game, } from '../../contexts/Socket/SocketContext';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { useAuth0 } from '@auth0/auth0-react';

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 10px;
  margin-inline: 20px;
  background-color: #1a1b22;
  padding: 56px;
  border-radius: 10px;
  justify-content: space-around;
  border: 2px solid #e6a733;
  border-width: thick;
`;

export const GameListItem: React.FC<{ game: Game }> = ({ game }) => {

  const { JoinGame } = useContext(SocketContext);
  const { users } = useContext(SocketContext).SocketState;

  const { user } = useAuth0();


  const navigate = useNavigate();

  const handleJoinGame = async (host: string, user: any) => {
    JoinGame(host, user);
    navigate('/lobby');
  };

  useEffect(() => {
    // console.log('game host', game.host)
  }, [users])
  return (
    <GameContainer>
      <div onClick={() => handleJoinGame(game.host, user)}>
        <h3>{game.hostName}</h3>
        <br />
        <h4>{game.users.length} Hunter{game.users.length !== 1 ? 's' : ''} in Lobby</h4>
      </div>

    </GameContainer>
  );

};