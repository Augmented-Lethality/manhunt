import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ButtonToFindGame, ButtonToHostGame } from '../components/Buttons';
import SocketContext from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { useFontSize } from '../contexts/FontSize';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { users, player } = useContext(SocketContext).SocketState;
  const { LeaveGame } = useContext(SocketContext);
  const [fontSize, setFontSize] = useFontSize();

  useEffect(() => {
    if (player.largeFont) {
      setFontSize(20);
    }
  }, [player])

  useEffect(() => {
    LeaveGame(user);
  }, [])


  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container>
      <Header page={'Home'} users={users} />
      <Main>
        <ButtonToHostGame />
        <ButtonToFindGame />
      </Main>
    </Container>
  );
};

export default HomePage;
