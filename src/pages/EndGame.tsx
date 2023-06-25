import React, { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ButtonToHome, ButtonToHostGame } from '../components/Buttons';
import { Container } from '../styles/Container';

import SocketContext from '../contexts/Socket/SocketContext';


const HomePage = () => {
  const { user } = useAuth0();
  const { users, games } = useContext(SocketContext).SocketState;

  if (!games || games.length === 0) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
  }, [games]);


  return (
    <Container>
      <h1 style={{ color: '#6e6b8c' }}>WOW {user?.username} won and this is hardcoded</h1>
      <br />
      <br />
      <ButtonToHome />
      <ButtonToHostGame />
    </Container>
  );
};

export default HomePage;
