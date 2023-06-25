import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome, ButtonToGame } from '../components/Buttons';
import WhosHunting from '../components/WhosHunting';
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';

const GameLobby: React.FunctionComponent = () => {

  const navigate = useNavigate();

  const { user } = useAuth0();

  const { LeaveGame } = useContext(SocketContext);
  const { games, users } = useContext(SocketContext).SocketState;

  useEffect(() => {
  }, [games, users])

  const handleLeaveGame = () => {
    LeaveGame(user);
    navigate('/home');
  }


  return (
    <Container>
      <Header page='Lobby'/>
      <Main>
        {users.length > 0 ? (
          <>
            <WhosHunting />
            <strong>Players in Lobby:</strong>
            <br />
            <br />
            {users.map((player) => (
              <PlayerListItem key={player.id} player={player} />
            ))}
          </>
        ) : (
          <p>No Players</p>
        )}
        <ButtonToGame />
      </Main>
    </Container>
  );
};

export default GameLobby;
