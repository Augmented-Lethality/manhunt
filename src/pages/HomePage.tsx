import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ButtonToFindGame, ButtonToHostGame } from '../styles/Buttons';
import SocketContext from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { useFontSize } from '../contexts/FontSize';

import { BioDataPopup } from '../components/Popups/BioDataPopup';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { users, player } = useContext(SocketContext).SocketState;
  const { LeaveGame } = useContext(SocketContext);
  const [fontSize, setFontSize] = useFontSize();

  const [showBioPopup, setBioPopUp] = useState(false);

  useEffect(() => {
    if (player.largeFont) {
      setFontSize(20);
    }
    if (!player.facialDescriptions) {
      setBioPopUp(true);
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
        {showBioPopup && <BioDataPopup />}
        <ButtonToHostGame />
        <ButtonToFindGame />
      </Main>
    </Container>
  );
};

export default HomePage;
