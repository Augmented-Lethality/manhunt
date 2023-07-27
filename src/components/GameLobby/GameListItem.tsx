import React, { useEffect, useContext } from 'react';
import { Game, } from '../../contexts/Socket/SocketContext';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { useAuth0 } from '@auth0/auth0-react';

export const GameContainer = styled.div`
  height: 134px;
  width: 291px;
  margin-top: 47px;
  margin-inline: auto;
  border-radius: 33px;
  color: white;
  font-family: lobster;
  text-shadow: -2px -2px 0 #000, 2px -1px 0 #000, -2px 2px 0 #000, 1px 1px 0 #000;
  background-size: cover;
  background-position: center;
  border: solid black;
  background-image: url(https://d3d9qwhf4u1hj.cloudfront.net/images/find-contract.png);
  background-color: #eba134;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const GameListItem: React.FC<{ game: Game, setJoining: (joining: boolean) => void }> = ({ game, setJoining }) => {

  const { JoinGame } = useContext(SocketContext);
  const { users } = useContext(SocketContext).SocketState;

  const { user } = useAuth0();

  const navigate = useNavigate();

  const handleJoinGame = async (host: string, user: any) => {
    JoinGame(host, user);
    setJoining(true);
  };

  useEffect(() => {
  }, [users])

  return (
    <GameContainer>
      {game.status !== 'lobby' ? (
        <>
          <div>{game.hostName}</div>
          <h4 style={{ fontFamily: 'monospace' }}>In Progress, Can't Join</h4>
        </>
      ) : (
        <div onClick={() => handleJoinGame(game.host, user)}>
          <div>{game.hostName}</div>
          <h4 style={{ fontFamily: 'monospace' }}>{game.users.length} Hunter{game.users.length !== 1 ? 's' : ''} in Lobby</h4>
        </div>
      )}
    </GameContainer>
  );

};