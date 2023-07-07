import React, { useEffect, useContext } from 'react';
import { Game, } from '../../contexts/Socket/SocketContext';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { useAuth0 } from '@auth0/auth0-react';

export const GameContainer = styled.div`
  height: 159px;
  width: 321px;
  margin-top: 50px;
  margin-inline: auto;
  border-radius: 27px;
  border: none;
  color: white;
  padding-top: 53px;
  font-family: inherit;
  text-shadow: -2px -2px 0 #000, 2px -1px 0 #000, -2px 2px 0 #000, 1px 1px 0 #000;
  background-size: cover;
  background-position: center;
  background-image: url(/textures/find-a-contract.png);
  font-size: 1rem;
  text-align: center;
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
      <div style={{fontSize: '1.5rem'}} onClick={() => handleJoinGame(game.host, user)}>
        <h4>{game.hostName}</h4>
        <h4>{game.users.length} Hunter{game.users.length !== 1 ? 's' : ''} in Lobby</h4>
      </div>

    </GameContainer>
  );

};