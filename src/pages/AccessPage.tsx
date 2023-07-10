import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { useFontSize } from '../contexts/FontSize';

import CameraCheck from '../components/AccessChecks/CameraCheck';
import LocationCheck from '../components/AccessChecks/LocationCheck';
import OrientationCheck from '../components/AccessChecks/OrientationCheck';

const AccessPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const { users, player } = useContext(SocketContext).SocketState;
  const [fontSize, setFontSize] = useFontSize();

  return (
    <Container>
      <Header page={'Access'} users={users} />
      <Main>
        <CameraCheck />
        <LocationCheck />
        <OrientationCheck />
      </Main>
    </Container>
  );
};

export default AccessPage;
