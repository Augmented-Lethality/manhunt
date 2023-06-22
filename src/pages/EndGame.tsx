import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ButtonToHome, ButtonToHostGame } from '../components/Buttons';
import { Container } from '../styles/Container';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <Container>
      <h1 style={{ color: '#6e6b8c' }}>WOW { user?.given_name } WON</h1>
        <br />
        <br />
        <ButtonToHome />
        <ButtonToHostGame />
      </Container>
  );
};

export default HomePage;
