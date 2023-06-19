import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ButtonToHome, ButtonToHostGame } from '../components/Buttons';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '400px',
        margin: 0
      }}
    >
    <h1 style={{ color: '#6e6b8c' }}>WOW { user?.given_name } WON</h1>
      <br />
      <br />
      <ButtonToHome />
      <ButtonToHostGame />
    </div>
  );
};

export default HomePage;
